"use client";

import Link from 'next/link';
import { Menu, Feather, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { handleSignOut } from '@/app/auth/actions';

const navLinks = [
  { href: '/novels', label: 'الروايات السابقة' },
  { href: '/about', label: 'عن الكاتب' },
  { href: '/contact', label: 'تواصل معنا' },
  { href: '/admin', label: 'لوحة التحكم' },
];

export function Header() {
  const [isSheetOpen, setSheetOpen] = useState(false);
  const pathname = usePathname();
  const isAdminPage = pathname.startsWith('/admin');

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center">
        <div className="me-auto flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2">
            <Feather className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg">حبر توخيل</span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-6 text-sm">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              {link.label}
            </Link>
          ))}
           {isAdminPage && (
            <form action={handleSignOut}>
              <Button variant="ghost" size="sm" type="submit">
                <LogOut className="me-2 h-4 w-4" />
                تسجيل الخروج
              </Button>
            </form>
          )}
        </nav>

        <div className="flex md:hidden items-center">
          <Sheet open={isSheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">فتح القائمة</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col gap-4 py-8">
                <Link href="/" className="flex items-center gap-2 mb-4" onClick={() => setSheetOpen(false)}>
                  <Feather className="h-6 w-6 text-primary" />
                  <span className="font-bold text-lg">حبر توخيل</span>
                </Link>
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setSheetOpen(false)}
                    className="text-lg font-medium transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                ))}
                 {isAdminPage && (
                  <form action={handleSignOut} className="mt-4">
                     <Button variant="ghost" type="submit" className="w-full justify-start text-lg font-medium">
                      <LogOut className="me-2 h-5 w-5" />
                      تسجيل الخروج
                    </Button>
                  </form>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
