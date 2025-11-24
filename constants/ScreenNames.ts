/**
 * Screen Names Constants for Oxify v2 Application
 */

export const SCREEN_NAMES = {
  // Onboarding
  SPLASH: "SplashScreen",
  ONBOARDING_1: "OnboardingPage1",
  ONBOARDING_2: "OnboardingPage2",
  ONBOARDING_3: "OnboardingPage3",

  // Authentication
  WELCOME: "WelcomeScreen",
  LOGIN_SELECTION: "LoginSelectionScreen",
  LOGIN_EMAIL: "LoginEmailScreen",
  LOGIN_PASSWORD: "LoginPasswordScreen",
  FORGOT_PASSWORD_EMAIL: "ForgotPasswordEmailScreen",
  FORGOT_PASSWORD_VERIFICATION: "ForgotPasswordVerificationScreen",
  FORGOT_PASSWORD_NEW: "ForgotPasswordNewScreen",
  FORGOT_PASSWORD_CONFIRM: "ForgotPasswordConfirmScreen",
  FORGOT_PASSWORD_SUCCESS: "ForgotPasswordSuccessScreen",

  // Signup
  SIGNUP_NAME: "SignupNameScreen",
  SIGNUP_USERNAME: "SignupUsernameScreen",
  SIGNUP_TIMEZONE: "SignupTimezoneScreen",
  SIGNUP_HEALTH_GOALS: "SignupHealthGoalsScreen",
  SIGNUP_EMAIL: "SignupEmailScreen",
  SIGNUP_EMAIL_VERIFICATION: "SignupEmailVerificationScreen",
  SIGNUP_PASSWORD: "SignupPasswordScreen",
  SIGNUP_PASSWORD_CONFIRM: "SignupPasswordConfirmScreen",
  SIGNUP_SUCCESS: "SignupSuccessScreen",

  // Main App
  CHAMBER_SELECTION: "ChamberSelectionScreen",
  DASHBOARD: "DashboardScreen",
  PUSH_NOTIFICATIONS: "PushNotificationsScreen",
  STREAK_ACHIEVEMENT: "StreakAchievementScreen",
  SESSION_DETAILS: "SessionDetailsScreen",
  STREAK: "StreakScreen",
  NOTIFICATIONS: "NotificationsScreen",

  // Session Tracking
  SESSION_SETUP: "SessionSetupScreen",
  SESSION_READY: "SessionReadyScreen",
  SESSION_IN_PROGRESS: "SessionInProgressScreen",
  SESSION_COMPLETED: "SessionCompletedScreen",
  SESSION_SAVED: "SessionSavedScreen",

  // Profile
  PROFILE_HUB: "ProfileHubScreen",
  MANAGE_ACCOUNT: "ManageAccountScreen",
  DELETE_ACCOUNT: "DeleteAccountScreen",
  EDIT_GENDER: "EditGenderScreen",
  EDIT_NAME: "EditNameScreen",
  EDIT_DOB: "EditDateOfBirthScreen",
  CHANGE_PASSWORD: "ChangePasswordScreen",
  PROFILE_PHOTO: "ProfilePhotoScreen",

  // Settings
  SETTINGS_CHANGE_PASSWORD: "SettingsChangePasswordScreen",
  SETTINGS_PUSH_NOTIFICATIONS: "SettingsPushNotificationsScreen",
  SETTINGS_EMAIL_PREFERENCES: "SettingsEmailPreferencesScreen",
  SETTINGS_CLEAR_CACHE: "SettingsClearCacheScreen",
  SETTINGS_CHAMBER_MODEL: "SettingsChamberModelScreen",

  // Content
  FAVORITE_PROTOCOLS: "FavoriteProtocolsScreen",
  SAVED_ARTICLES: "SavedArticlesScreen",
  MY_ARTICLES: "MyArticlesScreen",
  ARTICLE_DETAILS: "ArticleDetailsScreen",
  MILESTONE_BADGES: "MilestoneBadgesScreen",
  MILESTONE_SHARE: "MilestoneShareScreen",

  // Analytics
  SESSION_CALENDAR: "SessionCalendarScreen",
  STATISTICS_DASHBOARD: "StatisticsDashboardScreen",

  // HBOT Hub
  PROTOCOLS_HUB: "ProtocolsHubScreen",
  LEARNING_ARTICLES: "LearningArticlesScreen",
  COMMUNITY_COMMENTS: "CommunityCommentsScreen",
} as const;

/**
 * Screen Categories
 */
export const SCREEN_CATEGORIES = {
  ONBOARDING: "onboarding",
  AUTHENTICATION: "authentication",
  MAIN_APP: "main_app",
  SESSION: "session",
  PROFILE: "profile",
  SETTINGS: "settings",
  CONTENT: "content",
  ANALYTICS: "analytics",
  HBOT_HUB: "hbot_hub",
} as const;
