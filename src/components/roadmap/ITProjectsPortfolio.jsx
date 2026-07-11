import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FolderGit, Download, Play, ShieldAlert, Sparkles, CheckCircle, AlertTriangle, ShieldCheck } from "lucide-react";

const projectsData = [
  {
    id: "net_design",
    title: "مشروع 1: تصميم وتأمين شبكة مكتب مؤسسة متكاملة",
    difficulty: "متوسط",
    difficultyColor: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
    time: "4 ساعات",
    desc: "تصميم وتقسيم شبكة كاملة لفرع رئيسي وفرعين فرعيين لشركة، وحساب العناوين (Subnetting) برمجياً وتطبيق الـ VLANs وتأمين الاتصال بـ ACLs ومحاكاتها بالكامل داخل Cisco Packet Tracer.",
    expectedCode: "Cisco Config / Packet Tracer Lab",
    placeholder: "الصق إعدادات Cisco IOS هنا (مثل: interface vlan 10, ip access-group)..."
  },
  {
    id: "linux_nginx",
    title: "مشروع 2: خادم ويب لينكس إنتاجي مؤمن بالكامل",
    difficulty: "متوسط",
    difficultyColor: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    time: "3 ساعات",
    desc: "تثبيت خادم Ubuntu Server وافتراضياً بـ Docker، وتهيئة خادم ويب Nginx بأقسام آمنة، وإعداد جدار الحماية UFW لحظر الاتصالات وتفعيل أداة Fail2ban لمنع هجمات التخمين وتفعيل SSH Keys.",
    expectedCode: "Nginx Config / Shell Script / Ansible Playbook",
    placeholder: "الصق ملف إعداد Nginx أو سكربت الـ Bash أو Ansible Playbook هنا..."
  },
  {
    id: "windows_ad",
    title: "مشروع 3: البنية التحتية المركزية لـ Active Directory",
    difficulty: "متقدم",
    difficultyColor: "text-purple-400 bg-purple-500/10 border-purple-500/20",
    time: "5 ساعات",
    desc: "تثبيت Windows Server محلياً، وبناء Domain Controller وخدمات AD DS، وإنشاء هيكل مستخدمين وأقسام الشركة، وتطبيق سياسات مجموعة (GPOs) لحظر الـ USB وخلفيات موحدة وتوزيع الصلاحيات.",
    expectedCode: "PowerShell Script / AD Configuration Log",
    placeholder: "الصق سكربت الـ PowerShell لإنشاء الحسابات وتطبيق الـ GPOs هنا..."
  },
  {
    id: "devops_gitops",
    title: "مشروع 4: خط أنابيب DevOps وبنية تحتية ككود (IaC)",
    difficulty: "متقدم جداً",
    difficultyColor: "text-rose-400 bg-rose-500/10 border-rose-500/20",
    time: "6 ساعات",
    desc: "كتابة ملفات Terraform لإنشاء خوادم وشبكة افتراضية على AWS، وتهيئة خادم الويب تلقائياً باستخدام Ansible Playbook، وتغليف التطبيق بـ Docker ونشره داخل Kubernetes باستخدام Helm.",
    expectedCode: "Terraform HCL / Kubernetes YAML",
    placeholder: "الصق ملفات Terraform (.tf) أو ملفات الـ Kubernetes YAML هنا..."
  }
];

