import { useState } from "react";
import { Lead, LeadStatus } from "../types";
import { Users, Info, ChevronRight, Check } from "lucide-react";

interface StatusDistributionChartProps {
  leads: Lead[];
}

const STATUS_METADATA: Record<LeadStatus, { 
  label: string; 
  gradient: string; 
  bg: string; 
  border: string; 
  text: string;
  description: string;
}> = {
  NEW: { 
    label: "New Leads", 
    gradient: "from-blue-600 to-cyan-400", 
    bg: "bg-blue-500/10", 
    border: "border-blue-500/20", 
    text: "text-blue-400",
    description: "Prospects recently uploaded or fetched via spreadsheet that have not yet had custom pitches sequenced."
  },
  QUALIFIED: { 
    label: "AI Qualified", 
    gradient: "from-emerald-600 to-teal-400", 
    bg: "bg-emerald-500/10", 
    border: "border-emerald-500/20", 
    text: "text-emerald-400",
    description: "Leads with an AI Fit Index higher than 70 whose pain points have been categorized."
  },
  PITCHED: { 
    label: "Pitched", 
    gradient: "from-orange-600 to-amber-400", 
    bg: "bg-orange-500/10", 
    border: "border-orange-500/20", 
    text: "text-orange-400",
    description: "Pitches that have been sent out via Gmail API or standard integration."
  },
  REPLIED: { 
    label: "Replied", 
    gradient: "from-fuchsia-600 to-pink-400", 
    bg: "bg-fuchsia-500/10", 
    border: "border-fuchsia-500/20", 
    text: "text-fuchsia-400",
    description: "Leads that responded to active sequences and whose replies are awaiting extraction."
  },
  MEETING_NEEDED: { 
    label: "Meeting Booked", 
    gradient: "from-purple-600 to-indigo-400", 
    bg: "bg-purple-500/10", 
    border: "border-purple-500/20", 
    text: "text-purple-400",
    description: "Hot leads committed to a booking pipeline or high-conversion closing conversation."
  },
  WON: { 
    label: "Closed Won", 
    gradient: "from-green-600 to-emerald-500", 
    bg: "bg-green-500/10", 
    border: "border-green-500/20", 
    text: "text-green-400",
    description: "Matches finalized and won. Onboarding processes active."
  },
  LOST: { 
    label: "Closed Lost", 
    gradient: "from-slate-600 to-slate-400", 
    bg: "bg-slate-500/10", 
    border: "border-white/5", 
    text: "text-slate-500",
    description: "Unsuccessful conversions stored for historic sequencing or future reactivation campaigns."
  }
};

export function StatusDistributionChart({ leads }: StatusDistributionChartProps) {
  const [selectedStatus, setSelectedStatus] = useState<LeadStatus | null>(null);

  // Compute stats distribution
  const totalCount = leads.length;
  
  const statusCounts = (Object.keys(STATUS_METADATA) as LeadStatus[]).reduce((acc, status) => {
    acc[status] = leads.filter(l => l.status === status).length;
    return acc;
  }, {} as Record<LeadStatus, number>);

  const maxCount = Math.max(...Object.values(statusCounts), 1);

  const activeLeadsForSelectedStatus = selectedStatus 
    ? leads.filter(l => l.status === selectedStatus)
    : [];

  return (
    <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 backdrop-blur-md h-full flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-widest text-slate-400">Pipeline Stage Distribution</h3>
            <p className="text-[10px] text-slate-500 mt-1 uppercase font-medium">Click on any pipeline bar to inspect isolated records</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/5 rounded-xl font-mono text-[10px] text-slate-400">
            <Users size={12} className="text-slate-500" />
            <span>N={totalCount}</span>
          </div>
        </div>

        {/* Visual Matrix */}
        <div className="space-y-4">
          {(Object.keys(STATUS_METADATA) as LeadStatus[]).map((status) => {
            const count = statusCounts[status];
            const meta = STATUS_METADATA[status];
            const pctOfTotal = totalCount > 0 ? (count / totalCount) * 100 : 0;
            const pctOfMax = (count / maxCount) * 100;
            const isSelected = selectedStatus === status;

            return (
              <div 
                key={status}
                onClick={() => setSelectedStatus(isSelected ? null : status)}
                className={`group p-3 rounded-2xl border transition-all cursor-pointer ${
                  isSelected 
                    ? `bg-white/[0.05] ${meta.border}` 
                    : "bg-transparent border-transparent hover:bg-white/[0.02]"
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full bg-gradient-to-tr ${meta.gradient}`} />
                    <span className="font-bold tracking-tight text-white group-hover:text-orange-400 transition-colors">
                      {meta.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 font-mono">
                    <span className="text-white font-black">{count}</span>
                    <span className="text-[10px] text-slate-600">({pctOfTotal.toFixed(0)}%)</span>
                  </div>
                </div>

                <div className="h-2.5 bg-white/5 rounded-full overflow-hidden relative">
                  <div 
                    className={`h-full bg-gradient-to-r ${meta.gradient} rounded-full transition-all duration-700`}
                    style={{ width: `${pctOfMax}%` }}
                  />
                  {isSelected && (
                    <div className="absolute inset-x-0 bottom-0 h-1 bg-white/20 animate-pulse"></div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Inspector */}
      <div className="mt-8 pt-6 border-t border-white/5 min-h-[140px] flex flex-col justify-between">
        {!selectedStatus ? (
          <div className="flex items-center gap-4 p-4 bg-white/[0.01] border border-dashed border-white/5 rounded-2xl text-slate-500">
            <Info size={16} className="text-orange-500 shrink-0" />
            <p className="text-[11px] leading-relaxed">Select a pipeline stage above to drill down into active contacts, inspect operational details, and identify potential bottlenecks.</p>
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${STATUS_METADATA[selectedStatus].bg} ${STATUS_METADATA[selectedStatus].text} border ${STATUS_METADATA[selectedStatus].border}`}>
                  {STATUS_METADATA[selectedStatus].label} Description
                </span>
                <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
                  {STATUS_METADATA[selectedStatus].description}
                </p>
              </div>
              <button 
                onClick={() => setSelectedStatus(null)}
                className="text-slate-600 hover:text-white text-[10px] uppercase font-black tracking-widest transition-colors shrink-0 ml-4"
              >
                Clear Filter
              </button>
            </div>

            {/* In-view Leads matching active filter */}
            {activeLeadsForSelectedStatus.length === 0 ? (
              <div className="text-[10px] text-slate-600 italic">No prospects currently reside at this pipeline station.</div>
            ) : (
              <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                {activeLeadsForSelectedStatus.map((lead) => (
                  <div key={lead.id} className="p-3 bg-white/[0.04] rounded-xl flex justify-between items-center border border-white/5">
                    <div>
                      <div className="text-xs font-bold text-white uppercase tracking-tight">{lead.company}</div>
                      <div className="text-[10px] text-slate-500 font-medium">{lead.name} • {lead.email}</div>
                    </div>
                    {lead.aiScore && (
                      <div className="text-right shrink-0 font-mono text-[11px] font-bold text-orange-500">
                        {lead.aiScore} <span className="text-[8px] text-slate-600 uppercase font-bold">Fit</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
