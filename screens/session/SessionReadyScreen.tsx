import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
  Easing,
  ImageBackground,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import AntDesign from "@expo/vector-icons/AntDesign";
const { useNavigation, useRoute } = require("@react-navigation/native");
import { SCREEN_NAMES, Theme } from "../../constants";
import { BackHeader } from "@/helpers/BackHeader";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { RFValue } from "react-native-responsive-fontsize";
import { SafeAreaView } from "react-native-safe-area-context";
import { animatedDuration, screenHeight } from "@/constants/comman";
import { AppStatusBar } from "@/helpers/AppStatusBar";
import { TEXT_SIZES } from "@/constants/textSizes";

interface RouteParams {
  sessionData: {
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

const SessionReadyScreen: React.FC = () => {
  const navigation: any = useNavigation();
  const route = useRoute();
  const { sessionData } = route.params as RouteParams;

  const [countdown, setCountdown] = useState(3);
  const [isCountingDown, setIsCountingDown] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(1));
  const [scaleAnim] = useState(new Animated.Value(1));

  // Use refs to store intervals for proper cleanup
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const animationIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-start countdown when component mounts
  useEffect(() => {
    startCountdown();

    // Cleanup on unmount
    return () => {
      if (countdownIntervalRef.current)
        clearInterval(countdownIntervalRef.current);
      if (animationIntervalRef.current)
        clearInterval(animationIntervalRef.current);
    };
  }, []);

  const startCountdown = () => {
    setIsCountingDown(true);
    setIsPaused(false);
    setCountdown(3);

    // Clear any existing intervals
    if (countdownIntervalRef.current)
      clearInterval(countdownIntervalRef.current);
    if (animationIntervalRef.current)
      clearInterval(animationIntervalRef.current);

    // Start countdown interval
    countdownIntervalRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          if (countdownIntervalRef.current)
            clearInterval(countdownIntervalRef.current);
          // Navigate to next screen after countdown completes
          setTimeout(() => {
            navigation.navigate(SCREEN_NAMES.SESSION_IN_PROGRESS, {
              sessionData,
            });
          }, 500);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Start animation interval
    animationIntervalRef.current = setInterval(() => {
      if (countdown > 0) {
        animateNumber();
      } else {
        if (animationIntervalRef.current)
          clearInterval(animationIntervalRef.current);
      }
    }, 1000);
  };

  const animateNumber = () => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.8,
          duration: 200,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  };

  const togglePause = () => {
    if (isCountingDown && countdown > 0) {
      if (isPaused) {
        // Resume: restart countdown from current number
        setIsPaused(false);
        resumeCountdown();
      } else {
        // Pause: stop the countdown
        setIsPaused(true);
        pauseCountdown();
      }
    }
  };

  const pauseCountdown = () => {
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }
    if (animationIntervalRef.current) {
      clearInterval(animationIntervalRef.current);
      animationIntervalRef.current = null;
    }
  };

  const resumeCountdown = () => {
    if (countdown > 0) {
      // Resume countdown from current number
      countdownIntervalRef.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            if (countdownIntervalRef.current)
              clearInterval(countdownIntervalRef.current);
            // Navigate to next screen after countdown completes
            setTimeout(() => {
              navigation.navigate(SCREEN_NAMES.SESSION_IN_PROGRESS, {
                sessionData,
              });
            }, 500);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // Resume animation
      animationIntervalRef.current = setInterval(() => {
        if (countdown > 0) {
          animateNumber();
        } else {
          if (animationIntervalRef.current)
            clearInterval(animationIntervalRef.current);
        }
      }, 1000);
    }
  };

  const handleSkip = () => {
    // Clear any running intervals before skipping
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }
    if (animationIntervalRef.current) {
      clearInterval(animationIntervalRef.current);
      animationIntervalRef.current = null;
    }

    // Navigate to next screen immediately
    navigation.navigate(SCREEN_NAMES.SESSION_IN_PROGRESS, { sessionData });
  };

  // --- Animation setup ---
  const backgroundPosition = useRef(
    new Animated.ValueXY({ x: RFValue(58), y: RFValue(350) })
  ).current;
  const slideAnim = useRef(new Animated.Value(-screenHeight)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(backgroundPosition, {
        toValue: { x: RFValue(40), y: RFValue(60) },
        duration: animatedDuration,
        useNativeDriver: false,
      }),

      Animated.timing(slideAnim, {
        toValue: 0,
        duration: animatedDuration,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

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
              top: backgroundPosition.y,
              left: backgroundPosition.x,
            },
          ]}
        >
          <ImageBackground
            source={require("@/assets/images/background1.png")}
            style={styles.backgroundImage}
            resizeMode="contain"
          />
        </Animated.View>

        <Animated.View
          className="flex-1 px-4 pt-3"
          style={{
            flex: 1,
            transform: [{ translateY: slideAnim }],
          }}
        >
          {/* Header */}
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

          <View className="flex-1 justify-center items-center -mb-4">
            <Animated.View
              style={{
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }],
              }}
            >
              <Text
                style={{
                  fontSize: 140,
                  fontFamily: "InterMedium",
                  color: "#DDE2E5",
                }}
              >
                {isCountingDown ? countdown : "3"}
              </Text>
            </Animated.View>

            <Text
              style={{
                fontSize: 40,
                fontFamily: "InterMedium",
                color: "#DDE2E5",
              }}
            >
              {isPaused ? "Paused" : countdown > 0 ? "Ready" : "Starting..."}
            </Text>
          </View>

          {/* Botton Nav Bar */}
          <View
            className="flex flex-row items-center pb-8 w-full"
            style={{
              justifyContent: "space-around",
            }}
          >
            <AntDesign
              name="double-left"
              size={RFValue(32)}
              style={{
                color: "#8BAFCE",
                opacity: 0,
              }}
            />
            <TouchableOpacity
              className="bg-[#8BAFCE] p-5 rounded-full items-center justify-center"
              onPress={togglePause}
              disabled={!isCountingDown || countdown <= 0}
            >
              {isPaused ? (
                <Ionicons name="play" size={RFValue(40)} color="#FFFFFF" />
              ) : (
                <Ionicons name="pause" size={RFValue(40)} color="#FFFFFF" />
              )}
            </TouchableOpacity>

            {/* Skip Button */}
            <TouchableOpacity
              // style={styles.skipButton}
              onPress={handleSkip}
              disabled={false}
            >
              <AntDesign
                name="double-right"
                size={RFValue(32)}
                color="#8BAFCE"
              />
            </TouchableOpacity>
          </View>
        </Animated.View>
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
    flex: 1,
    width: "120%",
    height: "120%",
    position: "absolute",
    transform: [{ rotate: "180deg" }],
    opacity: 0.5,
  },
  backgroundImage: {
    flex: 1,
    width: "130%",
    marginLeft: "-15%",
    height: "140%",
  },
});

export default SessionReadyScreen;
