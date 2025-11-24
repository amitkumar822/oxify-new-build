import React from "react";
const {
  createNativeStackNavigator,
} = require("@react-navigation/native-stack");
import { SCREEN_NAMES } from "../constants";

// Import session screens
import SessionDetailsScreen from "../screens/main/SessionDetailsScreen";
import SessionSetupScreen from "../screens/session/SessionSetupScreen";
import SessionReadyScreen from "../screens/session/SessionReadyScreen";
import SessionInProgressScreen from "../screens/session/SessionInProgressScreen";
import SessionCompletedScreen from "../screens/session/SessionCompletedScreen";

const SessionStack = createNativeStackNavigator();

const SessionNavigator: React.FC = () => {
  return (
    <SessionStack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
      }}
      initialRouteName={SCREEN_NAMES.SESSION_DETAILS}
    >
      <SessionStack.Screen
        name={SCREEN_NAMES.SESSION_DETAILS}
        component={SessionDetailsScreen}
      />
      <SessionStack.Screen
        name={SCREEN_NAMES.SESSION_SETUP}
        component={SessionSetupScreen}
      />
      <SessionStack.Screen
        name={SCREEN_NAMES.SESSION_READY}
        component={SessionReadyScreen}
      />
      <SessionStack.Screen
        name={SCREEN_NAMES.SESSION_IN_PROGRESS}
        component={SessionInProgressScreen}
      />
      <SessionStack.Screen
        name={SCREEN_NAMES.SESSION_COMPLETED}
        component={SessionCompletedScreen}
      />
    </SessionStack.Navigator>
  );
};

export default SessionNavigator;
