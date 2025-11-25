import React from "react";
import {
  SectionTitle,
  ListItem,
} from "../../components/common";
import { StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Theme } from "@/constants";

const CommunityCommentsScreen: React.FC = () => {
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
      <SectionTitle>Community Comments</SectionTitle>
      <ListItem title="Alex" subtitle="HBOT really helped my recovery!" />
      <ListItem title="Sam" subtitle="Tips for managing ear pressure?" />
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

export default CommunityCommentsScreen;
