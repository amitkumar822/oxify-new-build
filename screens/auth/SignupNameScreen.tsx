import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  ScrollView,
  Animated,
  Dimensions,
  Easing,
  ImageBackground,
} from "react-native";
import { Theme, SCREEN_NAMES } from "../../constants";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
const { useNavigation, useRoute } = require("@react-navigation/native");
import { BackHeader } from "@/helpers/BackHeader";
import { TEXT_SIZES } from "@/constants/textSizes";
import { hp, wp } from "@/constants/screenWH";
import Buttons from "@/components/common/Buttons";
import { RFValue } from "react-native-responsive-fontsize";
import { animatedDuration, screenHeight } from "@/constants/comman";
import useKeyboard from "@/utils/useKeyboard";

interface RouteParams {
  email: string;
}

const SignupNameScreen: React.FC = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [errors, setErrors] = useState<{
    firstName?: string;
    lastName?: string;
  }>({});
  const navigation: any = useNavigation();
  const route = useRoute();
  const { email } = route.params as RouteParams;
  const [submitting, setSubmitting] = useState<boolean>(false);

  const { dismissKeyboard } = useKeyboard();

  const handleContinue = () => {
    setSubmitting(true);
    const newErrors: { firstName?: string; lastName?: string } = {};
    if (!firstName.trim()) newErrors.firstName = "Please enter your first name";
    if (!lastName.trim()) newErrors.lastName = "Please enter your last name";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setSubmitting(false);
      return;
    }

    dismissKeyboard();
    setTimeout(() => {
      setSubmitting(false);
      navigation.navigate(SCREEN_NAMES.SIGNUP_USERNAME, {
        firstName,
        lastName,
        email,
      });
    }, 1000);
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
    outputRange: [RFValue(-30), RFValue(-210)], // start → end
  });

  const animatedLeft = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [RFValue(85), RFValue(90)], // start → end
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

        <BackHeader handleBack={() => navigation.goBack()} />

        {/* Keyboard avoiding for input fields */}
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
          enabled={true}
        >
          {/* Animated ScrollView */}
          <Animated.ScrollView
            style={{
              flex: 1,
              transform: [{ translateY: slideAnim }],
            }}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.contentContainer}>
              <View style={styles.logoSection}>
                <Image
                  source={require("../../assets/images/white_logo.png")}
                  style={styles.logoImg}
                />
                <Text style={styles.oxifyName}>Oxify</Text>
              </View>

              <Text style={styles.signupTitle}>Sign Up</Text>
              <Text style={styles.inputLabel}>What's your name?  </Text>

              <View style={styles.inputWrap}>
                <TextInput
                  style={[styles.inputBox, errors.firstName && styles.inputError]}
                  value={firstName}
                  onChangeText={(text) => {
                    setFirstName(text);
                    if (errors.firstName)
                      setErrors({ ...errors, firstName: undefined });
                  }}
                  placeholder="First Name"
                  placeholderTextColor="#797979"
                  autoCapitalize="words"
                />
                {errors.firstName && (
                  <Text style={styles.errText}>{errors.firstName}</Text>
                )}

                <TextInput
                  style={[styles.inputBox, errors.lastName && styles.inputError]}
                  value={lastName}
                  onChangeText={(text) => {
                    setLastName(text);
                    if (errors.lastName)
                      setErrors({ ...errors, lastName: undefined });
                  }}
                  placeholder="Last Name"
                  placeholderTextColor="#797979"
                  autoCapitalize="words"
                />
                {errors.lastName && (
                  <Text style={styles.errText}>{errors.lastName}</Text>
                )}
              </View>
            </View>
          </Animated.ScrollView>

          {/* Continue button */}
          <View style={styles.buttonContainer}>
            <Buttons
              onPress={handleContinue}
              title="Continue"
              isLoading={submitting}
              style={{
                backgroundColor:
                  !firstName.trim() || !lastName.trim() || submitting
                    ? "#b9b1b1"
                    : "#F3F3F3",
                borderRadius: 14,
              }}
            />
          </View>
        </KeyboardAvoidingView>
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
  scrollContent: {
    flexGrow: 1,
  },
  contentContainer: {
    flex: 1,
    paddingTop: 20,
    paddingBottom: 20,
  },
  logoSection: {
    alignItems: "center",
    marginTop: 12,
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  logoImg: {
    width: wp(10),
    height: hp(10),
    resizeMode: "contain",
    marginBottom: 4,
  },
  oxifyName: {
    fontSize: TEXT_SIZES.huge,
    color: "#fff",
    fontWeight: "400",
    marginBottom: 2,
  },
  signupTitle: {
    fontSize: 24,
    color: Theme.text.neutral,
    textAlign: "center",
    marginBottom: 16,
    marginTop: -10,
  },
  inputLabel: {
    fontSize: 20,
    fontFamily: "Inter-medium",
    fontWeight: "500",
    color: Theme.text.neutral,
    marginBottom: 8,
  },
  inputWrap: {
    marginBottom: 16,
  },
  inputBox: {
    borderWidth: 2,
    borderColor: "#8BAFCE",
    fontSize: TEXT_SIZES.md,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginBottom: 12,
    backgroundColor: Theme.background.primary,
  },
  inputError: {
    borderColor: "#FF4D4F",
    borderWidth: 1,
  },
  errText: {
    color: "#FF4D4F",
    fontSize: 13,
    marginBottom: 8,
    marginLeft: 4,
  },
  buttonContainer: {
    marginTop: "auto",
    marginBottom: 16,
  },
});

export default SignupNameScreen;
