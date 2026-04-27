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
  // 1. Verify auth and get the current store — already contains agent_persona
  const store = await getStore();
  if (!store) return { error: "לא מחובר" };

  // 2. Guard: nothing to write
  const updateKeys = Object.keys(personaUpdates);
  if (updateKeys.length === 0 && agentNameUpdate === undefined) {
    console.warn("[savePersonaTabAction] called with no updates — aborting");
    return { error: "אין שינויים לשמור" };
  }

  // 3. Deep merge — use store.agent_persona that getStore() already fetched.
  //    DO NOT make a second SELECT: if that query returns null (cookie/RLS
  //    edge cases in Server Action context) current becomes {} and the write
  //    overwrites the entire JSONB with only the current tab's fields.
  const current: Record<string, string> =
    ((store as unknown as { agent_persona?: Record<string, string> | null })
      .agent_persona) ?? {};

  // Drop undefined/null entries from the incoming updates
  const updates: Record<string, string> = {};
  for (const [k, v] of Object.entries(personaUpdates)) {
    if (v !== undefined && v !== null) updates[k] = v;
  }

  const merged: Record<string, string> = { ...current, ...updates };

  console.log(
    `[savePersonaTabAction] storeId=${store.id}`,
    `| current keys: [${Object.keys(current).join(", ")}]`,
    `| updating: [${Object.keys(updates).join(", ")}]`,
    `| merged keys: [${Object.keys(merged).join(", ")}]`,
  );

  // 4. Build the Supabase update payload
  const updateObj: Record<string, unknown> = { agent_persona: merged };
  if (agentNameUpdate !== undefined) {
    const trimmed = agentNameUpdate.trim();
    if (!trimmed) return { error: "שם הסוכן הוא שדה חובה" };
    updateObj.agent_name = trimmed;
  }

  // 5. Use service client (bypasses RLS) — guaranteed write, no cookie dependency
  const service = createServiceClient();
  const { error } = await service
    .from("stores")
    .update(updateObj)
    .eq("id", store.id);

  if (error) {
    console.error("[savePersonaTabAction] Supabase error:", error.message);
    return { error: `שגיאת שמירה: ${error.message}` };
  }

  revalidatePath("/settings/persona");

  // 6. Return the merged payload so the client can re-hydrate from the DB truth
  return { success: true, saved: merged };
}
