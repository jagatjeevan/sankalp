'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { clearAuthUser, getAuthUser } from '@/lib/auth';
import Image from 'next/image';

type Task = {
  id: string;
  title: string;
  done: boolean;
};

type Category = {
  id: string;
  name: string;
  tasks: Task[];
};

const STORAGE_KEY = 'sankalp::dashboard';

function loadDashboard(): Category[] {
  if (typeof window === 'undefined') return [];
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as Category[];
  } catch {
    return [];
  }
}

function saveDashboard(categories: Category[]) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(categories));
}

function generateId() {
  return crypto.randomUUID();
}

export default function DashboardPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const currentCategory = useMemo(() => {
    return categories.find((c) => c.id === selectedCategoryId) ?? categories[0] ?? null;
  }, [categories, selectedCategoryId]);

  useEffect(() => {
    if (!getAuthUser()) {
      router.replace('/login');
      return;
    }

    const loaded = loadDashboard();
    setCategories(loaded);
    if (loaded.length > 0) setSelectedCategoryId(loaded[0].id);
  }, [router]);

  useEffect(() => {
    saveDashboard(categories);
  }, [categories]);

  const handleLogout = () => {
    clearAuthUser();
    router.replace('/login');
  };

  const addCategory = () => {
    if (!newCategoryName.trim()) return;
    const next: Category = {
      id: generateId(),
      name: newCategoryName.trim(),
      tasks: [],
    };
    setCategories((prev) => [...prev, next]);
    setSelectedCategoryId(next.id);
    setNewCategoryName('');
  };

  const addTask = () => {
    if (!currentCategory || !newTaskTitle.trim()) return;
    const task: Task = { id: generateId(), title: newTaskTitle.trim(), done: false };
    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === currentCategory.id ? { ...cat, tasks: [...cat.tasks, task] } : cat,
      ),
    );
    setNewTaskTitle('');
  };

  const toggleTask = (taskId: string) => {
    if (!currentCategory) return;
    setCategories((prev) =>
      prev.map((cat) => {
        if (cat.id !== currentCategory.id) return cat;
        return {
          ...cat,
          tasks: cat.tasks.map((task) =>
            task.id === taskId ? { ...task, done: !task.done } : task,
          ),
        };
      }),
    );
  };

  const removeTask = (taskId: string) => {
    if (!currentCategory) return;
    setCategories((prev) =>
      prev.map((cat) => {
        if (cat.id !== currentCategory.id) return cat;
        return {
          ...cat,
          tasks: cat.tasks.filter((task) => task.id !== taskId),
        };
      }),
    );
  };

  return (
    <div className="min-h-screen bg-zinc-50">
      <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
        <div>
          <Image src="/sankalp-hero.png" alt="Sankalp Logo" width={110} height={42} />
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-slate-700">{getAuthUser()?.email ?? ''}</span>
          <button
            onClick={handleLogout}
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
          >
            Sign out
          </button>
        </div>
      </header>

      <main className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-10 lg:flex-row">
        <aside className="w-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:w-80">
          <h2 className="text-lg font-semibold text-slate-900">Categories</h2>

          <div className="mt-4 flex gap-2">
            <input
              value={newCategoryName}
              onChange={(event) => setNewCategoryName(event.target.value)}
              className="flex-1 rounded-xl border border-slate-200 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
              placeholder="New category"
            />
            <button
              onClick={addCategory}
              className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
            >
              Add
            </button>
          </div>

          <nav className="mt-6 space-y-2">
            {categories.length === 0 ? (
              <p className="text-sm text-slate-500">No categories yet — add one above.</p>
            ) : (
              categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategoryId(category.id)}
                  className={`block w-full rounded-xl px-3 py-2 text-left text-sm font-semibold ${
                    category.id === currentCategory?.id
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {category.name}
                </button>
              ))
            )}
          </nav>
        </aside>

        <section className="flex-1 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                {currentCategory?.name ?? 'Select a category'}
              </h2>
              <p className="text-sm text-slate-600">
                {currentCategory
                  ? 'Add tasks and mark them complete as you progress.'
                  : 'Choose a category from the left to start adding tasks.'}
              </p>
            </div>

            {currentCategory ? (
              <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center">
                <input
                  value={newTaskTitle}
                  onChange={(event) => setNewTaskTitle(event.target.value)}
                  className="flex-1 rounded-xl border border-slate-200 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                  placeholder="Add a new task"
                />
                <button
                  onClick={addTask}
                  className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
                >
                  Add task
                </button>
              </div>
            ) : null}
          </div>

          {currentCategory ? (
            <ul className="mt-6 space-y-3">
              {currentCategory.tasks.length === 0 ? (
                <li className="rounded-xl border border-dashed border-slate-200 px-4 py-6 text-center text-sm text-slate-500">
                  No tasks yet — add one above.
                </li>
              ) : (
                currentCategory.tasks.map((task) => (
                  <li
                    key={task.id}
                    className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3"
                  >
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={task.done}
                        onChange={() => toggleTask(task.id)}
                        className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span
                        className={task.done ? 'text-slate-400 line-through' : 'text-slate-800'}
                      >
                        {task.title}
                      </span>
                    </label>
                    <button
                      onClick={() => removeTask(task.id)}
                      className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-200"
                    >
                      Remove
                    </button>
                  </li>
                ))
              )}
            </ul>
          ) : null}
        </section>
      </main>
    </div>
  );
}
