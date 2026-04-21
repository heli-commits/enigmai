export const dynamic = "force-dynamic";
import { createServerClient } from "@/lib/supabase/server";
import ProductsClient from "./ProductsClient";
import type { Product } from "@/lib/supabase/types";

const STORE_ID = process.env.DEMO_STORE_ID ?? "aaaaaaaa-0000-0000-0000-000000000001";

type ProductRow = Pick<Product, "id" | "name" | "sku" | "price" | "original_price" | "stock" | "status" | "sold_count" | "rating" | "image_url">;

export default async function ProductsPage() {
  const supabase = createServerClient();

  const { data, error } = await supabase
    .from("products")
    .select("id, name, sku, price, original_price, stock, status, sold_count, rating, image_url")
    .eq("store_id", STORE_ID)
    .neq("status", "archived")
    .order("sold_count", { ascending: false });

  if (error) {
    console.error("Supabase error (products):", error.message);
  }

  return <ProductsClient products={(data ?? []) as ProductRow[]} />;
}
