import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Play, RefreshCw, CheckCircle2, AlertCircle, Terminal, 
  FileCode, GitFork, ArrowRight, Award, Cpu, Server, ShieldCheck
} from "lucide-react";

const PIPELINE_TEMPLATES = {
  basic: {
    title: "Simple Build & Test (الافتراضي)",
    yaml: `# .github/workflows/main.yml
name: CI Pipeline
on: [push]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        run: git checkout
      - name: Install Dependencies
        run: npm install
  
  test:
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Run Unit Tests
        run: npm run test:unit
      - name: Run Linter
        run: npm run lint
`,
    stages: [
      { name: "Build", tasks: ["Checkout Code", "Install Dependencies"], status: "idle" },
      { name: "Test", tasks: ["Run Unit Tests", "Run Linter"], status: "idle" }
    ],
    broken: false
  },
  deploy_broken: {
    title: "مهمة إخفاق: Docker Deploy (عطل مفتاح API)",
    yaml: `# .github/workflows/deploy.yml
name: CD Pipeline
on: [push]

jobs:
  build:
    steps:
      - name: Build Docker Image
        run: docker build -t web-app .
  
  deploy:
    needs: build
    steps:
      - name: Authenticate Cloud Provider
        run: login --token \${{ secrets.DEPLOY_API_KEY }}
      - name: Push to Production
        run: deploy --env=production
`,
    stages: [
      { name: "Build", tasks: ["Build Docker Image"], status: "idle" },
      { name: "Deploy", tasks: ["Authenticate Cloud Provider", "Push to Production"], status: "idle" }
    ],
    broken: true,
    failReason: "❌ خطأ في خطوة 'Authenticate Cloud Provider': لم يتم العثور على سر DEPLOY_API_KEY. يرجى تهيئة المتغيرات السرية في المستودع.",
    solution: "DEPLOY_API_KEY"
  },
  gitops: {
    title: "Kubernetes GitOps (متقدم)",
    yaml: `# .github/workflows/gitops.yml
name: GitOps Deployment
on: [push]

jobs:
  lint-yaml:
    steps:
      - name: Validate Kubernetes Manifests
        run: kubeval manifests/
  
  security-scan:
    needs: lint-yaml
    steps:
      - name: Run Trivy Scan
        run: trivy image app:latest
  
  gitops-sync:
    needs: security-scan
    steps:
      - name: ArgoCD Sync Manifests
        run: argocd app sync ninja-app
`,
    stages: [
      { name: "Lint Manifests", tasks: ["Validate Kubernetes Manifests"], status: "idle" },
      { name: "Security Scan", tasks: ["Run Trivy Scan"], status: "idle" },
      { name: "GitOps Sync", tasks: ["ArgoCD Sync Manifests"], status: "idle" }
    ],
    broken: false
  }
};

