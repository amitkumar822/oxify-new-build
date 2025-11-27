import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
  ImageBackground,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { Theme, SCREEN_NAMES } from "../../constants";
import { LinearGradient } from "expo-linear-gradient";
const { useNavigation, useRoute } = require("@react-navigation/native");
import { showToast } from "../../config/toast";
import { SafeAreaView } from "react-native-safe-area-context";
import { TEXT_SIZES } from "@/constants/textSizes";
import { hp, wp } from "@/constants/screenWH";
import Buttons from "@/components/common/Buttons";
import { Entypo } from "@expo/vector-icons";
import { RFValue } from "react-native-responsive-fontsize";
import { animatedDuration, screenHeight } from "@/constants/comman";

interface RouteParams {
  email: string;
}

const ForgotPasswordSuccessScreen: React.FC = () => {
  const navigation: any = useNavigation();
  const route = useRoute();
  const { email } = route.params as RouteParams;

  const handleLogin = () => {
    try {
      navigation.replace(SCREEN_NAMES.LOGIN_EMAIL);
    } catch (e) {
      showToast.error("Failed to navigate to login");
    }
  };

  // --- Animation setup ---
  const backgroundPosition = useRef(
    new Animated.ValueXY({ x: RFValue(58), y: RFValue(350) })
  ).current;
  const slideAnim = useRef(new Animated.Value(screenHeight)).current;
  const buttonAnim = useRef(new Animated.Value(-screenHeight * 0.7)).current;

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

      Animated.timing(buttonAnim, {
        toValue: 0,
        duration: animatedDuration + 100,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();
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
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <SafeAreaView style={{ flex: 1 }}>
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

          {/* Success Content */}
          <Animated.View
            style={[styles.content, { transform: [{ translateY: slideAnim }] }]}
          >
            <View style={styles.iconSection}>
              <View style={styles.checkmarkContainer}>
                <Entypo name="check" size={RFValue(30)} color="#000000" />
              </View>
            </View>

            <Text style={styles.mainTitle}>Success!</Text>
            <Text style={styles.subtitle}>
              Your password has been changed successfully!
            </Text>
          </Animated.View>

          {/* Login button - Fixed position */}
          <Animated.View
            style={[
              styles.buttonContainer,
              { transform: [{ translateY: buttonAnim }] },
            ]}
          >
            <Buttons
              onPress={handleLogin}
              title="Login"
              style={{
                opacity: 1,
              }}
            />
          </Animated.View>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </LinearGradient>
  );
};

export default ForgotPasswordSuccessScreen;

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: wp(10),
  },
  iconSection: {
    alignItems: "center",
    marginBottom: wp(4),
  },
  checkmarkContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#FFFFFF",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  mainTitle: {
    fontSize: TEXT_SIZES.xxxl,
    color: "#fff",
    fontWeight: "700",
    textAlign: "center",
    marginBottom: wp(2),
  },
  subtitle: {
    fontSize: TEXT_SIZES.md,
    color: "#797979",
    textAlign: "center",
    lineHeight: 24,
    paddingHorizontal: wp(4),
  },
  background: {
    flex: 1,
    width: "140%",
    height: "150%",
    position: "absolute",
    transform: [{ rotate: "180deg" }],
    opacity: 0.5,
  },
  backgroundImage: {
    flex: 1,
    width: "133%",
    marginLeft: "-11%",
    height: "140%",
  },
  buttonContainer: {
    position: "absolute",
    bottom: 40,
    left: 24,
    right: 24,
    backgroundColor: "transparent",
  },
});
