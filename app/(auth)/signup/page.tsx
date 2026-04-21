"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Loader2, AlertCircle, Store } from "lucide-react";
import { signup } from "@/app/actions/auth";
import type { AuthFormState } from "@/app/actions/auth";

const initialState: AuthFormState = {};

export default function SignupPage() {
  const [state, formAction, isPending] = useActionState(signup, initialState);

  return (
    <div className="w-full max-w-sm" dir="rtl">
      {/* Logo */}
      <div className="text-center mb-8">
        <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <span className="text-white font-bold text-lg">AI</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">יצירת חשבון חדש</h1>
        <p className="text-gray-500 text-sm mt-1">חבר את החנות שלך ל-EnigmAI</p>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
        {state.error && (
          <div className="mb-5 flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
            <AlertCircle size={16} className="text-red-500 flex-shrink-0" />
            <p className="text-sm text-red-700">{state.error}</p>
          </div>
        )}

        <form action={formAction} className="space-y-4">
          {/* Full name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">שם מלא</label>
            <input
              name="name"
              type="text"
              autoComplete="name"
              placeholder="ישראל ישראלי"
              required
              className={`w-full border rounded-xl px-4 py-2.5 text-sm text-right focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors ${
                state.fieldErrors?.name ? "border-red-400 bg-red-50" : "border-gray-200"
              }`}
            />
            {state.fieldErrors?.name && (
              <p className="text-xs text-red-500 mt-1">{state.fieldErrors.name}</p>
            )}
          </div>

          {/* Store name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              <span className="flex items-center justify-end gap-1">
                שם החנות
                <Store size={13} className="text-gray-400" />
              </span>
            </label>
            <input
              name="storeName"
              type="text"
              placeholder="מתנות עם לב"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-right focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">אימייל</label>
            <input
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              required
              className={`w-full border rounded-xl px-4 py-2.5 text-sm text-right focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors ${
                state.fieldErrors?.email ? "border-red-400 bg-red-50" : "border-gray-200"
              }`}
            />
            {state.fieldErrors?.email && (
              <p className="text-xs text-red-500 mt-1">{state.fieldErrors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">סיסמה</label>
            <input
              name="password"
              type="password"
              autoComplete="new-password"
              placeholder="לפחות 6 תווים"
              required
              className={`w-full border rounded-xl px-4 py-2.5 text-sm text-right focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors ${
                state.fieldErrors?.password ? "border-red-400 bg-red-50" : "border-gray-200"
              }`}
            />
            {state.fieldErrors?.password && (
              <p className="text-xs text-red-500 mt-1">{state.fieldErrors.password}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 disabled:opacity-60 transition-colors flex items-center justify-center gap-2 mt-2"
          >
            {isPending ? <><Loader2 size={15} className="animate-spin" />יוצר חשבון...</> : "צור חשבון"}
          </button>
        </form>
      </div>

      <p className="text-center text-sm text-gray-500 mt-6">
        כבר יש לך חשבון?{" "}
        <Link href="/login" className="text-indigo-600 font-medium hover:underline">
          התחבר
        </Link>
      </p>
    </div>
  );
}
