import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import AntDesign from "@expo/vector-icons/AntDesign";
const { useNavigation } = require("@react-navigation/native");
import { useUpdateProfile, useProfile } from "../../hooks/useProfile";
import { ProfileUpdateData } from "../../api/profile";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppStatusBar } from "../../helpers/AppStatusBar";

const EditNameScreen: React.FC = () => {
  const navigation: any = useNavigation();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFirstNameFocused, setIsFirstNameFocused] = useState(false);
  const [isLastNameFocused, setIsLastNameFocused] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  const updateProfileMutation = useUpdateProfile();
  const { data: profileData }: { data: any } = useProfile();

  // Set initial values from profile data
  useEffect(() => {
    if (profileData?.data?.data) {
      const data = profileData.data.data as any;

      setFirstName(data.first_name || "");
      setLastName(data.last_name || "");
    }
  }, [profileData]);

  // Handle keyboard show/hide
  useEffect(() => {
    const keyboardWillShowListener = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
      (e) => {
        setKeyboardHeight(e.endCoordinates.height);
      }
    );
    const keyboardWillHideListener = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
      () => {
        setKeyboardHeight(0);
      }
    );

    return () => {
      keyboardWillShowListener.remove();
      keyboardWillHideListener.remove();
    };
  }, []);

  const handleSave = async () => {
    if (!firstName.trim() || !lastName.trim()) {
      Alert.alert("Error", "Please fill in both first name and last name");
      return;
    }

    setIsLoading(true);

    const profileData: ProfileUpdateData = {
      first_name: firstName.trim(),
      last_name: lastName.trim(),
    };

    try {
      const result = await updateProfileMutation.mutateAsync(profileData);
      if (result.success) {
        Alert.alert("Success", "Name updated successfully", [
          { text: "OK", onPress: () => navigation.goBack() },
        ]);
      }
    } catch (error) {
      // console.error("Failed to update name:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={["#243551", "#171D27", "#14181B"]}
      style={styles.gradient}
    >
      <SafeAreaView className="flex-1">
        <AppStatusBar barStyle="light-content" />

        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            className="flex-1"
            keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
          >
            <View
              className="flex-1 px-4 py-4"
              style={{
                paddingBottom:
                  Platform.OS === "ios" && keyboardHeight > 0
                    ? 10
                    : keyboardHeight > 0
                      ? keyboardHeight + 10
                      : 120,
              }}
            >
              {/* Header */}
              <View className="flex-row items-center mb-6">
                <TouchableOpacity
                  onPress={() => navigation.goBack()}
                  className=""
                >
                  <AntDesign name="left" size={22} color="white" />
                </TouchableOpacity>
                <Text
                  className="text-white  text-center flex-1 mr-6"
                  style={{
                    fontFamily: "InterSemiBold",
                    fontSize: 18,
                  }}
                >
                  Edit Name
                </Text>
              </View>

              {/* Form */}
              <View className="flex-1">
                <Text
                  className=" mb-2"
                  style={{
                    fontFamily: "InterMedium",
                    fontSize: 16,
                    color: "#DDE2E5",
                  }}
                >
                  Full name
                </Text>

                <View className="mb-[10px]">
                  <View
                    className="bg-white rounded-[14px] px-4 mb-2"
                    style={{
                      borderWidth: 2,
                      borderColor: isFirstNameFocused
                        ? "#8BAFCE"
                        : "transparent",
                    }}
                  >
                    <TextInput
                      value={firstName}
                      onChangeText={setFirstName}
                      onFocus={() => setIsFirstNameFocused(true)}
                      onBlur={() => setIsFirstNameFocused(false)}
                      style={{
                        fontSize: 16,
                        paddingVertical: 14,
                        fontFamily: "InterMedium",
                      }}
                      placeholder="First Name"
                      placeholderTextColor="#9CA3AF"
                    />
                  </View>
                </View>

                <>
                  <View
                    className="bg-white rounded-[14px] px-4"
                    style={{
                      borderWidth: 2,
                      borderColor: isLastNameFocused
                        ? "#8BAFCE"
                        : "transparent",
                    }}
                  >
                    <TextInput
                      value={lastName}
                      onChangeText={setLastName}
                      onFocus={() => setIsLastNameFocused(true)}
                      onBlur={() => setIsLastNameFocused(false)}
                      style={{
                        fontSize: 16,
                        paddingVertical: 14,
                        fontFamily: "InterMedium",
                      }}
                      placeholder="Last Name"
                      placeholderTextColor="#9CA3AF"
                    />
                  </View>
                </>
              </View>

              {/* Update Button - Positioned at bottom */}
              <TouchableOpacity
                className={`rounded-[36px]  items-center ${
                  isLoading ? "opacity-50" : ""
                }`}
                style={{ backgroundColor: "#6189AD", paddingVertical: 14 }}
                onPress={handleSave}
                disabled={isLoading}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: "InterSemiBold",
                    color: "#DDE2E5",
                  }}
                >
                  {isLoading ? "Updating..." : "Update"}
                </Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
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
});

export default EditNameScreen;
