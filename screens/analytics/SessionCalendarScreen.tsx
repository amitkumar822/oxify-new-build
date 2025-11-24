import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import AntDesign from "@expo/vector-icons/AntDesign";
const { useNavigation, useRoute } = require("@react-navigation/native");
import { SafeAreaView } from "react-native-safe-area-context";
import { AppStatusBar } from "../../helpers/AppStatusBar";
import { TEXT_SIZES } from "@/constants/textSizes";
import { Theme } from "@/constants";
import { Dimensions } from "react-native";

const SessionCalendarScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();

  // Get the data from navigation params
  const filters = (route.params as any)?.filters || {};
  const result = (route.params as any)?.result || [];
  const selectedDateString = filters?.created_at || "";

  // Parse the selected date string to display
  const selectedDate = selectedDateString
    ? new Date(selectedDateString).getDate()
    : 22;
  const selectedMonth = selectedDateString
    ? new Date(selectedDateString).toLocaleString("default", { month: "long" })
    : "January";
  const selectedYear = selectedDateString
    ? new Date(selectedDateString).getFullYear()
    : 2025;

  const width = Dimensions.get("window").width;

  // Use real session data from API response
  const sessions = Array.isArray(result) ? result : [];
  const hasSessions = sessions.length > 0;

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

        {/* Header */}
        <View className="flex-1 px-4 pt-3">
          {/* Top Row - Back Arrow and Title */}
          <View className="relative flex-row items-center justify-center mb-6 w-full">
            {/* Back Button */}
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              className="absolute left-0"
            >
              <AntDesign name="left" size={24} color="white" />
            </TouchableOpacity>

            {/* Centered Title */}
            <Text
              className="text-white text-center"
              style={{
                fontFamily: "Inter",
                fontSize: TEXT_SIZES.lg,
                fontWeight: 500,
              }}
            >
              Statistics
            </Text>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
            {hasSessions ? (
              // Render sessions if available
              sessions.map((session: any, index: number) => (
                <View key={index} className="mb-4 bg-[#3A4049] rounded-2xl p-6">
                  {/* Header with Title and Date */}
                  <View className="flex-row items-center justify-between mb-6">
                    <Text
                      className="text-white font-bold"
                      style={{ fontSize: TEXT_SIZES.lg }}
                    >
                      Session {index + 1}
                    </Text>
                    <View className="bg-white opacity-90 rounded-full px-4 py-2">
                      <Text
                        className="text-[#6189AD] font-medium"
                        style={{ fontSize: TEXT_SIZES.sm }}
                      >
                        {selectedDateString}
                      </Text>
                    </View>
                  </View>

                  {/* Session Metrics */}
                  <View className="mb-2">
                    <View className="flex-row justify-between items-center border-y border-gray-600 border-opacity-80 w-full py-4">
                      <Text
                        className="text-gray-400 font-medium"
                        style={{ fontSize: TEXT_SIZES.sm }}
                      >
                        ATA Level
                      </Text>
                      <Text
                        className="text-white font-semibold"
                        style={{ fontSize: TEXT_SIZES.sm }}
                      >
                        {session.user_session?.ata_level ||
                          session.ata_level ||
                          "N/A"}
                      </Text>
                    </View>

                    <View className="flex-row justify-between items-center border-b border-gray-600 w-full py-4">
                      <Text
                        className="text-gray-400 font-medium"
                        style={{ fontSize: TEXT_SIZES.sm }}
                      >
                        Protocol
                      </Text>
                      <Text
                        className="text-white font-semibold"
                        style={{ fontSize: TEXT_SIZES.sm }}
                      >
                        {session.user_session?.protocol ||
                          session.protocol_name ||
                          session.protocol ||
                          "N/A"}
                      </Text>
                    </View>

                    <View className="flex-row justify-between items-center border-b border-gray-600 w-full py-4">
                      <Text
                        className="text-gray-400 font-medium"
                        style={{ fontSize: TEXT_SIZES.sm }}
                      >
                        Duration
                      </Text>
                      <Text
                        className="text-white font-semibold"
                        style={{ fontSize: TEXT_SIZES.sm }}
                      >
                        {session.user_session?.duration_minutes
                          ? `${session.user_session.duration_minutes} Minutes`
                          : session.duration_minutes
                            ? `${session.duration_minutes} Minutes`
                            : "N/A"}
                      </Text>
                    </View>

                    <View className="flex-row justify-between items-center border-b border-gray-600 w-full py-4">
                      <Text
                        className="text-gray-400 font-medium"
                        style={{ fontSize: TEXT_SIZES.sm }}
                      >
                        Status
                      </Text>
                      <Text
                        className="text-white font-semibold"
                        style={{ fontSize: TEXT_SIZES.sm }}
                      >
                        {session.session_status || session.status || "N/A"}
                      </Text>
                    </View>

                    <View className="flex-row justify-between items-center w-full pt-4">
                      <Text
                        className="text-gray-400 font-medium"
                        style={{ fontSize: TEXT_SIZES.sm }}
                      >
                        Notes
                      </Text>
                      <Text
                        className="text-white font-semibold text-right flex-1 ml-4"
                        style={{ fontSize: TEXT_SIZES.sm }}
                      >
                        {session.notes || session.description || "No notes"}
                      </Text>
                    </View>
                  </View>
                </View>
              ))
            ) : (
              // No sessions found
              <View className="mb-4 bg-[#3A4049] rounded-2xl p-6">
                <View className="flex-row items-center justify-between mb-6">
                  <Text
                    className="text-white font-bold"
                    style={{ fontSize: TEXT_SIZES.lg }}
                  >
                    No Sessions Found
                  </Text>
                  <View className="bg-white opacity-90 rounded-full px-4 py-2">
                    <Text
                      className="text-[#6189AD] font-medium"
                      style={{ fontSize: TEXT_SIZES.sm }}
                    >
                      {selectedDateString ||
                        `${selectedDate} ${selectedMonth}, ${selectedYear}`}
                    </Text>
                  </View>
                </View>
                <Text
                  className="text-gray-400 text-center"
                  style={{ fontSize: TEXT_SIZES.md }}
                >
                  No sessions found for the selected date.
                </Text>
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

export default SessionCalendarScreen;
