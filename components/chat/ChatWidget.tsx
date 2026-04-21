"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Send, X, Minimize2, Maximize2, Bot, AlertCircle } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type Message = {
  id: string;
  role: "user" | "agent";
  text: string;
  time: string;
  special?: "tip";
  isError?: boolean;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function now(): string {
  return new Date().toLocaleTimeString("he-IL", { hour: "2-digit", minute: "2-digit" });
}

function uid(): string {
  return Math.random().toString(36).slice(2);
}

function parseMarkdown(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/\n/g, "<br/>");
}

// ─── Component ────────────────────────────────────────────────────────────────

const WELCOME: Message = {
  id:   "welcome",
  role: "agent",
  text: "שלום! אני **ארי**, מומחה המתנות שלנו 🎁\n\nאיך אפשר לעזור לך היום?",
  time: "",
};

export default function ChatWidget() {
  const [open,      setOpen]      = useState(true);
  const [minimized, setMinimized] = useState(false);
  const [messages,  setMessages]  = useState<Message[]>([
    { ...WELCOME, time: now() },
  ]);
  const [input,     setInput]     = useState("");
  const [typing,    setTyping]    = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const send = useCallback(async () => {
    const text = input.trim();
    if (!text || typing) return;

    const userMsg: Message = { id: uid(), role: "user", text, time: now() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setTyping(true);

    try {
      const res = await fetch("/api/chat", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message:    text,
          session_id: sessionId ?? undefined,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error ?? `HTTP ${res.status}`);
      }

      const data: { reply: string; session_id: string } = await res.json();

      // Persist session_id for subsequent messages
      if (!sessionId) setSessionId(data.session_id);

      setMessages((prev) => [
        ...prev,
        { id: uid(), role: "agent", text: data.reply, time: now() },
      ]);
    } catch (err) {
      console.error("Chat API error:", err);
      setMessages((prev) => [
        ...prev,
        {
          id:      uid(),
          role:    "agent",
          text:    "אופס, משהו השתבש. אנסה שוב בקרוב 🙏",
          time:    now(),
          isError: true,
        },
      ]);
    } finally {
      setTyping(false);
    }
  }, [input, typing, sessionId]);

  // ── Closed bubble ────────────────────────────────────────────────────────────
  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="w-14 h-14 bg-indigo-600 rounded-full shadow-xl flex items-center justify-center hover:bg-indigo-700 transition-colors relative"
        aria-label="פתח צ'אט"
      >
        <Bot size={24} className="text-white" />
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center font-bold">1</span>
      </button>
    );
  }

  // ── Widget ───────────────────────────────────────────────────────────────────
  return (
    <div
      className={`bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200 transition-all duration-300 ${
        minimized ? "w-72 h-14" : "w-80 h-[480px]"
      }`}
      dir="rtl"
    >
      {/* ── Header ── */}
      <div className="bg-indigo-600 px-4 py-3 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMinimized(!minimized)}
            className="text-indigo-300 hover:text-white transition-colors"
            aria-label={minimized ? "הרחב" : "כווץ"}
          >
            {minimized ? <Maximize2 size={14} /> : <Minimize2 size={14} />}
          </button>
          <button
            onClick={() => setOpen(false)}
            className="text-indigo-300 hover:text-white transition-colors"
            aria-label="סגור"
          >
            <X size={14} />
          </button>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-right">
            <p className="text-white text-sm font-semibold leading-tight">ארי</p>
            <p className="text-indigo-200 text-xs leading-tight">מומחה המתנות</p>
          </div>
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center relative">
            <Bot size={16} className="text-white" />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-indigo-600" />
          </div>
        </div>
      </div>

      {!minimized && (
        <>
          {/* ── Messages ── */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-gray-50">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-start" : "justify-end"}`}>
                {msg.special === "tip" ? (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl px-3 py-2.5 max-w-[90%] text-right">
                    <p className="text-xs font-bold text-amber-700 mb-1">💡 טיפ</p>
                    <p
                      className="text-xs text-amber-800 leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: parseMarkdown(msg.text) }}
                    />
                  </div>
                ) : (
                  <div
                    className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl text-right ${
                      msg.role === "user"
                        ? "bg-indigo-600 text-white rounded-tl-sm"
                        : msg.isError
                        ? "bg-red-50 text-red-700 rounded-tr-sm border border-red-200"
                        : "bg-white text-gray-800 rounded-tr-sm shadow-sm border border-gray-100"
                    }`}
                  >
                    {msg.isError && (
                      <AlertCircle size={13} className="inline ml-1 mb-0.5 text-red-500" />
                    )}
                    <p
                      className="text-sm leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: parseMarkdown(msg.text) }}
                    />
                    <p className={`text-xs mt-1 ${msg.role === "user" ? "text-indigo-300" : "text-gray-400"}`}>
                      {msg.time}
                    </p>
                  </div>
                )}
              </div>
            ))}

            {/* Typing indicator */}
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

          {/* ── Input ── */}
          <div className="p-3 bg-white border-t border-gray-100 flex-shrink-0">
            <div className="flex items-center gap-2">
              <button
                onClick={send}
                disabled={!input.trim() || typing}
                className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                aria-label="שלח"
              >
                <Send size={15} className="text-white -scale-x-100" />
              </button>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send()}
                placeholder="כתוב הודעה..."
                disabled={typing}
                className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm text-right focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:opacity-60"
              />
            </div>
            <p className="text-center text-xs text-gray-300 mt-2">מופעל על ידי EnigmAI</p>
          </div>
        </>
      )}
    </div>
  );
}
