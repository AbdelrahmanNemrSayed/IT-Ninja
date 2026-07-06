import React, { useState, useEffect, useCallback, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Map, BookOpen, Target, Save, Trash2, CheckCircle, Clock, Award } from "lucide-react";

const roadmapTemplates = {
  sysadmin_beginner: {
    title: "🛡️ مسار SysAdmin — من الصفر",
    weeks: [
      {
        week: 1, topic: "أساسيات Linux وسطر الأوامر",
        tasks: ["تثبيت Ubuntu Server في VirtualBox", "تعلم أوامر ls, cd, cp, mv, rm", "إدارة المستخدمين useradd, passwd", "صلاحيات الملفات chmod/chown"],
      },
      {
        week: 2, topic: "إدارة الخدمات والشبكات",
        tasks: ["systemctl: تشغيل وإيقاف الخدمات", "إعداد static IP على الشبكة", "فهم SSH وكيفية الاتصال الآمن", "إعداد Firewall بـ ufw"],
      },
      {
        week: 3, topic: "خادم الويب والـ DNS",
        tasks: ["تثبيت وإعداد Nginx", "ضبط Virtual Hosts", "فهم نظام DNS وكيف يعمل", "تثبيت شهادة SSL مجانية Let's Encrypt"],
      },
      {
        week: 4, topic: "قواعد البيانات والنسخ الاحتياطي",
        tasks: ["تثبيت وإدارة MySQL", "أوامر cron لجدولة المهام التلقائية", "سكربت Bash لأخذ نسخة احتياطية", "رفع النسخ الاحتياطية إلى S3"],
      },
    ],
    cert: "CompTIA Linux+ أو RHCSA",
    color: "emerald",
  },
  network_intermediate: {
    title: "🌐 مسار Network Engineer — متوسط",
    weeks: [
      {
        week: 1, topic: "مراجعة نموذج OSI/TCP-IP والبروتوكولات",
        tasks: ["فهم طبقات OSI بأمثلة عملية", "بروتوكولات الراوتر: RIP, OSPF, EIGRP", "تحليل حزم البيانات بـ Wireshark", "أساسيات الـ Subnetting والـ VLSM"],
      },
      {
        week: 2, topic: "Switching وVLAN",
        tasks: ["إعداد VLANs على سويتش Cisco", "ضبط بروتوكول STP لمنع الحلقات", "إعداد EtherChannel لزيادة عرض النطاق", "تكوين Inter-VLAN Routing"],
      },
      {
        week: 3, topic: "Routing متقدم وWAN",
        tasks: ["إعداد OSPF على بيئة متعددة الراوترات", "تكوين BGP للتواصل مع الإنترنت", "تقنيات WAN: MPLS, VPN, SD-WAN", "أدوات مراقبة: NetFlow, SNMP"],
      },
      {
        week: 4, topic: "أمن الشبكات",
        tasks: ["تطبيق ACLs على الراوترات", "إعداد VPN بـ IPSec", "فهم IDS/IPS ووضعهم الصحيح", "مراجعة وتقديم امتحان CCNA تجريبي"],
      },
    ],
    cert: "Cisco CCNA 200-301",
    color: "cyan",
  },
  devops_advanced: {
    title: "⚙️ مسار DevOps Engineer — متقدم",
    weeks: [
      {
        week: 1, topic: "Containers وKubernetes",
        tasks: ["Docker: بناء صور مخصصة وملفات Dockerfile", "Docker Compose لإدارة تطبيقات متعددة", "Kubernetes: Pods, Services, Deployments", "Helm Charts لإدارة تطبيقات K8s"],
      },
      {
        week: 2, topic: "CI/CD وأتمتة التسليم",
        tasks: ["إعداد Jenkins Pipeline من الصفر", "GitHub Actions للـ CI/CD التلقائي", "مراحل: Build > Test > Deploy في Pipeline", "إدارة بيئات Dev/Staging/Production"],
      },
      {
        week: 3, topic: "Infrastructure as Code",
        tasks: ["Terraform: كتابة أول ملف main.tf لـ AWS", "إدارة الـ State والـ Remote Backend", "Ansible Playbooks لتهيئة السيرفرات", "اختبار الـ IaC مع Terratest"],
      },
      {
        week: 4, topic: "Observability والمراقبة",
        tasks: ["إعداد Prometheus + Grafana Stack", "تكوين AlertManager لإرسال إشعارات", "مراقبة Kubernetes بـ Lens وk9s", "SRE: SLO, SLA, Error Budget مفاهيم"],
      },
    ],
    cert: "CKA (Certified Kubernetes Administrator)",
    color: "purple",
  },
};

