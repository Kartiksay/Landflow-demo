import { Lead } from "../types";
import { Zap, Mail, TrendingUp, Users, Target, Award, ShieldCheck, Activity, Brain, Clock } from "lucide-react";
import { StatusDistributionChart } from "./StatusDistributionChart";

interface DashboardProps {
  leads: Lead[];
  onSeedData: () => void;
}

export function Dashboard({ leads, onSeedData }: DashboardProps) {
  const totalLeads = leads.length;
  const hotLeads = leads.filter(l => l.aiCategory === 'HOT').length;
  const pitched = leads.filter(l => l.status === 'PITCHED').length;
  const meetings = leads.filter(l => l.status === 'MEETING_NEEDED').length;

  // Compute Pipeline Health Stats
  const wonCount = leads.filter(l => l.status === 'WON').length;
  const lostCount = leads.filter(l => l.status === 'LOST').length;
  
  const analyzedLeads = leads.filter(l => l.aiScore !== undefined && l.aiScore !== null);
  const avgAiScore = analyzedLeads.length > 0 
    ? Math.round(analyzedLeads.reduce((acc, l) => acc + (l.aiScore || 0), 0) / analyzedLeads.length)
    : 0;

  const aiCoveragePct = totalLeads > 0
    ? Math.round((analyzedLeads.length / totalLeads) * 100)
    : 0;

  const closeConversionRate = (wonCount + lostCount) > 0
    ? Math.round((wonCount / (wonCount + lostCount)) * 100)
    : 0;

  const activeOutreachCount = leads.filter(l => ["PITCHED", "REPLIED"].includes(l.status)).length;

  // Compute average transition time from NEW to QUALIFIED status based on timestamps
  const qualifiedLeadsForMetric = leads.filter(l => 
    l.qualifiedAt || (l.status === 'QUALIFIED' && l.updatedAt)
  );

  let totalSeconds = 0;
  let qualifiedWithTimeCount = 0;

  qualifiedLeadsForMetric.forEach(l => {
    const startObj = new Date(l.createdAt);
    const endObj = new Date(l.qualifiedAt || l.updatedAt);
    const startMs = startObj.getTime();
    const endMs = endObj.getTime();
    
    if (!isNaN(startMs) && !isNaN(endMs) && endMs >= startMs) {
      totalSeconds += (endMs - startMs) / 1000;
      qualifiedWithTimeCount++;
    }
  });

  const avgSecondsToQualify = qualifiedWithTimeCount > 0 ? (totalSeconds / qualifiedWithTimeCount) : 0;
  const avgDaysToQualify = avgSecondsToQualify / (24 * 3600);

  const formatTransitionTime = (days: number) => {
    if (qualifiedWithTimeCount === 0 || days === 0) return "Awaiting Sync";
    if (days < 1 / (24 * 60)) {
      const secs = Math.round(days * 24 * 3600);
      return secs <= 1 ? "Instant (<1s)" : `${secs}s`;
    }
    if (days < 1 / 24) {
      const mins = Math.round(days * 24 * 60);
      return mins === 1 ? "1m" : `${mins}m`;
    }
    if (days < 1) {
      const hrs = (days * 24).toFixed(1);
      return `${hrs} hrs`;
    }
    return days === 1 ? "1.0 day" : `${days.toFixed(1)} days`;
  };

  const avgQualifyTimeDisplay = formatTransitionTime(avgDaysToQualify);

  const stats = [
    { label: "Total Leads", value: totalLeads, icon: Users, color: "text-blue-400" },
    { label: "Hot Leads (AI)", value: hotLeads, icon: Zap, color: "text-orange-500" },
    { label: "Pitches Sent", value: pitched, icon: Mail, color: "text-indigo-400" },
    { label: "Meetings Earned", value: meetings, icon: Target, color: "text-purple-400" },
  ];

  return (
    <div className="py-8 space-y-8">
      {/* Dashboard Top Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xs uppercase tracking-[0.2em] text-slate-500 font-bold mb-2 italic">Performance Dashboard</h2>
          <h1 className="text-4xl font-bold tracking-tight text-white">Agency Intelligence</h1>
        </div>
        <button 
          onClick={onSeedData}
          className="flex items-center gap-2 px-4 py-2 text-[10px] font-black uppercase bg-white/5 border border-white/10 text-white rounded-full hover:bg-white/10 transition-all shadow-lg"
        >
          <Zap size={12} className="text-orange-500" fill="currentColor" />
          Seed Demo Data
        </button>
      </div>

      {/* Stats Summary Panel */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 backdrop-blur-sm relative overflow-hidden group transition-all hover:bg-white/[0.06]">
            {stat.label.includes('Hot') && (
              <div className="absolute inset-0 bg-orange-500/5 opacity-50"></div>
            )}
            <div className="text-[10px] uppercase tracking-widest text-slate-500 mb-1 font-bold">{stat.label}</div>
            <div className={`text-4xl font-light tracking-tighter ${stat.color}`}>{stat.value}</div>
            <div className="text-[10px] text-emerald-500 mt-2 font-bold flex items-center gap-1">
              <TrendingUp size={12} />
              +12% vs last month
            </div>
          </div>
        ))}
      </div>

      {/* Row 2: Conversion Funnel & Latest Hot Leads */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white/[0.02] border border-white/5 rounded-3xl p-8 backdrop-blur-md">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-slate-400">Conversion Funnel</h3>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-orange-500"></span>
              <span className="text-[10px] font-bold text-slate-500">Live Updates</span>
            </div>
          </div>
          <div className="space-y-6">
            <FunnelStep label="Discovery Leads" count={totalLeads} percent={100} color="from-blue-600 to-blue-400" />
            <FunnelStep label="AI Qualified" count={leads.filter(l => l.aiScore && l.aiScore > 70).length} percent={75} color="from-emerald-600 to-emerald-400" />
            <FunnelStep label="Strategic Pitches" count={pitched} percent={45} color="from-orange-600 to-orange-400" />
            <FunnelStep label="Meeting Earned" count={meetings} percent={15} color="from-purple-600 to-purple-400" />
          </div>
        </div>

        <div className="bg-gradient-to-b from-white/[0.08] to-transparent border border-white/10 rounded-3xl p-8 relative overflow-hidden">
          <div className="absolute top-8 right-8 flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
            </span>
          </div>
          <h3 className="text-sm font-semibold uppercase tracking-widest text-slate-400 mb-8">Latest Hot Leads</h3>
          <div className="space-y-4 font-sans">
            {leads.filter(l => l.aiCategory === 'HOT').slice(0, 5).map((lead) => (
              <div key={lead.id} className="p-4 bg-white/[0.05] border border-white/5 rounded-2xl flex items-center justify-between hover:bg-white/[0.1] transition-colors cursor-pointer group">
                <div>
                  <div className="font-bold text-white group-hover:text-orange-400 transition-colors uppercase tracking-tight text-sm">{lead.company}</div>
                  <div className="text-[10px] text-slate-500 font-medium">{lead.name}</div>
                </div>
                <div className="text-xl font-light text-orange-500 tracking-tighter">
                  {lead.aiScore}<span className="text-[10px] text-slate-600"> pts</span>
                </div>
              </div>
            ))}
            {hotLeads === 0 && (
              <div className="py-12 text-center text-slate-500 text-xs italic">
                Awaiting first AI lead qualification...
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Row 3: Status Pipeline Matrix & Pipeline Health Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <StatusDistributionChart leads={leads} />
        </div>
        
        {/* Pipeline Health KPI Card */}
        <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 backdrop-blur-md flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-widest text-slate-400 mb-6">Pipeline Health Summary</h3>
            
            <div className="space-y-6">
              {/* Average AI Fit */}
              <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 shrink-0">
                  <Brain size={18} />
                </div>
                <div>
                  <span className="text-[9px] uppercase tracking-wider text-slate-500 font-bold">Average AI Intent Fit</span>
                  <div className="text-2xl font-light text-white mt-0.5">
                    {avgAiScore}<span className="text-xs text-slate-500">/100</span>
                  </div>
                </div>
              </div>

              {/* Cognitive AI Scan Index */}
              <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
                  <Activity size={18} />
                </div>
                <div>
                  <span className="text-[9px] uppercase tracking-wider text-slate-500 font-bold">Cognitive Lead Coverage</span>
                  <div className="text-2xl font-light text-white mt-0.5">
                    {aiCoveragePct}%
                  </div>
                </div>
              </div>

              {/* Won Close Rate */}
              <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <span className="text-[9px] uppercase tracking-wider text-slate-500 font-bold">Closed-Won Conversion</span>
                  <div className="text-2xl font-light text-white mt-0.5">
                    {closeConversionRate}%
                  </div>
                </div>
              </div>

              {/* Sequence Activity */}
              <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-fuchsia-500/10 border border-fuchsia-500/20 flex items-center justify-center text-fuchsia-400 shrink-0">
                  <Award size={18} />
                </div>
                <div>
                  <span className="text-[9px] uppercase tracking-wider text-slate-500 font-bold">In-Transit Outboxes</span>
                  <div className="text-2xl font-light text-white mt-0.5">
                    {activeOutreachCount} <span className="text-xs text-slate-500">Leads</span>
                  </div>
                </div>
              </div>

              {/* Avg Days / Time to Qualify */}
              <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl flex items-center gap-4 hover:bg-white/[0.04] transition-colors group">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0 transition-colors">
                  <Clock size={18} />
                </div>
                <div>
                  <span className="text-[9px] uppercase tracking-wider text-slate-500 font-bold">Avg Time matching 'NEW' → 'QUALIFIED'</span>
                  <div className="text-2xl font-light text-white mt-0.5 flex items-baseline gap-2">
                    {avgQualifyTimeDisplay}
                    {qualifiedWithTimeCount > 0 && (
                      <span className="text-[10px] text-slate-500 font-mono">
                        (n={qualifiedWithTimeCount})
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-500 uppercase tracking-widest font-black italic">
            <span>Systems Online</span>
            <span className="text-emerald-500">● Live Feed</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function FunnelStep({ label, count, percent, color }: { label: string, count: number, percent: number, color: string }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-xs">
        <span className="font-bold tracking-widest text-slate-400 uppercase">{label}</span>
        <span className="text-white font-mono font-bold text-lg">{count}</span>
      </div>
      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
        <div 
          className={`h-full bg-gradient-to-r ${color} rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(234,88,12,0.2)]`} 
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
