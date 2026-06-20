import React from "react";
import { X, CheckCircle, Wrench, Award, Book, BookOpen } from "lucide-react";
import { roadmapData } from "../data/roadmapData";
import BadgesSection from "../components/BadgesSection";
import { motion, AnimatePresence } from "framer-motion";

export default function Sidebar({
  sidebarOpen,
  setSidebarOpen,
  getPhaseCompletionStats,
  earnedBadges,
  handleScrollTo
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
            <span className="font-black text-slate-200 text-sm tracking-tight">مراحل الخريطة</span>
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
            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-2 pr-2">أقسام الخطة الدراسية</div>
            {roadmapData.map((phase, index) => {
              const { percent } = getPhaseCompletionStats(phase);
              const isDone = percent === 100;
              
              return (
                <motion.button 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.02, x: -5 }}
                  whileTap={{ scale: 0.98 }}
                  key={phase.id}
                  onClick={() => handleScrollTo(phase.id)}
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
                      <span className="text-xs font-bold text-slate-300 group-hover:text-cyan-400 transition-colors">
                        {phase.shortTitle}
                      </span>
                    </div>
                    
                    {isDone ? (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring" }}
                      >
                        <CheckCircle className="w-4 h-4 text-emerald-400 drop-shadow-[0_0_5px_rgba(52,211,153,0.8)]" />
                      </motion.div>
                    ) : (
                      <span className="font-mono text-[10px] font-bold text-slate-500">{percent}%</span>
                    )}
                  </div>
                  {/* Small progress line */}
                  <div className="w-full bg-slate-900/80 h-1 rounded-full mt-1.5 overflow-hidden border border-slate-800/50">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${percent}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className={`h-full rounded-full shadow-[0_0_8px_currentColor] ${
                        isDone ? "bg-emerald-400 text-emerald-400" : "bg-cyan-500 text-cyan-500"
                      }`}
                    />
                  </div>
                </motion.button>
              );
            })}
            
            <div className="w-full h-px bg-slate-800/60 my-4" />
            
            {[
              { id: "tools", icon: Wrench, label: "أوامر وأدوات المساعدة" },
              { id: "certifications", icon: Award, label: "متتبع الشهادات الدولية" },
              { id: "courses-hub", icon: Book, label: "جدول المسارات الشامل" },
              { id: "reference-hub", icon: BookOpen, label: "حقيبة النينجا المرجعية" }
            ].map((item, idx) => (
              <motion.button 
                key={item.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: (roadmapData.length + idx) * 0.05 }}
                whileHover={{ scale: 1.02, x: -5, backgroundColor: "rgba(15, 23, 42, 0.8)" }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleScrollTo(item.id)}
                className="flex items-center gap-2.5 p-3 rounded-xl border border-transparent hover:border-slate-700/50 text-slate-300 hover:text-cyan-400 text-right cursor-pointer text-xs font-bold transition-all"
              >
                <item.icon className="w-4.5 h-4.5 text-slate-400" />
                <span>{item.label}</span>
              </motion.button>
            ))}

            <div className="mt-4">
              <BadgesSection earnedBadges={earnedBadges} />
            </div>
          </nav>
        </div>
      </motion.aside>
    </AnimatePresence>
  );
}
