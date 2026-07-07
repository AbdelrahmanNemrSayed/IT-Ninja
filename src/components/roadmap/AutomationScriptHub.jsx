import React, { useState, memo } from "react";
import { Terminal, Copy, Check, Info, Cpu } from "lucide-react";

const scripts = {
  backup_bash: {
    fileName: "backup_script.sh",
    lang: "bash",
    description: "🐧 Bash: سكربت نسخ احتياطي وضغط مجلدات تلقائي (Linux)",
    code: [
      { text: "#!/bin/bash", desc: "يحدد المترجم المستخدم لتنفيذ السكربت وهو Bash shell." },
      { text: "BACKUP_DIR=\"/var/backups\"", desc: "تعريف متغير لتحديد المجلد الذي ستحفظ فيه ملفات النسخ الاحتياطي." },
      { text: "SOURCE_DIR=\"/var/www/html\"", desc: "تحديد المجلد المصدر المراد أخذ نسخة احتياطية من ملفاته." },
      { text: "TAR_FILE=\"$BACKUP_DIR/backup_$(date +%F).tar.gz\"", desc: "اسم ملف النسخ الاحتياطي ويشمل التاريخ الحالي بشكل ديناميكي وصيغة الضغط tar.gz." },
      { text: "tar -czf \"$TAR_FILE\" \"$SOURCE_DIR\"", desc: "أمر ضغط وأرشفة المجلد المصدر وحفظه في مسار النسخ الاحتياطي." },
      { text: "find \"$BACKUP_DIR\" -type f -mtime +7 -delete", desc: "البحث عن النسخ القديمة التي مر عليها أكثر من 7 أيام وحذفها تلقائياً لتوفير المساحة." }
    ]
  },
  disk_bash: {
    fileName: "disk_monitor.sh",
    lang: "bash",
    description: "🐧 Bash: فحص مساحة القرص وإرسال بريد تحذيري (Linux)",
    code: [
      { text: "#!/bin/bash", desc: "تعريف رأس السكربت للتشغيل عبر بيئة الباش." },
      { text: "THRESHOLD=80", desc: "تحديد نسبة الامتلاء القصوى المسموح بها للقرص (80%)." },
      { text: "CURRENT_USAGE=$(df -h / | grep / | awk '{print $5}' | cut -d'%' -f1)", desc: "أمر مركب لحساب نسبة استهلاك القرص الحالي للقسم الرئيسي." },
      { text: "if [ \"$CURRENT_USAGE\" -gt \"$THRESHOLD\" ]; then", desc: "شرط للتحقق مما إذا كان الاستهلاك الحالي أكبر من النسبة المحددة." },
      { text: "  mail -s \"Disk Alert\" admin@ninja.local <<< \"Warning: Disk usage is at ${CURRENT_USAGE}%!\"", desc: "إرسال بريد إلكتروني تحذيري لمدير النظام يوضح نسبة الاستهلاك المرتفعة." },
      { text: "fi", desc: "إغلاق جملة الشرط في لغة Bash." }
    ]
  },
  ad_ps: {
    fileName: "import_users.ps1",
    lang: "powershell",
    description: "🤖 PowerShell: إنشاء حسابات مستخدمين تلقائياً من ملف CSV (Windows Server)",
    code: [
      { text: "$users = Import-Csv -Path \"C:\\employees.csv\"", desc: "استيراد ملف الـ CSV الذي يحتوي على بيانات الموظفين الجدد." },
      { text: "foreach ($user in $users) {", desc: "حلقة تكرارية للمرور على بيانات كل موظف مسجل بالملف صفاً بصف." },
      { text: "  $password = ConvertTo-SecureString $user.Password -AsPlainText -Force", desc: "تحويل كلمة المرور النصية إلى صيغة آمنة ومشفرة يقبلها نظام الويندوز." },
      { text: "  New-ADUser -Name $user.Name -SamAccountName $user.Username -AccountPassword $password -Enabled $true", desc: "أمر إنشاء حساب المستخدم الجديد في الـ Active Directory وتفعيله فوراً." },
      { text: "}", desc: "إغلاق القوس البرمجي لحلقة التكرار foreach." }
    ]
  },
  service_ps: {
    fileName: "monitor_service.ps1",
    lang: "powershell",
    description: "🤖 PowerShell: مراقبة خدمة معينة وإعادة تشغيلها تلقائياً عند التوقف",
    code: [
      { text: "$serviceName = \"w3svc\"", desc: "اسم الخدمة المراد مراقبتها (هنا خادم الويب IIS)." },
      { text: "$service = Get-Service -Name $serviceName", desc: "جلب معلومات وحالة الخدمة المحددة من نظام التشغيل." },
      { text: "if ($service.Status -ne \"Running\") {", desc: "التحقق مما إذا كانت حالة الخدمة ليست في وضع التشغيل (Running)." },
      { text: "  Start-Service -Name $serviceName", desc: "تشغيل الخدمة فوراً إذا كانت متوقفة لإعادة خادم الويب للعمل." },
      { text: "  Write-EventLog -LogName Application -Source \"Monitor\" -EntryType Warning -EventId 101 -Message \"Service $serviceName was restarted!\"", desc: "تسجيل حدث تحذيري في سجلات نظام ويندوز (Event Viewer) يوضح عملية إعادة التشغيل." },
      { text: "}", desc: "إغلاق الشرط البرمجي." }
    ]
  },
  backup_s3: {
    fileName: "s3_backup.sh",
    lang: "bash",
    description: "☁️ Bash: أخذ نسخة من قاعدة البيانات ورفعها مباشرة إلى AWS S3",
    code: [
      { text: "#!/bin/bash", desc: "رأس تشغيل السكربت عبر مترجم الباش." },
      { text: "DB_NAME=\"prod_db\"", desc: "تحديد اسم قاعدة البيانات المستهدفة لأخذ النسخة الاحتياطية منها." },
      { text: "S3_BUCKET=\"s3://my-ninja-backups/db\"", desc: "تحديد مسار واسم مخزن البيانات السحابي (S3 Bucket) في AWS." },
      { text: "BACKUP_FILE=\"/tmp/db_$(date +%F).sql.gz\"", desc: "تحديد الاسم المؤقت للملف المضغوط الناتج." },
      { text: "mysqldump -u root -psecret \"$DB_NAME\" | gzip > \"$BACKUP_FILE\"", desc: "توليد نسخة SQL كاملة لقاعدة البيانات وضغطها لتوفير سعة التخزين." },
      { text: "aws s3 cp \"$BACKUP_FILE\" \"$S3_BUCKET\"", desc: "استخدام أداة AWS CLI لرفع الملف السحابي إلى S3 بشكل آمن." },
      { text: "rm \"$BACKUP_FILE\"", desc: "تنظيف وحذف الملف المؤقت من الخادم بعد إتمام عملية الرفع." }
    ]
  },
  ansible_deploy: {
    fileName: "secure_server_setup.yml",
    lang: "yaml",
    description: "⚙️ Ansible: بلايبوك لتهيئة وتأمين خادم Ubuntu جديد وتفعيل الجدار الناري ufw",
    code: [
      { text: "- hosts: all", desc: "تحديد كافة الخوادم الجديدة المستهدفة بعملية التثبيت والتأمين." },
      { text: "  become: yes", desc: "تشغيل المهام بصلاحيات الجذر (Root/Sudo) لتثبيت الحزم وإدارة الجدار الناري." },
      { text: "  tasks:", desc: "بدء المهام المتتالية لتهيئة وتأمين النظام." },
      { text: "    - name: Update and upgrade system", desc: "مهمة تحديث النظام بالكامل لتطبيق رقع الأمان الأخيرة." },
      { text: "      apt: update_cache=yes upgrade=dist", desc: "أمر تحديث مستودعات apt وترقية جميع حزم النظام لأحدث إصدار مستقر." },
      { text: "    - name: Install security tool fail2ban", desc: "مهمة تثبيت أداة fail2ban لحماية الخادم من هجمات التخمين." },
      { text: "      apt: name=fail2ban state=present", desc: "تثبيت الأداة وتأكيد وجودها لمنع محاولات تسجيل الدخول العشوائية المتكررة." },
      { text: "    - name: Configure firewall rules", desc: "مهمة إعداد قواعد الجدار الناري لتأمين المنافذ." },
      { text: "      ufw: rule=allow port=ssh", desc: "السماح بمرور حركة اتصالات SSH (البورت 22) فقط لمنع انقطاع الاتصال بالسيرفر." },
      { text: "    - name: Enable UFW firewall", desc: "مهمة تفعيل الجدار الناري وتطبيق السياسات الافتراضية." },
      { text: "      ufw: state=enabled policy=deny", desc: "تشغيل الجدار الناري ورفض كافة الاتصالات الواردة غير المسموح بها صراحة." }
    ]
  },
  terraform_ec2: {
    fileName: "main.tf",
    lang: "hcl",
    description: "🏗️ Terraform: كود البنية التحتية لإنشاء سيرفر EC2 افتراضي على AWS",
    code: [
      { text: "provider \"aws\" { region = \"us-east-1\" }", desc: "تحديد مزود الخدمة AWS والمنطقة الجغرافية التي سيتم إنشاء الموارد فيها." },
      { text: "resource \"aws_instance\" \"ninja_server\" {", desc: "تعريف مورد جديد من نوع خادم افتراضي (EC2 Instance) وتسميته ninja_server." },
      { text: "  ami           = \"ami-0c55b159cbfafe1f0\"", desc: "تحديد معرف نظام التشغيل (AMI) وغالباً ما يكون لنسخة Ubuntu LTS." },
      { text: "  instance_type = \"t2.micro\"", desc: "تحديد مواصفات الخادم ونوع الحجم (الفئة المجانية t2.micro)." },
      { text: "  tags = { Name = \"Ninja-WebServer\" }", desc: "إضافة تسميات وسوم (Tags) لتنظيم وإدارة المورد داخل الكونسول." },
      { text: "}", desc: "إغلاق قوس تعريف مورد الخادم الافتراضي." }
    ]
  }
};

