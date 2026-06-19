import { useState, useRef, useEffect } from "react";
import { 
  LayoutDashboard, 
  Users, 
  Trello, 
  Settings, 
  Mail, 
  BrainCircuit, 
  Calendar, 
  Building, 
  LogOut, 
  ShieldCheck 
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface SidebarProps {
  currentView: string;
  onViewChange: (view: string) => void;
  user: any;
  agency: any;
  logout: () => void;
}

export function Sidebar({ currentView, onViewChange, user, agency, logout }: SidebarProps) {
  const [profileOpen, setProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "leads", label: "Leads", icon: Users },
    { id: "pipeline", label: "Pipeline", icon: Trello },
    { id: "outreach", label: "Outreach", icon: Mail },
    { id: "replies", label: "Analysis", icon: BrainCircuit },
    { id: "followup", label: "Follow-ups", icon: Calendar },
    { id: "setup", label: "Setup", icon: Settings },
  ];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <nav className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-[#070709]/85 backdrop-blur-md z-40 shrink-0 relative">
      {/* Brand Launcher Icon */}
      <button 
        onClick={() => onViewChange("landing")}
        className="flex items-center gap-3 group text-left hover:opacity-90 active:scale-95 transition-all outline-none cursor-pointer"
        title="Go to Landing Page"
      >
        <div className="w-8 h-8 bg-gradient-to-tr from-[#4F46E5] to-[#00D4FF] rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(79,70,229,0.35)] group-hover:scale-105 transition-transform duration-300">
          <div className="w-4 h-4 border-2 border-white/90 rotate-45"></div>
        </div>
        <h1 className="text-base font-black tracking-widest text-white uppercase select-none font-mono">
          LeadFlow<span className="text-[#00D4FF] italic font-sans font-medium lowercase">.ai</span>
        </h1>
      </button>

      {/* Main Responsive Navigation Tabs */}
      <div className="flex gap-2 text-xs font-bold uppercase tracking-wider h-full items-center">
        {menuItems.map((item) => {
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`relative transition-all px-4 py-2 rounded-xl text-[10px] font-mono cursor-pointer flex items-center gap-2 ${
                isActive 
                  ? "text-white bg-white/[0.04] border border-white/10" 
                  : "text-slate-400 hover:text-white hover:bg-white/[0.02] border border-transparent"
              }`}
            >
              <item.icon size={13} className={isActive ? "text-[#00D4FF]" : "text-slate-500"} />
              <span>{item.label}</span>
              
              {isActive && (
                <motion.div 
                  layoutId="sidebarActiveIndicator"
                  className="absolute bottom-[-15px] left-4 right-4 h-[2px] bg-gradient-to-r from-[#4F46E5] to-[#00D4FF] rounded-full shadow-[0_0_8px_rgba(0,212,255,0.6)]"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Right User Profile Node with Interactive Dropdown Container */}
      <div className="flex items-center gap-4 relative" ref={dropdownRef}>
        <div className="h-8 w-px bg-white/10"></div>
        
        {/* Toggle button */}
        <button
          onClick={() => setProfileOpen(!profileOpen)}
          className="flex items-center gap-3 hover:opacity-95 active:scale-[0.98] transition-all cursor-pointer focus:outline-none p-1 rounded-2xl border border-transparent hover:border-white/5 hover:bg-white/[0.02]"
        >
          <span className="text-xs text-right hidden sm:block">
            <div className="text-white font-semibold flex items-center gap-1.5 justify-end">
              <span>{user?.displayName || "Operator"}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <div className="text-slate-500 font-mono text-[9px] uppercase tracking-widest mt-0.5">
              {agency?.name || "Booting System"}
            </div>
          </span>

          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#4F46E5] to-[#00D4FF] p-[1.5px] shadow-[0_0_15px_rgba(79,70,229,0.25)] overflow-hidden">
            <div className="w-full h-full rounded-full bg-[#050505] overflow-hidden flex items-center justify-center">
              {user?.photoURL ? (
                <img 
                  src={user.photoURL} 
                  alt="Avatar" 
                  referrerPolicy="no-referrer" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-xs font-black text-white uppercase font-mono">
                  {(user?.email || user?.displayName || "OP")[0]}
                </span>
              )}
            </div>
          </div>
        </button>

        {/* Dropdown Card */}
        <AnimatePresence>
          {profileOpen && (
            <motion.div
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="absolute right-0 top-14 w-80 bg-[#101114] border border-white/10 rounded-[2rem] p-6 shadow-2xl z-[99] text-left overflow-hidden"
            >
              {/* Micro-glow atmospheric layout highlights */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#4F46E5]/10 rounded-full blur-2xl pointer-events-none -z-10" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#00D4FF]/5 rounded-full blur-xl pointer-events-none -z-10" />

              <div className="space-y-5">
                {/* User Identity Details */}
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#4F46E5] to-[#00D4FF] p-[1.5px] shadow-lg shrink-0 overflow-hidden">
                    <div className="w-full h-full rounded-2xl bg-[#09090b] overflow-hidden flex items-center justify-center">
                      {user?.photoURL ? (
                        <img 
                          src={user.photoURL} 
                          alt="Avatar" 
                          referrerPolicy="no-referrer" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-lg font-black text-white uppercase font-mono">
                          {(user?.email || user?.displayName || "U")[0]}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-0.5">
                    <div className="font-black text-white text-sm uppercase tracking-tight">
                      {user?.displayName || "Agent Operator"}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono break-all leading-tight">
                      {user?.email || "operator@leadflow.ai"}
                    </div>
                    <span className="inline-block px-1.5 py-0.5 bg-indigo-500/10 border border-indigo-500/15 rounded text-[8px] font-mono text-indigo-400 uppercase tracking-wider font-bold">
                      Account Owner
                    </span>
                  </div>
                </div>

                <div className="h-px bg-white/5" />

                {/* Agency Core Node Metrics */}
                <div className="space-y-2 text-xs">
                  <span className="text-[9px] text-slate-500 font-mono uppercase tracking-widest block font-bold">Active Agency Node</span>
                  
                  <div className="bg-[#050505] border border-white/5 p-3 rounded-2xl space-y-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-orange-500/10 border border-orange-500/15 flex items-center justify-center text-orange-400 shrink-0">
                        <Building size={12} />
                      </div>
                      <div className="text-left font-sans">
                        <span className="text-[9px] text-slate-500 uppercase font-mono block leading-none">Enterprise Entity</span>
                        <span className="font-bold text-white text-xs block truncate max-w-[180px] mt-0.5">
                          {agency?.name || "Unconfigured Workspace"}
                        </span>
                      </div>
                    </div>

                    <div className="pt-1.5 border-t border-white/5 flex items-center justify-between font-mono text-[9px] text-slate-400">
                      <span>Status: <span className="text-emerald-400 font-bold uppercase font-sans">Active</span></span>
                      <span>Target: <span className="text-slate-300 font-bold">{agency?.targetServices || "SaaS Sales Integration"}</span></span>
                    </div>
                  </div>
                </div>

                {/* Secure status bar */}
                <div className="flex items-center gap-2 text-[10px] text-slate-500 px-1 font-mono leading-tight">
                  <ShieldCheck size={12} className="text-[#00D4FF]" />
                  <span>Verified Secure Console Node</span>
                </div>

                <div className="h-px bg-white/5" />

                {/* Sign-Out Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setProfileOpen(false);
                    logout();
                  }}
                  className="w-full py-2.5 bg-red-400/5 hover:bg-red-500/10 hover:text-red-400 border border-red-500/10 hover:border-red-500/20 text-slate-400 transition-colors text-[10px] font-bold uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 font-mono cursor-pointer"
                >
                  <LogOut size={13} strokeWidth={2.5} />
                  <span>Terminate Node Session</span>
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
