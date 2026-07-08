import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Swords, Trophy, Users, Shield, Zap, RefreshCw, Star, Check, X, AlertTriangle } from "lucide-react";
import { useProfile } from "../../context/ProfileContext";

// Pool of mock opponents
const MOCK_OPPONENTS = [
  { name: "المهندس أسامة الزيرو", title: "Senior Web Developer", xp: 12450, avatar: "🥋" },
  { name: "المهندسة مريم أحمد", title: "Network Architect", xp: 9800, avatar: "👩‍💻" },
  { name: "الهاكر الأردني", title: "Penetration Tester", xp: 15300, avatar: "🕵️" },
  { name: "المهندس عمرو شاهين", title: "DevOps Engineer", xp: 8200, avatar: "🐳" },
  { name: "النينجا المجهول", title: "Security Ninja", xp: 11000, avatar: "🥷" }
];

// Pool of battle questions
const BATTLE_QUESTIONS = [
  {
    q: "أي من البروتوكولات التالية يعمل في طبقة التطبيقات (Application Layer)؟",
    options: ["IP", "TCP", "HTTP", "UDP"],
    answer: "HTTP"
  },
  {
    q: "ما هو الأمر المستخدم في لينكس لعرض العمليات النشطة واستهلاك المعالج والذاكرة بالوقت الفعلي؟",
    options: ["ls", "top", "cat", "df"],
    answer: "top"
  },
  {
    q: "ما هي التقنية المستخدمة لتشغيل عدة حاويات معزولة (Containers) على نفس النواة؟",
    options: ["Virtual Machines", "Docker", "RAID 5", "DNS Cache"],
    answer: "Docker"
  },
  {
    q: "أي من خيارات الـ RAID التالية يركز فقط على مضاعفة سرعة القراءة والكتابة دون أي حماية للبيانات؟",
    options: ["RAID 0", "RAID 1", "RAID 5", "RAID 10"],
    answer: "RAID 0"
  },
  {
    q: "ما هو البورت (Port) الافتراضي لخادم الويب الآمن HTTPS؟",
    options: ["80", "22", "443", "8080"],
    answer: "443"
  }
];

