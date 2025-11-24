import React from "react";
import {
  ScreenContainer,
  SectionTitle,
  ListItem,
} from "../../components/common";
import { View, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Theme } from "@/constants";

const LearningArticlesScreen: React.FC = () => {
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
      <SectionTitle>Learning Articles</SectionTitle>
      <ListItem title="HBOT Fundamentals" subtitle="12 min read" />
      <ListItem title="Safety & Best Practices" subtitle="9 min read" />
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

export default LearningArticlesScreen;
