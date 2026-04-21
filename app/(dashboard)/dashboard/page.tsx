import AnalyticsChart from "@/components/dashboard/AnalyticsChart";
import { ShoppingCart, TrendingUp, MousePointerClick, MessageCircle, Users, Star } from "lucide-react";

const cartData = [
  { date: "26/3", value: 12, amount: 1840 },
  { date: "27/3", value: 8, amount: 1200 },
  { date: "28/3", value: 15, amount: 2300 },
  { date: "29/3", value: 22, amount: 3400 },
  { date: "30/3", value: 18, amount: 2700 },
  { date: "31/3", value: 25, amount: 3800 },
  { date: "1/4", value: 30, amount: 4600 },
  { date: "2/4", value: 28, amount: 4300 },
  { date: "3/4", value: 35, amount: 5300 },
  { date: "4/4", value: 20, amount: 3100 },
  { date: "5/4", value: 42, amount: 6400 },
  { date: "6/4", value: 38, amount: 5800 },
  { date: "7/4", value: 45, amount: 6900 },
  { date: "8/4", value: 50, amount: 7600 },
  { date: "9/4", value: 32, amount: 4900 },
  { date: "10/4", value: 28, amount: 4200 },
];

const purchaseData = [
  { date: "26/3", value: 4, amount: 620 },
  { date: "27/3", value: 3, amount: 460 },
  { date: "28/3", value: 6, amount: 920 },
  { date: "29/3", value: 9, amount: 1380 },
  { date: "30/3", value: 7, amount: 1070 },
  { date: "31/3", value: 10, amount: 1530 },
  { date: "1/4", value: 12, amount: 1840 },
  { date: "2/4", value: 11, amount: 1690 },
  { date: "3/4", value: 14, amount: 2140 },
  { date: "4/4", value: 8, amount: 1220 },
  { date: "5/4", value: 17, amount: 2600 },
  { date: "6/4", value: 15, amount: 2300 },
  { date: "7/4", value: 18, amount: 2760 },
  { date: "8/4", value: 20, amount: 3060 },
  { date: "9/4", value: 13, amount: 1990 },
  { date: "10/4", value: 11, amount: 1680 },
];

const clickData = [
  { date: "26/3", value: 85, amount: 0 },
  { date: "27/3", value: 62, amount: 0 },
  { date: "28/3", value: 110, amount: 0 },
  { date: "29/3", value: 143, amount: 0 },
  { date: "30/3", value: 128, amount: 0 },
  { date: "31/3", value: 156, amount: 0 },
  { date: "1/4", value: 190, amount: 0 },
  { date: "2/4", value: 174, amount: 0 },
  { date: "3/4", value: 220, amount: 0 },
  { date: "4/4", value: 135, amount: 0 },
  { date: "5/4", value: 268, amount: 0 },
  { date: "6/4", value: 241, amount: 0 },
  { date: "7/4", value: 285, amount: 0 },
  { date: "8/4", value: 312, amount: 0 },
  { date: "9/4", value: 198, amount: 0 },
  { date: "10/4", value: 176, amount: 0 },
];

const stats = [
  { label: "שיחות היום", value: "47", icon: MessageCircle, color: "text-indigo-600", bg: "bg-indigo-50", change: "+12%" },
  { label: "לקוחות חדשים", value: "23", icon: Users, color: "text-emerald-600", bg: "bg-emerald-50", change: "+8%" },
  { label: "המרות", value: "18%", icon: TrendingUp, color: "text-orange-600", bg: "bg-orange-50", change: "+3%" },
  { label: "דירוג שביעות רצון", value: "4.8", icon: Star, color: "text-yellow-600", bg: "bg-yellow-50", change: "+0.2" },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Date range indicator */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-600">
          <span>26 מרץ – 20 אפריל 2026</span>
        </div>
        <p className="text-sm text-gray-500">עודכן לאחרונה: היום, 15:30</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center`}>
                <stat.icon size={18} className={stat.color} />
              </div>
              <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                {stat.change}
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-sm text-gray-500 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-4">
        <AnalyticsChart
          title="מוצרים שנוספו לסל"
          data={cartData}
          color="#6366f1"
          hasValueToggle
        />
        <AnalyticsChart
          title="רכישות מהסל"
          data={purchaseData}
          color="#10b981"
          hasValueToggle
        />
      </div>
      <div className="grid grid-cols-1 gap-4">
        <AnalyticsChart
          title="קליקים על מוצרים"
          data={clickData}
          color="#f59e0b"
        />
      </div>
    </div>
  );
}
