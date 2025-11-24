import { Colors } from "@/constants";
import { TEXT_SIZES } from "@/constants/textSizes";
import React from "react";
import { StyleProp, ViewStyle } from "react-native";
import {
  Pressable,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
} from "react-native";

interface ButtonsProps {
  onPress: () => void;
  title: string;
  isLoading?: boolean;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
}

const Buttons = ({
  onPress,
  title = "Continue",
  isLoading = false,
  style,
  disabled = false,
}: ButtonsProps) => {
  return (
    <View style={{ width: "100%" }}>
      <Pressable
        style={[
          styles.button,
          (isLoading || disabled) && styles.disabledButton,
          style,
        ]}
        onPress={onPress}
        disabled={isLoading || disabled}
      >
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator
              size="small"
              color={Colors.primaryBg}
              style={{ marginRight: 8 }}
            />
            <Text style={styles.buttonText}>Please wait...</Text>
          </View>
        ) : (
          <Text style={styles.buttonText}>{title}</Text>
        )}
      </Pressable>
    </View>
  );
};

export default Buttons;

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#F3F3F3",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
    zIndex: 100,
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonText: {
    color: Colors.primaryBg,
    fontSize: TEXT_SIZES.lg,
    fontWeight: "600",
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
});
