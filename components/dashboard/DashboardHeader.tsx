"use client";

import { useMemo } from "react";
import { Calendar } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

export default function DashboardHeader() {
  const { lang, s } = useLanguage();

  const { range, lastUpdated } = useMemo(() => {
    const locale = lang === "he" ? "he-IL" : "en-US";
    const now    = new Date();
    const start  = new Date(now);
    start.setDate(start.getDate() - 29);

    const fmt  = (d: Date) => d.toLocaleDateString(locale, { day: "numeric", month: "long" });
    const time = now.toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" });

    return {
      range:       `${fmt(start)} – ${fmt(now)} ${now.getFullYear()}`,
      lastUpdated: `${s.lastUpdated}: ${s.today}, ${time}`,
    };
  }, [lang, s]);

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-600">
        <Calendar size={14} className="text-gray-400" />
        <span>{range}</span>
      </div>
      <p className="text-sm text-gray-500">{lastUpdated}</p>
    </div>
  );
}
