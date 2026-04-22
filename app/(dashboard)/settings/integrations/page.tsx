"use client";

import { useState } from "react";
import { Check, ExternalLink, X, Eye, EyeOff, CheckCircle2, Loader2 } from "lucide-react";

// ─── Integration definitions ──────────────────────────────────────────────────

type Field = {
  name:        string;
  label:       string;
  placeholder: string;
  type:        "text" | "password";
};

type Integration = {
  id:        string;
  name:      string;
  desc:      string;
  connected: boolean;
  logo:      string;
  docsUrl:   string;
  fields:    Field[];
};

const INTEGRATIONS: Integration[] = [
  {
    id: "openai", name: "OpenAI GPT-4o", desc: "מנוע ה-AI המרכזי לשיחות",
    connected: true, logo: "🤖", docsUrl: "https://platform.openai.com/api-keys",
    fields: [
      { name: "api_key", label: "OpenAI API Key", placeholder: "sk-proj-...", type: "password" },
    ],
  },
  {
    id: "shopify", name: "Shopify", desc: "סנכרון מוצרים והזמנות",
    connected: false, logo: "🛍️", docsUrl: "https://shopify.dev/docs/api",
    fields: [
      { name: "store_url",   label: "Store URL",   placeholder: "myshop.myshopify.com", type: "text"     },
      { name: "api_key",     label: "API Key",     placeholder: "shpka_...",            type: "password" },
      { name: "api_secret",  label: "API Secret",  placeholder: "shpss_...",            type: "password" },
    ],
  },
  {
    id: "twilio", name: "Twilio SMS", desc: "שליחת SMS ללקוחות",
    connected: false, logo: "💬", docsUrl: "https://console.twilio.com",
    fields: [
      { name: "account_sid", label: "Account SID", placeholder: "AC...",           type: "text"     },
      { name: "auth_token",  label: "Auth Token",  placeholder: "••••••••",        type: "password" },
      { name: "phone",       label: "Phone Number",placeholder: "+1 (555) 000-000",type: "text"     },
    ],
  },
  {
    id: "mailchimp", name: "Mailchimp", desc: "ניהול קמפיינים באימייל",
    connected: false, logo: "📧", docsUrl: "https://mailchimp.com/developer/marketing/api/",
    fields: [
      { name: "api_key",     label: "API Key",     placeholder: "...-us21",  type: "password" },
      { name: "audience_id", label: "Audience ID", placeholder: "abc123ef",  type: "text"     },
    ],
  },
  {
    id: "whatsapp", name: "WhatsApp Business", desc: "ערוץ וואטסאפ לשיחות",
    connected: false, logo: "📱", docsUrl: "https://developers.facebook.com/docs/whatsapp",
    fields: [
      { name: "phone_id",     label: "Phone Number ID", placeholder: "123456789", type: "text"     },
      { name: "access_token", label: "Access Token",    placeholder: "EAAm...",   type: "password" },
    ],
  },
  {
    id: "pinecone", name: "Pinecone", desc: "Vector DB לחיפוש סמנטי",
    connected: false, logo: "🌲", docsUrl: "https://app.pinecone.io",
    fields: [
      { name: "api_key",     label: "API Key",     placeholder: "pcsk_...",           type: "password" },
      { name: "environment", label: "Environment", placeholder: "us-east-1-aws",      type: "text"     },
      { name: "index",       label: "Index Name",  placeholder: "enigmai-embeddings", type: "text"     },
    ],
  },
];

// ─── Setup Modal ──────────────────────────────────────────────────────────────

