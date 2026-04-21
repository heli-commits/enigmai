"use client";

import { usePathname } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import TopBar from "@/components/layout/TopBar";

const pageTitles: Record<string, string> = {
  "/dashboard": "לוח בקרה",
  "/chat-logs": "יומן שיחות",
  "/support": "תור תמיכה",
  "/customers": "לקוחות",
  "/products": "מוצרים",
  "/automations": "אוטומציות",
  "/campaigns": "קמפיינים",
  "/team": "צוות",
  "/settings/store": "אודות החנות",
  "/settings/persona": "אופי הסוכן",
  "/settings/integrations": "אינטגרציות",
  "/widget": "ווידג'ט צ'אט",
};

export default function DashboardLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const title = pageTitles[pathname] || "EnigmAI";

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 mr-64 flex flex-col min-h-screen">
        <TopBar title={title} />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
