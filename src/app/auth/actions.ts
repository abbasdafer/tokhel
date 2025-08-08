'use server';

import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const SESSION_COOKIE_NAME = 'tokhel-ink-session';

export async function handleSignIn(prevState: string | undefined, formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const idToken = await userCredential.user.getIdToken();

    cookies().set(SESSION_COOKIE_NAME, idToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 24 hours
    });
    
  } catch (error: any) {
    if (error.code === 'auth/invalid-credential') {
        return 'البريد الإلكتروني أو كلمة المرور غير صحيحة.';
    }
    return 'حدث خطأ غير متوقع.';
  }
  
  redirect('/admin');
}

export async function handleSignOut() {
    cookies().delete(SESSION_COOKIE_NAME);
    await signOut(auth);
    redirect('/');
}

export async function getSession() {
    return cookies().get(SESSION_COOKIE_NAME)?.value || null;
}
