'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { useEffect, useRef } from 'react';

import { addNovel, type FormState } from '@/app/admin/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? 'جاري النشر...' : 'نشر الرواية'}
    </Button>
  );
}

export function NovelForm() {
  const initialState: FormState = { message: '' };
  const [state, formAction] = useActionState(addNovel, initialState);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.message) {
      if(state.errors) {
        // Don't show a toast for validation errors, they are displayed inline
      } else {
        toast({
          title: 'نجاح',
          description: state.message,
        });
        // Reset form on successful submission
        formRef.current?.reset();
      }
    }
  }, [state, toast]);

  return (
    <form ref={formRef} action={formAction} className="space-y-6">
        
      {state.message && state.errors && (
         <Alert variant="destructive">
          <Terminal className="h-4 w-4" />
          <AlertTitle>حدث خطأ في التحقق!</AlertTitle>
          <AlertDescription>
            <ul className="list-disc list-inside space-y-1 mt-2">
                {state.errors.title && <li>{state.errors.title[0]}</li>}
                {state.errors.quote && <li>{state.errors.quote[0]}</li>}
                {state.errors.novelContent && <li>{state.errors.novelContent[0]}</li>}
                {state.errors.coverImage && <li>{state.errors.coverImage[0]}</li>}
                {state.errors.pdfFile && <li>{state.errors.pdfFile[0]}</li>}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="title">عنوان الرواية</Label>
        <Input
          id="title"
          name="title"
          placeholder="أدخل عنوان الرواية"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="quote">اقتباس قصير</Label>
        <Input
          id="quote"
          name="quote"
          placeholder="أدخل اقتباسًا جذابًا من الرواية"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="novelContent">محتوى الرواية (للتلخيص بالذكاء الاصطناعي)</Label>
        <Textarea
          id="novelContent"
          name="novelContent"
          placeholder="الصق محتوى الرواية هنا ليقوم الذكاء الاصطناعي بتلخيصه..."
          rows={10}
        />
        <p className="text-sm text-muted-foreground">
          اختياري: سيتم استخدام هذا المحتوى لتوليد وصف مختصر تلقائيًا.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
            <Label htmlFor="pdfFile">ملف PDF</Label>
            <Input id="pdfFile" name="pdfFile" type="file" accept=".pdf" required />
        </div>
        <div className="space-y-2">
            <Label htmlFor="coverImage">صورة الغلاف</Label>
            <Input id="coverImage" name="coverImage" type="file" accept="image/*" required />
        </div>
      </div>
      
      <div className="flex justify-end">
        <SubmitButton />
      </div>
    </form>
  );
}
