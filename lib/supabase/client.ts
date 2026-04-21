// Browser-side Supabase client – uses cookie-based session via @supabase/ssr.
// Safe to import in "use client" components.
import { createBrowserClient as _createBrowserClient } from "@supabase/ssr";

let _client: ReturnType<typeof _createBrowserClient> | null = null;

export function createBrowserClient() {
  if (!_client) {
    _client = _createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }
  return _client;
}
