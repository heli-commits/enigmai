export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { getStore } from "@/lib/auth/getStore";
import PersonaClient from "./PersonaClient";

export default async function PersonaSettingsPage() {
  const store = await getStore();
  if (!store) redirect("/login");

  const persona = (store as { agent_persona?: { traits?: string; rules?: string; style?: string } }).agent_persona ?? {};

  return (
    <PersonaClient
      initial={{
        agent_name: (store as { agent_name?: string }).agent_name ?? "ארי",
        traits:     persona.traits ?? "",
        rules:      persona.rules  ?? "",
        style:      persona.style  ?? "",
      }}
    />
  );
}
