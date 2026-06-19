import { Lead, LeadStatus } from "../types";
import { MoveRight, TrendingUp, CheckCircle, Clock, Zap, XCircle } from "lucide-react";

interface PipelinePageProps {
  leads: Lead[];
  onStatusChange: (leadId: string, newStatus: LeadStatus) => void;
}

export function PipelinePage({ leads, onStatusChange }: PipelinePageProps) {
  const columns: { id: LeadStatus; label: string; icon: any; color: string; accent: string }[] = [
    { id: "NEW", label: "Discovery", icon: Zap, color: "border-blue-500/20", accent: "text-blue-400" },
    { id: "QUALIFIED", label: "Qualified", icon: CheckCircle, color: "border-emerald-500/20", accent: "text-emerald-400" },
    { id: "PITCHED", label: "Outreach", icon: TrendingUp, color: "border-orange-500/20", accent: "text-orange-500" },
    { id: "REPLIED", label: "Engaged", icon: Clock, color: "border-amber-500/20", accent: "text-amber-400" },
    { id: "MEETING_NEEDED", label: "Closing", icon: MoveRight, color: "border-purple-500/20", accent: "text-purple-400" },
    { id: "WON", label: "Converted", icon: CheckCircle, color: "border-green-500/20", accent: "text-green-400" },
  ];

  const getLeadsByStatus = (status: LeadStatus) => leads.filter(l => l.status === status);

  return (
    <div className="py-8 h-screen flex flex-col">
      <div className="mb-8">
        <h2 className="text-xs uppercase tracking-[0.2em] text-slate-500 font-bold mb-2 italic">Visual Sales Flow</h2>
        <h1 className="text-4xl font-bold tracking-tight text-white">Conversion Pipeline</h1>
      </div>

      <div className="flex-1 overflow-x-auto min-h-0">
        <div className="flex gap-6 h-full pb-8">
          {columns.map((column) => (
            <div key={column.id} className="w-80 flex flex-col bg-white/[0.02] border border-white/5 rounded-3xl backdrop-blur-sm">
              <div className="p-6 flex items-center justify-between border-b border-white/5">
                <div className="flex items-center gap-3">
                  <column.icon size={18} className={column.accent} />
                  <h3 className="font-bold text-white uppercase tracking-widest text-[10px]">{column.label}</h3>
                </div>
                <span className="bg-white/10 text-slate-400 px-2 py-0.5 rounded text-[10px] font-black">
                  {getLeadsByStatus(column.id).length}
                </span>
              </div>
              
              <div className="flex-1 p-4 space-y-4 overflow-y-auto scrollbar-hide">
                {getLeadsByStatus(column.id).map((lead) => (
                  <div 
                    key={lead.id} 
                    className={`p-5 rounded-2xl bg-white/5 border ${column.color} hover:bg-white/10 transition-all cursor-grab active:cursor-grabbing group shadow-lg`}
                  >
                    <div className="font-bold text-white group-hover:text-white transition-colors truncate text-sm uppercase tracking-tight">{lead.company}</div>
                    <div className="text-[10px] text-slate-500 font-medium mt-1">{lead.name}</div>
                    
                    {lead.aiScore && (
                      <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
                        <div className="text-[9px] uppercase font-black text-slate-600 tracking-widest">AI INTENT</div>
                        <div className={`text-[10px] font-black px-2 py-0.5 rounded tracking-tighter
                          ${lead.aiScore >= 80 ? 'bg-orange-500/20 text-orange-400' : 'bg-amber-500/20 text-amber-400'}
                        `}>
                          {lead.aiScore}%
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                {getLeadsByStatus(column.id).length === 0 && (
                  <div className="h-20 flex items-center justify-center border-2 border-dashed border-white/5 rounded-2xl">
                    <span className="text-[10px] uppercase font-bold text-slate-700 tracking-widest">Empty Stage</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
