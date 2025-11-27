import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Keyboard,
  TouchableWithoutFeedback,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
const { useNavigation, useRoute } = require("@react-navigation/native");
import { Theme } from "../../constants";
import { RFValue } from "react-native-responsive-fontsize";
import { TEXT_SIZES } from "../../constants/textSizes";
import { FontAwesome5 } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { getChamberId } from "@/utils/tokenManager";
import { sessionApi, CreateSessionData } from "@/api/session";
import { showToast } from "@/config";
import { AppStatusBar } from "@/helpers/AppStatusBar";
import SessionSlider from "@/components/content/sessionSlider";
import ShadowHeader from "@/components/common/ShadowHeader";
import { SessionAlertModal } from "./helper";

interface RouteParams {
  sessionData: {
    ataLevel: number;
    durationMinutes: number;
    durationSeconds: number;
    moodBefore: string;
    protocol: {
      protocol: number;
      name: string;
    };
    notes: string;
  };
}

interface MoodConfig {
  icon: string;
  iconType: "MaterialCommunityIcons" | "Entypo";
  label: string;
  color: string;
}

const SessionCompletedScreen: React.FC = () => {
  const navigation: any = useNavigation();
  const route = useRoute();
  const { sessionData } = route.params as RouteParams;

  const [moodIndex, setMoodIndex] = useState(2);
  const [notes, setNotes] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Mood configuration with scalable structure - EXACT same as SessionSetupScreen
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

  const handleEndSession = async () => {
    try {
      const chamberId = await getChamberId();
      if (!chamberId) {
        showToast.error("Chamber ID not found");
        return;
      }

      const postMood = moodConfig[moodIndex]?.label || "Neutral";

      // Build HH:mm:ss from selected minutes/seconds
      const totalMinutes = Number(sessionData.durationMinutes) || 0;
      const secs = Number(sessionData.durationSeconds) || 0;
      const hours = Math.floor(totalMinutes / 60);
      const minutesRemainder = totalMinutes % 60;
      const durationString = `${hours.toString().padStart(2, "0")}:${minutesRemainder
        .toString()
        .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;

      const payload: CreateSessionData = {
        chamber: chamberId,
        protocol: sessionData.protocol.protocol,
        ata_level: (sessionData as any).ataLevelId ?? sessionData.ataLevel,
        duration_minutes: durationString,
        status: sessionData.moodBefore,
        description: notes || "",
        session_status: postMood,
        notes: notes || "",
        completed: "True",
      };

      const res = await sessionApi.createSession(payload);
      if (res?.success) {
        setShowSuccessModal(true);
      } else {
        showToast.error(res?.error || "Failed to save session");
      }
    } catch (e) {
      showToast.error("Failed to save session");
    }
  };

  return (
    <LinearGradient
      colors={["#243551", "#242D3C", "#14181B"]}
      style={styles.gradient}
    >
      <AppStatusBar barStyle="light-content" />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <SafeAreaView style={{ flex: 1 }}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
            keyboardVerticalOffset={Platform.OS === "ios" ? 10 : 0}
            enabled={true}
          >
            <View className="flex-1 pt-3">
              {/* Header */}
              <ShadowHeader
                title="Session Tracking"
                onPress={() => navigation.goBack()}
              />

              {/* How do you feel now? Section */}
              <View className="flex-1">
                <SessionSlider
                  initialIndex={moodIndex}
                  onValueChange={setMoodIndex}
                  title="How do you feel now?"
                />

                {/* Notes Section */}
                <View className="mb-8 px-4 mt-6">
                  <Text
                    className="mb-4"
                    style={{
                      color: Theme.text.neutral,
                      fontSize: 16,
                      fontFamily: "InterMedium",
                    }}
                  >
                    Notes (optional)
                  </Text>
                  <TextInput
                    className="bg-white border-2 border-[#8BAFCE] p-4 text-gray-900"
                    placeholder="Add notes"
                    placeholderTextColor="#9CA3AF"
                    multiline
                    textAlignVertical="top"
                    value={notes}
                    onChangeText={setNotes}
                    style={{
                      minHeight: 100,
                      maxHeight: 130,
                      fontSize: TEXT_SIZES.sm,
                      borderRadius: 14,
                    }}
                  />
                </View>
              </View>
            </View>
            {/* End Session Button */}
            <View className="px-4">
              <TouchableOpacity
                className="py-4 px-6 flex-row items-center justify-center shadow-lg"
                onPress={handleEndSession}
                activeOpacity={0.8}
                style={{
                  backgroundColor: "#57292C",
                  borderRadius: 100,
                }}
              >
                <FontAwesome5 name="flag-checkered" size={20} color="#EB4335" />
                <Text
                  className="ml-3"
                  style={{
                    fontSize: 16,
                    fontFamily: "InterSemiBold",
                    color: "#EB4335",
                  }}
                >
                  End Session
                </Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </TouchableWithoutFeedback>

      <SessionAlertModal
        visible={showSuccessModal}
        onRequestClose={() => setShowSuccessModal(false)}
        onConfirm={() => {
          setShowSuccessModal(false);
          navigation.replace("TabNavigator");
        }}
      />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
});

export default SessionCompletedScreen;
