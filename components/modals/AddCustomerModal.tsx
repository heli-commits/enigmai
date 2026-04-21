"use client";

import { useActionState, useEffect, useRef } from "react";
import { X, Loader2, UserPlus, AlertCircle } from "lucide-react";
import { createCustomer } from "@/app/actions/customers";

type Props = {
  open: boolean;
  onClose: () => void;
};

const initialState: import("@/app/actions/customers").CustomerFormState = {};

export default function AddCustomerModal({ open, onClose }: Props) {
  const [state, formAction, isPending] = useActionState(createCustomer, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  // Close and reset on success
  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
      onClose();
    }
  }, [state.success, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6" dir="rtl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X size={18} />
          </button>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-gray-900">הוספת לקוח חדש</h2>
            <div className="w-8 h-8 bg-indigo-100 rounded-xl flex items-center justify-center">
              <UserPlus size={16} className="text-indigo-600" />
            </div>
          </div>
        </div>

        {/* Global error */}
        {state.error && (
          <div className="mb-4 flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-right">
            <AlertCircle size={16} className="text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{state.error}</p>
          </div>
        )}

        <form ref={formRef} action={formAction} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5 text-right">
              שם מלא <span className="text-red-500">*</span>
            </label>
            <input
              name="name"
              type="text"
              placeholder="ישראל ישראלי"
              required
              className={`w-full border rounded-xl px-4 py-2.5 text-sm text-right focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors ${
                state.fieldErrors?.name ? "border-red-400 bg-red-50" : "border-gray-200"
              }`}
            />
            {state.fieldErrors?.name && (
              <p className="text-xs text-red-500 mt-1 text-right">{state.fieldErrors.name}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5 text-right">
              אימייל
            </label>
            <input
              name="email"
              type="email"
              placeholder="israel@example.com"
              className={`w-full border rounded-xl px-4 py-2.5 text-sm text-right focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors ${
                state.fieldErrors?.email ? "border-red-400 bg-red-50" : "border-gray-200"
              }`}
            />
            {state.fieldErrors?.email && (
              <p className="text-xs text-red-500 mt-1 text-right">{state.fieldErrors.email}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5 text-right">
              טלפון
            </label>
            <input
              name="phone"
              type="tel"
              placeholder="050-1234567"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-right focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5 text-right">
              סטטוס
            </label>
            <div className="grid grid-cols-3 gap-2">
              {([["new", "חדש", "bg-green-50 border-green-200 text-green-700"], ["regular", "רגיל", "bg-gray-50 border-gray-200 text-gray-600"], ["vip", "VIP", "bg-yellow-50 border-yellow-200 text-yellow-700"]] as const).map(
                ([value, label, colors]) => (
                  <label key={value} className="cursor-pointer">
                    <input type="radio" name="status" value={value} defaultChecked={value === "new"} className="sr-only peer" />
                    <div className={`border rounded-xl py-2.5 text-center text-sm font-medium transition-all peer-checked:ring-2 peer-checked:ring-indigo-500 ${colors}`}>
                      {label}
                    </div>
                  </label>
                )
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
            >
              ביטול
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 disabled:opacity-60 transition-colors flex items-center justify-center gap-2"
            >
              {isPending ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  שומר...
                </>
              ) : (
                "הוסף לקוח"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
