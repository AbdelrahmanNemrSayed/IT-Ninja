import React, { useState, useEffect, useCallback, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Star, Zap, Target, CheckCircle2, Clock, Shield, Terminal, Server, Award } from "lucide-react";

const STORAGE_KEY = "ninja_achievements_v2";

const ALL_CHALLENGES = [
  {
    id: "quiz_linux",
    title: "اختبار Linux اليوم",
    desc: "أجِب على 3 أسئلة من قسم الـ Quiz الخاص بشهادة Linux+",
    icon: Terminal,
    xp: 50,
    color: "emerald",
    type: "daily",
    badge: { icon: "🐧", name: "Linux Starter" },
  },
  {
    id: "docker_compose",
    title: "مولّد Docker Compose",
    desc: "قم بتوليد وتحميل ملف docker-compose.yml من أداة المولّد",
    icon: Server,
    xp: 75,
    color: "cyan",
    type: "daily",
    badge: { icon: "🐳", name: "Docker Captain" },
  },
  {
    id: "nginx_config",
    title: "توليد إعدادات Nginx",
    desc: "قم بإنشاء تكوين Nginx لموقعك الخاص من أداة الـ Config Generator",
    icon: Shield,
    xp: 75,
    color: "blue",
    type: "daily",
    badge: { icon: "🌐", name: "Web Server Pro" },
  },
  {
    id: "subnet_calc",
    title: "حاسبة الـ Subnetting",
    desc: "احسب تقسيم شبكة /22 ودوّن أول وآخر عنوان متاح",
    icon: Target,
    xp: 60,
    color: "amber",
    type: "daily",
    badge: { icon: "📡", name: "Network Ninja" },
  },
  {
    id: "raid_challenge",
    title: "تحدي محاكي RAID",
    desc: "جرّب 3 مستويات RAID مختلفة ومحاكاة عطل قرص في كل واحدة",
    icon: Zap,
    xp: 80,
    color: "purple",
    type: "weekly",
    badge: { icon: "💾", name: "Storage Master" },
  },
  {
    id: "security_quiz",
    title: "أسئلة Security+",
    desc: "أتمم كويز شهادة Security+ بدون الرجوع لأي مصادر خارجية",
    icon: Shield,
    xp: 100,
    color: "rose",
    type: "weekly",
    badge: { icon: "🔐", name: "Security Guru" },
  },
  {
    id: "aws_quiz",
    title: "اختبار AWS Cloud",
    desc: "أجِب على أسئلة AWS الخاصة بالـ Cloud Computing في قسم الـ Quiz",
    icon: Star,
    xp: 100,
    color: "orange",
    type: "weekly",
    badge: { icon: "☁️", name: "Cloud Pioneer" },
  },
  {
    id: "full_roadmap_week",
    title: "أنهِ أسبوع كامل في Roadmap",
    desc: "أكمل جميع مهام أسبوع واحد كامل في مخطط المذاكرة المخصص",
    icon: Trophy,
    xp: 200,
    color: "gold",
    type: "weekly",
    badge: { icon: "🏆", name: "Roadmap Champion" },
  },
];

const COLOR_MAP = {
  emerald: { bg: "bg-emerald-500/10", border: "border-emerald-500/30", text: "text-emerald-400", badge: "bg-emerald-500/20", glow: "shadow-emerald-500/20" },
  cyan: { bg: "bg-cyan-500/10", border: "border-cyan-500/30", text: "text-cyan-400", badge: "bg-cyan-500/20", glow: "shadow-cyan-500/20" },
  blue: { bg: "bg-blue-500/10", border: "border-blue-500/30", text: "text-blue-400", badge: "bg-blue-500/20", glow: "shadow-blue-500/20" },
  amber: { bg: "bg-amber-500/10", border: "border-amber-500/30", text: "text-amber-400", badge: "bg-amber-500/20", glow: "shadow-amber-500/20" },
  purple: { bg: "bg-purple-500/10", border: "border-purple-500/30", text: "text-purple-400", badge: "bg-purple-500/20", glow: "shadow-purple-500/20" },
  rose: { bg: "bg-rose-500/10", border: "border-rose-500/30", text: "text-rose-400", badge: "bg-rose-500/20", glow: "shadow-rose-500/20" },
  orange: { bg: "bg-orange-500/10", border: "border-orange-500/30", text: "text-orange-400", badge: "bg-orange-500/20", glow: "shadow-orange-500/20" },
  gold: { bg: "bg-yellow-500/10", border: "border-yellow-500/30", text: "text-yellow-400", badge: "bg-yellow-500/20", glow: "shadow-yellow-500/20" },
};

