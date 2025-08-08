
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
   return { message: 'تم تعطيل إضافة الروايات مؤقتًا.' };
}

export async function editNovel(
  id: string,
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  return { message: 'تم تعطيل تعديل الروايات مؤقتًا.' };
}

export async function deleteNovel(id: string) {
   return { message: 'تم تعطيل حذف الروايات مؤقتًا.' };
}

export async function setFeaturedNovel(id: string) {
  return { message: 'تم تعطيل تحديد الروايات القادمة مؤقتًا.' };
}
