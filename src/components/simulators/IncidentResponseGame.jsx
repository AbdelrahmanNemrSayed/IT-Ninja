import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShieldAlert, ShieldCheck, Flame, Terminal, Play, RotateCw, 
  Activity, Server, Lock, HelpCircle, HardDrive, UserCheck
} from "lucide-react";

const SCENARIOS = [
  {
    id: "ddos",
    title: "DDoS Attack (هجوم حجب الخدمة الموزع)",
    desc: "ارتفاع مفاجئ في حركة المرور الواردة (Packets/sec) يؤدي لشل خوادم الويب ووصول استهلاك المعالج لـ 100%.",
    threatLog: [
      "⚠️ WARNING: Traffic packet rate exceeds 150,000 pps",
      "⚠️ WARNING: CPU Core 1 load: 98%",
      "⚠️ ALERT: Port 80/443 TCP SYN flood detected from 800+ distinct IPs",
      "🚨 CRITICAL: Web app response time is latency > 12,000ms"
    ],
    correctAction: "cloudflare",
    incorrectLogs: {
      ufw: "❌ UFW Block rule was applied, but blocking individual IPs manually is not scalable for 800+ distributed hosts.",
      ssh_port: "❌ تغيير منفذ SSH لم يؤثر على الهجوم الموجه لمنفذي الويب 80 و 443.",
      isolate: "❌ عزل السيرفر أوقف الخدمة تماماً عن الضحايا والعملاء الشرعيين أيضاً.",
      backup: "❌ لا توجد حاجة لاستعادة النسخة الاحتياطية لأن الملفات لم تتضرر، العطل في توفر الخدمة."
    },
    successMsg: "✅ تم تفعيل خدمة Cloudflare Web Application Firewall (WAF) بنجاح وحجب SYN flood تلقائياً!"
  },
  {
    id: "ssh_brute",
    title: "SSH Brute Force (هجوم التخمين العنيف)",
    desc: "محاولات قرصنة متكررة على المنفذ 22 لتخمين كلمة مرور مستخدم root واختراق نظام التشغيل.",
    threatLog: [
      "⚠️ ALERT: Auth failure for user root from 203.0.113.5",
      "⚠️ ALERT: Auth failure for user root from 203.0.113.5 (attempt #45)",
      "⚠️ ALERT: Auth failure for user admin from 203.0.113.5 (attempt #112)",
      "🚨 CRITICAL: Failed password login attempts reaching > 500 in 2 minutes"
    ],
    correctAction: "ssh_port",
    incorrectLogs: {
      cloudflare: "❌ جدار حماية كلودفلير يحمي طبقة الويب (HTTP) فقط، ولا يحمي اتصالات SSH البعيدة.",
      ufw: "❌ تم حظر عنوان IP الحالي، لكن المهاجم قام فوراً بتغيير عنوانه عبر Proxy وبدأ المحاولة من جديد.",
      isolate: "❌ عزل السيرفر كلياً يمنعك أنت كمسؤول نظام من الاتصال لإدارة السيرفر وصيانته.",
      backup: "❌ استعادة النسخة الاحتياطية لن توقف الهجوم المستمر على المنفذ المفتوح."
    },
    successMsg: "✅ تم تغيير منفذ SSH إلى 2202 ووقف تسجيل دخول root المباشر، وتفعيل Fail2ban بنجاح!"
  },
  {
    id: "ransomware",
    title: "Ransomware Outbreak (هجوم فيروس الفدية)",
    desc: "عملية خبيثة تقوم بتشفير ملفات السيرفر يدوياً وتغيير امتداداتها لـ .crypt وتطالب بفدية مالية لاسترجاعها.",
    threatLog: [
      "⚠️ WARNING: High file modification IOPS detected in /var/www",
      "⚠️ WARNING: File index.php renamed to index.php.crypt",
      "🚨 CRITICAL: Encryption key file dropped in home directory: RANSOM_NOTE.txt",
      "🚨 ALERT: Server filesystem health declining rapidly!"
    ],
    correctAction: "isolate",
    incorrectLogs: {
      cloudflare: "❌ خدمة CDN كلودفلير غير قادرة على حظر البرمجيات الخبيثة المحلية الجاري تشغيلها داخل نظام التشغيل.",
      ssh_port: "❌ تغيير منفذ SSH لن يوقف عملية التشفير التلقائية النشطة بالفعل بالخلفية.",
      ufw: "❌ جدار الحماية المحلي UFW لا يحظر العمليات الداخلية التي تجري في السيرفر نفسه.",
      backup: "❌ لا يمكنك استعادة النسخ الاحتياطية بينما الفيروس ما زال يشفّر الملفات، سيقوم بتشفير الملف المستعاد أيضاً."
    },
    successMsg: "✅ تم عزل السيرفر بنجاح (Container Isolation) وقتل العملية الخبيثة، وحظر انتشارها بالشبكة!"
  }
];

