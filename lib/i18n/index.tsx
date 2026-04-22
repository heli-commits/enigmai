"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";

export type Lang = "he" | "en";

// Per-page titles used by DashboardLayoutClient
export const PAGE_TITLES: Record<string, { he: string; en: string }> = {
  "/dashboard":             { he: "לוח בקרה",          en: "Dashboard" },
  "/chat-logs":             { he: "יומן שיחות",         en: "Chat Logs" },
  "/support":               { he: "תור תמיכה",          en: "Support Queue" },
  "/customers":             { he: "לקוחות",             en: "Customers" },
  "/products":              { he: "מוצרים",             en: "Products" },
  "/automations":           { he: "אוטומציות",          en: "Automations" },
  "/campaigns":             { he: "קמפיינים",           en: "Campaigns" },
  "/team":                  { he: "צוות",               en: "Team" },
  "/settings/store":        { he: "אודות החנות",        en: "Store Info" },
  "/settings/persona":      { he: "אופי הסוכן",         en: "Agent Persona" },
  "/settings/integrations": { he: "אינטגרציות",         en: "Integrations" },
  "/widget":                { he: "ווידג'ט צ'אט",       en: "Chat Widget" },
  "/playground":            { he: "מגרש משחקים – AI",   en: "AI Playground" },
};

export const STRINGS = {
  he: {
    dir:   "rtl" as const,
    // Sidebar
    nav: {
      dashboard:            "לוח בקרה",
      chatLogs:             "יומן שיחות",
      support:              "תור תמיכה",
      customers:            "לקוחות",
      products:             "מוצרים",
      automations:          "אוטומציות",
      campaigns:            "קמפיינים",
      team:                 "צוות",
      settings:             "הגדרות",
      widget:               "ווידג'ט צ'אט",
      admin:                "פאנל ניהול",
      settingsStore:        "אודות החנות",
      settingsPersona:      "אופי הסוכן",
      settingsIntegrations: "אינטגרציות",
      playground:           "מגרש משחקים",
    },
    // TopBar
    accountSettings: "הגדרות חשבון",
    logout:          "התנתקות",
    notifications:   "התראות",
    noNotifications: "אין התראות חדשות",
    // Date
    lastUpdated:     "עודכן לאחרונה",
    today:           "היום",
    // Customers
    addCustomer:     "הוסף לקוח",
    totalCustomers:  'סה"כ לקוחות',
    vipCustomers:    "לקוחות VIP",
    totalRevenue:    'סה"כ הכנסות',
    searchCustomers: "חיפוש לפי שם או אימייל...",
    noCustomers:     "עדיין אין לקוחות",
    noCustomersHint: "הוסף את הלקוח הראשון שלך כדי להתחיל",
    noResults:       "לא נמצאו תוצאות",
    // Customers table headers
    colName:         "שם לקוח",
    colOrders:       "הזמנות",
    colSpent:        'סה"כ רכישות',
    colRating:       "דירוג",
    colLastChat:     "שיחה אחרונה",
    colStatus:       "סטטוס",
    colActions:      "פעולות",
    // Status
    statusNew:       "חדש",
    statusRegular:   "רגיל",
    statusVip:       "VIP",
    // Chat logs
    searchChats:     "חיפוש בשיחות...",
    noChats:         "אין שיחות עדיין",
    noChatsHint:     "שיחות מהווידג'ט יופיעו כאן לאחר שלקוחות יפנו",
    chatActive:      "פעיל",
    chatClosed:      "סגור",
    chatEscalated:   "הועבר לנציג",
    untitledChat:    "שיחה ללא כותרת",
    chatWith:        "שיחה עם",
    fullId:          "מזהה מלא",
    chatStatusLabel: "סטטוס",
    messagesUnit:    "הודעות",
  },
  en: {
    dir:   "ltr" as const,
    nav: {
      dashboard:            "Dashboard",
      chatLogs:             "Chat Logs",
      support:              "Support Queue",
      customers:            "Customers",
      products:             "Products",
      automations:          "Automations",
      campaigns:            "Campaigns",
      team:                 "Team",
      settings:             "Settings",
      widget:               "Chat Widget",
      admin:                "Admin Panel",
      settingsStore:        "Store Info",
      settingsPersona:      "Agent Persona",
      settingsIntegrations: "Integrations",
      playground:           "AI Playground",
    },
    accountSettings: "Account Settings",
    logout:          "Logout",
    notifications:   "Notifications",
    noNotifications: "No new notifications",
    lastUpdated:     "Last updated",
    today:           "Today",
    addCustomer:     "Add Customer",
    totalCustomers:  "Total Customers",
    vipCustomers:    "VIP Customers",
    totalRevenue:    "Total Revenue",
    searchCustomers: "Search by name or email...",
    noCustomers:     "No customers yet",
    noCustomersHint: "Add your first customer to get started",
    noResults:       "No results found",
    colName:         "Customer",
    colOrders:       "Orders",
    colSpent:        "Total Spent",
    colRating:       "Rating",
    colLastChat:     "Last Chat",
    colStatus:       "Status",
    colActions:      "Actions",
    statusNew:       "New",
    statusRegular:   "Regular",
    statusVip:       "VIP",
    searchChats:     "Search chats...",
    noChats:         "No chats yet",
    noChatsHint:     "Chats from your widget will appear here",
    chatActive:      "Active",
    chatClosed:      "Closed",
    chatEscalated:   "Escalated",
    untitledChat:    "Untitled chat",
    chatWith:        "Chat with",
    fullId:          "Full ID",
    chatStatusLabel: "Status",
    messagesUnit:    "messages",
  },
} as const;

export type S = typeof STRINGS.he;

type LangCtx = { lang: Lang; setLang: (l: Lang) => void; s: S };

const Ctx = createContext<LangCtx>({ lang: "he", setLang: () => {}, s: STRINGS.he });

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("he");

  useEffect(() => {
    const stored = localStorage.getItem("enigmai-lang");
    if (stored === "en" || stored === "he") setLangState(stored);
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    localStorage.setItem("enigmai-lang", l);
  }, []);

  const value = useMemo(
    () => ({ lang, setLang, s: STRINGS[lang] as unknown as S }),
    [lang, setLang]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useLanguage() {
  return useContext(Ctx);
}
