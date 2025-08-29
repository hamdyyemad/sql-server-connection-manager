"use client";
import { useState } from "react";
import CreateConnectionCard from "./cardsContainer/CreateConnectionCard";
import ConnectionCards from "./cardsContainer/ConnectionCards";
import ToggleCardsViewMode from "./cardsContainer/ToggleCardsViewMode";
export default function CardsContainer() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  return (
    <>
      <ToggleCardsViewMode viewMode={viewMode} setViewMode={setViewMode} />

      {/* Connections Grid/List */}
      <div
        className={
          viewMode === "grid"
            ? "grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            : "space-y-4"
        }
      >
        <ConnectionCards viewMode={viewMode} />
        <CreateConnectionCard />
      </div>
    </>
  );
}
