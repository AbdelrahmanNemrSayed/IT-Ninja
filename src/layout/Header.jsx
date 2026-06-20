import React from "react";
import { X, Menu, Download, Upload, RotateCcw } from "lucide-react";
import { totalCheckboxes } from "../utils/constants";

export default function Header({ 
  globalProgressPercent, 
  completedCount, 
  sidebarOpen, 
  setSidebarOpen,
  activeFilter,
  setActiveFilter,
  exportBackup,
  importBackup,
  resetAllProgress
}) {
  return (
    <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-900">
      {/* Progress Bar */}
      <div className="w-full bg-slate-900 h-1.5 relative overflow-hidden">
        <div 
          className="bg-gradient-to-r from-emerald-500 via-cyan-500 to-amber-500 h-full transition-all duration-500 ease-out"
          style={{ width: `${globalProgressPercent}%` }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden text-slate-400 hover:text-white p-1 rounded-lg focus:outline-none"
            aria-label="القائمة الجانبية"
          >
            {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center font-bold text-slate-950 text-lg shadow-md shadow-emerald-500/20">IT</span>
            <div className="flex flex-col">
              <h1 className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-slate-100 to-slate-300 bg-clip-text text-transparent leading-none">IT Ninja</h1>
              <div className="flex items-center gap-1 mt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[8px] text-slate-500 font-bold uppercase tracking-wider">System Online</span>
              </div>
            </div>
          </div>
          <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-900 border border-slate-800 text-slate-400">
            Roadmap Dashboard
          </span>
        </div>

        {/* Quick Global Stats */}
        <div className="flex items-center gap-4">
          <div className="text-right">
            <span className="text-[10px] text-slate-400 font-bold block">إجمالي الإنجاز</span>
            <span className="font-mono text-sm text-emerald-400 font-bold">{globalProgressPercent}%</span>
          </div>
          <div className="w-px h-8 bg-slate-800" />
          <div className="text-right">
            <span className="text-[10px] text-slate-400 font-bold block">المهام المكتملة</span>
            <span className="font-mono text-sm text-slate-200 font-bold">{completedCount}/{totalCheckboxes}</span>
          </div>
        </div>
      </div>

      {/* Quick Filters Sticky sub-bar */}
      <div className="bg-slate-900/60 border-t border-slate-900/40 py-2.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto scrollbar-none">
            <span className="text-xs text-slate-400 font-bold flex-shrink-0">تصفية المصادر:</span>
            <button 
              onClick={() => setActiveFilter("all")}
              className={`text-xs px-3 py-1.5 rounded-lg border font-semibold transition-all ${
                activeFilter === "all" 
                  ? "bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 border-transparent shadow-md shadow-emerald-500/10 scale-105" 
                  : "bg-slate-950 border-slate-850 text-slate-400 hover:text-slate-200 hover:border-slate-750"
              }`}
            >
              الكل (All)
            </button>
            <button 
              onClick={() => setActiveFilter("ar")}
              className={`text-xs px-3 py-1.5 rounded-lg border font-semibold transition-all ${
                activeFilter === "ar" 
                  ? "bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 border-transparent shadow-md shadow-emerald-500/10 scale-105" 
                  : "bg-slate-950 border-slate-850 text-slate-400 hover:text-slate-200 hover:border-slate-750"
              }`}
            >
              عربي فقط (Arabic Only)
            </button>
            <button 
              onClick={() => setActiveFilter("en")}
              className={`text-xs px-3 py-1.5 rounded-lg border font-semibold transition-all ${
                activeFilter === "en" 
                  ? "bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 border-transparent shadow-md shadow-emerald-500/10 scale-105" 
                  : "bg-slate-950 border-slate-850 text-slate-400 hover:text-slate-200 hover:border-slate-750"
              }`}
            >
              إنجليزي فقط (English Only)
            </button>
            <button 
              onClick={() => setActiveFilter("practice")}
              className={`text-xs px-3 py-1.5 rounded-lg border font-semibold transition-all ${
                activeFilter === "practice" 
                  ? "bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 border-transparent shadow-md shadow-emerald-500/10 scale-105" 
                  : "bg-slate-950 border-slate-850 text-slate-400 hover:text-slate-200 hover:border-slate-750"
              }`}
            >
              معامل تطبيقية (Practice Labs)
            </button>
          </div>

          {/* Backup actions */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button 
              onClick={exportBackup}
              title="تصدير نسخة احتياطية من التقدم"
              aria-label="تصدير نسخة احتياطية من التقدم"
              className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700 transition-all flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>حفظ التقدم</span>
            </button>
            <label 
              title="استيراد نسخة احتياطية من التقدم"
              aria-label="استيراد نسخة احتياطية من التقدم"
              className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>رفع التقدم</span>
              <input type="file" accept=".json" onChange={importBackup} className="hidden" aria-label="اختيار ملف النسخة الاحتياطية" />
            </label>
            <button 
              onClick={resetAllProgress}
              title="إعادة تعيين كافة التقدم"
              aria-label="إعادة تعيين كافة التقدم"
              className="text-xs px-2 py-1.5 rounded-lg border border-rose-500/20 text-rose-400 hover:bg-rose-500/10 transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
