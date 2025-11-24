import React from "react";
const {
  createNativeStackNavigator,
} = require("@react-navigation/native-stack");
import { SCREEN_NAMES } from "../constants";

// Import content screens
import FavoriteProtocolsScreen from "../screens/content/FavoriteProtocolsScreen";
import SavedArticlesScreen from "../screens/content/SavedArticlesScreen";
import MyArticlesScreen from "../screens/content/MyArticlesScreen";
import MilestoneBadgesScreen from "../screens/content/MilestoneBadgesScreen";
import MilestoneShareScreen from "../screens/content/MilestoneShareScreen";
import LearningArticlesScreen from "../screens/hbot/LearningArticlesScreen";
import CommunityCommentsScreen from "../screens/hbot/CommunityCommentsScreen";
import ArticleDetailsScreen from "../screens/content/ArticleDetailsScreen";

const ContentStack = createNativeStackNavigator();

const ContentNavigator: React.FC = () => {
  return (
    <ContentStack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
      }}
    >
      <ContentStack.Screen
        name={SCREEN_NAMES.FAVORITE_PROTOCOLS}
        component={FavoriteProtocolsScreen}
      />
      <ContentStack.Screen
        name={SCREEN_NAMES.SAVED_ARTICLES}
        component={SavedArticlesScreen}
      />
      <ContentStack.Screen
        name={SCREEN_NAMES.MY_ARTICLES}
        component={MyArticlesScreen}
      />
      <ContentStack.Screen
        name={SCREEN_NAMES.MILESTONE_BADGES}
        component={MilestoneBadgesScreen}
      />
      <ContentStack.Screen
        name={SCREEN_NAMES.MILESTONE_SHARE}
        component={MilestoneShareScreen}
      />
      <ContentStack.Screen
        name={SCREEN_NAMES.LEARNING_ARTICLES}
        component={LearningArticlesScreen}
      />
      <ContentStack.Screen
        name={SCREEN_NAMES.COMMUNITY_COMMENTS}
        component={CommunityCommentsScreen}
      />
      <ContentStack.Screen
        name={SCREEN_NAMES.ARTICLE_DETAILS}
        component={ArticleDetailsScreen}
      />
    </ContentStack.Navigator>
  );
};

export default ContentNavigator;
