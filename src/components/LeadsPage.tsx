import { useState, FormEvent } from "react";
import { Lead } from "../types";
import { 
  Plus, Upload, Search, Filter, ExternalLink, Zap, 
  FileSpreadsheet, Download, RefreshCw, X, AlertCircle, Check 
} from "lucide-react";
import Papa from "papaparse";
import { useDropzone } from "react-dropzone";
import { useFirebase } from "../lib/FirebaseProvider";
import { exportLeadsToSheets, importLeadsFromSheets } from "../lib/googleWorkspace";

interface LeadsPageProps {
  leads: Lead[];
  onAddLead: (lead: Partial<Lead>) => void;
  onImportLeads: (leads: Partial<Lead>[]) => void;
  onAnalyze: (leadId: string) => void;
}

export function LeadsPage({ leads, onAddLead, onImportLeads, onAnalyze }: LeadsPageProps) {
  const { accessToken, login } = useFirebase();
  const [searchTerm, setSearchTerm] = useState("");

  // Prospect Manual Addition states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newCompany, setNewCompany] = useState("");
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newWebsite, setNewWebsite] = useState("");
  const [newIndustry, setNewIndustry] = useState("");

  // Google Sheets integration states
  const [isSheetsModalOpen, setIsSheetsModalOpen] = useState(false);
  const [sheetsUrlInput, setSheetsUrlInput] = useState("");
  const [sheetsRange, setSheetsRange] = useState("Sheet1!A1:H200");
  const [sheetsStatus, setSheetsStatus] = useState<{ type: 'success' | 'error' | 'loading' | null; message: string }>({ type: null, message: "" });
  const [generatedSheetUrl, setGeneratedSheetUrl] = useState<string | null>(null);

  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const parsedLeads = results.data.map((row: any) => ({
          name: row.Name || row.name || "",
          company: row.Company || row.company || "",
          email: row.Email || row.email || "",
          website: row.Website || row.website || "",
          industry: row.Industry || row.industry || "",
          status: "NEW" as const,
        }));
        onImportLeads(parsedLeads);
      },
    });
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { "text/csv": [".csv"] },
    multiple: false,
  } as any);

  const handleManualAddSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!newCompany || !newName || !newEmail) {
      alert("Please fill in Company, Contact Name, and Email");
      return;
    }
    onAddLead({
      company: newCompany,
      name: newName,
      email: newEmail,
      website: newWebsite,
      industry: newIndustry || "Other",
      status: "NEW"
    });
    // Reset Form
    setNewCompany("");
    setNewName("");
    setNewEmail("");
    setNewWebsite("");
    setNewIndustry("");
    setIsAddModalOpen(false);
  };

  const handleExportToSheets = async () => {
    if (!accessToken) {
      setSheetsStatus({ type: 'error', message: "OAuth Authorization is required to connect to Google Sheets." });
      return;
    }
    setSheetsStatus({ type: 'loading', message: "Generating premium Google Sheet document..." });
    setGeneratedSheetUrl(null);
    try {
      const { spreadsheetUrl } = await exportLeadsToSheets(accessToken, `LeadFlow AI Leads Registry - ${new Date().toLocaleDateString()}`, leads);
      setSheetsStatus({ type: 'success', message: "Spreadsheet generated perfectly." });
      setGeneratedSheetUrl(spreadsheetUrl);
    } catch (err: any) {
      console.error(err);
      setSheetsStatus({ type: 'error', message: err.message || "Failed to generate Google Sheet." });
    }
  };

  const handleImportFromSheets = async (e: FormEvent) => {
    e.preventDefault();
    if (!accessToken) {
      setSheetsStatus({ type: 'error', message: "OAuth Authorization is required to read Google Sheets." });
      return;
    }
    if (!sheetsUrlInput) {
      setSheetsStatus({ type: 'error', message: "Please enter a valid Google Sheets URL or Spreadsheet ID." });
      return;
    }
    setSheetsStatus({ type: 'loading', message: "Accessing Google Sheets node & extracting records..." });
    try {
      const imported = await importLeadsFromSheets(accessToken, sheetsUrlInput, sheetsRange);
      onImportLeads(imported);
      setSheetsStatus({ type: 'success', message: `Successfully pulled ${imported.length} prospect records into the Registry!` });
      setSheetsUrlInput("");
    } catch (err: any) {
      console.error(err);
      setSheetsStatus({ type: 'error', message: err.message || "Failed to fetch spreadsheet. Make sure sharing is set appropriately." });
    }
  };

  const handleExportToCSV = () => {
    if (leads.length === 0) {
      alert("No leads available to export.");
      return;
    }
    
    const exportData = leads.map((lead) => ({
      ID: lead.id || "",
      Company: lead.company || "",
      Name: lead.name || "",
      Email: lead.email || "",
      Website: lead.website || "",
      Industry: lead.industry || "",
      Status: lead.status || "",
      "AI Score": lead.aiScore !== undefined ? lead.aiScore : "",
      "AI Category": lead.aiCategory || "",
      "AI Reasoning": lead.aiReasoning || "",
      "AI Service Angle": lead.aiServiceAngle || "",
      "AI Pain Points": lead.aiPainPoints ? lead.aiPainPoints.join("; ") : "",
      "Created At": lead.createdAt || "",
      "Updated At": lead.updatedAt || "",
      "Qualified At": lead.qualifiedAt || ""
    }));

    const csv = Papa.unparse(exportData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `LeadFlow_AI_Prospects_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredLeads = leads.filter(l => 
    l.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    l.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="py-8 relative">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
        <div>
          <h2 className="text-xs uppercase tracking-[0.2em] text-slate-500 font-bold mb-2 italic">Lead Management</h2>
          <h1 className="text-4xl font-bold tracking-tight text-white">Prospect Registry</h1>
        </div>
        <div className="flex flex-wrap gap-3">
          <button 
            onClick={() => setIsSheetsModalOpen(true)}
            className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-emerald-600 to-teal-500 text-white rounded-full hover:from-emerald-500 hover:to-teal-400 transition-all font-bold text-xs uppercase shadow-[0_0_15px_rgba(16,185,129,0.3)]"
          >
            <FileSpreadsheet size={14} />
            Google Sheets Sync
          </button>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-6 py-2 bg-orange-600 text-white rounded-full hover:bg-orange-500 transition-all font-bold text-xs uppercase shadow-[0_0_15px_rgba(234,88,12,0.3)]"
          >
            <Plus size={14} strokeWidth={3} />
            New Prospect
          </button>
          <div {...getRootProps()} className="cursor-pointer">
            <input {...getInputProps()} />
            <button className="flex items-center gap-2 px-6 py-2 bg-white/5 border border-white/10 text-slate-300 rounded-full hover:bg-white/10 transition-all font-bold text-xs uppercase">
              <Upload size={14} />
              Import CSV
            </button>
          </div>
          <button 
            onClick={handleExportToCSV}
            className="flex items-center gap-2 px-6 py-2 bg-white/5 border border-white/10 text-slate-300 rounded-full hover:bg-white/10 hover:text-white transition-all font-bold text-xs uppercase"
            title="Export all leads to a local CSV file"
          >
            <Download size={14} />
            Export to CSV
          </button>
        </div>
      </div>

      {/* Main Table Grid */}
      <div className="bg-white/[0.02] border border-white/5 rounded-3xl overflow-hidden backdrop-blur-md shadow-2xl">
        <div className="p-6 border-b border-white/5 flex gap-4 bg-white/[0.02]">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input
              type="text"
              placeholder="Query lead intelligence database..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-slate-600 focus:ring-2 focus:ring-orange-500/50 outline-none transition-all"
            />
          </div>
          <button className="flex items-center gap-2 px-6 py-3 border border-white/10 text-slate-400 rounded-2xl hover:bg-white/5 transition-all text-xs font-bold uppercase tracking-widest">
            <Filter size={16} />
            Refine
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/[0.01] text-slate-500 text-[10px] uppercase tracking-[0.2em] font-black border-b border-white/5">
                <th className="px-8 py-6">Lead Metadata</th>
                <th className="px-8 py-6">Sector</th>
                <th className="px-8 py-6">Funnel Status</th>
                <th className="px-8 py-6">AI Fit Score</th>
                <th className="px-8 py-6 text-right">Utility</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-white/[0.03] transition-colors group">
                  <td className="px-8 py-5">
                    <div className="font-bold text-white group-hover:text-orange-400 transition-colors">{lead.company}</div>
                    <div className="text-[11px] text-slate-500 font-medium tracking-tight uppercase mt-1">{lead.name} • {lead.email}</div>
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-xs text-slate-400 bg-white/5 px-2 py-1 rounded border border-white/5">
                      {lead.industry}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded
                      ${lead.status === 'NEW' ? 'text-blue-400 bg-blue-500/10' : ''}
                      ${lead.status === 'QUALIFIED' ? 'text-emerald-400 bg-emerald-500/10' : ''}
                      ${lead.status === 'PITCHED' ? 'text-orange-400 bg-orange-500/10' : ''}
                      ${lead.status === 'REPLIED' ? 'text-amber-400 bg-amber-500/10' : ''}
                    `}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    {lead.aiScore ? (
                      <div className="flex items-center gap-3">
                        <div className={`text-2xl font-light tracking-tighter
                          ${lead.aiScore >= 80 ? 'text-orange-500' : lead.aiScore >= 50 ? 'text-amber-400' : 'text-slate-500'}
                        `}>
                          {lead.aiScore}<span className="text-[10px] text-slate-600 tracking-normal font-normal">/100</span>
                        </div>
                        <div className="text-[9px] font-black uppercase bg-white/10 px-1.5 py-0.5 rounded text-slate-400">
                          {lead.aiCategory}
                        </div>
                      </div>
                    ) : (
                      <button 
                        onClick={() => onAnalyze(lead.id)}
                        className="flex items-center gap-1.5 text-[10px] font-black uppercase text-orange-500 hover:text-orange-400 transition-all tracking-widest"
                      >
                        <Zap size={12} fill="currentColor" className="animate-pulse" />
                        Run Intelligence
                      </button>
                    )}
                  </td>
                  <td className="px-8 py-5 text-right">
                    {lead.website && (
                      <a 
                        href={lead.website.startsWith('http') ? lead.website : `https://${lead.website}`} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="p-2 text-slate-600 hover:text-white transition-colors inline-block"
                      >
                        <ExternalLink size={18} />
                      </a>
                    )}
                  </td>
                </tr>
              ))}
              {filteredLeads.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-8 py-24 text-center">
                    <div className="text-slate-600 uppercase tracking-[0.2em] text-xs font-bold mb-2">No Data Signals Detected</div>
                    <p className="text-slate-500 text-sm font-medium">Upload a CSV, sync Google Sheets, or manually add a lead to begin intake.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manual Add Lead Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#0b0b0b] border border-white/10 w-full max-w-xl rounded-2xl overflow-hidden shadow-2xl relative">
            <button 
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-6 right-6 text-slate-500 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
            <div className="p-8">
              <h2 className="text-xs uppercase tracking-[0.3em] text-orange-500 font-bold mb-2 italic">Manual Addition</h2>
              <h1 className="text-2xl font-bold text-white mb-6">Create Prospect Record</h1>
              
              <form onSubmit={handleManualAddSubmit} className="space-y-5">
                <div>
                  <label className="text-[10px] uppercase tracking-widest font-black text-slate-500 block mb-2">Company Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Miller Coffee Roasters"
                    value={newCompany}
                    onChange={(e) => setNewCompany(e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-slate-700 focus:ring-2 focus:ring-orange-500/50 outline-none transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] uppercase tracking-widest font-black text-slate-500 block mb-2">Contact Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="John Miller"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-slate-700 focus:ring-2 focus:ring-orange-500/50 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-widest font-black text-slate-500 block mb-2">Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="john@millercoffee.com"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-slate-700 focus:ring-2 focus:ring-orange-500/50 outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] uppercase tracking-widest font-black text-slate-500 block mb-2">Web Domain</label>
                    <input
                      type="text"
                      placeholder="millercoffee.com"
                      value={newWebsite}
                      onChange={(e) => setNewWebsite(e.target.value)}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-slate-700 focus:ring-2 focus:ring-orange-500/50 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-widest font-black text-slate-500 block mb-2">Industry Sector</label>
                    <input
                      type="text"
                      placeholder="Food & Beverage"
                      value={newIndustry}
                      onChange={(e) => setNewIndustry(e.target.value)}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-slate-700 focus:ring-2 focus:ring-orange-500/50 outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-end gap-3 border-t border-white/5">
                  <button 
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-6 py-3 border border-white/10 hover:bg-white/5 text-slate-400 rounded-xl transition-all text-xs font-bold uppercase tracking-widest"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-6 py-3 bg-orange-600 hover:bg-orange-500 text-white rounded-xl font-bold text-xs uppercase tracking-widest shadow-[0_0_15px_rgba(234,88,12,0.3)] transition-all"
                  >
                    Commit Prospect
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Google Sheets Sync Modal */}
      {isSheetsModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#0b0b0b] border border-white/10 w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl relative">
            <button 
              onClick={() => {
                setIsSheetsModalOpen(false);
                setSheetsStatus({ type: null, message: "" });
                setGeneratedSheetUrl(null);
              }}
              className="absolute top-6 right-6 text-slate-500 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
            <div className="p-8">
              <h2 className="text-xs uppercase tracking-[0.3em] text-emerald-500 font-bold mb-2 italic">Workspace Connection</h2>
              <h1 className="text-2xl font-bold text-white mb-2">Google Sheets Sync Node</h1>
              <p className="text-xs text-slate-400 mb-6">Import leads directly with live formatting, or export the Registry into a gorgeous, clean Google Sheets document.</p>

              {/* Authorization Info */}
              {!accessToken ? (
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-5 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex gap-3 items-start">
                    <AlertCircle className="text-amber-500 shrink-0 mt-0.5" size={18} />
                    <div>
                      <div className="text-white font-bold text-sm">Authorization Token Required</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">Please authorize the app to access your Google Workspace account for Sheets.</div>
                    </div>
                  </div>
                  <button 
                    onClick={login}
                    className="px-5 py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-black text-[10px] uppercase tracking-widest rounded-lg transition-all shadow-[0_0_15px_rgba(245,158,11,0.2)] shrink-0"
                  >
                    Link Account
                  </button>
                </div>
              ) : (
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-5 py-3 mb-6 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                  <span className="text-[10px] uppercase font-black tracking-widest text-slate-300">Google Workspace Node Active</span>
                </div>
              )}

              {/* Actions Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Export Column */}
                <div className="bg-white/[0.02] border border-white/5 rounded-xl p-6 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xs uppercase font-black text-slate-400 tracking-wider mb-2">Export To Google Sheets</h3>
                    <p className="text-[11px] text-slate-500 mb-6 leading-relaxed">Pushes the entire database of prospects with AI scores, paint points, and industries directly into a fresh workspace sheet.</p>
                  </div>
                  <button
                    onClick={handleExportToSheets}
                    disabled={!accessToken || sheetsStatus.type === 'loading'}
                    className="w-full h-11 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-30 text-white rounded-lg transition-all font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                  >
                    <Download size={14} />
                    Sync & Export Registry
                  </button>
                </div>

                {/* Import Column */}
                <div className="bg-white/[0.02] border border-white/5 rounded-xl p-6">
                  <h3 className="text-xs uppercase font-black text-slate-400 tracking-wider mb-2">Import From Google Sheets</h3>
                  <p className="text-[11px] text-slate-500 mb-4 leading-relaxed">Fetch rows from a shared sheet dynamically. Perfect for rapid lead transfers.</p>
                  
                  <form onSubmit={handleImportFromSheets} className="space-y-4">
                    <div>
                      <input
                        type="text"
                        placeholder="Paste Google Sheet URL/ID"
                        value={sheetsUrlInput}
                        onChange={(e) => setSheetsUrlInput(e.target.value)}
                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-slate-200 placeholder:text-slate-600 focus:ring-1 focus:ring-emerald-500 outline-none transition-all text-xs"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder="Range: Sheet1!A1:H200"
                        value={sheetsRange}
                        onChange={(e) => setSheetsRange(e.target.value)}
                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-slate-200 placeholder:text-slate-600 focus:ring-1 focus:ring-emerald-500 outline-none transition-all text-xs"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={!accessToken || !sheetsUrlInput || sheetsStatus.type === 'loading'}
                      className="w-full h-11 bg-orange-600 hover:bg-orange-500 disabled:opacity-30 text-white rounded-lg transition-all font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(234,88,12,0.2)]"
                    >
                      <RefreshCw size={14} className={sheetsStatus.type === 'loading' ? "animate-spin" : ""} />
                      Verify & Import
                    </button>
                  </form>
                </div>

              </div>

              {/* Status Banner */}
              {sheetsStatus.type && (
                <div className={`mt-6 p-4 rounded-xl text-xs flex items-center gap-3 ${
                  sheetsStatus.type === 'loading' ? 'bg-white/5 text-slate-400' :
                  sheetsStatus.type === 'success' ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' :
                  'bg-rose-500/10 border border-rose-500/20 text-rose-400'
                }`}>
                  {sheetsStatus.type === 'loading' && <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>}
                  {sheetsStatus.type === 'success' && <Check size={16} />}
                  {sheetsStatus.type === 'error' && <AlertCircle size={16} />}
                  <div className="font-semibold leading-relaxed">{sheetsStatus.message}</div>
                </div>
              )}

              {/* Generated Sheet Link Button */}
              {generatedSheetUrl && (
                <div className="mt-4 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-between">
                  <div className="text-xs text-slate-300 font-bold">Your spreadsheet is ready for intake:</div>
                  <a 
                    href={generatedSheetUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest rounded-lg transition-all"
                  >
                    Open Google Sheet
                    <ExternalLink size={12} />
                  </a>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
