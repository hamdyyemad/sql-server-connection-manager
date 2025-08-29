import SecuritySettingsForm from "./security-settings/security-settings-form";

export default function SecuritySettings() {
  
  return (
    <div className="space-y-6">
      <div>
        <h4 className="text-xl font-semibold text-white mb-2">
          Security Settings
        </h4>
        <p className="text-gray-400">
          Manage your account security and authentication settings.
        </p>
      </div>

      <SecuritySettingsForm />
    </div>
  );
}
