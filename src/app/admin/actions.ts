
'use server';

import { revalidatePath } from 'next/cache';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy, writeBatch } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Novel } from '@/lib/types';
import { z } from 'zod';

const NovelSchema = z.object({
  title: z.string().min(1, 'العنوان مطلوب.'),
  quote: z.string().min(1, 'الاقتباس مطلوب.'),
  description: z.string().optional(),
  novelContent: z.string().optional(),
});

export async function getNovels(): Promise<Novel[]> {
  try {
    const novelsCollection = collection(db, 'novels');
    const q = query(novelsCollection, orderBy('isFeatured', 'desc'), orderBy('releaseDate', 'desc'));
    const novelSnapshot = await getDocs(q);
    const novelsList = novelSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title,
        description: data.description,
        quote: data.quote,
        coverImage: data.coverImage,
        pdfUrl: data.pdfUrl,
        releaseDate: data.releaseDate,
        isFeatured: data.isFeatured,
      };
    }) as Novel[];
    return novelsList;
  } catch (error) {
    console.error("Error fetching novels: ", error);
    // In case of error (e.g., permissions), return an empty array
    // to prevent the app from crashing.
    return [];
  }
}

export type FormState = {
  message: string;
  errors?: {
    title?: string[];
    quote?: string[];
    novelContent?: string[];
    description?: string[];
  };
};

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
      message: 'فشلت عملية التحقق.',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }
  
  const { title, quote } = validatedFields.data;

  try {
    await addDoc(collection(db, 'novels'), {
      title,
      quote,
      description: "سيتم إنشاء الوصف قريبًا...", // Placeholder description
      coverImage: 'https://placehold.co/400x600/a7b7c7/f0f0f0',
      pdfUrl: '#',
      releaseDate: new Date().toISOString().split('T')[0],
      isFeatured: false,
    });

    revalidatePath('/');
    revalidatePath('/novels');
    revalidatePath('/admin');
    return { message: 'تمت إضافة الرواية بنجاح!' };
  } catch (e) {
    console.error(e);
    return { message: 'فشل في إضافة الرواية.' };
  }
}

export async function editNovel(
  id: string,
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const validatedFields = NovelSchema.safeParse({
    title: formData.get('title'),
    quote: formData.get('quote'),
    description: formData.get('description'),
  });

  if (!validatedFields.success) {
    return {
      message: 'فشلت عملية التحقق.',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { title, quote, description } = validatedFields.data;
  const novelRef = doc(db, 'novels', id);

  try {
    await updateDoc(novelRef, {
      title,
      quote,
      description,
    });
    revalidatePath('/');
    revalidatePath('/novels');
    revalidatePath('/admin');
    return { message: 'تم تحديث الرواية بنجاح.' };
  } catch (e) {
    console.error(e);
    return { message: 'فشل في تحديث الرواية.' };
  }
}

export async function deleteNovel(id: string) {
  try {
    await deleteDoc(doc(db, 'novels', id));
    revalidatePath('/');
    revalidatePath('/novels');
    revalidatePath('/admin');
    return { message: 'تم حذف الرواية بنجاح.' };
  } catch (e) {
    console.error(e);
    return { message: 'فشل في حذف الرواية.' };
  }
}

export async function setFeaturedNovel(id: string) {
  const batch = writeBatch(db);
  const novelsRef = collection(db, 'novels');
  
  try {
    // First, un-feature all other novels
    const q = query(novelsRef);
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((document) => {
      if (document.id !== id) {
        batch.update(document.ref, { isFeatured: false });
      }
    });

    // Then, feature the selected novel
    const novelToFeatureRef = doc(db, 'novels', id);
    batch.update(novelToFeatureRef, { isFeatured: true });

    await batch.commit();
    
    revalidatePath('/');
    revalidatePath('/novels');
    revalidatePath('/admin');
    return { message: 'تم تحديد الرواية كقادمة بنجاح.' };
  } catch (e) {
    console.error(e);
    return { message: 'فشل في تحديد الرواية كقادمة.' };
  }
}
