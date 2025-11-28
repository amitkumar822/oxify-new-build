import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Animated,
  ImageBackground,
  Easing,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
const { useNavigation, useRoute } = require("@react-navigation/native");
import { SCREEN_NAMES, Theme } from "../../constants";
import { LinearGradient } from "expo-linear-gradient";
import { authApi } from "../../api/auth";
import { showToast } from "../../config/toast";
import { storeToken, storeUserData } from "../../utils/tokenManager";
import { useAuth } from "../../contexts/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { BackHeader } from "@/helpers/BackHeader";
import { RFValue } from "react-native-responsive-fontsize";
import { AppStatusBar } from "@/helpers/AppStatusBar";
import { SafeAreaView } from "react-native-safe-area-context";
import { TEXT_SIZES } from "@/constants/textSizes";
import Buttons from "@/components/common/Buttons";
import { animatedDuration, screenHeight } from "@/constants/comman";
import { useKeyboardDismissOnMount } from "@/utils/useKeyboard";
import { usePushNotifications } from "@/utils/usePushNotifications";

interface RouteParams {
  email: string;
}

const LoginPasswordScreen: React.FC = () => {
  const [password, setPassword] = useState("Test@123"); //Test@123
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigation: any = useNavigation();
  const { expoPushToken } = usePushNotifications();

  //---- Animation setup ----
  const backgroundPosition = useRef(
    new Animated.ValueXY({ x: RFValue(58), y: RFValue(-215) })
  ).current;
  const slideAnim = useRef(new Animated.Value(screenHeight)).current;

  useEffect(() => {
    Animated.timing(backgroundPosition, {
      toValue: { x: RFValue(40), y: RFValue(360) },
      duration: 1000,
      useNativeDriver: false,
    }).start();

    Animated.timing(slideAnim, {
      toValue: 0,
      duration: animatedDuration,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, []);

  const route = useRoute();
  const { email } = route.params as RouteParams;
  const { login } = useAuth();

  const handleSignIn = async () => {
    if (!password.trim()) {
      setError("Please enter your password");
      return;
    }
    setIsLoading(true);
    setError("");

    try {
      const response = (await authApi.login(email, password)) as any;

      if (response?.success) {
        try {
          await storeToken(response.data.token);

          // Save push notification token
          if (expoPushToken?.data) {
            await authApi.pushNotificationTokenSave(
              expoPushToken.data,
              Platform.OS == "ios" ? "ios" : "android"
            );
          }

          const userData = {
            user_id: response.data.user_id || 0,
            email,
            is_superuser: response.data.is_superuser || false,
            token: response.data.token,
          };
          await storeUserData(userData);
          await login(userData);

          showToast.success("Login successful");
          navigation.replace("MainStack");
        } catch (tokenError) {
          showToast.error("Login successful but failed to store session");
        }
      } else {
        let errorMessage = "Invalid email or password. Please try again.";
        if (response?.error) errorMessage = response.error;
        else if (response?.status === 401)
          errorMessage = "Invalid email or password. Please try again.";
        setError(errorMessage);
        showToast.error(errorMessage);
      }
    } catch (err) {
      const networkError =
        "Network error. Please check your connection and try again.";
      setError(networkError);
      showToast.error(networkError);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    try {
      navigation.navigate(SCREEN_NAMES.FORGOT_PASSWORD_EMAIL);
    } catch (e) {
      showToast.error("Failed to navigate to forgot password");
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
      <AppStatusBar barStyle="light-content" />
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

          {/* Back button */}
          <BackHeader handleBack={() => navigation.goBack()} />
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
                  style={styles.lockIcon}
                />
              </View>

              {/* Email Display */}
              <Text style={styles.emailText}>Enter your password</Text>

              {/* Password Field */}
              <View style={styles.inputWrapper}>
                <TextInput
                  style={[styles.input, error ? styles.inputError : null]}
                  placeholder="Enter Password"
                  placeholderTextColor="#797979"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    if (error) setError("");
                  }}
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Ionicons
                    name={showPassword ? "eye-outline" : "eye-off-outline"}
                    size={22}
                    color="#666"
                  />
                </TouchableOpacity>
              </View>

              {error ? <Text style={styles.error}>{error}</Text> : null}

              {/* Forgot Password */}
              <TouchableOpacity onPress={handleForgotPassword}>
                <Text style={styles.forgotPassword}>Forgot password?</Text>
              </TouchableOpacity>
            </View>

            {/* Submit Button - Fixed position outside of any flex containers */}
            <View style={[styles.buttonContainer]}>
              <Buttons
                onPress={handleSignIn}
                title={isLoading ? "Signing In..." : "Submit"}
                isLoading={isLoading}
                style={{
                  backgroundColor: !password.trim() ? "#b9b1b1" : "#F3F3F3",
                  borderRadius: 14,
                  marginBottom: 16,
                }}
              />
            </View>
          </KeyboardAvoidingView>
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
    paddingTop: 2,
    paddingBottom: 20,
  },
  iconSection: {
    alignItems: "flex-start",
    paddingTop: 18,
  },
  lockIcon: {
    marginBottom: 4,
  },
  emailText: {
    fontSize: TEXT_SIZES.lg,
    color: Theme.text.neutral,
    marginBottom: 10,
    marginTop: 5,
  },
  inputWrapper: {
    backgroundColor: Theme.background.primary,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    marginBottom: 10,
    paddingHorizontal: 12,
    borderWidth: 2,
    borderColor: "#8BAFCE",
    fontSize: TEXT_SIZES.md,
    color: "#000",
  },
  input: {
    flex: 1,
    fontSize: TEXT_SIZES.md,
    color: "#000",
    paddingVertical: 12,
  },
  inputError: {
    borderColor: "red",
  },
  eyeButton: {
    paddingLeft: 8,
  },
  error: {
    color: "red",
    fontSize: 14,
    marginBottom: 10,
  },
  forgotPassword: {
    color: Theme.text.neutral,
    fontSize: TEXT_SIZES.sm,
    alignSelf: "flex-end",
    fontWeight: "600",
  },
  buttonContainer: {
    marginTop: "auto",
    marginBottom: 5,
  },
  button: {
    backgroundColor: "#DDE2E5",
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: "center",
    marginTop: "auto",
    marginBottom: 30,
  },
  buttonText: {
    fontWeight: "600",
    fontSize: 16,
    color: "#000",
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

export default LoginPasswordScreen;
