import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  Animated,
  ImageBackground,
  Easing,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { Theme, SCREEN_NAMES } from "../../constants";
import { LinearGradient } from "expo-linear-gradient";
const { useNavigation, useRoute } = require("@react-navigation/native");
import { showToast } from "../../config/toast";
import { authApi } from "../../api/auth";
import { BackHeader } from "@/helpers/BackHeader";
import { SafeAreaView } from "react-native-safe-area-context";
import { TEXT_SIZES } from "@/constants/textSizes";
import Buttons from "@/components/common/Buttons";
import { Feather } from "@expo/vector-icons";
import { RFValue } from "react-native-responsive-fontsize";
import { animatedDuration, screenHeight } from "@/constants/comman";

interface RouteParams {
  email: string;
}

const ForgotPasswordVerificationScreen: React.FC = () => {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const navigation: any = useNavigation();
  const route = useRoute();
  const { email } = route.params as RouteParams;

  // --- Animation setup ---
  const backgroundPosition = useRef(
    new Animated.ValueXY({ x: RFValue(58), y: RFValue(-215) })
  ).current;
  const slideAnim = useRef(new Animated.Value(screenHeight)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(backgroundPosition, {
        toValue: { x: RFValue(40), y: RFValue(360) },
        duration: 1000,
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

  useEffect(() => {
    // Start resend timer
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleContinue = async () => {
    if (!otp.trim()) {
      setError("Please enter the verification code");
      return;
    }

    if (otp.length < 4) {
      setError("Please enter a valid verification code");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await authApi.verifyEmailOtp(email, otp);

      if (response.success) {
        showToast.success("Email verified successfully");
        navigation.navigate(SCREEN_NAMES.FORGOT_PASSWORD_NEW, { email });
      } else {
        setError(response.error || "Verification failed");
      }
    } catch (e) {
      showToast.error("Failed to verify email");
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

  const handleResendCode = async () => {
    if (resendTimer > 0) return;

    setIsLoading(true);
    try {
      const response = await authApi.generateForgotPasswordOtp(email);

      if (response.success) {
        showToast.success("Verification code sent");
        setResendTimer(60); // 60 seconds cooldown
      } else {
        showToast.error(response.error || "Failed to send code");
      }
    } catch (e) {
      showToast.error("Failed to resend code");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (text: string) => {
    setOtp(text);
    if (error) setError("");
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
              keyboardVerticalOffset={Platform.OS === "ios" ? 10 : 0}
              enabled={true}
            >
              <View style={styles.contentContainer}>
                <View style={styles.iconSection}>
                  <Feather name="mail" size={RFValue(25)} color="white" />
                </View>

                <Text style={styles.mainTitle}>Check your email</Text>
                <Text style={styles.subtitle}>
                  We sent a verification code to{"\n"}
                  <Text style={styles.emailText}>{email}</Text>
                </Text>

                <View style={styles.inputWrap}>
                  <TextInput
                    style={[styles.inputBox, error && styles.inputError]}
                    onChangeText={handleOtpChange}
                    value={otp}
                    placeholder="Enter verification code"
                    placeholderTextColor="#797979"
                    keyboardType="numeric"
                    autoCapitalize="none"
                    autoCorrect={false}
                    maxLength={6}
                  />
                  {error && <Text style={styles.errText}>{error}</Text>}
                </View>

                <View style={styles.resendSection}>
                  <Text style={styles.resendText}>
                    Didn't receive the code?{" "}
                  </Text>
                  <Text
                    style={[
                      styles.resendLink,
                      resendTimer > 0 && styles.resendLinkDisabled,
                    ]}
                    onPress={handleResendCode}
                  >
                    {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend"}
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
                    backgroundColor: !otp.trim() ? "#b9b1b1" : "#F3F3F3",
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

export default ForgotPasswordVerificationScreen;

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
    lineHeight: 20,
    textAlign: "left",
  },
  emailText: {
    fontSize: TEXT_SIZES.sm,
    fontWeight: "400",
    color: "#DDE2E5",
  },
  inputWrap: {
    marginBottom: RFValue(4),
  },
  inputBox: {
    backgroundColor: Theme.background.primary,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: TEXT_SIZES.md,
    marginBottom: 4,
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
  resendSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  resendText: {
    fontSize: TEXT_SIZES.md,
    color: "#DDE2E5",
  },
  resendLink: {
    fontSize: TEXT_SIZES.md,
    color: "#DDE2E5",
    fontWeight: "600",
  },
  resendLinkDisabled: {
    color: "#9E9E9E",
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
});
