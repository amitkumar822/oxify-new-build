import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  Animated,
  ImageBackground,
  Easing,
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
import { Feather, Ionicons } from "@expo/vector-icons";
import { RFValue } from "react-native-responsive-fontsize";
import { animatedDuration, screenHeight } from "@/constants/comman";

interface RouteParams {
  email: string;
  password: string;
}

const ForgotPasswordConfirmScreen: React.FC = () => {
  //---- Animation setup ----
  const backgroundPosition = useRef(
    new Animated.ValueXY({ x: RFValue(58), y: RFValue(-215) })
  ).current;
  const slideAnim = useRef(new Animated.Value(screenHeight)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(backgroundPosition, {
        toValue: { x: RFValue(40), y: RFValue(360) },
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

  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigation: any = useNavigation();
  const route = useRoute();
  const { email, password } = route.params as RouteParams;

  const handleSubmit = async () => {
    if (!confirmPassword.trim()) {
      setError("Please re-enter your password");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await authApi.forgotPasswordChange(
        confirmPassword,
        email
      );

      if (response.success) {
        showToast.success("Password changed successfully");
        navigation.navigate(SCREEN_NAMES.FORGOT_PASSWORD_SUCCESS, { email });
      } else {
        setError(response.error || "Failed to change password");
      }
    } catch (e) {
      showToast.error("Failed to change password");
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

  const handlePasswordChange = (text: string) => {
    setConfirmPassword(text);
    if (error) setError("");
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Password validation functions
  const hasMinLength =
    confirmPassword.length >= 8 && confirmPassword.length <= 32;
  const hasLowercase = /[a-z]/.test(confirmPassword);
  const hasUppercase = /[A-Z]/.test(confirmPassword);
  const hasNumber = /\d/.test(confirmPassword);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(confirmPassword);

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
            source={require("@/assets/images/background2.png")}
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
            keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
            enabled={true}
          >
            <View style={styles.contentContainer}>
              <View style={styles.iconSection}>
                <Ionicons
                  name="lock-closed-outline"
                  size={RFValue(24)}
                  color={Theme.text.neutral}
                />
              </View>

              <Text style={styles.signupTitle}>Re-enter password</Text>

              <View>
                <View style={styles.passwordInputContainer}>
                  <TextInput
                    style={[styles.inputBox, error && styles.inputError]}
                    value={confirmPassword}
                    onChangeText={handlePasswordChange}
                    placeholder="Re-enter new password"
                    placeholderTextColor="#797979"
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                  />
                  <TouchableOpacity
                    style={styles.eyeIcon}
                    onPress={togglePasswordVisibility}
                  >
                    <Feather
                      name={showPassword ? "eye" : "eye-off"}
                      size={20}
                      color="#797979"
                    />
                  </TouchableOpacity>
                </View>
                {error && <Text style={styles.errText}>{error}</Text>}
              </View>

              <View style={styles.requirementsSection}>
                <Text style={styles.requirementsTitle}>
                  Your password must include:
                </Text>
                <View style={styles.requirementItem}>
                  <Text
                    style={[
                      styles.requirementIcon,
                      hasMinLength && styles.requirementMet,
                    ]}
                  >
                    {hasMinLength ? "✓" : "○"}
                  </Text>
                  <Text
                    style={[
                      styles.requirement,
                      hasMinLength && styles.requirementMet,
                    ]}
                  >
                    8-32 characters long
                  </Text>
                </View>
                <View style={styles.requirementItem}>
                  <Text
                    style={[
                      styles.requirementIcon,
                      hasLowercase && styles.requirementMet,
                    ]}
                  >
                    {hasLowercase ? "✓" : "○"}
                  </Text>
                  <Text
                    style={[
                      styles.requirement,
                      hasLowercase && styles.requirementMet,
                    ]}
                  >
                    1 lowercase character (a-z)
                  </Text>
                </View>
                <View style={styles.requirementItem}>
                  <Text
                    style={[
                      styles.requirementIcon,
                      hasUppercase && styles.requirementMet,
                    ]}
                  >
                    {hasUppercase ? "✓" : "○"}
                  </Text>
                  <Text
                    style={[
                      styles.requirement,
                      hasUppercase && styles.requirementMet,
                    ]}
                  >
                    1 uppercase character (A-Z)
                  </Text>
                </View>
                <View style={styles.requirementItem}>
                  <Text
                    style={[
                      styles.requirementIcon,
                      hasNumber && styles.requirementMet,
                    ]}
                  >
                    {hasNumber ? "✓" : "○"}
                  </Text>
                  <Text
                    style={[
                      styles.requirement,
                      hasNumber && styles.requirementMet,
                    ]}
                  >
                    1 number
                  </Text>
                </View>
                <View style={styles.requirementItem}>
                  <Text
                    style={[
                      styles.requirementIcon,
                      hasSpecialChar && styles.requirementMet,
                    ]}
                  >
                    {hasSpecialChar ? "✓" : "○"}
                  </Text>
                  <Text
                    style={[
                      styles.requirement,
                      hasSpecialChar && styles.requirementMet,
                    ]}
                  >
                    1 special character e.g. ! @ # $ %
                  </Text>
                </View>
              </View>
            </View>

            {/* Continue button */}
            <View style={styles.buttonContainer}>
              <Buttons
                onPress={handleSubmit}
                title="Submit"
                isLoading={isLoading}
                style={{
                  backgroundColor: !confirmPassword.trim()
                    ? "#b9b1b1"
                    : "#F3F3F3",
                  borderRadius: 14,
                }}
              />
            </View>
          </KeyboardAvoidingView>
        </Animated.View>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default ForgotPasswordConfirmScreen;

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
  signupTitle: {
    fontSize: TEXT_SIZES.lg,
    color: Theme.text.neutral,
    fontFamily: "Inter-medium",
    fontWeight: "500",
    marginVertical: 8,
  },
  passwordInputContainer: {
    position: "relative",
  },
  inputBox: {
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingRight: 50,
    paddingVertical: 12,
    fontSize: TEXT_SIZES.md,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: "#8BAFCE",
  },
  inputError: {
    borderColor: "#FF4D4F",
  },
  eyeIcon: {
    position: "absolute",
    right: 16,
    top: 9,
    padding: 4,
  },
  errText: {
    color: "#FF4D4F",
    fontSize: 13,
    marginBottom: 8,
    marginLeft: 4,
  },
  requirementsSection: {
    marginBottom: 10,
  },
  requirementsTitle: {
    fontSize: TEXT_SIZES.md,
    color: Theme.text.neutral,
    fontFamily: "Inter-medium",
    fontWeight: "500",
    marginBottom: 5,
  },
  requirementItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  requirementIcon: {
    fontSize: TEXT_SIZES.sm,
    color: Theme.text.neutral,
    marginRight: 5,
    width: 20,
    textAlign: "center",
  },
  requirement: {
    fontSize: TEXT_SIZES.md,
    color: Theme.text.neutral,
    flex: 1,
    opacity: 0.8,
  },
  requirementMet: {
    color: "#4CAF50",
    opacity: 1,
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
