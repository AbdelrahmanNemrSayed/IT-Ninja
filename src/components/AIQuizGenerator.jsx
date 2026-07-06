import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HelpCircle, Sparkles, CheckCircle2, XCircle, ChevronRight, Play, Loader2, Award } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

async function generateQuizFromGemini(phaseName) {
  if (!GEMINI_API_KEY) throw new Error("NO_KEY");

  const prompt = `Generate a quiz with exactly 3 multiple choice questions in Arabic about the topic: "${phaseName}".
Return ONLY a valid JSON array of objects. Do not wrap it in \`\`\`json or markdown. Do not include any explanation before or after the JSON.
Each object must have the following structure:
{
  "question": "text of the question in Arabic",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "correctIndex": 0, // index of correct option (0-3)
  "explanation": "Brief explanation in Arabic of why this is correct"
}`;

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: "application/json", temperature: 0.8 }
      })
    }
  );

  if (!res.ok) throw new Error(await res.text());
  const data = await res.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  return JSON.parse(text.trim());
}

export default function AIQuizGenerator({ phaseName = "Network Foundations" }) {
  const { profile, awardXP } = useAuth();
  const [loading, setLoading] = useState(false);
  const [quiz, setQuiz] = useState(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedIdx, setSelectedIdx] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [error, setError] = useState("");

  const startQuiz = async () => {
    setLoading(true);
    setError("");
    setQuiz(null);
    setCurrentIdx(0);
    setSelectedIdx(null);
    setAnswered(false);
    setScore(0);
    setFinished(false);

    try {
      const questions = await generateQuizFromGemini(phaseName);
      if (Array.isArray(questions) && questions.length > 0) {
        setQuiz(questions);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      console.error(err);
      setError(err.message === "NO_KEY" ? "⚠️ الرجاء إعداد مفتاح Gemini API أولاً لتوليد الاختبارات." : "⚠️ فشل في توليد الأسئلة. حاول مرة أخرى.");
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (idx) => {
    if (answered) return;
    setSelectedIdx(idx);
    setAnswered(true);
    const isCorrect = idx === quiz[currentIdx].correctIndex;
    if (isCorrect) {
      setScore(s => s + 1);
    }
  };

  const nextQuestion = () => {
    setSelectedIdx(null);
    setAnswered(false);
    if (currentIdx + 1 < quiz.length) {
      setCurrentIdx(c => c + 1);
    } else {
      setFinished(true);
      // Award XP on complete (e.g. 15 XP per correct answer)
      const xpGained = score * 15;
      if (xpGained > 0 && awardXP) {
        awardXP(xpGained);
      }
    }
  };

  return (
    <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800/80 rounded-2xl p-6 flex flex-col gap-4 shadow-lg">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <h3 className="font-extrabold text-sm text-slate-100 flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-cyan-400" />
          اختبر معلوماتك بالذكاء الاصطناعي (AI Quiz Simulator)
        </h3>
        <span className="text-[10px] bg-cyan-500/10 text-cyan-400 px-2 py-0.5 rounded-full font-bold">
          مُولّد بـ Gemini
        </span>
      </div>

      <AnimatePresence mode="wait">
        {error && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-xl p-3 text-center">
            {error}
          </motion.div>
        )}

        {!quiz && !loading && !finished && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-6 text-center gap-4">
            <Sparkles className="w-10 h-10 text-cyan-400 animate-pulse" />
            <div>
              <p className="text-xs font-bold text-slate-300">اختبار تفاعلي مخصص لموضوع: {phaseName}</p>
              <p className="text-[10px] text-slate-500 mt-1">يتم توليد 3 أسئلة اختيار من متعدد مع شرح كامل للإجابات</p>
            </div>
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={startQuiz}
              className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs text-white cursor-pointer
                bg-gradient-to-r from-cyan-500 to-purple-600 shadow-[0_0_20px_rgba(6,182,212,0.3)]">
              <Play className="w-3.5 h-3.5" /> ابدأ الاختبار
            </motion.button>
          </motion.div>
        )}

        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-10 gap-3">
            <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
            <p className="text-xs font-bold text-slate-400">جاري صياغة الأسئلة بالذكاء الاصطناعي...</p>
          </motion.div>
        )}

        {quiz && !finished && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
            className="flex flex-col gap-4">
            {/* Progress */}
            <div className="flex justify-between items-center text-[10px] text-slate-500">
              <span>السؤال {currentIdx + 1} من {quiz.length}</span>
              <span>النتيجة الحالية: {score}/{quiz.length}</span>
            </div>

            {/* Question title */}
            <h4 className="text-sm font-bold text-slate-200 text-right leading-relaxed">
              {quiz[currentIdx].question}
            </h4>

            {/* Options */}
            <div className="flex flex-col gap-2.5">
              {quiz[currentIdx].options.map((opt, idx) => {
                const isSelected = selectedIdx === idx;
                const isCorrect = idx === quiz[currentIdx].correctIndex;
                const showSuccess = answered && isCorrect;
                const showDanger = answered && isSelected && !isCorrect;

                return (
                  <motion.button
                    key={idx}
                    whileHover={!answered ? { scale: 1.01 } : {}}
                    whileTap={!answered ? { scale: 0.99 } : {}}
                    onClick={() => handleAnswer(idx)}
                    disabled={answered}
                    className={`w-full text-right px-4 py-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-between gap-3 cursor-pointer ${
                      showSuccess
                        ? "bg-emerald-500/10 border-emerald-500 text-emerald-400"
                        : showDanger
                        ? "bg-rose-500/10 border-rose-500 text-rose-400"
                        : isSelected
                        ? "bg-cyan-500/10 border-cyan-500 text-cyan-400"
                        : "bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-300"
                    }`}
                  >
                    <span className="flex-1">{opt}</span>
                    {showSuccess && <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />}
                    {showDanger && <XCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />}
                  </motion.button>
                );
              })}
            </div>

            {/* Explanation box */}
            {answered && (
              <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
                className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-[11px] leading-relaxed text-slate-400">
                <strong className="text-slate-200 block mb-1">💡 التفسير:</strong>
                {quiz[currentIdx].explanation}
              </motion.div>
            )}

            {/* Next button */}
            {answered && (
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={nextQuestion}
                className="w-full py-2.5 rounded-xl font-bold text-xs text-white cursor-pointer bg-slate-850 hover:bg-slate-800 border border-slate-700 flex items-center justify-center gap-1.5 ml-auto">
                {currentIdx + 1 < quiz.length ? (
                  <>السؤال التالي <ChevronRight className="w-4 h-4" /></>
                ) : (
                  <>إنهاء ورصد النقاط <Award className="w-4 h-4" /></>
                )}
              </motion.button>
            )}
          </motion.div>
        )}

        {finished && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-6 text-center gap-4">
            <Award className="w-12 h-12 text-yellow-400 animate-bounce" />
            <div>
              <h4 className="text-sm font-black text-slate-200">أحسنت! أكملت الاختبار بنجاح</h4>
              <p className="text-2xl font-black text-cyan-400 mt-2">{score} / {quiz?.length}</p>
              <p className="text-xs text-slate-500 mt-1">حصلت على +{score * 15} نقطة خبرة (XP) 🔥</p>
            </div>
            <div className="flex gap-2">
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={startQuiz}
                className="px-4 py-2 rounded-xl font-bold text-xs bg-slate-800 text-slate-300 border border-slate-700 cursor-pointer">
                إعادة المحاولة
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
