import React, { createContext, useState, useEffect, useContext, useCallback } from "react";

const ProfileContext = createContext(null);

export const AVATARS = [
  { id: "ninja", char: "🥷", label: "نينجا التقنية" },
  { id: "sysadmin", char: "🛡️", label: "مدير الأنظمة" },
  { id: "coder", char: "💻", label: "المبرمج المحترف" },
  { id: "network", char: "🌐", label: "خبير الشبكات" },
  { id: "tux", char: "🐧", label: "بطريق لينكس" },
  { id: "cloud", char: "☁️", label: "مهندس السحاب" },
  { id: "security", char: "🔒", label: "حارس الأمن" }
];

export function ProfileProvider({ children }) {
  const [profiles, setProfiles] = useState(() => {
    const saved = localStorage.getItem("it_ninja_profiles");
    if (saved) return JSON.parse(saved);
    // Default initial profile
    return [
      { id: "default", name: "المهندس الافتراضي", avatar: "🥷", createdAt: new Date().toISOString() }
    ];
  });

  const [activeProfileId, setActiveProfileId] = useState(() => {
    return localStorage.getItem("it_ninja_active_profile") || "default";
  });

  useEffect(() => {
    localStorage.setItem("it_ninja_profiles", JSON.stringify(profiles));
  }, [profiles]);

  useEffect(() => {
    localStorage.setItem("it_ninja_active_profile", activeProfileId);
  }, [activeProfileId]);

  const activeProfile = profiles.find(p => p.id === activeProfileId) || profiles[0] || { id: "default", name: "المهندس الافتراضي", avatar: "🥷" };

  const getProfileKey = useCallback((key) => {
    return `it_ninja_${activeProfileId}_${key}`;
  }, [activeProfileId]);

  const createProfile = useCallback((name, avatar) => {
    const cleanName = name.trim().replace(/[<>]/g, ""); // basic XSS sanitization
    if (!cleanName) return false;
    const newId = "profile_" + Math.random().toString(36).substring(2, 9);
    const newProfile = {
      id: newId,
      name: cleanName,
      avatar: avatar || "🥷",
      createdAt: new Date().toISOString()
    };
    setProfiles(prev => [...prev, newProfile]);
    setActiveProfileId(newId);
    return true;
  }, []);

  const deleteProfile = useCallback((id) => {
    if (id === "default") return false; // Prevent deleting default fallback
    setProfiles(prev => {
      const filtered = prev.filter(p => p.id !== id);
      if (activeProfileId === id) {
        setActiveProfileId(filtered[0]?.id || "default");
      }
      return filtered;
    });
    // Clean up local storage for deleted profile
    const prefixes = ["completed", "certs", "starred", "notes", "badges"];
    prefixes.forEach(prefix => {
      localStorage.removeItem(`it_ninja_${id}_${prefix}`);
    });
    return true;
  }, [activeProfileId]);

  const renameProfile = useCallback((id, newName) => {
    const cleanName = newName.trim().replace(/[<>]/g, "");
    if (!cleanName) return false;
    setProfiles(prev => prev.map(p => p.id === id ? { ...p, name: cleanName } : p));
    return true;
  }, []);

  const changeAvatar = useCallback((id, newAvatar) => {
    setProfiles(prev => prev.map(p => p.id === id ? { ...p, avatar: newAvatar } : p));
    return true;
  }, []);

  return (
    <ProfileContext.Provider value={{
      profiles,
      activeProfile,
      activeProfileId,
      setActiveProfileId,
      createProfile,
      deleteProfile,
      renameProfile,
      changeAvatar,
      getProfileKey
    }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }
  return context;
}
