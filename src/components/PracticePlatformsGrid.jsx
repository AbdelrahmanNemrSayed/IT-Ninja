import React from "react";
import { motion } from "framer-motion";
import { Target, ExternalLink } from "lucide-react";
import { practicePlatformsData } from "../data/hubsData";

export default function PracticePlatformsGrid() {
  const getAccentColors = (accent) => {
    switch(accent) {
      case 'emerald': return 'border-emerald-500/20 hover:border-emerald-500/50 hover:shadow-emerald-500/20 text-emerald-400';
      case 'red': return 'border-rose-500/20 hover:border-rose-500/50 hover:shadow-rose-500/20 text-rose-400';
      case 'blue': return 'border-blue-500/20 hover:border-blue-500/50 hover:shadow-blue-500/20 text-blue-400';
      case 'cyan': return 'border-cyan-500/20 hover:border-cyan-500/50 hover:shadow-cyan-500/20 text-cyan-400';
      case 'slate': default: return 'border-slate-500/20 hover:border-slate-400/50 hover:shadow-slate-400/20 text-slate-300';
    }
  };

  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-slate-900/40 backdrop-blur-md border border-slate-800/80 rounded-2xl p-6 flex flex-col gap-5 shadow-lg"
    >
      <div className="border-b border-slate-800 pb-3 text-right">
        <h3 className="font-extrabold text-sm text-slate-100 flex items-center justify-start gap-2">
          <Target className="w-4.5 h-4.5 text-rose-400 animate-pulse" />
          مواقع ومنصات التطبيق التفاعلي (Interactive Training Sites)
        </h3>
        <p className="text-xs text-slate-400 mt-1">
          مواقع عملية لتعلم واختبار مهارات لينكس، الشبكات، واختبار الاختراق.
        </p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-right">
        {practicePlatformsData.map((item, index) => {
          const accentStyles = getAccentColors(item.accent);
          return (
            <motion.a 
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.01 }}
              key={index} 
              className={`bg-slate-950/80 border p-5 rounded-xl flex flex-col justify-between transition-all duration-300 cursor-pointer shadow-lg hover:shadow-[0_0_20px_rgba(0,0,0,0)] ${accentStyles.split('text-')[0]}`}
            >
              <div className="mb-4">
                <span className={`font-extrabold text-sm block mb-1.5 ${accentStyles.split(' ').pop()}`}>{item.name}</span>
                <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
              <div className="flex items-center justify-start gap-1.5 text-[11px] font-bold text-slate-500 mt-2">
                <span>ابدأ التدريب الآن</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </div>
            </motion.a>
          );
        })}
      </div>
    </motion.section>
  );
}
