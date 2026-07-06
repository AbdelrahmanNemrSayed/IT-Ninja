import React from "react";
import { X, CheckCircle, Wrench, Award, Book, BookOpen, LayoutDashboard, Database } from "lucide-react";
import { roadmapData } from "../data/roadmapData";
import BadgesSection from "../components/ui/BadgesSection";
import { motion, AnimatePresence } from "framer-motion";

export default function Sidebar({
  sidebarOpen,
  setSidebarOpen,
  getPhaseCompletionStats,
  earnedBadges,
  handleScrollTo,
  activeView,
  setActiveView
}) {
  return (
    <AnimatePresence>
      <motion.aside 
        initial={false}
        animate={{ 
          x: sidebarOpen ? 0 : "100%",
          opacity: 1
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={`
          fixed inset-y-0 right-0 z-50 w-72 bg-slate-950/80 backdrop-blur-xl border-l border-slate-800/60 p-5 lg:relative lg:inset-auto lg:transform-none lg:w-64 lg:p-0 lg:border-l-0 lg:z-auto lg:translate-x-0 lg:bg-transparent shadow-[-10px_0_30px_rgba(0,0,0,0.5)] lg:shadow-none
        `}
      >
        <div className="sticky top-28 flex flex-col gap-4">
          <div className="flex items-center justify-between lg:hidden border-b border-slate-800/60 pb-3 mb-2">
            <span className="font-black text-slate-200 text-sm tracking-tight">التنقل والقائمة</span>
            <motion.button 
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setSidebarOpen(false)} 
              className="text-slate-400 hover:text-cyan-400 p-1 rounded-lg bg-slate-900 border border-slate-800" 
              aria-label="إغلاق القائمة"
            >
              <X className="w-4 h-4" />
            </motion.button>
          </div>
          
          <nav className="flex flex-col gap-1.5 max-h-[80vh] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
            {/* Core Pages Tabs */}
            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-2 pr-2">أقسام المنصة الرئيسية</div>
            
            {[
              { id: "roadmap", label: "خريطة الطريق والمسار", icon: LayoutDashboard },
              { id: "tools", label: "أدوات ومحاكيات النينجا", icon: Wrench },
              { id: "reference", label: "الحقيبة المرجعية والأوامر", icon: BookOpen },
              { id: "analytics", label: "تحليلات الأداء واليوميات", icon: Award }
            ].map(tab => (
              <motion.button
                key={tab.id}
                onClick={() => {
                  setActiveView(tab.id);
                  setSidebarOpen(false);
                }}
                className={`flex items-center gap-2.5 p-3 rounded-xl border text-right cursor-pointer text-xs font-bold transition-all ${
                  activeView === tab.id
                    ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.15)]"
                    : "bg-transparent border-transparent hover:border-slate-800 text-slate-400 hover:text-slate-200"
                }`}
              >
                <tab.icon className={`w-4.5 h-4.5 ${activeView === tab.id ? "text-cyan-400" : "text-slate-500"}`} />
                <span>{tab.label}</span>
              </motion.button>
            ))}

            <div className="w-full h-px bg-slate-800/60 my-4" />

            {/* Render Roadmap Phases shortcuts only if in Roadmap tab */}
            {activeView === "roadmap" && (
              <>
                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-2 pr-2">مراحل خريطة الطريق</div>
                {roadmapData.map((phase, index) => {
                  const { percent } = getPhaseCompletionStats(phase);
                  const isDone = percent === 100;
                  
                  return (
                    <motion.button 
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.03 }}
                      whileHover={{ scale: 1.02, x: -5 }}
                      whileTap={{ scale: 0.98 }}
                      key={phase.id}
                      onClick={() => {
                        handleScrollTo(phase.id);
                        setSidebarOpen(false);
                      }}
                      className="flex flex-col gap-1 text-right p-2.5 rounded-xl border border-transparent hover:bg-slate-900/80 hover:border-slate-700/50 hover:shadow-[0_0_10px_rgba(6,182,212,0.1)] transition-all group cursor-pointer"
                    >
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-2">
                          <span className={`text-[9px] px-1.5 py-0.5 rounded font-black shadow-inner ${
                            isDone 
                              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" 
                              : "bg-slate-900 text-slate-400 border border-slate-800"
                          }`}>
                            {phase.phaseNumber}
                          </span>
                          <span className="text-xs font-bold text-slate-350 group-hover:text-cyan-400 transition-colors">
                            {phase.shortTitle}
                          </span>
                        </div>
                        
                        {isDone ? (
                          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }}>
                            <CheckCircle className="w-4 h-4 text-emerald-400" />
                          </motion.div>
                        ) : (
                          <span className="font-mono text-[10px] font-bold text-slate-500">{percent}%</span>
                        )}
                      </div>
                      <div className="w-full bg-slate-900/80 h-1 rounded-full mt-1.5 overflow-hidden border border-slate-800/50">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${percent}%` }}
                          transition={{ duration: 0.8, ease: "easeOut" }}
                          className={`h-full rounded-full ${
                            isDone ? "bg-emerald-400 text-emerald-400" : "bg-cyan-500 text-cyan-500"
                          }`}
                        />
                      </div>
                    </motion.button>
                  );
                })}
              </>
            )}
            
            <div className="mt-4">
              <BadgesSection earnedBadges={earnedBadges} />
            </div>
          </nav>
        </div>
      </motion.aside>
    </AnimatePresence>
  );
}
