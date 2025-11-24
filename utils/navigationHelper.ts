import { NavigationProp, CommonActions } from "@react-navigation/native";
import { SCREEN_NAMES } from "../constants";

/**
 * Navigation helper utilities for easier navigation management
 */

// Type for navigation prop (more flexible type)
export type RootNavigationProp = NavigationProp<any> | any;

/**
 * Navigate to a specific screen
 */
export const navigateToScreen = (
  navigation: RootNavigationProp,
  screenName: string,
  params?: any
) => {
  navigation.navigate(screenName, params);
};

/**
 * Navigate and reset the navigation stack
 */
export const navigateAndReset = (
  navigation: RootNavigationProp,
  screenName: string,
  params?: any
) => {
  navigation.dispatch(
    CommonActions.reset({
      index: 0,
      routes: [{ name: screenName, params }],
    })
  );
};

/**
 * Go back to previous screen
 */
export const goBack = (navigation: RootNavigationProp) => {
  if (navigation.canGoBack()) {
    navigation.goBack();
  }
};

/**
 * Common navigation flows
 */
export const NavigationFlows = {
  // Navigate from onboarding to auth
  onboardingToAuth: (navigation: RootNavigationProp) => {
    navigateAndReset(navigation, "AuthStack");
  },

  // Navigate from auth to main app
  authToMain: (navigation: RootNavigationProp) => {
    navigateAndReset(navigation, "MainStack");
  },

  // Navigate to session flow
  startSession: (navigation: RootNavigationProp) => {
    navigateToScreen(navigation, SCREEN_NAMES.SESSION_SETUP);
  },

  // Navigate to profile settings
  openProfile: (navigation: RootNavigationProp) => {
    navigateToScreen(navigation, SCREEN_NAMES.PROFILE_HUB);
  },

  // Navigate to chamber selection
  selectChamber: (navigation: RootNavigationProp) => {
    navigateToScreen(navigation, SCREEN_NAMES.CHAMBER_SELECTION);
  },
};

/**
 * Screen parameter types (extend as needed)
 */
export interface ScreenParams {
  [SCREEN_NAMES.SESSION_SETUP]: {
    chamberId?: string;
    protocolId?: string;
  };
  [SCREEN_NAMES.MILESTONE_SHARE]: {
    milestoneType: string;
    days: number;
  };
  // Add more screen parameters as needed
}
