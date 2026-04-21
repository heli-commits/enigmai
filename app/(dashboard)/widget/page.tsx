import ChatWidget from "@/components/chat/ChatWidget";

export default function WidgetPage() {
  return (
    <div className="space-y-6">
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
        <p className="text-sm text-amber-800 text-right font-medium">
          תצוגה מקדימה של ווידג'ט הצ'אט כפי שהלקוח רואה אותו. הטמע את הקוד להלן באתר שלך.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Widget preview */}
        <div className="bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl p-8 flex items-end justify-center min-h-[600px] relative">
          <div className="absolute inset-0 flex items-center justify-center opacity-10">
            <p className="text-4xl font-bold text-indigo-900 text-center">תצוגת האתר שלך</p>
          </div>
          <ChatWidget />
        </div>

        {/* Embed code */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="font-semibold text-gray-900 text-right mb-3">קוד הטמעה</h3>
            <div className="bg-gray-900 rounded-xl p-4 text-left overflow-auto">
              <pre className="text-green-400 text-xs font-mono whitespace-pre-wrap">
{`<!-- EnigmAI Widget -->
<script>
  window.EnigmAI = {
    storeId: "store_abc123",
    agentName: "ארי",
    theme: "indigo",
    lang: "he"
  };
</script>
<script async
  src="https://cdn.enigmai.ai/widget.js">
</script>`}
              </pre>
            </div>
            <button className="mt-3 w-full py-2 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 transition-colors font-medium">
              העתק קוד
            </button>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
            <h3 className="font-semibold text-gray-900 text-right">הגדרות ווידג'ט</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  {["#6366f1", "#10b981", "#f59e0b", "#ef4444"].map((c) => (
                    <button
                      key={c}
                      className="w-7 h-7 rounded-full border-2 border-white shadow-sm hover:scale-110 transition-transform"
                      style={{ background: c }}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">צבע עיקרי</span>
              </div>
              <div className="flex items-center justify-between">
                <select className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-right focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <option>פינה ימנית תחתית</option>
                  <option>פינה שמאלית תחתית</option>
                </select>
                <span className="text-sm text-gray-600">מיקום</span>
              </div>
              <div className="flex items-center justify-between">
                <input
                  type="text"
                  defaultValue="שלום! איך אפשר לעזור? 😊"
                  className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-right w-48 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <span className="text-sm text-gray-600">הודעת פתיחה</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
