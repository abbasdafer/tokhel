
'use server';

import { revalidatePath } from 'next/cache';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy, writeBatch, Timestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { db, storage } from '@/lib/firebase';
import type { Novel, FileUploadResult } from '@/lib/types';
import { z } from 'zod';
import { summarizeNovel } from '@/ai/flows/summarize-novel';
import { v4 as uuidv4 } from 'uuid';

const NovelSchema = z.object({
  title: z.string().min(1, 'العنوان مطلوب.'),
  quote: z.string().min(1, 'الاقتباس مطلوب.'),
  description: z.string().optional(),
  novelContent: z.string().optional(),
  pdfFile: z.instanceof(File).refine(file => file.size > 0, 'ملف PDF مطلوب.'),
  coverImage: z.instanceof(File).refine(file => file.size > 0, 'صورة الغلاف مطلوبة.'),
});

const EditNovelSchema = NovelSchema.omit({ pdfFile: true, coverImage: true, novelContent: true });


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
      // Safely handle Firestore Timestamp
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
    return novelsList;
  } catch (error) {
    console.error("Error fetching novels: ", error);
    // Return empty array on error to prevent site crash
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
    pdfFile?: string[];
    coverImage?: string[];
  };
};

export async function addNovel(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
   return { message: 'تم تعطيل إضافة الروايات مؤقتًا.' };
  /*
  const validatedFields = NovelSchema.safeParse({
    title: formData.get('title'),
    quote: formData.get('quote'),
    novelContent: formData.get('novelContent'),
    pdfFile: formData.get('pdfFile'),
    coverImage: formData.get('coverImage'),
  });

  if (!validatedFields.success) {
    return {
      message: 'فشلت عملية التحقق.',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }
  
  const { title, quote, novelContent, pdfFile, coverImage } = validatedFields.data;

  try {
    let description = "سيتم إنشاء الوصف قريبًا...";
    if (novelContent && novelContent.length > 10) {
      const result = await summarizeNovel({ novelContent });
      description = result.summary;
    }

    const uniqueId = uuidv4();
    const coverImagePath = `covers/${uniqueId}-${coverImage.name}`;
    const pdfPath = `pdfs/${uniqueId}-${pdfFile.name}`;

    const [coverUploadResult, pdfUploadResult] = await Promise.all([
        uploadFile(coverImage, coverImagePath),
        uploadFile(pdfFile, pdfPath)
    ]);

    await addDoc(collection(db, 'novels'), {
      title,
      quote,
      description,
      coverImage: coverUploadResult.url,
      pdfUrl: pdfUploadResult.url,
      releaseDate: new Date(),
      isFeatured: false,
    });

    revalidatePath('/');
    revalidatePath('/novels');
    revalidatePath('/admin');
    return { message: 'تمت إضافة الرواية بنجاح!' };
  } catch (e: any) {
    console.error(e);
    // Handle Firebase Storage permission errors
    if (e.code === 'storage/unauthorized') {
      return { message: 'فشل رفع الملف. ليس لديك الإذن الكافي. يرجى مراجعة قواعد أمان Firebase Storage.' };
    }
    return { message: 'فشل في إضافة الرواية.' };
  }
  */
}

export async function editNovel(
  id: string,
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  return { message: 'تم تعطيل تعديل الروايات مؤقتًا.' };
  /*
  const validatedFields = EditNovelSchema.safeParse({
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
  */
}

export async function deleteNovel(id: string) {
   return { message: 'تم تعطيل حذف الروايات مؤقتًا.' };
  /*
  try {
    // Note: This doesn't delete the files from storage to keep it simple.
    // In a real-world app, you'd want to delete the associated files from Firebase Storage.
    await deleteDoc(doc(db, 'novels', id));
    revalidatePath('/');
    revalidatePath('/novels');
    revalidatePath('/admin');
    return { message: 'تم حذف الرواية بنجاح.' };
  } catch (e) {
    console.error(e);
    return { message: 'فشل في حذف الرواية.' };
  }
  */
}

export async function setFeaturedNovel(id: string) {
  return { message: 'تم تعطيل تحديد الروايات القادمة مؤقتًا.' };
  /*
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
  */
}
