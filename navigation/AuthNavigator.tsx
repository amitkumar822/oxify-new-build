import React from "react";
const {
  createNativeStackNavigator,
} = require("@react-navigation/native-stack");
import { SCREEN_NAMES } from "../constants";

// Import authentication screens
import WelcomeScreen from "../screens/auth/WelcomeScreen";
import LoginSelectionScreen from "../screens/auth/LoginSelectionScreen";
import LoginEmailScreen from "../screens/auth/LoginEmailScreen";
import LoginPasswordScreen from "../screens/auth/LoginPasswordScreen";
import ForgotPasswordEmailScreen from "../screens/auth/ForgotPasswordEmailScreen";
import ForgotPasswordVerificationScreen from "../screens/auth/ForgotPasswordVerificationScreen";
import ForgotPasswordNewScreen from "../screens/auth/ForgotPasswordNewScreen";
import ForgotPasswordConfirmScreen from "../screens/auth/ForgotPasswordConfirmScreen";
import ForgotPasswordSuccessScreen from "../screens/auth/ForgotPasswordSuccessScreen";

// Import signup screens
import SignupNameScreen from "../screens/auth/SignupNameScreen";
import SignupHealthGoalsScreen from "../screens/auth/SignupHealthGoalsScreen";
import SignupUsernameScreen from "../screens/auth/SignupUsernameScreen";
import SignupEmailScreen from "../screens/auth/SignupEmailScreen";
import SignupEmailVerificationScreen from "../screens/auth/SignupEmailVerificationScreen";
import SignupPasswordScreen from "../screens/auth/SignupPasswordScreen";
import SignupPasswordConfirmScreen from "../screens/auth/SignupPasswordConfirmScreen";
import SignupSuccessScreen from "../screens/auth/SignupSuccessScreen";
import SplashScreen from "@/screens/onboarding/SplashScreen";
import OnboardingPage1 from "@/screens/onboarding/OnboardingPage1";
import OnboardingPage2 from "@/screens/onboarding/OnboardingPage2";
import OnboardingPage3 from "@/screens/onboarding/OnboardingPage3";

const AuthStack = createNativeStackNavigator();

const AuthNavigator: React.FC = () => {
  return (
    <AuthStack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: false, // Disable swipe back gesture
        gestureDirection: "horizontal",
      }}
      initialRouteName={SCREEN_NAMES.SPLASH}
    >
      <AuthStack.Screen
        name={SCREEN_NAMES.SPLASH}
        component={SplashScreen}
        options={{
          animation: "fade",
          presentation: "transparentModal",
        }}
      />
      <AuthStack.Screen
        name={SCREEN_NAMES.ONBOARDING_1}
        component={OnboardingPage1}
        options={{
          animation: "fade",
          presentation: "transparentModal",
        }}
      />
      <AuthStack.Screen
        name={SCREEN_NAMES.ONBOARDING_2}
        component={OnboardingPage2}
        options={{
          animation: "fade",
          presentation: "transparentModal",
        }}
      />
      <AuthStack.Screen
        name={SCREEN_NAMES.ONBOARDING_3}
        component={OnboardingPage3}
        options={{
          animation: "fade",
          presentation: "transparentModal",
        }}
      />
      {/* Welcome & Login Selection */}
      <AuthStack.Screen name={SCREEN_NAMES.WELCOME} component={WelcomeScreen} options={{
        animation: "fade",
        presentation: "transparentModal",
      }} />
      <AuthStack.Screen
        name={SCREEN_NAMES.LOGIN_SELECTION}
        component={LoginSelectionScreen}
        options={{
          animation: "fade",
          presentation: "transparentModal",
        }}
      />

      {/* Login Flow */}
      <AuthStack.Screen
        name={SCREEN_NAMES.LOGIN_EMAIL}
        component={LoginEmailScreen}
        options={{
          animation: "fade",
          presentation: "transparentModal",
        }}
      />
      <AuthStack.Screen
        name={SCREEN_NAMES.LOGIN_PASSWORD}
        component={LoginPasswordScreen}
        options={{
          animation: "fade",
          presentation: "transparentModal",
        }}
      />

      {/* Forgot Password Flow */}
      <AuthStack.Screen
        name={SCREEN_NAMES.FORGOT_PASSWORD_EMAIL}
        component={ForgotPasswordEmailScreen}
        options={{
          animation: "fade",
          presentation: "transparentModal",
        }}
      />
      <AuthStack.Screen
        name={SCREEN_NAMES.FORGOT_PASSWORD_VERIFICATION}
        component={ForgotPasswordVerificationScreen}
        options={{
          animation: "fade",
          presentation: "transparentModal",
        }}
      />
      <AuthStack.Screen
        name={SCREEN_NAMES.FORGOT_PASSWORD_NEW}
        component={ForgotPasswordNewScreen}
        options={{
          animation: "fade",
          presentation: "transparentModal",
        }}
      />
      <AuthStack.Screen
        name={SCREEN_NAMES.FORGOT_PASSWORD_CONFIRM}
        component={ForgotPasswordConfirmScreen}
        options={{
          animation: "fade",
          presentation: "transparentModal",
        }}
      />
      <AuthStack.Screen
        name={SCREEN_NAMES.FORGOT_PASSWORD_SUCCESS}
        component={ForgotPasswordSuccessScreen}
        options={{
          animation: "fade",
          presentation: "transparentModal",
        }}
      />

      {/* Signup Flow */}
      <AuthStack.Screen
        name={SCREEN_NAMES.SIGNUP_EMAIL}
        component={SignupEmailScreen}
        options={{
          animation: "fade",
          presentation: "transparentModal",
        }}
      />
      <AuthStack.Screen
        name={SCREEN_NAMES.SIGNUP_EMAIL_VERIFICATION}
        component={SignupEmailVerificationScreen}
        options={{
          animation: "fade",
          presentation: "transparentModal",
        }}
      />
      <AuthStack.Screen
        name={SCREEN_NAMES.SIGNUP_NAME}
        component={SignupNameScreen}
        options={{
          animation: "fade",
          presentation: "transparentModal",
        }}
      />
      <AuthStack.Screen
        name={SCREEN_NAMES.SIGNUP_USERNAME}
        component={SignupUsernameScreen}
        options={{
          animation: "fade",
          presentation: "transparentModal",
        }}
      />
      <AuthStack.Screen
        name={SCREEN_NAMES.SIGNUP_HEALTH_GOALS}
        component={SignupHealthGoalsScreen}
        options={{
          animation: "fade",
          presentation: "transparentModal",
        }}
      />
      <AuthStack.Screen
        name={SCREEN_NAMES.SIGNUP_PASSWORD}
        component={SignupPasswordScreen}
        options={{
          animation: "fade",
          presentation: "transparentModal",
        }}
      />
      <AuthStack.Screen
        name={SCREEN_NAMES.SIGNUP_PASSWORD_CONFIRM}
        component={SignupPasswordConfirmScreen}
        options={{
          animation: "fade",
          presentation: "transparentModal",
        }}
      />
      <AuthStack.Screen
        name={SCREEN_NAMES.SIGNUP_SUCCESS}
        component={SignupSuccessScreen}
        options={{
          animation: "fade",
          presentation: "transparentModal",
        }}
      />
    </AuthStack.Navigator>
  );
};

export default AuthNavigator;
