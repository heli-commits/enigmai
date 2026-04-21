"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  MessageSquare,
  Headphones,
  Users,
  Package,
  Zap,
  Megaphone,
  UserCog,
  Settings,
  ChevronDown,
  ChevronUp,
  Shield,
  MessageCircle,
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "לוח בקרה" },
  { href: "/chat-logs", icon: MessageSquare, label: "יומן שיחות" },
  { href: "/support", icon: Headphones, label: "תור תמיכה" },
  { href: "/customers", icon: Users, label: "לקוחות" },
  { href: "/products", icon: Package, label: "מוצרים" },
  { href: "/automations", icon: Zap, label: "אוטומציות" },
  { href: "/campaigns", icon: Megaphone, label: "קמפיינים" },
  { href: "/team", icon: UserCog, label: "צוות" },
  { href: "/widget", icon: MessageCircle, label: "ווידג'ט צ'אט" },
];

const settingsItems = [
  { href: "/settings/store", label: "אודות החנות" },
  { href: "/settings/persona", label: "אופי הסוכן" },
  { href: "/settings/integrations", label: "אינטגרציות" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [settingsOpen, setSettingsOpen] = useState(
    pathname.startsWith("/settings")
  );

  return (
    <aside className="fixed right-0 top-0 h-full w-64 bg-white border-l border-gray-200 flex flex-col z-40 shadow-sm">
      {/* Logo */}
      <div className="p-5 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-sm">AI</span>
          </div>
          <div>
            <p className="font-bold text-gray-900 text-base leading-tight">EnigmAI</p>
            <p className="text-xs text-gray-500">סוכן חכם לחנות</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {navItems.map(({ href, icon: Icon, label }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? "bg-indigo-50 text-indigo-700"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <Icon size={18} className={active ? "text-indigo-600" : "text-gray-400"} />
              {label}
            </Link>
          );
        })}

        {/* Settings expandable */}
        <button
          onClick={() => setSettingsOpen(!settingsOpen)}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            pathname.startsWith("/settings")
              ? "bg-indigo-50 text-indigo-700"
              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
          }`}
        >
          <Settings size={18} className={pathname.startsWith("/settings") ? "text-indigo-600" : "text-gray-400"} />
          <span className="flex-1 text-right">הגדרות</span>
          {settingsOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
        {settingsOpen && (
          <div className="mr-9 space-y-0.5">
            {settingsItems.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                  pathname === href
                    ? "bg-indigo-50 text-indigo-700 font-medium"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                {label}
              </Link>
            ))}
          </div>
        )}
      </nav>

      {/* Bottom admin link */}
      <div className="p-3 border-t border-gray-100">
        <Link
          href="/admin"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-colors"
        >
          <Shield size={18} className="text-gray-400" />
          פאנל ניהול
        </Link>
      </div>
    </aside>
  );
}
