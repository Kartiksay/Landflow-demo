import { useState } from "react";
import { Lead, Agency } from "../types";
import { MessageSquare, Bot, ArrowRight, BrainCircuit, CheckCircle2 } from "lucide-react";

interface ReplyIntelligenceProps {
  leads: Lead[];
  agency: Agency | null;
  onUpdateLeadStatus: (leadId: string, status: any) => void;
}

export function ReplyIntelligence({ leads, agency, onUpdateLeadStatus }: ReplyIntelligenceProps) {
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);

  const selectedLead = leads.find(l => l.id === selectedLeadId);

  const handleAnalyze = async () => {
    if (!selectedLead || !replyText || !agency) return;
    setIsAnalyzing(true);
    try {
      const response = await fetch("/api/ai/analyze-reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reply: replyText,
          lead: selectedLead,
          agency,
        }),
      });
      const data = await response.json();
      setAnalysis(data);
    } catch (error) {
      console.error("Reply analysis failed:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleMoveToMeeting = () => {
    if (selectedLeadId) {
      onUpdateLeadStatus(selectedLeadId, "MEETING_NEEDED");
      setAnalysis(null);
      setReplyText("");
      setSelectedLeadId(null);
    }
  };

  return (
    <div className="py-8 h-[calc(100vh-100px)] flex gap-8">
      <div className="w-80 flex flex-col h-full bg-white/[0.02] border border-white/5 rounded-3xl overflow-hidden backdrop-blur-sm shadow-2xl">
        <div className="p-6 border-b border-white/5 bg-white/[0.02]">
          <h2 className="text-[10px] uppercase tracking-widest text-slate-500 font-black flex items-center gap-2">
            <MessageSquare size={14} className="text-orange-500" />
            Ingested Replies
          </h2>
        </div>
        <div className="flex-1 overflow-y-auto divide-y divide-white/5">
          {leads.filter(l => l.status === 'PITCHED' || l.status === 'REPLIED').map((lead) => (
            <button
              key={lead.id}
              onClick={() => {
                setSelectedLeadId(lead.id);
                setAnalysis(null);
                setReplyText("");
              }}
              className={`w-full text-left p-6 transition-all group ${
                selectedLeadId === lead.id ? "bg-orange-500/10 border-l-4 border-orange-500" : "hover:bg-white/[0.03]"
              }`}
            >
              <div className="font-bold text-white group-hover:text-orange-400 truncate uppercase tracking-tight text-sm">{lead.company}</div>
              <div className="text-[10px] text-slate-500 mt-1 uppercase font-medium">{lead.name}</div>
              <div className="mt-4 text-[9px] text-slate-600 font-black uppercase tracking-widest">{lead.status}</div>
            </button>
          ))}
          {leads.filter(l => l.status === 'PITCHED' || l.status === 'REPLIED').length === 0 && (
            <div className="p-12 text-center text-slate-600 text-xs italic">
              No active pitches detected in the current stream.
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        {!selectedLead ? (
          <div className="flex-1 flex flex-col items-center justify-center bg-white/[0.01] border-2 border-dashed border-white/5 rounded-3xl text-slate-600">
            <BrainCircuit size={64} className="mb-4 opacity-5" />
            <h3 className="uppercase tracking-[0.2em] text-[10px] font-black">Waiting for Data Stream</h3>
          </div>
        ) : (
          <div className="bg-white/[0.02] border border-white/5 rounded-3xl flex flex-col h-full overflow-hidden backdrop-blur-sm shadow-2xl">
            <div className="p-8 border-b border-white/5">
              <h2 className="text-xs uppercase tracking-[0.2em] text-slate-500 font-bold mb-2 italic">Reply Analysis Core</h2>
              <h1 className="text-3xl font-bold tracking-tight text-white">{selectedLead.company}</h1>
            </div>
            
            <div className="flex-1 p-8 overflow-y-auto bg-transparent">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
                <div className="space-y-6 flex flex-col">
                  <div>
                    <label className="text-[10px] uppercase tracking-widest font-black text-slate-500 block mb-4">Paste Signal Content</label>
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Paste the prospect's email response here..."
                      className="w-full h-80 px-6 py-6 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-slate-700 focus:ring-2 focus:ring-orange-500/50 outline-none transition-all resize-none font-mono text-sm leading-relaxed"
                    />
                  </div>
                  <button
                    onClick={handleAnalyze}
                    disabled={isAnalyzing || !replyText}
                    className="w-full h-14 bg-orange-600 hover:bg-orange-500 text-white rounded-2xl transition-all font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(234,88,12,0.3)]"
                  >
                    {isAnalyzing ? (
                      <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    ) : (
                      <Bot size={18} strokeWidth={3} />
                    )}
                    Run Intent Extraction
                  </button>
                </div>

                <div className="flex flex-col">
                  <div className="flex-1 bg-white/[0.05] border border-white/10 rounded-2xl p-8 flex flex-col shadow-inner backdrop-blur-xl relative overflow-hidden group">
                    <div className="absolute top-8 right-8 flex items-center gap-2">
                       <span className="relative flex h-2 w-2">
                         <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                         <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
                       </span>
                    </div>
                    {analysis ? (
                      <div className="space-y-8 flex-1 animate-in fade-in slide-in-from-right-4 duration-500">
                        <div>
                          <h4 className="text-[10px] uppercase font-black text-orange-500 mb-4 tracking-[0.2em]">Extracted Requirements</h4>
                          <ul className="space-y-3">
                            {analysis.requirements.map((r: string, i: number) => (
                              <li key={i} className="text-sm text-slate-300 flex items-start gap-4">
                                <span className="text-orange-500 font-black">•</span> {r}
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-6">
                          <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                            <h4 className="text-[9px] uppercase font-black text-slate-600 tracking-widest mb-1">Budget Target</h4>
                            <p className="text-sm text-white font-bold uppercase tracking-tight">{analysis.budget || "None Mentioned"}</p>
                          </div>
                          <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                            <h4 className="text-[9px] uppercase font-black text-slate-600 tracking-widest mb-1">Timeline Signal</h4>
                            <p className="text-sm text-white font-bold uppercase tracking-tight">{analysis.timeline || "None Mentioned"}</p>
                          </div>
                        </div>

                        <div>
                          <h4 className="text-[10px] uppercase font-black text-orange-500 mb-4 tracking-[0.2em]">Active Objections</h4>
                          <div className="flex flex-wrap gap-2">
                            {analysis.objections.map((o: string, i: number) => (
                              <span key={i} className="bg-rose-500/10 text-rose-400 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase border border-rose-500/20 tracking-tighter">
                                {o}
                              </span>
                            ))}
                            {analysis.objections.length === 0 && <span className="text-slate-600 text-xs italic">Clear path: No objections detected</span>}
                          </div>
                        </div>

                        <div className="bg-orange-500/10 p-6 rounded-2xl border border-orange-500/20 shadow-[0_0_15px_rgba(234,88,12,0.1)]">
                          <h4 className="text-[10px] uppercase font-black text-orange-500 mb-2 tracking-widest">AI Strategic Maneuver</h4>
                          <p className="text-sm text-white font-bold leading-relaxed">{analysis.nextAction}</p>
                        </div>

                        <div className="pt-6 mt-auto border-t border-white/5">
                          <button 
                            onClick={handleMoveToMeeting}
                            className="w-full h-12 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl transition-all font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                          >
                            <CheckCircle2 size={16} strokeWidth={3} />
                            Commit to Pipeline Stage: Closing
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center text-slate-700">
                        <ArrowRight size={64} className="mb-4 opacity-5" />
                        <p className="text-[10px] uppercase font-bold tracking-widest">Analysis Matrix Awaiting Input</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
