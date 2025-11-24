import React from "react";
const { createNativeStackNavigator } = require("@react-navigation/native-stack");
import { SCREEN_NAMES } from "../constants";

// Import profile screens
import ProfileHubScreen from "../screens/profile/ProfileHubScreen";
import ManageAccountScreen from "../screens/profile/ManageAccountScreen";
import DeleteAccountScreen from "../screens/profile/DeleteAccountScreen";
import EditGenderScreen from "../screens/profile/EditGenderScreen";
import EditNameScreen from "../screens/profile/EditNameScreen";
import EditDateOfBirthScreen from "../screens/profile/EditDateOfBirthScreen";
import ChangePasswordScreen from "../screens/profile/ChangePasswordScreen";
import ProfilePhotoScreen from "../screens/profile/ProfilePhotoScreen";

const ProfileStack = createNativeStackNavigator();

const ProfileNavigator: React.FC = () => {
  return (
    <ProfileStack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
      }}
      initialRouteName={SCREEN_NAMES.PROFILE_HUB}
    >
      <ProfileStack.Screen
        name={SCREEN_NAMES.PROFILE_HUB}
        component={ProfileHubScreen}
      />
      <ProfileStack.Screen
        name={SCREEN_NAMES.MANAGE_ACCOUNT}
        component={ManageAccountScreen}
      />
      <ProfileStack.Screen
        name={SCREEN_NAMES.DELETE_ACCOUNT}
        component={DeleteAccountScreen}
      />
      <ProfileStack.Screen
        name={SCREEN_NAMES.EDIT_GENDER}
        component={EditGenderScreen}
      />
      <ProfileStack.Screen
        name={SCREEN_NAMES.EDIT_NAME}
        component={EditNameScreen}
      />
      <ProfileStack.Screen
        name={SCREEN_NAMES.EDIT_DOB}
        component={EditDateOfBirthScreen}
      />
      <ProfileStack.Screen
        name={SCREEN_NAMES.CHANGE_PASSWORD}
        component={ChangePasswordScreen}
      />
      <ProfileStack.Screen
        name={SCREEN_NAMES.PROFILE_PHOTO}
        component={ProfilePhotoScreen}
      />
    </ProfileStack.Navigator>
  );
};

export default ProfileNavigator;
