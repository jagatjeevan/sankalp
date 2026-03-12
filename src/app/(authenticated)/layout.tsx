'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, signOut } from '@/lib/auth';
import { Sidebar } from '@/components/Sidebar';
import { initTheme } from '@/lib/theme';
import type { ThemeKey } from '@/lib/theme';

type AuthUser = {
  id: string;
  email: string;
  displayName: string | null;
};

export default function AuthenticatedLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [theme, setTheme] = useState<ThemeKey>(() => initTheme());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const currentUser = await getCurrentUser();
      if (!currentUser) {
        router.replace('/login');
        return;
      }
      setUser(currentUser);
      setLoading(false);
    };

    init();
  }, [router]);

  const handleLogout = async () => {
    await signOut();
    router.replace('/login');
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-primary" />
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen">
      <div className="flex min-h-screen">
        <Sidebar
          displayName={user.displayName ?? user.email}
          email={user.email}
          theme={theme}
          onThemeChange={setTheme}
          onLogout={handleLogout}
        />
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