const NinjaAchievements = memo(function NinjaAchievements() {
  const [achievements, setAchievements] = useState({});
  const [activeTab, setActiveTab] = useState("daily");
  const [showBadgePopup, setShowBadgePopup] = useState(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setAchievements(JSON.parse(stored));
    } catch {}
  }, []);

  const saveAchievements = useCallback((newData) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
    } catch {}
  }, []);

  const completeChallenge = useCallback((id, badge) => {
    setAchievements(prev => {
      if (prev[id]) return prev;
      const next = { ...prev, [id]: { completedAt: new Date().toISOString() } };
      saveAchievements(next);
      setShowBadgePopup({ id, badge });
      setTimeout(() => setShowBadgePopup(null), 3500);
      return next;
    });
  }, [saveAchievements]);

  const totalXP = ALL_CHALLENGES
    .filter(c => achievements[c.id])
    .reduce((s, c) => s + c.xp, 0);

  const earnedBadges = ALL_CHALLENGES.filter(c => achievements[c.id]);
  const totalChallenges = ALL_CHALLENGES.length;
  const doneChallenges = earnedBadges.length;
  const ninjaRank = totalXP >= 500 ? "💎 Platinum Ninja" : totalXP >= 300 ? "🥇 Gold Ninja" : totalXP >= 150 ? "🥈 Silver Ninja" : totalXP > 0 ? "🥉 Bronze Ninja" : "🥷 Ninja Rookie";

  const filtered = ALL_CHALLENGES.filter(c => c.type === activeTab);

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-slate-900/40 backdrop-blur-md border border-yellow-500/20 rounded-2xl p-6 flex flex-col gap-6 shadow-lg relative overflow-hidden"
    >
      {/* Glow */}
      <div className="absolute -top-10 -right-10 w-64 h-64 bg-yellow-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Badge Popup */}
      <AnimatePresence>
        {showBadgePopup && (
          <motion.div
            key={showBadgePopup.id}
            initial={{ opacity: 0, scale: 0.5, y: -30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -20 }}
            className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
          >
            <div className="bg-slate-900 border-2 border-yellow-500/60 rounded-2xl px-10 py-8 flex flex-col items-center gap-3 shadow-[0_0_60px_rgba(234,179,8,0.25)]">
              <span className="text-6xl">{showBadgePopup.badge.icon}</span>
              <span className="text-yellow-400 font-extrabold text-lg">شارة جديدة مكتسبة!</span>
              <span className="text-slate-300 text-sm font-bold">{showBadgePopup.badge.name}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="border-b border-slate-800 pb-4">
        <h3 className="font-extrabold text-sm text-slate-100 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-400" />
          لوحة الإنجازات والتحديات (Ninja Achievements & Challenges)
        </h3>
        <p className="text-xs text-slate-400 mt-1">
          أتمم التحديات اليومية والأسبوعية لاكتساب شارات الإنجاز وتصاعد رتبتك.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "إجمالي XP", value: totalXP, icon: "⚡", color: "text-yellow-400" },
          { label: "الرتبة", value: ninjaRank, icon: "🎖️", color: "text-slate-300", small: true },
          { label: "الشارات", value: `${doneChallenges}/${totalChallenges}`, icon: "🏅", color: "text-amber-400" },
          { label: "الإتمام", value: `${Math.round((doneChallenges / totalChallenges) * 100)}%`, icon: "📊", color: "text-cyan-400" },
        ].map(({ label, value, icon, color, small }) => (
          <div key={label} className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-center">
            <div className="text-xl mb-1">{icon}</div>
            <div className={`font-extrabold ${small ? "text-xs" : "text-sm"} ${color}`}>{value}</div>
            <div className="text-[10px] text-slate-500 mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      {/* Earned Badges */}
      {earnedBadges.length > 0 && (
        <div className="flex flex-col gap-2">
          <span className="text-xs font-bold text-slate-400">🏆 شاراتك المكتسبة:</span>
          <div className="flex flex-wrap gap-2">
            {earnedBadges.map(c => (
              <motion.div
                key={c.id}
                whileHover={{ scale: 1.1 }}
                className={`px-3 py-1.5 rounded-full text-[11px] font-bold flex items-center gap-1.5 border ${COLOR_MAP[c.color].bg} ${COLOR_MAP[c.color].border} ${COLOR_MAP[c.color].text} shadow-md ${COLOR_MAP[c.color].glow}`}
              >
                <span>{c.badge.icon}</span> {c.badge.name}
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2">
        {[
          { id: "daily", label: "تحديات يومية", icon: Clock },
          { id: "weekly", label: "تحديات أسبوعية", icon: Award },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
              activeTab === tab.id
                ? "bg-yellow-500/20 border-yellow-500/40 text-yellow-400"
                : "bg-slate-950 border-slate-800 text-slate-500 hover:text-slate-300"
            }`}
          >
            <tab.icon className="w-3.5 h-3.5" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Challenges */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filtered.map(challenge => {
          const done = !!achievements[challenge.id];
          const c = COLOR_MAP[challenge.color];
          const Icon = challenge.icon;
          return (
            <motion.div
              key={challenge.id}
              whileHover={!done ? { scale: 1.02 } : {}}
              className={`relative border rounded-xl p-4 flex flex-col gap-3 transition-all ${
                done
                  ? "bg-emerald-500/5 border-emerald-500/30 opacity-80"
                  : `${c.bg} ${c.border}`
              }`}
            >
              {done && (
                <div className="absolute top-3 left-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                </div>
              )}
              <div className="flex items-start gap-3 text-right">
                <div className={`p-2 rounded-lg border ${c.border} ${c.bg} flex-shrink-0`}>
                  <Icon className={`w-4 h-4 ${c.text}`} />
                </div>
                <div>
                  <p className={`text-xs font-extrabold ${done ? "text-emerald-400" : c.text}`}>{challenge.title}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">{challenge.desc}</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 px-2 py-0.5 rounded-full font-bold">
                    +{challenge.xp} XP
                  </span>
                  <span className="text-sm">{challenge.badge.icon}</span>
                  <span className="text-[10px] text-slate-500">{challenge.badge.name}</span>
                </div>

                {!done ? (
                  <button
                    onClick={() => completeChallenge(challenge.id, challenge.badge)}
                    className={`text-[10px] font-extrabold px-3 py-1.5 rounded-lg border ${c.border} ${c.text} hover:scale-105 transition-transform cursor-pointer ${c.bg}`}
                  >
                    ✅ تم الإتمام
                  </button>
                ) : (
                  <span className="text-[10px] text-emerald-400 font-bold">مكتمل ✓</span>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.section>
  );
});

export default NinjaAchievements;
