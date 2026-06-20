import React from "react";
import { Youtube, BookOpen, Compass, Globe, Terminal } from "lucide-react";
import { roadmapData } from "../data/roadmapData";

export const accentColors = {
  emerald: {
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    text: "text-emerald-400",
    accentText: "text-emerald-300",
    badge: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/25",
    checkbox: "text-emerald-500 focus:ring-emerald-500/30",
    glow: "hover:shadow-emerald-500/5 hover:border-emerald-500/40"
  },
  cyan: {
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/20",
    text: "text-cyan-400",
    accentText: "text-cyan-300",
    badge: "bg-cyan-500/10 text-cyan-400 border border-cyan-500/25",
    checkbox: "text-cyan-500 focus:ring-cyan-500/30",
    glow: "hover:shadow-cyan-500/5 hover:border-cyan-500/40"
  },
  amber: {
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    text: "text-amber-400",
    accentText: "text-amber-300",
    badge: "bg-amber-500/10 text-amber-400 border border-amber-500/25",
    checkbox: "text-amber-500 focus:ring-amber-500/30",
    glow: "hover:shadow-amber-500/5 hover:border-amber-500/40"
  },
  purple: {
    bg: "bg-purple-500/10",
    border: "border-purple-500/20",
    text: "text-purple-400",
    accentText: "text-purple-300",
    badge: "bg-purple-500/10 text-purple-400 border border-purple-500/25",
    checkbox: "text-purple-500 focus:ring-purple-500/30",
    glow: "hover:shadow-purple-500/5 hover:border-purple-500/40"
  },
  blue: {
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    text: "text-blue-400",
    accentText: "text-blue-300",
    badge: "bg-blue-500/10 text-blue-400 border border-blue-500/25",
    checkbox: "text-blue-500 focus:ring-blue-500/30",
    glow: "hover:shadow-blue-500/5 hover:border-blue-500/40"
  },
  red: {
    bg: "bg-rose-500/10",
    border: "border-rose-500/20",
    text: "text-rose-400",
    accentText: "text-rose-300",
    badge: "bg-rose-500/10 text-rose-400 border border-rose-500/25",
    checkbox: "text-rose-500 focus:ring-rose-500/30",
    glow: "hover:shadow-rose-500/5 hover:border-rose-500/40"
  }
};

export const getPlatformIcon = (platform) => {
  switch (platform.toLowerCase()) {
    case "youtube":
      return <Youtube className="w-4 h-4 text-red-550" />;
    case "coursera":
      return <BookOpen className="w-4 h-4 text-blue-450" />;
    case "cisco":
      return <Compass className="w-4 h-4 text-cyan-455" />;
    case "microsoft":
      return <Globe className="w-4 h-4 text-sky-455" />;
    default:
      return <Terminal className="w-4 h-4 text-slate-455" />;
  }
};

export const allCheckboxIds = [];
roadmapData.forEach((phase) => {
  phase.subtopics.forEach((topic) => allCheckboxIds.push(topic.id));
  phase.resources.forEach((res) => allCheckboxIds.push(res.id));
});
export const totalCheckboxes = allCheckboxIds.length;

export const APP_DATA_VERSION = "v3.0";

export const badgeNames = {
  itbasics: { title: "بطل التأسيس 💻", sub: "IT Starter Ninja", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
  networks: { title: "نينجا الشبكات 🌐", sub: "Certified Network Ninja", color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20" },
  linux: { title: "قائد لينكس 🐧", sub: "Linux Commander", color: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
  windows: { title: "مدير الأنظمة 🛡️", sub: "Windows Server Master", color: "text-purple-400 bg-purple-500/10 border-purple-500/20" },
  virtualization: { title: "خبير السيرفرات الوهمية ⚙️", sub: "Virtualization Specialist", color: "text-blue-400 bg-blue-500/10 border-blue-500/20" },
  security: { title: "حارس الأمن الرقمي 🔒", sub: "Cyber Sentinel", color: "text-rose-400 bg-rose-500/10 border-rose-500/20" },
  specialization: { title: "خبير الأتمتة والسكربتات 🐍", sub: "Automation Alchemist", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
  kubernetes: { title: "مهندس كوبيرنيتس ☸️", sub: "K8s Container Architect", color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20" },
  gitops: { title: "ماستر البنية ككود ⚙️", sub: "GitOps Master", color: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
  sre: { title: "حارس استقرار الأنظمة 📈", sub: "SRE Guardian", color: "text-purple-400 bg-purple-500/10 border-purple-500/20" },
  zerotrust: { title: "مدافع الـ Zero Trust 🛡️", sub: "Zero Trust Defender", color: "text-rose-400 bg-rose-500/10 border-rose-500/20" },
  clouddep: { title: "بطل الإطلاق السحابي ☁️", sub: "Cloud Deploy Ninja", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" }
};
