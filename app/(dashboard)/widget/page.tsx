export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { getStore } from "@/lib/auth/getStore";
import WidgetPageClient from "./WidgetPageClient";

export default async function WidgetPage() {
  const store = await getStore();
  if (!store) redirect("/login");

  const s = store as { id: string; agent_name?: string };

  return (
    <WidgetPageClient
      storeId={s.id}
      agentName={s.agent_name ?? "ארי"}
    />
  );
}
