'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { useEffect } from 'react';

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
  const [state, formAction] = useFormState(addNovel, initialState);
  const { toast } = useToast();

  useEffect(() => {
    if (state.message && !state.errors) {
      toast({
        title: 'نجاح',
        description: state.message,
      });
    }
  }, [state, toast]);

  return (
    <form action={formAction} className="space-y-6">
        
      {state.errors && (
         <Alert variant="destructive">
          <Terminal className="h-4 w-4" />
          <AlertTitle>حدث خطأ!</AlertTitle>
          <AlertDescription>
            <ul className="list-disc list-inside">
                {state.errors.title && <li>{state.errors.title[0]}</li>}
                {state.errors.quote && <li>{state.errors.quote[0]}</li>}
                {state.errors.novelContent && <li>{state.errors.novelContent[0]}</li>}
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
          required
        />
        <p className="text-sm text-muted-foreground">
          سيتم استخدام هذا المحتوى لتوليد وصف مختصر من 3 أسطر تلقائيًا.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
            <Label htmlFor="pdfFile">ملف PDF</Label>
            <Input id="pdfFile" name="pdfFile" type="file" disabled />
            <p className="text-sm text-muted-foreground">ميزة الرفع معطلة في هذا العرض.</p>
        </div>
        <div className="space-y-2">
            <Label htmlFor="coverImage">صورة الغلاف</Label>
            <Input id="coverImage" name="coverImage" type="file" disabled />
            <p className="text-sm text-muted-foreground">ميزة الرفع معطلة في هذا العرض.</p>
        </div>
      </div>
      
      <div className="flex justify-end">
        <SubmitButton />
      </div>
    </form>
  );
}
