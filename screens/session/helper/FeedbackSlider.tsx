import React, { useState, useRef, useEffect } from "react";
import { View, Text, TouchableOpacity, Animated } from "react-native";
import { Entypo, MaterialCommunityIcons } from "@expo/vector-icons";
import { RFValue } from "react-native-responsive-fontsize";
import { TEXT_SIZES } from "@/constants/textSizes";

interface MoodConfig {
  icon: string;
  iconType: "MaterialCommunityIcons" | "Entypo";
  label: string;
  color: string;
}

interface MoodSliderProps {
  initialValue?: number;
  onValueChange?: (value: number, label: string) => void;
  title?: string;
  backgroundColor?: string;
  textColor?: string;
}

const FeedbackSlider: React.FC<MoodSliderProps> = ({
  initialValue = 0,
  onValueChange,
  title = "How do you feel before?",
  backgroundColor = "#50555C99",
  textColor = "#DDE2E5",
}) => {
  const [moodValue, setMoodValue] = useState(initialValue);
  const [isProcessingSwipe, setIsProcessingSwipe] = useState(false);

  // Animated value for smooth slider movement
  const sliderAnimation = useRef(new Animated.Value(moodValue)).current;

  // Touch tracking for swipe gestures
  const touchStart = useRef({ x: 0, y: 0, time: 0 });
  const touchEnd = useRef({ x: 0, y: 0, time: 0 });
  const lastSwipeTime = useRef(0);
  const swipeCooldown = 300; // 300ms cooldown between swipes

  // Mood configuration with scalable structure
  const moodConfig: MoodConfig[] = [
    {
      icon: "emoticon-angry-outline",
      iconType: "MaterialCommunityIcons",
      label: "Frustrated",
      color: "#8BAFCE",
    },
    {
      icon: "emoji-sad",
      iconType: "Entypo",
      label: "Upset",
      color: "#8BAFCE",
    },
    {
      icon: "emoji-neutral",
      iconType: "Entypo",
      label: "Neutral",
      color: "#8BAFCE",
    },
    {
      icon: "emoji-happy",
      iconType: "Entypo",
      label: "Happy",
      color: "#8BAFCE",
    },
    {
      icon: "emoticon-excited-outline",
      iconType: "MaterialCommunityIcons",
      label: "Excited",
      color: "#8BAFCE",
    },
  ];

  // Function to render emoji icon based on type
  const renderEmojiIcon = (config: MoodConfig, isActive: boolean) => {
    const iconColor = isActive ? config.color : "#FFFFFF";
    const iconSize = 24;

    switch (config.iconType) {
      case "MaterialCommunityIcons":
        return (
          <MaterialCommunityIcons
            name={config.icon as any}
            size={iconSize}
            color={iconColor}
          />
        );
      case "Entypo":
        return (
          <Entypo name={config.icon as any} size={iconSize} color={iconColor} />
        );
      default:
        return null;
    }
  };

  // Function to get mood value from emoji index (0-4)
  const getMoodValueFromIndex = (index: number) => {
    return index / 4; // 0, 0.25, 0.5, 0.75, 1.0
  };

  // Function to get emoji index from mood value
  const getEmojiIndexFromMoodValue = (value: number) => {
    return Math.round(value * 4);
  };

  // Function to handle swipe gestures
  const handleSwipeGesture = (direction: "left" | "right") => {
    if (isProcessingSwipe) {
      return;
    }

    setIsProcessingSwipe(true);

    const currentIndex = getEmojiIndexFromMoodValue(moodValue);
    let newIndex = currentIndex;

    // Only move one step at a time
    if (direction === "left" && currentIndex > 0) {
      newIndex = currentIndex - 1;
    } else if (direction === "right" && currentIndex < 4) {
      newIndex = currentIndex + 1;
    } else {
      setIsProcessingSwipe(false);
      return; // Don't update if at boundary
    }

    // Double-check that we're only moving one step
    if (Math.abs(newIndex - currentIndex) === 1) {
      const newMoodValue = getMoodValueFromIndex(newIndex);
      setMoodValue(newMoodValue);

      // Call the callback with new value and label
      if (onValueChange) {
        const label = moodConfig[newIndex]?.label || "Neutral";
        onValueChange(newMoodValue, label);
      }
    }

    // Reset processing state after a short delay
    setTimeout(() => {
      setIsProcessingSwipe(false);
    }, 100);
  };

  const handleTouchStart = (evt: any) => {
    const { pageX, pageY } = evt.nativeEvent;
    touchStart.current = { x: pageX, y: pageY, time: Date.now() };
  };

  const handleTouchEnd = (evt: any) => {
    const { pageX, pageY } = evt.nativeEvent;
    touchEnd.current = { x: pageX, y: pageY, time: Date.now() };

    const deltaX = touchEnd.current.x - touchStart.current.x;
    const deltaY = touchEnd.current.y - touchStart.current.y;
    const deltaTime = touchEnd.current.time - touchStart.current.time;

    // Check cooldown to prevent rapid multiple swipes
    const now = Date.now();
    if (now - lastSwipeTime.current < swipeCooldown) {
      return;
    }

    // More strict swipe detection
    const minSwipeDistance = 50; // Increased minimum distance
    const maxSwipeTime = 500; // Maximum time for a swipe (500ms)
    const horizontalRatio = Math.abs(deltaX) / Math.abs(deltaY || 1); // Avoid division by zero

    // Check if it's a valid horizontal swipe
    if (
      Math.abs(deltaX) > minSwipeDistance && // Minimum horizontal distance
      deltaTime < maxSwipeTime && // Not too slow
      horizontalRatio > 2 && // Much more horizontal than vertical
      Math.abs(deltaX) > Math.abs(deltaY) // Horizontal movement is dominant
    ) {
      // Determine direction with more precision
      if (deltaX > 0) {
        handleSwipeGesture("right");
        lastSwipeTime.current = now;
      } else {
        handleSwipeGesture("left");
        lastSwipeTime.current = now;
      }
    }
  };

  console.log("moodValue", moodValue);

  // Update animation when moodValue changes
  useEffect(() => {
    Animated.timing(sliderAnimation, {
      toValue: moodValue,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [moodValue]);

  // Update internal state when initialValue prop changes
  useEffect(() => {
    setMoodValue(initialValue);
  }, [initialValue]);

  return (
    <View className="mb-4 px-4 py-6" style={{ backgroundColor }}>
      <Text
        className="font-semibold mb-3"
        style={{ color: textColor, fontSize: TEXT_SIZES.md }}
      >
        {title}
      </Text>

      {/* Swipe Area - Larger touchable area for gestures */}
      <View className="py-4">
        <TouchableOpacity
          activeOpacity={1}
          onPressIn={handleTouchStart}
          onPressOut={handleTouchEnd}
        >
          <View className="relative">
            <View className="h-1 bg-gray-300 rounded-full relative mx-3.5">
              <Animated.View
                className="h-1 bg-[#80B4E0] rounded-full absolute"
                style={{
                  width: sliderAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: ["0%", "100%"],
                  }),
                }}
              />

              {/* Slider thumb with white outer ring and blue center pointer */}
              <Animated.View
                className="absolute w-6 h-6 bg-white rounded-full -top-2.5"
                style={{
                  left: sliderAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: ["0%", "100%"],
                  }),
                  marginLeft: -12,
                }}
              >
                {/* Blue center pointer */}
                <View
                  className="absolute w-2 h-2 bg-[#80B4E0] rounded-full"
                  style={{
                    top: "50%",
                    left: "50%",
                    marginTop: -4,
                    marginLeft: -4,
                  }}
                />
              </Animated.View>
            </View>
          </View>
        </TouchableOpacity>
      </View>

      {/* Emoji Selection Row */}
      <TouchableOpacity
        activeOpacity={1}
        onPressIn={handleTouchStart}
        onPressOut={handleTouchEnd}
      >
        <View className="flex-row justify-between px-3">
          {moodConfig.map((config, index) => {
            const isActive = getEmojiIndexFromMoodValue(moodValue) === index;
            return (
              <TouchableOpacity
                key={index}
                className="items-center py-2 px-1"
                onPress={() => {
                  const targetValue = getMoodValueFromIndex(index);
                  setMoodValue(targetValue);

                  // Call the callback
                  if (onValueChange) {
                    onValueChange(targetValue, config.label);
                  }
                }}
                activeOpacity={0.7}
              >
                <View
                  style={{
                    opacity: isActive ? 1 : 0.7,
                    transform: [{ scale: isActive ? 1.1 : 1 }],
                    padding: RFValue(2),
                  }}
                  className={`rounded-full ${isActive ? "bg-white/10" : ""}`}
                >
                  {renderEmojiIcon(config, isActive)}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default FeedbackSlider;
