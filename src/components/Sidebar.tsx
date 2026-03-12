'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import type { ThemeKey } from '@/lib/theme';
import { themes, applyTheme, setStoredTheme } from '@/lib/theme';

type SidebarProps = {
  displayName: string;
  email: string;
  theme: ThemeKey;
  onThemeChange: (theme: ThemeKey) => void;
  onLogout: () => void;
};

const menuItems = [
  { href: '/dashboard', label: 'Dashboard', icon: 'fa-home' },
  { href: '/todos', label: 'ToDos', icon: 'fa-list-check' },
  { href: '/my-location', label: 'My Location', icon: 'fa-location-dot' },
];

export function Sidebar({
  displayName,
  email,
  theme,
  onThemeChange,
  onLogout,
}: Readonly<SidebarProps>) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  const handleThemeChange = (newTheme: ThemeKey) => {
    onThemeChange(newTheme);
    applyTheme(newTheme);
    setStoredTheme(newTheme);
  };

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile menu button */}
      <div className="sticky top-0 z-40 flex items-center border-b border-slate-200 bg-white px-4 py-3 lg:hidden">
        <button
          type="button"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="inline-flex items-center justify-center rounded-lg border border-slate-200 px-3 py-2"
        >
          <i className="fa-solid fa-bars text-slate-700" aria-hidden="true" />
        </button>
      </div>

      {/* Sidebar overlay on mobile */}
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          className="fixed inset-0 z-30 bg-black/25 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-slate-200 bg-white p-4 transition-transform duration-300 lg:static lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo section */}
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white">
            <i className="fa-solid fa-bullseye" aria-hidden="true" />
          </div>
          <Image src="/sankalp-hero.png" alt="Sankalp" width={110} height={42} />
        </div>

        {/* Search */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search..."
            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 placeholder-slate-400"
          />
        </div>

        {/* Menu items */}
        <nav className="flex-1 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                isActive(item.href) ? 'bg-primary text-white' : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <i className={`fa-solid ${item.icon} w-5`} aria-hidden="true" />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Divider */}
        <div className="border-t border-slate-200 pt-4">
          {/* Dark mode / Theme section */}
          <div className="mb-4 rounded-lg border border-slate-200 p-3">
            <p className="mb-2 text-xs font-semibold text-slate-600">Theme</p>
            <div className="grid grid-cols-2 gap-2">
              {Object.values(themes).map((themeOption) => (
                <button
                  key={themeOption.value}
                  type="button"
                  onClick={() => handleThemeChange(themeOption.value)}
                  className={`rounded-md border px-2 py-1.5 text-xs font-medium transition ${
                    theme === themeOption.value
                      ? 'border-primary bg-primary/10 text-slate-900'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span
                    className="mb-1 block h-1 w-full rounded-sm"
                    style={{ background: themeOption.preview }}
                  />
                  {themeOption.label}
                </button>
              ))}
            </div>
          </div>

          {/* User section */}
          <div className="rounded-lg bg-slate-50 p-3 text-sm">
            <p className="font-semibold text-slate-900">{displayName}</p>
            <p className="text-xs text-slate-600">{email}</p>
          </div>

          {/* Logout button */}
          <button
            type="button"
            onClick={onLogout}
            className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200"
          >
            <i className="fa-solid fa-right-from-bracket" aria-hidden="true" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
