import React from "react";
import { View, Text, TouchableOpacity, Animated, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { TEXT_SIZES } from "@/constants/textSizes";
import { Colors } from "@/constants";
import { RFValue } from "react-native-responsive-fontsize";
import { capitalizeFirst } from "@/utils/capitalizeFirst";

type ProtocolCardProps = {
  title: string;
  description: string;
  ata: string;
  duration: string;
  repeat: string;
  liked?: boolean;
  onStart?: () => void;
  onLikeToggle?: () => void;
  // Optional raw values to support preset navigation
  raw?: {
    id?: number;
    recommended_ata?: string;
    recommended_duration?: string; // HH:mm:ss
  };
};

const ProtocolCard: React.FC<ProtocolCardProps> = ({
  title,
  description,
  ata,
  duration,
  repeat,
  liked = false,
  onStart,
  onLikeToggle,
  raw,
}) => {
  const heartScale = React.useRef(new Animated.Value(1)).current;

  const handleHeartPress = () => {
    // Bouncing animation
    Animated.sequence([
      Animated.timing(heartScale, {
        toValue: 1.3,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(heartScale, {
        toValue: 0.8,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(heartScale, {
        toValue: 1.1,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(heartScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    // Call the original onLikeToggle function
    onLikeToggle?.();
  };
  return (
    <View className={`bg-[${Colors.grayBg}] rounded-[20px] p-4 mb-4 shadow`}>
      <View className="flex-row justify-between items-start">
        <Text
          className="text-white"
          style={{
            fontSize: 15,
            fontFamily: "InterSemiBold",
          }}
        >
          {capitalizeFirst(title)}
        </Text>
        <TouchableOpacity onPress={handleHeartPress}>
          <Animated.View
            style={{
              transform: [{ scale: heartScale }],
            }}
          >
            <Ionicons
              name={liked ? "heart" : "heart-outline"}
              size={21}
              color={liked ? "#EF4444" : "white"}
            />
          </Animated.View>
        </TouchableOpacity>
      </View>

      <Text
        style={{
          fontSize: 12.5,
          fontFamily: "InterRegular",
          lineHeight: 14,
          color: "#D9D9D9",
          marginBottom: 7,
        }}
      >
        {description}
      </Text>

      <View className="flex-row space-x-4 items-center justify-between mb-3">
        <View className="flex-row items-center gap-1   rounded-full ">
          <Image
            source={require("../../assets/icons/health.png")}
            style={{ width: 12, height: 12 }}
            className=""
          />
          <Text
            className="text-[#D9D9D9] "
            style={{
              fontSize: 10.5,
              fontFamily: "InterRegular",
            }}
          >
            {ata}
          </Text>
        </View>

        <View className="flex-row items-center gap-1   rounded-full ">
          <Image
            source={require("../../assets/icons/time.png")}
            style={{ width: 12, height: 12 }}
            className=""
          />
          <Text
            className="text-[#D9D9D9] "
            style={{
              fontSize: 10.5,
              fontFamily: "InterRegular",
            }}
          >
            {duration}
          </Text>
        </View>
        <View className="flex-row items-center gap-1   rounded-full ">
          <Image
            source={require("../../assets/icons/refresh.png")}
            style={{ width: 12, height: 12 }}
            className=""
          />
          <Text
            className="text-[#D9D9D9] "
            style={{
              fontSize: 10.5,
              fontFamily: "InterRegular",
            }}
          >
            {repeat}
          </Text>
        </View>
      </View>

      <TouchableOpacity
        onPress={onStart}
        className="bg-[#4C8BF5] py-2 rounded-[12px]"
      >
        <Text
          className="text-white text-center"
          style={{ fontSize: 15, fontFamily: "InterSemiBold" }}
        >
          Start Session
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default ProtocolCard;
