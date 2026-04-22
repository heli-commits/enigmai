"use client";

import { useActionState } from "react";
import { useState } from "react";
import { Save, Bot, Sparkles, Eye, AlertCircle, CheckCircle2 } from "lucide-react";
import { savePersonaSettings } from "@/app/actions/settings";
import type { PersonaSettingsState } from "@/app/actions/settings";

type Initial = {
  agent_name: string;
  traits:     string;
  rules:      string;
  style:      string;
};

const empty: PersonaSettingsState = {};

export default function PersonaClient({ initial }: { initial: Initial }) {
  const [state, formAction, isPending] = useActionState(savePersonaSettings, empty);

  // Local state only for the preview panel (not persisted separately)
  const [agentName, setAgentName] = useState(initial.agent_name);
  const [traits,    setTraits]    = useState(initial.traits);
  const [rules,     setRules]     = useState(initial.rules);
  const [style,     setStyle]     = useState(initial.style);
  const [showPreview, setShowPreview] = useState(false);

  return (
    <form action={formAction} className="max-w-2xl space-y-5">

      {/* Feedback */}
      {state.success && (
        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3">
          <CheckCircle2 size={16} className="text-emerald-500 flex-shrink-0" />
          <p className="text-sm text-emerald-700">הגדרות הסוכן נשמרו בהצלחה!</p>
        </div>
      )}
      {state.error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
          <AlertCircle size={16} className="text-red-500 flex-shrink-0" />
          <p className="text-sm text-red-700">{state.error}</p>
        </div>
      )}

      <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 flex items-start gap-3">
        <Bot size={18} className="text-indigo-600 mt-0.5 flex-shrink-0" />
        <p className="text-sm text-indigo-700 text-right leading-relaxed">
          הגדרות אלו יוזרקו ישירות ל-System Prompt של הסוכן. שינויים ייכנסו לתוקף בשיחה הבאה.
        </p>
      </div>

      {/* Name & Role */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 sm:p-6 space-y-4">
        <h2 className="font-semibold text-gray-900 flex items-center gap-2 justify-end">
          שם ותפקיד
          <Sparkles size={16} className="text-indigo-500" />
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="text-right">
            <label className="text-sm font-medium text-gray-700 block mb-1.5">
              שם הסוכן <span className="text-red-500">*</span>
            </label>
            <input
              name="agent_name"
              type="text"
              value={agentName}
              onChange={(e) => setAgentName(e.target.value)}
              required
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-right focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder='למשל: "ארי"'
            />
          </div>
          <div className="text-right">
            <label className="text-sm font-medium text-gray-700 block mb-1.5">תפקיד / כינוי</label>
            <input
              name="role"
              type="text"
              defaultValue=""
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-right focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder='למשל: "מומחה המתנות"'
            />
          </div>
        </div>
      </div>

      {/* Traits */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 sm:p-6">
        <h2 className="font-semibold text-gray-900 mb-3 text-right">תכונות אופי</h2>
        <p className="text-sm text-gray-500 mb-3 text-right">תאר את אישיות הסוכן בכמה מילים</p>
        <textarea
          name="traits"
          value={traits}
          onChange={(e) => setTraits(e.target.value)}
          rows={3}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-right leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="מצחיק, אמפתי, מקצועי..."
        />
      </div>

      {/* Rules */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 sm:p-6">
        <h2 className="font-semibold text-gray-900 mb-3 text-right">חוקי התנהגות</h2>
        <p className="text-sm text-gray-500 mb-3 text-right">הגדר כיצד הסוכן יתנהג בתרחישים שונים</p>
        <textarea
          name="rules"
          value={rules}
          onChange={(e) => setRules(e.target.value)}
          rows={7}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-right leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder={"1. תמיד נסה אפסל...\n2. כשאין מידע, אמור בכנות..."}
        />
      </div>

      {/* Style */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 sm:p-6">
        <h2 className="font-semibold text-gray-900 mb-3 text-right">סגנון דיבור</h2>
        <p className="text-sm text-gray-500 mb-3 text-right">הנחה את הסוכן לגבי טון, שפה ופיסוק</p>
        <textarea
          name="style"
          value={style}
          onChange={(e) => setStyle(e.target.value)}
          rows={6}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-right leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="השתמש בעברית ישירה, הימנע מ..."
        />
      </div>

      {/* Preview & Save */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <button
          type="submit"
          disabled={isPending}
          className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-60 transition-all"
        >
          <Save size={15} />
          {isPending ? "שומר..." : "שמור שינויים"}
        </button>
        <button
          type="button"
          onClick={() => setShowPreview(!showPreview)}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
        >
          <Eye size={15} />
          תצוגה מקדימה
        </button>
      </div>

      {showPreview && (
        <div className="bg-gray-900 rounded-xl p-5">
          <p className="text-xs text-gray-500 mb-3 font-mono text-right">// System Prompt (תצוגה מקדימה)</p>
          <pre className="text-green-400 text-xs font-mono leading-relaxed whitespace-pre-wrap text-right" dir="rtl">
            {`אתה ${agentName}, סוכן AI של החנות.\n\nאופי: ${traits}\n\nחוקי התנהגות:\n${rules}\n\nסגנון דיבור:\n${style}`}
          </pre>
        </div>
      )}
    </form>
  );
}
