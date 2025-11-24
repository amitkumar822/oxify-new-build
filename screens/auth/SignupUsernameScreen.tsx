import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Animated,
  ImageBackground,
  Easing,
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

// Username must be: lowercase, alphanumeric only, start with a letter
const USERNAME_REGEX = /^[a-z][a-z0-9]*$/;

const validateUsername = (value: string): string | null => {
  const u = value.trim();
  if (!u) return "Please enter a username";
  if (u.length < 4) return "Username must be at least 4 characters";
  if (/\s/.test(u)) return "No spaces allowed";
  if (!/^[a-z]/.test(u)) return "Must start with a letter";
  if (!/^[a-z0-9]+$/.test(u)) return "Use only lowercase letters and numbers";
  return null;
};

interface RouteParams {
  email: string;
  firstName: string;
  lastName: string;
}

const SignupUsernameScreen: React.FC = () => {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [checking, setChecking] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const navigation: any = useNavigation();
  const route = useRoute();
  const { email, firstName, lastName } = route.params as RouteParams;

  const { dismissKeyboard } = useKeyboard();

  // Debounced on-change availability check
  useEffect(() => {
    const trimmed = username.trim();
    if (!trimmed) {
      setIsAvailable(null);
      setError("");
      return;
    }

    // Validate locally before hitting the API
    const localError = validateUsername(trimmed);
    if (localError) {
      setIsAvailable(null);
      setError(localError);
      return;
    }

    const handle = setTimeout(async () => {
      setChecking(true);
      const usernameToCheck = trimmed;
      const res = await authApi.checkUsername(usernameToCheck);

      // If API returns 200 -> exists -> not available
      if (res.status === 200) {
        setIsAvailable(false);
        setError("Username already exists");
      } else if (res.status === 404) {
        setIsAvailable(true);
        setError("");
      } else if (!res.success) {
        // Treat unknown errors as not blocking typing; keep state neutral
        setIsAvailable(null);
      }
      setChecking(false);
    }, 350);

    return () => clearTimeout(handle);
  }, [username]);

  const handleContinue = async () => {
    const trimmed = username.trim();
    const localError = validateUsername(trimmed);
    if (localError) {
      setError(localError);
      return;
    }
    // Ensure latest check before continuing
    setSubmitting(true);
    dismissKeyboard();
    const usernameToCheck = trimmed;
    const res = await authApi.checkUsername(usernameToCheck);

    if (res.status === 200) {
      setError("Username already exists");
      setIsAvailable(false);
      setSubmitting(false);
      return;
    }
    if (res.status === 404) {
      // Proceed to next step
      setIsAvailable(true);
      navigation.navigate(SCREEN_NAMES.SIGNUP_HEALTH_GOALS, {
        firstName,
        lastName,
        email,
        username: usernameToCheck,
      });
      setSubmitting(false);
      return;
    }
    // Unexpected error
    showToast.error(res.error || "Unable to verify username right now");
    setSubmitting(false);
  };

  const handleBack = () => {
    navigation.goBack();
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
      useNativeDriver: false,
    }).start();
  }, []);

  const animatedTop = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [RFValue(-30), RFValue(-200)],
  });

  const animatedLeft = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [RFValue(85), RFValue(100)],
  });

  const animatedWidth = anim.interpolate({
    inputRange: [0, 1],
    outputRange: ["110%", "140%"],
  });

  const animatedHeight = anim.interpolate({
    inputRange: [0, 1],
    outputRange: ["92%", "100%"],
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
          <BackHeader handleBack={handleBack} />

          {/* Keyboard avoiding for input fields */}
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
            enabled={true}
          >
            <View style={styles.contentContainer}>
              <Text style={styles.icon}>@</Text>
              <Text style={styles.title}>Choose a username</Text>

              <TextInput
                style={[styles.input, error ? styles.inputError : null]}
                placeholder="Username"
                placeholderTextColor="#999"
                value={username}
                onChangeText={(text) => {
                  // enforce lowercase on input
                  const lower = text.toLowerCase();
                  setUsername(lower);
                  if (error) setError("");
                }}
                autoCapitalize="none"
                autoCorrect={false}
              />

              {error ? (
                <Text style={styles.error}>{error}</Text>
              ) : checking ? (
                <Text style={styles.hint}>Checking availability…</Text>
              ) : isAvailable === true ? (
                <Text style={styles.ok}>Username available</Text>
              ) : null}
            </View>

            {/* Continue button */}
            <View style={styles.buttonContainer}>
              <Buttons
                onPress={handleContinue}
                title="Continue"
                isLoading={submitting}
                disabled={
                  !!validateUsername(username.trim()) ||
                  checking ||
                  isAvailable === false
                }
                style={{
                  backgroundColor:
                    !!validateUsername(username.trim()) ||
                    submitting ||
                    checking ||
                    isAvailable === false
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
  icon: {
    fontSize: 24,
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
    color: "#FF4D4F",
    fontSize: 14,
    marginBottom: 10,
  },
  ok: {
    color: "#16a34a",
    fontSize: 14,
    marginBottom: 10,
  },
  hint: {
    color: Theme.text.neutral,
    fontSize: 13,
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

export default SignupUsernameScreen;
