export const roadmapData = [
  {
    id: "itbasics",
    phaseNumber: "0",
    title: "المرحلة 0: أساسيات تكنولوجيا المعلومات (IT Basics & A+)",
    shortTitle: "أساسيات الـ IT",
    description: "تأسيس قوي في الأجهزة، أنظمة التشغيل، وصيانة الحاسوب.",
    accent: "emerald",
    subtopics: [
      { id: "itb_hw", text: "عتاد الكمبيوتر والمكونات الداخلية (Hardware)" },
      { id: "itb_os", text: "تثبيت وإعداد أنظمة التشغيل Windows & Linux" },
      { id: "itb_trouble", text: "استكشاف أخطاء الأجهزة وصيانتها العملية" },
      { id: "itb_quiz", text: "اختبار ترقية التأسيس (A+ Mini Exam)" }
    ],
    projects: [
      "مشروع 1: تفكيك وتجميع جهاز كمبيوتر افتراضي وتحديد وتثبيت المكونات التالفة ونظام تشغيل مزدوج."
    ],
    resources: [
      {
        id: "res_itb_ar",
        title: "كورس CompTIA A+ بالعربي - المهندس سامح رمضان",
        type: "video",
        lang: "ar",
        platform: "YouTube",
        desc: "دورة مبسطة وحديثة لتأسيسك بالكامل في عتاد وصيانة الحاسوب وأنظمة التشغيل والدعم الفني.",
        url: "https://www.youtube.com/playlist?list=PLH-n8YK76vIiDdOMRB-ylvns-_8Zl1euV"
      },
      {
        id: "res_itb_en",
        title: "CompTIA A+ Course - Professor Messer",
        type: "video",
        lang: "en",
        platform: "YouTube",
        desc: "Official playlist for A+ 220-1101 & 1102 exam preparation by Messer.",
        url: "https://www.youtube.com/playlist?list=PLG49S3nxzAnlGHYsF9IaPf9A8H85GBsJ1"
      }
    ]
  },
  {
    id: "networks",
    phaseNumber: "1",
    title: "المرحلة الأولى: الشبكات والراوترات (Networking)",
    shortTitle: "الشبكات والراوترات",
    description: "فهم بروتوكولات الاتصال، تقسيم عناوين الـ IP، وأنظمة تشغيل الراوترات المتقدمة.",
    accent: "cyan",
    subtopics: [
      { id: "net_osi", text: "أساسيات وبروتوكولات الشبكات (OSI & TCP/IP)" },
      { id: "net_subnet", text: "تقسيم الشبكات وعناوين الـ IP (Subnetting & VLSM)" },
      { id: "net_devices", text: "إعداد أجهزة الراوتر والسويتش (Cisco Packet Tracer)" },
      { id: "net_openwrt", text: "تثبيت وإعداد نظام تشغيل الراوتر المفتوح OpenWrt Firmware" },
      { id: "net_zyxel_tplink", text: "تخصيص وتحسين وتطوير أجهزة راوترات Zyxel و TP-Link" }
    ],
    projects: [
      "مشروع 1: تصميم وتقسيم شبكة شركة ذات 3 فروع وحساب العناوين (Subnetting) برمجياً ومحاكاتها بالكامل داخل Cisco Packet Tracer."
    ],
    resources: [
      {
        id: "res_net_ar",
        title: "كورس CCNA بالعربي - المهندس أحمد نظمي",
        type: "video",
        lang: "ar",
        platform: "YouTube",
        desc: "سلسلة شرح عربي كاملة ومبسطة لأساسيات التوجيه والتبديل وبناء الشبكات.",
        url: "https://www.youtube.com/playlist?list=PLB560a63H3_a1P9H13pL5v-8oP_T42T0p"
      },
      {
        id: "res_net_en",
        title: "CCNA Course - Jeremy's IT Lab",
        type: "video",
        lang: "en",
        platform: "YouTube",
        desc: "Comprehensive CCNA 200-301 course including configuration labs.",
        url: "https://www.youtube.com/playlist?list=PLxbivXZeScB9h11oG1Y4eBwHh2n2-d_0E"
      }
    ]
  },
  {
    id: "linux",
    phaseNumber: "2",
    title: "المرحلة الثانية: إدارة خوادم لينكس (Linux Server)",
    shortTitle: "خوادم لينكس",
    description: "إدارة الخوادم باستخدام سطر الأوامر وإعداد الصلاحيات والخدمات.",
    accent: "amber",
    subtopics: [
      { id: "lin_cli", text: "سطر أوامر لينكس وإدارة الملفات بالـ Terminal" },
      { id: "lin_perms", text: "إدارة الصلاحيات والمستخدمين (chmod, chown)" },
      { id: "lin_services", text: "إدارة الخدمات وحزم البرامج (systemctl, apt)" },
      { id: "lin_ssh", text: "تأمين خوادم لينكس والاتصال الآمن عبر SSH Keys" }
    ],
    projects: [
      "مشروع 1: إعداد سيرفر ويب Nginx على نظام Ubuntu Server وتأمينه باستخدام جدار الحماية UFW وتفعيل مفاتيح SSH للدخول الآمن."
    ],
    resources: [
      {
        id: "res_lin_ar",
        title: "كورس Linux RHCSA - المهندسة عبير حسني",
        type: "video",
        lang: "ar",
        platform: "YouTube",
        desc: "شرح عربي كامل لمنهج Red Hat Linux وإدارة الخوادم عملياً.",
        url: "https://www.youtube.com/playlist?list=PLLlr6jKKdyK1f8p8ajyYtXP9GxdFH7WIU"
      },
      {
        id: "res_lin_en",
        title: "Linux Server Administration - Learn Linux TV",
        type: "video",
        lang: "en",
        platform: "YouTube",
        desc: "Detailed Linux administration guide from basics to advanced server setups.",
        url: "https://www.youtube.com/playlist?list=PLT98CRl2KxGGPLw0KHb5F4N5ypgcUXsLy"
      }
    ]
  },
  {
    id: "windows",
    phaseNumber: "3",
    title: "المرحلة الثالثة: خوادم ويندوز والـ Active Directory",
    shortTitle: "خوادم ويندوز",
    description: "إدارة بيئات ويندوز سيرفر، بناء الدليل النشط، وتطبيق سياسات الأمن.",
    accent: "purple",
    subtopics: [
      { id: "win_install", text: "تثبيت وإعداد نظام Windows Server" },
      { id: "win_ad", text: "بناء وإعداد خادم الدليل النشط (Active Directory AD)" },
      { id: "win_gpo", text: "تطبيق سياسات المجموعة الأمنية (GPOs) على الأجهزة" },
      { id: "win_domain", text: "ربط أجهزة العميل بالدومين وإدارة حسابات المستخدمين" }
    ],
    projects: [
      "مشروع 2: تثبيت نسخة ويندوز سيرفر محلية، إعداد خادم الدليل النشط (AD Domain Controller)، وتطبيق سياسات مجموعة (GPOs) هرمية على أقسام الشركة."
    ],
    resources: [
      {
        id: "res_win_ar",
        title: "ويندوز سيرفر بالعربي - المهندس محمد الطناني",
        type: "video",
        lang: "ar",
        platform: "YouTube",
        desc: "كورس متكامل يغطي إعداد خوادم ويندوز وإدارة الـ Active Directory وصلاحيات الشبكة.",
        url: "https://www.youtube.com/playlist?list=PLLlr6jKKdyK1llkvqlu4DSqtYN46fQo92"
      },
      {
        id: "res_win_en",
        title: "Active Directory & IT Support - Kevtech IT Support",
        type: "video",
        lang: "en",
        platform: "YouTube",
        desc: "Hands-on guide to AD DS setup, user administration, and enterprise ticketing scenarios.",
        url: "https://www.youtube.com/@kevtechitsupport"
      }
    ]
  },
  {
    id: "virtualization",
    phaseNumber: "4",
    title: "المرحلة الرابعة: الافتراضية والخدمات (Virtualization)",
    shortTitle: "الافتراضية والخدمات",
    description: "إدارة الأنظمة الافتراضية وخوادم قواعد البيانات والويب.",
    accent: "blue",
    subtopics: [
      { id: "virt_hyper", text: "الافتراضية والـ Hypervisors (VMware, Hyper-V, Proxmox)" },
      { id: "virt_web", text: "إعداد خوادم الويب وقواعد البيانات (Nginx, Apache, SQL)" },
      { id: "virt_cloud", text: "التحول السحابي وإنشاء السيرفرات الافتراضية (EC2 / VMs)" }
    ],
    projects: [
      "مشروع 1: بناء بيئة افتراضية متكاملة باستخدام Proxmox VE تشمل خادم ويب وخادم قاعدة بيانات SQL مع إعداد مصفوفة RAID 1 للتخزين."
    ],
    resources: [
      {
        id: "res_virt_ar",
        title: "شرح الحوسبة السحابية و Azure - المهندس محمد زهدي",
        type: "video",
        lang: "ar",
        platform: "YouTube",
        desc: "دورة شاملة باللغة العربية تشرح الأنظمة الافتراضية وخدمات vSphere.",
        url: "https://www.youtube.com/@mohamedzohdy"
      },
      {
        id: "res_virt_en",
        title: "Azure & Virtualization Fundamentals - John Savill",
        type: "video",
        lang: "en",
        platform: "YouTube",
        desc: "Deep technical guide on virtualization engines, networking, and cloud models.",
        url: "https://www.youtube.com/@ntfaqguy"
      }
    ]
  },
  {
    id: "security",
    phaseNumber: "5",
    title: "المرحلة الخامسة: الأمن السيبراني (Cyber Security)",
    shortTitle: "الأمن السيبراني",
    description: "تأمين وحماية الشبكات والأنظمة وإدارة الهوية والتشفير.",
    accent: "red",
    subtopics: [
      { id: "sec_fundamentals", text: "مبادئ الأمن السيبراني ونموذج الحماية (CIA Triad)" },
      { id: "sec_firewalls", text: "إعداد وتكوين جدران الحماية (Firewalls & IDS/IPS)" },
      { id: "sec_crypt", text: "التشفير، إدارة الهوية والوصول وتأمين الاتصالات" }
    ],
    projects: [
      "مشروع 1: إعداد جدار حماية PfSense للتحكم في حركة المرور، تشغيل نظام كشف التسلل Snort، وحل ثغرات أمنية في معامل PortSwigger."
    ],
    resources: [
      {
        id: "res_sec_ar",
        title: "كورس CompTIA Security+ بالعربي - قناة Free4Arab",
        type: "video",
        lang: "ar",
        platform: "YouTube",
        desc: "سلسلة شروحات كاملة لتأمين الأنظمة، تحليل المخاطر، وفهم الهندسة الاجتماعية.",
        url: "https://www.youtube.com/playlist?list=PLLlr6jKKdyK0G8jXNlL-tHR-7FO4vgXkb"
      },
      {
        id: "res_sec_en",
        title: "CompTIA Security+ Course - Professor Messer",
        type: "video",
        lang: "en",
        platform: "YouTube",
        desc: "Industry-standard free preparation course for Security+ certification.",
        url: "https://www.youtube.com/user/professormesser"
      }
    ]
  },
  {
    id: "specialization",
    phaseNumber: "6",
    title: "المرحلة السادسة: الأتمتة والسحابة (Scripting & Cloud)",
    shortTitle: "الأتمتة والسحابة",
    description: "كتابة سكربتات الأتمتة وإدارة الخدمات السحابية الأساسية.",
    accent: "emerald",
    subtopics: [
      { id: "spec_python", text: "أساسيات لغة بايثون (Python) لأتمتة المهام" },
      { id: "spec_powershell", text: "أتمتة وإدارة أنظمة ويندوز باستخدام PowerShell" },
      { id: "spec_aws", text: "الحوسبة السحابية وشهادة AWS Cloud Practitioner" }
    ],
    projects: [
      "مشروع 1: كتابة سكربت PowerShell لمراقبة استهلاك الموارد للسيرفرات وإرسال تنبيهات بريدية آلياً، وسكربت Python لأتمتة النسخ الاحتياطي."
    ],
    resources: [
      {
        id: "res_spec_ar",
        title: "تعلم لغة بايثون للأنظمة - الزيرو ويب سكول",
        type: "video",
        lang: "ar",
        platform: "YouTube",
        desc: "دورة برمجية مبسطة وممتازة للتأسيس في البرمجة وتصميم السكربتات التلقائية.",
        url: "https://www.youtube.com/playlist?list=PLDoPjvoNmBAyE_gei5d18qkfIe-Z8mSry"
      },
      {
        id: "res_spec_en",
        title: "AWS Cloud Practitioner Course - FreeCodeCamp",
        type: "video",
        lang: "en",
        platform: "YouTube",
        desc: "Full certification course covering Amazon Web Services core concepts.",
        url: "https://www.youtube.com/watch?v=7HKot-brXFE"
      }
    ]
  },
  {
    id: "kubernetes",
    phaseNumber: "7",
    title: "المرحلة السابعة: الحاويات و Kubernetes",
    shortTitle: "الحاويات K8s",
    description: "بناء وتشغيل وإدارة الحاويات السحابية وتوزيع الخدمات.",
    accent: "cyan",
    subtopics: [
      { id: "k8s_docker", text: "بناء الحاويات وتشغيل التطبيقات باستخدام Docker" },
      { id: "k8s_cluster", text: "معمارية وإعداد كلوستر Kubernetes" },
      { id: "k8s_deploy", text: "إدارة وتوزيع الحزم ونشر الخدمات بـ Helm" }
    ],
    projects: [
      "مشروع 1: تحويل تطبيق ويب إلى حاوية Docker ورفعه على Docker Hub، ثم نشره وإدارته داخل كلوستر Kubernetes محلي باستخدام Helm."
    ],
    resources: [
      {
        id: "res_k8s_ar",
        title: "دورة دوكر وكوبيرنيتس بالعربي - المهندس عبد أبوغزالة",
        type: "video",
        lang: "ar",
        platform: "YouTube",
        desc: "سلسلة شروحات عملية رائعة تبسط مفاهيم الحاويات وإدارة كتل الخدمات.",
        url: "https://www.youtube.com/playlist?list=PLm2M9B6tHnF63jZ6H6yP59iP1J-7g2-8C"
      },
      {
        id: "res_k8s_en",
        title: "Kubernetes Tutorial - TechWorld with Nana",
        type: "video",
        lang: "en",
        platform: "YouTube",
        desc: "Visual walkthrough of K8s configuration, pods, deployment, and service architectures.",
        url: "https://www.youtube.com/watch?v=X48VuDVv0do"
      }
    ]
  },
  {
    id: "gitops",
    phaseNumber: "8",
    title: "المرحلة الثامنة: البنية التحتية ككود والـ GitOps",
    shortTitle: "GitOps & IaC",
    description: "إدارة البنية التحتية من خلال الأكواد وتفعيل دورة المزامنة التلقائية.",
    accent: "amber",
    subtopics: [
      { id: "git_iac", text: "إدارة البنية ككود باستخدام Terraform" },
      { id: "git_config", text: "أتمتة تكوين السيرفرات باستخدام Ansible" },
      { id: "git_sync", text: "تطبيق دورة الـ GitOps والمزامنة بـ ArgoCD" }
    ],
    projects: [
      "مشروع 1: كتابة أكواد Terraform لبناء خادم سحابي شبكي، وكتابة Ansible Playbooks لتهيئة الخادم وتثبيت الخدمات تلقائياً."
    ],
    resources: [
      {
        id: "res_git_ar",
        title: "شرح أداة Terraform بالعربي - المهندس محمد الشريف",
        type: "video",
        lang: "ar",
        platform: "YouTube",
        desc: "دليل متكامل لتصميم وإدارة البنية التحتية ككود باللغة العربية.",
        url: "https://www.youtube.com/playlist?list=PLCIJjtxA3eXT4O8QYm0f4u73Z9Z0lE1vJ"
      },
      {
        id: "res_git_en",
        title: "Ansible 101 Course - Jeff Geerling",
        type: "video",
        lang: "en",
        platform: "YouTube",
        desc: "Practical Ansible playbook writing, host management, and configuration tasks by a legend.",
        url: "https://www.youtube.com/playlist?list=PL2_OB-tmK9Y9p2E17w58m6sFq-s15Q9_C"
      }
    ]
  },
  {
    id: "sre",
    phaseNumber: "9",
    title: "المرحلة التاسعة: المراقبة والموثوقية (SRE)",
    shortTitle: "SRE & المراقبة",
    description: "متابعة الحالة الصحية للسيرفرات وبناء لوحات المتابعة وقياس مستوى الخدمة.",
    accent: "purple",
    subtopics: [
      { id: "sre_metrics", text: "صياغة مؤشرات الخدمة ومقاييس الأداء (SLIs & SLOs)" },
      { id: "sre_prom", text: "جمع مقاييس أداء النظام باستخدام Prometheus" },
      { id: "sre_grafana", text: "بناء لوحات التحكم ورصد البيانات بـ Grafana" }
    ],
    projects: [
      "مشروع 1: تثبيت Prometheus لجمع مقاييس أداء السيرفرات وربطه بـ Grafana لتصميم لوحة تحكم حية تعكس حالة النظام والذاكرة."
    ],
    resources: [
      {
        id: "res_sre_ar",
        title: "Prometheus & Grafana - DevOps Area",
        type: "video",
        lang: "ar",
        platform: "YouTube",
        desc: "دورة ممتازة باللغة العربية تشرح كيفية إعداد بيئات المراقبة للسيرفرات.",
        url: "https://www.youtube.com/@DevOpsArea"
      },
      {
        id: "res_sre_en",
        title: "Prometheus & Grafana Setup - TechWorld with Nana",
        type: "video",
        lang: "en",
        platform: "YouTube",
        desc: "Direct hands-on tutorial for metric parsing, alerts, and dashboard styling.",
        url: "https://www.youtube.com/watch?v=h4Sl21mGIG8"
      }
    ]
  },
  {
    id: "zerotrust",
    phaseNumber: "10",
    title: "المرحلة العاشرة: الأمن الصِفري (Zero Trust)",
    shortTitle: "الأمن الصِفري",
    description: "تطبيق معمارية الأمن الصِفري وتأمين شبكة الاتصالات والولوج للسيرفرات.",
    accent: "red",
    subtopics: [
      { id: "zt_model", text: "مفهوم الأمن الصِفري ومنع الثقة الافتراضية" },
      { id: "zt_vpn", text: "بناء شبكات VPN مشفرة وآمنة باستخدام WireGuard" },
      { id: "zt_proxy", text: "إعداد بوابات الويب الآمنة والـ Reverse Proxies" }
    ],
    projects: [
      "مشروع 1: بناء شبكة VPN مشفرة للربط بين أجهزة الشركة وسيرفراتها عن بعد باستخدام WireGuard مع تطبيق سياسة التحقق الصفرية (Zero Trust)."
    ],
    resources: [
      {
        id: "res_zt_ar",
        title: "تأمين الشبكات والاتصال الآمن - قناة هارفارد عربي",
        type: "video",
        lang: "ar",
        platform: "YouTube",
        desc: "شرح مبادئ أمن الشبكات والـ Cryptography وكيفية تشفير قنوات الاتصال.",
        url: "https://www.youtube.com/watch?v=N6O3qw9QyqU"
      },
      {
        id: "res_zt_en",
        title: "Web Networks & Security - Hussein Nasser",
        type: "video",
        lang: "en",
        platform: "YouTube",
        desc: "Deep backend networks architecture, proxies, load balancing, and SSL concepts.",
        url: "https://www.youtube.com/@hnasr"
      }
    ]
  },
  {
    id: "clouddep",
    phaseNumber: "11",
    title: "المرحلة الحادية عشرة: استضافة ونشر الخدمات السحابية (Cloud Deployment)",
    shortTitle: "النشر السحابي",
    description: "استضافة ونشر تطبيقات الويب، قواعد البيانات، وإدارة بيئات الإنتاج السحابية الحديثة.",
    accent: "emerald",
    subtopics: [
      { id: "cdp_static", text: "نشر وإدارة مواقع الويب والخدمات الثابتة عبر Vercel & Netlify" },
      { id: "cdp_backend", text: "نشر تطبيقات الخلفية (Backend) وقواعد البيانات باستخدام Railway" },
      { id: "cdp_firebase", text: "بناء وتكامل الخدمات السحابية وقواعد البيانات مع Firebase" },
      { id: "cdp_domains", text: "إعداد وتكوين نطاقات المواقع (Domains) وتفعيل شهادات SSL" }
    ],
    projects: [
      "مشروع 1: استضافة وتأمين لوحة تحكم الـ IT الخاصة بك ونشرها على Vercel مع ربطها بقاعدة بيانات سحابية مستضافة على Railway."
    ],
    resources: [
      {
        id: "res_cdp_ar",
        title: "شرح نشر وتطوير خوادم الويب السحابية - يوتيوب",
        type: "video",
        lang: "ar",
        platform: "YouTube",
        desc: "سلسلة مبسطة باللغة العربية تشرح كيفية إطلاق ونشر المواقع للإنتاج واستخدام النطاقات.",
        url: "https://www.youtube.com/watch?v=2H-L7S6yX7w"
      },
      {
        id: "res_cdp_en",
        title: "Modern Web Deployment & Firebase - Net Ninja",
        type: "video",
        lang: "en",
        platform: "YouTube",
        desc: "Step-by-step tutorial on Firebase integrations, Vercel deploys, and DNS mapping.",
        url: "https://www.youtube.com/watch?v=sBws8MSXN7A"
      }
    ]
  }
];

