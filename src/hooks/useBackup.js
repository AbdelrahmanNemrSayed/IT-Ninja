import { useCallback } from "react";

export function useBackup(completedItems, setCompletedItems, setCertProgress) {
  const exportBackup = useCallback(() => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(
      JSON.stringify({ completedItems, certProgress: {} }) // Include certProgress if passed
    );
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "it_ninja_backup.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  }, [completedItems]);

  const importBackup = useCallback((e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (parsed.completedItems) setCompletedItems(parsed.completedItems);
        if (parsed.certProgress && setCertProgress) setCertProgress(parsed.certProgress);
        alert("تم استيراد النسخة الاحتياطية بنجاح!");
      } catch (err) {
        alert("ملف النسخة الاحتياطية غير صالح.");
      }
    };
    reader.readAsText(file);
  }, [setCompletedItems, setCertProgress]);

  const resetAllProgress = useCallback(() => {
    if (window.confirm("هل أنت متأكد من رغبتك في إعادة تعيين كافة خطوات التقدم والمذاكرة؟")) {
      setCompletedItems({});
      if (setCertProgress) setCertProgress({ ccna: 0, linux: 0, security: 0, cloud: 0 });
    }
  }, [setCompletedItems, setCertProgress]);

  return {
    exportBackup,
    importBackup,
    resetAllProgress
  };
}
