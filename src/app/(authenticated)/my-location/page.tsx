'use client';

import { useEffect, useState } from 'react';
import { getCurrentUser } from '@/lib/auth';
import { LocationWidget } from '@/components/LocationWidget';

type User = {
  id: string;
  email: string;
  displayName: string | null;
};

export default function MyLocationPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      setLoading(false);
    };

    init();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center bg-zinc-50">
        <div className="text-center">
          <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-primary" />
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <main className="bg-zinc-50">
      <div className="mx-auto max-w-4xl px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">My Location</h1>
          <p className="mt-2 text-slate-600">Track and manage your location history</p>
        </div>

        <LocationWidget userId={user.id} email={user.email} fullName={user.displayName || ''} />
      </div>
    </main>
  );
}
