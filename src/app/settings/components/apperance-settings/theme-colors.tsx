"use client";
import { useState } from "react";
const colors = [
  { id: "blue", name: "Blue" },
  { id: "green", name: "Green" },
  { id: "purple", name: "Purple" },
  { id: "orange", name: "Orange" },
  { id: "red", name: "Red" },
];
export default function ThemeColors() {
  const [selectedColor, setSelectedColor] = useState("blue");
  const onChange = () => {
    // Handle color save logic
    console.log("Color saved:", { selectedColor });
  };

  return (
    <>
      {colors.map((color) => (
        <ColorButton
          key={color.id}
          color={color}
          selectedColor={selectedColor}
          setSelectedColor={setSelectedColor}
          onClick={onChange}
        />
      ))}
    </>
  );
}
function ColorButton({
  color,
  selectedColor,
  setSelectedColor,
  onClick,
}: {
  color: (typeof colors)[number];
  selectedColor: string;
  setSelectedColor: (color: string) => void;
  onClick: () => void;
}) {
  return (
    <button
      key={color.id}
      onClick={() => {
        setSelectedColor(color.id);
        onClick();
      }}
      className={`w-8 h-8 rounded-full bg-${
        color.id
      }-500 border-2 transition-all ${
        selectedColor === color.id
          ? "border-white scale-110"
          : "border-transparent hover:scale-105"
      }`}
      title={color.name}
    />
  );
}
