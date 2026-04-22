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
  FlaskConical,
  X,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useLanguage } from "@/lib/i18n";

type NavItem = {
  href:     string;
  icon:     React.ElementType;
  labelKey: keyof ReturnType<typeof useLanguage>["s"]["nav"];
};

const navItems: NavItem[] = [
  { href: "/dashboard",   icon: LayoutDashboard, labelKey: "dashboard"   },
  { href: "/chat-logs",   icon: MessageSquare,   labelKey: "chatLogs"    },
  { href: "/support",     icon: Headphones,      labelKey: "support"     },
  { href: "/customers",   icon: Users,           labelKey: "customers"   },
  { href: "/products",    icon: Package,         labelKey: "products"    },
  { href: "/automations", icon: Zap,             labelKey: "automations" },
  { href: "/campaigns",   icon: Megaphone,       labelKey: "campaigns"   },
  { href: "/team",        icon: UserCog,         labelKey: "team"        },
  { href: "/widget",      icon: MessageCircle,   labelKey: "widget"      },
  { href: "/playground",  icon: FlaskConical,    labelKey: "playground"  },
];

type SettingsItem = {
  href:     string;
  labelKey: keyof ReturnType<typeof useLanguage>["s"]["nav"];
};

const settingsItems: SettingsItem[] = [
  { href: "/settings/store",        labelKey: "settingsStore"        },
  { href: "/settings/persona",      labelKey: "settingsPersona"      },
  { href: "/settings/integrations", labelKey: "settingsIntegrations" },
];

type Props = {
  open:    boolean;
  onClose: () => void;
};

export default function Sidebar({ open, onClose }: Props) {
  const { s }    = useLanguage();
  const pathname = usePathname();
  const isRTL    = s.dir === "rtl";
  const [settingsOpen, setSettingsOpen] = useState(pathname.startsWith("/settings"));

  // Close sidebar on route change (mobile)
  useEffect(() => { onClose(); }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  const sideEdge    = isRTL ? "right-0 border-l" : "left-0 border-r";
  const translateOut = isRTL ? "translate-x-full" : "-translate-x-full";

  return (
    <aside
      className={`
        fixed ${sideEdge} top-0 h-full w-64 bg-white border-gray-200 flex flex-col z-40 shadow-sm
        transform transition-transform duration-200
        ${open ? "translate-x-0" : translateOut}
        lg:translate-x-0
      `}
    >
      {/* Logo row */}
      <div className="p-5 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-sm">AI</span>
          </div>
          <div>
            <p className="font-bold text-gray-900 text-base leading-tight">EnigmAI</p>
            <p className="text-xs text-gray-500">{isRTL ? "סוכן חכם לחנות" : "Smart store agent"}</p>
          </div>
        </div>
        {/* Close button – mobile only */}
        <button
          onClick={onClose}
          className="lg:hidden p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 transition-colors"
        >
          <X size={18} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {navItems.map(({ href, icon: Icon, labelKey }) => {
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
              {s.nav[labelKey]}
            </Link>
          );
        })}

        {/* Settings – expandable */}
        <button
          onClick={() => setSettingsOpen(!settingsOpen)}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            pathname.startsWith("/settings")
              ? "bg-indigo-50 text-indigo-700"
              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
          }`}
        >
          <Settings
            size={18}
            className={pathname.startsWith("/settings") ? "text-indigo-600" : "text-gray-400"}
          />
          <span className="flex-1 text-right">{s.nav.settings}</span>
          {settingsOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
        {settingsOpen && (
          <div className={`${isRTL ? "mr-9" : "ml-9"} space-y-0.5`}>
            {settingsItems.map(({ href, labelKey }) => (
              <Link
                key={href}
                href={href}
                className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                  pathname === href
                    ? "bg-indigo-50 text-indigo-700 font-medium"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                {s.nav[labelKey]}
              </Link>
            ))}
          </div>
        )}
      </nav>

      {/* Admin link */}
      <div className="p-3 border-t border-gray-100">
        <Link
          href="/admin"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-colors"
        >
          <Shield size={18} className="text-gray-400" />
          {s.nav.admin}
        </Link>
      </div>
    </aside>
  );
}
