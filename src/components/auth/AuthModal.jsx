import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, User, Eye, EyeOff, X, Loader2, AlertCircle, CheckCircle2, Zap, Shield } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../lib/supabase";

const FloatingOrb = ({ style }) => (
  <div className="absolute rounded-full blur-3xl opacity-20 pointer-events-none animate-pulse" style={style} />
);

const InputField = ({ icon: Icon, type, placeholder, value, onChange, showToggle, onToggle, showPass }) => (
  <div className="relative group">
    <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-cyan-400 transition-colors z-10" />
    <input
      type={showToggle ? (showPass ? "text" : "password") : type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required
      className="w-full bg-slate-900/80 border border-slate-700/50 rounded-xl pl-12 pr-4 py-3.5 text-sm text-slate-200 placeholder-slate-500
        focus:outline-none focus:border-cyan-500/60 focus:ring-2 focus:ring-cyan-500/10 focus:bg-slate-900
        transition-all duration-200 font-medium"
    />
    {showToggle && (
      <button type="button" onClick={onToggle} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 cursor-pointer">
        {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
      </button>
    )}
  </div>
);

export default function AuthModal() {
  const { signIn, signUp, setAuthModal, isConfigured, recoveryMode, setRecoveryMode } = useAuth();
  const [tab, setTab] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      if (recoveryMode) {
        if (password.length < 6) throw new Error("كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل");
        const { error } = await supabase.auth.updateUser({ password });
        if (error) throw error;
        setSuccess("🎉 تم تحديث كلمة المرور بنجاح! جاري الانتقال للوحة التحكم...");
        setRecoveryMode(false);
        setTimeout(() => setAuthModal(false), 2000);
      } else if (tab === "login") {
        const { error } = await signIn(email, password);
        if (error) throw error;
        setAuthModal(false);
      } else if (tab === "register") {
        if (password.length < 6) throw new Error("كلمة المرور يجب أن تكون 6 أحرف على الأقل");
        const { error } = await signUp(email, password, username);
        if (error) throw error;
        setSuccess("✅ تم إنشاء حسابك! تحقق من بريدك الإلكتروني لتأكيد الحساب.");
      } else if (tab === "forgot") {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: window.location.origin,
        });
        if (error) throw error;
        setSuccess("✅ تم إرسال بريد لإعادة تعيين كلمة المرور! تحقق من بريدك الوارد.");
      }
    } catch (err) {
      const msg = err.message || "حدث خطأ ما";
      if (msg.includes("Invalid login")) setError("البريد الإلكتروني أو كلمة المرور غير صحيحة");
      else if (msg.includes("already registered")) setError("هذا البريد مسجل بالفعل، جرب تسجيل الدخول");
      else setError(msg);
    } finally {
      setLoading(false);
    }
  };

  if (!isConfigured) {
    return (
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl"
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
          className="bg-slate-900 border border-slate-700 rounded-2xl p-8 max-w-md w-full text-center relative"
        >
          <button onClick={() => setAuthModal(false)} className="absolute top-4 right-4 text-slate-500 hover:text-slate-300 cursor-pointer"><X className="w-5 h-5" /></button>
          <Shield className="w-12 h-12 text-amber-400 mx-auto mb-4" />
          <h2 className="text-xl font-extrabold text-slate-100 mb-2">Supabase غير مُهيَّأ</h2>
          <p className="text-sm text-slate-400 leading-relaxed mb-4">
            لتفعيل نظام المستخدمين وقاعدة البيانات، ستحتاج إلى ضبط متغيرات Supabase في ملف <code className="text-cyan-400 bg-slate-800 px-1.5 py-0.5 rounded">.env</code>
          </p>
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-right text-xs font-mono text-slate-400 leading-loose">
            <div>1. أنشئ حساباً مجانياً على <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-cyan-400 underline">supabase.com</a></div>
            <div>2. أنشئ مشروعاً جديداً</div>
            <div>3. انسخ الـ URL والـ anon key من Settings &gt; API</div>
            <div>4. عدّل ملف <code className="text-amber-400">.env</code> في المشروع</div>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-xl"
      onClick={e => !recoveryMode && e.target === e.currentTarget && setAuthModal(false)}
    >
      {/* Background orbs */}
      <FloatingOrb style={{ width: 400, height: 400, background: "radial-gradient(circle, #06b6d4, transparent)", top: "10%", left: "15%" }} />
      <FloatingOrb style={{ width: 300, height: 300, background: "radial-gradient(circle, #8b5cf6, transparent)", bottom: "15%", right: "10%" }} />

      <motion.div
        initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
        className="relative w-full max-w-md"
      >
        {/* Card */}
        <div className="relative bg-slate-900/90 border border-slate-700/50 rounded-3xl p-8 shadow-[0_25px_60px_rgba(0,0,0,0.5)] backdrop-blur-xl overflow-hidden">
          {/* Inner glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-px bg-gradient-to-r from-transparent via-cyan-500/60 to-transparent" />

          {/* Close */}
          {!recoveryMode && (
            <button onClick={() => setAuthModal(false)} className="absolute top-4 right-4 text-slate-500 hover:text-slate-200 transition-colors cursor-pointer p-1.5 rounded-lg hover:bg-slate-800">
              <X className="w-4 h-4" />
            </button>
          )}

          {/* Logo */}
          <div className="flex flex-col items-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-purple-650 flex items-center justify-center shadow-[0_0_30px_rgba(6,182,212,0.4)] mb-3">
              <Zap className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-xl font-black text-slate-100">
              {recoveryMode ? "إعادة تعيين المرور" : "IT Ninja"}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              {recoveryMode ? "قم بكتابة كلمة المرور الجديدة لحسابك" : "منصة تعلم الـ IT الاحترافية"}
            </p>
          </div>

          {/* Tabs - Hidden in recoveryMode */}
          {!recoveryMode && (
            <div className="flex bg-slate-950 rounded-xl p-1 mb-6 relative">
              <motion.div
                className="absolute top-1 bottom-1 rounded-lg bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/30"
                animate={{ left: tab === "login" ? "4px" : "calc(50% + 2px)", width: "calc(50% - 6px)" }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
              {[
                { id: "login", label: "تسجيل الدخول" },
                { id: "register", label: "حساب جديد" },
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => { setTab(t.id); setError(""); setSuccess(""); }}
                  className={`flex-1 py-2 text-sm font-bold rounded-lg relative z-10 transition-colors cursor-pointer ${tab === t.id ? "text-cyan-400" : "text-slate-500 hover:text-slate-300"}`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            {recoveryMode ? (
              <InputField icon={Lock} type="password" placeholder="كلمة المرور الجديدة" value={password} onChange={e => setPassword(e.target.value)} showToggle onToggle={() => setShowPass(!showPass)} showPass={showPass} />
            ) : (
              <>
                <AnimatePresence mode="wait">
                  {tab === "register" && (
                    <motion.div key="username" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
                      <InputField icon={User} type="text" placeholder="اسم المستخدم (Username)" value={username} onChange={e => setUsername(e.target.value)} />
                    </motion.div>
                  )}
                </AnimatePresence>

                <InputField icon={Mail} type="email" placeholder="البريد الإلكتروني" value={email} onChange={e => setEmail(e.target.value)} />
                
                {tab !== "forgot" && (
                  <InputField icon={Lock} type="password" placeholder="كلمة المرور" value={password} onChange={e => setPassword(e.target.value)} showToggle onToggle={() => setShowPass(!showPass)} showPass={showPass} />
                )}
              </>
            )}

            {!recoveryMode && tab === "login" && (
              <div className="text-right">
                <button
                  type="button"
                  onClick={() => { setTab("forgot"); setError(""); setSuccess(""); }}
                  className="text-xs font-bold text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer"
                >
                  نسيت كلمة المرور؟
                </button>
              </div>
            )}

            {!recoveryMode && tab === "forgot" && (
              <div className="text-right">
                <button
                  type="button"
                  onClick={() => { setTab("login"); setError(""); setSuccess(""); }}
                  className="text-xs font-bold text-slate-400 hover:text-slate-350 transition-colors cursor-pointer"
                >
                  ← العودة لتسجيل الدخول
                </button>
              </div>
            )}

            <AnimatePresence>
              {error && (
                <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="flex items-center gap-2 bg-rose-500/10 border border-rose-500/30 rounded-xl px-4 py-2.5 text-rose-400 text-xs font-medium"
                >
                  <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
                </motion.div>
              )}
              {success && (
                <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 rounded-xl px-4 py-2.5 text-emerald-400 text-xs font-medium"
                >
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" /> {success}
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={!loading ? { scale: 1.02 } : {}}
              whileTap={!loading ? { scale: 0.98 } : {}}
              className="w-full py-3.5 rounded-xl font-extrabold text-sm text-white disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer
                bg-gradient-to-r from-cyan-500 to-purple-600 shadow-[0_0_20px_rgba(6,182,212,0.3)]
                hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] transition-shadow mt-1"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> جارٍ التحميل...</span>
              ) : (
                tab === "login" ? "🔐 تسجيل الدخول" : tab === "register" ? "🚀 إنشاء الحساب" : "✉️ إرسال رابط إعادة التعيين"
              )}
            </motion.button>
          </form>

          {/* Footer note */}
          <p className="text-center text-[11px] text-slate-600 mt-4">
            بالتسجيل، تقدمك يُحفظ على السحابة ويظل متاحاً من أي جهاز
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
