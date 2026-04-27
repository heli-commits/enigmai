"use client";

import { useState } from "react";
import {
  Save, Bot, Sparkles, AlertCircle, CheckCircle2,
  Settings2, BookOpen, Shield, Loader2, Wand2,
} from "lucide-react";
import { savePersonaTabAction } from "@/app/actions/settings";

type Initial = {
  agent_name:   string;
  role:         string;
  greeting:     string;
  traits:       string;
  rules:        string;
  escalation:   string;
  style:        string;
  knowledge:    string;
  faqs:         string;
  restrictions: string;
  domain:       string;
};

type TabId = "identity" | "behavior" | "style" | "knowledge" | "restrictions";
type TabState = { pending: boolean; success: boolean; error: string };

const EMPTY: TabState = { pending: false, success: false, error: "" };

export default function PersonaClient({ initial }: { initial: Initial }) {
  const [activeTab, setActiveTab] = useState<TabId>("identity");

  const [ts, setTs] = useState<Record<TabId, TabState>>({
    identity:     { ...EMPTY },
    behavior:     { ...EMPTY },
    style:        { ...EMPTY },
    knowledge:    { ...EMPTY },
    restrictions: { ...EMPTY },
  });

  const [agentName,    setAgentName]    = useState(initial.agent_name);
  const [role,         setRole]         = useState(initial.role);
  const [greeting,     setGreeting]     = useState(initial.greeting);
  const [traits,       setTraits]       = useState(initial.traits);
  const [rules,        setRules]        = useState(initial.rules);
  const [escalation,   setEscalation]   = useState(initial.escalation);
  const [style,        setStyle]        = useState(initial.style);
  const [knowledge,    setKnowledge]    = useState(initial.knowledge);
  const [faqs,         setFaqs]         = useState(initial.faqs);
  const [restrictions, setRestrictions] = useState(initial.restrictions);
  const [generating,   setGenerating]   = useState(false);
  const [generateError, setGenerateError] = useState("");

  function setTab(tab: TabId, update: Partial<TabState>) {
    setTs(prev => ({ ...prev, [tab]: { ...prev[tab], ...update } }));
  }

  async function saveTab(
    tab: TabId,
    personaUpdates: Record<string, string>,
    agentNameUpdate?: string
  ) {
    setTab(tab, { pending: true, success: false, error: "" });
    try {
      const result = await savePersonaTabAction(personaUpdates, agentNameUpdate);
      setTab(tab, {
        pending: false,
        success: result.success ?? false,
        error:   result.error   ?? "",
      });
    } catch {
      setTab(tab, { pending: false, success: false, error: "שגיאה לא ידועה" });
    }
  }

  async function generateFromStore() {
    if (!initial.domain) return;
    setGenerating(true);
    setGenerateError("");
    try {
      const url = initial.domain.startsWith("http")
        ? initial.domain
        : `https://${initial.domain}`;
      const res  = await fetch("/api/scrape-store", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ url }),
      });
      const data = await res.json();
      if (!res.ok) {
        setGenerateError(data.error ?? "שגיאה בניתוח האתר");
        return;
      }
      if (data.persona) {
        const p = data.persona;
        if (p.traits)        setTraits(p.traits);
        if (p.greeting)      setGreeting(p.greeting);
        if (p.role)          setRole(p.role);
        if (p.style)         setStyle(p.style);
        if (p.rules)         setRules(p.rules);
        if (p.escalation)    setEscalation(p.escalation);
        if (p.knowledge)     setKnowledge(p.knowledge);
        if (p.faqs)          setFaqs(p.faqs);
        if (p.restrictions)  setRestrictions(p.restrictions);
        setActiveTab("identity");
      }
    } catch {
      setGenerateError("לא ניתן להתחבר לשרת");
    } finally {
      setGenerating(false);
    }
  }

  const tabs: Array<{ id: TabId; label: string; icon: React.ReactNode }> = [
    { id: "identity",     label: "זהות",    icon: <Bot size={14} /> },
    { id: "behavior",     label: "התנהגות", icon: <Settings2 size={14} /> },
    { id: "style",        label: "סגנון",   icon: <Sparkles size={14} /> },
    { id: "knowledge",    label: "ידע",     icon: <BookOpen size={14} /> },
    { id: "restrictions", label: "הגבלות",  icon: <Shield size={14} /> },
  ];

  const GenerateBanner = () => (
    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center justify-between gap-3">
      <button
        type="button"
        disabled={generating}
        onClick={generateFromStore}
        className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg text-sm font-medium hover:bg-amber-600 disabled:opacity-60 transition-colors whitespace-nowrap"
      >
        {generating ? <Loader2 size={14} className="animate-spin" /> : <Wand2 size={14} />}
        {generating ? "מנתח אתר..." : "צור מהאתר"}
      </button>
      <p className="text-sm text-amber-700 text-right">ייבא ידע אוטומטי מ-{initial.domain}</p>
    </div>
  );

  return (
    <div className="max-w-2xl" dir="rtl">
      {/* Info banner */}
      <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 flex items-start gap-3 mb-5">
        <Bot size={18} className="text-indigo-600 mt-0.5 flex-shrink-0" />
        <p className="text-sm text-indigo-700 leading-relaxed">
          הגדרות אלו יוזרקו ישירות ל-System Prompt של הסוכן. שינויים ייכנסו לתוקף בשיחה הבאה.
        </p>
      </div>

      {generateError && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-5">
          <AlertCircle size={16} className="text-red-500 flex-shrink-0" />
          <p className="text-sm text-red-700">{generateError}</p>
        </div>
      )}

      {/* Tab strip */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-5">
        {tabs.map(t => (
          <button
            key={t.id}
            type="button"
            onClick={() => setActiveTab(t.id)}
            className={`flex-1 flex items-center justify-center gap-1.5 px-2 py-2 rounded-lg text-xs font-medium transition-all ${
              activeTab === t.id
                ? "bg-white text-indigo-700 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {t.icon}
            <span className="hidden sm:inline">{t.label}</span>
          </button>
        ))}
      </div>

      {/* ── Identity ── */}
      {activeTab === "identity" && (
        <div className="space-y-5">
          <TabFeedback state={ts.identity} />
          {initial.domain && <GenerateBanner />}
          <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
            <h2 className="font-semibold text-gray-900 flex items-center gap-2 justify-end">
              שם ותפקיד <Bot size={16} className="text-indigo-500" />
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="text-right">
                <label className="text-sm font-medium text-gray-700 block mb-1.5">
                  שם הסוכן <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={agentName}
                  onChange={e => setAgentName(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-right focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="ארי"
                />
              </div>
              <div className="text-right">
                <label className="text-sm font-medium text-gray-700 block mb-1.5">תפקיד</label>
                <input
                  type="text"
                  value={role}
                  onChange={e => setRole(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-right focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="מומחה שירות לקוחות"
                />
              </div>
            </div>
            <div className="text-right">
              <label className="text-sm font-medium text-gray-700 block mb-1.5">ברכת פתיחה</label>
              <input
                type="text"
                value={greeting}
                onChange={e => setGreeting(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-right focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="שלום! אני ארי, איך אפשר לעזור?"
              />
            </div>
            <div className="text-right">
              <label className="text-sm font-medium text-gray-700 block mb-1.5">תכונות אופי</label>
              <textarea
                value={traits}
                onChange={e => setTraits(e.target.value)}
                rows={3}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-right leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="מצחיק, אמפתי, מקצועי, סבלני..."
              />
            </div>
          </div>
          <SaveRow
            pending={ts.identity.pending}
            onSave={() => saveTab("identity", { role, greeting, traits }, agentName)}
          />
        </div>
      )}

      {/* ── Behavior ── */}
      {activeTab === "behavior" && (
        <div className="space-y-5">
          <TabFeedback state={ts.behavior} />
          <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
            <h2 className="font-semibold text-gray-900 flex items-center gap-2 justify-end">
              חוקי התנהגות <Settings2 size={16} className="text-indigo-500" />
            </h2>
            <div className="text-right">
              <label className="text-sm font-medium text-gray-700 block mb-1">כללים</label>
              <p className="text-xs text-gray-500 mb-2">כיצד הסוכן יתנהג בתרחישים שונים</p>
              <textarea
                value={rules}
                onChange={e => setRules(e.target.value)}
                rows={8}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-right leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder={"1. תמיד נסה לאפסל לפני סגירת שיחה\n2. כשאין מידע, אמור בכנות שתבדוק\n3. אל תבטיח הנחות ללא אישור"}
              />
            </div>
            <div className="text-right">
              <label className="text-sm font-medium text-gray-700 block mb-1">אסקלציה לנציג אנושי</label>
              <p className="text-xs text-gray-500 mb-2">מתי להעביר שיחה לנציג?</p>
              <textarea
                value={escalation}
                onChange={e => setEscalation(e.target.value)}
                rows={4}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-right leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="כשהלקוח מבקש במפורש, כשיש תלונה חמורה, כשאין לי תשובה אחרי 2 ניסיונות..."
              />
            </div>
          </div>
          <SaveRow
            pending={ts.behavior.pending}
            onSave={() => saveTab("behavior", { rules, escalation })}
          />
        </div>
      )}

      {/* ── Style ── */}
      {activeTab === "style" && (
        <div className="space-y-5">
          <TabFeedback state={ts.style} />
          <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
            <h2 className="font-semibold text-gray-900 flex items-center gap-2 justify-end">
              סגנון דיבור <Sparkles size={16} className="text-indigo-500" />
            </h2>
            <p className="text-sm text-gray-500 text-right">הנחה את הסוכן לגבי טון, שפה ופיסוק</p>
            <textarea
              value={style}
              onChange={e => setStyle(e.target.value)}
              rows={8}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-right leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder={"השתמש בעברית ישירה וחמה\nהימנע מביטויים פורמליים\nהשתמש ב-Emoji בצורה מדודה"}
            />
          </div>
          {/* System prompt preview */}
          <div className="bg-gray-900 rounded-xl p-5">
            <p className="text-xs text-gray-500 mb-3 font-mono">// System Prompt – תצוגה מקדימה</p>
            <pre className="text-green-400 text-xs font-mono leading-relaxed whitespace-pre-wrap" dir="rtl">
              {`אתה ${agentName || "ארי"}, ${role || "סוכן AI"} של החנות.\n\nברכה: ${greeting || "(לא הוגדר)"}\n\nאופי: ${traits || "(לא הוגדר)"}\n\nסגנון דיבור:\n${style || "(לא הוגדר)"}`}
            </pre>
          </div>
          <SaveRow
            pending={ts.style.pending}
            onSave={() => saveTab("style", { style })}
          />
        </div>
      )}

      {/* ── Knowledge ── */}
      {activeTab === "knowledge" && (
        <div className="space-y-5">
          <TabFeedback state={ts.knowledge} />
          {initial.domain && <GenerateBanner />}
          <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
            <h2 className="font-semibold text-gray-900 flex items-center gap-2 justify-end">
              מאגר ידע <BookOpen size={16} className="text-indigo-500" />
            </h2>
            <div className="text-right">
              <label className="text-sm font-medium text-gray-700 block mb-1">מידע כללי על החנות</label>
              <p className="text-xs text-gray-500 mb-2">עובדות חשובות שהסוכן חייב לדעת</p>
              <textarea
                value={knowledge}
                onChange={e => setKnowledge(e.target.value)}
                rows={6}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-right leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder={"• מדיניות החזרות: 30 יום\n• משלוח חינם מ-200₪\n• שעות שירות: א׳–ה׳ 9–17"}
              />
            </div>
            <div className="text-right">
              <label className="text-sm font-medium text-gray-700 block mb-1">שאלות ותשובות נפוצות</label>
              <textarea
                value={faqs}
                onChange={e => setFaqs(e.target.value)}
                rows={6}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-right leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder={"ש: כמה זמן לקבל משלוח?\nת: 3–5 ימי עסקים\n\nש: האם יש משלוח לחו״ל?\nת: כן, לאירופה ולארה״ב"}
              />
            </div>
          </div>
          <SaveRow
            pending={ts.knowledge.pending}
            onSave={() => saveTab("knowledge", { knowledge, faqs })}
          />
        </div>
      )}

      {/* ── Restrictions ── */}
      {activeTab === "restrictions" && (
        <div className="space-y-5">
          <TabFeedback state={ts.restrictions} />
          <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
            <h2 className="font-semibold text-gray-900 flex items-center gap-2 justify-end">
              הגבלות <Shield size={16} className="text-indigo-500" />
            </h2>
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 text-right">
              <p className="text-xs text-yellow-700">
                הגבל את הסוכן מדיבור על נושאים לא רצויים, מתן מידע שגוי, או הצגת מתחרים.
              </p>
            </div>
            <div className="text-right">
              <label className="text-sm font-medium text-gray-700 block mb-1.5">דברים שאסורים לסוכן</label>
              <textarea
                value={restrictions}
                onChange={e => setRestrictions(e.target.value)}
                rows={8}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-right leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder={"• אל תציין מחירים של מתחרים\n• אל תבטיח זמני משלוח ספציפיים\n• אל תדון בנושאים פוליטיים\n• אל תחשוף מידע פנימי"}
              />
            </div>
          </div>
          <SaveRow
            pending={ts.restrictions.pending}
            onSave={() => saveTab("restrictions", { restrictions })}
          />
        </div>
      )}
    </div>
  );
}

function TabFeedback({ state }: { state: TabState }) {
  if (!state.success && !state.error) return null;
  return state.success ? (
    <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3">
      <CheckCircle2 size={16} className="text-emerald-500 flex-shrink-0" />
      <p className="text-sm text-emerald-700">נשמר בהצלחה!</p>
    </div>
  ) : (
    <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
      <AlertCircle size={16} className="text-red-500 flex-shrink-0" />
      <p className="text-sm text-red-700">{state.error}</p>
    </div>
  );
}

function SaveRow({ pending, onSave }: { pending: boolean; onSave: () => void }) {
  return (
    <div className="flex justify-start">
      <button
        type="button"
        disabled={pending}
        onClick={onSave}
        className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-60 transition-all"
      >
        {pending ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
        {pending ? "שומר..." : "שמור"}
      </button>
    </div>
  );
}
