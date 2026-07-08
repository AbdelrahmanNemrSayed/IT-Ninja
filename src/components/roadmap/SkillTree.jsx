import React from "react";
import { motion } from "framer-motion";
import { Lock, Unlock, Network, Terminal, Server, Shield, Award, HelpCircle } from "lucide-react";

// Nodes configuration
const SKILL_NODES = [
  {
    id: "net_basics",
    title: "أساسيات الشبكات",
    desc: "بروتوكولات IP, TCP/UDP والمصطلحات الأساسية للشبكة.",
    type: "core",
    icon: Network,
    requires: null,
    tab: "roadmap",
    scrollId: "phase-1"
  },
  {
    id: "subnetting",
    title: "حاسبة الـ Subnetting",
    desc: "مهارة تقسيم الشبكات وحساب الـ IP Subnets بنجاح.",
    type: "tool",
    icon: Network,
    requires: "net_basics",
    tab: "simulators",
    scrollId: "subnet-calculator"
  },
  {
    id: "linux_cli",
    title: "سطر أوامر لينكس",
    desc: "التعامل مع ملفات ومجلدات أنظمة التشغيل لينكس بكفاءة.",
    type: "core",
    icon: Terminal,
    requires: "net_basics",
    tab: "simulators",
    scrollId: "linux-terminal"
  },
  {
    id: "dns_resolving",
    title: "فهم واستعلامات DNS",
    desc: "مسارات وإجراء استعلامات أسماء النطاقات والـ Records.",
    type: "core",
    icon: Server,
    requires: "linux_cli",
    tab: "simulators",
    scrollId: "sysadmin-tools"
  },
  {
    id: "raid_storage",
    title: "تخزين RAID الافتراضي",
    desc: "تقنيات مصفوفات التخزين وتأمين وحساب سعات الـ RAID.",
    type: "tool",
    icon: Server,
    requires: "dns_resolving",
    tab: "simulators",
    scrollId: "raid-visualizer"
  },
  {
    id: "automation",
    title: "أتمتة السكربتات",
    desc: "أتمتة المهام اليومية باستخدام Bash / Ansible.",
    type: "core",
    icon: Terminal,
    requires: "linux_cli",
    tab: "roadmap",
    scrollId: "automation-scripts"
  },
  {
    id: "firewall_gen",
    title: "مولد جدران الحماية",
    desc: "كتابة وتطبيق قواعد حماية الشبكة (Firewall Rules).",
    type: "tool",
    icon: Shield,
    requires: "automation",
    tab: "simulators",
    scrollId: "firewall-generator"
  },
  {
    id: "security_ninja",
    title: "خبير أمن النينجا",
    desc: "المرحلة الاحترافية النهائية في تأمين الأنظمة والشبكات.",
    type: "specialization",
    icon: Award,
    requires: "firewall_gen",
    tab: "roadmap",
    scrollId: "phase-4"
  }
];

