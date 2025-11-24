import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  Linking,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
const { useNavigation } = require("@react-navigation/native");
import { SafeAreaView } from "react-native-safe-area-context";
import { AppStatusBar } from "../../helpers/AppStatusBar";
import { TEXT_SIZES } from "@/constants/textSizes";
import { Theme } from "@/constants";

const SettingsPushNotificationsScreen: React.FC = () => {
  const navigation: any = useNavigation();
  const [notificationStatus, setNotificationStatus] = useState<
    "granted" | "denied" | "undetermined"
  >("undetermined");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkNotificationPermissions();
  }, []);

  const checkNotificationPermissions = async () => {
    // For development purposes, simulate checking permissions
    // In production, this would use expo-notifications or native modules
    try {
      // Simulate permission check - you can modify this value to test different states
      const simulatedStatus: "granted" | "denied" | "undetermined" = "denied";
      setNotificationStatus(simulatedStatus);
    } catch (error) {
      console.error("Error checking notification permissions:", error);
      setNotificationStatus("undetermined");
    } finally {
      setIsLoading(false);
    }
  };

  const requestNotificationPermissions = async () => {
    try {
      // Simulate permission request
      Alert.alert(
        "Permission Request",
        "This would normally request notification permissions. For now, we'll simulate the flow.",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Simulate Granted",
            onPress: () => {
              setNotificationStatus("granted");
              Alert.alert("Success", "Notifications have been enabled!");
            },
          },
          {
            text: "Simulate Denied",
            onPress: () => {
              setNotificationStatus("denied");
              Alert.alert(
                "Permission Denied",
                "To enable notifications, please go to your device settings and allow notifications for this app.",
                [
                  { text: "Cancel", style: "cancel" },
                  { text: "Open Settings", onPress: openAppSettings },
                ]
              );
            },
          },
        ]
      );
    } catch (error) {
      console.error("Error requesting notification permissions:", error);
      Alert.alert("Error", "Failed to request notification permissions.");
    }
  };

  const openAppSettings = () => {
    if (Platform.OS === "ios") {
      Linking.openURL("app-settings:");
    } else {
      Linking.openSettings();
    }
  };

  const getStatusInfo = () => {
    switch (notificationStatus) {
      case "granted":
        return {
          icon: <Feather name="check-circle" size={48} color="#4ECCA3" />,
          title: "App notifications enabled",
          description:
            "You're all set! You'll receive important updates about your hyperbaric oxygen therapy sessions, streaks, and other personalized notifications to help you stay on track with your wellness journey.",
          buttonText: "Manage Notifications",
          buttonAction: openAppSettings,
        };
      case "denied":
        return {
          icon: <Feather name="bell-off" size={48} color="#F87171" />,
          title: "App notifications disabled",
          description:
            "Enable notifications to receive session reminders, streak alerts, and important updates about your hyperbaric oxygen therapy. Stay connected with your wellness journey and never miss a session.",
          buttonText: "Open Settings",
          buttonAction: openAppSettings,
        };
      default:
        return {
          icon: <Feather name="bell" size={48} color="#9CA3AF" />,
          title: "Notification permission needed",
          description:
            "Allow notifications to receive session reminders, streak alerts, and important updates about your hyperbaric oxygen therapy. Stay connected with your wellness journey.",
          buttonText: "Enable Notifications",
          buttonAction: requestNotificationPermissions,
        };
    }
  };

  if (isLoading) {
    return (
      <LinearGradient
        colors={[
          Theme.backgroundGradient.start,
          Theme.backgroundGradient.middle,
          Theme.backgroundGradient.end,
        ]}
        start={{ x: 0.5, y: 1 }}
        end={{ x: 0.5, y: 0 }}
        // className="flex-1"
        style={{ flex: 1 }}
      >
        <View className="flex-1 justify-center items-center">
          <Text className="text-white">Loading...</Text>
        </View>
      </LinearGradient>
    );
  }

  const statusInfo = getStatusInfo();

  return (
    <LinearGradient
      colors={[
        Theme.backgroundGradient.start,
        Theme.backgroundGradient.middle,
        Theme.backgroundGradient.end,
      ]}
      start={{ x: 0.5, y: 1 }}
      end={{ x: 0.5, y: 0 }}
      // className="flex-1"
      style={{ flex: 1 }}
    >
      <SafeAreaView className="flex-1">
        <AppStatusBar barStyle="light-content" />
        <View className="flex-1 px-4 py-4">
          {/* Header */}
          <View className="relative items-center mb-6">
            {/* Back Button Left Side */}
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              className=" absolute left-0"
            >
              <AntDesign name="left" size={24} color="white" />
            </TouchableOpacity>

            {/* Title Center */}
            <Text
              className="text-white text-center font-semibold mr-6"
              style={{
                fontFamily: "Inter",
                fontSize: TEXT_SIZES.lg,
              }}
            >
              Push Notifications
            </Text>
          </View>

          {/* Content Area - Takes available space */}
          <View className="flex-1 items-start justify-start w-full rounded-[12px]">
            {/* Status Card */}
            <View
              className="p-6  flex flex-col  items-start justify-start bg-[#3A4049] rounded-[12px] w-full"
              style={{ backgroundColor: "#3A4049", borderRadius: 12 }}
            >
              {/* Bell Icon with diagonal line */}
              <View className="mb-2">
                <Feather name="bell-off" size={26} color="white" />
              </View>

              {/* Title */}
              <Text
                className="text-white mb-2 text-left"
                style={{ fontSize: TEXT_SIZES.lg }}
              >
                App notifications disabled
              </Text>

              {/* Description */}
              <Text
                className="text-gray-300 mb-4"
                style={{ fontSize: TEXT_SIZES.sm }}
              >
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat.
              </Text>

              {/* Open Settings Button */}
              <View className="w-full  items-start justify-start">
                <TouchableOpacity
                  className="px-6 py-2 rounded-full"
                  style={{ backgroundColor: "#6189AD" }}
                  onPress={openAppSettings}
                >
                  <Text
                    className="text-white font-semibold text-center"
                    style={{ fontSize: TEXT_SIZES.sm }}
                  >
                    Open Settings
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default SettingsPushNotificationsScreen;
