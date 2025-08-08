import Link from 'next/link';
import { Feather, Mail, Send, Instagram } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t">
      <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <Feather className="h-6 w-6 text-primary" />
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-right">
            بُني بحب وشغف. &copy; {new Date().getFullYear()} حبر توخيل.
          </p>
        </div>
        <div className="flex items-center gap-6">
           <Link href="mailto:alzmylyywsf3@gmail.com" aria-label="Email">
            <Mail className="h-5 w-5 text-muted-foreground transition-colors hover:text-primary" />
          </Link>
          <Link href="https://t.me/Cq_2q" target="_blank" aria-label="Telegram">
            <Send className="h-5 w-5 text-muted-foreground transition-colors hover:text-primary" />
          </Link>
          <Link href="https://instagram.com/3t_cq" target="_blank" aria-label="Instagram">
            <Instagram className="h-5 w-5 text-muted-foreground transition-colors hover:text-primary" />
          </Link>
        </div>
      </div>
    </footer>
  );
}
