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

export type SupabaseLocationHistoryItem = {
  lat: number;
  lng: number;
  at: string;
};

export type SupabaseLocation = {
  id: string;
  user_id: string;
  email: string;
  full_name: string;
  latitude: number;
  longitude: number;
  location_history: SupabaseLocationHistoryItem[];
  created_at: string;
};

export type CategoryWithTodos = SupabaseCategory & {
  todos: SupabaseTodo[];
};
