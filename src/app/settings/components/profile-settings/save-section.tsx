"use client";
import { useCallback, memo } from "react";

interface SaveSectionProps {
  onSave: () => void;
}

function SaveSection({ onSave }: SaveSectionProps) {
  const handleSave = useCallback(() => {
    onSave();
  }, [onSave]);

  return (
    <div className="flex justify-end">
      <button
        onClick={handleSave}
        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Save Changes
      </button>
    </div>
  );
}

export default memo(SaveSection);
