"use client";

import { Bell, Globe, LogOut, Settings, ChevronDown } from "lucide-react";
import { useState } from "react";
import { logout } from "@/app/actions/auth";

type UserMeta = {
  name: string;
  email: string;
  initials: string;
  storeName: string;
};

export default function TopBar({
  title,
  userMeta,
}: {
  title: string;
  userMeta: UserMeta;
}) {
  const [langOpen,    setLangOpen]    = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-30">
      <h1 className="text-lg font-semibold text-gray-900">{title}</h1>

      <div className="flex items-center gap-3">
        {/* Language toggle */}
        <div className="relative">
          <button
            onClick={() => setLangOpen(!langOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-gray-600 hover:bg-gray-50 border border-gray-200 transition-colors"
          >
            <Globe size={15} />
            <span>עברית</span>
            <ChevronDown size={13} />
          </button>
          {langOpen && (
            <div className="absolute left-0 top-10 bg-white rounded-lg shadow-lg border border-gray-100 py-1 w-32 z-50">
              <button className="w-full text-right px-3 py-2 text-sm text-indigo-700 font-medium hover:bg-gray-50">עברית</button>
              <button className="w-full text-right px-3 py-2 text-sm text-gray-600 hover:bg-gray-50">English</button>
            </div>
          )}
        </div>

        {/* Notifications */}
        <button className="relative p-2 rounded-lg text-gray-500 hover:bg-gray-50 transition-colors">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        {/* User profile */}
        <div className="relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-semibold">{userMeta.initials}</span>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900 leading-tight">{userMeta.name}</p>
              <p className="text-xs text-gray-500 leading-tight">{userMeta.storeName}</p>
            </div>
            <ChevronDown size={14} className="text-gray-400" />
          </button>

          {profileOpen && (
            <div className="absolute left-0 top-12 bg-white rounded-lg shadow-lg border border-gray-100 py-1 w-44 z-50">
              <div className="px-3 py-2 border-b border-gray-100">
                <p className="text-xs text-gray-400 truncate">{userMeta.email}</p>
              </div>
              <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50">
                <Settings size={14} />
                הגדרות חשבון
              </button>
              <form action={logout}>
                <button
                  type="submit"
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-50"
                >
                  <LogOut size={14} />
                  התנתקות
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
