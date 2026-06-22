# 🚀 دليل المسار المهني لمهندس الأنظمة والشبكات (IT Systems & Network Engineer)

دليل فني عملي مهيكل ومطور لتوجيه الطلاب والمهندسين من التأسيس إلى بناء البنية التحتية وإدارة السحابة والنشر الفعلي.

---

## 🛠️ أدوات النظام اليومية الأساسية (SysAdmin Essential Toolkit)
1. **PuTTY**: محاكي طرفي آمن (SSH/Telnet) للاتصال بالسيرفرات وإدارة الأجهزة برمجياً. [تحميل الأداة](https://www.chiark.greenend.org.uk/~sgtatham/putty/latest.html)
2. **Tftpd64**: خادم وعميل TFTP خفيف الوزن ومتوافق مع IPv6 لنقل أنظمة التشغيل والترقيات لأجهزة الشبكة. [تحميل الأداة](https://tftpd64.toomedim.fr/)
3. **Git for Windows**: نظام إدارة الإصدارات وتتبع التغييرات للأكواد والسكربتات وتشغيل أوامر Bash على ويندوز. [تحميل الأداة](https://gitforwindows.org/)

---

## 🗺️ مراحل خريطة الطريق المحدثة المكونة من 12 مرحلة (Roadmap Phases)

### 🖥️ المرحلة 0: أساسيات تكنولوجيا المعلومات (IT Basics & A+)
تأسيس قوي في الأجهزة، أنظمة التشغيل، وصيانة الحاسوب.
* **مواضيع الدراسة:** عتاد الكمبيوتر (Hardware)، تثبيت وإعداد أنظمة التشغيل Windows & Linux، وصيانة الأجهزة العملية.
* **المشاريع والمختبرات:**
  * *مشروع عملي:* تفكيك وتجميع جهاز كمبيوتر افتراضي وتحديد وتثبيت المكونات ونظام تشغيل مزدوج.
* **المصادر المعتمدة:**
  * كورس CompTIA A+ بالعربي - المهندس سامح رمضان: [رابط يوتيوب](https://www.youtube.com/playlist?list=PLH-n8YK76vIiDdOMRB-ylvns-_8Zl1euV)
  * CompTIA A+ Course - Professor Messer: [رابط يوتيوب](https://www.youtube.com/playlist?list=PLG49S3nxzAnnes8ZGI-OBlKEukHCX46N8)

---

### 🌐 المرحلة الأولى: الشبكات والراوترات (Networking)
بروتوكولات الاتصال، تقسيم الشبكات، وأنظمة تشغيل الراوترات المتقدمة.
* **مواضيع الدراسة:** OSI & TCP/IP، عناوين IP وتقسيم الشبكات (Subnetting & VLSM)، أجهزة سيسكو (Packet Tracer)، وتثبيت وتخصيص أنظمة OpenWrt وراوترات Zyxel/TP-Link.
* **المشاريع والمختبرات:**
  * *مشروع 1:* تصميم وتقسيم شبكة شركة ذات 3 فروع وحساب العناوين (Subnetting) برمجياً ومحاكاتها بالكامل داخل Cisco Packet Tracer.
* **المصادر المعتمدة:**
  * كورس CCNA بالعربي - أحمد نظمي: [رابط يوتيوب](https://www.youtube.com/playlist?list=PL45l-0J235g-67Lp7p30s1H749W-vB55P)
  * CCNA Course - Jeremy's IT Lab: [رابط يوتيوب](https://www.youtube.com/playlist?list=PLxbwE86jKRgMpuZuLBivzlM8s2Dk5lXBQ)

---

### 🐧 المرحلة الثانية: إدارة خوادم لينكس (Linux Server)
إدارة الخوادم باستخدام سطر الأوامر وإعداد الصلاحيات والخدمات.
* **مواضيع الدراسة:** سطر أوامر لينكس بالكامل، الصلاحيات والمستخدمين (chmod, chown)، إدارة الخدمات (systemctl, apt)، وتأمين خوادم لينكس بـ SSH Keys.
* **المشاريع والمختبرات:**
  * *مشروع عملي:* إعداد سيرفر ويب Nginx على نظام Ubuntu Server وتأمينه باستخدام جدار الحماية UFW وتفعيل مفاتيح SSH للدخول الآمن.
* **المصادر المعتمدة:**
  * كورس Linux RHCSA - عبير حسني: [رابط يوتيوب](https://www.youtube.com/playlist?list=PLLlr6jKKdyK1f8p8ajyYtXP9GxdFH7WIU)
  * Linux Server Administration - Learn Linux TV: [رابط يوتيوب](https://www.youtube.com/playlist?list=PLT98CRl2KxKHKd_tH3ssq0HPrThx2hESW)

---

### 🪟 المرحلة الثالثة: خوادم ويندوز والـ Active Directory
إدارة بيئات ويندوز سيرفر، بناء الدليل النشط، وتطبيق سياسات الأمن.
* **مواضيع الدراسة:** تثبيت وإعداد نظام Windows Server، بناء وإعداد خادم الدليل النشط (Active Directory AD)، تطبيق سياسات المجموعة الأمنية (GPOs)، وربط الأجهزة بالدومين.
* **المشاريع والمختبرات:**
  * *مشروع 2:* تثبيت نسخة ويندوز سيرفر محلية، إعداد خادم الدليل النشط (AD Domain Controller)، وتطبيق سياسات مجموعة (GPOs) هرمية على أقسام الشركة.
* **المصادر المعتمدة:**
  * ويندوز سيرفر بالعربي - محمد الطناني: [رابط يوتيوب](https://www.youtube.com/playlist?list=PLLlr6jKKdyK1llkvqlu4DSqtYN46fQo92)
  * Active Directory & IT Support - Kevtech: [رابط يوتيوب](https://www.youtube.com/playlist?list=PLdh13bXVc6-k_u2RPqYAp8R8HtYT_ONht)

---

### ☁️ المرحلة الرابعة: الافتراضية والخدمات (Virtualization)
إدارة الأنظمة الافتراضية وخوادم قواعد البيانات والويب.
* **مواضيع الدراسة:** الافتراضية والـ Hypervisors (VMware, Hyper-V, Proxmox)، خوادم الويب وقواعد البيانات (Nginx, Apache, SQL)، وإنشاء خوادم افتراضية سحابية (EC2 / VMs).
* **المشاريع والمختبرات:**
  * *مشروع عملي:* بناء بيئة افتراضية متكاملة باستخدام Proxmox VE تشمل خادم ويب وخادم قاعدة بيانات SQL مع إعداد مصفوفة RAID 1 للتخزين.
* **المصادر المعتمدة:**
  * شرح الحوسبة السحابية و Azure - محمد زهدي: [رابط يوتيوب](https://www.youtube.com/playlist?list=PLDxVq3TlR9y3D61tEq4BbRZ8f5bv2_PFt)
  * Azure & Virtualization Fundamentals - John Savill: [رابط يوتيوب](https://www.youtube.com/playlist?list=PLlVtbbG169nED0_vMEniWBQjSoxTsBYS3)

---

### 🛡️ المرحلة الخامسة: الأمن السيبراني (Cyber Security)
تأمين وحماية الشبكات والأنظمة وإدارة الهوية والتشفير.
* **مواضيع الدراسة:** مبادئ الأمن السيبراني (CIA Triad)، إعداد وتكوين جدران الحماية (Firewalls & IDS/IPS)، التشفير، وإدارة الوصول والمخاطر.
* **المشاريع والمختبرات:**
  * *مشروع عملي:* إعداد جدار حماية PfSense للتحكم في حركة المرور، تشغيل نظام كشف التسلل Snort، وحل ثغرات أمنية في معامل PortSwigger.
* **المصادر المعتمدة:**
  * كورس Cyber Security Crash Course بالعربي - Free4Arab: [رابط يوتيوب](https://www.youtube.com/playlist?list=PLLlr6jKKdyK31rHcvCI-oafO6D7hG2Ot4)
  * Practical Ethical Hacking Course - TCM Security: [رابط يوتيوب](https://www.youtube.com/watch?v=3FNYvj2U0HM)

---

### 🚀 المرحلة السادسة: الأتمتة والسحابة (Scripting & Cloud)
كتابة سكربتات الأتمتة وإدارة الخدمات السحابية الأساسية.
* **مواضيع الدراسة:** أساسيات بايثون (Python) للسكربتات والأتمتة، أتمتة ويندوز بـ PowerShell، والحوسبة السحابية لشهادة AWS Cloud Practitioner.
* **المشاريع والمختبرات:**
  * *مشروع عملي:* كتابة سكربت PowerShell لمراقبة استهلاك الموارد للسيرفرات وإرسال تنبيهات بريدية آلياً، وسكربت Python لأتمتة النسخ الاحتياطي.
* **المصادر المعتمدة:**
  * تعلم لغة بايثون للأنظمة - الزيرو ويب سكول: [رابط يوتيوب](https://www.youtube.com/playlist?list=PLDoPjvoNmBAyE_gei5d18qkfIe-Z8mSry)
  * AWS Cloud Practitioner Course - FreeCodeCamp: [رابط يوتيوب](https://www.youtube.com/watch?v=7HKot-brXFE)

---

### 📦 المرحلة السابعة: الحاويات و Kubernetes
بناء وتشغيل وإدارة الحاويات السحابية وتوزيع الخدمات.
* **مواضيع الدراسة:** بناء الحاويات باستخدام Docker، معمارية وإعداد كلوستر Kubernetes، ونشر وإدارة الحزم بـ Helm.
* **المشاريع والمختبرات:**
  * *مشروع عملي:* تحويل تطبيق ويب إلى حاوية Docker ورفعه على Docker Hub، ثم نشره وإدارته داخل كلوستر Kubernetes محلي باستخدام Helm.
* **المصادر المعتمدة:**
  * دورة دوكر وكوبيرنيتس بالعربي - عبد أبوغزالة: [رابط يوتيوب](https://www.youtube.com/playlist?list=PLm2M9B6tHnF63jZ6H6yP59iP1J-7g2-8C)
  * Kubernetes Tutorial - TechWorld with Nana: [رابط يوتيوب](https://www.youtube.com/watch?v=X48VuDVv0do)

---

### 🔄 المرحلة الثامنة: البنية التحتية ككود والـ GitOps
إدارة البنية التحتية من خلال الأكواد وتفعيل دورة المزامنة التلقائية.
* **مواضيع الدراسة:** إدارة البنية ككود (Terraform)، أتمتة تكوين السيرفرات (Ansible)، وتطبيق دورة الـ GitOps والمزامنة (ArgoCD).
* **المشاريع والمختبرات:**
  * *مشروع عملي:* كتابة أكواد Terraform لبناء خادم سحابي شبكي، وكتابة Ansible Playbooks لتهيئة الخادم وتثبيت الخدمات تلقائياً.
* **المصادر المعتمدة:**
  * شرح أداة Terraform بالعربي - محمد الشريف: [رابط يوتيوب](https://www.youtube.com/playlist?list=PLCIJjtxA3eXT4O8QYm0f4u73Z9Z0lE1vJ)
  * Ansible 101 Course - Jeff Geerling: [رابط يوتيوب](https://www.youtube.com/playlist?list=PL2_OB-tmK9Y9p2E17w58m6sFq-s15Q9_C)

---

### 📊 المرحلة التاسعة: المراقبة والموثوقية (SRE)
متابعة الحالة الصحية للسيرفرات وبناء لوحات المتابعة وقياس مستوى الخدمة.
* **مواضيع الدراسة:** صياغة مؤشرات الخدمة (SLIs & SLOs)، جمع مقاييس أداء النظام (Prometheus)، وبناء لوحات التحكم ورصد البيانات (Grafana).
* **المشاريع والمختبرات:**
  * *مشروع عملي:* تثبيت Prometheus لجمع مقاييس أداء السيرفرات وربطه بـ Grafana لتصميم لوحة تحكم حية تعكس حالة النظام والذاكرة.
* **المصادر المعتمدة:**
  * كورس Prometheus & Grafana بالعربي - DolfinED: [رابط يوتيوب](https://www.youtube.com/watch?v=L-dDeZjZUiA)
  * Prometheus & Grafana Setup - TechWorld with Nana: [رابط يوتيوب](https://www.youtube.com/watch?v=h4Sl21mGIG8)

---

### 🛡️ المرحلة العاشرة: الأمن الصِفري (Zero Trust)
تطبيق معمارية الأمن الصِفري وتأمين شبكة الاتصالات والولوج للسيرفرات.
* **مواضيع الدراسة:** مفهوم الأمن الصِفري ومنع الثقة الافتراضية، بناء شبكات VPN مشفرة (WireGuard)، وإعداد بوابات الويب الآمنة والـ Reverse Proxies.
* **المشاريع والمختبرات:**
  * *مشروع عملي:* بناء شبكة VPN مشفرة للربط بين أجهزة الشركة وسيرفراتها عن بعد باستخدام WireGuard مع تطبيق سياسة التحقق الصفرية (Zero Trust).
* **المصادر المعتمدة:**
  * تأمين الشبكات والاتصال الآمن - قناة هارفارد عربي: [رابط يوتيوب](https://www.youtube.com/watch?v=N6O3qw9QyqU)
  * Web Networks & Security - Hussein Nasser: [رابط يوتيوب](https://www.youtube.com/playlist?list=PLQnljOFTspQUBSgBXilKhRMJ1ACqr7pTr)

---

### ☁️ المرحلة الحادية عشرة: استضافة ونشر الخدمات السحابية (Cloud Deployment)
استضافة ونشر تطبيقات الويب، قواعد البيانات، وإدارة بيئات الإنتاج السحابية الحديثة.
* **مواضيع الدراسة:** نشر الخدمات الثابتة (Vercel & Netlify)، استضافة خوادم الخلفية وقواعد البيانات (Railway)، تكامل الخدمات مع Firebase، وإعداد النطاقات وشهادات SSL.
* **المشاريع والمختبرات:**
  * *مشروع عملي:* استضافة وتأمين لوحة تحكم الـ IT الخاصة بك ونشرها على Vercel مع ربطها بقاعدة بيانات سحابية مستضافة على Railway.
* **المصادر المعتمدة:**
  * شرح نشر وتطوير خوادم الويب السحابية - يوتيوب: [رابط يوتيوب](https://www.youtube.com/watch?v=2H-L7S6yX7w)
  * Modern Web Deployment & Firebase - Net Ninja: [رابط يوتيوب](https://www.youtube.com/watch?v=sBws8MSXN7A)
