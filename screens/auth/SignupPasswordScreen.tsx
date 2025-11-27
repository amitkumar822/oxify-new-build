import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Animated,
  Easing,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { Theme, SCREEN_NAMES } from "../../constants";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
const { useNavigation, useRoute } = require("@react-navigation/native");
import { showToast } from "../../config/toast";
import { BackHeader } from "@/helpers/BackHeader";
import { TEXT_SIZES } from "@/constants/textSizes";
import Buttons from "@/components/common/Buttons";
import { Feather, Ionicons } from "@expo/vector-icons";
import { RFValue } from "react-native-responsive-fontsize";
import { animatedDuration, screenHeight } from "@/constants/comman";
import useKeyboard from "@/utils/useKeyboard";

interface RouteParams {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  healthGoals: number[];
}

const SignupPasswordScreen: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigation: any = useNavigation();
  const route = useRoute();
  const { firstName, lastName, email, username, healthGoals } =
    route.params as RouteParams;

  const { dismissKeyboard } = useKeyboard();

  const handleContinue = () => {
    if (!password.trim()) {
      setError("Please enter a password");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    try {
      setIsLoading(true);
      dismissKeyboard();
      setTimeout(() => {
        navigation.navigate(SCREEN_NAMES.SIGNUP_PASSWORD_CONFIRM, {
          firstName,
          lastName,
          email,
          username,
          healthGoals,
          password,
        });
        setIsLoading(false);
      }, 1000);
    } catch (e) {
      setIsLoading(false);
      showToast.error("Failed to proceed to next step");
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

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    if (error) setError("");
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Password validation functions
  const hasMinLength = password.length >= 8 && password.length <= 32;
  const hasLowercase = /[a-z]/.test(password);
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  // --- Animation setup ---
  const imageAnim = useRef(new Animated.Value(-screenHeight)).current; // start above screen
  const slideAnim = useRef(new Animated.Value(screenHeight)).current; // content slides up

  useEffect(() => {
    // Image slides from top → 0
    Animated.timing(imageAnim, {
      toValue: 0,
      duration: animatedDuration,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
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
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <SafeAreaView style={{ flex: 1 }}>
          <Animated.View
            style={[
              styles.background,
              {
                transform: [{ translateY: imageAnim }],
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
                  <Ionicons
                    name="lock-closed-outline"
                    size={RFValue(24)}
                    color="white"
                  />
                </View>

                <Text style={styles.signupTitle}>Create new password</Text>
                <View>
                  <View style={styles.passwordInputContainer}>
                    <TextInput
                      style={[styles.inputBox, error && styles.inputError]}
                      value={password}
                      onChangeText={handlePasswordChange}
                      placeholder="Enter your password"
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
                  title="Continue"
                  isLoading={isLoading}
                  style={{
                    backgroundColor:
                      !password.trim() || isLoading ? "#b9b1b1" : "#F3F3F3",
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
  background: {
    flex: 1,
    width: "150%",
    height: "150%",
    position: "absolute",
    top: RFValue(-680),
    left: RFValue(-200),
    opacity: 0.5,
  },
  backgroundImage: {
    flex: 1,
    width: "125%",
    height: "140%",
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
    borderRadius: 14,
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
});

export default SignupPasswordScreen;