export default function ITBattles() {
  const { currentProfile, addXP } = useProfile();
  const [battleState, setBattleState] = useState("IDLE"); // IDLE, MATCHING, BATTLE, FINISHED
  const [opponent, setOpponent] = useState(null);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [timer, setTimer] = useState(12);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  // Scores
  const [myScore, setMyScore] = useState(0);
  const [oppScore, setOppScore] = useState(0);
  const [oppAnsweringState, setOppAnsweringState] = useState("thinking"); // thinking, answered

  // Active Battle Questions Subset (3 random questions)
  const [activeQuestions, setActiveQuestions] = useState([]);

  // Matchmaking Simulation
  const startMatchmaking = () => {
    setBattleState("MATCHING");
    setMyScore(0);
    setOppScore(0);
    setCurrentQIndex(0);
    setSelectedAnswer(null);

    // pick random questions
    const shuffled = [...BATTLE_QUESTIONS].sort(() => 0.5 - Math.random());
    setActiveQuestions(shuffled.slice(0, 3));

    setTimeout(() => {
      // Pick random opponent
      const randomOpp = MOCK_OPPONENTS[Math.floor(Math.random() * MOCK_OPPONENTS.length)];
      setOpponent(randomOpp);
      setBattleState("BATTLE");
      setTimer(12);
    }, 3000);
  };

  // Timer logic for each question
  useEffect(() => {
    let interval = null;
    if (battleState === "BATTLE") {
      if (timer > 0) {
        interval = setInterval(() => {
          setTimer(prev => prev - 1);
        }, 1000);
      } else {
        // Time out - advance to next question
        handleNextQuestion();
      }
    }
    return () => clearInterval(interval);
  }, [timer, battleState]);

  // Simulate opponent's answer logic
  useEffect(() => {
    if (battleState === "BATTLE" && timer === 12) {
      setOppAnsweringState("thinking");
      // Opponent decides on answer within 3-7 seconds
      const answerDelay = 3000 + Math.random() * 4000;
      const timeout = setTimeout(() => {
        // Opponent has 75% accuracy
        const isCorrect = Math.random() < 0.75;
        if (isCorrect) {
          setOppScore(prev => prev + 10);
        }
        setOppAnsweringState("answered");
      }, answerDelay);

      return () => clearTimeout(timeout);
    }
  }, [currentQIndex, battleState, timer]);

  const handleAnswerSubmit = (option) => {
    if (selectedAnswer !== null) return; // already answered this question
    setSelectedAnswer(option);

    const question = activeQuestions[currentQIndex];
    if (option === question.answer) {
      setMyScore(prev => prev + 10);
    }

    // go to next question after 1.5 seconds delay to see if they got it right
    setTimeout(() => {
      handleNextQuestion();
    }, 1500);
  };

  const handleNextQuestion = () => {
    setSelectedAnswer(null);
    if (currentQIndex < 2) {
      setCurrentQIndex(prev => prev + 1);
      setTimer(12);
    } else {
      // Match finished
      setBattleState("FINISHED");
      // Give XP if win or tie
      if (myScore > oppScore) {
        addXP(50); // Winner reward
      } else if (myScore === oppScore) {
        addXP(25); // Tie reward
      } else {
        addXP(10); // Loss reward
      }
    }
  };

  return (
    <div className="bg-slate-900/40 backdrop-blur-md border border-cyan-500/20 rounded-2xl p-6 flex flex-col gap-6 shadow-lg relative text-right scroll-mt-28" id="it-battles">
      <div className="border-b border-slate-800 pb-3 flex justify-between items-center flex-row-reverse">
        <div>
          <h3 className="font-extrabold text-sm text-slate-100 flex items-center justify-start gap-2 flex-row-reverse">
            <Swords className="w-5 h-5 text-red-500 animate-pulse" />
            حلبة النينجا للتحديات الثنائية (IT PvP Arena)
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            اختبر معلوماتك بالوقت الفعلي ضد خبراء ومهندسي شبكات آخرين واجمع نقاط الـ XP الشرفية.
          </p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* IDLE STATE */}
        {battleState === "IDLE" && (
          <motion.div 
            key="idle"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-col items-center justify-center py-10 gap-6"
          >
            <div className="w-20 h-20 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400">
              <Swords className="w-10 h-10 animate-bounce" />
            </div>
            <div className="text-center">
              <h4 className="font-extrabold text-base text-slate-200">مستعد للقتال المعرفي؟</h4>
              <p className="text-xs text-slate-500 mt-1.5 max-w-sm leading-relaxed">
                ستتم مطابقتك مع مهندس نينجا نشط وسيقوم النظام بطرح 3 أسئلة شبكات ولينكس موقوتة. الأسرع والأدق هو الفائز!
              </p>
            </div>
            <button 
              onClick={startMatchmaking}
              className="px-8 py-3 bg-red-600 hover:bg-red-500 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-red-600/15 cursor-pointer transition-all flex items-center gap-2"
            >
              <Zap className="w-4 h-4" /> البدء بالبحث عن خصم
            </button>
          </motion.div>
        )}

        {/* MATCHING STATE */}
        {battleState === "MATCHING" && (
          <motion.div 
            key="matching"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-12 gap-6"
          >
            <div className="relative w-16 h-16 flex items-center justify-center">
              <span className="absolute w-full h-full border-4 border-slate-800 border-t-red-500 rounded-full animate-spin"></span>
              <Users className="w-6 h-6 text-red-400" />
            </div>
            <div className="text-center">
              <span className="text-xs text-red-400 font-bold block mb-1 animate-pulse">جاري البحث عن لاعب متاح...</span>
              <p className="text-[10px] text-slate-500">يقوم خادم النينجا بالتحقق من حلبة المبارزة الفورية.</p>
            </div>
          </motion.div>
        )}

        {/* BATTLE STATE */}
        {battleState === "BATTLE" && opponent && activeQuestions.length > 0 && (
          <motion.div 
            key="battle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col gap-6"
          >
            {/* PvP Status Header */}
            <div className="grid grid-cols-3 items-center bg-slate-950/80 border border-slate-850 p-4 rounded-xl">
              {/* Opponent Card */}
              <div className="flex items-center gap-3 text-left">
                <div className="w-10 h-10 rounded-full bg-slate-900 border border-red-500/20 flex items-center justify-center text-lg">
                  {opponent.avatar}
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] font-black text-slate-300">{opponent.name}</span>
                  <span className="text-[9px] text-slate-500 font-bold">{opponent.title}</span>
                  <div className="text-[10px] text-red-400 font-extrabold mt-0.5">🏆 {oppScore} نقطة</div>
                </div>
              </div>

              {/* Timer & Question Tracker */}
              <div className="flex flex-col items-center justify-center">
                <span className="text-[9px] text-slate-500 font-black mb-1">السؤال {currentQIndex + 1} من 3</span>
                <div className={`w-11 h-11 rounded-full border-2 flex items-center justify-center text-xs font-black transition-colors ${
                  timer <= 3 ? "border-red-500 text-red-500 animate-ping" : "border-cyan-500 text-cyan-400"
                }`}>
                  {timer}s
                </div>
              </div>

              {/* My Card */}
              <div className="flex items-center justify-end gap-3 text-right">
                <div className="flex flex-col">
                  <span className="text-[11px] font-black text-slate-300">{currentProfile?.name || "لاعب نينجا"}</span>
                  <span className="text-[9px] text-slate-500 font-bold">المستوى الحالي</span>
                  <div className="text-[10px] text-cyan-400 font-extrabold mt-0.5">🏆 {myScore} نقطة</div>
                </div>
                <div className="w-10 h-10 rounded-full bg-slate-900 border border-cyan-500/20 flex items-center justify-center text-lg">
                  🥷
                </div>
              </div>
            </div>

            {/* Progress Bars */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 flex-row-reverse">
                <span>تقدمك: {myScore / 10} / 3</span>
                <span>تقدم الخصم: {oppScore / 10} / 3</span>
              </div>
              <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden flex">
                <div className="bg-red-500 transition-all duration-500" style={{ width: `${(oppScore / 30) * 100}%` }}></div>
                <div className="bg-cyan-500 transition-all duration-500 ml-auto" style={{ width: `${(myScore / 30) * 100}%` }}></div>
              </div>
            </div>

            {/* Current Question */}
            <div className="bg-slate-950/40 border border-slate-850 p-6 rounded-xl flex flex-col gap-4">
              <h4 className="text-sm font-extrabold text-slate-100 text-center leading-relaxed">
                {activeQuestions[currentQIndex].q}
              </h4>

              {/* Options Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                {activeQuestions[currentQIndex].options.map((option, idx) => {
                  const isAnswered = selectedAnswer !== null;
                  const isMyAnswer = selectedAnswer === option;
                  const isCorrect = option === activeQuestions[currentQIndex].answer;

                  let btnClass = "bg-slate-900/60 border-slate-850 text-slate-300 hover:border-slate-700 hover:bg-slate-900";
                  if (isAnswered) {
                    if (isCorrect) {
                      btnClass = "bg-emerald-500/10 border-emerald-500/40 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.1)]";
                    } else if (isMyAnswer) {
                      btnClass = "bg-red-500/10 border-red-500/40 text-red-400";
                    } else {
                      btnClass = "bg-slate-950/40 border-slate-900 text-slate-500 opacity-60";
                    }
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleAnswerSubmit(option)}
                      disabled={isAnswered}
                      className={`p-3.5 border rounded-xl font-semibold text-xs transition-all cursor-pointer flex justify-between items-center flex-row-reverse ${btnClass}`}
                    >
                      <span>{option}</span>
                      {isAnswered && isCorrect && <Check className="w-4 h-4 text-emerald-400" />}
                      {isAnswered && isMyAnswer && !isCorrect && <X className="w-4 h-4 text-red-450" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Status indicators */}
            <div className="flex justify-between text-[10px] font-bold text-slate-500 flex-row-reverse items-center bg-slate-950/30 p-2 rounded-lg">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></span>
                <span>متصل بالخادم</span>
              </div>
              <div>
                {oppAnsweringState === "thinking" ? (
                  <span className="text-slate-500 italic animate-pulse">الخصم يفكر في الإجابة...</span>
                ) : (
                  <span className="text-red-400 font-extrabold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> الخصم قام بالإجابة!
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* FINISHED STATE */}
        {battleState === "FINISHED" && (
          <motion.div 
            key="finished"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-8 gap-6 text-center"
          >
            {myScore > oppScore ? (
              // Winner Card
              <>
                <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 relative">
                  <Trophy className="w-10 h-10 animate-bounce" />
                  <span className="absolute -top-1 -right-1 text-base">🎉</span>
                </div>
                <div>
                  <h4 className="font-black text-lg text-emerald-400">لقد انتصرت في التحدي!</h4>
                  <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                    بفضل أدائك السريع والتقني المميز، تغلبت على {opponent?.name}.
                  </p>
                  <div className="mt-4 inline-flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-1.5 rounded-full font-black text-xs">
                    <Star className="w-4 h-4 fill-emerald-400/20" /> +50 XP مكافأة نصر النينجا
                  </div>
                </div>
              </>
            ) : myScore === oppScore ? (
              // Tie Card
              <>
                <div className="w-20 h-20 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                  <Zap className="w-10 h-10" />
                </div>
                <div>
                  <h4 className="font-black text-lg text-cyan-400">تحدي متعادل!</h4>
                  <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                    تقارب رهيب في المستوى والسرعة! لقد واجهت نداً قوياً.
                  </p>
                  <div className="mt-4 inline-flex items-center gap-1.5 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 px-4 py-1.5 rounded-full font-black text-xs">
                    <Star className="w-4 h-4 fill-cyan-400/20" /> +25 XP مكافأة تعادل
                  </div>
                </div>
              </>
            ) : (
              // Loss Card
              <>
                <div className="w-20 h-20 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400">
                  <AlertTriangle className="w-10 h-10" />
                </div>
                <div>
                  <h4 className="font-black text-lg text-red-400">هزيمة شرفية!</h4>
                  <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                    حاول مرة أخرى! الفشل هو أول خطوة لاكتساب الخبرة الحقيقية.
                  </p>
                  <div className="mt-4 inline-flex items-center gap-1.5 bg-slate-950 border border-slate-850 text-slate-400 px-4 py-1.5 rounded-full font-black text-[10px]">
                    <Star className="w-3.5 h-3.5" /> +10 XP نقاط مشاركة شرفية
                  </div>
                </div>
              </>
            )}

            {/* Stats Breakdown */}
            <div className="flex gap-8 border-t border-b border-slate-850 py-4 w-full justify-center max-w-sm mt-2">
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-500 font-bold">إجاباتك</span>
                <span className="text-sm font-black text-slate-200">{myScore / 10} / 3</span>
              </div>
              <div className="w-px bg-slate-850"></div>
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-500 font-bold">إجابات الخصم</span>
                <span className="text-sm font-black text-slate-200">{oppScore / 10} / 3</span>
              </div>
            </div>

            <button 
              onClick={startMatchmaking}
              className="px-6 py-2.5 bg-slate-900 border border-slate-800 text-slate-300 font-bold text-xs rounded-xl hover:bg-slate-850 cursor-pointer transition-all flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" /> البحث عن مبارزة جديدة
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
