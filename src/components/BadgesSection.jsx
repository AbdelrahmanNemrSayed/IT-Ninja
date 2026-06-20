import React from "react";
import { roadmapData } from "../data/roadmapData";
import { badgeNames } from "../utils/constants";

export default function BadgesSection({ earnedBadges }) {
  return (
    <div className="mt-4 border-t border-slate-900 pt-4">
      <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-2.5 pr-2">شارات النينجا المكتسبة ({earnedBadges.length}/12)</div>
      <div className="grid grid-cols-4 gap-2">
        {roadmapData.map((phase, index) => {
          const isEarned = earnedBadges.includes(phase.id);
          const details = badgeNames[phase.id] || { title: "شارة", sub: "" };
          const colIndex = index % 4;

          const tooltipAlignClass = 
            colIndex === 0 
              ? "right-0 origin-bottom-right" 
              : colIndex === 3 
                ? "left-0 origin-bottom-left" 
                : "left-1/2 -translate-x-1/2 origin-bottom";

          const caretAlignClass = 
            colIndex === 0 
              ? "right-[18px]" 
              : colIndex === 3 
                ? "left-[18px]" 
                : "left-1/2 -translate-x-1/2";

          return (
            <div 
              key={phase.id}
              className={`w-11 h-11 rounded-lg flex items-center justify-center border text-lg relative group transition-all duration-300 ${
                isEarned 
                  ? "bg-slate-900 border-emerald-500/30 text-slate-100 shadow-md shadow-emerald-500/5 hover:scale-110 hover:border-emerald-400 cursor-pointer" 
                  : "bg-slate-950/40 border-slate-900 text-slate-700 hover:border-slate-800 hover:scale-110 cursor-help"
              }`}
            >
              <span className={`transition-opacity duration-300 select-none ${isEarned ? "opacity-100" : "opacity-30 group-hover:opacity-60"}`}>
                {details.title.split(" ").slice(-1)[0]}
              </span>
              
              {/* Custom Animated Tooltip */}
              <div 
                className={`absolute bottom-full mb-2.5 z-50 pointer-events-none w-44 bg-slate-950 border border-slate-800/80 rounded-xl p-3 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.7)] text-right transition-all duration-200 invisible opacity-0 scale-95 translate-y-1 group-hover:visible group-hover:opacity-100 group-hover:scale-100 group-hover:translate-y-0 ${tooltipAlignClass}`}
              >
                <div className="text-[11px] font-extrabold text-slate-100 tracking-tight leading-normal">
                  {details.title}
                </div>
                <div className="text-[9px] text-slate-500 font-bold font-mono mt-0.5 uppercase tracking-wide">
                  {details.sub}
                </div>
                <div className="h-px bg-slate-900 my-2" />
                <div className="flex items-center justify-end gap-1.5 text-[9px] font-bold">
                  {isEarned ? (
                    <>
                      <span className="text-emerald-400">تم الحصول عليها</span>
                      <span className="text-xs">✅</span>
                    </>
                  ) : (
                    <>
                      <span className="text-slate-500">لم تكتمل بعد</span>
                      <span className="text-xs">🔒</span>
                    </>
                  )}
                </div>

                {/* Arrow Caret */}
                <div 
                  className={`absolute -bottom-1 w-2 h-2 bg-slate-950 border-r border-b border-slate-800/80 rotate-45 ${caretAlignClass}`}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
