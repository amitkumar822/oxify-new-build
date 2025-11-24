import React, { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
const { useNavigation } = require("@react-navigation/native");
import { useAuth } from "../contexts/AuthContext";
import { Theme } from "../constants";

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

const AuthGuard: React.FC<AuthGuardProps> = ({
  children,
  requireAuth = true,
}) => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const navigation: any = useNavigation();

  useEffect(() => {
    const performAuthCheck = async () => {
      if (!isLoading) {
        await checkAuthStatus();
      }
    };

    performAuthCheck();
  }, [isAuthenticated, isLoading]);

  // Add additional effect to debug component mounting
  useEffect(() => {}, []);

  const checkAuthStatus = async () => {
    try {
      if (requireAuth && !isAuthenticated) {
        navigation.replace("AuthStack", { screen: "LoginEmail" });
      } else if (!requireAuth && isAuthenticated) {
        navigation.replace("MainStack");
      } else {
      }
    } catch (error) {
      console.log("🔐 AuthGuard - Error in checkAuthStatus:", error);
      if (requireAuth) {
        navigation.replace("AuthStack", { screen: "LoginEmail" });
      }
    }
  };

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: Theme.background.dark,
        }}
      >
        <ActivityIndicator size="large" color={Theme.action.primary} />
      </View>
    );
  }

  // Render children if auth requirement matches
  if ((requireAuth && isAuthenticated) || (!requireAuth && !isAuthenticated)) {
    return <>{children}</>;
  }

  return null;
};

export default AuthGuard;
