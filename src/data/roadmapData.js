export const roadmapData = [
  {
    id: "itbasics",
    phaseNumber: "0",
    title: "المرحلة 0: أساسيات تكنولوجيا المعلومات (IT Basics & A+)",
    description: "بناء أساس قوي في مبادئ تكنولوجيا المعلومات، الأجهزة، والبرمجيات الأساسية قبل الانتقال للشبكات.",
    accent: "emerald", // emerald, cyan, amber, purple, blue, red
    subtopics: [
      { id: "itb_hw", text: "فهم عتاد الكمبيوتر (Computer Hardware)" },
      { id: "itb_os", text: "أنظمة التشغيل ومبادئ عملها (Operating Systems)" },
      { id: "itb_assembly", text: "تجميع مكونات الكمبيوتر وصيانته (PC Assembly & Maintenance)" },
      { id: "itb_quiz", text: "اختبار ترقية المرحلة (CompTIA A+ Quiz)" }
    ],
    resources: [
      {
        id: "res_itb_google",
        title: "Google IT Support Professional Certificate",
        type: "course", // course, video, doc, practice
        lang: "en", // ar, en
        platform: "Coursera",
        desc: "الشهادة الاحترافية الأشهر عالمياً للتأسيس والدخول في مجال الدعم الفني وتكنولوجيا المعلومات من جوجل.",
        url: "https://www.coursera.org/professional-certificates/google-it-support"
      },
      {
        id: "res_itb_messer",
        title: "CompTIA A+ Course - Professor Messer",
        type: "video",
        lang: "en",
        platform: "YouTube",
        desc: "أقوى كورس مراجعة مجاني ومكثف وموثوق لاجتياز اختبار شهادة CompTIA A+ العالمية بقسميها.",
        url: "https://www.youtube.com/playlist?list=PLG49S3nxzAnlGHYsF9IaPf9A8H85GBsJ1"
      },
      {
        id: "res_itb_fcc",
        title: "Computer Fundamentals - FreeCodeCamp",
        type: "video",
        lang: "en",
        platform: "YouTube",
        desc: "شرح مرئي ممتاز يبسط جميع المفاهيم الأساسية لنظام عمل الكمبيوتر والمعالجات والذاكرة في فيديو واحد.",
        url: "https://www.youtube.com/watch?v=kYJ-4n5z6m4"
      },
      {
        id: "res_itb_ms",
        title: "Microsoft Learn Windows Client Fundamentals",
        type: "doc",
        lang: "en",
        platform: "Microsoft",
        desc: "المسار المرجعي والتوثيق الرسمي من مايكروسوفت لتعلم أساسيات إدارة وإعداد أنظمة تشغيل ويندوز.",
        url: "https://learn.microsoft.com/en-us/training/paths/windows-client-fundamentals/"
      }
    ]
  },
  {
    id: "networks",
    phaseNumber: "1",
    title: "المرحلة الأولى: الشبكات (Networking)",
    description: "تعتبر الشبكات العمود الفقري لتكنولوجيا المعلومات. ستتعلم في هذه المرحلة كيفية توصيل الأجهزة وتبادل البيانات.",
    accent: "cyan",
    subtopics: [
      { id: "net_osi", text: "أساسيات وبروتوكولات الشبكات (OSI & TCP/IP)" },
      { id: "net_subnet", text: "تقسيم الشبكات وعناوين الـ IP (Subnetting & IP Addressing)" },
      { id: "net_packet_tracer", text: "تكوين وإدارة الأجهزة (Cisco Packet Tracer)" },
      { id: "net_routing", text: "إعداد بروتوكولات التوجيه والتقسيم (VLANs & OSPF)" },
      { id: "net_services", text: "تحليل خدمات الشبكة الأساسية (DHCP & DNS)" }
    ],
    resources: [
      {
        id: "res_net_nazmy",
        title: "كورس CCNA 200-301 - المهندس أحمد نظمي",
        type: "video",
        lang: "ar",
        platform: "YouTube",
        desc: "شرح عربي رائع ومبسط لأساسيات التوجيه والتبديل وبناء الشبكات وإعداد أجهزة سيسكو.",
        url: "https://www.youtube.com/playlist?list=PLB560a63H3_a1P9H13pL5v-8oP_T42T0p"
      },
      {
        id: "res_net_jeremy",
        title: "CCNA Course - Jeremy's IT Lab",
        type: "video",
        lang: "en",
        platform: "YouTube",
        desc: "أقوى وأدق كورس مجاني شامل للـ CCNA 200-301 مع مختبرات عملية وتدريبات يومية وبطاقات فلاش.",
        url: "https://www.youtube.com/playlist?list=PLxbivXZeScB9h11oG1Y4eBwHh2n2-d_0E"
      },
      {
        id: "res_net_chuck",
        title: "NetworkChuck Networking Course",
        type: "video",
        lang: "en",
        platform: "YouTube",
        desc: "سلسلة مشوقة وحماسية جداً لتبسيط بروتوكولات الشبكات وعناوين الـ IP والـ Subnetting للمبتدئين.",
        url: "https://www.youtube.com/playlist?list=PLIhvC56v6FUPwP3C7z5HhjF5hC3x-N4G0"
      },
      {
        id: "res_net_messer",
        title: "CompTIA Network+ - Professor Messer",
        type: "video",
        lang: "en",
        platform: "YouTube",
        desc: "كورس مجاني بالكامل يركز على المفاهيم المنهجية للشبكات وبروتوكولاتها بشكل عام وغير منحاز لشركة معينة.",
        url: "https://www.youtube.com/playlist?list=PLG49S3nxzAnlGeBsMYOzqKbUYdLyUN9gp"
      },
      {
        id: "res_net_cisco",
        title: "Cisco Networking Academy",
        type: "practice",
        lang: "en",
        platform: "Cisco",
        desc: "موقع أكاديمية سيسكو الرسمي للتسجيل وتحميل أداة Cisco Packet Tracer لمحاكاة وتصميم الشبكات.",
        url: "https://www.netacad.com/"
      },
      {
        id: "res_net_subnet_practice",
        title: "SubnettingPractice.com",
        type: "practice",
        lang: "en",
        platform: "Web",
        desc: "أداة تدريبية وتفاعلية ممتازة لتحديات حسابات الـ Subnetting وتحديد الـ Network ID و IP Addresses.",
        url: "https://www.subnettingpractice.com/"
      }
    ]
  },
  {
    id: "linux",
    phaseNumber: "2",
    title: "المرحلة الثانية: إدارة خوادم لينكس (Linux Server)",
    description: "إدارة السيرفرات باستخدام نظام التشغيل لينكس المفتوح المصدر والمستخدم على نطاق واسع في الخوادم والبيئات الإنتاجية.",
    accent: "amber",
    subtopics: [
      { id: "lin_cli", text: "تعلم التنقل وإدارة الملفات بالـ Terminal" },
      { id: "lin_perms", text: "فهم الصلاحيات والمستخدمين (chmod, chown)" },
      { id: "lin_services", text: "إدارة الخدمات (systemctl) وتثبيت الحزم" },
      { id: "lin_nginx", text: "تثبيت خادم ويب Nginx وإعداده" },
      { id: "lin_ssh", text: "تأمين الاتصال عن بعد باستخدام SSH Key Pairs" }
    ],
    resources: [
      {
        id: "res_lin_abeer",
        title: "كورس Linux RHCSA - المهندسة عبير حسني",
        type: "video",
        lang: "ar",
        platform: "YouTube",
        desc: "شرح متميز ومبسط لمنهج سيرفرات ريد هات لينكس (RH124/RH134) مع المختبرات العملية خطوة بخطوة.",
        url: "https://www.youtube.com/playlist?list=PLLlr6jKKdyK1f8p8ajyYtXP9GxdFH7WIU"
      },
      {
        id: "res_lin_ramzy",
        title: "CompTIA Linux+ Course - المهندس ياسر رمزي",
        type: "video",
        lang: "ar",
        platform: "YouTube",
        desc: "شرح منهج شهادة Linux+ الشهيرة باللغة العربية مع التركيز على الجوانب العملية لإدارة خوادم لينكس.",
        url: "https://www.youtube.com/playlist?list=PLLlr6jKKdyK1FBi3pLVAmilLvMwWHw-84"
      },
      {
        id: "res_lin_tv",
        title: "Learn Linux TV",
        type: "video",
        lang: "en",
        platform: "YouTube",
        desc: "قناة متخصصة تقدم شروحات ممتازة جداً تغطي إدارة النظام من الصفر للاحتراف وسكربتات Bash.",
        url: "https://www.youtube.com/playlist?list=PLT98CRl2KxGGPLw0KHb5F4N5ypgcUXsLy"
      },
      {
        id: "res_lin_journey",
        title: "Linux Journey",
        type: "practice",
        lang: "en",
        platform: "Web",
        desc: "موقع تعليمي تفاعلي، مجاني ومبسط جداً لتعلم سطر أوامر لينكس بالخطوات والمراحل المتدرجة.",
        url: "https://linuxjourney.com/"
      },
      {
        id: "res_lin_bandit",
        title: "OverTheWire (Bandit Game)",
        type: "practice",
        lang: "en",
        platform: "Web",
        desc: "لعبة تفاعلية لحل الألغاز والمهام داخل الـ Terminal لتدريبك على استخدام الأوامر وتحديات الصلاحيات.",
        url: "https://overthewire.org/wargames/bandit/"
      },
      {
        id: "res_lin_sad",
        title: "SadServers Sandbox",
        type: "practice",
        lang: "en",
        platform: "Web",
        desc: "موقع رائع لحل المشاكل واستكشاف الأخطاء داخل خوادم لينكس حقيقية في متصفحك (Linux Troubleshoot).",
        url: "https://sadservers.com/"
      }
    ]
  },
  {
    id: "windows",
    phaseNumber: "3",
    title: "المرحلة الثالثة: خوادم ويندوز والـ Active Directory",
    description: "إدارة خوادم ويندوز وبناء الدليل النشط لإدارة المستخدمين، الأجهزة، والصلاحيات مركزيًا وتطبيق سياسات الأمن.",
    accent: "purple",
    subtopics: [
      { id: "win_install", text: "تثبيت نظام Windows Server 2022/2025" },
      { id: "win_ad", text: "تثبيت وإعداد الدليل النشط (Active Directory Domain Services)" },
      { id: "win_users", text: "بناء الوحدات التنظيمية وإدارة المستخدمين والصلاحيات" },
      { id: "win_gpo", text: "تطبيق سياسات الأمان والمجموعة (GPOs)" },
      { id: "win_client", text: "ربط نظام Windows Client بالدومين" }
    ],
    resources: [
      {
        id: "res_win_tanany",
        title: "Windows Server AD - المهندس محمد الطناني",
        type: "video",
        lang: "ar",
        platform: "YouTube",
        desc: "كورس شامل باللغة العربية لتعلم إعداد الدليل النشط (Active Directory) وسياسات المجموعة GPOs وخوادم ويندوز.",
        url: "https://www.youtube.com/playlist?list=PLLlr6jKKdyK1llkvqlu4DSqtYN46fQo92"
      },
      {
        id: "res_win_saqr",
        title: "Windows Server Administration - محمود صقر",
        type: "video",
        lang: "ar",
        platform: "YouTube",
        desc: "سلسلة شروحات ممتازة تغطي أدوار الملقمات (Roles) والشبكات وإعداد وإدارة خدمات الـ AD بالتفصيل.",
        url: "https://www.youtube.com/playlist?list=PLLlr6jKKdyK3pa63FTK2D2_vfjQiyxi5k"
      },
      {
        id: "res_win_kevtech",
        title: "Kevtech AD Support & Labs",
        type: "video",
        lang: "en",
        platform: "YouTube",
        desc: "قناة تركز على السيناريوهات العملية والدعم الفني وإدارة حسابات الموظفين وسير العمل داخل نظام الـ AD.",
        url: "https://www.youtube.com/@kevtechitsupport"
      },
      {
        id: "res_win_mslearn",
        title: "Microsoft Learn AD DS Path",
        type: "doc",
        lang: "en",
        platform: "Microsoft",
        desc: "المسار المرجعي والتعليمي الرسمي من مايكروسوفت لتعلم إدارة الهوية والـ Active Directory Domain Services.",
        url: "https://learn.microsoft.com/en-us/training/paths/manage-identity-access/"
      }
    ]
  },
  {
    id: "virtualization",
    phaseNumber: "4",
    title: "المرحلة الرابعة: الافتراضية والخدمات والشبكات",
    description: "فهم مبادئ الافتراضية وإدارة الـ Hypervisors وإعداد الخدمات الأساسية للشبكة كخوادم الويب وقواعد البيانات.",
    accent: "blue",
    subtopics: [
      { id: "virt_hypervisors", text: "فهم مبادئ الافتراضية وإدارة الـ Hypervisors (VMware, Hyper-V, Proxmox)" },
      { id: "virt_web", text: "إعداد وتكوين خوادم الويب (IIS, Apache, Nginx)" },
      { id: "virt_db", text: "إعداد خوادم قواعد البيانات والبريد الإلكتروني (Database & Mail Servers)" },
      { id: "virt_ec2", text: "فهم أساسيات السحابة وإنشاء سيرفر افتراضي (EC2 / VM)" }
    ],
    resources: [
      {
        id: "res_virt_zohdy",
        title: "كورس Cloud & Azure - المهندس محمد زهدي",
        type: "video",
        lang: "ar",
        platform: "YouTube",
        desc: "سلسلة احترافية باللغة العربية تغطي شهادة AZ-104 وبناء وإدارة الأنظمة الافتراضية السحابية.",
        url: "https://www.youtube.com/@mohamedzohdy"
      },
      {
        id: "res_virt_savill",
        title: "John Savill's Technical Training",
        type: "video",
        lang: "en",
        platform: "YouTube",
        desc: "أفضل قناة لشرح خدمات سحابة Azure والبنية التحتية والافتراضية بالكامل من الصفر بأسلوب شيق وبصري.",
        url: "https://www.youtube.com/@ntfaqguy"
      },
      {
        id: "res_virt_cantrill",
        title: "Adrian Cantrill AWS Architect",
        type: "course",
        lang: "en",
        platform: "Web",
        desc: "موقع يقدم كورسات متقدمة جداً تركز على الفهم العميق وتصميم معمارية البنية السحابية في AWS والافتراضية.",
        url: "https://cantrill.io/"
      },
      {
        id: "res_virt_vmware",
        title: "Virtualization Course (VMware & Hyper-V)",
        type: "video",
        lang: "ar",
        platform: "YouTube",
        desc: "شروحات باللغة العربية لإدارة أنظمة VMware vSphere 8.0 و Hyper-V لبناء بيئات العمل الافتراضية.",
        url: "https://www.youtube.com/playlist?list=PLLlr6jKKdyK2q80zTIHCtSh_8df1Uy-m7"
      },
      {
        id: "res_virt_webservers",
        title: "Web Servers Setup (IIS, Nginx, Apache)",
        type: "video",
        lang: "en",
        platform: "YouTube",
        desc: "فيديو تفصيلي من FreeCodeCamp لتعلم أساسيات خوادم الويب Nginx وكيفية تثبيتها وضبطها.",
        url: "https://www.youtube.com/watch?v=JKxlYmG-b5Y"
      },
      {
        id: "res_virt_dbs",
        title: "Database & Mail Servers (SQL Complete Course)",
        type: "video",
        lang: "en",
        platform: "YouTube",
        desc: "دورة تعليمية شاملة لتعلم لغة SQL وإدارة خوادم قواعد البيانات للمبتدئين من قناة FreeCodeCamp.",
        url: "https://www.youtube.com/watch?v=HXV3zeQKqGY"
      }
    ]
  },
  {
    id: "security",
    phaseNumber: "5",
    title: "المرحلة الخامسة: الأمن السيبراني (Cyber Security)",
    description: "حماية الأنظمة والشبكات وإدارة الهوية والوصول وتطبيق سياسات الأمن وتقييم المخاطر والثغرات.",
    accent: "red",
    subtopics: [
      { id: "sec_cia", text: "فهم مبادئ الأمن السيبراني والـ CIA Triad" },
      { id: "sec_risk", text: "تطبيق سياسات الأمان وتقييم المخاطر السيبرانية" },
      { id: "sec_firewall", text: "إعداد وتكوين جدران الحماية (Firewalls & IDS/IPS)" },
      { id: "sec_iam", text: "إدارة الهوية والوصول وتأمين التوصيل (IAM, Cryptography & Wireless)" }
    ],
    resources: [
      {
        id: "res_sec_free4arab",
        title: "كورس CompTIA Security+ - أكاديمية Free4Arab",
        type: "video",
        lang: "ar",
        platform: "YouTube",
        desc: "سلسلة شرح عربي كامل لمنهج شهادة Security+ لتغطية كافة أساسيات أمن الشبكات والأنظمة.",
        url: "https://www.youtube.com/playlist?list=PLLlr6jKKdyK0G8jXNlL-tHR-7FO4vgXkb"
      },
      {
        id: "res_sec_messer",
        title: "Professor Messer Security+ Course",
        type: "video",
        lang: "en",
        platform: "YouTube",
        desc: "أقوى كورس مراجعة مجاني ومكثف وموثوق لاجتياز اختبار CompTIA Security+ بنجاح.",
        url: "https://www.youtube.com/user/professormesser"
      },
      {
        id: "res_sec_google",
        title: "Google Cybersecurity Professional Certificate",
        type: "course",
        lang: "en",
        platform: "Coursera",
        desc: "المسار الاحترافي من جوجل لتعلم الأمن السيبراني وتحليل المخاطر والتعامل مع الثغرات عملياً.",
        url: "https://www.coursera.org/professional-certificates/google-cybersecurity"
      },
      {
        id: "res_sec_tcm",
        title: "The Cyber Mentor Security Academy",
        type: "video",
        lang: "en",
        platform: "YouTube",
        desc: "قناة متميزة تقدم دورات قوية في الاختراق الأخلاقي، أمن الشبكات، وأمن أنظمة Active Directory.",
        url: "https://www.youtube.com/@TCMSecurityAcademy"
      },
      {
        id: "res_sec_harvard",
        title: "Harvard Network Security Course",
        type: "video",
        lang: "en",
        platform: "YouTube",
        desc: "شرح مفصل ومسجل لمحاضرات جامعة هارفارد المرموقة في أمن الاتصالات وتأمين الأنظمة والشبكات.",
        url: "https://www.youtube.com/watch?v=N6O3qw9QyqU"
      },
      {
        id: "res_sec_portswigger",
        title: "PortSwigger Web Security Academy",
        type: "practice",
        lang: "en",
        platform: "Web",
        desc: "الأكاديمية الأقوى عالمياً لتعلم ثغرات الويب واختراق المواقع وحلها عملياً في معامل مجانية تماماً.",
        url: "https://portswigger.net/web-security"
      }
    ]
  },
  {
    id: "specialization",
    phaseNumber: "6",
    title: "المرحلة السادسة: التخصص والتقدم (Specialization & Advancement)",
    description: "الحوسبة السحابية المتقدمة، البرمجة وأتمتة المهام، والتعرف على بقية التخصصات المتاحة لتحديد مسارك النهائي.",
    accent: "emerald",
    subtopics: [
      { id: "spec_cloud", text: "فهم مفاهيم الحوسبة السحابية (IaaS, PaaS, SaaS) والخدمات السحابية" },
      { id: "spec_python", text: "تعلم أساسيات البرمجة بلغة بايثون (Python)" },
      { id: "spec_ps", text: "كتابة سكربتات أتمتة باستخدام باورشيل (PowerShell)" },
      { id: "spec_others", text: "استكشاف مجالات وتخصصات الـ IT الأخرى (DevOps, SRE, SysAdmin)" }
    ],
    resources: [
      {
        id: "res_spec_aws",
        title: "AWS Certified Cloud Practitioner Course",
        type: "video",
        lang: "en",
        platform: "YouTube",
        desc: "كورس معتمد وشامل من FreeCodeCamp للتحضير لشهادة AWS Cloud Practitioner الأساسية في الحوسبة السحابية.",
        url: "https://www.youtube.com/watch?v=7HKot-brXFE"
      },
      {
        id: "res_spec_python",
        title: "Python for Beginners - FreeCodeCamp",
        type: "video",
        lang: "en",
        platform: "YouTube",
        desc: "كورس شامل لتعلم لغة بايثون من الصفر للمبتدئين لبناء السكربتات وأتمتة المهام الإدارية.",
        url: "https://www.youtube.com/watch?v=kqtD5dpnC-k"
      },
      {
        id: "res_spec_powershell",
        title: "PowerShell Tutorial for Beginners",
        type: "video",
        lang: "en",
        platform: "YouTube",
        desc: "سلسلة شروحات ممتازة لتعلم أساسيات PowerShell وكيفية التفاعل مع أنظمة ويندوز وأتمتة المهام بها.",
        url: "https://www.youtube.com/watch?v=kU5bS-161w4"
      }
    ]
  },
  {
    id: "kubernetes",
    phaseNumber: "7",
    title: "المرحلة السابعة: إدارة وتشغيل الحاويات (Kubernetes)",
    description: "إدارة وتوزيع الحاويات وضمان توافرها العالي في البيئات الإنتاجية الضخمة باستخدام Kubernetes و Docker.",
    accent: "cyan",
    subtopics: [
      { id: "k8s_arch", text: "فهم معمارية Kubernetes Cluster بشكل تفصيلي" },
      { id: "k8s_local", text: "إنشاء كلوستر محلي (Minikube / K3s) للتدريب" },
      { id: "k8s_objects", text: "كتابة ملفات Deployments و Services لتشغيل التطبيقات" },
      { id: "k8s_helm", text: "إدارة التطبيقات وإطلاقها باستخدام Helm Charts" }
    ],
    resources: [
      {
        id: "res_k8s_docker_ar",
        title: "Docker Tutorial - المهندس عبد أبوغزالة",
        type: "video",
        lang: "ar",
        platform: "YouTube",
        desc: "دورة ممتازة باللغة العربية تشرح أساسيات الحاويات وكيفية بناء وتشغيل البيئات البرمجية عملياً.",
        url: "https://www.youtube.com/playlist?list=PLm2M9B6tHnF63jZ6H6yP59iP1J-7g2-8C"
      },
      {
        id: "res_k8s_nana",
        title: "TechWorld with Nana DevOps Course",
        type: "video",
        lang: "en",
        platform: "YouTube",
        desc: "شرح مرئي مبسط جداً لأدوات الـ Docker و Kubernetes للمبتدئين وتوضيح سريان العمل بالـ DevOps.",
        url: "https://www.youtube.com/@TechWorldwithNana"
      },
      {
        id: "res_k8s_kodekloud",
        title: "KodeKloud DevOps Platform",
        type: "practice",
        lang: "en",
        platform: "Web",
        desc: "أقوى منصة تفاعلية تحتوي على معامل حقيقية في المتصفح لتعلم الـ Docker والـ Kubernetes والأتمتة.",
        url: "https://kodekloud.com/"
      },
      {
        id: "res_k8s_ar",
        title: "Kubernetes Course - المهندس عبد أبوغزالة",
        type: "video",
        lang: "ar",
        platform: "YouTube",
        desc: "دورة كوبيرنيتس متكاملة باللغة العربية تشرح معمارية وإدارة كتل الحاويات والتشغيل الفعلي للـ Pods.",
        url: "https://www.youtube.com/playlist?list=PL_c9Y2aJm_Uf85wP0jB4dF5Jq4yR_s8Ng"
      },
      {
        id: "res_k8s_kunal",
        title: "Kubernetes Playlist - Kunal Kushwaha",
        type: "video",
        lang: "en",
        platform: "YouTube",
        desc: "دورة مبسطة وعميقة جداً لتعلم Kubernetes كلياً من الأساسيات إلى الاحتراف مع التطبيق العملي الكامل.",
        url: "https://www.youtube.com/playlist?list=PL9gnSGHSqcnoqBXdMwUTRod4Gi3eac2Ak"
      }
    ]
  },
  {
    id: "gitops",
    phaseNumber: "8",
    title: "المرحلة الثامنة: البنية التحتية ككود والـ GitOps (GitOps & IaC)",
    description: "أتمتة بناء وإعداد خوادم وشبكات السحاب عبر الأكواد وإدارتها بمرونة باستخدام Terraform و Ansible و ArgoCD.",
    accent: "amber",
    subtopics: [
      { id: "git_tf", text: "تعلم أساسيات Terraform وإدارة الحالة (Terraform State)" },
      { id: "git_ansible", text: "أتمتة تهيئة السيرفرات وإعداد التكوينات باستخدام Ansible Playbooks" },
      { id: "git_argo", text: "إعداد ArgoCD لمزامنة أكواد Kubernetes وإجراء الـ GitOps" }
    ],
    resources: [
      {
        id: "res_git_tf_ar",
        title: "Terraform - المهندس محمد الشريف",
        type: "video",
        lang: "ar",
        platform: "YouTube",
        desc: "دليل متكامل لتصميم وإدارة البنية التحتية ككود (Infrastructure as Code) باستخدام Terraform بالعربي.",
        url: "https://www.youtube.com/playlist?list=PLCIJjtxA3eXT4O8QYm0f4u73Z9Z0lE1vJ"
      },
      {
        id: "res_git_ansible_en",
        title: "Ansible Automation - Jeff Geerling",
        type: "video",
        lang: "en",
        platform: "YouTube",
        desc: "أقوى كورس لتعلم أتمتة إدارة السيرفرات وإعداد التكوينات آلياً باستخدام Ansible من الخبير جيف جيرلينج.",
        url: "https://www.youtube.com/playlist?list=PL2_OB-tmK9Y9p2E17w58m6sFq-s15Q9_C"
      },
      {
        id: "res_git_tf_fcc",
        title: "FreeCodeCamp Terraform Course",
        type: "video",
        lang: "en",
        platform: "YouTube",
        desc: "كورس شامل وعملي لتعلم أداة Terraform للمبتدئين وتطبيقها لبناء الموارد في السحابة.",
        url: "https://www.youtube.com/watch?v=SLB_c_ayRCo"
      },
      {
        id: "res_git_argocd",
        title: "ArgoCD Docs & Getting Started",
        type: "doc",
        lang: "en",
        platform: "Web",
        desc: "التوثيق الرسمي والموقع المرجعي لتعلم أداة ArgoCD لإجراء عمليات المزامنة المستمرة (GitOps).",
        url: "https://argo-cd.readthedocs.io/"
      }
    ]
  },
  {
    id: "sre",
    phaseNumber: "9",
    title: "المرحلة التاسعة: هندسة الموثوقية والمراقبة (SRE & Observability Stack)",
    description: "الحفاظ على سرعة واستقرار السيرفرات والتطبيقات والشبكات ومتابعة حالتها الصحية على مدار الساعة باستخدام Prometheus و Grafana.",
    accent: "purple",
    subtopics: [
      { id: "sre_sli", text: "تعلم صياغة مقاييس الخدمة وحساب الموثوقية (SLIs & SLOs)" },
      { id: "sre_prom", text: "تثبيت وإعداد Prometheus لجمع مقاييس السيرفرات والشبكة" },
      { id: "sre_grafana", text: "بناء لوحات تحكم رسومية متطورة باستخدام Grafana لمراقبة الأداء" }
    ],
    resources: [
      {
        id: "res_sre_ar",
        title: "Prometheus & Grafana - DevOps in Arabic",
        type: "video",
        lang: "ar",
        platform: "YouTube",
        desc: "شرح رائع باللغة العربية لمفاهيم المراقبة الفنية للسيرفرات وجمع المقاييس ورسم لوحات المتابعة.",
        url: "https://www.youtube.com/@DevOpsArea"
      },
      {
        id: "res_sre_nana",
        title: "SRE & Monitoring - TechWorld with Nana",
        type: "video",
        lang: "en",
        platform: "YouTube",
        desc: "تبسيط مذهل لكيفية إعداد Prometheus و Grafana لمراقبة أداء التطبيقات والحاويات وشرح المقاييس.",
        url: "https://www.youtube.com/watch?v=h4Sl21mGIG8"
      },
      {
        id: "res_sre_book",
        title: "Google SRE Official Book",
        type: "doc",
        lang: "en",
        platform: "Google",
        desc: "الكتاب الأسطوري المجاني من جوجل لتعلم فلسفة وممارسات هندسة موثوقية الأنظمة الكبرى.",
        url: "https://sre.google/sre-book/table-of-contents/"
      },
      {
        id: "res_sre_grafana_crash",
        title: "Grafana Crash Course",
        type: "video",
        lang: "en",
        platform: "YouTube",
        desc: "شروحات مبسطة وعملية لربط مصادر البيانات المختلفة وبناء لوحات عرض الأداء بصرياً.",
        url: "https://www.youtube.com/watch?v=k81-pIOgZ0M"
      }
    ]
  },
  {
    id: "zerotrust",
    phaseNumber: "10",
    title: "المرحلة العاشرة: الشبكات المتقدمة والأمن الصِفري (Zero Trust Security)",
    description: "تطبيق معمارية الأمن الصِفري وبناء شبكات اتصالات مشفرة وآمنة بالكامل عن بعد لحماية أجهزة وسيرفرات المؤسسة.",
    accent: "red",
    subtopics: [
      { id: "zt_concepts", text: "فهم وتطبيق هندسة الأمن الصِفري (Zero Trust - ZTNA)" },
      { id: "zt_vpn", text: "بناء شبكة VPN مشفرة وفائقة السرعة باستخدام WireGuard/Tailscale" },
      { id: "zt_ssl", text: "إعداد Let's Encrypt لتأمين الـ Web Servers وإصدار وتجديد الشهادات" }
    ],
    resources: [
      {
        id: "res_zt_nasser",
        title: "Hussein Nasser Web Networks",
        type: "video",
        lang: "en",
        platform: "YouTube",
        desc: "قناة ممتازة جداً لتعلم خبايا شبكات الويب وتفاصيل بروتوكول HTTP والـ Reverse Proxies والـ DNS.",
        url: "https://www.youtube.com/@hnasr"
      },
      {
        id: "res_zt_tailscale",
        title: "Tailscale Zero Trust Guide",
        type: "doc",
        lang: "en",
        platform: "Tailscale",
        desc: "شروحات مذهلة ومبسطة لكيفية بناء شبكة VPN آمنة ومشفرة بالكامل لجميع أجهزتك وسيرفراتك.",
        url: "https://tailscale.com/blog/zero-trust-guide/"
      },
      {
        id: "res_zt_savill",
        title: "Zero Trust & Cloud Security - John Savill",
        type: "video",
        lang: "en",
        platform: "YouTube",
        desc: "شرح تفصيلي رائع لمفاهيم الأمن الصِفري وتأمين الهوية والولوج للأنظمة السحابية بشكل آمن.",
        url: "https://www.youtube.com/watch?v=0k5u9aL_Tiw"
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
    desc: "أداء ممتاز واستقرار عالٍ في بناء وإدارة الآلات الافتراضية (Virtual Machines) على جهازك.",
    url: "https://www.vmware.com/products/workstation-player.html"
  },
  {
    name: "Proxmox VE",
    category: "البيئة السحابية والافتراضية",
    type: "local",
    desc: "نظام تشغيل متكامل (Bare-Metal Hypervisor) لتنصيبه مباشرة على السيرفر الحقيقي وإدارته بالكامل لبناء Homelab.",
    url: "https://www.proxmox.com/en/proxmox-ve"
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
