"use client";

import { useState } from "react";
import { X, Loader2, Zap } from "lucide-react";

export type NewAutomation = {
  id: number;
  name: string;
  trigger: string;
  action: string;
  active: boolean;
  runs: number;
};

type Props = {
  open: boolean;
  onClose: () => void;
  onAdd: (automation: NewAutomation) => void;
};

export default function NewAutomationModal({ open, onClose, onAdd }: Props) {
  const [name,    setName]    = useState("");
  const [trigger, setTrigger] = useState("");
  const [action,  setAction]  = useState("");
  const [saving,  setSaving]  = useState(false);
  const [errors,  setErrors]  = useState<{ name?: string; trigger?: string; action?: string }>({});

  function validate() {
    const e: typeof errors = {};
    if (!name.trim())    e.name    = "שם חובה";
    if (!trigger.trim()) e.trigger = "טריגר חובה";
    if (!action.trim())  e.action  = "פעולה חובה";
    return e;
  }

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setSaving(true);
    await new Promise((r) => setTimeout(r, 600));
    setSaving(false);
    onAdd({ id: Date.now(), name: name.trim(), trigger: trigger.trim(), action: action.trim(), active: true, runs: 0 });
    setName(""); setTrigger(""); setAction(""); setErrors({});
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
            <h2 className="text-lg font-semibold text-gray-900">אוטומציה חדשה</h2>
            <div className="w-8 h-8 bg-yellow-100 rounded-xl flex items-center justify-center">
              <Zap size={16} className="text-yellow-600" />
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5 text-right">
              שם האוטומציה <span className="text-red-500">*</span>
            </label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)}
              placeholder='למשל: "הודעת ברוכים הבאים"'
              className={`w-full border rounded-xl px-4 py-2.5 text-sm text-right focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.name ? "border-red-400 bg-red-50" : "border-gray-200"}`} />
            {errors.name && <p className="text-xs text-red-500 mt-1 text-right">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5 text-right">
              טריגר (מה מפעיל את האוטומציה) <span className="text-red-500">*</span>
            </label>
            <input type="text" value={trigger} onChange={(e) => setTrigger(e.target.value)}
              placeholder='למשל: "לקוח חדש נרשם"'
              className={`w-full border rounded-xl px-4 py-2.5 text-sm text-right focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.trigger ? "border-red-400 bg-red-50" : "border-gray-200"}`} />
            {errors.trigger && <p className="text-xs text-red-500 mt-1 text-right">{errors.trigger}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5 text-right">
              פעולה (מה קורה) <span className="text-red-500">*</span>
            </label>
            <textarea value={action} onChange={(e) => setAction(e.target.value)} rows={3}
              placeholder='למשל: "שליחת אימייל ברכה + קוד קופון 10%"'
              className={`w-full border rounded-xl px-4 py-2.5 text-sm text-right resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.action ? "border-red-400 bg-red-50" : "border-gray-200"}`} />
            {errors.action && <p className="text-xs text-red-500 mt-1 text-right">{errors.action}</p>}
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
              ביטול
            </button>
            <button type="submit" disabled={saving}
              className="flex-1 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 disabled:opacity-60 transition-colors flex items-center justify-center gap-2">
              {saving ? <><Loader2 size={14} className="animate-spin" />יוצר...</> : "צור אוטומציה"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
