import { memo } from "react";
import ThemeAppearance from "./theme-appearance";
import ThemeColors from "./theme-colors";

// Create isolated wrapper components to prevent cross-contamination
const ThemeSection = memo(() => {
  return (
    <div className="p-4 bg-gray-800/30 rounded-lg">
      <h5 className="text-white font-medium mb-2">Theme</h5>
      <div className="flex space-x-4">
        <ThemeAppearance />
      </div>
    </div>
  );
});

const ColorSection = memo(() => {
  return (
    <div className="p-4 bg-gray-800/30 rounded-lg">
      <h5 className="text-white font-medium mb-2">Accent Color</h5>
      <div className="flex space-x-3">
        <ThemeColors />
      </div>
    </div>
  );
});

ThemeSection.displayName = "ThemeSection";
ColorSection.displayName = "ColorSection";

function ThemeSettings() {  
  return (
    <div className="space-y-4">
      <ThemeSection />
      <ColorSection />
    </div>
  );
}

export default memo(ThemeSettings);
