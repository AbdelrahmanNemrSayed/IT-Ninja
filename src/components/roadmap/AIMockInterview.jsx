import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MessageSquare, Play, RefreshCw, Send, AlertCircle, Award, CheckCircle2, ChevronRight, CheckSquare } from "lucide-react";

const interviewQuestionsData = {
  helpdesk: [
    {
      id: 1,
      question: "يتصل بك عميل ويشتكي من أن جهاز الكمبيوتر لا يعمل إطلاقاً وشاشته سوداء بالكامل. ما هي الخطوات المنهجية التي تتبعها للوصول للحل؟",
      keywords: ["كابل", "كهرباء", "شاش", "باور", "توصيل", "زر", "ram", "power", "screen", "cable"],
      modelAnswer: "نبدأ بالتأكد من التوصيلات المادية وكابل الطاقة وضغط زر الشاشة. ثم التحقق من لمبات الإشارة باللوحة الأم وسماع صوت المراوح. وإذا استمرت المشكلة، نفصل الملحقات الخارجية أو نختبر مزود الطاقة (Power Supply) أو رامات الجهاز.",
      feedbackTemplate: "تمت مراجعة خطوات الفحص المادي وتوصيلات الطاقة والشاشة بنجاح."
    },
    {
      id: 2,
      question: "ما هو الـ IP التلقائي (APIPA) الذي يبدأ بـ 169.254.x.x وما الذي يدل عليه بالنسبة للشبكة ومزود الـ DHCP؟",
      keywords: ["apipa", "dhcp", "تلقائي", "فشل", "سيرفر", "عنوان", "اتصال", "ip", "169"],
      modelAnswer: "عنوان APIPA يبدأ بـ 169.254.x.x ويعني أن الجهاز فشل في الحصول على IP من خادم DHCP. يدل ذلك على انقطاع الاتصال بسيرفر الـ DHCP أو امتلاء نطاق العناوين المتاحة بالشبكة.",
      feedbackTemplate: "إجابتك توضح فهم الـ APIPA وعلاقته بفشل الوصول لخادم الـ DHCP."
    },
    {
      id: 3,
      question: "كيف تشرح لمستخدم عادي غير تقني الفارق بين المجلد المشترك محلياً والمجلد السحابي؟",
      keywords: ["سحاب", "محلي", "إنترنت", "شبكة", "drive", "onedrive", "cloud", "local", "internet", "lan"],
      modelAnswer: "المجلد المشترك المحلي (Shared Folder) يتم استضافته على سيرفر محلي بالشركة ويحتاج للاتصال بالشبكة المحلية LAN للوصول إليه. المجلد السحابي (Cloud Storage) يستند لخوادم على الإنترنت مثل OneDrive أو Google Drive ويمكن الوصول إليه من أي مكان بالعالم بمجرد توفر الإنترنت.",
      feedbackTemplate: "تبسيط ممتاز للمفاهيم وتقريب الفرق بين الشبكة المحلية والإنترنت."
    },
    {
      id: 4,
      question: "ما هو الـ Safe Mode في نظام التشغيل ويندوز ومتى تلجأ لاستخدامه في عملك اليومي؟",
      keywords: ["آمن", "safe", "تعريف", "فايرس", "برامج ضارة", "تشخيص", "ويندوز", "windows", "virus", "boot"],
      modelAnswer: "الوضع الآمن (Safe Mode) هو وضع تشغيل محدود لنظام التشغيل يقوم بتحميل التعريفات والخدمات الأساسية فقط. يُستخدم لاستكشاف الأخطاء وإصلاحها وحذف البرامج الضارة والتعريفات التالفة التي تمنع النظام من الإقلاع الطبيعي.",
      feedbackTemplate: "تحديد موفق للتعريفات الأساسية والخدمات الضرورية للـ Safe Mode."
    },
    {
      id: 5,
      question: "إذا نسيت كلمة مرور الدخول لجهاز كمبيوتر متصل بالـ Domain، كيف تقوم بعمل Reset لها؟",
      keywords: ["active directory", "aduc", "reset", "domain", "دومين", "مستخدم", "password", "كلمة مرور", "تغيير"],
      modelAnswer: "نفتح أداة Active Directory Users and Computers (ADUC)، نبحث عن حساب المستخدم في الـ OU المخصصة له، ننقر بزر الفأرة الأيمن ونختار Reset Password ونقوم بإدخال كلمة المرور وتحديد خيار إجبار المستخدم على تغييرها عند تسجيل الدخول القادم.",
      feedbackTemplate: "خطوات دقيقة لاستخدام واجهة الـ Active Directory لإعادة تعيين الكلمة."
    }
  ],
  sysadmin: [
    {
      id: 1,
      question: "اشرح الفارق العملي بين أدوار الـ FSMO الخمسة في الـ Active Directory وما الذي سيحدث لو تعطل الخادم الحامل لدور PDC Emulator؟",
      keywords: ["fsmo", "pdc", "rid", "schema", "infrastructure", "domain naming", "سيرفر", "active directory", "الوقت", "المزامنة", "time"],
      modelAnswer: "أدوار FSMO هي خمسة (Schema Master, Domain Naming Master, PDC Emulator, RID Pool Manager, Infrastructure Master). إذا تعطل خادم PDC Emulator، ستتأثر مزامنة الوقت في الدومين، ولن يتمكن المدراء من تعديل كلمات المرور بفعالية وسيحدث تأخير في قفل الحسابات المتكررة.",
      feedbackTemplate: "شرح ممتاز للأدوار وتوضيح أثر غياب الـ PDC Emulator على الوقت ومزامنة كلمات المرور."
    },
    {
      id: 2,
      question: "كيف تقوم بتنفيذ خطة نسخ احتياطي للشركة تضمن عدم فقد البيانات وتراعي الفروق بين Full و Incremental و Differential backups؟",
      keywords: ["backup", "full", "incremental", "differential", "نسخ", "كامل", "تراكمي", "تفاضلي", "استعادة", "restore", "3-2-1"],
      modelAnswer: "النسخ الكامل (Full) ينسخ كل شيء ويأخذ وقتاً ومساحة كبرى. التراكمي (Incremental) ينسخ التغييرات منذ آخر نسخة من أي نوع (أسرع وأقل مساحة). التفاضلي (Differential) ينسخ التغييرات منذ آخر نسخة كاملة (أسهل في الاستعادة). يفضل تطبيق قاعدة 3-2-1 للنسخ الاحتياطي.",
      feedbackTemplate: "توضيح سليم لموازنة الوقت والمساحة وسرعة الاستعادة بين أنواع النسخ الاحتياطي."
    },
    {
      id: 3,
      question: "إذا امتلأ المعالج والرام بنسبة 99% على خادم لينكس يقوم بتشغيل موقع ويب، ما هي الأوامر والخطوات التي ستتخذها لتشخيص المشكلة؟",
      keywords: ["top", "htop", "free", "df", "ps", "kill", "systemctl", "logs", "nginx", "apache", "cpu", "ram"],
      modelAnswer: "نستخدم أمر top أو htop لرؤية العمليات المستهلكة للمعالج والرام، وأمر free -m للتحقق من الرام، و ps aux لمعرفة تفاصيل العمليات، وأمر tail لمراجعة سجلات الأخطاء مثل Nginx/Apache logs، ونقوم بإنهاء العمليات العالقة بـ kill.",
      feedbackTemplate: "إجابة عملية بأوامر لينكس الأساسية للتحليل والمراقبة الفورية للخدمات."
    },
    {
      id: 4,
      question: "ما هو الـ Group Policy Object (GPO) وما هو الترتيب التنازلي لتطبيقه على مستوى الأجهزة والمجموعات؟",
      keywords: ["gpo", "local", "site", "domain", "ou", "ترتيب", "سياسة", "تطبيق", "lsdo"],
      modelAnswer: "الـ GPO هو أداة لإدارة إعدادات الأجهزة والمستخدمين مركزياً. الترتيب التنازلي للتطبيق (LSDO): أولاً Local، ثم Site، ثم Domain، وأخيراً Organizational Unit (OU) وهي التي تسود في النهاية.",
      feedbackTemplate: "ذكر دقيق لترتيب التطبيق الأسبق والنهائي (LSDO) للسياسات."
    },
    {
      id: 5,
      question: "اشرح الفارق العملي ومميزات RAID 5 و RAID 10 ومتى تفضل أحدهما على الآخر لبيئة سيرفرات قاعدة بيانات؟",
      keywords: ["raid 5", "raid 10", "سرعة", "أمان", "parity", "mirror", "stripe", "database", "قاعدة بيانات", "أقراص"],
      modelAnswer: "RAID 5 يستخدم Parity ويتطلب 3 أقراص على الأخل ويوفر مساحة أكبر لكن أداء الكتابة أبطأ. RAID 10 يدمج الـ Mirroring والـ Striping ويتطلب 4 أقراص ويوفر أعلى سرعة قراءة وكتابة وأمان ممتاز. نفضل RAID 10 لقواعد البيانات لحاجتها لسرعة IOPS عالية.",
      feedbackTemplate: "تحليل ممتاز للفروق الهندسية واختيار RAID 10 لقواعد البيانات بناءً على الـ IOPS وكفاءة الكتابة."
    }
  ],
  network: [
    {
      id: 1,
      question: "اشرح بالتفصيل كيف يعمل الـ DHCP DORA Process من أول اتصال للجهاز بالشبكة وحتى تخصيص الـ IP؟",
      keywords: ["dora", "discover", "offer", "request", "acknowledge", "broadcast", "unicast", "dhcp", "ip"],
      modelAnswer: "تبدأ بـ Discover (بث من العميل للبحث عن سيرفر)، ثم Offer (عرض IP من السيرفر)، ثم Request (طلب العميل للعنوان المعروض)، وتنتهي بـ Acknowledge (تأكيد السيرفر وحجز العنوان وإرسال الـ Subnet والـ Gateway).",
      feedbackTemplate: "شرح تفصيلي رائع لمراحل الـ DORA الأربعة بالترتيب العلمي الصحيح."
    },
    {
      id: 2,
      question: "ما هي المشاكل التي تحلها الـ Virtual Local Area Networks (VLANs) في الشبكات الكبيرة، وكيف تتدفق حزم البيانات بين VLANs مختلفة؟",
      keywords: ["vlan", "broadcast domain", "security", "router", "routing", "trunk", "layer 3", "subinterface", "أمان", "تقسيم"],
      modelAnswer: "تحل VLANs مشكلة تضخم الـ Broadcast Domain وتحسن الأمان والتنظيم عن طريق تقسيم الشبكة منطقياً. لتمرير البيانات بين VLANs مختلفة، نحتاج لجهاز Layer 3 (راوتر أو سويتش L3) للقيام بالـ Inter-VLAN Routing (مثل Router-on-a-Stick).",
      feedbackTemplate: "توضيح سليم لدور الـ Broadcast Domain وأهمية وجود راوتر أو سويتش Layer 3 للتوجيه بين الـ VLANs."
    },
    {
      id: 3,
      question: "إذا قمت بتهيئة راوتر سيسكو جديد، ما هي الأوامر الأساسية لتأمين الـ Console والـ VTY (SSH)؟",
      keywords: ["line console", "line vty", "password", "login local", "username", "enable secret", "transport input ssh", "crypto key", "ssh"],
      modelAnswer: "نستخدم enable secret لتأمين الـ privileged mode، ثم line console 0 مع password و login لتأمين الكونسول، ولتأمين SSH نستخدم line vty 0 4 وتحديد transport input ssh و login local بعد إنشاء مفتاح التشفير بـ crypto key generate rsa.",
      feedbackTemplate: "سرد صحيح ومتقن لأوامر Cisco IOS لتأمين الوصول المادي والبعيد للأجهزة."
    },
    {
      id: 4,
      question: "ما هو بروتوكول الـ Spanning Tree Protocol (STP) وما هي المشكلة الجسيمة التي يمنع حدوثها في السويتشات؟",
      keywords: ["stp", "loop", "broadcast storm", "redundancy", "blocking", "spanning tree", "سويتش", "حلقة"],
      modelAnswer: "الـ STP يمنع حدوث الحلقات (Loops) وعواصف البث (Broadcast Storms) في شبكات السويتشات التي تحتوي على كابلات احتياطية (Redundancy)، وذلك عن طريق وضع منافذ معينة في حالة Blocking.",
      feedbackTemplate: "تحديد دقيق لمشكلة الـ Loop وعواصف البث وكيفية معالجتها بوضع الـ Blocking."
    },
    {
      id: 5,
      question: "كيف يعمل الـ NAT (Network Address Translation) وما هو الفارق بين Static و Dynamic و PAT؟",
      keywords: ["nat", "pat", "public", "private", "static", "dynamic", "port", "ip", "ترجمة", "عام", "خاص"],
      modelAnswer: "الـ NAT يترجم العناوين الخاصة (Private) إلى عناوين عامة (Public) للاتصال بالإنترنت. الـ Static يربط IP خاص بواحد عام بشكل ثابت. الـ Dynamic يربط من مجموعة عناوين عامة. الـ PAT (أو NAT Overload) يربط أجهزة كثيرة بـ IP عام واحد باستخدام أرقام منافذ (Ports) مختلفة.",
      feedbackTemplate: "تمييز رائع بين أنواع الـ NAT مع توضيح أهمية الـ PAT لتوفير العناوين العامة."
    }
  ],
  devops: [
    {
      id: 1,
      question: "ما الفارق الأساسي بين الـ Containers (Docker) والـ Virtual Machines (Hypervisors) من حيث استهلاك الموارد ومشاركة النواة؟",
      keywords: ["container", "docker", "vm", "hypervisor", "kernel", "os", "kernel sharing", "lightweight", "نواة", "نظام تشغيل"],
      modelAnswer: "الـ VM تتضمن نظام تشغيل كامل (Guest OS) وتعمل فوق الـ Hypervisor مما يستهلك موارد كبرى وعزل كامل. الـ Container يتشارك نواة نظام التشغيل المضيف (Host Kernel) ويعمل كعملية معزولة خفيفة الوزن (Lightweight) مما يجعله أسرع بكثير وأقل استهلاكاً للموارد.",
      feedbackTemplate: "توضيح مميز لمفهوم تشارك النواة (Kernel) وخفة الحاويات مقارنة بأنظمة التشغيل الكاملة في الـ VMs."
    },
    {
      id: 2,
      question: "كيف يعمل خط أنابيب الـ CI/CD وما هي المراحل الأساسية لتلقيم وبناء ونشر تطبيق ويب سحابي؟",
      keywords: ["ci/cd", "pipeline", "build", "test", "deploy", "jenkins", "github actions", "gitlab ci", "بناء", "اختبار", "نشر"],
      modelAnswer: "يبدأ خط الأنابيب عند رفع الكود (Push)، حيث يتم سحبه تلقائياً لعمل مرحلة البناء (Build)، ثم تشغيل الاختبارات المؤتمتة (Test) للتحقق من جودة الكود، ثم النشر (Deploy) إلى بيئة التطوير أو الإنتاج على السحابة.",
      feedbackTemplate: "شرح رائع ومنظم لمراحل الأتمتة الأساسية الثلاث (بناء، اختبار، نشر)."
    },
    {
      id: 3,
      question: "ما هو الـ Infrastructure as Code (IaC) وما فائدة ملف الـ state file في أداة Terraform؟",
      keywords: ["iac", "terraform", "state file", "declarative", "provider", "resource", "بنية تحتية", "أكواد", "حالة"],
      modelAnswer: "الـ IaC هي كتابة البنية التحتية كأكواد لتسهيل إدارتها وأتمتتها وتكرارها. في Terraform، يقوم الـ state file (terraform.tfstate) بتخزين خريطة الموارد الحقيقية التي تم إنشاؤها على السحابة ومقارنتها بالكود الحالي لمعرفة التغييرات المطلوبة.",
      feedbackTemplate: "شرح دقيق لأهمية الـ state file كمصدر للحقيقة ومطابقة الأكواد بالواقع السحابي."
    },
    {
      id: 4,
      question: "اشرح دور الـ Pod والـ Service والـ Deployment في كلوستر Kubernetes وكيف يرتبطون ببعضهم؟",
      keywords: ["pod", "service", "deployment", "kubernetes", "k8s", "replicas", "load balancer", "حاوية"],
      modelAnswer: "الـ Pod هو أصغر وحدة ويحتوي على حاوية واحدة أو أكثر. الـ Deployment يدير تشغيل وتحديث وتكرار (Replicas) الـ Pods بشكل مستقر. الـ Service يوفر شبكة ثابتة و IP مستقر لتوزيع الحمل (Load Balancing) للوصول للـ Pods التي قد تحذف وتنشأ باستمرار.",
      feedbackTemplate: "شرح ممتاز للعلاقة بين الوحدات الثلاثة في إدارة الحاويات والشبكات داخل K8s."
    },
    {
      id: 5,
      question: "ما معنى المراقبة الحية وبناء لوحات المتابعة (Prometheus & Grafana) وكيف يتم ضبط التنبيهات؟",
      keywords: ["prometheus", "grafana", "metrics", "alerts", "monitoring", "dashboard", "مقاييس", "لوحة تحكم", "تنبيه"],
      modelAnswer: "المراقبة تعني جمع المقاييس (Metrics) من السيرفرات والتطبيقات. يقوم Prometheus بسحب وتخزين المقاييس، بينما يقوم Grafana برسمها في لوحات تحكم تفاعلية (Dashboards). يتم ضبط التنبيهات (Alerts) لتنبيه المهندسين عبر البريد أو Slack عند تجاوز حد معين (مثل المعالج > 90%).",
      feedbackTemplate: "ربط رائع بين أدوار جمع المقاييس والتمثيل الرسومي وضبط التنبيهات الاستباقية للمشاكل."
    }
  ]
};

