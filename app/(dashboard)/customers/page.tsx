"use client";

import { useState } from "react";
import { Search, Star, ShoppingBag, MessageCircle, TrendingUp } from "lucide-react";

const customers = [
  { id: 1, name: "שרה לוי", email: "sarah@example.com", orders: 8, spent: 1240, rating: 4.9, lastChat: "היום", status: "VIP" },
  { id: 2, name: "יוסף כהן", email: "yosef@example.com", orders: 3, spent: 420, rating: 3.5, lastChat: "אתמול", status: "רגיל" },
  { id: 3, name: "מירה שמש", email: "mira@example.com", orders: 12, spent: 2180, rating: 5.0, lastChat: "שבוע", status: "VIP" },
  { id: 4, name: "דוד מזרחי", email: "david@example.com", orders: 1, spent: 190, rating: 4.0, lastChat: "חודש", status: "חדש" },
  { id: 5, name: "רחל גולן", email: "rachel@example.com", orders: 5, spent: 780, rating: 4.7, lastChat: "שבוע", status: "רגיל" },
  { id: 6, name: "אבי נתן", email: "avi@example.com", orders: 20, spent: 3600, rating: 4.8, lastChat: "2 ימים", status: "VIP" },
  { id: 7, name: "נועה ברק", email: "noa@example.com", orders: 2, spent: 320, rating: 4.2, lastChat: "3 ימים", status: "רגיל" },
];

const statusColors: Record<string, string> = {
  VIP: "bg-yellow-100 text-yellow-700",
  רגיל: "bg-gray-100 text-gray-600",
  חדש: "bg-green-100 text-green-700",
};

export default function CustomersPage() {
  const [search, setSearch] = useState("");
  const filtered = customers.filter(
    (c) => c.name.includes(search) || c.email.includes(search)
  );

  return (
    <div className="space-y-4">
      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4">
          <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
            <ShoppingBag size={18} className="text-indigo-600" />
          </div>
          <div>
            <p className="text-xl font-bold text-gray-900">7</p>
            <p className="text-sm text-gray-500">סה"כ לקוחות</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4">
          <div className="w-10 h-10 bg-yellow-50 rounded-xl flex items-center justify-center">
            <Star size={18} className="text-yellow-600" />
          </div>
          <div>
            <p className="text-xl font-bold text-gray-900">3</p>
            <p className="text-sm text-gray-500">לקוחות VIP</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4">
          <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
            <TrendingUp size={18} className="text-emerald-600" />
          </div>
          <div>
            <p className="text-xl font-bold text-gray-900">₪8,730</p>
            <p className="text-sm text-gray-500">סה"כ הכנסות</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="חיפוש לפי שם או אימייל..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white border border-gray-200 rounded-xl pr-10 pl-4 py-3 text-sm text-right focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-right text-xs font-semibold text-gray-500 px-5 py-3">שם לקוח</th>
              <th className="text-right text-xs font-semibold text-gray-500 px-5 py-3">הזמנות</th>
              <th className="text-right text-xs font-semibold text-gray-500 px-5 py-3">סה"כ רכישות</th>
              <th className="text-right text-xs font-semibold text-gray-500 px-5 py-3">דירוג</th>
              <th className="text-right text-xs font-semibold text-gray-500 px-5 py-3">שיחה אחרונה</th>
              <th className="text-right text-xs font-semibold text-gray-500 px-5 py-3">סטטוס</th>
              <th className="text-right text-xs font-semibold text-gray-500 px-5 py-3">פעולות</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map((c) => (
              <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3 flex-row-reverse">
                    <div className="w-8 h-8 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-xs font-bold">{c.name[0]}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{c.name}</p>
                      <p className="text-xs text-gray-400">{c.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4 text-sm text-gray-700 text-right">{c.orders}</td>
                <td className="px-5 py-4 text-sm font-medium text-gray-900 text-right">₪{c.spent.toLocaleString()}</td>
                <td className="px-5 py-4 text-right">
                  <span className="flex items-center justify-end gap-1 text-sm text-gray-700">
                    <Star size={13} className="text-yellow-400 fill-yellow-400" />
                    {c.rating}
                  </span>
                </td>
                <td className="px-5 py-4 text-sm text-gray-500 text-right">{c.lastChat}</td>
                <td className="px-5 py-4 text-right">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusColors[c.status]}`}>
                    {c.status}
                  </span>
                </td>
                <td className="px-5 py-4 text-right">
                  <button className="p-1.5 rounded-lg hover:bg-indigo-50 text-gray-400 hover:text-indigo-600 transition-colors">
                    <MessageCircle size={15} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
