'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import type { Novel } from '@/lib/types';
import { summarizeNovel } from '@/ai/flows/summarize-novel';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, deleteDoc, doc, writeBatch, query, where, getDoc, Timestamp, orderBy } from 'firebase/firestore';

const novelsCollection = collection(db, 'novels');


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

export async function getNovels(): Promise<Novel[]> {
  const q = query(novelsCollection, orderBy('isFeatured', 'desc'), orderBy('releaseDate', 'desc'));
  const snapshot = await getDocs(q);
  const novels: Novel[] = snapshot.docs.map(doc => {
      const data = doc.data();
      const releaseDate = (data.releaseDate as Timestamp).toDate();
      return {
          id: doc.id,
          title: data.title,
          description: data.description,
          quote: data.quote,
          coverImage: data.coverImage,
          pdfUrl: data.pdfUrl,
          releaseDate: format(releaseDate, 'dd MMMM yyyy', { locale: ar }),
          isFeatured: data.isFeatured,
      };
  });
  return novels;
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
    // AI Summarization
    const novels = await getNovels();
    const existingSummaries = novels.map(n => n.description);
    const aiResult = await summarizeNovel({ novelContent, existingSummaries });
    const summary = aiResult.summary;

    const newNovel = {
      title,
      quote,
      description: summary,
      coverImage: 'https://placehold.co/400x600/cccccc/333333',
      pdfUrl: '#',
      releaseDate: Timestamp.fromDate(new Date()),
      isFeatured: false,
    };

    await addDoc(novelsCollection, newNovel);

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
    await deleteDoc(doc(db, 'novels', id));
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
        const batch = writeBatch(db);

        // Unset any other featured novel
        const q = query(novelsCollection, where("isFeatured", "==", true));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((document) => {
            batch.update(document.ref, { isFeatured: false });
        });

        // Set the new featured novel
        const novelRef = doc(db, 'novels', id);
        batch.update(novelRef, { isFeatured: true });
        
        await batch.commit();

        revalidatePath('/admin');
        revalidatePath('/novels');
        revalidatePath('/');
        return { message: 'تم تحديد الرواية كـ "قادمة" بنجاح.' };
    } catch (e) {
        console.error(e);
        return { message: 'فشلت عملية التحديث.' };
    }
}
