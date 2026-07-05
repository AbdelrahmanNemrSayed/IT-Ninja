import React, { useState, useEffect, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase, isSupabaseConfigured } from "../lib/supabase";
import { Trophy, Crown, Medal, Star, Loader2, Wifi, WifiOff } from "lucide-react";

const RANK_COLORS = {
  "Platinum Ninja": { text: "text-cyan-300", bg: "bg-cyan-500/10", border: "border-cyan-500/30", icon: "💎" },
  "Gold Ninja":     { text: "text-yellow-300", bg: "bg-yellow-500/10", border: "border-yellow-500/30", icon: "🥇" },
  "Silver Ninja":   { text: "text-slate-300", bg: "bg-slate-500/10", border: "border-slate-500/30", icon: "🥈" },
  "Bronze Ninja":   { text: "text-orange-300", bg: "bg-orange-500/10", border: "border-orange-500/30", icon: "🥉" },
  "Ninja Rookie":   { text: "text-slate-400", bg: "bg-slate-800/50", border: "border-slate-700/50", icon: "🥷" },
};

const PLACE_ICONS = ["🥇", "🥈", "🥉"];

const Leaderboard = memo(function Leaderboard({ currentUserId }) {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("xp");

  useEffect(() => {
    if (!isSupabaseConfigured) { setLoading(false); return; }
    fetchLeaders();

    // Real-time subscription
    const channel = supabase
      .channel("profiles-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "profiles" }, () => fetchLeaders())
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [tab]);

  const fetchLeaders = async () => {
    setLoading(true);
    try {
      const { data } = await supabase
        .from("profiles")
        .select("id, username, total_xp, rank, avatar_url")
        .order("total_xp", { ascending: false })
        .limit(10);
      setLeaders(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-slate-900/40 backdrop-blur-md border border-yellow-500/20 rounded-2xl p-6 flex flex-col gap-5 shadow-lg relative overflow-hidden"
    >
      <div className="absolute -top-8 -left-8 w-48 h-48 bg-yellow-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="border-b border-slate-800 pb-4 flex items-center justify-between">
        <div>
          <h3 className="font-extrabold text-sm text-slate-100 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-400" />
            لوحة المتصدرين العالمية (Global Leaderboard)
          </h3>
          <p className="text-xs text-slate-500 mt-1">أفضل 10 Ninjas عالمياً مرتبين حسب نقاط الخبرة</p>
        </div>
        {isSupabaseConfigured ? (
          <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-bold">
            <Wifi className="w-3 h-3" /> مباشر
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-bold">
            <WifiOff className="w-3 h-3" /> غير متصل
          </div>
        )}
      </div>

      {/* Content */}
      {!isSupabaseConfigured ? (
        <div className="flex flex-col items-center justify-center py-10 gap-4 text-center">
          <div className="text-5xl">🏆</div>
          <div>
            <p className="text-sm font-bold text-slate-300 mb-1">لوحة المتصدرين غير متاحة</p>
            <p className="text-xs text-slate-500">قم بإعداد Supabase لتفعيل المنافسة بين المستخدمين</p>
          </div>
          <div className="flex flex-col gap-2 w-full max-w-xs">
            {[
              { rank: 1, name: "ninja_master_01", xp: 850, rank_title: "Platinum Ninja" },
              { rank: 2, name: "devops_king",     xp: 620, rank_title: "Gold Ninja" },
              { rank: 3, name: "linux_wizard",    xp: 410, rank_title: "Gold Ninja" },
            ].map((u, i) => (
              <div key={i} className="flex items-center gap-3 bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-2.5 opacity-50 blur-[1px]">
                <span className="text-base">{PLACE_ICONS[i]}</span>
                <span className="text-xs font-bold text-slate-400 flex-1 text-left">{u.name}</span>
                <span className="text-xs font-extrabold text-yellow-400">⚡ {u.xp} XP</span>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-slate-600">هذه بيانات تجريبية — سجّل دخولك لترى المتصدرين الحقيقيين</p>
        </div>
      ) : loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 text-cyan-400 animate-spin" />
        </div>
      ) : leaders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 gap-3 text-center">
          <div className="text-4xl">🥷</div>
          <p className="text-sm font-bold text-slate-300">لا يوجد متصدرون بعد!</p>
          <p className="text-xs text-slate-500">كن أول Ninja يصعد لقمة اللوحة</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {leaders.map((leader, i) => {
            const rankStyle = RANK_COLORS[leader.rank] || RANK_COLORS["Ninja Rookie"];
            const isCurrentUser = leader.id === currentUserId;
            return (
              <motion.div
                key={leader.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 border transition-all ${
                  isCurrentUser
                    ? "bg-cyan-500/10 border-cyan-500/40 shadow-[0_0_20px_rgba(6,182,212,0.1)]"
                    : "bg-slate-950/50 border-slate-800/80 hover:border-slate-700"
                }`}
              >
                {/* Place */}
                <div className="w-8 text-center flex-shrink-0">
                  {i < 3 ? (
                    <span className="text-lg">{PLACE_ICONS[i]}</span>
                  ) : (
                    <span className="text-xs font-extrabold text-slate-500">#{i + 1}</span>
                  )}
                </div>

                {/* Avatar */}
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-base font-black flex-shrink-0 border ${rankStyle.border} ${rankStyle.bg}`}>
                  {leader.avatar_url ? (
                    <img src={leader.avatar_url} alt={leader.username} className="w-full h-full rounded-xl object-cover" />
                  ) : (
                    (leader.username || "N")[0].toUpperCase()
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className={`text-xs font-extrabold truncate ${isCurrentUser ? "text-cyan-300" : "text-slate-200"}`}>
                      {leader.username || "Anonymous"}
                    </p>
                    {isCurrentUser && <span className="text-[9px] bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 px-1.5 py-0.5 rounded-full font-bold">أنت</span>}
                  </div>
                  <span className={`text-[10px] font-bold ${rankStyle.text}`}>{rankStyle.icon} {leader.rank}</span>
                </div>

                {/* XP */}
                <div className="flex items-center gap-1 flex-shrink-0">
                  <Star className="w-3 h-3 text-yellow-400" />
                  <span className="text-xs font-extrabold text-yellow-400">{(leader.total_xp || 0).toLocaleString()}</span>
                  <span className="text-[9px] text-slate-500">XP</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.section>
  );
});

export default Leaderboard;
