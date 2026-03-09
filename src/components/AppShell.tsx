'use client';

import { ReactNode } from 'react';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <ThemeSwitcher />
    </>
  );
}
