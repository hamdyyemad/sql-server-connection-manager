import { JSX } from "react";

interface Props {
  icon: JSX.Element;
  isActive?: boolean;
}

export function NavItem({ icon, isActive = false }: Props) {
  return (
    <a
      className={`sidebar-item p-4 inline-flex justify-center rounded-md smooth-hover ${
        isActive
          ? "sidebar-item-active text-white"
          : "text-white/60 hover:text-white hover:bg-gray-800/50"
      }`}
      href="#"
    >
      {icon}
    </a>
  );
}