export default function SkillTree({ completedCount, navigateToTab }) {
  // Simple heuristic: skills unlock based on how many tasks user has completed
  // Completed count tracks total checkbox completions
  const isSkillUnlocked = (node) => {
    if (!node.requires) return true; // first node is always unlocked
    
    // dynamically check based on progress index
    const nodeIndex = SKILL_NODES.findIndex(n => n.id === node.id);
    // require at least index * 2 completed checkboxes to unlock subsequent nodes
    return completedCount >= nodeIndex * 2;
  };

  return (
    <div className="bg-slate-900/40 backdrop-blur-md border border-cyan-500/20 rounded-2xl p-6 flex flex-col gap-6 shadow-lg text-right scroll-mt-28" id="skill-tree">
      <div className="border-b border-slate-800 pb-3 flex justify-between items-center flex-row-reverse">
        <div>
          <h3 className="font-extrabold text-sm text-slate-100 flex items-center justify-start gap-2 flex-row-reverse">
            <Award className="w-5 h-5 text-amber-500" />
            شجرة المهارات التقنية المتفرعة (RPG Skill Tree)
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            خريطة تفاعلية لتتبع مسار تطورك التقني. تفتح المهارات تلقائياً مع استمرارك في التقدم في خريطة الطريق.
          </p>
        </div>
      </div>

      {/* Grid Layout of the tree nodes */}
      <div className="relative flex flex-col items-center gap-12 py-8 bg-slate-950/40 rounded-xl border border-slate-850 overflow-hidden">
        
        {/* Draw SVG connections background */}
        <div className="absolute inset-0 w-full h-full pointer-events-none hidden md:block">
          <svg className="w-full h-full">
            <line x1="50%" y1="60" x2="50%" y2="520" stroke="#1e293b" strokeWidth="3" />
            {/* dynamic highlighted connection line based on overall completedCount */}
            <line 
              x1="50%" 
              y1="60" 
              x2="50%" 
              y2={Math.min(520, 60 + (completedCount * 30))} 
              stroke="#06b6d4" 
              strokeWidth="3.5" 
              className="transition-all duration-1000"
            />
          </svg>
        </div>

        {/* Skill Nodes List */}
        <div className="flex flex-col gap-10 w-full max-w-lg px-6 z-10">
          {SKILL_NODES.map((node, idx) => {
            const unlocked = isSkillUnlocked(node);
            const NodeIcon = node.icon;

            return (
              <motion.div
                key={node.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className={`flex items-center gap-4 p-4 border rounded-xl relative transition-all ${
                  unlocked
                    ? "bg-slate-900 border-slate-800 hover:border-cyan-500/50 hover:bg-slate-900/90 shadow-[0_4px_12px_rgba(0,0,0,0.15)]"
                    : "bg-slate-950/40 border-slate-900 opacity-60"
                }`}
              >
                {/* Status Indicator */}
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  unlocked ? "bg-cyan-500/10 text-cyan-400" : "bg-slate-900 text-slate-600"
                }`}>
                  {unlocked ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                </div>

                {/* Skill Details */}
                <div className="flex-1 flex flex-col gap-1 pr-2">
                  <div className="flex items-center gap-2 justify-end flex-row-reverse">
                    <span className="font-extrabold text-xs text-slate-200">{node.title}</span>
                    {node.type === "specialization" && (
                      <span className="text-[8px] bg-amber-500/10 text-amber-400 border border-amber-500/20 px-1 rounded-full font-extrabold">التخصص</span>
                    )}
                    {node.type === "tool" && (
                      <span className="text-[8px] bg-purple-500/10 text-purple-400 border border-purple-500/20 px-1 rounded-full font-extrabold">أداة</span>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-400 leading-relaxed">{node.desc}</p>
                </div>

                {/* Left Action / Launch Icon */}
                <div className="flex flex-col items-center gap-1">
                  <button
                    onClick={() => unlocked && navigateToTab(node.tab, node.scrollId)}
                    disabled={!unlocked}
                    className={`w-11 h-11 rounded-full flex items-center justify-center border transition-all ${
                      unlocked
                        ? "bg-slate-950 border-slate-800 text-cyan-400 hover:border-cyan-500 hover:text-cyan-300 hover:scale-105 cursor-pointer"
                        : "bg-slate-900 border-slate-900 text-slate-700 cursor-not-allowed"
                    }`}
                  >
                    <NodeIcon className="w-5 h-5" />
                  </button>
                  {unlocked && (
                    <span className="text-[8px] text-cyan-500 font-extrabold hover:underline cursor-pointer" onClick={() => navigateToTab(node.tab, node.scrollId)}>
                      انطلق 🚀
                    </span>
                  )}
                </div>

                {/* Previous dependency requirement indicator for locking */}
                {!unlocked && (
                  <div className="absolute top-1 left-2 text-[8px] text-slate-500 font-semibold">
                    🔑 يتطلب إكمال {idx * 2} مهام (المكتمل حالياً: {completedCount})
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
