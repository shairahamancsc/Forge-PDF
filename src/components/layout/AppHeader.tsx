
"use client";

import Link from 'next/link';
import Logo from '@/components/Logo';
import { Button } from '@/components/ui/button';
import UserNav from './UserNav';
import { useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { createClient } from '@/utils/supabase/client'; 
import { usePathname, useRouter } from 'next/navigation';

export default function AppHeader() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      setUser(currentUser);
      setIsLoading(false);
    };

    fetchUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (event === 'SIGNED_IN' && (pathname === '/login' || pathname === '/register')) {
        router.refresh(); 
      }
      if (event === 'SIGNED_OUT') {
        router.refresh();
      }
    });

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, [pathname, router, supabase.auth]);

  const isAuthPage = pathname === '/login' || pathname === '/register' || pathname === '/auth/callback';
  
  if (isLoading && isAuthPage) {
    return <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"><div className="container flex h-16 items-center justify-between"><Logo /></div></header>;
  }
  if (!isLoading && user && isAuthPage && pathname !== '/auth/callback' ) {
     router.push('/dashboard'); 
     return <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"><div className="container flex h-16 items-center justify-between"><Logo /></div></header>;
  }


  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Logo />
        <nav className="flex items-center gap-4">
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="h-8 w-20 animate-pulse rounded-md bg-muted"></div>
              <div className="h-8 w-8 animate-pulse rounded-full bg-muted"></div>
            </div>
          ) : user ? (
            <>
              <Button variant="ghost" asChild>
                <Link href="/dashboard">Dashboard</Link>
              </Button>
              <UserNav user={user} />
            </>
          ) : (
            <>
              {pathname !== '/login' && (
                <Button variant="ghost" asChild>
                  <Link href="/login">Login</Link>
                </Button>
              )}
              {pathname !== '/register' && (
                <Button asChild>
                  <Link href="/register">Sign Up</Link>
                </Button>
              )}
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
