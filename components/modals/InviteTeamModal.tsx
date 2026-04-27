"use client";

import { useState } from "react";
import { X, Loader2, UserPlus, AlertCircle } from "lucide-react";

export type TeamRole = "admin" | "support";

export type PendingMember = {
  name:  string;
  email: string;
  role:  TeamRole;
};

type Props = {
  open:     boolean;
  onClose:  () => void;
  onInvite: (member: PendingMember) => Promise<void>;
};

export default function InviteTeamModal({ open, onClose, onInvite }: Props) {
  const [name,    setName]    = useState("");
  const [email,   setEmail]   = useState("");
  const [role,    setRole]    = useState<TeamRole>("support");
  const [sending, setSending] = useState(false);
  const [serverError, setServerError] = useState("");
  const [errors,  setErrors]  = useState<{ name?: string; email?: string }>({});

  function validate() {
    const e: typeof errors = {};
    if (!name.trim())                                      e.name  = "שם חובה";
    if (!email.trim())                                     e.email = "אימייל חובה";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))  e.email = "כתובת אימייל לא תקינה";
    return e;
  }

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setSending(true);
    setServerError("");
    try {
      await onInvite({ name: name.trim(), email: email.trim(), role });
      setName(""); setEmail(""); setRole("support"); setErrors({});
      onClose();
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "שגיאה בשליחת ההזמנה");
    } finally {
      setSending(false);
    }
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
            <h2 className="text-lg font-semibold text-gray-900">הזמנת חבר צוות</h2>
            <div className="w-8 h-8 bg-indigo-100 rounded-xl flex items-center justify-center">
              <UserPlus size={16} className="text-indigo-600" />
            </div>
          </div>
        </div>

        {serverError && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-4">
            <AlertCircle size={15} className="text-red-500 flex-shrink-0" />
            <p className="text-sm text-red-700">{serverError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5 text-right">
              שם מלא <span className="text-red-500">*</span>
            </label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)}
              placeholder="ישראל ישראלי"
              className={`w-full border rounded-xl px-4 py-2.5 text-sm text-right focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.name ? "border-red-400 bg-red-50" : "border-gray-200"}`} />
            {errors.name && <p className="text-xs text-red-500 mt-1 text-right">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5 text-right">
              אימייל <span className="text-red-500">*</span>
            </label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="israel@example.com"
              className={`w-full border rounded-xl px-4 py-2.5 text-sm text-right focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.email ? "border-red-400 bg-red-50" : "border-gray-200"}`} />
            {errors.email && <p className="text-xs text-red-500 mt-1 text-right">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5 text-right">תפקיד</label>
            <div className="grid grid-cols-2 gap-2">
              {([["admin", "מנהל", "bg-purple-50 border-purple-200 text-purple-700"], ["support", "תמיכה", "bg-blue-50 border-blue-200 text-blue-700"]] as const).map(
                ([value, label, colors]) => (
                  <label key={value} className="cursor-pointer">
                    <input type="radio" name="role" value={value} checked={role === value} onChange={() => setRole(value)} className="sr-only peer" />
                    <div className={`border rounded-xl py-2.5 text-center text-sm font-medium transition-all peer-checked:ring-2 peer-checked:ring-indigo-500 ${colors}`}>
                      {label}
                    </div>
                  </label>
                )
              )}
            </div>
          </div>

          <p className="text-xs text-gray-400 text-right">ישלח אימייל הזמנה לכתובת שהוזנה</p>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
              ביטול
            </button>
            <button type="submit" disabled={sending}
              className="flex-1 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 disabled:opacity-60 transition-colors flex items-center justify-center gap-2">
              {sending ? <><Loader2 size={14} className="animate-spin" />שולח...</> : "שלח הזמנה"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
