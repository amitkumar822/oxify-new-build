import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { Colors, Theme } from "../../constants";

interface AuthButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "outline";
  disabled?: boolean;
  fullWidth?: boolean;
}

const AuthButton: React.FC<AuthButtonProps> = ({
  title,
  onPress,
  variant = "primary",
  disabled = false,
  fullWidth = true,
}) => {
  const buttonStyle = [
    styles.button,
    styles[variant],
    fullWidth && styles.fullWidth,
    disabled && styles.disabled,
  ];

  const textStyle = [
    styles.text,
    styles[`${variant}Text`],
    disabled && styles.disabledText,
  ];

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      <Text style={textStyle}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  fullWidth: {
    width: "100%",
  },
  disabled: {
    opacity: 0.6,
  },
  primary: {
    backgroundColor: '#DDE2E5',
  },
  secondary: {
    backgroundColor: Theme.background.secondary,
  },
  outline: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: Theme.action.primary,
  },
  text: {
    fontFamily: 'Inter',
    fontSize: 16,
    fontWeight: "600",
    fontStyle: 'normal',
    lineHeight: 16,
    letterSpacing: 0,
  },
  primaryText: {
    color: Theme.text.inverse,
  },
  secondaryText: {
    color: Theme.text.primary,
  },
  outlineText: {
    color: Theme.action.primary,
  },
  disabledText: {
    color: Theme.text.secondary,
  },
});

export default AuthButton;