export default function AIMockInterview() {
  const [role, setRole] = useState("helpdesk");
  const [stage, setStage] = useState("intro"); // intro, interviewing, results
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [answersLog, setAnswersLog] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentReview, setCurrentReview] = useState(null);
  const [speaking, setSpeaking] = useState(false);

  useEffect(() => {
    if (window.speechSynthesis) {
      window.speechSynthesis.getVoices();
    }
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const speakQuestion = (text) => {
    if (!window.speechSynthesis) return;
    
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    const hasArabic = /[\u0600-\u06FF]/.test(text);
    if (hasArabic) {
      const voices = window.speechSynthesis.getVoices();
      // Try to find Egyptian Arabic voices first, then any Arabic voice
      const egVoice = voices.find(v => v.lang.toLowerCase().includes("ar-eg"))
        || voices.find(v => v.lang.toLowerCase().includes("eg"))
        || voices.find(v => v.lang.toLowerCase().startsWith("ar"))
        || voices.find(v => v.lang.toLowerCase().includes("arabic"));

      if (egVoice) {
        utterance.voice = egVoice;
        utterance.lang = egVoice.lang;
      } else {
        utterance.lang = "ar-EG";
      }
    } else {
      utterance.lang = "en-US";
    }

    utterance.rate = 0.92; // Slightly slower for clear pronunciation
    utterance.pitch = 1.0;

    utterance.onend = () => {
      setSpeaking(false);
    };
    utterance.onerror = () => {
      setSpeaking(false);
    };

    setSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const startInterview = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setSpeaking(false);
    setStage("interviewing");
    setCurrentIdx(0);
    setUserAnswer("");
    setAnswersLog([]);
    setCurrentReview(null);
  };

  const submitAnswer = () => {
    if (!userAnswer.trim()) return;
    setLoading(true);

    setTimeout(() => {
      const currentQuestion = interviewQuestionsData[role][currentIdx];
      const answerLower = userAnswer.toLowerCase();
      
      // Calculate matching keywords
      const matched = currentQuestion.keywords.filter(keyword => 
        answerLower.includes(keyword.toLowerCase())
      );
      
      // Calculate score based on length and keywords matched
      const keywordRatio = currentQuestion.keywords.length > 0 ? (matched.length / currentQuestion.keywords.length) : 1;
      
      let baseScore = 50; // Starting baseline for writing an answer
      
      // Length factor (encourages detailed answers)
      const wordCount = userAnswer.trim().split(/\s+/).length;
      let lengthBonus = 0;
      if (wordCount >= 30) {
        lengthBonus = 15;
      } else if (wordCount >= 15) {
        lengthBonus = 8;
      } else if (wordCount >= 5) {
        lengthBonus = 3;
      }
      
      // Keyword matching factor
      const keywordBonus = Math.min(35, Math.round(keywordRatio * 35));
      
      let finalScore = baseScore + lengthBonus + keywordBonus;
      
      // Cap at 98% for realistic grading, min at 40% if they just wrote gibberish
      if (wordCount < 4) {
        finalScore = Math.max(30, Math.min(50, wordCount * 10));
      } else {
        finalScore = Math.min(98, Math.max(40, finalScore));
      }

      // Generate dynamic feedback
      let feedback = "";
      if (finalScore >= 85) {
        feedback = `${currentQuestion.feedbackTemplate} إجابة غنية بالتفاصيل والمصطلحات التقنية الصحيحة (تم رصد الكلمات المفتاحية: ${matched.slice(0, 5).join(", ")}).`;
      } else if (finalScore >= 70) {
        feedback = `إجابة جيدة تغطي المفاهيم الأساسية، ولكنها تحتاج إلى المزيد من التفصيل العملي أو استخدام مصطلحات تقنية أكثر دقة. (المصطلحات التي رصدت: ${matched.join(", ") || "لا يوجد"}).`;
      } else {
        feedback = `الإجابة مختصرة جداً أو تفتقر إلى الكلمات المفتاحية الأساسية اللازمة لشرح الموضوع بشكل وافٍ ومقنع للمقابل التقني. يرجى الاطلاع على الإجابة النموذجية المرفقة لتوسيع معلوماتك.`;
      }

      const review = {
        question: currentQuestion.question,
        userAnswer: userAnswer,
        score: finalScore,
        feedback: feedback,
        modelAnswer: currentQuestion.modelAnswer
      };

      setAnswersLog(prev => [...prev, review]);
      setCurrentReview(review);
      setLoading(false);
    }, 1500);
  };

  const nextQuestion = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setSpeaking(false);
    if (currentIdx < 4) {
      setCurrentIdx(prev => prev + 1);
      setUserAnswer("");
      setCurrentReview(null);
    } else {
      setStage("results");
    }
  };

  const averageScore = answersLog.length > 0 
    ? Math.round(answersLog.reduce((acc, curr) => acc + curr.score, 0) / answersLog.length) 
    : 0;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-900/40 backdrop-blur-md border border-cyan-500/20 rounded-2xl p-6 flex flex-col gap-6 shadow-lg text-right"
    >
      <div className="border-b border-slate-800 pb-4 flex items-center justify-between flex-row-reverse">
        <div className="flex items-center gap-2 flex-row-reverse">
          <MessageSquare className="w-5.5 h-5.5 text-purple-400 animate-pulse" />
          <div>
            <h3 className="font-extrabold text-base text-slate-100">
              محاكي المقابلات الشخصية بالذكاء الاصطناعي (AI Mock Interview Simulator)
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              اختبر مهاراتك الفنية وأجوبتك التقنية واحصل على تقييم فوري من المقابل الذكي.
            </p>
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {stage === "intro" && (
          <motion.div
            key="intro-stage"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-6 py-6"
          >
            <div className="relative">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-[0_0_30px_rgba(139,92,246,0.3)]">
                <Mic className="w-9 h-9 text-white animate-pulse" />
              </div>
              <div className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-emerald-500 rounded-full border-2 border-slate-950 animate-ping" />
            </div>

            <div className="text-center max-w-md flex flex-col gap-2">
              <h4 className="font-extrabold text-sm text-slate-200">مرحباً بك في منصة المقابلات الذكية</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                ستخوض مقابلة عمل مكونة من 5 أسئلة تقنية متتالية متوافقة مع التخصص الذي تحدده، ليقوم محرك الذكاء الاصطناعي بتقييم أسلوب صياغتك ودقتك الفنية.
              </p>
            </div>

            <div className="w-full max-w-sm flex flex-col gap-2">
              <label className="text-[11px] font-extrabold text-slate-400 block mb-1">اختر التخصص المستهدف للمقابلة:</label>
              <div className="grid grid-cols-2 gap-3 text-xs">
                {[
                  { id: "helpdesk", label: "Help Desk Support" },
                  { id: "sysadmin", label: "Systems Administrator" },
                  { id: "network", label: "Network Engineer" },
                  { id: "devops", label: "Cloud & DevOps Engineer" }
                ].map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => setRole(opt.id)}
                    className={`py-3 px-2 rounded-xl font-bold border transition-all cursor-pointer ${
                      role === opt.id
                        ? "bg-purple-500/20 border-purple-500 text-purple-400 shadow-[0_0_15px_rgba(139,92,246,0.15)] scale-102"
                        : "bg-slate-950 border-slate-850 text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={startInterview}
              className="px-8 py-3.5 rounded-xl font-extrabold text-xs text-slate-950 bg-gradient-to-r from-purple-400 to-indigo-400 hover:shadow-[0_0_20px_rgba(139,92,246,0.3)] transition-all cursor-pointer flex items-center gap-1.5 mt-4"
            >
              <Play className="w-4 h-4 fill-slate-950" />
              <span>ابدأ المقابلة الافتراضية الآن</span>
            </button>
          </motion.div>
        )}

        {stage === "interviewing" && (
          <motion.div
            key="interviewing-stage"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            {/* Question Pane */}
            <div className="lg:col-span-2 flex flex-col gap-4">
              <div className="bg-slate-950/60 border border-slate-900 rounded-2xl p-5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full filter blur-xl pointer-events-none" />
                <div className="flex items-center justify-between border-b border-slate-900 pb-3 mb-3">
                  <span className="text-[10px] font-black text-purple-400 uppercase tracking-widest">المقابل الذكي (Interviewer)</span>
                  <span className="text-[10px] font-bold text-slate-500">السؤال {currentIdx + 1} من 5</span>
                </div>
                <h4 className="font-extrabold text-sm text-slate-100 leading-loose">
                  {interviewQuestionsData[role][currentIdx].question}
                </h4>

                {/* Simulated Audio Waveform */}
                <button 
                  onClick={() => speakQuestion(interviewQuestionsData[role][currentIdx].question)}
                  className="flex items-center gap-2 mt-4 justify-start bg-slate-900/60 border border-slate-800 hover:border-purple-500/50 hover:bg-slate-900 px-3 py-1.5 rounded-xl cursor-pointer text-right group transition-all"
                >
                  <div className="flex items-center gap-1">
                    {[2, 4, 3, 5, 2, 6, 4, 8, 3, 5, 2, 4, 3, 2].map((h, i) => (
                      <div 
                        key={i} 
                        className={`w-0.5 bg-purple-500 rounded-full transition-all duration-350 ${speaking ? "animate-pulse" : "opacity-60"}`} 
                        style={{ 
                          height: speaking ? `${h * 3.5}px` : "6px",
                          animationDelay: speaking ? `${i * 0.08}s` : "0s",
                          animationDuration: "0.6s"
                        }} 
                      />
                    ))}
                  </div>
                  <span className="text-[10px] text-slate-400 group-hover:text-purple-400 font-bold mr-1 transition-colors">
                    {speaking ? "إيقاف القراءة الصوتية" : "استمع للسؤال (صوت ذكي)"}
                  </span>
                </button>
              </div>

              {/* Answer Input */}
              <div className="flex flex-col gap-3">
                <label className="text-[11px] font-extrabold text-slate-400">اكتب إجابتك الفنية والعملية هنا:</label>
                <textarea
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  disabled={loading || !!currentReview}
                  placeholder="صغ إجابتك بأكبر قدر ممكن من التفاصيل الفنية، الخطوات، أو الأوامر المستخدمة..."
                  className="w-full h-32 bg-slate-950 border border-slate-850 rounded-2xl p-4 text-xs text-slate-200 placeholder-slate-650 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/20 text-right leading-loose resize-none"
                  dir="rtl"
                />
                
                <div className="flex justify-between items-center mt-1">
                  <span className="text-[10px] text-slate-550 font-bold">يفضل استخدام المصطلحات الإنجليزية الفنية عند الحاجة</span>
                  {!currentReview && (
                    <button
                      onClick={submitAnswer}
                      disabled={loading || !userAnswer.trim()}
                      className="px-6 py-2.5 rounded-xl font-extrabold text-xs text-white bg-purple-500 hover:bg-purple-650 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1.5 shadow-[0_0_15px_rgba(139,92,246,0.2)]"
                    >
                      {loading ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>جاري تقييم الإجابة...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5" />
                          <span>إرسال الإجابة وتقييمها</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Review Pane */}
            <div className="lg:col-span-1 bg-slate-950/40 border border-slate-900 rounded-2xl p-5 flex flex-col gap-4">
              <h4 className="font-extrabold text-xs text-slate-400 border-b border-slate-900 pb-2 flex items-center justify-between">
                <span>النتيجة والتقييم الفوري</span>
                <Award className="w-4 h-4 text-purple-400 animate-bounce" />
              </h4>

              <AnimatePresence mode="wait">
                {currentReview ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col gap-4 text-right"
                  >
                    {/* Score badge */}
                    <div className="flex items-center justify-between bg-slate-950 border border-slate-850 p-3.5 rounded-xl">
                      <span className={`font-black text-base ${currentReview.score >= 80 ? "text-emerald-400" : "text-amber-400"}`}>
                        {currentReview.score} / 100
                      </span>
                      <span className="text-[10px] font-bold text-slate-500">الدرجة الفنية للذكاء الاصطناعي</span>
                    </div>

                    {/* AI Feedback */}
                    <div className="text-xs">
                      <span className="font-black text-slate-350 block mb-1">ملاحظات المقابل:</span>
                      <p className="bg-slate-900/40 p-3 rounded-lg border border-slate-850 text-slate-400 leading-relaxed text-right">
                        {currentReview.feedback}
                      </p>
                    </div>

                    {/* Model Answer */}
                    <div className="text-xs">
                      <span className="font-black text-slate-350 block mb-1">الإجابة النموذجية والمقترحة:</span>
                      <p className="bg-purple-950/10 p-3 rounded-lg border border-purple-500/10 text-slate-400 leading-relaxed text-right">
                        {currentReview.modelAnswer}
                      </p>
                    </div>

                    <button
                      onClick={nextQuestion}
                      className="w-full py-3 rounded-xl font-extrabold text-xs text-slate-950 bg-gradient-to-r from-purple-400 to-indigo-400 hover:shadow-[0_0_15px_rgba(139,92,246,0.25)] transition-all cursor-pointer flex items-center justify-center gap-1"
                    >
                      <span>{currentIdx < 4 ? "السؤال التالي" : "عرض النتيجة النهائية"}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </motion.div>
                ) : (
                  <div className="flex-grow flex flex-col items-center justify-center gap-2 py-10 text-center text-slate-500">
                    <AlertCircle className="w-8 h-8 text-slate-700 animate-pulse" />
                    <span className="text-[11px] font-bold">بانتظار إرسال إجابتك لتقييمها وعرض التوجيه هنا.</span>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        {stage === "results" && (
          <motion.div
            key="results-stage"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-6 py-6"
          >
            <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.2)]">
              <CheckCircle2 className="w-10 h-10 text-emerald-450 animate-bounce" />
            </div>

            <div className="text-center max-w-sm flex flex-col gap-2">
              <h4 className="font-extrabold text-sm text-slate-200">أحسنت! أكملت المقابلة الافتراضية بنجاح</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                لقد أجبت على الأسئلة الخمسة وحصلت على تقييمات تفصيلية لكل إجابة.
              </p>
            </div>

            <div className="w-full max-w-xs bg-slate-950 border border-slate-850 p-5 rounded-2xl flex flex-row-reverse justify-between items-center text-center">
              <div className="flex flex-col gap-1 items-end">
                <span className="text-[10px] text-slate-550 font-bold">الدرجة النهائية</span>
                <span className={`font-black text-2xl ${averageScore >= 80 ? "text-emerald-400" : "text-amber-400"}`}>{averageScore}%</span>
              </div>
              <div className="flex flex-col gap-1 items-start">
                <span className="text-[10px] text-slate-550 font-bold">الرتبة والتقييم</span>
                <span className="text-xs font-extrabold text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2.5 py-0.5 rounded-full">
                  {averageScore >= 90 ? "مهندس محترف (Senior)" : averageScore >= 80 ? "مهندس جاهز (Mid)" : "مبتدئ واعد (Junior)"}
                </span>
              </div>
            </div>

            <div className="flex gap-3 justify-center mt-2">
              <button
                onClick={() => setStage("intro")}
                className="px-6 py-3 rounded-xl font-bold bg-slate-950 hover:bg-slate-900 border border-slate-850 text-slate-350 hover:text-white transition-all cursor-pointer text-xs flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>إعادة المحاولة / مقابلة أخرى</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}
