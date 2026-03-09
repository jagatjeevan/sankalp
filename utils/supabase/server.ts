import { readFileSync } from 'node:fs';
import { join } from 'node:path';

// This file is primarily for server-side helpers (e.g. for migrations or initializing schema).
// Supabase DDL (CREATE TABLE) typically requires service role credentials and is best run via
// Supabase SQL editor or migration tooling.

export function getSupabaseSchemaSql(): string {
  const schemaPath = join(process.cwd(), 'utils', 'supabase', 'schema.sql');
  return readFileSync(schemaPath, 'utf-8');
}

/**
 * Returns a short guide for creating the required tables.
 */
export function getCreateTablesInstructions() {
  return `
Run the SQL in utils/supabase/schema.sql using the Supabase SQL editor:

1) Open your Supabase project dashboard.
2) Go to "SQL" → "New query".
3) Paste the contents of utils/supabase/schema.sql.
4) Run the query.

Once the tables exist, the app will be able to store categories and todos per user.
`;
}
