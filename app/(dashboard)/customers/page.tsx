export const dynamic = "force-dynamic";
import { createServerClient } from "@/lib/supabase/server";
import CustomersClient from "./CustomersClient";
import type { Customer } from "@/lib/supabase/types";

// DEMO_STORE_ID: replace with your real store id (or read from session/JWT)
const STORE_ID = process.env.DEMO_STORE_ID ?? "aaaaaaaa-0000-0000-0000-000000000001";

type CustomerRow = Pick<Customer, "id" | "name" | "email" | "status" | "total_spent" | "orders_count" | "rating" | "last_chat_at">;

export default async function CustomersPage() {
  const supabase = createServerClient();

  const { data, error } = await supabase
    .from("customers")
    .select("id, name, email, status, total_spent, orders_count, rating, last_chat_at")
    .eq("store_id", STORE_ID)
    .order("total_spent", { ascending: false });

  if (error) {
    console.error("Supabase error (customers):", error.message);
  }

  const customers = (data ?? []) as CustomerRow[];
  const totalRevenue = customers.reduce((sum, c) => sum + Number(c.total_spent), 0);
  const vipCount     = customers.filter((c) => c.status === "vip").length;

  return (
    <CustomersClient
      customers={customers}
      totalRevenue={totalRevenue}
      vipCount={vipCount}
    />
  );
}
