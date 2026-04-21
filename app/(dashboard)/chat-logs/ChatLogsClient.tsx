"use client";

import { useState } from "react";
import { MessageSquare, ChevronLeft, ChevronRight, Hash, Clock } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

type Session = {
  id:            string;
  summary:       string | null;
  message_count: number;
  status:        string;
  created_at:    string;
  customer:      { id: string; name: string } | null;
};

function groupByDate(sessions: Session[], locale: string): Array<{ label: string; sessions: Session[] }> {
  const map = new Map<string, Session[]>();
  for (const s of sessions) {
    const label = new Date(s.created_at).toLocaleDateString(locale, {
      weekday: "long",
      day:     "numeric",
      month:   "long",
      year:    "numeric",
    });
    if (!map.has(label)) map.set(label, []);
    map.get(label)!.push(s);
  }
  return Array.from(map.entries()).map(([label, sessions]) => ({ label, sessions }));
}

export default function ChatLogsClient({ sessions }: { sessions: Session[] }) {
  const { lang, s }               = useLanguage();
  const isRTL                     = s.dir === "rtl";
  const locale                    = lang === "he" ? "he-IL" : "en-US";
  const [selected, setSelected]   = useState<string | null>(null);
  const [search,   setSearch]     = useState("");

  const filtered = sessions.filter(
    (sess) =>
      (sess.summary ?? "").toLowerCase().includes(search.toLowerCase()) ||
      sess.id.includes(search) ||
      (sess.customer?.name ?? "").toLowerCase().includes(search.toLowerCase())
  );

  const groups = groupByDate(filtered, locale);

  const statusLabel = (status: string) => {
    if (status === "active")    return s.chatActive;
    if (status === "closed")    return s.chatClosed;
    return s.chatEscalated;
  };
  const statusColor = (status: string) =>
    status === "escalated" ? "text-orange-600" :
    status === "active"    ? "text-emerald-600" : "text-gray-500";

  const ChevronIcon = isRTL ? ChevronLeft : ChevronRight;

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <input
          type="text"
          placeholder={s.searchChats}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-right focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Empty state – no sessions at all */}
      {sessions.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-200 py-20 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <MessageSquare size={28} className="text-gray-300" />
          </div>
          <h3 className="text-gray-700 font-semibold text-base mb-2">{s.noChats}</h3>
          <p className="text-gray-400 text-sm">{s.noChatsHint}</p>
        </div>
      )}

      {/* No search results */}
      {sessions.length > 0 && groups.length === 0 && (
        <div className="text-center py-12 text-sm text-gray-400">{s.noResults}</div>
      )}

      {/* Session groups */}
      {groups.map((group) => (
        <div key={group.label}>
          <h2 className="text-sm font-semibold text-gray-500 mb-3 px-1">{group.label}</h2>
          <div className="space-y-2">
            {group.sessions.map((sess) => {
              const time = new Date(sess.created_at).toLocaleTimeString(locale, {
                hour:   "2-digit",
                minute: "2-digit",
              });
              return (
                <button
                  key={sess.id}
                  onClick={() => setSelected(sess.id === selected ? null : sess.id)}
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
                          <span className="text-xs text-gray-400">
                            {sess.message_count} {s.messagesUnit}
                          </span>
                        </div>
                        <h3 className="font-semibold text-gray-900 text-sm">
                          {sess.summary ?? (
                            sess.customer?.name
                              ? `${s.chatWith} ${sess.customer.name}`
                              : s.untitledChat
                          )}
                        </h3>
                      </div>
                      {sess.customer && (
                        <p className="text-xs text-indigo-600 font-medium text-right mb-1">
                          {sess.customer.name}
                        </p>
                      )}
                      <div className="flex items-center justify-end mt-1">
                        <span className="text-xs text-gray-400 font-mono flex items-center gap-1">
                          <Hash size={10} /> {sess.id.slice(0, 12)}…
                        </span>
                      </div>
                    </div>
                    <ChevronIcon
                      size={16}
                      className="text-gray-300 flex-shrink-0 mt-1 group-hover:text-indigo-400 transition-colors"
                    />
                  </div>

                  {selected === sess.id && (
                    <div className="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-500 text-right space-y-1">
                      <p>
                        {s.fullId}:{" "}
                        <span className="font-mono text-gray-700">{sess.id}</span>
                      </p>
                      <p>
                        {s.chatStatusLabel}:{" "}
                        <span className={`font-medium ${statusColor(sess.status)}`}>
                          {statusLabel(sess.status)}
                        </span>
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
