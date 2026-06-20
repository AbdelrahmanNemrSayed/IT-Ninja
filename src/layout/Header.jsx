import React from "react";
import { X, Menu, Download, Upload, RotateCcw } from "lucide-react";
import { totalCheckboxes } from "../utils/constants";
import { motion } from "framer-motion";
import { useProfile } from "../context/ProfileContext";

export default function Header({ 
  globalProgressPercent, 
  completedCount, 
  sidebarOpen, 
  setSidebarOpen,
  activeFilter,
  setActiveFilter,
  exportBackup,
  importBackup,
  resetAllProgress,
  onOpenProfileModal
}) {
  const { activeProfile } = useProfile();
  return (
    <motion.header 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="sticky top-0 z-40 bg-slate-950/70 backdrop-blur-xl border-b border-slate-800/50 shadow-lg shadow-slate-950/20"
    >
      {/* Progress Bar */}
      <div className="w-full bg-slate-900/50 h-1.5 relative overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${globalProgressPercent}%` }}
          transition={{ duration: 1, ease: "easeInOut" }}
          className="bg-gradient-to-r from-emerald-500 via-cyan-500 to-emerald-400 h-full shadow-[0_0_10px_rgba(16,185,129,0.5)]"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden text-slate-400 hover:text-cyan-400 p-1 rounded-lg focus:outline-none transition-colors"
            aria-label="القائمة الجانبية"
          >
            {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </motion.button>
          
          <div className="flex items-center gap-3">
            <motion.img 
              whileHover={{ rotate: 5, scale: 1.05 }}
              src="/logo.png" 
              alt="IT Ninja Logo" 
              className="w-9 h-9 rounded-xl shadow-[0_0_15px_rgba(6,182,212,0.35)] border border-cyan-400/30 object-cover"
            />
            <div className="flex flex-col">
              <h1 className="font-black text-lg tracking-tight bg-gradient-to-r from-slate-100 to-slate-300 bg-clip-text text-transparent leading-none">IT Ninja</h1>
              <div className="flex items-center gap-1 mt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_5px_rgba(16,185,129,0.8)]" />
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">System Online</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Global Stats */}
        <div className="flex items-center gap-5">
          <div className="text-right">
            <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">إجمالي الإنجاز</span>
            <span className="font-mono text-sm text-emerald-400 font-black drop-shadow-[0_0_5px_rgba(52,211,153,0.4)]">{globalProgressPercent}%</span>
          </div>
          <div className="w-px h-8 bg-slate-800/60" />
          <div className="text-right">
            <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">المهام المكتملة</span>
            <span className="font-mono text-sm text-slate-200 font-black">{completedCount}/{totalCheckboxes}</span>
          </div>
        </div>
      </div>

      {/* Quick Filters Sticky sub-bar */}
      <div className="bg-slate-900/40 border-t border-slate-800/40 py-2.5 px-4 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto scrollbar-none pb-1 sm:pb-0">
            <span className="text-xs text-slate-400 font-bold flex-shrink-0">تصفية المصادر:</span>
            
            {[
              { id: "all", label: "الكل (All)" },
              { id: "ar", label: "عربي فقط (Arabic)" },
              { id: "en", label: "إنجليزي فقط (English)" },
              { id: "practice", label: "معامل (Labs)" }
            ].map(filter => (
              <motion.button 
                key={filter.id}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveFilter(filter.id)}
                className={`text-xs px-3 py-1.5 rounded-lg border font-semibold transition-all whitespace-nowrap ${
                  activeFilter === filter.id 
                    ? "bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 border-transparent shadow-[0_0_12px_rgba(16,185,129,0.3)]" 
                    : "bg-slate-950/50 border-slate-800/60 text-slate-400 hover:text-slate-200 hover:border-slate-700"
                }`}
              >
                {filter.label}
              </motion.button>
            ))}
          </div>

          {/* Backup actions & Profiles */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <motion.button 
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={onOpenProfileModal}
              title="إدارة وتبديل الملفات الشخصية"
              className="text-xs px-2.5 py-1.5 rounded-lg border border-cyan-500/20 bg-cyan-950/10 text-cyan-400 hover:bg-cyan-500/15 hover:text-cyan-300 transition-all flex items-center gap-1.5 cursor-pointer font-bold ml-1.5"
            >
              <span className="text-[14px] leading-none">{activeProfile.avatar}</span>
              <span>{activeProfile.name}</span>
            </motion.button>

            <motion.button 
              whileHover={{ scale: 1.05, backgroundColor: "rgba(15, 23, 42, 1)" }}
              whileTap={{ scale: 0.95 }}
              onClick={exportBackup}
              title="تصدير نسخة احتياطية من التقدم"
              className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-800/60 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/30 transition-colors flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>حفظ</span>
            </motion.button>
            
            <motion.label 
              whileHover={{ scale: 1.05, backgroundColor: "rgba(15, 23, 42, 1)" }}
              whileTap={{ scale: 0.95 }}
              title="استيراد نسخة احتياطية من التقدم"
              className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-800/60 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/30 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>رفع</span>
              <input type="file" accept=".json" onChange={importBackup} className="hidden" aria-label="اختيار ملف النسخة الاحتياطية" />
            </motion.label>
            
            <motion.button 
              whileHover={{ scale: 1.05, backgroundColor: "rgba(244, 63, 94, 0.1)" }}
              whileTap={{ scale: 0.95 }}
              onClick={resetAllProgress}
              title="إعادة تعيين كافة التقدم"
              className="text-xs px-2 py-1.5 rounded-lg border border-rose-500/20 text-rose-400 hover:text-rose-300 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
