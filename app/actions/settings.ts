"use server";

import { revalidatePath } from "next/cache";
import { createServerClient, createServiceClient } from "@/lib/supabase/server";
import { getStore } from "@/lib/auth/getStore";

// ─── Store Settings ───────────────────────────────────────────────────────────

export type StoreSettingsState = {
  error?:   string;
  success?: boolean;
};

export async function saveStoreSettings(
  _prev: StoreSettingsState,
  formData: FormData
): Promise<StoreSettingsState> {
  const store = await getStore();
  if (!store) return { error: "לא מחובר" };

  const name    = (formData.get("name")    as string | null)?.trim() ?? "";
  const domain  = (formData.get("domain")  as string | null)?.trim() ?? null;
  const phone   = (formData.get("phone")   as string | null)?.trim() ?? null;
  const address = (formData.get("address") as string | null)?.trim() ?? null;
  const about   = (formData.get("about")   as string | null)?.trim() ?? null;

  if (!name) return { error: "שם החנות הוא שדה חובה" };

  const supabase = await createServerClient();
  const { error } = await supabase
    .from("stores")
    .update({ name, domain: domain || null, phone: phone || null, address: address || null, about: about || null })
    .eq("id", store.id);

  if (error) return { error: `שגיאת שמירה: ${error.message}` };

  revalidatePath("/settings/store");
  revalidatePath("/dashboard");
  return { success: true };
}

// ─── Agent Persona ────────────────────────────────────────────────────────────

export type PersonaSettingsState = {
  error?:   string;
  success?: boolean;
  saved?:   Record<string, string>;
};

export async function savePersonaSettings(
  _prev: PersonaSettingsState,
  formData: FormData
): Promise<PersonaSettingsState> {
  const store = await getStore();
  if (!store) return { error: "לא מחובר" };

  const agent_name = (formData.get("agent_name") as string | null)?.trim() ?? "";
  const traits     = (formData.get("traits")     as string | null)?.trim() ?? "";
  const rules      = (formData.get("rules")      as string | null)?.trim() ?? "";
  const style      = (formData.get("style")      as string | null)?.trim() ?? "";

  if (!agent_name) return { error: "שם הסוכן הוא שדה חובה" };

  const supabase = await createServerClient();
  const { error } = await supabase
    .from("stores")
    .update({ agent_name, agent_persona: { traits, rules, style } })
    .eq("id", store.id);

  if (error) return { error: `שגיאת שמירה: ${error.message}` };

  revalidatePath("/settings/persona");
  return { success: true };
}

// ─── Per-tab persona save ─────────────────────────────────────────────────────

export async function savePersonaTabAction(
  personaUpdates: Record<string, string>,
  agentNameUpdate?: string
): Promise<PersonaSettingsState> {
  // 1. Auth: only use the cookie client to verify identity and get user.id.
  //    All data operations below use the service client to eliminate RLS /
  //    cookie-session edge cases that caused agent_persona to silently read
  //    as null in the Server Action POST context.
  const authClient = await createServerClient();
  const { data: { user } } = await authClient.auth.getUser();
  if (!user) return { error: "לא מחובר" };

  // 2. Guard: nothing to write
  if (Object.keys(personaUpdates).length === 0 && agentNameUpdate === undefined) {
    console.warn("[savePersonaTabAction] called with no updates — aborting");
    return { error: "אין שינויים לשמור" };
  }

  const service = createServiceClient();

  // 3. Fresh SELECT via service client — guaranteed to return the real JSONB,
  //    no RLS policy or cookie dependency.
  const { data: storeRow, error: selectErr } = await service
    .from("stores")
    .select("id, agent_persona")
    .eq("user_id", user.id)
    .single();

  if (selectErr || !storeRow) {
    console.error("[savePersonaTabAction] SELECT failed:", selectErr?.message ?? "no row");
    return { error: "שגיאה בטעינת נתוני החנות. נסה שוב." };
  }

  // 4. Deep merge — start from the DB's authoritative current state.
  const current: Record<string, string> =
    (storeRow.agent_persona as Record<string, string> | null) ?? {};

  const updates: Record<string, string> = {};
  for (const [k, v] of Object.entries(personaUpdates)) {
    if (v !== undefined && v !== null) updates[k] = v;
  }

  const merged: Record<string, string> = { ...current, ...updates };

  // 5. "Merge or Die" — merged must contain every key that current had.
  //    { ...current, ...updates } can never drop current keys, but this guard
  //    protects against future refactors that might change the merge logic.
  const lostKeys = Object.keys(current).filter(k => !(k in merged));

  console.log(
    `[savePersonaTabAction] user=${user.id} store=${storeRow.id}`,
    `| existing: [${Object.keys(current).join(", ")}]`,
    `| incoming: [${Object.keys(updates).join(", ")}]`,
    `| merged:   [${Object.keys(merged).join(", ")}]`,
    lostKeys.length ? `| ⛔ LOST: [${lostKeys.join(", ")}] — ABORTING` : "| ✓ merge safe",
  );

  if (lostKeys.length > 0) {
    return { error: `שגיאת מיזוג פנימית (מפתחות אבודים: ${lostKeys.join(", ")}). פנה לתמיכה.` };
  }

  // 6. Write via service client
  const updateObj: Record<string, unknown> = { agent_persona: merged };
  if (agentNameUpdate !== undefined) {
    const trimmed = agentNameUpdate.trim();
    if (!trimmed) return { error: "שם הסוכן הוא שדה חובה" };
    updateObj.agent_name = trimmed;
  }

  const { error: updateErr } = await service
    .from("stores")
    .update(updateObj)
    .eq("id", storeRow.id);

  if (updateErr) {
    console.error("[savePersonaTabAction] UPDATE failed:", updateErr.message);
    return { error: `שגיאת שמירה: ${updateErr.message}` };
  }

  revalidatePath("/settings/persona");

  // 7. Return the full merged object — client re-hydrates from this DB truth.
  return { success: true, saved: merged };
}
