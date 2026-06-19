import { useState, useEffect } from "react";
import { Sidebar } from "./components/Sidebar";
import { AgencySetup } from "./components/AgencySetup";
import { LeadsPage } from "./components/LeadsPage";
import { PipelinePage } from "./components/PipelinePage";
import { Dashboard } from "./components/Dashboard";
import { OutreachPage } from "./components/OutreachPage";
import { ReplyIntelligence } from "./components/ReplyIntelligence";
import { FollowUpManager } from "./components/FollowUpManager";
import { LandingPage } from "./components/LandingPage";
import { FirebaseProvider, useFirebase } from "./lib/FirebaseProvider";
import { Agency, Lead, LeadStatus } from "./types";
import { collection, onSnapshot, query, setDoc, doc, addDoc, updateDoc, where } from "firebase/firestore";
import { motion, AnimatePresence } from "motion/react";
import { Zap } from "lucide-react";
import { sendGmailEmail } from "./lib/googleWorkspace";

function AppContent() {
  const { user, db, login, logout, loading, accessToken } = useFirebase();
  const [currentView, setCurrentView] = useState("landing");
  const [agency, setAgency] = useState<Agency | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isInitializing, setIsInitializing] = useState(true);

  // Sync Agency and Leads from Firestore
  useEffect(() => {
    if (!db || !user) {
      setIsInitializing(false);
      return;
    }

    // Subscribe to Agency
    const agencyQuery = query(collection(db, "agencies"), where("userId", "==", user.uid));
    const unsubAgency = onSnapshot(agencyQuery, (snapshot) => {
      if (!snapshot.empty) {
        setAgency({ ...snapshot.docs[0].data(), id: snapshot.docs[0].id } as Agency);
      }
      setIsInitializing(false);
    });

    // Subscribe to Leads
    const leadsQuery = query(collection(db, "leads"), where("userId", "==", user.uid));
    const unsubLeads = onSnapshot(leadsQuery, (snapshot) => {
      const leadsList = snapshot.docs.map(d => ({ ...d.data(), id: d.id }) as Lead);
      setLeads(leadsList);
    });

    return () => {
      unsubAgency();
      unsubLeads();
    };
  }, [db, user]);

  // Handle automatic auth routing transitions
  useEffect(() => {
    if (user) {
      setCurrentView("dashboard");
    } else {
      setCurrentView("landing");
    }
  }, [user]);

  const handleSaveAgency = async (data: Partial<Agency>) => {
    if (!db || !user) return;
    const agencyId = agency?.id || user.uid; // Simple one per user
    await setDoc(doc(db, "agencies", agencyId), {
      ...data,
      userId: user.uid,
      createdAt: agency?.createdAt || new Date().toISOString(),
    });
    setCurrentView("dashboard");
  };

  const handleAddLead = async (data: Partial<Lead>) => {
    if (!db || !user || !agency) return;
    await addDoc(collection(db, "leads"), {
      ...data,
      userId: user.uid,
      agencyId: agency.id,
      status: "NEW",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  };

  const handleImportLeads = async (leadsData: Partial<Lead>[]) => {
    if (!db || !user || !agency) return;
    for (const l of leadsData) {
      await addDoc(collection(db, "leads"), {
        ...l,
        userId: user.uid,
        agencyId: agency.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }
  };

  const handleAnalyzeLead = async (leadId: string) => {
    if (!db || !agency) return;
    const lead = leads.find(l => l.id === leadId);
    if (!lead) return;

    try {
      const response = await fetch("/api/ai/analyze-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lead, agency }),
      });
      const aiResult = await response.json();
      
      await updateDoc(doc(db, "leads", leadId), {
        aiScore: aiResult.score,
        aiCategory: aiResult.category,
        aiReasoning: aiResult.reasoning,
        aiServiceAngle: aiResult.serviceAngle,
        aiPainPoints: aiResult.painPoints,
        status: "QUALIFIED",
        qualifiedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Analysis failed:", error);
    }
  };

  const handleSendEmail = async (leadId: string, subject: string, content: string) => {
    if (!db) return;
    const lead = leads.find(l => l.id === leadId);
    if (!lead) return;

    try {
      if (accessToken) {
        console.log("Transmitting lead pitch via Gmail API Node...");
        await sendGmailEmail(accessToken, lead.email, subject, content);
      } else {
        await fetch("/api/email/send", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ to: lead.email, subject, html: content }),
        });
      }
      
      await updateDoc(doc(db, "leads", leadId), {
        status: "PITCHED",
        updatedAt: new Date().toISOString(),
      });

      await addDoc(collection(db, "leads", leadId, "messages"), {
        subject,
        content,
        status: "SENT",
        sentAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Email send failed:", error);
      throw error;
    }
  };

  const handleStatusChange = async (leadId: string, newStatus: LeadStatus) => {
    if (!db) return;
    await updateDoc(doc(db, "leads", leadId), {
      status: newStatus,
      updatedAt: new Date().toISOString(),
    });
  };

  const handleSeedData = async () => {
    if (!db || !user || !agency) return;
    const demoLeads: Partial<Lead>[] = [
      { name: "John Miller", company: "Miller Coffee Roasters", website: "millercoffee.com", industry: "Food & Beverage", email: "john@millercoffee.com" },
      { name: "Sarah Chen", company: "Swift Logistics", website: "swiftlogistics.io", industry: "Supply Chain", email: "sarah@swiftlogistics.io" },
      { name: "Mike Ross", company: "Ross & Partners", website: "rosslaw.com", industry: "Legal", email: "mike@rosslaw.com" },
      { name: "Elena Gilbert", company: "Mystic Grill", website: "mysticgrill.com", industry: "Restaurant", email: "elena@mysticgrill.com" },
      { name: "Bruce Wayne", company: "Wayne Enterprises", website: "waynecorp.com", industry: "Manufacturing", email: "bruce@waynecorp.com" },
    ];

    for (const l of demoLeads) {
      await addDoc(collection(db, "leads"), {
        ...l,
        userId: user.uid,
        agencyId: agency.id,
        status: "NEW",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }
  };

  if (loading || isInitializing) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          <p className="text-slate-500 font-medium animate-pulse">Waking up LeadFlow AI...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col h-screen bg-[#050505] text-slate-200 overflow-hidden relative">
        <main className="flex-1 overflow-y-auto relative z-10 px-0">
          <LandingPage 
            onEnterApp={login} 
            agencyName={undefined}
            user={null}
            login={login}
            logout={logout}
            setCurrentView={setCurrentView}
          />
        </main>
      </div>
    );
  }

  const isLanding = currentView === "landing";

  return (
    <div className="flex flex-col h-screen bg-[#050505] text-slate-200 overflow-hidden relative">
      {/* Atmospheric Background Gradients */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-orange-600/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/5 blur-[120px] rounded-full"></div>
      </div>

      {!isLanding && (
        <Sidebar currentView={currentView} onViewChange={setCurrentView} user={user} agency={agency} logout={logout} />
      )}
      
      <main className={`flex-1 overflow-y-auto relative z-10 ${isLanding ? "px-0" : "px-6"}`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="h-full"
          >
            {currentView === "landing" && (
              <LandingPage 
                onEnterApp={() => setCurrentView("dashboard")} 
                agencyName={agency?.name}
                user={user}
                login={login}
                logout={logout}
                setCurrentView={setCurrentView}
              />
            )}
            {currentView === "dashboard" && <Dashboard leads={leads} onSeedData={handleSeedData} />}
            {currentView === "leads" && (
              <LeadsPage 
                leads={leads} 
                onAddLead={handleAddLead} 
                onImportLeads={handleImportLeads}
                onAnalyze={handleAnalyzeLead} 
              />
            )}
            {currentView === "pipeline" && (
              <PipelinePage leads={leads} onStatusChange={handleStatusChange} />
            )}
            {currentView === "outreach" && (
              <OutreachPage leads={leads} agency={agency} onSendEmail={handleSendEmail} />
            )}
            {currentView === "replies" && (
              <ReplyIntelligence leads={leads} agency={agency} onUpdateLeadStatus={handleStatusChange} />
            )}
            {currentView === "followup" && (
              <FollowUpManager leads={leads} onSendEmail={handleSendEmail} />
            )}
            {currentView === "setup" && (
              <AgencySetup agency={agency} onSave={handleSaveAgency} />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Status Bar */}
      {!isLanding && (
        <footer className="h-8 border-t border-white/5 bg-black/60 px-6 flex items-center justify-between z-10 shrink-0">
          <div className="flex items-center gap-4 text-[10px] text-slate-500">
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.5)]"></div>
              Firebase Realtime Active
            </div>
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.5)]"></div>
              Gemini 3.5 AI Online
            </div>
          </div>
          <div className="text-[10px] text-slate-500 font-medium">
            v1.0.4 MVP • Build Mode Active
          </div>
        </footer>
      )}
    </div>
  );
}

export default function App() {
  return (
    <FirebaseProvider>
      <AppContent />
    </FirebaseProvider>
  );
}
