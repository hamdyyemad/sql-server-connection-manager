"use client";
import { memo, useCallback, useMemo } from "react";
import { LocalIcon, RemoteIcon, DeleteIcon, ChevronIcon } from "@/app/design/svg/ConnectionIcons";
import { getConnectionStatus, getDisplayName, getConnectionTypeLabel, getAuthTypeLabel } from "@/frontend_lib/helpers/connectionHelper";
import type { ConnectionInfo } from "@/backend_lib/types/database";

interface GridCardProps {
  connection: ConnectionInfo;
  index: number;
  onCardClick: (server: string) => void;
  onRemove: (e: React.MouseEvent, index: number) => void;
}

export const GridCard = memo<GridCardProps>(({ connection, index, onCardClick, onRemove }) => {
  const handleCardClick = useCallback(() => {
    onCardClick(connection.server);
  }, [onCardClick, connection.server]);

  const handleRemove = useCallback((e: React.MouseEvent) => {
    onRemove(e, index);
  }, [onRemove, index]);

  const { statusColor, statusText, statusBadgeClass } = useMemo(() =>
    getConnectionStatus(connection), [connection]
  );

  const connectionIcon = useMemo(() =>
    connection.connectionType === "local" ? <LocalIcon /> : <RemoteIcon />,
    [connection.connectionType]
  );

  const displayName = useMemo(() => getDisplayName(connection), [connection]);

  return (
    <div
      className="bg-gray-900/50 border border-gray-700 p-6 rounded-xl hover:bg-gray-900/70 hover:border-gray-600 transition-all duration-200 cursor-pointer group"
      onClick={handleCardClick}
    >
      <div className="relative flex items-start justify-between">
        <div className="flex items-center space-x-4">
          <div className={`${statusColor} group-hover:scale-110 transition-transform duration-200`}>
            {connectionIcon}
          </div>
          <div className="flex-1">
            <h3 className="text-white font-semibold text-lg group-hover:text-blue-300 transition-colors">
              {displayName}
            </h3>
            <p className="text-gray-400 text-sm">{connection.server}</p>
            <div className="flex items-center space-x-3 mt-3">
              <span className={`text-xs px-3 py-1 rounded-full font-medium ${statusBadgeClass}`}>
                {statusText}
              </span>
              <span className="text-gray-500 text-xs bg-gray-800/50 px-2 py-1 rounded">
                {getConnectionTypeLabel(connection.connectionType)}
              </span>
              <span className="text-gray-500 text-xs bg-gray-800/50 px-2 py-1 rounded">
                {getAuthTypeLabel(connection.authenticationType)}
              </span>
            </div>
          </div>
        </div>
        <button
          onClick={handleRemove}
          className="absolute top-0 right-0 text-gray-500 hover:text-red-400 transition-colors p-2 rounded-lg hover:bg-red-500/10 opacity-0 group-hover:opacity-100"
          title="Remove connection"
        >
          <DeleteIcon />
        </button>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-700/50 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Click to connect</span>
          <ChevronIcon />
        </div>
      </div>
    </div>
  );
});

GridCard.displayName = 'GridCard';
