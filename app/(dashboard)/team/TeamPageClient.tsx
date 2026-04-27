"use client";

import { useState, useRef, useEffect } from "react";
import { Plus, Mail, MessageCircle, MoreVertical, Crown, Shield, Headphones, Clock } from "lucide-react";
import InviteTeamModal from "@/components/modals/InviteTeamModal";
import type { PendingMember } from "@/components/modals/InviteTeamModal";
import { inviteTeamMember, removeTeamMember } from "@/app/actions/team";
import type { MemberRole, MemberStatus } from "@/lib/supabase/types";

type TeamMember = {
  id:     string;
  name:   string;
  email:  string;
  role:   MemberRole;
  status: MemberStatus;
};

const roleConfig: Record<MemberRole, { label: string; color: string; icon: React.ElementType }> = {
  owner:   { label: "בעלים", color: "bg-yellow-100 text-yellow-700", icon: Crown      },
  admin:   { label: "מנהל",  color: "bg-purple-100 text-purple-700", icon: Shield     },
  support: { label: "תמיכה", color: "bg-blue-100 text-blue-700",     icon: Headphones },
};

const GRADIENTS = [
  "from-indigo-400 to-purple-500",
  "from-teal-400 to-emerald-500",
  "from-orange-400 to-red-500",
  "from-pink-400 to-rose-500",
  "from-sky-400 to-blue-500",
  "from-violet-400 to-fuchsia-500",
];

function mkInitials(name: string) {
  return name.split(" ").map((w) => w[0]).join("").slice(0, 2);
}

function MemberCard({ member, gradient, onRemove }: {
  member:   TeamMember;
  gradient: string;
  onRemove: (id: string) => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isPending = member.status === "pending";
  const role = roleConfig[member.role];
  const RoleIcon = role.icon;

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setMenuOpen(false);
    }
    if (menuOpen) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [menuOpen]);

  const statusLabel = isPending                  ? "ממתין להזמנה"
                    : member.status === "active"  ? "מחובר"
                    :                               "לא מחובר";
  const statusColor = isPending                  ? "bg-amber-100 text-amber-700"
                    : member.status === "active"  ? "bg-emerald-100 text-emerald-700"
                    :                               "bg-gray-100 text-gray-500";
  const statusDot   = isPending                  ? "bg-amber-400"
                    : member.status === "active"  ? "bg-emerald-500"
                    :                               "bg-gray-400";

  return (
    <div className={`bg-white rounded-xl border p-5 ${isPending ? "border-amber-200 bg-amber-50/30" : "border-gray-200"}`}>
      <div className="flex items-start gap-4">
        <div className={`w-12 h-12 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center flex-shrink-0 relative`}>
          <span className="text-white font-bold text-sm">{mkInitials(member.name)}</span>
          {isPending && (
            <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-amber-400 rounded-full flex items-center justify-center border-2 border-white">
              <Clock size={9} className="text-white" />
            </span>
          )}
        </div>

        <div className="flex-1 text-right">
          <div className="flex items-center justify-between mb-1">
            <div ref={ref} className="relative">
              {member.role !== "owner" && (
                <button
                  onClick={() => setMenuOpen((v) => !v)}
                  className="p-1 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors"
                >
                  <MoreVertical size={14} />
                </button>
              )}
              {menuOpen && (
                <div className="absolute left-0 top-7 bg-white rounded-xl shadow-lg border border-gray-100 py-1 w-44 z-50" dir="rtl">
                  {isPending ? (
                    <button
                      onClick={() => { setMenuOpen(false); onRemove(member.id); }}
                      className="w-full px-4 py-2 text-sm text-amber-700 hover:bg-amber-50 transition-colors text-right"
                    >
                      בטל הזמנה
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        if (!confirm(`למחוק את ${member.name} מהצוות?`)) return;
                        setMenuOpen(false);
                        onRemove(member.id);
                      }}
                      className="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors text-right"
                    >
                      הסר מהצוות
                    </button>
                  )}
                </div>
              )}
            </div>
            <h3 className="font-semibold text-gray-900">{member.name}</h3>
          </div>

          <p className="text-sm text-gray-500 mb-3">{member.email}</p>

          <div className="flex items-center justify-end gap-2">
            <span className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium ${statusColor}`}>
              <span className={`inline-block w-1.5 h-1.5 rounded-full ${statusDot}`} />
              {statusLabel}
            </span>
            <span className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium ${role.color}`}>
              <RoleIcon size={11} />
              {role.label}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-start gap-2">
        {isPending ? (
          <p className="text-xs text-amber-600">הזמנה נשלחה – ממתין לאישור</p>
        ) : (
          <>
            <button className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-indigo-600 transition-colors px-3 py-1.5 rounded-lg hover:bg-indigo-50">
              <MessageCircle size={12} />
              שלח הודעה
            </button>
            <button className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-indigo-600 transition-colors px-3 py-1.5 rounded-lg hover:bg-indigo-50">
              <Mail size={12} />
              שלח אימייל
            </button>
          </>
        )}
      </div>
    </div>
  );
}

type Props = {
  owner:          { id: string; name: string; email: string };
  initialMembers: TeamMember[];
};

export default function TeamPageClient({ owner, initialMembers }: Props) {
  const [team,       setTeam]       = useState<TeamMember[]>(initialMembers);
  const [inviteOpen, setInviteOpen] = useState(false);

  async function handleInvite(pending: PendingMember) {
    const result = await inviteTeamMember(pending.name, pending.email, pending.role);
    if (result.error) throw new Error(result.error);
    if (result.member) {
      setTeam((prev) => [...prev, result.member!]);
    }
  }

  async function handleRemove(id: string) {
    const result = await removeTeamMember(id);
    if (result.error) {
      alert(`שגיאה: ${result.error}`);
      return;
    }
    setTeam((prev) => prev.filter((m) => m.id !== id));
  }

  const ownerMember: TeamMember = { ...owner, role: "owner", status: "active" };
  const allMembers = [ownerMember, ...team];

  return (
    <>
      <InviteTeamModal open={inviteOpen} onClose={() => setInviteOpen(false)} onInvite={handleInvite} />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">{allMembers.length} חברי צוות</p>
          <button
            onClick={() => setInviteOpen(true)}
            className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors"
          >
            <Plus size={16} />
            הזמן חבר צוות
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'סה"כ חברים',     value: allMembers.length,                                           color: "text-gray-900"    },
            { label: "פעילים כעת",      value: allMembers.filter((m) => m.status === "active").length,     color: "text-emerald-600" },
            { label: "ממתינים להזמנה", value: allMembers.filter((m) => m.status === "pending").length,    color: "text-amber-600"   },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-white rounded-xl border border-gray-200 p-4 text-right">
              <p className={`text-2xl font-bold ${color}`}>{value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {team.length === 0 ? (
          <div className="col-span-2 bg-white rounded-xl border border-dashed border-gray-300 p-10 text-center">
            <p className="text-gray-500 text-sm mb-2">עדיין אין חברי צוות נוספים</p>
            <button
              onClick={() => setInviteOpen(true)}
              className="text-sm text-indigo-600 hover:underline font-medium"
            >
              הזמן את חבר הצוות הראשון שלך
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {allMembers.map((member, i) => (
              <MemberCard
                key={member.id}
                member={member}
                gradient={GRADIENTS[i % GRADIENTS.length]}
                onRemove={handleRemove}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
