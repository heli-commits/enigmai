"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createServerClient, createServiceClient } from "@/lib/supabase/server";

// ─── Types ────────────────────────────────────────────────────────────────────

export type AuthFormState = {
  error?: string;
  fieldErrors?: Partial<Record<"email" | "password" | "name", string>>;
  success?: boolean;
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
    if (error.code === "invalid_credentials")   return { error: "אימייל או סיסמה שגויים" };
    if (error.code === "email_not_confirmed")   return { error: "האימייל שלך טרם אושר. בדקי את תיבת הדואר ולחצי על קישור האימות." };
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
  }

  // Email confirmation is required – don't redirect yet, show success message
  return { success: true };
}

// ─── Logout ───────────────────────────────────────────────────────────────────

export async function logout() {
  const supabase = await createServerClient();
  await supabase.auth.signOut();
  redirect("/login");
}

// ─── Forgot password ─────────────────────────────────────────────────────────

export type PasswordResetState = {
  error?:   string;
  success?: boolean;
};

export async function requestPasswordReset(
  _prev: PasswordResetState,
  formData: FormData
): Promise<PasswordResetState> {
  const email = (formData.get("email") as string | null)?.trim() ?? "";

  if (!email || !validateEmail(email)) {
    return { error: "אנא הזן כתובת אימייל תקינה" };
  }

  // Derive origin from the incoming request so it works on every environment
  // without requiring an extra env variable.
  const headersList = await headers();
  const host  = headersList.get("host") ?? "localhost:3000";
  const proto = headersList.get("x-forwarded-proto") ?? "http";
  const origin = `${proto}://${host}`;

  const supabase = await createServerClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?next=/update-password`,
  });

  if (error) return { error: error.message };

  // Always return success to prevent email-enumeration attacks
  return { success: true };
}

// ─── Update password (after reset link) ──────────────────────────────────────

export type UpdatePasswordState = {
  error?:   string;
  success?: boolean;
};

export async function updatePassword(
  _prev: UpdatePasswordState,
  formData: FormData
): Promise<UpdatePasswordState> {
  const password = (formData.get("password") as string | null) ?? "";
  const confirm  = (formData.get("confirm")  as string | null) ?? "";

  if (!password || password.length < 6) {
    return { error: "סיסמה חייבת להכיל לפחות 6 תווים" };
  }
  if (password !== confirm) {
    return { error: "הסיסמאות אינן תואמות" };
  }

  const supabase = await createServerClient();
  const { error } = await supabase.auth.updateUser({ password });

  if (error) return { error: error.message };

  redirect("/dashboard");
}
