import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Easing,
  StyleSheet,
  ImageBackground,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import AntDesign from "@expo/vector-icons/AntDesign";
const { useNavigation, useRoute } = require("@react-navigation/native");
import { SCREEN_NAMES, Theme } from "../../constants";
import { Image } from "expo-image";
import { BackHeader } from "@/helpers/BackHeader";
import Svg, { Circle } from "react-native-svg";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { RFValue } from "react-native-responsive-fontsize";
import { AppStatusBar } from "@/helpers/AppStatusBar";
import { useAudioPlayer } from 'expo-audio';
const alarmClockSound = require('@/assets/audio/alarm_clock.mp3');

interface RouteParams {
  sessionData?: {
    ataLevel: number;
    durationMinutes: number;
    durationSeconds: number;
    moodBefore: string;
    protocol: {
      protocol: number;
      name: string;
    };
    notes: string;
  };
}

const SessionInProgressScreen: React.FC = () => {
  const navigation: any = useNavigation();
  const route = useRoute();
  const { sessionData } = (route.params as RouteParams) || {};

  const player = useAudioPlayer(alarmClockSound);

  // If sessionData not provided → default 1 min
  const defaultMinutes = sessionData?.durationMinutes ?? 1;
  const defaultSeconds = sessionData?.durationSeconds ?? 0;

  const [isPaused, setIsPaused] = useState(false);
  const [timeLeft, setTimeLeft] = useState(
    defaultMinutes * 60 + defaultSeconds
  );
  const [isActive, setIsActive] = useState(true);
  const [isFinished, setIsFinished] = useState(false);
  const [currentGoalDuration, setCurrentGoalDuration] = useState(
    defaultMinutes * 60 + defaultSeconds
  );
  const [smoothProgress, setSmoothProgress] = useState(100);
  // progress % - starts at 100% and decreases to 0% as time progresses
  // When finished, ensure progress is exactly 0
  const progressPercentage = isFinished
    ? 0
    : Math.max(0, Math.min(100, smoothProgress));

  useEffect(() => {
    let interval: NodeJS.Timeout;
    let smoothInterval: NodeJS.Timeout;

    if (isActive && !isPaused && timeLeft > 0) {
      // Main timer interval (1 second)
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsActive(false);
            setIsPaused(false);
            setIsFinished(true);
            setSmoothProgress(0); // Set smooth progress to exactly 0 wh    sen finished
            player.play();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // Smooth progress animation (100ms for smooth 99%, 98%, 97%...)
      smoothInterval = setInterval(() => {
        setSmoothProgress((prev) => {
          const targetProgress = (timeLeft / currentGoalDuration) * 100;
          const diff = prev - targetProgress;

          if (Math.abs(diff) < 0.1) {
            return targetProgress;
          }

          // Smooth interpolation - move towards target progress
          return prev - diff * 0.1;
        });
      }, 100);
    }

    return () => {
      clearInterval(interval);
      clearInterval(smoothInterval);
    };
  }, [
    isActive,
    isPaused,
    timeLeft,
    navigation,
    sessionData,
    currentGoalDuration,
  ]);

  const togglePause = () => {
    if (isFinished) {
      return; // Don't allow pause/play when finished
    }

    if (isPaused) {
      // Resume the timer
      setIsPaused(false);
    } else {
      // Pause the timer
      setIsPaused(true);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // Circle setup - increased size slightly
  const size = 290; //260
  const strokeWidth = 25; //20
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = isFinished
    ? circumference
    : circumference - (progressPercentage / 100) * circumference;

  // Progress color - always blue
  const progressColor = "#2398F7";

  const handleFinishSession = () => {
    player.pause();
    navigation.navigate(SCREEN_NAMES.SESSION_COMPLETED, {
      sessionData,
    });
  };

  // --- Animation setup ---
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(rotateAnim, {
      toValue: 1,
      duration: 2500,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, []);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"], // rotate once
  });

  useEffect(() => {
    const unsubscribe = navigation.addListener("beforeRemove", (e: any) => {
      if (
        e.data.action.type !== "GO_BACK" &&
        e.data.action.type !== "POP" &&
        e.data.action.type !== "POP_TO_TOP"
      ) {
        return;
      }
      e.preventDefault();
      navigation.reset({
        index: 0,
        routes: [{ name: SCREEN_NAMES.SESSION_SETUP }],
      });
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <LinearGradient
      colors={[
        Theme.dashboardGradient.start,
        Theme.dashboardGradient.middle,
        Theme.dashboardGradient.end,
      ]}
      style={styles.gradient}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <AppStatusBar barStyle="light-content" />
        <Animated.View
          style={[
            styles.background,
            {
              transform: [{ rotate: spin }],
            },
          ]}
        >
          {/* Keep your background positioned correctly inside */}
          <View style={styles.backgroundImage}>
            <ImageBackground
              source={require("@/assets/images/background3.png")}
              style={{ width: "135%", height: "135%" }}
              resizeMode="contain"
            />
          </View>
        </Animated.View>

        <View className="flex-1 px-4 pt-3">
          <>
            <>
              <BackHeader />
            </>

            {/* Oxify Logo */}
            <View
              className="flex-row items-center justify-center"
              style={{
                marginTop: RFValue(-28),
              }}
            >
              <Image
                source={require("@/assets/images/white_logo.png")}
                style={{ width: 40, height: 40, marginRight: 10 }}
                contentFit="contain"
              />
              <Image
                source={require("@/assets/images/oxify_logo.png")}
                style={{ width: 73, height: 32 }}
                contentFit="contain"
              />
            </View>
          </>

          {/* Progress Circle */}
          <View className="flex-1 justify-center items-center -mt-28">
            <Svg width={size} height={size}>
              {/* Background Circle (gray decreases with progress) */}
              <Circle
                stroke="#C2C2C2"
                fill="none"
                cx={size / 2}
                cy={size / 2}
                r={radius}
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={0}
              />

              {/* Progress Circle */}
              <Circle
                stroke={progressColor}
                fill="none"
                cx={size / 2}
                cy={size / 2}
                r={radius}
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                rotation="-90"
                originX={size / 2}
                originY={size / 2}
              />

              {/* Inner Decorative Circle */}
              <Circle
                stroke="#8BAFCE"
                fill="none"
                cx={size / 2}
                cy={size / 2}
                r={radius - 30}
                strokeWidth={3}
              />
            </Svg>

            {/* Inner Content */}
            <View className="absolute inset-0 items-center justify-center">
              <Text
                className="mb-2"
                style={{ fontSize: 22, fontFamily: "InterMedium", color: Theme.text.neutral }}
                // style={{ color: Theme.text.neutral }}
              >
                {isFinished ? "Finished" : isPaused ? "Paused" : "In Progress"}
              </Text>
              <Text
                className=" mb-2"
                style={{ color: Theme.text.neutral, fontSize: 50, fontFamily: "InterMedium" }}
              >
                {formatTime(timeLeft)}
              </Text>
              <Text style={{ color: Theme.text.neutral, fontSize: 18, fontFamily: "InterMedium" }}>
                Goal:{" "}
                {Math.floor(currentGoalDuration / 60)
                  .toString()
                  .padStart(2, "0")}
                :{(currentGoalDuration % 60).toString().padStart(2, "0")}
              </Text>
            </View>
          </View>

          {/* Bottom Control Button */}
          <View className="items-center pb-8">
            {isFinished ? (
              <TouchableOpacity
                style={styles.finishButton}
                onPress={handleFinishSession}
                activeOpacity={0.85}
                className="p-5"
              >
                <FontAwesome5
                  name="flag-checkered"
                  size={RFValue(30)}
                  color="#EB4335"
                />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.playPauseButton}
                onPress={togglePause}
                activeOpacity={0.9}
                className="p-5"
              >
                {isPaused ? (
                  <Ionicons name="play" size={RFValue(40)} color="#FFFFFF" />
                ) : (
                  <Ionicons name="pause" size={RFValue(40)} color="#FFFFFF" />
                )}
              </TouchableOpacity>
            )}
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
  background: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  backgroundImage: {
    position: "absolute",
    top: RFValue(-320),
    left: RFValue(-135),
    right: RFValue(135),
    bottom: RFValue(320),
    opacity: 0.5,
  },
  playPauseButton: {
    backgroundColor: "#8BAFCE",
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 6,
  },
  finishButton: {
    backgroundColor: "#833C41",
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 6,
  },
});

export default SessionInProgressScreen;
