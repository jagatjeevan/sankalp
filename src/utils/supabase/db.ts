import { supabaseClient } from './client';
import type { CategoryWithTodos, SupabaseLocation, SupabaseTodo } from './types';

export async function getCategoriesWithTodos(userId: string): Promise<CategoryWithTodos[]> {
  const { data, error } = await supabaseClient
    .from('categories')
    .select('*, todos(*)')
    .eq('user_id', userId)
    .order('created_at', { ascending: true });

  if (error) {
    throw error;
  }

  return (data as unknown as CategoryWithTodos[]) ?? [];
}

export async function createCategory(userId: string, name: string) {
  const { data, error } = await supabaseClient
    .from('categories')
    .insert({ user_id: userId, name })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function deleteCategory(categoryId: string) {
  const { error } = await supabaseClient.from('categories').delete().eq('id', categoryId);
  if (error) {
    throw error;
  }
}

export async function createTodo(userId: string, categoryId: string, title: string) {
  const { data, error } = await supabaseClient
    .from('todos')
    .insert({ user_id: userId, category_id: categoryId, title })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function updateTodoDone(todoId: string, done: boolean) {
  const { data, error } = await supabaseClient
    .from('todos')
    .update({ done })
    .eq('id', todoId)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data as unknown as SupabaseTodo;
}

export async function deleteTodo(todoId: string) {
  const { error } = await supabaseClient.from('todos').delete().eq('id', todoId);
  if (error) {
    throw error;
  }
}

export async function upsertUserLocation(
  userId: string,
  email: string,
  fullName: string,
  latitude: number,
  longitude: number,
): Promise<SupabaseLocation> {
  // Fetch existing record to maintain a location history
  const { data: existing, error: fetchError } = await supabaseClient
    .from('user_locations')
    .select('location_history')
    .eq('user_id', userId)
    .single();

  if (fetchError && fetchError.code !== 'PGRST116') {
    // PGRST116 is "No rows found"; it's fine if this is the first insert
    throw fetchError;
  }

  const now = new Date().toISOString();
  const newEntry = { lat: latitude, lng: longitude, at: now };

  const existingHistory = Array.isArray(existing?.location_history)
    ? existing.location_history
    : [];
  const nextHistory = [...existingHistory, newEntry].slice(-30);

  const { data, error } = await supabaseClient
    .from('user_locations')
    .upsert(
      {
        user_id: userId,
        email,
        full_name: fullName,
        latitude,
        longitude,
        location_history: nextHistory,
      },
      { onConflict: 'user_id' },
    )
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data as unknown as SupabaseLocation;
}
