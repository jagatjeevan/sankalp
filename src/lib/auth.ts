import type { Session } from '@supabase/supabase-js';
import { supabaseClient } from '@/utils/supabase/client';

export type AuthUser = {
  id: string;
  email: string;
  displayName: string | null;
};

export async function getCurrentUser(): Promise<AuthUser | null> {
  const { data } = await supabaseClient.auth.getSession();
  const user = data.session?.user;
  if (!user) return null;

  const displayName = (user.user_metadata as { full_name?: string } | undefined)?.full_name ?? null;

  return { id: user.id, email: user.email ?? '', displayName };
}

export async function signUp(email: string, password: string, fullName?: string) {
  const response = await supabaseClient.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  });
  return response;
}

export async function signIn(email: string, password: string) {
  const response = await supabaseClient.auth.signInWithPassword({ email, password });
  return response;
}

export async function signOut() {
  await supabaseClient.auth.signOut();
}

export async function resetPassword(email: string) {
  const response = await supabaseClient.auth.resetPasswordForEmail(email);
  return response;
}

export function onAuthStateChange(callback: (event: string, session: Session | null) => void) {
  return supabaseClient.auth.onAuthStateChange(callback);
}
