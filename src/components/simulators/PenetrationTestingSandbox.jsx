import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Terminal, ShieldAlert, ShieldCheck, Play, RotateCw, 
  Globe, HelpCircle, Lock, Unlock, Eye, Sparkles, TerminalSquare
} from "lucide-react";

const CHALLENGES = [
  {
    id: "sqli",
    title: "1. ثغرة حقن قواعد البيانات (SQL Injection - SQLi)",
    difficulty: "متوسط",
    objective: "حاول تجاوز جدار التحقق والدخول بحساب مدير النظام (admin) دون معرفة كلمة المرور الخاصة به عن طريق حقن كود SQL خبيث في حقل اسم المستخدم.",
    hint: "جرّب استخدام التعليمة الشرطية الشهيرة التي ترجع دائماً قيمة صحيحة مثل: ' OR 1=1 --",
    successPattern: /'\s*or\s*1\s*=\s*1/i,
    flag: "FLAG{SQL_INJECTION_MASTER_2026}",
    successMsg: "🎉 رائع! نجحت في تجاوز التحقق عبر حقن كود SQL وجعل الشرط محققاً دائماً (TRUE)!"
  },
  {
    id: "xss",
    title: "2. ثغرة حقن النص البرمجي عبر الموقع (Stored XSS)",
    difficulty: "سهل",
    objective: "حاول حقن كود Javascript في صندوق التعليقات ليتم تنفيذه تلقائياً من قبل المتصفح عند تحميل الصفحة (توليد تنبيه alert).",
    hint: "استخدم وسم النص البرمجي القياسي لتوليد تنبيه: <script>alert('hack')</script>",
    successPattern: /<script>.*alert\(.*\).*<\/script>/i,
    flag: "FLAG{CROSS_SITE_SCRIPTING_NINJA}",
    successMsg: "🎉 ممتاز! تم حقن وتشغيل كود الـ JavaScript بنجاح في متصفح الضحية!"
  }
];

