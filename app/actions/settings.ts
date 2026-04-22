"use server";

import { revalidatePath } from "next/cache";
import { createServerClient } from "@/lib/supabase/server";
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
