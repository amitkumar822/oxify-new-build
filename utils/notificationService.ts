import { Platform } from "react-native";
import { showToast } from "@/config/toast";

// Check if we're in Expo Go (which doesn't support expo-notifications properly)
const isExpoGo =
  __DEV__ && !(global as any).expo?.config?.extra?.eas?.projectId;

// Only import expo-notifications if not in Expo Go
let Notifications: any = null;

if (!isExpoGo) {
  try {
    Notifications = require("expo-notifications");

    // Configure notification behavior
    if (
      Notifications &&
      typeof Notifications.setNotificationHandler === "function"
    ) {
      Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: true,
          shouldPlaySound: true,
          shouldSetBadge: false,
        }),
      });
    }
  } catch (error) {
    console.warn("expo-notifications not available:", error);
  }
}

// Create a mock object for Expo Go or when notifications fail
if (!Notifications) {
  Notifications = {
    getPermissionsAsync: () =>
      Promise.resolve({ status: "undetermined", canAskAgain: false }),
    requestPermissionsAsync: () =>
      Promise.resolve({ status: "undetermined", canAskAgain: false }),
    scheduleNotificationAsync: () => Promise.resolve(),
    cancelAllScheduledNotificationsAsync: () => Promise.resolve(),
    setNotificationChannelAsync: () => Promise.resolve(),
    getExpoPushTokenAsync: () => Promise.resolve({ data: null }),
    AndroidNotificationPriority: {
      HIGH: "high",
    },
  };
}

export interface NotificationPermissionStatus {
  status: "granted" | "denied" | "undetermined";
  canAskAgain: boolean;
}

export class NotificationService {
  /**
   * Check current notification permission status
   */
  static async checkPermissionStatus(): Promise<NotificationPermissionStatus> {
    try {
      if (!Notifications || !Notifications.getPermissionsAsync) {
        return {
          status: "undetermined",
          canAskAgain: false,
        };
      }

      const { status, canAskAgain } = await Notifications.getPermissionsAsync();

      return {
        status: status as "granted" | "denied" | "undetermined",
        canAskAgain,
      };
    } catch (error) {
      console.error("Error checking notification permissions:", error);
      return {
        status: "undetermined",
        canAskAgain: false,
      };
    }
  }

  /**
   * Request notification permissions
   */
  static async requestPermissions(): Promise<NotificationPermissionStatus> {
    try {
      if (!Notifications || !Notifications.requestPermissionsAsync) {
        return {
          status: "undetermined",
          canAskAgain: false,
        };
      }

      const { status, canAskAgain } =
        await Notifications.requestPermissionsAsync({
          ios: {
            allowAlert: true,
            allowBadge: true,
            allowSound: true,
            allowAnnouncements: true,
          },
        });

      const result = {
        status: status as "granted" | "denied" | "undetermined",
        canAskAgain,
      };

      if (result.status === "granted") {
        showToast.success("Notifications enabled successfully!");

        // Register for push notifications if granted (this may fail silently)
        try {
          await this.registerForPushNotifications();
        } catch (pushError) {
          // Push token registration failed, but local notifications will work
        }
      } else if (result.status === "denied" && !canAskAgain) {
        showToast.error(
          "Notifications are disabled. Please enable them in device settings."
        );
      } else {
        showToast.error("Notification permission was denied");
      }

      return result;
    } catch (error) {
      console.error("Error requesting notification permissions:", error);
      showToast.error("Failed to request notification permissions");
      return {
        status: "undetermined",
        canAskAgain: false,
      };
    }
  }

  /**
   * Register for push notifications and get push token
   * Note: This will fail in Expo Go but works in development builds
   */
  static async registerForPushNotifications(): Promise<string | null> {
    try {
      if (!Notifications) {
        return null;
      }

      // Set up notification channel for Android (this works in Expo Go)
      if (
        Platform.OS === "android" &&
        Notifications.setNotificationChannelAsync
      ) {
        await Notifications.setNotificationChannelAsync("default", {
          name: "default",
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: "#FF231F7C",
        });
      }

      // Check if we're running in Expo Go (which doesn't support push tokens)
      const isExpoGo =
        __DEV__ && !(global as any).expo?.config?.extra?.eas?.projectId;

      if (isExpoGo) {
        // Skip push token registration in Expo Go
        return null;
      }

      // Check if we have a valid project ID from app.json
      const projectId =
        process.env.EXPO_PUBLIC_PROJECT_ID ||
        (global as any).expo?.config?.extra?.eas?.projectId;

      if (
        !projectId ||
        projectId === "" ||
        projectId === "your-expo-project-id"
      ) {
        // No valid project ID found, skipping push token registration
        return null;
      }

      if (!Notifications.getExpoPushTokenAsync) {
        return null;
      }

      const { data: token } = await Notifications.getExpoPushTokenAsync({
        projectId: projectId,
      });

      return token;
    } catch (error) {
      // Silently handle push token registration errors (common in Expo Go)
      // Local notifications will still work without push token
      return null;
    }
  }

