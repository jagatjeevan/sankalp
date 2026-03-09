'use client';

import type React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { signIn } from '@/lib/auth';
import { AuthLayout } from '@/components/AuthLayout';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password.');
      return;
    }

    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    router.push('/dashboard');
  };

  return (
    <AuthLayout
      title="Sign in"
      description="Enter your details to access your organized task dashboard."
      footer={
        <p>
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="font-semibold text-primary">
            Sign up
          </Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium text-slate-700" htmlFor="email">
            Email address
          </label>
          <input
            id="email"
            type="email"
            className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 focus-primary"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            required
          />
        </div>

        <div>
          <label className="block font-medium text-slate-700" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 focus-primary"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="••••••••"
            required
          />
        </div>

        {error ? (
          <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
        ) : null}

        <div className="flex items-center justify-between">
          <button
            type="submit"
            disabled={loading}
            className="rounded-xl px-5 py-3 font-semibold btn-primary"
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
          <Link
            href="/forgot-password"
            className="text-sm font-semibold text-primary hover:underline"
          >
            Forgot password?
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
}
