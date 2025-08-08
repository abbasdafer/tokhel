'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { useEffect } from 'react';
import type { Novel } from '@/lib/types';
import { editNovel, type FormState } from '@/app/admin/actions';
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
      {pending ? 'جاري الحفظ...' : 'حفظ التغييرات'}
    </Button>
  );
}

interface EditNovelFormProps {
  novel: Novel;
  onSuccess: () => void;
}

export function EditNovelForm({ novel, onSuccess }: EditNovelFormProps) {
  const initialState: FormState = { message: '' };
  const editNovelWithId = editNovel.bind(null, novel.id);
  const [state, formAction] = useFormState(editNovelWithId, initialState);
  const { toast } = useToast();

  useEffect(() => {
    if (state.message) {
      if(state.errors) {
        toast({
          title: 'خطأ',
          description: state.message,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'نجاح',
          description: state.message,
        });
        onSuccess();
      }
    }
  }, [state, toast, onSuccess]);

  return (
    <form action={formAction} className="space-y-6 py-4">
        
      {state.errors && (
         <Alert variant="destructive">
          <Terminal className="h-4 w-4" />
          <AlertTitle>حدث خطأ!</AlertTitle>
          <AlertDescription>
            <ul className="list-disc list-inside">
                {state.errors.title && <li>{state.errors.title[0]}</li>}
                {state.errors.quote && <li>{state.errors.quote[0]}</li>}
                {state.errors.description && <li>{state.errors.description[0]}</li>}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="title">عنوان الرواية</Label>
        <Input
          id="title"
          name="title"
          defaultValue={novel.title}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="quote">اقتباس قصير</Label>
        <Input
          id="quote"
          name="quote"
          defaultValue={novel.quote}
          required
        />
      </div>
      
       <div className="space-y-2">
        <Label htmlFor="description">الوصف (الملخص)</Label>
        <Textarea
          id="description"
          name="description"
          defaultValue={novel.description}
          rows={5}
          required
        />
      </div>
      
      <div className="flex justify-end">
        <SubmitButton />
      </div>
    </form>
  );
}
