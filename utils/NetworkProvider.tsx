import React, { useEffect, useState } from "react";
import NetInfo, { NetInfoState } from "@react-native-community/netinfo";
import Toast from "react-native-toast-message";

const NetworkProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isConnected, setIsConnected] = useState<boolean | null>(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state: NetInfoState) => {
      setIsConnected(state.isConnected);

      if (!state.isConnected) {
        // 🔴 Show toast when internet is disconnected
        Toast.show({
          type: "error",
          text1: "⚠️ No Internet Connection",
          position: "top",
          visibilityTime: 4000,
          autoHide: true,
        });
      } else {
        // 🟢 Optionally dismiss all toasts when back online
        Toast.hide();
      }
    });

    return () => unsubscribe();
  }, []);

  return <>{children}</>;
};

export default NetworkProvider;
