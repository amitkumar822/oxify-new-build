import React, { useState } from "react";
import { View, Text, Switch, TouchableOpacity, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { AntDesign } from "@expo/vector-icons";
const { useNavigation } = require("@react-navigation/native");
import { SafeAreaView } from "react-native-safe-area-context";
import { AppStatusBar } from "../../helpers/AppStatusBar";
import { TEXT_SIZES } from "@/constants/textSizes";
import { Theme } from "@/constants";

const SettingsEmailPreferencesScreen: React.FC = () => {
  const navigation: any = useNavigation();
  const [oxifyUpdates, setOxifyUpdates] = useState(true);

  return (
    <LinearGradient
      colors={[
        Theme.backgroundGradient.start,
        Theme.backgroundGradient.middle,
        Theme.backgroundGradient.end,
      ]}
      start={{ x: 0.5, y: 1 }}
      end={{ x: 0.5, y: 0 }}
      style={styles.gradient}
    >
      <SafeAreaView className="flex-1">
        <AppStatusBar barStyle="light-content" />
        <View className="flex-1 px-4 py-4">
          {/* Header */}
          <View className="flex-row items-center mb-6">
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <AntDesign name="left" size={24} color="white" />
            </TouchableOpacity>
            <Text
              className="text-white text-center flex-1 mr-6"
              style={{ fontFamily: "Inter", fontSize: TEXT_SIZES.md }}
            >
              Email prefrences
            </Text>
          </View>

          <View className="flex-1">
            <View
              className="py-1 sm:py-3 px-5 rounded-[12px] mb-4"
              style={{ backgroundColor: "#3A4049" }}
            >
              <View className="flex-row justify-between items-center">
                <Text
                  className="text-white"
                  style={{ fontSize: TEXT_SIZES.md }}
                >
                  Oxify Updates
                </Text>
                <Switch
                  value={oxifyUpdates}
                  onValueChange={setOxifyUpdates}
                  trackColor={{ false: "#4B5563", true: "#6189AD" }}
                  thumbColor={oxifyUpdates ? "#FFFFFF" : "#9CA3AF"}
                />
              </View>
            </View>

            <View className="px-1">
              <Text
                className="text-gray-400"
                style={{ fontSize: TEXT_SIZES.sm }}
              >
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat.
              </Text>
            </View>
          </View>
        </View>
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
});

export default SettingsEmailPreferencesScreen;
