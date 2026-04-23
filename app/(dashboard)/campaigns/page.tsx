"use client";

import { useState } from "react";
import { Plus, Search, Send, Clock, FileText, Users, MoreVertical, Mail, MessageSquare, X } from "lucide-react";
import NewCampaignModal from "@/components/modals/NewCampaignModal";
import type { NewCampaign } from "@/components/modals/NewCampaignModal";

type CampaignTab    = "all" | "drafts" | "scheduled" | "sent";
type CampaignStatus = "sent" | "draft" | "scheduled";

type Campaign = {
  id:           number;
  name:         string;
  type:         "email" | "sms";
  created:      string;
  sentAt:       string | null;
  status:       CampaignStatus;
  recipients:   number;
  openRate:     string | null;
  scheduledFor?: string;
};

const INITIAL_CAMPAIGNS: Campaign[] = [
  { id: 1, name: "מבצע פסח – 20% הנחה",        type: "email", created: "15/04/2026", sentAt: "18/04/2026, 09:00", status: "sent",      recipients: 284, openRate: "34%"  },
  { id: 2, name: "99% הנחה – יום אחד בלבד",     type: "sms",   created: "10/04/2026", sentAt: "10/04/2026, 12:00", status: "sent",      recipients: 2,   openRate: "100%" },
  { id: 3, name: "ניוזלטר אפריל – חדשות המותג", type: "email", created: "19/04/2026", sentAt: null,                status: "scheduled", recipients: 310, openRate: null,  scheduledFor: "22/04/2026, 10:00" },
  { id: 4, name: "טיזר קולקציית קיץ",            type: "email", created: "20/04/2026", sentAt: null,                status: "draft",     recipients: 0,   openRate: null   },
  { id: 5, name: "תזכורת עגלות נטושות",          type: "email", created: "01/04/2026", sentAt: "05/04/2026, 15:00", status: "sent",      recipients: 47,  openRate: "28%"  },
  { id: 6, name: "SMS ברכה ליום הולדת",           type: "sms",   created: "20/04/2026", sentAt: null,                status: "draft",     recipients: 0,   openRate: null   },
];

const tabLabels: Record<CampaignTab, string> = { all: "הכול", drafts: "טיוטות", scheduled: "מתוזמנות", sent: "נשלחו" };

const statusConfig: Record<CampaignStatus, { label: string; color: string }> = {
  sent:      { label: "נשלח",   color: "bg-emerald-100 text-emerald-700" },
  draft:     { label: "טיוטה",  color: "bg-gray-100 text-gray-600"       },
  scheduled: { label: "מתוזמן", color: "bg-blue-100 text-blue-700"       },
};

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>(INITIAL_CAMPAIGNS);
  const [tab,       setTab]       = useState<CampaignTab>("all");
  const [search,    setSearch]    = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const filtered = campaigns.filter((c) => {
    const matchTab =
      tab === "all"        ||
      (tab === "drafts"    && c.status === "draft")     ||
      (tab === "scheduled" && c.status === "scheduled") ||
      (tab === "sent"      && c.status === "sent");
    return matchTab && c.name.includes(search);
  });

  function handleAdd(campaign: NewCampaign) {
    setCampaigns((prev) => [...prev, campaign as Campaign]);
  }

  function moveToDraft(id: number) {
    setCampaigns((prev) =>
      prev.map((c) => c.id === id ? { ...c, status: "draft" as const, scheduledFor: undefined } : c)
    );
  }

  return (
    <>
      <NewCampaignModal open={modalOpen} onClose={() => setModalOpen(false)} onAdd={handleAdd} />

      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="relative">
            <Search size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="חיפוש קמפיין..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-white border border-gray-200 rounded-xl pr-9 pl-4 py-2.5 text-sm text-right w-64 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors"
          >
            <Plus size={16} />
            קמפיין חדש
          </button>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-xl p-1 w-fit">
          {(["all", "drafts", "scheduled", "sent"] as CampaignTab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                tab === t ? "bg-indigo-600 text-white shadow-sm" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {tabLabels[t]}
            </button>
          ))}
        </div>

        {/* Campaign list */}
        <div className="space-y-3">
          {filtered.map((campaign) => {
            const status = statusConfig[campaign.status];
            return (
              <div key={campaign.id} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-sm transition-all">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    campaign.type === "email" ? "bg-indigo-50" : "bg-teal-50"
                  }`}>
                    {campaign.type === "email"
                      ? <Mail size={18} className="text-indigo-600" />
                      : <MessageSquare size={18} className="text-teal-600" />}
                  </div>

                  <div className="flex-1 text-right">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        {campaign.status === "scheduled" && (
                          <button
                            onClick={() => moveToDraft(campaign.id)}
                            title="בטל תזמון – העבר לטיוטה"
                            className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200 transition-colors"
                          >
                            <X size={11} />
                            בטל תזמון
                          </button>
                        )}
                        <button className="p-1 rounded-lg hover:bg-gray-100 text-gray-400">
                          <MoreVertical size={14} />
                        </button>
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${status.color}`}>
                          {status.label}
                        </span>
                      </div>
                      <h3 className="font-semibold text-gray-900 text-sm">{campaign.name}</h3>
                    </div>

                    <div className="flex items-center justify-end gap-4 text-xs text-gray-500">
                      {campaign.status === "sent" && (
                        <>
                          <span className="text-emerald-600 font-medium">{campaign.openRate} פתיחות</span>
                          <span className="flex items-center gap-1"><Users size={11} />{campaign.recipients} נמענים</span>
                          <span className="flex items-center gap-1"><Send size={11} />נשלח {campaign.sentAt}</span>
                        </>
                      )}
                      {campaign.status === "scheduled" && (
                        <>
                          <span className="flex items-center gap-1"><Users size={11} />{campaign.recipients} נמענים</span>
                          <span className="flex items-center gap-1 text-blue-600 font-medium">
                            <Clock size={11} />יישלח {campaign.scheduledFor}
                          </span>
                        </>
                      )}
                      {campaign.status === "draft" && (
                        <span className="flex items-center gap-1 text-orange-500">
                          <FileText size={11} />טיוטה – לא פורסם
                        </span>
                      )}
                      <span className="text-gray-400">נוצר {campaign.created}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        campaign.type === "email" ? "bg-indigo-50 text-indigo-600" : "bg-teal-50 text-teal-700"
                      }`}>
                        {campaign.type === "email" ? "אימייל" : "SMS"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {filtered.length === 0 && (
            <div className="text-center py-16 text-gray-400">
              <p className="text-sm">לא נמצאו קמפיינים</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
