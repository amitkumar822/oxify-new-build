import React, { useEffect, useMemo, useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import AntDesign from "@expo/vector-icons/AntDesign";
const { useNavigation, useFocusEffect } = require("@react-navigation/native");
import { SafeAreaView } from "react-native-safe-area-context";
import { AppStatusBar } from "../../helpers/AppStatusBar";
import { TEXT_SIZES } from "@/constants/textSizes";
import { Theme } from "@/constants";
import { BarChart, LineChart } from "react-native-gifted-charts";
import { LogBox } from "react-native";
import { Dimensions } from "react-native";
import {
  useFilteredSessions,
  useCurrentMonthSessionDates,
  useUserAtaHistory,
  useUserDailyWeeklySessions,
} from "@/hooks/useSession";
import {
  useUserSessionProtocols,
  useUserSessionAtaLevels,
} from "@/hooks/useProtocol";
import { RFValue } from "react-native-responsive-fontsize";
import { screenWidth } from "@/constants/comman";
import { useAuth } from "../../contexts/AuthContext";
import ShadowHeader from "@/components/common/ShadowHeader";
import { GradientLine } from "@/components/common/GradientLine";

// Dropdown Component
interface DropdownProps {
  visible: boolean;
  onClose: () => void;
  options: Array<{ id: number | string; name: string }>;
  onSelect: (option: { id: number | string; name: string }) => void;
  selectedValue: string;
  title: string;
  topOffset?: number; // pixel offset from anchor top
  width?: number; // match anchor width
  headerText?: string; // optional header like the field itself
}

const Dropdown: React.FC<DropdownProps> = ({
  visible,
  onClose,
  options,
  onSelect,
  selectedValue,
  title,
  topOffset = 0,
  width,
  headerText,
}) => {
  if (!visible) return null;

  return (
    <View
      style={{
        position: "absolute",
        left: 0,
        top: 34,
        width: width || undefined,
        zIndex: 1000,
        elevation: 1000,
      }}
    >
      <View
        className="bg-[#374862] overflow-hidden shadow-lg"
        style={{
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
          borderBottomLeftRadius: 16,
          borderBottomRightRadius: 16,
        }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{ maxHeight: 200 }}
        >
          {headerText ? (
            <View className="px-3 py-2 border-b border-white/10 flex-row items-center">
              <Text
                className={`text-white ${title === "Protocols" ? "text-left" : "text-center"}`}
                style={{ fontSize: TEXT_SIZES.sm, flex: 1 }}
              >
                {headerText}
              </Text>
              <AntDesign name="up" size={12} color="white" />
            </View>
          ) : null}
          {options
            .filter(
              (o) =>
                o.name !== selectedValue &&
                (!headerText || o.name !== headerText)
            )
            .map((option) => (
              <TouchableOpacity
                key={option.id}
                className="px-3 py-2 border-b border-white/10 last:border-b-0"
                onPress={() => {
                  onSelect(option);
                  onClose();
                }}
              >
                <Text
                  className={`text-white ${title === "Protocols" ? "text-left" : "text-center"}`}
                  style={{ fontSize: TEXT_SIZES.sm }}
                >
                  {option.name}
                </Text>
              </TouchableOpacity>
            ))}
        </ScrollView>
      </View>
    </View>
  );
};

const StatisticsDashboardScreen: React.FC = () => {
  const { setTabBackgroundColor } = useAuth();

  // set tab background color when screen focuses
  useFocusEffect(
    useCallback(() => {
      // Set color when screen focuses
      setTabBackgroundColor("#14181B");
    }, [setTabBackgroundColor])
  );

  const navigation: any = useNavigation();
  // Define months array first
  const months = [
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
  // Get current date
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth(); // 0-11
  const currentYear = currentDate.getFullYear();
  const currentDay = currentDate.getDate();
  const [selectedDate, setSelectedDate] = useState(currentDay);
  const [selectedMonth, setSelectedMonth] = useState(months[currentMonth]);
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedDateString, setSelectedDateString] = useState<string | null>(
    null
  );
  // (removed debug logs)
  const [showProtocolDropdown, setShowProtocolDropdown] = useState(false);
  const [showAtaDropdown, setShowAtaDropdown] = useState(false);
  const [showDurationDropdown, setShowDurationDropdown] = useState(false);
  const [selectedProtocol, setSelectedProtocol] = useState("All Protocols");
  const [selectedProtocolId, setSelectedProtocolId] = useState<
    number | undefined
  >(undefined);
  const [selectedAta, setSelectedAta] = useState("All ATA Levels");
  const [selectedAtaId, setSelectedAtaId] = useState<number | undefined>(
    undefined
  );
  const [selectedDuration, setSelectedDuration] = useState("All Durations");
  const [timeView, setTimeView] = useState("Week");
  const [protocolWidth, setProtocolWidth] = useState<number | undefined>(
    undefined
  );
  const [ataWidth, setAtaWidth] = useState<number | undefined>(undefined);
  const [durationWidth, setDurationWidth] = useState<number | undefined>(
    undefined
  );
  LogBox.ignoreLogs([
    "setLayoutAnimationEnabledExperimental is currently a no-op",
  ]);
  // Get daily/weekly sessions data from API
  const { data: dailyWeeklySessionsResponse } = useUserDailyWeeklySessions();
  // Process sessions data for chart based on timeView toggle
  const { sessionsData, sessionsMaxValue, sessionsYAxisLabels } =
    useMemo(() => {
      const payload: any = dailyWeeklySessionsResponse as any;
      const data = payload?.data?.data;
      if (!data) {
        return {
          sessionsData: [0, 0, 0, 0, 0, 0, 0],
          sessionsMaxValue: 1,
          sessionsYAxisLabels: ["0", "1"],
        };
      }
      let dataArray: number[] = [];
      if (timeView === "Week") {
        // Use daily sessions data
        const dailySessions = data.daily_sessions || [];
        dataArray = dailySessions.map((item: any) => item.count || 0);
      } else {
        // Use weekly sessions data
        const weeklySessions = data.weekly_sessions || [];
        dataArray = weeklySessions.map((item: any) => item.count || 0);
      }
      // Calculate max value and generate y-axis labels
      const maxValue = Math.max(...dataArray, 1);
      const roundedMax = Math.ceil(maxValue) + 1; // Always add one extra value
      const yLabels = Array.from({ length: roundedMax + 1 }, (_, i) =>
        i.toString()
      );
      return {
        sessionsData: dataArray,
        sessionsMaxValue: roundedMax,
        sessionsYAxisLabels: yLabels,
      };
    }, [dailyWeeklySessionsResponse, timeView]);
  // Get ATA history data from API
  const { data: ataHistoryResponse } = useUserAtaHistory();
  // Process ATA history data for chart
  const { ataData, ataLabels, ataMaxValue, ataYAxisLabels } = useMemo(() => {
    const payload: any = ataHistoryResponse as any;
    const list: any[] = Array.isArray(payload?.data?.data)
      ? payload.data.data
      : Array.isArray(payload?.data)
        ? payload.data
        : [];
    if (!Array.isArray(list) || list.length === 0) {
      return {
        ataData: [0, 0, 0, 0, 0, 0, 0],
        ataLabels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        ataMaxValue: 3.0,
        ataYAxisLabels: ["0.0", "0.6", "1.2", "1.8", "2.4", "3.0"],
      };
    }
    const values = list.map((item: any) =>
      typeof item?.most_used_ata_level === "number"
        ? item.most_used_ata_level
        : 0
    );
    const labels = list.map((item: any) =>
      typeof item?.day_name === "string" ? item.day_name.slice(0, 3) : ""
    );
    // Calculate max value from actual data, with minimum of 2.0 for better visualization
    const maxValue = Math.max(...values, 2.0);
    const roundedMax = Math.ceil(maxValue * 2) / 2; // Round up to nearest 0.5
    // Build y-axis labels from 0 to max in 5 sections (6 labels)
    const sections = 5;
    const step = roundedMax / sections;
    const yLabels = Array.from({ length: sections + 1 }, (_, i) =>
      (i * step).toFixed(1)
    );
    return {
      ataData: values,
      ataLabels: labels,
      ataMaxValue: roundedMax,
      ataYAxisLabels: yLabels,
    };
  }, [ataHistoryResponse]);
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const { data: userSessionProtocols } = useUserSessionProtocols();
  const { data: userSessionAtaLevels } = useUserSessionAtaLevels();
  // Convert selected month name to month index (1-12 for API)
  const selectedMonthIndex = months.indexOf(selectedMonth) + 1; // API expects 1-12
  const { data: sessionDatesResponse } = useCurrentMonthSessionDates(
    selectedYear,
    selectedMonthIndex
  );
  // Process session dates from API response
  const sessionDates = useMemo(() => {
    const uniqueDates =
      (sessionDatesResponse as any)?.data?.data?.unique_dates || [];
    return uniqueDates
      .map((dateString: string) => {
        // Extract day from date string (e.g., "2025-09-01" -> 1)
        const date = new Date(dateString);
        const day = date.getDate();
        const month = date.getMonth();
        const year = date.getFullYear();
        // month is 0-based from Date object, selectedMonthIndex is 1-based for API
        if (month === selectedMonthIndex - 1 && year === selectedYear) {
          return day;
        }
        return null;
      })
      .filter((day: number | null) => day !== null);
  }, [sessionDatesResponse, selectedYear, selectedMonthIndex]);

  const protocols = useMemo(() => {
    const payload: any = userSessionProtocols?.data;
    const list: any[] = Array.isArray(payload?.data) ? payload.data : [];
    return [...list.map((p: any) => ({ id: p.id, name: p.name }))];
  }, [userSessionProtocols]);

  const ataLevels = useMemo(() => {
    const payload: any = userSessionAtaLevels?.data;
    const list: any[] = Array.isArray(payload?.data) ? payload.data : [];
    return [...list.map((a: any) => ({ id: a.id, level: a.level }))];
  }, [userSessionAtaLevels]);

  const durations = useMemo(() => {
    const list: string[] = [];
    for (let start = 0; start < 60; start += 5) {
      const end = Math.min(start + 5, 60);
      list.push(`${start}-${end} min`);
    }
    return list;
  }, []);

  // Build filter params for sessions API
  const selectedDurationRange = useMemo(() => {
    if (!selectedDuration || selectedDuration === "All Durations") return null;
    const match = selectedDuration.match(/(\d+)-(\d+) min/);
    if (!match) return null;
    const start = Number(match[1]);
    const end = Number(match[2]);
    return { start, end };
  }, [selectedDuration]);

  const filteredParams = useMemo(
    () => ({
      ata_level:
        selectedAta === "All ATA Levels" || !selectedAtaId
          ? undefined
          : selectedAtaId, // send ata id
      protocol:
        selectedProtocol === "All Protocols" || !selectedProtocolId
          ? undefined
          : selectedProtocolId, // send protocol id
      duration_start_time: selectedDurationRange?.start,
      duration_end_time: selectedDurationRange?.end,
      created_at: selectedDateString || undefined, // Add selected date filter
    }),
    [
      selectedAta,
      selectedAtaId,
      selectedProtocol,
      selectedProtocolId,
      selectedDurationRange,
      selectedDateString,
    ]
  );
  const { refetch: refetchFilteredSessions } =
    useFilteredSessions(filteredParams);

  // Handle date selection
  const handleDateSelection = (day: number) => {
    setSelectedDate(day);
    // Format date as YYYY-MM-DD
    const monthIndex = months.indexOf(selectedMonth);
    const formattedDate = `${selectedYear}-${String(monthIndex + 1).padStart(
      2,
      "0"
    )}-${String(day).padStart(2, "0")}`;
    setSelectedDateString(formattedDate);
  };

  // Month navigation functions
  const handlePreviousMonth = () => {
    const currentMonthIndex = months.indexOf(selectedMonth);
    if (currentMonthIndex > 0) {
      setSelectedMonth(months[currentMonthIndex - 1]);
    } else {
      setSelectedMonth(months[11]);
      setSelectedYear(selectedYear - 1);
    }
    // Clear selection when changing months
    setSelectedDate(0);
    setSelectedDateString(null);
  };

  const handleNextMonth = () => {
    const currentMonthIndex = months.indexOf(selectedMonth);
    if (currentMonthIndex < 11) {
      setSelectedMonth(months[currentMonthIndex + 1]);
    } else {
      setSelectedMonth(months[0]);
      setSelectedYear(selectedYear + 1);
    }
    // Clear selection when changing months
    setSelectedDate(0);
    setSelectedDateString(null);
  };

  const renderCalendar = () => {
    // Calculate days in month based on selected month and year
    const getDaysInMonth = (month: string, year: number) => {
      const monthIndex = months.indexOf(month);
      const date = new Date(year, monthIndex + 1, 0);
      return date.getDate();
    };
    const daysInMonth = getDaysInMonth(selectedMonth, selectedYear);
    // Calculate first day of week for the selected month
    const getFirstDayOfWeek = (month: string, year: number) => {
      const monthIndex = months.indexOf(month);
      const date = new Date(year, monthIndex, 1);
      return date.getDay(); // 0 = Sunday, 1 = Monday, etc.
    };
    const firstDayOfWeek = getFirstDayOfWeek(selectedMonth, selectedYear);
    const calendarDays = [];
    let dayCount = 1;
    // Create 6 rows (1 header + 5 data rows)
    for (let row = 0; row < 6; row++) {
      const rowDays = [];
      // Create 7 columns for each row
      for (let col = 0; col < 7; col++) {
        if (row === 0) {
          // First row is for day headers (already handled separately)
          rowDays.push(
            <View key={`empty-header-${col}`} className="w-10 h-10" />
          );
        } else {
          // Data rows
          const dayIndex = (row - 1) * 7 + col;
          if (dayIndex < firstDayOfWeek || dayCount > daysInMonth) {
            // Empty cell (before month starts or after month ends)
            rowDays.push(
              <View key={`empty-${row}-${col}`} className="w-10 h-10" />
            );
          } else {
            // Valid day of the month
            const thisDay = dayCount; // capture stable value for this cell
            const hasSession = sessionDates.includes(thisDay);
            const isSelected = selectedDate > 0 && thisDay === selectedDate;
            rowDays.push(
              <TouchableOpacity
                key={`day-${thisDay}`}
                className="w-10 h-10 overflow-hidden rounded-full items-center justify-center"
                style={{
                  backgroundColor: isSelected ? "#3B82F6" : "transparent",
                  borderWidth: isSelected ? 2 : hasSession ? 2 : 1,
                  borderColor: isSelected
                    ? "#93C5FD"
                    : hasSession
                      ? "#60A5FA"
                      : "transparent",
                }}
                onPress={() => handleDateSelection(thisDay)}
              >
                <Text
                  style={{
                    fontSize: TEXT_SIZES.sm,
                    fontFamily: "InterRegular",
                    color: isSelected
                      ? "#FFFFFF"
                      : hasSession
                        ? "#60A5FA"
                        : "#FFFFFF",
                  }}
                >
                  {thisDay}
                </Text>
                {isSelected && (
                  <View
                    className="absolute -bottom-1 w-1 h-1 rounded-full"
                    style={{ backgroundColor: "#FFFFFF" }}
                  />
                )}
              </TouchableOpacity>
            );
            dayCount++;
          }
        }
      }
      calendarDays.push(
        <View key={`row-${row}`} className="flex-row justify-between mb-2">
          {rowDays}
        </View>
      );
    }
    return calendarDays;
  };
  // ============== Render Charts With Responsive Design ==============
  const chartPadding = 55;
  const chartWidth = screenWidth - chartPadding;
  // Calculate sessions chart sizing dynamically based on data length
  const sessionsNumberOfBars = sessionsData.length;
  const sessionsSlotWidth = chartWidth / sessionsNumberOfBars;
  const sessionsBarWidth = sessionsSlotWidth * 0.35;
  const sessionsSpacing = sessionsSlotWidth * 0.5;
  // Fixed sizing for other charts (not affected by sessions toggle)
  const otherChartsNumberOfBars = 7; // Standard week length
  const otherChartsSlotWidth = chartWidth / otherChartsNumberOfBars;

  return (
    <LinearGradient
      colors={["#243551", "#171D27", "#14181B"]}
      // start={{ x: 0.5, y: 1 }}
      // end={{ x: 0.5, y: 0 }}
      style={styles.gradient}
    >
      <SafeAreaView className="h-screen">
        <AppStatusBar barStyle="light-content" />
        <View className="flex-1 px-4 pt-3">
          {/* Header */}
          <View className="mb-1">
            {/* Top Row - Back Arrow and Title */}
            
            <ShadowHeader
              title="Session Details"
              onPress={() => navigation.goBack()}
            />
            {/* Filter Row */}
            <View className="flex-row flex-wrap items-center relative">
              <TouchableOpacity className="px-4 py-2 mr-3 bg-[#374862] items-center justify-center rounded-xl border border-[#8BAFCE]">
                <AntDesign
                  name="filter"
                  size={RFValue(18)}
                  color="#8BAFCE"
                  style={{ fontSize: TEXT_SIZES.md,width: RFValue(16),height: RFValue(14) }}
                />
              </TouchableOpacity>

              {/* Protocol Filter */}
              <View className="relative mr-3 mb-3" onLayout={(e) => {}}>
                <TouchableOpacity
                  className="bg-[#374862] px-3 py-2 flex-row items-center"
                  style={{
                    borderTopLeftRadius: 16,
                    borderTopRightRadius: 16,
                    borderBottomLeftRadius: showProtocolDropdown ? 0 : 16,
                    borderBottomRightRadius: showProtocolDropdown ? 0 : 16,
                  }}
                  onLayout={(e) => {
                    // store width for dropdown to match
                    // @ts-ignore
                    setProtocolWidth?.(e.nativeEvent.layout.width);
                  }}
                  onPress={() => setShowProtocolDropdown(!showProtocolDropdown)}
                >
                  <Text
                    className="text-white mr-1"
                    style={{ fontSize: TEXT_SIZES.sm, fontFamily: "InterRegular" }}
                  >
                    {selectedProtocol}
                  </Text>
                  <AntDesign
                    name={showProtocolDropdown ? "up" : "down"}
                    size={12}
                    color="white"
                    style={{ fontSize: TEXT_SIZES.sm, zIndex: 1001 }}
                  />
                </TouchableOpacity>
                <Dropdown
                  visible={showProtocolDropdown}
                  onClose={() => setShowProtocolDropdown(false)}
                  options={protocols.map((p) => ({ id: p.id, name: p.name }))}
                  onSelect={(option) => {
                    setSelectedProtocol(option.name);
                    setSelectedProtocolId(
                      option.id === 0 ? undefined : (option.id as number)
                    );
                  }}
                  selectedValue={selectedProtocol}
                  title="Protocols"
                  topOffset={40}
                  width={protocolWidth}
                  headerText={
                    selectedProtocol !== "All Protocols"
                      ? selectedProtocol
                      : undefined
                  }
                />
              </View>

              {/* ATA Level Filter */}
              <View className="relative mr-3 mb-3">
                <TouchableOpacity
                  className="bg-[#374862] px-3 py-2 flex-row items-center"
                  style={{
                    borderTopLeftRadius: 16,
                    borderTopRightRadius: 16,
                    borderBottomLeftRadius: showAtaDropdown ? 0 : 16,
                    borderBottomRightRadius: showAtaDropdown ? 0 : 16,
                  }}
                  onLayout={(e) => {
                    // @ts-ignore
                    setAtaWidth?.(e.nativeEvent.layout.width);
                  }}
                  onPress={() => setShowAtaDropdown(!showAtaDropdown)}
                >
                  <Text
                    className="text-white mr-1"
                    style={{ fontSize: TEXT_SIZES.sm, fontFamily: "InterRegular" }}
                  >
                    {selectedAta}
                  </Text>
                  <AntDesign
                    name={showAtaDropdown ? "up" : "down"}
                    size={12}
                    color="white"
                    style={{ fontSize: TEXT_SIZES.sm, zIndex: 1001 }}
                  />
                </TouchableOpacity>
                <Dropdown
                  visible={showAtaDropdown}
                  onClose={() => setShowAtaDropdown(false)}
                  options={ataLevels.map((a) => ({ id: a.id, name: a.level }))}
                  onSelect={(option) => {
                    setSelectedAta(option.name);
                    setSelectedAtaId(
                      option.id === 0 ? undefined : (option.id as number)
                    );
                  }}
                  selectedValue={selectedAta}
                  title="ATA Level"
                  topOffset={40}
                  width={ataWidth}
                  headerText={
                    selectedAta !== "All ATA Levels" ? selectedAta : undefined
                  }
                />
              </View>

              {/* Duration Filter */}
              <View className="relative mr-3 mb-3">
                <TouchableOpacity
                  className="bg-[#374862] px-3 py-2 flex-row items-center"
                  style={{
                    borderTopLeftRadius: 16,
                    borderTopRightRadius: 16,
                    borderBottomLeftRadius: showDurationDropdown ? 0 : 16,
                    borderBottomRightRadius: showDurationDropdown ? 0 : 16,
                  }}
                  onPress={() => {
                    console.log(
                      "Duration dropdown state:",
                      showDurationDropdown
                    );
                    setShowDurationDropdown(!showDurationDropdown);
                  }}
                  onLayout={(e) => {
                    // @ts-ignore
                    setDurationWidth?.(e.nativeEvent.layout.width);
                  }}
                >
                  <Text
                    className="text-white mr-1"
                    style={{ fontSize: TEXT_SIZES.sm, fontFamily: "InterRegular" }}
                  >
                    {selectedDuration}
                  </Text>
                  <AntDesign
                    name={showDurationDropdown ? "up" : "down"}
                    size={12}
                    color="white"
                    style={{ fontSize: TEXT_SIZES.sm, zIndex: 1001 }}
                  />
                </TouchableOpacity>
                <Dropdown
                  visible={showDurationDropdown}
                  onClose={() => setShowDurationDropdown(false)}
                  options={durations.map((d) => ({ id: d, name: d }))}
                  onSelect={(option) => {
                    setSelectedDuration(option.name);
                  }}
                  selectedValue={selectedDuration}
                  title="Duration"
                  topOffset={40}
                  width={durationWidth}
                  headerText={
                    selectedDuration !== "All Durations"
                      ? selectedDuration
                      : undefined
                  }
                />
              </View>

              <TouchableOpacity
                className="bg-[#374862] rounded-full px-6  py-2 mr-3 mb-3"
                onPress={() => {
                  setSelectedProtocol("All Protocols");
                  setSelectedProtocolId(undefined);
                  setSelectedAta("All ATA Levels");
                  setSelectedAtaId(undefined);
                  setSelectedDuration("All Durations");
                  setShowProtocolDropdown(false);
                  setShowAtaDropdown(false);
                  setShowDurationDropdown(false);
                }}
              >
                <Text
                  className="text-white"
                  style={{ fontSize: TEXT_SIZES.sm, fontFamily: "InterRegular" }}
                >
                  Reset Filter
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Touchable overlay to close dropdowns */}
          {(showProtocolDropdown ||
            showAtaDropdown ||
            showDurationDropdown) && (
            <TouchableOpacity
              className="absolute inset-0 z-30"
              onPress={() => {
                setShowProtocolDropdown(false);
                setShowAtaDropdown(false);
                setShowDurationDropdown(false);
              }}
            />
          )}

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Session Details Section */}
            <Text
              className="text-white mb-2"
              style={{ fontSize: TEXT_SIZES.md ,fontFamily: "InterRegular" }}
            >
              Choose a date to view session details
            </Text>
            <View className="  bg-black rounded-[32px]  p-6 ">
              {/* Calendar */}
              <View>
                {/* Month/Year Navigation */}
                <View className=" flex-row items-center justify-between mb-4">
                  <View className="flex-row items-center justify-between mb-4">
                    <TouchableOpacity onPress={() => handlePreviousMonth()}>
                      <AntDesign
                        name="left"
                        size={20}
                        color="white"
                        style={{ fontSize: TEXT_SIZES.md }}
                      />
                    </TouchableOpacity>
                    <Text
                      className="text-white  mx-2"
                      style={{ fontSize: TEXT_SIZES.lg }}
                    >
                      {selectedMonth}
                    </Text>
                    <TouchableOpacity onPress={() => handleNextMonth()}>
                      <AntDesign
                        name="right"
                        size={20}
                        color="white"
                        style={{ fontSize: TEXT_SIZES.md }}
                      />
                    </TouchableOpacity>
                  </View>
                  <View className="flex-row items-center justify-between mb-4">
                    <TouchableOpacity
                      onPress={() => setSelectedYear(selectedYear - 1)}
                    >
                      <AntDesign
                        name="left"
                        size={20}
                        color="white"
                        style={{ fontSize: TEXT_SIZES.md }}
                      />
                    </TouchableOpacity>
                    <Text
                      className="text-white mx-2"
                      style={{ fontSize: TEXT_SIZES.lg }}
                    >
                      {selectedYear}
                    </Text>
                    <TouchableOpacity
                      onPress={() => setSelectedYear(selectedYear + 1)}
                    >
                      <AntDesign
                        name="right"
                        size={20}
                        color="white"
                        style={{ fontSize: TEXT_SIZES.md }}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
                {/* Days of Week */}
                <View className="flex-row justify-between ">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                    (day, index) => (
                      <Text
                        key={day}
                        className={`w-10 text-center   ${
                          index === 0 || index === 6
                            ? "text-blue-400"
                            : "text-white"
                        }`}
                        style={{ fontSize: TEXT_SIZES.sm }}
                      >
                        {day}
                      </Text>
                    )
                  )}
                </View>
                {/* Calendar Grid */}
                <View className="w-full">{renderCalendar()}</View>
              </View>
              {/* View Session Details Button */}
              <View
                className={`flex-full w-full items-center justify-between rounded-full mt-8 ${
                  selectedDateString ? "bg-[#4C8BF5]" : "bg-blue-300 "
                }`}
              >
                <TouchableOpacity
                  className="py-4 px-8 items-center w-full"
                  onPress={async () => {
                    if (!selectedDateString) {
                      // Show alert if no date is selected
                      alert("Please select a date to view session details");
                      return;
                    }
                    const res = await refetchFilteredSessions();
                    navigation.navigate("SessionCalendarScreen", {
                      filters: filteredParams,
                      result: (res.data as any)?.data?.data, // Access the nested data array
                    });
                  }}
                >
                  <Text
                    className={`text-gray-600  text-center ${selectedDateString ? "text-white" : "text-gray-600"}`}
                    style={{ fontSize: TEXT_SIZES.md, fontFamily: "InterRegular" }}
                  >
                    {selectedDateString ? "View Session Details" : "Select a Date First"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            {/* Charts Section */}


          <View style={{ marginVertical: RFValue(14) }}>
          <GradientLine />
          </View>
            {/* Sessions Chart with Week/Month Toggle */}
            <View className="bg-[#090A0B] rounded-[12px] p-4 mb-6 w-full">
              <View className="flex-row items-center justify-between mb-4">
                <Text
                  className="text-white "
                  style={{ fontSize: TEXT_SIZES.md ,fontFamily: "InterRegular" }}
                >
                  Sessions
                </Text>
                <View className="flex-row bg-[#2A2F36] rounded-lg p-1">
                  <TouchableOpacity
                    className={`px-2 py-1 rounded-md ${
                      timeView === "Week" ? "bg-[#6189ADE5]" : ""
                    }`}
                    onPress={() => setTimeView("Week")}
                  >
                    <Text
                      className={` ${
                        timeView === "Week" ? "text-white" : "text-gray-400"
                      }`}
                      style={{
                        fontSize: Math.max(8, Math.min(12, TEXT_SIZES.xs)),
                      }}
                    >
                      Week
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    className={`px-2 py-1 rounded-md ${
                      timeView === "Month" ? "bg-[#6189ADE5]" : ""
                    }`}
                    onPress={() => setTimeView("Month")}
                  >
                    <Text
                      className={`${
                        timeView === "Month" ? "text-white" : "text-[#9CA3AF]"
                      }`}
                      style={{
                        fontSize: Math.max(8, Math.min(12, TEXT_SIZES.xs)),
                        fontFamily: "InterRegular",
                      }}
                    >
                      Month
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={{ overflow: "hidden" }}>
                <BarChart
                  data={sessionsData.map((v, i) => ({
                    value: v,
                    label:
                      timeView === "Week" ? daysOfWeek[i] : `Week ${i + 1}`,
                  }))}
                  spacing={sessionsSpacing}
                  barWidth={sessionsBarWidth}
                  width={chartWidth}
                  height={RFValue(150)}
                  barBorderTopLeftRadius={RFValue(50)}
                  barBorderTopRightRadius={RFValue(50)}
                  frontColor="#4C8BF5"
                  yAxisTextStyle={{
                    color: "#9CA3AF",
                    fontSize: 12,
                  }}
                  yAxisIndicesColor="transparent"
                  yAxisLabelPrefix=""
                  yAxisLabelSuffix=""
                  yAxisLabelTexts={sessionsYAxisLabels}
                  yAxisLabelContainerStyle={{ marginLeft: 0 }}
                  xAxisLabelTextStyle={{
                    color: "#9CA3AF",
                    fontSize: 12,
                  }}
                  noOfSections={sessionsMaxValue}
                  maxValue={sessionsMaxValue}
                  yAxisColor="transparent"
                  xAxisColor="transparent"
                  rulesColor="rgba(156, 163, 175, 0.7)"
                />
              </View>
            </View>
            {/* ATA History Line Chart */}
            <View className="bg-[#090A0B] rounded-[12px] py-4 mb-6 px-4">
              <View className="flex-row items-center justify-between mb-4 px-3">
                <Text
                  className="text-white "
                  style={{ fontSize: TEXT_SIZES.md ,fontFamily: "InterRegular" }}
                >
                  ATA History
                </Text>
              </View>
              <View style={{ overflow: "hidden" }}>
                <LineChart
                  data={ataData.map((v, i) => ({
                    value: v,
                    label: ataLabels[i] || `Day ${i + 1}`,
                  }))}
                  width={chartWidth}
                  height={RFValue(150)}
                  spacing={otherChartsSlotWidth}
                  curved
                  areaChart
                  thickness={5}
                  color="#4C8BF5"
                  startFillColor="rgba(58, 64, 73, 0.6)"
                  endFillColor="rgba(76, 139, 245, 0.4)"
                  dataPointsColor="#4C8BF5"
                  dataPointsRadius={3}
                  yAxisTextStyle={{ color: "#9CA3AF", fontSize: 12 }}
                  yAxisIndicesColor="transparent"
                  yAxisLabelPrefix=""
                  yAxisLabelSuffix=""
                  yAxisLabelTexts={ataYAxisLabels}
                  yAxisLabelContainerStyle={{ marginLeft: -4 }}
                  xAxisLabelTextStyle={{
                    color: "#9CA3AF",
                    fontSize: 12,
                    marginLeft: 14,
                  }}
                  isAnimated={true}
                  noOfSections={5}
                  initialSpacing={0}
                  endSpacing={0}
                  scrollToEnd={false}
                  maxValue={ataMaxValue}
                  yAxisColor="transparent"
                  xAxisColor="#2A2F36"
                  xAxisThickness={1}
                  xAxisLabelsHeight={24}
                  yAxisLabelWidth={28}
                  rulesColor="rgba(156, 163, 175, 0.7)"
                />
              </View>
            </View>
          </ScrollView>
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

export default StatisticsDashboardScreen;
