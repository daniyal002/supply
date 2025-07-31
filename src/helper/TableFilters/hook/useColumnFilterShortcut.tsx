import { useEffect, useState } from "react";

export function useColumnFilterShortcut(defaultColumnKey: string) {
  const [visibleColumnKey, setVisibleColumnKey] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && (e.key === "f" || e.key === "а")) {
        e.preventDefault();
        setVisibleColumnKey(defaultColumnKey);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [defaultColumnKey]);

  return { visibleColumnKey, setVisibleColumnKey };
}
