"use client";

import { useActionState } from "react";
import { Loader2, AlertCircle, KeyRound, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { updatePassword } from "@/app/actions/auth";
import type { UpdatePasswordState } from "@/app/actions/auth";

const initialState: UpdatePasswordState = {};

export default function UpdatePasswordPage() {
  const [state, formAction, isPending] = useActionState(updatePassword, initialState);
  const [showPw,  setShowPw]  = useState(false);
  const [showCfm, setShowCfm] = useState(false);

  return (
    <div className="w-full max-w-sm" dir="rtl">
      {/* Logo */}
      <div className="text-center mb-8">
        <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <span className="text-white font-bold text-lg">AI</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">בחר סיסמה חדשה</h1>
        <p className="text-gray-500 text-sm mt-1">הסיסמה חייבת להכיל לפחות 6 תווים</p>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
        {state.error && (
          <div className="mb-5 flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
            <AlertCircle size={16} className="text-red-500 flex-shrink-0" />
            <p className="text-sm text-red-700">{state.error}</p>
          </div>
        )}

        <form action={formAction} className="space-y-4">
          {/* New password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              סיסמה חדשה
            </label>
            <div className="relative">
              <input
                name="password"
                type={showPw ? "text" : "password"}
                autoComplete="new-password"
                placeholder="••••••••"
                required
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 pl-10 text-sm text-right focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPw((v) => !v)}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                tabIndex={-1}
              >
                {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {/* Confirm password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              אימות סיסמה
            </label>
            <div className="relative">
              <input
                name="confirm"
                type={showCfm ? "text" : "password"}
                autoComplete="new-password"
                placeholder="••••••••"
                required
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 pl-10 text-sm text-right focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowCfm((v) => !v)}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                tabIndex={-1}
              >
                {showCfm ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 disabled:opacity-60 transition-colors flex items-center justify-center gap-2 mt-2"
          >
            {isPending ? (
              <><Loader2 size={15} className="animate-spin" />מעדכן סיסמה...</>
            ) : (
              <><KeyRound size={15} />עדכן סיסמה</>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
