'use client';

import Link from 'next/link';

type MenuItem = {
  href: string;
  title: string;
  description: string;
  icon: string;
};

const menuItems: readonly MenuItem[] = [
  {
    href: '/todos',
    title: 'Todos',
    description: 'Organize tasks into categories and track your progress.',
    icon: 'fa-list-check',
  },
  {
    href: '/my-location',
    title: 'My Location',
    description: 'Track and manage your location history.',
    icon: 'fa-location-dot',
  },
];

export default function DashboardPage() {
  return (
    <main className="bg-gradient-to-br from-zinc-50 to-zinc-100 px-6 py-12">
      <div className="mx-auto max-w-4xl">
        <div className="mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900">Welcome</h1>
          <p className="mt-2 text-lg text-slate-600">Choose a section to continue</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-primary hover:shadow-lg"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-primary/10 opacity-0 transition-opacity group-hover:opacity-100" />

              <div className="relative">
                <div className="mb-4 inline-flex rounded-xl bg-primary/10 p-3">
                  <i className={`fa-solid ${item.icon} text-2xl text-primary`} />
                </div>

                <h3 className="text-xl font-semibold text-slate-900">{item.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{item.description}</p>

                <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-primary opacity-0 transition-all group-hover:opacity-100">
                  View <i className="fa-solid fa-arrow-right" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
