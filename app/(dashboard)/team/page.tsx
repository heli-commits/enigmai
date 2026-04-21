"use client";

import { Plus, Mail, MessageCircle, MoreVertical, Crown, Shield, Headphones } from "lucide-react";

const roleConfig = {
  owner: { label: "בעלים", color: "bg-yellow-100 text-yellow-700", icon: Crown },
  admin: { label: "מנהל", color: "bg-purple-100 text-purple-700", icon: Shield },
  support: { label: "תמיכה", color: "bg-blue-100 text-blue-700", icon: Headphones },
};

const team = [
  { id: 1, name: "ישראל ישראלי", email: "israel@mystore.co.il", role: "owner", status: "מחובר", initials: "יי", tickets: 0 },
  { id: 2, name: "תמר שלום", email: "tamar@mystore.co.il", role: "admin", status: "מחובר", initials: "תש", tickets: 3 },
  { id: 3, name: "יואב מלמד", email: "yoav@mystore.co.il", role: "support", status: "לא מחובר", initials: "ימ", tickets: 2 },
  { id: 4, name: "ליאת דוד", email: "liat@mystore.co.il", role: "support", status: "לא מחובר", initials: "לד", tickets: 0 },
];

const colors = ["from-indigo-400 to-purple-500", "from-teal-400 to-emerald-500", "from-orange-400 to-red-500", "from-pink-400 to-rose-500"];

export default function TeamPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">4 חברי צוות</p>
        <button className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors">
          <Plus size={16} />
          הזמן חבר צוות
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {team.map((member, i) => {
          const role = roleConfig[member.role as keyof typeof roleConfig];
          const RoleIcon = role.icon;
          return (
            <div key={member.id} className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 bg-gradient-to-br ${colors[i]} rounded-xl flex items-center justify-center flex-shrink-0`}>
                  <span className="text-white font-bold text-sm">{member.initials}</span>
                </div>
                <div className="flex-1 text-right">
                  <div className="flex items-center justify-between mb-1">
                    <button className="p-1 rounded-lg hover:bg-gray-100 text-gray-400">
                      <MoreVertical size={14} />
                    </button>
                    <h3 className="font-semibold text-gray-900">{member.name}</h3>
                  </div>
                  <p className="text-sm text-gray-500 mb-3">{member.email}</p>
                  <div className="flex items-center justify-end gap-2">
                    <span className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium ${role.color}`}>
                      <RoleIcon size={11} />
                      {role.label}
                    </span>
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                      member.status === "מחובר" ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"
                    }`}>
                      <span className={`inline-block w-1.5 h-1.5 rounded-full ml-1 ${
                        member.status === "מחובר" ? "bg-emerald-500" : "bg-gray-400"
                      }`}></span>
                      {member.status}
                    </span>
                  </div>
                  {member.tickets > 0 && (
                    <p className="text-xs text-orange-500 mt-2 font-medium text-right">
                      {member.tickets} פניות פתוחות
                    </p>
                  )}
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-start gap-2">
                <button className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-indigo-600 transition-colors px-3 py-1.5 rounded-lg hover:bg-indigo-50">
                  <MessageCircle size={12} />
                  שלח הודעה
                </button>
                <button className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-indigo-600 transition-colors px-3 py-1.5 rounded-lg hover:bg-indigo-50">
                  <Mail size={12} />
                  שלח אימייל
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
