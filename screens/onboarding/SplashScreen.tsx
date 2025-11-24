import React, { useEffect } from "react";
import {
  View,
  Text,
  Image,
  Dimensions,
  ImageBackground,
  StyleSheet,
  Pressable,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { RFValue } from "react-native-responsive-fontsize";
import { SafeAreaView } from "react-native-safe-area-context";
import { SCREEN_NAMES, Theme } from "@/constants";
const { useNavigation } = require("@react-navigation/native");

interface SplashScreenProps {
  onPress?: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = () => {
  const navigation = useNavigation();

  console.log("SplashScreen");

  useEffect(() => {
    setTimeout(() => {
      navigation.navigate(SCREEN_NAMES.ONBOARDING_1);
    }, 500);
  }, []);

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
      <ImageBackground
        source={require("@/assets/images/background1.png")}
        style={styles.backgroundImage}
        resizeMode="cover"
      />
      <View style={styles.contentContainer}>
        {/* Logo + Text */}
        <View>
          <View style={styles.logoContainer}>
            <View style={styles.logoRow}>
              <Text
                style={styles.meetText}
              >
                MEET
              </Text>
              <Image
                source={require("../../assets/images/white_logo.png")}
                style={styles.whiteLogo}
              />
              <Image
                source={require("@/assets/images/oxify_logo.png")}
                style={styles.oxifyLogo}
              />
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
  },
  backgroundImage: {
    position: "absolute",
    left: 0,
    top: RFValue(-190),
    width: "145%",
    height: "115%",
    zIndex: 1,
    opacity: 0.5,
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    zIndex: 20,
  },
  logoContainer: {
    alignItems: "center",
  },
  logoRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  meetText: {
    fontFamily: "Inter",
    fontSize: RFValue(24),
    color: "#8AA9CC",
    marginRight: 4,
  },
  whiteLogo: {
    width: RFValue(40),
    height: RFValue(40),
    resizeMode: "contain",
    marginRight: 4,
  },
  oxifyLogo: {
    width: RFValue(130),
    height: RFValue(80),
    resizeMode: "contain",
  },
});

export default SplashScreen;
