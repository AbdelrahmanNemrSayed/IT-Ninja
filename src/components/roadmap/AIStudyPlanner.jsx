import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Target, Clock, BookOpen, Sparkles, CheckSquare, Download, Share2 } from "lucide-react";

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

async function callGeminiStudyPlanner(level, hours, goal) {
  if (!GEMINI_API_KEY) throw new Error("NO_KEY");

  const goalNames = {
    helpdesk: "الدعم الفني والـ A+",
    sysadmin: "إدارة الأنظمة والـ Active Directory",
    network: "هندسة الشبكات والـ CCNA",
    devops: "السحابة والـ DevOps"
  };

  const levelNames = {
    beginner: "مبتدئ",
    intermediate: "متوسط",
    advanced: "متقدم"
  };

  const prompt = `أنت مهندس أنظمة وشبكات وخبير تعليمي في تكنولوجيا المعلومات (IT Curriculum Designer).
يرغب طالب في الحصول على خطة دراسية مخصصة لمدة 7 أيام بالكامل للوصول للهدف المهني التالي:
الهدف المهني: "${goalNames[goal] || goal}"
المستوى الحالي للطالب: "${levelNames[level] || level}"
عدد ساعات المذاكرة اليومية المتاحة: "${hours} ساعات يومياً"

يجب أن تقوم بالرد بصيغة JSON فقط، بدون أي نصوص تمهيدية أو ختامية، ولا تضع ردك داخل كتل كود مثل \`\`\`json.
صيغة الـ JSON المطلوبة بدقة:
[
  {
    "day": "اليوم 1",
    "title": "عنوان اليوم الرئيسي باللغة العربية",
    "tasks": [
      "مهمة 1 تفصيلية وعملية باللغة العربية",
      "مهمة 2 تفصيلية وعملية باللغة العربية"
    ],
    "duration": "ساعتان"
  }
]`;

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: "application/json", temperature: 0.2 }
      })
    }
  );

  if (!res.ok) throw new Error(await res.text());
  const data = await res.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  return JSON.parse(text.trim());
}

