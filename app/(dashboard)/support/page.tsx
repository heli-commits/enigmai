"use client";

import { useState } from "react";
import { AlertCircle, CheckCircle2, Clock, Package, ChevronLeft } from "lucide-react";

type Tab = "open" | "closed";

type Ticket = {
  id: string;
  customer: string;
  order: string;
  orderColor: string;
  summary: string;
  time: string;
  priority: string;
  resolvedBy?: string;
};

type TicketGroup = { date: string; tickets: Ticket[] };

const openTickets: TicketGroup[] = [
  {
    date: "היום, 20 אפריל 2026",
    tickets: [
      {
        id: "TKT-0041",
        customer: "שרה לוי",
        order: "הזמנה #2891",
        orderColor: "bg-red-100 text-red-700",
        summary: "לקוחה מתוסכלת, הזמנה לא הגיעה זה שבועיים, מבקשת סוכן אנושי",
        time: "14:22",
        priority: "urgent",
      },
      {
        id: "TKT-0040",
        customer: "יוסף כהן",
        order: "הזמנה #2887",
        orderColor: "bg-orange-100 text-orange-700",
        summary: "מוצר הגיע שבור, מבקש החלפה או החזר כסף, AI לא הצליח לפתור",
        time: "11:45",
        priority: "high",
      },
      {
        id: "TKT-0039",
        customer: "מירה שמש",
        order: "הזמנה #2880",
        orderColor: "bg-blue-100 text-blue-700",
        summary: "שאלה טכנית על מוצר DIY שדורשת ידע מקצועי שמעבר ליכולות ה-AI",
        time: "09:18",
        priority: "normal",
      },
    ],
  },
  {
    date: "אתמול, 19 אפריל 2026",
    tickets: [
      {
        id: "TKT-0038",
        customer: "דוד מזרחי",
        order: "הזמנה #2871",
        orderColor: "bg-purple-100 text-purple-700",
        summary: "לקוח מבקש שינוי בהזמנה לאחר האישור, אחרת יבטל",
        time: "20:10",
        priority: "high",
      },
      {
        id: "TKT-0037",
        customer: "רחל גולן",
        order: "הזמנה #2865",
        orderColor: "bg-green-100 text-green-700",
        summary: "בקשה לחשבונית לעסק עם פרטים ספציפיים",
        time: "16:30",
        priority: "normal",
      },
    ],
  },
];

const closedTickets: TicketGroup[] = [
  {
    date: "18 אפריל 2026",
    tickets: [
      {
        id: "TKT-0036",
        customer: "אבי נתן",
        order: "הזמנה #2850",
        orderColor: "bg-gray-100 text-gray-600",
        summary: "בעיית תשלום נפתרה בהצלחה על ידי נציג",
        time: "14:00",
        priority: "normal",
        resolvedBy: "נציג: תמר ש.",
      },
      {
        id: "TKT-0035",
        customer: "נועה ברק",
        order: "הזמנה #2844",
        orderColor: "bg-gray-100 text-gray-600",
        summary: "משלוח אבד ונשלח חלופי - הלקוחה שביעת רצון",
        time: "10:20",
        priority: "urgent",
        resolvedBy: "נציג: יואב מ.",
      },
    ],
  },
];

const priorityConfig = {
  urgent: { label: "דחוף", color: "bg-red-100 text-red-700 border-red-200", dot: "bg-red-500" },
  high: { label: "גבוה", color: "bg-orange-100 text-orange-700 border-orange-200", dot: "bg-orange-500" },
  normal: { label: "רגיל", color: "bg-gray-100 text-gray-600 border-gray-200", dot: "bg-gray-400" },
};

export default function SupportPage() {
  const [tab, setTab] = useState<Tab>("open");
  const tickets = tab === "open" ? openTickets : closedTickets;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl p-1">
          <button
            onClick={() => setTab("open")}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === "open"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            פתוחות
            <span className={`mr-2 px-1.5 py-0.5 rounded-full text-xs font-bold ${tab === "open" ? "bg-white/20 text-white" : "bg-red-100 text-red-700"}`}>
              5
            </span>
          </button>
          <button
            onClick={() => setTab("closed")}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === "closed"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            סגורות
          </button>
        </div>
        <p className="text-sm text-gray-500">
          {tab === "open" ? "5 פניות פתוחות ממתינות לטיפול" : "2 פניות סגורות"}
        </p>
      </div>

      {/* Tickets */}
      <div className="space-y-6">
        {tickets.map((group) => (
          <div key={group.date}>
            <h2 className="text-sm font-semibold text-gray-500 mb-3 px-1">{group.date}</h2>
            <div className="space-y-3">
              {group.tickets.map((ticket) => {
                const priority = priorityConfig[ticket.priority as keyof typeof priorityConfig];
                return (
                  <div
                    key={ticket.id}
                    className={`bg-white border rounded-xl p-5 hover:shadow-sm transition-all cursor-pointer ${
                      ticket.priority === "urgent" ? "border-red-200" : "border-gray-200"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        tab === "open" ? "bg-orange-50" : "bg-gray-50"
                      }`}>
                        {tab === "open" ? (
                          <AlertCircle size={18} className="text-orange-500" />
                        ) : (
                          <CheckCircle2 size={18} className="text-emerald-500" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0 text-right">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-400 font-mono">{ticket.id}</span>
                            <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${priority.color}`}>
                              <span className={`inline-block w-1.5 h-1.5 rounded-full ${priority.dot} ml-1`}></span>
                              {priority.label}
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-xs text-gray-400 flex items-center gap-1">
                              <Clock size={11} />
                              {ticket.time}
                            </span>
                            <span className="font-semibold text-gray-900 text-sm">{ticket.customer}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-end gap-2 mb-2">
                          <span className={`text-xs px-2.5 py-1 rounded-full font-medium flex items-center gap-1 ${ticket.orderColor}`}>
                            <Package size={11} />
                            {ticket.order}
                          </span>
                        </div>

                        <p className="text-sm text-gray-600 leading-relaxed">{ticket.summary}</p>

                        {"resolvedBy" in ticket && (
                          <p className="text-xs text-emerald-600 mt-2 font-medium">{ticket.resolvedBy}</p>
                        )}
                      </div>

                      <ChevronLeft size={16} className="text-gray-300 flex-shrink-0 mt-1" />
                    </div>

                    {tab === "open" && (
                      <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-start gap-3">
                        <button className="px-4 py-1.5 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition-colors font-medium">
                          קח על עצמי
                        </button>
                        <button className="px-4 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 transition-colors font-medium">
                          הצג שיחה
                        </button>
                        <button className="px-4 py-1.5 bg-red-50 text-red-600 text-sm rounded-lg hover:bg-red-100 transition-colors font-medium">
                          סגור פנייה
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
