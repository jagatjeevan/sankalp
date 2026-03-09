'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { applyTheme, getStoredTheme, setStoredTheme, themes, type ThemeKey } from '@/lib/theme';

const POSITION_KEY = 'sankalp::themeSwitcherPosition';

type Position = { x: number; y: number };
const INITIAL_POSITION: Position = { x: 24, y: 24 };
const BUTTON_SIZE = 40;
const VIEWPORT_MARGIN = 12;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function clampToViewport(position: Position) {
  const maxX = window.innerWidth - BUTTON_SIZE - VIEWPORT_MARGIN;
  const maxY = window.innerHeight - BUTTON_SIZE - VIEWPORT_MARGIN;
  return {
    x: clamp(position.x, VIEWPORT_MARGIN, Math.max(maxX, VIEWPORT_MARGIN)),
    y: clamp(position.y, VIEWPORT_MARGIN, Math.max(maxY, VIEWPORT_MARGIN)),
  };
}

function loadPosition(): Position {
  try {
    const raw = window.localStorage.getItem(POSITION_KEY);
    if (!raw) return INITIAL_POSITION;

    const parsed = JSON.parse(raw) as Position;
    if (Number.isNaN(parsed?.x) || Number.isNaN(parsed?.y)) return INITIAL_POSITION;

    return clampToViewport(parsed);
  } catch {
    return INITIAL_POSITION;
  }
}

function savePosition(position: Position) {
  window.localStorage.setItem(POSITION_KEY, JSON.stringify(position));
}

export function ThemeSwitcher() {
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState<ThemeKey>(() => getStoredTheme());
  const [position, setPosition] = useState<Position>(INITIAL_POSITION);
  const [dragging, setDragging] = useState(false);
  const [placement, setPlacement] = useState({ vertical: 'bottom', horizontal: 'left' } as {
    vertical: 'bottom' | 'top';
    horizontal: 'left' | 'right';
  });
  const containerRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const themeOptions = useMemo(() => Object.values(themes), []);

  // Apply the theme and persist it whenever it changes.
  useEffect(() => {
    applyTheme(theme);
    setStoredTheme(theme);
  }, [theme]);

  // Load persisted state from localStorage after the component mounts.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTheme(getStoredTheme());
    setPosition(loadPosition());
  }, []);

  useEffect(() => {
    const handleMouseUp = () => setDragging(false);
    const handleMouseMove = (event: MouseEvent) => {
      if (!dragging) return;
      setPosition((prev) => {
        const next = clampToViewport({ x: prev.x + event.movementX, y: prev.y + event.movementY });
        savePosition(next);
        return next;
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragging]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!open) return;
      if (!containerRef.current) return;
      if (containerRef.current.contains(event.target as Node)) return;
      setOpen(false);
    };

    window.addEventListener('mousedown', handleClickOutside);
    return () => window.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const computePlacement = () => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const popupWidth = 208; // approximate from w-52
    const popupHeight = 160; // approximate

    const vertical = rect.bottom + popupHeight > window.innerHeight ? 'top' : 'bottom';
    const horizontal = rect.left + popupWidth > window.innerWidth ? 'right' : 'left';

    setPlacement({ vertical, horizontal });
  };

  const toggleOpen = () => {
    setOpen((value) => {
      const next = !value;
      if (next) computePlacement();
      return next;
    });
  };

  const onThemeSelect = (value: ThemeKey) => {
    setTheme(value);
    setOpen(false);
  };

  return (
    <div
      ref={containerRef}
      style={{ top: `${position.y}px`, left: `${position.x}px` }}
      className="fixed z-50"
    >
      <button
        ref={buttonRef}
        onClick={toggleOpen}
        onMouseDown={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white shadow-lg transition hover:shadow-xl"
        aria-label="Open theme switcher"
      >
        <i className="fas fa-palette text-lg text-slate-700" aria-hidden="true" />
      </button>

      {open ? (
        <div
          className={`absolute w-52 rounded-xl border border-slate-200 bg-white p-3 shadow-lg ${
            placement.vertical === 'bottom' ? 'top-full mt-2' : 'bottom-full mb-2'
          } ${placement.horizontal === 'left' ? 'left-0' : 'right-0'}`}
        >
          <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Choose theme
          </div>
          <div className="flex flex-wrap gap-2">
            {themeOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => onThemeSelect(option.value)}
                className={`flex h-10 w-10 items-center justify-center rounded-lg border text-xs font-semibold transition ${
                  theme === option.value
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
                style={{
                  backgroundColor: option.preview,
                  color: '#ffffff',
                }}
                title={option.label}
              >
                {option.label[0]}
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
