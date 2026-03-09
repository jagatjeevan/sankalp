'use client';

import type React from 'react';
import Link from 'next/link';
import { useState } from 'react';
import { resetPassword } from '@/lib/auth';
import { AuthLayout } from '@/components/AuthLayout';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!email.trim()) return;

    setLoading(true);
    const { error } = await resetPassword(email);
    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    setSent(true);
  };

  return (
    <AuthLayout
      title="Forgot password"
      description="Enter your email address and we’ll send a reset link."
      footer={
        <p>
          Remembered your password?{' '}
          <Link href="/login" className="font-semibold text-slate-700">
            Sign in
          </Link>
        </p>
      }
    >
      {sent ? (
        <div className="rounded-xl bg-emerald-50 px-4 py-4 text-sm text-emerald-800">
          If an account exists for <span className="font-semibold">{email}</span>, you’ll receive an
          email with a reset link shortly.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium text-slate-700" htmlFor="email">
              Email address
            </label>
            <input
              id="email"
              type="email"
              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 focus-primary"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
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
            {loading ? 'Sending…' : 'Send reset link'}
          </button>
        </form>
      )}
    </AuthLayout>
  );
}
