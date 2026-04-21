"use server";

import { revalidatePath } from "next/cache";
import { createServerClient } from "@/lib/supabase/server";
import { getStore } from "@/lib/auth/getStore";
import type { ProductStatus } from "@/lib/supabase/types";

export type ProductFormState = {
  error?: string;
  fieldErrors?: Partial<Record<"name" | "sku" | "price" | "stock" | "original_price", string>>;
  success?: boolean;
};

export async function createProduct(
  _prev: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  const store = await getStore();
  if (!store) return { error: "לא מחובר" };

  const name         = (formData.get("name")           as string | null)?.trim() ?? "";
  const sku          = (formData.get("sku")            as string | null)?.trim() ?? "";
  const description  = (formData.get("description")    as string | null)?.trim() ?? "";
  const priceStr     = (formData.get("price")          as string | null) ?? "";
  const origPriceStr = (formData.get("original_price") as string | null) ?? "";
  const stockStr     = (formData.get("stock")          as string | null) ?? "0";
  const status       = ((formData.get("status") as string | null) ?? "active") as ProductStatus;

  const price     = parseFloat(priceStr);
  const origPrice = origPriceStr !== "" ? parseFloat(origPriceStr) : null;
  const stock     = parseInt(stockStr, 10);

  const fieldErrors: ProductFormState["fieldErrors"] = {};
  if (!name)                                               fieldErrors.name           = "שם מוצר חובה";
  if (isNaN(price) || price < 0)                          fieldErrors.price          = "מחיר לא תקין";
  if (origPrice !== null && (isNaN(origPrice) || origPrice <= price))
                                                          fieldErrors.original_price = "מחיר מקורי חייב להיות גבוה מהמחיר הנוכחי";
  if (isNaN(stock) || stock < 0)                          fieldErrors.stock          = "כמות במלאי לא תקינה";
  if (Object.keys(fieldErrors).length > 0) return { fieldErrors };

  const supabase = await createServerClient();
  const { error } = await supabase.from("products").insert({
    store_id:       store.id,
    name,
    sku:            sku         || null,
    description:    description || null,
    price,
    original_price: origPrice,
    stock,
    status,
    sold_count:     0,
  });

  if (error) {
    if (error.code === "23505") return { fieldErrors: { sku: "מק\"ט זה כבר קיים במערכת" } };
    return { error: `שגיאת מסד נתונים: ${error.message}` };
  }

  revalidatePath("/products");
  return { success: true };
}
