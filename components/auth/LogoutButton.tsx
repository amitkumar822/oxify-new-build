import React from "react";
import { TouchableOpacity, Text, StyleSheet, Alert } from "react-native";
import { Theme } from "../../constants";
import { useAuth } from "../../contexts/AuthContext";
import { showToast } from "../../config/toast";

interface LogoutButtonProps {
  onLogout?: () => void;
  title?: string;
  variant?: "primary" | "secondary" | "danger";
}

const LogoutButton: React.FC<LogoutButtonProps> = ({
  onLogout,
  title = "Logout",
  variant = "danger",
}) => {
  const { logout } = useAuth();

  const handleLogout = async () => {
    Alert.alert("Confirm Logout", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            await logout();
            showToast.success("Logged out successfully");
            onLogout?.();
          } catch (error) {
            console.error("Logout error:", error);
            showToast.error("Failed to logout");
          }
        },
      },
    ]);
  };

  const buttonStyle = [styles.button, styles[variant]];

  const textStyle = [styles.text, styles[`${variant}Text`]];

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={handleLogout}
      activeOpacity={0.8}
    >
      <Text style={textStyle}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  primary: {
    backgroundColor: Theme.action.primary,
  },
  secondary: {
    backgroundColor: Theme.background.secondary,
  },
  danger: {
    backgroundColor: Theme.status.error,
  },
  text: {
    fontSize: 16,
    fontWeight: "600",
  },
  primaryText: {
    color: Theme.text.inverse,
  },
  secondaryText: {
    color: Theme.text.primary,
  },
  dangerText: {
    color: Theme.text.inverse,
  },
});

export default LogoutButton;
