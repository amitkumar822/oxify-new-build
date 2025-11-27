import { useAuth } from "@/contexts/AuthContext";

export const useAuthGate = () => {
  const { isAuthenticated, isLoading } = useAuth();
  return {
    authReady: !isLoading && isAuthenticated,
    isAuthenticated,
    authLoading: isLoading,
  };
};
