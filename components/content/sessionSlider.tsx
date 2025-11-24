import { Theme } from "@/constants";
import { TEXT_SIZES } from "@/constants/textSizes";
import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  PanResponder,
  Animated,
  LayoutChangeEvent,
  Easing,
  TouchableOpacity,
} from "react-native";
import { Entypo, MaterialCommunityIcons } from "@expo/vector-icons";

type Props = {
  initialIndex?: number;
  onValueChange?: (index: number) => void;
  title?: string;
};

interface MoodConfig {
  icon: string;
  iconType: "MaterialCommunityIcons" | "Entypo";
  label: string;
  color: string;
}

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

export default function EmotionSlider({
  initialIndex = 2,
  onValueChange,
  title = "How do you feel before?",
}: Props) {
  const [width, setWidth] = useState<number>(0);
  const [currentIndex, setCurrentIndex] = useState<number>(initialIndex);
  const [trackWidth, setTrackWidth] = useState<number>(0);
  const containerWidthRef = useRef<number>(0);
  const positions = useRef<number[]>([]);
  const panX = useRef(new Animated.Value(0)).current;
  const panXValue = useRef<number>(0);
  const startX = useRef<number>(0);
  const listenerId = useRef<string | null>(null);
  const indexRef = useRef<number>(initialIndex);
  const filledTrackOffsetLeft = 8;
  const filledTrackOffsetRight = 14;

  const renderIcon = (config: MoodConfig, isActive: boolean) => {
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

  useEffect(() => {
    listenerId.current = panX.addListener(({ value }) => {
      panXValue.current = value;
    });
    return () => {
      if (listenerId.current !== null) {
        panX.removeListener(listenerId.current);
        listenerId.current = null;
      }
    };
  }, [panX]);

  const onLayoutContainer = (ev: LayoutChangeEvent) => {
    const w = ev.nativeEvent.layout.width;
    setWidth(w);
    containerWidthRef.current = w;

    const iconsRowPadding = 12;
    const iconContainerWidth = 40;
    const iconHalfWidth = iconContainerWidth / 2;
    const firstIconCenter = iconsRowPadding + iconHalfWidth;
    const lastIconCenter = w - iconsRowPadding - iconHalfWidth;
    const iconCenterPositions: number[] = [];
    if (moodConfig.length === 1) {
      iconCenterPositions.push(firstIconCenter);
    } else {
      for (let i = 0; i < moodConfig.length; i++) {
        const position =
          firstIconCenter +
          ((lastIconCenter - firstIconCenter) * i) / (moodConfig.length - 1);
        iconCenterPositions.push(position);
      }
    }

    const thumbWidth = 36;
    const thumbHalfWidth = thumbWidth / 2;
    positions.current = iconCenterPositions.map(
      (iconCenter) => iconCenter - thumbHalfWidth
    );

    const trackMargin = 12;
    const calculatedTrackWidth = w - trackMargin * 2;
    setTrackWidth(calculatedTrackWidth);

    const clampedIndex = Math.max(
      0,
      Math.min(moodConfig.length - 1, initialIndex)
    );
    const x = positions.current[clampedIndex] ?? 0;
    panX.setValue(x);
    panXValue.current = x;
    indexRef.current = clampedIndex;
    setCurrentIndex(clampedIndex);
  };

  useEffect(() => {
    if (positions.current.length > 0 && width > 0) {
      const clampedIndex = Math.max(
        0,
        Math.min(moodConfig.length - 1, initialIndex)
      );
      const x = positions.current[clampedIndex] ?? 0;
      Animated.timing(panX, {
        toValue: x,
        duration: 200,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }).start(() => {
        panXValue.current = x;
        indexRef.current = clampedIndex;
        setCurrentIndex(clampedIndex);
      });
    }
  }, [initialIndex, width, panX]);

  const moveThumbToIndex = (targetIndex: number) => {
    if (positions.current.length === 0) return;
    const clampedIndex = Math.max(
      0,
      Math.min(moodConfig.length - 1, targetIndex)
    );
    const toValue = positions.current[clampedIndex] ?? 0;

    Animated.timing(panX, {
      toValue,
      duration: 200,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start(() => {
      panXValue.current = toValue;
      setCurrentIndex(clampedIndex);
      if (onValueChange) onValueChange(clampedIndex);
    });
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,

      onPanResponderGrant: () => {
        startX.current = panXValue.current;
      },

      onPanResponderMove: (_e, gestureState) => {
        const min = positions.current[0] ?? 0;
        const max = positions.current[positions.current.length - 1] ?? 0;
        const attempted = startX.current + gestureState.dx;
        const clamped = Math.max(min, Math.min(max, attempted));
        panX.setValue(clamped);
      },

      onPanResponderRelease: () => {
        const value = panXValue.current;
        let nearestIndex = 0;
        let nearestDist = Infinity;
        positions.current.forEach((pos, i) => {
          const d = Math.abs(pos - value);
          if (d < nearestDist) {
            nearestDist = d;
            nearestIndex = i;
          }
        });
        indexRef.current = nearestIndex;
        moveThumbToIndex(nearestIndex);
      },

      onPanResponderTerminationRequest: () => false,
      onPanResponderTerminate: () => {
        const value = panXValue.current;
        let nearestIndex = 0;
        let nearestDist = Infinity;
        positions.current.forEach((pos, i) => {
          const d = Math.abs(pos - value);
          if (d < nearestDist) {
            nearestDist = d;
            nearestIndex = i;
          }
        });
        indexRef.current = nearestIndex;
        moveThumbToIndex(nearestIndex);
      },
    })
  ).current;

  const thumbStyle = {
    transform: [{ translateX: panX }],
  };

  return (
    <View style={styles.container}>
      <Text
        style={{
          color: Theme.text.neutral,
          fontSize: 16,
          fontFamily: "InterMedium",
          paddingTop: 12,
        }}
      >
        {title}
      </Text>
      <View style={styles.sliderWrap} onLayout={onLayoutContainer}>
        <View style={styles.track} />
        <Animated.View
          style={[
            styles.trackFilled,
            {
              width: Animated.add(panX, 18).interpolate({
                inputRange:
                  positions.current.length > 0
                    ? positions.current.map((pos, i) => pos + 18)
                    : [0, 0],
                outputRange:
                  positions.current.length > 0 && containerWidthRef.current > 0
                    ? positions.current.map((pos, i) => {
                        if (i === positions.current.length - 1) {
                          return (
                            containerWidthRef.current - filledTrackOffsetRight
                          );
                        }
                        return pos + 18 - filledTrackOffsetLeft;
                      })
                    : [0, 0],
                extrapolate: "clamp",
              }),
            },
          ]}
        />
        <View style={styles.iconsRow}>
          {moodConfig.map((config, i) => {
            const isActive = currentIndex === i;
            return (
              <TouchableOpacity
                key={i}
                style={styles.iconWrap}
                activeOpacity={0.8}
                onPress={() => moveThumbToIndex(i)}
              >
                {renderIcon(config, isActive)}
              </TouchableOpacity>
            );
          })}
        </View>

        <Animated.View
          style={[styles.thumb, thumbStyle]}
          {...panResponder.panHandlers}
        >
          <View style={styles.thumbInner} />
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#50555C99",
    padding: 12,
    height: 135,//140
  },
  sliderWrap: {
    height: 48,
    justifyContent: "center",
  },
  track: {
    height: 4,
    backgroundColor: "#D9D9D9",
    borderRadius: 4,
    marginHorizontal: 12,
  },
  trackFilled: {
    position: "absolute",
    height: 4,
    backgroundColor: "#80B4E0",
    borderRadius: 4,
    left: 8,
    top: (48 - 4) / 2,
  },
  iconsRow: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 24,
    height: 64,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 12,
  },
  iconWrap: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  thumb: {
    position: "absolute",
    left: 0,
    top: 6,
    width: 36,
    height: 36,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  thumbInner: {
    width: 20,
    height: 20,
    borderRadius: 14,
    backgroundColor: "#80B4E0",
    borderWidth: 5,
    borderColor: "#fff",
  },
});
