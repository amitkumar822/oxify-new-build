import React, { FC, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Animated,
  ImageBackground,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { SCREEN_NAMES, Theme } from "../../constants";
import { LinearGradient } from "expo-linear-gradient";
const { useNavigation } = require("@react-navigation/native");
import { showToast } from "../../config/toast";
import Buttons from "@/components/common/Buttons";
import { BackHeader } from "@/helpers/BackHeader";
import { AppStatusBar } from "@/helpers/AppStatusBar";
import { SafeAreaView } from "react-native-safe-area-context";
import { TEXT_SIZES } from "@/constants/textSizes";
import { RFValue } from "react-native-responsive-fontsize";
import useKeyboard from "@/utils/useKeyboard";

const isValidEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const LoginEmailScreen: FC = () => {
  // Use keyboard utility hook
  const { dismissKeyboard } = useKeyboard();

  const navigation: any = useNavigation();
  const backgroundPosition = useRef(
    new Animated.ValueXY({ x: RFValue(57), y: RFValue(-216) })
  ).current;

  useEffect(() => {
    Animated.timing(backgroundPosition, {
      toValue: { x: RFValue(19), y: RFValue(-241) },
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, []);

  const [email, setEmail] = useState(""); //adityadesk99@gmail.com
  const [error, setError] = useState<String>("");

  // login loading state management
  const [loading, setLoading] = useState(false);

  const handleBack = () => {
    try {
      navigation.goBack();
    } catch (e) {
      showToast.error("Failed to go back");
    }
  };

  const onSubmit = async () => {
    if (!isValidEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    try {
      setLoading(true);
      dismissKeyboard();

      setTimeout(() => {
        navigation.navigate(SCREEN_NAMES.LOGIN_PASSWORD, { email });
        setLoading(false);
      }, 1000);
    } catch (e) {
      setLoading(false);
      showToast.error("Failed to proceed to next step");
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
          <BackHeader handleBack={handleBack} />

          {/* Keyboard avoiding only for input fields */}
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 20 : 60}
            enabled={true}
          >
            {/* Icon */}
            <Text style={styles.icon}>@</Text>

            <Text style={styles.mainTitle}>Enter your email</Text>

            <View>
              <TextInput
                style={[styles.inputBox, error && styles.inputError]}
                onChangeText={(text) => {
                  setEmail(text);
                  if (error) setError("");
                }}
                value={email}
                placeholder="Email address"
                placeholderTextColor="#797979"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={true}
              />
              {error && <Text style={styles.errText}>{error}</Text>}
            </View>

            {/* Continue button */}
            <View style={{ marginTop: "auto", borderRadius: 14 }}>
              <Buttons
                onPress={onSubmit}
                title="Continue"
                isLoading={loading}
                style={{
                  backgroundColor: !email.trim()
                    ? "#b9b1b1"
                    : "rgba(221, 226, 229, 1)",
                  borderRadius: 14,
                }}
              />
            </View>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </LinearGradient>
  );
};

export default LoginEmailScreen;

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  icon: {
    fontSize: TEXT_SIZES.xxxl,
    textAlign: "left",
    color: Theme.text.neutral,
    marginVertical: 10,
  },
  mainTitle: {
    fontSize: TEXT_SIZES.lg,
    color: Theme.text.neutral,
    fontWeight: "400",
    marginBottom: 10,
  },
  inputBox: {
    backgroundColor: Theme.background.primary,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: TEXT_SIZES.md,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: "rgba(139, 175, 206, 1)",
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
