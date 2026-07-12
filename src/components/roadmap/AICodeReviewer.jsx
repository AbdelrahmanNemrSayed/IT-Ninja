import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, Shield, Check, Copy, AlertTriangle, AlertCircle, Sparkles, RefreshCw } from "lucide-react";

const INITIAL_CODE_TEMPLATES = {
  bash: `#!/bin/bash
# سكربت لنسخ احتياطي وإرسال كلمة السر عبر الشبكة
PASSWORD="SuperSecret123"
BACKUP_DIR="/tmp/backup"
tar -czf $BACKUP_DIR/data.tar.gz /var/www/html
curl -u admin:$PASSWORD ftp://my-backup-server.local/upload -T $BACKUP_DIR/data.tar.gz
echo "تم النسخ الاحتياطي بنجاح"`,
  powershell: `# PowerShell script to retrieve system configuration
$pass = "NinjaAdminPwd!"
$secString = ConvertTo-SecureString $pass -AsPlainText -Force
$cred = New-Object System.Management.Automation.PSCredential("Administrator", $secString)
Get-WmiObject -Class Win32_OperatingSystem -Credential $cred`,
  ansible: `---
- name: Setup Web Server
  hosts: webservers
  tasks:
    - name: Install Apache web server
      apt:
        name: apache2
        state: present
    - name: Start Apache service
      service:
        name: apache2
        state: started
        enabled: yes`
};

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

