"use client";

import { useState } from "react";
import { Save, Bot, Sparkles, Eye } from "lucide-react";

export default function PersonaSettingsPage() {
  const [persona, setPersona] = useState({
    name: "ארי",
    role: "מומחה המתנות",
    traits: "מצחיק, ישיר, קצת חוצפן, אוהב לעזור ומכיר כל מוצר בחנות",
    rules: `1. תמיד נסה לעשות אפסל – אחרי כל שאלה, הצע מוצר משלים.
2. כשאין לך מידע על מוצר ספציפי, אמור זאת בכנות.
3. כשלקוח מתוסכל, העבר לנציג אנושי.
4. אל תזכיר מחירים של מתחרים.
5. בסוף כל שיחה תמיד שאל "יש עוד משהו שאוכל לעזור?"`,
    style: `דבר בעברית ישראלית סלנגית אבל מכבדת.
השתמש באמוג'י בצורה מינימלית (מקסימום אחד להודעה).
הימנע מהתחלת משפטים עם "בטח!" – זה מלאכותי.
כתוב בסגנון קצר וממוקד, לא יותר מ-3 משפטים להודעה.
סיים המלצות עם שאלה פתוחה.`,
  });

  const [saved, setSaved] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="max-w-2xl space-y-5">
      <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 flex items-start gap-3">
        <Bot size={18} className="text-indigo-600 mt-0.5 flex-shrink-0" />
        <p className="text-sm text-indigo-700 text-right leading-relaxed">
          הגדרות אלו יוזרקו ישירות ל-System Prompt של הסוכן. שינויים ייכנסו לתוקף בשיחה הבאה.
        </p>
      </div>

      {/* Name & Role */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="font-semibold text-gray-900 flex items-center gap-2 justify-end">
          שם ותפקיד
          <Sparkles size={16} className="text-indigo-500" />
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-right">
            <label className="text-sm font-medium text-gray-700 block mb-1.5">שם הסוכן</label>
            <input
              type="text"
              value={persona.name}
              onChange={(e) => setPersona({ ...persona, name: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-right focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder='למשל: "ארי"'
            />
          </div>
          <div className="text-right">
            <label className="text-sm font-medium text-gray-700 block mb-1.5">תפקיד / כינוי</label>
            <input
              type="text"
              value={persona.role}
              onChange={(e) => setPersona({ ...persona, role: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-right focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder='למשל: "מומחה המתנות"'
            />
          </div>
        </div>
      </div>

      {/* Character traits */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="font-semibold text-gray-900 mb-3 text-right">תכונות אופי</h2>
        <p className="text-sm text-gray-500 mb-3 text-right">תאר את אישיות הסוכן בכמה מילים</p>
        <textarea
          value={persona.traits}
          onChange={(e) => setPersona({ ...persona, traits: e.target.value })}
          rows={3}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-right leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="מצחיק, אמפתי, מקצועי..."
        />
      </div>

      {/* Rules */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="font-semibold text-gray-900 mb-3 text-right">חוקי התנהגות</h2>
        <p className="text-sm text-gray-500 mb-3 text-right">הגדר כיצד הסוכן יתנהג בתרחישים שונים</p>
        <textarea
          value={persona.rules}
          onChange={(e) => setPersona({ ...persona, rules: e.target.value })}
          rows={7}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-right leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="1. תמיד נסה אפסל...&#10;2. כשאין מידע, אמור בכנות..."
        />
      </div>

      {/* Speaking style */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="font-semibold text-gray-900 mb-3 text-right">סגנון דיבור</h2>
        <p className="text-sm text-gray-500 mb-3 text-right">הנחה את הסוכן לגבי טון, שפה ופיסוק</p>
        <textarea
          value={persona.style}
          onChange={(e) => setPersona({ ...persona, style: e.target.value })}
          rows={6}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-right leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="השתמש בעברית ישירה, הימנע מ..."
        />
      </div>

      {/* Preview & Save */}
      <div className="flex items-center justify-between">
        <button
          onClick={handleSave}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium transition-all ${
            saved ? "bg-emerald-500 text-white" : "bg-indigo-600 text-white hover:bg-indigo-700"
          }`}
        >
          <Save size={15} />
          {saved ? "נשמר!" : "שמור שינויים"}
        </button>
        <button
          onClick={() => setShowPreview(!showPreview)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
        >
          <Eye size={15} />
          תצוגה מקדימה
        </button>
      </div>

      {showPreview && (
        <div className="bg-gray-900 rounded-xl p-5 text-left">
          <p className="text-xs text-gray-500 mb-3 font-mono text-right">// System Prompt (תצוגה מקדימה)</p>
          <pre className="text-green-400 text-xs font-mono leading-relaxed whitespace-pre-wrap text-right" dir="rtl">
            {`אתה ${persona.name}, ${persona.role} של החנות.

אופי: ${persona.traits}

חוקי התנהגות:
${persona.rules}

סגנון דיבור:
${persona.style}`}
          </pre>
        </div>
      )}
    </div>
  );
}
