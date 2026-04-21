"use server";

import { redirect } from "next/navigation";
import { createServerClient, createServiceClient } from "@/lib/supabase/server";

// ─── Types ────────────────────────────────────────────────────────────────────

export type AuthFormState = {
  error?: string;
  fieldErrors?: Partial<Record<"email" | "password" | "name", string>>;
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ─── Login ────────────────────────────────────────────────────────────────────

export async function login(
  _prev: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const email    = (formData.get("email")    as string).trim();
  const password = (formData.get("password") as string);

  const fieldErrors: AuthFormState["fieldErrors"] = {};
  if (!email || !validateEmail(email))  fieldErrors.email    = "אימייל לא תקין";
  if (!password || password.length < 6) fieldErrors.password = "סיסמה חייבת להכיל לפחות 6 תווים";
  if (Object.keys(fieldErrors).length)  return { fieldErrors };

  const supabase = await createServerClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    if (error.code === "invalid_credentials") {
      return { error: "אימייל או סיסמה שגויים" };
    }
    return { error: error.message };
  }

  redirect("/dashboard");
}

// ─── Signup ───────────────────────────────────────────────────────────────────

export async function signup(
  _prev: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const name      = (formData.get("name")      as string).trim();
  const storeName = (formData.get("storeName") as string).trim();
  const email     = (formData.get("email")     as string).trim();
  const password  = (formData.get("password")  as string);

  const fieldErrors: AuthFormState["fieldErrors"] = {};
  if (!name)                              fieldErrors.name     = "שם חובה";
  if (!email || !validateEmail(email))    fieldErrors.email    = "אימייל לא תקין";
  if (!password || password.length < 6)  fieldErrors.password = "סיסמה חייבת להכיל לפחות 6 תווים";
  if (Object.keys(fieldErrors).length)   return { fieldErrors };

  const supabase = await createServerClient();

  // 1. Create auth user
  const { data: authData, error: signupErr } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: name } },
  });

  if (signupErr) {
    if (signupErr.code === "user_already_exists") {
      return { fieldErrors: { email: "כתובת אימייל כבר רשומה במערכת" } };
    }
    return { error: signupErr.message };
  }

  const userId = authData.user?.id;
  if (!userId) return { error: "שגיאה ביצירת המשתמש" };

  // 2. Create the store row – use service client so RLS doesn't block on first insert
  const service = createServiceClient();
  const { error: storeErr } = await service.from("stores").insert({
    user_id:    userId,
    name:       storeName || `החנות של ${name}`,
    agent_name: "ארי",
    agent_persona: {},
  });

  if (storeErr) {
    console.error("Store create error:", storeErr.message);
    // Auth user was created – don't leave them orphaned; still proceed
  }

  redirect("/dashboard");
}

// ─── Logout ───────────────────────────────────────────────────────────────────

export async function logout() {
  const supabase = await createServerClient();
  await supabase.auth.signOut();
  redirect("/login");
}
