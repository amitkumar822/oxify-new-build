import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Animated,
  ImageBackground,
  Easing,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Theme } from "../../constants";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
const { useNavigation, useRoute } = require("@react-navigation/native");
import { authApi } from "../../api/auth";
import { showToast } from "../../config/toast";
import { storeToken, storeUserData } from "../../utils/tokenManager";
import { useAuth } from "../../contexts/AuthContext";
import { BackHeader } from "@/helpers/BackHeader";
import { TEXT_SIZES } from "@/constants/textSizes";
import Buttons from "@/components/common/Buttons";
import { Feather, Ionicons } from "@expo/vector-icons";
import { RFValue } from "react-native-responsive-fontsize";
import { animatedDuration, screenHeight } from "@/constants/comman";
import useKeyboard from "@/utils/useKeyboard";
import { usePushNotifications } from "@/utils/usePushNotifications";

interface RouteParams {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  healthGoals: number[];
  password: string;
}

const SignupPasswordConfirmScreen: React.FC = () => {
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigation: any = useNavigation();
  const route = useRoute();
  const { login } = useAuth();
  const { firstName, lastName, email, username, healthGoals, password } =
    route.params as RouteParams;

  const { dismissKeyboard } = useKeyboard();
  
  // Get push notifications token
  const { expoPushToken } = usePushNotifications();

  const handleContinue = async () => {
    if (!confirmPassword.trim()) {
      setError("Please confirm your password");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setSubmitting(true);
      dismissKeyboard();
      const payload = {
        first_name: firstName,
        last_name: lastName,
        email,
        username,
        healthgoaltags: healthGoals,
        password,
        confirm_password: confirmPassword,
      };

      const resp = await authApi.register(payload as any) as any;

      if (resp?.success) {
        // Store token and user data securely if provided in response
        if (
          resp.data &&
          typeof resp.data === "object" &&
          resp.data.data &&
          "token" in resp.data.data
        ) {
          try {
            const token = (resp.data.data as any).token;
            const userId = (resp.data.data as any).user_id || 0;
            const isSuperuser = (resp.data.data as any).is_superuser || false;

            await storeToken(token);

            // Save push notification token
            if (expoPushToken?.data) {
              await authApi.pushNotificationTokenSave(expoPushToken.data, Platform.OS == "ios" ? "ios" : "android");
            }

            const userData = {
              user_id: userId,
              email: email,
              is_superuser: isSuperuser,
              token: token,
            };
            await storeUserData(userData);
            await login(userData);
          } catch (tokenError) {
            console.warn("🔐 Signup - Failed to store token:", tokenError);
          }
        } else {
          showToast.success(
            "Account created successfully! Please login to continue."
          );
          // Navigate to login since no token was provided
          navigation.replace("AuthStack", { screen: "LoginEmail" });
          return;
        }

        showToast.success("Account created successfully");
        // Navigate directly to main app, same as login flow
        navigation.replace("MainStack");
      } else {
        if (resp?.unauthorized) {
          // Handle unauthorized response
          showToast.error("Session expired. Please try again.");
          return;
        }
        showToast.error(resp?.error || "Registration failed");
      }
    } catch (e) {
      console.warn("Registration error:", e);
      showToast.error("Network error while registering");
    } finally {
      setSubmitting(false);
    }
  };

  const handleBack = () => {
    try {
      navigation.goBack();
    } catch (e) {
      console.warn("Navigation back error:", e);
      showToast.error("Failed to go back");
    }
  };

  const handleConfirmPasswordChange = (text: string) => {
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

  // --- Animation setup ---
  const backgroundPosition = useRef(
    new Animated.ValueXY({ x: RFValue(58), y: RFValue(-215) })
  ).current;
  const slideAnim = useRef(new Animated.Value(screenHeight)).current; // content slides up

  useEffect(() => {
    Animated.timing(backgroundPosition, {
      toValue: { x: RFValue(40), y: RFValue(360) },
      duration: animatedDuration,
      useNativeDriver: false,
    }).start();

    // Content slides from bottom → 0
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: animatedDuration,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
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
                  color="white"
                />
              </View>

              <Text style={styles.signupTitle}>Confirm your password</Text>

              <View>
                <View style={styles.passwordInputContainer}>
                  <TextInput
                    style={[styles.inputBox, error && styles.inputError]}
                    value={confirmPassword}
                    onChangeText={handleConfirmPasswordChange}
                    placeholder="Re-enter your password"
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
                onPress={handleContinue}
                title="Create Account"
                isLoading={submitting}
                style={{
                  backgroundColor:
                    !confirmPassword.trim() || submitting ? "#b9b1b1" : "#F3F3F3",
                }}
              />
            </View>
          </KeyboardAvoidingView>
        </Animated.View>
      </SafeAreaView>
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
  eyeIcon: {
    position: "absolute",
    right: 16,
    top: 7,
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
    zIndex: 100,
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

export default SignupPasswordConfirmScreen;
