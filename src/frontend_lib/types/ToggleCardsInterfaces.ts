import { Dispatch, SetStateAction } from "react";

type ViewMode = "grid" | "list";

interface ToggleCardsViewModeProps {
  viewMode: ViewMode;
  setViewMode: Dispatch<SetStateAction<ViewMode>>;
}

interface ViewModeButtonProps {
  mode: ViewMode;
  currentMode: ViewMode;
  setViewMode: Dispatch<SetStateAction<ViewMode>>;
  icon: React.ReactNode;
  title: string;
}

export type { ToggleCardsViewModeProps, ViewModeButtonProps };
