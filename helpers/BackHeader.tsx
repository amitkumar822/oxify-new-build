import React, { FC, memo } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { TEXT_SIZES } from "@/constants/textSizes";
const { useNavigation } = require("@react-navigation/native");
import { RFValue } from "react-native-responsive-fontsize";
import { Theme } from "@/constants";
import { FontAwesome6 } from "@expo/vector-icons";

export const BackHeader: FC<{
  title?: string;
  style?: any;
  handleBack?: () => void;
}> = memo(({ title = "Back", style, handleBack }) => {
  const navigation: any = useNavigation();

  const handleBackPress = () => {
    if (handleBack) {
      handleBack();
    } else if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  return (
    <View style={[styles.headercontainer, style]}>
      <Pressable 
        onPress={handleBackPress}
        style={styles.pressable}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <View style={styles.backbtn}>
          <FontAwesome6
            name="chevron-left"
            size={RFValue(16)}
            color={Theme.text.neutral}
          />

          <Text style={styles.backTxt}>{title}</Text>
        </View>
      </Pressable>
    </View>
  );
});

const styles = StyleSheet.create({
  headercontainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: RFValue(3),
  },
  pressable: {
    paddingVertical: 8,
    paddingHorizontal: 2,
  },
  backbtn: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: 6,
  },
  backTxt: {
    color: Theme.text.neutral,
    fontSize: RFValue(16),
    fontFamily: "Roboto-Medium",
  },
});
