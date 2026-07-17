import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShieldAlert, ShieldCheck, Flame, RotateCw, Activity, 
  Server, Database, Clock, Zap, AlertTriangle, Play
} from "lucide-react";

const DISASTER_SCENARIOS = {
  db_delete: {
    title: "حذف قاعدة بيانات الانتاج بالخطأ (Accidental Drop DB)",
    desc: "قام مهندس مبتدئ بحذف قاعدة بيانات المبيعات الحية بالخطأ. يتعين عليك استعادة البيانات من النسخ الاحتياطية واستئناف عمل النظام.",
    rtoTarget: 30, // Target RTO (seconds in simulator scale)
    rpoTarget: 60, // Target RPO max loss allowed (minutes of transaction logs)
    steps: [
      { id: "stop_app", label: "1. إيقاف خوادم الويب مؤقتاً لتجنب تضارب العمليات", solved: false },
      { id: "locate_backup", label: "2. تحديد وتثبيت أحدث نسخة احتياطية حية (Daily Backup)", solved: false },
      { id: "restore_sql", label: "3. تشغيل استعادة SQL Script وفحص اتساق البيانات", solved: false },
      { id: "start_app", label: "4. إعادة توجيه وتنشيط الخدمة لجمهور المستخدمين", solved: false }
    ],
    successLogs: "🎉 تم استرجاع قاعدة البيانات وعودتها للإنتاج بنجاح!"
  },
  ransomware: {
    title: "هجوم فيروس الفدية على الخادم الرئيسي (Server Ransomware)",
    desc: "تم تشفير كافة ملفات خادم الملفات الرئيسي من قبل برمجية خبيثة وطُلب فدية فك التشفير. يجب عزل الخادم وتفعيل الخادم الاحتياطي.",
    rtoTarget: 40,
    rpoTarget: 120,
    steps: [
      { id: "isolate", label: "1. عزل خادم الملفات المصاب فوراً عن الشبكة المحلية", solved: false },
      { id: "spin_replica", label: "2. تشغيل السيرفر الاحتياطي (Spin replica VM)", solved: false },
      { id: "restore_files", label: "3. استيراد الملفات النظيفة من النسخة السحابية المعزولة", solved: false },
      { id: "dns_failover", label: "4. تعديل إعدادات الـ DNS (Failover) وتوجيه المستخدمين", solved: false }
    ],
    successLogs: "🎉 تم عزل التهديد السيبراني وتفعيل خادم الطوارئ بنجاح!"
  }
};

