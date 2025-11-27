import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";
import {
  UserData,
  storeToken,
  storeUserData,
  getToken,
  getUserData,
  getChamberId,
  logout as clearStorage,
} from "../utils/tokenManager";
import { queryClient, queryKeys } from "@/config/queryClient";
import { subscribeUnauthorized } from "@/utils/authEvents";
import { profileApi } from "@/api/profile";
import { notificationApi } from "@/api/notification";
import { sessionApi } from "@/api/session";

interface AuthContextType {
  user: UserData | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  hasChamberSelected: boolean;
  login: (userData: UserData) => Promise<void>;
  logout: () => Promise<void>;
  updateChamberSelection: (hasChamber: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasChamberSelected, setHasChamberSelected] = useState(false);

  const clearProtectedQueries = () => {
    const protectedKeys = [
      queryKeys.profile.all,
      queryKeys.sessions.all,
      queryKeys.protocols.all,
      queryKeys.learning.all,
      queryKeys.chambers.all,
      queryKeys.notifications.all,
      queryKeys.analytics.all,
      queryKeys.quotes.all,
      queryKeys.healthGoals.all,
    ];
    protectedKeys.forEach((key) => {
      queryClient.removeQueries({ queryKey: key });
    });
  };

  const prefetchPostLoginData = async () => {
    try {
      await Promise.all([
        queryClient.prefetchQuery({
          queryKey: queryKeys.profile.all,
          queryFn: profileApi.getProfile,
        }),
        queryClient.prefetchQuery({
          queryKey: [...queryKeys.notifications.all, "count"],
          queryFn: notificationApi.getNotificationCount,
        }),
        queryClient.prefetchQuery({
          queryKey: [...queryKeys.sessions.all, "longest-streak"],
          queryFn: sessionApi.getLongestStreak,
        }),
      ]);
    } catch (error) {
      console.warn("Prefetch after login failed:", error);
    }
  };

  const unauthorizedLockRef = useRef(false);

  // Load token and user data from AsyncStorage when app starts
  useEffect(() => {
    const loadStoredAuth = async () => {
      try {
        const token = await getToken();
        const userData = await getUserData();
        const chamberId = await getChamberId();

        if (token && userData) {
          setUser(userData);
          setIsAuthenticated(true);
          setHasChamberSelected(!!chamberId);
        } else {
          // console.log("🔐 AuthContext - No auth data, staying unauthenticated");
        }
      } catch (error) {
        console.log("🔐 AuthContext - Error loading auth:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadStoredAuth();
  }, []);

  const login = async (userData: UserData) => {
    try {
      // Store in AsyncStorage
      await storeToken(userData.token);
      await storeUserData(userData);
      clearProtectedQueries();
      await prefetchPostLoginData();

      // Update context
      setUser(userData);
      setIsAuthenticated(true);
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      // Clear AsyncStorage FIRST before clearing context state
      await clearStorage();
      clearProtectedQueries();

      // Clear context state after AsyncStorage is cleared
      setUser(null);
      setIsAuthenticated(false);
      setHasChamberSelected(false);
    } catch (error) {
      console.error("🔐 AuthContext - Error during logout:", error);
      // Even if AsyncStorage clearing fails, clear the context state
      // to prevent the app from thinking user is still logged in
      setUser(null);
      setIsAuthenticated(false);
      setHasChamberSelected(false);
      throw error; // Re-throw to let caller handle it
    }
  };

  useEffect(() => {
    const unsubscribe = subscribeUnauthorized(() => {
      if (unauthorizedLockRef.current || !isAuthenticated) return;
      unauthorizedLockRef.current = true;
      logout()
        .catch((error) => {
          console.error("Unauthorized logout failed:", error);
        })
        .finally(() => {
          unauthorizedLockRef.current = false;
        });
    });
    return unsubscribe;
  }, [isAuthenticated, logout]);

  const updateChamberSelection = (hasChamber: boolean) => {
    setHasChamberSelected(hasChamber);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    hasChamberSelected,
    login,
    logout,
    updateChamberSelection,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
