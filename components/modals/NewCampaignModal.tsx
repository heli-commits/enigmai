"use client";

import { useState } from "react";
import { X, Loader2, Megaphone } from "lucide-react";

export type CampaignType   = "email" | "sms";
export type CampaignStatus = "draft" | "scheduled";

export type NewCampaign = {
  id: number;
  name: string;
  type: CampaignType;
  status: CampaignStatus;
  created: string;
  sentAt: null;
  recipients: number;
  openRate: null;
  scheduledFor?: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  onAdd: (campaign: NewCampaign) => void;
};

function todayStr() {
  const d = new Date();
  return `${d.getDate().toString().padStart(2, "0")}/${(d.getMonth() + 1).toString().padStart(2, "0")}/${d.getFullYear()}`;
}

export default function NewCampaignModal({ open, onClose, onAdd }: Props) {
  const [name,         setName]         = useState("");
  const [type,         setType]         = useState<CampaignType>("email");
  const [status,       setStatus]       = useState<CampaignStatus>("draft");
  const [scheduledFor, setScheduledFor] = useState("");
  const [saving,       setSaving]       = useState(false);
  const [errors,       setErrors]       = useState<{ name?: string; scheduledFor?: string }>({});

  function validate() {
    const e: typeof errors = {};
    if (!name.trim())                      e.name         = "שם קמפיין חובה";
    if (status === "scheduled" && !scheduledFor) e.scheduledFor = "תאריך שליחה חובה עבור קמפיין מתוזמן";
    return e;
  }

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setSaving(true);
    await new Promise((r) => setTimeout(r, 600));
    setSaving(false);
    onAdd({
      id: Date.now(),
      name: name.trim(),
      type,
      status,
      created: todayStr(),
      sentAt: null,
      recipients: 0,
      openRate: null,
      ...(status === "scheduled" && scheduledFor ? { scheduledFor } : {}),
    });
    setName(""); setType("email"); setStatus("draft"); setScheduledFor(""); setErrors({});
    onClose();
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6" dir="rtl">

        <div className="flex items-center justify-between mb-6">
          <button onClick={onClose} className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
            <X size={18} />
          </button>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-gray-900">קמפיין חדש</h2>
            <div className="w-8 h-8 bg-indigo-100 rounded-xl flex items-center justify-center">
              <Megaphone size={16} className="text-indigo-600" />
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5 text-right">
              שם הקמפיין <span className="text-red-500">*</span>
            </label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)}
              placeholder='למשל: "מבצע קיץ 2026"'
              className={`w-full border rounded-xl px-4 py-2.5 text-sm text-right focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.name ? "border-red-400 bg-red-50" : "border-gray-200"}`} />
            {errors.name && <p className="text-xs text-red-500 mt-1 text-right">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5 text-right">ערוץ שליחה</label>
            <div className="grid grid-cols-2 gap-2">
              {([["email", "📧 אימייל"], ["sms", "💬 SMS"]] as const).map(([value, label]) => (
                <label key={value} className="cursor-pointer">
                  <input type="radio" value={value} checked={type === value} onChange={() => setType(value)} className="sr-only peer" />
                  <div className="border border-gray-200 rounded-xl py-2.5 text-center text-sm font-medium transition-all peer-checked:ring-2 peer-checked:ring-indigo-500 peer-checked:border-indigo-300 peer-checked:bg-indigo-50 peer-checked:text-indigo-700">
                    {label}
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5 text-right">סטטוס</label>
            <div className="grid grid-cols-2 gap-2">
              {([["draft", "טיוטה", "bg-gray-50 border-gray-200 text-gray-600"], ["scheduled", "מתוזמן", "bg-blue-50 border-blue-200 text-blue-700"]] as const).map(
                ([value, label, colors]) => (
                  <label key={value} className="cursor-pointer">
                    <input type="radio" value={value} checked={status === value} onChange={() => setStatus(value)} className="sr-only peer" />
                    <div className={`border rounded-xl py-2.5 text-center text-sm font-medium transition-all peer-checked:ring-2 peer-checked:ring-indigo-500 ${colors}`}>
                      {label}
                    </div>
                  </label>
                )
              )}
            </div>
          </div>

          {status === "scheduled" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5 text-right">
                תאריך ושעת שליחה <span className="text-red-500">*</span>
              </label>
              <input type="text" value={scheduledFor} onChange={(e) => setScheduledFor(e.target.value)}
                placeholder="22/04/2026, 10:00"
                className={`w-full border rounded-xl px-4 py-2.5 text-sm text-right focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.scheduledFor ? "border-red-400 bg-red-50" : "border-gray-200"}`} />
              {errors.scheduledFor && <p className="text-xs text-red-500 mt-1 text-right">{errors.scheduledFor}</p>}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
              ביטול
            </button>
            <button type="submit" disabled={saving}
              className="flex-1 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 disabled:opacity-60 transition-colors flex items-center justify-center gap-2">
              {saving ? <><Loader2 size={14} className="animate-spin" />יוצר...</> : "צור קמפיין"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
