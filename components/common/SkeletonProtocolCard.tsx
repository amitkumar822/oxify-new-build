import React, { useEffect, useRef } from "react";
import { View, Animated, StyleSheet } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { Colors } from "@/constants";

const SkeletonProtocolCard: React.FC = () => {
  const shimmer = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmer, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(shimmer, {
          toValue: 0,
          duration: 1200,
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, []);

  const shimmerStyle = {
    opacity: shimmer.interpolate({
      inputRange: [0, 1],
      outputRange: [0.3, 1],
    }),
  };

  return (
    <View
      className={`bg-[${Colors.grayBg}] rounded-2xl p-4 mb-4`}
      style={styles.card}
    >
      {/* Title + Heart */}
      <View style={styles.row}>
        <Animated.View style={[styles.title, shimmerStyle]} />
        <Animated.View style={[styles.icon, shimmerStyle]} />
      </View>

      {/* Description */}
      <Animated.View style={[styles.desc, shimmerStyle]} />

      {/* Row items (ata, duration, repeat) */}
      <View style={[styles.row, { marginVertical: 12 }]}>
        <Animated.View style={[styles.smallBox, shimmerStyle]} />
        <Animated.View style={[styles.smallBox, shimmerStyle]} />
        <Animated.View style={[styles.smallBox, shimmerStyle]} />
      </View>

      {/* Start button */}
      <Animated.View style={[styles.button, shimmerStyle]} />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    width: "60%",
    height: RFValue(16),
    borderRadius: 6,
    backgroundColor: "#3A3F47",
  },
  icon: {
    width: RFValue(22),
    height: RFValue(22),
    borderRadius: 11,
    backgroundColor: "#3A3F47",
  },
  desc: {
    marginTop: 10,
    width: "90%",
    height: RFValue(12),
    borderRadius: 6,
    backgroundColor: "#3A3F47",
  },
  smallBox: {
    width: "25%",
    height: RFValue(12),
    borderRadius: 6,
    backgroundColor: "#3A3F47",
  },
  button: {
    width: "100%",
    height: RFValue(36),
    borderRadius: 10,
    backgroundColor: "#3A3F47",
    marginTop: 10,
  },
});

export default SkeletonProtocolCard;
