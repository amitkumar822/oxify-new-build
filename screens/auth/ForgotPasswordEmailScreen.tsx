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
const { useNavigation } = require("@react-navigation/native");
import { showToast } from "../../config/toast";
import { authApi } from "../../api/auth";
import { BackHeader } from "@/helpers/BackHeader";
import { SafeAreaView } from "react-native-safe-area-context";
import { TEXT_SIZES } from "@/constants/textSizes";
import Buttons from "@/components/common/Buttons";
import { Ionicons } from "@expo/vector-icons";
import { RFValue } from "react-native-responsive-fontsize";
import { animatedDuration, screenHeight } from "@/constants/comman";

const ForgotPasswordEmailScreen: React.FC = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigation: any = useNavigation();

  // --- Animation setup ---
  const backgroundPosition = useRef(
    new Animated.ValueXY({ x: RFValue(40), y: RFValue(360) })
  ).current;
  const slideAnim = useRef(new Animated.Value(-screenHeight)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(backgroundPosition, {
        toValue: { x: RFValue(20), y: RFValue(-240) },
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

  const handleContinue = async () => {
    if (!email.trim()) {
      setError("Please enter your email address");
      return;
    }

    if (!isValidEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Send OTP to the email
      const response = await authApi.generateForgotPasswordOtp(email);

      if (response.success) {
        showToast.success("Verification code sent to your email");
        // Navigate to verification screen with email
        navigation.navigate(SCREEN_NAMES.FORGOT_PASSWORD_VERIFICATION, {
          email,
        });
      } else {
        setError(response.error || "Failed to send verification code");
      }
    } catch (e) {
      showToast.error("Failed to send verification code");
    } finally {
      setIsLoading(false);
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

  const handleEmailChange = (text: string) => {
    setEmail(text);
    if (error) setError("");
  };

  const handleLoginLink = () => {
    try {
      navigation.navigate(SCREEN_NAMES.LOGIN_EMAIL);
    } catch (e) {
      showToast.error("Failed to navigate to login");
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
              source={require("../../assets/images/background1.png")}
              style={styles.backgroundImage}
              resizeMode="contain"
            />
          </Animated.View>

          <Animated.View
            style={{
              flex: 1,
              transform: [{ translateY: slideAnim }],
            }}
          >
            <BackHeader handleBack={handleBack} />

            {/* Keyboard avoiding for input fields */}
            <KeyboardAvoidingView
              style={{ flex: 1 }}
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              keyboardVerticalOffset={Platform.OS === "ios" ? 15 : 0}
              enabled={true}
            >
              <View style={styles.contentContainer}>
                <View style={styles.iconSection}>
                  <Ionicons
                    name="lock-closed-outline"
                    size={RFValue(24)}
                    color={Theme.text.neutral}
                    style={styles.lockIcon}
                  />
                </View>

                <Text style={styles.mainTitle}>Forgot your password?</Text>
                <Text style={styles.subtitle}>
                  Enter the email associated with your account.
                </Text>

                <View>
                  <TextInput
                    style={[styles.inputBox, error && styles.inputError]}
                    onChangeText={handleEmailChange}
                    value={email}
                    placeholder="Email address"
                    placeholderTextColor="#797979"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                  {error && <Text style={styles.errText}>{error}</Text>}
                </View>

                <View>
                  <Text style={styles.loginLinkText}>
                    Remember your password?{" "}
                    <Text style={styles.loginLink} onPress={handleLoginLink}>
                      Log in.
                    </Text>
                  </Text>
                </View>
              </View>

              {/* Continue button */}
              <View style={styles.buttonContainer}>
                <Buttons
                  onPress={handleContinue}
                  title="Continue"
                  isLoading={isLoading}
                  style={{
                    backgroundColor: !email.trim() ? "#b9b1b1" : "#F3F3F3",
                    borderRadius: 14,
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

export default ForgotPasswordEmailScreen;

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  contentContainer: {
    flex: 1,
    paddingTop: 10,
    paddingBottom: 20,
  },
  buttonContainer: {
    marginTop: "auto",
    marginBottom: 56,
    borderRadius: 14,
  },
  iconSection: {
    alignItems: "flex-start",
    marginTop: 10,
  },
  mainTitle: {
    fontSize: TEXT_SIZES.lg,
    color: Theme.text.neutral,
    fontFamily: "Inter-medium",
    fontWeight: "500",
    marginVertical: 8,
  },
  subtitle: {
    fontSize: TEXT_SIZES.sm,
    color: "#DDE2E5",
    marginBottom: RFValue(10),
  },
  inputBox: {
    backgroundColor: Theme.background.primary,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: TEXT_SIZES.md,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: "#8BAFCE",
  },
  inputError: {
    borderColor: "#FF4D4F",
  },
  errText: {
    color: "#FF4D4F",
    fontSize: 13,
    marginBottom: 8,
    marginLeft: 4,
  },
  loginLinkText: {
    fontSize: TEXT_SIZES.md,
    color: "#DDE2E5",
  },
  loginLink: {
    paddingLeft: 4,
    color: "#DDE2E5",
    fontWeight: "600",
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
    width: "120%",
    height: "140%",
  },

  lockIcon: {
    marginBottom: 4,
  },
});
