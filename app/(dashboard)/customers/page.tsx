export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { getStore } from "@/lib/auth/getStore";
import { createServerClient } from "@/lib/supabase/server";
import CustomersClient from "./CustomersClient";
import type { Customer } from "@/lib/supabase/types";

type CustomerRow = Pick<Customer, "id" | "name" | "email" | "phone" | "status" | "total_spent" | "orders_count" | "rating" | "last_chat_at">;

export default async function CustomersPage() {
  const store = await getStore();
  if (!store) redirect("/login");

  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from("customers")
    .select("id, name, email, phone, status, total_spent, orders_count, rating, last_chat_at")
    .eq("store_id", store.id)
    .order("total_spent", { ascending: false });

  if (error) console.error("Supabase error (customers):", error.message);

  const customers    = (data ?? []) as CustomerRow[];
  const totalRevenue = customers.reduce((sum, c) => sum + Number(c.total_spent), 0);
  const vipCount     = customers.filter((c) => c.status === "vip").length;

  return (
    <CustomersClient customers={customers} totalRevenue={totalRevenue} vipCount={vipCount} />
  );
}
