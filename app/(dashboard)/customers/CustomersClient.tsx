"use client";

import { useState } from "react";
import { Search, Star, ShoppingBag, MessageCircle, TrendingUp } from "lucide-react";
import type { Customer } from "@/lib/supabase/types";

const statusLabels: Record<string, string> = { vip: "VIP", regular: "רגיל", new: "חדש" };
const statusColors: Record<string, string> = {
  vip:     "bg-yellow-100 text-yellow-700",
  regular: "bg-gray-100 text-gray-600",
  new:     "bg-green-100 text-green-700",
};

function formatLastChat(iso: string | null): string {
  if (!iso) return "–";
  const diff = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diff / 86_400_000);
  if (days === 0) return "היום";
  if (days === 1) return "אתמול";
  return `לפני ${days} ימים`;
}

type Props = {
  customers: Pick<Customer, "id" | "name" | "email" | "status" | "total_spent" | "orders_count" | "rating" | "last_chat_at">[];
  totalRevenue: number;
  vipCount: number;
};

export default function CustomersClient({ customers, totalRevenue, vipCount }: Props) {
  const [search, setSearch] = useState("");

  const filtered = customers.filter(
    (c) =>
      c.name.includes(search) ||
      (c.email ?? "").toLowerCase().includes(search.toLowerCase())
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
            <p className="text-xl font-bold text-gray-900">{customers.length}</p>
            <p className="text-sm text-gray-500">סה"כ לקוחות</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4">
          <div className="w-10 h-10 bg-yellow-50 rounded-xl flex items-center justify-center">
            <Star size={18} className="text-yellow-600" />
          </div>
          <div>
            <p className="text-xl font-bold text-gray-900">{vipCount}</p>
            <p className="text-sm text-gray-500">לקוחות VIP</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4">
          <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
            <TrendingUp size={18} className="text-emerald-600" />
          </div>
          <div>
            <p className="text-xl font-bold text-gray-900">₪{totalRevenue.toLocaleString()}</p>
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
                      <p className="text-xs text-gray-400">{c.email ?? "–"}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4 text-sm text-gray-700 text-right">{c.orders_count}</td>
                <td className="px-5 py-4 text-sm font-medium text-gray-900 text-right">₪{Number(c.total_spent).toLocaleString()}</td>
                <td className="px-5 py-4 text-right">
                  {c.rating ? (
                    <span className="flex items-center justify-end gap-1 text-sm text-gray-700">
                      <Star size={13} className="text-yellow-400 fill-yellow-400" />
                      {c.rating}
                    </span>
                  ) : "–"}
                </td>
                <td className="px-5 py-4 text-sm text-gray-500 text-right">{formatLastChat(c.last_chat_at)}</td>
                <td className="px-5 py-4 text-right">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusColors[c.status]}`}>
                    {statusLabels[c.status]}
                  </span>
                </td>
                <td className="px-5 py-4 text-right">
                  <button className="p-1.5 rounded-lg hover:bg-indigo-50 text-gray-400 hover:text-indigo-600 transition-colors">
                    <MessageCircle size={15} />
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-5 py-10 text-center text-sm text-gray-400">
                  לא נמצאו לקוחות
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
