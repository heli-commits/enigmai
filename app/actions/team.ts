"use server";

import { revalidatePath } from "next/cache";
import { createServiceClient } from "@/lib/supabase/server";
import { getStore } from "@/lib/auth/getStore";
import type { MemberRole, MemberStatus } from "@/lib/supabase/types";

export type InviteResult = {
  error?: string;
  member?: { id: string; name: string; email: string; role: MemberRole; status: MemberStatus };
};

export async function inviteTeamMember(
  name:  string,
  email: string,
  role:  MemberRole
): Promise<InviteResult> {
  const store = await getStore();
  if (!store) return { error: "לא מחובר" };

  const service = createServiceClient();
  const { data, error } = await service
    .from("team_members")
    .insert({ store_id: store.id, name: name.trim(), email: email.trim(), role, status: "pending" })
    .select("id, name, email, role, status")
    .single();

  if (error) return { error: error.message };

  revalidatePath("/team");
  return { member: data as InviteResult["member"] };
}

export async function removeTeamMember(id: string): Promise<{ error?: string }> {
  const store = await getStore();
  if (!store) return { error: "לא מחובר" };

  const service = createServiceClient();
  const { error } = await service
    .from("team_members")
    .delete()
    .eq("id", id)
    .eq("store_id", store.id);

  if (error) return { error: error.message };

  revalidatePath("/team");
  return {};
}
