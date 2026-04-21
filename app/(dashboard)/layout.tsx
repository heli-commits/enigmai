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

import DashboardLayoutClient from "./DashboardLayoutClient";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayoutClient>{children}</DashboardLayoutClient>;
}
