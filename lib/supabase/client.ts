// Browser-side client – uses the ANON (public) key.
// Safe to import in Client Components ("use client").
// RLS policies on Supabase control what this key can access.
import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Singleton – reuse across re-renders
let _client: ReturnType<typeof createClient<Database>> | null = null;

export function createBrowserClient() {
  if (!_client) {
    _client = createClient<Database>(url, anonKey);
  }
  return _client;
}
