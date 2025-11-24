import React, { useRef, useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Animated,
  LayoutAnimation,
  Platform,
  UIManager,
  Easing,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { MaterialIcons } from "@expo/vector-icons";
import { TEXT_SIZES } from "@/constants/textSizes";
import { Colors } from "@/constants";

// Enable LayoutAnimation for Android
if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const TabSwitcher = ({ activeTab, setActiveTab }: any) => {
  const translateX = useRef(new Animated.Value(0)).current;
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    Animated.timing(translateX, {
      toValue: activeTab === "protocols" ? 0 : 1,
      duration: 250, // smooth transition duration
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();
  }, [activeTab]);

  // interpolate movement (left to right)
  const indicatorTranslate = translateX.interpolate({
    inputRange: [0, 1],
    outputRange: [0, containerWidth / 2],
  });

  return (
    <View className="bg-[#3A4049] rounded-full p-1 mb-3">
      <View
        className="flex-row relative overflow-hidden"
        onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}
      >
        {/* Sliding Indicator */}
        <Animated.View
          style={{
            position: "absolute",
            height: "100%",
            width: "50%",
            backgroundColor: "white",
            borderRadius: 9999,
            transform: [{ translateX: indicatorTranslate }],
          }}
        />

        {/* Protocols */}
        <TouchableOpacity
          style={{ gap:   4  }}
          onPress={() => setActiveTab("protocols")}
          className="flex-1 flex-row items-center justify-center py-2 px-4 rounded-full"
        >
          <Image
            source={require("@/assets/icons/brain.png")}
            style={{
              width:  14,
              height:  14,
              tintColor:
                activeTab === "protocols" ? Colors.blue : Colors.grayText,
            }}
          />
          <Text
            style={{
              fontSize: 14,
              color: activeTab === "protocols" ? Colors.blue : Colors.grayText,
              fontFamily: activeTab === "protocols" ?  "InterMedium" : "InterRegular",
            }}
          >
            Protocols
          </Text>
        </TouchableOpacity>

        {/* Learning Articles */}
        <TouchableOpacity
          onPress={() => setActiveTab("articles")}
          className="flex-1 flex-row items-center justify-center py-2 px-4 rounded-full"
        >
          <MaterialIcons
            name="article"
            size={14}
            style={{
              color: activeTab === "articles" ? Colors.blue : Colors.grayText,
              width: 20,
            }}
          />
          <Text
            style={{
              fontSize: 14,
              color: activeTab === "articles" ? Colors.blue : Colors.grayText,
              fontFamily: activeTab === "articles" ? "InterMedium" : "InterRegular",
            }}
          >
            Learning Articles
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default TabSwitcher;
