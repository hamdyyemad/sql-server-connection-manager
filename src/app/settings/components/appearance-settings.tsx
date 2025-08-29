import { ThemeSettings } from "./apperance-settings";

export default function AppearanceSettings() {
  return (
    <div className="space-y-6">
      <div>
        <h4 className="text-xl font-semibold text-white mb-2">
          Appearance Settings
        </h4>
        <p className="text-gray-400">
          Customize the look and feel of your dashboard.
        </p>
      </div>

      <ThemeSettings />

      {/* {onSave && (
        <div className="flex justify-end">
          <button
            onClick={onSave}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Save Appearance
          </button>
        </div>
      )} */}
    </div>
  );
}
