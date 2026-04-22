export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { getStore } from "@/lib/auth/getStore";
import StoreSettingsClient from "./StoreSettingsClient";

export default async function StoreSettingsPage() {
  const store = await getStore();
  if (!store) redirect("/login");

  return (
    <StoreSettingsClient
      initial={{
        name:    (store as { name?: string }).name    ?? "",
        domain:  (store as { domain?: string | null }).domain  ?? "",
        phone:   (store as { phone?: string | null }).phone   ?? "",
        address: (store as { address?: string | null }).address ?? "",
        about:   (store as { about?: string | null }).about   ?? "",
      }}
    />
  );
}
