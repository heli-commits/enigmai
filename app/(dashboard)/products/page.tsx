export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { getStore } from "@/lib/auth/getStore";
import { createServerClient } from "@/lib/supabase/server";
import ProductsClient from "./ProductsClient";
import type { Product } from "@/lib/supabase/types";

type ProductRow = Pick<Product, "id" | "name" | "sku" | "price" | "original_price" | "stock" | "status" | "sold_count" | "rating" | "image_url">;

export default async function ProductsPage() {
  const store = await getStore();
  if (!store) redirect("/login");

  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from("products")
    .select("id, name, sku, price, original_price, stock, status, sold_count, rating, image_url")
    .eq("store_id", store.id)
    .neq("status", "archived")
    .order("sold_count", { ascending: false });

  if (error) console.error("Supabase error (products):", error.message);

  return <ProductsClient products={(data ?? []) as ProductRow[]} />;
}
