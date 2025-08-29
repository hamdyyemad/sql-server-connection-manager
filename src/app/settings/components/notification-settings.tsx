import NotificationSettingsForm from "./notification-settings/notification-settings-form";

export default function NotificationSettings() {
  return (
    <div className="space-y-6">
      <div>
        <h4 className="text-xl font-semibold text-white mb-2">
          Notification Preferences
        </h4>
        <p className="text-gray-400">
          Configure how you want to receive notifications.
        </p>
      </div>
      <NotificationSettingsForm />
    </div>
  );
}
