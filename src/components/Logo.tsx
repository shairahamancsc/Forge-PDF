import { FileJson2 } from 'lucide-react';
import Link from 'next/link';

export default function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 text-primary hover:text-primary/90 transition-colors">
      <FileJson2 className="h-7 w-7" />
      <span className="text-xl font-semibold font-headline">Forge PDF</span>
    </Link>
  );
}
