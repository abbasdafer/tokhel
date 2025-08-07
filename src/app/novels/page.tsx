import { getNovels } from '@/app/admin/actions';
import { NovelCard } from '@/components/NovelCard';

export const dynamic = 'force-dynamic';

export default async function PreviousNovelsPage() {
  const allNovels = await getNovels();
  const novelsToShow = allNovels.filter(n => !n.isFeatured);

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-12 animate-fade-in">
        <h1 className="text-4xl md:text-5xl font-headline font-bold">
          الروايات السابقة
        </h1>
        <p className="text-muted-foreground mt-3 text-xl">
          استكشف مجموعة أعمالي الكاملة.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {novelsToShow.map((novel, index) => (
          <div key={novel.id} className="animate-fade-in" style={{ animationDelay: `${index * 100}ms`}}>
            <NovelCard novel={novel} />
          </div>
        ))}
      </div>
    </div>
  );
}
