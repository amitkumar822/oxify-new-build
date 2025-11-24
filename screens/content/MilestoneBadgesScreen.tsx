import React from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
const { useNavigation } = require("@react-navigation/native");
import { SafeAreaView } from "react-native-safe-area-context";
import { AppStatusBar } from "../../helpers/AppStatusBar";
import { SCREEN_NAMES, Theme } from "../../constants";
import { Image } from "react-native";
import { Dimensions } from "react-native";
import { useUserMilestoneBadges } from "../../hooks/useSession";
import ShadowHeader from "@/components/common/ShadowHeader";

const { width } = Dimensions.get("window");

const MilestoneBadgesScreen: React.FC = () => {
  const navigation: any = useNavigation();
  const {
    data: milestoneResponse,
    isLoading,
    error,
  } = useUserMilestoneBadges();

  // Extract milestone data from API response
  const milestoneBadges = milestoneResponse?.data?.data || [];
  return (
    <LinearGradient
      colors={[
        "#243551",
        "#171D27",
        "#14181B",
      ]}
      style={styles.gradient}
    >
      <SafeAreaView className="flex-1">
        <AppStatusBar barStyle="light-content" />

        {/* Header */}
        <ShadowHeader title="Milestone Badges" onPress={() => navigation.goBack()} />

        <View className="flex-1 px-4 pb-4">

          <ScrollView showsVerticalScrollIndicator={false}>
            {isLoading ? (
              <View className="flex-1 items-center justify-center py-20">
                <Text className="text-white text-lg">Loading badges...</Text>
              </View>
            ) : error ? (
              <View className="flex-1 items-center justify-center py-20">
                <Text className="text-red-400 text-lg">
                  Error loading badges
                </Text>
              </View>
            ) : milestoneBadges.length === 0 ? (
              <View className="flex-1 items-center justify-center py-20">
                <Text className="text-gray-400 text-lg">
                  No milestone badges yet
                </Text>
              </View>
            ) : (
              <View className="flex-row flex-wrap">
                {milestoneBadges.map((badge: any, idx: number) => (
                  <View key={idx} className="w-1/3 mb-4 px-1">
                    <View className="bg-[#14181B] rounded-2xl items-center p-2 justify-center">
                      {/* Icon placeholder */}
                      <View className="p-2 bg-[#454F5E] rounded-full m-2">
                        <Image
                          source={require("../../assets/icons/medal.png")}
                          style={{
                            width: 48,
                            height: 48,
                            opacity: 1,
                            resizeMode: "contain",
                          }}
                        />
                      </View>

                      <Text
                        className="text-white text-center"
                        style={{
                          fontSize: 10,
                          fontFamily: "InterSemiBold",
                          lineHeight: 12,
                        }}
                      >
                        <Text style={{ fontSize: 12, lineHeight: 12 }}>{badge.day_count}</Text> Days Streak Milestone
                      </Text>
                      <TouchableOpacity
                        onPress={() =>
                          navigation.navigate(SCREEN_NAMES.MILESTONE_SHARE, {
                            badgeData: badge,
                          })
                        }
                      >
                        <Text
                          className="text-gray-400 my-2"
                          style={{
                            fontSize: 10,
                            fontFamily: "InterRegular",
                          }}
                        >
                          Share now
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </ScrollView>
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

export default MilestoneBadgesScreen;
