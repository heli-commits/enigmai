"use client";

import { useState, useRef, useEffect } from "react";
import { Send, X, Minimize2, Maximize2, Bot } from "lucide-react";

type Message = {
  id: number;
  role: "user" | "agent";
  text: string;
  time: string;
  special?: "tip";
};

const initialMessages: Message[] = [
  {
    id: 1,
    role: "agent",
    text: "שלום! אני **ארי**, מומחה המתנות שלנו 🎁\n\nאיך אפשר לעזור לך היום?",
    time: "עכשיו",
  },
];

const botReplies: Record<string, Message[]> = {
  default: [
    { id: 0, role: "agent", text: "נשמע מעניין! ספר לי עוד – מי המתנה עבורו ומה התקציב שלך?", time: "" },
  ],
  נר: [
    {
      id: 0,
      role: "agent",
      text: "יש לנו **נרות ריחניים** מדהימים! 🕯️\n\nבמיוחד פופולרי: **נר לבנדר מינימליסטי** ב-₪89 (מחיר מבצע, מקורי ₪129).\n\nכמה נרות אתה צריך?",
      time: "",
    },
    {
      id: 0,
      role: "agent",
      text: "זמן בעירה: **~45 שעות** | ריחות זמינים: לבנדר, ורד, וניל",
      time: "",
      special: "tip",
    },
  ],
  מתנה: [
    {
      id: 0,
      role: "agent",
      text: "מעולה! 🎀 יש לנו המון אפשרויות. לאיזה אירוע המתנה?",
      time: "",
    },
  ],
  שלום: [
    { id: 0, role: "agent", text: "שלום! שמח לעזור 😊 מה מחפשים היום?", time: "" },
  ],
  מחיר: [
    { id: 0, role: "agent", text: "המחירים שלנו מתחילים מ-₪49 ועד ₪499+. יש לנו מוצרים לכל תקציב! מה הטווח שמתאים לך?", time: "" },
  ],
  החזר: [
    { id: 0, role: "agent", text: "מדיניות ההחזרות שלנו: **30 יום** מיום הקבלה, למוצרים באריזה מקורית. רוצה שאעביר אותך לנציג אנושי?", time: "" },
  ],
};

function formatTime() {
  return new Date().toLocaleTimeString("he-IL", { hour: "2-digit", minute: "2-digit" });
}

function parseMarkdown(text: string) {
  return text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/\n/g, "<br/>");
}

function getReply(input: string): Message[] {
  const lower = input;
  for (const key of Object.keys(botReplies)) {
    if (key !== "default" && lower.includes(key)) {
      return botReplies[key].map((m, i) => ({ ...m, id: Date.now() + i, time: formatTime() }));
    }
  }
  return botReplies.default.map((m, i) => ({ ...m, id: Date.now() + i, time: formatTime() }));
}

export default function ChatWidget() {
  const [open, setOpen] = useState(true);
  const [minimized, setMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>(
    initialMessages.map((m) => ({ ...m, time: formatTime() }))
  );
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const send = () => {
    if (!input.trim()) return;
    const userMsg: Message = {
      id: Date.now(),
      role: "user",
      text: input,
      time: formatTime(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      const replies = getReply(input);
      setMessages((prev) => [...prev, ...replies]);
    }, 1200 + Math.random() * 600);
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="w-14 h-14 bg-indigo-600 rounded-full shadow-xl flex items-center justify-center hover:bg-indigo-700 transition-colors relative"
      >
        <Bot size={24} className="text-white" />
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center font-bold">1</span>
      </button>
    );
  }

  return (
    <div className={`bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200 transition-all duration-300 ${minimized ? "w-72 h-14" : "w-80 h-[480px]"}`} dir="rtl">
      {/* Header */}
      <div className="bg-indigo-600 px-4 py-3 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2">
          <button onClick={() => setMinimized(!minimized)} className="text-indigo-300 hover:text-white transition-colors">
            {minimized ? <Maximize2 size={14} /> : <Minimize2 size={14} />}
          </button>
          <button onClick={() => setOpen(false)} className="text-indigo-300 hover:text-white transition-colors">
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
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-indigo-600"></span>
          </div>
        </div>
      </div>

      {!minimized && (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-gray-50">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-start" : "justify-end"}`}>
                {msg.special === "tip" ? (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl px-3 py-2.5 max-w-[90%] text-right">
                    <p className="text-xs font-bold text-amber-700 mb-1">💡 טיפ מומחה</p>
                    <p
                      className="text-xs text-amber-800 leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: parseMarkdown(msg.text) }}
                    />
                  </div>
                ) : (
                  <div className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl text-right ${
                    msg.role === "user"
                      ? "bg-indigo-600 text-white rounded-tl-sm"
                      : "bg-white text-gray-800 rounded-tr-sm shadow-sm border border-gray-100"
                  }`}>
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
            <div className="flex items-center gap-2">
              <button
                onClick={send}
                disabled={!input.trim()}
                className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <Send size={15} className="text-white -scale-x-100" />
              </button>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                placeholder="כתוב הודעה..."
                className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm text-right focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <p className="text-center text-xs text-gray-300 mt-2">מופעל על ידי EnigmAI</p>
          </div>
        </>
      )}
    </div>
  );
}
