'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { novels } from '@/lib/data';
import type { Novel } from '@/lib/types';
import { summarizeNovel } from '@/ai/flows/summarize-novel';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

// In a real app, this would be a database.
// For this demo, we're mutating an in-memory array.
let novelsData: Novel[] = [...novels];

const NovelSchema = z.object({
  title: z.string().min(1, 'العنوان مطلوب'),
  quote: z.string().min(1, 'الاقتباس مطلوب'),
  novelContent: z.string().min(1, 'محتوى الرواية مطلوب للتلخيص'),
});

export type FormState = {
  message: string;
  errors?: {
    title?: string[];
    quote?: string[];
    novelContent?: string[];
  };
};

// Simulate network delay
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getNovels(): Promise<Novel[]> {
  return novelsData;
}

export async function addNovel(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  
  const validatedFields = NovelSchema.safeParse({
    title: formData.get('title'),
    quote: formData.get('quote'),
    novelContent: formData.get('novelContent'),
  });

  if (!validatedFields.success) {
    return {
      message: 'فشلت عملية التحقق من الحقول.',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { title, quote, novelContent } = validatedFields.data;

  try {
    await sleep(1000); // Simulate AI processing time

    // AI Summarization
    const existingSummaries = novelsData.map(n => n.description);
    const aiResult = await summarizeNovel({ novelContent, existingSummaries });
    const summary = aiResult.summary;

    const newNovel: Novel = {
      id: String(Date.now()),
      title,
      quote,
      description: summary,
      coverImage: 'https://placehold.co/400x600/cccccc/333333',
      pdfUrl: '#',
      releaseDate: format(new Date(), 'dd MMMM yyyy', { locale: ar }),
      isFeatured: false,
    };

    novelsData.unshift(newNovel);

    revalidatePath('/admin');
    revalidatePath('/novels');
    revalidatePath('/');

    return { message: `تمت إضافة رواية "${title}" بنجاح.` };
  } catch (e) {
    console.error(e);
    return { message: 'فشلت عملية إضافة الرواية.' };
  }
}

export async function deleteNovel(id: string) {
  try {
    await sleep(500);
    novelsData = novelsData.filter((novel) => novel.id !== id);
    revalidatePath('/admin');
    revalidatePath('/novels');
    revalidatePath('/');
    return { message: 'تم حذف الرواية بنجاح.' };
  } catch (e) {
    console.error(e);
    return { message: 'فشلت عملية الحذف.' };
  }
}


export async function setFeaturedNovel(id: string) {
    try {
        await sleep(500);
        novelsData = novelsData.map(novel => ({
            ...novel,
            isFeatured: novel.id === id
        }));
        revalidatePath('/admin');
        revalidatePath('/');
        return { message: 'تم تحديد الرواية كـ "قادمة" بنجاح.' };
    } catch (e) {
        console.error(e);
        return { message: 'فشلت عملية التحديث.' };
    }
}
