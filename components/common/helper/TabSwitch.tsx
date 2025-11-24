import React, { FC } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  LayoutChangeEvent,
  LayoutRectangle,
  Animated,
} from "react-native";
import { TEXT_SIZES } from "@/constants/textSizes";
import { RFValue } from "react-native-responsive-fontsize";

interface tabProps {
  onTabsLayout: (event: LayoutChangeEvent) => void;
  tabLayout: LayoutRectangle | null;
  tabTranslate: Animated.Value;
  timeOfDay: "morning" | "evening";
  handleTimeOfDayChange: (timeOfDay: "morning" | "evening") => void;
}

const TabSwitch: FC<tabProps> = ({
  onTabsLayout,
  tabLayout,
  tabTranslate,
  timeOfDay,
  handleTimeOfDayChange,
}) => {
  return (
    <View
      onLayout={onTabsLayout}
      style={{
        flexDirection: "row",
        backgroundColor: "#9FA6B0",
        borderRadius: 12,
        height: 37,
        padding: 3,
      }}
    >
      {/* Animated background indicator */}
      {tabLayout && (
        <Animated.View
          style={{
            position: "absolute",
            left: 3,
            top: 3,
            bottom: 3,
            width: tabLayout.width / 2 - 6,
            transform: [{ translateX: tabTranslate }],
            backgroundColor: "#FFFFFF",
            borderRadius: 10,
          }}
        />
      )}

      {/* Morning tab */}
      <TouchableOpacity
        onPress={() => handleTimeOfDayChange("morning")}
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
        activeOpacity={0.8}
      >
        <Text
          style={{
            fontSize: 14,
            fontFamily: "InterSemiBold",
            color: timeOfDay === "morning" ? "#6189AD" : "#676C74",
          }}
        >
          Morning
        </Text>
      </TouchableOpacity>

      {/* Evening tab */}
      <TouchableOpacity
        onPress={() => handleTimeOfDayChange("evening")}
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
        activeOpacity={0.8}
      >
        <Text
          style={{
            fontSize: 14,
            fontFamily: "InterSemiBold",
            color: timeOfDay === "evening" ? "#6189AD" : "#676C74",
          }}
        >
          Evening
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default TabSwitch;
