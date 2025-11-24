/**
 * Google Authentication Configuration
 *
 * This file contains the configuration for Google Sign-In.
 * You need to set up Google OAuth credentials in your Google Cloud Console.
 */

export const GOOGLE_AUTH_CONFIG = {
  // Web Client ID from Google Cloud Console
  // This is required for both Android and iOS
  webClientId:
    process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID || "your-google-web-client-id",

  // iOS Client ID (optional, for iOS-specific configuration)
  iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,

  // Scopes for what data we want to access
  scopes: ["email", "profile"],

  // Enable offline access
  offlineAccess: true,

  // Force code for refresh token (for server-side authentication)
  forceCodeForRefreshToken: true,
};

/**
 * Setup Instructions:
 *
 * 1. Go to Google Cloud Console (https://console.cloud.google.com/)
 * 2. Create a new project or select existing one
 * 3. Enable Google+ API
 * 4. Go to "Credentials" and create OAuth 2.0 Client IDs:
 *    - Web application (for webClientId)
 *    - iOS application (for iOS bundle ID)
 *    - Android application (for Android package name and SHA-1)
 *
 * 5. Add your environment variables to .env file:
 *    EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=your-web-client-id
 *    EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID=your-ios-client-id
 *
 * 6. For Android, add SHA-1 fingerprint:
 *    - Get SHA-1: keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android
 *    - Add it to your Android OAuth client in Google Cloud Console
 *
 * 7. For iOS, make sure your bundle identifier matches the one in Google Cloud Console
 */