const STORAGE_KEY = "ninja_roadmap_planner_v2";

const LEVEL_OPTIONS = [
  { id: "beginner", label: "مبتدئ تماماً", icon: "🌱" },
  { id: "intermediate", label: "متوسط", icon: "🚀" },
  { id: "advanced", label: "متقدم", icon: "⚡" },
];

const GOAL_OPTIONS = [
  { id: "sysadmin", label: "SysAdmin", icon: "🛡️" },
  { id: "network", label: "Network Engineer", icon: "🌐" },
  { id: "devops", label: "DevOps Engineer", icon: "⚙️" },
];

function getTemplate(level, goal) {
  if (goal === "sysadmin") return roadmapTemplates.sysadmin_beginner;
  if (goal === "network") return roadmapTemplates.network_intermediate;
  return roadmapTemplates.devops_advanced;
}

const RoadmapPlanner = memo(function RoadmapPlanner() {
  const [level, setLevel] = useState(null);
  const [goal, setGoal] = useState(null);
  const [plan, setPlan] = useState(null);
  const [progress, setProgress] = useState({});
  const [saved, setSaved] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        if (data.level) setLevel(data.level);
        if (data.goal) setGoal(data.goal);
        if (data.progress) setProgress(data.progress);
        if (data.level && data.goal) {
          setPlan(getTemplate(data.level, data.goal));
        }
      }
    } catch {}
  }, []);

  // Auto-save on change
  useEffect(() => {
    if (!plan) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ level, goal, progress }));
    } catch {}
  }, [level, goal, progress, plan]);

  const handleGenerate = useCallback(() => {
    if (!level || !goal) return;
    const template = getTemplate(level, goal);
    setPlan(template);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }, [level, goal]);

  const toggleTask = useCallback((weekIdx, taskIdx) => {
    const key = `${weekIdx}-${taskIdx}`;
    setProgress(prev => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const handleReset = () => {
    setPlan(null);
    setLevel(null);
    setGoal(null);
    setProgress({});
    localStorage.removeItem(STORAGE_KEY);
  };

  const totalTasks = plan ? plan.weeks.reduce((s, w) => s + w.tasks.length, 0) : 0;
  const doneTasks = Object.values(progress).filter(Boolean).length;
  const pct = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

  const accentColors = {
    emerald: { bar: "bg-emerald-500", text: "text-emerald-400", ring: "ring-emerald-500/40", border: "border-emerald-500/30 bg-emerald-500/10" },
    cyan: { bar: "bg-cyan-500", text: "text-cyan-400", ring: "ring-cyan-500/40", border: "border-cyan-500/30 bg-cyan-500/10" },
    purple: { bar: "bg-purple-500", text: "text-purple-400", ring: "ring-purple-500/40", border: "border-purple-500/30 bg-purple-500/10" },
  };

  const ac = plan ? accentColors[plan.color] : accentColors.cyan;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-slate-900/40 backdrop-blur-md border border-purple-500/20 rounded-2xl p-6 flex flex-col gap-6 shadow-lg"
    >
      <div className="border-b border-slate-800 pb-4">
        <h3 className="font-extrabold text-sm text-slate-100 flex items-center gap-2">
          <Map className="w-5 h-5 text-purple-400" />
          مخطط المذاكرة الذاتي المخصص (Custom Roadmap Planner)
        </h3>
        <p className="text-xs text-slate-400 mt-1 text-right">
          اختر مستواك وهدفك الوظيفي وسيُولّد لك الموقع خطة مذاكرة أسبوعية محكمة — مع حفظ تقدمك تلقائياً في المتصفح.
        </p>
      </div>

      {!plan ? (
        <div className="flex flex-col gap-6" dir="rtl">
          {/* Level Selector */}
          <div className="flex flex-col gap-3">
            <span className="text-sm font-bold text-slate-300">📊 ما مستواك الحالي؟</span>
            <div className="flex flex-wrap gap-3">
              {LEVEL_OPTIONS.map(opt => (
                <button
                  key={opt.id}
                  onClick={() => setLevel(opt.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-bold transition-all cursor-pointer ${
                    level === opt.id
                      ? "bg-purple-500/20 border-purple-500/60 text-purple-300 shadow-md"
                      : "bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700"
                  }`}
                >
                  <span>{opt.icon}</span> {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Goal Selector */}
          <div className="flex flex-col gap-3">
            <span className="text-sm font-bold text-slate-300">🎯 ما هدفك الوظيفي؟</span>
            <div className="flex flex-wrap gap-3">
              {GOAL_OPTIONS.map(opt => (
                <button
                  key={opt.id}
                  onClick={() => setGoal(opt.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-bold transition-all cursor-pointer ${
                    goal === opt.id
                      ? "bg-cyan-500/20 border-cyan-500/60 text-cyan-300 shadow-md"
                      : "bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700"
                  }`}
                >
                  <span>{opt.icon}</span> {opt.label}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={!level || !goal}
            className="self-start px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-cyan-500 text-slate-950 font-extrabold text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:scale-105 transition-transform cursor-pointer shadow-lg"
          >
            ✨ أنشئ خطة المذاكرة الآن
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-5" dir="rtl">
          {/* Header */}
          <div className={`border rounded-xl p-4 flex flex-col gap-2 ${ac.border}`}>
            <div className="flex items-center justify-between">
              <span className={`text-sm font-extrabold ${ac.text}`}>{plan.title}</span>
              <div className="flex gap-2">
                <span className="text-[10px] text-slate-500 flex items-center gap-1">
                  {saved && <span className="text-emerald-400 font-bold">✅ محفوظ</span>}
                  <Save className="w-3 h-3 text-slate-600" /> حفظ تلقائي
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              <span className="text-[11px] text-slate-400">الشهادة الموصى بها: <span className="text-amber-300 font-bold">{plan.cert}</span></span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-[11px] font-bold">
              <span className="text-slate-400">{doneTasks} / {totalTasks} مهمة مكتملة</span>
              <span className={ac.text}>{pct}%</span>
            </div>
            <div className="bg-slate-900 rounded-full h-2.5 overflow-hidden">
              <motion.div
                className={`h-full rounded-full ${ac.bar}`}
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>

          {/* Weekly Plans */}
          <div className="flex flex-col gap-4">
            {plan.weeks.map((week, wi) => {
              const weekDone = week.tasks.filter((_, ti) => progress[`${wi}-${ti}`]).length;
              return (
                <div key={wi} className="bg-slate-950 border border-slate-900 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-slate-500" />
                      <span className="text-xs font-bold text-slate-400">الأسبوع {week.week}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        weekDone === week.tasks.length ? "bg-emerald-500/20 text-emerald-400" : "bg-slate-900 text-slate-500"
                      }`}>
                        {weekDone}/{week.tasks.length}
                      </span>
                    </div>
                    <span className={`text-xs font-extrabold ${ac.text}`}>{week.topic}</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    {week.tasks.map((task, ti) => {
                      const key = `${wi}-${ti}`;
                      const done = progress[key];
                      return (
                        <button
                          key={ti}
                          onClick={() => toggleTask(wi, ti)}
                          className={`flex items-center gap-3 text-right text-xs rounded-lg px-3 py-2 border transition-all cursor-pointer ${
                            done
                              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                              : "bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-300"
                          }`}
                        >
                          <CheckCircle className={`w-4 h-4 flex-shrink-0 ${done ? "text-emerald-400" : "text-slate-700"}`} />
                          <span className={done ? "line-through opacity-70" : ""}>{task}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={handleReset}
            className="flex items-center gap-2 self-start text-xs text-slate-500 hover:text-rose-400 transition-colors cursor-pointer px-3 py-1.5 rounded-lg border border-slate-900 hover:border-rose-500/30"
          >
            <Trash2 className="w-3 h-3" /> إعادة تعيين الخطة
          </button>
        </div>
      )}
    </motion.section>
  );
});

export default RoadmapPlanner;