export default function DisasterRecoverySimulator() {
  const [selectedScenario, setSelectedScenario] = useState("db_delete");
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameStatus, setGameStatus] = useState("idle"); // idle, playing, won, lost
  const [steps, setSteps] = useState(DISASTER_SCENARIOS.db_delete.steps);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [rpoLoss, setRpoLoss] = useState(0);
  const [logs, setLogs] = useState(["🖥️ جاهز لبدء محاكاة استعادة الكوارث (DR Lab)..."]);
  const [xpEarned, setXpEarned] = useState(false);

  const scenario = DISASTER_SCENARIOS[selectedScenario];
  const timerRef = useRef(null);

  useEffect(() => {
    const sc = DISASTER_SCENARIOS[selectedScenario];
    setSteps(JSON.parse(JSON.stringify(sc.steps)));
    setElapsedTime(0);
    setRpoLoss(0);
    setGameStatus("idle");
    setIsPlaying(false);
    setLogs([`📂 تم تحميل السيناريو: ${sc.title}`, "🖥️ اضغط 'ابدأ المحاكاة' للتعامل مع الكارثة وتقييم SLA."]);
  }, [selectedScenario]);

  useEffect(() => {
    if (gameStatus === "playing") {
      timerRef.current = setInterval(() => {
        setElapsedTime(prev => prev + 1);
        // RPO loss slowly increases the longer it takes to isolate or restore
        setRpoLoss(prev => prev + 4);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameStatus]);

  const startSimulation = () => {
    setIsPlaying(true);
    setGameStatus("playing");
    setElapsedTime(0);
    setRpoLoss(15); // initial transaction log loss
    setLogs(["🚨 كارثة فنية نشطة! تم تعطل الخدمة بالكامل!", "⚠️ ابدأ فوراً بخطوات خطة استرداد الكوارث (DRP)..."]);
  };

  const executeStep = (stepId, index) => {
    if (gameStatus !== "playing") return;
    
    // Enforce sequential steps
    const isPreviousSolved = index === 0 || steps[index - 1].solved;
    if (!isPreviousSolved) {
      setLogs(prev => [...prev, "❌ خطأ: يجب إتمام الخطوات بالترتيب الصحيح لمنع تعقيد الكارثة."]);
      return;
    }

    const updatedSteps = [...steps];
    updatedSteps[index].solved = true;
    setSteps(updatedSteps);
    setLogs(prev => [...prev, `⚙️ إتمام: ${steps[index].label}`]);

    // Check if final step is solved
    const allSolved = updatedSteps.every(s => s.solved);
    if (allSolved) {
      // Calculate SLA compliance
      const rtoPassed = elapsedTime <= scenario.rtoTarget;
      const rpoPassed = rpoLoss <= scenario.rpoTarget;

      if (rtoPassed && rpoPassed) {
        setGameStatus("won");
        setLogs(prev => [
          ...prev,
          scenario.successLogs,
          `🏆 تم الالتزام باتفاقية الخدمة SLA بنجاح! RTO: ${elapsedTime}s (المستهدف <= ${scenario.rtoTarget}s)، RPO: ${rpoLoss}m (المستهدف <= ${scenario.rpoTarget}m)`
        ]);
        window.dispatchEvent(new CustomEvent("trigger-confetti"));
        if (!xpEarned) setXpEarned(true);
      } else {
        setGameStatus("lost");
        setLogs(prev => [
          ...prev,
          "❌ تجاوز للحدود المسموحة باتفاقية مستوى الخدمة (SLA Breach)!",
          `📉 المقاييس المحققة: RTO: ${elapsedTime}s (المستهدف <= ${scenario.rtoTarget}s)، RPO: ${rpoLoss}m (المستهدف <= ${scenario.rpoTarget}m)`
        ]);
      }
    }
  };

  const resetSimulator = () => {
    const sc = DISASTER_SCENARIOS[selectedScenario];
    setSteps(JSON.parse(JSON.stringify(sc.steps)));
    setElapsedTime(0);
    setRpoLoss(0);
    setGameStatus("idle");
    setIsPlaying(false);
    setLogs([`📂 تم تحميل السيناريو: ${sc.title}`, "🖥️ اضغط 'ابدأ المحاكاة' للتعامل مع الكارثة وتقييم SLA."]);
  };

  return (
    <div id="disaster-recovery" className="glass-card rounded-2xl p-6 flex flex-col gap-6 shadow-lg text-right scroll-mt-28">
      {/* Header */}
      <div className="border-b border-slate-800 pb-3 flex justify-between items-center flex-row-reverse flex-wrap gap-2">
        <div>
          <h3 className="font-extrabold text-sm text-slate-100 flex items-center justify-start gap-2 flex-row-reverse">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            محاكي استعادة الكوارث والنسخ الاحتياطي (Disaster Recovery & Backup SLA Lab)
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            خطط ونفذ إجراءات الطوارئ عند انهيار خوادم الإنتاج، وقس التزامك باتفاقيات SLA لاستعادة الأعمال.
          </p>
        </div>

        {/* Scenario selector */}
        <div className="flex items-center gap-2 flex-row-reverse">
          <span className="text-[10px] text-slate-400 font-bold">السيناريو:</span>
          <select
            value={selectedScenario}
            onChange={(e) => setSelectedScenario(e.target.value)}
            disabled={gameStatus === "playing"}
            className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-slate-330 hover:border-emerald-500/30 transition-colors cursor-pointer font-bold disabled:opacity-50"
          >
            {Object.keys(DISASTER_SCENARIOS).map(key => (
              <option key={key} value={key}>{DISASTER_SCENARIOS[key].title}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Terminal Incident logs */}
        <div className="lg:col-span-5 flex flex-col gap-3">
          <span className="text-[10px] text-slate-400 font-extrabold flex items-center gap-1.5 flex-row-reverse">
            <Activity className="w-3.5 h-3.5 text-rose-500" />
            سجل مخرجات الكارثة (Disaster Incident Log Console)
          </span>

          <div className="bg-black/90 border border-slate-850 rounded-xl p-4 h-64 overflow-y-auto flex flex-col gap-1 text-left font-mono text-[9px]" style={{ direction: "ltr" }}>
            {logs.map((log, idx) => (
              <div key={idx} className={
                log.includes("🚨") || log.startsWith("❌") || log.startsWith("⚠️") 
                  ? "text-rose-400 font-bold" 
                  : log.startsWith("🎉") || log.startsWith("🏆") || log.startsWith("✅")
                  ? "text-emerald-400 font-bold" 
                  : "text-slate-300"
              }>
                {log}
              </div>
            ))}
          </div>
        </div>

        {/* Middle: Live SLAs and Metrics */}
        <div className="lg:col-span-3 bg-slate-950/80 border border-slate-850 p-4 rounded-xl flex flex-col items-center justify-between min-h-[260px]">
          <span className="text-[10px] text-slate-500 font-extrabold block text-center">أهداف SLA المحققة</span>

          <div className="flex flex-col gap-4 w-full my-3">
            {/* RTO Timer */}
            <div className="flex flex-col gap-1 items-center">
              <span className="text-[8px] text-slate-400">وقت الاستعادة الفعلي (RTO):</span>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-cyan-400 animate-pulse" />
                <span className="text-xl font-black text-slate-100">{elapsedTime}s</span>
              </div>
              <span className="text-[7px] text-slate-500">المستهدف: &lt;= {scenario.rtoTarget}s</span>
            </div>

            {/* RPO Data Loss */}
            <div className="flex flex-col gap-1 items-center">
              <span className="text-[8px] text-slate-400">فقدان البيانات الفعلي (RPO):</span>
              <div className="flex items-center gap-1.5">
                <Database className="w-4 h-4 text-amber-400" />
                <span className="text-xl font-black text-slate-100">{rpoLoss}m</span>
              </div>
              <span className="text-[7px] text-slate-500">المستهدف: &lt;= {scenario.rpoTarget}m</span>
            </div>
          </div>

          <div className="w-full">
            {gameStatus === "idle" ? (
              <button
                onClick={startSimulation}
                className="w-full bg-rose-600 hover:bg-rose-500 text-slate-950 font-black py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 flex-row-reverse transition-all cursor-pointer shadow-[0_0_15px_rgba(244,63,94,0.15)]"
              >
                <Play className="w-4 h-4" /> ابدأ محاكاة الكارثة
              </button>
            ) : (
              <button
                onClick={resetSimulator}
                className="w-full bg-slate-900 hover:bg-slate-850 text-slate-350 border border-slate-800 font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 flex-row-reverse transition-all cursor-pointer"
              >
                <RotateCw className="w-4 h-4" /> إعادة المحاكاة
              </button>
            )}
          </div>
        </div>

        {/* Right: DR Steps checklist actions */}
        <div className="lg:col-span-4 flex flex-col gap-3">
          <span className="text-[10px] text-slate-400 font-extrabold flex items-center gap-1.5 flex-row-reverse">
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
            خطوات الاستعادة الإجرائية (DRP Execution Steps)
          </span>

          <div className="flex flex-col gap-2">
            {steps.map((step, idx) => (
              <button
                key={step.id}
                onClick={() => executeStep(step.id, idx)}
                disabled={gameStatus !== "playing" || step.solved}
                className={`p-3 rounded-xl border text-right transition-all flex flex-col gap-1 cursor-pointer ${
                  step.solved
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                    : gameStatus === "playing"
                    ? "bg-slate-950 border-slate-850 hover:border-cyan-500/40 hover:bg-slate-900"
                    : "bg-slate-950 border-slate-900 text-slate-600 cursor-not-allowed opacity-50"
                }`}
              >
                <span className="text-[10px] font-black">{step.label}</span>
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Outcome banners */}
      <AnimatePresence>
        {gameStatus === "won" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-4 rounded-xl border bg-emerald-500/10 border-emerald-500/30 text-emerald-400 text-center text-xs font-black flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-5 h-5 text-emerald-400 animate-bounce" />
            مذهل! لقد حافظت على معايير SLA المطلوبة وأعدت الخدمة للعمل بنجاح! (+50 XP)
          </motion.div>
        )}
        {gameStatus === "lost" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-4 rounded-xl border bg-rose-500/10 border-rose-500/30 text-rose-400 text-center text-xs font-black flex items-center justify-center gap-2 animate-pulse"
          >
            <AlertTriangle className="w-5 h-5 text-rose-400" />
            انتهى الوقت! فشل خطة الاستعادة وتجاوزت معايير SLA المقررة للأمان.
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
