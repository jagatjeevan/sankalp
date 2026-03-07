'use client';

export type ThemeKey = 'default' | 'terracotta';

const STORAGE_KEY = 'sankalp::theme';

export const themes: Record<ThemeKey, { label: string; value: ThemeKey }> = {
  default: { label: 'Default', value: 'default' },
  terracotta: { label: 'Terracotta', value: 'terracotta' },
};

export function getStoredTheme(): ThemeKey {
  if (typeof window === 'undefined') return 'default';
  const saved = window.localStorage.getItem(STORAGE_KEY) as ThemeKey | null;
  return saved && themes[saved] ? saved : 'default';
}

export function setStoredTheme(theme: ThemeKey) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, theme);
}

export function applyTheme(theme: ThemeKey) {
  if (typeof document === 'undefined') return;
  document.documentElement.dataset.theme = theme;
}

export function initTheme() {
  return getStoredTheme();
}
