import Image from 'next/image';
import { Award, BookOpen, Coffee } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="bg-secondary/30">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-headline font-bold">
            عن الكاتب
          </h1>
          <p className="text-muted-foreground mt-3 text-xl">
            رحلتي مع الكلمات والخيال.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-12 items-center">
          <div className="md:col-span-1 flex justify-center animate-fade-in [animation-delay:200ms]">
            <div className="relative w-64 h-64 rounded-full overflow-hidden shadow-lg">
              <Image
                src="https://placehold.co/400x400/a7b7c7/f0f0f0"
                alt="صورة الكاتب"
                fill
                className="object-cover"
                data-ai-hint="author portrait"
              />
            </div>
          </div>
          <div className="md:col-span-2 animate-fade-in [animation-delay:400ms]">
            <h2 className="text-3xl font-bold font-headline mb-4">
              حبر تخيّل
            </h2>
            <p className="text-lg text-foreground/80 leading-relaxed mb-4">
              أهلاً بكم في عالمي. أنا روائي أجد في الكتابة وسيلة للتنفس والتعبير عن الأفكار التي تجول في خاطري. بدأت رحلتي مع القلم منذ الصغر، حيث كانت القصص القصيرة هي نافذتي الأولى على عوالم الخيال. اليوم, أكرس وقتي لنسج روايات كاملة تأخذ القارئ في رحلات لا تُنسى.
            </p>
            <p className="text-lg text-foreground/80 leading-relaxed">
              أؤمن أن كل قصة هي مغامرة تستحق أن تُروى، وأن الكلمات لديها القدرة على تغيير وجهات النظر وإلهام الأرواح. شكراً لكونكم جزءاً من هذه الرحلة.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 md:mt-24 text-center">
            <div className="p-6 bg-card rounded-lg shadow-sm animate-fade-in [animation-delay:600ms]">
                <Award className="mx-auto h-10 w-10 text-accent mb-4"/>
                <h3 className="text-xl font-bold">الجوائز</h3>
                <p className="text-muted-foreground mt-2">جائزة أفضل رواية خيال علمي 2023.</p>
            </div>
            <div className="p-6 bg-card rounded-lg shadow-sm animate-fade-in [animation-delay:700ms]">
                <BookOpen className="mx-auto h-10 w-10 text-accent mb-4"/>
                <h3 className="text-xl font-bold">الإصدارات</h3>
                <p className="text-muted-foreground mt-2">أكثر من 5 روايات منشورة.</p>
            </div>
            <div className="p-6 bg-card rounded-lg shadow-sm animate-fade-in [animation-delay:800ms]">
                <Coffee className="mx-auto h-10 w-10 text-accent mb-4"/>
                <h3 className="text-xl font-bold">الاهتمامات</h3>
                <p className="text-muted-foreground mt-2">التاريخ، الفلسفة، والسفر.</p>
            </div>
        </div>

      </div>
    </div>
  );
}
