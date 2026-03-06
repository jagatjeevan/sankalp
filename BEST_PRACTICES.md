# Best Practices (Next.js + Reusability + Performance)

This document is meant to be a quick reference for the agent and engineers working in this repository. It emphasizes **reusability**, **performance**, **maintainability**, and **Next.js conventions**.

---

## 1) Project Structure + Reusability

- **Use the `app/` directory (App Router)** for layouts, pages, and server components.
- **Keep components small and focused** (single responsibility). Prefer `components/` and `ui/` folders for reusable pieces.
- **Avoid duplication**: If logic is shared across pages, extract it to a hook (e.g., `hooks/useSomething.ts`) or a utility function (e.g., `lib/*`).
- **Use feature folders** when logic is tightly coupled: `features/<featureName>/...` with `components`, `hooks`, and `types` co-located.
- **Export reusable components** from index files (barrel files) for cleaner imports.

---

## 2) Next.js Performance Best Practices

- **Prefer Server Components** by default (`use client` only when needed). Server components are fast, smaller footprints, and don’t bundle React on the client.
- **Use `next/image`** for images and `next/font` for fonts (automatic optimization and smaller bundles).
- **Use `next/link`** for client-side navigation.
- **Prefer `getStaticProps` / `getStaticPaths` / `getServerSideProps` equivalents** in the App Router:
  - Use `generateStaticParams` + `fetch` in `page.tsx` for static generation.
  - Keep data fetching close to the component that needs it (co-locate fetch logic in server components when possible).
- **Avoid large JSON payloads**; paginate or lazy-load data.
- **Leverage streaming** via Server Components and `Suspense` boundaries for faster first contentful paint.

---

## 3) Code Quality & Maintainability

- **TypeScript everywhere** (no `any` unless absolutely necessary). Prefer strict mode (see `tsconfig.json`).
- **Use linting and formatting**: keep ESLint and Prettier consistent. Follow rules in `eslint.config.mjs`.
- **Write descriptive names** for components, hooks, and data models.
- **Keep logic out of JSX**: pull complex computations into helper functions.
- **Use `React.memo`, `useMemo`, `useCallback`** only when proven necessary (avoid premature optimization).

---

## 4) Accessibility & UX

- **Always include `alt` text** for images.
- **Use semantic HTML** (e.g., `<main>`, `<header>`, `<section>`, `<button>`).
- **Make interactive elements keyboard accessible** and follow ARIA best practices when needed.

---

## 5) Performance - Bundle / Client-Side Impact

- **Avoid importing large libraries** in client components unless needed.
- **Split code via dynamic imports** (`next/dynamic`) for expensive components.
- **Use `React.lazy` + `Suspense`** when lazy-loading non-essential UI.
- **Favor CSS Modules / Tailwind / CSS-in-JS** patterns that scope CSS and avoid global overrides.

---

## 6) When asking the agent for code changes

When requesting changes from the agent, include:
- The **goal** (e.g., improve performance, fix bug, refactor into reusable component).
- Any existing file paths or component names.
- Expected behavior or outcome (e.g., “should render on server”, “should avoid client bundle”).

This helps the agent suggest changes that follow this repository’s conventions.
