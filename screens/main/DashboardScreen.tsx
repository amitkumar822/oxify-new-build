import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Theme, SCREEN_NAMES } from "../../constants";
const { useNavigation } = require("@react-navigation/native");
import { RFValue } from "react-native-responsive-fontsize";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import QuotesSwiper from "./quotesSwiper/QuotesSwiper";
import { GradientLine } from "@/components/common/GradientLine";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLongestStreak } from "@/hooks_main/useSession";
import { useNotificationCount } from "@/hooks_main/useNotification";
import { useProfile } from "@/hooks_main/useProfile";
import SetReminderBottomSheet from "@/components/common/SetReminderBottomSheet";
import { useAuth } from "@/contexts/AuthContext";
const { useFocusEffect } = require("@react-navigation/native");

// Function to get greeting based on current time
const getGreeting = (): string => {
  const currentHour = new Date().getHours();

  if (currentHour >= 5 && currentHour < 12) {
    return "Good Morning!";
  } else if (currentHour >= 12 && currentHour < 17) {
    return "Good Afternoon!";
  } else if (currentHour >= 17 && currentHour < 21) {
    return "Good Evening!";
  } else {
    return "Good Night!";
  }
};

const DashboardScreen: React.FC = () => {
  const navigation: any = useNavigation();

  const { isAuthenticated, isLoading } = useAuth();
  const authReady = isAuthenticated && !isLoading;

  const { data: notificationCountResponse, refetch: refetchNotificationCount } =
    useNotificationCount();
  const { data: streakResponse } = useLongestStreak();
  const { data: profileResponse } = useProfile();

  // Reminder bottom sheet state
  const [isReminderSheetVisible, setIsReminderSheetVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
      if (!authReady) return;
      // Refetch count whenever dashboard gains focus
      refetchNotificationCount();
    }, [authReady, refetchNotificationCount])
  );

  // useFocusEffect(
  //   useCallback(() => {
  //     // Refetch count whenever dashboard gains focus
  //     refetchNotificationCount();
  //   }, [refetchNotificationCount])
  // );

  const notificationCount = Math.min(
    99,
    Number(
      // API shape: { statusCode, message, data: { "Total count": number } }
      (notificationCountResponse as any)?.data?.data?.["Total count"] ?? 0
    )
  );

  const streakCount = Number(
    (streakResponse as any)?.data?.longest_streak ?? 0
  );

  // Get user name from profile data
  const profileData = (profileResponse as any)?.data?.data;
  const firstName = profileData?.first_name || "";
  const lastName = profileData?.last_name || "";
  const displayName = `${firstName} ${lastName}`.trim() || "User";

  return (
    <LinearGradient
      colors={[
        Theme.dashboardGradient.start,
        Theme.dashboardGradient.middle,
        Theme.dashboardGradient.end,
      ]}
      style={styles.gradient}
    >
      {/* <ScrollView className="flex-1" showsVerticalScrollIndicator={false}> */}
      <View style={{ flex: 1 }}>
        <SafeAreaView style={{ flex: 1 }}>
          {/* Oxify Logo */}
          <View className="items-center" style={{ marginTop: -10 }}>
            <View className="flex-row items-center mb-[23px]">
              <Image
                source={require("../../assets/images/oxify_logo_with_name.png")}
                contentFit="contain"
                style={{
                  width: 124,
                  height: 41,
                  marginRight: 6,
                }}
              />
            </View>
          </View>

          {/* Greeting */}
          <View className="flex-row items-center justify-between mb-[23px]">
            <View>
              <Text
                style={{
                  color: Theme.text.white,
                  fontSize: 16,
                  fontFamily: "InterRegular",
                }}
              >
                {getGreeting()}
              </Text>
              <Text
                style={{
                  color: Theme.text.white,
                  fontFamily: "InterBold",
                  fontSize: 24,
                }}
              >
                {displayName}
              </Text>
            </View>
            <View className="flex-row items-center space-x-4">
              {/* Notifications */}
              <View style={{ position: "relative", paddingRight: 10 }}>
                <Ionicons
                  name="notifications-outline"
                  size={28}
                  color="#8BAFCE"
                  onPress={() =>
                    navigation.navigate(SCREEN_NAMES.NOTIFICATIONS)
                  }
                />
                {notificationCount >= 0 && (
                  <View
                    style={{
                      position: "absolute",
                      top: 1,
                      right: 12,
                      // minWidth: 10,
                      // height: 10,
                      paddingHorizontal: 2,
                      backgroundColor: "#F44336",
                      borderRadius: 999,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Text
                      style={{
                        color: "#FFFFFF",
                        fontSize: 8,
                        fontWeight: "700",
                        lineHeight: 10,
                      }}
                    >
                      {notificationCount > 9 ? "9+" : String(notificationCount)}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </View>

          {/* Quotes Section */}
          <>
            <QuotesSwiper />
            {/* Gradient Line */}
            <View style={{ marginTop: 45, marginBottom: 16 }}>
              <GradientLine />
            </View>
          </>

          {/* Streak + Suggested Protocols */}
          <View
            className="flex-row justify-between"
            style={{
              gap: 20,
              height: 98,
            }}
          >
            {/* Current Streak */}
            <View
              className="flex-1 justify-between"
              style={{
                borderWidth: 1,
                borderColor: "#3E5670",
                borderRadius: 12,
                paddingVertical: 12,
                paddingHorizontal: 14,
                overflow: "hidden",
              }}
            >
              <Text
                style={{
                  fontSize: 11,
                  fontFamily: "InterMedium",
                  color: "rgba(255, 255, 255, 0.7)",
                }}
              >
                Current streak
              </Text>

              {/* Top Row: Icon + Title */}
              <View
                className="flex-row items-center overflow-hidden"
                style={{ gap: 6 }}
              >
                <View
                  className="h-full flex-row"
                  style={{
                    alignItems: "flex-end",
                    justifyContent: "flex-end",
                  }}
                >
                  <Text style={{ fontSize: 36 }}>🔥</Text>
                  {/* <Image
                    source={require("@/assets/images/fire-icon.png")}
                    style={{ width: 36.46, height: 60, marginBottom: -13, overflow: "hidden", borderRadius: "100%" }}
                  /> */}
                </View>

                <View className="flex-1 min-w-0">
                  <Text
                    numberOfLines={1}
                    style={{
                      fontSize: 28,
                      color: "#FF7100",
                      fontFamily: "InterBold",
                    }}
                  >
                    {streakCount}
                  </Text>
                  <View
                    className="flex-row items-center justify-between"
                    style={{ gap: 10, width: "100%" }}
                  >
                    <Text
                      numberOfLines={1}
                      style={{
                        fontSize: 12,
                        color: "#FF7100",
                        fontFamily: "InterMedium",
                      }}
                    >
                      Days
                    </Text>

                    <TouchableOpacity
                      onPress={() => navigation.navigate(SCREEN_NAMES.STREAK)}
                      className="bg-[#8BAFCE] self-end"
                      style={{
                        borderRadius: 4,
                        paddingHorizontal: 8,
                        paddingVertical: 2,
                      }}
                    >
                      <Text
                        numberOfLines={1}
                        style={{
                          fontSize: 8,
                          color: "#1E2A3E",
                          fontFamily: "InterSemiBold",
                        }}
                      >
                        View all
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>

            {/* Suggested Protocols */}
            <View
              className="flex-1"
              style={{
                borderWidth: 1,
                borderColor: "#3E5670",
                borderRadius: 12,
                paddingVertical: 12,
                paddingHorizontal: 14,
              }}
            >
              <Text
                className="text-gray-400"
                style={{
                  fontSize: 11,
                  fontFamily: "InterMedium",
                  color: "rgba(255, 255, 255, 0.7)",
                  lineHeight: 14,
                  marginBottom: 3,
                }}
              >
                Suggested Protocols
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  color: Theme.text.white,
                  fontFamily: "InterSemiBold",
                  marginBottom: 1,
                }}
              >
                {" "}
                Recovery Boost
              </Text>
              <Text
                style={{
                  fontSize: 11,
                  fontFamily: "InterRegular",
                  lineHeight: 14,
                  color: "#4C8BF5",
                }}
              >
                1.5 ATA {"  "}• 6 Minutes
              </Text>
              <TouchableOpacity
                className="bg-[#8BAFCE] self-start w-full"
                style={{
                  paddingVertical: 4,
                  marginTop: 4,
                  borderRadius: 6,
                }}
                onPress={() =>
                  navigation.navigate(SCREEN_NAMES.SESSION_SETUP, {
                    pressure: "1.5 ATA",
                    duration: "6 min",
                  })
                }
              >
                <Text
                  style={{
                    fontSize: 10,
                    color: "#1E2A3E",
                    textAlign: "center",
                    fontFamily: "InterSemiBold",
                  }}
                >
                  Start
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={{ marginVertical: 16 }}>
            <GradientLine />
          </View>

          {/* Bottom Menu (separate boxes) */}
          <View className="flex-row flex-wrap justify-between gap-2">
            <TouchableOpacity
              className="items-center mb-4"
              onPress={() => navigation.navigate(SCREEN_NAMES.SESSION_DETAILS)}
              style={styles.bottomMenuItem}
            >
              <MaterialIcons name="history" size={28} color="#6189AD" />
              <Text style={styles.bottomMenuItemText}>
                {`Recent ${"\n"} Sessions`}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="items-center mb-4"
              onPress={() =>
                navigation.navigate("ContentStack", {
                  screen: SCREEN_NAMES.FAVORITE_PROTOCOLS,
                })
              }
              style={styles.bottomMenuItem}
            >
              <Ionicons name="star-outline" size={24} color="#6189AD" />
              <Text style={styles.bottomMenuItemText}>
                {`Saved ${"\n"} Protocols`}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="items-center mb-4"
              onPress={() =>
                navigation.navigate("ProtocolsTab", { activeTab: "articles" })
              }
              style={styles.bottomMenuItem}
            >
              <Ionicons size={23.5} name="newspaper-outline" color="#6189AD" />
              <Text style={styles.bottomMenuItemText}>
                {`Explore ${"\n"} Articles`}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="items-center mb-4"
              onPress={() => setIsReminderSheetVisible(true)}
              style={styles.bottomMenuItem}
            >
              <Ionicons name="alarm-outline" size={24} color="#6189AD" />
              <Text style={styles.bottomMenuItemText}>
                {` Set ${"\n"} Reminder`}
              </Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
      {/* </ScrollView> */}

      {/* Set Reminder Bottom Sheet */}
      <SetReminderBottomSheet
        visible={isReminderSheetVisible}
        onClose={() => setIsReminderSheetVisible(false)}
        onSave={(reminderData) => {
          // console.log("Reminder data saved:", reminderData);
          // TODO: Implement reminder saving logic
        }}
      />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  bottomMenuItem: {
    overflow: "hidden",
    backgroundColor: "#14181B",
    borderRadius: 12,
    paddingVertical: RFValue(9),
    paddingHorizontal: RFValue(10),
    minWidth: 76,
  },
  bottomMenuItemText: {
    fontSize: 11,
    fontFamily: "InterMedium",
    color: "#6189AD",
    textAlign: "center",
    marginTop: 4,
  },
});

export default DashboardScreen;
