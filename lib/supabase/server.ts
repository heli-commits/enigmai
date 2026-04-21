// Server-side client – uses the SERVICE ROLE key.
// Only import this in Server Components, Route Handlers, and Server Actions.
// NEVER expose this to the browser.
import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

export function createServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      "Missing Supabase env vars: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required"
    );
  }

  return createClient<Database>(url, key, {
    auth: { persistSession: false },
  });
}
