import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Flame, Calendar, TrendingUp, Clock, Target, Activity, BarChart2, Trophy } from "lucide-react";

const STREAK_KEY = "ninja-streak-v2";
const ACTIVITY_KEY = "ninja-activity-v2";

function getTodayStr() { return new Date().toISOString().split("T")[0]; }
function getYesterdayStr() {
  const d = new Date(); d.setDate(d.getDate() - 1);
  return d.toISOString().split("T")[0];
}

function initStreak() {
  try {
    const raw = JSON.parse(localStorage.getItem(STREAK_KEY) || "null");
    const today = getTodayStr();
    const yesterday = getYesterdayStr();
    if (!raw) {
      const init = { lastVisit: today, current: 1, longest: 1, dates: [today] };
      localStorage.setItem(STREAK_KEY, JSON.stringify(init));
      return init;
    }
    if (raw.lastVisit === today) return raw;
    if (raw.lastVisit === yesterday) {
      const upd = { ...raw, lastVisit: today, current: raw.current + 1, longest: Math.max(raw.longest, raw.current + 1), dates: [...(raw.dates || []), today].slice(-90) };
      localStorage.setItem(STREAK_KEY, JSON.stringify(upd));
      return upd;
    }
    // Streak broken
    const reset = { ...raw, lastVisit: today, current: 1, dates: [...(raw.dates || []), today].slice(-90) };
    localStorage.setItem(STREAK_KEY, JSON.stringify(reset));
    return reset;
  } catch { return { lastVisit: getTodayStr(), current: 1, longest: 1, dates: [getTodayStr()] }; }
}

function getActivityData() {
  try { return JSON.parse(localStorage.getItem(ACTIVITY_KEY) || "{}"); } catch { return {}; }
}

function getLast30Days() {
  const days = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date(); d.setDate(d.getDate() - i);
    days.push(d.toISOString().split("T")[0]);
  }
  return days;
}

function getLast7Days() {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(); d.setDate(d.getDate() - i);
    days.push(d.toISOString().split("T")[0]);
  }
  return days;
}

function getCompletedCount() {
  try {
    let total = 0;
    Object.keys(localStorage).forEach((k) => {
      if (k.startsWith("roadmapProgress-")) {
        const d = JSON.parse(localStorage.getItem(k) || "{}");
        total += Object.keys(d).filter((id) => d[id]).length;
      }
    });
    return total;
  } catch { return 0; }
}

function getStudySessions() {
  return Number(localStorage.getItem("ninja-timer-sessions") || 0);
}

function getXP() {
  try {
    const d = JSON.parse(localStorage.getItem("ninja-achievements") || "{}");
    return d.totalXP || 0;
  } catch { return 0; }
}

const DAY_LABELS = ["أح", "إث", "ثل", "أر", "خم", "جم", "سب"];

