import React, { useState, memo } from "react";
import { BookOpen, ExternalLink, HelpCircle, GraduationCap, Server } from "lucide-react";
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

  const toggleQA = (index) => {
    setExpandedQA(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
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
          { id: "advanced", label: "الشهادات والمسارات العليا", icon: <BookOpen className="w-3.5 h-3.5" /> }
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
                          <p className="text-xs text-slate-400 leading-relaxed bg-slate-900/60 p-3 rounded-lg border border-slate-850 select-text">
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
        </AnimatePresence>
      </div>
    </motion.section>
  );
});

export default CareerHub;
