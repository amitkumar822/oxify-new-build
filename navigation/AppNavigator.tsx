import React from "react";
const { NavigationContainer } = require("@react-navigation/native");
const { createNativeStackNavigator } = require("@react-navigation/native-stack");

// Import navigation stacks
import AuthNavigator from "./AuthNavigator";
import MainNavigator from "./MainNavigator";
import AuthGuard from "./AuthGuard";

// Root stack navigator
const RootStack = createNativeStackNavigator();

const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <RootStack.Navigator
        screenOptions={{
          headerShown: false,
          gestureEnabled: true,
        }}
        initialRouteName="AuthStack"
      >

        {/* Authentication Flow */}
        <RootStack.Screen
          name="AuthStack"
          children={() => (
            <AuthGuard requireAuth={false}>
              <AuthNavigator />
            </AuthGuard>
          )}
          options={{
            gestureEnabled: false, // Disable swipe back gesture
          }}
        />

        {/* Main Application */}
        <RootStack.Screen
          name="MainStack"
          children={() => (
            <AuthGuard requireAuth={true}>
              <MainNavigator />
            </AuthGuard>
          )}
          options={{
            gestureEnabled: false, // Disable swipe back gesture
          }}
        />
      </RootStack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
