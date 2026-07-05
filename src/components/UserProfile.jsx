import React, { useState, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, LogOut, Star, Award, Edit3, Check, X, Loader2, Shield } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const RANK_GRADIENT = {
  "Platinum Ninja": "from-cyan-400 to-blue-500",
  "Gold Ninja":     "from-yellow-400 to-orange-500",
  "Silver Ninja":   "from-slate-300 to-slate-500",
  "Bronze Ninja":   "from-orange-400 to-red-500",
  "Ninja Rookie":   "from-slate-500 to-slate-700",
};

const UserProfile = memo(function UserProfile({ onClose }) {
  const { user, profile, signOut, updateProfile, loading } = useAuth();
  const [editingUsername, setEditingUsername] = useState(false);
  const [newUsername, setNewUsername] = useState(profile?.username || "");
  const [saving, setSaving] = useState(false);

  if (loading) return (
    <div className="flex items-center justify-center p-12">
      <Loader2 className="w-6 h-6 text-cyan-400 animate-spin" />
    </div>
  );

  if (!user) return null;

  const rank = profile?.rank || "Ninja Rookie";
  const xp = profile?.total_xp || 0;
  const gradient = RANK_GRADIENT[rank] || RANK_GRADIENT["Ninja Rookie"];

  const nextRankXP = xp >= 500 ? null : xp >= 300 ? 500 : xp >= 150 ? 300 : xp > 0 ? 150 : 50;
  const xpProgress = nextRankXP ? Math.min((xp / nextRankXP) * 100, 100) : 100;

  const handleSaveUsername = async () => {
    if (!newUsername.trim() || newUsername === profile?.username) { setEditingUsername(false); return; }
    setSaving(true);
    await updateProfile({ username: newUsername.trim() });
    setSaving(false);
    setEditingUsername(false);
  };

  const handleSignOut = async () => {
    await signOut();
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-lg"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
        className="w-full max-w-sm"
      >
        <div className="bg-slate-900 border border-slate-700/50 rounded-3xl overflow-hidden shadow-2xl">
          {/* Header gradient */}
          <div className={`bg-gradient-to-br ${gradient} p-6 relative`}>
            <button onClick={onClose} className="absolute top-4 right-4 text-white/60 hover:text-white cursor-pointer p-1 rounded-lg">
              <X className="w-4 h-4" />
            </button>
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="w-20 h-20 rounded-2xl bg-white/20 border-2 border-white/30 flex items-center justify-center text-4xl font-black text-white shadow-lg backdrop-blur-sm">
                {(profile?.username || user.email || "N")[0].toUpperCase()}
              </div>
              <div>
                {editingUsername ? (
                  <div className="flex items-center gap-2">
                    <input
                      value={newUsername}
                      onChange={e => setNewUsername(e.target.value)}
                      className="bg-white/20 border border-white/40 rounded-lg px-2 py-1 text-sm text-white placeholder-white/60 focus:outline-none w-32 text-center"
                      autoFocus
                      onKeyDown={e => { if (e.key === "Enter") handleSaveUsername(); if (e.key === "Escape") setEditingUsername(false); }}
                    />
                    <button onClick={handleSaveUsername} disabled={saving} className="cursor-pointer text-white/80 hover:text-white">
                      {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                    </button>
                    <button onClick={() => setEditingUsername(false)} className="cursor-pointer text-white/60 hover:text-white">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <button onClick={() => setEditingUsername(true)} className="flex items-center gap-1.5 cursor-pointer group">
                    <span className="font-extrabold text-white text-lg">{profile?.username || "Ninja"}</span>
                    <Edit3 className="w-3 h-3 text-white/50 group-hover:text-white/80 transition-colors" />
                  </button>
                )}
                <p className="text-white/60 text-xs mt-0.5">{user.email}</p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="p-5 flex flex-col gap-4">
            {/* Rank */}
            <div className="flex items-center justify-between bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-3">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-slate-500" />
                <span className="text-xs text-slate-400 font-semibold">الرتبة الحالية</span>
              </div>
              <span className={`text-xs font-extrabold bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}>{rank}</span>
            </div>

            {/* XP + Progress */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5 text-yellow-400" />
                  <span className="text-xs text-slate-400 font-semibold">نقاط الخبرة (XP)</span>
                </div>
                <span className="text-sm font-extrabold text-yellow-400">{xp.toLocaleString()} XP</span>
              </div>
              <div className="bg-slate-950 rounded-full h-2 overflow-hidden">
                <motion.div
                  className={`h-full rounded-full bg-gradient-to-r ${gradient}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${xpProgress}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
              </div>
              {nextRankXP && (
                <p className="text-[10px] text-slate-500 text-left">{nextRankXP - xp} XP للرتبة التالية</p>
              )}
            </div>

            {/* Sign out */}
            <button
              onClick={handleSignOut}
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-400 text-sm font-bold
                hover:bg-rose-500/20 transition-all cursor-pointer"
            >
              <LogOut className="w-4 h-4" /> تسجيل الخروج
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
});

export default UserProfile;
