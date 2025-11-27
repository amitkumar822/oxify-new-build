import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  TextInput,
  StyleSheet,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
const { useNavigation } = require("@react-navigation/native");
import { useChangePassword, useProfile } from "../../hooks/useProfile";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppStatusBar } from "../../helpers/AppStatusBar";
import { TEXT_SIZES } from "@/constants/textSizes";
import { Theme } from "@/constants";

const ChangePasswordScreen: React.FC = () => {
  const navigation: any = useNavigation();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCurrentFocused, setIsCurrentFocused] = useState(false);
  const [isNewFocused, setIsNewFocused] = useState(false);
  const [isConfirmFocused, setIsConfirmFocused] = useState(false);

  const changePasswordMutation = useChangePassword();
  const { data: profileData }: { data: any } = useProfile();

  // Get user email from profile
  const userEmail = profileData?.data?.data?.email || "";

  // Password validation functions
  const hasMinLength = newPassword.length >= 8 && newPassword.length <= 32;
  const hasLowercase = /[a-z]/.test(newPassword);
  const hasUppercase = /[A-Z]/.test(newPassword);
  const hasNumber = /\d/.test(newPassword);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);

  const handleChangePassword = async () => {
    // Validation
    if (!userEmail) {
      Alert.alert("Error", "Unable to get user email. Please try again.");
      return;
    }

    if (!currentPassword.trim()) {
      Alert.alert("Error", "Please enter your current password");
      return;
    }

    if (!newPassword.trim()) {
      Alert.alert("Error", "Please enter a new password");
      return;
    }

    if (newPassword.length < 8 || newPassword.length > 32) {
      Alert.alert(
        "Error",
        "New password must be between 8 and 32 characters long"
      );
      return;
    }

    if (!hasLowercase) {
      Alert.alert(
        "Error",
        "New password must include at least one lowercase character"
      );
      return;
    }

    if (!hasUppercase) {
      Alert.alert(
        "Error",
        "New password must include at least one uppercase character"
      );
      return;
    }

    if (!hasNumber) {
      Alert.alert("Error", "New password must include at least one number");
      return;
    }

    if (!hasSpecialChar) {
      Alert.alert(
        "Error",
        "New password must include at least one special character"
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "New password and confirm password do not match");
      return;
    }

    try {
      setIsLoading(true);

      const resp: any = await changePasswordMutation.mutateAsync({
        email: userEmail,
        old_password: currentPassword,
        new_password: newPassword,
        confirm_password: confirmPassword,
      });

      if (resp?.success) {
        Alert.alert("Success", "Password changed successfully", [
          { text: "OK", onPress: () => navigation.goBack() },
        ]);
      } else {
        const message = resp?.error || "Failed to change password";
        Alert.alert("Error", message);
      }
    } catch (error) {
      console.error("Failed to change password:", error);
      // Error handling is done in the hook
    } finally {
      setIsLoading(false);
    }
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
        <View className="flex-1 px-4 py-4 pb-[100px]">
          {/* Header */}
          <View className="relative flex-row items-center justify-center mb-6">
            {/* Back Button */}
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              className="absolute left-0"
            >
              <AntDesign name="left" size={24} color="white" />
            </TouchableOpacity>

            {/* Center Title */}
            <Text
              className="text-white font-semibold"
              style={{
                fontFamily: "InterRegular",
                textAlign: "center",
                fontSize: 18,
              }}
            >
              Change Password
            </Text>
          </View>

          {/* Content Area - Takes available space */}
          <View className="flex-1">
            {/* Password Input Fields */}
            <View className="space-y-6">
              {/* Old Password */}
              <View>
                <Text
                  className="text-white mb-2"
                  style={{ fontSize: TEXT_SIZES.sm }}
                >
                  Old password
                </Text>
                <View
                  className="bg-white rounded-[12px] px-4 mb-4 flex-row items-center justify-between"
                  style={{
                    borderWidth: 2,
                    borderColor: isCurrentFocused ? "#8BAFCE" : "transparent",
                  }}
                >
                  <TextInput
                    value={currentPassword}
                    onChangeText={setCurrentPassword}
                    onFocus={() => setIsCurrentFocused(true)}
                    onBlur={() => setIsCurrentFocused(false)}
                    className="text-black  flex-1"
                    style={{
                      fontSize: TEXT_SIZES.sm,
                      paddingVertical: 14,
                      borderRadius: 12,
                    }}
                    placeholder="Enter your old password"
                    placeholderTextColor="#9CA3AF"
                    secureTextEntry={!showCurrentPassword}
                  />
                  <TouchableOpacity
                    onPress={() => setShowCurrentPassword(!showCurrentPassword)}
                  >
                    <Feather
                      name={showCurrentPassword ? "eye-off" : "eye"}
                      size={20}
                      color="#8BAFCE"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Create New Password */}
              <View>
                <Text
                  className="text-white mb-2 "
                  style={{ fontSize: TEXT_SIZES.sm }}
                >
                  Create new password
                </Text>
                <View
                  className="bg-white rounded-[12px] px-4 mb-4 flex-row items-center justify-between"
                  style={{
                    borderWidth: 2,
                    borderColor: isNewFocused ? "#8BAFCE" : "transparent",
                  }}
                >
                  <TextInput
                    value={newPassword}
                    onChangeText={setNewPassword}
                    onFocus={() => setIsNewFocused(true)}
                    onBlur={() => setIsNewFocused(false)}
                    className="text-black  flex-1"
                    style={{
                      fontSize: TEXT_SIZES.sm,
                      paddingVertical: 14,
                      borderRadius: 12,
                    }}
                    placeholder="Enter your new password"
                    placeholderTextColor="#9CA3AF"
                    secureTextEntry={!showNewPassword}
                  />
                  <TouchableOpacity
                    onPress={() => setShowNewPassword(!showNewPassword)}
                  >
                    <Feather
                      name={showNewPassword ? "eye-off" : "eye"}
                      size={20}
                      color="#8BAFCE"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Re-enter Password */}
              <View>
                <Text
                  className="text-white mb-2 "
                  style={{ fontSize: TEXT_SIZES.sm }}
                >
                  Re-enter password
                </Text>
                <View
                  className="bg-white rounded-[12px] px-4 mb-4 flex-row items-center justify-between"
                  style={{
                    borderWidth: 2,
                    borderColor: isConfirmFocused ? "#8BAFCE" : "transparent",
                  }}
                >
                  <TextInput
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    onFocus={() => setIsConfirmFocused(true)}
                    onBlur={() => setIsConfirmFocused(false)}
                    className="text-black  flex-1"
                    style={{
                      fontSize: TEXT_SIZES.sm,
                      paddingVertical: 14,
                      borderRadius: 12,
                    }}
                    placeholder="Enter your confirm password"
                    placeholderTextColor="#9CA3AF"
                    secureTextEntry={!showConfirmPassword}
                  />
                  <TouchableOpacity
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    <Feather
                      name={showConfirmPassword ? "eye-off" : "eye"}
                      size={20}
                      color="#8BAFCE"
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Password Requirements */}
            <View className="mt-4">
              <Text
                className="text-white mb-2"
                style={{ fontSize: TEXT_SIZES.sm }}
              >
                Your password must include:
              </Text>
              <View className="space-y-3">
                <View className="flex-row items-center">
                  <AntDesign
                    name="check"
                    size={16}
                    color={hasMinLength ? "#8BAFCE" : "white"}
                  />
                  <Text
                    className="text-white ml-3"
                    style={{ fontSize: TEXT_SIZES.sm }}
                  >
                    8-32 characters long
                  </Text>
                </View>
                <View className="flex-row items-center">
                  <AntDesign
                    name="check"
                    size={16}
                    color={hasLowercase ? "#8BAFCE" : "white"}
                  />
                  <Text
                    className="text-white ml-3"
                    style={{ fontSize: TEXT_SIZES.sm }}
                  >
                    1 lowercase character (a-z)
                  </Text>
                </View>
                <View className="flex-row items-center">
                  <AntDesign
                    name="check"
                    size={16}
                    color={hasUppercase ? "#8BAFCE" : "white"}
                  />
                  <Text
                    className="text-white ml-3"
                    style={{ fontSize: TEXT_SIZES.sm }}
                  >
                    1 uppercase character (A-Z)
                  </Text>
                </View>
                <View className="flex-row items-center">
                  <AntDesign
                    name="check"
                    size={16}
                    color={hasNumber ? "#8BAFCE" : "white"}
                  />
                  <Text
                    className="text-white ml-3"
                    style={{ fontSize: TEXT_SIZES.sm }}
                  >
                    1 number
                  </Text>
                </View>
                <View className="flex-row items-center">
                  <AntDesign
                    name="check"
                    size={16}
                    color={hasSpecialChar ? "#8BAFCE" : "white"}
                  />
                  <Text
                    className="text-white ml-3"
                    style={{ fontSize: TEXT_SIZES.sm }}
                  >
                    1 special character e.g. ! @ # $ %
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Update Button - Positioned at bottom */}
          <View className="pb-6">
            <TouchableOpacity
              className={`rounded-[36px] py-4 items-center ${
                isLoading ? "opacity-50" : ""
              }`}
              style={{ backgroundColor: "#6189AD", paddingVertical: 16 }}
              onPress={handleChangePassword}
              disabled={isLoading}
            >
              <Text
                className="text-white font-semibold"
                style={{ fontSize: TEXT_SIZES.sm }}
              >
                {isLoading ? "Updating..." : "Update"}
              </Text>
            </TouchableOpacity>
          </View>
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

export default ChangePasswordScreen;
