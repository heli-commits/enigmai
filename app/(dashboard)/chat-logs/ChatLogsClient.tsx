"use client";

import { useState } from "react";
import { MessageSquare, ChevronLeft, Hash, Clock } from "lucide-react";

type Session = {
  id: string;
  summary: string | null;
  message_count: number;
  status: string;
  created_at: string;
  customer: { id: string; name: string } | null;
};

function groupByDate(sessions: Session[]): Array<{ label: string; sessions: Session[] }> {
  const map = new Map<string, Session[]>();
  for (const s of sessions) {
    const d = new Date(s.created_at);
    const label = d.toLocaleDateString("he-IL", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
    if (!map.has(label)) map.set(label, []);
    map.get(label)!.push(s);
  }
  return Array.from(map.entries()).map(([label, sessions]) => ({ label, sessions }));
}

export default function ChatLogsClient({ sessions }: { sessions: Session[] }) {
  const [selected, setSelected]   = useState<string | null>(null);
  const [search,   setSearch]     = useState("");

  const filtered = sessions.filter(
    (s) =>
      (s.summary ?? "").includes(search) ||
      s.id.includes(search) ||
      (s.customer?.name ?? "").includes(search)
  );

  const groups = groupByDate(filtered);

  return (
    <div className="space-y-4">
      <div className="relative">
        <input
          type="text"
          placeholder="חיפוש בשיחות..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-right focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {groups.length === 0 && (
        <div className="text-center py-16 text-sm text-gray-400">
          {sessions.length === 0 ? "אין שיחות עדיין" : "לא נמצאו תוצאות"}
        </div>
      )}

      {groups.map((group) => (
        <div key={group.label}>
          <h2 className="text-sm font-semibold text-gray-500 mb-3 px-1">{group.label}</h2>
          <div className="space-y-2">
            {group.sessions.map((s) => {
              const time = new Date(s.created_at).toLocaleTimeString("he-IL", { hour: "2-digit", minute: "2-digit" });
              return (
                <button
                  key={s.id}
                  onClick={() => setSelected(s.id === selected ? null : s.id)}
                  className="w-full bg-white border border-gray-200 rounded-xl p-4 text-right hover:border-indigo-200 hover:shadow-sm transition-all group"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 bg-indigo-50 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-indigo-100 transition-colors">
                      <MessageSquare size={16} className="text-indigo-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-400 flex items-center gap-1">
                            <Clock size={10} /> {time}
                          </span>
                          <span className="text-xs text-gray-400">{s.message_count} הודעות</span>
                        </div>
                        <h3 className="font-semibold text-gray-900 text-sm">
                          {s.summary ?? (s.customer?.name ? `שיחה עם ${s.customer.name}` : "שיחה ללא כותרת")}
                        </h3>
                      </div>
                      {s.customer && (
                        <p className="text-xs text-indigo-600 font-medium text-right mb-1">{s.customer.name}</p>
                      )}
                      <div className="flex items-center justify-end mt-1">
                        <span className="text-xs text-gray-400 font-mono flex items-center gap-1">
                          <Hash size={10} /> {s.id.slice(0, 12)}…
                        </span>
                      </div>
                    </div>
                    <ChevronLeft size={16} className="text-gray-300 flex-shrink-0 mt-1 group-hover:text-indigo-400 transition-colors" />
                  </div>

                  {selected === s.id && (
                    <div className="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-500 text-right">
                      <p>מזהה מלא: <span className="font-mono text-gray-700">{s.id}</span></p>
                      <p className="mt-1">
                        סטטוס: <span className={`font-medium ${
                          s.status === "escalated" ? "text-orange-600" :
                          s.status === "active"    ? "text-emerald-600" : "text-gray-500"
                        }`}>{s.status === "active" ? "פעיל" : s.status === "closed" ? "סגור" : "הועבר לנציג"}</span>
                      </p>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