const mockReviews = {
  net_design: {
    score: 88,
    issues: ["لم يتم إغلاق المنافذ غير المستخدمة (shutdown) وهي ثغرة أمنية.", "نسيت تفعيل ميزة Port Security على سويتشات الفروع لمنع تغيير الأجهزة."],
    improvements: ["تفعيل Port Security لحماية المنافذ المادية.", "تطبيق بروتوكول SSH بدلاً من Telnet غير المشفر للوصول عن بعد."],
    modelAnswer: "إعداد ممتاز! تم تقسيم الـ VLANs بشكل صحيح واستخدام الـ Subnetting لتفادي إهدار العناوين. جدار الحماية PfSense يعمل في المقدمة لتأمين الفروع بنجاح."
  },
  linux_nginx: {
    score: 95,
    issues: ["لم يتم إيقاف استجابة Nginx باسم الإصدار (server_tokens off) في رأس الصفحة."],
    improvements: ["تغيير المنفذ الافتراضي للـ SSH لمنع هجمات التخمين العشوائية.", "استخدام شهادة SSL وتفعيل بروتوكول HTTPS المشفر."],
    modelAnswer: "سكربت أتمتة خيالي! إعدادات الـ UFW دقيقة وقمت بحظر جميع المنافذ ما عدا 80 و 443 و SSH المخصص. استخدام Fail2ban يضمن حماية الخادم بنسبة 99%."
  },
  windows_ad: {
    score: 82,
    issues: ["لم يتم تفعيل خاصية Protect object from accidental deletion لحسابات الـ OUs الحساسة.", "قمت بإنشاء مستخدمين بصلاحيات Domain Admin مباشرة وهي ثغرة خطيرة."],
    improvements: ["استخدام مبدأ الصلاحيات الأدنى (Least Privilege).", "تفعيل سياسة Scavenging لخادم الـ DNS تلقائياً لتنظيف السجلات القديمة."],
    modelAnswer: "هيكل الأقسام والـ OUs متناسق جداً وقمت بتعريف الـ GPOs وتطبيقها بالترتيب الصحيح (LSDOU) بنجاح."
  },
  devops_gitops: {
    score: 90,
    issues: ["لم يتم تشفير الملفات الحساسة (secrets) في مستودع الكود واستخدمت قيم صريحة.", "ملف Terraform لا يستخدم Remote State File لحفظ وتشارك الهيكل."],
    improvements: ["استخدام HashiCorp Vault أو Kubernetes Secrets لتخزين كلمات المرور.", "تطبيق سياسات الحد من استخدام موارد المعالج في Pods الـ Kubernetes."],
    modelAnswer: "كود بنية تحتية منظم. استخدام الـ Modules في Terraform يعكس تنظيماً ممتازاً، والـ Dockerfile مجهز بشكل خفيف ومحمي لتقليل استهلاك الذاكرة."
  }
};

