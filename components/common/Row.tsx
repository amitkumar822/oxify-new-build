import React, { ReactNode } from "react";
import { View, StyleSheet, ViewProps } from "react-native";

interface RowProps extends ViewProps {
  children: ReactNode;
  justify?: "flex-start" | "space-between" | "center";
  align?: "center" | "flex-start" | "flex-end";
  gap?: number;
}

const Row: React.FC<RowProps> = ({
  children,
  style,
  justify = "space-between",
  align = "center",
  gap = 12,
  ...rest
}) => {
  return (
    <View
      style={[
        styles.row,
        { justifyContent: justify, alignItems: align, gap },
        style,
      ]}
      {...rest}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
  },
});

export default Row;

