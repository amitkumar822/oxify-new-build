import React, { useEffect, useRef, useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Animated,
  PanResponder,
  Switch,
  ScrollView,
  LayoutChangeEvent,
  Easing,
  LayoutRectangle,
} from "react-native";
import { TEXT_SIZES } from "@/constants/textSizes";
import {
  getReminderData,
  storeReminderData,
  ReminderData,
} from "@/utils/tokenManager";
import TabSwitch from "./helper/TabSwitch";
import { scheduleDailyReminder } from "@/utils/reminderNotification/scheduleDailyReminder";

interface SetReminderBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  onSave?: (reminderData: ReminderData) => void;
}

const SetReminderBottomSheet: React.FC<SetReminderBottomSheetProps> = ({
  visible,
  onClose,
  onSave,
}) => {
  // State for reminder settings
  const [reminderEnabled, setReminderEnabled] = useState(true);
  const [timeOfDay, setTimeOfDay] = useState<"morning" | "evening">("morning");
  const [selectedHour, setSelectedHour] = useState(7);
  const [selectedMinute, setSelectedMinute] = useState(0);
  const [period, setPeriod] = useState<"AM" | "PM">("AM");

  // Animation refs
  const [sheetHeight, setSheetHeight] = useState(0);
  const translateY = useRef(new Animated.Value(400)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;

  // Tab indicator animation
  const tabTranslate = useRef(new Animated.Value(0)).current;
  const [tabLayout, setTabLayout] = useState<LayoutRectangle | null>(null);

  // ScrollView refs for time pickers
  const hourScrollRef = useRef<ScrollView>(null);
  const minuteScrollRef = useRef<ScrollView>(null);

  // Track if scroll positions have been initialized
  const isInitialized = useRef(false);

  const rawHours = Array.from({ length: 12 }, (_, i) => i + 1);
  const rawMinutes = Array.from({ length: 60 }, (_, i) => i);

  // Loop each 3 times for infinite scroll effect
  const hours = [...rawHours, ...rawHours, ...rawHours];
  const minutes = [...rawMinutes, ...rawMinutes, ...rawMinutes];

  // Constants for scrollable picker
  const ITEM_HEIGHT = 40;
  const VISIBLE_ITEMS = 5;
  const PICKER_HEIGHT = ITEM_HEIGHT * VISIBLE_ITEMS;

  const animateOpen = () => {
    Animated.parallel([
      Animated.timing(overlayOpacity, {
        toValue: 1,
        duration: 180,
        useNativeDriver: true,
      }),
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        bounciness: 6,
      }),
    ]).start();
  };

  const animateClose = (onDone?: () => void) => {
    const distance = sheetHeight || 400;
    Animated.parallel([
      Animated.timing(overlayOpacity, {
        toValue: 0,
        duration: 180,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: distance,
        duration: 220,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onDone && onDone();
    });
  };

  useEffect(() => {
    if (visible) {
      translateY.setValue(sheetHeight || 400);
      overlayOpacity.setValue(0);
      requestAnimationFrame(animateOpen);
    }
  }, [visible, sheetHeight]);

  // Load saved reminder data when component becomes visible
  useEffect(() => {
    if (visible) {
      isInitialized.current = false;
      loadSavedReminderData();
    } else {
      isInitialized.current = false;
    }
  }, [visible]);

  // Note: Scroll initialization is now handled in loadSavedReminderData

  // Animate tab indicator whenever timeOfDay changes
  useEffect(() => {
    if (!tabLayout) return;

    const toValue = timeOfDay === "morning" ? 0 : tabLayout.width / 2;

    Animated.timing(tabTranslate, {
      toValue,
      duration: 350,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [timeOfDay, tabLayout, tabTranslate]);

  // Load saved reminder data from local storage
  const loadSavedReminderData = async () => {
    try {
      const savedData = await getReminderData();
      if (savedData) {
        setReminderEnabled(savedData.enabled);
        setTimeOfDay(savedData.timeOfDay);
        setSelectedHour(savedData.hour);
        setSelectedMinute(savedData.minute);
        // Ensure period is always consistent with timeOfDay,
        // even if older saved data had a mismatched period.
        setPeriod(savedData.timeOfDay === "morning" ? "AM" : "PM");

        // Initialize scroll positions after data is loaded
        setTimeout(() => {
          const hourStartIndex = 12 + (savedData.hour - 1);
          const minuteStartIndex = 60 + savedData.minute;
          snapToItem(hourScrollRef, hourStartIndex, false);
          snapToItem(minuteScrollRef, minuteStartIndex, false);
          isInitialized.current = true;
        }, 150);
      } else {
        // Set default values if no saved data
        setReminderEnabled(true);
        setTimeOfDay("morning");
        setSelectedHour(7);
        setSelectedMinute(0);
        setPeriod("AM");

        // Initialize scroll positions with defaults
        setTimeout(() => {
          const hourStartIndex = 12 + (7 - 1);
          const minuteStartIndex = 60 + 0;
          snapToItem(hourScrollRef, hourStartIndex, false);
          snapToItem(minuteScrollRef, minuteStartIndex, false);
          isInitialized.current = true;
        }, 150);
      }
    } catch (error) {
      // Set default values on error
      setReminderEnabled(true);
      setTimeOfDay("morning");
      setSelectedHour(7);
      setSelectedMinute(0);
      setPeriod("AM");

      // Initialize scroll positions with defaults
      setTimeout(() => {
        const hourStartIndex = 12 + (7 - 1);
        const minuteStartIndex = 60 + 0;
        snapToItem(hourScrollRef, hourStartIndex, false);
        snapToItem(minuteScrollRef, minuteStartIndex, false);
        isInitialized.current = true;
      }, 150);
    }
  };

  const handleRequestClose = () => {
    animateClose(onClose);
  };

  const handleBackPress = () => {
    handleRequestClose();
  };

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (_, gestureState) => {
      return gestureState.dy > 5 && Math.abs(gestureState.dx) < 50;
    },
    onPanResponderMove: (_, gestureState) => {
      if (gestureState.dy > 0) {
        translateY.setValue(gestureState.dy);
      }
    },
    onPanResponderRelease: (_, gestureState) => {
      if (gestureState.dy > 100 || gestureState.vy > 0.5) {
        handleRequestClose();
      } else {
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      }
    },
  });

  const handleSave = async () => {
    const reminderData: ReminderData = {
      enabled: reminderEnabled,
      timeOfDay,
      hour: selectedHour,
      minute: selectedMinute,
      period,
    };

    try {
      await storeReminderData(reminderData);

      if (reminderEnabled) {
        try {
          await scheduleDailyReminder(
            selectedHour,
            selectedMinute,
            period,
            "It's time to start your session!",
            "Start Your Session"
          );
        } catch (notificationError) {
          console.error("Error scheduling notification:", notificationError);
        }
      }

      onSave?.(reminderData);
      handleRequestClose();
    } catch (error) {
      onSave?.(reminderData);
      handleRequestClose();
    }
  };

  const handleCancel = () => {
    handleRequestClose();
  };

  // Helper function to snap to item
  const snapToItem = (
    scrollViewRef: React.RefObject<ScrollView | null>,
    index: number,
    animated: boolean = true
  ) => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({
        y: index * ITEM_HEIGHT,
        animated,
      });
    }
  };

  // Handle hour selection (on tap)
  const handleHourChange = (hour: number) => {
    const hourStartIndex = 12 + (hour - 1);
    snapToItem(hourScrollRef, hourStartIndex);
    setSelectedHour(hour);
  };

  // Handle minute selection (on tap)
  const handleMinuteChange = (minute: number) => {
    const minuteStartIndex = 60 + minute;
    snapToItem(minuteScrollRef, minuteStartIndex);
    setSelectedMinute(minute);
  };

  // Handle scroll end for hours
  const handleHourScrollEnd = (event: any) => {
    if (!isInitialized.current) return;

    const y = event.nativeEvent.contentOffset.y;
    const index = Math.round(y / ITEM_HEIGHT);
    const hour = rawHours[index % 12];

    // Update state without triggering re-scroll
    setSelectedHour(hour);

    // Adjust scroll position to middle section for infinite scroll (without animation to prevent loop)
    const currentSection = Math.floor(index / 12);
    if (currentSection !== 1) {
      const newIndex = 12 + (hour - 1);
      setTimeout(() => {
        snapToItem(hourScrollRef, newIndex, false);
      }, 50);
    }
  };

  // Handle scroll end for minutes
  const handleMinuteScrollEnd = (event: any) => {
    if (!isInitialized.current) return;

    const y = event.nativeEvent.contentOffset.y;
    const index = Math.round(y / ITEM_HEIGHT);
    const minute = rawMinutes[index % 60];

    // Update state without triggering re-scroll
    setSelectedMinute(minute);

    // Adjust scroll position to middle section for infinite scroll (without animation to prevent loop)
    const currentSection = Math.floor(index / 60);
    if (currentSection !== 1) {
      const newIndex = 60 + minute;
      setTimeout(() => {
        snapToItem(minuteScrollRef, newIndex, false);
      }, 50);
    }
  };

  // Smooth tab change animation
  const handleTimeOfDayChange = (newTimeOfDay: "morning" | "evening") => {
    setTimeOfDay(newTimeOfDay);
    // Keep period (AM/PM) in sync with selected timeOfDay
    setPeriod(newTimeOfDay === "morning" ? "AM" : "PM");
  };

  const onTabsLayout = (e: LayoutChangeEvent) => {
    const layout = e.nativeEvent.layout;
    if (!tabLayout) {
      setTabLayout(layout);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={handleRequestClose}
    >
      <View style={{ flex: 1, backgroundColor: "transparent" }}>
        {/* Backdrop */}
        <Animated.View
          pointerEvents="none"
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            backgroundColor: "black",
            opacity: overlayOpacity.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 0.5],
            }),
          }}
        />

        {/* Touchable backdrop */}
        <TouchableOpacity
          activeOpacity={1}
          onPress={handleBackPress}
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            zIndex: 1,
          }}
        />

        {/* Modal Content */}
        <Animated.View
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1000,
            transform: [{ translateY }],
            backgroundColor: "#1D2738",
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            overflow: "hidden",
          }}
          onLayout={(e) => setSheetHeight(e.nativeEvent.layout.height)}
        >
          <View>
            {/* Handle and header */}
            <View
              style={{
                paddingVertical: 8,
                paddingBottom: 8,
              }}
              {...panResponder.panHandlers}
            >
              <View style={{ alignItems: "center", marginBottom: 10 }}>
                <View
                  style={{
                    height: 2,
                    width: 50,
                    borderRadius: 2,
                    backgroundColor: "#ABB0BC",
                  }}
                />
              </View>
              <Text
                style={{
                  color: "#DDE2E5",
                  textAlign: "center",
                  fontSize: 18,
                  fontFamily: "InterSemiBold",
                }}
              >
                Set Reminder
              </Text>

              <View
                style={{
                  width: "100%",
                  height: 0.6,
                  backgroundColor: "#515A66",
                  marginVertical: 12,
                }}
              />
            </View>

            {/* Content */}
            <View style={{ paddingHorizontal: 16, paddingBottom: 16 }}>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: "InterRegular",
                  color: "#E6E6E6",
                }}
              >
                We'll send you push notification daily to start your session.
              </Text>

              {/* Reminder Setting Toggle */}
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 28,
                  marginTop: 16,
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: "InterMedium",
                    color: "#8BAFCE",
                  }}
                >
                  Reminder Setting
                </Text>
                <Switch
                  value={reminderEnabled}
                  onValueChange={setReminderEnabled}
                  trackColor={{ false: "#374151", true: "#4C8BF5" }}
                  thumbColor={reminderEnabled ? "#FFFFFF" : "#9CA3AF"}
                />
              </View>

              {/* Time of Day Selection (with animated indicator) */}
              <View>
                <TabSwitch
                  onTabsLayout={onTabsLayout}
                  tabLayout={tabLayout as LayoutRectangle}
                  tabTranslate={tabTranslate}
                  timeOfDay={timeOfDay}
                  handleTimeOfDayChange={(timeOfDay: string) =>
                    handleTimeOfDayChange(timeOfDay as "morning" | "evening")
                  }
                />
              </View>

              {/* Time Picker (with border & selection top/bottom lines) */}
              <View style={{ marginBottom: 18 }}>
                <View
                  style={{
                    borderWidth: 1,
                    borderColor: "#FFFFFF",
                    borderRadius: 12,
                    padding: 12,
                    marginVertical: 16,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {/* Hours */}
                    <View style={{ flex: 1 }}>
                      <View
                        style={{ height: PICKER_HEIGHT, overflow: "hidden" }}
                      >
                        <ScrollView
                          ref={hourScrollRef}
                          showsVerticalScrollIndicator={false}
                          snapToInterval={ITEM_HEIGHT}
                          decelerationRate="fast"
                          onMomentumScrollEnd={handleHourScrollEnd}
                          contentContainerStyle={{
                            paddingVertical: ITEM_HEIGHT * 2,
                          }}
                        >
                          {hours.map((hour, index) => (
                            <TouchableOpacity
                              key={`hour-${index}`}
                              onPress={() => handleHourChange(hour)}
                              style={{
                                height: ITEM_HEIGHT,
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                            >
                              <Text
                                style={{
                                  fontSize: TEXT_SIZES.md,
                                  color:
                                    selectedHour === hour
                                      ? "#FFFFFF"
                                      : "#E6E6E6",
                                  fontWeight:
                                    selectedHour === hour ? "600" : "400",
                                  opacity: selectedHour === hour ? 1 : 0.6,
                                }}
                              >
                                {hour.toString().padStart(2, "0")}
                              </Text>
                            </TouchableOpacity>
                          ))}
                        </ScrollView>
                      </View>
                    </View>

                    {/* Separator for hours and minutes */}
                    <Text
                      style={{
                        color: "#E6EEF8",
                        fontSize: 24,
                        fontWeight: "700",
                        marginHorizontal: 8,
                      }}
                    >
                      :
                    </Text>

                    {/* Minutes */}
                    <View style={{ flex: 1 }}>
                      <View
                        style={{ height: PICKER_HEIGHT, overflow: "hidden" }}
                      >
                        <ScrollView
                          ref={minuteScrollRef}
                          showsVerticalScrollIndicator={false}
                          snapToInterval={ITEM_HEIGHT}
                          decelerationRate="fast"
                          onMomentumScrollEnd={handleMinuteScrollEnd}
                          contentContainerStyle={{
                            paddingVertical: ITEM_HEIGHT * 2,
                          }}
                        >
                          {minutes.map((minute, index) => (
                            <TouchableOpacity
                              key={`minute-${index}`}
                              onPress={() => handleMinuteChange(minute)}
                              style={{
                                height: ITEM_HEIGHT,
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                            >
                              <Text
                                style={{
                                  fontSize: TEXT_SIZES.md,
                                  color:
                                    selectedMinute === minute
                                      ? "#FFFFFF"
                                      : "#E6E6E6",
                                  fontWeight:
                                    selectedMinute === minute ? "600" : "400",
                                  opacity: selectedMinute === minute ? 1 : 0.6,
                                }}
                              >
                                {minute.toString().padStart(2, "0")}
                              </Text>
                            </TouchableOpacity>
                          ))}
                        </ScrollView>
                      </View>
                    </View>

                    {/* AM/PM */}
                    <View style={{ marginLeft: 12 }}>
                      <View
                        style={{
                          height: PICKER_HEIGHT,
                          justifyContent: "center",
                        }}
                      >
                        <View
                          style={{
                            paddingHorizontal: 12,
                            paddingVertical: 6,
                            borderRadius: 8,
                          }}
                        >
                          <Text
                            style={{
                              color: "#FFFFFF",
                              fontSize: TEXT_SIZES.md,
                              fontWeight: "500",
                            }}
                          >
                            {period}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>

                  {/* Separator overlay */}
                  <View
                    pointerEvents="none"
                    style={{
                      position: "absolute",
                      left: 0,
                      right: 0,
                      top: ITEM_HEIGHT * 2 + 12,
                      height: ITEM_HEIGHT,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <View
                      style={{
                        position: "absolute",
                        left: 12,
                        right: 12,
                        top: 0,
                        height: 1,
                        backgroundColor: "#515A66",
                      }}
                    />
                    <View
                      style={{
                        position: "absolute",
                        left: 12,
                        right: 12,
                        bottom: 0,
                        height: 1,
                        backgroundColor: "#515A66",
                      }}
                    />
                  </View>
                </View>

                {/* Action Buttons */}
                <View style={{ flexDirection: "row", gap: 12, marginTop: 4 }}>
                  <TouchableOpacity
                    onPress={handleCancel}
                    style={{
                      flex: 1,
                      backgroundColor: "#3A4049",
                      paddingVertical: 14,
                      borderRadius: 16,
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        color: "#FFFFFF",
                        fontSize: 16,
                        fontFamily: "InterMedium",
                      }}
                    >
                      Cancel
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={handleSave}
                    style={{
                      flex: 1,
                      backgroundColor: "#6189AD",
                      paddingVertical: 14,
                      borderRadius: 16,
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        color: "#FFFFFF",
                        fontSize: 16,
                        fontFamily: "InterMedium",
                      }}
                    >
                      Next
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

export default SetReminderBottomSheet;
