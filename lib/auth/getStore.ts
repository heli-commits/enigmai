// Resolves the authenticated user's store.
// Returns null if user is not logged in or has no store.
import { createServerClient } from "@/lib/supabase/server";
import { cache } from "react";

export const getStore = cache(async () => {
  const supabase = await createServerClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: store } = await supabase
    .from("stores")
    .select("id, name, agent_name, agent_persona, about")
    .eq("user_id", user.id)
    .single();

  return store ?? null;
});
