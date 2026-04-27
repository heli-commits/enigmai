export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { createServerClient, createServiceClient } from "@/lib/supabase/server";
import PersonaClient from "./PersonaClient";

export default async function PersonaSettingsPage() {
  // Auth via cookie client — only needed to get user.id
  const authClient = await createServerClient();
  const { data: { user } } = await authClient.auth.getUser();
  if (!user) redirect("/login");

  // Data via service client — bypasses RLS, guaranteed fresh read every request
  const service = createServiceClient();
  const { data: store } = await service
    .from("stores")
    .select("id, agent_name, agent_persona, domain")
    .eq("user_id", user.id)
    .single();

  if (!store) redirect("/login");

  const p = (store.agent_persona as Record<string, string> | null) ?? {};

  return (
    <PersonaClient
      initial={{
        agent_name:   (store.agent_name  as string)        ?? "ארי",
        role:         p.role         ?? "",
        greeting:     p.greeting     ?? "",
        traits:       p.traits       ?? "",
        rules:        p.rules        ?? "",
        escalation:   p.escalation   ?? "",
        style:        p.style        ?? "",
        knowledge:    p.knowledge    ?? "",
        faqs:         p.faqs         ?? "",
        restrictions: p.restrictions ?? "",
        domain:       (store.domain as string | null) ?? "",
      }}
      lastSyncedAt={new Date().toISOString()}
    />
  );
}
