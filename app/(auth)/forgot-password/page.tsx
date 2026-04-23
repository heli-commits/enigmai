"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Loader2, AlertCircle, MailCheck, ArrowRight } from "lucide-react";
import { requestPasswordReset } from "@/app/actions/auth";
import type { PasswordResetState } from "@/app/actions/auth";

const initialState: PasswordResetState = {};

export default function ForgotPasswordPage() {
  const [state, formAction, isPending] = useActionState(requestPasswordReset, initialState);

  return (
    <div className="w-full max-w-sm" dir="rtl">
      {/* Logo */}
      <div className="text-center mb-8">
        <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <span className="text-white font-bold text-lg">AI</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">איפוס סיסמה</h1>
        <p className="text-gray-500 text-sm mt-1">נשלח לך קישור לאיפוס לתיבת הדואר</p>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
        {state.success ? (
          /* ── Success state ── */
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
              <MailCheck size={28} className="text-emerald-600" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900 text-lg">נשלח מייל לאיפוס!</h2>
              <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                בדוק את תיבת הדואר שלך ולחץ על הקישור לאיפוס הסיסמה.
                <br />
                אם לא קיבלת – בדוק גם בתיקיית הספאם.
              </p>
            </div>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 text-sm text-indigo-600 hover:underline font-medium"
            >
              <ArrowRight size={14} />
              חזרה לדף הכניסה
            </Link>
          </div>
        ) : (
          /* ── Form ── */
          <>
            {state.error && (
              <div className="mb-5 flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                <AlertCircle size={16} className="text-red-500 flex-shrink-0" />
                <p className="text-sm text-red-700">{state.error}</p>
              </div>
            )}

            <form action={formAction} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  כתובת אימייל
                </label>
                <input
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  required
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-right focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="w-full py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 disabled:opacity-60 transition-colors flex items-center justify-center gap-2 mt-2"
              >
                {isPending
                  ? <><Loader2 size={15} className="animate-spin" />שולח...</>
                  : "שלח קישור לאיפוס"}
              </button>
            </form>
          </>
        )}
      </div>

      {!state.success && (
        <p className="text-center text-sm text-gray-500 mt-6">
          נזכרת?{" "}
          <Link href="/login" className="text-indigo-600 font-medium hover:underline">
            חזרה לכניסה
          </Link>
        </p>
      )}
    </div>
  );
}
