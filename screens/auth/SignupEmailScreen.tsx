import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Animated,
  ImageBackground,
  Easing,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { Theme, SCREEN_NAMES } from "../../constants";
import { LinearGradient } from "expo-linear-gradient";
const { useNavigation, useRoute } = require("@react-navigation/native");
import { authApi } from "../../api/auth";
import { showToast } from "../../config/toast";
import { BackHeader } from "@/helpers/BackHeader";
import { TEXT_SIZES } from "@/constants/textSizes";
import { SafeAreaView } from "react-native-safe-area-context";
import Buttons from "@/components/common/Buttons";
import { RFValue } from "react-native-responsive-fontsize";
import { animatedDuration, screenHeight } from "@/constants/comman";
import useKeyboard from "@/utils/useKeyboard";
import { AppStatusBar } from "@/helpers/AppStatusBar";
import { Ionicons } from "@expo/vector-icons";

const SignupEmailScreen: React.FC = () => {
  const { dismissKeyboard } = useKeyboard();
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const navigation: any = useNavigation();
  const route = useRoute();
  // No parameters needed for email screen

  const handleContinue = async () => {
    if (!email.trim()) {
      setError("Please enter your email address");
      return;
    }

    if (!isValidEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    try {
      setSubmitting(true);
      dismissKeyboard();

      const response = await authApi.generateEmailOtp(email);
      console.log("response", response);
      if (response?.success) {
        showToast.success("Verification code sent to your email");
        navigation.navigate(SCREEN_NAMES.SIGNUP_EMAIL_VERIFICATION, {
          email,
        });
      } else {
        showToast.error(response?.error || "Failed to send verification code");
      }
    } catch (e) {
      showToast.error("Network error while sending verification code");
    } finally {
      setSubmitting(false);
    }
  };

  const handleBack = () => {
    try {
      navigation.goBack();
    } catch (e) {
      showToast.error("Failed to go back");
    }
  };

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // --- Animation setup ---
  const slideAnim = useRef(new Animated.Value(screenHeight)).current;
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: animatedDuration,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();

    Animated.timing(anim, {
      toValue: 1,
      duration: animatedDuration,
      useNativeDriver: false, // layout props need JS driver
    }).start();
  }, []);

  const animatedTop = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [RFValue(-30), RFValue(-200)], // start → end
  });

  const animatedLeft = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [RFValue(85), RFValue(100)], // start → end
  });

  const animatedWidth = anim.interpolate({
    inputRange: [0, 1],
    outputRange: ["110%", "140%"], // start → end
  });

  const animatedHeight = anim.interpolate({
    inputRange: [0, 1],
    outputRange: ["92%", "100%"], // start → end
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
      <AppStatusBar barStyle="light-content" backgroundColor="transparent" />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <SafeAreaView style={{ flex: 1 }}>
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
              source={require("@/assets/images/background2.png")}
              style={styles.backgroundImage}
              resizeMode="cover"
            />
          </Animated.View>

          <Animated.View
            style={{
              flex: 1,
              transform: [{ translateY: slideAnim }],
            }}
          >
            {/* Back button */}
            <BackHeader handleBack={handleBack} />

            {/* Keyboard avoiding for input fields */}
            <KeyboardAvoidingView
              style={{ flex: 1 }}
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              keyboardVerticalOffset={Platform.OS === "ios" ? 10 : 0}
              enabled={true}
            >
              <View style={styles.contentContainer}>
                {/* Icon */}
                {/* <Text style={styles.icon}>@</Text> */}
                <Ionicons
                  name="at-outline"
                  size={RFValue(25)}
                  color="rgba(221, 226, 229, 1)"
                />

                {/* Title */}
                <Text style={styles.title}>Enter your email address</Text>

                {/* Input */}
                <TextInput
                  style={[styles.input, error ? styles.inputError : null]}
                  placeholder="Email address"
                  placeholderTextColor="#999"
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    if (error) setError("");
                  }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />

                {error ? <Text style={styles.error}>{error}</Text> : null}
              </View>

              {/* Continue button */}
              <View style={styles.buttonContainer}>
                <Buttons
                  onPress={handleContinue}
                  title="Continue"
                  isLoading={submitting}
                  style={{
                    backgroundColor:
                      !email.trim() || submitting ? "#b9b1b1" : "#F3F3F3",
                    borderRadius: 14,
                    // marginBottom: 16
                  }}
                />
              </View>
            </KeyboardAvoidingView>
          </Animated.View>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  contentContainer: {
    flex: 1,
    paddingTop: 8,
    paddingBottom: 20,
  },
  buttonContainer: {
    marginTop: "auto",
    marginBottom: 60,
    borderRadius: 14,
  },
  backButton: {
    marginBottom: 20,
  },
  backText: {
    color: Theme.text.neutral,
    fontSize: 17,
  },
  icon: {
    fontSize: TEXT_SIZES.xxxl,
    textAlign: "left",
    color: Theme.text.neutral,
    marginTop: 10,
  },
  title: {
    fontSize: TEXT_SIZES.lg,
    color: Theme.text.neutral,
    fontFamily: "Inter-medium",
    fontWeight: "500",
    marginVertical: 8,
  },
  input: {
    borderWidth: 2,
    borderColor: "#8BAFCE",
    fontSize: TEXT_SIZES.md,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 12,
    backgroundColor: Theme.background.primary,
  },
  inputError: {
    borderColor: "red",
  },
  error: {
    color: "red",
    fontSize: 14,
    marginBottom: 10,
  },
  background: {
    position: "absolute",
    opacity: 0.5,
  },
  backgroundImage: {
    position: "absolute",
    left: RFValue(-220),
    top: RFValue(-170),
    width: "120%",
    height: "110%",
    zIndex: 1,
  },
});

export default SignupEmailScreen;