async function callGeminiCodeReview(code, lang) {
  if (!GEMINI_API_KEY) throw new Error("NO_KEY");

  const prompt = `أنت مهندس أمن شبكات وأنظمة خبير (Senior DevSecOps & Security Auditor).
قم بمراجعة الكود التالي المكتوب بلغة (${lang})، وابحث عن أي ثغرات أمنية، ممارسات برمجية خاطئة، أو إعدادات غير آمنة.
الكود المراد فحصه:
\`\`\`${lang}
${code}
\`\`\`

يجب أن تقوم بالرد بصيغة JSON فقط، بدون أي نصوص تمهيدية أو ختامية، ولا تضع ردك داخل كتل كود مثل \`\`\`json.
صيغة الـ JSON المطلوبة بدقة:
{
  "score": 85,
  "status": "danger" | "warning" | "success",
  "vulns": [
    {
      "title": "عنوان الثغرة باللغة العربية",
      "desc": "شرح الثغرة ولماذا تشكل خطراً باللغة العربية",
      "fix": "طريقة الحل والإصلاح بالتفصيل باللغة العربية"
    }
  ],
  "bestPractices": [
    "نصيحة إضافية باللغة العربية لتحسين جودة الكود"
  ],
  "optimizedCode": "نسخة كاملة من الكود بعد إصلاح الثغرات وتطبيق أفضل الممارسات مع الحفاظ على نفس الوظيفة"
}`;

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

export default function AICodeReviewer() {
  const [lang, setLang] = useState("bash");
  const [code, setCode] = useState(INITIAL_CODE_TEMPLATES.bash);
  const [analyzing, setAnalyzing] = useState(false);
  const [reviewResult, setReviewResult] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleLangChange = (selectedLang) => {
    setLang(selectedLang);
    setCode(INITIAL_CODE_TEMPLATES[selectedLang]);
    setReviewResult(null);
  };

  const handleAnalyze = async () => {
    setAnalyzing(true);
    setReviewResult(null);

    if (!GEMINI_API_KEY) {
      // Simulation/Fallback Mode when API key is missing
      setTimeout(() => {
        let result = {};

        if (code.trim() === INITIAL_CODE_TEMPLATES.bash.trim()) {
          result = {
            score: 45,
            status: "danger",
            vulns: [
              {
                title: "تخزين كلمة سر مكشوفة (Hardcoded Plaintext Credentials)",
                desc: "تم العثور على كلمة مرور مكشوفة مباشرة داخل السكربت (PASSWORD=\"SuperSecret123\"). أي شخص يملك صلاحية قراءة الملف يمكنه سرقتها.",
                fix: "استخدم متغيرات البيئة (Environment Variables) أو مدير سريات مثل Vault أو AWS Secrets Manager."
              },
              {
                title: "بروتوكول FTP غير مشفر",
                desc: "يتم استخدام بروتوكول ftp:// لنقل البيانات والنسخ الاحتياطي، وهو يرسل كلمة المرور والبيانات بنصوص مكشوفة في الشبكة مما يسمح بـ Sniffing.",
                fix: "استخدم بروتوكول آمن مثل SFTP أو HTTPS."
              }
            ],
            bestPractices: [
              "أضف خيار set -e في بداية السكربت ليتوقف التنفيذ فوراً إذا فشل أي أمر، لتجنب حدوث أخطاء تراكمية."
            ],
            optimizedCode: `#!/bin/bash
# تفعيل التوقف الفوري عند حدوث أخطاء
set -euo pipefail

# استخدام متغيرات البيئة بدلاً من كتابة السريات مباشرة
FTP_USER=\${BACKUP_FTP_USER:-"admin"}
FTP_PASS=\${BACKUP_FTP_PASS} # يتم جلبها بأمان من البيئة المحيطة

BACKUP_DIR="/tmp/backup"
mkdir -p "$BACKUP_DIR"

# تشفير محتويات النسخة وحفظها
tar -czf "$BACKUP_DIR/data.tar.gz" /var/www/html

# استخدام بروتوكول SFTP الآمن بدلاً من FTP العادي
sftp "\${FTP_USER}@my-backup-server.local" <<EOF
put "$BACKUP_DIR/data.tar.gz" /upload
EOF

echo "تم النسخ الاحتياطي بأمان عبر القنوات المشفرة"`
          };
        } else if (code.trim() === INITIAL_CODE_TEMPLATES.powershell.trim()) {
          result = {
            score: 55,
            status: "warning",
            vulns: [
              {
                title: "تخزين كلمات سر في نصوص صريحة (Hardcoded Passwords)",
                desc: "تم استخدام كلمة سر واضحة $pass = \"NinjaAdminPwd!\". يسهل كشفها من خلال فحص الكود أو ملفات الـ log.",
                fix: "استخدم ملفات الاعتماد المشفرة (Get-Credential) أو Windows Credential Manager."
              },
              {
                title: "استخدم Get-CimInstance بدلاً من Get-WmiObject",
                desc: "أوامر Get-WmiObject أصبحت مهجورة في الإصدارات الحديثة من PowerShell وتعتبر بطيئة وغير آمنة.",
                fix: "استخدم أوامر Get-CimInstance البديلة والأكثر أماناً وحداثة."
              }
            ],
            bestPractices: [
              "تجنب تشغيل السكربت بصلاحيات المسؤول الكاملة إلا للضرورة القصوى وتأكد من تطبيق مبدأ الـ Least Privilege."
            ],
            optimizedCode: `# استدعاء الاعتمادات المؤمنة من الـ Credential Store
$cred = Get-Credential -UserName "Administrator" -Message "الرجاء إدخال كلمة مرور المسؤول الآمنة"

# استخدام CIM Cmdlets الحديثة والبديلة عن Get-WmiObject القديمة
Get-CimInstance -ClassName Win32_OperatingSystem -Credential $cred`
          };
        } else if (code.trim() === INITIAL_CODE_TEMPLATES.ansible.trim()) {
          result = {
            score: 90,
            status: "success",
            vulns: [],
            bestPractices: [
              "السكربت يتبع أفضل الممارسات الموثوقة. يمكنك استخدام متغيرات ديناميكية (Variables) لاسم الـ package لزيادة مرونة الاستخدام مع أنظمة التشغيل الأخرى (مثل RedHat/CentOS)."
            ],
            optimizedCode: `---
- name: Setup Web Server
  hosts: webservers
  vars:
    web_package: apache2
    web_service: apache2
  tasks:
    - name: Install web server package
      apt:
        name: "{{ web_package }}"
        state: present
    - name: Start web service
      service:
        name: "{{ web_service }}"
        state: started
        enabled: yes`
          };
        } else {
          // Custom code mock notice when no API key
          result = {
            score: 70,
            status: "warning",
            vulns: [
              {
                title: "تحذير: لم يتم تكوين مفتاح Gemini API Key",
                desc: "أنت تقوم بمراجعة كود مخصص ولكن مفتاح Gemini API غير متاح في بيئة المنصة للقيام بفحص حقيقي نشط.",
                fix: "أضف VITE_GEMINI_API_KEY في ملف .env لتفعيل الذكاء الاصطناعي لفحص كودك المخصص وحساب الثغرات ديناميكياً."
              }
            ],
            bestPractices: [
              "قم بإعداد مفتاح المطورين المجاني من Google AI Studio لتتمتع بكامل القوة التحليلية للمنصة."
            ],
            optimizedCode: code
          };
        }

        setReviewResult(result);
        setAnalyzing(false);
      }, 1500);
      return;
    }

    try {
      const result = await callGeminiCodeReview(code, lang);
      setReviewResult(result);
    } catch (err) {
      console.error("Gemini analysis error:", err);
      setReviewResult({
        score: 0,
        status: "danger",
        vulns: [
          {
            title: "فشل الاتصال بالذكاء الاصطناعي",
            desc: "حدث خطأ أثناء معالجة أو طلب الفحص من Gemini API. قد يكون هذا بسبب تنسيق الكود أو انتهاء صلاحية المفتاح.",
            fix: "تحقق من اتصالك بالإنترنت وصلاحية مفتاح VITE_GEMINI_API_KEY في ملف .env ثم حاول مجدداً."
          }
        ],
        bestPractices: [],
        optimizedCode: code
      });
    } finally {
      setAnalyzing(false);
    }
  };

  const copyOptimized = () => {
    if (!reviewResult) return;
    navigator.clipboard.writeText(reviewResult.optimizedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-900/40 backdrop-blur-md border border-cyan-500/20 rounded-2xl p-6 flex flex-col gap-6 shadow-lg text-right scroll-mt-28" id="ai-code-reviewer">
      <div className="border-b border-slate-800 pb-3 flex justify-between items-center flex-row-reverse">
        <div>
          <h3 className="font-extrabold text-sm text-slate-100 flex items-center justify-start gap-2 flex-row-reverse">
            <Sparkles className="w-5 h-5 text-cyan-400 animate-pulse" />
            فاحص ومراجع السكربتات الذكي (AI Security Code Reviewer)
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            الصق كود الـ Bash أو PowerShell أو Ansible، وسيقوم الذكاء الاصطناعي بتحليله والبحث عن الثغرات وإصلاحها فوراً.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Editor Pane */}
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center flex-row-reverse">
            <span className="text-[10px] text-slate-500 font-extrabold">محرر السكربتات</span>
            {/* Language Selector */}
            <div className="flex gap-2">
              {["bash", "powershell", "ansible"].map((l) => (
                <button
                  key={l}
                  onClick={() => handleLangChange(l)}
                  className={`px-3 py-1 text-[10px] font-bold rounded-lg cursor-pointer transition-all ${
                    lang === l
                      ? "bg-cyan-500/10 border border-cyan-500/30 text-cyan-400"
                      : "bg-slate-950 border border-slate-850 text-slate-500 hover:text-slate-300"
                  }`}
                >
                  {l.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-black/90 p-4 border border-slate-850 rounded-xl flex flex-col gap-2 relative">
            <span className="absolute top-2 left-3 text-[8px] font-mono text-slate-700">INPUT_EDITOR</span>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full h-64 bg-transparent border-none text-cyan-300 font-mono outline-none resize-none focus:ring-0 p-0 text-left text-xs leading-relaxed"
              placeholder="الصق كودك هنا للبدء..."
              style={{ direction: "ltr" }}
            />
          </div>

          <button
            onClick={handleAnalyze}
            disabled={analyzing || !code.trim()}
            className="w-full py-3 bg-cyan-550 text-slate-950 text-xs font-black rounded-xl hover:bg-cyan-450 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all flex items-center justify-center gap-2"
          >
            {analyzing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" /> جاري فحص وتحليل السكربت بالذكاء الاصطناعي...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 animate-pulse" /> فحص الكود بالذكاء الاصطناعي 🤖
              </>
            )}
          </button>
        </div>

        {/* AI Review Results Pane */}
        <div className="flex flex-col gap-3 text-right justify-start">
          <span className="text-[10px] text-slate-500 font-extrabold block">تقرير الفحص والتحليل الأمني</span>
          
          <div className="bg-slate-950/60 border border-slate-850 p-5 rounded-xl flex-1 flex flex-col justify-center min-h-[300px]">
            <AnimatePresence mode="wait">
              {analyzing ? (
                <motion.div 
                  key="analyzing"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center gap-3 py-12"
                >
                  <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin" />
                  <span className="text-[11px] text-slate-400 font-bold">جاري مراجعة الكود، البحث عن ثغرات أمنية والامتثال للممارسات الفضلى...</span>
                </motion.div>
              ) : reviewResult ? (
                <motion.div 
                  key="result"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col gap-4"
                >
                  {/* Score Card */}
                  <div className="flex justify-between items-center bg-slate-900/60 p-3 rounded-lg border border-slate-850 flex-row-reverse">
                    <div className="flex flex-col text-right">
                      <span className="text-[9px] text-slate-500 font-black">حالة أمان الكود</span>
                      <span className={`text-xs font-bold ${
                        reviewResult.status === "danger" ? "text-red-400" : reviewResult.status === "warning" ? "text-amber-400" : "text-emerald-400"
                      }`}>
                        {reviewResult.status === "danger" ? "🚨 خطر (يحتوي ثغرات)" : reviewResult.status === "warning" ? "⚠️ بحاجة لتحسينات أمنية" : "✅ آمن وممتاز"}
                      </span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-[9px] text-slate-500 font-black">تقييم الكود</span>
                      <span className={`text-lg font-black ${
                        reviewResult.score < 50 ? "text-red-400" : reviewResult.score < 80 ? "text-amber-400" : "text-emerald-400"
                      }`}>{reviewResult.score}/100</span>
                    </div>
                  </div>

                  {/* Vulnerabilities List */}
                  {reviewResult.vulns.length > 0 ? (
                    <div className="flex flex-col gap-2">
                      <span className="text-[10px] text-red-400 font-extrabold flex items-center gap-1 justify-end flex-row-reverse">
                        <AlertCircle className="w-3.5 h-3.5" /> الثغرات ونقاط الضعف المكتشفة ({reviewResult.vulns.length}):
                      </span>
                      <div className="flex flex-col gap-2.5 max-h-48 overflow-y-auto">
                        {reviewResult.vulns.map((v, i) => (
                          <div key={i} className="bg-red-500/5 border border-red-500/15 p-3 rounded-lg flex flex-col gap-1 text-right">
                            <span className="text-xs font-bold text-red-400 flex items-center justify-end gap-1 flex-row-reverse">⚠️ {v.title}</span>
                            <p className="text-[10px] text-slate-400 leading-relaxed mt-0.5">{v.desc}</p>
                            <div className="text-[9px] text-emerald-400 bg-emerald-500/5 border border-emerald-500/10 px-2 py-1 rounded mt-1.5 leading-snug">
                              🛠️ <strong>الإصلاح المقترح:</strong> {v.fix}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="bg-emerald-500/5 border border-emerald-500/15 p-4 rounded-lg text-center flex flex-col items-center gap-1">
                      <Check className="w-6 h-6 text-emerald-400" />
                      <span className="text-xs font-black text-emerald-400">كود آمن تماماً!</span>
                      <span className="text-[10px] text-slate-500">لم يتم العثور على أي ثغرات أمنية حرجة في السكربت.</span>
                    </div>
                  )}

                  {/* Best practices */}
                  {reviewResult.bestPractices.length > 0 && (
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] text-slate-400 font-bold block mb-0.5">توصيات إضافية:</span>
                      <ul className="list-disc list-inside text-[10px] text-slate-450 leading-relaxed pr-2">
                        {reviewResult.bestPractices.map((b, i) => (
                          <li key={i} className="text-right">{b}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Optimized Code Output */}
                  <div className="flex flex-col gap-2 mt-1">
                    <div className="flex justify-between items-center flex-row-reverse">
                      <span className="text-[10px] text-emerald-400 font-black">النسخة الآمنة والمحسنة المقترحة:</span>
                      <button
                        onClick={copyOptimized}
                        className="px-2.5 py-1 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 text-[10px] font-bold rounded-lg cursor-pointer transition-all flex items-center gap-1"
                      >
                        {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        {copied ? "تم النسخ" : "نسخ الكود"}
                      </button>
                    </div>
                    <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 relative">
                      <pre className="text-[10px] font-mono text-emerald-300 text-left overflow-x-auto whitespace-pre leading-relaxed" style={{ direction: "ltr" }}>
                        {reviewResult.optimizedCode}
                      </pre>
                    </div>
                  </div>

                </motion.div>
              ) : (
                <motion.div 
                  key="empty"
                  className="text-center text-slate-500 text-xs py-10"
                >
                  <AlertTriangle className="w-6 h-6 mx-auto text-slate-700 mb-2" />
                  ادخل الكود في المحرر واضغط على زر "فحص الكود" للبدء بالتحليل الأمني الفوري.
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
