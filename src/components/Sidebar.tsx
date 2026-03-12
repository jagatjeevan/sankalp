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
  const [isCollapsed, setIsCollapsed] = useState(false);
  const isExpanded = !isCollapsed;
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
      {/* Sidebar */}
      <aside
        className={`relative z-40 flex shrink-0 flex-col border-r border-slate-200 bg-white p-4 transition-all duration-300 ${
          isCollapsed ? 'w-20' : 'w-[320px]'
        }`}
      >
        <button
          type="button"
          onClick={() => setIsCollapsed((value) => !value)}
          className="absolute right-0 top-4 z-10 inline-flex h-9 w-9 translate-x-1/2 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-100"
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <i
            className={`fa-solid ${isCollapsed ? 'fa-angles-right' : 'fa-angles-left'}`}
            aria-hidden="true"
          />
        </button>

        {/* Logo section */}
        <div className={`mb-6 flex items-center ${isExpanded ? 'gap-3' : 'flex-col gap-2'}`}>
          {isExpanded ? (
            <Image src="/sankalp-hero.png" alt="Sankalp" width={110} height={42} />
          ) : (
            <Image src="/sankalp-icon.png" alt="Sankalp icon" width={36} height={36} />
          )}
        </div>

        {/* Search */}
        {isExpanded ? (
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search..."
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 placeholder-slate-400"
            />
          </div>
        ) : null}

        {/* Menu items */}
        <nav className="flex-1 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                isCollapsed ? 'justify-center' : 'gap-3'
              } ${
                isActive(item.href) ? 'bg-primary text-white' : 'text-slate-700 hover:bg-slate-100'
              }`}
              title={isCollapsed ? item.label : undefined}
            >
              <i className={`fa-solid ${item.icon} w-5`} aria-hidden="true" />
              {isExpanded ? <span>{item.label}</span> : null}
            </Link>
          ))}
        </nav>

        {/* Divider */}
        <div className="border-t border-slate-200 pt-4">
          {/* Dark mode / Theme section */}
          {isExpanded ? (
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
          ) : null}

          {/* User section */}
          {isExpanded ? (
            <div className="rounded-lg bg-slate-50 p-3 text-sm">
              <p className="font-semibold text-slate-900">{displayName}</p>
              <p className="text-xs text-slate-600">{email}</p>
            </div>
          ) : null}

          {/* Logout button */}
          <button
            type="button"
            onClick={onLogout}
            className={`mt-3 inline-flex w-full items-center justify-center rounded-lg bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200 ${
              isCollapsed ? '' : 'gap-2'
            }`}
            title={isCollapsed ? 'Logout' : undefined}
          >
            <i className="fa-solid fa-right-from-bracket" aria-hidden="true" />
            {isExpanded ? <span>Logout</span> : null}
          </button>
        </div>
      </aside>
    </>
  );
}
