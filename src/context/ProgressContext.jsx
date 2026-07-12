import React, { createContext, useContext } from "react";
import { useProgress } from "../hooks/useProgress";
import { useUserData } from "../hooks/useUserData";
import { useBackup } from "../hooks/useBackup";

const ProgressContext = createContext(null);

export function ProgressProvider({ children }) {
  const progressState = useProgress();
  const userDataState = useUserData();
  
  const backupState = useBackup(
    progressState.completedItems,
    progressState.setCompletedItems,
    progressState.certProgress,
    progressState.setCertProgress,
    userDataState.starredResources,
    userDataState.setStarredResources,
    userDataState.notebookNotes,
    userDataState.setNotebookNotes,
    userDataState.earnedBadges,
    userDataState.setEarnedBadges
  );

  const value = {
    ...progressState,
    ...userDataState,
    ...backupState
  };

  return (
    <ProgressContext.Provider value={value}>
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgressContext() {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error("useProgressContext must be used within a ProgressProvider");
  }
  return context;
}
