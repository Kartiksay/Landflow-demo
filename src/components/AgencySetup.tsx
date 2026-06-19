import React, { useState } from "react";
import { Agency } from "../types";
import { Save } from "lucide-react";

interface AgencySetupProps {
  agency: Agency | null;
  onSave: (agency: Partial<Agency>) => void;
}

export function AgencySetup({ agency, onSave }: AgencySetupProps) {
  const [formData, setFormData] = useState<Partial<Agency>>(
    agency || {
      name: "",
      businessType: "Marketing Agency",
      services: "",
      targetIndustry: "",
      idealCustomer: "",
      pricingRange: "",
      tone: "Professional, yet friendly",
      faqs: "",
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="py-8 max-w-5xl mx-auto">
      <div className="mb-10 text-center">
        <h2 className="text-[10px] uppercase tracking-[0.4em] text-orange-500 font-black mb-3 italic">System Initialization</h2>
        <h1 className="text-5xl font-bold tracking-tighter text-white">Agency Onboarding</h1>
        <p className="text-slate-500 mt-4 max-w-xl mx-auto font-medium">Fine-tune your agency's AI core to ensure lead scoring and strategic pitches align perfectly with your business model.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white/[0.03] rounded-[2rem] border border-white/10 p-12 backdrop-blur-xl shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
          <Save size={120} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10">
          <div className="space-y-4">
            <label className="text-[10px] uppercase tracking-widest font-black text-slate-500">Legal Identity</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Nexus Growth Labs"
              className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-slate-700 focus:ring-2 focus:ring-orange-500/50 outline-none transition-all font-bold text-lg"
            />
          </div>
          <div className="space-y-4">
            <label className="text-[10px] uppercase tracking-widest font-black text-slate-500">Industry Vector</label>
            <input
              type="text"
              value={formData.businessType}
              onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
              placeholder="e.g. Performance Marketing"
              className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-slate-700 focus:ring-2 focus:ring-orange-500/50 outline-none transition-all font-medium"
            />
          </div>
        </div>

        <div className="space-y-4 mb-10">
          <label className="text-[10px] uppercase tracking-widest font-black text-slate-500">Service Core (Comma separated)</label>
          <textarea
            required
            value={formData.services}
            onChange={(e) => setFormData({ ...formData, services: e.target.value })}
            placeholder="Search Engine Optimization, Direct Response Copy, Lead Automation"
            rows={3}
            className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-slate-700 focus:ring-2 focus:ring-orange-500/50 outline-none transition-all resize-none font-medium text-sm leading-relaxed"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10">
          <div className="space-y-4">
            <label className="text-[10px] uppercase tracking-widest font-black text-slate-500">Target Verticals</label>
            <input
              type="text"
              value={formData.targetIndustry}
              onChange={(e) => setFormData({ ...formData, targetIndustry: e.target.value })}
              placeholder="Enterprise SaaS, Web3, Fintech"
              className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-slate-700 focus:ring-2 focus:ring-orange-500/50 outline-none transition-all font-medium"
            />
          </div>
          <div className="space-y-4">
            <label className="text-[10px] uppercase tracking-widest font-black text-slate-500">Customer Persona</label>
            <input
              type="text"
              value={formData.idealCustomer}
              onChange={(e) => setFormData({ ...formData, idealCustomer: e.target.value })}
              placeholder="CMOs at Series B scale-ups"
              className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-slate-700 focus:ring-2 focus:ring-orange-500/50 outline-none transition-all font-medium"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-12">
          <div className="space-y-4">
            <label className="text-[10px] uppercase tracking-widest font-black text-slate-500">Deal Thresholds</label>
            <input
              type="text"
              value={formData.pricingRange}
              onChange={(e) => setFormData({ ...formData, pricingRange: e.target.value })}
              placeholder="$5,000 - $50,000"
              className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-slate-700 focus:ring-2 focus:ring-orange-500/50 outline-none transition-all font-medium"
            />
          </div>
          <div className="space-y-4">
            <label className="text-[10px] uppercase tracking-widest font-black text-slate-500">AI Voice Signature</label>
            <input
              type="text"
              value={formData.tone}
              onChange={(e) => setFormData({ ...formData, tone: e.target.value })}
              placeholder="Intellectual, analytical, elite"
              className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-slate-700 focus:ring-2 focus:ring-orange-500/50 outline-none transition-all font-medium"
            />
          </div>
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            className="w-full md:w-80 h-16 bg-orange-600 hover:bg-orange-500 text-white font-black rounded-2xl shadow-[0_0_30px_rgba(234,88,12,0.4)] transition-all flex items-center justify-center gap-3 uppercase tracking-[0.2em] text-xs"
          >
            <Save size={20} strokeWidth={3} />
            Commit Changes
          </button>
        </div>
      </form>
    </div>
  );
}