export default function PipelineVisualizer() {
  const [selectedTemplate, setSelectedTemplate] = useState("basic");
  const [yamlCode, setYamlCode] = useState(PIPELINE_TEMPLATES.basic.yaml);
  const [stages, setStages] = useState(PIPELINE_TEMPLATES.basic.stages);
  const [isRunning, setIsRunning] = useState(false);
  const [currentStageIdx, setCurrentStageIdx] = useState(-1);
  const [logs, setLogs] = useState(["🖥️ جاهز لبدء النشر..."]);
  const [pipelineSuccess, setPipelineSuccess] = useState(null); // null, true, false
  const [xpEarned, setXpEarned] = useState(false);

  useEffect(() => {
    // Reset states when template changes
    const template = PIPELINE_TEMPLATES[selectedTemplate];
    setYamlCode(template.yaml);
    setStages(JSON.parse(JSON.stringify(template.stages)));
    setIsRunning(false);
    setCurrentStageIdx(-1);
    setPipelineSuccess(null);
    setLogs([`📂 تم تحميل سيناريو: ${template.title}`, "🖥️ جاهز لتشغيل خطوط الأنابيب (Run Pipeline)..."]);
  }, [selectedTemplate]);

  const addLog = (msg) => {
    setLogs(prev => [...prev, msg]);
  };

  const handleRunPipeline = async () => {
    if (isRunning) return;
    setIsRunning(true);
    setPipelineSuccess(null);
    setCurrentStageIdx(0);
    setLogs(["🚀 بدء تشغيل خط الأنابيب CI/CD...", "🛠️ جاري تهيئة بيئة تشغيل الوكيل (Agent Runner)..."]);

    const template = PIPELINE_TEMPLATES[selectedTemplate];
    const currentStages = JSON.parse(JSON.stringify(template.stages));
    setStages(currentStages);

    // Simulate stage by stage
    for (let i = 0; i < currentStages.length; i++) {
      setCurrentStageIdx(i);
      currentStages[i].status = "running";
      setStages([...currentStages]);
      addLog(`▶️ جاري تشغيل المرحلة: ${currentStages[i].name}...`);

      // Simulate tasks
      for (const t of currentStages[i].tasks) {
        await new Promise(resolve => setTimeout(resolve, 800));
        addLog(`  ⚙️ تنفيذ الخطوة: ${t}`);
      }

      // Check if this template is broken and we are on the broken stage
      const isDeployBrokenScenario = selectedTemplate === "deploy_broken";
      const isLastStage = i === currentStages.length - 1;
      
      // Check if user solved it by writing the API key in the yaml
      const userFixedIt = yamlCode.includes("DEPLOY_API_KEY:") || yamlCode.includes("DEPLOY_API_KEY =") || yamlCode.includes("DEPLOY_API_KEY: 'secret_value'") || yamlCode.includes("DEPLOY_API_KEY:");

      if (isDeployBrokenScenario && isLastStage && !userFixedIt) {
        // Failed!
        currentStages[i].status = "failed";
        setStages([...currentStages]);
        addLog(template.failReason);
        addLog("🛑 فشل خط الأنابيب (Build Failed)!");
        setPipelineSuccess(false);
        setIsRunning(false);
        return;
      }

      currentStages[i].status = "success";
      setStages([...currentStages]);
      addLog(`✅ اكتملت المرحلة: ${currentStages[i].name} بنجاح.`);
    }

    addLog("🎉 اكتمل خط أنابيب النشر بنجاح! تم دفع التحديثات إلى السيرفر (Deploy Complete)!");
    setPipelineSuccess(true);
    setIsRunning(false);
    
    // Trigger confetti & reward XP if solved broken scenario
    if (selectedTemplate === "deploy_broken" && !xpEarned) {
      setXpEarned(true);
      window.dispatchEvent(new CustomEvent("trigger-confetti"));
    }
  };

  const handleFixCode = () => {
    // Inject the fix helper
    setYamlCode(prev => prev.replace(
      `Authenticate Cloud Provider`,
      `Authenticate Cloud Provider
        env:
          DEPLOY_API_KEY: 'ninja_secret_secure_key_2026'`
    ));
    addLog("💡 تم إدخال مفتاح الـ API المفقود للمستودع! اضغط 'Run Pipeline' للتحقق من الحل.");
  };

  return (
    <div id="pipeline-visualizer" className="glass-card rounded-2xl p-6 flex flex-col gap-6 shadow-lg text-right scroll-mt-28">
      {/* Header */}
      <div className="border-b border-slate-800 pb-3 flex justify-between items-center flex-row-reverse flex-wrap gap-2">
        <div>
          <h3 className="font-extrabold text-sm text-slate-100 flex items-center justify-start gap-2 flex-row-reverse">
            <GitFork className="w-5 h-5 text-cyan-400" />
            محاكي أنابيب النشر الآلي (DevOps CI/CD Pipeline Visualizer)
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            مختبر مرئي وتفاعلي لتكوين وتشغيل ملفات YAML لإدارة تدفق العمليات البرمجية حتى النشر.
          </p>
        </div>
        
        {/* Template selector */}
        <div className="flex items-center gap-2 flex-row-reverse">
          <span className="text-[10px] text-slate-400 font-bold">السيناريو:</span>
          <select
            value={selectedTemplate}
            onChange={(e) => setSelectedTemplate(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-slate-300 hover:border-cyan-500/30 transition-colors cursor-pointer font-bold"
          >
            {Object.keys(PIPELINE_TEMPLATES).map(key => (
              <option key={key} value={key}>{PIPELINE_TEMPLATES[key].title}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: YAML Configuration Editor */}
        <div className="lg:col-span-6 flex flex-col gap-3">
          <div className="flex justify-between items-center flex-row-reverse">
            <span className="text-[10px] text-slate-400 font-extrabold flex items-center gap-1.5 flex-row-reverse">
              <FileCode className="w-3.5 h-3.5 text-cyan-400" />
              تكوين ملف الأنابيب (.github/workflows/main.yml)
            </span>
            {selectedTemplate === "deploy_broken" && (
              <button 
                onClick={handleFixCode}
                className="bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/20 px-2 py-0.5 rounded text-[8px] font-bold transition-all cursor-pointer"
              >
                تلقين الحل التلقائي
              </button>
            )}
          </div>
          
          <textarea
            value={yamlCode}
            onChange={(e) => setYamlCode(e.target.value)}
            className="bg-slate-950/90 border border-slate-850 rounded-xl p-4 font-mono text-[10px] text-cyan-300 h-80 focus:ring-1 focus:ring-cyan-500/30 outline-none leading-relaxed text-left"
            style={{ direction: "ltr" }}
          />
        </div>

        {/* Right Side: Visual flow */}
        <div className="lg:col-span-6 flex flex-col gap-4">
          <div className="flex justify-between items-center flex-row-reverse">
            <span className="text-[10px] text-slate-400 font-extrabold flex items-center gap-1.5 flex-row-reverse">
              <Cpu className="w-3.5 h-3.5 text-purple-400" />
              المخطط البصري لمراحل النشر (Pipeline Diagram)
            </span>
            <button
              onClick={handleRunPipeline}
              disabled={isRunning}
              className={`px-4 py-1.5 rounded-lg text-xs font-black flex items-center gap-1.5 transition-all flex-row-reverse cursor-pointer ${
                isRunning 
                  ? "bg-slate-800 text-slate-500 border border-slate-750 cursor-not-allowed" 
                  : "bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.15)]"
              }`}
            >
              {isRunning ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
              {isRunning ? "جاري تشغيل خط الأنابيب..." : "تشغيل خط الأنابيب (Run)"}
            </button>
          </div>

          {/* Visual Stages Box */}
          <div className="bg-slate-950 border border-slate-850 p-5 rounded-xl h-80 flex flex-col justify-center items-center gap-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-radial-gradient from-cyan-500/5 to-transparent pointer-events-none" />
            
            <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8 z-10 w-full justify-center">
              {stages.map((stage, idx) => {
                const isActive = idx === currentStageIdx;
                const isSuccess = stage.status === "success";
                const isFailed = stage.status === "failed";
                const isPending = stage.status === "idle";

                return (
                  <React.Fragment key={stage.name}>
                    {/* Stage Card */}
                    <div className={`p-4 rounded-xl border w-40 flex flex-col gap-2 transition-all relative ${
                      isActive 
                        ? "bg-cyan-500/10 border-cyan-500 text-cyan-400 scale-105 shadow-[0_0_20px_rgba(6,182,212,0.2)]" 
                        : isSuccess 
                        ? "bg-emerald-500/5 border-emerald-500/30 text-emerald-400" 
                        : isFailed 
                        ? "bg-rose-500/5 border-rose-500/30 text-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.1)]"
                        : "bg-slate-900 border-slate-800 text-slate-500"
                    }`}>
                      <div className="flex justify-between items-center flex-row-reverse">
                        <span className="text-[10px] font-black">{stage.name}</span>
                        {isSuccess && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                        {isFailed && <AlertCircle className="w-3.5 h-3.5 text-rose-400" />}
                        {isActive && <RefreshCw className="w-3.5 h-3.5 text-cyan-400 animate-spin" />}
                      </div>
                      
                      {/* Tasks lists */}
                      <div className="flex flex-col gap-1 border-t border-slate-800/80 pt-1.5">
                        {stage.tasks.map(t => (
                          <span key={t} className="text-[8px] text-right text-slate-400 block truncate">
                            ⚙️ {t}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Connecting arrows */}
                    {idx < stages.length - 1 && (
                      <ArrowRight className={`w-5 h-5 hidden md:block ${
                        isSuccess ? "text-emerald-500" : isActive ? "text-cyan-500 animate-pulse" : "text-slate-700"
                      }`} />
                    )}
                  </React.Fragment>
                );
              })}
            </div>

            {/* Overall status indicator */}
            <AnimatePresence>
              {pipelineSuccess !== null && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`mt-4 px-4 py-1.5 rounded-full text-[10px] font-extrabold flex items-center gap-1.5 flex-row-reverse border ${
                    pipelineSuccess 
                      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" 
                      : "bg-rose-500/10 border-rose-500/30 text-rose-400"
                  }`}
                >
                  {pipelineSuccess ? <ShieldCheck className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                  {pipelineSuccess ? "تمت عملية النشر والتحقق بنجاح!" : "فشل خط الأنابيب، يرجى تشخيص الأخطاء!"}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Terminal log logs bottom */}
      <div className="bg-slate-950 border border-slate-850 rounded-xl p-3 flex flex-col gap-2">
        <span className="text-[9px] text-slate-500 font-extrabold block border-b border-slate-850 pb-1.5 flex items-center justify-start gap-1 flex-row-reverse">
          <Terminal className="w-3.5 h-3.5 text-cyan-400" />
          سجل مخرجات خط الأنابيب (Runner Console Output Logs)
        </span>
        <div className="h-28 overflow-y-auto font-mono text-[9px] text-slate-350 leading-relaxed flex flex-col gap-1 text-left" style={{ direction: "ltr" }}>
          {logs.map((log, idx) => (
            <div key={idx} className={log.startsWith("❌") || log.includes("🛑") ? "text-rose-400" : log.startsWith("✅") || log.startsWith("🎉") ? "text-emerald-400" : "text-slate-300"}>
              {log}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
