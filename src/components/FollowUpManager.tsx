import { useState } from "react";
import { Lead } from "../types";
import { Calendar, Clock, Send, Sparkles, AlertCircle, Check } from "lucide-react";
import { useFirebase } from "../lib/FirebaseProvider";

interface FollowUpManagerProps {
  leads: Lead[];
  onSendEmail: (leadId: string, subject: string, content: string) => Promise<void>;
}

export function FollowUpManager({ leads, onSendEmail }: FollowUpManagerProps) {
  const { accessToken, login } = useFirebase();
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [suggestedFollowup, setSuggestedFollowup] = useState<string>("");
  const [followupStatus, setFollowupStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: "" });

  const selectedLead = leads.find(l => l.id === selectedLeadId);

  // Filter leads that are PITCHED but haven't replied yet
  const followUpCandidates = leads.filter(l => l.status === 'PITCHED');

  const generateFollowup = async () => {
    if (!selectedLead) return;
    setIsGenerating(true);
    setFollowupStatus({ type: null, message: "" });
    // Simulate smart generative follow-up
    setTimeout(() => {
      setSuggestedFollowup(`Hey ${selectedLead.name.split(' ')[0]},\n\nWanted to circle back on my previous email regarding the ${selectedLead.aiServiceAngle || 'solution'} for ${selectedLead.company}. \n\nI noticed you're likely dealing with ${selectedLead.aiPainPoints?.[0] || 'efficiency challenges'} and I'm confident we can help streamline that. \n\nWorth a quick 5-min sync on Thursday?\n\nBest,\nLeadFlow Team`);
      setIsGenerating(false);
    }, 1500);
  };

  const handleCommitSequence = async () => {
    if (!selectedLead || !suggestedFollowup) return;
    setIsSending(true);
    setFollowupStatus({ type: null, message: "" });
    try {
      const subject = `Re: Strategic solutions for ${selectedLead.company}`;
      await onSendEmail(selectedLead.id, subject, suggestedFollowup);
      setFollowupStatus({
        type: 'success',
        message: accessToken
          ? "Follow-up successfully delivered directly to prospect mailbox via Gmail Node!"
          : "Follow-up successfully scheduled and dispatched via Resend node."
      });
      setSuggestedFollowup("");
    } catch (err: any) {
      console.error(err);
      setFollowupStatus({
        type: 'error',
        message: err.message || "Sequence commit failed. Check logs and try again."
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="py-8 h-[calc(100vh-100px)] flex flex-col">
      <div className="mb-8">
        <h2 className="text-xs uppercase tracking-[0.2em] text-slate-500 font-bold mb-2 italic">Sequence Automation</h2>
        <h1 className="text-4xl font-bold tracking-tight text-white">Follow-Up Scheduler</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1 min-h-0 overflow-hidden">
        {/* Candidates List */}
        <div className="bg-white/[0.02] border border-white/5 rounded-3xl backdrop-blur-sm shadow-2xl flex flex-col overflow-hidden">
          <div className="p-6 border-b border-white/5 bg-white/[0.02] font-black text-[10px] uppercase tracking-widest text-slate-500 flex items-center gap-2">
            <Clock size={14} className="text-orange-500" />
            Static Response Stream
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-white/5">
            {followUpCandidates.map(lead => (
              <button
                key={lead.id}
                onClick={() => {
                  setSelectedLeadId(lead.id);
                  setSuggestedFollowup("");
                }}
                className={`w-full text-left p-6 transition-all group ${
                  selectedLeadId === lead.id ? "bg-orange-500/10 border-l-4 border-orange-500" : "hover:bg-white/[0.03]"
                }`}
              >
                <div className="font-bold text-white group-hover:text-orange-400 truncate uppercase tracking-tight text-sm">{lead.company}</div>
                <div className="text-[9px] text-slate-500 flex items-center gap-2 mt-2 uppercase font-black tracking-widest">
                  <Calendar size={12} className="text-slate-600" />
                  Stale: 3.4 Days
                </div>
              </button>
            ))}
            {followUpCandidates.length === 0 && (
              <div className="p-12 text-center text-slate-600 text-xs italic">
                Equilibrium reached. No active follow-ups required.
              </div>
            )}
          </div>
        </div>

        {/* Follow-up Workspace */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          {!selectedLead ? (
            <div className="flex-1 flex flex-col items-center justify-center bg-white/[0.01] border-2 border-dashed border-white/5 rounded-3xl text-slate-700">
              <AlertCircle size={64} className="mb-4 opacity-5" />
              <p className="text-[10px] uppercase font-black tracking-widest">Target Selection Required</p>
            </div>
          ) : (
            <>
              <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 backdrop-blur-sm shadow-2xl">
                <div className="flex justify-between items-center mb-10">
                  <h3 className="font-bold text-white uppercase tracking-tighter text-xl">Pulse Check: {selectedLead.company}</h3>
                  <button
                    onClick={generateFollowup}
                    disabled={isGenerating}
                    className="flex items-center gap-3 px-6 py-3 bg-orange-600 text-white rounded-2xl hover:bg-orange-500 transition-all font-black uppercase text-[10px] tracking-widest shadow-[0_0_20px_rgba(234,88,12,0.3)]"
                  >
                    {isGenerating ? <Clock className="animate-spin" size={16} /> : <Sparkles size={16} fill="currentColor" />}
                    Synthesize Follow-Up #1
                  </button>
                </div>
                
                {/* Delivery Node indicator */}
                <div className="mt-4 px-4 py-2 bg-white/[0.02] border border-white/5 rounded-xl flex items-center justify-between text-[10px] text-slate-400">
                  {accessToken ? (
                    <div className="flex items-center gap-1.5 text-emerald-400 font-extrabold tracking-wider uppercase">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      Gmail Pipeline engaged
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 font-extrabold tracking-wider uppercase">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                      Fallback SMTP Node
                    </div>
                  )}
                  {!accessToken && (
                    <button onClick={login} className="text-orange-500 hover:text-orange-400 font-black tracking-widest uppercase transition-colors">
                      Link Gmail Outbox
                    </button>
                  )}
                </div>

                {suggestedFollowup && (
                  <div className="space-y-6 mt-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="p-8 bg-white/5 border border-white/5 rounded-2xl font-mono text-sm whitespace-pre-wrap text-slate-300 leading-relaxed border-l-4 border-orange-500">
                      {suggestedFollowup}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <select className="bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-300 outline-none focus:ring-2 focus:ring-orange-500">
                        <option className="bg-[#050505]">T + 48 Hours</option>
                        <option className="bg-[#050505]">T + 120 Hours</option>
                        <option className="bg-[#050505]">Immediate Pulse</option>
                      </select>
                      <button 
                        onClick={handleCommitSequence}
                        disabled={isSending}
                        className={`flex items-center justify-center gap-3 px-6 py-4 text-white rounded-xl transition-all font-black uppercase tracking-widest text-[10px] ${
                          accessToken
                            ? "bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                            : "bg-emerald-600 hover:bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                        }`}
                      >
                        <Send size={16} strokeWidth={3} />
                        {isSending ? "Transmitting..." : "Commit Sequence"}
                      </button>
                    </div>
                  </div>
                )}

                {/* Status banner */}
                {followupStatus.type && (
                  <div className={`mt-6 p-4 rounded-xl text-xs flex items-center gap-2 ${
                    followupStatus.type === 'success' ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' : 'bg-rose-500/10 border border-rose-500/20 text-rose-400'
                  }`}>
                    {followupStatus.type === 'success' ? <Check size={16} /> : <AlertCircle size={16} />}
                    <span className="font-semibold leading-relaxed">{followupStatus.message}</span>
                  </div>
                )}
              </div>

              <div className="bg-gradient-to-br from-white/[0.05] to-transparent border border-white/10 p-10 rounded-3xl shadow-2xl flex-1 backdrop-blur-md">
                <h3 className="text-[10px] font-black uppercase text-slate-500 tracking-[0.3em] mb-10 italic">Sequence Trajectory</h3>
                <div className="space-y-10 relative">
                  <div className="absolute left-[15px] top-4 bottom-4 w-px bg-white/10"></div>
                  
                  <div className="flex items-center gap-6 text-sm opacity-30 grayscale transition-all hover:grayscale-0">
                    <div className="w-8 h-8 rounded-full bg-white/10 border border-white/10 flex items-center justify-center font-black text-[10px] z-10 shrink-0">01</div>
                    <div className="flex-1 font-bold text-slate-400 uppercase tracking-widest">Initial Outreach Matrix</div>
                    <div className="text-emerald-500 font-black uppercase text-[10px] tracking-widest">Executed</div>
                  </div>
                  
                  <div className="flex items-center gap-6 text-sm group">
                    <div className="w-8 h-8 rounded-full bg-orange-600 text-white flex items-center justify-center font-black text-[10px] shadow-orange-glow z-10 shrink-0">02</div>
                    <div className="flex-1 font-bold text-white uppercase tracking-tighter text-lg">Follow-up #1 (Value Insertion)</div>
                    <div className="text-orange-500 font-black uppercase text-[10px] tracking-widest animate-pulse">Pending Commit</div>
                  </div>
                  
                  <div className="flex items-center gap-6 text-sm opacity-20 transition-all hover:opacity-50">
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center font-black text-[10px] z-10 shrink-0">03</div>
                    <div className="flex-1 font-bold text-slate-500 uppercase tracking-widest">Follow-up #2 (Status Inquiry)</div>
                    <div className="text-slate-600 font-black uppercase text-[10px] tracking-widest">Future Stage</div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
