'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  createCategory,
  createTodo,
  deleteCategory,
  deleteTodo,
  getCategoriesWithTodos,
  updateTodoDone,
} from '@/utils/supabase/db';
import { getCurrentUser } from '@/lib/auth';
import type { CategoryWithTodos, SupabaseTodo } from '@/utils/supabase/types';
import type { ThemeKey } from '@/lib/theme';
import { applyTheme, initTheme, setStoredTheme } from '@/lib/theme';

type DashboardCategory = CategoryWithTodos;
type Task = SupabaseTodo;

type User = {
  id: string;
  email: string;
  displayName: string | null;
};

export default function TodosPage() {
  const [user, setUser] = useState<User | null>(null);
  const [categories, setCategories] = useState<DashboardCategory[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [theme] = useState<ThemeKey>(() => initTheme());

  const currentCategory = useMemo(() => {
    return categories.find((c) => c.id === selectedCategoryId) ?? categories[0] ?? null;
  }, [categories, selectedCategoryId]);

  const loadCategories = async (userId: string) => {
    const data = await getCategoriesWithTodos(userId);
    setCategories(data);
    setSelectedCategoryId((prev) => prev ?? data[0]?.id ?? null);
  };

  useEffect(() => {
    const init = async () => {
      const currentUser = await getCurrentUser();
      if (!currentUser) return;
      setUser(currentUser);
      await loadCategories(currentUser.id);
    };

    init();
  }, []);

  useEffect(() => {
    applyTheme(theme);
    setStoredTheme(theme);
  }, [theme]);

  const addCategory = async () => {
    if (!user || !newCategoryName.trim()) return;
    const category = await createCategory(user.id, newCategoryName.trim());
    setCategories((prev) => [...prev, { ...category, todos: [] }]);
    setSelectedCategoryId(category.id);
    setNewCategoryName('');
  };

  const deleteCurrentCategory = async () => {
    if (!currentCategory) return;
    await deleteCategory(currentCategory.id);
    setCategories((prev) => prev.filter((c) => c.id !== currentCategory.id));
    setSelectedCategoryId(null);
  };

  const updateCategoryTodos = (categoryId: string, updater: (todos: Task[]) => Task[]) => {
    setCategories((prev) =>
      prev.map((cat) => {
        if (cat.id !== categoryId) return cat;
        return { ...cat, todos: updater(cat.todos) };
      }),
    );
  };

  const addTask = async () => {
    if (!user || !currentCategory || !newTaskTitle.trim()) return;
    const todo = await createTodo(user.id, currentCategory.id, newTaskTitle.trim());
    updateCategoryTodos(currentCategory.id, (todos) => [...todos, todo]);
    setNewTaskTitle('');
  };

  const toggleTask = async (taskId: string) => {
    if (!currentCategory) return;
    const task = currentCategory.todos.find((t) => t.id === taskId);
    if (!task) return;
    const updated = await updateTodoDone(taskId, !task.done);
    updateCategoryTodos(currentCategory.id, (todos) =>
      todos.map((t) => (t.id === taskId ? updated : t)),
    );
  };

  const removeTask = async (taskId: string) => {
    if (!currentCategory) return;
    await deleteTodo(taskId);
    updateCategoryTodos(currentCategory.id, (todos) => todos.filter((t) => t.id !== taskId));
  };

  return (
    <main>
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-10 lg:flex-row">
        <aside className="w-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:w-90">
          <h2 className="text-lg font-semibold text-slate-900">Categories</h2>

          <div className="mt-4 flex items-center gap-2">
            <input
              value={newCategoryName}
              onChange={(event) => setNewCategoryName(event.target.value)}
              className="flex-1 h-9 rounded-xl border border-slate-200 px-3 py-1.5 focus-primary"
              placeholder="New category"
            />
            <button
              onClick={addCategory}
              className="inline-flex h-9 items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold btn-primary"
            >
              <i className="fa-solid fa-plus" aria-hidden="true" />
              <span>Add</span>
            </button>
          </div>

          <nav className="mt-6 space-y-2">
            {categories.length === 0 ? (
              <p className="text-sm text-slate-500">No categories yet — add one above.</p>
            ) : (
              categories.map((category) => (
                <div key={category.id} className="flex items-center gap-1">
                  <button
                    onClick={() => setSelectedCategoryId(category.id)}
                    className={`flex-1 block rounded-xl px-3 py-2 text-left text-sm font-semibold ${
                      category.id === currentCategory?.id
                        ? 'bg-primary text-white'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {category.name}
                  </button>
                  {category.id === currentCategory?.id && (
                    <button
                      onClick={deleteCurrentCategory}
                      className="rounded-lg bg-red-100 px-2 py-1 text-xs font-semibold text-red-600 hover:bg-red-200"
                    >
                      <i className="fa-solid fa-trash" />
                    </button>
                  )}
                </div>
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
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      addTask();
                    }
                  }}
                  className="flex-1 h-9 rounded-xl border border-slate-200 px-3 py-1.5 focus-primary"
                  placeholder="Add a new task"
                />
                <button
                  onClick={addTask}
                  className="inline-flex h-9 items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold btn-primary"
                >
                  <i className="fa-solid fa-plus" aria-hidden="true" />
                  <span>Add task</span>
                </button>
              </div>
            ) : null}
          </div>

          {currentCategory ? (
            <ul className="mt-6 space-y-3">
              {currentCategory.todos.length === 0 ? (
                <li className="rounded-xl border border-dashed border-slate-200 px-4 py-6 text-center text-sm text-slate-500">
                  No tasks yet — add one above.
                </li>
              ) : (
                currentCategory.todos.map((task) => (
                  <li
                    key={task.id}
                    className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3"
                  >
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={task.done}
                        onChange={() => toggleTask(task.id)}
                        className="h-4 w-4 rounded border-slate-300 text-primary focus-primary"
                      />
                      <span
                        className={task.done ? 'text-slate-400 line-through' : 'text-slate-800'}
                      >
                        {task.title}
                      </span>
                    </label>
                    <button
                      onClick={() => removeTask(task.id)}
                      className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-200"
                    >
                      <i className="fa-solid fa-trash" aria-hidden="true" />
                      <span>Remove</span>
                    </button>
                  </li>
                ))
              )}
            </ul>
          ) : (
            <div className="mt-12 rounded-xl border-2 border-dashed border-slate-200 py-12 text-center">
              <p className="text-slate-500">Select or create a category to start adding tasks.</p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
