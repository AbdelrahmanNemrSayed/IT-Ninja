import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Terminal, Shield, Server, Network, Trophy, Star, 
  Play, BookOpen, Flame, Clock, Compass, HelpCircle, 
  CheckCircle, ArrowLeft, RefreshCw, Zap
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useProfile } from "../../context/ProfileContext";

// Daily IT Questions DB for interactive challenge
const DAILY_QUESTIONS = [
  {
    id: 1,
    question: "ما هو البروتوكول المسؤول عن تحويل عناوين الـ IP إلى عناوين MAC داخل الشبكة المحلية؟",
    options: ["DNS", "ARP", "DHCP", "NAT"],
    answer: "ARP",
    explanation: "بروتوكول ARP (Address Resolution Protocol) يقوم برسم خريطة وتحويل الـ IP layer 3 إلى MAC address layer 2."
  },
  {
    id: 2,
    question: "أي من مستويات الـ RAID التالية يقدم أفضل أداء قراءة وكتابة ولكنه لا يقدم أي تسامح مع الأخطاء (No Fault Tolerance)؟",
    options: ["RAID 0", "RAID 1", "RAID 5", "RAID 10"],
    answer: "RAID 0",
    explanation: "تقنية RAID 0 تقوم بتوزيع البيانات (Striping) دون نسخ احتياطي، مما يعطي أداء خارقاً ولكن عطل قرص واحد يفقدك كامل البيانات."
  },
  {
    id: 3,
    question: "ما هو المنفذ (Port) الافتراضي الذي يعمل عليه بروتوكول نقل الملفات الآمن SFTP؟",
    options: ["21", "22", "23", "80"],
    answer: "22",
    explanation: "يعتمد SFTP على بروتوكول SSH لنقل البيانات بأمان، ولذلك يعمل افتراضياً على منفذ SSH وهو المنفذ 22."
  },
  {
    id: 4,
    question: "ما هي الأداة المخصصة لتحديث وتطبيق سياسات المجموعة (GPO) فوراً في نظام Windows Server Active Directory؟",
    options: ["gpupdate /force", "nslookup", "ipconfig /renew", "sfc /scannow"],
    answer: "gpupdate /force",
    explanation: "يستخدم الأمر gpupdate /force لإجبار نظام التشغيل على سحب وتطبيق سياسات الـ Group Policy الجديدة من خادم الدومين فوراً."
  },
  {
    id: 5,
    question: "أي من العناوين التالية يمثل عنوان الاسترجاع الذاتي (Loopback IP Address) الافتراضي لبطاقة الشبكة؟",
    options: ["192.168.1.1", "127.0.0.1", "10.0.0.1", "0.0.0.0"],
    answer: "127.0.0.1",
    explanation: "العنوان 127.0.0.1 هو عنوان localhost/loopback المخصص لاختبار برمجيات الشبكة محلياً على نفس الجهاز."
  }
];

