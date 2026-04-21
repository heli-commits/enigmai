export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { getStore } from "@/lib/auth/getStore";
import { createServerClient } from "@/lib/supabase/server";
import ChatLogsClient from "./ChatLogsClient";

export default async function ChatLogsPage() {
  const store = await getStore();
  if (!store) redirect("/login");

  const supabase = await createServerClient();
  const { data: sessions, error } = await supabase
    .from("chat_sessions")
    .select("id, summary, message_count, status, created_at, customer:customers(id, name)")
    .eq("store_id", store.id)
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) console.error("Supabase error (chat_sessions):", error.message);

  type SessionRow = {
    id: string;
    summary: string | null;
    message_count: number;
    status: string;
    created_at: string;
    customer: { id: string; name: string } | null;
  };

  return <ChatLogsClient sessions={(sessions ?? []) as unknown as SessionRow[]} />;
}
