"use client";

import {
  ProfileSettings,
  NotificationSettings,
  SecuritySettings,
  AppearanceSettings,
  SettingsLayout,
} from "./components";

import { useActiveTab } from "@/frontend_lib/hooks";

export default function Settings() {
  const { activeTab } = useActiveTab({
    tabs: ["profile", "notifications", "security", "appearance"],
  });

  return (
    <SettingsLayout activeTab={activeTab}>
      {activeTab === "profile" && <ProfileSettings />}

      {activeTab === "notifications" && <NotificationSettings />}

      {activeTab === "security" && <SecuritySettings />}

      {activeTab === "appearance" && <AppearanceSettings />}
    </SettingsLayout>
  );
}
