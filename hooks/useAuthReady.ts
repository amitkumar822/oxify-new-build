import { useAuth } from "../contexts/AuthContext";

/**
 * Small helper hook that returns true only when auth state finished loading
 * and we have an authenticated session.
 */
export const useAuthReady = () => {
  const { isAuthenticated, isLoading } = useAuth();
  return isAuthenticated && !isLoading;
};


