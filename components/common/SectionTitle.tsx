import React from "react";
import { Text, StyleSheet, TextProps } from "react-native";
import { Theme } from "../../constants";

const SectionTitle: React.FC<TextProps> = ({ children, style, ...rest }) => {
  return (
    <Text style={[styles.title, style]} {...rest}>
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: Theme.text.inverse,
    marginBottom: 12,
  },
});

export default SectionTitle;

