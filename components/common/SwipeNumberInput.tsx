import React, { useRef, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from "react-native";
import { Entypo } from "@expo/vector-icons";
import { TEXT_SIZES } from "@/constants/textSizes";
import { Theme } from "@/constants";
import {
  PanGestureHandler,
  State,
  PanGestureHandlerGestureEvent,
} from "react-native-gesture-handler";

type Props = {
  label: string;
  value: string;
  onIncrement: () => void;
  onDecrement: () => void;
  onChangeValue: (value: string) => void;
};

const SwipeNumberInput: React.FC<Props> = ({
  label,
  value,
  onIncrement,
  onDecrement,
  onChangeValue,
}) => {
  const swipeThreshold = 20;
  const startYRef = useRef<number | null>(null);

  const handleGestureEvent = useCallback(
    ({ nativeEvent }: PanGestureHandlerGestureEvent) => {
      if (startYRef.current === null) {
        startYRef.current = nativeEvent.translationY;
      }

      const diff = nativeEvent.translationY - startYRef.current;

      if (Math.abs(diff) > swipeThreshold) {
        if (diff < 0) {
          onIncrement();
        } else {
          onDecrement();
        }
        startYRef.current = nativeEvent.translationY;
      }
    },
    [onIncrement, onDecrement]
  );

  const handleStateChange = useCallback(
    ({ nativeEvent }: { nativeEvent: any }) => {
      if (
        nativeEvent.state === State.END ||
        nativeEvent.state === State.CANCELLED ||
        nativeEvent.state === State.FAILED
      ) {
        startYRef.current = null;
      }
    },
    []
  );

  return (
    <PanGestureHandler
      onGestureEvent={handleGestureEvent}
      onHandlerStateChange={handleStateChange}
    >
      <View style={styles.container}>
        <View style={styles.touchAreaWrapper}>
          <TextInput
            style={styles.textInput}
            keyboardType="number-pad"
            value={value}
            onChangeText={onChangeValue}
            maxLength={2}
            placeholder="00"
            placeholderTextColor="#A0A0A0"
          />
          <View style={styles.actionColumn}>
            <TouchableOpacity onPress={onIncrement}>
              <Entypo name="chevron-small-up" size={18} color="#797979" />
            </TouchableOpacity>
            <TouchableOpacity onPress={onDecrement}>
              <Entypo name="chevron-small-down" size={18} color="#797979" />
            </TouchableOpacity>
          </View>
        </View>
        <Text
          style={{
            marginTop: 6,
            fontSize: 12,
            fontFamily: "InterRegular",
            color: Theme.text.neutral,
            textAlign: "center",
          }}
        >
          {label}
        </Text>
      </View>
    </PanGestureHandler>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
  },
  touchAreaWrapper: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#8BAFCE",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 2,
    alignItems: "center",
  },
  textInput: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    fontSize: 16,
    fontFamily: "InterMedium",
    color: "#2F2F2F",
    minWidth: 40,
    textAlign: "center",
  },
  actionColumn: {
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 6,
    gap: 2,
  },
});

export default SwipeNumberInput;
