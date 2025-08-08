
'use server';

import { revalidatePath } from 'next/cache';
import type { Novel } from '@/lib/types';
import { placeholderNovels } from '@/lib/placeholder-data';

// This is a temporary in-memory store to simulate database operations.
let novelsStore: Novel[] = [...placeholderNovels];


export async function getNovels(): Promise<Novel[]> {
  // Simulate async operation
  await new Promise(resolve => setTimeout(resolve, 50));
  // Return a deep copy to prevent direct mutation
  return JSON.parse(JSON.stringify(novelsStore.sort((a, b) => (b.isFeatured ? 1 : -1))));
}

export type FormState = {
  message: string;
  errors?: {
    title?: string[];
    quote?:string[];
    novelContent?: string[];
    description?: string[];
  };
};


export async function addNovel(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  console.log('addNovel is disabled (using placeholder data).');
  return { message: 'ميزة الإضافة معطلة حاليًا (يتم استخدام بيانات مؤقتة).' };
}

export async function editNovel(
  id: string,
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
   console.log('editNovel is disabled (using placeholder data).');
   return { message: 'ميزة التعديل معطلة حاليًا (يتم استخدام بيانات مؤقتة).' };
}


export async function deleteNovel(id: string) {
  console.log('deleteNovel is disabled (using placeholder data).');
  return { message: 'ميزة الحذف معطلة حاليًا (يتم استخدام بيانات مؤقتة).' };
}


export async function setFeaturedNovel(id: string) {
    console.log('setFeaturedNovel is disabled (using placeholder data).');
    return { message: 'ميزة التمييز معطلة حاليًا (يتم استخدام بيانات مؤقتة).' };
}
