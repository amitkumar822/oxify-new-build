import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Animated,
  Easing,
} from "react-native";
import { Entypo } from "@expo/vector-icons";
import { Theme } from "@/constants";
import { TEXT_SIZES } from "@/constants/textSizes";

export interface DropdownOption {
  label: string;
  value: string | number;
  meta?: any;
}

export interface DropdownSelectProps {
  label: string;
  value?: string;
  placeholder?: string;
  options: DropdownOption[];
  onSelect: (option: DropdownOption) => void;
}

const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity);

const DropdownSelect: React.FC<DropdownSelectProps> = ({
  label,
  value,
  placeholder = "Select",
  options,
  onSelect,
}) => {
  const [open, setOpen] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const dropdownAnim = useRef(new Animated.Value(0)).current;
  const radiusAnim = useRef(new Animated.Value(0)).current;
  const displayText = value && value.length > 0 ? value : placeholder;

  const handleSelect = (option: DropdownOption) => {
    onSelect(option);
    setOpen(false);
  };

  useEffect(() => {
    const toValue = open ? 1 : 0;

    if (open) {
      setShowOptions(true);
    }

    Animated.parallel([
      Animated.timing(dropdownAnim, {
        toValue,
        duration: open ? 200 : 160,
        easing: open ? Easing.out(Easing.ease) : Easing.in(Easing.ease),
        useNativeDriver: false,
      }),
      Animated.timing(radiusAnim, {
        toValue,
        duration: 180,
        easing: Easing.out(Easing.ease),
        useNativeDriver: false,
      }),
    ]).start(({ finished }) => {
      if (!open && finished) {
        setShowOptions(false);
      }
    });
  }, [open, dropdownAnim, radiusAnim]);

  const animatedListStyle = {
    opacity: dropdownAnim,
    transform: [
      {
        scaleY: dropdownAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [0.9, 1],
        }),
      },
      {
        translateY: dropdownAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [-8, 0],
        }),
      },
    ],
  };

  const borderColorAnim = radiusAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["#8BAFCE", "#5FA2D6"],
  });

  const inputAnimatedStyle = {
    borderBottomLeftRadius: radiusAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [14, 0],
    }),
    borderBottomRightRadius: radiusAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [14, 0],
    }),
    borderColor: borderColorAnim,
    borderWidth: 1,
    shadowOpacity: radiusAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 0.25],
    }),
    elevation: radiusAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 6],
    }),
    shadowRadius: radiusAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 8],
    }),
  };

  return (
    <View style={styles.wrapper}>
      <Text
        className="mb-2.5"
        style={{ color: Theme.text.neutral, fontSize: 16, fontFamily: "InterMedium" }}
      >
        {label}
      </Text>
      <AnimatedTouchableOpacity
        className="bg-white px-4 py-2.5 flex-row items-center justify-between"
        onPress={() => setOpen((prev) => !prev)}
        activeOpacity={0.8}
        style={[styles.input, inputAnimatedStyle]}
      >
        <Text
          style={{
            color: value ? "#374151" : "#9CA3AF",
            fontSize: 14,
            fontFamily: "InterRegular",
          }}
        >
          {displayText}
        </Text>
        <Entypo
          name={open ? "chevron-small-up" : "chevron-small-down"}
          size={24}
          color="#6B7280"
        />
      </AnimatedTouchableOpacity>

      {showOptions && (
        <>
          <TouchableOpacity
            style={styles.overlay}
            activeOpacity={1}
            onPress={() => setOpen(false)}
          />
          <Animated.View
            style={[
              styles.list,
              animatedListStyle,
              {
                borderColor: borderColorAnim,
              },
            ]}
          >
            <ScrollView
              style={{ maxHeight: 220 }}
              showsVerticalScrollIndicator={false}
            >
              {options.length === 0 ? (
                <Text style={styles.emptyText}>No options available</Text>
              ) : (
                options.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={styles.option}
                    onPress={() => handleSelect(option)}
                  >
                    <Text style={styles.optionLabel}>{option.label}</Text>
                  </TouchableOpacity>
                ))
              )}
            </ScrollView>
          </Animated.View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: "relative",
    zIndex: 1,
  },
  input: {
    borderWidth: 1,
    borderColor: "#8BAFCE",
    borderBottomColor: "transparent",
    borderRadius: 14,
    shadowColor: "#5FA2D6",
    shadowOffset: { width: 0, height: 3 },
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
  list: {
    position: "absolute",
    top: 74,
    left: 0,
    right: 0,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    backgroundColor: "#fff",
    shadowColor: "#000",
    borderBottomEndRadius: 14,
    borderBottomLeftRadius: 14,
  },
  option: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    marginBottom: 0,
  },
  optionLabel: {
    fontSize: TEXT_SIZES.md,
    color: "#1F2937",
  },
  emptyText: {
    textAlign: "center",
    color: "#9CA3AF",
    paddingVertical: 18,
    fontSize: TEXT_SIZES.sm,
  },
});

export default DropdownSelect;
