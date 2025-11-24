import { View, Text, ActivityIndicator } from "react-native";
import React, { FC } from "react";
import { MaterialIcons } from "@expo/vector-icons";

const RenderFooter: FC<{
  isLoadingMore: boolean;
  hasNextPage: boolean;
  text: string;
}> = ({ isLoadingMore, hasNextPage, text = "Data" }) => {
  return (
    <View>
      {isLoadingMore ? (
        <View className="py-4 items-center justify-center flex-row gap-2">
          <ActivityIndicator size="small" color="#4ECCA3" />
          <Text className="text-gray-400 text-sm">Loading more {text}...</Text>
        </View>
      ) : null}
      {!hasNextPage && !isLoadingMore ? (
        <View className="py-6 items-center flex-col">
          <MaterialIcons name="check-circle" size={28} color="#4ECCA3" />
          <Text className="text-gray-400 text-sm mt-2">
            🎉 You've reached the end! No more {text}.
          </Text>
        </View>
      ) : null}
    </View>
  );
};

export default RenderFooter;
