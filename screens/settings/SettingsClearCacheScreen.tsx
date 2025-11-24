import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import AntDesign from "@expo/vector-icons/AntDesign";
const { useNavigation } = require("@react-navigation/native");
import { SafeAreaView } from "react-native-safe-area-context";
import { AppStatusBar } from "../../helpers/AppStatusBar";
import { TEXT_SIZES } from "@/constants/textSizes";
import { Theme } from "@/constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { queryClient } from "@/config/queryClient";
import { showToast } from "@/config/toast";
import { getToken, getUserData, getChamberId } from "@/utils/tokenManager";
import { Image } from "expo-image";
import * as FileSystem from "expo-file-system";

const SettingsClearCacheScreen: React.FC = () => {
  const navigation: any = useNavigation();
  const [storageInfo, setStorageInfo] = useState({
    reactQuery: "0 KB",
    asyncStorage: "0 KB",
    imageCache: "0 KB",
    fileSystem: "0 KB",
    total: "0 KB",
  });
  const [isClearing, setIsClearing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStorageInfo();
  }, []);

  const loadStorageInfo = async () => {
    try {
      setIsLoading(true);

      // Calculate React Query cache size
      const queryCache = queryClient.getQueryCache();
      const queries = queryCache.getAll();
      const reactQuerySize = JSON.stringify(queries).length;

      // Calculate AsyncStorage size (excluding auth tokens)
      const allKeys = await AsyncStorage.getAllKeys();
      const nonAuthKeys = allKeys.filter(
        (key) => !["auth_token", "user_data", "chamber_id"].includes(key)
      );

      let asyncStorageSize = 0;
      if (nonAuthKeys.length > 0) {
        const keyValuePairs = await AsyncStorage.multiGet(nonAuthKeys);
        asyncStorageSize = keyValuePairs.reduce((total, [key, value]) => {
          return total + (key?.length || 0) + (value?.length || 0);
        }, 0);
      }

      // Calculate expo-image cache size
      let imageCacheSize = 0;
      try {
        // expo-image uses FileSystem.cacheDirectory for caching
        const cacheDir = FileSystem.cacheDirectory;
        if (cacheDir) {
          const cacheInfo = await FileSystem.getInfoAsync(cacheDir);
          if (cacheInfo.exists && cacheInfo.isDirectory) {
            const files = await FileSystem.readDirectoryAsync(cacheDir);
            for (const file of files) {
              const fileInfo = await FileSystem.getInfoAsync(
                `${cacheDir}${file}`
              );
              if (fileInfo.exists && !fileInfo.isDirectory) {
                imageCacheSize += fileInfo.size || 0;
              }
            }
          }
        }
      } catch (error) {
        console.warn("Could not calculate image cache size:", error);
      }

      // Calculate FileSystem cache size (excluding image cache)
      let fileSystemSize = 0;
      try {
        const documentDir = FileSystem.documentDirectory;
        if (documentDir) {
          const docInfo = await FileSystem.getInfoAsync(documentDir);
          if (docInfo.exists && docInfo.isDirectory) {
            const files = await FileSystem.readDirectoryAsync(documentDir);
            for (const file of files) {
              const fileInfo = await FileSystem.getInfoAsync(
                `${documentDir}${file}`
              );
              if (fileInfo.exists && !fileInfo.isDirectory) {
                fileSystemSize += fileInfo.size || 0;
              }
            }
          }
        }
      } catch (error) {
        console.warn("Could not calculate file system size:", error);
      }

      const totalSize =
        reactQuerySize + asyncStorageSize + imageCacheSize + fileSystemSize;

      setStorageInfo({
        reactQuery: formatBytes(reactQuerySize),
        asyncStorage: formatBytes(asyncStorageSize),
        imageCache: formatBytes(imageCacheSize),
        fileSystem: formatBytes(fileSystemSize),
        total: formatBytes(totalSize),
      });
    } catch (error) {
      console.error("Error loading storage info:", error);
      showToast.error("Failed to load storage information");
    } finally {
      setIsLoading(false);
    }
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleClearCache = async () => {
    Alert.alert(
      "Clear Cache",
      "This will remove all cached data except your login information. This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear Cache",
          style: "destructive",
          onPress: async () => {
            try {
              setIsClearing(true);
              console.log("🗑️ Clear Cache - Starting cache clearing process");

              // Store auth tokens temporarily
              const authToken = await getToken();
              const userData = await getUserData();
              const chamberId = await getChamberId();

              // Clear React Query cache
              queryClient.clear();
              console.log("🗑️ Clear Cache - React Query cache cleared");

              // Clear expo-image cache
              try {
                const cacheDir = FileSystem.cacheDirectory;
                if (cacheDir) {
                  const cacheInfo = await FileSystem.getInfoAsync(cacheDir);
                  if (cacheInfo.exists && cacheInfo.isDirectory) {
                    const files = await FileSystem.readDirectoryAsync(cacheDir);
                    for (const file of files) {
                      await FileSystem.deleteAsync(`${cacheDir}${file}`, {
                        idempotent: true,
                      });
                    }
                    console.log(
                      `🗑️ Clear Cache - Cleared ${files.length} image cache files`
                    );
                  }
                }
              } catch (error) {
                console.warn(
                  "🗑️ Clear Cache - Could not clear image cache:",
                  error
                );
              }

              // Clear FileSystem document directory (excluding auth data)
              try {
                const documentDir = FileSystem.documentDirectory;
                if (documentDir) {
                  const docInfo = await FileSystem.getInfoAsync(documentDir);
                  if (docInfo.exists && docInfo.isDirectory) {
                    const files =
                      await FileSystem.readDirectoryAsync(documentDir);
                    for (const file of files) {
                      // Skip any auth-related files
                      if (
                        !file.includes("auth") &&
                        !file.includes("token") &&
                        !file.includes("user")
                      ) {
                        await FileSystem.deleteAsync(`${documentDir}${file}`, {
                          idempotent: true,
                        });
                      }
                    }
                    console.log(`🗑️ Clear Cache - Cleared file system cache`);
                  }
                }
              } catch (error) {
                console.warn(
                  "🗑️ Clear Cache - Could not clear file system cache:",
                  error
                );
              }

              // Clear all AsyncStorage except auth tokens
              const allKeys = await AsyncStorage.getAllKeys();
              const nonAuthKeys = allKeys.filter(
                (key) =>
                  !["auth_token", "user_data", "chamber_id"].includes(key)
              );

              if (nonAuthKeys.length > 0) {
                await AsyncStorage.multiRemove(nonAuthKeys);
                console.log(
                  `🗑️ Clear Cache - Removed ${nonAuthKeys.length} non-auth keys from AsyncStorage`
                );
              }

              // Restore auth tokens if they existed
              if (authToken) {
                await AsyncStorage.setItem("auth_token", authToken);
              }
              if (userData) {
                await AsyncStorage.setItem(
                  "user_data",
                  JSON.stringify(userData)
                );
              }
              if (chamberId !== null) {
                await AsyncStorage.setItem("chamber_id", chamberId.toString());
              }

              // Reload storage info
              await loadStorageInfo();

              showToast.success("Cache cleared successfully!");
              console.log("🗑️ Clear Cache - Cache clearing completed");
            } catch (error) {
              console.error("🗑️ Clear Cache - Error:", error);
              showToast.error("Failed to clear cache. Please try again.");
            } finally {
              setIsClearing(false);
            }
          },
        },
      ]
    );
  };

  return (
    <LinearGradient
      colors={[
        Theme.backgroundGradient.start,
        Theme.backgroundGradient.middle,
        Theme.backgroundGradient.end,
      ]}
      start={{ x: 0.5, y: 1 }}
      end={{ x: 0.5, y: 0 }}
      style={styles.gradient}
    >
      <SafeAreaView className="flex-1">
        <AppStatusBar barStyle="light-content" />
        <View className="flex-1 px-4 py-4">
          {/* Header */}
          <View className="flex-row items-center mb-6">
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <AntDesign name="left" size={24} color="white" />
            </TouchableOpacity>
            <Text
              className="text-white text-center flex-1 mr-6"
              style={{ fontFamily: "Inter", fontSize: TEXT_SIZES.lg }}
            >
              Cache
            </Text>
          </View>

          {/* Storage Information Section */}
          <Text className="text-white mb-4 ml-6" style={{ fontSize: TEXT_SIZES.lg ,fontFamily: "InterRegular"   }}>
          Cache sizes
          </Text>

          <View
            className="mb-6"
            style={{ backgroundColor: "#3A4049", borderRadius: 12 }}
          >
            <View className="flex-row justify-between items-center py-4 px-6 border-b border-white/10">
              <Text className="text-white" style={{ fontSize: TEXT_SIZES.sm ,fontFamily: "InterRegular"   }}>
                React Query Cache
              </Text>
              <Text className="text-white" style={{ fontSize: TEXT_SIZES.sm ,fontFamily: "InterRegular" }}>
                {isLoading ? "Loading..." : storageInfo.reactQuery}
              </Text>
            </View>

            <View className="flex-row justify-between items-center py-4 px-6 border-b border-white/10">
              <Text className="text-white" style={{ fontSize: TEXT_SIZES.sm ,fontFamily: "InterRegular"     }}>
                App Storage
              </Text>
              <Text className="text-white" style={{ fontSize: TEXT_SIZES.sm ,fontFamily: "InterRegular" }}>
                {isLoading ? "Loading..." : storageInfo.asyncStorage}
              </Text>
            </View>

            <View className="flex-row justify-between items-center py-4 px-6 border-b border-white/10">
              <Text className="text-white" style={{ fontSize: TEXT_SIZES.sm ,fontFamily: "InterRegular" }}>
                Image Cache
              </Text>
              <Text className="text-white" style={{ fontSize: TEXT_SIZES.sm ,fontFamily: "InterRegular"}}>
                {isLoading ? "Loading..." : storageInfo.imageCache}
              </Text>
            </View>

            <View className="flex-row justify-between items-center py-4 px-6 border-b border-white/10">
              <Text className="text-white" style={{ fontSize: TEXT_SIZES.sm ,fontFamily: "InterRegular"}}>
                File System
              </Text>
              <Text className="text-white" style={{ fontSize: TEXT_SIZES.sm ,fontFamily: "InterRegular" }}>
                {isLoading ? "Loading..." : storageInfo.fileSystem}
              </Text>
            </View>

            <View className="flex-row justify-between items-center py-4 px-6">
              <Text
                className="text-white font-semibold"
                style={{ fontSize: TEXT_SIZES.sm ,fontFamily: "InterRegular"}}
              >
                Total Cache
              </Text>
              <Text
                className="text-white font-semibold"
                style={{ fontSize: TEXT_SIZES.sm ,fontFamily: "InterRegular"}}
              >
                {isLoading ? "Loading..." : storageInfo.total}
              </Text>
            </View>
          </View>

          {/* Refresh Button */}
          <TouchableOpacity
            className="rounded-[36px] py-4 items-center mb-4"
            style={{ backgroundColor: "#3A4049" }}
            onPress={loadStorageInfo}
            disabled={isLoading}
          >
            <Text
              className="text-white text-center font-semibold"
              style={{ fontSize: TEXT_SIZES.md ,fontFamily: "InterRegular" }}
            >
              {isLoading ? "Refreshing..." : "Refresh Storage Info"}
            </Text>
          </TouchableOpacity>

          {/* Clear Cache Button */}
          <TouchableOpacity
            className={`rounded-[36px] py-4 items-center ${
              isClearing ? "opacity-50" : ""
            }`}
            style={{ backgroundColor: "#EB43354D" }}
            onPress={handleClearCache}
            disabled={isClearing}
          >
            <Text
              className="text-[#EB4335] text-center font-bold"
              style={{ fontSize: TEXT_SIZES.md }}
            >
              {isClearing ? "Clearing..." : "Clear Cache"}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
});

export default SettingsClearCacheScreen;
