
/**
 * Core User entity representing a user of the application
 */
export interface User {
  id: string;
  displayName: string;
  email?: string;
  bio?: string;
  avatarUrl?: string;
  createdAt: string;
  preferences: UserPreferences;
}

export interface UserPreferences {
  darkMode: boolean;
  reminderEnabled: boolean;
  privacySettings: PrivacySettings;
}

export interface PrivacySettings {
  shareActivity: boolean;
  showStreak: boolean;
  allowFriendRequests: boolean;
}
