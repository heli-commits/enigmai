"use client";

import { useState } from "react";
import { Check, ExternalLink, Zap } from "lucide-react";

const integrations = [
  { id: "openai", name: "OpenAI GPT-4o", desc: "מנוע ה-AI המרכזי לשיחות", connected: true, logo: "🤖" },
  { id: "shopify", name: "Shopify", desc: "סנכרון מוצרים והזמנות", connected: true, logo: "🛍️" },
  { id: "twilio", name: "Twilio SMS", desc: "שליחת SMS ללקוחות", connected: false, logo: "💬" },
  { id: "mailchimp", name: "Mailchimp", desc: "ניהול קמפיינים באימייל", connected: false, logo: "📧" },
  { id: "whatsapp", name: "WhatsApp Business", desc: "ערוץ וואטסאפ לשיחות", connected: false, logo: "📱" },
  { id: "pinecone", name: "Pinecone", desc: "Vector DB לחיפוש סמנטי", connected: true, logo: "🌲" },
];

export default function IntegrationsPage() {
  const [states, setStates] = useState(
    Object.fromEntries(integrations.map((i) => [i.id, i.connected]))
  );

  return (
    <div className="max-w-2xl space-y-4">
      <div className="grid grid-cols-1 gap-3">
        {integrations.map((intg) => {
          const connected = states[intg.id];
          return (
            <div key={intg.id} className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-center gap-4">
                <span className="text-3xl">{intg.logo}</span>
                <div className="flex-1 text-right">
                  <div className="flex items-center justify-between mb-0.5">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setStates((p) => ({ ...p, [intg.id]: !p[intg.id] }))}
                        className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                          connected
                            ? "bg-red-50 text-red-600 hover:bg-red-100"
                            : "bg-indigo-600 text-white hover:bg-indigo-700"
                        }`}
                      >
                        {connected ? "נתק" : "חבר"}
                      </button>
                      <button className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50">
                        <ExternalLink size={13} />
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      {connected && (
                        <span className="flex items-center gap-1 text-xs text-emerald-600 font-medium">
                          <Check size={12} />
                          מחובר
                        </span>
                      )}
                      <h3 className="font-semibold text-gray-900">{intg.name}</h3>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 text-right">{intg.desc}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
