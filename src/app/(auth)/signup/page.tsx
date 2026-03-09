'use client';

import type React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { signUp } from '@/lib/auth';
import { AuthLayout } from '@/components/AuthLayout';

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!name.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      setError('All fields are required.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    const { error } = await signUp(email, password, name.trim());
    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    router.push('/dashboard');
  };

  return (
    <AuthLayout
      title="Create an account"
      description="Sign up to start organizing tasks in categories and keep things on track."
      footer={
        <p>
          Already have an account?{' '}
          <Link href="/login" className="font-semibold text-slate-700">
            Sign in
          </Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium text-slate-700" htmlFor="name">
            Full name
          </label>
          <input
            id="name"
            type="text"
            className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 focus-primary"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Your name"
            required
          />
        </div>

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

        <div>
          <label className="block font-medium text-slate-700" htmlFor="confirmPassword">
            Confirm password
          </label>
          <input
            id="confirmPassword"
            type="password"
            className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 focus-primary"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            placeholder="••••••••"
            required
          />
        </div>

        {error ? (
          <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
        ) : null}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl px-5 py-3 font-semibold btn-primary"
        >
          {loading ? 'Creating account…' : 'Create account'}
        </button>
      </form>
    </AuthLayout>
  );
}
