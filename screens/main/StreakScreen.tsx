import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
  StyleSheet,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, FontAwesome5, Feather } from "@expo/vector-icons";
import { Theme } from "@/constants";
import { TEXT_SIZES } from "@/constants/textSizes";
import { SCREEN_NAMES } from "@/constants/ScreenNames";
const { useNavigation } = require("@react-navigation/native");
import { RFValue } from "react-native-responsive-fontsize";
import { GradientLine } from "@/components/common/GradientLine";
import { Image } from "expo-image";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  useLongestStreak,
  useStreakFreeze,
  useUseStreakFreeze,
} from "@/hooks_main/useSession";


const RewardCard = ({
  title,
  subtitle,
  icon,
  onPress,
}: {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  onPress?: () => void;
}) => (
  <TouchableOpacity
    onPress={onPress}
    className="bg-[#14181B] mr-4 flex-row items-center w-[48%]"
    style={{
      borderRadius: 16,
      padding: 12,
    }}
  >
    <View
      className="rounded-full bg-[#454F5E] items-center justify-center mr-4"
      style={{
        width: 44,
        height: 44,
      }}
    >
      {icon}
    </View>
    <View className="flex-1">
      <Text
        style={{ fontSize: 12, fontFamily: "InterSemiBold", color: Theme.text.white }}
      >
        {title}
      </Text>
      <Text
        className="mt-1"
        style={{ fontSize: 10, fontFamily: "InterRegular", color: "#ABB0BC" }}
      >
        {subtitle}
      </Text>
    </View>
  </TouchableOpacity>
);


const StreakScreen: React.FC = () => {
  const navigation: any = useNavigation();
  const { data: streakResponse } = useLongestStreak();
  const { data: freezeResponse } = useStreakFreeze();
  const useStreakFreezeMutation = useUseStreakFreeze();

  const streakCount = Number(
    (streakResponse as any)?.data?.longest_streak ?? 0
  );

  // Get freeze data from API response
  const freezeData = (freezeResponse as any)?.data?.data;
  const availableFreeze = Number(freezeData?.available_freeze ?? 0);
  const usedFreeze = Number(freezeData?.used_freeze ?? 0);
  const todayFreeze = Boolean(freezeData?.today_freeze ?? false);

  const handleUseStreakFreeze = () => {
    if (todayFreeze) {
      // If already frozen today, show message
      Alert.alert(
        "Already Frozen",
        "Your streak is already frozen for today.",
        [{ text: "OK" }]
      );
      return;
    }

    if (availableFreeze <= 0) {
      // No freeze available
      Alert.alert(
        "No Freeze Available",
        "You don't have any streak freezes available.",
        [{ text: "OK" }]
      );
      return;
    }

    // Show confirmation dialog
    Alert.alert(
      "Freeze Streak",
      `Are you sure you want to freeze your streak? This will use 1 of your ${availableFreeze} available freezes.`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Freeze",
          onPress: () => {
            useStreakFreezeMutation.mutate();
          },
        },
      ]
    );
  };
  return (
    <LinearGradient
      colors={[
        "#14181B",
        "#171D27",
        "#243551",
      ]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 0.7 }}
      style={styles.gradient}
    >
      <SafeAreaView className="flex-1">
        <StatusBar barStyle="light-content" />

        {/* Header */}
        <View className="flex-row items-center justify-between px-5 pb-5 pt-2">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons
              name="chevron-back-outline"
              size={28}
              color={Theme.text.white}
            />
          </TouchableOpacity>
          <Text
            style={{ fontSize: 18, fontFamily: "InterSemiBold", color: Theme.text.white }}
          >
            Streak
          </Text>
          <View className="w-10" />
        </View>

        <ScrollView
          className="flex-1 px-5"
          contentContainerStyle={{ paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Streak banner */}
          <View className="flex-row items-center justify-center mb-4">
            <View
              className="h-full flex-row"
              style={{
                alignItems: "flex-end",
                justifyContent: "flex-end",
              }}
            >
              <Text style={{ fontSize: 36 }}>🔥</Text>
            </View>
            <Text
              className="ml-2"
              style={{
                fontSize: 18,
                fontFamily: "InterSemiBold",
                color: "#FF7100",
                opacity: todayFreeze ? 0.7 : 1,
              }}
            >
              <Text style={{ fontSize: 28 }}>{streakCount}</Text> Days Streak {todayFreeze ? "(Frozen)" : ""}
            </Text>
          </View>
          <View className="mb-4">
            <GradientLine color1="#1D283A" color2="#3E5670" color3="#1D273A" />
          </View>

          {/* Rewards */}
          <Text
            style={{
              fontSize: 16,
              fontFamily: "InterMedium",
              color: "#DDE2E5",
              marginBottom: 8,
            }}
          >
            Rewards
          </Text>
          <View className="flex-row mb-5">
            <RewardCard
              title="Streak Freeze"
              subtitle={`Available: ${availableFreeze}\nUsed: ${usedFreeze}`}
              icon={
                <Feather
                  name={todayFreeze ? "pause-circle" : "play-circle"}
                  size={33}
                  color="#6189AD"
                />
              }
              onPress={handleUseStreakFreeze}
            />
            <RewardCard
              title="Milestone Badges"
              subtitle="Share now"
              icon={
                <Ionicons
                  name="ribbon-outline"
                  size={33}
                  color="#6189AD"
                />
              }
              onPress={() =>
                navigation.navigate("ContentStack", {
                  screen: SCREEN_NAMES.MILESTONE_BADGES,
                })
              }
            />
          </View>
          <View className="mb-4">
            <GradientLine color1="#1D283A" color2="#3E5670" color3="#1D273A" />
          </View>
          {/* {notifications.map((n) => (
            <NotificationItem key={n.id} item={n} />
          ))} */}
        </ScrollView>
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

export default StreakScreen;
