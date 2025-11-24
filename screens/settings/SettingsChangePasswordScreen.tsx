import React from "react";
import { View, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { ScreenContainer, SectionTitle } from "../../components/common";
import ChangePasswordScreen from "../profile/ChangePasswordScreen";
import { Theme } from "@/constants";

const SettingsChangePasswordScreen: React.FC = () => {
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
      <SectionTitle>Security</SectionTitle>
      <ChangePasswordScreen />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
});

export default SettingsChangePasswordScreen;
