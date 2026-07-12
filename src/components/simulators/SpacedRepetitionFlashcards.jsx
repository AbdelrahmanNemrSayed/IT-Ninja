import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BookOpen, Brain, Check, X, RotateCw, AlertCircle, Award, 
  HelpCircle, ChevronRight, Smile, Compass
} from "lucide-react";

const INITIAL_CARDS = [
  {
    id: "ccna_1",
    category: "CCNA (الشبكات)",
    question: "ما هو منفذ (Port) خدمة SSH الافتراضي لتأمين الاتصالات البعيدة؟",
    options: ["21", "22", "23", "80"],
    answer: "22",
    explanation: "يعمل بروتوكول SSH بشكل افتراضي على منفذ 22 لتوفير اتصال آمن ومشفّر، بينما منفذ 23 مخصص لبروتوكول Telnet غير الآمن.",
    difficulty: null
  },
  {
    id: "sec_1",
    category: "Security+ (الأمن السيبراني)",
    question: "ما هو الاسم العلمي للهجوم الذي يستخدم صفحة مزيفة لسرقة كلمة المرور؟",
    options: ["Ransomware", "Phishing (الاصطياد)", "SQL Injection", "Man-in-the-Middle"],
    answer: "Phishing (الاصطياد)",
    explanation: "الاصطياد الإلكتروني (Phishing) هو هندسة اجتماعية يتم فيها خداع الضحية بصفحات أو رسائل شبيهة بالرسمية لسرقة بياناته الحساسة.",
    difficulty: null
  },
  {
    id: "linux_1",
    category: "Linux+ (إدارة الأنظمة)",
    question: "أي أمر يستخدم لعرض استهلاك الذاكرة والعمليات النشطة بشكل حي في لينكس؟",
    options: ["df -h", "top / htop", "lsusb", "ifconfig"],
    answer: "top / htop",
    explanation: "الأمر top أو النسخة المحسنة htop يعرضان استهلاك المعالج والذاكرة والعمليات النشطة بشكل ديناميكي وحي.",
    difficulty: null
  },
  {
    id: "ccna_2",
    category: "CCNA (الشبكات)",
    question: "ما هو قناع الشبكة الفرعية (Subnet Mask) الافتراضي لشبكة فئة C؟",
    options: ["255.0.0.0", "255.255.0.0", "255.255.255.0", "255.255.255.255"],
    answer: "255.255.255.0",
    explanation: "شبكات الفئة C تستخدم افتراضياً قناع الشبكة 255.255.255.0 (/24) والذي يمنح 254 عنوان جهاز صالح للاستخدام.",
    difficulty: null
  },
  {
    id: "sec_2",
    category: "Security+ (الأمن السيبراني)",
    question: "ما هي التقنية التي تشفر حركة الويب بالكامل وتضمن الهوية للموقع؟",
    options: ["SSL/TLS (HTTPS)", "FTP", "DNS", "DHCP"],
    answer: "SSL/TLS (HTTPS)",
    explanation: "بروتوكول SSL/TLS يشفّر البيانات المتبادلة بين المتصفح والخادم لمنع التجسس ويثبت موثوقية الموقع عبر شهادات الأمان الرقمية.",
    difficulty: null
  }
];

