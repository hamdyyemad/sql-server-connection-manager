"use client";
import { GridCard } from "./GridCard";
import { ListCard } from "./ListCard";
import { useMemo } from "react";
import { useConnectionActions } from "@/frontend_lib/hooks/useConnectionActions";
import type { ConnectionInfo } from "@/backend_lib/types/database";

interface Props {
  connection: ConnectionInfo;
  index: number;
  viewMode: "grid" | "list";
}

export const ConnectionCard: React.FC<Props> = ({ connection, index, viewMode }) => {
  const { handleCardClick, handleRemove } = useConnectionActions(connection);

  const commonProps = useMemo(() => ({
    connection,
    index,
    onCardClick: handleCardClick,
    onRemove: handleRemove,
  }), [connection, index, handleCardClick, handleRemove]);

  return viewMode === "grid" ? (
    <GridCard {...commonProps} />
  ) : (
    <ListCard {...commonProps} />
  );
};