import { GridIcon, ListIcon } from "@/app/design/svg/GridListIcons";

import type {
  ToggleCardsViewModeProps,
  ViewModeButtonProps,
} from "@/frontend_lib/types/ToggleCardsInterfaces";

export default function ToggleCardsViewMode({
  viewMode,
  setViewMode,
}: ToggleCardsViewModeProps) {
  return (
    <div className="inline-flex absolute right-12" style={{top: "5%"}}>
      <div className="flex items-center space-x-2 ">
        <ViewModeButton
          mode="grid"
          currentMode={viewMode}
          setViewMode={setViewMode}
          icon={GridIcon}
          title="Grid view"
        />
        <ViewModeButton
          mode="list"
          currentMode={viewMode}
          setViewMode={setViewMode}
          icon={ListIcon}
          title="List view"
        />
      </div>
    </div>
  );
}

const ViewModeButton = ({
  mode,
  currentMode,
  setViewMode,
  icon,
  title,
}: ViewModeButtonProps) => {
  const isActive = mode === currentMode;

  return (
    <button
      className={`hidden md:inline-block cursor-pointer p-2 rounded-lg transition-colors ${
        isActive
          ? "bg-blue-600/20 border border-blue-500 text-blue-400 shadow-lg shadow-blue-500/20"
          : "bg-gray-800/50 hover:bg-gray-800/70 text-gray-400 hover:text-gray-300"
      }`}
      onClick={() => setViewMode(mode)}
      title={title}
    >
      {icon}
    </button>
  );
};
