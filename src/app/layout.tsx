import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import AppHeader from '@/components/layout/AppHeader';

export const metadata: Metadata = {
  title: 'Forge PDF – Cloud PDF Editor & Annotator',
  description: 'Upload, view, edit, annotate, and download PDF documents online with ease.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased min-h-screen flex flex-col" suppressHydrationWarning>
        <AppHeader />
        <main className="flex-grow">
          {children}
        </main>
        <Toaster />
      </body>
    </html>
  );
}
