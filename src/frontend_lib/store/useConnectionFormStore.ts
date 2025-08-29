import { create } from "zustand";
import { z } from "zod";
import { apiService } from "../services";
import type { DatabaseOperationConfig } from "../types/api";
import {
  ConnectionFormSchema,
  type ConnectionFormData,
  type LocalInstanceInfo,
} from "@/frontend_lib/validations/connection";

interface ConnectionFormState {
  // Form data
  formData: ConnectionFormData;

  // UI state
  loading: boolean;
  error: string;
  detectingLocal: boolean;
  localInstance: LocalInstanceInfo | null;

  // Actions
  updateFormData: (data: Partial<ConnectionFormData>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string) => void;
  setDetectingLocal: (detecting: boolean) => void;
  setLocalInstance: (instance: LocalInstanceInfo | null) => void;

  // Form actions
  handleConnectionTypeChange: (type: "local" | "remote") => void;
  handleAuthenticationTypeChange: (type: "windows" | "sql") => void;
  handleServerChange: (server: string) => void;
  handleUserChange: (user: string) => void;
  handlePasswordChange: (password: string) => void;

  // API actions
  detectLocalInstance: () => Promise<LocalInstanceInfo | null>;
  submitForm: () => Promise<{ success: boolean; error?: string }>;

  // Reset
  resetForm: () => void;
}

const initialFormData: ConnectionFormData = {
  server: "",
  user: "",
  password: "",
  authenticationType: "sql",
  connectionType: "remote",
};

export const useConnectionFormStore = create<ConnectionFormState>(
  (set, get) => ({
    // Initial state
    formData: initialFormData,
    loading: false,
    error: "",
    detectingLocal: false,
    localInstance: null,

    // Basic setters
    updateFormData: (data) =>
      set((state) => ({
        formData: { ...state.formData, ...data },
      })),

    setLoading: (loading) => set({ loading }),
    setError: (error) => set({ error }),
    setDetectingLocal: (detectingLocal) => set({ detectingLocal }),
    setLocalInstance: (localInstance) => set({ localInstance }),

    // Form handlers
    handleConnectionTypeChange: (type) => {
      const { updateFormData } = get();

      if (type === "local") {
        updateFormData({
          connectionType: type,
          authenticationType: "windows",
          server: "",
          user: "",
          password: "",
        });
      } else {
        updateFormData({
          connectionType: type,
          server: "",
          authenticationType: "sql",
        });
      }
    },

    handleAuthenticationTypeChange: (type) => {
      get().updateFormData({ authenticationType: type });
    },

    handleServerChange: (server) => {
      get().updateFormData({ server });
    },

    handleUserChange: (user) => {
      get().updateFormData({ user });
    },

    handlePasswordChange: (password) => {
      get().updateFormData({ password });
    },

    // API actions
    detectLocalInstance: async () => {
      const { setDetectingLocal, setError, setLocalInstance, updateFormData } =
        get();

      setDetectingLocal(true);
      setError("");

      try {
        console.log("🔍 Debug: Detecting local SQL Server instances");

        const response = await apiService.detectLocalInstances();
        console.log("🔍 Debug: Local instance detection response:", response);

        if (
          response.data.success &&
          response.data.data &&
          response.data.data.instances.length > 0
        ) {
          const instance = response.data.data.instances[0];
          setLocalInstance(instance);
          updateFormData({ server: instance.connectionString });
          console.log(
            "✅ Debug: Local instance detected:",
            instance.connectionString
          );
          return instance;
        } else {
          const error =
            response.data.error || "No local SQL Server instances found";
          setError(error);
          console.error("❌ Debug: Local instance detection failed:", error);
          return null;
        }
      } catch (err) {
        console.error(
          "🔍 Debug: Exception during local instance detection:",
          err
        );
        const error =
          "Failed to detect local SQL Server instances. Please check if SQL Server is running.";
        setError(error);
        return null;
      } finally {
        setDetectingLocal(false);
      }
    },

    submitForm: async () => {
      const { formData, localInstance, setLoading, setError } = get();

      console.log("🔍 Debug: Form submitted", {
        ...formData,
        hasPassword: !!formData.password,
      });

      setLoading(true);
      setError("");

      try {
        // Validate form data
        console.log("🔍 Debug: About to validate formData:", formData);
        const validatedData = ConnectionFormSchema.parse(formData);
        console.log(
          "🔍 Debug: Validation passed, validatedData:",
          validatedData
        );

        console.log("🔍 Debug: Making API call to /api/v1/test-connection");

        const dbConfig: DatabaseOperationConfig = {
          server: validatedData.server,
          user: validatedData.user,
          password: validatedData.password,
          authenticationType: validatedData.authenticationType,
        };

        console.log("🔍 Debug: dbConfig being sent to API:", {
          ...dbConfig,
          password: dbConfig.password ? "***" : undefined,
        });

        const response = await apiService.testConnection(dbConfig);
        console.log("🔍 Debug: API Response:", response);

        if (response.data.success) {
          console.log("🔍 Debug: Connection successful, adding to store");

          // Import here to avoid circular dependency
          const { useConnectionsStore } = await import(
            "@/frontend_lib/store/useConnectionsStore"
          );
          const { useModalStore } = await import(
            "@/frontend_lib/store/useModalStore"
          );

          const addConnection = useConnectionsStore.getState().addConnection;
          const closeModal = useModalStore.getState().closeConnectionModal;

          const connectionName =
            validatedData.connectionType === "local"
              ? `Local SQL Server${
                  localInstance?.instanceName
                    ? ` (${localInstance.instanceName})`
                    : ""
                }`
              : validatedData.server;

          addConnection({
            server: validatedData.server,
            user: validatedData.user,
            password: validatedData.password,
            authenticationType: validatedData.authenticationType,
            connectionType: validatedData.connectionType,
            name: connectionName,
            online: true,
          });

          closeModal();
          return { success: true };
        } else {
          console.error("🔍 Debug: Connection failed:", response.data.error);
          setError(response.data.error || "Connection failed");
          return { success: false, error: response.data.error };
        }
      } catch (error) {
        console.error("🔍 Debug: Exception during connection test:", error);

        if (error instanceof z.ZodError) {
          const errorMessage = error.issues
            .map((issue) => issue.message)
            .join(", ");
          setError(errorMessage);
          return { success: false, error: errorMessage };
        }

        const errorMessage =
          error instanceof Error
            ? error.message
            : "An unexpected error occurred";
        setError(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setLoading(false);
      }
    },

    resetForm: () => {
      set({
        formData: initialFormData,
        error: "",
        localInstance: null,
        detectingLocal: false,
      });
    },
  })
);
