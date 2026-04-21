"use client";

import { Zap, Plus, ToggleLeft, ToggleRight, Clock, ShoppingCart, MessageCircle, Tag } from "lucide-react";
import { useState } from "react";

const automations = [
  {
    id: 1,
    name: "הודעת ברוכים הבאים",
    trigger: "לקוח חדש נרשם",
    action: "שליחת אימייל ברכה + קוד קופון 10%",
    icon: MessageCircle,
    iconBg: "bg-indigo-50",
    iconColor: "text-indigo-600",
    active: true,
    runs: 142,
  },
  {
    id: 2,
    name: "תזכורת עגלה נטושה",
    trigger: "מוצר בעגלה מעל 2 שעות",
    action: "SMS תזכורת + הצעת סיוע מהסוכן",
    icon: ShoppingCart,
    iconBg: "bg-orange-50",
    iconColor: "text-orange-600",
    active: true,
    runs: 87,
  },
  {
    id: 3,
    name: "טיפול בשאלות נפוצות",
    trigger: "לקוח שואל על מדיניות החזרות",
    action: "תגובה אוטומטית עם מדיניות מלאה",
    icon: Zap,
    iconBg: "bg-yellow-50",
    iconColor: "text-yellow-600",
    active: true,
    runs: 310,
  },
  {
    id: 4,
    name: "אפסל לאחר רכישה",
    trigger: "הזמנה הושלמה",
    action: "הצעת מוצרים משלימים בצ'אט",
    icon: Tag,
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
    active: false,
    runs: 24,
  },
  {
    id: 5,
    name: "תזכורת ימי הולדת",
    trigger: "יום הולדת של לקוח",
    action: "SMS ברכה + קופון מיוחד",
    icon: Clock,
    iconBg: "bg-pink-50",
    iconColor: "text-pink-600",
    active: false,
    runs: 18,
  },
];

export default function AutomationsPage() {
  const [states, setStates] = useState(
    Object.fromEntries(automations.map((a) => [a.id, a.active]))
  );

  const toggle = (id: number) =>
    setStates((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">{Object.values(states).filter(Boolean).length} אוטומציות פעילות</p>
        <button className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors">
          <Plus size={16} />
          אוטומציה חדשה
        </button>
      </div>

      <div className="space-y-3">
        {automations.map((auto) => {
          const active = states[auto.id];
          return (
            <div key={auto.id} className={`bg-white rounded-xl border p-5 transition-all ${active ? "border-gray-200" : "border-gray-100 opacity-70"}`}>
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 ${auto.iconBg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                  <auto.icon size={18} className={auto.iconColor} />
                </div>
                <div className="flex-1 text-right">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-3">
                      <button onClick={() => toggle(auto.id)}>
                        {active ? (
                          <ToggleRight size={26} className="text-indigo-600" />
                        ) : (
                          <ToggleLeft size={26} className="text-gray-300" />
                        )}
                      </button>
                      <span className="text-xs text-gray-400">{auto.runs} הפעלות</span>
                    </div>
                    <h3 className="font-semibold text-gray-900 text-sm">{auto.name}</h3>
                  </div>
                  <div className="flex items-center justify-end gap-2 text-xs text-gray-500">
                    <span className="bg-gray-50 border border-gray-200 px-2.5 py-1 rounded-lg">{auto.action}</span>
                    <span className="text-gray-400">←</span>
                    <span className="bg-indigo-50 border border-indigo-100 text-indigo-700 px-2.5 py-1 rounded-lg">{auto.trigger}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
