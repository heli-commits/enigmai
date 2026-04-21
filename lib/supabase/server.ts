// Server-side client – uses the SERVICE ROLE key.
// Only import this in Server Components, Route Handlers, and Server Actions.
// NEVER expose this to the browser.
import { createClient } from "@supabase/supabase-js";

export function createServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      "Missing Supabase env vars: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required"
    );
  }

  // No Database generic – query results are cast explicitly at the call-site.
  return createClient(url, key, {
    auth: { persistSession: false },
  });
}
