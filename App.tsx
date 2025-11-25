import "react-native-gesture-handler";

import React, { useEffect } from "react";
import AppNavigator from "./navigation/AppNavigator";
import Toast from "react-native-toast-message";
import "./global.css";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./config/queryClient";
import { AuthProvider } from "./contexts/AuthContext";
import { AppStatusBar } from "./helpers/AppStatusBar";
import { Alert, Text, TextInput, View } from "react-native";
import ErrorBoundary from "./utils/ErrorBoundary";
import NetworkProvider from "./utils/NetworkProvider";
import { toastConfig } from "./config/toast";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { LogBox } from "react-native";
LogBox.ignoreLogs(["CHHapticPattern", "hapticpatternlibrary.plist"]);

import { useFonts } from "expo-font";

// Inter
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from "@expo-google-fonts/inter";

// Roboto
import {
  Roboto_400Regular,
  Roboto_500Medium,
  Roboto_700Bold,
} from "@expo-google-fonts/roboto";

// Poppins
import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";

// Global Text & TextInput Configuration - using a safer approach
// Disable default system font scaling globally
try {
  if (!(Text as any).defaultProps) {
    (Text as any).defaultProps = {};
  }
  (Text as any).defaultProps.allowFontScaling = false;

  if (!(TextInput as any).defaultProps) {
    (TextInput as any).defaultProps = {};
  }
  (TextInput as any).defaultProps.allowFontScaling = false;
  (TextInput as any).defaultProps.placeholderTextColor = "#9CA3AF";
  (TextInput as any).defaultProps.style = [
    (TextInput as any).defaultProps.style,
    { backgroundColor: "#1a1a1a", color: "#FFFFFF" },
  ];
} catch (error) {
  console.warn("Failed to set global text defaults:", error);
}

const App: React.FC = () => {
  const [fontsLoaded] = useFonts({
    // Inter
    InterRegular: Inter_400Regular,
    InterMedium: Inter_500Medium,
    InterSemiBold: Inter_600SemiBold,
    InterBold: Inter_700Bold,

    // Roboto
    RobotoRegular: Roboto_400Regular,
    RobotoMedium: Roboto_500Medium,
    RobotoBold: Roboto_700Bold,

    // Poppins
    PoppinsRegular: Poppins_400Regular,
    PoppinsMedium: Poppins_500Medium,
    PoppinsSemiBold: Poppins_600SemiBold,
    PoppinsBold: Poppins_700Bold,

    // Ramabhadra
    Ramabhadra: require("@/assets/fonts/Ramabhadra-Regular.ttf"),
  });

  if (!fontsLoaded) return null;

  return (
    <ErrorBoundary>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <NetworkProvider>
          <QueryClientProvider client={queryClient}>
            <AuthProvider>
              <View style={{ flex: 1 }}>
                <AppStatusBar barStyle="light-content" />
                <AppNavigator />
              </View>
            </AuthProvider>
            <Toast config={toastConfig as any} />
          </QueryClientProvider>
        </NetworkProvider>
      </GestureHandlerRootView>
    </ErrorBoundary>
  );
};

export default App;
