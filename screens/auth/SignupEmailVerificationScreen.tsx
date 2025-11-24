import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  ScrollView,
  Animated,
  ImageBackground,
  Easing,
} from "react-native";
// @ts-ignore
import { useNavigation, useRoute } from "@react-navigation/native";
import { Theme, SCREEN_NAMES } from "../../constants";
import { LinearGradient } from "expo-linear-gradient";
import { authApi } from "../../api/auth";
import { showToast } from "../../config/toast";
import { AppStatusBar } from "@/helpers/AppStatusBar";
import { BackHeader } from "@/helpers/BackHeader";
import { SafeAreaView } from "react-native-safe-area-context";
import { TEXT_SIZES } from "@/constants/textSizes";
import { hp, wp } from "@/constants/screenWH";
import Buttons from "@/components/common/Buttons";
import { Feather } from "@expo/vector-icons";
import { RFValue } from "react-native-responsive-fontsize";
import { animatedDuration, screenHeight } from "@/constants/comman";
import useKeyboard from "@/utils/useKeyboard";

interface RouteParams {
  email: string;
}

const SignupEmailVerificationScreen: React.FC = () => {
  const [verificationCode, setVerificationCode] = useState("");
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState("");
  const navigation: any = useNavigation();
  const route = useRoute();
  const { email } = route.params as RouteParams;

  const { dismissKeyboard } = useKeyboard();

  const handleContinue = async () => {
    if (!verificationCode.trim()) {
      setError("Please enter the verification code");
      return;
    }
    if (verificationCode.length !== 6) {
      setError("Please enter a valid 6-digit code");
      return;
    }

    try {
      setSubmitting(true);
      dismissKeyboard();

      const response = await authApi.verifyEmailOtp(email, verificationCode);
      if (response?.success) {
        showToast.success("Email verified successfully");
        navigation.navigate(SCREEN_NAMES.SIGNUP_NAME, { email });
      } else {
        showToast.error(response?.error || "Invalid verification code");
      }
    } catch (e) {
      showToast.error("Network error while verifying code");
    } finally {
      setSubmitting(false);
    }
  };

  const handleResendCode = () => {
    console.log("Resending verification code to:", email);
  };

  const handleBack = () => {
    try {
      navigation.goBack();
    } catch (e) {
      console.warn("Navigation back error:", e);
      showToast.error("Failed to go back");
    }
  };

  // --- Animation setup ---
  const slideAnim = useRef(new Animated.Value(screenHeight)).current;
  const backgroundPosition = useRef(
    new Animated.ValueXY({ x: RFValue(58), y: RFValue(-215) })
  ).current;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: animatedDuration,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();

    Animated.timing(backgroundPosition, {
      toValue: { x: RFValue(40), y: RFValue(360) },
      duration: animatedDuration,
      useNativeDriver: false,
    }).start();
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
        <AppStatusBar barStyle="light-content" backgroundColor="transparent" />

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
          style={{
            flex: 1,
            transform: [{ translateY: slideAnim }],
          }}
        >
          {/* Back button */}
          <BackHeader title="Back" handleBack={handleBack} />

          {/* Keyboard avoiding for input fields */}
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
            enabled={true}
          >
            <View style={styles.contentContainer}>
              <View style={styles.iconSection}>
                <Feather name="mail" size={RFValue(25)} color="white" />
              </View>

              <Text style={styles.mainTitle}>Verify Your Email</Text>
              <Text style={styles.subtitle}>
                We've sent a 6-digit verification code to{"\n"}
                <Text style={styles.emailText}>{email}</Text>
              </Text>

              <View style={styles.inputWrap}>
                <TextInput
                  style={[styles.inputBox, error && styles.inputError]}
                  onChangeText={(text) => {
                    setVerificationCode(text);
                    if (error) setError("");
                  }}
                  value={verificationCode}
                  placeholder="Enter 6-digit code"
                  placeholderTextColor="#797979"
                  keyboardType="numeric"
                  maxLength={6}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                {error && <Text style={styles.errText}>{error}</Text>}
              </View>

              <View style={styles.resendSection}>
                <Text style={styles.resendText}>Didn't get the code? </Text>
                <Text style={styles.resendLink} onPress={handleResendCode}>
                  Resend
                </Text>
              </View>
            </View>

            {/* Continue button */}
            <View style={styles.buttonContainer}>
              <Buttons
                onPress={handleContinue}
                title="Verify Email"
                isLoading={submitting}
                style={{   
                  backgroundColor:
                    !verificationCode.trim() || submitting
                      ? "#b9b1b1"
                      : "rgba(221, 226, 229, 1)",
                  borderRadius: 14,
                  // marginBottom: 16
                }}
              />
            </View>
          </KeyboardAvoidingView>
        </Animated.View>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default SignupEmailVerificationScreen;

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
  iconSection: {
    alignItems: "flex-start",
    paddingTop: 22,
    marginBottom: 10,
  },
  mainTitle: {
    fontSize: 20,
    fontFamily: "Inter-medium",
    fontWeight: "500",
    color: "white",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: TEXT_SIZES.sm,
    color: Theme.text.secondary,
    marginBottom: 10,
    textAlign: "left",
    lineHeight: 20,
  },
  emailText: {
    fontSize: TEXT_SIZES.md,
    fontWeight: "semibold",
    color: "white",
  },
  inputWrap: {
    marginBottom: wp(1),
  },
  inputBox: {
    borderWidth: 2,
    borderColor: "#8BAFCE",
    fontSize: TEXT_SIZES.md,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 12,
    backgroundColor: Theme.background.primary,
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
    justifyContent: "flex-start",
    alignItems: "center",
  },
  resendText: {
    fontSize: TEXT_SIZES.md,
    color: "#797979",
  },
  resendLink: {
    fontSize: TEXT_SIZES.md,
    color: "#007AFF",
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
});