export default function PenetrationTestingSandbox() {
  const [activeChallengeIdx, setActiveChallengeIdx] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [consoleLogs, setConsoleLogs] = useState(["🖥️ نظام اختبار الاختراق جاهز..."]);
  const [webOutput, setWebOutput] = useState("يرجى إرسال المدخلات لبدء المحاكاة...");
  const [isSolved, setIsSolved] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [hackProgress, setHackProgress] = useState(0);

  const challenge = CHALLENGES[activeChallengeIdx];

  const addLog = (msg) => {
    setConsoleLogs(prev => [...prev, msg]);
  };

  const handleChallengeChange = (idx) => {
    setActiveChallengeIdx(idx);
    setUserInput("");
    setPasswordInput("");
    setWebOutput("يرجى إرسال المدخلات لبدء المحاكاة...");
    setConsoleLogs([`📂 تم تحميل التحدي: ${CHALLENGES[idx].title}`]);
    setIsSolved(false);
    setShowHint(false);
    setHackProgress(0);
  };

  const executeAttack = () => {
    if (isSolved) return;
    
    addLog(`📤 إرسال طلب هجوم إلى الهدف: HTTP POST /login...`);
    addLog(`🔍 مدخلات اسم المستخدم: "${userInput}"`);
    
    // SQL Injection logic simulation
    if (challenge.id === "sqli") {
      const match = userInput.match(challenge.successPattern);
      if (match) {
        setHackProgress(100);
        setIsSolved(true);
        setWebOutput(`🔓 مرحباً بك يا مدير النظام! (Welcome back Admin)\n\nقائمة المستخدمين:\n- ID: 1, User: admin, Role: Administrator\n- ID: 2, User: user1, Role: Standard User\n\nالعلم الخاص بالتحدي: ${challenge.flag}`);
        addLog(challenge.successMsg);
        window.dispatchEvent(new CustomEvent("trigger-confetti"));
      } else {
        setHackProgress(30);
        setWebOutput("❌ خطأ: اسم المستخدم أو كلمة المرور غير صحيحة. الاستعلام الداخلي:\nSELECT * FROM users WHERE username = '" + userInput + "' AND password = '" + passwordInput + "'");
        addLog("❌ تفاصيل الاستعلام: لم يرجع أي سجلات متطابقة.");
      }
    }
    
    // XSS logic simulation
    if (challenge.id === "xss") {
      const match = userInput.match(challenge.successPattern);
      if (match) {
        setHackProgress(100);
        setIsSolved(true);
        setWebOutput(`📝 تم إضافة تعليقك بنجاح:\n\n[متصفح العميل]: تشغيل كود JavaScript محقون!\n🚨 POPUP: alert("XSS Solved!")\n\nالعلم الخاص بالتحدي: ${challenge.flag}`);
        addLog(challenge.successMsg);
        window.dispatchEvent(new CustomEvent("trigger-confetti"));
      } else {
        setHackProgress(20);
        setWebOutput(`📝 تم إضافة تعليقك:\n\n"${userInput}"\n\n(لم يتم كشف أي تنشيط برمجي خبيث في المدخلات)`);
        addLog("ℹ️ تم حفظ التعليق كنص عادي.");
      }
    }
  };

  return (
    <div id="pentest-sandbox" className="glass-card rounded-2xl p-6 flex flex-col gap-6 shadow-lg text-right scroll-mt-28">
      {/* Header */}
      <div className="border-b border-slate-800 pb-3 flex justify-between items-center flex-row-reverse flex-wrap gap-2">
        <div>
          <h3 className="font-extrabold text-sm text-slate-100 flex items-center justify-start gap-2 flex-row-reverse">
            <ShieldAlert className="w-5 h-5 text-rose-500 animate-pulse" />
            مختبر اختبار الاختراق وأمن الويب (Web Penetration Testing Sandbox)
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            بيئة تفاعلية آمنة لمحاكاة وفهم ثغرات الويب وهجمات الاختراق وكيفية عملها.
          </p>
        </div>

        {/* Select challenge */}
        <div className="flex items-center gap-2 flex-row-reverse">
          <span className="text-[10px] text-slate-400 font-bold">التحدي النشط:</span>
          <select
            value={activeChallengeIdx}
            onChange={(e) => handleChallengeChange(Number(e.target.value))}
            className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-slate-350 hover:border-rose-500/30 transition-colors cursor-pointer font-bold"
          >
            {CHALLENGES.map((c, idx) => (
              <option key={c.id} value={idx}>{c.title}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Sandbox Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Vulnerable Web App View */}
        <div className="lg:col-span-6 flex flex-col gap-3">
          <span className="text-[10px] text-slate-400 font-extrabold flex items-center gap-1.5 flex-row-reverse">
            <Globe className="w-3.5 h-3.5 text-cyan-400" />
            التطبيق المستهدف (Vulnerable Web Application)
          </span>

          {/* Simulated Browser Frame */}
          <div className="bg-slate-950 border border-slate-850 rounded-xl overflow-hidden shadow-inner flex flex-col h-80">
            {/* Browser Address Bar */}
            <div className="bg-slate-900 px-3 py-1.5 border-b border-slate-850 flex items-center gap-2 flex-row-reverse">
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              </div>
              <div className="flex-1 bg-slate-950 border border-slate-800 rounded px-2 py-0.5 text-[9px] text-slate-400 font-mono text-left leading-none flex items-center gap-1">
                <Lock className="w-3 h-3 text-slate-500" /> http://vulnerable-ninja-shop.local/login
              </div>
            </div>

            {/* Browser Content Window */}
            <div className="p-4 flex-grow flex flex-col justify-center items-center gap-3 bg-slate-900/50 relative overflow-y-auto">
              
              {challenge.id === "sqli" ? (
                /* Login screen */
                <div className="w-full max-w-[280px] bg-slate-900 p-4 border border-slate-800 rounded-xl flex flex-col gap-3">
                  <span className="text-xs font-black text-slate-200 block text-center">بوابة تسجيل الدخول</span>
                  
                  <div className="flex flex-col gap-1">
                    <span className="text-[8px] text-slate-400 font-bold">اسم المستخدم:</span>
                    <input
                      type="text"
                      placeholder="admin, guest..."
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                      className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-[10px] text-slate-100 outline-none focus:border-rose-500/50 font-mono text-left"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <span className="text-[8px] text-slate-400 font-bold">كلمة المرور:</span>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-[10px] text-slate-100 outline-none focus:border-rose-500/50 font-mono text-left"
                    />
                  </div>

                  <button
                    onClick={executeAttack}
                    className="bg-rose-600 hover:bg-rose-500 text-slate-950 py-1 rounded text-[10px] font-black cursor-pointer transition-colors"
                  >
                    دخول (Submit)
                  </button>
                </div>
              ) : (
                /* Comment Board XSS screen */
                <div className="w-full max-w-[300px] bg-slate-900 p-4 border border-slate-800 rounded-xl flex flex-col gap-3">
                  <span className="text-xs font-black text-slate-200 block text-center">أضف تعليقاً على المنتجات</span>
                  
                  <textarea
                    placeholder="اكتب تعليقك هنا..."
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    className="bg-slate-950 border border-slate-800 rounded p-2 text-[9px] text-slate-100 outline-none focus:border-rose-500/50 font-mono text-left h-20 resize-none"
                  />

                  <button
                    onClick={executeAttack}
                    className="bg-rose-600 hover:bg-rose-500 text-slate-950 py-1 rounded text-[10px] font-black cursor-pointer transition-colors"
                  >
                    إرسال التعليق
                  </button>
                </div>
              )}

              {/* Server Response Panel */}
              <div className="w-full mt-2 bg-slate-950/80 border border-slate-850 p-2.5 rounded-lg text-right">
                <span className="text-[7px] text-slate-500 font-extrabold block mb-1">استجابة خادم الويب (HTTP Response):</span>
                <pre className="text-[8px] font-mono text-slate-300 whitespace-pre-wrap leading-relaxed text-left">
                  {webOutput}
                </pre>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Hacktool Terminal & Hints */}
        <div className="lg:col-span-6 flex flex-col gap-3">
          <span className="text-[10px] text-slate-400 font-extrabold flex items-center gap-1.5 flex-row-reverse">
            <Terminal className="w-3.5 h-3.5 text-rose-500" />
            لوحة الفحص والقرصنة (Offensive Security Terminal)
          </span>

          <div className="bg-slate-950 border border-slate-850 p-4 rounded-xl flex flex-col gap-4 h-80 justify-between">
            <div className="flex flex-col gap-3 overflow-y-auto max-h-[170px] pr-1">
              <div className="bg-slate-900 border border-slate-850 p-3 rounded-lg flex flex-col gap-2">
                <span className="text-[10px] text-amber-400 font-bold block">🎯 الهدف والسيناريو:</span>
                <p className="text-[10px] text-slate-300 leading-relaxed font-medium">
                  {challenge.objective}
                </p>
              </div>

              {/* Progress bar */}
              <div className="flex flex-col gap-1">
                <div className="flex justify-between items-center text-[8px] flex-row-reverse">
                  <span className="text-slate-500">جاهزية استغلال الثغرة:</span>
                  <span className="font-mono text-cyan-400 font-bold">{hackProgress}%</span>
                </div>
                <div className="h-1 bg-slate-900 rounded-full overflow-hidden">
                  <div className="h-full bg-cyan-500 transition-all duration-300" style={{ width: `${hackProgress}%` }} />
                </div>
              </div>
            </div>

            {/* Hint and Solved Flag info */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center flex-row-reverse">
                <button
                  onClick={() => setShowHint(!showHint)}
                  className="text-slate-500 hover:text-slate-300 text-[9px] font-bold cursor-pointer"
                >
                  {showHint ? "إخفاء التلميح 💡" : "عرض تلميح الحل 💡"}
                </button>
                {isSolved && (
                  <span className="text-[9px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded font-black flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-emerald-400 animate-spin" /> مكتمل
                  </span>
                )}
              </div>

              <AnimatePresence>
                {showHint && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-850 text-[9px] text-slate-400 leading-relaxed text-right"
                  >
                    💡 {challenge.hint}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Terminal log logs bottom */}
      <div className="bg-slate-950 border border-slate-850 rounded-xl p-3 flex flex-col gap-2">
        <span className="text-[9px] text-slate-500 font-extrabold block border-b border-slate-850 pb-1.5 flex items-center justify-start gap-1 flex-row-reverse">
          <TerminalSquare className="w-3.5 h-3.5 text-rose-500" />
          مخرجات كونسول الفحص (Security Scanner Output logs)
        </span>
        <div className="h-24 overflow-y-auto font-mono text-[9px] text-slate-350 leading-relaxed flex flex-col gap-1 text-left" style={{ direction: "ltr" }}>
          {consoleLogs.map((log, idx) => (
            <div key={idx} className={log.startsWith("❌") ? "text-rose-400" : log.startsWith("🎉") || log.startsWith("✅") ? "text-emerald-400" : "text-slate-300"}>
              {log}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
