"use client";

import { usePathname } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import TopBar  from "@/components/layout/TopBar";
import { LanguageProvider, useLanguage, PAGE_TITLES } from "@/lib/i18n";

type UserMeta = {
  name:      string;
  email:     string;
  initials:  string;
  storeName: string;
};

function Layout({ children, userMeta }: { children: React.ReactNode; userMeta: UserMeta }) {
  const { lang, s } = useLanguage();
  const pathname    = usePathname();
  const title       = PAGE_TITLES[pathname]?.[lang] ?? "EnigmAI";
  const isRTL       = s.dir === "rtl";

  return (
    <div className="flex min-h-screen bg-gray-50" dir={s.dir}>
      <Sidebar />
      <div className={`flex-1 ${isRTL ? "mr-64" : "ml-64"} flex flex-col min-h-screen`}>
        <TopBar title={title} userMeta={userMeta} />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}

export default function DashboardLayoutClient({
  children,
  userMeta,
}: {
  children: React.ReactNode;
  userMeta: UserMeta;
}) {
  return (
    <LanguageProvider>
      <Layout userMeta={userMeta}>{children}</Layout>
    </LanguageProvider>
  );
}
