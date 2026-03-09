import { supabaseClient } from './client';
import type { CategoryWithTodos, SupabaseTodo } from './types';

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
