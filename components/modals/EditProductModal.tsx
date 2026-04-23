"use client";

import { useActionState, useEffect } from "react";
import { X, Loader2, Package, AlertCircle } from "lucide-react";
import { updateProduct } from "@/app/actions/products";
import type { ProductFormState } from "@/app/actions/products";
import type { Product } from "@/lib/supabase/types";

type ProductRow = Pick<Product, "id" | "name" | "sku" | "price" | "original_price" | "stock" | "status">;

type Props = {
  product: ProductRow | null;
  onClose: () => void;
};

const empty: ProductFormState = {};

function ModalInner({ product, onClose }: { product: ProductRow; onClose: () => void }) {
  const [state, formAction, isPending] = useActionState(updateProduct, empty);

  useEffect(() => {
    if (state.success) onClose();
  }, [state.success, onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 p-6 max-h-[90vh] overflow-y-auto" dir="rtl">

        <div className="flex items-center justify-between mb-6">
          <button onClick={onClose} className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
            <X size={18} />
          </button>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-gray-900">עריכת מוצר</h2>
            <div className="w-8 h-8 bg-indigo-100 rounded-xl flex items-center justify-center">
              <Package size={16} className="text-indigo-600" />
            </div>
          </div>
        </div>

        {state.error && (
          <div className="mb-4 flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-right">
            <AlertCircle size={16} className="text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{state.error}</p>
          </div>
        )}

        <form action={formAction} className="space-y-4">
          <input type="hidden" name="id" value={product.id} />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5 text-right">
              שם מוצר <span className="text-red-500">*</span>
            </label>
            <input name="name" type="text" defaultValue={product.name} required
              className={`w-full border rounded-xl px-4 py-2.5 text-sm text-right focus:outline-none focus:ring-2 focus:ring-indigo-500 ${state.fieldErrors?.name ? "border-red-400 bg-red-50" : "border-gray-200"}`} />
            {state.fieldErrors?.name && <p className="text-xs text-red-500 mt-1 text-right">{state.fieldErrors.name}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5 text-right">מק"ט (SKU)</label>
              <input name="sku" type="text" defaultValue={product.sku ?? ""}
                className={`w-full border rounded-xl px-4 py-2.5 text-sm text-right focus:outline-none focus:ring-2 focus:ring-indigo-500 ${state.fieldErrors?.sku ? "border-red-400 bg-red-50" : "border-gray-200"}`} />
              {state.fieldErrors?.sku && <p className="text-xs text-red-500 mt-1 text-right">{state.fieldErrors.sku}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5 text-right">סטטוס</label>
              <select name="status" defaultValue={product.status}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-right focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white">
                <option value="active">פעיל</option>
                <option value="out_of_stock">אזל מהמלאי</option>
                <option value="archived">בארכיון</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5 text-right">
                מחיר (₪) <span className="text-red-500">*</span>
              </label>
              <input name="price" type="number" min="0" step="0.01" defaultValue={product.price} required
                className={`w-full border rounded-xl px-4 py-2.5 text-sm text-right focus:outline-none focus:ring-2 focus:ring-indigo-500 ${state.fieldErrors?.price ? "border-red-400 bg-red-50" : "border-gray-200"}`} />
              {state.fieldErrors?.price && <p className="text-xs text-red-500 mt-1 text-right">{state.fieldErrors.price}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5 text-right">
                מחיר מקורי (₪) <span className="text-gray-400 font-normal text-xs">(למבצע)</span>
              </label>
              <input name="original_price" type="number" min="0" step="0.01" defaultValue={product.original_price ?? ""}
                className={`w-full border rounded-xl px-4 py-2.5 text-sm text-right focus:outline-none focus:ring-2 focus:ring-indigo-500 ${state.fieldErrors?.original_price ? "border-red-400 bg-red-50" : "border-gray-200"}`} />
              {state.fieldErrors?.original_price && <p className="text-xs text-red-500 mt-1 text-right">{state.fieldErrors.original_price}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5 text-right">
              כמות במלאי <span className="text-red-500">*</span>
            </label>
            <input name="stock" type="number" min="0" defaultValue={product.stock} required
              className={`w-full border rounded-xl px-4 py-2.5 text-sm text-right focus:outline-none focus:ring-2 focus:ring-indigo-500 ${state.fieldErrors?.stock ? "border-red-400 bg-red-50" : "border-gray-200"}`} />
            {state.fieldErrors?.stock && <p className="text-xs text-red-500 mt-1 text-right">{state.fieldErrors.stock}</p>}
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
              ביטול
            </button>
            <button type="submit" disabled={isPending}
              className="flex-1 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 disabled:opacity-60 transition-colors flex items-center justify-center gap-2">
              {isPending ? <><Loader2 size={14} className="animate-spin" />שומר...</> : "שמור שינויים"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function EditProductModal({ product, onClose }: Props) {
  if (!product) return null;
  return <ModalInner key={product.id} product={product} onClose={onClose} />;
}