export const toolsData = [
  {
    name: "Wireshark",
    category: "أمن وتحليل البيانات",
    type: "local",
    desc: "التقاط وتحليل حزم البيانات المارة عبر كارت الشبكة وفهم تفاصيل البروتوكولات وحل مشكلات الاتصال.",
    url: "https://www.wireshark.org/"
  },
  {
    name: "Cisco Packet Tracer",
    category: "محاكاة الشبكات",
    type: "local",
    desc: "بناء ومحاكاة شبكات سيسكو الافتراضية للتدرب على إعداد الـ Routers والـ Switches للمبتدئين.",
    url: "https://www.netacad.com/courses/packet-tracer"
  },
  {
    name: "GNS3 Simulator",
    category: "محاكاة الشبكات",
    type: "local",
    desc: "محاكي شبكات متقدم ومحترف يتيح تشغيل أنظمة تشغيل أجهزة سيسكو وجودة شبكات حقيقية (real IOS images).",
    url: "https://www.gns3.com/"
  },
  {
    name: "Oracle VirtualBox",
    category: "الأنظمة الافتراضية",
    type: "local",
    desc: "أقوى وأسهل برنامج لتثبيت خوادم لينكس وويندوز افتراضياً داخل حاسوبك الشخصي مجاناً.",
    url: "https://www.virtualbox.org/"
  },
  {
    name: "VMware Workstation Player",
    category: "الأنظمة الافتراضية",
    type: "local",
    desc: "النسخة المجانية للاستخدام الشخصي من برنامج VMware",
    url: "https://www.broadcom.com/products/infosecurity-digital-experience/workstation-player"
  },
  {
    name: "Proxmox VE",
    category: "البيئة السحابية والافتراضية",
    type: "local",
    desc: "نظام مفتوح المصدر لإنشاء سيرفرات وهمية وإدارتها",
    url: "https://www.proxmox.com/en/downloads/proxmox-virtual-environment"
  },
  {
    name: "Ventoy",
    category: "الأنظمة الافتراضية",
    type: "local",
    desc: "وضع عدة أنظمة تشغيل (ISO) على فلاشة واحدة واختيار أي نظام للإقلاع والتثبيت بسهولة.",
    url: "https://www.ventoy.net/"
  },
  {
    name: "SS64 Reference",
    category: "موقع مرجعي",
    type: "web",
    desc: "موسوعة سريعة جداً وشاملة لجميع أوامر Linux, PowerShell, CMD مع أمثلة عملية مفصلة.",
    url: "https://ss64.com/"
  },
  {
    name: "ExplainShell",
    category: "موقع ويب",
    type: "web",
    desc: "تكتب فيه أي أمر لينكس معقد، ويقوم بتفكيكه وشرح أجزائه المختلفة بالتفصيل بناءً على الـ Man Page.",
    url: "https://explainshell.com/"
  },
  {
    name: "Draw.io",
    category: "موقع تصميم",
    type: "web",
    desc: "رسم توبولوجي ومعمارية الشبكات والسيرفرات لتوثيق وتخطيط البنية التحتية والمخططات البرمجية.",
    url: "https://app.diagrams.net/"
  },
  {
    name: "MobaXterm Console",
    category: "إدارة السيرفرات عن بعد",
    type: "web",
    desc: "محطة متكاملة لإدارة السيرفرات عن بعد تدعم بروتوكولات SSH, RDP, FTP, SFTP وشاشات متعددة.",
    url: "https://mobaxterm.mobatek.net/"
  }
];

