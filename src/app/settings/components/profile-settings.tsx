import ProfileSettingsForm from "./profile-settings/profile-settings-form";

export default function ProfileSettings() {
  return (
    <div className="space-y-6">
      <ProfileSettingHeader />
      <ProfileSettingsForm />
    </div>
  );
}

function ProfileSettingHeader() {
  return (
    <div>
      <h4 className="text-xl font-semibold text-white mb-2">
        Profile Settings
      </h4>
      <p className="text-gray-400">
        Update your personal information and profile details.
      </p>
    </div>
  );
}