export default function AnalyticsDashboard() {
  const [streak] = useState(() => initStreak());
  const activity = useMemo(() => getActivityData(), []);
  const completedCount = useMemo(() => getCompletedCount(), []);
  const sessions = useMemo(() => getStudySessions(), []);
  const xp = useMemo(() => getXP(), []);
  const daysActive = useMemo(() => (streak.dates || []).length, [streak]);

  const last30 = useMemo(() => getLast30Days(), []);
  const last7 = useMemo(() => getLast7Days(), []);

  const maxActivity = useMemo(() => Math.max(1, ...last30.map((d) => activity[d] || 0)), [last30, activity]);
  const maxWeek = useMemo(() => Math.max(1, ...last7.map((d) => activity[d] || 0)), [last7, activity]);

  const heatColor = (count) => {
    if (!count) return "bg-slate-900 border-slate-800";
    if (count < 3) return "bg-cyan-900/60 border-cyan-700/30";
    if (count < 6) return "bg-cyan-600/60 border-cyan-500/30";
    return "bg-cyan-400/80 border-cyan-300/30";
  };

  const STATS = [
    { icon: Flame, label: "XP المكتسبة", value: xp.toLocaleString(), unit: "نقطة", color: "text-yellow-400", bg: "bg-yellow-500/10", border: "border-yellow-500/20" },
    { icon: Target, label: "المهام المكتملة", value: completedCount, unit: "مهمة", color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
    { icon: Clock, label: "جلسات الدراسة", value: sessions, unit: "جلسة", color: "text-cyan-400", bg: "bg-cyan-500/10", border: "border-cyan-500/20" },
    { icon: Calendar, label: "أيام النشاط", value: daysActive, unit: "يوم", color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20" },
  ];

  return (
    <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className="bg-slate-900/40 backdrop-blur-md border border-slate-800/80 rounded-2xl p-6 flex flex-col gap-6">

      {/* Header */}
      <div className="border-b border-slate-800 pb-4 flex items-center justify-between">
        <div>
          <h3 className="font-extrabold text-sm text-slate-100 flex items-center gap-2">
            <Activity className="w-5 h-5 text-cyan-400" />
            لوحة التحليلات الشخصية
          </h3>
          <p className="text-xs text-slate-500 mt-1">تتبع تقدمك ونشاطك اليومي</p>
        </div>
        {/* Streak badge */}
        <div className="flex items-center gap-2 bg-orange-500/10 border border-orange-500/30 rounded-xl px-4 py-2">
          <span className="text-2xl">🔥</span>
          <div className="text-right">
            <p className="text-xl font-black text-orange-400 leading-none">{streak.current}</p>
            <p className="text-[10px] text-orange-300/70">يوم متواصل</p>
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {STATS.map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
            className={`${s.bg} border ${s.border} rounded-xl p-3 flex flex-col gap-1.5`}>
            <s.icon className={`w-4 h-4 ${s.color}`} />
            <p className={`text-xl font-black ${s.color}`}>{s.value}</p>
            <p className="text-[10px] text-slate-400 font-semibold">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Activity heatmap */}
      <div>
        <p className="text-xs font-bold text-slate-400 mb-3 flex items-center gap-2">
          <Calendar className="w-3.5 h-3.5 text-slate-500" /> نشاط الـ 30 يوم الماضية
        </p>
        <div className="flex flex-wrap gap-1">
          {last30.map((day, i) => (
            <motion.div key={day} initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.01 }}
              title={`${day}: ${activity[day] || 0} مهام`}
              className={`w-6 h-6 rounded-md border transition-all cursor-default ${heatColor(activity[day] || 0)}`}
            />
          ))}
        </div>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-[10px] text-slate-600">أقل</span>
          {["bg-slate-900", "bg-cyan-900/60", "bg-cyan-600/60", "bg-cyan-400/80"].map((c, i) => (
            <div key={i} className={`w-3 h-3 rounded-sm ${c} border border-slate-700`} />
          ))}
          <span className="text-[10px] text-slate-600">أكثر</span>
        </div>
      </div>

      {/* Weekly bar chart */}
      <div>
        <p className="text-xs font-bold text-slate-400 mb-3 flex items-center gap-2">
          <BarChart2 className="w-3.5 h-3.5 text-slate-500" /> نشاط الأسبوع الحالي
        </p>
        <div className="flex items-end gap-2 h-24">
          {last7.map((day, i) => {
            const count = activity[day] || 0;
            const heightPct = maxWeek > 0 ? (count / maxWeek) * 100 : 0;
            const dayName = DAY_LABELS[new Date(day).getDay()];
            const isToday = day === getTodayStr();
            return (
              <div key={day} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                <motion.div
                  className="w-full rounded-t-lg"
                  style={{ background: isToday ? "linear-gradient(180deg, #06b6d4, #8b5cf6)" : "#1e293b", minHeight: 4 }}
                  initial={{ height: 0 }}
                  animate={{ height: `${Math.max(4, heightPct)}%` }}
                  transition={{ duration: 0.6, delay: i * 0.08, ease: "easeOut" }}
                  title={`${count} مهمة`}
                />
                <span className={`text-[10px] font-bold ${isToday ? "text-cyan-400" : "text-slate-600"}`}>{dayName}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Streak record */}
      <div className="bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Trophy className="w-4 h-4 text-yellow-400" />
          <span className="text-xs font-bold text-slate-300">أطول سلسلة حققتها</span>
        </div>
        <span className="text-lg font-black text-yellow-400">{streak.longest} 🔥 يوم</span>
      </div>
    </motion.section>
  );
}
