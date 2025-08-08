import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Mail, Send, Instagram } from 'lucide-react';
import Link from 'next/link';

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-16 md:py-24">
      <div className="text-center mb-12 animate-fade-in">
        <h1 className="text-4xl md:text-5xl font-headline font-bold">
          تواصل معنا
        </h1>
        <p className="text-muted-foreground mt-3 text-xl">
          يسعدني سماع آرائكم واستفساراتكم.
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        <div className="mb-12 flex justify-center items-center gap-8 animate-fade-in [animation-delay:200ms]">
            <Link href="mailto:alzmylyywsf3@gmail.com" className="flex flex-col items-center gap-2 text-muted-foreground transition-colors hover:text-primary">
                <Mail className="h-8 w-8" />
                <span>البريد الإلكتروني</span>
            </Link>
             <Link href="https://t.me/Cq_2q" target="_blank" className="flex flex-col items-center gap-2 text-muted-foreground transition-colors hover:text-primary">
                <Send className="h-8 w-8" />
                <span>تليجرام</span>
            </Link>
             <Link href="https://instagram.com/3t_cq" target="_blank" className="flex flex-col items-center gap-2 text-muted-foreground transition-colors hover:text-primary">
                <Instagram className="h-8 w-8" />
                <span>انستغرام</span>
            </Link>
        </div>

        <div className="text-center mb-12">
            <p className="text-muted-foreground">أو يمكنك إرسال رسالة مباشرة من خلال النموذج التالي:</p>
        </div>

        <form className="grid gap-6 animate-fade-in [animation-delay:400ms]">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">الاسم</Label>
              <Input id="name" placeholder="اسمك الكامل" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">البريد الإلكتروني</Label>
              <Input id="email" type="email" placeholder="example@email.com" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="subject">الموضوع</Label>
            <Input id="subject" placeholder="موضوع الرسالة" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="message">الرسالة</Label>
            <Textarea id="message" placeholder="اكتب رسالتك هنا..." rows={6} />
          </div>
          <div className="flex justify-end">
            <Button type="submit" size="lg">
              إرسال الرسالة
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
