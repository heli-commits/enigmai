"use client";

import { Bell, Globe, LogOut, Settings, ChevronDown, Menu } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { logout } from "@/app/actions/auth";
import { useLanguage } from "@/lib/i18n";

type UserMeta = {
  name:      string;
  email:     string;
  initials:  string;
  storeName: string;
};

export default function TopBar({
  title,
  userMeta,
  onMenuClick,
}: {
  title:       string;
  userMeta:    UserMeta;
  onMenuClick: () => void;
}) {
  const { lang, setLang, s } = useLanguage();
  const isRTL = s.dir === "rtl";

  const [langOpen,    setLangOpen]    = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen,   setNotifOpen]   = useState(false);

  const barRef = useRef<HTMLElement>(null);

  useEffect(() => {
    function onOutsideClick(e: MouseEvent) {
      if (!barRef.current?.contains(e.target as Node)) {
        setLangOpen(false);
        setProfileOpen(false);
        setNotifOpen(false);
      }
    }
    document.addEventListener("mousedown", onOutsideClick);
    return () => document.removeEventListener("mousedown", onOutsideClick);
  }, []);

  function closeAll() {
    setLangOpen(false);
    setProfileOpen(false);
    setNotifOpen(false);
  }

  const dropAlign = isRTL ? { left: 0 } : { right: 0 };

  return (
    <header
      ref={barRef}
      className="h-14 sm:h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-30"
    >
      {/* Left side: hamburger (mobile) + title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>
        <h1 className="text-base sm:text-lg font-semibold text-gray-900 truncate max-w-[160px] sm:max-w-none">
          {title}
        </h1>
      </div>

      {/* Right side: controls */}
      <div className="flex items-center gap-2 sm:gap-3">

        {/* Language toggle – hidden on very small screens */}
        <div className="relative hidden sm:block">
          <button
            onClick={() => { closeAll(); setLangOpen((v) => !v); }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-gray-600 hover:bg-gray-50 border border-gray-200 transition-colors"
          >
            <Globe size={15} />
            <span className="hidden md:inline">{lang === "he" ? "עברית" : "English"}</span>
            <ChevronDown size={13} />
          </button>

          {langOpen && (
            <div
              style={dropAlign}
              className="absolute top-10 bg-white rounded-lg shadow-lg border border-gray-100 py-1 w-36 z-50"
            >
              {(["he", "en"] as const).map((l) => (
                <button
                  key={l}
                  onClick={() => { setLang(l); setLangOpen(false); }}
                  className={`w-full px-3 py-2 text-sm hover:bg-gray-50 text-right ${
                    lang === l ? "text-indigo-700 font-semibold" : "text-gray-600"
                  }`}
                >
                  {l === "he" ? "עברית" : "English"}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notifications bell */}
        <div className="relative">
          <button
            onClick={() => { closeAll(); setNotifOpen((v) => !v); }}
            className="p-2 rounded-lg text-gray-500 hover:bg-gray-50 transition-colors"
            aria-label={s.notifications}
          >
            <Bell size={18} />
          </button>

          {notifOpen && (
            <div
              style={isRTL ? { left: 0 } : { right: 0 }}
              className="absolute top-10 bg-white rounded-xl shadow-lg border border-gray-100 w-72 z-50"
            >
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="text-sm font-semibold text-gray-900">{s.notifications}</p>
              </div>
              <div className="py-10 text-center">
                <Bell size={28} className="mx-auto text-gray-200 mb-3" />
                <p className="text-sm text-gray-400">{s.noNotifications}</p>
              </div>
            </div>
          )}
        </div>

        {/* User profile */}
        <div className="relative">
          <button
            onClick={() => { closeAll(); setProfileOpen((v) => !v); }}
            className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white text-sm font-semibold">{userMeta.initials}</span>
            </div>
            <div className={`hidden sm:block ${isRTL ? "text-right" : "text-left"}`}>
              <p className="text-sm font-medium text-gray-900 leading-tight">{userMeta.name}</p>
              <p className="text-xs text-gray-500 leading-tight">{userMeta.storeName}</p>
            </div>
            <ChevronDown size={14} className="text-gray-400 hidden sm:block" />
          </button>

          {profileOpen && (
            <div
              style={isRTL ? { left: 0 } : { right: 0 }}
              className="absolute top-12 bg-white rounded-lg shadow-lg border border-gray-100 py-1 w-44 z-50"
            >
              <div className="px-3 py-2 border-b border-gray-100">
                <p className="text-xs text-gray-400 truncate">{userMeta.email}</p>
              </div>
              {/* Mobile-only language toggle inside profile */}
              <div className="sm:hidden border-b border-gray-100 p-2">
                <p className="text-xs text-gray-400 px-1 mb-1">{s.notifications}</p>
                <div className="flex gap-1">
                  {(["he", "en"] as const).map((l) => (
                    <button
                      key={l}
                      onClick={() => { setLang(l); setProfileOpen(false); }}
                      className={`flex-1 py-1.5 text-xs rounded-lg transition-colors ${
                        lang === l
                          ? "bg-indigo-600 text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {l === "he" ? "עברית" : "EN"}
                    </button>
                  ))}
                </div>
              </div>
              <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50">
                <Settings size={14} />
                {s.accountSettings}
              </button>
              <form action={logout}>
                <button
                  type="submit"
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-50"
                >
                  <LogOut size={14} />
                  {s.logout}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
