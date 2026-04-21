"use client";

import { useState } from "react";
import { Search, Plus, Package, Wand2, ChevronDown, Star, MoreVertical } from "lucide-react";

const products = [
  {
    id: 1,
    name: "נר ריחני לבנדר מינימליסטי",
    sku: "CND-001",
    price: 89,
    originalPrice: 129,
    stock: 24,
    image: "🕯️",
    onSale: true,
    sold: 142,
    rating: 4.8,
  },
  {
    id: 2,
    name: "ערכת DIY לעיצוב בית – אביב",
    sku: "DIY-009",
    price: 149,
    originalPrice: null,
    stock: 5,
    image: "🎨",
    onSale: false,
    sold: 38,
    rating: 4.6,
  },
  {
    id: 3,
    name: "ארנק עור אמיתי – גברים",
    sku: "WLT-003",
    price: 199,
    originalPrice: 249,
    stock: 1,
    image: "👜",
    onSale: true,
    sold: 87,
    rating: 4.9,
  },
  {
    id: 4,
    name: "תמונת קנבס – פריז בשחור לבן",
    sku: "ART-017",
    price: 320,
    originalPrice: null,
    stock: 12,
    image: "🖼️",
    onSale: false,
    sold: 55,
    rating: 4.7,
  },
  {
    id: 5,
    name: "מארז מתנה – ספא ביתי",
    sku: "GFT-024",
    price: 249,
    originalPrice: 299,
    stock: 0,
    image: "🛁",
    onSale: true,
    sold: 201,
    rating: 5.0,
  },
  {
    id: 6,
    name: "פנס עץ עם נר LED",
    sku: "DEC-011",
    price: 119,
    originalPrice: null,
    stock: 18,
    image: "🏮",
    onSale: false,
    sold: 72,
    rating: 4.5,
  },
];

const sortOptions = [
  "בסדר רגיל",
  "הנמכרים ביותר",
  "מחיר: גבוה לנמוך",
  "מחיר: נמוך לגבוה",
  "מלאי נמוך",
];

export default function ProductsPage() {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("הנמכרים ביותר");
  const [sortOpen, setSortOpen] = useState(false);
  const [aiRewriting, setAiRewriting] = useState<number | null>(null);

  const filtered = products
    .filter((p) => p.name.includes(search) || p.sku.includes(search));

  const handleAiRewrite = (id: number) => {
    setAiRewriting(id);
    setTimeout(() => setAiRewriting(null), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Sort */}
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
                    className={`w-full text-right px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
                      sort === opt ? "text-indigo-600 font-medium" : "text-gray-700"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Search */}
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

        <button className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors">
          <Plus size={16} />
          הוסף מוצר
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-3 gap-4">
        {filtered.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow group"
          >
            {/* Image area */}
            <div className="h-44 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center relative">
              <span className="text-6xl">{product.image}</span>
              {product.onSale && (
                <span className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                  מבצע
                </span>
              )}
              {product.stock === 0 && (
                <span className="absolute top-3 left-3 bg-gray-800 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                  אזל
                </span>
              )}
              <button className="absolute top-2 left-2 p-1.5 bg-white rounded-lg shadow-sm opacity-0 group-hover:opacity-100 transition-opacity text-gray-500 hover:text-gray-700">
                <MoreVertical size={14} />
              </button>
            </div>

            {/* Content */}
            <div className="p-4 text-right">
              <div className="flex items-start justify-between mb-1 gap-2">
                <div className="flex items-center gap-1">
                  <Star size={12} className="text-yellow-400 fill-yellow-400" />
                  <span className="text-xs text-gray-500">{product.rating}</span>
                </div>
                <h3 className="font-semibold text-gray-900 text-sm leading-tight">{product.name}</h3>
              </div>
              <p className="text-xs text-gray-400 mb-3 text-right">SKU: {product.sku}</p>

              {/* Price */}
              <div className="flex items-center justify-end gap-2 mb-3">
                <span className="font-bold text-gray-900">₪{product.price}</span>
                {product.originalPrice && (
                  <span className="text-sm text-gray-400 line-through">₪{product.originalPrice}</span>
                )}
              </div>

              {/* Stock */}
              <div className="flex items-center justify-end gap-1 mb-4">
                <span className={`text-xs font-medium ${
                  product.stock === 0 ? "text-red-500" :
                  product.stock <= 5 ? "text-orange-500" :
                  "text-emerald-600"
                }`}>
                  {product.stock === 0
                    ? "אזל מהמלאי"
                    : product.stock <= 5
                    ? `נותרה יחידה ${product.stock} בלבד`
                    : `${product.stock} במלאי`}
                </span>
                <Package size={12} className="text-gray-400" />
              </div>

              {/* AI rewrite button */}
              <button
                onClick={() => handleAiRewrite(product.id)}
                disabled={aiRewriting === product.id}
                className="w-full flex items-center justify-center gap-2 py-2 border border-dashed border-indigo-300 rounded-lg text-indigo-600 text-xs font-medium hover:bg-indigo-50 transition-colors disabled:opacity-70"
              >
                {aiRewriting === product.id ? (
                  <>
                    <span className="w-3 h-3 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin"></span>
                    כותב מחדש...
                  </>
                ) : (
                  <>
                    <Wand2 size={13} />
                    שכתוב AI לתיאור
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
