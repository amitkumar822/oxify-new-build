import React, { useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, Animated, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { AntDesign } from "@expo/vector-icons";
import { StatusBar } from "react-native";
import { Theme } from "@/constants";
import { TEXT_SIZES } from "@/constants/textSizes";

const SessionSkeleton = () => {
  const pulseAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [pulseAnim]);

  return (
    <View
      className="bg-[#3A4049] rounded-[20px] p-6 mb-5"
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
      }}
    >
      {/* Header */}
      <View className="flex-row justify-between items-center mb-6">
        <Animated.View
          className="w-28 h-4 bg-gray-600 rounded-md"
          style={{ opacity: pulseAnim }}
        />
        <Animated.View
          className="w-16 h-4 bg-gray-700 rounded-md"
          style={{ opacity: pulseAnim }}
        />
      </View>

      {/* Body placeholders */}
      <View className="space-y-5">
        {Array.from({ length: 4 }).map((_, i) => (
          <View
            key={i}
            className="flex-row justify-between items-center py-3 border-b border-gray-700 border-opacity-40"
          >
            <Animated.View
              className="w-20 h-4 bg-gray-600 rounded-md"
              style={{ opacity: pulseAnim }}
            />
            <Animated.View
              className="w-24 h-4 bg-gray-700 rounded-md"
              style={{ opacity: pulseAnim }}
            />
          </View>
        ))}

        {/* Last Row */}
        <View className="flex-row justify-between items-center py-3">
          <Animated.View
            className="w-20 h-4 bg-gray-600 rounded-md"
            style={{ opacity: pulseAnim }}
          />
          <Animated.View
            className="w-24 h-4 bg-gray-700 rounded-md"
            style={{ opacity: pulseAnim }}
          />
        </View>
      </View>
    </View>
  );
};

const SessionDetailsSkeletonScreen = ({ navigation }: any) => {
  return (
    <LinearGradient
      colors={[
        Theme.dashboardGradient.start,
        Theme.dashboardGradient.middle,
        Theme.dashboardGradient.end,
      ]}
      style={styles.gradient}
    >
      <SafeAreaView className="flex-1">
        <StatusBar barStyle="light-content" />

        {/* Header */}
        <View className="relative flex-row items-center justify-center mb-6 w-full">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="absolute left-0 p-4"
          >
            <AntDesign name="left" size={24} color="white" />
          </TouchableOpacity>
          <Text
            className="text-white text-center"
            style={{
              fontFamily: "Inter",
              fontSize: TEXT_SIZES.lg,
              fontWeight: "500",
            }}
          >
            Recent Sessions
          </Text>
        </View>

        {/* Skeleton list */}
        <View className="px-5">
          {Array.from({ length: 3 }).map((_, i) => (
            <SessionSkeleton key={i} />
          ))}
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    paddingTop: 16,
  },
});

export default SessionDetailsSkeletonScreen;
