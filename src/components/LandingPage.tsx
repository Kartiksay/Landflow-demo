import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Zap, BrainCircuit, FileSpreadsheet, Mail, Sparkles, 
  ArrowRight, ShieldCheck, CheckCircle, Flame, Target, 
  MessageSquare, Layers, HelpCircle, ArrowRightLeft, FileText,
  AlertCircle, Cpu, FileUp, Activity, Check, Plus, MessageCircle,
  Database, KanbanSquare, BarChart3, LineChart, TrendingUp, Settings,
  Workflow, Play, Compass, HardDrive, Share2
} from "lucide-react";

interface LandingPageProps {
  onEnterApp: () => void;
  agencyName?: string;
  user: any;
  login: () => void;
  logout: () => void;
  setCurrentView: (view: string) => void;
}

export function LandingPage({ onEnterApp, agencyName, user, login, logout, setCurrentView }: LandingPageProps) {
  // Navigation scenes state
  const [activeScene, setActiveScene] = useState<number>(0);
  const [typingEmailText, setTypingEmailText] = useState<string>("");
  const typingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Contact section state
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [contactAgencySize, setContactAgencySize] = useState("1-10");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Continuous workflow animation state
  const [activePipelineStep, setActivePipelineStep] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setActivePipelineStep((prev) => (prev + 1) % 7);
    }, 4500);
    return () => clearInterval(interval);
  }, [isPaused]);

  // Scroll triggered glassmorphism state
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 60) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Scene details
  const scenes = [
    {
      id: 1,
      title: "Raw Lead Chaos",
      headline: "Leads are everywhere.",
      subheadline: "Most agencies lose opportunities because their sales process is fragmented. Scattered files, unstructured emails, and manual lookups slow you down.",
      icon: AlertCircle,
      accent: "from-red-500 to-rose-600"
    },
    {
      id: 2,
      title: "AI Qualification Engine",
      headline: "AI identifies your best opportunities.",
      subheadline: "Automatically qualify leads based on digital presence and market fit. Focus only on high-value prospects that match your target criteria.",
      icon: Cpu,
      accent: "from-indigo-500 to-cyan-500"
    },
    {
      id: 3,
      title: "Pain Point Detection",
      headline: "Find opportunities before your competitors.",
      subheadline: "LeadFlow AI automatically scans domains to uncover optimization potential—from poor loading speed to missing SEO or lack of lead capture widgets.",
      icon: Target,
      accent: "from-amber-400 to-orange-500"
    },
    {
      id: 4,
      title: "Personalized Outreach",
      headline: "Every message feels personal.",
      subheadline: "Generate custom outreach sequences using detailed prospect context and AI. Zero-friction drafts, tailored value propositions, and ready outputs.",
      icon: Mail,
      accent: "from-fuchsia-500 to-indigo-500"
    },
    {
      id: 5,
      title: "Reply Intelligence",
      headline: "AI understands every conversation.",
      subheadline: "Automatically categorize incoming replies. Extract budget requirements, timelines, goals, and key objections into organized structured parameters.",
      icon: MessageSquare,
      accent: "from-cyan-400 to-blue-600"
    },
    {
      id: 6,
      title: "Lead Memory + Follow-Ups",
      headline: "Your AI never forgets a lead.",
      subheadline: "Every prospect is mapped to a neural semantic graph that links paint points, historic interactions, response habits, and task deadlines in real-time.",
      icon: Database,
      accent: "from-emerald-400 to-teal-500"
    }
  ];

  // Simulated email text for typing effect in Scene 4
  const emailDraftTemplate = `Hi John,

I noticed your agency website has superb organic traffic but lacks a direct lead capture option or functional conversion scheduling widget. 

We crafted a custom interactive intake funnel that fits your design language perfectly and could raise conversions by 28%. Let's secure a 5-minute slot...`;

  useEffect(() => {
    if (activeScene === 3) { // 0-based index for Scene 4 (Personalized Outreach is index 3)
      setTypingEmailText("");
      let i = 0;
      if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
      
      typingIntervalRef.current = setInterval(() => {
        if (i < emailDraftTemplate.length) {
          setTypingEmailText((prev) => prev + emailDraftTemplate.charAt(i));
          i++;
        } else {
          if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
        }
      }, 25);
    } else {
      if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
      setTypingEmailText("");
    }

    return () => {
      if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
    };
  }, [activeScene]);

  // Handle continuous auto advance for demonstration
  useEffect(() => {
    const advanceInterval = setInterval(() => {
      setActiveScene((prev) => (prev + 1) % scenes.length);
    }, 8500);

    return () => clearInterval(advanceInterval);
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-[rgba(255,255,255,0.95)] selection:bg-[#4F46E5]/45 relative overflow-x-hidden font-sans">
      
      {/* Sticky Premium Navbar */}
      <nav className={`sticky top-0 z-50 transition-all duration-500 ease-out flex items-center justify-between ${
        isScrolled 
          ? "bg-[#060608]/92 backdrop-blur-xl border-b border-white/10 py-3.5 px-8 shadow-[0_10px_30px_rgba(0,0,0,0.65)]" 
          : "bg-transparent border-b border-transparent py-5 px-8"
      }`}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-tr from-[#4F46E5] to-[#00D4FF] rounded flex items-center justify-center shadow-[0_0_15px_rgba(79,70,229,0.4)]">
            <div className="w-4 h-4 border-2 border-white/95 rotate-45" />
          </div>
          <span className="text-lg font-black text-white uppercase tracking-tight select-none">
            LeadFlow <span className="text-[#00D4FF] italic">AI</span>
          </span>
        </div>

        {/* Center Navigation Links */}
        <div className="hidden md:flex items-center gap-8 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
          <a href="#features" className="hover:text-[#00D4FF] transition-colors">Features</a>
          <a href="#technology" className="hover:text-[#00D4FF] transition-colors">Technology</a>
          <a href="#pricing" className="hover:text-[#00D4FF] transition-colors">Pricing</a>
          <a href="#contact" className="hover:text-[#00D4FF] transition-colors">Contact</a>
        </div>

        {/* Right side navigation buttons/profile */}
        <div>
          <AnimatePresence mode="wait">
            {user ? (
              <motion.div 
                key="logged-in-nav"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
                className="flex items-center gap-4"
              >
                {/* My Profile Section - Only showing profile info */}
                <motion.div 
                  whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.05)" }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  className="flex items-center gap-3 bg-white/[0.03] border border-white/10 px-4 py-1.5 rounded-2xl select-none"
                >
                  {user.photoURL ? (
                    <img 
                      src={user.photoURL} 
                      alt={user.displayName || "User"} 
                      className="w-6 h-6 rounded-full object-cover border border-white/20"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#4F46E5] to-[#00D4FF] text-white flex items-center justify-center text-[10px] font-black uppercase">
                      {(user.email || user.displayName || "U")[0]}
                    </div>
                  )}
                  
                  <div className="hidden sm:flex flex-col text-left">
                    <span className="text-[10px] font-bold text-white leading-none">My Profile</span>
                    <span className="text-[9px] text-slate-500 font-mono mt-0.5 max-w-[100px] truncate">
                      {user.email || user.displayName}
                    </span>
                  </div>
                </motion.div>

                {/* Dashboard button side-by-side with profile */}
                <motion.button 
                  key="dashboard-btn"
                  onClick={onEnterApp}
                  whileHover={{ scale: 1.05, filter: "brightness(1.15)" }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  className="px-4 py-2 bg-gradient-to-r from-[#4F46E5] to-[#00D4FF] text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-[0_0_15px_rgba(79,70,229,0.25)] flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Dashboard</span>
                  <ArrowRight size={12} />
                </motion.button>
              </motion.div>
            ) : (
              <motion.div 
                key="logged-out-nav"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
                className="flex items-center gap-3"
              >
                <motion.button 
                  onClick={login}
                  whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.07)" }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  className="px-4 py-2 border border-white/10 bg-white/[0.02] text-slate-300 hover:text-white rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer"
                >
                  Sign In
                </motion.button>

                <motion.button 
                  onClick={login}
                  whileHover={{ scale: 1.05, filter: "brightness(1.15)" }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  className="px-5 py-2 bg-gradient-to-r from-[#4F46E5] to-[#00D4FF] text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-[0_0_15px_rgba(79,70,229,0.3)] cursor-pointer"
                >
                  Sign Up
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>

      {/* Background Grid & Decorative Blur */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(79,70,229,0.15),rgba(0,0,0,0))] pointer-events-none z-0" />
      <div className="absolute top-[800px] left-[-300px] w-[600px] h-[600px] rounded-full bg-[rgba(0,212,255,0.05)] blur-[120px] pointer-events-none" />
      <div className="absolute top-[2000px] right-[-350px] w-[700px] h-[700px] rounded-full bg-[rgba(79,70,229,0.05)] blur-[150px] pointer-events-none" />

      {/* Hero Section */}
      <section className="relative pt-24 pb-20 px-6 max-w-7xl mx-auto z-10">
        <div className="text-center space-y-6 max-w-4xl mx-auto">
          
          {/* Header Banner */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#101114] border border-white/10 rounded-full text-xs font-semibold text-slate-300 shadow-[0_0_15px_rgba(79,70,229,0.15)]"
          >
            <Sparkles size={13} className="text-[#00D4FF]" />
            <span className="tracking-wide uppercase text-[10px] text-transparent bg-clip-text bg-gradient-to-r from-[#00D4FF] to-[#4F46E5] font-black">
              Enterprise AI Delivery Agent
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse ml-1" />
          </motion.div>

          {/* Main Hero Typography */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl md:text-7xl font-black tracking-tight text-white leading-[1.05]"
          >
            Transform Raw Leads Into <br />
            <span className="bg-gradient-to-r from-[#4F46E5] via-[#00D4FF] to-[#4F46E5] bg-clip-text text-transparent bg-[length:200%_auto] animate-pulse">
              Qualified Sales Conversations
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-slate-400 text-base md:text-lg max-w-2xl mx-auto leading-relaxed"
          >
            LeadFlow AI automatically qualifies leads, generates hyper-targeted outreach sequences, analyzes responses, and automates follow-ups so your agency can focus solely on closing deals.
          </motion.p>

          {/* Call to Actions */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="pt-6 flex flex-col sm:flex-row justify-center items-center gap-4"
          >
            <button 
              onClick={onEnterApp}
              className="px-8 py-4 bg-gradient-to-r from-[#4F46E5] to-[#00D4FF] text-white rounded-2xl hover:brightness-110 active:scale-95 transition-all font-bold text-sm tracking-wide uppercase shadow-[0_0_30px_rgba(79,70,229,0.45)] flex items-center gap-3 w-full sm:w-auto justify-center"
            >
              <span>Get Started</span>
              <ArrowRight size={16} />
            </button>
            <button 
              onClick={onEnterApp}
              className="px-8 py-4 bg-[#101114] border border-white/5 text-slate-300 rounded-2xl hover:bg-white/[0.04] transition-all font-bold text-sm tracking-wide uppercase flex items-center gap-2 w-full sm:w-auto justify-center"
            >
              <Play size={14} className="fill-slate-300 text-slate-300" />
              <span>Watch Demo</span>
            </button>
          </motion.div>
        </div>

        {/* Animated AI Pipeline Visual */}
        <div className="mt-16 max-w-5xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="p-8 bg-[#101114] border border-white/5 rounded-[2.5rem] relative shadow-2xl overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#4F46E5]/10 rounded-full blur-3xl -z-10 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#00D4FF]/5 rounded-full blur-3xl -z-10 pointer-events-none" />

            <div className="flex items-center justify-between border-b border-white/5 pb-6 mb-8">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500/80" />
                <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <span className="w-3 h-3 rounded-full bg-green-500/80" />
                <span className="text-xs text-slate-500 font-mono ml-4 uppercase">Automation Pipeline Engine v2.6.4</span>
              </div>
              <div className="px-3 py-1 bg-white/5 border border-white/5 rounded-full text-[10px] text-slate-400 font-mono tracking-wider uppercase">
                Active Process
              </div>
            </div>

            {/* Continuous Line Workflow pipeline diagram */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4 relative">
              {[
                { label: "CSV Upload", icon: FileUp, pulse: "cyan" },
                { label: "Lead Qualification", icon: Cpu, pulse: "purple" },
                { label: "Pain Point Detection", icon: Target, pulse: "orange" },
                { label: "Personalized Outreach", icon: Mail, pulse: "fuchsia" },
                { label: "Reply Intelligence", icon: MessageSquare, pulse: "cyan" },
                { label: "Follow-Up Automation", icon: Workflow, pulse: "purple" },
                { label: "Meeting Scheduled", icon: CheckCircle, pulse: "emerald" }
              ].map((step, idx) => {
                const colors: Record<string, string> = {
                  cyan: "bg-[#00D4FF] text-[#00D4FF] shadow-[0_0_15px_rgba(0,212,255,0.4)]",
                  purple: "bg-[#4F46E5] text-white shadow-[0_0_15px_rgba(79,70,229,0.4)]",
                  orange: "bg-orange-500 text-orange-400 shadow-[0_0_15px_rgba(249,115,22,0.4)]",
                  fuchsia: "bg-fuchsia-500 text-fuchsia-400 shadow-[0_0_15px_rgba(217,70,239,0.4)]",
                  emerald: "bg-emerald-500 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.4)]"
                };

                const isActive = activePipelineStep === idx;

                return (
                  <button 
                    key={idx} 
                    onClick={() => {
                      setActivePipelineStep(idx);
                      setIsPaused(true);
                    }}
                    className={`flex flex-col items-center text-center relative group focus:outline-none cursor-pointer transition-all duration-300 ${
                      isActive ? "scale-105" : "hover:scale-102 opacity-70"
                    }`}
                  >
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                      isActive 
                        ? `bg-slate-950 border-2 ${idx === 0 || idx === 4 ? 'border-[#00D4FF]' : idx === 1 || idx === 5 ? 'border-[#4F46E5]' : idx === 2 ? 'border-orange-500' : idx === 3 ? 'border-fuchsia-500' : 'border-emerald-500'} shadow-lg` 
                        : "bg-[#050505] border border-white/5 hover:border-white/20 hover:bg-white/[0.02]"
                    }`}>
                      <step.icon size={22} className={`transition-colors duration-300 ${
                        isActive 
                          ? idx === 0 || idx === 4 ? 'text-[#00D4FF]' : idx === 1 || idx === 5 ? 'text-[#4F46E5]' : idx === 2 ? 'text-orange-400' : idx === 3 ? 'text-fuchsia-400' : 'text-emerald-400'
                          : "text-slate-400 group-hover:text-white"
                      }`} />
                    </div>
                    
                    {/* Pulsing indicator node */}
                    <div className="absolute top-12 flex justify-center w-full">
                      <span className={`w-2.5 h-2.5 rounded-full border border-black animate-ping ${colors[step.pulse].split(" ")[0]} opacity-75`} />
                      <span className={`w-2.5 h-2.5 rounded-full absolute ${colors[step.pulse].split(" ")[0]} border border-black`} />
                    </div>

                    <div className="mt-5 space-y-1">
                      <span className={`text-[10px] transition-colors duration-300 font-semibold block min-h-[30px] leading-tight ${
                        isActive ? "text-white" : "text-slate-500 group-hover:text-slate-300"
                      }`}>
                        {step.label}
                      </span>
                    </div>

                    {/* Arrow links for visually connecting nodes on md+ screens */}
                    {idx < 6 && (
                      <div className="hidden lg:block absolute top-7 left-[70%] w-[60%] h-[2px] bg-gradient-to-r from-white/10 to-transparent -z-10" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Stage Workbench Simulator */}
            <div className="mt-10 bg-[#050505] border border-white/5 rounded-3xl p-6 md:p-8 min-h-[320px] flex flex-col justify-between relative overflow-hidden">
              {/* Grid Backdrop decorations */}
              <div className="absolute inset-0 bg-[radial-gradient(#15151b_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none" />

              <AnimatePresence mode="wait">
                {/* STEP 0: CSV Upload Simulation */}
                {activePipelineStep === 0 && (
                  <motion.div
                    key="step-0"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.4 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10"
                  >
                    <div className="space-y-4 text-left">
                      <span className="text-[10px] text-[#00D4FF] font-mono uppercase tracking-widest font-bold">Simulator • Lead Directory Ingestion</span>
                      <h4 className="text-xl font-bold text-white tracking-tight">Bulk Upload CSV Lead Lists</h4>
                      <p className="text-slate-400 text-xs leading-relaxed">
                        Ingest hundreds of prospects directly into LeadFlow. Our dynamic platform parses contacts and begins immediate account matching.
                      </p>

                      {/* Upload Status Card */}
                      <div className="bg-[#101114] border border-white/10 p-4 rounded-xl space-y-3">
                        <div className="flex items-center justify-between text-xs font-mono">
                          <span className="text-slate-300">directory_leads_v2.csv</span>
                          <span className="text-[#00D4FF]">100% Ingested</span>
                        </div>
                        {/* Animated Bar */}
                        <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: "0%" }}
                            animate={{ width: "100%" }}
                            transition={{ duration: 2.5, ease: "easeInOut" }}
                            className="h-full bg-[#00D4FF] shadow-[0_0_10px_rgba(0,212,255,0.5)]"
                          />
                        </div>
                        <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono">
                          <span>Size: 2.4 MB</span>
                          <span>245 potential prospects structured</span>
                        </div>
                      </div>
                    </div>

                    {/* Right Side: Lead Cards List popping up */}
                    <div className="flex flex-col gap-2.5 max-h-[220px] overflow-hidden relative">
                      <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-[#050505] to-transparent z-10 pointer-events-none" />
                      <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-[#101114] border border-[#00D4FF]/20 p-3 rounded-xl flex items-center justify-between text-left"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-[#00D4FF] font-black text-xs font-mono">S</div>
                          <div>
                            <span className="font-bold text-xs text-white block">stripe.com</span>
                            <span className="text-[10px] text-slate-500">Financial Technology / global</span>
                          </div>
                        </div>
                        <span className="px-2 py-0.5 bg-indigo-500/10 border border-indigo-500/20 text-[9px] font-bold text-indigo-400 rounded-full font-mono">Structured</span>
                      </motion.div>

                      <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-[#101114] border border-white/5 p-3 rounded-xl flex items-center justify-between text-left"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-orange-600/10 border border-orange-500/20 flex items-center justify-center text-orange-400 font-black text-xs font-mono">A</div>
                          <div>
                            <span className="font-bold text-xs text-white block">airbnb.com</span>
                            <span className="text-[10px] text-slate-500">Travel Platform / vacation</span>
                          </div>
                        </div>
                        <span className="px-2 py-0.5 bg-zinc-500/10 border border-zinc-500/10 text-[9px] font-bold text-slate-400 rounded-full font-mono">Structured</span>
                      </motion.div>

                      <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                        className="bg-[#101114] border border-white/5 p-3 rounded-xl flex items-center justify-between text-left"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-teal-600/10 border border-teal-500/20 flex items-center justify-center text-teal-400 font-black text-xs font-mono">H</div>
                          <div>
                            <span className="font-bold text-xs text-white block">hubspot.com</span>
                            <span className="text-[10px] text-slate-500">B2B SaaS / marketing</span>
                          </div>
                        </div>
                        <span className="px-2 py-0.5 bg-zinc-500/10 border border-zinc-500/10 text-[9px] font-bold text-slate-400 rounded-full font-mono">Structured</span>
                      </motion.div>
                    </div>
                  </motion.div>
                )}

                {/* STEP 1: Lead Qualification */}
                {activePipelineStep === 1 && (
                  <motion.div
                    key="step-1"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.4 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10"
                  >
                    <div className="space-y-4 text-left">
                      <span className="text-[10px] text-[#4F46E5] font-mono uppercase tracking-widest font-bold">Simulator • Prospect Fit Score</span>
                      <h4 className="text-xl font-bold text-white tracking-tight">AI Lead Qualification</h4>
                      <p className="text-slate-400 text-xs leading-relaxed">
                        Automatic verification of key accounts. Evaluates tech requirements, funding metrics, and corporate decision profiles to structure target values.
                      </p>

                      <div className="bg-[#101114] border border-[#4F46E5]/20 p-4 rounded-xl flex items-center justify-between">
                        <div className="space-y-1 text-left">
                          <span className="text-[10px] text-slate-500 font-mono uppercase block">Fit Profile</span>
                          <span className="text-sm font-bold text-white block">stripe.com</span>
                          <span className="text-[11px] text-[#00D4FF] font-mono leading-none">Qualified Account Node</span>
                        </div>
                        <div className="w-14 h-14 rounded-full border-2 border-[#4F46E5]/20 flex items-center justify-center relative shadow-[0_0_15px_rgba(79,70,229,0.15)] bg-slate-950">
                          <motion.div 
                            initial={{ rotate: 0 }}
                            animate={{ rotate: 360 }}
                            transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                            className="absolute inset-0 rounded-full border border-t-[#00D4FF] border-r-transparent border-b-transparent border-l-transparent"
                          />
                          <span className="text-xs font-black text-white font-mono">96%</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2.5 max-h-[220px] justify-center">
                      <div className="bg-[#101114] border border-white/5 p-4 rounded-xl text-left space-y-3">
                        <div className="flex items-center gap-2">
                          <ShieldCheck size={14} className="text-[#00D4FF]" />
                          <span className="text-xs font-bold text-white">Target Criteria Review</span>
                        </div>
                        <div className="space-y-1.5 font-mono text-[10px] text-slate-400 max-h-[140px] overflow-y-auto">
                          <div className="flex items-center gap-2">
                            <div className="w-1 h-1 rounded-full bg-emerald-400" />
                            <span>Revenue Match: $100M+ (Enterprise Node)</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-1 h-1 rounded-full bg-emerald-400" />
                            <span>Target contact: VP Growth verified (John S.)</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-1 h-1 rounded-full bg-emerald-400" />
                            <span>Primary stack: React, Cloudflare, Custom billing</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* STEP 2: Pain Point Detection */}
                {activePipelineStep === 2 && (
                  <motion.div
                    key="step-2"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.4 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10"
                  >
                    <div className="space-y-4 text-left">
                      <span className="text-[10px] text-orange-500 font-mono uppercase tracking-widest font-bold">Simulator • Vector Crawl</span>
                      <h4 className="text-xl font-bold text-white tracking-tight">Pain Point Identification</h4>
                      <p className="text-slate-400 text-xs leading-relaxed">
                        Crawls target web surfaces to automatically spot friction points like mobile conversion drop-off, sluggish checkout speeds, or slow database responses.
                      </p>

                      <div className="flex gap-2">
                        <span className="px-2.5 py-1 bg-red-500/10 border border-red-500/20 rounded-full text-[10px] font-bold text-red-400 font-mono uppercase tracking-wider">
                          Latency Fault Detected
                        </span>
                        <span className="px-2.5 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-[10px] font-bold text-amber-500 font-mono uppercase tracking-wider">
                          Conversion Leak
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2.5 text-left max-h-[220px] justify-center">
                      <div className="bg-red-500/5 border border-red-500/10 p-3 rounded-xl space-y-1">
                        <span className="text-[9px] font-black text-red-400 font-mono uppercase block">Friction #1: Mobile Latency</span>
                        <span className="text-xs font-bold text-white block">Checkout page load takes 4.8 seconds on mobile device</span>
                        <span className="text-[10px] text-slate-400 block">Typical visitor bounce rate estimate: ~24% due to connection delays.</span>
                      </div>

                      <div className="bg-amber-500/5 border border-amber-500/10 p-3 rounded-xl space-y-1">
                        <span className="text-[9px] font-black text-amber-400 font-mono uppercase block">Friction #2: Lead Funnel</span>
                        <span className="text-xs font-bold text-white block">Missing scheduling hooks on checkout failure warnings</span>
                        <span className="text-[10px] text-slate-400 block">Leaving commercial transaction drop-offs unmonitored.</span>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* STEP 3: Personalized Outreach */}
                {activePipelineStep === 3 && (
                  <motion.div
                    key="step-3"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.4 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10"
                  >
                    <div className="space-y-4 text-left">
                      <span className="text-[10px] text-fuchsia-500 font-mono uppercase tracking-widest font-bold">Simulator • Cognitive Draft</span>
                      <h4 className="text-xl font-bold text-white tracking-tight">Hyper-Targeted Mail Craft</h4>
                      <p className="text-slate-400 text-xs leading-relaxed">
                        Automatic draft creation containing contextual mobile speed benchmarks. No cold copy templates, just personalized, warm value.
                      </p>

                      <div className="bg-[#101114] border border-white/10 p-3 rounded-xl text-left space-y-1 text-xs">
                        <div className="flex justify-between text-slate-500 text-[10px] font-mono">
                          <span>Recipient: john@stripe.com</span>
                          <span>Priority: HIGH NODE</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-[#101114] border border-fuchsia-500/10 p-4 rounded-xl text-left text-xs space-y-2 max-h-[220px] overflow-y-auto scrollbar-none relative">
                      <div className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-fuchsia-500 animate-ping" />
                      <span className="text-[9px] font-mono text-zinc-500 block uppercase">Draft Sequence Created via Gemini 3.5</span>
                      <p className="text-white font-bold leading-none">Hi John,</p>
                      <p className="text-slate-300 leading-relaxed text-[11px]">
                        I noticed stripe.com mobile checkout features up to <span className="text-[#00D4FF] font-semibold">4.8s of latency</span>, exposing active clients to transaction leak rates of <span className="text-fuchsia-400 font-semibold">~24%</span>.
                      </p>
                      <p className="text-slate-300 leading-relaxed text-[11px]">
                        We designed a micro latency resolution patch. Ready to present it in a 5m visual review on Thursday?
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* STEP 4: Reply Intelligence */}
                {activePipelineStep === 4 && (
                  <motion.div
                    key="step-4"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.4 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10"
                  >
                    <div className="space-y-4 text-left">
                      <span className="text-[10px] text-[#00D4FF] font-mono uppercase tracking-widest font-bold">Simulator • Sentiment Core</span>
                      <h4 className="text-xl font-bold text-white tracking-tight">AI Reply Classification</h4>
                      <p className="text-slate-400 text-xs leading-relaxed">
                        Automatic tracking of candidate inquiries. Reads and tags text context immediately with sentiment categories.
                      </p>

                      <div className="bg-[#101114]/50 border border-white/5 p-3 rounded-xl flex items-center justify-between">
                        <span className="text-xs font-bold text-white">Sentiment Classification</span>
                        <span className="px-2.5 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-[9px] font-mono font-bold text-emerald-400 rounded-full uppercase tracking-wider">
                          Positive Reply Intent
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2.5 max-h-[220px] justify-center">
                      <motion.div 
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-[#101114] border border-[#00D4FF]/20 p-4 rounded-xl text-left space-y-2 shadow-lg"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-white">John S. (VP Growth)</span>
                          <span className="text-[10px] text-slate-500 font-mono">1 minute ago</span>
                        </div>
                        <p className="text-slate-300 italic text-xs leading-relaxed">
                          "This latency metric is highly accurate. We've been investigating mobile payment drops this week. Are you available for a brief discussion this Thursday afternoon?"
                        </p>
                      </motion.div>
                    </div>
                  </motion.div>
                )}

                {/* STEP 5: Follow-Up Automation */}
                {activePipelineStep === 5 && (
                  <motion.div
                    key="step-5"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.4 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10"
                  >
                    <div className="space-y-4 text-left">
                      <span className="text-[10px] text-[#4F46E5] font-mono uppercase tracking-widest font-bold">Simulator • Cycle Trigger</span>
                      <h4 className="text-xl font-bold text-white tracking-tight">Sequence Optimization</h4>
                      <p className="text-slate-400 text-xs leading-relaxed">
                        Continuous engagement triggers. Follow-up queues automatically formulate supportive value blocks based on lead sentiment history.
                      </p>

                      <div className="flex items-center gap-3">
                        <span className="text-xs text-slate-400 font-mono">Autopilot Status:</span>
                        <span className="px-2.5 py-0.5 bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-bold text-indigo-400 rounded-full font-mono">Optimized</span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2.5 justify-center max-h-[220px]">
                      <div className="bg-[#101114] border border-white/5 p-4 rounded-xl text-left space-y-3">
                        <div className="flex justify-between items-center text-[10px] font-mono text-slate-500">
                          <span>Rule: Unresolved thread 48h</span>
                          <span className="text-indigo-400">Autopilot</span>
                        </div>
                        <div className="p-3 bg-[#050505] rounded-xl border border-white/5">
                          <span className="text-[9px] font-mono text-[#00D4FF] block mb-1">Follow-up Draft</span>
                          <span className="text-xs text-slate-300 block">"Hi John, sending along the 3-step mobile checkout prototype to save you time. Let me know if Thursday works..."</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* STEP 6: Meeting Scheduled */}
                {activePipelineStep === 6 && (
                  <motion.div
                    key="step-6"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10"
                  >
                    <div className="space-y-4 text-left">
                      <span className="text-[10px] text-emerald-500 font-mono uppercase tracking-widest font-bold font-black">Simulator • Climax Successful</span>
                      <h4 className="text-2xl font-black text-white tracking-tight">The Schedule Matrix Locked</h4>
                      <p className="text-slate-400 text-xs leading-relaxed">
                        Pre-screened leads stream directly into confirmed calendar positions. Completely synchronized back into operational scheduler feeds.
                      </p>

                      <div className="pt-2">
                        <button 
                          onClick={onEnterApp}
                          className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:brightness-110 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] cursor-pointer"
                        >
                          Open Main Dashboard
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-col justify-center items-center relative py-4">
                      {/* Floating glowing confetti ring */}
                      <div className="absolute inset-0 bg-emerald-500/10 blur-2xl rounded-full" />
                      
                      <motion.div 
                        initial={{ y: 20 }}
                        animate={{ y: [0, -4, 0] }}
                        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                        className="bg-[#101114] border-2 border-emerald-500/30 p-4 rounded-2xl text-left space-y-3 shadow-2xl relative z-10 max-w-[280px]"
                      >
                        <div className="flex items-center gap-2 pb-2 border-b border-white/5">
                          <div className="w-6 h-6 rounded-md bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                            <CheckCircle size={14} />
                          </div>
                          <span className="font-bold text-xs text-white">Event Booked</span>
                        </div>
                        <div className="space-y-1">
                          <span className="text-[10px] text-slate-500 font-mono block">CALENDAR SYNC</span>
                          <span className="text-xs font-bold text-white block">LeadFlow AI × VP Growth (Stripe)</span>
                          <span className="text-[9px] text-emerald-400 font-mono block mt-0.5">Thursday, 2:00 PM EST</span>
                        </div>
                      </motion.div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Manual Pause / Play controller under workbench */}
              <div className="mt-8 border-t border-white/5 pt-4 flex items-center justify-between text-[10px] text-slate-500 font-mono relative z-20">
                <div className="flex items-center gap-1.5">
                  <div className={`w-1.5 h-1.5 rounded-full ${isPaused ? "bg-amber-500" : "bg-emerald-500 animate-ping"}`} />
                  <span>{isPaused ? "Autoplay Paused" : "Autoplay Scanning Flow"}</span>
                </div>
                <button 
                  onClick={() => setIsPaused(!isPaused)} 
                  className="hover:text-white transition-colors cursor-pointer border border-white/10 hover:border-white/30 rounded px-2 py-0.5 bg-[#101114] select-none"
                >
                  {isPaused ? "RESUME AUTOPLAY" : "PAUSE ENGINE"}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Scrolltelling Experience (Lead Journey) */}
      <section id="technology" className="py-24 bg-[#0A0A0C] border-y border-white/5 relative">
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="mb-14 text-center space-y-3">
            <span className="text-[10px] uppercase font-black text-[#00D4FF] tracking-widest block font-mono">
              Lead Lifecycle Simulation
            </span>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white">
              The Journey of a Single Lead
            </h2>
            <p className="text-slate-400 text-xs md:text-sm max-w-xl mx-auto">
              Click through or watch our AI lifecycle pipeline isolate pain points, draft campaign collateral, and capture active inbox replies automatically.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Timeline Segmented Controls - Stage Selector */}
            <div className="lg:col-span-4 space-y-3">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-2 font-mono">Stages</span>
              {scenes.map((scene, index) => {
                const isActive = activeScene === index;
                return (
                  <button
                    key={scene.id}
                    onClick={() => setActiveScene(index)}
                    className={`w-full text-left p-4 rounded-2xl border transition-all duration-300 relative overflow-hidden group ${
                      isActive 
                        ? "bg-[#101114] border-white/10 shadow-lg text-white" 
                        : "bg-transparent border-transparent text-slate-500 hover:text-slate-300"
                    }`}
                  >
                    {isActive && (
                      <motion.div 
                        layoutId="activeBar"
                        className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#4F46E5] to-[#00D4FF]"
                      />
                    )}
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center border transition-colors ${
                        isActive ? "bg-white/5 border-white/10 text-[#00D4FF]" : "bg-transparent border-white/5 text-slate-600 group-hover:text-slate-400"
                      }`}>
                        <scene.icon size={16} />
                      </div>
                      <div>
                        <div className="text-xs font-black uppercase tracking-wider">
                          Scene {scene.id}: {scene.title}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Visual Canvas Stage View */}
            <div className="lg:col-span-8 bg-[#101114] border border-white/5 rounded-[2rem] p-8 min-h-[460px] flex flex-col justify-between relative shadow-2xl overflow-hidden group">
              
              <div className="absolute top-0 right-0 w-80 h-80 bg-[#4F46E5]/5 rounded-full blur-[90px] pointer-events-none -z-10" />

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full bg-gradient-to-tr ${scenes[activeScene].accent}`} />
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#00D4FF] font-mono">
                    Scene {scenes[activeScene].id} • Active Visualization
                  </span>
                </div>

                <h3 className="text-2xl md:text-4xl font-extrabold tracking-tight text-white mb-2">
                  {scenes[activeScene].headline}
                </h3>
                <p className="text-slate-400 text-xs md:text-sm leading-relaxed max-w-2xl font-light">
                  {scenes[activeScene].subheadline}
                </p>
              </div>

              {/* Scene Dynamic Visualizers */}
              <div className="my-8 min-h-[220px] bg-[#050505] border border-white/5 rounded-2xl p-6 flex flex-col justify-center overflow-hidden relative">
                
                <AnimatePresence mode="wait">
                  {activeScene === 0 && (
                    <motion.div 
                      key="scene1"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="grid grid-cols-2 sm:grid-cols-3 gap-3 relative"
                    >
                      {/* Floating raw leads Chaos */}
                      {[
                        { title: "leads_backup.xlsx", detail: "250 rows", color: "text-emerald-400" },
                        { title: "contact-form-submissions", detail: "Unformatted list", color: "text-amber-400" },
                        { title: "info@myagency.com", detail: "Inbox messages", color: "text-blue-400" },
                        { title: "Prospect_LinkedIn_export", detail: "Needs parser", color: "text-sky-500" },
                        { title: "leads_final_final.csv", detail: "Stale data (2025)", color: "text-rose-400" },
                        { title: "Google_search_export", detail: "No emails verified", color: "text-purple-400" }
                      ].map((item, id) => (
                        <div key={id} className="p-3 bg-white/[0.02] border border-dashed border-white/10 rounded-xl relative group animate-pulse" style={{ animationDelay: `${id * 150}ms` }}>
                          <div className="flex items-center gap-2 text-[11px] font-bold text-slate-300">
                            <FileText size={13} className={item.color} />
                            <span className="truncate">{item.title}</span>
                          </div>
                          <span className="text-[10px] text-slate-600 font-mono mt-1 block">{item.detail}</span>
                        </div>
                      ))}
                    </motion.div>
                  )}

                  {activeScene === 1 && (
                    <motion.div 
                      key="scene2"
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      className="space-y-4"
                    >
                      <div className="flex items-center justify-between px-2 text-xs font-mono text-slate-500">
                        <span>Lead Matrix intake</span>
                        <span>AI Cognitive scan: 3.5-flash</span>
                      </div>
                      <div className="space-y-2">
                        {[
                          { label: "Medina Clinical Labs", category: "HOT", score: 91, details: "Medical / Active site / No calendar widget" },
                          { label: "Elite Roofing Group", category: "WARM", score: 74, details: "Construction / Slow response times online" },
                          { label: "Acme Logistics Corp", category: "COLD", score: 35, details: "Enterprise / Low priority sector" }
                        ].map((lead, idx) => (
                          <div key={idx} className="p-3 bg-white/[0.03] border border-white/5 rounded-xl flex items-center justify-between">
                            <div className="space-y-1">
                              <span className="text-xs font-bold text-white block">{lead.label}</span>
                              <span className="text-[10px] text-slate-500 font-light block">{lead.details}</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className={`text-[9px] font-mono font-black px-2 py-0.5 rounded ${
                                lead.category === 'HOT' ? "bg-orange-500/10 text-orange-400 border border-orange-500/20" :
                                lead.category === 'WARM' ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20" :
                                "bg-slate-500/10 text-slate-400 border border-white/5"
                              }`}>
                                {lead.category}
                              </span>
                              <span className="text-xs font-mono font-black text-white">{lead.score} <span className="text-[9px] text-slate-600">FIT</span></span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {activeScene === 2 && (
                    <motion.div 
                      key="scene3"
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      className="space-y-4 font-mono text-[11px]"
                    >
                      <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl flex items-center justify-between text-yellow-500">
                        <span className="flex items-center gap-2">
                          <AlertCircle size={14} className="text-yellow-500" />
                          Diagnostics Completed: medina-clinical.com
                        </span>
                        <span className="text-[10px] text-slate-500">Scan code: SU-904</span>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="p-3 bg-rose-500/5 border border-rose-500/15 rounded-xl space-y-1">
                          <span className="text-rose-400 font-bold block">🚨 Weak Online Presence</span>
                          <span className="text-[10px] text-slate-400 block">Lead capture forms are non-operational, resulting in 40% drops.</span>
                        </div>
                        <div className="p-3 bg-amber-500/5 border border-amber-500/15 rounded-xl space-y-1">
                          <span className="text-amber-400 font-bold block">⚡ Sluggish Asset Speeds</span>
                          <span className="text-[10px] text-slate-400 block">Domain loading index is 4.6 seconds. Needs modern asset bundle.</span>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {activeScene === 3 && (
                    <motion.div 
                      key="scene4"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-2 relative h-full"
                    >
                      <div className="text-[11px] font-mono text-slate-500 pb-2 border-b border-white/5 flex justify-between items-center">
                        <span>Drafting outreach: Medina Lead</span>
                        <span className="text-fuchsia-400 animate-pulse">● Typing...</span>
                      </div>
                      <div className="p-3 bg-black border border-white/5 rounded-xl font-mono text-xs text-slate-300 leading-relaxed min-h-[120px] max-h-[140px] overflow-y-auto antialiased">
                        {typingEmailText}
                        <span className="animate-pulse font-bold text-[#00D4FF]">|</span>
                      </div>
                    </motion.div>
                  )}

                  {activeScene === 4 && (
                    <motion.div 
                      key="scene5"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-3"
                    >
                      <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl flex items-center justify-between text-xs">
                        <span className="font-bold flex items-center gap-2">
                          <CheckCircle size={14} />
                          Positive Reply Decoded
                        </span>
                        <span className="font-mono text-[10px] text-emerald-500">Intelligent Parser</span>
                      </div>
                      
                      <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl text-left space-y-2">
                        <div className="text-xs text-slate-400 italic">"Hi team! Yes, our medical appointment forms are ancient. What would a new scheduling system integrate with?"</div>
                        <div className="h-px bg-white/5 my-2"></div>
                        <div className="grid grid-cols-2 gap-4 text-[10px] font-mono text-slate-500 text-left">
                          <div>
                            <span className="block text-slate-600 font-bold uppercase">Budget</span>
                            <span className="text-white font-bold block mt-0.5 font-sans">Active ($3k-$5k)</span>
                          </div>
                          <div>
                            <span className="block text-slate-600 font-bold uppercase">Timeline</span>
                            <span className="text-white font-bold block mt-0.5 font-sans">15-30 days</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {activeScene === 5 && (
                    <motion.div 
                      key="scene6"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="flex flex-col items-center justify-center space-y-4"
                    >
                      {/* Memory nodes visual mapping */}
                      <div className="relative flex items-center justify-center w-full h-[140px]">
                        <div className="absolute w-[180px] h-0.5 bg-gradient-to-r from-[#4F46E5] to-[#00D4FF] -z-10"></div>
                        
                        <div className="w-12 h-12 bg-indigo-500/20 border border-indigo-500/40 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-lg">
                          Lead
                        </div>
                        <div className="w-10 h-10 bg-cyan-500/20 border border-cyan-500/40 rounded-full flex items-center justify-center text-white font-bold text-[10px] absolute left-1/4 shadow">
                          Pain
                        </div>
                        <div className="w-10 h-10 bg-emerald-500/20 border border-emerald-500/40 rounded-full flex items-center justify-center text-white font-bold text-[10px] absolute right-1/4 shadow">
                          Budget
                        </div>
                        <div className="w-8 h-8 bg-purple-500/20 border border-purple-500/40 rounded-full flex items-center justify-center text-white font-bold text-[9px] absolute top-2/3 shadow">
                          Gmail
                        </div>
                      </div>
                      <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest text-center">Neural Context Registry Synced</span>
                    </motion.div>
                  )}
                </AnimatePresence>

              </div>

              {/* Progress Bar indicator */}
              <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs text-slate-500 font-mono">
                <span>Active Concept Preview</span>
                <div className="flex gap-1.5">
                  {scenes.map((_, i) => (
                    <span 
                      key={i} 
                      className={`w-6 h-1 rounded-full transition-all duration-300 ${
                        activeScene === i ? "bg-[#00D4FF]" : "bg-white/10"
                      }`} 
                    />
                  ))}
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* Final Hero Transformation Preview */}
      <section className="py-24 max-w-7xl mx-auto px-6 z-10 relative">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-[10px] text-[#4F46E5] uppercase font-black tracking-widest block font-mono">Unified Console</span>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white">The Future of Sales Operations</h2>
          <p className="text-slate-400 text-xs md:text-sm">
            Everything connects directly into your central Agency Intelligence console. Real statistics, integrated communication logs, and real-time conversion monitoring.
          </p>
        </div>

        {/* Dashboard Mockup Grid - Styled accurately according to LeadFlow style */}
        <div className="border border-white/5 bg-[#101114] rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-96 h-96 bg-[#4F46E5]/5 rounded-full blur-[110px] pointer-events-none -z-10" />

          {/* Header row in dashboard preview */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 pb-6 border-b border-white/5 gap-4">
            <div>
              <span className="text-[9px] text-slate-500 font-extrabold uppercase tracking-wide italic">Performance Dashboard</span>
              <h3 className="text-2xl font-black text-white">Agency Intelligence Center</h3>
            </div>
            <button 
              onClick={onEnterApp}
              className="px-6 py-2 bg-gradient-to-r from-[#4F46E5] to-[#00D4FF] text-white hover:brightness-110 font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-[0_0_15px_rgba(79,70,229,0.25)] flex items-center gap-2 shrink-0 self-start sm:self-center"
            >
              <span>Launch Live Console</span>
              <ArrowRight size={12} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Total Leads", val: "248", change: "+16%", color: "text-[#00D4FF]" },
              { label: "Hot Leads (AI)", val: "63", change: "+24%", color: "text-orange-500" },
              { label: "Emails Sent", val: "189", change: "92% Open", color: "text-fuchsia-400" },
              { label: "Meetings Booked", val: "12", change: "28% Conv.", color: "text-emerald-400" }
            ].map((stat, idx) => (
              <div key={idx} className="bg-[#050505] border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-colors">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">{stat.label}</span>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-2xl font-black text-white">{stat.val}</span>
                  <span className={`text-[10px] font-mono ${stat.color}`}>{stat.change}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Kanban simulation pipeline */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 font-mono text-[10px]">
            {[
              { title: "NEW", count: 86, color: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
              { title: "QUALIFIED", count: 54, color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
              { title: "PITCHED", count: 42, color: "bg-orange-500/10 text-orange-400 border-orange-500/20" },
              { title: "REPLIED", count: 18, color: "bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/20" },
              { title: "MEETING NEEDED", count: 12, color: "bg-purple-500/10 text-purple-400 border-purple-500/20" },
              { title: "CLOSED WON", count: 36, color: "bg-green-500/10 text-green-400 border-green-500/20" }
            ].map((col, idx) => (
              <div key={idx} className="bg-[#050505] border border-white/5 rounded-2xl p-4 flex flex-col justify-between hover:bg-white/[0.01] transition-all">
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-[9px] px-2 py-0.5 rounded border font-black uppercase tracking-wider ${col.color}`}>
                    {col.title}
                  </span>
                  <span className="text-white font-bold font-sans">{col.count}</span>
                </div>
                <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-slate-700" style={{ width: `${Math.min(idx * 16 + 20, 100)}%` }} />
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Feature Bento Grid */}
      <section id="features" className="py-28 bg-[#07070a] border-y border-white/5 relative z-10">
        {/* Ambient atmospheric halos */}
        <div className="absolute top-[10%] left-[20%] w-[400px] h-[400px] bg-[#4F46E5]/5 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-[10%] right-[20%] w-[400px] h-[400px] bg-[#00D4FF]/3 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6">
          {/* Editorial Typography Header */}
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-5">
            <span className="text-[10px] text-[#00D4FF] uppercase font-black tracking-widest block font-mono">
              // Precision Architecture
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-white leading-tight tracking-tight uppercase">
              Engineered to Outperform. <br />
              Built to Scale.
            </h2>
            <p className="text-slate-400 text-xs md:text-sm leading-relaxed max-w-2xl mx-auto font-sans">
              We engineered a premium, production-grade intelligence layer covering domain diagnostic extraction, contextual semantic memory graphs, objection decoding model pools, and automated response scheduling.
            </p>
          </div>

          {/* Interactive features list card grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "AI Lead Qualification",
                description: "Automatically analyzes website domains, technology stacks, corporate listings, and team sizes to verify candidate alignment in seconds.",
                icon: BrainCircuit,
                badge: "Gemini Core"
              },
              {
                title: "Pain Point Detection",
                description: "Proactively inspects targets' online systems for high-severity friction points including slow responses, layout faults, and missing SEO anchors.",
                icon: Target,
                badge: "Diagnostic Agent"
              },
              {
                title: "Personalized Outreach",
                description: "Forges rich, hyper-contextual draft communications detailing identified performance faults without generic template tags.",
                icon: Mail,
                badge: "High Deliverability"
              },
              {
                title: "Reply Intelligence",
                description: "Decodes prospective communications instantly for precise purchasing intent, tags incoming objections, and extracts budgets.",
                icon: MessageSquare,
                badge: "Semantic Engine"
              },
              {
                title: "Lead Memory Graph",
                description: "Holds exhaustive historical communication context, linking client conversations, specific objections, and pipeline metrics cleanly.",
                icon: Database,
                badge: "Neural Core"
              },
              {
                title: "Follow-Up Automation",
                description: "Schedules custom triggers to ensure unreplied candidate streams receive elegant value blocks at the absolute optimal threshold.",
                icon: Workflow,
                badge: "Autopilot Loop"
              }
            ].map((feat, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ y: -6, scale: 1.01 }}
                className="group bg-[#101114]/90 border border-white/5 rounded-3xl p-7 flex flex-col justify-between hover:bg-white/[0.02] hover:shadow-2xl transition-all duration-300 relative overflow-hidden text-left"
              >
                {/* Visual grid backdrop inside card */}
                <div className="absolute inset-0 bg-[radial-gradient(#1a1a24_1px,transparent_1px)] [background-size:16px_16px] opacity-25 pointer-events-none group-hover:opacity-40 transition-opacity" />

                <div className="space-y-6 relative z-10 text-left">
                  {/* Decorative glowing light beam in card corner */}
                  <div className="absolute -top-10 -right-10 w-24 h-24 bg-white/[0.01] rounded-full group-hover:bg-white/[0.04] blur-xl transition-all" />

                  {/* Icon Card Wrapper */}
                  <div className="w-12 h-12 rounded-2xl bg-[#050505] border border-white/5 flex items-center justify-center text-[#00D4FF] group-hover:text-white group-hover:scale-105 group-hover:border-white/10 transition-all duration-300">
                    <feat.icon size={20} className="transition-colors" />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="text-base font-bold text-white uppercase tracking-tight font-display">{feat.title}</h3>
                      <span className="text-[8px] font-mono tracking-widest uppercase px-2.5 py-0.5 rounded-full bg-white/5 border border-white/5 text-slate-400 font-bold">
                        {feat.badge}
                      </span>
                    </div>
                    <p className="text-slate-400 text-xs leading-relaxed font-sans">
                      {feat.description}
                    </p>
                  </div>
                </div>

                {/* Bottom line glow interactive hint */}
                <div className="absolute bottom-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#00D4FF]/0 to-transparent group-hover:via-[#00D4FF]/40 transition-all duration-500" />
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* Social Proof Statistics Section */}
      <section className="py-20 max-w-7xl mx-auto px-6 z-10 relative">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { stat: "80%", label: "Less Manual Work", desc: "Automate raw list imports and lead profiling completely on autopilot" },
            { stat: "3x", label: "Faster Qualification", desc: "Instantly score and isolate hot opportunities using cognitive agents" },
            { stat: "50%", label: "Faster Follow-Ups", desc: "Automatic reminders keeps every single warm dialog active" },
            { stat: "24/7", label: "AI Sales Assistant", desc: "Never sleep while incoming mail streams are decoded and parsed" }
          ].map((item, idx) => (
            <div key={idx} className="bg-[#101114] border border-white/5 rounded-3xl p-6 flex flex-col justify-between hover:border-white/10 transition-colors">
              <div className="space-y-2">
                <span className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#4F46E5] to-[#00D4FF] block">
                  {item.stat}
                </span>
                <span className="text-sm font-black text-white block uppercase tracking-tight">
                  {item.label}
                </span>
              </div>
              <p className="text-slate-500 text-[11px] mt-4 leading-normal">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Future Vision Matrix Section */}
      <section className="py-24 bg-[#0A0A0C] border-t border-white/5 z-10 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <span className="text-[10px] text-[#4F46E5] uppercase font-black tracking-widest block font-mono">Future Roadmap</span>
            <h2 className="text-3xl md:text-5xl font-black text-white leading-tight">The Horizon of Agency Intelligence</h2>
            <p className="text-slate-400 text-xs md:text-sm">
              We constantly extend our platform parameters to encompass modern multi-agent coordination, predictive converting curves, and alternative outbox integrations.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {[
              { label: "AI Voice Agent", desc: "Automated phone appointment setter logs and calendar bookings directly inside pipeline sheets." },
              { label: "WhatsApp Integration", desc: "Direct outreach pipelines using multi-conversational chat sequences for international customer blocks." },
              { label: "LinkedIn Connect Engine", desc: "Coordinates automated social graph updates and message dispatch tools natively." },
              { label: "Predictive Analytics", desc: "Formulates optimal contact hours and predicts conversion chances based on historic response vectors." },
              { label: "Multi-Agent Teams", desc: "Creates multiple AI agent personas coordinating and dividing prospecting tasks together." },
              { label: "Revenue Forecasting", desc: "Analyzes actual open inboxes and estimates forecasted ARR bounds in high-fidelity." }
            ].map((item, idx) => (
              <div key={idx} className="bg-[#101114] border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-colors">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00D4FF]" />
                  <h4 className="text-xs font-black text-white uppercase tracking-tight">{item.label}</h4>
                </div>
                <p className="text-slate-500 text-[10px] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-[#050505] relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <span className="text-[10px] text-[#00D4FF] uppercase font-black tracking-widest block font-mono">Predictable Investment</span>
            <h2 className="text-3xl md:text-5xl font-black text-white leading-tight">Plans designed to scale with your volume</h2>
            <p className="text-slate-400 text-xs md:text-sm">
              Upgrade your conversion pipeline speed. Choose the volume node that matches your client requirements. Clear pricing, no complex setup fees.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Plan 1: Starter */}
            <div className="bg-[#101114] border border-white/5 rounded-3xl p-8 flex flex-col justify-between hover:border-white/10 transition-colors relative">
              <div className="space-y-6">
                <div>
                  <span className="text-xs font-mono text-slate-500 uppercase tracking-widest block mb-2">Starter Node</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black text-white">$149</span>
                    <span className="text-xs text-slate-500 font-mono">/ month</span>
                  </div>
                </div>

                <p className="text-xs text-slate-400">
                  Ideal for rising consultants and small agency executors starting automatic qualification.
                </p>

                <div className="h-px bg-white/5" />

                <ul className="space-y-3 text-xs text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle size={14} className="text-[#00D4FF] shrink-0" />
                    <span>Up to 1,000 monthly lead scans</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle size={14} className="text-[#00D4FF] shrink-0" />
                    <span>Basic AI pain point diagnostics</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle size={14} className="text-[#00D4FF] shrink-0" />
                    <span>1 Connected Email Outbox</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle size={14} className="text-[#00D4FF] shrink-0" />
                    <span>Standard agency support</span>
                  </li>
                </ul>
              </div>

              <div className="pt-8">
                <button 
                  onClick={onEnterApp}
                  className="w-full py-3 bg-white/5 border border-white/10 hover:bg-white/[0.08] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all"
                >
                  Activate Starter Node
                </button>
              </div>
            </div>

            {/* Plan 2: Scale (Recommended) */}
            <div className="bg-[#101114] border-2 border-[#4F46E5] rounded-3xl p-8 flex flex-col justify-between hover:border-[#00D4FF] transition-colors relative shadow-[0_0_40px_rgba(79,70,229,0.15)]">
              {/* Highlight Badge */}
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-[#4F46E5] to-[#00D4FF] rounded-full text-[9px] font-black uppercase tracking-widest text-white shadow-lg">
                Most Popular Node
              </div>

              <div className="space-y-6">
                <div>
                  <span className="text-xs font-mono text-[#00D4FF] uppercase tracking-widest block mb-2">Scale Matrix</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black text-white">$399</span>
                    <span className="text-xs text-slate-500 font-mono">/ month</span>
                  </div>
                </div>

                <p className="text-xs text-slate-400">
                  Tailored for established outreach structures scaling multiple daily sequence touchpoints.
                </p>

                <div className="h-px bg-white/5" />

                <ul className="space-y-3 text-xs text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle size={14} className="text-[#00D4FF] shrink-0" />
                    <span>Up to 5,000 monthly lead scans</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle size={14} className="text-[#00D4FF] shrink-0" />
                    <span>Advanced AI qualification & models</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle size={14} className="text-[#00D4FF] shrink-0" />
                    <span>5 Connected Email Outboxes</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle size={14} className="text-[#00D4FF] shrink-0" />
                    <span>Priority follow-up loop engine</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle size={14} className="text-[#00D4FF] shrink-0" />
                    <span>Objection parsing & decoding metrics</span>
                  </li>
                </ul>
              </div>

              <div className="pt-8">
                <button 
                  onClick={onEnterApp}
                  className="w-full py-3 bg-gradient-to-r from-[#4F46E5] to-[#00D4FF] hover:brightness-110 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-[0_0_20px_rgba(79,70,229,0.3)]"
                >
                  Activate Scale Node
                </button>
              </div>
            </div>

            {/* Plan 3: Enterprise */}
            <div className="bg-[#101114] border border-white/5 rounded-3xl p-8 flex flex-col justify-between hover:border-white/10 transition-colors relative">
              <div className="space-y-6">
                <div>
                  <span className="text-xs font-mono text-slate-500 uppercase tracking-widest block mb-2">Enterprise Matrix</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black text-white">Custom</span>
                  </div>
                </div>

                <p className="text-xs text-slate-400">
                  Built to service large high-velocity organizations requiring high scale custom models.
                </p>

                <div className="h-px bg-white/5" />

                <ul className="space-y-3 text-xs text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle size={14} className="text-[#00D4FF] shrink-0" />
                    <span>Unlimited monthly scans & queries</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle size={14} className="text-[#00D4FF] shrink-0" />
                    <span>Fully dedicated cognitive agent pools</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle size={14} className="text-[#00D4FF] shrink-0" />
                    <span>Custom outbox node thresholds</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle size={14} className="text-[#00D4FF] shrink-0" />
                    <span>Dedicated account success architect</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle size={12} className="text-[#00D4FF] shrink-0" />
                    <span>Direct relational API & Webhook logs</span>
                  </li>
                </ul>
              </div>

              <div className="pt-8">
                <button 
                  onClick={() => {
                    const contactSection = document.getElementById("contact");
                    if (contactSection) {
                      contactSection.scrollIntoView({ behavior: "smooth" });
                    }
                  }}
                  className="w-full py-3 bg-white/5 border border-white/10 hover:bg-white/[0.08] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all"
                >
                  Contact Sales Architect
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 bg-[#0A0A0C] border-y border-white/5 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Column Info */}
            <div className="space-y-6 text-left">
              <span className="text-[10px] text-[#4F46E5] uppercase font-black tracking-widest block font-mono">Coordinated Network</span>
              <h2 className="text-3xl md:text-5xl font-black text-white leading-tight">Connect with our Lead Architects</h2>
              <p className="text-slate-400 text-xs md:text-sm leading-relaxed max-w-lg">
                Have specific volume triggers, custom system specifications, or enterprise integrations? Submit your request parameters and our AI platform managers will touch base to schedule an onboarding slot.
              </p>

              <div className="h-px bg-white/5 max-w-lg" />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mt-6">
                {/* Business Inquiries */}
                <div className="bg-[#101114] border border-white/5 p-5 rounded-2xl hover:border-[#00D4FF]/30 transition-all group">
                  <div className="w-9 h-9 rounded-xl bg-[#00D4FF]/10 border border-[#00D4FF]/20 flex items-center justify-center text-[#00D4FF] mb-4 group-hover:scale-105 transition-transform">
                    <Activity size={16} />
                  </div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider font-display">Business Inquiries</h4>
                  <p className="text-[11px] text-slate-500 mt-1.5 leading-relaxed">
                    For enterprise integrations, high volume contracts, or custom SLAs.
                  </p>
                  <a 
                    href="mailto:inquire@leadflow.ai" 
                    className="inline-flex items-center gap-1.5 text-[11px] font-mono text-[#00D4FF] mt-4 hover:underline"
                  >
                    inquire@leadflow.ai
                    <ArrowRight size={10} className="group-hover:translate-x-0.5 transition-transform" />
                  </a>
                </div>

                {/* Operations Support */}
                <div className="bg-[#101114] border border-white/5 p-5 rounded-2xl hover:border-indigo-500/30 transition-all group">
                  <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-4 group-hover:scale-105 transition-transform">
                    <ShieldCheck size={16} />
                  </div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider font-display">Technical Support</h4>
                  <p className="text-[11px] text-slate-500 mt-1.5 leading-relaxed">
                    24/7 developer assistance, API health checks, and platform operation.
                  </p>
                  <a 
                    href="mailto:support@leadflow.ai" 
                    className="inline-flex items-center gap-1.5 text-[11px] font-mono text-indigo-400 mt-4 hover:underline"
                  >
                    support@leadflow.ai
                    <ArrowRight size={10} className="group-hover:translate-x-0.5 transition-transform" />
                  </a>
                </div>
              </div>
            </div>

            {/* Right Column Interactive Form Card */}
            <div className="bg-[#101114] border border-white/5 rounded-[2.5rem] p-8 md:p-10 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#00D4FF]/5 rounded-full blur-3xl pointer-events-none -z-10" />

              {isSubmitted ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8 space-y-6"
                >
                  <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(16,185,129,0.15)]">
                    <CheckCircle size={32} />
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-2xl font-black text-white uppercase tracking-tight">Signal Sync Succeeded</h3>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                      Thank you, <span className="text-white font-bold">{contactName}</span>! Our lead intelligence architects have registered your agency size ({contactAgencySize}) and will respond to <span className="text-white font-bold">{contactEmail}</span> shortly.
                    </p>
                  </div>

                  <div className="h-px bg-white/5" />

                  <div className="flex flex-col sm:flex-row justify-center gap-3">
                    <button 
                      onClick={() => {
                        setContactName("");
                        setContactEmail("");
                        setContactMessage("");
                        setIsSubmitted(false);
                      }}
                      className="px-5 py-2.5 bg-white/5 hover:bg-white/[0.08] text-slate-400 hover:text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors border border-white/5"
                    >
                      Submit New Signal
                    </button>
                    <button
                      onClick={onEnterApp}
                      className="px-5 py-2.5 bg-gradient-to-r from-[#4F46E5] to-[#00D4FF] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all"
                    >
                      Open Live Console
                    </button>
                  </div>
                </motion.div>
              ) : (
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!contactName || !contactEmail) return;
                    setIsSubmitting(true);
                    setTimeout(() => {
                      setIsSubmitting(false);
                      setIsSubmitted(true);
                    }, 1200);
                  }}
                  className="space-y-5 text-left"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] text-slate-500 uppercase font-black tracking-widest font-mono">Full Name</label>
                      <input 
                        type="text" 
                        required
                        placeholder="John Doe"
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#00D4FF] focus:ring-1 focus:ring-[#00D4FF]/30 transition-all font-sans"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] text-slate-500 uppercase font-black tracking-widest font-mono">Business Email</label>
                      <input 
                        type="email" 
                        required
                        placeholder="john@agency.com"
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#00D4FF] focus:ring-1 focus:ring-[#00D4FF]/30 transition-all font-sans"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] text-slate-500 uppercase font-black tracking-widest font-mono">Agency Operations Scale</label>
                    <select
                      value={contactAgencySize}
                      onChange={(e) => setContactAgencySize(e.target.value)}
                      className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#00D4FF] transition-all font-sans"
                    >
                      <option value="1-10">1 to 10 Operators (Scaling Phase)</option>
                      <option value="11-50">11 to 50 Operators (Mid-Market Node)</option>
                      <option value="51-200">51 to 200 Operators (Sovereign Agency)</option>
                      <option value="200+">More than 200 (Enterprise Matrix)</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] text-slate-500 uppercase font-black tracking-widest font-mono">Inquiry Parameters</label>
                    <textarea 
                      rows={3}
                      placeholder="Specify your operational targets or custom integrations..."
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#00D4FF] focus:ring-1 focus:ring-[#00D4FF]/30 transition-all font-sans resize-none"
                    />
                  </div>

                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-gradient-to-r from-[#4F46E5] to-[#00D4FF] hover:brightness-110 disabled:brightness-75 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(79,70,229,0.25)] flex items-center justify-center gap-2 font-mono"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Transmitting Signals...</span>
                      </>
                    ) : (
                      <>
                        <span>Transmit Operations Signal</span>
                        <ArrowRight size={14} />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-28 max-w-7xl mx-auto px-6 relative text-center z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#4F46E5]/10 rounded-full blur-[140px] pointer-events-none -z-10" />

        <div className="max-w-3xl mx-auto space-y-8">
          <span className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/15 rounded-full text-[9px] uppercase tracking-widest text-[#00D4FF] font-black font-mono">
            Get Onboard in minutes
          </span>
          <h2 className="text-4xl md:text-6xl font-black tracking-tight text-white leading-normal">
            Stop Managing Leads. <br />
            Start Closing Deals.
          </h2>
          <p className="text-slate-400 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
            LeadFlow AI handles qualification, pain point discovery, dynamic personalized outreach, and reply decoding while your core team focuses entirely on growth.
          </p>
          
          <div className="pt-6 flex flex-col sm:flex-row justify-center gap-4">
            <button 
              onClick={onEnterApp}
              className="px-10 py-5 bg-gradient-to-r from-[#4F46E5] to-[#00D4FF] text-white hover:brightness-110 active:scale-95 transition-all font-bold text-sm tracking-wide uppercase shadow-[0_0_30px_rgba(79,70,229,0.45)] rounded-2xl"
            >
              Start Using LeadFlow AI
            </button>
            <button 
              onClick={onEnterApp}
              className="px-10 py-5 bg-[#101114] border border-white/5 text-slate-300 hover:bg-white/[0.04] transition-all font-bold text-sm tracking-wide uppercase rounded-2xl"
            >
              Book Demo
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#050505] border-t border-white/5 pt-20 pb-12 relative z-10 font-sans">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pb-16">
            
            {/* Column 1: Brand Details & Status */}
            <div className="space-y-6 text-left">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-tr from-[#4F46E5] to-[#00D4FF] rounded flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-white/95 rotate-45" />
                </div>
                <span className="text-lg font-black text-white uppercase tracking-tight font-display">
                  LeadFlow <span className="text-[#00D4FF] italic">AI</span>
                </span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed max-w-xs">
                Autonomous qualification engines and lead diagnostic layers designed to supercharge outbound operations for high-growth agencies.
              </p>
              {/* Pulsing Active Node Indicator */}
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/5 border border-emerald-500/10 rounded-full font-mono text-[9px] text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>ALL SYSTEMS OPERATIONAL (99.98% SLA)</span>
              </div>
            </div>

            {/* Column 2: Inquiries */}
            <div className="space-y-4 text-left">
              <h4 className="text-xs font-black uppercase text-white tracking-widest font-display">// Inquiries</h4>
              <ul className="space-y-2.5 text-xs">
                <li>
                  <a href="mailto:inquire@leadflow.ai" className="text-slate-400 hover:text-white transition-colors flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-slate-700" />
                    <span>inquire@leadflow.ai</span>
                  </a>
                </li>
                <li>
                  <a href="#" onClick={(e) => { e.preventDefault(); onEnterApp(); }} className="text-slate-400 hover:text-white transition-colors flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-slate-700" />
                    <span>Agency Programs</span>
                  </a>
                </li>
                <li>
                  <a href="#" onClick={(e) => { e.preventDefault(); onEnterApp(); }} className="text-slate-400 hover:text-white transition-colors flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-slate-700" />
                    <span>Enterprise SLA Terms</span>
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 3: Operations & Support */}
            <div className="space-y-4 text-left">
              <h4 className="text-xs font-black uppercase text-white tracking-widest font-display">// Support Portal</h4>
              <ul className="space-y-2.5 text-xs">
                <li>
                  <a href="mailto:support@leadflow.ai" className="text-slate-400 hover:text-white transition-colors flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-slate-700" />
                    <span>support@leadflow.ai</span>
                  </a>
                </li>
                <li>
                  <a href="#" onClick={(e) => { e.preventDefault(); onEnterApp(); }} className="text-slate-400 hover:text-white transition-colors flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-slate-700" />
                    <span>System manuals</span>
                  </a>
                </li>
                <li>
                  <a href="#" onClick={(e) => { e.preventDefault(); onEnterApp(); }} className="text-slate-400 hover:text-white transition-colors flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-slate-700" />
                    <span>Developer APIs</span>
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 4: Platform Index */}
            <div className="space-y-4 text-left">
              <h4 className="text-xs font-black uppercase text-white tracking-widest font-display">// Directory</h4>
              <ul className="space-y-2.5 text-xs">
                <li>
                  <a href="#" onClick={(e) => { e.preventDefault(); onEnterApp(); }} className="text-slate-400 hover:text-white transition-colors">Core Features</a>
                </li>
                <li>
                  <a href="#" onClick={(e) => { e.preventDefault(); onEnterApp(); }} className="text-slate-400 hover:text-white transition-colors">Language Models</a>
                </li>
                <li>
                  <a href="#" onClick={(e) => { e.preventDefault(); onEnterApp(); }} className="text-slate-400 hover:text-white transition-colors">Pricing Matrix</a>
                </li>
                <li>
                  <a href="#" onClick={(e) => { e.preventDefault(); onEnterApp(); }} className="text-slate-400 hover:text-white transition-colors">Architect Console</a>
                </li>
              </ul>
            </div>

          </div>

          <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-[10px] text-slate-600 font-mono tracking-wider uppercase">
              © 2026 LeadFlow AI. All Rights Reserved. Fully Encrypted Node Connection.
            </p>
            <div className="flex gap-6 text-[10px] text-slate-500 font-mono tracking-widest uppercase">
              <a href="#" onClick={(e) => e.preventDefault()} className="hover:text-slate-300 transition-colors">Privacy Standard</a>
              <a href="#" onClick={(e) => e.preventDefault()} className="hover:text-slate-300 transition-colors">Terms of Operations</a>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