export const cheatSheetsData = [
  { command: "ip address 192.168.1.1 255.255.255.0", category: "cisco", desc: "تحديد عنوان IP للواجهة الحالية على راوتر أو سويتش سيسكو." },
  { command: "no shutdown", category: "cisco", desc: "تشغيل وتفعيل واجهة الشبكة الحالية بعد إعدادها." },
  { command: "show ip interface brief", category: "cisco", desc: "عرض ملخص لجميع واجهات الجهاز وحالتها وعناوين الـ IP الخاصة بها." },
  { command: "show running-config", category: "cisco", desc: "عرض الإعدادات الحالية الفعالة والمحملة بالذاكرة المؤقتة (RAM)." },
  { command: "write memory", category: "cisco", desc: "حفظ الإعدادات الحالية إلى الـ NVRAM لتبقي عند إطفاء الجهاز." },
  { command: "vlan 10", category: "cisco", desc: "إنشاء شبكة افتراضية (VLAN) جديدة تحمل الرقم 10." },
  { command: "chmod 755 script.sh", category: "linux", desc: "إعطاء صلاحيات القراءة والكتابة والتنفيذ للمالك، والقراءة والتنفيذ للباقين." },
  { command: "chown nginx:nginx /var/www", category: "linux", desc: "تغيير مالك المجلد ومجموعته إلى مستخدم nginx لمنحه صلاحيات الويب." },
  { command: "systemctl restart nginx", category: "linux", desc: "إعادة تشغيل خدمة خادم الويب Nginx فوراً لتطبيق الإعدادات الجديدة." },
  { command: "df -h", category: "linux", desc: "عرض مساحة القرص الصلب والأقسام المتصلة بشكل مقروء للبشر (GB, MB)." },
  { command: "tail -f /var/log/nginx/error.log", category: "linux", desc: "مراقبة سجل الأخطاء لخادم Nginx بشكل حي ومباشر أثناء حدوثها." },
  { command: "ssh-keygen -t ed25519", category: "linux", desc: "توليد زوج مفاتيح SSH مشفر وقوي جداً للاتصال بالخوادم دون كلمة مرور." },
  { command: "Get-Service | Where-Object {$_.Status -eq 'Running'}", category: "powershell", desc: "عرض قائمة بجميع الخدمات التي تعمل حالياً على نظام ويندوز." },
  { command: "Restart-Service -Name wuauserv -Force", category: "powershell", desc: "إعادة تشغيل خدمة تحديثات ويندوز (Windows Update) بالقوة." },
  { command: "New-ADUser -Name 'Ali Ahmed' -Path 'OU=IT,DC=ninja,DC=local'", category: "powershell", desc: "إنشاء حساب مستخدم جديد باسم Ali Ahmed داخل الوحدة التنظيمية IT." },
  { command: "gpupdate /force", category: "powershell", desc: "إجبار نظام تشغيل العميل على تطبيق سياسات المجموعة (GPOs) المحدثة فوراً." },
  { command: "Test-NetConnection -ComputerName 192.168.1.10 -Port 80", category: "powershell", desc: "فحص مدى استجابة واتصال الخادم على منفذ معين (Port 80) للتأكد من خدمة الويب." }
];
