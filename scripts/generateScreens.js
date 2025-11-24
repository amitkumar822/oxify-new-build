const fs = require("fs");
const path = require("path");

// Screen definitions with their folder structure
const screenDefinitions = {
  // Auth screens
  "auth/WelcomeScreen": "Welcome Screen",
  "auth/LoginSelectionScreen": "Login Selection Screen",
  "auth/LoginEmailScreen": "Login Email Screen",
  "auth/LoginPasswordScreen": "Login Password Screen",
  "auth/ForgotPasswordEmailScreen": "Forgot Password Email Screen",
  "auth/ForgotPasswordVerificationScreen":
    "Forgot Password Verification Screen",
  "auth/ForgotPasswordNewScreen": "Forgot Password New Screen",
  "auth/ForgotPasswordConfirmScreen": "Forgot Password Confirm Screen",
  "auth/ForgotPasswordSuccessScreen": "Forgot Password Success Screen",
  "auth/SignupNameScreen": "Signup Name Screen",
  "auth/SignupTimezoneScreen": "Signup Timezone Screen",
  "auth/SignupHealthGoalsScreen": "Signup Health Goals Screen",
  "auth/SignupEmailScreen": "Signup Email Screen",
  "auth/SignupEmailVerificationScreen": "Signup Email Verification Screen",
  "auth/SignupPasswordScreen": "Signup Password Screen",
  "auth/SignupPasswordConfirmScreen": "Signup Password Confirm Screen",
  "auth/SignupSuccessScreen": "Signup Success Screen",

  // Main screens
  "main/DashboardScreen": "Dashboard Screen",
  "main/ChamberSelectionScreen": "Chamber Selection Screen",
  "main/SessionDetailsScreen": "Session Details Screen",

  // Session screens
  "session/SessionSetupScreen": "Session Setup Screen",
  "session/SessionReadyScreen": "Session Ready Screen",
  "session/SessionInProgressScreen": "Session In Progress Screen",
  "session/SessionCompletedScreen": "Session Completed Screen",
  "session/SessionSavedScreen": "Session Saved Screen",

  // Profile screens
  "profile/ProfileHubScreen": "Profile Hub Screen",
  "profile/ManageAccountScreen": "Manage Account Screen",
  "profile/DeleteAccountScreen": "Delete Account Screen",
  "profile/EditGenderScreen": "Edit Gender Screen",
  "profile/EditNameScreen": "Edit Name Screen",
  "profile/EditDateOfBirthScreen": "Edit Date of Birth Screen",
  "profile/ChangePasswordScreen": "Change Password Screen",
  "profile/ProfilePhotoScreen": "Profile Photo Screen",

  // Settings screens
  "settings/SettingsChangePasswordScreen": "Settings Change Password Screen",
  "settings/SettingsPushNotificationsScreen":
    "Settings Push Notifications Screen",
  "settings/SettingsEmailPreferencesScreen":
    "Settings Email Preferences Screen",
  "settings/SettingsClearCacheScreen": "Settings Clear Cache Screen",
  "settings/SettingsChamberModelScreen": "Settings Chamber Model Screen",

  // Content screens
  "content/FavoriteProtocolsScreen": "Favorite Protocols Screen",
  "content/SavedArticlesScreen": "Saved Articles Screen",
  "content/MilestoneBadgesScreen": "Milestone Badges Screen",
  "content/MilestoneShareScreen": "Milestone Share Screen",

  // Analytics screens
  "analytics/SessionCalendarScreen": "Session Calendar Screen",
  "analytics/StatisticsDashboardScreen": "Statistics Dashboard Screen",

  // HBOT Hub screens
  "hbot/ProtocolsHubScreen": "Protocols Hub Screen",
  "hbot/LearningArticlesScreen": "Learning Articles Screen",
  "hbot/CommunityCommentsScreen": "Community Comments Screen",
};

// Template for placeholder screen
const getScreenTemplate = (
  componentName,
  displayName
) => `import React from 'react';
import PlaceholderScreen from '../PlaceholderScreen';

const ${componentName}: React.FC = () => {
  return <PlaceholderScreen screenName="${displayName}" />;
};

export default ${componentName};
`;

// Create screens
Object.entries(screenDefinitions).forEach(([screenPath, displayName]) => {
  const componentName = path.basename(screenPath);
  const folderPath = path.dirname(screenPath);
  const fullFolderPath = path.join("screens", folderPath);
  const fullFilePath = path.join(fullFolderPath, `${componentName}.tsx`);

  // Create directory if it doesn't exist
  if (!fs.existsSync(fullFolderPath)) {
    fs.mkdirSync(fullFolderPath, { recursive: true });
  }

  // Create screen file
  const screenContent = getScreenTemplate(componentName, displayName);
  fs.writeFileSync(fullFilePath, screenContent);

  console.log(`Created: ${fullFilePath}`);
});

console.log("All placeholder screens created successfully!");
