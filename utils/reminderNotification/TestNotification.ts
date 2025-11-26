import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

export const requestNotificationPermission = async () => {
  try {
    // Check current permission status first
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    
    if (existingStatus === 'granted') {
      console.log("Notification permission already granted");
    } else {
      // Request permission
      const { status } = await Notifications.requestPermissionsAsync({
        ios: {
          allowAlert: true,
          allowBadge: true,
          allowSound: true,
        },
      });
      
      if (status !== 'granted') {
        console.warn("Notification permission not granted:", status);
        alert("Permission required to send reminders! Please enable notifications in settings.");
      } else {
        console.log("Notification permission granted");
      }
    }

    // Android settings - set up notification channel
    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "Default",
        description: "Default notification channel",
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
        sound: "default",
      });
      console.log("Android notification channel configured");
    }
  } catch (error) {
    console.error("Error requesting notification permission:", error);
  }
};
