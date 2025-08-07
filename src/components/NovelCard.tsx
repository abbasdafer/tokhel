import Image from 'next/image';
import type { Novel } from '@/lib/types';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import Link from 'next/link';

interface NovelCardProps {
  novel: Novel;
}

export function NovelCard({ novel }: NovelCardProps) {
  return (
    <Card className="flex flex-col h-full overflow-hidden transition-shadow duration-300 hover:shadow-xl animate-fade-in">
      <CardHeader className="p-0">
        <div className="aspect-[2/3] relative w-full">
           <Image
            src={novel.coverImage}
            alt={`غلاف رواية ${novel.title}`}
            fill
            className="object-cover"
            data-ai-hint="book cover"
          />
        </div>
      </CardHeader>
      <CardContent className="flex-grow p-6">
        <CardTitle className="text-2xl font-headline mb-2">{novel.title}</CardTitle>
        <CardDescription className="text-base text-muted-foreground leading-relaxed">
          {novel.description}
        </CardDescription>
      </CardContent>
      <CardFooter className="p-6 pt-0">
        <Button asChild className="w-full" variant="secondary">
          <Link href={novel.pdfUrl}>
            <Download className="me-2 h-4 w-4" />
            تحميل PDF
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
