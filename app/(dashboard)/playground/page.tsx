export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { getStore } from "@/lib/auth/getStore";
import PlaygroundClient from "./PlaygroundClient";

export default async function PlaygroundPage() {
  const store = await getStore();
  if (!store) redirect("/login");

  const s       = store as {
    name: string;
    agent_name: string;
    agent_persona?: { traits?: string; rules?: string; style?: string };
  };
  const persona = s.agent_persona ?? {};

  return (
    <PlaygroundClient
      storeName={s.name}
      agentName={s.agent_name}
      traits={persona.traits ?? ""}
      rules={persona.rules  ?? ""}
      style={persona.style  ?? ""}
    />
  );
}
