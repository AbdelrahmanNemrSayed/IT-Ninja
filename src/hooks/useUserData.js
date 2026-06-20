import { useState, useEffect, useCallback, useMemo } from "react";
import { roadmapData } from "../data/roadmapData";
import { useProfile } from "../context/ProfileContext";

export function useUserData() {
  const { getProfileKey } = useProfile();

  const [starredResources, setStarredResources] = useState(() => {
    const saved = localStorage.getItem(getProfileKey("starred"));
    return saved ? JSON.parse(saved) : [];
  });

  const [notebookNotes, setNotebookNotes] = useState(() => {
    const saved = localStorage.getItem(getProfileKey("notes"));
    return saved ? JSON.parse(saved) : {};
  });

  const [earnedBadges, setEarnedBadges] = useState(() => {
    const saved = localStorage.getItem(getProfileKey("badges"));
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem(getProfileKey("starred"), JSON.stringify(starredResources));
  }, [starredResources, getProfileKey]);

  useEffect(() => {
    localStorage.setItem(getProfileKey("notes"), JSON.stringify(notebookNotes));
  }, [notebookNotes, getProfileKey]);

  useEffect(() => {
    localStorage.setItem(getProfileKey("badges"), JSON.stringify(earnedBadges));
  }, [earnedBadges, getProfileKey]);

  const toggleStar = useCallback((resId) => {
    setStarredResources((prev) => {
      if (prev.includes(resId)) {
        return prev.filter((id) => id !== resId);
      } else {
        return [...prev, resId];
      }
    });
  }, []);

  const updateNote = useCallback((phaseId, noteText) => {
    setNotebookNotes((prev) => ({
      ...prev,
      [phaseId]: noteText
    }));
  }, []);

  const bookmarkedItems = useMemo(() => {
    const items = [];
    roadmapData.forEach((phase) => {
      phase.resources.forEach((res) => {
        if (starredResources.includes(res.id)) {
          items.push({ 
            ...res, 
            phaseAccent: phase.accent, 
            phaseShortTitle: phase.shortTitle 
          });
        }
      });
    });
    return items;
  }, [starredResources]);

  return {
    starredResources,
    setStarredResources,
    notebookNotes,
    setNotebookNotes,
    earnedBadges,
    setEarnedBadges,
    toggleStar,
    updateNote,
    bookmarkedItems
  };
}
