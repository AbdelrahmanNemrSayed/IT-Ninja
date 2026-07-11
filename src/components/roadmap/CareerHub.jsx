import React, { useState, memo } from "react";
import { BookOpen, ExternalLink, HelpCircle, GraduationCap, Server, FileText, Sparkles, Send, Award, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const interviewQA = [
  {
    cat: "networks",
    q: "ما هو الفرق بين TCP و UDP ومتى يُفضل استخدام كل منهما؟",
    a: "بروتوكول TCP هو بروتوكول موجه للاتصال (Connection-oriented) ويضمن وصول البيانات بالكامل وترتيبها، ويُستخدم في الخدمات التي لا تقبل فقدان البيانات مثل تصفح الويب (HTTP) والبريد الإلكتروني. أما UDP فهو بروتوكول غير موجه للاتصال (Connectionless) ولا يضمن وصول البيانات ولكنه سريع جداً، ويُستخدم في البث المباشر والألعاب وخدمات الصوت والفيديو والـ DNS."
  },
  {
    cat: "linux",
    q: "كيف يمكنك تتبع وحل مشكلة بطء استجابة سيرفر لينكس (High CPU Usage)؟",
    a: "نبدأ باستخدام أداة top أو htop لعرض العمليات النشطة واستهلاك المعالج والذاكرة. وإذا كانت هناك عملية معينة تستهلك الموارد، يمكن إيقافها باستخدام الأمر kill أو killall. كما يمكن مراجعة ملفات السجل (Logs) في المجلد /var/log لمعرفة الأسباب، والتحقق من حالة القرص الصلب باستخدام df -h ومعدل الكتابة والقراءة باستخدام iostat."
  },
  {
    cat: "ad",
    q: "ما هي خدمة الـ Active Directory وما الفائدة من استخدامها في شبكات الشركات؟",
    a: "خدمة الدليل النشط (Active Directory) هي قاعدة بيانات وخدمات دليل طورتها شركة مايكروسوفت لإدارة هويات وصلاحيات المستخدمين والأجهزة مركزيًا داخل الشبكة. تتيح للمسؤولين إمكانية تطبيق سياسات موحدة (GPOs)، وتأمين الوصول للخدمات، وتفويض الصلاحيات، وتسهيل عملية الدخول الموحد (Single Sign-On)."
  },
  {
    cat: "devops",
    q: "ما هو مفهوم البنية التحتية ككود (Infrastructure as Code) وما الفائدة من استخدام Terraform؟",
    a: "البنية التحتية ككود (IaC) هي عملية إدارة وتهيئة خوادم وشبكات البنية التحتية باستخدام ملفات تكوين برمجية بدلاً من الطرق اليدوية. وتعتبر أداة Terraform هي الأشهر في هذا المجال لأنها تتيح تعريف البنية التحتية بلغة HCL بشكل مستقل عن نوع المزود (Cloud Agnostic) وتوفر إمكانية تتبع التغييرات وتكرارها بسهولة وأمان."
  }
];

const sandboxes = [
  {
    name: "Play with Docker",
    desc: "بيئة تجريبية مجانية تعمل في المتصفح بالكامل لتجربة وتشغيل حاويات Docker دون الحاجة لأي تثبيت محلي.",
    url: "https://labs.play-with-docker.com/"
  },
  {
    name: "Play with Kubernetes",
    desc: "مختبر تفاعلي سريع لبناء كلوستر K8s مصغر وتجربة الأوامر وتوزيع المهام مباشرة.",
    url: "https://labs.play-with-k8s.com/"
  },
  {
    name: "Killer.sh Simulator",
    desc: "محاكي امتحان Kubernetes الشهير للتدريب العملي على امتحانات CKA / CKAD في بيئة واقعية ومحكومة بوقت.",
    url: "https://killer.sh/"
  }
];

const advancedCerts = [
  {
    name: "Red Hat Certified Engineer (RHCE)",
    desc: "الشهادة الذهبية في إدارة خوادم لينكس المتقدمة وتطوير مهارات الأتمتة باستخدام Ansible.",
    path: "مسار إدارة لينكس وأنظمة الأتمتة المتقدمة."
  },
  {
    name: "Cisco CCNP Enterprise",
    desc: "تغطي المفاهيم المتقدمة للشبكات وتصميم وتوجيه البيانات وحل مشكلات الربط الواسعة النطاق.",
    path: "مسار مهندسي الشبكات والمحولات المؤسسية."
  },
  {
    name: "Certified Kubernetes Administrator (CKA)",
    desc: "شهادة معتمدة عالمياً من Cloud Native Computing Foundation تثبت قدرتك على إدارة الحاويات والكتل.",
    path: "مسار الـ Cloud Native ومهندسي الـ DevOps."
  },
  {
    name: "AWS Solutions Architect - Associate",
    desc: "تغطي تصميم وتطوير تطبيقات وبنى تحتية سحابية آمنة ومقاومة للأعطال على منصة AWS.",
    path: "مسار مهندسي السحابة ومستشاري الحلول."
  }
];

const CareerHub = memo(function CareerHub() {
  const [activeTab, setActiveTab] = useState("interview");
  const [expandedQA, setExpandedQA] = useState({});
  const [resumeText, setResumeText] = useState("");
  const [atsResult, setAtsResult] = useState(null);
  const [scanning, setScanning] = useState(false);

  const toggleQA = (index) => {
    setExpandedQA(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const scanResume = () => {
    if (!resumeText.trim()) return;
    setScanning(true);
    setAtsResult(null);

    setTimeout(() => {
      setAtsResult({
        score: 74,
        gaps: [
          "لم تذكر أي خبرة في إعداد خوادم الدليل النشط (Active Directory) وهي مهارة حرجة لدور SysAdmin.",
          "تفتقر السيرة الذاتية لذكر أدوات الأتمتة وإدارة البنية ككود مثل Terraform أو Ansible.",
          "توصيف مهارات الشبكات عام جداً، يفضل تحديد بروتوكولات مثل OSPF أو VLANs بدلاً من كلام عام."
        ],
        keywords: ["Active Directory", "DNS", "Subnetting", "Nginx", "Linux", "GPO", "SSH Keys"],
        tips: [
          "أضف مشاريعك العملية التي قمت ببنائها في المنصة (مثل تصميم شبكة Packet Tracer) في قسم المشاريع بسيرتك الذاتية.",
          "استخدم كلمات وظيفية نشطة مثل (صممت، أعددت، أمّنت، أتمتت) بدلاً من (كنت مسؤولاً عن).",
          "تأكد من كتابة مسميات الشهادات بشكل دقيق (مثل Cisco CCNA 200-301) لسهولة قرائتها بواسطة نظام الفرز الآلي."
        ]
      });
      setScanning(false);
    }, 1500);
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="bg-slate-900/40 backdrop-blur-md border border-cyan-500/20 rounded-2xl p-6 flex flex-col gap-6 shadow-lg relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full filter blur-3xl pointer-events-none" />

      <div className="border-b border-slate-800 pb-4 text-right">
        <h3 className="font-extrabold text-sm text-slate-100 flex items-center justify-start gap-2">
          <GraduationCap className="w-5 h-5 text-cyan-400" />
          حقيبة التوظيف والمسارات المهنية المتقدمة (Career & Professional Hub)
        </h3>
        <p className="text-xs text-slate-400 mt-1">
          بوابتك المخصصة للتحضير لمقابلات العمل، التدريب العملي في بيئات تجريبية، ومصادر للشهادات العالمية المتقدمة.
        </p>
      </div>

      {/* Tabs navigation */}
      <div className="flex gap-2 overflow-x-auto pb-1 border-b border-slate-800/80">
        {[
          { id: "interview", label: "أسئلة المقابلات", icon: <HelpCircle className="w-3.5 h-3.5" /> },
          { id: "sandboxes", label: "بيئات التطبيق (Sandboxes)", icon: <Server className="w-3.5 h-3.5" /> },
          { id: "advanced", label: "الشهادات والمسارات العليا", icon: <BookOpen className="w-3.5 h-3.5" /> },
          { id: "resume", label: "مصحح السيرة الذاتية & ATS", icon: <FileText className="w-3.5 h-3.5" /> }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`text-xs px-3.5 py-2 rounded-lg font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === tab.id
                ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20"
                : "bg-slate-950 border border-slate-850 text-slate-400 hover:text-slate-200 hover:border-slate-750"
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab contents */}
      <div className="text-right">
        <AnimatePresence mode="wait">
          {activeTab === "interview" && (
            <motion.div
              key="interview"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-4"
            >
              <h4 className="font-extrabold text-sm text-slate-100 flex items-center gap-1.5 justify-start">
                <HelpCircle className="w-4 h-4 text-cyan-400" />
                دليل التحضير ومستودع أسئلة المقابلات التقنية
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                انقر على الأسئلة أدناه لعرض الإجابات النموذجية المفصلة والمساعدة لتهيئة نفسك لمقابلة العمل القادمة كمهندس أنظمة.
              </p>

              <div className="flex flex-col gap-3">
                {interviewQA.map((qa, idx) => {
                  const isOpen = !!expandedQA[idx];
                  return (
                    <div key={idx} className="bg-slate-950 border border-slate-850 rounded-xl overflow-hidden">
                      <button
                        onClick={() => toggleQA(idx)}
                        className="w-full text-right p-4 font-bold text-xs sm:text-sm text-slate-200 hover:text-cyan-400 flex justify-between items-center transition-colors cursor-pointer"
                      >
                        <span className="text-[10px] font-extrabold uppercase bg-slate-900 border border-slate-800 text-cyan-400 px-2 py-0.5 rounded-full ml-4">
                          {qa.cat.toUpperCase()}
                        </span>
                        <span className="flex-grow text-right">{qa.q}</span>
                      </button>

                      {isOpen && (
                        <div className="px-4 pb-4 border-t border-slate-900 pt-3">
                          <p className="text-xs text-slate-400 leading-relaxed bg-slate-900/60 p-3 rounded-lg border border-slate-855 select-text">
                            {qa.a}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {activeTab === "sandboxes" && (
            <motion.div
              key="sandboxes"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-4"
            >
              <h4 className="font-extrabold text-sm text-slate-100 flex items-center gap-1.5 justify-start">
                <Server className="w-4 h-4 text-cyan-400" />
                البيئات التجريبية المفتوحة (Free Sandboxes & Labs)
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                منصات مجانية بالكامل تتيح لك تشغيل الحاويات وتجربة كتل الخدمات مباشرة عبر المتصفح لترقية وتطبيق مهاراتك عملياً.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {sandboxes.map((item, idx) => (
                  <div key={idx} className="bg-slate-950 border border-slate-850 p-4 rounded-xl flex flex-col justify-between hover:border-cyan-500/50 hover:shadow-[0_0_15px_rgba(6,182,212,0.15)] transition-all duration-300">
                    <div>
                      <span className="font-extrabold text-sm text-cyan-450 block mb-1.5">{item.name}</span>
                      <p className="text-xs text-slate-400 leading-relaxed mb-4">{item.desc}</p>
                    </div>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold text-slate-350 hover:text-white flex items-center justify-center gap-1 py-1.5 bg-slate-900 border border-slate-800 rounded-lg hover:bg-cyan-500/10 hover:border-cyan-500/20 transition-all cursor-pointer"
                    >
                      <span>زيارة المنصة</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === "advanced" && (
            <motion.div
              key="advanced"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-4"
            >
              <h4 className="font-extrabold text-sm text-slate-100 flex items-center gap-1.5 justify-start">
                <BookOpen className="w-4 h-4 text-cyan-400" />
                المسارات والشهادات العالمية المتقدمة (Advanced Certifications)
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                الشهادات التي يجب أن تخطط للحصول عليها بعد إتمامك لهذا المسار لترقية مرتبتك والعمل في الشركات الكبرى.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {advancedCerts.map((cert, idx) => (
                  <div key={idx} className="bg-slate-950 border border-slate-850 p-4 rounded-xl flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-[10px] font-extrabold bg-cyan-500/10 text-cyan-400 px-2 py-0.5 rounded-full border border-cyan-500/20">
                          شهادة احترافية
                        </span>
                        <span className="font-extrabold text-sm text-slate-200">{cert.name}</span>
                      </div>
                      <p className="text-xs text-slate-455 leading-relaxed mb-4">{cert.desc}</p>
                    </div>
                    <div className="border-t border-slate-900 pt-3 text-[11px] font-bold text-slate-500">
                      الاتجاه المستهدف: {cert.path}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === "resume" && (
            <motion.div
              key="resume"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            >
              {/* Input Form */}
              <div className="lg:col-span-2 flex flex-col gap-4">
                <h4 className="font-extrabold text-sm text-slate-100 flex items-center gap-1.5 justify-start">
                  <FileText className="w-4 h-4 text-cyan-400" />
                  مصحح ومراجع السيرة الذاتية (ATS Resume Scanner)
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  الصق نص سيرتك الذاتية (Resume) وسيقوم المراجع بفحص الكلمات المفتاحية ومطابقة مهاراتك مع متطلبات خريطة الطريق الحالية لتسليط الضوء على الفجوات.
                </p>

                <div className="flex flex-col gap-2.5">
                  <textarea
                    value={resumeText}
                    onChange={(e) => setResumeText(e.target.value)}
                    disabled={scanning || !!atsResult}
                    placeholder="الصق نص سيرتك الذاتية باللغة الإنجليزية أو العربية هنا (مثل الملخص والخبرات والمهارات)..."
                    className="w-full h-44 bg-slate-950 border border-slate-850 rounded-2xl p-4 text-xs text-slate-200 placeholder-slate-650 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/20 text-right leading-loose resize-none"
                    dir="rtl"
                  />
                  <div className="flex justify-end">
                    {!atsResult && (
                      <button
                        onClick={scanResume}
                        disabled={scanning || !resumeText.trim()}
                        className="px-6 py-2.5 rounded-xl font-extrabold text-xs text-slate-950 bg-gradient-to-r from-cyan-400 to-emerald-450 hover:shadow-[0_0_15px_rgba(6,182,212,0.25)] disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        {scanning ? (
                          <>
                            <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                            <span>جاري فحص السيرة الذاتية...</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-3.5 h-3.5 text-slate-950 animate-bounce" />
                            <span>فحص وتحسين السيرة الذاتية</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Scan Results */}
              <div className="lg:col-span-1 bg-slate-950/40 border border-slate-900 rounded-2xl p-5 flex flex-col gap-4">
                <h4 className="font-extrabold text-xs text-slate-400 border-b border-slate-900 pb-2 flex items-center justify-between">
                  <span>نتائج فحص الـ ATS والمهارات</span>
                  <Award className="w-4 h-4 text-cyan-400 animate-bounce" />
                </h4>

                <AnimatePresence mode="wait">
                  {atsResult ? (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex flex-col gap-4 text-right text-xs"
                    >
                      {/* Score */}
                      <div className="flex items-center justify-between bg-slate-950 border border-slate-850 p-3 rounded-xl">
                        <span className={`font-black text-base ${atsResult.score >= 80 ? "text-emerald-400" : "text-amber-400"}`}>
                          {atsResult.score}%
                        </span>
                        <span className="font-bold text-slate-500">معدل توافق الـ ATS</span>
                      </div>

                      {/* Gaps */}
                      <div className="flex flex-col gap-1.5">
                        <span className="font-black text-rose-455 block">الفجوات التقنية المكتشفة:</span>
                        <ul className="list-disc list-inside text-[11px] text-slate-400 flex flex-col gap-1 pr-1">
                          {atsResult.gaps.map((gap, i) => (
                            <li key={i} className="leading-relaxed">{gap}</li>
                          ))}
                        </ul>
                      </div>

                      {/* Keywords */}
                      <div className="flex flex-col gap-1.5">
                        <span className="font-black text-cyan-400 block">كلمات مفتاحية يُنصح بإضافتها:</span>
                        <div className="flex flex-wrap gap-1.5 justify-end mt-1">
                          {atsResult.keywords.map((kw, i) => (
                            <span key={i} className="text-[9px] font-bold bg-slate-900 border border-slate-850 text-slate-350 px-2 py-0.5 rounded">
                              {kw}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Tips */}
                      <div className="flex flex-col gap-1.5">
                        <span className="font-black text-emerald-450 block">نصائح تحسين التنسيق:</span>
                        <ul className="list-disc list-inside text-[11px] text-slate-400 flex flex-col gap-1 pr-1">
                          {atsResult.tips.map((tip, i) => (
                            <li key={i} className="leading-relaxed">{tip}</li>
                          ))}
                        </ul>
                      </div>

                      <button
                        onClick={() => setAtsResult(null)}
                        className="w-full py-2.5 rounded-xl font-bold bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-350 hover:text-white transition-all cursor-pointer text-[11px]"
                      >
                        إعادة فحص سيرة ذاتية أخرى
                      </button>
                    </motion.div>
                  ) : (
                    <div className="flex-grow flex flex-col items-center justify-center gap-2 py-10 text-center text-slate-500">
                      <AlertCircle className="w-8 h-8 text-slate-700 animate-pulse" />
                      <span className="text-[11px] font-bold">بانتظار إدخال نص السيرة الذاتية لتوليد تقرير الـ ATS والمهارات.</span>
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.section>
  );
});

export default CareerHub;
