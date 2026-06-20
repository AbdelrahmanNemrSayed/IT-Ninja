import { useCallback } from "react";

const validateBackup = (data) => {
  if (!data || typeof data !== "object" || Array.isArray(data)) return null;
  
  // Guard against prototype pollution
  if ("__proto__" in data || "constructor" in data) return null;

  const validated = {
    completedItems: {},
    certProgress: { ccna: 0, linux: 0, security: 0, cloud: 0 },
    starredResources: [],
    notebookNotes: {},
    earnedBadges: []
  };

  // Validate completedItems: must be key-value of string -> boolean
  if (data.completedItems && typeof data.completedItems === "object" && !Array.isArray(data.completedItems)) {
    if (!("__proto__" in data.completedItems)) {
      Object.keys(data.completedItems).forEach(key => {
        if (typeof key === "string" && key.length < 100 && typeof data.completedItems[key] === "boolean") {
          validated.completedItems[key.replace(/[<>]/g, "")] = data.completedItems[key];
        }
      });
    }
  }

  // Validate certProgress: ccna, linux, security, cloud -> numbers 0..100
  if (data.certProgress && typeof data.certProgress === "object" && !Array.isArray(data.certProgress)) {
    const certKeys = ["ccna", "linux", "security", "cloud"];
    certKeys.forEach(k => {
      if (k in data.certProgress) {
        const val = Number(data.certProgress[k]);
        if (!isNaN(val) && val >= 0 && val <= 100) {
          validated.certProgress[k] = Math.round(val);
        }
      }
    });
  }

  // Validate starredResources: array of strings
  if (data.starredResources && Array.isArray(data.starredResources)) {
    data.starredResources.forEach(item => {
      if (typeof item === "string" && item.length < 100) {
        validated.starredResources.push(item.replace(/[<>]/g, ""));
      }
    });
  }

  // Validate notebookNotes: key-value of string -> string
  if (data.notebookNotes && typeof data.notebookNotes === "object" && !Array.isArray(data.notebookNotes)) {
    if (!("__proto__" in data.notebookNotes)) {
      Object.keys(data.notebookNotes).forEach(key => {
        if (typeof key === "string" && key.length < 100 && typeof data.notebookNotes[key] === "string") {
          const sanitizedNote = data.notebookNotes[key]
            .slice(0, 10000)
            .replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, "") // strip scripts
            .replace(/[<>]/g, ""); // strip brackets
          validated.notebookNotes[key.replace(/[<>]/g, "")] = sanitizedNote;
        }
      });
    }
  }

  // Validate earnedBadges: array of strings
  if (data.earnedBadges && Array.isArray(data.earnedBadges)) {
    data.earnedBadges.forEach(item => {
      if (typeof item === "string" && item.length < 100) {
        validated.earnedBadges.push(item.replace(/[<>]/g, ""));
      }
    });
  }

  return validated;
};

export function useBackup(
  completedItems, setCompletedItems,
  certProgress, setCertProgress,
  starredResources, setStarredResources,
  notebookNotes, setNotebookNotes,
  earnedBadges, setEarnedBadges
) {
  const exportBackup = useCallback(() => {
    try {
      const backupData = {
        completedItems,
        certProgress,
        starredResources,
        notebookNotes,
        earnedBadges,
        exportDate: new Date().toISOString()
      };
      
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(
        JSON.stringify(backupData)
      );
      const downloadAnchor = document.createElement("a");
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", "it_ninja_backup.json");
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    } catch (err) {
      alert("حدث خطأ أثناء تصدير البيانات.");
    }
  }, [completedItems, certProgress, starredResources, notebookNotes, earnedBadges]);

  const importBackup = useCallback((e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const rawData = JSON.parse(event.target.result);
        const validated = validateBackup(rawData);
        
        if (!validated) {
          alert("ملف النسخة الاحتياطية غير صالح أو يحتوي على أكواد غير آمنة.");
          return;
        }

        setCompletedItems(validated.completedItems);
        setCertProgress(validated.certProgress);
        setStarredResources(validated.starredResources);
        setNotebookNotes(validated.notebookNotes);
        setEarnedBadges(validated.earnedBadges);
        
        alert("تم استيراد كافة بيانات الملف الشخصي بنجاح!");
      } catch (err) {
        alert("فشل قراءة ملف النسخة الاحتياطية. تأكد من أن الملف بصيغة JSON صالحة.");
      }
    };
    reader.readAsText(file);
  }, [setCompletedItems, setCertProgress, setStarredResources, setNotebookNotes, setEarnedBadges]);

  const resetAllProgress = useCallback(() => {
    if (window.confirm("هل أنت متأكد من رغبتك في إعادة تعيين كافة خطوات التقدم والمذاكرة؟")) {
      setCompletedItems({});
      setCertProgress({ ccna: 0, linux: 0, security: 0, cloud: 0 });
      setStarredResources([]);
      setNotebookNotes({});
      setEarnedBadges([]);
    }
  }, [setCompletedItems, setCertProgress, setStarredResources, setNotebookNotes, setEarnedBadges]);

  return {
    exportBackup,
    importBackup,
    resetAllProgress
  };
}
