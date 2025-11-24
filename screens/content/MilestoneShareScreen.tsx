import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Animated,
  Easing,
  StyleSheet,
  ImageBackground,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { AntDesign, Feather } from "@expo/vector-icons";
const { useNavigation, useRoute } = require("@react-navigation/native");
import { SafeAreaView } from "react-native-safe-area-context";
import { AppStatusBar } from "../../helpers/AppStatusBar";
import { TEXT_SIZES } from "@/constants/textSizes";
import { Theme } from "@/constants";
import { RFValue } from "react-native-responsive-fontsize";
import ViewShot from "react-native-view-shot";
import * as Sharing from "expo-sharing";
import * as MediaLibrary from "expo-media-library";

const MilestoneShareScreen: React.FC = () => {
  const navigation: any = useNavigation();
  const route: any = useRoute();
  const { badgeData } = route.params || {};

  const rotateAnim = useRef(new Animated.Value(0)).current;
  const viewShotRef = useRef<any>(null);

  useEffect(() => {
    Animated.timing(rotateAnim, {
      toValue: 1,
      duration: 1500,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, []);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  // 📌 Capture & Share with image + text
  const captureAndShare = async () => {
    try {
      const uri = await viewShotRef.current.capture();
      if (!(await Sharing.isAvailableAsync())) {
        Alert.alert("Sharing not available on this device");
        return;
      }
      await Sharing.shareAsync(uri);
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

  // 📌 Capture & Save
  const captureAndSave = async () => {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission required", "Allow media access to save image.");
        return;
      }
      const uri = await viewShotRef.current.capture();
      await MediaLibrary.saveToLibraryAsync(uri);
      Alert.alert("Saved!", "Milestone card saved to gallery.");
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

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
        <Animated.View
          style={[
            styles.background,
            {
              transform: [{ rotate: spin }],
            },
          ]}
        >
          <View style={styles.backgroundImage}>
            <ImageBackground
              source={require("@/assets/images/background2.png")}
              style={{ width: "135%", height: "135%" }}
              resizeMode="contain"
            />
          </View>
        </Animated.View>

        <View className="flex-1 px-4 py-4">
          {/* Header */}
          <View className="flex-row items-center pt-3">
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              className="absolute left-0 z-10"
            >
              <AntDesign name="left" size={24} color="white" />
            </TouchableOpacity>
          </View>

          <View className="flex-1 justify-center">
            {/* Logo */}
            <View className="items-center mb-10">
              <View className="flex-row items-center">
                <Image
                  source={require("@/assets/images/white_logo.png")}
                  style={{
                    width: RFValue(35),
                    height: RFValue(35),
                    resizeMode: "contain",
                    marginRight: RFValue(6),
                  }}
                />
                <Text
                  className="text-white"
                  style={{ fontSize: TEXT_SIZES.xxxl, fontWeight: "600" }}
                >
                  Oxify
                </Text>
              </View>
            </View>

            {/* 🎯 Wrap your card with ViewShot */}
            <ViewShot ref={viewShotRef} options={{ format: "png", quality: 1 }}>
              <View
                className="bg-[#14181B] rounded-[32px] pt-[17px] pb-4 items-center"
                style={{
                  shadowColor: "#4C8BF566",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.5,
                  shadowRadius: 3.84,
                  elevation: 8,
                }}
              >
                <View className="border-b border-gray-700 pb-3 items-center w-full">
                  <View className="mb-[10px]">
                    <Image
                      source={require("@/assets/icons/batch.png")}
                      style={{
                        width: 52,
                        height: 52,
                        resizeMode: "contain",
                      }}
                    />
                  </View>

                  <Text
                    style={{
                      fontSize: 18,
                      color: "#4C8BF5",
                      fontFamily: "InterSemiBold",
                      lineHeight: 22,
                    }}
                  >
                    Congratulations!
                  </Text>

                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily: "InterMedium",
                      lineHeight: 19,
                      color: "#4C8BF5",
                      textAlign: "center",
                    }}
                  >
                    {`you achieved a milestone for ${badgeData?.day_count || 0} days streak`}
                  </Text>

                  <View className="flex-row items-center mt-3">
                    <Text style={{ fontSize: 35, fontFamily: "InterMedium" }}>
                      🔥
                    </Text>
                    <View className="flex-row items-center">
                      <Text
                        className="text-[#FF7100] ml-2 z-50"
                        style={{ fontSize: 24, fontFamily: "InterBold" }}
                      >
                        {badgeData?.day_count || 0}
                      </Text>
                      <Text
                        className="text-[#FF7100] ml-2 z-50"
                        style={{ fontSize: 18, fontFamily: "InterMedium" }}
                      >
                        Days Streak!
                      </Text>
                    </View>
                  </View>
                </View>

                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: "InterRegular",
                    color: "#6189AD",
                    textAlign: "center",
                    marginTop: 10,
                  }}
                >
                  Keep going! You're doing great!
                </Text>
              </View>
            </ViewShot>
          </View>
          {/* Buttons */}
          <View className="flex-row justify-center space-x-6 my-8 gap-4">
            <TouchableOpacity
              className="w-[65px] h-[65px] bg-[#6189AD] rounded-full items-center justify-center"
              onPress={captureAndSave}
            >
              <Feather name="download" size={29} color="white" />
            </TouchableOpacity>

            <TouchableOpacity
              className="w-[65px] h-[65px] bg-[#6189AD] rounded-full items-center justify-center"
              onPress={captureAndShare}
            >
              <Feather name="share-2" size={29} color="white" />
            </TouchableOpacity>
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
    top: RFValue(40), //-320
    left: RFValue(-135),
    right: RFValue(135),
    bottom: RFValue(300), //320
    opacity: 0.6,
  },
});

export default MilestoneShareScreen;
