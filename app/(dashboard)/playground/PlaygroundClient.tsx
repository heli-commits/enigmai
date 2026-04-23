"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  Send, RefreshCw, Bot, AlertCircle,
  ChevronDown, ChevronUp, FlaskConical,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type Message = {
  id:      string;
  role:    "user" | "agent";
  text:    string;
  time:    string;
  isError?: boolean;
};

type Props = {
  storeName: string;
  agentName: string;
  traits:    string;
  rules:     string;
  style:     string;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const nowStr = () =>
  new Date().toLocaleTimeString("he-IL", { hour: "2-digit", minute: "2-digit" });
const uid = () => Math.random().toString(36).slice(2);
const md  = (t: string) =>
  t.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
   .replace(/\*(.*?)\*/g, "<em>$1</em>")
   .replace(/\n/g, "<br/>");

// ─── Component ────────────────────────────────────────────────────────────────

export default function PlaygroundClient({ storeName, agentName, traits, rules, style }: Props) {
  const [messages,   setMessages]   = useState<Message[]>([]);
  const [input,      setInput]      = useState("");
  const [typing,     setTyping]     = useState(false);
  const [sessionId,  setSessionId]  = useState<string | null>(null);
  const [msgCount,   setMsgCount]   = useState(0);
  const [showPrompt, setShowPrompt] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Greeting on mount / storeName change
  useEffect(() => {
    setMessages([{
      id:   "welcome",
      role: "agent",
      text: `שלום! אני **${agentName}**, סוכן ה-AI של "${storeName}".\n\nאנחנו במצב בדיקה 🧪 – שאל אותי כל שאלה שתרצה!`,
      time: nowStr(),
    }]);
    setSessionId(null);
    setMsgCount(0);
  }, [agentName, storeName]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const newSession = useCallback(() => {
    setMessages([{
      id:   uid(),
      role: "agent",
      text: `שיחה חדשה התחילה! אני **${agentName}** – מוכן לבדיקה הבאה 🚀`,
      time: nowStr(),
    }]);
    setSessionId(null);
    setMsgCount(0);
    setInput("");
  }, [agentName]);

  const send = useCallback(async () => {
    const text = input.trim();
    if (!text || typing) return;

    setMessages((prev) => [...prev, { id: uid(), role: "user", text, time: nowStr() }]);
    setInput("");
    setTyping(true);

    try {
      const res = await fetch("/api/chat", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ message: text, session_id: sessionId ?? undefined }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error((err as { error?: string })?.error ?? `HTTP ${res.status}`);
      }

      const data = await res.json() as { reply: string; session_id: string };
      if (!sessionId) setSessionId(data.session_id);
      setMsgCount((n) => n + 1);
      setMessages((prev) => [...prev, { id: uid(), role: "agent", text: data.reply, time: nowStr() }]);
    } catch (err) {
      console.error("[playground] API error:", err);
      const msg = err instanceof Error ? err.message : "שגיאה לא ידועה";
      setMessages((prev) => [
        ...prev,
        { id: uid(), role: "agent", text: `שגיאה: ${msg}`, time: nowStr(), isError: true },
      ]);
    } finally {
      setTyping(false);
    }
  }, [input, typing, sessionId]);

  // Assemble preview of system prompt
  const systemPromptPreview = [
    `אתה ${agentName}, סוכן AI של "${storeName}".`,
    traits && `\n## אופי\n${traits}`,
    rules  && `\n## חוקי התנהגות\n${rules}`,
    style  && `\n## סגנון דיבור\n${style}`,
  ].filter(Boolean).join("\n");

  return (
    <div className="flex flex-col lg:flex-row gap-4 h-[calc(100vh-7rem)]">

      {/* ── Chat Panel ──────────────────────────────────────────────────────── */}
      <div className="flex flex-col bg-white rounded-2xl border border-gray-200 overflow-hidden flex-1 min-h-[500px] lg:min-h-0">

        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-3 flex items-center justify-between flex-shrink-0">
          <button
            onClick={newSession}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg text-white text-xs font-medium transition-colors"
          >
            <RefreshCw size={13} />
            שיחה חדשה
          </button>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-white text-sm font-bold leading-tight">{agentName}</p>
              <div className="flex items-center justify-end gap-1.5">
                <span className="text-indigo-200 text-xs">{storeName}</span>
                <span className="text-xs bg-amber-400/30 text-amber-100 px-1.5 py-0.5 rounded-full flex items-center gap-1">
                  <FlaskConical size={10} />
                  מצב בדיקה
                </span>
              </div>
            </div>
            <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center relative flex-shrink-0">
              <Bot size={18} className="text-white" />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-indigo-600" />
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50" dir="rtl">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-start" : "justify-end"}`}>
              <div
                className={`max-w-[82%] px-3.5 py-2.5 rounded-2xl text-sm text-right leading-relaxed ${
                  msg.role === "user"
                    ? "bg-indigo-600 text-white rounded-tl-sm"
                    : msg.isError
                    ? "bg-red-50 text-red-700 rounded-tr-sm border border-red-200"
                    : "bg-white text-gray-800 rounded-tr-sm shadow-sm border border-gray-100"
                }`}
              >
                {msg.isError && <AlertCircle size={13} className="inline ml-1 mb-0.5 text-red-500" />}
                <p dangerouslySetInnerHTML={{ __html: md(msg.text) }} />
                <p className={`text-xs mt-1 ${msg.role === "user" ? "text-indigo-300" : "text-gray-400"}`}>
                  {msg.time}
                </p>
              </div>
            </div>
          ))}

          {typing && (
            <div className="flex justify-end">
              <div className="bg-white rounded-2xl rounded-tr-sm px-4 py-3 shadow-sm border border-gray-100">
                <div className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"
                      style={{ animationDelay: `${i * 0.15}s` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="p-3 bg-white border-t border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-2" dir="rtl">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send()}
              placeholder="שאל שאלה לבדיקת הסוכן..."
              disabled={typing}
              className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-right focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-60"
            />
            <button
              onClick={send}
              disabled={!input.trim() || typing}
              className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <Send size={15} className="text-white -scale-x-100" />
            </button>
          </div>
        </div>
      </div>

      {/* ── Info Panel ──────────────────────────────────────────────────────── */}
      <div className="w-full lg:w-72 flex flex-col gap-3 flex-shrink-0">

        {/* Session stats */}
        <div className="bg-white rounded-xl border border-gray-200 p-4" dir="rtl">
          <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2 justify-end">
            מידע על הסשן
            <Bot size={15} className="text-indigo-500" />
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="font-semibold text-indigo-600">{msgCount}</span>
              <span className="text-gray-500">הודעות שנשלחו</span>
            </div>
            <div className="flex justify-between">
              <span className="font-mono text-xs text-gray-400 truncate max-w-[140px]">
                {sessionId ? sessionId.slice(0, 14) + "…" : "–"}
              </span>
              <span className="text-gray-500">Session ID</span>
            </div>
          </div>
        </div>

        {/* System prompt collapsible */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <button
            onClick={() => setShowPrompt((v) => !v)}
            className="w-full px-4 py-3 flex items-center justify-between text-sm font-semibold text-gray-900 hover:bg-gray-50 transition-colors"
            dir="rtl"
          >
            <span className="text-gray-400">
              {showPrompt ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
            </span>
            <span>System Prompt (תצוגה)</span>
          </button>
          {showPrompt && (
            <div className="bg-gray-900 p-4 max-h-64 overflow-y-auto">
              <pre className="text-green-400 text-xs font-mono leading-relaxed whitespace-pre-wrap text-right" dir="rtl">
                {systemPromptPreview}
              </pre>
            </div>
          )}
        </div>

        {/* Tips */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4" dir="rtl">
          <p className="text-xs font-bold text-amber-700 mb-2 flex items-center gap-1.5 justify-end">
            <FlaskConical size={12} />
            טיפים לבדיקה
          </p>
          <ul className="space-y-1.5 text-xs text-amber-800 text-right">
            <li>• שאל שאלות על מוצרים ומלאי</li>
            <li>• בדוק את אופי הסוכן</li>
            <li>• נסה תרחיש של לקוח לא מרוצה</li>
            <li>• לחץ &quot;שיחה חדשה&quot; לאיפוס</li>
            <li>• שינויים ב-Persona נכנסים לתוקף מיד</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
