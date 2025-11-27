import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Platform,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SCREEN_NAMES, Theme } from "../../constants";
import { TEXT_SIZES } from "@/constants/textSizes";
import { Entypo, Foundation, Ionicons } from "@expo/vector-icons";
import { RFValue } from "react-native-responsive-fontsize";
import { SafeAreaView } from "react-native-safe-area-context";
import { chamberApi } from "@/api/chamber";
import { getChamberId } from "@/utils/tokenManager";
import { AppStatusBar } from "@/helpers/AppStatusBar";
// @ts-ignore
import { useNavigation, useRoute } from "@react-navigation/native";
import SessionSlider from "@/components/content/sessionSlider";
import DropdownSelect from "@/components/common/DropdownSelect";
import SwipeNumberInput from "@/components/common/SwipeNumberInput";
import ShadowHeader from "@/components/common/ShadowHeader";

interface RouteParams {
  pressure: string;
  duration: string;
  preset?: {
    protocol?: Protocol;
    ataLevel?: string; // numeric string e.g. "1.5"
    duration?: { minutes: number; seconds: number };
  };
}

interface Protocol {
  protocol: number;
  name: string;
}

interface AtaOption {
  id: number;
  level: string;
}

interface MoodConfig {
  icon: string;
  iconType: "MaterialCommunityIcons" | "Entypo";
  label: string;
  color: string;
}

