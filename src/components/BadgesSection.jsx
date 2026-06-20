import React from "react";
import { roadmapData } from "../data/roadmapData";
import { badgeNames } from "../utils/constants";

export default function BadgesSection({ earnedBadges }) {
  return (
    <div className="mt-4 border-t border-slate-900 pt-4">
      <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-2.5 pr-2">شارات النينجا المكتسبة ({earnedBadges.length}/12)</div>
      <div className="grid grid-cols-4 gap-2">
        {roadmapData.map((phase) => {
          const isEarned = earnedBadges.includes(phase.id);
          const details = badgeNames[phase.id] || { title: "شارة", sub: "" };
          return (
            <div 
              key={phase.id}
              title={`${details.title} (${details.sub})`}
              className={`w-11 h-11 rounded-lg flex items-center justify-center border text-base relative group transition-all duration-300 ${
                isEarned 
                  ? "bg-slate-900 border-emerald-500/30 text-slate-100 shadow-md shadow-emerald-500/5 hover:scale-105" 
                  : "bg-slate-950/45 border-slate-900 text-slate-700 opacity-40"
              }`}
            >
              <span className="cursor-default">{details.title.split(" ").slice(-1)[0]}</span>
              {/* Tooltip */}
              <div className="absolute right-full mr-2 z-50 hidden group-hover:block w-40 bg-slate-900 border border-slate-800 rounded-lg p-2 shadow-xl pointer-events-none text-right">
                <div className="text-[10px] font-bold text-slate-100">{details.title}</div>
                <div className="text-[8px] text-slate-500 font-mono font-bold mt-0.5">{details.sub}</div>
                <div className="text-[8px] mt-1 text-slate-400">
                  {isEarned ? "✅ تم الحصول عليها" : "🔒 لم تكتمل بعد"}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
