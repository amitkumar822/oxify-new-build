import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Theme } from "../constants";
import { SafeAreaView } from "react-native-safe-area-context";

interface PlaceholderScreenProps {
  screenName: string;
}

const PlaceholderScreen: React.FC<PlaceholderScreenProps> = ({
  screenName,
}) => {
  return (
    <View className="flex-1 bg-gray-950">
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
          <Text style={styles.title}>{screenName}</Text>
          <Text style={styles.subtitle}>Screen implementation coming soon</Text>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Theme.background.dark,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: Theme.text.inverse,
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: Theme.text.secondary,
    textAlign: "center",
  },
});

export default PlaceholderScreen;
