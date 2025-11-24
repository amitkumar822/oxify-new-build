import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import AntDesign from "@expo/vector-icons/AntDesign";
const { useNavigation } = require("@react-navigation/native");
import { useUpdateProfile, useProfile } from "../../hooks/useProfile";
import { ProfileUpdateData } from "../../api/profile";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppStatusBar } from "../../helpers/AppStatusBar";
import { TEXT_SIZES } from "@/constants/textSizes";
import { Theme } from "@/constants";

const Option = ({
  selected,
  label,
  onPress,
}: {
  selected: boolean;
  label: string;
  onPress: () => void;
}) => (
  <TouchableOpacity onPress={onPress} className="flex-row items-center py-4">
    {/* Radio Button */}
    <View
      className={`w-5 h-5 rounded-full  mr-4 items-center justify-center border-2 ${
        selected ? "border-[#6189AD]  bg-white border-4" : "border-[#89a8c2] "
      }`}
    >
      {selected && <View className="w-2.5 h-2.5 rounded-full bg-white" />}
    </View>

    {/* Label */}
    <Text
      style={{ fontSize: TEXT_SIZES.sm }}
      className={`font-medium ${selected ? "text-white" : "text-white"}`}
    >
      {label}
    </Text>
  </TouchableOpacity>
);

const EditGenderScreen: React.FC = () => {
  const navigation: any = useNavigation();
  const [gender, setGender] = useState("Male");
  const [isLoading, setIsLoading] = useState(false);

  const updateProfileMutation = useUpdateProfile();
  const { data: profileData } = useProfile();

  // Set initial values from profile data
  useEffect(() => {
    const prof: any = (profileData as any)?.data?.data;
    if (prof?.gender) {
      setGender(prof.gender);
    }
  }, [profileData]);

  const handleSave = async () => {
    setIsLoading(true);

    const profileData: ProfileUpdateData = {
      gender: gender,
    };

    try {
      const result = await updateProfileMutation.mutateAsync(profileData);
      if (result.success) {
        Alert.alert("Success", "Gender updated successfully", [
          { text: "OK", onPress: () => navigation.goBack() },
        ]);
      }
    } catch (error) {
      console.error("Failed to update gender:", error);
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
        <View className="flex-1 px-4 py-4">
          {/* Header */}
          <View className="flex-row items-center mb-6">
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              className="mr-2"
            >
              <AntDesign name="left" size={24} color="white" />
            </TouchableOpacity>
            <Text
              className="text-white   text-center flex-1"
              style={{ fontFamily: "Inter", fontSize: TEXT_SIZES.lg }}
            >
              Edit Gender
            </Text>
          </View>

          {/* Content Area - Takes available space */}
          <View className="flex-1 ">
            {/* Gender Selection Card */}
            <View className="bg-[#3A4049] rounded-[12px] px-4">
              <Option
                selected={gender === "Male"}
                label="Male"
                onPress={() => setGender("Male")}
              />

              {/* Separator Line */}
              <View className="h-px bg-[#555555] my-1" />

              <Option
                selected={gender === "Female"}
                label="Female"
                onPress={() => setGender("Female")}
              />

              {/* Separator Line */}
              <View className="h-px bg-[#555555] my-1" />

              <Option
                selected={gender === "Others"}
                label="Others"
                onPress={() => setGender("Others")}
              />
            </View>
          </View>

          {/* Update Button - Positioned at bottom */}
          <View className="pb-6">
            <TouchableOpacity
              className={`rounded-[36px] py-4 items-center h-[54px] ${
                isLoading ? "opacity-50" : ""
              }`}
              style={{ backgroundColor: "#6189AD",paddingVertical: 16 }}
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

export default EditGenderScreen;
