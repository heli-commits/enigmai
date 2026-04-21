export const dynamic = "force-dynamic";
import { createServerClient } from "@/lib/supabase/server";
import ChatLogsClient from "./ChatLogsClient";

const STORE_ID = process.env.DEMO_STORE_ID ?? "aaaaaaaa-0000-0000-0000-000000000001";

export default async function ChatLogsPage() {
  const supabase = createServerClient();

  const { data: sessions, error } = await supabase
    .from("chat_sessions")
    .select(`
      id,
      summary,
      message_count,
      status,
      created_at,
      customer:customers(id, name)
    `)
    .eq("store_id", STORE_ID)
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) {
    console.error("Supabase error (chat_sessions):", error.message);
  }

  type SessionRow = {
    id: string;
    summary: string | null;
    message_count: number;
    status: string;
    created_at: string;
    customer: { id: string; name: string } | null;
  };

  return <ChatLogsClient sessions={(sessions ?? []) as SessionRow[]} />;
}
