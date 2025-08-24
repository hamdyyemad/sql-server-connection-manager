"use client";
import React from "react";
import { useConnectionFormStore } from "@/frontend_lib/store/useConnectionFormStore";
import { useModalStore } from "@/frontend_lib/store/useModalStore";

export const FormActions: React.FC = React.memo(() => {
  const {
    loading,
    formData,
    localInstance,
    submitForm,
    resetForm
  } = useConnectionFormStore();

  const closeModal = useModalStore((s) => s.closeConnectionModal);

  const { connectionType } = formData;
  const isSubmitDisabled = loading || (connectionType === "local" && !localInstance);

  const handleCancel = () => {
    closeModal();
    resetForm();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await submitForm();
    if (result?.success) {
      resetForm();
    }
  };

  return (
    <div className="flex space-x-3 pt-4">
      <button
        type="button"
        className="px-6 py-3 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors"
        onClick={handleCancel}
        disabled={loading}
      >
        Cancel
      </button>
      <button
        type="submit"
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={isSubmitDisabled}
        onClick={handleSubmit}
      >
        {loading ? (
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            <span>Connecting...</span>
          </div>
        ) : (
          "Connect"
        )}
      </button>
    </div>
  );
});

FormActions.displayName = "FormActions"; 