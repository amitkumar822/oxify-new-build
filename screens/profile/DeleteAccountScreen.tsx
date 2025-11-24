import React, { useState } from "react";
import { View, Text, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import AntDesign from "@expo/vector-icons/AntDesign";
const { useNavigation } = require("@react-navigation/native");
import { SafeAreaView } from "react-native-safe-area-context";
import { AppStatusBar } from "../../helpers/AppStatusBar";
import { TEXT_SIZES } from "@/constants/textSizes";
import { Theme } from "@/constants";
import { authApi } from "@/api/auth";
import { showToast } from "@/config/toast";
import { queryClient } from "@/config/queryClient";
import { logout } from "@/utils/tokenManager";
import { useAuth } from "@/contexts/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

const DeleteAccountScreen: React.FC = () => {
  const navigation: any = useNavigation();
  const { logout: authLogout } = useAuth();
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Function to clear all user data and cache
  const clearAllUserData = async () => {
    try {
      // Clear React Query cache
      queryClient.clear();

      // Clear all AsyncStorage data
      await AsyncStorage.clear();

      // Additional logout cleanup (redundant but safe)
      await logout();

      console.log("All user data and cache cleared successfully");
    } catch (error) {
      console.error("Error clearing user data:", error);
    }
  };

  const handleDeleteAccount = async () => {
    if (!isConfirmed) {
      Alert.alert(
        "Error",
        "Please confirm that you want to delete your account."
      );
      return;
    }
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete Account",
          style: "destructive",
          onPress: async () => {
            setIsLoading(true);
            try {
              console.log("🗑️ Delete Account - Starting deletion process");
              const response = await authApi.deleteProfile();
              console.log("🗑️ Delete Account - API Response:", response);

              if (response.success) {
                console.log("🗑️ Delete Account - Success, clearing user data");
                // Clear all data and cache
                await clearAllUserData();

                // Use AuthContext logout to properly handle navigation
                await authLogout();

                showToast.success("Account deleted successfully");
                // Navigation will be handled automatically by AuthGuard
              } else {
                console.error("🗑️ Delete Account - API Error:", {
                  success: response.success,
                  error: response.error,
                  status: response.status,
                });
                showToast.error(response.error || "Failed to delete account");
              }
            } catch (error) {
              console.error("🗑️ Delete Account - Network/Exception Error:", {
                error: error,
                message:
                  error instanceof Error ? error.message : "Unknown error",
                stack: error instanceof Error ? error.stack : undefined,
              });
              showToast.error(
                "Network error while deleting account. Please try again."
              );
            } finally {
              setIsLoading(false);
            }
          },
        },
      ]
    );
  };

  return (
    <LinearGradient
      colors={[
        Theme.backgroundGradient.start,
        Theme.backgroundGradient.middle,
        Theme.backgroundGradient.end,
      ]}
      start={{ x: 0.5, y: 1 }}
      end={{ x: 0.5, y: 0 }}
      style={styles.gradient}
    >
      <SafeAreaView className="flex-1">
        <AppStatusBar barStyle="light-content" />
        <View className=" px-5 py-4">
          {/* Header */}
          <View className="flex-row text-left mb-8">
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <AntDesign name="left" size={24} color="white" />
            </TouchableOpacity>
            <Text
              className="text-[#DDE2E5] text-center flex-1 mr-6 font-semibold"
              style={{ fontFamily: "Inter", fontSize: 18 }}
            >
              Delete Account
            </Text>
          </View>

          {/* Warning Message */}
          <Text
            className="text-[#DDE2E5] text-left mb-6 "
            style={{
              fontFamily: "Inter",
              fontSize: 19,
              fontWeight: "600",
            }}
          >
            Are you sure you want to delete your account? (This cannot be
            undone)
          </Text>

          {/* Consequences Section */}
          <Text
            className="text-[#DDE2E5] mb-4"
            style={{
              fontFamily: "Inter",
              fontSize: 14,
              fontWeight: "700",
            }}
          >
            If you delete your account:
          </Text>

          {/* Account Deletion Consequences */}
          <View className="mb-8">
            <Text
              className="text-[#DDE2E5]  mb-3"
              style={{ fontSize: 12 }}
            >
              • All your hyperbaric oxygen therapy session history and progress
              data will be permanently deleted
            </Text>
            <Text
              className="text-[#DDE2E5]  mb-3"
              style={{ fontSize: 12 }}
            >
              • Your personalized HBOT protocols, health goals, and treatment
              preferences will be lost
            </Text>
            <Text
              className="text-[#DDE2E5] mb-3"
              style={{ fontSize: 12 }}
            >
              • Your streak tracking, achievements, and wellness journey
              progress will be erased
            </Text>
            <Text
              className="text-[#DDE2E5] mb-3"
              style={{ fontSize: 12 }}
            >
              • You will lose access to your saved articles, favorite protocols,
              and educational content
            </Text>
            <Text
              className="text-[#DDE2E5] mb-3"
              style={{ fontSize: 12 }}
            >
              • Your account cannot be recovered and you will need to create a
              new account to use Oxify again
            </Text>
          </View>

          {/* Confirmation Checkbox */}
          <View className="flex-row items-center mb-8">
            <TouchableOpacity
              onPress={() => setIsConfirmed(!isConfirmed)}
              className={`w-5 h-5 rounded  mr-3 items-center justify-center ${
                isConfirmed
                  ? "bg-[#6189AD] border-[#6189AD]"
                  : "bg-white border-[#6189AD]"
              }`}
            >
              {isConfirmed && (
                <AntDesign name="check" size={14} color="white" />
              )}
            </TouchableOpacity>
            <Text
              className="text-[#DDE2E5]"
              style={{ fontFamily: "Inter", fontSize: 14 }}
            >
              Yes, I want to delete my account
            </Text>
          </View>

          {/* Delete Button */}
          <TouchableOpacity
            className={`rounded-[36px] py-4 items-center ${
              isConfirmed && !isLoading ? "opacity-100" : "opacity-60"
            }`}
            style={{ backgroundColor: "#EB43354D" }}
            onPress={handleDeleteAccount}
            disabled={!isConfirmed || isLoading}
          >
            <Text
              className="text-[#EB4335]"
              style={{ fontFamily: "Inter", fontSize: 18, fontWeight: "700" }}
            >
              {isLoading ? "Deleting..." : "Delete account"}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
});

export default DeleteAccountScreen;
