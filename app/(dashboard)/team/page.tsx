export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { createServerClient, createServiceClient } from "@/lib/supabase/server";
import { getStore } from "@/lib/auth/getStore";
import TeamPageClient from "./TeamPageClient";

export default async function TeamPage() {
  const store = await getStore();
  if (!store) redirect("/login");

  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const service = createServiceClient();
  const { data: members } = await service
    .from("team_members")
    .select("id, name, email, role, status")
    .eq("store_id", store.id)
    .order("created_at", { ascending: true });

  const ownerName = (user.user_metadata?.full_name as string | undefined)
    ?? user.email
    ?? "בעלים";

  return (
    <TeamPageClient
      owner={{ id: user.id, name: ownerName, email: user.email ?? "" }}
      initialMembers={members ?? []}
    />
  );
}
