export type SupabaseCategory = {
  id: string;
  user_id: string;
  name: string;
  created_at: string;
};

export type SupabaseTodo = {
  id: string;
  user_id: string;
  category_id: string;
  title: string;
  done: boolean;
  created_at: string;
};

export type CategoryWithTodos = SupabaseCategory & {
  todos: SupabaseTodo[];
};
