"use client";

import { useState } from "react";
import { Save, Globe, MapPin, Phone, Clock, Store } from "lucide-react";

const MAX_CHARS = 1500;

export default function StoreSettingsPage() {
  const [about, setAbout] = useState(
    `שמנו הוא "מתנות עם לב" – חנות מתנות ועיצוב הבית המתמחה במוצרים ייחודיים, אישיים ומרגשים. אנחנו מאמינים שכל מתנה צריכה לספר סיפור.

קהל היעד שלנו הם אנשים שמחפשים מתנות מיוחדות לאירועים – יומי הולדת, חתונות, ימי נישואין, לידות ועוד. אנחנו מציעים גם אפשרות להתאמה אישית.

היתרונות שלנו: משלוח מהיר עד 3 ימי עסקים, אריזת מתנה חינם, שירות לקוחות אישי וזמינות גבוהה.`
  );
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="max-w-2xl space-y-6">
      {/* Store info fields */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
        <h2 className="font-semibold text-gray-900 flex items-center gap-2 justify-end">
          <span>פרטי החנות הבסיסיים</span>
          <Store size={18} className="text-indigo-600" />
        </h2>

        <div className="space-y-4">
          <div className="text-right">
            <label className="text-sm font-medium text-gray-700 block mb-1.5">שם החנות</label>
            <input
              type="text"
              defaultValue="מתנות עם לב"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-right focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="text-right">
              <label className="text-sm font-medium text-gray-700 block mb-1.5 flex items-center justify-end gap-1.5">
                אתר
                <Globe size={13} className="text-gray-400" />
              </label>
              <input
                type="text"
                defaultValue="www.giftswithlove.co.il"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-right focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="text-right">
              <label className="text-sm font-medium text-gray-700 block mb-1.5 flex items-center justify-end gap-1.5">
                טלפון
                <Phone size={13} className="text-gray-400" />
              </label>
              <input
                type="text"
                defaultValue="03-1234567"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-right focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="text-right">
              <label className="text-sm font-medium text-gray-700 block mb-1.5 flex items-center justify-end gap-1.5">
                כתובת
                <MapPin size={13} className="text-gray-400" />
              </label>
              <input
                type="text"
                defaultValue="תל אביב, ישראל"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-right focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="text-right">
              <label className="text-sm font-medium text-gray-700 block mb-1.5 flex items-center justify-end gap-1.5">
                שעות פעילות
                <Clock size={13} className="text-gray-400" />
              </label>
              <input
                type="text"
                defaultValue="א׳–ה׳ 9:00–18:00"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-right focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* About text area */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <span className={`text-xs font-medium ${about.length > MAX_CHARS ? "text-red-500" : "text-gray-400"}`}>
            {about.length} / {MAX_CHARS}
          </span>
          <h2 className="font-semibold text-gray-900">תיאור החנות לסוכן AI</h2>
        </div>
        <p className="text-sm text-gray-500 mb-3 text-right">
          זה הקשר שהסוכן יקבל לכל שיחה. תאר את החנות, קהל היעד, יתרונות ומדיניות.
        </p>
        <textarea
          value={about}
          onChange={(e) => setAbout(e.target.value.slice(0, MAX_CHARS))}
          rows={10}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-right leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 font-heebo"
          placeholder="תאר את החנות שלך..."
        />
        <div className="mt-2">
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                about.length > MAX_CHARS * 0.9 ? "bg-orange-400" : "bg-indigo-500"
              }`}
              style={{ width: `${Math.min(100, (about.length / MAX_CHARS) * 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Save button */}
      <div className="flex justify-start">
        <button
          onClick={handleSave}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium transition-all ${
            saved
              ? "bg-emerald-500 text-white"
              : "bg-indigo-600 text-white hover:bg-indigo-700"
          }`}
        >
          <Save size={15} />
          {saved ? "נשמר בהצלחה!" : "שמור שינויים"}
        </button>
      </div>
    </div>
  );
}
