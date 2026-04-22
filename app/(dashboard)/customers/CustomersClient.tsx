"use client";

import { useState } from "react";
import { Search, Star, ShoppingBag, MessageCircle, TrendingUp, UserPlus, Users } from "lucide-react";
import type { Customer } from "@/lib/supabase/types";
import AddCustomerModal from "@/components/modals/AddCustomerModal";
import { useLanguage } from "@/lib/i18n";

const statusColors: Record<string, string> = {
  vip:     "bg-yellow-100 text-yellow-700",
  regular: "bg-gray-100 text-gray-600",
  new:     "bg-green-100 text-green-700",
};

function formatLastChat(iso: string | null, lang: string): string {
  if (!iso) return "–";
  const diff = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diff / 86_400_000);
  if (days === 0) return lang === "he" ? "היום" : "Today";
  if (days === 1) return lang === "he" ? "אתמול" : "Yesterday";
  return lang === "he" ? `לפני ${days} ימים` : `${days}d ago`;
}

type Props = {
  customers: Pick<Customer, "id" | "name" | "email" | "status" | "total_spent" | "orders_count" | "rating" | "last_chat_at">[];
  totalRevenue: number;
  vipCount: number;
};

export default function CustomersClient({ customers, totalRevenue, vipCount }: Props) {
  const { lang, s }             = useLanguage();
  const [search,    setSearch]  = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const statusLabels: Record<string, string> = {
    vip:     s.statusVip,
    regular: s.statusRegular,
    new:     s.statusNew,
  };

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      (c.email ?? "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <AddCustomerModal open={modalOpen} onClose={() => setModalOpen(false)} />

      <div className="space-y-4">
        {/* Add customer button */}
        <div className="flex justify-start">
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors"
          >
            <UserPlus size={16} />
            {s.addCustomer}
          </button>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4">
            <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
              <ShoppingBag size={18} className="text-indigo-600" />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900">{customers.length}</p>
              <p className="text-sm text-gray-500">{s.totalCustomers}</p>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4">
            <div className="w-10 h-10 bg-yellow-50 rounded-xl flex items-center justify-center">
              <Star size={18} className="text-yellow-600" />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900">{vipCount}</p>
              <p className="text-sm text-gray-500">{s.vipCustomers}</p>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4">
            <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
              <TrendingUp size={18} className="text-emerald-600" />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900">₪{totalRevenue.toLocaleString()}</p>
              <p className="text-sm text-gray-500">{s.totalRevenue}</p>
            </div>
          </div>
        </div>

        {/* Empty state – no customers at all */}
        {customers.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 py-20 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-5">
              <Users size={28} className="text-gray-300" />
            </div>
            <h3 className="text-gray-700 font-semibold text-base mb-2">{s.noCustomers}</h3>
            <p className="text-gray-400 text-sm mb-6">{s.noCustomersHint}</p>
            <button
              onClick={() => setModalOpen(true)}
              className="inline-flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors"
            >
              <UserPlus size={15} />
              {s.addCustomer}
            </button>
          </div>
        ) : (
          <>
            {/* Search */}
            <div className="relative">
              <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder={s.searchCustomers}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-xl pr-10 pl-4 py-3 text-sm text-right focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Table – horizontally scrollable on mobile */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
              <table className="w-full min-w-[640px]">
                <thead>
                  <tr className="border-b border-gray-100">
                    {[s.colName, s.colOrders, s.colSpent, s.colRating, s.colLastChat, s.colStatus, s.colActions].map((h) => (
                      <th key={h} className="text-right text-xs font-semibold text-gray-500 px-5 py-3">{h}</th>
                    ))}
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
                      <td className="px-5 py-4 text-sm text-gray-500 text-right">
                        {formatLastChat(c.last_chat_at, lang)}
                      </td>
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
                        {s.noResults}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
