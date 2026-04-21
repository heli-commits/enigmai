"use client";

import { useState } from "react";
import { MessageSquare, ChevronLeft, Hash, Clock } from "lucide-react";

const chatGroups = [
  {
    date: "שבת, 19 אפריל 2026",
    chats: [
      {
        id: "sess_a1b2c3d4",
        summary: "בירור לגבי נרות ריחניים",
        messages: 20,
        time: "22:14",
        preview: "הלקוח התעניין בסוגים שונים של נרות ריחניים ושאל על זמן בעירה...",
      },
      {
        id: "sess_e5f6g7h8",
        summary: "תלונה על ארנק פגום",
        messages: 14,
        time: "18:32",
        preview: "לקוח דיווח על ארנק שנתקבל פגום עם רוכסן שבור...",
      },
      {
        id: "sess_i9j0k1l2",
        summary: "שאלה לגבי מדיניות החזרות",
        messages: 8,
        time: "15:07",
        preview: "הלקוח רצה לדעת על תנאי ההחזרה עבור מוצר שקיבל במתנה...",
      },
    ],
  },
  {
    date: "שישי, 18 אפריל 2026",
    chats: [
      {
        id: "sess_m3n4o5p6",
        summary: "בקשת המלצה על מתנה ליום הולדת",
        messages: 31,
        time: "20:45",
        preview: "לקוחה חיפשה מתנה לאמא שלה בגיל 60 ובקצב של 200-300 שח...",
      },
      {
        id: "sess_q7r8s9t0",
        summary: "עדכון כתובת משלוח",
        messages: 6,
        time: "16:20",
        preview: "הלקוח ביקש לשנות כתובת משלוח להזמנה שעוד לא נשלחה...",
      },
      {
        id: "sess_u1v2w3x4",
        summary: "שאלות על אופן הכנת מוצר DIY",
        messages: 18,
        time: "11:55",
        preview: "לקוח שאל שאלות טכניות על אופן ההרכבה של ערכת DIY לעיצוב...",
      },
      {
        id: "sess_y5z6a7b8",
        summary: "בדיקת זמינות מוצר",
        messages: 5,
        time: "09:30",
        preview: "לקוח שאל על זמינות של מוצר שנגמר מהמלאי...",
      },
    ],
  },
  {
    date: "חמישי, 17 אפריל 2026",
    chats: [
      {
        id: "sess_c9d0e1f2",
        summary: "תלונה על עיכוב במשלוח",
        messages: 25,
        time: "19:10",
        preview: "לקוח מתוסכל שמזמינה לא הגיעה אחרי 10 ימים...",
      },
      {
        id: "sess_g3h4i5j6",
        summary: "ייעוץ לבחירת גודל תמונה",
        messages: 12,
        time: "14:28",
        preview: "לקוחה ביקשה עזרה בבחירת גודל מתאים של הדפסה לסלון...",
      },
    ],
  },
];

export default function ChatLogsPage() {
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const filtered = chatGroups.map((g) => ({
    ...g,
    chats: g.chats.filter(
      (c) =>
        c.summary.includes(search) ||
        c.id.includes(search) ||
        c.preview.includes(search)
    ),
  })).filter((g) => g.chats.length > 0);

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <input
          type="text"
          placeholder="חיפוש בשיחות..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-right focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
      </div>

      {/* Chat list */}
      <div className="space-y-6">
        {filtered.map((group) => (
          <div key={group.date}>
            <h2 className="text-sm font-semibold text-gray-500 mb-3 px-1">{group.date}</h2>
            <div className="space-y-2">
              {group.chats.map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => setSelectedChat(chat.id === selectedChat ? null : chat.id)}
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
                            <Clock size={10} />
                            {chat.time}
                          </span>
                          <span className="text-xs text-gray-400">{chat.messages} הודעות</span>
                        </div>
                        <h3 className="font-semibold text-gray-900 text-sm">{chat.summary}</h3>
                      </div>
                      <p className="text-sm text-gray-500 truncate text-right">{chat.preview}</p>
                      <div className="flex items-center justify-end mt-2">
                        <span className="text-xs text-gray-400 font-mono flex items-center gap-1">
                          <Hash size={10} />
                          {chat.id}
                        </span>
                      </div>
                    </div>
                    <ChevronLeft size={16} className="text-gray-300 flex-shrink-0 mt-1 group-hover:text-indigo-400 transition-colors" />
                  </div>

                  {selectedChat === chat.id && (
                    <div className="mt-4 pt-4 border-t border-gray-100 space-y-3 text-right">
                      <div className="flex justify-end">
                        <div className="bg-indigo-600 text-white rounded-2xl rounded-tl-sm px-4 py-2 max-w-xs text-sm">
                          שלום! אני מחפש נרות ריחניים. יש לכם משהו לאפריל?
                        </div>
                      </div>
                      <div className="flex justify-start">
                        <div className="bg-gray-100 text-gray-800 rounded-2xl rounded-tr-sm px-4 py-2 max-w-sm text-sm">
                          היי! ברוך הבא לחנות שלנו 🕯️ כן בטח! יש לנו מגוון נרות ריחניים מדהים. מה הריח שאתה אוהב?
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <div className="bg-indigo-600 text-white rounded-2xl rounded-tl-sm px-4 py-2 max-w-xs text-sm">
                          משהו עם ריח לבנדר או ורד
                        </div>
                      </div>
                      <p className="text-xs text-gray-400 text-center">... ועוד {chat.messages - 3} הודעות</p>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
