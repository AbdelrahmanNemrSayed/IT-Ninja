import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Play, RefreshCw, CheckCircle2, AlertCircle, FileCode, 
  Layers, HardDrive, Cpu, Cloud, Network, ShieldCheck
} from "lucide-react";

const TEMPLATES = {
  terraform: {
    title: "Terraform - إنشاء خادم وبوابة سحابية (VPC & EC2)",
    code: `# main.tf
resource "aws_vpc" "ninja_vpc" {
  cidr_block = "10.0.0.0/16"
}

resource "aws_subnet" "public" {
  vpc_id     = aws_vpc.ninja_vpc.id
  cidr_block = "10.0.1.0/24" # تحدي: لا تجعله يتداخل مع الشبكة الفرعية الخاصة!
}

resource "aws_instance" "web" {
  ami           = "ami-0c55b159cbfafe1f0"
  instance_type = "t2.micro"
  subnet_id     = aws_subnet.public.id
}
`,
    brokenCode: `# main.tf
resource "aws_vpc" "ninja_vpc" {
  cidr_block = "10.0.0.0/16"
}

resource "aws_subnet" "public" {
  vpc_id     = aws_vpc.ninja_vpc.id
  cidr_block = "10.0.0.0/16" # عطل: تداخل CIDR! يجب أن يكون أصغر، مثل 10.0.1.0/24
}

resource "aws_instance" "web" {
  ami           = "ami-0c55b159cbfafe1f0"
  instance_type = "t2.micro"
  subnet_id     = aws_subnet.public.id
}
`,
    nodes: [
      { id: "vpc", name: "AWS VPC (10.0.0.0/16)", type: "vpc", active: false },
      { id: "subnet", name: "Public Subnet", type: "subnet", active: false },
      { id: "ec2", name: "Web Server (EC2)", type: "ec2", active: false }
    ],
    failReason: "❌ خطأ في استدعاء Terraform Apply: خطأ تداخل قناع CIDR الفرعي (aws_subnet.public) مع شبكة VPC الرئيسية (aws_vpc.ninja_vpc). يرجى تصحيح نطاق العناوين."
  },
  ansible: {
    title: "Ansible - تثبيت خادم Nginx للموقع",
    code: `# playbook.yml
- name: Configure Web Servers
  hosts: webservers
  become: yes
  tasks:
    - name: Install Nginx package
      apt:
        name: nginx
        state: present
    - name: Start and enable nginx service
      service:
        name: nginx
        state: started
        enabled: yes
`,
    brokenCode: `# playbook.yml
- name: Configure Web Servers
  hosts: webservers
  become: no # عطل: يحتاج صلاحية root لتثبيت الحزم! اجعلها become: yes
  tasks:
    - name: Install Nginx package
      apt:
        name: nginx
        state: present
`,
    nodes: [
      { id: "host", name: "Remote Web Server", type: "server", active: false },
      { id: "apt", name: "Nginx Package", type: "pkg", active: false },
      { id: "service", name: "Nginx Service Running", type: "service", active: false }
    ],
    failReason: "❌ خطأ في تشغيل Ansible Playbook: صلاحيات غير كافية (Permission Denied). تعذر تشغيل مدير الحزم apt بدون صلاحيات become: yes."
  }
};

