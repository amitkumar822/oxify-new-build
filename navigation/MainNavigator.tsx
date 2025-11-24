import React from "react";
const { createBottomTabNavigator } = require("@react-navigation/bottom-tabs");
const {
  createNativeStackNavigator,
} = require("@react-navigation/native-stack");
import { SCREEN_NAMES } from "../constants";
import { Theme } from "../constants";
import { useAuth } from "../contexts/AuthContext";

// Import main screens
import DashboardScreen from "../screens/main/DashboardScreen";
import ChamberSelectionScreen from "../screens/main/ChamberSelectionScreen";
import SessionCalendarScreen from "../screens/analytics/SessionCalendarScreen";
import StatisticsDashboardScreen from "../screens/analytics/StatisticsDashboardScreen";
import ProtocolsHubScreen from "../screens/hbot/ProtocolsHubScreen";
import ProfileHubScreen from "../screens/profile/ProfileHubScreen";
import StreakScreen from "../screens/main/StreakScreen";
import NotificationsScreen from "../screens/main/NotificationsScreen";

// Import other screens
import ProfileNavigator from "./ProfileNavigator";
import SettingsNavigator from "./SettingsNavigator";
import ContentNavigator from "./ContentNavigator";

// Import session screens
import SessionSetupScreen from "../screens/session/SessionSetupScreen";
import SessionReadyScreen from "../screens/session/SessionReadyScreen";
import SessionInProgressScreen from "../screens/session/SessionInProgressScreen";
import SessionCompletedScreen from "../screens/session/SessionCompletedScreen";
import CustomTabBar from "../components/navigation/CustomTabBar";
import SessionDetailsScreen from "@/screens/main/SessionDetailsScreen";

const Tab = createBottomTabNavigator();
const MainStack = createNativeStackNavigator();

const TabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      tabBar={(props: any) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="DashboardTab"
      // backBehavior="history"
    >
      <Tab.Screen name="DashboardTab" component={DashboardScreen} />
      <Tab.Screen name="StatisticsTab" component={StatisticsDashboardScreen} />
      {/* Removed StartSessionTab - session screens are now full-screen modals */}
      <Tab.Screen name="ProtocolsTab" component={ProtocolsHubScreen} />
      <Tab.Screen name="ProfileTab" component={ProfileNavigator} />
    </Tab.Navigator>
  );
};

const MainNavigator: React.FC = () => {
  const { hasChamberSelected } = useAuth();

  return (
    <MainStack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: false, // Disable swipe back gesture
      }}
      initialRouteName={
        hasChamberSelected ? "TabNavigator" : SCREEN_NAMES.CHAMBER_SELECTION
      }
    >
      {/* Tab Navigator */}
      <MainStack.Screen name="TabNavigator" component={TabNavigator} />

      {/* Full Screen Modals */}
      <MainStack.Screen
        name={SCREEN_NAMES.CHAMBER_SELECTION}
        component={ChamberSelectionScreen}
      />
      <MainStack.Screen
        name={SCREEN_NAMES.SESSION_CALENDAR}
        component={SessionCalendarScreen}
      />
      <MainStack.Screen name={SCREEN_NAMES.STREAK} component={StreakScreen} />
      <MainStack.Screen
        name={SCREEN_NAMES.NOTIFICATIONS}
        component={NotificationsScreen}
      />

      {/* Session Screens - Full Screen Modals */}
      <MainStack.Screen
        name={SCREEN_NAMES.SESSION_SETUP}
        component={SessionSetupScreen}
      />
      <MainStack.Screen
        name={SCREEN_NAMES.SESSION_READY}
        component={SessionReadyScreen}
      />
      <MainStack.Screen
        name={SCREEN_NAMES.SESSION_IN_PROGRESS}
        component={SessionInProgressScreen}
      />
      <MainStack.Screen
        name={SCREEN_NAMES.SESSION_COMPLETED}
        component={SessionCompletedScreen}
      />

      <MainStack.Screen
        name={SCREEN_NAMES.SESSION_DETAILS}
        component={SessionDetailsScreen}
      />

      {/* Other Navigators */}
      <MainStack.Screen name="SettingsStack" component={SettingsNavigator} />
      <MainStack.Screen name="ContentStack" component={ContentNavigator} />
    </MainStack.Navigator>
  );
};

export default MainNavigator;