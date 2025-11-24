import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  Dimensions,
  Image,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Animated,
  Easing,
} from "react-native";
const { useNavigation } = require("@react-navigation/native");
import { SCREEN_NAMES, Theme } from "../../constants";
import { LinearGradient } from "expo-linear-gradient";
import { RFValue } from "react-native-responsive-fontsize";
import { animatedDuration, screenHeight } from "@/constants/comman";


const WelcomeScreen: React.FC = () => {
  const navigation: any = useNavigation();


  const handleLogin = () => {
    navigation.navigate(SCREEN_NAMES.LOGIN_SELECTION);
  };

  const handleSignup = () => {
    navigation.navigate(SCREEN_NAMES.SIGNUP_EMAIL);
  };

  // --- Background rotate + slide animation ---
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-screenHeight)).current;

  const rotateCount = 1;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(rotateAnim, {
        toValue: rotateCount,
        duration: animatedDuration * rotateCount,
        easing: Easing.linear,
        useNativeDriver: true,
      }),

      Animated.timing(slideAnim, {
        toValue: screenHeight / 2,
        duration: animatedDuration,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const spin = rotateAnim.interpolate({
    inputRange: Array.from({ length: rotateCount + 1 }, (_, i) => i),
    outputRange: Array.from(
      { length: rotateCount + 1 },
      (_, i) => `${i * 360}deg`
    ),
  });

  const slideX = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -40],
  });

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
      {/* Animated Background */}
      <Animated.View
        style={[
          styles.backgroundWrapper,
          {
            transform: [{ translateX: slideX }, { rotate: spin }],
          },
        ]}
      >
        <ImageBackground
          source={require("@/assets/images/background2.png")}
          style={styles.background}
          resizeMode="contain"
        />
      </Animated.View>

      {/* Logo and App Name */}
      <Animated.View
        className="absolute items-center justify-center"
        style={[
          styles.logoBackground,
          { transform: [{ translateY: slideAnim }] },
        ]}
      >
        <Image
          source={require("@/assets/images/white_logo.png")}
          style={{
            width: 49,
            height: 51,
            borderRadius: 11,
            marginBottom: 15,
          }}
        />
        <Image
          source={require("@/assets/icons/Wordmark_White.png")}
          style={{
            width: 84,
            height: 39,
            borderRadius: 11,
            marginBottom: 5,
          }}
        />
      </Animated.View>

      {/* Welcome Title and Subtitle */}
      <View className="absolute bottom-[58px] px-4">
        <View className="flex-1 items-center justify-center ">
            <View style={{ flex: 1, flexShrink: 1, paddingBottom: 57 }}>
              <Text
                className=" text-white text-center mb-2"
                style={{
                  fontSize: 36,
                  fontFamily: "InterMedium",
                }}
              >
                Welcome to Oxify
              </Text>
              <Text
                className=" text-[#E9EEF2B2] text-center mb-1 "
                style={{
                  fontSize: 15,
                  fontFamily: "InterRegular",
                  lineHeight: 20,
                  opacity: 0.7,
                }}
              >
                {/* Your personal hyperbaric oxygen therapy companion. Track sessions,
                monitor progress, and optimize your wellness journey with advanced
                HBOT protocols and personalized treatment plans. */}
                Your HBOT partner for tracking sessions, monitoring progress, and optimizing recovery.
              </Text>
            </View>
          {/* Buttons */}
          <View className=" flex items-center justify-center w-full">
            <View
              className="flex-row flex-wrap justify-between w-full"
            >
              {/* Login */}
              <TouchableOpacity
                onPress={handleLogin}
                className="flex-row items-center justify-center "
                style={{
                  width: '48%',
                  height: 54,
                  borderRadius: 14,
                  borderWidth: 1,
                  borderColor: "#DDE2E5",
                }}
              >
                <Text
                  className=" text-white "
                  style={{
                    fontSize: 16,
                    fontFamily: "InterMedium",
                  }}
                >
                  Login
                </Text>
              </TouchableOpacity>

              {/* Signup */}
              <TouchableOpacity
                onPress={handleSignup}
                className=" bg-[#DDE2E5] items-center justify-center"
                style={{
                  width: '48%',
                  height: 54,
                  borderRadius: 14,
                  borderWidth: 1,
                  borderColor: "#DDE2E5",
                }}
              >
                <Text
                  className="text-[#0B0C0E] "
                  style={{
                    fontSize: 16,
                    fontFamily: "InterMedium",
                  }}
                >
                  Signup
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  backgroundWrapper: {
    position: "absolute",
    top: RFValue(-450), // -501px
    left: RFValue(-173), // -173px
    width: "170%", // 170%
    height: "170%", // 170%
    opacity: 0.9,
  },
  background: {
    flex: 1,
    width: "110%", // 110%
    height: "110%", // 110%
  },
  logoBackground: {
    position: "absolute",
    top: -screenHeight * 0.245, // -211.5px
  },
});

export default WelcomeScreen;
