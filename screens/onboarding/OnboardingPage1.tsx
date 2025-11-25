import React, { FC, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  Image,
  StyleSheet,
  ImageBackground,
  Animated,
} from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { RFValue } from "react-native-responsive-fontsize";
import { SafeAreaView } from "react-native-safe-area-context";
import { SCREEN_NAMES, Theme } from "@/constants";
import { LinearGradient } from "expo-linear-gradient";
const { useNavigation } = require("@react-navigation/native");
const { height: SCREEN_HEIGHT } = Dimensions.get("window");

const OnboardingPage1: FC = () => {
  const navigation = useNavigation();

  const handleNext = () => {
    navigation.navigate(SCREEN_NAMES.ONBOARDING_2);
  };

  const handleSkip = () => {
    navigation.navigate(SCREEN_NAMES.WELCOME);
  };

  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: false,
    }).start();
  }, []);

  const animatedTop = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [RFValue(-100), RFValue(-230)],
  });

  const animatedLeft = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [RFValue(-20), RFValue(0)], // start → end
  });

  const animatedWidth = anim.interpolate({
    inputRange: [0, 1],
    outputRange: ["105%", "114%"], // start → end
  });

  const animatedHeight = anim.interpolate({
    inputRange: [0, 1],
    outputRange: ["100%", "98%"], // start → end
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
      <SafeAreaView style={{ flex: 1 }}>
        {/* Animated Background Image */}
        <Animated.View
          style={[
            styles.background,
            {
              top: animatedTop,
              left: animatedLeft,
              width: animatedWidth,
              height: animatedHeight,
            },
          ]}
        >
          <ImageBackground
            source={require("@/assets/images/background1.png")}
            style={styles.backgroundImage}
            resizeMode="cover"
          />
        </Animated.View>

        <View className="z-10 flex-1 justify-center items-center px-1">
          {/* Logo Section */}
          <View
            className="absolute flex flex-col items-center justify-center"
            style={{ top: SCREEN_HEIGHT * 0.08 }}
          >
            <Image
              source={require("../../assets/images/white_logo.png")}
              style={{
                width: 50,
                height: 52,
                borderRadius: 12,
                marginBottom: 16,
              }}
            />
            <Image
              source={require("../../assets/icons/Wordmark_White.png")}
              style={{
                width: 85,
                height: 40,
                borderRadius: 12,
                marginBottom: 6,
              }}
            />
          </View>

          <View className="flex-1 justify-center items-center px-1 absolute bottom-14 left-0 right-0">
            {/* Page Indicators */}
            <View className="flex flex-row justify-center items-center space-x-2 mb-[21px]">
              <View className="w-2 h-2 rounded-full bg-[#8BAFCE] mr-2"></View>
              <View className="w-2 h-2 rounded-full bg-[#D9D9D9] mr-2"></View>
              <View className="w-2 h-2 rounded-full bg-[#D9D9D9]"></View>
            </View>

            {/* Content Container */}
            <View
              className=" flex justify-center items-start w-full"
              style={{
                paddingHorizontal: 16,
                paddingBottom: 20,
              }}
            >
              <View
                className="flex-row items-start w-full"
                style={{
                  gap: 3,
                }}
              >
                <Text
                  className="text-[#6189AD] "
                  style={{
                    fontFamily: "InterRegular",
                    fontSize: 23,
                    lineHeight: 28,
                  }}
                >
                  01
                </Text>
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontFamily: "InterRegular",
                      fontSize: 23,
                      lineHeight: 28,
                      color: "#E9EEF2",
                    }}
                  >
                    Welcome to Oxify
                  </Text>
                  <Text
                    className="text-[#6189AD] mb-4 leading-5 text-start"
                    style={{
                      fontFamily: "InterRegular",
                      fontSize: 12,
                      lineHeight: 18, // 150%
                      letterSpacing: -0.24, // -2%
                      color: "#6189AD",
                    }}
                  >
                    Your personal hyperbaric oxygen therapy companion. Track
                    sessions, monitor progress, and optimize your wellness
                    journey with advanced HBOT protocols.
                  </Text>
                </View>

                {/* Button Container */}
                <View
                  className="gap-3 justify-center items-center flex-col pt-1 ml-1"
                  style={{ flexShrink: 0 }}
                >
                  <TouchableOpacity
                    className="flex justify-center items-center"
                    style={{
                      width: 115,
                      borderWidth: 0.5,
                      borderColor: "#DDE2E5",
                      borderRadius: 18,
                      paddingVertical: 5,
                      minWidth: 70,
                    }}
                    onPress={handleSkip}
                  >
                    <Text
                      className="text-white"
                      style={{
                        fontFamily: "InterMedium",
                        fontSize: 12,
                      }}
                    >
                      Skip
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    className="flex-row items-center justify-center"
                    style={{
                      width: 115,
                      borderWidth: 0.5,
                      borderColor: "#DDE2E5",
                      borderRadius: 18,
                      paddingVertical: 5,
                      minWidth: 70,
                      backgroundColor: "#DDE2E5",
                    }}
                    onPress={handleNext}
                  >
                    <Text
                      className="text-[#090B0D] mr-2"
                      style={{
                        fontFamily: "InterMedium",
                        fontSize: 12,
                      }}
                    >
                      Next
                    </Text>
                    <Feather name="arrow-right" size={16} color="black" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
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
    left: 0,
    top: 0,
    width: "100%",
    height: "100%",
    zIndex: 1,
    opacity: 0.5,
  },
  backgroundImage: {
    position: "absolute",
    left: 0,
    top: RFValue(-70),
    width: "145%",
    height: "115%",
    zIndex: 1,
  },
});

export default OnboardingPage1;
