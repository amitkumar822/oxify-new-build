import React, { ReactNode } from "react";
import { View, StyleSheet } from "react-native";
import { Theme } from "../../constants";

interface ScreenContainerProps {
  children: ReactNode;
  padded?: boolean;
}

const ScreenContainer: React.FC<ScreenContainerProps> = ({
  children,
  padded = true,
}) => {
  return (
    <View className="flex-1 bg-gray-950" style={styles.container}>
      <View style={[styles.content, padded && styles.padded]}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  padded: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 20,
  },
});

export default ScreenContainer;

