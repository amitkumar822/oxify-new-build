import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Theme } from "../../constants";

interface AuthHeaderProps {
  title: string;
  onBack?: () => void;
  showBack?: boolean;
}

const AuthHeader: React.FC<AuthHeaderProps> = ({
  title,
  onBack,
  showBack = true,
}) => {
  return (
    <View style={styles.header}>
      {showBack && onBack && (
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
      )}
      <Text style={styles.title}>{title}</Text>
      <View style={styles.spacer} />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 24,
    color: Theme.text.inverse,
    fontWeight: "600",
  },
  title: {
    flex: 1,
    fontSize: 28,
    fontWeight: "bold",
    color: Theme.text.inverse,
    textAlign: "center",
  },
  spacer: {
    width: 40,
  },
});

export default AuthHeader;
