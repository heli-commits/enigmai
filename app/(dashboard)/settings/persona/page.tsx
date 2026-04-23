export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { getStore } from "@/lib/auth/getStore";
import PersonaClient from "./PersonaClient";

export default async function PersonaSettingsPage() {
  const store = await getStore();
  if (!store) redirect("/login");

  const p = (store as { agent_persona?: Record<string, string> }).agent_persona ?? {};

  return (
    <PersonaClient
      initial={{
        agent_name:   (store as { agent_name?: string }).agent_name ?? "ארי",
        role:         p.role         ?? "",
        greeting:     p.greeting     ?? "",
        traits:       p.traits       ?? "",
        rules:        p.rules        ?? "",
        escalation:   p.escalation   ?? "",
        style:        p.style        ?? "",
        knowledge:    p.knowledge    ?? "",
        faqs:         p.faqs         ?? "",
        restrictions: p.restrictions ?? "",
        domain:       (store as { domain?: string | null }).domain ?? "",
      }}
    />
  );
}