export default function IncidentResponseGame() {
  const [activeScenario, setActiveScenario] = useState("ddos");
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameStatus, setGameStatus] = useState("idle"); // idle, playing, won, lost
  const [cpuLoad, setCpuLoad] = useState(15);
  const [serverHealth, setServerHealth] = useState(100);
  const [breachPercent, setBreachPercent] = useState(0);
  const [logs, setLogs] = useState(["🖥️ جاهز لبدء محاكاة الدفاع السيبراني..."]);
  const intervalRef = useRef(null);

  const scenario = SCENARIOS.find(s => s.id === activeScenario);

  const startIncident = () => {
    setIsPlaying(true);
    setGameStatus("playing");
    setCpuLoad(scenario.id === "ddos" ? 65 : 25);
    setServerHealth(100);
    setBreachPercent(0);
    setLogs(["🚨 تم كشف نشاط مريب! جاري قراءة تقارير الـ SOC...", ...scenario.threatLog]);
  };

  useEffect(() => {
    if (gameStatus === "playing") {
      intervalRef.current = setInterval(() => {
        if (activeScenario === "ddos") {
          setCpuLoad(prev => Math.min(100, prev + 5));
          setBreachPercent(prev => Math.min(100, prev + 3));
        } else if (activeScenario === "ssh_brute") {
          setBreachPercent(prev => Math.min(100, prev + 6));
        } else if (activeScenario === "ransomware") {
          setServerHealth(prev => Math.max(0, prev - 8));
          setBreachPercent(prev => Math.min(100, prev + 4));
        }
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [gameStatus, activeScenario]);

  // Check Game Over Conditions
  useEffect(() => {
    if (gameStatus !== "playing") return;

    if (cpuLoad >= 100 && activeScenario === "ddos") {
      setGameStatus("lost");
      setLogs(prev => [...prev, "🚨 GAME OVER: تعطل خادم الويب كلياً وتجاوز المعالج طاقة العمل المسموحة!"]);
    } else if (breachPercent >= 100) {
      setGameStatus("lost");
      setLogs(prev => [...prev, "🚨 GAME OVER: تم تسريب بيانات root ونجاح المخترق في سرقة قواعد البيانات!"]);
    } else if (serverHealth <= 0) {
      setGameStatus("lost");
      setLogs(prev => [...prev, "🚨 GAME OVER: تم تشفير ملفات النظام بالكامل وفقدان صلاحيات الخادم!"]);
    }
  }, [cpuLoad, serverHealth, breachPercent, gameStatus, activeScenario]);

  const handleMitigation = (actionId) => {
    if (gameStatus !== "playing") return;

    if (actionId === scenario.correctAction) {
      setGameStatus("won");
      setLogs(prev => [...prev, scenario.successMsg, "🎉 تم احتواء الهجوم السيبراني بنجاح وحماية البنية التحتية!"]);
      window.dispatchEvent(new CustomEvent("trigger-confetti"));
    } else {
      // Wrong action, output corresponding error log and increase stats
      const errorMsg = scenario.incorrectLogs[actionId] || "❌ إجراء خاطئ لم يؤثر على الهجوم الحالي.";
      setLogs(prev => [...prev, errorMsg]);
      
      if (activeScenario === "ddos") {
        setCpuLoad(prev => Math.min(100, prev + 10));
      } else if (activeScenario === "ssh_brute") {
        setBreachPercent(prev => Math.min(100, prev + 15));
      } else if (activeScenario === "ransomware") {
        setServerHealth(prev => Math.max(0, prev - 15));
      }
    }
  };

  const handleScenarioChange = (id) => {
    setActiveScenario(id);
    setGameStatus("idle");
    setIsPlaying(false);
    setCpuLoad(15);
    setServerHealth(100);
    setBreachPercent(0);
    setLogs([`📂 تم تحميل السيناريو: ${SCENARIOS.find(s => s.id === id).title}`, "🖥️ جاهز لبدء الدفاع..."]);
  };

  return (
    <div id="incident-response" className="glass-card rounded-2xl p-6 flex flex-col gap-6 shadow-lg text-right scroll-mt-28">
      {/* Header */}
      <div className="border-b border-slate-800 pb-3 flex justify-between items-center flex-row-reverse flex-wrap gap-2">
        <div>
          <h3 className="font-extrabold text-sm text-slate-100 flex items-center justify-start gap-2 flex-row-reverse">
            <ShieldAlert className="w-5 h-5 text-rose-400 animate-pulse" />
            مركز الاستجابة للحوادث الأمنية ولعب الأدوار (SOC Incident Response Game)
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            تقمص دور محقق أمن المعلومات (Blue Team) ودافع ضد التهديدات السيبرانية بشكل مباشر وسريع.
          </p>
        </div>

        {/* Scenario selector */}
        <div className="flex items-center gap-2 flex-row-reverse">
          <span className="text-[10px] text-slate-400 font-bold">التهديد:</span>
          <select
            value={activeScenario}
            onChange={(e) => handleScenarioChange(e.target.value)}
            disabled={gameStatus === "playing"}
            className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-slate-300 hover:border-cyan-500/30 transition-colors cursor-pointer font-bold disabled:opacity-50"
          >
            {SCENARIOS.map(s => (
              <option key={s.id} value={s.id}>{s.title}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Live Log logs console */}
        <div className="lg:col-span-5 flex flex-col gap-3">
          <span className="text-[10px] text-slate-400 font-extrabold flex items-center gap-1.5 flex-row-reverse">
            <Terminal className="w-3.5 h-3.5 text-rose-400" />
            شاشة مراقبة التهديد (SOC Live Alert Console)
          </span>

          <div className="bg-black/90 rounded-xl p-4 h-72 border border-slate-850 overflow-y-auto flex flex-col gap-1.5 text-left font-mono text-[9px] leading-relaxed" style={{ direction: "ltr" }}>
            {logs.map((log, idx) => (
              <div key={idx} className={
                log.includes("🚨") || log.startsWith("⚠️") || log.startsWith("❌")
                  ? "text-rose-400 font-bold" 
                  : log.startsWith("✅") || log.includes("🎉") 
                  ? "text-emerald-400 font-bold" 
                  : "text-slate-300"
              }>
                {log}
              </div>
            ))}
          </div>
        </div>

        {/* Middle: Metrics panel */}
        <div className="lg:col-span-3 flex flex-col gap-4 bg-slate-950/80 border border-slate-850 p-4 rounded-xl items-center justify-center">
          <span className="text-[10px] text-slate-500 font-extrabold block text-center">مؤشرات أداء السيرفر والأمان</span>
          
          <div className="flex flex-col gap-3 w-full mt-2">
            {/* CPU Load */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between items-center text-[9px] flex-row-reverse">
                <span className="text-slate-400">استهلاك المعالج (CPU):</span>
                <span className={`font-mono font-bold ${cpuLoad > 80 ? "text-rose-400" : "text-cyan-400"}`}>{cpuLoad}%</span>
              </div>
              <div className="h-1.5 bg-slate-900 rounded-full overflow-hidden">
                <div className={`h-full transition-all duration-300 ${cpuLoad > 80 ? "bg-rose-500" : "bg-cyan-500"}`} style={{ width: `${cpuLoad}%` }} />
              </div>
            </div>

            {/* Server Health */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between items-center text-[9px] flex-row-reverse">
                <span className="text-slate-400">سلامة السيرفر (Health):</span>
                <span className={`font-mono font-bold ${serverHealth < 40 ? "text-rose-400" : "text-emerald-400"}`}>{serverHealth}%</span>
              </div>
              <div className="h-1.5 bg-slate-900 rounded-full overflow-hidden">
                <div className={`h-full transition-all duration-300 ${serverHealth < 40 ? "bg-rose-500" : "bg-emerald-500"}`} style={{ width: `${serverHealth}%` }} />
              </div>
            </div>

            {/* Breach Level */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between items-center text-[9px] flex-row-reverse">
                <span className="text-slate-400">مستوى محاولة الاختراق (Breach):</span>
                <span className={`font-mono font-bold ${breachPercent > 70 ? "text-rose-400 animate-pulse" : "text-amber-400"}`}>{breachPercent}%</span>
              </div>
              <div className="h-1.5 bg-slate-900 rounded-full overflow-hidden">
                <div className={`h-full transition-all duration-300 ${breachPercent > 70 ? "bg-rose-500" : "bg-amber-500"}`} style={{ width: `${breachPercent}%` }} />
              </div>
            </div>
          </div>

          {/* Trigger button */}
          <div className="mt-4 w-full">
            {gameStatus === "idle" ? (
              <button
                onClick={startIncident}
                className="w-full bg-rose-600 hover:bg-rose-500 text-slate-950 font-black py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 flex-row-reverse transition-all cursor-pointer shadow-[0_0_15px_rgba(244,63,94,0.15)]"
              >
                <Flame className="w-4 h-4" /> ابدأ محاكاة التهديد السيبراني
              </button>
            ) : (
              <button
                onClick={() => handleScenarioChange(activeScenario)}
                className="w-full bg-slate-900 hover:bg-slate-850 text-slate-350 border border-slate-800 font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 flex-row-reverse transition-all cursor-pointer"
              >
                <RotateCw className="w-4 h-4" /> إعادة التجربة
              </button>
            )}
          </div>
        </div>

        {/* Right Side: Attack Mitigation Tools */}
        <div className="lg:col-span-4 flex flex-col gap-3">
          <span className="text-[10px] text-slate-400 font-extrabold flex items-center gap-1.5 flex-row-reverse">
            <Lock className="w-3.5 h-3.5 text-cyan-400" />
            أدوات وإجراءات الدفاع (Mitigation Actions)
          </span>

          <div className="flex flex-col gap-2">
            {[
              { id: "cloudflare", title: "تفعيل Cloudflare CDN Rate Limit", desc: "تحديد معدل الطلبات لكل IP لحظر موجات الطلبات الكثيفة (DDoS)." },
              { id: "ssh_port", title: "تعديل منفذ SSH وإلغاء دخول Root", desc: "تغيير المنفذ الافتراضي وحظر تسجيل root المباشر لوقف Brute Force." },
              { id: "ufw", title: "تطبيق قاعدة حظر لـ IP المهاجم في UFW", desc: "حظر عنوان IP محدد مستهدف للخدمة عبر جدار الحماية المحلي." },
              { id: "isolate", title: "عزل حاوية السيرفر (Isolate Container)", desc: "عزل الخادم شبكياً لمنع انتشار البرمجيات الخبيثة أو برامج الفدية." }
            ].map(tool => (
              <button
                key={tool.id}
                onClick={() => handleMitigation(tool.id)}
                disabled={gameStatus !== "playing"}
                className={`p-3 rounded-xl border text-right transition-all flex flex-col gap-1 cursor-pointer ${
                  gameStatus === "playing"
                    ? "bg-slate-950 border-slate-850 hover:border-rose-500/40 hover:bg-slate-900"
                    : "bg-slate-950 border-slate-900 text-slate-600 cursor-not-allowed opacity-50"
                }`}
              >
                <span className="text-[10px] font-black text-slate-200">{tool.title}</span>
                <span className="text-[8px] text-slate-400 leading-normal">{tool.desc}</span>
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Outcome Banner */}
      <AnimatePresence>
        {gameStatus === "won" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-4 rounded-xl border bg-emerald-500/10 border-emerald-500/30 text-emerald-400 text-center text-xs font-black flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-5 h-5 text-emerald-400 animate-bounce" />
            رائع جداً! نجحت في حل السيناريو وتأمين السيرفر تماماً! (+50 XP)
          </motion.div>
        )}
        {gameStatus === "lost" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-4 rounded-xl border bg-rose-500/10 border-rose-500/30 text-rose-400 text-center text-xs font-black flex items-center justify-center gap-2 animate-pulse"
          >
            <Flame className="w-5 h-5 text-rose-400" />
            للأسف! لم تنجح في احتواء التهديد في الوقت المناسب وتعطل السيرفر! أعد المحاولة مجدداً.
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