export default function AIStudyPlanner() {
  const [level, setLevel] = useState("beginner");
  const [hours, setHours] = useState("2");
  const [goal, setGoal] = useState("helpdesk");
  const [loading, setLoading] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState(null);

  const generatePlan = async () => {
    setLoading(true);
    setGeneratedPlan(null);

    const goalNames = {
      helpdesk: "الدعم الفني والـ A+",
      sysadmin: "إدارة الأنظمة والـ Active Directory",
      network: "هندسة الشبكات والـ CCNA",
      devops: "السحابة والـ DevOps"
    };

    const levelNames = {
      beginner: "مبتدئ",
      intermediate: "متوسط",
      advanced: "متقدم"
    };

    if (GEMINI_API_KEY) {
      try {
        const schedule = await callGeminiStudyPlanner(level, hours, goal);
        setGeneratedPlan({
          level: levelNames[level] || level,
          hours: `${hours} ساعات`,
          goal: goalNames[goal] || goal,
          schedule: schedule
        });
        setLoading(false);
        return;
      } catch (err) {
        console.error("Gemini study planner error:", err);
      }
    }

    // Fallback to local simulation when key is missing or failed
    setTimeout(() => {
      let schedule = [];
      
      if (goal === "helpdesk") {
        if (level === "beginner") {
          schedule = [
            { day: "اليوم 1", title: "مكونات الحاسوب المادية (Hardware)", tasks: ["دراسة اللوحة الأم والمعالج والرامات ووحدات التخزين", "تطبيق عملي: فك وتركيب جهاز كمبيوتر قديم وتوصيل الكابلات"], duration: "2 ساعة" },
            { day: "اليوم 2", title: "تثبيت أنظمة التشغيل (OS Installation)", tasks: ["تثبيت نظام ويندوز 10/11 على بيئة افتراضية VirtualBox", "تثبيت توزيعة لينكس للمبتدئين مثل Linux Mint وفهم الواجهة"], duration: "2.5 ساعة" },
            { day: "اليوم 3", title: "أساسيات الشبكات وعناوين الـ IP", tasks: ["فهم كابلات الشبكة (RJ45) والفرق بين Cat5 و Cat6", "دراسة عناوين IPv4 وفهم مفهوم الـ Subnet Mask"], duration: "2 ساعة" },
            { day: "اليوم 4", title: "إدارة المستخدمين محلياً", tasks: ["إنشاء حسابات مستخدمين محليين وتعديل صلاحياتهم وصلاحيات الملفات", "فهم صلاحيات Administrator و Standard User"], duration: "2 ساعة" },
            { day: "اليوم 5", title: "توصيل وتثبيت الملحقات والطابعات", tasks: ["طرق تعريف الطابعات المحلية والشبكية واستكشاف مشاكل الـ Print Spooler"], duration: "1.5 ساعة" },
            { day: "اليوم 6", title: "مشروع عملي مصغر (مكتب دعم فني)", tasks: ["محاكاة معالجة تذاكر دعم فني للمبتدئين لحل مشاكل الشاشة الزرقاء والإنترنت المعطل"], duration: "3 ساعات" },
            { day: "اليوم 7", title: "مراجعة واختبار ذاتي", tasks: ["مراجعة الملاحظات وخوض اختبار تجريبي قصير لشهادة CompTIA A+"], duration: "1 ساعة" }
          ];
        } else if (level === "intermediate") {
          schedule = [
            { day: "اليوم 1", title: "إدارة مستخدمي الـ Active Directory", tasks: ["فهم مفهوم الـ Domain وإضافة أجهزة أفراد الفريق للـ Domain", "إنشاء مستخدمين ومجموعات وتعديل كلمات المرور في AD"], duration: "2.5 ساعة" },
            { day: "اليوم 2", title: "سياسات المجموعات الأساسية (GPO)", tasks: ["تطبيق سياسات حظر الـ USB أو وضع خلفية سطح مكتب موحدة للأجهزة", "استخدام أمر gpupdate /force للمزامنة"], duration: "3 ساعات" },
            { day: "اليوم 3", title: "مفاهيم الشبكات وأنظمة التوزيع", tasks: ["فهم أدوار خوادم DHCP و DNS في الشبكة المحلية", "حل مشاكل تعارض الآي بي وتجديد العنوان باستخدام ipconfig /release و /renew"], duration: "2.5 ساعة" },
            { day: "اليوم 4", title: "ويندوز ريجستري وأدوات النظام", tasks: ["مقدمة في تعديل قيم Windows Registry وتجنب الأخطاء", "استخدام أدوات Event Viewer لمراقبة أخطاء البرامج والتعريفات"], duration: "2 ساعة" },
            { day: "اليوم 5", title: "أمان الأجهزة وجدران الحماية", tasks: ["تهيئة وتخصيص ويندوز ديفندر وجدار الحماية لمكافحة البرمجيات الخبيثة", "دراسة أساليب فحص الفيروسات"], duration: "2 ساعة" },
            { day: "اليوم 6", title: "مشروع عملي: إدارة شبكة مكتبية", tasks: ["بناء سيرفر ADDC افتراضي وربط جهاز عميل به وتطبق سياسة منع الوصول لـ Control Panel"], duration: "3.5 ساعات" },
            { day: "اليوم 7", title: "يوم التحليل الذاتي", tasks: ["مراجعة تذاكر الدعم الفني المتوسطة وكتابة تقارير صيانة دورية"], duration: "1.5 ساعة" }
          ];
        } else { // advanced
          schedule = [
            { day: "اليوم 1", title: "نشر الأجهزة التلقائي (OS Deployment)", tasks: ["إعداد خدمات Windows Deployment Services (WDS)", "فهم عمل أداة Microsoft Deployment Toolkit (MDT) لنشر نسخ الويندوز تلقائياً عبر الشبكة"], duration: "3 ساعات" },
            { day: "اليوم 2", title: "إدارة تراخيص مايكروسوفت والسحابة", tasks: ["إدارة حسابات Microsoft 365 واستكشاف مشاكل مزامنة البريد المكتبي والـ OneDrive", "مقدمة في Azure Active Directory (Microsoft Entra ID)"], duration: "3 ساعات" },
            { day: "اليوم 3", title: "تشخيص الأعطال المتقدم (BSOD & Memory)", tasks: ["تحليل ملفات dump الناتجة عن توقف النظام المفاجئ باستخدام WinDbg", "فحص رامات الأجهزة والقرص الصلب بأدوات متقدمة"], duration: "2.5 ساعة" },
            { day: "اليوم 4", title: "أتمتة مهام الدعم الفني بـ PowerShell", tasks: ["كتابة سكربتات بسيطة لتجميع معلومات الأجهزة تلقائياً أو تنظيف الكاش والملفات المؤقتة للمستخدمين"], duration: "2.5 ساعة" },
            { day: "اليوم 5", title: "تأمين الشبكات اللاسلكية والـ VPN للشركة", tasks: ["إعداد بروتوكولات الأمان للشبكة اللاسلكية واستكشاف مشاكل اتصال الموظفين بالـ VPN الخارجي"], duration: "2.5 ساعة" },
            { day: "اليوم 6", title: "مشروع متكامل (نظام نشر وتحديث شامل)", tasks: ["بناء معمل يحتوي على سيرفر WDS وإعداد ملف إجابة تلقائي وتثبيت ويندوز على جهاز وهمي بالكامل دون تدخل بشري"], duration: "4 ساعات" },
            { day: "اليوم 7", title: "مراجعة وتطوير مهني", tasks: ["التخطيط للحصول على شهادة ITIL v4 وفهم أساسيات إدارة خدمات تكنولوجيا المعلومات"], duration: "1.5 ساعة" }
          ];
        }
      } else if (goal === "sysadmin") {
        if (level === "beginner") {
          schedule = [
            { day: "اليوم 1", title: "أساسيات أنظمة التشغيل للخوادم", tasks: ["فهم الفرق بين Windows Server و Windows Client", "تثبيت Windows Server 2022 على جهاز وهمي"], duration: "2 ساعة" },
            { day: "اليوم 2", title: "إعداد Domain Controller", tasks: ["تثبيت دور AD DS (Active Directory Domain Services)", "ترقية الخادم إلى Domain Controller وإنشاء دومين محلي جديد"], duration: "3 ساعات" },
            { day: "اليوم 3", title: "إدارة المستخدمين والمجموعات في AD", tasks: ["إنشاء وحدات تنظيمية (OUs) لتنظيم الأقسام", "إنشاء حسابات موظفين وتطبيق سياسة تعقيد كلمات المرور"], duration: "2.5 ساعة" },
            { day: "اليوم 4", title: "أساسيات نظام لينكس سيرفر", tasks: ["تثبيت Ubuntu Server بدون واجهة رسومية", "تعلم أهم 15 أمر للتنقل وتصفح الملفات وعرض العمليات"], duration: "2.5 ساعة" },
            { day: "اليوم 5", title: "خدمات الشبكات الأساسية (DHCP)", tasks: ["تثبيت وتكوين دور DHCP Server لتوزيع الآي بي تلقائياً داخل الدومين"], duration: "2 ساعة" },
            { day: "اليوم 6", title: "مشروع عملي: أول خادم متكامل للشركة", tasks: ["إعداد سيرفر ويندوز ودومين مع ربط جهاز مستخدم به ومزامنة بياناته"], duration: "3.5 ساعات" },
            { day: "اليوم 7", title: "مراجعة وتوثيق خطوات التثبيت", tasks: ["كتابة مستند دليل التشغيل الأساسي لخادم الدومين الجديد بالخطوات"], duration: "1.5 ساعة" }
          ];
        } else if (level === "intermediate") {
          schedule = [
            { day: "اليوم 1", title: "سياسات المجموعة المتقدمة (GPOs)", tasks: ["تصميم وتطبيق سياسات الأمان لحظر تشغيل برامج معينة للأجهزة", "استخدام GPO Preferences لخرائط الأقراص المشتركة وطابعات الدومين"], duration: "3 ساعات" },
            { day: "اليوم 2", title: "أذونات مشاركة الملفات والأقراص", tasks: ["إعداد خادم ملفات مشترك (File Server)", "تطبيق صلاحيات NTFS وصلاحيات المشاركة (Share Permissions) والفرق بينهما"], duration: "2.5 ساعة" },
            { day: "اليوم 3", title: "إدارة ومراقبة سيرفرات لينكس", tasks: ["إدارة الحزم وتثبيت البرامج بـ apt و yum", "مراقبة استهلاك الموارد والأقراص ومعالجة العمليات المستهلكة بـ top و systemctl"], duration: "2.5 - 3 ساعات" },
            { day: "اليوم 4", title: "تقنيات التخزين ومصفوفات RAID", tasks: ["دراسة الفروقات بين RAID 0, 1, 5, 10 وتأثيرها على السرعة والأمان", "محاكاة RAID Visualizer بالمنصة لتصميم مصفوفة أقراص"], duration: "2 ساعة" },
            { day: "اليوم 5", title: "بيئات العمل الافتراضية والـ Hypervisors", tasks: ["تثبيت وإعداد Hyper-V أو Proxmox وإنشاء خوادم وهمية بداخلها", "مفهوم الـ Snapshots واستخدامها الآمن"], duration: "3 ساعات" },
            { day: "اليوم 6", title: "مشروع: خادم ملفات مؤمن بالـ GPO", tasks: ["بناء دومين يحتوي على خادم ملفات وربط مستخدمين بأقسام مختلفة مع تطبيق سياسة منع النسخ على الـ USB للجميع"], duration: "4 ساعات" },
            { day: "اليوم 7", title: "أخذ نسخ احتياطية للمعمل", tasks: ["فهم استراتيجيات النسخ الاحتياطي (Full, Incremental, Differential) وتثبيت أداة نسخ احتياطي مثل Veeam Backup"], duration: "1.5 ساعة" }
          ];
        } else { // advanced
          schedule = [
            { day: "اليوم 1", title: "أدوار الـ FSMO وإدارة دومينات متعددة", tasks: ["فهم عميق لأدوار الـ FSMO الخمسة ونقلها والاستيلاء عليها عند تعطل السيرفر", "إنشاء دومين فرعي (Child Domain) أو شجرة دومين (Tree)"], duration: "3.5 ساعات" },
            { day: "اليوم 2", title: "إدارة الأنظمة والخدمات بـ PowerShell", tasks: ["أتمتة إنشاء 100 مستخدم في الـ Active Directory بسكربت واحد وقراءة ملف CSV", "أتمتة فحص مساحة الأقراص وإرسال بريد إلكتروني"], duration: "3 ساعات" },
            { day: "اليوم 3", title: "أمان الخوادم وتصليدها (Server Hardening)", tasks: ["صليد سيرفرات لينكس (SSH hardening, Fail2ban, UFW)", "تطبيق سياسة الأمان الصارمة (Local & Group Policy Security baselines) في ويندوز"], duration: "3 ساعات" },
            { day: "اليوم 4", title: "مفهوم التوفر العالي والـ Clustering", tasks: ["دراسة Failover Clustering لخوادم الملفات أو خوادم الويب", "فهم معمارية الأجهزة والشبكات لتفادي نقطة الفشل الواحدة (SPOF)"], duration: "2.5 ساعة" },
            { day: "اليوم 5", title: "السيرفرات والشبكات السحابية الهجينة", tasks: ["ربط الـ Active Directory المحلي بالسحابة باستخدام AD Connect", "فهم خيارات الهوية السحابية"], duration: "3 ساعات" },
            { day: "اليوم 6", title: "مشروع عملي: أتمتة خادم الدومين الكامل", tasks: ["كتابة وتطبيق سكربتات PowerShell لتثبيت دور AD، وترقية السيرفر، وتوليد 50 مستخدم وهمي واختبار إعداداتهم تلقائياً"], duration: "4.5 ساعات" },
            { day: "اليوم 7", title: "تحليل وتتبع الأداء المتقدم", tasks: ["استخدام Performance Monitor و Resource Monitor لتحليل عنق الزجاجة (Bottleneck) بالخوادم الكبيرة"], duration: "1.5 ساعة" }
          ];
        }
      } else if (goal === "network") {
        if (level === "beginner") {
          schedule = [
            { day: "اليوم 1", title: "أساسيات الشبكات ونموذج OSI", tasks: ["فهم طبقات نموذج OSI السبعة بالتفصيل وأدوارها", "الفرق بين الـ Switch والـ Router والـ Hub"], duration: "2 ساعة" },
            { day: "اليوم 2", title: "عناوين الـ IPv4 وتقسيمها الأساسي", tasks: ["شرح فئات الـ IP (Classes A, B, C)", "مفهوم الـ Subnet Mask وعناوين الـ Network و الـ Broadcast"], duration: "2.5 ساعة" },
            { day: "اليوم 3", title: "خطوات الاتصال الأولى بـ Cisco IOS", tasks: ["تنزيل برنامج Packet Tracer وفهم بيئة العمل", "توصيل جهاز كمبيوتر براوتر Cisco عبر كابل Console"], duration: "2 ساعة" },
            { day: "اليوم 4", title: "الأوامر الأساسية لتكوين الأجهزة", tasks: ["ضبط اسم الجهاز (hostname)، وتعيين كلمات مرور الـ Console والـ Enable Secret", "حفظ الإعدادات بأمر copy running-config startup-config"], duration: "2.5 ساعة" },
            { day: "اليوم 5", title: "التوجيه الثابت (Static Routing)", tasks: ["فهم آلية عمل التوجيه وكتابة أمر ip route لربط شبكتين مختلفتين"], duration: "2.5 ساعة" },
            { day: "اليوم 6", title: "مشروع عملي: ربط مكتبين افتراضيين", tasks: ["تصميم توبولوجي في Packet Tracer لراوترين وسويتشين وتوصيل الأجهزة مع إعداد التوجيه الثابت وتأمين الدخول"], duration: "3.5 ساعات" },
            { day: "اليوم 7", title: "أوامر الفحص والتحقق", tasks: ["استخدام أوامر ping, traceroute, show ip route لمعاينة استقرار الاتصال"], duration: "1.5 ساعة" }
          ];
        } else if (level === "intermediate") {
          schedule = [
            { day: "اليوم 1", title: "التقسيم المتقدم وعناوين الـ VLSM", tasks: ["تقسيم شبكة واحدة كبيرة لشبكات أصغر بأحجام مختلفة تناسب احتياجات الأقسام بدقة دون هدر العناوين", "تطبيق حسابات VLSM"], duration: "3 ساعات" },
            { day: "اليوم 2", title: "الشبكات الافتراضية والـ Trunking", tasks: ["إنشاء VLAN 10 و VLAN 20 على السويتش وتخصيص المنافذ", "إعداد منفذ الـ Trunk وتفعيل بروتوكول 802.1Q"], duration: "2.5 ساعة" },
            { day: "اليوم 3", title: "التوجيه الديناميكي (OSPF)", tasks: ["شرح بروتوكول OSPF ومفهوم الـ Areas والـ Wildcard Mask", "تفعيل OSPF وتوجيه البيانات ديناميكياً بين 3 راوترات"], duration: "3 ساعات" },
            { day: "اليوم 4", title: "أمان المنافذ والوصول (Port Security & ACLs)", tasks: ["تأمين منافذ السويتش بـ Port Security وحظر الأجهزة الدخيلة", "كتابة Standard ACLs لمنع قسم معين من الوصول لقسم السيرفرات"], duration: "3 ساعات" },
            { day: "اليوم 5", title: "ترجمة العناوين (NAT & PAT)", tasks: ["إعداد Static NAT و PAT (NAT Overload) للسماح لأجهزة الشبكة المحلية بالولوج للإنترنت بـ IP عام واحد"], duration: "2.5 ساعة" },
            { day: "اليوم 6", title: "مشروع: شبكة مؤسسة متوسطة متكاملة", tasks: ["بناء شبكة تحتوي على VLANs، و DHCP Server، وتوجيه OSPF، مع حماية المنافذ وتفعيل الـ PAT للإنترنت"], duration: "4.5 ساعات" },
            { day: "اليوم 7", title: "تحليل ومراقبة حزم البيانات", tasks: ["تثبيت Wireshark والتقاط حزم DHCP و DNS وتحليل تفاصيلها المارة عبر الشبكة"], duration: "1.5 ساعة" }
          ];
        } else { // advanced
          schedule = [
            { day: "اليوم 1", title: "بروتوكول شجرة الامتداد (STP & RSTP)", tasks: ["دراسة Loop الـ Layer 2 ومشاكل Broadcast Storms", "فهم معايير اختيار Root Bridge وإعداد RSTP لتحسين السرعة"], duration: "3.5 ساعات" },
            { day: "اليوم 2", title: "التوجيه الخارجي وبوابات الإنترنت (BGP)", tasks: ["مفهوم الـ Autonomous System (AS)", "إعداد اتصالات BGP بسيطة لربط المؤسسة بمزودي خدمة الإنترنت (ISPs)"], duration: "3.5 ساعات" },
            { day: "اليوم 3", title: "تأمين وحماية الشبكات المتقدم (VPN)", tasks: ["إعداد اتصالات آمنة Site-to-Site VPN باستخدام IPsec لتوصيل فرعين معاً على الإنترنت بشكل مشفر"], duration: "3 ساعات" },
            { day: "اليوم 4", title: "أجهزة جدران الحماية المخصصة (Next-Gen Firewalls)", tasks: ["مراجعة معمارية وتثبيت أنظمة PfSense أو OPNsense لتأمين مخارج الشبكة وحظر هجمات الـ Intrusion"], duration: "3 ساعات" },
            { day: "اليوم 5", title: "أتمتة وإدارة الشبكات بالأكواد (Network Automation)", tasks: ["مقدمة في استخدام لغة Python ومكتبة Netmiko للاتصال بـ 10 سويتشات دفعة واحدة وتحديث برمجياتها", "شرح بروتوكول Netconf/Restconf"], duration: "3.5 ساعات" },
            { day: "اليوم 6", title: "مشروع: معمل تأمين وأتمتة الشبكة", tasks: ["بناء معمل يحتوي على راوترات Cisco مع شبكة VPN مشفرة، وتطوير كود Python يقوم بأخذ نسخة احتياطية من الإعدادات للراوترات تلقائياً وحفظها"], duration: "4.5 ساعات" },
            { day: "اليوم 7", title: "فحص أمان واختبار الشبكة", tasks: ["استخدام أوامر Nmap لفحص البورتات المفتوحة في الشبكة وكشف الثغرات الممكنة بالروابط النشطة"], duration: "2 ساعة" }
          ];
        }
      } else { // devops
        if (level === "beginner") {
          schedule = [
            { day: "اليوم 1", title: "تأسيس نظام لينكس للمطورين", tasks: ["تعلم تنقل الملفات، وإدارة العمليات، وأذونات الملفات الفنية بصلاحيات chmod/chown", "كتابة أول سكربت Bash بسيط"], duration: "2.5 ساعة" },
            { day: "اليوم 2", title: "إدارة النسخ بـ Git", tasks: ["فهم دورة حياة الملفات في Git", "إنشاء مستودع، وعمل Commits، وإرسال الكود للـ GitHub، وإدارة الـ Branches والـ Pull Requests"], duration: "2.5 ساعة" },
            { day: "اليوم 3", title: "مقدمة في الحاويات (Docker)", tasks: ["فهم الحاجة للـ Containers والفرق بينها وبين VMs", "تشغيل حاويات Nginx و MySQL الجاهزة من Docker Hub"], duration: "3 ساعات" },
            { day: "اليوم 4", title: "كتابة الـ Dockerfile وبناء الصور", tasks: ["كتابة Dockerfile لتطبيق Node.js أو Python بسيط وبناء الصورة وتشغيلها محلياً"], duration: "3 ساعات" },
            { day: "اليوم 5", title: "أتمتة التشغيل بـ Docker Compose", tasks: ["كتابة ملف docker-compose.yml لتشغيل تطبيق ويب وقاعدة بيانات معاً وربطهما بشبكة واحدة"], duration: "2.5 ساعة" },
            { day: "اليوم 6", title: "مشروع: نشر تطبيق حاويات كامل", tasks: ["كتابة كود تطبيق ويب وتجهيز ملفات Dockerfile و Docker Compose ورفعه على مستودع GitHub متاح للجميع"], duration: "3.5 ساعات" },
            { day: "اليوم 7", title: "مراجعة أساسيات الـ SDLC", tasks: ["دراسة دورة حياة تطوير البرمجيات وفهم الثقافة الهندسية للـ DevOps"], duration: "1.5 ساعة" }
          ];
        } else if (level === "intermediate") {
          schedule = [
            { day: "اليوم 1", title: "بناء خطوط الأتمتة (CI/CD Pipelines)", tasks: ["مقدمة في GitHub Actions أو GitLab CI/CD", "إنشاء Workflow يقوم بفحص جودة الكود وتصحيح الأخطاء تلقائياً عند كل Push"], duration: "3.5 ساعات" },
            { day: "اليوم 2", title: "البنية التحتية ككود (Terraform)", tasks: ["فهم الـ Declarative configuration ولغة HCL", "كتابة كود لإنشاء خادم افتراضي ومجموعة شبكات أمان على سحابة AWS أو Azure"], duration: "3 ساعات" },
            { day: "اليوم 3", title: "أدوات إدارة التكوين (Ansible)", tasks: ["إعداد Ansible Inventory وتهيئة السيرفرات البعيدة", "كتابة Ansible Playbook لتثبيت وتحديث حزم وتأمين السيرفر"], duration: "3 ساعات" },
            { day: "اليوم 4", title: "إدارة الـ State في Terraform", tasks: ["فهم ملف terraform.tfstate والفرق بين الحفظ المحلي والسحابي (Remote State Locking)"], duration: "2.5 ساعة" },
            { day: "اليوم 5", title: "أساسيات مراقبة السيرفرات والتطبيقات", tasks: ["تثبيت Prometheus لجمع مقاييس النظام وإعداد Grafana لعرض لوحات التحكم والاستهلاك الحية"], duration: "3 ساعات" },
            { day: "اليوم 6", title: "مشروع: خط أتمتة وبنية تحتية كامل", tasks: ["كتابة كود Terraform لإنشاء خادم، واستخدام Ansible لتكوينه فور إنشائه، وربطه بخط أنابيب GitHub Actions لتنفيذه تلقائياً"], duration: "4.5 ساعات" },
            { day: "اليوم 7", title: "مراجعة وتعديل الثغرات", tasks: ["مراجعة تقارير الأمان للبنية المكتوبة باستخدام أدوات فحص الكود الأمنية بالمنصة"], duration: "1.5 ساعة" }
          ];
        } else { // advanced
          schedule = [
            { day: "اليوم 1", title: "إعداد وإدارة Kubernetes (K8s)", tasks: ["بناء كلوستر محلي بـ Minikube", "كتابة ملفات YAML لإنشاء Pods و Deployments مع تحديد أعداد النسخ الاحتياطية (Replicas)"], duration: "3.5 ساعات" },
            { day: "اليوم 2", title: "شبكات وإتاحة خدمات K8s", tasks: ["إعداد K8s Services (ClusterIP, NodePort, LoadBalancer)", "مفهوم الـ Ingress لتوجيه الروابط الخارجية داخل الكلوستر"], duration: "3.5 ساعات" },
            { day: "اليوم 3", title: "أدوات النشر المستمر الحديثة (GitOps)", tasks: ["شرح مفهوم GitOps وأهمية التوافق المستمر", "تثبيت وتجربة أداة ArgoCD لمزامنة إعدادات الكلوستر مع مستودع Git تلقائياً"], duration: "3 ساعات" },
            { day: "اليوم 4", title: "إدارة الأسرار والتكوينات بالخوادم", tasks: ["تخزين البيانات الحساسة باستخدام Kubernetes Secrets ومزامنة التكوينات بـ ConfigMaps", "مقدمة في HashiCorp Vault"], duration: "3 ساعات" },
            { day: "اليوم 5", title: "أمان بيئات الحاويات (Container Security)", tasks: ["فحص ثغرات صور Docker باستخدام أداة Trivy وتصليد إعدادات الأمان للكلوستر (Pod Security Standards)"], duration: "3 ساعات" },
            { day: "اليوم 6", title: "مشروع: بنية تحتية سحابية موجهة للحاويات", tasks: ["إنشاء كلوستر Kubernetes على السحابة بكود Terraform، ونشر تطبيق ويب متعدد الخدمات عبر ArgoCD مع تفعيل لوحات Prometheus الحية للمراقبة"], duration: "5 ساعات" },
            { day: "اليوم 7", title: "يوم تتبع وضبط أداء الكلوستر", tasks: ["تحليل أزمنة الاستجابة ومعدلات الخطأ وضبط تنبيهات Alertmanager الفورية للبريد والإرسال لقنوات التنسيق"], duration: "2 ساعة" }
          ];
        }
      }
      
      setGeneratedPlan({
        level: level === "beginner" ? "مبتدئ" : level === "intermediate" ? "متوسط" : "متقدم",
        hours: hours,
        goal: goal === "helpdesk" ? "الدعم الفني والـ A+" : goal === "sysadmin" ? "إدارة الأنظمة والـ Active Directory" : goal === "network" ? "هندسة الشبكات والـ CCNA" : "السحابة والـ DevOps",
        schedule: schedule
      });
      setLoading(false);
    }, 1500);
  };

  const downloadPDF = () => {
    if (!generatedPlan) return;
    
    const printWindow = window.open("", "_blank");
    const scheduleHtml = generatedPlan.schedule.map(item => `
      <tr style="border-bottom: 1px solid #ddd;">
        <td style="padding: 12px; font-weight: bold; color: #333; text-align: right;">${item.day}</td>
        <td style="padding: 12px; font-weight: bold; color: #111; text-align: right;">${item.title}</td>
        <td style="padding: 12px; color: #555; text-align: right;">
          <ul style="margin: 0; padding-right: 20px; list-style-type: square; direction: rtl;">
            ${item.tasks.map(t => `<li style="margin-bottom: 4px;">${t}</li>`).join("")}
          </ul>
        </td>
        <td style="padding: 12px; color: #777; font-weight: bold; text-align: right;">${item.duration}</td>
      </tr>
    `).join("");    printWindow.document.write(`
      <html dir="rtl" lang="ar">
      <head>
        <title>خطة الدراسة المخصصة - IT Ninja</title>
        <style>
          body { font-family: 'Arial', sans-serif; margin: 40px; padding: 0; color: #333; }
          .header { text-align: center; border-bottom: 2px solid #06b6d4; padding-bottom: 20px; margin-bottom: 30px; }
          .title { font-size: 24px; font-weight: bold; color: #0f172a; margin: 0 0 10px 0; }
          .meta { font-size: 14px; color: #666; margin-bottom: 5px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th { background-color: #f1f5f9; color: #0f172a; font-weight: bold; padding: 12px; text-align: right; border-bottom: 2px solid #cbd5e1; }
          .footer { text-align: center; margin-top: 50px; font-size: 12px; color: #999; border-top: 1px solid #eee; padding-top: 20px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1 class="title">📋 خطة الدراسة الشخصية الذكية (IT Study Plan)</h1>
          <div class="meta"><strong>الهدف المهني:</strong> ${generatedPlan.goal}</div>
          <div class="meta"><strong>المستوى الحالي:</strong> ${generatedPlan.level} | <strong>معدل الدراسة:</strong> ${generatedPlan.hours} ساعات يومياً</div>
        </div>
        <table>
          <thead>
            <tr>
              <th style="width: 10%;">اليوم</th>
              <th style="width: 25%;">الموضوع الأساسي</th>
              <th style="width: 50%;">المهام والدروس المطلوبة</th>
              <th style="width: 15%;">المدة المقدرة</th>
            </tr>
          </thead>
          <tbody>
            ${scheduleHtml}
          </tbody>
        </table>
        <div class="footer">
          تم توليد هذه الخطة بواسطة منصة IT Ninja لتخطيط ودراسة الشبكات والأنظمة.
        </div>
        <script>
          window.onload = function() {
            window.print();
            setTimeout(function() { window.close(); }, 500);
          };
        </script>
      </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-900/40 backdrop-blur-md border border-cyan-500/20 rounded-2xl p-6 flex flex-col gap-6 shadow-lg text-right"
    >
      <div className="border-b border-slate-800 pb-4 flex items-center justify-between flex-row-reverse">
        <div className="flex items-center gap-2 flex-row-reverse">
          <Calendar className="w-5.5 h-5.5 text-cyan-400 animate-pulse" />
          <div>
            <h3 className="font-extrabold text-base text-slate-100">
              مخطط الدراسة الشخصي بالذكاء الاصطناعي (AI Personalized Study Planner)
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              قم بصياغة وتفصيل جدول دراسي أسبوعي مخصص لاحتياجاتك وهدفك المهني.
            </p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 bg-cyan-500/10 text-cyan-400 px-3 py-1 rounded-full text-[10px] font-black uppercase border border-cyan-500/20">
          <Sparkles className="w-3 h-3 text-cyan-400 animate-spin" />
          مدعوم بالذكاء الاصطناعي
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Setup panel */}
        <div className="md:col-span-1 bg-slate-950/50 p-5 rounded-2xl border border-slate-850 flex flex-col gap-4">
          <h4 className="font-extrabold text-xs text-slate-400 mb-2 border-b border-slate-900 pb-2">خيارات تخصيص الجدول</h4>
          
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-extrabold text-slate-400 flex items-center gap-1 justify-end">
              <span>المستوى الحالي</span>
              <Target className="w-3.5 h-3.5 text-cyan-400" />
            </label>
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              {[
                { id: "beginner", label: "مبتدئ" },
                { id: "intermediate", label: "متوسط" },
                { id: "advanced", label: "متقدم" }
              ].map(opt => (
                <button
                  key={opt.id}
                  onClick={() => setLevel(opt.id)}
                  className={`py-2 rounded-xl font-bold border transition-all cursor-pointer ${
                    level === opt.id
                      ? "bg-cyan-500/20 border-cyan-500 text-cyan-450 shadow-[0_0_10px_rgba(6,182,212,0.1)]"
                      : "bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-extrabold text-slate-400 flex items-center gap-1 justify-end">
              <span>ساعات المذاكرة اليومية</span>
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
            </label>
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              {[
                { id: "1", label: "ساعة" },
                { id: "2", label: "ساعتين" },
                { id: "3", label: "3+ ساعات" }
              ].map(opt => (
                <button
                  key={opt.id}
                  onClick={() => setHours(opt.id)}
                  className={`py-2 rounded-xl font-bold border transition-all cursor-pointer ${
                    hours === opt.id
                      ? "bg-cyan-500/20 border-cyan-500 text-cyan-450 shadow-[0_0_10px_rgba(6,182,212,0.1)]"
                      : "bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-extrabold text-slate-400 flex items-center gap-1 justify-end">
              <span>الهدف والمستهدف الوظيفي</span>
              <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
            </label>
            <select
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 text-right"
              dir="rtl"
            >
              <option value="helpdesk">الدعم الفني وصيانة الأجهزة (Help Desk)</option>
              <option value="sysadmin">إدارة الأنظمة والـ Active Directory (SysAdmin)</option>
              <option value="network">هندسة وتصميم الشبكات والـ Cisco CCNA</option>
              <option value="devops">هندسة السحابة وحاويات الـ DevOps</option>
            </select>
          </div>

          <button
            onClick={generatePlan}
            disabled={loading}
            className="w-full py-3.5 rounded-xl font-extrabold text-xs text-slate-950 bg-gradient-to-r from-cyan-400 to-emerald-400 hover:shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5 mt-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                <span>جاري صياغة الخطة بالذكاء الاصطناعي...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>توليد خطتي الدراسية المخصصة</span>
              </>
            )}
          </button>
        </div>

        {/* Results panel */}
        <div className="md:col-span-2 flex flex-col gap-4">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading-state"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-grow min-h-[300px] flex flex-col items-center justify-center gap-3 bg-slate-950/30 border border-slate-900 rounded-2xl p-6"
              >
                <div className="relative">
                  <div className="w-12 h-12 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" />
                  <Sparkles className="w-5 h-5 text-emerald-400 absolute top-3.5 left-3.5 animate-bounce" />
                </div>
                <span className="text-xs font-extrabold text-slate-350 mt-2">يقوم المساعد الذكي بتحليل مستواك وهدفك وتركيب أفضل جدول دراسي...</span>
              </motion.div>
            ) : generatedPlan ? (
              <motion.div
                key="results-state"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col gap-4"
              >
                {/* Meta header */}
                <div className="bg-gradient-to-r from-slate-950 to-slate-900 border border-slate-850 p-4 rounded-2xl flex flex-row-reverse justify-between items-center text-xs">
                  <div>
                    <span className="text-slate-400 font-bold ml-1">الهدف:</span>
                    <span className="text-cyan-400 font-black">{generatedPlan.goal}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-bold ml-1">المستوى:</span>
                    <span className="text-emerald-400 font-black">{generatedPlan.level}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-bold ml-1">الساعات اليومية:</span>
                    <span className="text-purple-400 font-black">{generatedPlan.hours} ساعات</span>
                  </div>
                </div>

                {/* Day-by-day schedule */}
                <div className="flex flex-col gap-3 max-h-[420px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
                  {generatedPlan.schedule.map((item, idx) => (
                    <div key={idx} className="bg-slate-950/60 border border-slate-900 rounded-xl p-4 flex flex-col gap-2 hover:border-slate-800 transition-all duration-300">
                      <div className="flex items-center justify-between border-b border-slate-900 pb-2">
                        <span className="text-[10px] font-black bg-slate-900 border border-slate-800 text-purple-400 px-2 py-0.5 rounded-md">{item.duration}</span>
                        <div className="flex items-center gap-1.5 flex-row-reverse">
                          <span className="text-[10px] font-extrabold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-2 py-0.5 rounded">{item.day}</span>
                          <span className="font-extrabold text-xs text-slate-200">{item.title}</span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-1.5 mt-1">
                        {item.tasks.map((task, i) => (
                          <div key={i} className="flex items-start gap-2 justify-end text-xs text-slate-455">
                            <span className="text-right leading-relaxed flex-grow">{task}</span>
                            <CheckSquare className="w-4 h-4 text-emerald-500/80 flex-shrink-0 mt-0.5" />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex gap-3 justify-end mt-2 text-xs">
                  <button onClick={downloadPDF} className="flex items-center gap-1 px-4 py-2.5 rounded-xl font-bold bg-slate-950 hover:bg-slate-900 border border-slate-850 text-slate-350 hover:text-white transition-all cursor-pointer">
                    <Download className="w-3.5 h-3.5" />
                    <span>تنزيل الخطة (PDF)</span>
                  </button>
                  <button className="flex items-center gap-1 px-4 py-2.5 rounded-xl font-bold bg-cyan-50 text-slate-950 hover:bg-cyan-400 transition-all cursor-pointer">
                    <Share2 className="w-3.5 h-3.5" />
                    <span>مزامنة وحفظ في ملفي الشخصي</span>
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="empty-state"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex-grow min-h-[300px] flex flex-col items-center justify-center gap-3 bg-slate-950/20 border border-slate-900/60 border-dashed rounded-2xl p-6"
              >
                <Calendar className="w-12 h-12 text-slate-700 animate-pulse" />
                <span className="text-xs font-extrabold text-slate-400">لم يتم إنشاء خطة دراسية بعد. حدد خياراتك من اللوحة الجانبية ثم اضغط على زر التوليد.</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.section>
  );
}
