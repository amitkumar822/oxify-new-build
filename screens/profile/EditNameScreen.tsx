import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import AntDesign from "@expo/vector-icons/AntDesign";
const { useNavigation } = require("@react-navigation/native");
import { useUpdateProfile, useProfile } from "../../hooks/useProfile";
import { ProfileUpdateData } from "../../api/profile";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppStatusBar } from "../../helpers/AppStatusBar";
import { TEXT_SIZES } from "@/constants/textSizes";
import { Theme } from "@/constants";

const EditNameScreen: React.FC = () => {
  const navigation: any = useNavigation();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFirstNameFocused, setIsFirstNameFocused] = useState(false);
  const [isLastNameFocused, setIsLastNameFocused] = useState(false);

  const updateProfileMutation = useUpdateProfile();
  const { data: profileData }: { data: any} = useProfile();

  // Set initial values from profile data
  useEffect(() => {

    if (profileData?.data?.data) {
      const data = profileData.data.data as any;

      setFirstName(data.first_name || "");
      setLastName(data.last_name || "");
    } else {
      // console.log("🔍 EditNameScreen - No profile data available");
    }
  }, [profileData]);

  // Debug current state values
  // console.log("🔍 EditNameScreen - Current state:", { firstName, lastName });

  const handleSave = async () => {
    if (!firstName.trim() || !lastName.trim()) {
      Alert.alert("Error", "Please fill in both first name and last name");
      return;
    }

    setIsLoading(true);

    const profileData: ProfileUpdateData = {
      first_name: firstName.trim(),
      last_name: lastName.trim(),
    };

    try {
      const result = await updateProfileMutation.mutateAsync(profileData);
      if (result.success) {
        Alert.alert("Success", "Name updated successfully", [
          { text: "OK", onPress: () => navigation.goBack() },
        ]);
      }
    } catch (error) {
      // console.error("Failed to update name:", error);
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
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
        >
          <View className="flex-1 px-4 py-4">
            {/* Header */}
            <View className="flex-row items-center mb-6">
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                className=""
              >
                <AntDesign name="left" size={24} color="white" />
              </TouchableOpacity>
              <Text
                className="text-white  text-center flex-1 mr-6"
                style={{
                  fontFamily: "Inter",
                  fontSize: TEXT_SIZES.lg,
                  fontWeight: "600",
                }}
              >
                Edit Name
              </Text>
            </View>

            {/* Form */}
            <View className="flex-1">
              <Text
                className="text-white mb-2"
                style={{
                  fontFamily: "Inter",
                  fontSize: TEXT_SIZES.md,
                  fontWeight: "500",
                }}
              >
                Full name
              </Text>

              <View className="mb-4">
                <View
                  className="bg-white rounded-[14px] px-4 mb-2"
                  style={{
                    borderWidth: 2,
                    borderColor: isFirstNameFocused ? "#8BAFCE" : "transparent",
                  }}
                >
                  <TextInput
                    value={firstName}
                    onChangeText={setFirstName}
                    onFocus={() => setIsFirstNameFocused(true)}
                    onBlur={() => setIsFirstNameFocused(false)}
                    className="text-black font-medium"
                    style={{ fontSize: TEXT_SIZES.sm, paddingVertical: 14 }}
                    placeholder="First Name"
                    placeholderTextColor="#9CA3AF"
                  />
                </View>
              </View>

              <View className="mb-4">
                <View
                  className="bg-white rounded-[14px] px-4"
                  style={{
                    borderWidth: 2,
                    borderColor: isLastNameFocused ? "#8BAFCE" : "transparent",
                  }}
                >
                  <TextInput
                    value={lastName}
                    onChangeText={setLastName}
                    onFocus={() => setIsLastNameFocused(true)}
                    onBlur={() => setIsLastNameFocused(false)}
                    className="text-black font-medium"
                    style={{ fontSize: TEXT_SIZES.sm, paddingVertical: 14 }}
                    placeholder="Last Name"
                    placeholderTextColor="#9CA3AF"
                  />
                </View>
              </View>
            </View>

            {/* Update Button - Positioned at bottom */}
            <View className="pb-6">
              <TouchableOpacity
                className={`rounded-[36px]  items-center h-[54px]${
                  isLoading ? "opacity-50" : ""
                }`}
                style={{ backgroundColor: "#6189AD",paddingVertical: 14 }}
                onPress={handleSave}
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
        </KeyboardAvoidingView>
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

export default EditNameScreen;