export default function SpacedRepetitionFlashcards() {
  const [cards, setCards] = useState(INITIAL_CARDS);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [stats, setStats] = useState({ easy: 0, medium: 0, hard: 0, score: 0 });
  const [sessionCompleted, setSessionCompleted] = useState(false);

  const currentCard = cards[currentIdx];

  const handleOptionSelect = (option) => {
    if (selectedOption !== null) return;
    setSelectedOption(option);
    setIsFlipped(true);
    setShowExplanation(true);
    if (option === currentCard.answer) {
      setStats(prev => ({ ...prev, score: prev.score + 10 }));
    }
  };

  const handleDifficulty = (difficulty) => {
    // Spaced repetition scheduling simulation
    const updatedCards = [...cards];
    const card = updatedCards[currentIdx];
    card.difficulty = difficulty;

    if (difficulty === "easy") {
      setStats(prev => ({ ...prev, easy: prev.easy + 1 }));
      // Push card to the very end
      updatedCards.splice(currentIdx, 1);
      updatedCards.push(card);
    } else if (difficulty === "medium") {
      setStats(prev => ({ ...prev, medium: prev.medium + 1 }));
      // Push card middle of queue (e.g. 3 spots away)
      updatedCards.splice(currentIdx, 1);
      const targetPos = Math.min(3, updatedCards.length);
      updatedCards.splice(targetPos, 0, card);
    } else {
      setStats(prev => ({ ...prev, hard: prev.hard + 1 }));
      // Push card to front/near (e.g. 1 spot away)
      updatedCards.splice(currentIdx, 1);
      const targetPos = Math.min(1, updatedCards.length);
      updatedCards.splice(targetPos, 0, card);
    }

    setCards(updatedCards);
    setIsFlipped(false);
    setSelectedOption(null);
    setShowExplanation(false);

    // If we reviewed all cards or reached threshold
    if (currentIdx >= cards.length - 1) {
      setCurrentIdx(0);
    } else {
      // Keep index at 0 because splicing/re-ordering rotates the queue
      setCurrentIdx(0);
    }
  };

  const resetDeck = () => {
    setCards(JSON.parse(JSON.stringify(INITIAL_CARDS)));
    setCurrentIdx(0);
    setIsFlipped(false);
    setSelectedOption(null);
    setShowExplanation(false);
    setStats({ easy: 0, medium: 0, hard: 0, score: 0 });
    setSessionCompleted(false);
  };

  return (
    <div id="spaced-repetition" className="glass-card rounded-2xl p-6 flex flex-col gap-6 shadow-lg text-right scroll-mt-28">
      {/* Header */}
      <div className="border-b border-slate-800 pb-3 flex justify-between items-center flex-row-reverse flex-wrap gap-2">
        <div>
          <h3 className="font-extrabold text-sm text-slate-100 flex items-center justify-start gap-2 flex-row-reverse">
            <Brain className="w-5 h-5 text-purple-400" />
            بطاقات الاستدعاء النشط الذكية (Anki Spaced Repetition Flashcards)
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            نظام تكرار متباعد ذكي لمراجعة أسئلة شهادات تقنية المعلومات لترسيخ المعلومات في الذاكرة طويلة المدى.
          </p>
        </div>
        <button 
          onClick={resetDeck}
          className="bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 flex-row-reverse"
        >
          <RotateCw className="w-3.5 h-3.5" /> إعادة ضبط البطاقات
        </button>
      </div>

      {/* Grid: metrics and flashcard container */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Left Side: stats list */}
        <div className="md:col-span-4 flex flex-col gap-3">
          <span className="text-[10px] text-slate-500 font-extrabold block">إحصائيات المراجعة النشطة</span>
          
          <div className="bg-slate-950 border border-slate-850 p-4 rounded-xl flex flex-col gap-4">
            <div className="flex justify-between items-center flex-row-reverse">
              <span className="text-xs text-slate-400">مجموع النقاط (Score):</span>
              <span className="text-sm font-black text-cyan-400">{stats.score} XP</span>
            </div>
            
            <div className="h-px bg-slate-800/60" />

            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center flex-row-reverse text-[10px]">
                <span className="text-emerald-400 font-bold">🟢 بطاقات سهلة:</span>
                <span className="text-slate-300 font-mono">{stats.easy}</span>
              </div>
              <div className="flex justify-between items-center flex-row-reverse text-[10px]">
                <span className="text-amber-400 font-bold">🟡 بطاقات متوسطة:</span>
                <span className="text-slate-300 font-mono">{stats.medium}</span>
              </div>
              <div className="flex justify-between items-center flex-row-reverse text-[10px]">
                <span className="text-rose-400 font-bold">🔴 بطاقات صعبة:</span>
                <span className="text-slate-300 font-mono">{stats.hard}</span>
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-purple-500/5 border border-purple-500/10 text-[10px] text-purple-300 leading-relaxed font-medium">
            💡 <strong>كيف تعمل خوارزمية التكرار المتباعد؟</strong><br/>
            عند تحديد صعوبة البطاقة بـ <strong>صعب</strong>، يبرز السؤال مجدداً بعد بطاقة واحدة لتكراره. بينما يؤدي تصنيفه بـ <strong>سهل</strong> لتأخير ظهوره لنهاية الطابور.
          </div>
        </div>

        {/* Right Side: Interactive card container */}
        <div className="md:col-span-8 flex flex-col items-center justify-center min-h-[350px] relative">
          
          <AnimatePresence mode="wait">
            {currentCard ? (
              <motion.div
                key={currentCard.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full bg-slate-950/80 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col gap-5 text-right relative overflow-hidden"
              >
                {/* Category tag */}
                <div className="flex justify-between items-center flex-row-reverse">
                  <span className="text-[9px] font-black px-2.5 py-0.5 rounded bg-purple-500/10 border border-purple-500/20 text-purple-400">
                    {currentCard.category}
                  </span>
                  <span className="text-[8px] font-mono text-slate-500">
                    رقم البطاقة: {currentCard.id}
                  </span>
                </div>

                {/* Question */}
                <h4 className="text-sm font-extrabold text-slate-100 leading-relaxed">
                  {currentCard.question}
                </h4>

                {/* Options List */}
                <div className="flex flex-col gap-2 mt-2">
                  {currentCard.options.map((option) => {
                    const isSelected = selectedOption === option;
                    const isCorrect = option === currentCard.answer;
                    const isWrong = isSelected && !isCorrect;

                    let btnClass = "bg-slate-900 border-slate-800 text-slate-350 hover:bg-slate-850 hover:border-slate-700";
                    if (selectedOption !== null) {
                      if (isCorrect) btnClass = "bg-emerald-500/10 border-emerald-500 text-emerald-400 font-bold";
                      else if (isWrong) btnClass = "bg-rose-500/10 border-rose-500 text-rose-400 font-bold";
                      else btnClass = "bg-slate-900 border-slate-850 text-slate-600 opacity-60";
                    }

                    return (
                      <button
                        key={option}
                        onClick={() => handleOptionSelect(option)}
                        disabled={selectedOption !== null}
                        className={`w-full p-3 rounded-xl border text-right text-xs font-bold transition-all flex justify-between items-center flex-row-reverse cursor-pointer ${btnClass}`}
                      >
                        <span>{option}</span>
                        {selectedOption !== null && isCorrect && <Check className="w-4 h-4 text-emerald-400" />}
                        {selectedOption !== null && isWrong && <X className="w-4 h-4 text-rose-400" />}
                      </button>
                    );
                  })}
                </div>

                {/* Spaced repetition action control drawer */}
                <AnimatePresence>
                  {showExplanation && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="border-t border-slate-850 pt-4 mt-2 flex flex-col gap-4"
                    >
                      <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-850 text-[10px] text-slate-400 leading-relaxed">
                        💡 <strong>الشرح والتفسير:</strong> {currentCard.explanation}
                      </div>

                      {/* Anki Spaced repetition rating buttons */}
                      <div className="flex flex-col gap-2">
                        <span className="text-[9px] text-slate-500 font-extrabold text-center block">
                          كيف تقيم مستوى سهولة السؤال لتكراره؟ (Spaced Repetition Rating)
                        </span>
                        
                        <div className="grid grid-cols-3 gap-2">
                          <button
                            onClick={() => handleDifficulty("hard")}
                            className="bg-rose-500 text-slate-950 px-3 py-2 rounded-xl text-xs font-black hover:bg-rose-400 transition-all cursor-pointer shadow-md shadow-rose-500/15"
                          >
                            صعب (🔴 تكرار فوري)
                          </button>
                          <button
                            onClick={() => handleDifficulty("medium")}
                            className="bg-amber-500 text-slate-950 px-3 py-2 rounded-xl text-xs font-black hover:bg-amber-400 transition-all cursor-pointer shadow-md shadow-amber-500/15"
                          >
                            متوسط (🟡 تكرار لاحق)
                          </button>
                          <button
                            onClick={() => handleDifficulty("easy")}
                            className="bg-emerald-500 text-slate-950 px-3 py-2 rounded-xl text-xs font-black hover:bg-emerald-400 transition-all cursor-pointer shadow-md shadow-emerald-500/15"
                          >
                            سهل (🟢 تأخير طويل)
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ) : (
              <div className="text-center">لا توجد بطاقات متاحة في هذا الوقت.</div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
