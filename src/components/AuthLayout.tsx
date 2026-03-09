'use client';

import { ReactNode } from 'react';
import styles from './AuthForm.module.scss';
import Image from 'next/image';

type AuthLayoutProps = {
  title: string;
  description: string;
  children: ReactNode;
  footer?: ReactNode;
};

export function AuthLayout({ title, description, children, footer }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16">
      <div className={styles.card}>
        <aside className={styles.left}>
          <Image
            src="/sankalp-hero.png"
            alt="Sankalp Logo"
            width={220}
            height={84}
            className="mb-2"
          />

          <p className={styles.leftSubtitle}>From Intent to Action.</p>
          <br />
          <p>
            More than just a task list, Sankalp is your personal commitment tracker. Built on the
            philosophy of steady resolve, it helps you set, track, and achieve your most important
            goals with one-pointed focus
          </p>
        </aside>

        <section className={styles.right}>
          <header className="mb-6">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">{title}</h2>
            <p className="mt-2 text-sm text-slate-600">{description}</p>
          </header>

          {children}

          {footer ? <div className="mt-6 text-center text-sm text-slate-500">{footer}</div> : null}
        </section>
      </div>
    </div>
  );
}
