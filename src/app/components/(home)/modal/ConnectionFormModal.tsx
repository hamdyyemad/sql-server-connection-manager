"use client";
import { ConnectionTypeSelector } from "./ConnectionTypeSelector";
import { ServerInput } from "./ServerInput";
import { AuthenticationFields } from "./AuthenticationFields";
import { FormActions } from "./FormActions";
import { useConnectionFormStore } from "@/frontend_lib/store/useConnectionFormStore";
import { useModalStore } from "@/frontend_lib/store/useModalStore";

export default function ConnectionFormModal() {
  const { error } = useConnectionFormStore();
  const { isConnectionModalOpen } = useModalStore();

  if (!isConnectionModalOpen) return null;

  return (
    <form className="space-y-6">
      <ConnectionTypeSelector />
      <ServerInput />
      <AuthenticationFields />

      {error && (
        <div className="text-red-300 bg-red-900/20 border border-red-700 p-4 rounded-lg text-sm whitespace-pre-line">
          {error}
        </div>
      )}

      <FormActions />
    </form>
  );
}
