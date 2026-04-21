"use server";

import { revalidatePath } from "next/cache";
import { createServerClient } from "@/lib/supabase/server";
import type { ProductStatus } from "@/lib/supabase/types";

export type ProductFormState = {
  error?: string;
  fieldErrors?: Partial<Record<"name" | "sku" | "price" | "stock" | "original_price", string>>;
  success?: boolean;
};

const STORE_ID = process.env.DEMO_STORE_ID ?? "aaaaaaaa-0000-0000-0000-000000000001";

export async function createProduct(
  _prev: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  const name           = (formData.get("name")           as string | null)?.trim() ?? "";
  const sku            = (formData.get("sku")            as string | null)?.trim() ?? "";
  const description    = (formData.get("description")    as string | null)?.trim() ?? "";
  const priceStr       = (formData.get("price")          as string | null) ?? "";
  const origPriceStr   = (formData.get("original_price") as string | null) ?? "";
  const stockStr       = (formData.get("stock")          as string | null) ?? "0";
  const statusRaw      = (formData.get("status")         as string | null) ?? "active";

  // Parse numbers
  const price        = parseFloat(priceStr);
  const origPrice    = origPriceStr !== "" ? parseFloat(origPriceStr) : null;
  const stock        = parseInt(stockStr, 10);
  const status       = statusRaw as ProductStatus;

  // Validate
  const fieldErrors: ProductFormState["fieldErrors"] = {};
  if (!name)                                   fieldErrors.name  = "שם מוצר חובה";
  if (isNaN(price) || price < 0)               fieldErrors.price = "מחיר לא תקין";
  if (origPrice !== null && (isNaN(origPrice) || origPrice <= price))
                                               fieldErrors.original_price = "מחיר מקורי חייב להיות גבוה מהמחיר הנוכחי";
  if (isNaN(stock) || stock < 0)               fieldErrors.stock = "כמות במלאי לא תקינה";

  if (Object.keys(fieldErrors).length > 0) return { fieldErrors };

  const supabase = createServerClient();

  const { error } = await supabase.from("products").insert({
    store_id:       STORE_ID,
    name,
    sku:            sku          || null,
    description:    description  || null,
    price,
    original_price: origPrice,
    stock,
    status,
    sold_count:     0,
  });

  if (error) {
    // Duplicate SKU
    if (error.code === "23505") {
      return { fieldErrors: { sku: "מק\"ט זה כבר קיים במערכת" } };
    }
    return { error: `שגיאת מסד נתונים: ${error.message}` };
  }

  revalidatePath("/products");
  return { success: true };
}
