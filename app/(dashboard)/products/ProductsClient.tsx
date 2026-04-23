"use client";

import { useState, useRef, useEffect, useTransition } from "react";
import { Search, Plus, Package, Wand2, ChevronDown, Star, MoreVertical, Pencil, Archive } from "lucide-react";
import type { Product } from "@/lib/supabase/types";
import AddProductModal from "@/components/modals/AddProductModal";
import EditProductModal from "@/components/modals/EditProductModal";
import { archiveProduct } from "@/app/actions/products";

const emojiFor = (name: string): string => {
  if (name.includes("נר"))   return "🕯️";
  if (name.includes("ערכת")) return "🎨";
  if (name.includes("ארנק")) return "👜";
  if (name.includes("תמונ")) return "🖼️";
  if (name.includes("מארז")) return "🛁";
  if (name.includes("פנס"))  return "🏮";
  return "🎁";
};

const sortOptions = ["הנמכרים ביותר", "מחיר: גבוה לנמוך", "מחיר: נמוך לגבוה", "מלאי נמוך"];

type ProductRow = Pick<Product, "id" | "name" | "sku" | "price" | "original_price" | "stock" | "status" | "sold_count" | "rating" | "image_url">;

function ProductMenu({ product, onEdit }: { product: ProductRow; onEdit: (p: ProductRow) => void }) {
  const [open, setOpen] = useState(false);
  const [, startArchive] = useTransition();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="p-1.5 bg-white rounded-lg shadow-sm text-gray-500 hover:text-gray-700 transition-colors"
      >
        <MoreVertical size={14} />
      </button>
      {open && (
        <div className="absolute left-0 top-8 bg-white rounded-xl shadow-lg border border-gray-100 py-1 w-40 z-50" dir="rtl">
          <button
            onClick={() => { setOpen(false); onEdit(product); }}
            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Pencil size={13} className="text-indigo-500" />
            ערוך מוצר
          </button>
          <button
            onClick={() => {
              setOpen(false);
              startArchive(async () => { await archiveProduct(product.id); });
            }}
            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Archive size={13} className="text-gray-400" />
            העבר לארכיון
          </button>
        </div>
      )}
    </div>
  );
}

export default function ProductsClient({ products }: { products: ProductRow[] }) {
  const [search,      setSearch]      = useState("");
  const [sort,        setSort]        = useState("הנמכרים ביותר");
  const [sortOpen,    setSortOpen]    = useState(false);
  const [aiRewriting, setAiRewriting] = useState<string | null>(null);
  const [addOpen,     setAddOpen]     = useState(false);
  const [editProduct, setEditProduct] = useState<ProductRow | null>(null);

  const sorted = [...products]
    .filter((p) => p.name.includes(search) || (p.sku ?? "").includes(search))
    .sort((a, b) => {
      if (sort === "מחיר: גבוה לנמוך") return b.price - a.price;
      if (sort === "מחיר: נמוך לגבוה") return a.price - b.price;
      if (sort === "מלאי נמוך")         return a.stock - b.stock;
      return b.sold_count - a.sold_count;
    });

  const handleAiRewrite = (id: string) => {
    setAiRewriting(id);
    setTimeout(() => setAiRewriting(null), 2000);
  };

  return (
    <>
      <AddProductModal  open={addOpen}       onClose={() => setAddOpen(false)} />
      <EditProductModal product={editProduct} onClose={() => setEditProduct(null)} />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <button
                onClick={() => setSortOpen(!sortOpen)}
                className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 hover:border-gray-300 transition-colors"
              >
                {sort}
                <ChevronDown size={14} className="text-gray-400" />
              </button>
              {sortOpen && (
                <div className="absolute right-0 top-11 bg-white rounded-xl shadow-lg border border-gray-100 py-1 w-48 z-50">
                  {sortOptions.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => { setSort(opt); setSortOpen(false); }}
                      className={`w-full text-right px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${sort === opt ? "text-indigo-600 font-medium" : "text-gray-700"}`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="relative">
              <Search size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="חיפוש מוצר או SKU..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-white border border-gray-200 rounded-xl pr-9 pl-4 py-2.5 text-sm text-right w-56 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
          <button
            onClick={() => setAddOpen(true)}
            className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors"
          >
            <Plus size={16} />
            הוסף מוצר
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {sorted.map((product) => (
            <div key={product.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow group">
              <div className="h-44 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center relative">
                {product.image_url ? (
                  <img src={product.image_url} alt={product.name} className="h-full w-full object-cover" />
                ) : (
                  <span className="text-6xl">{emojiFor(product.name)}</span>
                )}
                {product.original_price && (
                  <span className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">מבצע</span>
                )}
                {product.status === "out_of_stock" && (
                  <span className="absolute top-3 left-3 bg-gray-800 text-white text-xs font-bold px-2.5 py-1 rounded-full">אזל</span>
                )}
                <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ProductMenu product={product} onEdit={setEditProduct} />
                </div>
              </div>

              <div className="p-4 text-right">
                <div className="flex items-start justify-between mb-1 gap-2">
                  <div className="flex items-center gap-1">
                    {product.rating && (
                      <>
                        <Star size={12} className="text-yellow-400 fill-yellow-400" />
                        <span className="text-xs text-gray-500">{product.rating}</span>
                      </>
                    )}
                  </div>
                  <h3 className="font-semibold text-gray-900 text-sm leading-tight">{product.name}</h3>
                </div>
                <p className="text-xs text-gray-400 mb-3">SKU: {product.sku ?? "–"}</p>

                <div className="flex items-center justify-end gap-2 mb-3">
                  <span className="font-bold text-gray-900">₪{product.price}</span>
                  {product.original_price && (
                    <span className="text-sm text-gray-400 line-through">₪{product.original_price}</span>
                  )}
                </div>

                <div className="flex items-center justify-end gap-1 mb-4">
                  <span className={`text-xs font-medium ${
                    product.stock === 0 ? "text-red-500" : product.stock <= 5 ? "text-orange-500" : "text-emerald-600"
                  }`}>
                    {product.stock === 0 ? "אזל מהמלאי" : product.stock <= 5 ? `נותרו ${product.stock} יחידות בלבד` : `${product.stock} במלאי`}
                  </span>
                  <Package size={12} className="text-gray-400" />
                </div>

                <button
                  onClick={() => handleAiRewrite(product.id)}
                  disabled={aiRewriting === product.id}
                  className="w-full flex items-center justify-center gap-2 py-2 border border-dashed border-indigo-300 rounded-lg text-indigo-600 text-xs font-medium hover:bg-indigo-50 transition-colors disabled:opacity-70"
                >
                  {aiRewriting === product.id ? (
                    <>
                      <span className="w-3 h-3 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin" />
                      כותב מחדש...
                    </>
                  ) : (
                    <><Wand2 size={13} />שכתוב AI לתיאור</>
                  )}
                </button>
              </div>
            </div>
          ))}
          {sorted.length === 0 && (
            <div className="col-span-3 py-16 text-center text-sm text-gray-400">לא נמצאו מוצרים</div>
          )}
        </div>
      </div>
    </>
  );
}
