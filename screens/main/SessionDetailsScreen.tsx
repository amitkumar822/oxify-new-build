import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StatusBar,
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
const { useNavigation } = require("@react-navigation/native");
import { Theme } from "@/constants";
import { sessionApi } from "@/api/session";
import { SafeAreaView } from "react-native-safe-area-context";
import SessionDetailsSkeletonScreen from "./skeleton/SessionDetailsSkeletonScreen";
import ShadowHeader from "@/components/common/ShadowHeader";

interface SessionCardData {
  id: number;
  date: string; // ISO date string
  ataLevel: string;
  protocol: string;
  duration: string;
  frequency: string;
  mood: string;
}

const perPage = 10;

const SessionDetailsScreen: React.FC = () => {
  const navigation = useNavigation();
  const [sessions, setSessions] = useState<SessionCardData[]>([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSessions = async (pageNumber = 1, replace = false) => {
    try {
      if (pageNumber === 1) setIsLoading(true);
      else setLoadingMore(true);

      const res = await sessionApi.getSessions({ page: pageNumber, perPage });
      if (res?.success && res.data) {
        const payload: any = res.data;
        const list = Array.isArray(payload?.data) ? payload.data : [];

        const mapped: SessionCardData[] = list.map((item: any) => {
          const us = item.user_session || {};
          return {
            id: item.id,
            date: us.created_at || new Date().toISOString(),
            ataLevel: String(us.ata_level ?? ""),
            protocol: String(us.protocol ?? ""),
            duration: String(us.duration_minutes ?? ""),
            frequency: String(us.frequency ?? ""),
            mood: String(item.session_status ?? us.status ?? ""),
          };
        });

        if (replace) {
          setSessions(mapped);
        } else {
          setSessions((prev) => [...prev, ...mapped]);
        }

        // Check if we have more pages based on returned data length
        if (list.length < perPage) {
          setHasNextPage(false);
        } else {
          setHasNextPage(payload?.hasNextPage ?? true);
        }

        setError(
          mapped.length === 0 && pageNumber === 1 ? "No sessions found" : null
        );
      } else {
        if (pageNumber === 1) setSessions([]);
        setError("Failed to load sessions");
      }
    } catch (e) {
      if (pageNumber === 1) setSessions([]);
      setError("Failed to load sessions");
    } finally {
      setIsLoading(false);
      setLoadingMore(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchSessions(1, true);
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    setPage(1);
    fetchSessions(1, true);
  };

  const loadMore = () => {
    if (!loadingMore && hasNextPage) {
      setLoadingMore(true);
      const nextPage = page + 1;
      setPage(nextPage);
      fetchSessions(nextPage);
    }
  };

  const formatDateWithOrdinal = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleDateString("en-US", { month: "long" });
    const year = date.getFullYear();

    // Get ordinal suffix
    const getOrdinalSuffix = (day: number) => {
      if (day > 3 && day < 21) return "th";
      switch (day % 10) {
        case 1:
          return "st";
        case 2:
          return "nd";
        case 3:
          return "rd";
        default:
          return "th";
      }
    };

    return { day, month, year, suffix: getOrdinalSuffix(day) };
  };

  const renderSessionCard = (session: SessionCardData) => {
    const dateParts = formatDateWithOrdinal(session.date);

    return (
      <View
        key={session.id}
        className="bg-[#3A4049] rounded-[12px] py-4 pl-4 mb-4"
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 8,
        }}
      >
        <View className="flex-row justify-between items-center mb-6 pr-4">
          <Text
            style={{ fontSize: 16, fontFamily: "InterSemiBold", color: Theme.text.white }}
          >
            Session Details
          </Text>
          <View className="bg-white bg-opacity-90 px-[5px] py-1 rounded-[6px]">
            <Text
              style={{ fontSize: 10, fontFamily: "InterSemiBold", color: "#6189AD", position: "relative" }}
            >
              <Text>{dateParts.day}</Text>
              <View className="absolute top-0 left-0">
                <Text
                  style={{
                    fontSize: 12 * 0.55,
                    lineHeight: 12 * 0.7,
                    fontFamily: "InterSemiBold",
                    color: "#6189AD",
                  }}
                >
                  {dateParts.suffix}
                </Text>
              </View>
              <Text> {dateParts.month} {dateParts.year}</Text>
            </Text>
          </View>
        </View>

        <View className="space-y-5">
          {[
            { label: "ATA Level", value: session.ataLevel },
            { label: "Protocol", value: session.protocol },
            { label: "Duration", value: session.duration },
            { label: "Frequency", value: session.frequency },
            { label: "Mood", value: session.mood },
          ].map((row, idx) => (
            <View
              key={idx}
              className={`flex-row justify-between items-center ${idx < 4 ? "py-3" : "pt-3"} border-t border-opacity-40"
                }`}
              style={{
                borderBlockColor: "rgba(97, 107, 121, 0.6)"
              }}
            >
              <Text
                className="text-white"
                style={{ fontSize: 11, fontFamily: "InterRegular" }}
              >
                {row.label}
              </Text>
              <Text
                style={{ fontSize: 13, fontFamily: "InterMedium", color: "#FFFFFF", paddingRight: 16 }}
              >
                {row.value}
              </Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  const renderFooter = () => {
    if (loadingMore) {
      return (
        <View className="py-4 items-center">
          <ActivityIndicator size="small" color="#4ECCA3" />
          <Text className="text-gray-400 text-sm mt-2">
            Loading more sessions...
          </Text>
        </View>
      );
    }
    if (!hasNextPage) {
      return (
        <View className="py-6 items-center">
          <Text className="text-gray-400 text-sm">
            🎉 You’ve reached the end!
          </Text>
        </View>
      );
    }
    return null;
  };

  if (isLoading && page === 1) {
    return <SessionDetailsSkeletonScreen navigation={navigation} />;
  }

  return (
    <LinearGradient
      colors={[
        "#243551",
        "#242D3C",
        "#14181B",
      ]}
      style={styles.gradient}
    >
      <SafeAreaView className="flex-1">
        <StatusBar barStyle="light-content" />

        {/* Shadow Header */}
        <ShadowHeader onPress={() => navigation.goBack()} title="Recent Sessions" />


        {isLoading ? (
          <View className="items-center justify-center py-10">
            <ActivityIndicator size="large" color="white" />
            <Text className="text-white mt-2">Loading sessions...</Text>
          </View>
        ) : error ? (
          <View className="items-center justify-center py-10">
            <Text className="text-white">{error}</Text>
          </View>
        ) : (
          <FlatList
            data={sessions}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => renderSessionCard(item)}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            onEndReached={loadMore}
            onEndReachedThreshold={0.3}
            ListFooterComponent={renderFooter}
            contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
            showsVerticalScrollIndicator={false}
          />
        )}
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    paddingTop: 16,
  },
});

export default SessionDetailsScreen;
