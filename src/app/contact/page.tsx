import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

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
        <form className="grid gap-6 animate-fade-in [animation-delay:200ms]">
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
