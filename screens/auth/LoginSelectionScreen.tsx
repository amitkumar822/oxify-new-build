import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Animated,
  ActivityIndicator,
  Alert,
  Platform,
  Dimensions,
} from "react-native";
import { SCREEN_NAMES, Theme } from "../../constants";
import { LinearGradient } from "expo-linear-gradient";
const { useNavigation } = require("@react-navigation/native");
import { RFValue } from "react-native-responsive-fontsize";
import { SafeAreaView } from "react-native-safe-area-context";
import { authApi } from "../../api/auth";
import { useAuth } from "../../contexts/AuthContext";
import { showToast } from "../../config/toast";
import { storeToken, storeUserData } from "../../utils/tokenManager";
import * as AppleAuthentication from "expo-apple-authentication";
import { usePushNotifications } from "@/utils/usePushNotifications";

// import {
//   GoogleSignin,
//   statusCodes,
//   // @ts-ignore
//   User,
//   // @ts-ignore
// } from "@react-native-google-signin/google-signin";

// GoogleSignin.configure({
//   webClientId:
//     "927622491931-g2o5jvoimej5o9l1m8pvagp79ci5fjgi.apps.googleusercontent.com",
//   offlineAccess: true,
//   forceCodeForRefreshToken: true,
// });

const LoginSelectionScreen: React.FC = () => {
  const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } =
    Dimensions.get("window");

  // Get push notifications token
  const { expoPushToken } = usePushNotifications();

  const navigation: any = useNavigation();
  const { login } = useAuth();
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isAppleLoading, setIsAppleLoading] = useState(false);
  const backgroundPosition = useRef(
    new Animated.ValueXY({ x: RFValue(0), y: RFValue(-120) })
  ).current;

  useEffect(() => {
    Animated.timing(backgroundPosition, {
      toValue: { x: RFValue(72), y: RFValue(-220) },
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, []);

  const handleEmailLogin = () => {
    navigation.navigate(SCREEN_NAMES.LOGIN_EMAIL);
  };

  const handleAppleLogin = async () => {
    try {
      setIsAppleLoading(true);
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });
      if (credential && credential.identityToken) {
        try {
          // Extract name fields (optional)
          const givenName = credential.fullName?.givenName || undefined;
          const familyName = credential.fullName?.familyName || undefined;
          const email = credential.email || undefined;
          const appleLoginResponse = await authApi.appleLoginInfoSave(
            credential.identityToken,
            givenName,
            familyName,
            email
          );
          if (appleLoginResponse?.success && appleLoginResponse?.data) {
            const backendData = appleLoginResponse.data as any;
            // Check if backend response has the expected structure
            if (backendData?.statusCode === 200 && backendData?.data) {
              try {
                // Store the access_token as the auth token
                await storeToken(backendData.data.access_token);
                // Save push notification token
                if (expoPushToken?.data) {
                  await authApi.pushNotificationTokenSave(expoPushToken.data, Platform.OS == "ios" ? "ios" : "android");
                }
                // Prepare user data in the format expected by the app
                const userData = {
                  user_id: backendData.data.user?.id || 0,
                  email: backendData.data.user?.email || "",
                  is_superuser: false, // Apple login users are not superusers by default
                  token: backendData.data.access_token,
                };
                await storeUserData(userData);
                await login(userData);
                showToast.success("Apple login successful");
                navigation.replace("MainStack");
              } catch (tokenError) {
                console.error("Token storage error:", tokenError);
                Alert.alert(
                  "Error",
                  "Login successful but failed to store session"
                );
              }
            } else {
              const errorMessage =
                backendData?.message || "Sign in failed. Please try again.";
              Alert.alert("Error", errorMessage);
            }
          } else {
            const errorMessage =
              appleLoginResponse?.error || "Sign in failed. Please try again.";
            Alert.alert("API Error", errorMessage);
          }
        } catch (error: any) {
          console.error("Server Error:", error);
          Alert.alert(
            "Server Error",
            "Failed to authenticate with server. Please try again."
          );
        }
      } else {
        // console.error("Invalid credential response");
        Alert.alert("Invalid Credential", "Apple sign in was not successful");
      }
    } catch (e: any) {
      console.error("Error:", e);
      Alert.alert("Error", "Failed to sign in with Apple. Please try again.", e?.message || "Unknown error");
    } finally {
      setIsAppleLoading(false);
    }
  };

  //-------------------Start google login-------------------

  const handleGoogleLogin = async () => {
    // try {
    //   setIsGoogleLoading(true);
    //   await GoogleSignin.hasPlayServices();
    //   const response = await GoogleSignin.signIn();
    //   if (response && response?.type === "success") {
    //     try {
    //       const googleLoginResponse = await authApi.googleLoginInfoSave(
    //         response?.data?.idToken
    //       );
    //       if (googleLoginResponse?.success && googleLoginResponse?.data) {
    //         const backendData = googleLoginResponse.data as any;
    //         // Check if backend response has the expected structure
    //         if (backendData?.statusCode === 200 && backendData?.data) {
    //           try {
    //             // Store the access_token as the auth token
    //             await storeToken(backendData.data.access_token);
    //             // Save push notification token
    //             if (expoPushToken?.data) {
    //               await authApi.pushNotificationTokenSave(expoPushToken.data, Platform.OS == "ios" ? "ios" : "android");
    //             }
    //             // Prepare user data in the format expected by the app
    //             const userData = {
    //               user_id: backendData.data.user?.id || 0,
    //               email: backendData.data.user?.email || "",
    //               is_superuser: false, // Google login users are not superusers by default
    //               token: backendData.data.access_token,
    //             };
    //             await storeUserData(userData);
    //             await login(userData);
    //             showToast.success("Google login successful");
    //             navigation.replace("MainStack");
    //           } catch (tokenError) {
    //             showToast.error("Login successful but failed to store session");
    //           }
    //         } else {
    //           const errorMessage =
    //             backendData?.message || "Sign in failed. Please try again.";
    //           showToast.error(errorMessage);
    //         }
    //       } else {
    //         const errorMessage =
    //           googleLoginResponse?.error || "Sign in failed. Please try again.";
    //         showToast.error(errorMessage);
    //       }
    //     } catch (error) {
    //       showToast.error(
    //         "Failed to authenticate with server. Please try again."
    //       );
    //     }
    //   } else {
    //     showToast.error("Google sign in was not successful");
    //   }
    // } catch (error: any) {
    //   if (error.code === statusCodes.SIGN_IN_CANCELLED) {
    //     showToast.error("Sign in cancelled");
    //   } else if (error.code === statusCodes.IN_PROGRESS) {
    //     showToast.error("Sign in already in progress");
    //   } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
    //     showToast.error("Google Play services not available");
    //   } else {
    //     showToast.error("Failed to sign in with Google. Please try again.");
    //   }
    // } finally {
    //   setIsGoogleLoading(false);
    // }
  };
  //-------------------End google login-------------------

  return (
    <LinearGradient
      colors={[
        "#090B0D",
        "#090B0D",
      ]}
      style={styles.gradient}
    >
      <SafeAreaView className="flex w-full h-full items-center justify-start ">
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

        {/* Logo and App Name */}
        <View
          className="absolute flex flex-col items-center justify-center mt-11"
          style={{ top: SCREEN_HEIGHT * 0.2 }}
        >
          <Image
            source={require("../../assets/images/white_logo.png")}
            style={{
              width: 50,
              height: 52,
              borderRadius: 12,
              marginBottom: 16,
            }}
          />
          <Image
            source={require("../../assets/icons/Wordmark_White.png")}
            style={{
              width: 85,
              height: 40,
              borderRadius: 12,
              marginBottom: 6,
            }}
          />
        </View>

        <View
          className="absolute w-full items-center px-4"
          style={{ bottom: 10 }}
        >
          {/* Title + Subtitle */}
          <View className="items-center mb-8">
            <Text
              className="text-white"
              style={{
                fontFamily: "InterMedium",
                fontSize: 24,
                lineHeight: 32,
              }}
            >
              Login
            </Text>

            <Text
              className="text-center mt-2"
              style={{
                fontFamily: "RobotoRegular",
                fontSize: 15,
                lineHeight: 20,
                color: "rgba(221, 226, 229, 0.8)",
              }}
            >
              Please select your preferred method to continue logging in your
              account
            </Text>
          </View>

          {/* Email Button - Different layouts for iOS and Android */}
          {Platform.OS === "ios" ? (
            <>
              {/* iOS: Full width email button */}
              <TouchableOpacity
                onPress={handleEmailLogin}
                className="w-full flex-row items-center justify-center"
                style={{
                  borderRadius: 14,
                  marginBottom: 10,
                  paddingVertical: 16,
                  backgroundColor: "#DDE2E5",
                }}
              >
                <Text
                  style={{
                    fontFamily: "InterMedium",
                    fontSize: 16,
                    color: "#090B0D",
                  }}
                >
                  Continue with Email
                </Text>
              </TouchableOpacity>

              {/* iOS: Social Buttons Row */}
              <View
                className="flex-row justify-center w-full"
                style={{
                  gap: 1,
                  marginBottom: 24,
                }}
              >
                {/* Google */}
                <TouchableOpacity
                  onPress={handleGoogleLogin}
                  disabled={isGoogleLoading}
                  className={`mr-2 items-center justify-center flex-row w-[48%] ${
                    isGoogleLoading ? "opacity-50" : ""
                  }`}
                  style={{
                    paddingHorizontal: 60,
                    paddingVertical: 16,
                    borderRadius: 14,
                    borderWidth: 1,
                    borderColor: "#DDE2E5",
                  }}
                >
                  {isGoogleLoading ? (
                    <ActivityIndicator size="small" color="#4285F4" />
                  ) : (
                    <Image
                      source={require("../../assets/images/google.png")}
                      style={{ width: 20, height: 20 }}
                      resizeMode="contain"
                    />
                  )}
                </TouchableOpacity>

                {/* Apple */}
                <TouchableOpacity
                  onPress={handleAppleLogin}
                  disabled={isAppleLoading}
                  className={`items-center justify-center flex-row w-[48%] ${
                    isAppleLoading ? "opacity-50" : ""
                  }`}
                  style={{
                    paddingHorizontal: 60,
                    paddingVertical: 16,
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: "#DDE2E5",
                  }}
                >
                  {isAppleLoading ? (
                    <ActivityIndicator size="small" color="#000000" />
                  ) : (
                    <Image
                      source={require("../../assets/images/apple.png")}
                      style={{ width: 20, height: 20 }}
                      resizeMode="contain"
                    />
                  )}
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <>
              {/* Android: Email and Google in one row with width ratio 80:14 */}
              <View
                className="flex-row flex-wrap items-center justify-center width-full"
                style={{
                  gap: 12,
                  marginBottom: 24,
                }}
              >
                <TouchableOpacity
                  onPress={handleEmailLogin}
                  className="bg-white flex-row items-center justify-center"
                  style={{
                    height: 50,
                    borderRadius: 12,
                    paddingHorizontal: 12,
                    width: "76%",
                  }}
                >
                  <Text
                    className="text-black font-semibold"
                    style={{
                      fontFamily: "Inter",
                      fontWeight: "500",
                      fontSize: 16,
                      lineHeight: 20,
                    }}
                  >
                    Continue with Email
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleGoogleLogin}
                  disabled={isGoogleLoading}
                  className={`border border-[#DDE2E5] items-center justify-center flex-row ${
                    isGoogleLoading ? "opacity-50" : ""
                  }`}
                  style={{
                    height: 50,
                    borderRadius: 12,
                    paddingHorizontal: 12,
                    width: "18%",
                  }}
                >
                  {isGoogleLoading ? (
                    <ActivityIndicator size="small" color="#4285F4" />
                  ) : (
                    <Image
                      source={require("../../assets/images/google.png")}
                      style={{ width: 20, height: 20 }}
                      resizeMode="contain"
                    />
                  )}
                </TouchableOpacity>
              </View>
            </>
          )}

          {/* Register Link */}
          <View className="items-center mb-1">
            <View className="flex-row items-center">
              <Text
                style={{
                  fontFamily: "RobotoRegular",
                  fontSize: 13,
                  lineHeight: 18,
                  color: "#DDE2E5",
                }}
              >
                Don't have an account?
              </Text>
              <View>
                <TouchableOpacity
                  onPress={() => navigation.navigate(SCREEN_NAMES.SIGNUP_EMAIL)}
                >
                  <Text
                    className="text-[#6189AD] underline ml-1"
                    style={{
                      fontFamily: "RobotoMedium",
                      fontSize: 13,
                      lineHeight: 18,
                    }}
                  >
                    Sign up
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Terms */}
          <Text
            className="text-center"
            style={{
              fontFamily: "RobotoRegular",
              fontSize: 12,
              lineHeight: 20,
              marginBottom: 24,
              color: "#DDE2E5",
            }}
          >
            If you are creating a new account,{"\n"}
            <Text className="underline">Terms & Conditions</Text> and{" "}
            <Text className="underline">Privacy Policy</Text> will apply.
          </Text>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  background: {
    flex: 1,
    width: "150%",
    height: "150%",
    position: "absolute",
    transform: [{ rotate: "180deg" }],
    opacity: 0.8,
  },
  backgroundImage: {
    flex: 1,
    width: "118%",
    height: "135%",
    top: -40,
    left: 30,
  },
});

export default LoginSelectionScreen;
