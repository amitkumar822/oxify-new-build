import React from "react";
import { View, Text, ActivityIndicator } from "react-native";

type RenderEmptyProps = {
  isLoading?: boolean;
  message?: string;
};

export const RenderEmptyComponent: React.FC<RenderEmptyProps> = ({
  isLoading = false,
  message = "No data found",
}) => {
  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center py-10">
        <ActivityIndicator size="large" color="#374151" />
        <Text className="mt-2 text-gray-600">Loading...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 items-center justify-center py-10">
      <Text className="text-gray-500">{message}</Text>
    </View>
  );
};
