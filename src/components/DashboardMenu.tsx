'use client';

import { useEffect, useRef, useState } from 'react';
import type { ThemeKey } from '@/lib/theme';
import { themes } from '@/lib/theme';

export type DashboardMenuProps = {
  displayName: string;
  email?: string | null;
  theme: ThemeKey;
  onThemeChange: (theme: ThemeKey) => void;
  onLogout: () => void;
};

export function DashboardMenu({
  displayName,
  email,
  theme,
  onThemeChange,
  onLogout,
}: DashboardMenuProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuOpen && menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  const userInitial = displayName ? displayName[0].toUpperCase() : '?';

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={() => setMenuOpen((open) => !open)}
        className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white shadow-sm"
      >
        {userInitial}
      </button>

      {menuOpen ? (
        <div className="absolute right-0 z-50 mt-2 w-64 rounded-xl border border-slate-200 bg-white p-4 shadow-lg">
          <div className="mb-3">
            <p className="text-sm font-semibold text-slate-900">{displayName}</p>
            <p className="text-xs text-slate-500">{email}</p>
          </div>

          <div className="mb-3">
            <label className="block text-xs font-semibold text-slate-600 mb-1">Theme</label>
            <select
              value={theme}
              onChange={(event) => onThemeChange(event.target.value as ThemeKey)}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm focus-primary"
            >
              {Object.values(themes).map((themeOption) => (
                <option key={themeOption.value} value={themeOption.value}>
                  {themeOption.label}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={onLogout}
            className="w-full rounded-lg bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200"
          >
            Sign out
          </button>
        </div>
      ) : null}
    </div>
  );
}
