import React from "react";
const { createNativeStackNavigator } = require("@react-navigation/native-stack");
import { SCREEN_NAMES } from "../constants";

// Import settings screens
import SettingsChangePasswordScreen from "../screens/settings/SettingsChangePasswordScreen";
import SettingsPushNotificationsScreen from "../screens/settings/SettingsPushNotificationsScreen";
import SettingsEmailPreferencesScreen from "../screens/settings/SettingsEmailPreferencesScreen";
import SettingsClearCacheScreen from "../screens/settings/SettingsClearCacheScreen";
import SettingsChamberModelScreen from "../screens/settings/SettingsChamberModelScreen";

const SettingsStack = createNativeStackNavigator();

const SettingsNavigator: React.FC = () => {
  return (
    <SettingsStack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
      }}
    >
      <SettingsStack.Screen
        name={SCREEN_NAMES.SETTINGS_CHANGE_PASSWORD}
        component={SettingsChangePasswordScreen}
      />
      <SettingsStack.Screen
        name={SCREEN_NAMES.SETTINGS_PUSH_NOTIFICATIONS}
        component={SettingsPushNotificationsScreen}
      />
      <SettingsStack.Screen
        name={SCREEN_NAMES.SETTINGS_EMAIL_PREFERENCES}
        component={SettingsEmailPreferencesScreen}
      />
      <SettingsStack.Screen
        name={SCREEN_NAMES.SETTINGS_CLEAR_CACHE}
        component={SettingsClearCacheScreen}
      />
      <SettingsStack.Screen
        name={SCREEN_NAMES.SETTINGS_CHAMBER_MODEL}
        component={SettingsChamberModelScreen}
      />
    </SettingsStack.Navigator>
  );
};

export default SettingsNavigator;
