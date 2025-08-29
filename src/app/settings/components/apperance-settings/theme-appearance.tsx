"use client";
import { useState } from "react";

const themes = [
  { id: "dark", name: "Dark" },
  { id: "light", name: "Light" },
  { id: "auto", name: "Auto" },
];
export default function ThemeAppearance() {
  const [selectedTheme, setSelectedTheme] = useState("dark");

  const onClick = () => {
    // Handle theme save logic
    console.log("Theme saved:", { selectedTheme });
  };

  return (
    <div className="flex space-x-4">
      {themes.map((theme) => (
        <ThemeButton key={theme.id} theme={theme} selectedTheme={selectedTheme} setSelectedTheme={setSelectedTheme} onClick={onClick} />
      ))}
    </div>
  );
}
function ThemeButton({ theme, selectedTheme, setSelectedTheme, onClick }: { theme: typeof themes[number], selectedTheme: string, setSelectedTheme: (theme: string) => void, onClick: () => void }) {
  return (
    <button
      key={theme.id}
      onClick={() => {
        setSelectedTheme(theme.id);
        onClick();
      }}
      className={`px-4 py-2 rounded-lg transition-colors ${
        selectedTheme === theme.id
          ? "bg-blue-600 text-white"
          : "bg-gray-700 text-gray-300 hover:bg-gray-600"
        }`}
    >
      {theme.name}
    </button>
  );
}