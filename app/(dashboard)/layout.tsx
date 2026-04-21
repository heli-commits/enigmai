import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import DashboardLayoutClient from "./DashboardLayoutClient";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createServerClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Fetch the user's store (creates context for all child pages)
  const { data: store } = await supabase
    .from("stores")
    .select("id, name, agent_name")
    .eq("user_id", user.id)
    .single();

  const userMeta = {
    name:      (user.user_metadata?.full_name as string | undefined) ?? user.email ?? "משתמש",
    email:     user.email ?? "",
    initials:  ((user.user_metadata?.full_name as string | undefined) ?? user.email ?? "?")[0].toUpperCase(),
    storeName: store?.name ?? "החנות שלי",
  };

  return (
    <DashboardLayoutClient userMeta={userMeta}>
      {children}
    </DashboardLayoutClient>
  );
}
