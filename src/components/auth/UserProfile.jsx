import React, { useState, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, LogOut, Star, Award, Edit3, Check, X, Loader2, Shield, Settings, Goal, Compass } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const RANK_GRADIENT = {
  "Platinum Ninja": "from-cyan-400 to-blue-500",
  "Gold Ninja":     "from-yellow-400 to-orange-500",
  "Silver Ninja":   "from-slate-300 to-slate-500",
  "Bronze Ninja":   "from-orange-400 to-red-500",
  "Ninja Rookie":   "from-slate-500 to-slate-700",
};

const AVATARS = ["🥷", "🥋", "💻", "🛡️", "⚙️", "☁️", "🎓", "🚀", "💡"];
const GOALS = [
  { id: "sysadmin", name: "System Administrator (مسؤول أنظمة)" },
  { id: "devops", name: "DevOps Engineer (مهندس ديف أوبس)" },
  { id: "cloud", name: "Cloud Architect (معماري سحابي)" },
  { id: "security", name: "Cyber Security (أمن سيبراني)" },
];
const LEVELS = [
  { id: "beginner", name: "Beginner (مبتدئ)" },
  { id: "intermediate", name: "Intermediate (متوسط)" },
  { id: "advanced", name: "Advanced (متقدم)" },
];

const UserProfile = memo(function UserProfile({ onClose }) {
  const { user, profile, signOut, updateProfile, loading } = useAuth();
  
  // Local Edit States
  const [editing, setEditing] = useState(false);
  const [username, setUsername] = useState(profile?.username || "");
  const [avatar, setAvatar] = useState(profile?.avatar_url || "🥷");
  const [goal, setGoal] = useState(profile?.goal || "sysadmin");
  const [level, setLevel] = useState(profile?.level || "beginner");
  
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

  const handleSave = async () => {
    if (!username.trim()) return;
    setSaving(true);
    await updateProfile({
      username: username.trim(),
      avatar_url: avatar,
      goal: goal,
      level: level
    });
    setSaving(false);
    setEditing(false);
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
        className="w-full max-w-md"
      >
        <div className="bg-slate-900 border border-slate-700/50 rounded-3xl overflow-hidden shadow-2xl">
          {/* Header gradient */}
          <div className={`bg-gradient-to-br ${gradient} p-6 relative`}>
            <button onClick={onClose} className="absolute top-4 right-4 text-white/60 hover:text-white cursor-pointer p-1 rounded-lg">
              <X className="w-4 h-4" />
            </button>
            
            <div className="flex flex-col items-center gap-3 text-center">
              {/* Avatar display */}
              <div className="w-20 h-20 rounded-2xl bg-white/20 border-2 border-white/30 flex items-center justify-center text-4xl font-black text-white shadow-lg backdrop-blur-sm relative">
                {avatar}
              </div>
              
              <div>
                <h3 className="font-extrabold text-white text-lg flex items-center justify-center gap-1.5">
                  <span>{profile?.username || "Ninja"}</span>
                  <span className="text-xs bg-white/25 px-2 py-0.5 rounded-full font-bold">{rank}</span>
                </h3>
                <p className="text-white/70 text-xs mt-0.5">{user.email}</p>
              </div>
            </div>
          </div>

          {/* Body Content */}
          <div className="p-6 flex flex-col gap-5 max-h-[380px] overflow-y-auto">
            <AnimatePresence mode="wait">
              {!editing ? (
                <motion.div key="display" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="flex flex-col gap-4">
                  
                  {/* Current info list */}
                  <div className="flex flex-col gap-2.5">
                    <div className="flex items-center justify-between bg-slate-950/60 border border-slate-800/80 rounded-xl px-4 py-3 text-right">
                      <span className="text-[10px] text-slate-500 font-extrabold">الهدف المهني:</span>
                      <span className="text-xs font-bold text-slate-200">
                        {GOALS.find(g => g.id === goal)?.name || goal}
                      </span>
                    </div>

                    <div className="flex items-center justify-between bg-slate-950/60 border border-slate-800/80 rounded-xl px-4 py-3 text-right">
                      <span className="text-[10px] text-slate-500 font-extrabold">المستوى الحالي:</span>
                      <span className="text-xs font-bold text-slate-200">
                        {LEVELS.find(l => l.id === level)?.name || level}
                      </span>
                    </div>
                  </div>

                  {/* XP progress bar */}
                  <div className="flex flex-col gap-2 bg-slate-950/40 border border-slate-800/60 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-slate-400 font-extrabold flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 text-yellow-400" /> نقاط الخبرة (XP)
                      </span>
                      <span className="text-xs font-black text-yellow-400">{xp.toLocaleString()} XP</span>
                    </div>
                    <div className="bg-slate-900 rounded-full h-2.5 overflow-hidden mt-1.5">
                      <motion.div className={`h-full rounded-full bg-gradient-to-r ${gradient}`}
                        initial={{ width: 0 }} animate={{ width: `${xpProgress}%` }}
                      />
                    </div>
                    {nextRankXP && (
                      <p className="text-[9px] text-slate-600 text-left mt-0.5">{nextRankXP - xp} XP للرتبة التالية</p>
                    )}
                  </div>

                  {/* Edit button */}
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    onClick={() => setEditing(true)}
                    className="w-full py-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer hover:bg-cyan-500/20"
                  >
                    <Settings className="w-4 h-4" /> تعديل الملف الشخصي
                  </motion.button>
                </motion.div>
              ) : (
                <motion.div key="edit" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="flex flex-col gap-4 text-right">
                  
                  {/* Username field */}
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-slate-500 font-extrabold">الاسم المستعار:</label>
                    <input
                      value={username}
                      onChange={e => setUsername(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 text-right"
                    />
                  </div>

                  {/* Avatar selection */}
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-slate-500 font-extrabold">اختر رمزك التعبيري (Avatar):</label>
                    <div className="flex flex-wrap gap-2 justify-end mt-1">
                      {AVATARS.map(av => (
                        <button
                          key={av}
                          type="button"
                          onClick={() => setAvatar(av)}
                          className={`w-9 h-9 rounded-lg flex items-center justify-center text-lg border transition-all cursor-pointer ${
                            avatar === av ? "bg-cyan-500/20 border-cyan-500 scale-110" : "bg-slate-950 border-slate-800 hover:border-slate-700"
                          }`}
                        >
                          {av}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Career Goal */}
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-slate-500 font-extrabold">الهدف المهني:</label>
                    <select
                      value={goal}
                      onChange={e => setGoal(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-350 focus:outline-none focus:border-cyan-500 text-right cursor-pointer"
                    >
                      {GOALS.map(g => (
                        <option key={g.id} value={g.id}>{g.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Current learning Level */}
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-slate-500 font-extrabold">المستوى الحالي:</label>
                    <select
                      value={level}
                      onChange={e => setLevel(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-350 focus:outline-none focus:border-cyan-500 text-right cursor-pointer"
                    >
                      {LEVELS.map(l => (
                        <option key={l.id} value={l.id}>{l.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Action buttons */}
                  <div className="flex gap-2 mt-2">
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                      onClick={handleSave} disabled={saving}
                      className="flex-1 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />} حفظ التغييرات
                    </motion.button>
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                      onClick={() => setEditing(false)}
                      className="px-4 py-3 rounded-xl bg-slate-850 hover:bg-slate-800 border border-slate-700 text-slate-400 font-bold text-xs cursor-pointer"
                    >
                      إلغاء
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Logout button */}
            {!editing && (
              <button
                onClick={handleSignOut}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-400 text-xs font-extrabold hover:bg-rose-500/20 transition-all cursor-pointer mt-2"
              >
                <LogOut className="w-4 h-4" /> تسجيل الخروج من الحساب
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
});

export default UserProfile;
