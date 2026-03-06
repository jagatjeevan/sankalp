# Sankalp — Todo List with Categories

A lightweight **Next.js** todo list app where users can create **categories** to group and segregate tasks. Each category can hold its own set of todos, making it easy to organize work, shopping, personal goals, or any other task type.

---

## 🧩 About the Project

This project is a minimal, modern Next.js application focused on:

- ✅ Creating and managing **multiple categories**
- ✅ Adding, editing, and completing **todos** inside each category
- ✅ Persisting task state locally via browser storage (or similar)
- ✅ Keeping UI components reusable and small
- ✅ Using the **App Router** (Next.js `app/` directory)

---

## 🛠 Tech Stack & Architecture

- **Next.js (App Router)** — server components by default, with `use client` only where needed.
- **React 19** — latest React features with concurrent rendering support.
- **TypeScript** — type-safe components, models, and utilities.
- **Tailwind CSS** (via `@tailwindcss/postcss`) — utility-first styling.
- **ESLint + Prettier** — code consistency and formatting (see `eslint.config.mjs` + `.prettierrc`).

### Tech details you can expand in the future

- Add **persisted storage** (IndexedDB / localStorage) or backend sync (Supabase, Firebase, etc.).
- Use **server-side data fetching** or API routes for external persistence.
- Add **authentication** and user-specific task lists.
- Use **dynamic imports** for heavy UI components to keep initial bundle size small.

---

## ▶️ Run Locally

### 1) Install dependencies

```bash
npm install
```

### 2) Run the development server

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

### 3) Lint + format (recommended)

```bash
npm run lint
npm run format
```

---

## 🧪 Build & Production

```bash
npm run build
npm run start
```

---

## 📚 Project layout (high level)

- `app/` — App Router pages, layouts, and data-fetching.
- `public/` — Static assets.
- `styles/` or `globals.css` — global styling.

---