export default function ITProjectsPortfolio() {
  const [activeProject, setActiveProject] = useState(projectsData[0]);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [review, setReview] = useState(null);

  const selectProject = (proj) => {
    setActiveProject(proj);
    setCode("");
    setReview(null);
  };

  const analyzeCode = () => {
    if (!code.trim()) return;
    setLoading(true);
    setReview(null);

    // Simulate AI analyzing code config
    setTimeout(() => {
      setReview(mockReviews[activeProject.id]);
      setLoading(false);
    }, 1800);
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-900/40 backdrop-blur-md border border-cyan-500/20 rounded-2xl p-6 flex flex-col gap-6 shadow-lg text-right"
    >
      <div className="border-b border-slate-800 pb-4 flex items-center justify-between flex-row-reverse">
        <div className="flex items-center gap-2 flex-row-reverse">
          <FolderGit className="w-5.5 h-5.5 text-emerald-400 animate-pulse" />
          <div>
            <h3 className="font-extrabold text-base text-slate-100">
              أكاديمية المشاريع الفنية وحقيبة الأعمال (IT Projects Academy)
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              أكمل المشاريع العملية الحقيقية وادمجها في ملفك المهني بعد مراجعتها تلقائياً.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Navigation list */}
        <div className="lg:col-span-1 flex flex-col gap-2">
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1 pr-1">قائمة المشاريع المتاحة</span>
          {projectsData.map(proj => (
            <button
              key={proj.id}
              onClick={() => selectProject(proj)}
              className={`p-3.5 rounded-xl border text-right transition-all cursor-pointer text-xs font-black flex flex-col gap-1.5 ${
                activeProject.id === proj.id
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.15)]"
                  : "bg-slate-950 border-transparent hover:border-slate-800 text-slate-400 hover:text-slate-200"
              }`}
            >
              <span>{proj.title}</span>
              <div className="flex gap-1.5 items-center justify-end">
                <span className="text-[9px] font-bold text-slate-550">{proj.time}</span>
                <span className={`text-[8px] px-1.5 py-0.5 rounded font-black border uppercase ${proj.difficultyColor}`}>
                  {proj.difficulty}
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Workspace panel */}
        <div className="lg:col-span-3 bg-slate-950/40 border border-slate-900 rounded-2xl p-5 flex flex-col gap-4">
          <div className="flex flex-row-reverse justify-between items-start border-b border-slate-900 pb-3">
            <div>
              <h4 className="font-extrabold text-sm text-slate-250">{activeProject.title}</h4>
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">{activeProject.desc}</p>
            </div>
          </div>

          <div className="flex gap-2 justify-end text-xs">
            <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg font-bold bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-350 hover:text-white transition-all cursor-pointer">
              <Download className="w-3.5 h-3.5" />
              <span>تحميل كراسة المشروع والملفات (.zip)</span>
            </button>
          </div>

          {/* Code editor */}
          <div className="flex flex-col gap-2 mt-2">
            <label className="text-[11px] font-extrabold text-slate-400 flex justify-between items-center">
              <span className="text-slate-550 font-bold">يقبل الكود بصيغة: {activeProject.expectedCode}</span>
              <span>رفع الكود أو ملف التكوين (Configuration Code)</span>
            </label>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              disabled={loading || !!review}
              placeholder={activeProject.placeholder}
              className="w-full h-44 bg-slate-950 border border-slate-850 rounded-2xl p-4 text-xs text-slate-200 font-mono placeholder-slate-650 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 text-left leading-relaxed resize-none"
              dir="ltr"
            />
          </div>

          <div className="flex justify-end">
            {!review && (
              <button
                onClick={analyzeCode}
                disabled={loading || !code.trim()}
                className="px-6 py-2.5 rounded-xl font-extrabold text-xs text-slate-950 bg-gradient-to-r from-emerald-400 to-cyan-400 hover:shadow-[0_0_15px_rgba(16,185,129,0.25)] disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer flex items-center gap-1.5"
              >
                {loading ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    <span>جاري تدقيق وفحص التكوين...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-slate-950" />
                    <span>فحص وتدقيق الحل بالذكاء الاصطناعي</span>
                  </>
                )}
              </button>
            )}
          </div>

          {/* Review Results */}
          <AnimatePresence>
            {review && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="bg-slate-950 border border-slate-850 rounded-2xl p-5 flex flex-col gap-4 mt-3"
              >
                <div className="flex items-center justify-between border-b border-slate-900 pb-3 flex-row-reverse">
                  <div className="flex items-center gap-1.5 flex-row-reverse">
                    <ShieldCheck className="w-5 h-5 text-emerald-450" />
                    <h5 className="font-extrabold text-xs text-slate-200">تقرير المراجعة الفنية</h5>
                  </div>
                  <span className={`font-black text-sm ${review.score >= 80 ? "text-emerald-400" : "text-amber-400"}`}>
                    الدرجة الفنية للمشروع: {review.score}%
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-right">
                  {/* Issues */}
                  <div className="flex flex-col gap-2 bg-rose-500/5 border border-rose-500/10 p-3.5 rounded-xl">
                    <span className="text-xs font-black text-rose-455 flex items-center gap-1 justify-end">
                      <span>ثغرات وأخطاء فنية ({review.issues.length})</span>
                      <ShieldAlert className="w-4 h-4 text-rose-400" />
                    </span>
                    <ul className="list-disc list-inside text-[11px] text-slate-400 flex flex-col gap-1.5 mt-1 pr-1">
                      {review.issues.map((iss, i) => (
                        <li key={i} className="leading-relaxed">{iss}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Improvements */}
                  <div className="flex flex-col gap-2 bg-amber-500/5 border border-amber-500/10 p-3.5 rounded-xl">
                    <span className="text-xs font-black text-amber-455 flex items-center gap-1 justify-end">
                      <span>التحسينات والتوصيات الأمنية</span>
                      <AlertTriangle className="w-4 h-4 text-amber-450" />
                    </span>
                    <ul className="list-disc list-inside text-[11px] text-slate-400 flex flex-col gap-1.5 mt-1 pr-1">
                      {review.improvements.map((imp, i) => (
                        <li key={i} className="leading-relaxed">{imp}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Model Answer summary */}
                <div className="bg-slate-900/60 border border-slate-850 p-4 rounded-xl text-right text-xs">
                  <span className="font-black text-slate-350 flex items-center gap-1 justify-end mb-1">
                    <span>التقييم الفني النهائي للمراجع الذكي</span>
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-spin" />
                  </span>
                  <p className="text-slate-400 leading-relaxed">{review.modelAnswer}</p>
                </div>

                <div className="flex justify-end gap-2 text-xs">
                  <button
                    onClick={() => setReview(null)}
                    className="px-4 py-2.5 rounded-xl font-bold bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-350 hover:text-white transition-all cursor-pointer"
                  >
                    إعادة الفحص وكتابة كود آخر
                  </button>
                  {review.score >= 80 && (
                    <div className="flex items-center gap-1 px-4 py-2.5 rounded-xl font-black bg-emerald-500 text-slate-950 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                      <CheckCircle className="w-4 h-4" />
                      <span>تم قبول المشروع وحفظ الإنجاز!</span>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.section>
  );
}
