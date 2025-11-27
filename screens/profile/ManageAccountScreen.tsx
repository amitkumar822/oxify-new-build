import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import AntDesign from "@expo/vector-icons/AntDesign";
const { useNavigation } = require("@react-navigation/native");
import { SCREEN_NAMES, Theme } from "../../constants";
import { useProfile } from "../../hooks_main/useProfile";
import { TEXT_SIZES } from "@/constants/textSizes";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppStatusBar } from "../../helpers/AppStatusBar";
import { useAuth } from "../../contexts/AuthContext";

const ManageAccountScreen: React.FC = () => {
  const navigation: any = useNavigation();
  const { logout } = useAuth();
  const { data: profileData, isLoading, error, refetch } = useProfile();

  const profile: any = (profileData as any)?.data?.data;
  const firstName = profile?.first_name || "Not set";
  const lastName = profile?.last_name || "Not set";
  const email = profile?.email || "Not set";
  const gender = profile?.gender || "Not set";
  const dateOfBirth = profile?.date_of_birth
    ? new Date(profile.date_of_birth).toLocaleDateString()
    : "Not set";
  const username = profile?.username || "Not set";
  const signupMethod = profile?.apple_login
    ? "Apple"
    : profile?.google_login
      ? "Google"
      : profile?.email_login
        ? "Email"
        : "Unknown";

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
        style={styles.gradient}
      >
        <SafeAreaView className="flex-1">
          <AppStatusBar barStyle="light-content" />
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#8BAFCE" />
            <Text className="text-white mt-3">Loading profile...</Text>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  const loadFailed =
    !!error || (profileData && (profileData as any).success === false);

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
      <SafeAreaView>
        <AppStatusBar barStyle="light-content" />
        <ScrollView
          className="px-4 py-4 h-screen"
          contentContainerStyle={{ paddingBottom: 200 }}
          showsVerticalScrollIndicator={false}
        >
          {loadFailed && (
            <View className="bg-red-500/20 border border-red-500 rounded-xl p-3 mb-4">
              <Text className="text-red-200 mb-2">Failed to load profile.</Text>
              <TouchableOpacity
                onPress={() => refetch()}
                className="self-start px-3 py-1 bg-red-500 rounded-lg"
              >
                <Text className="text-white">Retry</Text>
              </TouchableOpacity>
            </View>
          )}
          <View className="relative items-center mb-6">
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              className=" absolute left-0"
            >
              <AntDesign name="left" size={24} color="white" />
            </TouchableOpacity>

            <Text
              className="text-white text-center font-semibold mr-6"
              style={{
                fontFamily: "Inter",
                fontSize: TEXT_SIZES.lg,
              }}
            >
              Manage account
            </Text>
          </View>

          <Text
            className="text-[#DDE2E5] mb-2"
            style={{ fontSize: TEXT_SIZES.sm }}
          >
            Personal Info
          </Text>

          <View className="bg-[#3A4049] rounded-[12px] mb-6 font-medium">
            <ProfileRow
              label="Full name"
              value={`${firstName} ${lastName}`.trim() || "Not set"}
              onPress={() => navigation.navigate(SCREEN_NAMES.EDIT_NAME)}
            />
            <ProfileRow
              label="Date of birth"
              value={dateOfBirth}
              onPress={() => navigation.navigate(SCREEN_NAMES.EDIT_DOB)}
            />
            <ProfileRow
              label="Gender"
              value={gender}
              onPress={() => navigation.navigate(SCREEN_NAMES.EDIT_GENDER)}
            />
            <ProfileRow
              label="Change Password"
              value="**********"
              onPress={() => navigation.navigate(SCREEN_NAMES.CHANGE_PASSWORD)}
              isLast
            />
          </View>

          <Text
            className="text-[#DDE2E5] mb-2 tracking-[0px] font-medium"
            style={{ fontFamily: "Inter" }}
          >
            Authentication
          </Text>
          <View className="bg-[#3A4049] rounded-[12px] mb-6">
            <ProfileRow label="Signup method" value={signupMethod} iconDisabled={true} />
            <ProfileRow label="Username" value={username} iconDisabled={true} />
            <ProfileRow label="Email" value={email} isLast iconDisabled={true} />
          </View>

          <TouchableOpacity
            className="bg-[#3A4049] rounded-full items-center mb-5 justify-center"
            onPress={async () => {
              try {
                await logout();
                // Navigation will be handled automatically by AuthGuard
              } catch (error) {
                Alert.alert("Error", "Failed to log out. Please try again.");
              }
            }}
          >
            <Text
              className="text-white py-4 font-semibold"
              style={{ fontSize: TEXT_SIZES.md }}
            >
              Log out
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="border border-[#EB4335] rounded-[36px] py-4 items-center mb-4 justify-center"
            onPress={() => navigation.navigate(SCREEN_NAMES.DELETE_ACCOUNT)}
          >
            <Text
              className="text-[#EB4335] font-semibold"
              style={{ fontSize: TEXT_SIZES.md }}
            >
              Delete account
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const ProfileRow = ({
  label,
  value,
  isLast = false,
  onPress,
  iconDisabled = false,
}: {
  label: string;
  value: string;
  isLast?: boolean;
  onPress?: () => void;
  iconDisabled?: boolean;
}) => (
  <TouchableOpacity
    className={`flex-row items-center ms-4 `}
    onPress={onPress}
    disabled={!onPress}
    style={{
      borderBottomWidth: !isLast ? 0.5 : 0,
      borderBottomColor: !isLast ? "#616B79" : "transparent",
    }}
  >
    <View className="flex-row items-center">
      <View className=" flex-grow py-4">
        <Text className="text-[#ABB0BC] " style={{ fontSize: 10 }}>
          {label}
        </Text>
        <Text className="text-[#DDE2E5]" style={{ fontSize: 14 }}>
          {value}
        </Text>
      </View>
      {!iconDisabled && (
        <AntDesign
          name="right"
          size={14}
          color="gray"
          style={{ marginRight: 12 }}
        />
      )}
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
});

export default ManageAccountScreen;
