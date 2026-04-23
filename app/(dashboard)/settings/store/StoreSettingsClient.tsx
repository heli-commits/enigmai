"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { Save, Globe, MapPin, Phone, Clock, Store, AlertCircle, CheckCircle2, Lock, Wand2 } from "lucide-react";
import { saveStoreSettings } from "@/app/actions/settings";
import type { StoreSettingsState } from "@/app/actions/settings";

const MAX_CHARS = 1500;

type Initial = {
  name:    string;
  domain:  string;
  phone:   string;
  address: string;
  about:   string;
};

const empty: StoreSettingsState = {};

export default function StoreSettingsClient({ initial }: { initial: Initial }) {
  const [state, formAction, isPending] = useActionState(saveStoreSettings, empty);
  const [showRequestChange, setShowRequestChange] = useState(false);

  const domainLocked = initial.domain !== "";

  return (
    <form action={formAction} className="max-w-2xl space-y-6" dir="rtl">

      {/* Feedback banners */}
      {state.success && (
        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3">
          <CheckCircle2 size={16} className="text-emerald-500 flex-shrink-0" />
          <p className="text-sm text-emerald-700">השינויים נשמרו בהצלחה!</p>
        </div>
      )}
      {state.success && domainLocked && (
        <div className="flex items-center justify-between gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
          <Link
            href="/settings/persona"
            className="flex items-center gap-1.5 text-sm font-medium text-amber-700 hover:underline whitespace-nowrap"
          >
            <Wand2 size={14} />
            צור אישיות סוכן
          </Link>
          <p className="text-sm text-amber-800">האתר נשמר! רוצה ליצור אישיות סוכן אוטומטית?</p>
        </div>
      )}
      {state.error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
          <AlertCircle size={16} className="text-red-500 flex-shrink-0" />
          <p className="text-sm text-red-700">{state.error}</p>
        </div>
      )}

      {/* Store info fields */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 sm:p-6 space-y-5">
        <h2 className="font-semibold text-gray-900 flex items-center gap-2 justify-end">
          <span>פרטי החנות הבסיסיים</span>
          <Store size={18} className="text-indigo-600" />
        </h2>

        <div className="space-y-4">
          <div className="text-right">
            <label className="text-sm font-medium text-gray-700 block mb-1.5">
              שם החנות <span className="text-red-500">*</span>
            </label>
            <input
              name="name"
              type="text"
              defaultValue={initial.name}
              required
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-right focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Domain field – locked once set */}
            <div className="text-right">
              <label className="text-sm font-medium text-gray-700 block mb-1.5 flex items-center justify-end gap-1.5">
                אתר
                <Globe size={13} className="text-gray-400" />
              </label>
              {domainLocked ? (
                <>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setShowRequestChange(v => !v)}
                      className="text-xs text-indigo-600 hover:underline whitespace-nowrap"
                    >
                      בקש שינוי
                    </button>
                    <input
                      name="domain"
                      type="text"
                      readOnly
                      value={initial.domain}
                      className="flex-1 min-w-0 border border-gray-200 bg-gray-50 rounded-xl px-4 py-2.5 text-sm text-right text-gray-500 cursor-not-allowed"
                    />
                    <Lock size={15} className="text-gray-400 flex-shrink-0" />
                  </div>
                  {showRequestChange && (
                    <p className="text-xs text-amber-600 mt-1.5">
                      לשינוי כתובת האתר, פנה לתמיכה: support@enigmai.co.il
                    </p>
                  )}
                </>
              ) : (
                <input
                  name="domain"
                  type="text"
                  defaultValue={initial.domain}
                  placeholder="www.myshop.co.il"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-right focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              )}
            </div>

            <div className="text-right">
              <label className="text-sm font-medium text-gray-700 block mb-1.5 flex items-center justify-end gap-1.5">
                טלפון
                <Phone size={13} className="text-gray-400" />
              </label>
              <input
                name="phone"
                type="text"
                defaultValue={initial.phone}
                placeholder="03-1234567"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-right focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="text-right">
              <label className="text-sm font-medium text-gray-700 block mb-1.5 flex items-center justify-end gap-1.5">
                כתובת
                <MapPin size={13} className="text-gray-400" />
              </label>
              <input
                name="address"
                type="text"
                defaultValue={initial.address}
                placeholder="תל אביב, ישראל"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-right focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="text-right">
              <label className="text-sm font-medium text-gray-700 block mb-1.5 flex items-center justify-end gap-1.5">
                שעות פעילות
                <Clock size={13} className="text-gray-400" />
              </label>
              <input
                name="hours"
                type="text"
                defaultValue=""
                placeholder="א׳–ה׳ 9:00–18:00"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-right focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* About textarea */}
      <AboutField defaultValue={initial.about} maxChars={MAX_CHARS} />

      {/* Save */}
      <div className="flex justify-start">
        <button
          type="submit"
          disabled={isPending}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-60 transition-all"
        >
          <Save size={15} />
          {isPending ? "שומר..." : "שמור שינויים"}
        </button>
      </div>
    </form>
  );
}

function AboutField({ defaultValue, maxChars }: { defaultValue: string; maxChars: number }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-medium text-gray-400" id="about-counter">
          {defaultValue.length} / {maxChars}
        </span>
        <h2 className="font-semibold text-gray-900">תיאור החנות לסוכן AI</h2>
      </div>
      <p className="text-sm text-gray-500 mb-3 text-right">
        זה הקשר שהסוכן יקבל לכל שיחה. תאר את החנות, קהל היעד, יתרונות ומדיניות.
      </p>
      <textarea
        name="about"
        defaultValue={defaultValue}
        maxLength={maxChars}
        rows={10}
        onInput={(e) => {
          const el      = e.currentTarget;
          const counter = document.getElementById("about-counter");
          if (counter) counter.textContent = `${el.value.length} / ${maxChars}`;
        }}
        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-right leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
        placeholder="תאר את החנות שלך..."
      />
    </div>
  );
}
