'use client';

import Image from 'next/image';
import type { Novel } from '@/lib/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Star, Trash2 } from 'lucide-react';
import { useTransition } from 'react';
import { deleteNovel, setFeaturedNovel } from '@/app/admin/actions';
import { useToast } from '@/hooks/use-toast';

interface NovelTableProps {
  novels: Novel[];
}

export function NovelTable({ novels }: NovelTableProps) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleDelete = (id: string) => {
    startTransition(async () => {
      const result = await deleteNovel(id);
      toast({
        title: result.message.includes('نجاح') ? 'نجاح' : 'خطأ',
        description: result.message,
        variant: result.message.includes('نجاح') ? 'default' : 'destructive',
      });
    });
  };

  const handleSetFeatured = (id: string) => {
    startTransition(async () => {
      const result = await setFeaturedNovel(id);
      toast({
        title: 'نجاح',
        description: result.message,
      });
    });
  };

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">الغلاف</TableHead>
            <TableHead>العنوان</TableHead>
            <TableHead>الحالة</TableHead>
            <TableHead className="text-left">الإجراءات</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {novels.map((novel) => (
            <TableRow key={novel.id}>
              <TableCell>
                <Image
                  src={novel.coverImage}
                  alt={novel.title}
                  width={50}
                  height={75}
                  className="rounded-sm object-cover"
                  data-ai-hint="book cover"
                />
              </TableCell>
              <TableCell className="font-medium">{novel.title}</TableCell>
              <TableCell>
                {novel.isFeatured ? (
                  <Badge variant="default">الرواية القادمة</Badge>
                ) : (
                  <Badge variant="secondary">رواية سابقة</Badge>
                )}
              </TableCell>
              <TableCell className="text-left">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSetFeatured(novel.id)}
                    disabled={isPending || novel.isFeatured}
                  >
                    <Star className="me-2 h-4 w-4" />
                    تحديد كقادمة
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm" disabled={isPending}>
                        <Trash2 className="me-2 h-4 w-4" />
                        حذف
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>هل أنت متأكد تمامًا؟</AlertDialogTitle>
                        <AlertDialogDescription>
                          هذا الإجراء لا يمكن التراجع عنه. سيؤدي هذا إلى حذف الرواية بشكل دائم.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>إلغاء</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(novel.id)}
                          className="bg-destructive hover:bg-destructive/90"
                        >
                          نعم، احذف الرواية
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