export default function NinjaHQ({ 
  completedCount, 
  totalCheckboxes, 
  globalProgressPercent,
  navigateToTab,
  earnedBadges
}) {
  const { user, profile, addXP } = useAuth();
  const { activeProfile } = useProfile();
  
  // Daily challenge state
  const [dailyQuestion, setDailyQuestion] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [answeredToday, setAnsweredToday] = useState(false);

  useEffect(() => {
    // Check if challenge was already answered today
    const lastAnsweredDate = localStorage.getItem("ninja-daily-answered-date");
    const todayStr = new Date().toDateString();
    
    if (lastAnsweredDate === todayStr) {
      setAnsweredToday(true);
    }

    // Set a consistent question based on the day of the month
    const day = new Date().getDate();
    const qIndex = day % DAILY_QUESTIONS.length;
    setDailyQuestion(DAILY_QUESTIONS[qIndex]);
  }, []);

  const handleAnswerSubmit = (option) => {
    if (submitted) return;
    setSelectedAnswer(option);
  };

  const checkAnswer = () => {
    if (!selectedAnswer || submitted) return;
    
    setSubmitted(true);
    setShowExplanation(true);
    
    if (selectedAnswer === dailyQuestion.answer) {
      // Award XP
      if (!answeredToday) {
        addXP(20);
        localStorage.setItem("ninja-daily-answered-date", new Date().toDateString());
        setAnsweredToday(true);
      }
    }
  };

  // Streak calculation
  const getStreakCount = () => {
    try {
      const data = localStorage.getItem("ninja-streak");
      if (data) {
        const parsed = JSON.parse(data);
        return parsed.currentStreak || 1;
      }
    } catch {}
    return 1;
  };

  return (
    <div className="flex flex-col gap-8 text-right">
      
      {/* 🚀 Welcome Hero Section */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-slate-900 via-slate-950 to-purple-950/40 border border-slate-800/80 rounded-2xl p-6 md:p-8 relative overflow-hidden shadow-2xl"
      >
        <div className="absolute -right-16 -top-16 w-80 h-80 bg-cyan-500/10 rounded-full filter blur-3xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 w-80 h-80 bg-purple-500/10 rounded-full filter blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row-reverse justify-between items-center gap-6">
          <div className="flex flex-col gap-2.5 max-w-xl">
            <div className="flex items-center justify-end gap-2 flex-row-reverse">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
              <span className="text-[10px] font-extrabold text-cyan-400 uppercase tracking-widest bg-cyan-950/50 px-2.5 py-0.5 rounded-full border border-cyan-500/20">IT Ninja Command Center</span>
            </div>
            
            <h2 className="text-2xl md:text-3xl font-black text-slate-100 leading-tight">
              أهلاً بك في المقر الرئيسي للنينجا،{" "}
              <span className="bg-gradient-to-r from-cyan-400 via-purple-300 to-emerald-400 bg-clip-text text-transparent">
                {profile?.username || activeProfile?.name || "مهندس المستقبل"}
              </span> 🥷
            </h2>
            
            <p className="text-xs text-slate-400 leading-relaxed mt-1">
              مقرّك المتكامل لتعلّم هندسة البنية التحتية، تجربة المحاكيات التفاعلية، وتتبع مستواك المهني لتصبح مهندس أنظمة وشبكات محترف.
            </p>

            <div className="flex items-center justify-end gap-3 mt-4 flex-wrap">
              <button 
                onClick={() => navigateToTab("roadmap")}
                className="px-4.5 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>متابعة التعلم والـ Roadmap</span>
                <Compass className="w-3.5 h-3.5" />
              </button>
              <button 
                onClick={() => navigateToTab("tools")}
                className="px-4.5 py-2 bg-slate-900 hover:bg-slate-850 text-slate-300 hover:text-white border border-slate-800 font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>المحاكيات التفاعلية</span>
                <Terminal className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Quick Metrics Circle */}
          <div className="flex items-center gap-4 bg-slate-900/60 backdrop-blur-md border border-slate-800/80 p-5 rounded-2xl shadow-inner min-w-[240px] justify-around">
            <div className="flex flex-col items-center gap-1">
              <Flame className="w-7 h-7 text-orange-500 fill-orange-500/20 drop-shadow-[0_0_8px_rgba(249,115,22,0.4)] animate-bounce" />
              <span className="text-[10px] text-slate-500 font-bold">حماس اليوم</span>
              <span className="font-mono text-base font-black text-slate-100">{getStreakCount()} يوم</span>
            </div>
            <div className="w-px h-10 bg-slate-850" />
            <div className="flex flex-col items-center gap-1">
              <Trophy className="w-7 h-7 text-yellow-500 fill-yellow-500/10 drop-shadow-[0_0_8px_rgba(234,179,8,0.4)]" />
              <span className="text-[10px] text-slate-500 font-bold">الشارات</span>
              <span className="font-mono text-base font-black text-slate-100">{earnedBadges.length} شارة</span>
            </div>
            <div className="w-px h-10 bg-slate-850" />
            <div className="flex flex-col items-center gap-1">
              <Zap className="w-7 h-7 text-cyan-400 fill-cyan-400/10 drop-shadow-[0_0_8px_rgba(34,211,238,0.4)]" />
              <span className="text-[10px] text-slate-500 font-bold">إجمالي التقدم</span>
              <span className="font-mono text-base font-black text-slate-100">{globalProgressPercent}%</span>
            </div>
          </div>
        </div>
      </motion.section>

      {/* 🎮 Core Layout: Daily Challenge & Simulators Launcher */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        
        {/* Left Column: Simulators Launcher (3 cols) */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          <section className="bg-slate-900/30 border border-slate-900 rounded-2xl p-6 flex flex-col gap-4 text-right relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/5 rounded-full filter blur-2xl" />
            <div className="border-b border-slate-850 pb-3 flex justify-between items-center flex-row-reverse">
              <div className="flex items-center gap-2 flex-row-reverse">
                <Server className="w-5 h-5 text-cyan-400" />
                <h3 className="font-extrabold text-sm text-slate-100">منصة الإطلاق والتشغيل السريع (Simulators Quick-Launcher)</h3>
              </div>
              <span className="text-[10px] bg-slate-900 text-slate-400 border border-slate-800 px-2.5 py-0.5 rounded-full">تشغيل فوري</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
              {[
                { 
                  id: "net_topology", 
                  title: "محاكي ربط الشبكات", 
                  desc: "صمم شبكتك الخاصة واربط الأجهزة بالكوابل برمجياً.", 
                  icon: Network, 
                  color: "cyan", 
                  targetView: "tools",
                  scrollId: "network-topology"
                },
                { 
                  id: "dns_sim", 
                  title: "محاكي استعلامات DNS", 
                  desc: "تتبع مسار استعلام الـ DNS عبر خوادم Root و TLD تفاعلياً.", 
                  icon: Terminal, 
                  color: "purple", 
                  targetView: "tools",
                  scrollId: "dns-simulator"
                },
                { 
                  id: "gpo_sim", 
                  title: "سياسات AD Group Policy", 
                  desc: "توزيع سياسات الأمان ومحاكاة تطبيقها على الأجهزة.", 
                  icon: Shield, 
                  color: "amber", 
                  targetView: "tools",
                  scrollId: "gpo-simulator"
                },
                { 
                  id: "raid_calc", 
                  title: "حاسبة ومحاكي RAID", 
                  desc: "جرّب عطل قرص وتخزين البيانات بـ RAID 0, 1, 5, 10.", 
                  icon: Server, 
                  color: "emerald", 
                  targetView: "tools",
                  scrollId: "raid-visualizer" 
                }
              ].map((tool) => (
                <div 
                  key={tool.id} 
                  className="bg-slate-950/80 border border-slate-850 p-4 rounded-xl flex flex-col justify-between hover:border-cyan-500/40 hover:shadow-[0_0_15px_rgba(6,182,212,0.05)] transition-all group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-cyan-400 group-hover:text-cyan-300 transition-colors">
                        <tool.icon className="w-4 h-4" />
                      </div>
                      <span className="text-[9px] text-slate-500 font-bold uppercase">Simulator</span>
                    </div>
                    <h4 className="font-extrabold text-xs text-slate-200 group-hover:text-slate-100 mb-1">{tool.title}</h4>
                    <p className="text-[11px] text-slate-450 leading-relaxed">{tool.desc}</p>
                  </div>
                  <button 
                    onClick={() => navigateToTab(tool.targetView, tool.scrollId)}
                    className="mt-4 w-full py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-[10px] font-bold text-slate-300 group-hover:bg-cyan-500/10 group-hover:text-cyan-400 group-hover:border-cyan-500/35 transition-all flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <span>تشغيل المحاكي</span>
                    <Play className="w-3 h-3 fill-current" />
                  </button>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column: Daily Trivia Challenge (2 cols) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <section className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800/80 rounded-2xl p-6 flex flex-col gap-4 text-right relative overflow-hidden">
            <div className="absolute top-0 right-0 w-36 h-36 bg-purple-500/5 rounded-full filter blur-2xl" />
            <div className="border-b border-slate-850 pb-3 flex justify-between items-center flex-row-reverse">
              <div className="flex items-center gap-2 flex-row-reverse">
                <HelpCircle className="w-5 h-5 text-purple-400 animate-pulse" />
                <h3 className="font-extrabold text-sm text-slate-100">التحدي التقني اليومي (Daily IT Challenge)</h3>
              </div>
              <span className="text-[10px] text-yellow-400 font-black bg-yellow-500/10 px-2 py-0.5 rounded-full border border-yellow-500/20">+20 XP</span>
            </div>

            {dailyQuestion ? (
              <div className="flex flex-col gap-4 mt-1">
                <h4 className="font-bold text-xs text-slate-200 leading-relaxed">
                  {dailyQuestion.question}
                </h4>

                <div className="flex flex-col gap-2">
                  {dailyQuestion.options.map((option) => {
                    const isSelected = selectedAnswer === option;
                    let optionStyle = "border-slate-850 bg-slate-950/40 text-slate-350 hover:border-slate-750";
                    
                    if (isSelected) {
                      optionStyle = "border-purple-500 bg-purple-500/10 text-purple-300";
                    }
                    if (submitted) {
                      if (option === dailyQuestion.answer) {
                        optionStyle = "border-emerald-500 bg-emerald-500/10 text-emerald-400";
                      } else if (isSelected) {
                        optionStyle = "border-rose-500 bg-rose-500/10 text-rose-455";
                      } else {
                        optionStyle = "border-slate-850 bg-slate-950/20 text-slate-500 opacity-60";
                      }
                    }

                    return (
                      <button
                        key={option}
                        disabled={submitted}
                        onClick={() => handleAnswerSubmit(option)}
                        className={`w-full px-4 py-2.5 rounded-xl border text-right text-xs font-semibold transition-all flex items-center justify-between cursor-pointer ${optionStyle}`}
                      >
                        <span>{option}</span>
                        {submitted && option === dailyQuestion.answer && <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />}
                      </button>
                    );
                  })}
                </div>

                {!submitted ? (
                  <button
                    onClick={checkAnswer}
                    disabled={!selectedAnswer}
                    className={`w-full py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      selectedAnswer 
                        ? "bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-lg shadow-purple-500/10 hover:from-purple-400" 
                        : "bg-slate-900 border border-slate-800 text-slate-500 cursor-not-allowed"
                    }`}
                  >
                    <span>تحقق من الإجابة</span>
                  </button>
                ) : (
                  <div className="flex flex-col gap-2 mt-2">
                    <div className="p-3 bg-slate-950 border border-slate-850 rounded-xl">
                      <span className="text-[10px] font-black text-purple-400 uppercase tracking-widest block mb-1">الشرح التقني:</span>
                      <p className="text-[11px] text-slate-400 leading-relaxed font-semibold">
                        {dailyQuestion.explanation}
                      </p>
                    </div>
                    {selectedAnswer === dailyQuestion.answer ? (
                      <span className="text-xs text-emerald-400 font-bold block text-center mt-1">🎉 أحسنت إجابة صحيحة! حصلت على +20 XP.</span>
                    ) : (
                      <span className="text-xs text-rose-400 font-bold block text-center mt-1">❌ إجابة غير صحيحة! جرّب مجدداً غداً.</span>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="w-full h-32 flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </section>
        </div>
      </div>

      {/* 🛡️ Practice Platforms & references quick access */}
      <section className="bg-slate-900/10 border border-slate-900 rounded-2xl p-6 flex flex-col gap-5 text-right relative overflow-hidden">
        <div className="border-b border-slate-850 pb-3 flex items-center gap-2 flex-row-reverse">
          <BookOpen className="w-5 h-5 text-cyan-400" />
          <h3 className="font-extrabold text-sm text-slate-100">بوابة المذاكرة السريعة والمراجع المباشرة</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { title: "الحقيبة المرجعية", label: "أسئلة مقابلات وتدوينات استكشاف الأخطاء", icon: BookOpen, tab: "reference" },
            { title: "جداول الأوامر Cheatsheets", label: "أوامر Linux و Cisco و Docker الشاملة", icon: Terminal, tab: "reference" },
            { title: "منصات التدريب العملي", label: "مواقع التحديات والمختبرات الحقيقية", icon: Compass, tab: "analytics" }
          ].map((item, idx) => (
            <div 
              key={idx}
              onClick={() => navigateToTab(item.tab)}
              className="bg-slate-950/60 border border-slate-850 p-4 rounded-xl flex items-center justify-between hover:border-cyan-500/40 hover:bg-slate-950 transition-all cursor-pointer group"
            >
              <div className="flex flex-col gap-1 text-right">
                <span className="font-extrabold text-xs text-slate-200 group-hover:text-cyan-400 transition-colors">{item.title}</span>
                <span className="text-[10px] text-slate-400 leading-snug">{item.label}</span>
              </div>
              <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 text-slate-500 group-hover:text-cyan-400 group-hover:border-cyan-500/20 transition-all flex items-center justify-center flex-shrink-0">
                <item.icon className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
