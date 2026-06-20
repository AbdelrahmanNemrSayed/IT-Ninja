import { useState, useEffect, useCallback, useMemo } from "react";
import { roadmapData } from "../data/roadmapData";

export function useUserData() {
  const [starredResources, setStarredResources] = useState(() => {
    const saved = localStorage.getItem("it_ninja_starred");
    return saved ? JSON.parse(saved) : [];
  });

  const [notebookNotes, setNotebookNotes] = useState(() => {
    const saved = localStorage.getItem("it_ninja_notes");
    return saved ? JSON.parse(saved) : {};
  });

  const [earnedBadges, setEarnedBadges] = useState(() => {
    const saved = localStorage.getItem("it_ninja_badges");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("it_ninja_starred", JSON.stringify(starredResources));
  }, [starredResources]);

  useEffect(() => {
    localStorage.setItem("it_ninja_notes", JSON.stringify(notebookNotes));
  }, [notebookNotes]);

  useEffect(() => {
    localStorage.setItem("it_ninja_badges", JSON.stringify(earnedBadges));
  }, [earnedBadges]);

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
