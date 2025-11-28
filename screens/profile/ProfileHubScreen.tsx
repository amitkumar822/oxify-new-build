import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  Linking,
  Modal,
  Animated,
  Dimensions,
  Platform,
  StyleSheet,
  RefreshControl,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
const { useNavigation } = require("@react-navigation/native");
import { SCREEN_NAMES } from "../../constants";
import { useAuth } from "../../contexts/AuthContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppStatusBar } from "../../helpers/AppStatusBar";
import { TEXT_SIZES } from "@/constants/textSizes";
import { useProfile } from "@/hooks_main/useProfile";
import { useUpdateProfile } from "@/hooks_main/useSession";
import * as ImagePicker from "expo-image-picker";
import SkeletonLoader from "@/components/common/SkeletonLoader";
import { Image } from "expo-image";
import { ImageCompress } from "@/utils/ImageCompress";

const { height } = Dimensions.get("window");

const ProfileHubScreen: React.FC = () => {
  const navigation: any = useNavigation();
  const { logout } = useAuth();
  const { data: profileData, isLoading: isProfileLoading, refetch: refetchProfile } = useProfile();
  const updateProfileMutation = useUpdateProfile();

  const profile: any = (profileData as any)?.data?.data;
  const firstName: string = profile?.first_name || "";
  const lastName: string = profile?.last_name || "";
  const email: string = profile?.email || "";
  const username: string = profile?.username || "";
  const profileImage: string = profile?.image || "";
  const fullName: string = `${firstName} ${lastName}`.trim() || "User";
  const initialsRaw =
    `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase();
  const initials =
    initialsRaw || (email ? email.slice(0, 2).toUpperCase() : "U");

  const [photoModalVisible, setPhotoModalVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const slideAnim = useRef(new Animated.Value(height)).current;

  // Improved animation handling
  useEffect(() => {
    if (photoModalVisible && !isClosing) {
      // Open modal with animation
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else if (isClosing) {
      // Close modal with animation
      Animated.timing(slideAnim, {
        toValue: height,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        // After animation completes, hide the modal
        setPhotoModalVisible(false);
        setIsClosing(false);
      });
    }
  }, [photoModalVisible, isClosing]);

  const handleCloseModal = () => {
    // Trigger closing animation
    setIsClosing(true);
  };

  const requestPermissions = async () => {
    if (Platform.OS !== "web") {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission needed",
          "Sorry, we need camera roll permissions to make this work!"
        );
        return false;
      }
    }
    return true;
  };

  const handleViewPhotoLibrary = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    // ✅ compress before upload
    const image = result.assets?.[0]?.uri;
    const compressedImage = await ImageCompress(image!, 200);
    const imageUri = compressedImage?.uri;

    if (!result.canceled && imageUri) {
      setSelectedImage(imageUri);
      setPhotoModalVisible(false);

      // Upload image to server
      try {
        await updateProfileMutation.mutateAsync(imageUri);
        Alert.alert("Success", "Profile image updated successfully!");
      } catch (error) {
        Alert.alert(
          "Error",
          "Failed to update profile image. Please try again."
        );
      }
    }
  };

  const handleTakePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission needed",
        "Sorry, we need camera permissions to make this work!"
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    // ✅ compress before upload
    const image = result.assets?.[0]?.uri;
    const compressedImage = await ImageCompress(image!, 200);
    const imageUri = compressedImage?.uri;

    if (!result.canceled && imageUri) {
      setSelectedImage(imageUri);
      setPhotoModalVisible(false);

      // Upload image to server
      try {
        await updateProfileMutation.mutateAsync(imageUri);
        Alert.alert("Success", "Profile image updated successfully!");
      } catch (error) {
        Alert.alert(
          "Error",
          "Failed to update profile image. Please try again."
        );
      }
    }
  };

  const handleContactSupport = () => {
    Linking.openURL("mailto:support@oxify.com");
  };

  const handlePrivacyPolicy = () => {
    Linking.openURL("https://oxify.com/privacy");
  };

  const handleTermsConditions = () => {
    Linking.openURL("https://oxify.com/terms");
  };

  const handleItemPress = async (text: string) => {
    // Map text to destination. When stack is omitted, navigate within current stack.
    const navMap: Record<string, { screen: string; stack?: string }> = {
      "Manage account": { screen: SCREEN_NAMES.MANAGE_ACCOUNT },
      "Delete account": { screen: SCREEN_NAMES.DELETE_ACCOUNT },

      "Push notifications": {
        stack: "SettingsStack",
        screen: SCREEN_NAMES.SETTINGS_PUSH_NOTIFICATIONS,
      },
      "Email preferences": {
        stack: "SettingsStack",
        screen: SCREEN_NAMES.SETTINGS_EMAIL_PREFERENCES,
      },
      Cache: {
        stack: "SettingsStack",
        screen: SCREEN_NAMES.SETTINGS_CLEAR_CACHE,
      },
      "Chamber Model": {
        stack: "SettingsStack",
        screen: SCREEN_NAMES.SETTINGS_CHAMBER_MODEL,
      },

      "Favorite Protocols": {
        stack: "ContentStack",
        screen: SCREEN_NAMES.FAVORITE_PROTOCOLS,
      },
      "Saved Articles & Blogs": {
        stack: "ContentStack",
        screen: SCREEN_NAMES.SAVED_ARTICLES,
      },
      "My Articles": {
        stack: "ContentStack",
        screen: SCREEN_NAMES.MY_ARTICLES,
      },
      "Milestone Badges": {
        stack: "ContentStack",
        screen: SCREEN_NAMES.MILESTONE_BADGES,
      },
    };

    // Special cases for items without screens yet
    if (text === "Visit oxify.com") {
      await Linking.openURL("https://oxify.com");
      return;
    }
    if (
      text === "Send feedback" ||
      text === "Rate us" ||
      text === "Legal" ||
      text === "About"
    ) {
      Alert.alert(
        "Coming soon",
        "This screen will be available in a future update."
      );
      return;
    }

    const nav = navMap[text];
    if (!nav) {
      Alert.alert("Unavailable", "Navigation target not found.");
      return;
    }

    if (nav.stack) {
      navigation.navigate(nav.stack, { screen: nav.screen });
      return;
    }

    navigation.navigate(nav.screen);
  };

  const ProfileItem = ({
    icon,
    text,
    isLast = false,
  }: {
    icon: React.ReactNode;
    text: string;
    isLast?: boolean;
  }) => {
    return (
      <TouchableOpacity
        className={`flex-row items-center ms-14 ${
          !isLast ? "border-b border-white/10" : ""
        }`}
        onPress={() => handleItemPress(text)}
      >
        <View className="flex-row items-center -ml-8">
          <View className="mr-3 text-[#DDE2E5]">{icon}</View>
          <Text
            className={`text-[#DDE2E5] flex-1 py-4`}
            style={{ fontSize: 12, fontFamily: "InterRegular" }}
          >
            {text}
          </Text>

          <View className="pr-4">
            <AntDesign name="right" size={15} color="#DDE2E5" />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const handleLogout = async () => {
    try {
      await logout();
      // Navigation will be handled automatically by AuthGuard
    } catch (error) {
      Alert.alert("Error", "Failed to log out. Please try again.");
    }
  };

  const handleRefresh = async () => {
    await refetchProfile();
  };

  return (
    <LinearGradient
      colors={["#243551", "#171D27", "#14181B"]}
      style={styles.gradient}
    >
      <AppStatusBar barStyle="light-content" />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 130 }}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={isProfileLoading} onRefresh={handleRefresh} />}
      >
        <SafeAreaView className="flex-1 px-4">
          {/* Profile Header */}
          <View className="items-center mt-8 ">
            <View className="w-36 h-36 rounded-full bg-[#161A23] items-center justify-center relative">
              {isProfileLoading ? (
                <SkeletonLoader
                  width={134}
                  height={134}
                  borderRadius={72}
                  style={{ position: "absolute" }}
                />
              ) : selectedImage ? (
                <Image
                  source={{ uri: selectedImage }}
                  style={{
                    width: 134,
                    height: 134,
                    borderRadius: 72,
                  }}
                  contentFit="cover"
                />
              ) : profileImage ? (
                <Image
                  source={{ uri: profileImage }}
                  style={{
                    width: 134,
                    height: 134,
                    borderRadius: 72,
                  }}
                  contentFit="cover"
                />
              ) : (
                <Text className="text-white text-3xl font-bold">
                  {initials}
                </Text>
              )}

              {/* Edit Profile Photo Button */}
              {!isProfileLoading && (
                <TouchableOpacity
                  className="absolute bottom-[-6px] right-[2px] bg-white rounded-full p-1 border-4 border-[#171D27]"
                  style={{
                    zIndex: 10,
                    elevation: 10,
                  }}
                  onPress={() => setPhotoModalVisible(true)}
                >
                  <Feather name="edit-2" size={14} color="black" />
                </TouchableOpacity>
              )}
            </View>

            {/* Name Skeleton */}
            {isProfileLoading ? (
              <SkeletonLoader
                width={200}
                height={24}
                borderRadius={4}
                style={{ marginTop: 16 }}
              />
            ) : (
              <Text
                className="text-white font-semibold mt-4"
                style={{ fontSize: 18, fontFamily: "InterSemiBold" }}
              >
                {fullName}
              </Text>
            )}

            {/* Email Skeleton */}
            {isProfileLoading ? (
              <SkeletonLoader
                width={180}
                height={20}
                borderRadius={4}
                style={{ marginTop: 4 }}
              />
            ) : (
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: "InterRegular",
                  color: "#ABB0BC",
                  marginTop: 2,
                }}
              >
                {email || ""}
              </Text>
            )}
          </View>

          {/* --- General Section --- */}
          <View className="mt-6">
            <Text
              className="mb-2"
              style={{
                fontSize: 16,
                fontFamily: "InterMedium",
                color: "#DDE2E5",
              }}
            >
              General
            </Text>

            {/* Additional General Items */}
            <View className="bg-[#3A4049] rounded-xl mb-6">
              <ProfileItem
                icon={<Feather name="user" size={18} color="#DDE2E5" />}
                text="Manage account"
              />
              <ProfileItem
                icon={<Feather name="bell" size={18} color="#DDE2E5" />}
                text="Push notifications"
              />
              {/* <ProfileItem
                icon={<Feather name="mail" size={18} color="#DDE2E5" />}
                text="Email preferences"
              /> */}
              <ProfileItem
                icon={<Feather name="trash-2" size={18} color="#DDE2E5" />}
                text="Cache"
              />
              <ProfileItem
                icon={<Feather name="box" size={18} color="#DDE2E5" />}
                text="Chamber Model"
              />
              <ProfileItem
                icon={<Feather name="heart" size={18} color="#DDE2E5" />}
                text="Favorite Protocols"
              />
              <ProfileItem
                icon={<Feather name="bookmark" size={18} color="#DDE2E5" />}
                text="Saved Articles & Blogs"
              />
              <ProfileItem
                icon={<Feather name="edit-3" size={18} color="#DDE2E5" />}
                text="My Articles"
              />
              <ProfileItem
                icon={<Feather name="award" size={18} color="#DDE2E5" />}
                text="Milestone Badges"
                isLast
              />
            </View>
          </View>

          {/* Support Section */}
          <Text
            className="mb-2"
            style={{
              fontSize: 16,
              fontFamily: "InterMedium",
              color: "#DDE2E5",
            }}
          >
            Support
          </Text>

          <View className="bg-[#3A4049] rounded-xl mb-6">
            <ProfileItem
              icon={<Feather name="edit-3" size={18} color="#DDE2E5" />}
              text="Send feedback"
            />
            <ProfileItem
              icon={<AntDesign name="star" size={18} color="#DDE2E5" />}
              text="Rate us"
            />
            <ProfileItem
              icon={<Feather name="globe" size={18} color="#DDE2E5" />}
              text="Visit oxify.com"
            />
            <ProfileItem
              icon={<MaterialIcons name="gavel" size={18} color="#DDE2E5" />}
              text="Legal"
            />
            <ProfileItem
              icon={<Feather name="info" size={18} color="#DDE2E5" />}
              text="About"
              isLast
            />
          </View>

          {/* Log Out Button */}
          <TouchableOpacity
            className="bg-[#3A4049] h-[54px] rounded-[36px] py-3 items-center justify-center"
            onPress={handleLogout}
          >
            <Text
              className="text-[#EB4335]  tracking-[0px] text-center font-semibold"
              style={{ fontSize: TEXT_SIZES.md, fontFamily: "InterRegular" }}
            >
              Log out
            </Text>
          </TouchableOpacity>
        </SafeAreaView>
      </ScrollView>

      {/* Photo Edit Modal */}
      <Modal
        transparent
        visible={photoModalVisible || isClosing}
        animationType="none"
        onRequestClose={handleCloseModal}
      >
        {/* Backdrop */}
        <TouchableOpacity
          activeOpacity={1}
          onPress={handleCloseModal}
          className="flex-1 bg-black/50"
        />

        {/* Bottom Sheet */}
        <Animated.View
          style={{
            transform: [{ translateY: slideAnim }],
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
          }}
          className="bg-[#1D2738] rounded-t-3xl p-6"
        >
          {/* Header */}
          <View className="flex-row items-center mb-6">
            <Text
              style={{
                fontSize: 18,
                fontFamily: "InterSemiBold",
                color: "#DDE2E5",
              }}
              className="text-left"
            >
              Add profile photo
            </Text>
          </View>
          <Text
            className="text-left leading-5 mb-6"
            style={{
              fontSize: 14,
              fontFamily: "InterRegular",
              color: "#DDE2E5",
            }}
          >
            Let's upload the perfect photo to represent yourself in the app.
          </Text>

          {/* Options */}
          <TouchableOpacity
            className="flex-row items-center bg-[#3A4049] py-4 rounded-xl  px-3 mb-4"
            onPress={handleViewPhotoLibrary}
          >
            <Feather name="image" size={18} color="#DDE2E5" />
            <Text
              className="text-[#DDE2E5]  ml-3"
              style={{
                fontSize: 14,
                fontFamily: "InterRegular",
              }}
            >
              View Photo Library
            </Text>
            <View className="absolute right-4">
              <AntDesign
                name="right"
                size={24}
                color="white"
                style={{
                  fontSize: TEXT_SIZES.md,
                  fontWeight: "400",
                  fontFamily: "Inter",
                }}
              />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-row items-center bg-[#3A4049] rounded-xl py-4 px-3"
            onPress={handleTakePhoto}
          >
            <Feather name="camera" size={18} color="#DDE2E5" />
            <Text
              className="text-[#DDE2E5] ml-3"
              style={{
                fontSize: 14,
                fontFamily: "InterRegular",
              }}
            >
              Take Photo
            </Text>
            <View className="absolute right-4">
              <AntDesign
                name="right"
                size={24}
                color="#DDE2E5"
                style={{
                  fontSize: TEXT_SIZES.md,
                  fontWeight: "400",
                  fontFamily: "Inter",
                }}
              />
            </View>
          </TouchableOpacity>
        </Animated.View>
      </Modal>
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

export default ProfileHubScreen;

// import React from "react";
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   ScrollView,
//   Alert,
//   Linking,
// } from "react-native";
// import { LinearGradient } from "expo-linear-gradient";
// import AntDesign from "@expo/vector-icons/AntDesign";
// import Feather from "@expo/vector-icons/Feather";
// import MaterialIcons from "@expo/vector-icons/MaterialIcons";
// const { useNavigation } = require("@react-navigation/native");
// import { SCREEN_NAMES, Theme } from "../../constants";
// import { useAuth } from "../../contexts/AuthContext";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { AppStatusBar } from "../../helpers/AppStatusBar";
// import { TEXT_SIZES } from "@/constants/textSizes";

// const ProfileHubScreen: React.FC = () => {
//   const navigation: any = useNavigation();
//   const { logout } = useAuth();
//   const handleViewPhotoLibrary = () => {
//     Alert.alert(
//       "Photo Library",
//       "This would open the photo library to select a profile photo."
//     );
//   };

//   const handleTakePhoto = () => {
//     Alert.alert(
//       "Camera",
//       "This would open the camera to take a new profile photo."
//     );
//   };

//   return (
//     <LinearGradient
//       colors={[
//         Theme.backgroundGradient.start,
//         Theme.backgroundGradient.middle,
//         Theme.backgroundGradient.end,
//       ]}
//       start={{ x: 0.5, y: 1 }}
//       end={{ x: 0.5, y: 0 }}
//       className="flex-1"
//     >
//       <AppStatusBar barStyle="light-content" />
//       <ScrollView
//         className="flex-1 px-4"
//         contentContainerStyle={{ paddingBottom: 30 }}
//         showsVerticalScrollIndicator={false}
//       >
//         {/* Profile Header */}
//         <View className="items-center mt-10 mb-8">
//           <View className="w-36 h-36 rounded-full bg-[#161A23] items-center justify-center">
//             <Text className="text-white text-3xl font-bold">HW</Text>
//             <TouchableOpacity
//               className="absolute bottom-2 right-2 bg-white rounded-full p-1"
//               onPress={() => setValue(200)}
//             >
//               <Feather name="edit-2" size={14} color="black" />
//             </TouchableOpacity>
//           </View>
//           <Text
//             className="text-white font-semibold mt-4"
//             style={{ fontSize: TEXT_SIZES.lg }}
//           >
//             HARSH WARDHAN
//           </Text>
//           <Text className="text-gray-400" style={{ fontSize: TEXT_SIZES.md }}>
//             user@oxify.com
//           </Text>
//         </View>

//         {/* General Section */}
//         <Text
//           className="text-[#DDE2E5] mb-2 ml-4"
//           style={{ fontSize: TEXT_SIZES.sm }}
//         >
//           General
//         </Text>

//         <View className="bg-[#3A4049] rounded-[12px] mb-6 text-[#DDE2E5] ">
//           <ProfileItem
//             icon={<Feather name="user" size={18} color="#DDE2E5" />}
//             text="Manage account"
//           />
//           <ProfileItem
//             icon={<Feather name="bell" size={18} color="#DDE2E5" />}
//             text="Push notifications"
//           />
//           <ProfileItem
//             icon={<Feather name="mail" size={18} color="#DDE2E5" />}
//             text="Email preferences"
//           />
//           <ProfileItem
//             icon={<Feather name="trash-2" size={18} color="#DDE2E5" />}
//             text="Cache"
//           />
//           <ProfileItem
//             icon={<Feather name="box" size={18} color="#DDE2E5" />}
//             text="Chamber Model"
//           />
//           <ProfileItem
//             icon={<Feather name="heart" size={18} color="#DDE2E5" />}
//             text="Favorite Protocols"
//           />
//           <ProfileItem
//             icon={<Feather name="bookmark" size={18} color="#DDE2E5" />}
//             text="Saved Articles & Blogs"
//           />
//           <ProfileItem
//             icon={<Feather name="award" size={18} color="#DDE2E5" />}
//             text="Milestone Badges"
//             isLast
//           />
//         </View>

//         {/* Support Section */}
//         <Text
//           className="text-[#DDE2E5] mb-2 ml-4"
//           style={{ fontSize: TEXT_SIZES.sm }}
//         >
//           Support
//         </Text>

//         <View className="bg-[#3A4049] rounded-xl mb-6">
//           <ProfileItem
//             icon={<Feather name="edit-3" size={18} color="#DDE2E5" />}
//             text="Send feedback"
//           />
//           <ProfileItem
//             icon={<AntDesign name="staro" size={18} color="#DDE2E5" />}
//             text="Rate us"
//           />
//           <ProfileItem
//             icon={<Feather name="globe" size={18} color="#DDE2E5" />}
//             text="Visit oxify.com"
//           />
//           <ProfileItem
//             icon={<MaterialIcons name="gavel" size={18} color="#DDE2E5" />}
//             text="Legal"
//           />
//           <ProfileItem
//             icon={<Feather name="info" size={18} color="#DDE2E5" />}
//             text="About"
//             isLast
//           />
//         </View>

//         {/* Log Out Button */}
//         <TouchableOpacity
//           className="bg-[#3A4049] h-[54px] rounded-[36px] py-3 items-center justify-center"
//           onPress={async () => {
//             try {
//               await logout();
//               // Navigation will be handled automatically by AuthGuard
//             } catch (error) {
//               Alert.alert("Error", "Failed to log out. Please try again.");
//             }
//           }}
//         >
//           <Text
//             className="text-[#EB4335] text-[16px] font-[600]  tracking-[0px] text-center"
//             style={{ fontFamily: "Inter" }}
//           >
//             Log out
//           </Text>
//         </TouchableOpacity>
//       </ScrollView>
//       <TouchableOpacity
//         className="absolute bottom-2 right-2 bg-white rounded-full p-1"
//         onPress={() => navigation.navigate(SCREEN_NAMES.PROFILE_PHOTO)}
//       >
//         <View className="relative w-full  ">
//           <View className=` w-full flex-col bottom-${setValue} left-0 right-0 items-center justify-center  bg-white`>
//             <View className="flex-1 px-4 pt-14">
//               {/* Header */}
//               <View className="flex-row items-center mb-6">
//                 <TouchableOpacity
//                   onPress={() => navigation.goBack()}
//                   className="mr-4"
//                 >
//                   <AntDesign name="arrowleft" size={24} color="white" />
//                 </TouchableOpacity>
//                 <Text className="text-white text-lg font-bold">
//                   Profile Photo
//                 </Text>
//               </View>

//               {/* Current Photo Display */}
//               <View className="items-center mb-8">
//                 <View className="w-32 h-32 rounded-full bg-[#161A23] items-center justify-center mb-4">
//                   <Text className="text-white text-2xl font-bold">HW</Text>
//                 </View>
//                 <Text className="text-white text-base font-medium">
//                   HARSH WARDHAN
//                 </Text>
//               </View>

//               {/* Photo Options */}
//               <View className="bg-[#161A23] rounded-xl p-6 mb-6">
//                 <Text className="text-white text-lg font-bold mb-4 text-center">
//                   Update Profile Photo
//                 </Text>

//                 <TouchableOpacity
//                   className="flex-row items-center justify-center bg-[#3A4049] rounded-xl py-4 mb-4"
//                   onPress={handleViewPhotoLibrary}
//                 >
//                   <Feather
//                     name="image"
//                     size={20}
//                     color="white"
//                     className="mr-3"
//                   />
//                   <Text className="text-white font-semibold text-base ml-3">
//                     View Photo Library
//                   </Text>
//                 </TouchableOpacity>

//                 <TouchableOpacity
//                   className="flex-row items-center justify-center bg-[#3A4049] rounded-xl py-4"
//                   onPress={handleTakePhoto}
//                 >
//                   <Feather
//                     name="camera"
//                     size={20}
//                     color="white"
//                     className="mr-3"
//                   />
//                   <Text className="text-white font-semibold text-base ml-3">
//                     Take Photo
//                   </Text>
//                 </TouchableOpacity>
//               </View>

//               {/* Info Text */}
//               <View className="px-2">
//                 <Text className="text-gray-400 text-sm text-center leading-5">
//                   Choose a clear, well-lit photo that shows your face clearly.
//                   This photo will be visible to other users in the app.
//                 </Text>
//               </View>
//             </View>
//           </View>
//         </View>
//       </TouchableOpacity>
//     </LinearGradient>
//   );
// };

// const ProfileItem = ({
//   icon,
//   text,
//   isLast = false,
// }: {
//   icon: React.ReactNode;
//   text: string;
//   isLast?: boolean;
// }) => {
//   const navigation: any = useNavigation();
//   // Map text to destination. When stack is omitted, navigate within current stack.
//   const navMap: Record<string, { screen: string; stack?: string }> = {
//     "Manage account": { screen: SCREEN_NAMES.MANAGE_ACCOUNT },
//     "Delete account": { screen: SCREEN_NAMES.DELETE_ACCOUNT },

//     "Push notifications": {
//       stack: "SettingsStack",
//       screen: SCREEN_NAMES.SETTINGS_PUSH_NOTIFICATIONS,
//     },
//     "Email preferences": {
//       stack: "SettingsStack",
//       screen: SCREEN_NAMES.SETTINGS_EMAIL_PREFERENCES,
//     },
//     Cache: {
//       stack: "SettingsStack",
//       screen: SCREEN_NAMES.SETTINGS_CLEAR_CACHE,
//     },
//     "Chamber Model": {
//       stack: "SettingsStack",
//       screen: SCREEN_NAMES.SETTINGS_CHAMBER_MODEL,
//     },

//     "Favorite Protocols": {
//       stack: "ContentStack",
//       screen: SCREEN_NAMES.FAVORITE_PROTOCOLS,
//     },
//     "Saved Articles & Blogs": {
//       stack: "ContentStack",
//       screen: SCREEN_NAMES.SAVED_ARTICLES,
//     },
//     "Milestone Badges": {
//       stack: "ContentStack",
//       screen: SCREEN_NAMES.MILESTONE_BADGES,
//     },
//   };

//   const handlePress = async () => {
//     // Special cases for items without screens yet
//     if (text === "Visit oxify.com") {
//       await Linking.openURL("https://oxify.com");
//       return;
//     }
//     if (
//       text === "Send feedback" ||
//       text === "Rate us" ||
//       text === "Legal" ||
//       text === "About"
//     ) {
//       Alert.alert(
//         "Coming soon",
//         "This screen will be available in a future update."
//       );
//       return;
//     }

//     const nav = navMap[text];
//     if (!nav) {
//       Alert.alert("Unavailable", "Navigation target not found.");
//       return;
//     }

//     if (nav.stack) {
//       navigation.navigate(nav.stack, { screen: nav.screen });
//       return;
//     }

//     navigation.navigate(nav.screen);
//   };
//   return (
//     <TouchableOpacity
//       className={`flex-row items-center px-4 py-4 ${
//         !isLast ? "border-b border-white/10" : ""
//       }`}
//       onPress={handlePress}
//     >
//       <View className="mr-3">{icon}</View>
//       <Text className="text-white flex-1" style={{ fontSize: TEXT_SIZES.sm }}>
//         {text}
//       </Text>
//       <AntDesign name="right" size={16} color="gray" />
//     </TouchableOpacity>
//   );
// };

// export default ProfileHubScreen;
