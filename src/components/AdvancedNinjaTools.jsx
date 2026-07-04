import React, { useState, memo } from "react";
import { Server, Settings, HelpCircle, Activity, Award, Copy, Check, Download, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// 1. Docker Compose templates
const dockerTemplates = {
  lamp: {
    name: "LAMP Stack (Web + DB + Admin)",
    desc: "أباتشي مع PHP وقاعدة بيانات MySQL وأداة phpMyAdmin لإدارة البيانات.",
    yaml: `version: '3.8'
services:
  web:
    image: php:8.0-apache
    container_name: apache_web
    ports:
      - "8080:80"
    volumes:
      - ./html:/var/www/html
    restart: always
  db:
    image: mysql:5.7
    container_name: mysql_db
    environment:
      MYSQL_ROOT_PASSWORD: secretpassword
      MYSQL_DATABASE: app_db
    ports:
      - "3306:3306"
    volumes:
      - db_data:/var/lib/mysql
    restart: always
  phpmyadmin:
    image: phpmyadmin:latest
    container_name: phpmyadmin_panel
    links:
      - db
    ports:
      - "8081:80"
    environment:
      PMA_HOST: db
    restart: always
volumes:
  db_data:`
  },
  wordpress: {
    name: "WordPress & MySQL",
    desc: "بيئة كاملة جاهزة لتطوير ونشر مواقع ووردبريس مع قاعدة بيانات معزولة.",
    yaml: `version: '3.8'
services:
  db:
    image: mysql:8.0
    container_name: wordpress_db
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: db_root_password
      MYSQL_DATABASE: wordpress_db
      MYSQL_USER: wp_user
      MYSQL_PASSWORD: wp_password
    volumes:
      - db_data:/var/lib/mysql
  wordpress:
    image: wordpress:latest
    container_name: wordpress_site
    restart: always
    ports:
      - "8080:80"
    environment:
      WORDPRESS_DB_HOST: db
      WORDPRESS_DB_USER: wp_user
      WORDPRESS_DB_PASSWORD: wp_password
      WORDPRESS_DB_NAME: wordpress_db
    volumes:
      - wp_data:/var/www/html
volumes:
  db_data:
  wp_data:`
  },
  monitoring: {
    name: "Prometheus & Grafana (Monitoring)",
    desc: "حزمة المراقبة الشهيرة لجمع مقاييس أداء السيرفرات وعرضها في لوحات تفاعلية.",
    yaml: `version: '3.8'
services:
  prometheus:
    image: prom/prometheus:latest
    container_name: prometheus_srv
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
    ports:
      - "9090:9090"
    restart: always
  grafana:
    image: grafana/grafana:latest
    container_name: grafana_srv
    ports:
      - "3000:3000"
    volumes:
      - grafana_data:/var/lib/grafana
    restart: always
volumes:
  grafana_data:`
  },
  nginx_mysql: {
    name: "Nginx + MySQL (Web + Database)",
    desc: "خادم Nginx عالي الأداء مع قاعدة بيانات MySQL معزولة لاستضافة تطبيقات الويب المخصصة.",
    yaml: `version: '3.8'
services:
  nginx:
    image: nginx:alpine
    container_name: nginx_web
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./html:/usr/share/nginx/html
    restart: always
    depends_on:
      - db
  db:
    image: mysql:8.0
    container_name: mysql_db
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: strong_root_pass
      MYSQL_DATABASE: app_database
      MYSQL_USER: app_user
      MYSQL_PASSWORD: app_secure_pass
    volumes:
      - mysql_data:/var/lib/mysql
    ports:
      - "3306:3306"
volumes:
  mysql_data:`
  },
  portainer: {
    name: "Portainer (Docker GUI Manager)",
    desc: "واجهة رسومية متكاملة لإدارة ومراقبة جميع حاويات Docker على السيرفر بسهولة تامة.",
    yaml: `version: '3.8'
services:
  portainer:
    image: portainer/portainer-ce:latest
    container_name: portainer
    restart: always
    security_opt:
      - no-new-privileges:true
    volumes:
      - /etc/localtime:/etc/localtime:ro
      - /var/run/docker.sock:/var/run/docker.sock:ro
      - portainer_data:/data
    ports:
      - "9000:9000"
      - "9443:9443"
volumes:
  portainer_data:`
  }
};

// 2. Quiz Questions
const quizQuestions = [
  {
    id: 1,
    cert: "ccna",
    question: "أي من البروتوكولات التالية يعمل في طبقة النقل (Transport Layer) ويضمن تسليم البيانات بشكل موثوق؟",
    options: ["IP", "UDP", "TCP", "ICMP"],
    answer: "TCP",
    explanation: "بروتوكول TCP يضمن تسليم البيانات بشكل موثوق وخالٍ من الأخطاء عبر تقنيات مثل Three-way handshake وتأكيد الاستلام (ACK)، بينما UDP غير موثوق ولكنه أسرع."
  },
  {
    id: 2,
    cert: "linux",
    question: "ما هو الأمر المستخدم لتغيير ملكية ملف أو مجلد في نظام تشغيل لينكس؟",
    options: ["chmod", "chown", "passwd", "usermod"],
    answer: "chown",
    explanation: "الأمر chown (Change Owner) يُستخدم لتعديل المالك والمجموعة الخاصة بملف أو مجلد، بينما chmod يُستخدم لتعديل أذونات القراءة والكتابة والتشغيل."
  },
  {
    id: 3,
    cert: "security",
    question: "ما هو نوع الهجوم الذي يحاول فيه المهاجم اعتراض وتعديل حركة المرور بين جهازين دون علمهما؟",
    options: ["Phishing", "Man-in-the-Middle (MitM)", "DDoS", "SQL Injection"],
    answer: "Man-in-the-Middle (MitM)",
    explanation: "هجوم رجل في المنتصف (MitM) يقوم فيه المهاجم بالتموضع في قناة الاتصال بين الضحيتين لاعتراض البيانات الحساسة أو تعديلها."
  },
  {
    id: 4,
    cert: "aws",
    question: "أي من خدمات AWS التالية تتيح لك تشغيل خوادم افتراضية قابلة للتوسع في السحابة؟",
    options: ["Amazon S3", "Amazon EC2", "Amazon RDS", "AWS Lambda"],
    answer: "Amazon EC2",
    explanation: "خدمة EC2 (Elastic Compute Cloud) توفر خوادم افتراضية قابلة للتهيئة والزيادة، بينما S3 مخصصة للتخزين السحابي و RDS لقواعد البيانات المدارة."
  }
];

const AdvancedNinjaTools = memo(function AdvancedNinjaTools() {
  const [activeTab, setActiveTab] = useState("docker");

  // Docker generator state
  const [selectedDocker, setSelectedDocker] = useState("lamp");
  const [copiedDocker, setCopiedDocker] = useState(false);

  // Nginx generator state
  const [nginxDomain, setNginxDomain] = useState("example.com");
  const [nginxPort, setNginxPort] = useState("8000");
  const [nginxType, setNginxType] = useState("proxy");
  const [copiedNginx, setCopiedNginx] = useState(false);

  // Quiz state
  const [quizIdx, setQuizIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizTotal, setQuizTotal] = useState(0);

  // Bandwidth state
  const [dataSize, setDataSize] = useState("10"); // GB
  const [bandwidth, setBandwidth] = useState("50"); // Mbps
  const [calcResult, setCalcResult] = useState("");

  const handleCopyDocker = () => {
    navigator.clipboard.writeText(dockerTemplates[selectedDocker].yaml);
    setCopiedDocker(true);
    setTimeout(() => setCopiedDocker(false), 2000);
  };

  const handleDownloadDocker = () => {
    const blob = new Blob([dockerTemplates[selectedDocker].yaml], { type: "text/yaml" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "docker-compose.yml";
    link.click();
    URL.revokeObjectURL(url);
  };

  const generateNginxConfig = () => {
    if (nginxType === "proxy") {
      return `server {
    listen 80;
    server_name ${nginxDomain} www.${nginxDomain};

    location / {
        proxy_pass http://127.0.0.1:${nginxPort};
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}`;
    } else {
      return `server {
    listen 80;
    server_name ${nginxDomain} www.${nginxDomain};
    root /var/www/${nginxDomain}/html;
    index index.html index.htm;

    location / {
        try_files $uri $uri/ =404;
    }

    # Caching headers for security & speed
    location ~* \\.(jpg|jpeg|png|gif|ico|css|js)$ {
        expires 30d;
        add_header Cache-Control "public, no-transform";
    }
}`;
    }
  };

  const handleCopyNginx = () => {
    navigator.clipboard.writeText(generateNginxConfig());
    setCopiedNginx(true);
    setTimeout(() => setCopiedNginx(false), 2000);
  };

  const submitQuiz = () => {
    if (!selectedAnswer) return;
    const currentQ = quizQuestions[quizIdx];
    const isCorrect = selectedAnswer === currentQ.answer;
    if (isCorrect) {
      setQuizScore(prev => prev + 1);
    }
    setQuizTotal(prev => prev + 1);
    setQuizSubmitted(true);
  };

  const nextQuiz = () => {
    setSelectedAnswer("");
    setQuizSubmitted(false);
    setQuizIdx((prev) => (prev + 1) % quizQuestions.length);
  };

  const calculateTransfer = () => {
    const sizeInBits = parseFloat(dataSize) * 1024 * 1024 * 1024 * 8; // GB to bits
    const speedInBits = parseFloat(bandwidth) * 1000000; // Mbps to bps
    const seconds = sizeInBits / speedInBits;

    if (isNaN(seconds) || seconds <= 0) {
      setCalcResult("يرجى إدخال قيم صحيحة.");
      return;
    }

    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    let timeStr = "";
    if (hrs > 0) timeStr += `${hrs} ساعة و `;
    if (mins > 0 || hrs > 0) timeStr += `${mins} دقيقة و `;
    timeStr += `${secs} ثانية`;

    setCalcResult(`الوقت التقريبي لنقل البيانات هو: ${timeStr}`);
  };

  const handlePrintCard = () => {
    window.print();
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-slate-900/40 backdrop-blur-md border border-purple-500/20 rounded-2xl p-6 flex flex-col gap-6 shadow-lg relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 rounded-full filter blur-3xl pointer-events-none" />
      
      <div className="border-b border-slate-800 pb-4 text-right">
        <h3 className="font-extrabold text-sm text-slate-100 flex items-center justify-start gap-2">
          <Settings className="w-5 h-5 text-purple-400" />
          نينجا التفاعلية المتقدمة (Advanced Interactive Tools Hub)
        </h3>
        <p className="text-xs text-slate-400 mt-1">
          مجموعة من الأدوات والآلات الحاسبة والمولدات لمساعدتك في العمليات والتعلم اليومي.
        </p>
      </div>

      {/* Tabs list */}
      <div className="flex gap-2 overflow-x-auto pb-1 border-b border-slate-800/80">
        {[
          { id: "docker", label: "Docker Compose", icon: <Server className="w-3.5 h-3.5" /> },
          { id: "nginx", label: "Nginx Config", icon: <Settings className="w-3.5 h-3.5" /> },
          { id: "quiz", label: "محاكي الاختبارات", icon: <HelpCircle className="w-3.5 h-3.5" /> },
          { id: "bandwidth", label: "حاسبة النقل", icon: <Activity className="w-3.5 h-3.5" /> },
          { id: "card", label: "بطاقة الإنجاز", icon: <Award className="w-3.5 h-3.5" /> }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`text-xs px-3.5 py-2 rounded-lg font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === tab.id
                ? "bg-purple-500 text-slate-950 shadow-md shadow-purple-500/20 animate-pulse"
                : "bg-slate-950 border border-slate-850 text-slate-400 hover:text-slate-200 hover:border-slate-750"
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Contents */}
      <div className="text-right">
        <AnimatePresence mode="wait">
          {activeTab === "docker" && (
            <motion.div
              key="docker"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-4"
            >
              <h4 className="font-extrabold text-sm text-slate-100 flex items-center gap-1.5 justify-start">
                <Server className="w-4 h-4 text-purple-400" />
                مولد ملفات Docker Compose التفاعلي
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                اختر نوع الخدمة التي ترغب في استضافتها، واحصل على كود Compose جاهز للتشغيل مباشرة.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <div className="w-full sm:w-1/3 flex flex-col gap-2">
                  <span className="text-xs text-slate-400 font-semibold">اختر حزمة الخدمات:</span>
                  <select
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-purple-300 focus:outline-none focus:border-purple-500 transition-colors cursor-pointer"
                    value={selectedDocker}
                    onChange={(e) => setSelectedDocker(e.target.value)}
                  >
                    {Object.entries(dockerTemplates).map(([k, v]) => (
                      <option key={k} value={k}>{v.name}</option>
                    ))}
                  </select>
                  <p className="text-[11px] text-slate-500 mt-2 leading-relaxed bg-slate-950/40 p-3 rounded-lg border border-slate-850">
                    {dockerTemplates[selectedDocker].desc}
                  </p>
                </div>

                <div className="w-full sm:w-2/3 bg-slate-950 border border-slate-850 rounded-xl overflow-hidden flex flex-col h-64">
                  <div className="bg-slate-900 px-4 py-2 border-b border-slate-850 flex justify-between items-center">
                    <span className="font-mono text-[10px] text-purple-400 font-bold">docker-compose.yml</span>
                    <div className="flex gap-2">
                      <button
                        onClick={handleCopyDocker}
                        className="text-slate-400 hover:text-purple-400 p-1 rounded hover:bg-slate-800 transition-all text-[10px] font-bold flex items-center gap-0.5"
                      >
                        {copiedDocker ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedDocker ? "تم!" : "نسخ"}</span>
                      </button>
                      <button
                        onClick={handleDownloadDocker}
                        className="text-slate-400 hover:text-purple-400 p-1 rounded hover:bg-slate-800 transition-all text-[10px] font-bold flex items-center gap-0.5"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>تحميل</span>
                      </button>
                    </div>
                  </div>
                  <pre className="p-4 font-mono text-[11px] text-slate-300 overflow-auto leading-relaxed select-text text-left" dir="ltr">
                    {dockerTemplates[selectedDocker].yaml}
                  </pre>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "nginx" && (
            <motion.div
              key="nginx"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-4"
            >
              <h4 className="font-extrabold text-sm text-slate-100 flex items-center gap-1.5 justify-start">
                <Settings className="w-4 h-4 text-purple-400" />
                مولد إعدادات خوادم Nginx
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                أنشئ ملف تهيئة مخصص لخادم الويب Nginx لدعم تحويل حركة المرور (Reverse Proxy) أو خدمة الملفات الثابتة.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <div className="w-full sm:w-1/3 flex flex-col gap-3">
                  <div className="flex flex-col gap-1">
                    <span className="text-[11px] text-slate-400 font-bold">اسم النطاق (Domain Name):</span>
                    <input
                      type="text"
                      className="bg-slate-950 border border-slate-850 rounded-lg px-3 py-2 text-xs text-slate-350 focus:outline-none focus:border-purple-500 text-left"
                      value={nginxDomain}
                      onChange={(e) => setNginxDomain(e.target.value)}
                      dir="ltr"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <span className="text-[11px] text-slate-400 font-bold">نوع الخدمة:</span>
                    <select
                      className="bg-slate-950 border border-slate-850 rounded-lg px-3 py-2 text-xs text-slate-350 focus:outline-none focus:border-purple-500 cursor-pointer"
                      value={nginxType}
                      onChange={(e) => setNginxType(e.target.value)}
                    >
                      <option value="proxy">Reverse Proxy (توجيه البورت)</option>
                      <option value="static">Static Server (ملفات ثابتة)</option>
                    </select>
                  </div>

                  {nginxType === "proxy" && (
                    <div className="flex flex-col gap-1">
                      <span className="text-[11px] text-slate-400 font-bold">منفذ الخدمة (Port):</span>
                      <input
                        type="number"
                        className="bg-slate-950 border border-slate-850 rounded-lg px-3 py-2 text-xs text-slate-350 focus:outline-none focus:border-purple-500 text-left"
                        value={nginxPort}
                        onChange={(e) => setNginxPort(e.target.value)}
                        dir="ltr"
                      />
                    </div>
                  )}
                </div>

                <div className="w-full sm:w-2/3 bg-slate-950 border border-slate-850 rounded-xl overflow-hidden flex flex-col h-64">
                  <div className="bg-slate-900 px-4 py-2 border-b border-slate-850 flex justify-between items-center">
                    <span className="font-mono text-[10px] text-purple-400 font-bold">nginx.conf</span>
                    <button
                      onClick={handleCopyNginx}
                      className="text-slate-400 hover:text-purple-400 p-1 rounded hover:bg-slate-800 transition-all text-[10px] font-bold flex items-center gap-0.5"
                    >
                      {copiedNginx ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedNginx ? "تم!" : "نسخ الكود"}</span>
                    </button>
                  </div>
                  <pre className="p-4 font-mono text-[11px] text-slate-300 overflow-auto leading-relaxed select-text text-left" dir="ltr">
                    {generateNginxConfig()}
                  </pre>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "quiz" && (
            <motion.div
              key="quiz"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-4"
            >
              <div className="flex items-center justify-between border-b border-slate-850 pb-2">
                <h4 className="font-extrabold text-sm text-slate-100 flex items-center gap-1.5 justify-start">
                  <HelpCircle className="w-4 h-4 text-purple-400" />
                  محاكي اختبارات الشهادات العالمية (IT Quiz Simulator)
                </h4>
                <div className="bg-purple-500/10 text-purple-400 text-xs px-2.5 py-0.5 rounded-full border border-purple-500/20 font-mono">
                  النتيجة: {quizScore} / {quizTotal}
                </div>
              </div>

              <div className="bg-slate-950 border border-slate-850 rounded-xl p-5 flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-extrabold uppercase bg-slate-900 border border-slate-800 text-purple-400 px-2 py-0.5 rounded-full">
                    {quizQuestions[quizIdx].cert.toUpperCase()} Exam
                  </span>
                  <span className="text-[10px] text-slate-500 font-bold">السؤال {quizIdx + 1} من {quizQuestions.length}</span>
                </div>

                <p className="text-xs text-slate-200 font-bold leading-relaxed">
                  {quizQuestions[quizIdx].question}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                  {quizQuestions[quizIdx].options.map((opt) => {
                    const isSelected = selectedAnswer === opt;
                    const showSuccess = quizSubmitted && opt === quizQuestions[quizIdx].answer;
                    const showFail = quizSubmitted && isSelected && opt !== quizQuestions[quizIdx].answer;

                    return (
                      <button
                        key={opt}
                        disabled={quizSubmitted}
                        onClick={() => setSelectedAnswer(opt)}
                        className={`text-right text-xs p-3 rounded-lg border font-semibold transition-all cursor-pointer ${
                          showSuccess
                            ? "bg-emerald-500/10 border-emerald-500 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.1)]"
                            : showFail
                            ? "bg-rose-500/10 border-rose-500 text-rose-400"
                            : isSelected
                            ? "bg-purple-500/10 border-purple-500 text-purple-400"
                            : "bg-slate-900 hover:bg-slate-850 border-slate-800 text-slate-400 hover:text-slate-200"
                        }`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>

                {quizSubmitted && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-slate-900 border border-slate-800 p-4 rounded-lg flex flex-col gap-1.5"
                  >
                    <span className="text-[11px] font-bold text-purple-400 flex items-center gap-1">
                      <Info className="w-3.5 h-3.5" />
                      التحليل والشرح العلمي:
                    </span>
                    <p className="text-[11px] text-slate-350 leading-relaxed">
                      {quizQuestions[quizIdx].explanation}
                    </p>
                  </motion.div>
                )}

                <div className="flex justify-end gap-2 border-t border-slate-900 pt-4 mt-2">
                  {quizSubmitted ? (
                    <button
                      onClick={nextQuiz}
                      className="px-4 py-2 bg-purple-500 text-slate-950 text-xs font-bold rounded-lg hover:bg-purple-400 cursor-pointer shadow-md shadow-purple-500/10"
                    >
                      السؤال التالي
                    </button>
                  ) : (
                    <button
                      onClick={submitQuiz}
                      disabled={!selectedAnswer}
                      className={`px-4 py-2 text-xs font-bold rounded-lg cursor-pointer ${
                        selectedAnswer 
                          ? "bg-purple-500 text-slate-950 hover:bg-purple-400" 
                          : "bg-slate-900 text-slate-600 border border-slate-850"
                      }`}
                    >
                      تأكيد الإجابة
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "bandwidth" && (
            <motion.div
              key="bandwidth"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-4"
            >
              <h4 className="font-extrabold text-sm text-slate-100 flex items-center gap-1.5 justify-start">
                <Activity className="w-4 h-4 text-purple-400" />
                حاسبة سرعة نقل البيانات وزمن الرفع والنسخ
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                احسب المدة الزمنية المطلوبة لنقل الملفات الاحتياطية الكبيرة وسعات التخزين بناءً على سرعة اتصال الشبكة.
              </p>

              <div className="bg-slate-950 border border-slate-850 rounded-xl p-5 flex flex-col gap-4 max-w-lg">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-[11px] text-slate-400 font-bold">حجم البيانات (GB):</span>
                    <input
                      type="number"
                      className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-350 focus:outline-none focus:border-purple-500 text-left"
                      value={dataSize}
                      onChange={(e) => setDataSize(e.target.value)}
                      dir="ltr"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <span className="text-[11px] text-slate-400 font-bold">سرعة الاتصال (Mbps):</span>
                    <input
                      type="number"
                      className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-350 focus:outline-none focus:border-purple-500 text-left"
                      value={bandwidth}
                      onChange={(e) => setBandwidth(e.target.value)}
                      dir="ltr"
                    />
                  </div>
                </div>

                <button
                  onClick={calculateTransfer}
                  className="w-full bg-purple-500 text-slate-950 py-2.5 text-xs font-bold rounded-lg hover:bg-purple-400 cursor-pointer shadow-md shadow-purple-500/10 mt-2"
                >
                  حساب الوقت التقريبي
                </button>

                {calcResult && (
                  <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-slate-900 border border-purple-500/20 text-purple-300 text-xs px-4 py-3 rounded-lg text-center font-bold mt-2"
                  >
                    {calcResult}
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === "card" && (
            <motion.div
              key="card"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-4"
            >
              <div className="flex items-center justify-between border-b border-slate-850 pb-2">
                <h4 className="font-extrabold text-sm text-slate-100 flex items-center gap-1.5 justify-start">
                  <Award className="w-4 h-4 text-purple-400" />
                  بطاقة إنجاز البطل الرقمية (Ninja Progress Card)
                </h4>
                <button
                  onClick={handlePrintCard}
                  className="px-3 py-1 bg-purple-500 text-slate-950 text-[10px] font-extrabold rounded hover:bg-purple-400 flex items-center gap-0.5 cursor-pointer shadow"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>طباعة / حفظ</span>
                </button>
              </div>

              <div id="ninja-print-card" className="bg-gradient-to-br from-slate-950 to-slate-900 border-2 border-purple-500/30 p-8 rounded-2xl flex flex-col items-center justify-center text-center gap-6 max-w-md mx-auto shadow-2xl relative overflow-hidden select-text">
                <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-full filter blur-xl" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-cyan-500/10 rounded-full filter blur-xl" />

                <div className="w-16 h-16 rounded-full bg-purple-500/10 border border-purple-500/40 flex items-center justify-center shadow-lg shadow-purple-500/5">
                  <Award className="w-8 h-8 text-purple-400" />
                </div>

                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] font-extrabold uppercase text-purple-400 tracking-widest">IT NINJA ROADMAP CERTIFICATE</span>
                  <h4 className="text-xl font-black text-slate-100">بطاقة إنجاز وتطوير مهندس المستقبل</h4>
                  <p className="text-xs text-slate-400 leading-relaxed max-w-xs mt-1">
                    تُمنح هذه البطاقة تقديراً للاجتهاد والتفوق في دراسة أساسيات ومفاهيم تكنولوجيا المعلومات وإدارة الأنظمة والـ DevOps.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 w-full bg-slate-900/60 border border-slate-850 p-4 rounded-xl">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[9px] font-bold text-slate-500">حالة المسار</span>
                    <span className="text-xs font-black text-emerald-400">تحت التطوير والتدريب</span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[9px] font-bold text-slate-500">رتبة المحارب</span>
                    <span className="text-xs font-black text-purple-400">IT Ninja Warrior</span>
                  </div>
                </div>

                <div className="flex flex-col gap-1 w-full text-right border-t border-slate-900 pt-4">
                  <div className="flex justify-between text-[11px] text-slate-450 font-semibold">
                    <span>مهارات الشبكات ولينكس</span>
                    <span>100% عملي</span>
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-450 font-semibold">
                    <span>الحاويات والأتمتة</span>
                    <span>جاهزية كاملة</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.section>
  );
});

export default AdvancedNinjaTools;