const AutomationScriptHub = memo(function AutomationScriptHub() {
  const [selectedKey, setSelectedKey] = useState("backup_bash");
  const [hoveredLine, setHoveredLine] = useState(null);
  const [copied, setCopied] = useState(false);

  const currentScript = scripts[selectedKey];

  const handleCopy = () => {
    const fullText = currentScript.code.map((line) => line.text).join("\n");
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="automation-scripts" className="bg-slate-900/60 border border-purple-500/20 rounded-xl p-5 shadow-lg backdrop-blur-md scroll-mt-28">
      <div className="flex items-center gap-2 mb-4 border-b border-slate-800 pb-3">
        <Cpu className="w-5 h-5 text-purple-400" />
        <h3 className="font-bold text-lg text-slate-100">مستودع وبنك أكواد أتمتة الأنظمة (Automation Scripting Hub)</h3>
      </div>

      <p className="text-sm text-slate-400 mb-4 leading-relaxed">
        اختر مهمة إدارية شائعة لتوليد سكربت أتمتة احترافي. مرر مؤشر الماوس (أو انقر) فوق أسطر الكود لتقرأ شرح كل دالة أو أمر بالتفصيل لتفهم كيفية عمل الأتمتة!
      </p>

      <div className="mb-4">
        <label className="text-xs text-slate-400 font-semibold block mb-1.5">اختر السيناريو البرمجي (Automation Task):</label>
        <select
          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-purple-300 focus:outline-none focus:border-purple-500 transition-colors cursor-pointer"
          value={selectedKey}
          onChange={(e) => {
            setSelectedKey(e.target.value);
            setHoveredLine(null);
          }}
        >
          {Object.entries(scripts).map(([key, value]) => (
            <option key={key} value={key}>
              {value.description}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Code View */}
        <div className="lg:col-span-2 bg-slate-950 border border-purple-500/10 rounded-lg overflow-hidden flex flex-col min-h-[220px]">
          <div className="bg-slate-900 px-4 py-2 border-b border-purple-500/10 flex justify-between items-center">
            <span className="font-mono text-xs text-purple-400 font-bold flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5" />
              {currentScript.fileName}
            </span>
            <button
              onClick={handleCopy}
              className="text-slate-400 hover:text-purple-400 hover:bg-purple-500/10 p-1.5 rounded transition-all flex items-center gap-1 text-xs"
              title="نسخ السكربت بالكامل"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400 font-semibold">تم النسخ!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>نسخ الكود</span>
                </>
              )}
            </button>
          </div>
          <div className="p-4 font-mono text-xs sm:text-sm text-slate-300 overflow-y-auto leading-relaxed flex-grow space-y-1.5 select-text">
            {currentScript.code.map((line, index) => (
              <div
                key={index}
                className={`px-2 py-1 rounded transition-all cursor-pointer ${
                  hoveredLine === index
                    ? "bg-purple-500/10 border-l-2 border-purple-500 text-purple-200"
                    : "hover:bg-slate-900 border-l-2 border-transparent"
                }`}
                onMouseEnter={() => setHoveredLine(index)}
                onMouseLeave={() => setHoveredLine(null)}
                onClick={() => setHoveredLine(index)}
              >
                <span className="text-slate-600 select-none mr-2 inline-block w-4 text-left">{index + 1}</span>
                {line.text}
              </div>
            ))}
          </div>
        </div>

        {/* Line Explainer */}
        <div className="bg-slate-950/60 border border-slate-800 rounded-lg p-4 flex flex-col justify-center min-h-[120px] text-center">
          {hoveredLine !== null ? (
            <div className="animate-fade-in flex flex-col gap-2">
              <div className="flex items-center justify-center gap-1.5 text-purple-400 font-bold text-xs">
                <Info className="w-4 h-4" />
                <span>شرح السطر {hoveredLine + 1}</span>
              </div>
              <p className="text-slate-200 text-sm leading-relaxed">
                {currentScript.code[hoveredLine].desc}
              </p>
            </div>
          ) : (
            <div className="text-slate-500 text-xs flex flex-col items-center gap-2">
              <Info className="w-6 h-6 text-slate-600 animate-bounce" />
              <span>ضع مؤشر الماوس أو انقر على أي سطر كود لعرض الشرح والتحليل الفني له هنا.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

export default AutomationScriptHub;