function SetupModal({
  intg,
  onClose,
  onSave,
}: {
  intg:    Integration;
  onClose: () => void;
  onSave:  (id: string) => void;
}) {
  const [values,  setValues]  = useState<Record<string, string>>({});
  const [show,    setShow]    = useState<Record<string, boolean>>({});
  const [saving,  setSaving]  = useState(false);
  const [saved,   setSaved]   = useState(false);

  const allFilled = intg.fields.every((f) => (values[f.name] ?? "").trim() !== "");

  async function handleSave() {
    if (!allFilled) return;
    setSaving(true);
    // Simulate async save (replace with real Supabase call later)
    await new Promise((r) => setTimeout(r, 800));
    setSaving(false);
    setSaved(true);
    setTimeout(() => {
      onSave(intg.id);
      onClose();
    }, 900);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6" dir="rtl">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X size={18} />
          </button>
          <div className="flex items-center gap-3">
            <div>
              <h2 className="text-base font-semibold text-gray-900 text-right">{intg.name}</h2>
              <p className="text-xs text-gray-500 text-right">{intg.desc}</p>
            </div>
            <span className="text-3xl">{intg.logo}</span>
          </div>
        </div>

        {/* Success state */}
        {saved ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 size={28} className="text-emerald-600" />
            </div>
            <p className="text-gray-700 font-semibold">האינטגרציה חוברה בהצלחה!</p>
          </div>
        ) : (
          <>
            {/* Fields */}
            <div className="space-y-3 mb-5">
              {intg.fields.map((f) => (
                <div key={f.name}>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5 text-right">
                    {f.label}
                  </label>
                  <div className="relative">
                    <input
                      type={f.type === "password" && !show[f.name] ? "password" : "text"}
                      placeholder={f.placeholder}
                      value={values[f.name] ?? ""}
                      onChange={(e) => setValues((v) => ({ ...v, [f.name]: e.target.value }))}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-right focus:outline-none focus:ring-2 focus:ring-indigo-500 pr-10"
                      dir="ltr"
                    />
                    {f.type === "password" && (
                      <button
                        type="button"
                        onClick={() => setShow((s) => ({ ...s, [f.name]: !s[f.name] }))}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {show[f.name] ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Docs link */}
            <a
              href={intg.docsUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 text-xs text-indigo-600 hover:underline mb-5 justify-end"
            >
              <ExternalLink size={12} />
              איך להשיג את הפרטים?
            </a>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
              >
                ביטול
              </button>
              <button
                onClick={handleSave}
                disabled={!allFilled || saving}
                className="flex-1 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                {saving
                  ? <><Loader2 size={14} className="animate-spin" />מחבר...</>
                  : "חבר"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function IntegrationsPage() {
  const [connected, setConnected] = useState<Record<string, boolean>>(
    Object.fromEntries(INTEGRATIONS.map((i) => [i.id, i.connected]))
  );
  const [modal, setModal] = useState<Integration | null>(null);

  return (
    <>
      {modal && (
        <SetupModal
          intg={modal}
          onClose={() => setModal(null)}
          onSave={(id) => setConnected((c) => ({ ...c, [id]: true }))}
        />
      )}

      <div className="max-w-2xl space-y-4">
        <div className="grid grid-cols-1 gap-3">
          {INTEGRATIONS.map((intg) => {
            const isConnected = connected[intg.id];
            return (
              <div
                key={intg.id}
                className="bg-white rounded-xl border border-gray-200 p-5"
              >
                <div className="flex items-center gap-4">
                  <span className="text-3xl flex-shrink-0">{intg.logo}</span>
                  <div className="flex-1 text-right">
                    <div className="flex items-center justify-between mb-0.5">
                      {/* Action buttons */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            if (isConnected) {
                              setConnected((c) => ({ ...c, [intg.id]: false }));
                            } else {
                              setModal(intg);
                            }
                          }}
                          className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                            isConnected
                              ? "bg-red-50 text-red-600 hover:bg-red-100"
                              : "bg-indigo-600 text-white hover:bg-indigo-700"
                          }`}
                        >
                          {isConnected ? "נתק" : "חבר"}
                        </button>
                        <a
                          href={intg.docsUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50"
                        >
                          <ExternalLink size={13} />
                        </a>
                      </div>

                      {/* Name + status */}
                      <div className="flex items-center gap-2">
                        {isConnected && (
                          <span className="flex items-center gap-1 text-xs text-emerald-600 font-medium">
                            <Check size={12} />
                            מחובר
                          </span>
                        )}
                        <h3 className="font-semibold text-gray-900">{intg.name}</h3>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500">{intg.desc}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
