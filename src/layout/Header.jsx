import React, { useState } from "react";
import { X, Menu, Download, Upload, RotateCcw, LogIn, User, Star, ChevronDown, Zap, Search } from "lucide-react";
import { totalCheckboxes } from "../utils/constants";
import { motion, AnimatePresence } from "framer-motion";
import { useProfile } from "../context/ProfileContext";
import { useAuth } from "../context/AuthContext";

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
  onOpenProfileModal,
  onOpenUserProfile,
  onSearchClick,
}) {
  const { activeProfile } = useProfile();
  const { user, profile, setAuthModal, isConfigured } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const xp = profile?.total_xp || 0;
  const rank = profile?.rank || "Ninja Rookie";

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/50 shadow-[0_4px_30px_rgba(0,0,0,0.4)]"
    >
      {/* Top shimmer line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent" />

      {/* Progress Bar */}
      <div className="w-full bg-slate-900/60 h-1 relative overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${globalProgressPercent}%` }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="bg-gradient-to-r from-emerald-500 via-cyan-400 to-purple-500 h-full shadow-[0_0_12px_rgba(6,182,212,0.6)]"
        />
        {/* Shimmer effect on progress bar */}
        <motion.div
          animate={{ x: ["-100%", "200%"] }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear", repeatDelay: 3 }}
          className="absolute top-0 bottom-0 w-1/4 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          style={{ left: 0 }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Left: Menu + Logo */}
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden text-slate-400 hover:text-cyan-400 p-1.5 rounded-lg transition-colors cursor-pointer"
            aria-label="القائمة الجانبية"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </motion.button>

          <div className="flex items-center gap-3">
            <motion.div
              whileHover={{ rotate: 8, scale: 1.08 }}
              className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.4)] border border-cyan-400/30 flex-shrink-0"
            >
              <Zap className="w-5 h-5 text-white" />
            </motion.div>
            <div className="flex flex-col leading-none">
              <h1 className="font-black text-base tracking-tight bg-gradient-to-r from-cyan-300 via-slate-100 to-purple-300 bg-clip-text text-transparent">
                IT Ninja
              </h1>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_6px_rgba(16,185,129,0.8)]" />
                <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">System Online</span>
              </div>
            </div>
          </div>
        </div>

        {/* Center: Stats (hidden on mobile) */}
        <div className="hidden md:flex items-center gap-5">
          <div className="text-center">
            <span className="text-[9px] text-slate-500 font-bold block uppercase tracking-widest">الإنجاز</span>
            <span className="font-mono text-sm text-emerald-400 font-black drop-shadow-[0_0_6px_rgba(52,211,153,0.5)]">
              {globalProgressPercent}%
            </span>
          </div>
          <div className="w-px h-7 bg-slate-800" />
          <div className="text-center">
            <span className="text-[9px] text-slate-500 font-bold block uppercase tracking-widest">المهام</span>
            <span className="font-mono text-sm text-slate-200 font-black">{completedCount}<span className="text-slate-600">/{totalCheckboxes}</span></span>
          </div>
        </div>

        {/* Right: Auth button */}
        <div className="flex items-center gap-2">
          {user ? (
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700/60
                  hover:border-cyan-500/40 transition-all cursor-pointer group"
              >
                <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center text-[10px] font-black text-white flex-shrink-0">
                  {(profile?.username || user.email || "N")[0].toUpperCase()}
                </div>
                <div className="hidden sm:flex flex-col text-right leading-none">
                  <span className="text-[11px] font-bold text-slate-200 max-w-[80px] truncate">
                    {profile?.username || "Ninja"}
                  </span>
                  <span className="text-[9px] text-yellow-400 font-bold flex items-center gap-0.5">
                    <Star className="w-2 h-2" /> {xp} XP
                  </span>
                </div>
                <ChevronDown className={`w-3 h-3 text-slate-500 transition-transform ${userMenuOpen ? "rotate-180" : ""}`} />
              </motion.button>

              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    className="absolute top-full right-0 mt-2 w-52 bg-slate-900/95 border border-slate-700/50 rounded-2xl shadow-2xl backdrop-blur-xl overflow-hidden z-50"
                  >
                    <div className="p-3 border-b border-slate-800">
                      <p className="text-xs font-extrabold text-slate-200 truncate">{profile?.username || "Ninja"}</p>
                      <p className="text-[10px] text-slate-500 truncate mt-0.5">{user.email}</p>
                      <div className="flex items-center gap-1 mt-1.5">
                        <span className="text-[10px] font-bold text-yellow-400">⚡ {xp} XP</span>
                        <span className="text-[10px] text-slate-500">•</span>
                        <span className="text-[10px] text-slate-400">{rank}</span>
                      </div>
                    </div>
                    <div className="p-2 flex flex-col gap-1">
                      <button
                        onClick={() => { onOpenUserProfile(); setUserMenuOpen(false); }}
                        className="flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:text-cyan-400 transition-all cursor-pointer text-right"
                      >
                        <User className="w-3.5 h-3.5" /> الملف الشخصي
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Backdrop to close menu */}
              {userMenuOpen && (
                <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
              )}
            </div>
          ) : (
            isConfigured && (
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => setAuthModal(true)}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold
                  bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/30
                  text-cyan-400 hover:from-cyan-500/30 hover:border-cyan-400/50
                  transition-all cursor-pointer shadow-[0_0_15px_rgba(6,182,212,0.1)]"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">تسجيل الدخول</span>
              </motion.button>
            )
          )}
        </div>
      </div>

      {/* Sub-bar: Filters + Actions */}
      <div className="bg-slate-900/40 border-t border-slate-800/40 py-2 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          {/* Filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto scrollbar-none">
            <span className="text-[10px] text-slate-500 font-bold flex-shrink-0">تصفية:</span>
            {[
              { id: "all", label: "الكل" },
              { id: "ar", label: "🇸🇦 عربي" },
              { id: "en", label: "🇺🇸 English" },
              { id: "practice", label: "🧪 Labs" },
            ].map(filter => (
              <motion.button
                key={filter.id}
                whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                onClick={() => setActiveFilter(filter.id)}
                className={`text-[11px] px-2.5 py-1 rounded-lg border font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  activeFilter === filter.id
                    ? "bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 border-transparent shadow-[0_0_10px_rgba(16,185,129,0.3)]"
                    : "bg-slate-950/50 border-slate-800/60 text-slate-400 hover:text-slate-200 hover:border-slate-700"
                }`}
              >
                {filter.label}
              </motion.button>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1.5 w-full sm:w-auto justify-end flex-shrink-0">
            <motion.button
              whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
              onClick={onOpenProfileModal}
              title="تبديل الملف الشخصي"
              className="text-[11px] px-2.5 py-1 rounded-lg border border-purple-500/20 bg-purple-950/10 text-purple-400 hover:bg-purple-500/15 transition-all flex items-center gap-1.5 cursor-pointer font-bold"
            >
              <span className="text-sm leading-none">{activeProfile.avatar}</span>
              <span className="hidden sm:inline">{activeProfile.name}</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={exportBackup}
              title="تصدير نسخة احتياطية"
              className="text-[11px] px-2.5 py-1 rounded-lg border border-slate-800/60 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/30 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3 h-3" /> <span className="hidden sm:inline">حفظ</span>
            </motion.button>

            <motion.label
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              title="استيراد نسخة احتياطية"
              className="text-[11px] px-2.5 py-1 rounded-lg border border-slate-800/60 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/30 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Upload className="w-3 h-3" /> <span className="hidden sm:inline">رفع</span>
              <input type="file" accept=".json" onChange={importBackup} className="hidden" aria-label="ملف النسخة الاحتياطية" />
            </motion.label>

            <motion.button
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={resetAllProgress}
              title="إعادة تعيين التقدم"
              className="text-[11px] px-2 py-1 rounded-lg border border-rose-500/20 text-rose-500 hover:text-rose-300 hover:bg-rose-500/10 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
