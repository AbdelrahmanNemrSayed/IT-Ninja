import React from "react";
import { X, CheckCircle, Wrench, Award, Book, BookOpen } from "lucide-react";
import { roadmapData } from "../data/roadmapData";
import BadgesSection from "../components/BadgesSection";

export default function Sidebar({
  sidebarOpen,
  setSidebarOpen,
  getPhaseCompletionStats,
  earnedBadges,
  handleScrollTo
}) {
  return (
    <aside className={`
      fixed inset-y-0 right-0 z-50 w-72 bg-slate-950 border-l border-slate-900 p-5 transform transition-transform duration-300 ease-in-out lg:relative lg:inset-auto lg:transform-none lg:w-64 lg:p-0 lg:border-l-0 lg:z-auto
      ${sidebarOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"}
    `}>
      <div className="sticky top-40 flex flex-col gap-4">
        <div className="flex items-center justify-between lg:hidden border-b border-slate-900 pb-3 mb-2">
          <span className="font-bold text-slate-400 text-sm">مراحل خريطة الطريق</span>
          <button onClick={() => setSidebarOpen(false)} className="text-slate-400 hover:text-white" aria-label="إغلاق القائمة">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <nav className="flex flex-col gap-1.5 max-h-[75vh] overflow-y-auto pr-1">
          <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-2 pr-2">أقسام الخطة الدراسية</div>
          {roadmapData.map((phase) => {
            const { percent } = getPhaseCompletionStats(phase);
            const isDone = percent === 100;
            
            return (
              <button 
                key={phase.id}
                onClick={() => handleScrollTo(phase.id)}
                className="flex flex-col gap-1 text-right p-2 rounded-lg border border-transparent hover:bg-slate-900/60 hover:border-slate-800 transition-all group cursor-pointer"
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2">
                    <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold ${
                      isDone 
                        ? "bg-emerald-500/20 text-emerald-300" 
                        : "bg-slate-900 text-slate-400"
                    }`}>
                      {phase.phaseNumber}
                    </span>
                    <span className="text-xs font-bold text-slate-350 group-hover:text-cyan-400 transition-colors">
                      {phase.shortTitle}
                    </span>
                  </div>
                  
                  {isDone ? (
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <span className="font-mono text-[10px] text-slate-500">{percent}%</span>
                  )}
                </div>
                {/* Small progress line */}
                <div className="w-full bg-slate-900 h-0.5 rounded-full mt-1.5 overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-300 ${
                      isDone ? "bg-emerald-400" : "bg-cyan-500"
                    }`}
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </button>
            );
          })}
          
          <div className="w-full h-px bg-slate-900 my-3" />
          
          <button 
            onClick={() => handleScrollTo("tools")}
            className="flex items-center gap-2 p-2.5 rounded-lg hover:bg-slate-900 text-slate-300 hover:text-slate-100 text-right cursor-pointer text-xs font-bold font-sans"
          >
            <Wrench className="w-4 h-4 text-slate-400" />
            <span>أوامر وأدوات المساعدة</span>
          </button>
          
          <button 
            onClick={() => handleScrollTo("certifications")}
            className="flex items-center gap-2 p-2.5 rounded-lg hover:bg-slate-900 text-slate-300 hover:text-slate-100 text-right cursor-pointer text-xs font-bold font-sans"
          >
            <Award className="w-4 h-4 text-slate-400" />
            <span>متتبع الشهادات الدولية</span>
          </button>

          <button 
            onClick={() => handleScrollTo("courses-hub")}
            className="flex items-center gap-2 p-2.5 rounded-lg hover:bg-slate-900 text-slate-300 hover:text-slate-100 text-right cursor-pointer text-xs font-bold font-sans"
          >
            <Book className="w-4 h-4 text-slate-400" />
            <span>جدول المسارات الشامل</span>
          </button>

          <button 
            onClick={() => handleScrollTo("reference-hub")}
            className="flex items-center gap-2 p-2.5 rounded-lg hover:bg-slate-900 text-slate-300 hover:text-slate-100 text-right cursor-pointer text-xs font-bold font-sans"
          >
            <BookOpen className="w-4 h-4 text-slate-400" />
            <span>حقيبة النينجا المرجعية</span>
          </button>

          <BadgesSection earnedBadges={earnedBadges} />
        </nav>
      </div>
    </aside>
  );
}
