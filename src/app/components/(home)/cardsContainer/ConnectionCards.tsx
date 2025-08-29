"use client";
import { useConnectionsStore } from "@/frontend_lib/store/useConnectionsStore";
import { ConnectionCard } from "./card/ConnectionCard";

interface Props {
  viewMode: "grid" | "list";
}

export default function ConnectionCards({ viewMode }: Props) {
  const connections = useConnectionsStore((s) => s.connections);
  return (
    <>
      {connections.map((conn, idx) => (
        <ConnectionCard
          key={`${conn.server}-${conn.connectionType}-${idx}`}
          connection={conn}
          index={idx}
          viewMode={viewMode}
        />
      ))}
    </>
  );
}
