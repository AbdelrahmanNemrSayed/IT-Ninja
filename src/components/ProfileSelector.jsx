import React, { useState } from "react";
import { useProfile, AVATARS } from "../context/ProfileContext";
import { UserPlus, Trash2, X, Check, Edit2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ProfileSelector({ isOpen, onClose }) {
  const {
    profiles,
    activeProfile,
    setActiveProfileId,
    createProfile,
    deleteProfile,
    renameProfile,
    changeAvatar
  } = useProfile();

  const [newProfileName, setNewProfileName] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState(AVATARS[0].char);
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");

  const handleCreate = (e) => {
    e.preventDefault();
    if (!newProfileName.trim()) return;
    const success = createProfile(newProfileName, selectedAvatar);
    if (success) {
      setNewProfileName("");
      setIsCreating(false);
    }
  };

  const startRename = (profile) => {
    setEditingId(profile.id);
    setEditName(profile.name);
  };

  const handleRename = (id) => {
    if (!editName.trim()) return;
    renameProfile(id, editName);
    setEditingId(null);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
        />

        {/* Modal Content */}
        <motion.div 
          initial={{ scale: 0.95, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 15 }}
          className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 relative z-10 shadow-2xl text-right max-h-[85vh] flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
            <span className="font-extrabold text-sm text-slate-100 flex items-center gap-2">
              <span className="text-lg">🥷</span> إدارة ملفات المهندسين (User Profiles)
            </span>
            <button 
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-lg bg-slate-950 border border-slate-850 hover:border-slate-700 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-grow overflow-y-auto pr-1 flex flex-col gap-5">
            {/* Create Profile Section */}
            {!isCreating ? (
              <button 
                onClick={() => setIsCreating(true)}
                className="flex items-center justify-center gap-2 py-2.5 bg-slate-950 border border-dashed border-slate-800 hover:border-cyan-500/50 hover:bg-cyan-500/5 rounded-xl text-xs font-bold text-cyan-400 hover:text-cyan-300 transition-all cursor-pointer"
              >
                <UserPlus className="w-4 h-4" />
                <span>إضافة ملف شخصي جديد</span>
              </button>
            ) : (
              <form onSubmit={handleCreate} className="bg-slate-950/50 border border-slate-800/80 p-4 rounded-xl flex flex-col gap-3.5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-slate-500 font-bold">اسم المهندس (الملف)</label>
                  <input 
                    type="text" 
                    maxLength={24}
                    value={newProfileName}
                    onChange={(e) => setNewProfileName(e.target.value)}
                    placeholder="مثال: أحمد - DevOps"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500/80 transition-colors text-right"
                    required
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-slate-500 font-bold">اختر الأفاتار (الشخصية)</label>
                  <div className="grid grid-cols-7 gap-2.5">
                    {AVATARS.map((av) => (
                      <button
                        key={av.id}
                        type="button"
                        onClick={() => setSelectedAvatar(av.char)}
                        title={av.label}
                        className={`w-9 h-9 rounded-lg flex items-center justify-center text-lg transition-all cursor-pointer ${
                          selectedAvatar === av.char 
                            ? "bg-cyan-500/20 border border-cyan-400 text-white shadow-[0_0_10px_rgba(6,182,212,0.15)]" 
                            : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700"
                        }`}
                      >
                        {av.char}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-2 mt-1">
                  <button 
                    type="button" 
                    onClick={() => setIsCreating(false)}
                    className="px-3 py-1.5 bg-slate-900 border border-slate-850 hover:border-slate-700 rounded-lg text-[10px] font-bold text-slate-400 hover:text-slate-200 transition-all cursor-pointer"
                  >
                    إلغاء
                  </button>
                  <button 
                    type="submit" 
                    className="px-3 py-1.5 bg-cyan-500/10 border border-cyan-500/35 hover:bg-cyan-500/20 text-cyan-400 rounded-lg text-[10px] font-bold transition-all cursor-pointer"
                  >
                    تأكيد الإنشاء
                  </button>
                </div>
              </form>
            )}

            {/* Profile List */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] text-slate-500 font-bold pr-1">الملفات الحالية</label>
              {profiles.map((p) => {
                const isActive = p.id === activeProfile.id;
                const isEditing = editingId === p.id;
                
                return (
                  <div 
                    key={p.id}
                    className={`flex items-center justify-between p-3 rounded-xl border transition-all duration-300 ${
                      isActive 
                        ? "bg-slate-950/60 border-cyan-500/30 shadow-[0_4px_12px_rgba(6,182,212,0.05)]" 
                        : "bg-slate-950/30 border-slate-850 hover:bg-slate-950/50 hover:border-slate-800"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {/* Avatar Menu Dropdown / Simple cycle onClick */}
                      <button 
                        onClick={() => {
                          const currentIdx = AVATARS.findIndex(av => av.char === p.avatar);
                          const nextIdx = (currentIdx + 1) % AVATARS.length;
                          changeAvatar(p.id, AVATARS[nextIdx].char);
                        }}
                        title="تغيير الأفاتار"
                        className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-base hover:border-slate-700 hover:scale-105 transition-all cursor-pointer"
                      >
                        {p.avatar}
                      </button>

                      {isEditing ? (
                        <div className="flex items-center gap-1">
                          <input 
                            type="text" 
                            maxLength={24}
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="bg-slate-900 border border-slate-800 rounded px-2 py-0.5 text-xs text-slate-100 focus:outline-none text-right w-36"
                          />
                          <button 
                            onClick={() => handleRename(p.id)}
                            className="p-1 text-emerald-400 hover:bg-emerald-500/10 rounded cursor-pointer"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex flex-col text-right">
                          <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                            {p.name}
                            {isActive && (
                              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_rgba(6,182,212,0.8)] animate-pulse" />
                            )}
                          </span>
                          <span className="text-[8px] text-slate-500 font-bold mt-0.5">
                            {isActive ? "الملف النشط حالياً" : "اضغط للتبديل للملف"}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      {/* Actions */}
                      {!isActive && (
                        <button
                          onClick={() => setActiveProfileId(p.id)}
                          className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-850 hover:border-slate-750 text-[10px] text-slate-350 hover:text-white transition-all cursor-pointer"
                        >
                          تنشيط
                        </button>
                      )}

                      {!isEditing && (
                        <button
                          onClick={() => startRename(p)}
                          title="تعديل الاسم"
                          className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-900 rounded-lg transition-colors cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      )}

                      {p.id !== "default" && (
                        <button
                          onClick={() => deleteProfile(p.id)}
                          title="حذف الملف"
                          className="p-1.5 text-rose-500 hover:text-rose-400 hover:bg-rose-500/5 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
