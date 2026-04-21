"use server";

import { revalidatePath } from "next/cache";
import { createServerClient } from "@/lib/supabase/server";
import type { CustomerStatus } from "@/lib/supabase/types";

export type CustomerFormState = {
  error?: string;
  fieldErrors?: Partial<Record<"name" | "email" | "phone" | "status", string>>;
  success?: boolean;
};

const STORE_ID = process.env.DEMO_STORE_ID ?? "aaaaaaaa-0000-0000-0000-000000000001";

const VALID_STATUSES: CustomerStatus[] = ["new", "regular", "vip"];

export async function createCustomer(
  _prev: CustomerFormState,
  formData: FormData
): Promise<CustomerFormState> {
  const name   = (formData.get("name")   as string | null)?.trim() ?? "";
  const email  = (formData.get("email")  as string | null)?.trim() ?? "";
  const phone  = (formData.get("phone")  as string | null)?.trim() ?? "";
  const status = (formData.get("status") as string | null) ?? "new";

  // Validate
  const fieldErrors: CustomerFormState["fieldErrors"] = {};
  if (!name)                            fieldErrors.name   = "שם חובה";
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
                                        fieldErrors.email  = "כתובת אימייל לא תקינה";
  if (!VALID_STATUSES.includes(status as CustomerStatus))
                                        fieldErrors.status = "סטטוס לא חוקי";

  if (Object.keys(fieldErrors).length > 0) return { fieldErrors };

  const supabase = createServerClient();

  const { error } = await supabase.from("customers").insert({
    store_id:     STORE_ID,
    name,
    email:        email  || null,
    phone:        phone  || null,
    status:       status as CustomerStatus,
    total_spent:  0,
    orders_count: 0,
  });

  if (error) {
    // Duplicate email
    if (error.code === "23505") {
      return { fieldErrors: { email: "כתובת אימייל כבר קיימת במערכת" } };
    }
    return { error: `שגיאת מסד נתונים: ${error.message}` };
  }

  revalidatePath("/customers");
  return { success: true };
}
