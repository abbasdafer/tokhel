import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { NovelForm } from '@/components/admin/NovelForm';
import { NovelTable } from '@/components/admin/NovelTable';
import { getNovels } from './actions';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
    const novels = await getNovels();

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mb-12 animate-fade-in">
        <h1 className="text-4xl md:text-5xl font-headline font-bold">
          لوحة التحكم
        </h1>
        <p className="text-muted-foreground mt-3 text-xl">
          إدارة محتوى الموقع بسهولة ويسر.
        </p>
      </div>
      <Tabs defaultValue="manage" className="w-full animate-fade-in [animation-delay:200ms]">
        <TabsList className="grid w-full grid-cols-2 md:w-[400px]">
          <TabsTrigger value="manage">إدارة الروايات</TabsTrigger>
          <TabsTrigger value="add">إضافة رواية جديدة</TabsTrigger>
        </TabsList>
        <TabsContent value="manage" className="mt-6">
            <h2 className="text-2xl font-bold mb-4">قائمة الروايات</h2>
            <NovelTable novels={novels} />
        </TabsContent>
        <TabsContent value="add" className="mt-6">
            <h2 className="text-2xl font-bold mb-4">نشر رواية جديدة</h2>
            <div className="p-8 border rounded-lg bg-card">
                <NovelForm />
            </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