export default function IaCVisualBuilder() {
  const [selectedTool, setSelectedTool] = useState("terraform");
  const [code, setCode] = useState(TEMPLATES.terraform.brokenCode);
  const [nodes, setNodes] = useState(TEMPLATES.terraform.nodes);
  const [status, setStatus] = useState("idle"); // idle, planning, applying, success, failed
  const [logs, setLogs] = useState(["🖥️ جاهز لتخطيط البنية التحتية..."]);
  const [xpEarned, setXpEarned] = useState(false);

  useEffect(() => {
    const template = TEMPLATES[selectedTool];
    setCode(template.brokenCode);
    setNodes(JSON.parse(JSON.stringify(template.nodes)));
    setStatus("idle");
    setLogs([`📂 تم تحميل التحدي: ${template.title}`, "🖥️ أدخل الكود واضغط Plan لبدء المحاكاة."]);
  }, [selectedTool]);

  const addLog = (msg) => {
    setLogs(prev => [...prev, msg]);
  };

  const handlePlanApply = async () => {
    if (status === "planning" || status === "applying") return;
    
    setStatus("planning");
    setLogs(["🔍 جاري فحص صياغة ملف التكوين (IaC Linting)..."]);
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Check if code contains the correct values
    const isTerraform = selectedTool === "terraform";
    const template = TEMPLATES[selectedTool];
    
    let isFixed = false;
    if (isTerraform) {
      // Must not be 10.0.0.0/16 for subnet, should be 10.0.1.0/24 or something different
      isFixed = code.includes("10.0.1.0/24") || code.includes("10.0.2.0/24");
    } else {
      // Ansible: become must be yes
      isFixed = code.includes("become: yes") || code.includes("become: true");
    }

    addLog("📋 كود التكوين صالح نحوياً. جاري إنشاء خطة النشر (Execution Plan)...");
    await new Promise(resolve => setTimeout(resolve, 1000));

    setStatus("applying");
    addLog("🚀 بدء تهيئة الموارد السحابية (Applying infrastructure configuration)...");

    const updatedNodes = JSON.parse(JSON.stringify(nodes));

    // Animate node creation step by step
    for (let i = 0; i < updatedNodes.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (!isFixed && i === updatedNodes.length - 1) {
        // Fail at the final step if not fixed
        updatedNodes[i].active = "failed";
        setNodes([...updatedNodes]);
        addLog(template.failReason);
        setStatus("failed");
        return;
      }

      updatedNodes[i].active = "success";
      setNodes([...updatedNodes]);
      addLog(`✨ تم إنشاء/تكوين المورد بنجاح: ${updatedNodes[i].name}`);
    }

    addLog("🎉 تمت عملية النشر والتحديث بنجاح! جميع الموارد جاهزة للعمل.");
    setStatus("success");

    if (!xpEarned) {
      setXpEarned(true);
      window.dispatchEvent(new CustomEvent("trigger-confetti"));
    }
  };

  const handleSolveAutomatic = () => {
    const template = TEMPLATES[selectedTool];
    setCode(template.code);
    addLog("💡 تم تطبيق الحل الصحيح تلقائياً! اضغط 'Apply / Plan' لتنفيذه.");
  };

  return (
    <div id="iac-builder" className="glass-card rounded-2xl p-6 flex flex-col gap-6 shadow-lg text-right scroll-mt-28">
      {/* Header */}
      <div className="border-b border-slate-800 pb-3 flex justify-between items-center flex-row-reverse flex-wrap gap-2">
        <div>
          <h3 className="font-extrabold text-sm text-slate-100 flex items-center justify-start gap-2 flex-row-reverse">
            <Cloud className="w-5 h-5 text-purple-400" />
            مصمم البنية التحتية ككود (Ansible & Terraform IaC Visual Builder)
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            اكتب وعدل تكوينات السحابة والتحكم بالسيرفرات، وشاهد البناء والمستندات الرسومية للموارد تلقائياً.
          </p>
        </div>

        {/* Tool selector */}
        <div className="flex items-center gap-2 flex-row-reverse">
          <span className="text-[10px] text-slate-400 font-bold">الأداة:</span>
          <select
            value={selectedTool}
            onChange={(e) => setSelectedTool(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-slate-330 hover:border-purple-500/30 transition-colors cursor-pointer font-bold"
          >
            <option value="terraform">Terraform (السحاب)</option>
            <option value="ansible">Ansible (إدارة السيرفرات)</option>
          </select>
        </div>
      </div>

      {/* Main layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Code Editor */}
        <div className="lg:col-span-6 flex flex-col gap-3">
          <div className="flex justify-between items-center flex-row-reverse">
            <span className="text-[10px] text-slate-400 font-extrabold flex items-center gap-1.5 flex-row-reverse">
              <FileCode className="w-3.5 h-3.5 text-purple-400" />
              محرر نصوص التكوين (IaC Code Editor)
            </span>
            <button 
              onClick={handleSolveAutomatic}
              className="bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/20 px-2 py-0.5 rounded text-[8px] font-bold transition-all cursor-pointer"
            >
              تلقين الحل الصحيح
            </button>
          </div>

          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="bg-slate-950 border border-slate-850 rounded-xl p-4 font-mono text-[10px] text-cyan-300 h-80 focus:ring-1 focus:ring-purple-500/30 outline-none leading-relaxed text-left"
            style={{ direction: "ltr" }}
          />
        </div>

        {/* Right Side: Graphic Canvas */}
        <div className="lg:col-span-6 flex flex-col gap-4">
          <div className="flex justify-between items-center flex-row-reverse">
            <span className="text-[10px] text-slate-400 font-extrabold flex items-center gap-1.5 flex-row-reverse">
              <Layers className="w-3.5 h-3.5 text-purple-400" />
              البنية التحتية الرسومية المستهدفة (Visual Canvas)
            </span>

            <button
              onClick={handlePlanApply}
              disabled={status === "planning" || status === "applying"}
              className={`px-4 py-1.5 rounded-lg text-xs font-black flex items-center gap-1.5 transition-all flex-row-reverse cursor-pointer ${
                status === "planning" || status === "applying"
                  ? "bg-slate-850 text-slate-500 border border-slate-800 cursor-not-allowed" 
                  : "bg-purple-500 hover:bg-purple-400 text-slate-950 shadow-[0_0_15px_rgba(139,92,246,0.15)]"
              }`}
            >
              {status === "planning" || status === "applying" ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Play className="w-3.5 h-3.5" />
              )}
              {status === "planning" ? "جاري التخطيط..." : status === "applying" ? "جاري البناء..." : "تطبيق وبناء (Apply Plan)"}
            </button>
          </div>

          {/* Visual canvas box */}
          <div className="bg-slate-950 border border-slate-850 p-5 rounded-xl h-80 flex flex-col justify-center items-center gap-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-radial-gradient from-purple-500/5 to-transparent pointer-events-none" />

            <div className="flex flex-col md:flex-row items-center gap-6 z-10 w-full justify-center">
              {nodes.map((node) => {
                const isSuccess = node.active === "success";
                const isFailed = node.active === "failed";

                let borderClass = "border-slate-800 bg-slate-900/60 text-slate-500";
                if (isSuccess) borderClass = "border-emerald-500 text-emerald-400 bg-emerald-500/5 shadow-[0_0_15px_rgba(16,185,129,0.1)]";
                if (isFailed) borderClass = "border-rose-500 text-rose-400 bg-rose-500/5 shadow-[0_0_15px_rgba(244,63,94,0.1)]";

                return (
                  <div key={node.id} className={`p-4 rounded-xl border w-36 flex flex-col items-center justify-center gap-2 transition-all ${borderClass}`}>
                    {node.type === "vpc" && <Cloud className="w-6 h-6" />}
                    {node.type === "subnet" && <Network className="w-6 h-6" />}
                    {node.type === "ec2" && <Cpu className="w-6 h-6" />}
                    {node.type === "server" && <HardDrive className="w-6 h-6" />}
                    {node.type === "pkg" && <Layers className="w-6 h-6" />}
                    {node.type === "service" && <ShieldCheck className="w-6 h-6" />}

                    <span className="text-[10px] font-black text-center">{node.name}</span>
                  </div>
                );
              })}
            </div>

            {/* Status alerts */}
            <AnimatePresence>
              {status === "success" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="px-4 py-1.5 rounded-full text-[10px] font-extrabold flex items-center gap-1.5 flex-row-reverse border bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                >
                  <CheckCircle2 className="w-4 h-4" /> البنية التحتية متطابقة وتعمل بالكامل! (+50 XP)
                </motion.div>
              )}
              {status === "failed" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="px-4 py-1.5 rounded-full text-[10px] font-extrabold flex items-center gap-1.5 flex-row-reverse border bg-rose-500/10 border-rose-500/30 text-rose-400"
                >
                  <AlertCircle className="w-4 h-4" /> فشل التحقق، راجع سجل الأخطاء.
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Terminal log output */}
      <div className="bg-slate-950 border border-slate-850 rounded-xl p-3 flex flex-col gap-2">
        <span className="text-[9px] text-slate-500 font-extrabold block border-b border-slate-850 pb-1.5 flex items-center justify-start gap-1 flex-row-reverse">
          <Layers className="w-3.5 h-3.5 text-purple-400" />
          سجل مخرجات بناء البنية التحتية (Console Output Logs)
        </span>
        <div className="h-28 overflow-y-auto font-mono text-[9px] text-slate-350 leading-relaxed flex flex-col gap-1 text-left" style={{ direction: "ltr" }}>
          {logs.map((log, idx) => (
            <div key={idx} className={log.startsWith("❌") ? "text-rose-400" : log.startsWith("✅") || log.startsWith("🎉") ? "text-emerald-400" : "text-slate-300"}>
              {log}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
