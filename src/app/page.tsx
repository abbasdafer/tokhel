import Image from 'next/image';
import Link from 'next/link';
import { novels } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Download, ArrowLeft } from 'lucide-react';
import { NovelCard } from '@/components/NovelCard';
import { Separator } from '@/components/ui/separator';

export default function Home() {
  const featuredNovel = novels.find(n => n.isFeatured);
  const previousNovels = novels.filter(n => !n.isFeatured).slice(0, 3);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      {featuredNovel && (
        <section className="bg-secondary/50">
          <div className="container mx-auto px-4 py-16 md:py-24">
            <div className="grid md:grid-cols-5 gap-8 md:gap-12 items-center">
              <div className="md:col-span-3 animate-fade-in">
                <h1 className="text-4xl md:text-6xl font-headline font-bold text-foreground mb-4">
                  {featuredNovel.title}
                </h1>
                <p className="text-primary text-lg mb-6">
                  إصدار قادم: {featuredNovel.releaseDate}
                </p>
                <p className="text-xl md:text-2xl text-muted-foreground italic border-r-4 border-accent pr-6 mb-8">
                  {`"${featuredNovel.quote}"`}
                </p>
                <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  <Link href={featuredNovel.pdfUrl}>
                    <Download className="me-2 h-5 w-5" />
                    تحميل النسخة الأولية (PDF)
                  </Link>
                </Button>
              </div>
              <div className="md:col-span-2 flex justify-center animate-fade-in [animation-delay:200ms]">
                <div className="relative w-64 h-96 md:w-80 md:h-[480px] shadow-2xl rounded-lg overflow-hidden transform transition-transform duration-500 hover:scale-105">
                   <Image
                    src={featuredNovel.coverImage}
                    alt={`غلاف رواية ${featuredNovel.title}`}
                    fill
                    className="object-cover"
                    priority
                    data-ai-hint="book cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Previous Novels Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-headline font-bold">
              من أعمالي السابقة
            </h2>
            <p className="text-muted-foreground mt-2 text-lg">
              رحلات في عوالم من الخيال والتشويق.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {previousNovels.map((novel, index) => (
              <div key={novel.id} className="animate-fade-in" style={{ animationDelay: `${index * 150}ms`}}>
                <NovelCard novel={novel} />
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Button asChild variant="ghost" size="lg">
              <Link href="/novels">
                <span>عرض كل الروايات</span>
                <ArrowLeft className="ms-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
      
      <Separator className="my-8" />

      {/* About the Author Teaser */}
      <section className="py-16 md:py-24 bg-secondary/50">
        <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-headline font-bold mb-4">
              عن الكاتب
            </h2>
            <div className="max-w-3xl mx-auto">
              <p className="text-muted-foreground text-lg mb-8">
              أنا روائي أؤمن بقوة الكلمات في خلق عوالم جديدة وتجسيد المشاعر الإنسانية العميقة. أسعى من خلال كتاباتي إلى استكشاف زوايا النفس البشرية، ونسج قصص تبقى في الذاكرة وتلهم الخيال.
              </p>
              <Button asChild size="lg" variant="outline">
                <Link href="/about">
                  اعرف المزيد عني
                </Link>
              </Button>
            </div>
        </div>
      </section>
    </div>
  );
}
