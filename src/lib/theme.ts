'use client';

export type ThemeKey = 'terracotta' | 'ocean' | 'mint' | 'sunrise';

const STORAGE_KEY = 'sankalp::theme';
const DEFAULT_THEME: ThemeKey = 'terracotta';

export const themes: Record<ThemeKey, { label: string; value: ThemeKey; preview: string }> = {
  terracotta: { label: 'Terracotta', value: 'terracotta', preview: '#9f5b2d' },
  ocean: { label: 'Ocean', value: 'ocean', preview: '#0b7285' },
  mint: { label: 'Mint', value: 'mint', preview: '#2f9e44' },
  sunrise: { label: 'Sunrise', value: 'sunrise', preview: '#f76707' },
};

export function getStoredTheme(): ThemeKey {
  if (typeof window === 'undefined') return DEFAULT_THEME;
  const saved = window.localStorage.getItem(STORAGE_KEY) as ThemeKey | null;
  return saved && themes[saved] ? saved : DEFAULT_THEME;
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
