import React from "react";
import { View, Text, TouchableOpacity, Image, Alert, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
const { useNavigation } = require("@react-navigation/native");
import { SafeAreaView } from "react-native-safe-area-context";
import { AppStatusBar } from "../../helpers/AppStatusBar";
import { Theme } from "@/constants";

const ProfilePhotoScreen: React.FC = () => {
  const navigation: any = useNavigation();

  const handleViewPhotoLibrary = () => {
    Alert.alert("Photo Library", "This would open the photo library to select a profile photo.");
  };

  const handleTakePhoto = () => {
    Alert.alert("Camera", "This would open the camera to take a new profile photo.");
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
        <AppStatusBar barStyle='light-content' />
        <View className="flex-1 px-4 pt-14">
          {/* Header */}
          <View className="flex-row items-center mb-6">
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              className="mr-4"
            >
              <AntDesign name="arrowleft" size={24} color="white" />
            </TouchableOpacity>
            <Text className="text-white text-lg font-bold">Profile Photo</Text>
          </View>

          {/* Current Photo Display */}
          <View className="items-center mb-8">
            <View className="w-32 h-32 rounded-full bg-[#161A23] items-center justify-center mb-4">
              <Text className="text-white text-2xl font-bold">HW</Text>
            </View>
            <Text className="text-white text-base font-medium">HARSH WARDHAN</Text>
          </View>

          {/* Photo Options */}
          <View className="bg-[#161A23] rounded-xl p-6 mb-6">
            <Text className="text-white text-lg font-bold mb-4 text-center">
              Update Profile Photo
            </Text>
            
            <TouchableOpacity
              className="flex-row items-center justify-center bg-[#3A4049] rounded-xl py-4 mb-4"
              onPress={handleViewPhotoLibrary}
            >
              <Feather name="image" size={20} color="white" className="mr-3" />
              <Text className="text-white font-semibold text-base ml-3">
                View Photo Library
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-row items-center justify-center bg-[#3A4049] rounded-xl py-4"
              onPress={handleTakePhoto}
            >
              <Feather name="camera" size={20} color="white" className="mr-3" />
              <Text className="text-white font-semibold text-base ml-3">
                Take Photo
              </Text>
            </TouchableOpacity>
          </View>

          {/* Info Text */}
          <View className="px-2">
            <Text className="text-gray-400 text-sm text-center leading-5">
              Choose a clear, well-lit photo that shows your face clearly. 
              This photo will be visible to other users in the app.
            </Text>
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

export default ProfilePhotoScreen;
