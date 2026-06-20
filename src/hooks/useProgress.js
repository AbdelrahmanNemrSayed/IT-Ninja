import { useState, useEffect, useCallback } from "react";
import { allCheckboxIds, APP_DATA_VERSION } from "../utils/constants";
import { roadmapData } from "../data/roadmapData";
import { useProfile } from "../context/ProfileContext";

export function useProgress() {
  const { getProfileKey } = useProfile();

  const [completedItems, setCompletedItems] = useState(() => {
    const versionKey = getProfileKey("version");
    const completedKey = getProfileKey("completed");

    const savedVersion = localStorage.getItem(versionKey);
    const saved = localStorage.getItem(completedKey);
    let parsed = saved ? JSON.parse(saved) : {};
    
    if (savedVersion !== APP_DATA_VERSION) {
      const validIds = new Set(allCheckboxIds);
      const migrated = {};
      Object.keys(parsed).forEach(id => {
        if (validIds.has(id)) {
          migrated[id] = parsed[id];
        }
      });
      parsed = migrated;
      localStorage.setItem(versionKey, APP_DATA_VERSION);
      localStorage.setItem(completedKey, JSON.stringify(parsed));
    }
    return parsed;
  });

  const [certProgress, setCertProgress] = useState(() => {
    const saved = localStorage.getItem(getProfileKey("certs"));
    return saved ? JSON.parse(saved) : { ccna: 0, linux: 0, security: 0, cloud: 0 };
  });

  useEffect(() => {
    localStorage.setItem(getProfileKey("completed"), JSON.stringify(completedItems));
  }, [completedItems, getProfileKey]);

  useEffect(() => {
    localStorage.setItem(getProfileKey("certs"), JSON.stringify(certProgress));
  }, [certProgress, getProfileKey]);

  const toggleItem = useCallback((id) => {
    setCompletedItems((prev) => {
      const updated = { ...prev };
      if (updated[id]) {
        delete updated[id];
      } else {
        updated[id] = true;
      }
      return updated;
    });
  }, []);

  const isPhaseCompleted = useCallback((phase) => {
    const phaseItemIds = [
      ...phase.subtopics.map((t) => t.id),
      ...phase.resources.map((r) => r.id)
    ];
    return phaseItemIds.every((id) => completedItems[id]);
  }, [completedItems]);

  const togglePhaseMaster = useCallback((phase) => {
    const phaseItemIds = [
      ...phase.subtopics.map((t) => t.id),
      ...phase.resources.map((r) => r.id)
    ];

    setCompletedItems((prev) => {
      const isCompleted = phaseItemIds.every((id) => prev[id]);
      const updated = { ...prev };
      phaseItemIds.forEach((id) => {
        if (isCompleted) {
          delete updated[id];
        } else {
          updated[id] = true;
        }
      });
      return updated;
    });
  }, []);

  const getPhaseCompletionStats = useCallback((phase) => {
    const ids = [
      ...phase.subtopics.map((t) => t.id),
      ...phase.resources.map((r) => r.id)
    ];
    const done = ids.filter((id) => completedItems[id]).length;
    const total = ids.length;
    const percent = total > 0 ? Math.round((done / total) * 100) : 0;
    return { done, total, percent };
  }, [completedItems]);

  const handleCertChange = useCallback((key, value) => {
    setCertProgress((prev) => ({
      ...prev,
      [key]: Math.min(100, Math.max(0, value))
    }));
  }, []);

  return {
    completedItems,
    setCompletedItems,
    certProgress,
    setCertProgress,
    toggleItem,
    isPhaseCompleted,
    togglePhaseMaster,
    getPhaseCompletionStats,
    handleCertChange
  };
}
