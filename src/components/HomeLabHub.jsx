import React from "react";
import { motion } from "framer-motion";
import { Server, ExternalLink, Download, Layers } from "lucide-react";
import { homeLabData } from "../data/hubsData";

export default function HomeLabHub() {
  const getIconForCategory = (cat) => {
    switch (cat) {
      case "Hypervisors": return <Layers className="w-4.5 h-4.5 text-indigo-400" />;
      case "Official OS Evaluation ISOs": return <Download className="w-4.5 h-4.5 text-indigo-400" />;
      case "Network Simulation": return <Server className="w-4.5 h-4.5 text-indigo-400" />;
      default: return <Server className="w-4.5 h-4.5 text-indigo-400" />;
    }
  };

  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="bg-slate-900/40 backdrop-blur-md border border-indigo-500/20 rounded-2xl p-6 flex flex-col gap-5 shadow-lg"
    >
      <div className="border-b border-slate-800 pb-3">
        <h3 className="font-extrabold text-sm text-slate-100 flex items-center gap-2">
          <Server className="w-4.5 h-4.5 text-indigo-400 animate-pulse" />
          The Home Lab & Hypervisors Sandbox Hub
        </h3>
        <p className="text-xs text-slate-400 mt-1">
          Dedicated UI grid block for setting up a local engineering environment.
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {homeLabData.map((categoryGroup, index) => (
          <div key={index} className="flex flex-col gap-3 bg-slate-950/40 p-4 rounded-xl border border-slate-800/60">
            <h4 className="font-bold text-xs text-indigo-300 flex items-center gap-2 border-b border-slate-800/50 pb-2">
              {getIconForCategory(categoryGroup.category)}
              {categoryGroup.category}
            </h4>
            <div className="flex flex-col gap-3 mt-1">
              {categoryGroup.items.map((item, i) => (
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  key={i} 
                  className="bg-slate-900/80 border border-slate-800 p-3 rounded-lg flex flex-col justify-between hover:border-indigo-500/50 transition-all duration-300 group"
                >
                  <div className="mb-2">
                    <span className="font-extrabold text-[13px] text-slate-200 block mb-1 group-hover:text-indigo-300 transition-colors">{item.name}</span>
                    <p className="text-[11px] text-slate-400 leading-relaxed">{item.desc}</p>
                  </div>
                  <a 
                    href={item.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[10px] font-bold text-slate-350 hover:text-white flex items-center justify-center gap-1 py-1.5 bg-slate-950 border border-slate-800 rounded-md hover:bg-indigo-500/10 hover:border-indigo-500/20 transition-all cursor-pointer mt-2"
                  >
                    <span>تحميل / تنزيل</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </motion.section>
  );
}
