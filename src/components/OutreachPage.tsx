import { useState } from "react";
import { Lead, Agency } from "../types";
import { Sparkles, Send, Copy, RotateCcw, Check, Mail, AlertCircle } from "lucide-react";
import { useFirebase } from "../lib/FirebaseProvider";

interface OutreachPageProps {
  leads: Lead[];
  agency: Agency | null;
  onSendEmail: (leadId: string, subject: string, content: string) => void;
}

export function OutreachPage({ leads, agency, onSendEmail }: OutreachPageProps) {
  const { accessToken, login } = useFirebase();
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [pitch, setPitch] = useState<{ subject: string; content: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const [outreachStatus, setOutreachStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: "" });

  const selectedLead = leads.find(l => l.id === selectedLeadId);

  const generatePitch = async () => {
    if (!selectedLead || !agency) return;
    setIsGenerating(true);
    setOutreachStatus({ type: null, message: "" });
    try {
      const response = await fetch("/api/ai/generate-pitch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lead: selectedLead,
          agency,
          painPoints: selectedLead.aiPainPoints || [],
          serviceAngle: selectedLead.aiServiceAngle || "General Marketing Services",
        }),
      });
      const data = await response.json();
      setPitch(data);
    } catch (error) {
      console.error("Pitch generation failed:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSend = async () => {
    if (!pitch || !selectedLead) return;
    setIsSending(true);
    setOutreachStatus({ type: null, message: "" });
    try {
      await onSendEmail(selectedLead.id, pitch.subject, pitch.content);
      setOutreachStatus({ 
        type: 'success', 
        message: accessToken 
          ? `Outreach successfully sent directly through your Gmail account!` 
          : "Outreach message successfully transmitted via internal Resend node."
      });
      setPitch(null);
    } catch (error: any) {
      console.error("Email send failed:", error);
      setOutreachStatus({ 
        type: 'error', 
        message: error.message || "Email failed to transmit. Try re-linking Gmail or using SMTP node fallback." 
      });
    } finally {
      setIsSending(false);
    }
  };

  const copyToClipboard = () => {
    if (!pitch) return;
    navigator.clipboard.writeText(`${pitch.subject}\n\n${pitch.content}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="py-8 h-[calc(100vh-100px)] flex gap-8">
      {/* Lead Selector */}
      <div className="w-80 flex flex-col h-full bg-white/[0.02] border border-white/5 rounded-3xl overflow-hidden backdrop-blur-sm shadow-2xl">
        <div className="p-6 border-b border-white/5 bg-white/[0.02]">
          <h2 className="text-[10px] uppercase tracking-widest text-slate-500 font-black flex items-center gap-2">
            <Mail size={14} className="text-orange-500" />
            Intelligence Queue
          </h2>
        </div>
        <div className="flex-1 overflow-y-auto divide-y divide-white/5">
          {leads.filter(l => l.aiScore).map((lead) => (
            <button
              key={lead.id}
              onClick={() => {
                setSelectedLeadId(lead.id);
                setPitch(null);
              }}
              className={`w-full text-left p-6 transition-all group ${
                selectedLeadId === lead.id ? "bg-orange-500/10 border-l-4 border-orange-500" : "hover:bg-white/[0.03]"
              }`}
            >
              <div className="font-bold text-white group-hover:text-orange-400 truncate uppercase tracking-tight text-sm">{lead.company}</div>
              <div className="text-[10px] text-slate-500 mt-1 uppercase font-medium">{lead.name}</div>
              <div className="mt-4 flex items-center justify-between">
                <span className={`text-[10px] font-black px-2 py-0.5 rounded tracking-tighter ${
                  lead.aiScore! >= 80 ? 'bg-orange-500 text-black' : 'bg-white/20 text-white'
                }`}>
                  {lead.aiScore}% FIT
                </span>
                <span className="text-[9px] text-slate-600 font-black uppercase tracking-widest">{lead.status}</span>
              </div>
            </button>
          ))}
          {leads.length === 0 && (
            <div className="p-12 text-center text-slate-600 text-xs italic">
              Run AI analysis on leads to populate outreach queue.
            </div>
          )}
        </div>
      </div>

      {/* Lead Intelligence Card / Pitch Workspace */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {!selectedLead ? (
          <div className="flex-1 flex flex-col items-center justify-center bg-white/[0.01] border-2 border-dashed border-white/5 rounded-3xl text-slate-600">
            <Sparkles size={64} className="mb-4 opacity-5" />
            <p className="uppercase tracking-[0.2em] text-[10px] font-black">Waiting for Data Stream</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 h-full">
            {/* Intelligence Card (2/5) */}
            <div className="lg:col-span-2 bg-gradient-to-b from-white/[0.08] to-transparent border border-white/10 rounded-3xl p-8 relative overflow-hidden flex flex-col">
              <div className="absolute top-8 right-8 flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500 border border-black/50"></span>
                </span>
                <span className="text-[10px] font-black uppercase text-orange-500 tracking-tighter shadow-orange-glow">AI Live</span>
              </div>

              <h2 className="text-[10px] uppercase tracking-[0.3em] text-slate-500 font-black mb-10 italic">Intelligence Profile</h2>

              <div className="mb-8">
                <div className="text-4xl font-bold text-white mb-2 tracking-tighter">{selectedLead.company}</div>
                <div className="flex items-center gap-2 text-slate-400 text-xs font-medium">
                  <span className="uppercase text-orange-500/80">{selectedLead.website}</span>
                  <span className="w-1 h-1 bg-slate-700 rounded-full"></span>
                  <span className="uppercase tracking-widest">{selectedLead.industry}</span>
                </div>
              </div>

              <div className="flex items-end gap-4 mb-10">
                <div className="text-7xl font-light text-orange-500 tracking-tighter leading-none">{selectedLead.aiScore}</div>
                <div className="pb-3">
                  <div className="text-[9px] font-black uppercase text-slate-600 tracking-widest mb-1">Lead Fit Index</div>
                  <div className="text-sm text-white font-bold uppercase tracking-tight">{selectedLead.aiCategory} INTENT</div>
                </div>
              </div>

              <div className="space-y-8 flex-1 overflow-y-auto pr-2 scrollbar-hide">
                <div>
                  <div className="text-[10px] font-black uppercase text-orange-500 mb-4 tracking-[0.2em]">Pain Point Mapping</div>
                  <ul className="space-y-3">
                    {selectedLead.aiPainPoints?.map((pp, i) => (
                      <li key={i} className="flex gap-4 text-sm text-slate-300 items-start">
                        <span className="text-orange-500 mt-1 font-black leading-none">•</span> 
                        <span className="leading-relaxed font-medium">{pp}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <div className="text-[10px] font-black uppercase text-orange-500 mb-4 tracking-[0.2em]">Strategic Angle</div>
                  <p className="text-sm text-slate-300 bg-white/5 border-l-2 border-orange-500 p-4 italic rounded-r-xl leading-relaxed">
                    "{selectedLead.aiServiceAngle}"
                  </p>
                </div>
              </div>

              <button
                onClick={generatePitch}
                disabled={isGenerating || !agency}
                className="mt-8 w-full bg-orange-600 hover:bg-orange-500 text-white font-black py-4 rounded-2xl shadow-[0_0_25px_rgba(234,88,12,0.4)] transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-xs"
              >
                {isGenerating ? (
                  <RotateCcw size={18} className="animate-spin" />
                ) : (
                  <Sparkles size={18} fill="currentColor" />
                )}
                {pitch ? "Regenerate Analysis" : "Synthesize Pitch"}
              </button>
            </div>

            {/* Pitch Editor (3/5) */}
            <div className="lg:col-span-3 flex flex-col h-full">
              {pitch ? (
                <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-8 h-full flex flex-col backdrop-blur-sm animate-in fade-in slide-in-from-right-4 duration-500">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em]">Personalized Outreach</h3>
                    <div className="flex gap-2">
                       <button onClick={copyToClipboard} className="p-2 bg-white/5 border border-white/10 rounded-lg text-slate-400 hover:text-white transition-colors">
                        {copied ? <Check size={18} className="text-emerald-500" /> : <Copy size={18} />}
                       </button>
                    </div>
                  </div>
                  
                  <div className="space-y-5 flex-1 flex flex-col min-h-0">
                    {/* Workspace/SMTP Status Bar */}
                    <div className="px-4 py-2 bg-white/[0.02] border border-white/5 rounded-xl flex items-center justify-between text-[10px]">
                      {accessToken ? (
                        <div className="flex items-center gap-1.5 text-emerald-400 font-extrabold tracking-wider uppercase">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                          Gmail Outbox Node Engaged
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-slate-400 font-extrabold tracking-wider uppercase">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                          SMTP Resend Node (Fallback)
                        </div>
                      )}
                      
                      {!accessToken && (
                        <button 
                          onClick={login}
                          className="text-orange-500 hover:text-orange-400 font-black tracking-widest uppercase transition-colors"
                        >
                          Connect Gmail
                        </button>
                      )}
                    </div>

                    <div className="p-4 bg-white/5 border border-white/5 rounded-xl">
                      <div className="text-[9px] font-black uppercase text-orange-500/60 mb-2">Subject</div>
                      <div className="text-white font-bold text-lg tracking-tight leading-tight">{pitch.subject}</div>
                    </div>
                    
                    <div className="flex-1 bg-white/[0.02] border border-white/5 p-6 rounded-2xl overflow-y-auto">
                      <div className="text-[9px] font-black uppercase text-orange-500/60 mb-4">Body</div>
                      <div className="text-slate-300 whitespace-pre-wrap leading-relaxed font-medium text-sm">
                        {pitch.content}
                      </div>
                    </div>

                    {/* Notification Banner */}
                    {outreachStatus.type && (
                      <div className={`p-4 rounded-xl text-xs flex items-center gap-2 ${
                        outreachStatus.type === 'success' ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' : 'bg-rose-500/10 border border-rose-500/20 text-rose-400'
                      }`}>
                        {outreachStatus.type === 'success' ? <Check size={16} /> : <AlertCircle size={16} />}
                        <span className="font-semibold leading-relaxed">{outreachStatus.message}</span>
                      </div>
                    )}

                    <button 
                      onClick={handleSend}
                      disabled={isSending}
                      className={`w-full h-14 text-white rounded-2xl transition-all font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 mt-2 ${
                        accessToken 
                        ? 'bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 shadow-[0_0_20px_rgba(16,185,129,0.3)]' 
                        : 'bg-orange-600 hover:bg-orange-500 shadow-[0_0_20px_rgba(234,88,12,0.3)]'
                      }`}
                    >
                      <Send size={18} strokeWidth={3} />
                      {isSending ? "Transmitting..." : accessToken ? "Send via Gmail API" : "Send via Resend Node"}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center bg-white/[0.01] border-2 border-dashed border-white/5 rounded-3xl text-slate-700">
                   {/* Workspace Status header even on empty state */}
                   <div className="flex items-center gap-2 text-[10px] uppercase font-black tracking-widest mb-4">
                     {accessToken ? (
                       <span className="text-emerald-500">● Gmail Outbox Node Connected</span>
                     ) : (
                       <span className="text-slate-500">● No Workspace Node Connected</span>
                     )}
                   </div>
                   <div className="text-[10px] uppercase font-black tracking-widest text-slate-500">Execute Synthesis to Begin Outreach</div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
