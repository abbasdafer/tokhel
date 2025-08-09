
'use server';

import { revalidatePath } from 'next/cache';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy, writeBatch, Timestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { db, storage } from '@/lib/firebase';
import type { Novel, FileUploadResult } from '@/lib/types';
import { z } from 'zod';
import { summarizeNovel } from '@/ai/flows/summarize-novel';
import { v4 as uuidv4 } from 'uuid';
import { placeholderNovels } from '@/lib/placeholder-data';

const NovelSchema = z.object({
  title: z.string().min(1, 'العنوان مطلوب.'),
  quote: z.string().min(1, 'الاقتباس مطلوب.'),
  description: z.string().optional(),
  novelContent: z.string().optional(),
  pdfFile: z.instanceof(File).refine(file => file.size > 0, 'ملف PDF مطلوب.'),
  coverImage: z.instanceof(File).refine(file => file.size > 0, 'صورة الغلاف مطلوبة.'),
});

const EditNovelSchema = NovelSchema.omit({ pdfFile: true, coverImage: true, novelContent: true }).extend({
    description: z.string().min(1, 'الوصف مطلوب.'),
});


async function uploadFile(file: File, path: string): Promise<FileUploadResult> {
  const storageRef = ref(storage, path);
  const snapshot = await uploadBytes(storageRef, await file.arrayBuffer());
  const url = await getDownloadURL(snapshot.ref);
  return { url, path };
}

export async function getNovels(): Promise<Novel[]> {
  try {
    const novelsCollection = collection(db, 'novels');
    const q = query(novelsCollection, orderBy('isFeatured', 'desc'), orderBy('releaseDate', 'desc'));
    const novelSnapshot = await getDocs(q);
    const novelsList = novelSnapshot.docs.map(doc => {
      const data = doc.data();
      const releaseDate = data.releaseDate instanceof Timestamp 
        ? data.releaseDate.toDate().toISOString().split('T')[0]
        : data.releaseDate;

      return {
        id: doc.id,
        title: data.title,
        description: data.description,
        quote: data.quote,
        coverImage: data.coverImage,
        pdfUrl: data.pdfUrl,
        releaseDate: releaseDate,
        isFeatured: data.isFeatured || false,
      };
    }) as Novel[];
    
    if (novelsList.length === 0) {
        return placeholderNovels;
    }

    return novelsList;
  } catch (error) {
    console.error("Firebase fetch failed, returning placeholder data:", error);
    //
    // THIS IS A WORKAROUND: If Firebase fails (e.g., due to permissions),
    // we return local placeholder data to prevent the site from crashing.
    // The root cause is likely a Firebase project configuration issue
    // (e.g., Security Rules, enabled APIs, or billing).
    //
    return placeholderNovels;
  }
}

export type FormState = {
  message: string;
  errors?: {
    title?: string[];
    quote?: string[];
    novelContent?: string[];
    description?: string[];
    pdfFile?: string[];
    coverImage?: string[];
  };
};

export async function addNovel(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const validatedFields = NovelSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    return {
      message: 'فشل التحقق من صحة الحقول.',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { title, quote, novelContent, pdfFile, coverImage } = validatedFields.data;
  let { description } = validatedFields.data;

  try {
    if (novelContent && !description) {
      const summaryResult = await summarizeNovel({ novelContent });
      description = summaryResult.summary;
    }
    
    if (!description) {
        description = "وصف مؤقت. سيتم تحديثه قريبًا.";
    }

    const fileId = uuidv4();
    const coverImagePath = `covers/${fileId}-${coverImage.name}`;
    const pdfPath = `pdfs/${fileId}-${pdfFile.name}`;

    const [coverImageResult, pdfFileResult] = await Promise.all([
      uploadFile(coverImage, coverImagePath),
      uploadFile(pdfFile, pdfPath),
    ]);
    
    await addDoc(collection(db, 'novels'), {
      title,
      quote,
      description,
      coverImage: coverImageResult.url,
      pdfUrl: pdfFileResult.url,
      releaseDate: new Date(),
      isFeatured: false,
    });

    revalidatePath('/admin');
    revalidatePath('/');
    revalidatePath('/novels');

    return { message: 'تمت إضافة الرواية بنجاح!' };
  } catch (error) {
    console.error('Error adding novel:', error);
    return { message: 'فشل في إضافة الرواية. حدث خطأ غير متوقع.' };
  }
}

export async function editNovel(
  id: string,
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
    const validatedFields = EditNovelSchema.safeParse(
        Object.fromEntries(formData.entries())
    );

    if (!validatedFields.success) {
        return {
        message: 'فشل التحقق من صحة الحقول.',
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
        revalidatePath('/');
        revalidatePath('/novels');

        return { message: 'تم تعديل الرواية بنجاح!' };
    } catch (error) {
        console.error('Error editing novel:', error);
        return { message: 'فشل في تعديل الرواية. حدث خطأ غير متوقع.' };
    }
}

export async function deleteNovel(id: string) {
    try {
        await deleteDoc(doc(db, "novels", id));
        
        revalidatePath('/admin');
        revalidatePath('/');
        revalidatePath('/novels');
        
        return { message: 'تم حذف الرواية بنجاح.' };
    } catch (error) {
        console.error('Error deleting novel:', error);
        return { message: 'فشل حذف الرواية.' };
    }
}

export async function setFeaturedNovel(id: string) {
   try {
    const novelsRef = collection(db, 'novels');
    const q = query(novelsRef);
    const querySnapshot = await getDocs(q);
    
    const batch = writeBatch(db);
    
    querySnapshot.forEach((document) => {
      const isCurrentDoc = document.id === id;
      batch.update(doc(db, 'novels', document.id), { isFeatured: isCurrentDoc });
    });
    
    await batch.commit();

    revalidatePath('/admin');
    revalidatePath('/');
    revalidatePath('/novels');
    
    return { message: 'تم تحديد الرواية القادمة بنجاح.' };
  } catch (error) {
     console.error('Error setting featured novel:', error);
     return { message: 'فشل في تحديد الرواية القادمة.' };
  }
}