const SessionSetupScreen: React.FC = () => {
  const navigation: any = useNavigation();
  const route: any = useRoute();
  const {
    pressure = "1.5 ATA",
    duration = "6 min",
    preset,
  } = (route.params || {}) as Partial<RouteParams>;

  const [ataLevel, setAtaLevel] = useState("");
  const [selectedAtaId, setSelectedAtaId] = useState<number | null>(null);
  const [minutes, setMinutes] = useState("");
  const [seconds, setSeconds] = useState("");
  const [moodIndex, setMoodIndex] = useState(0);
  const [selectedProtocol, setSelectedProtocol] = useState<Protocol | null>(
    null
  );
  const [notes, setNotes] = useState("");
  const [durationError, setDurationError] = useState<string | null>(null);
  const clampTime = (num: number) => Math.max(0, Math.min(59, num));
  const formatTime = (num: number) => String(clampTime(num)).padStart(2, "0");
  const sanitizeTimeInput = (value: string) =>
    value.replace(/\D/g, "").slice(-2);

  const validateDuration = (minutesValue: string, secondsValue: string) => {
    const parseValue = (value: string) => {
      if (value === "") return null;
      const numeric = parseInt(value, 10);
      return Number.isNaN(numeric) ? null : numeric;
    };

    const minutesNum = parseValue(minutesValue);
    const secondsNum = parseValue(secondsValue);

    if (
      (minutesNum !== null && (minutesNum < 0 || minutesNum > 59)) ||
      (secondsNum !== null && (secondsNum < 0 || secondsNum > 59))
    ) {
      setDurationError("Invalid time (must be between 00 and 59)");
      return false;
    }

    setDurationError(null);
    return true;
  };

  const handleMinutesInputChange = (value: string) => {
    const digits = sanitizeTimeInput(value);
    setMinutes(digits);
    validateDuration(digits, seconds);
  };

  const handleSecondsInputChange = (value: string) => {
    const digits = sanitizeTimeInput(value);
    setSeconds(digits);
    validateDuration(minutes, digits);
  };

  // Apply preset data for quick-start from ProtocolsHub
  useEffect(() => {
    if (preset) {
      if (preset.protocol) {
        setSelectedProtocol(preset.protocol);
      }
      if (typeof preset.ataLevel === "string" && preset.ataLevel.length > 0) {
        setAtaLevel(preset.ataLevel);
        setSelectedAtaId(null);
      }
      if (preset.duration) {
        const mm = Number(preset.duration.minutes) || 0;
        const ss = Number(preset.duration.seconds) || 0;
        setMinutes(formatTime(mm));
        setSeconds(formatTime(ss));
        validateDuration(formatTime(mm), formatTime(ss));
      }
    }
  }, []);

  // ATA levels from 1 to 5
  const [ataOptions, setAtaOptions] = useState<AtaOption[]>([]);

  // Protocol options from API
  const [apiProtocols, setApiProtocols] = useState<Protocol[]>([]);

  // Recent protocols for quick selection
  const recentProtocols: Protocol[] = [
    { protocol: 1, name: "Lorem Ipsum" },
    { protocol: 2, name: "Lorem Ipsum" },
    { protocol: 3, name: "Lorem Ipsum" },
    { protocol: 4, name: "Lorem Ipsum" },
    { protocol: 5, name: "Lorem Ipsum" },
    { protocol: 6, name: "Lorem Ipsum" },
  ];

  // Mood configuration with scalable structure
  const moodConfig: MoodConfig[] = [
    {
      icon: "emoticon-angry-outline",
      iconType: "MaterialCommunityIcons",
      label: "Frustated",
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

  // Fetch chamber-based ATA levels and protocols
  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const chamberId = await getChamberId();
        console.log("chamberId", chamberId);
        if (!chamberId) return;

        const response = await chamberApi.getProtocolsAtaByChamber(chamberId);
        if (!response.success) return;

        const payload: any = response.data;
        const first = Array.isArray(payload?.data) ? payload.data[0] : null;
        if (!first) return;

        const ataList: AtaOption[] = Array.isArray(first.max_ata_level)
          ? first.max_ata_level.map((m: any) => ({
              id: m.id,
              level: String(m.level),
            }))
          : [];
        const protocolsList: Protocol[] = Array.isArray(first.protocol)
          ? first.protocol.map((p: any) => ({
              protocol: p.id,
              name: String(p.name),
            }))
          : [];

        if (!isMounted) return;
        setAtaOptions(ataList);
        setApiProtocols(protocolsList);

        // Don't auto-select ATA level - let user choose
      } catch (e) {
        // silently ignore
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  const getMinutesNumber = () => {
    const numeric = parseInt(minutes || "0", 10);
    return clampTime(Number.isNaN(numeric) ? 0 : numeric);
  };

  const getSecondsNumber = () => {
    const numeric = parseInt(seconds || "0", 10);
    return clampTime(Number.isNaN(numeric) ? 0 : numeric);
  };

  const handleStartSession = () => {
    if (!selectedProtocol || !ataLevel) {
      // Show error or alert
      return;
    }
    if (!validateDuration(minutes, seconds)) {
      return;
    }

    const sessionData = {
      ataLevel: parseFloat(ataLevel),
      ataLevelId: selectedAtaId,
      durationMinutes: getMinutesNumber(),
      durationSeconds: getSecondsNumber(),
      moodBefore: moodConfig[moodIndex]?.label || "Neutral",
      protocol: selectedProtocol,
      notes: notes,
    };

    navigation.navigate(SCREEN_NAMES.SESSION_READY, { sessionData });
  };

  return (
    <LinearGradient
      colors={["#243551", "#242D3C", "#14181B"]}
      style={styles.gradient}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <AppStatusBar barStyle="light-content" />
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View className="flex-1 pt-3">
            {/* Header */}
            <ShadowHeader
              title="Session Tracking"
              onPress={() => navigation.navigate("TabNavigator")}
            />

            {/* <ScrollView
            showsVerticalScrollIndicator={false}
            className="flex-1"
          > */}
            <View style={{ flex: 1 }}>
              <View className="mb-4 px-4">
                <DropdownSelect
                  label="Choose your ATA Level"
                  value={ataLevel}
                  placeholder="Select ATA Level"
                  options={ataOptions.map((opt) => ({
                    label: opt.level,
                    value: opt.level,
                    meta: opt,
                  }))}
                  onSelect={(option) => {
                    setAtaLevel(String(option.value));
                    setSelectedAtaId(option.meta?.id ?? null);
                  }}
                />
              </View>

              <View className="mb-6 px-4">
                <Text
                  className="mb-2.5"
                  style={{
                    color: Theme.text.neutral,
                    fontSize: 16,
                    fontFamily: "InterMedium",
                  }}
                >
                  Duration
                </Text>
                <View className="flex-row items-center justify-between">
                  <SwipeNumberInput
                    label="Minutes"
                    value={minutes}
                    onIncrement={() => {
                      const newValue = Math.min(59, getMinutesNumber() + 1);
                      const formatted = formatTime(newValue);
                      setMinutes(formatted);
                      validateDuration(formatted, seconds);
                    }}
                    onDecrement={() => {
                      const newValue = Math.max(0, getMinutesNumber() - 1);
                      const formatted = formatTime(newValue);
                      setMinutes(formatted);
                      validateDuration(formatted, seconds);
                    }}
                    onChangeValue={handleMinutesInputChange}
                  />
                  <Text
                    style={{
                      fontSize: TEXT_SIZES.md,
                      color: Theme.text.neutral,
                      paddingHorizontal: 8,
                    }}
                  >
                    :
                  </Text>
                  <SwipeNumberInput
                    label="Seconds"
                    value={seconds}
                    onIncrement={() => {
                      const newValue = Math.min(59, getSecondsNumber() + 1);
                      const formatted = formatTime(newValue);
                      setSeconds(formatted);
                      validateDuration(minutes, formatted);
                    }}
                    onDecrement={() => {
                      const newValue = Math.max(0, getSecondsNumber() - 1);
                      const formatted = formatTime(newValue);
                      setSeconds(formatted);
                      validateDuration(minutes, formatted);
                    }}
                    onChangeValue={handleSecondsInputChange}
                  />
                </View>
                {durationError && (
                  <Text
                    style={{
                      color: "#f87171",
                      fontSize: TEXT_SIZES.sm,
                      marginBottom: 6,
                    }}
                  >
                    {durationError}
                  </Text>
                )}
              </View>

              <SessionSlider
                initialIndex={moodIndex}
                onValueChange={(index) => setMoodIndex(index)}
              />

              {/* Purpose of Session */}
              <View className="mb-6 px-4 pt-3">
                <DropdownSelect
                  label="Purpose of Session"
                  value={selectedProtocol?.name}
                  placeholder="Select from saved protocols"
                  options={apiProtocols.map((protocol) => ({
                    label: protocol.name,
                    value: protocol.protocol,
                    meta: protocol,
                  }))}
                  onSelect={(option) => {
                    setSelectedProtocol(option.meta ?? null);
                  }}
                />
              </View>

              {/* Notes */}
              <View className="mb-6 px-4">
                <Text
                  className="text-[#DDE2E5] mb-2"
                  style={{
                    fontSize: 16,
                    fontFamily: "InterMedium",
                  }}
                >
                  Notes
                </Text>
                <TextInput
                  className="bg-white text-gray-900"
                  placeholder="Add session description (optional)"
                  placeholderTextColor="#797979"
                  multiline
                  textAlignVertical="top"
                  value={notes}
                  onChangeText={setNotes}
                  style={{
                    borderWidth: 1,
                    borderColor: "#8BAFCE",
                    borderRadius: 16,
                    fontSize: 14,
                    fontFamily: "InterRegular",
                    paddingVertical: RFValue(8),
                    paddingHorizontal: RFValue(12),
                    minHeight: RFValue(75),
                    maxHeight: RFValue(95),
                  }}
                />
              </View>
            </View>
            {/* </ScrollView> */}

            <View
              style={{
                // paddingBottom: Platform.OS === "ios" ? 20 : 16,
                paddingTop: 8,
                paddingHorizontal: 16,
                // backgroundColor: "#14181B",
              }}
            >
              <TouchableOpacity
                className={`rounded-full py-4 px-6 flex-row gap-4 items-center justify-center ${
                  selectedProtocol &&
                  ataLevel &&
                  (getMinutesNumber() > 0 || getSecondsNumber() > 0) &&
                  !durationError
                    ? "bg-blue-500"
                    : "bg-[#6189AD]"
                }`}
                onPress={handleStartSession}
                disabled={
                  !selectedProtocol ||
                  !ataLevel ||
                  (getMinutesNumber() === 0 && getSecondsNumber() === 0) ||
                  Boolean(durationError)
                }
              >
                <Foundation name="play" size={RFValue(24)} color="#DDE2E5" />
                <Text
                  className="text-[#DDE2E5]"
                  style={{
                    fontSize: TEXT_SIZES.md,
                    fontWeight: 600,
                  }}
                >
                  Start Session
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  hiddenInput: { position: "absolute",
    opacity: 0,
    height: 0,
    width: 0,
  },
});

export default SessionSetupScreen;