  /**
   * Schedule a local notification (for testing)
   */
  static async scheduleTestNotification(): Promise<void> {
    try {
      if (!Notifications || !Notifications.scheduleNotificationAsync) {
        showToast.error("Notifications not available");
        return;
      }

      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Oxify Test Notification",
          body: "This is a test notification to verify that notifications are working properly.",
          data: { type: "test" },
        },
        trigger: { seconds: 2 },
      });

      showToast.success("Test notification scheduled!");
    } catch (error) {
      console.error("Error scheduling test notification:", error);
      showToast.error("Failed to schedule test notification");
    }
  }

  /**
   * Cancel all scheduled notifications
   */
  static async cancelAllNotifications(): Promise<void> {
    try {
      if (
        !Notifications ||
        !Notifications.cancelAllScheduledNotificationsAsync
      ) {
        return;
      }

      await Notifications.cancelAllScheduledNotificationsAsync();
    } catch (error) {
      console.error("Error cancelling notifications:", error);
    }
  }

  /**
   * Get notification settings info for display
   */
  static async getNotificationSettings(): Promise<{
    isEnabled: boolean;
    canAskAgain: boolean;
    status: string;
    pushTokenAvailable: boolean;
  }> {
    try {
      if (!Notifications || !Notifications.getPermissionsAsync) {
        return {
          isEnabled: false,
          canAskAgain: false,
          status: "Unknown",
          pushTokenAvailable: false,
        };
      }

      const { status, canAskAgain } = await Notifications.getPermissionsAsync();

      // Check if we're running in Expo Go
      const isExpoGo =
        __DEV__ && !(global as any).expo?.config?.extra?.eas?.projectId;

      let pushTokenAvailable = false;
      if (isExpoGo) {
        // In Expo Go, local notifications are available but push tokens are not
        pushTokenAvailable = false;
      } else {
        // Check if push notifications are properly configured for development builds
        const projectId =
          process.env.EXPO_PUBLIC_PROJECT_ID ||
          (global as any).expo?.config?.extra?.eas?.projectId;
        pushTokenAvailable = !!(
          projectId &&
          projectId !== "" &&
          projectId !== "your-expo-project-id"
        );
      }

      return {
        isEnabled: status === "granted",
        canAskAgain,
        status:
          status === "granted"
            ? "Enabled"
            : status === "denied"
            ? "Disabled"
            : "Not Set",
        pushTokenAvailable,
      };
    } catch (error) {
      console.error("Error getting notification settings:", error);
      return {
        isEnabled: false,
        canAskAgain: false,
        status: "Unknown",
        pushTokenAvailable: false,
      };
    }
  }

  /**
   * Schedule a daily reminder notification
   */
  static async scheduleDailyReminder(
    hour: number,
    minute: number,
    timeOfDay: "morning" | "evening"
  ): Promise<void> {
    if (!Notifications || !Notifications.scheduleNotificationAsync) {
      console.warn("Notifications not available for scheduling");
      return;
    }

    try {
      // Create notification content
      const title =
        timeOfDay === "morning" ? "Good Morning! 🌅" : "Good Evening! 🌆";
      const body =
        timeOfDay === "morning"
          ? "Time to start your day with a mindful session"
          : "Time to wind down with a peaceful session";

      // Schedule the notification
      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          sound: true,
          priority: Notifications.AndroidNotificationPriority.HIGH,
        },
        trigger: {
          hour,
          minute,
          repeats: true, // Repeat daily
        },
      });

      console.log(
        `📅 Scheduled daily ${timeOfDay} reminder at ${hour}:${minute
          .toString()
          .padStart(2, "0")}`
      );
    } catch (error) {
      console.error("Error scheduling daily reminder:", error);
      throw error;
    }
  }

  /**
   * Check if push notifications are properly configured
   */
  static isPushNotificationsConfigured(): boolean {
    if (!Notifications) {
      return false;
    }

    // Check if we're running in Expo Go (which doesn't support push tokens)
    const isExpoGo =
      __DEV__ && !(global as any).expo?.config?.extra?.eas?.projectId;

    if (isExpoGo) {
      // In Expo Go, we consider it "configured" for local notifications
      return true;
    }

    const projectId =
      process.env.EXPO_PUBLIC_PROJECT_ID ||
      (global as any).expo?.config?.extra?.eas?.projectId;
    return !!(
      projectId &&
      projectId !== "" &&
      projectId !== "your-expo-project-id"
    );
  }
}

export default NotificationService;