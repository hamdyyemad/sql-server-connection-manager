import { useState } from "react";
import { useSetCustomPassword } from "@/frontend_lib/hooks/useApi";
import { type PasswordOperationConfig } from "@/frontend_lib/types/api";
import { ConnectionInfo } from "@/backend_lib/types/database";

interface User {
  Id: string;
  UserName: string | null;
  UserName_HR: string | null;
  ChangePass: number;
  TypeLogin: string | null;
  LocationId: string | null;
  RoleName: string | null;
  RoleId: string | null;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  connection: ConnectionInfo | undefined;
  onSuccess: () => void;
}

export default function PasswordModal({
  isOpen,
  onClose,
  user,
  connection,
  onSuccess,
}: Props) {
  const [customPassword, setCustomPassword] = useState("");
  const [requirePasswordChange, setRequirePasswordChange] = useState(false);
  
  const { loading: setPasswordLoading, error: setPasswordError, setCustomPassword: setCustomPasswordApi } = useSetCustomPassword();

  const handleClose = () => {
    setCustomPassword("");
    setRequirePasswordChange(false);
    onClose();
  };

  const handleSetPassword = async () => {
    if (!user || !connection || !customPassword) return;

    try {
      const dbConfig: PasswordOperationConfig = {
        server: connection.server,
        user: connection.user,
        password: connection.password,
        authenticationType: connection.authenticationType,
        userId: user.Id,
        newPassword: customPassword,
      };

      const response = await setCustomPasswordApi(dbConfig);
      if (response.success) {
        alert("Password set successfully!");
        handleClose();
        onSuccess(); // Refresh the user list
      } else {
        alert(`Failed to set password: ${response.error}`);
      }
    } catch (error) {
      console.error("Error setting password:", error);
      alert(`Error setting password: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 border border-gray-600 rounded-lg p-6 max-w-md w-full m-4">
        <h4 className="text-lg font-semibold text-white mb-4">
          Set Custom Password for: {user.UserName || user.UserName_HR}
        </h4>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              New Password
            </label>
            <input
              type="text"
              value={customPassword}
              onChange={(e) => setCustomPassword(e.target.value)}
              placeholder="Enter new password..."
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400"
              disabled={setPasswordLoading}
            />
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="requireChange"
              checked={requirePasswordChange}
              onChange={(e) => setRequirePasswordChange(e.target.checked)}
              className="rounded"
              disabled={setPasswordLoading}
            />
            <label htmlFor="requireChange" className="text-sm text-gray-300">
              Require password change on next login
            </label>
          </div>
          {setPasswordError && (
            <div className="text-red-400 text-sm">
              Error: {setPasswordError}
            </div>
          )}
        </div>
        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={handleClose}
            disabled={setPasswordLoading}
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 disabled:bg-gray-500 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={handleSetPassword}
            disabled={!customPassword.trim() || setPasswordLoading}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:bg-gray-500 disabled:cursor-not-allowed"
          >
            {setPasswordLoading ? "Setting..." : "Set Password"}
          </button>
        </div>
      </div>
    </div>
  );
}