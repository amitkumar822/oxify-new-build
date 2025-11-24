import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Alert, Platform, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import AntDesign from "@expo/vector-icons/AntDesign";
const { useNavigation } = require("@react-navigation/native");
import { useUpdateProfile, useProfile } from "../../hooks/useProfile";
import { ProfileUpdateData } from "../../api/profile";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppStatusBar } from "../../helpers/AppStatusBar";
import { TEXT_SIZES } from "@/constants/textSizes";
import { Theme } from "@/constants";

const EditDateOfBirthScreen: React.FC = () => {
  const navigation: any = useNavigation();
  const [dob, setDob] = useState(new Date("1990-01-01"));
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);

  const updateProfileMutation = useUpdateProfile();
  const { data: profileData } = useProfile();

  // Set initial values from profile data
  useEffect(() => {
    const prof: any = (profileData as any)?.data?.data;
    if (prof?.date_of_birth) {
      const birthDate = new Date(prof.date_of_birth);
      if (!isNaN(birthDate.getTime())) {
        setDob(birthDate);
        setCurrentMonth(birthDate);
      }
    }
  }, [profileData]);

  const formatDate = (date: Date) => {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const month = months[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();

    // Add ordinal suffix to day
    const getOrdinalSuffix = (day: number) => {
      if (day > 3 && day < 21) return "th";
      switch (day % 10) {
        case 1:
          return "st";
        case 2:
          return "nd";
        case 3:
          return "rd";
        default:
          return "th";
      }
    };

    return `${month} ${day}${getOrdinalSuffix(day)}, ${year}`;
  };

  const navigateMonth = (direction: "prev" | "next") => {
    const newMonth = new Date(currentMonth);
    if (direction === "prev") {
      newMonth.setMonth(newMonth.getMonth() - 1);
    } else {
      newMonth.setMonth(newMonth.getMonth() + 1);
    }
    setCurrentMonth(newMonth);
  };

  const navigateYear = (direction: "prev" | "next") => {
    const newMonth = new Date(currentMonth);
    if (direction === "prev") {
      newMonth.setFullYear(newMonth.getFullYear() - 1);
    } else {
      newMonth.setFullYear(newMonth.getFullYear() + 1);
    }
    setCurrentMonth(newMonth);
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add all days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    // Fill remaining cells to make exactly 42 cells (6 rows × 7 columns)
    while (days.length < 42) {
      days.push(null);
    }

    return days;
  };

  const selectDate = (day: number | null) => {
    if (day) {
      const newDate = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth(),
        day
      );
      setDob(newDate);
    }
  };

  const handleSave = async () => {
    setIsLoading(true);

    // Format date to ISO string as required by API
    const dateString = dob.toISOString();

    const profileData: ProfileUpdateData = {
      date_of_birth: dateString,
    };

    try {
      const result = await updateProfileMutation.mutateAsync(profileData);
      if (result.success) {
        Alert.alert("Success", "Date of birth updated successfully", [
          { text: "OK", onPress: () => navigation.goBack() },
        ]);
      }
    } catch (error) {
      console.error("Failed to update date of birth:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const days = getDaysInMonth(currentMonth);
  const calendarRows = [];
  for (let rowIndex = 0; rowIndex < 6; rowIndex++) {
    const rowDays = days.slice(rowIndex * 7, rowIndex * 7 + 7);
    const hasAnyDay = rowDays.some((day) => day !== null);
    if (!hasAnyDay) {
      break;
    }
    calendarRows.push(rowDays);
  }
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

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
            <TouchableOpacity onPress={() => navigation.goBack()} className="">
              <AntDesign name="left" size={24} color="white" />
            </TouchableOpacity>
            <Text
              className="text-white text-center flex-1 mr-6"
              style={{
                fontFamily: "Inter",
                fontSize: TEXT_SIZES.lg,
                fontWeight: "600",
              }}
            >
              Edit Date of Birth
            </Text>
          </View>

          {/* Content Area - Takes available space */}
          <View className="flex-1">
            {/* Current Date Display */}
            <View style={{backgroundColor: "#3A4049"}} className="rounded-t-[12px] p-4 border-b border-[#333333]">
              <View className="flex-row justify-between items-center">
                <Text
                  className="text-[#8BAFCE] text-base font-medium"
                  style={{ fontFamily: "Inter", fontSize: 14 }}
                >
                  Date of Birth
                </Text>
                <Text className="text-[#DDE2E5] text-base font-medium">
                  {formatDate(dob)}
                </Text>
              </View>
            </View>

            {/* Calendar Component */}
            <View style={{ backgroundColor: "#3A4049",borderBottomLeftRadius:12,borderBottomRightRadius:12 }} className="p-6">
              {/* Month and Year Navigation */}
              <View className="flex-row justify-between items-center mb-8 rounded-b-[12px]">
                {/* Month Navigation */}
                <View className="flex-row items-center">
                  <TouchableOpacity
                    onPress={() => navigateMonth("prev")}
                    className="mr-3"
                  >
                    <AntDesign name="left" size={16} color="#fff" />
                  </TouchableOpacity>
                  <Text className="text-white text-lg font-medium mr-3">
                    {monthNames[currentMonth.getMonth()]}
                  </Text>
                  <TouchableOpacity onPress={() => navigateMonth("next")}>
                    <AntDesign name="right" size={16} color="#fff" />
                  </TouchableOpacity>
                </View>

                {/* Year Navigation */}
                <View className="flex-row items-center">
                  <TouchableOpacity
                    onPress={() => navigateYear("prev")}
                    className="mr-3"
                  >
                    <AntDesign name="left" size={16} color="#fff" />
                  </TouchableOpacity>
                  <Text className="text-white text-lg font-medium mr-3">
                    {currentMonth.getFullYear()}
                  </Text>
                  <TouchableOpacity onPress={() => navigateYear("next")}>
                    <AntDesign
                      name="right"
                      size={16}
                      color="#fff"
                      style={{ fontFamily: "Inter" }}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Days of the Week Header (Table Header Row) */}
              <View className="flex-row justify-between mb-4 mt-1">
                {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
                  <Text
                    key={index}
                    className="text-[#89a8c2]  text-center w-[40px]"
                    style={{
                      fontFamily: "Inter",
                      fontSize: 18,
                      fontWeight: "700",
                    }}
                  >
                    {day}
                  </Text>
                ))}
              </View>

              {/* Calendar Grid (Fixed 6x7 Grid) */}
              {calendarRows.map((rowDays, rowIndex) => (
                <View
                  key={`row-${rowIndex}`}
                  className="flex-row justify-between"
                  style={{ marginBottom: rowIndex < calendarRows.length - 1 ? 10 : 0 }}
                >
                  {rowDays.map((day, colIndex) => (
                    <TouchableOpacity
                      key={colIndex}
                      onPress={() => selectDate(day)}
                      className={`w-[36px] h-[36px] mt-3 items-center justify-center rounded-full ${
                        day === dob.getDate() &&
                        currentMonth.getMonth() === dob.getMonth() &&
                        currentMonth.getFullYear() === dob.getFullYear()
                          ? "bg-[#6189AD]"
                          : ""
                      }`}
                      disabled={!day}
                    >
                      <Text
                        className={` ${
                          day === dob.getDate() &&
                          currentMonth.getMonth() === dob.getMonth() &&
                          currentMonth.getFullYear() === dob.getFullYear()
                            ? "text-white"
                            : day
                              ? "text-[#DDE2E5]"
                              : "text-transparent"
                        }`}
                        style={{
                          fontFamily: "Inter",
                          fontSize: 18,
                          fontWeight: "400",
                        }}
                      >
                        {day || ""}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              ))}
            </View>
          </View>

          {/* Update Button - Positioned at bottom */}
          <View className="pb-4">
            <TouchableOpacity
              className={`rounded-[36px]  items-center h-[54px]${
                isLoading ? "opacity-50" : "opacity-100"
              }`}
              style={{ backgroundColor: "#6189AD",paddingVertical: 16 }}
              onPress={handleSave}
              disabled={isLoading}
            >
              <Text className="text-white font-semibold text-base" style={{ fontSize: 16 }}>
                {isLoading ? "Updating..." : "Update"}
              </Text>
            </TouchableOpacity>
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

export default EditDateOfBirthScreen;
