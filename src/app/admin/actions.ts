
'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import type { Novel } from '@/lib/types';
import { summarizeNovel } from '@/ai/flows/summarize-novel';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, deleteDoc, doc, writeBatch, query, where, Timestamp, orderBy, updateDoc } from 'firebase/firestore';

const novelsCollection = collection(db, 'novels');


const NovelSchema = z.object({
  title: z.string().min(1, 'العنوان مطلوب'),
  quote: z.string().min(1, 'الاقتباس مطلوب'),
  novelContent: z.string().optional(), // Becomes optional
});

// Schema for editing, where novelContent is not required for summarization
const EditNovelSchema = z.object({
  title: z.string().min(1, 'العنوان مطلوب'),
  quote: z.string().min(1, 'الاقتباس مطلوب'),
  description: z.string().min(1, 'الوصف مطلوب'),
});


export type FormState = {
  message: string;
  errors?: {
    title?: string[];
    quote?:string[];
    novelContent?: string[];
    description?: string[];
  };
};

export async function getNovels(): Promise<Novel[]> {
  try {
    const q = query(novelsCollection, orderBy('isFeatured', 'desc'), orderBy('releaseDate', 'desc'));
    const snapshot = await getDocs(q);
    if (snapshot.empty) {
      console.log('No novels found in Firestore.');
      return [];
    }
    const novels: Novel[] = snapshot.docs.map(doc => {
        const data = doc.data();
        const releaseDate = (data.releaseDate as Timestamp)?.toDate();
        return {
            id: doc.id,
            title: data.title,
            description: data.description,
            quote: data.quote,
            coverImage: data.coverImage,
            pdfUrl: data.pdfUrl,
            releaseDate: releaseDate ? format(releaseDate, 'dd MMMM yyyy', { locale: ar }) : "غير محدد",
            isFeatured: data.isFeatured === true,
        };
    });
    return novels;
  } catch (error) {
    console.error("Error fetching novels from Firestore:", error);
    // In case of error (e.g., permissions issue), return an empty array
    // to prevent the app from crashing.
    return [];
  }
}

export async function addNovel(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  // Temporarily disabled due to security rules.
  console.log('addNovel function is temporarily disabled.');
  return { message: 'ميزة الإضافة معطلة مؤقتًا.' };
  
  /*
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

  if (!novelContent) {
     return {
      message: 'فشلت عملية التحقق من الحقول.',
      errors: { novelContent: ['محتوى الرواية مطلوب للتلخيص.'] },
    };
  }

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
  } catch (e: any) {
    console.error("Error adding novel:", e);
    return { message: `فشلت عملية إضافة الرواية: ${e.message}` };
  }
  */
}

export async function editNovel(
  id: string,
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
   // Temporarily disabled due to security rules.
  console.log('editNovel function is temporarily disabled.');
  return { message: 'ميزة التعديل معطلة مؤقتًا.' };
  
  /*
  const validatedFields = EditNovelSchema.safeParse({
    title: formData.get('title'),
    quote: formData.get('quote'),
    description: formData.get('description'),
  });

  if (!validatedFields.success) {
    return {
      message: 'فشلت عملية التحقق من الحقول.',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { title, quote, description } = validatedFields.data;

  try {
    const novelRef = doc(db, 'novels', id);
    await updateDoc(novelRef, {
      title,
      quote,
      description,
    });

    revalidatePath('/admin');
    revalidatePath('/novels');
    revalidatePath('/');

    return { message: 'تم تحديث الرواية بنجاح.' };
  } catch (e: any) {
    console.error("Error updating novel:", e);
    return { message: `فشلت عملية تحديث الرواية: ${e.message}` };
  }
  */
}


export async function deleteNovel(id: string) {
  // Temporarily disabled due to security rules.
  console.log('deleteNovel function is temporarily disabled.');
  return { message: 'ميزة الحذف معطلة مؤقتًا.' };
  /*
  try {
    await deleteDoc(doc(db, 'novels', id));
    revalidatePath('/admin');
    revalidatePath('/novels');
    revalidatePath('/');
    return { message: 'تم حذف الرواية بنجاح.' };
  } catch (e: any) {
    console.error("Error deleting novel:", e);
    return { message: `فشلت عملية الحذف: ${e.message}` };
  }
  */
}


export async function setFeaturedNovel(id: string) {
    // Temporarily disabled due to security rules.
    console.log('setFeaturedNovel function is temporarily disabled.');
    return { message: 'ميزة التحديد كقادمة معطلة مؤقتًا.' };
    /*
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
    } catch (e: any) {
        console.error("Error setting featured novel:", e);
        return { message: `فشلت عملية التحديث: ${e.message}` };
    }
    */
}


    