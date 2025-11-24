import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
  ImageBackground,
} from "react-native";
import { Theme } from "../../constants";
import { LinearGradient } from "expo-linear-gradient";
import AuthButton from "../../components/auth/AuthButton";
const { useNavigation, useRoute } = require("@react-navigation/native");
import { useAuth } from "../../contexts/AuthContext";
import { TEXT_SIZES } from "@/constants/textSizes";
import Buttons from "@/components/common/Buttons";
import { RFValue } from "react-native-responsive-fontsize";
import { animatedDuration, screenHeight } from "@/constants/comman";
import { SafeAreaView } from "react-native-safe-area-context";
import { Entypo } from "@expo/vector-icons";

interface RouteParams {
  firstName: string;
  lastName: string;
  email: string;
  healthGoals: string[];
}

const SignupSuccessScreen: React.FC = () => {
  const navigation: any = useNavigation();
  const route = useRoute();
  const { firstName } = route.params as RouteParams;
  const { login } = useAuth();

  const handleGetStarted = () => {
    // Navigate to main app and replace current stack
    navigation.replace("MainStack");
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
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.content}>
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
            style={[
              styles.successSection,
              { transform: [{ translateY: slideAnim }] },
            ]}
          >
            <View style={styles.iconSection}>
              <View style={styles.checkmarkContainer}>
                <Entypo name="check" size={RFValue(30)} color="#000000" />
              </View>
            </View>

            <Text style={styles.title}>Success!</Text>
            <Text style={styles.subtitle}>
              You're all set up and ready to go.
            </Text>
          </Animated.View>

          <Animated.View
            style={[
              styles.buttonContainer,
              { transform: [{ translateY: buttonAnim }] },
            ]}
          >
            <Buttons
              onPress={handleGetStarted}
              title="Done"
              isLoading={false}
            />
          </Animated.View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    paddingTop: 12,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 80,
    paddingBottom: 40,
  },
  successSection: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  iconSection: {
    alignItems: "center",
    marginBottom: RFValue(24),
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
  title: {
    fontSize: TEXT_SIZES.xxl,
    fontWeight: "700",
    color: Theme.text.inverse,
    textAlign: "center",
    marginBottom: 16,
  },
  subtitle: {
    fontSize: TEXT_SIZES.md,
    color: "#DDE2E5",
    textAlign: "center",
    marginBottom: 24,
  },
  background: {
    flex: 1,
    width: "150%",
    height: "150%",
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
  buttonContainer: {
    position: "absolute",
    bottom: 40,
    left: 24,
    right: 24,
    backgroundColor: 'transparent',
  },
});

export default SignupSuccessScreen;
