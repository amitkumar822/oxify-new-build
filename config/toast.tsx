import Toast, {
  ToastConfig,
  ToastConfigParams,
} from "react-native-toast-message";
import { Theme } from "../constants";
import { RFValue } from "react-native-responsive-fontsize";
import { Ionicons } from "@expo/vector-icons";
import { View, Text } from "react-native";
import React from "react";

// Clean, minimal toast configuration with blue theme
export const toastConfig = {
  // Success toast
  success: ({ text1 }: ToastConfigParams<any>) => {
    return (
      <View
        style={{
          backgroundColor: "#1B273C",
          borderWidth: 1,
          borderColor: "#4C8BF5",
          borderRadius: 8,
          paddingHorizontal: 12,
          paddingVertical: 8,
          marginHorizontal: 20,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Ionicons name="checkmark-circle" size={16} color="#4C8BF5" />
        <Text
          style={{
            color: "#FFFFFF",
            fontSize: 14,
            fontWeight: "500",
            marginLeft: 8,
          }}
        >
          {text1}
        </Text>
      </View>
    );
  },

  // Error toast
  error: ({ text1 }: ToastConfigParams<any>) => {
    return (
      <View
        style={{
          backgroundColor: "#1B273C",
          borderWidth: 1,
          borderColor: "#FF4444",
          borderRadius: 8,
          paddingHorizontal: 12,
          paddingVertical: 8,
          marginHorizontal: 20,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Ionicons name="close-circle" size={16} color="#FF4444" />
        <Text
          style={{
            color: "#FFFFFF",
            fontSize: 14,
            fontWeight: "500",
            marginLeft: 8,
          }}
        >
          {text1}
        </Text>
      </View>
    );
  },

  // Info toast
  info: ({ text1 }: ToastConfigParams<any>) => {
    return (
      <View
        style={{
          backgroundColor: "#1B273C",
          borderWidth: 1,
          borderColor: "#4C8BF5",
          borderRadius: 8,
          paddingHorizontal: 12,
          paddingVertical: 8,
          marginHorizontal: 20,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Ionicons name="information-circle" size={16} color="#4C8BF5" />
        <Text
          style={{
            color: "#FFFFFF",
            fontSize: 14,
            fontWeight: "500",
            marginLeft: 8,
          }}
        >
          {text1}
        </Text>
      </View>
    );
  },

  // Warning toast
  warning: ({ text1 }: ToastConfigParams<any>) => {
    return (
      <View
        style={{
          backgroundColor: "#1B273C",
          borderWidth: 1,
          borderColor: "#FFA500",
          borderRadius: 8,
          paddingHorizontal: 12,
          paddingVertical: 8,
          marginHorizontal: 20,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Ionicons name="warning" size={16} color="#FFA500" />
        <Text
          style={{
            color: "#FFFFFF",
            fontSize: 14,
            fontWeight: "500",
            marginLeft: 8,
          }}
        >
          {text1}
        </Text>
      </View>
    );
  },
};

// Custom toast functions for consistent styling
export const showToast = {
  success: (message: string) => {
    Toast.show({
      type: "success",
      text1: message,
      position: "top",
      visibilityTime: 3000,
    });
  },

  error: (message: string) => {
    Toast.show({
      type: "error",
      text1: message,
      position: "top",
      visibilityTime: 3000,
    });
  },

  warning: (message: string) => {
    Toast.show({
      type: "warning",
      text1: message,
      position: "top",
      visibilityTime: 3000,
    });
  },

  info: (message: string) => {
    Toast.show({
      type: "info",
      text1: message,
      position: "top",
      visibilityTime: 3000,
    });
  },

  loading: (message: string) => {
    return Toast.show({
      type: "info",
      text1: message,
      position: "top",
      visibilityTime: 0, // Don't auto-hide
    });
  },
};

// Toast dismiss function
export const dismissToast = (toastId?: string | number) => {
  if (toastId) {
    Toast.hide();
  } else {
    Toast.hide();
  }
};

// Toast dismiss all function
export const dismissAllToasts = () => {
  Toast.hide();
};
