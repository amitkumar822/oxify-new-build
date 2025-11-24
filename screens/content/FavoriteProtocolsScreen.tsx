import React, { useState, useEffect } from "react";
import {
  FlatList,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import AntDesign from "@expo/vector-icons/AntDesign";
const { useNavigation } = require("@react-navigation/native");
import ProtocolCard from "@/components/content/ProtocolCard";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppStatusBar } from "../../helpers/AppStatusBar";
import { TEXT_SIZES } from "@/constants/textSizes";
import { Theme, SCREEN_NAMES } from "@/constants";
import {
  useFavoriteProtocols,
  useToggleFavoriteProtocol,
} from "@/hooks/useProtocol";
import RenderFooter from "@/components/common/RenderFooter";
import { RenderEmptyComponent } from "@/components/common/renderEmptyComponent";

const perPage = 10;

const FavoriteProtocolsScreen: React.FC = () => {
  const navigation: any = useNavigation();

  // Pagination state
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [favoriteList, setFavoriteList] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const { data: favoriteProtocols, isLoading } = useFavoriteProtocols({
    page,
    perPage,
  });
  const toggleFavoriteMutation = useToggleFavoriteProtocol();

  useEffect(() => {
    if (favoriteProtocols?.success && favoriteProtocols.data) {
      const payload: any = favoriteProtocols.data;
      const list: any[] = Array.isArray(payload?.data) ? payload.data : [];

      if (page === 1) {
        setFavoriteList(list);
      } else {
        setFavoriteList((prev) => [...prev, ...list]);
      }

      setHasNextPage(payload?.hasNextPage ?? false);
      setIsLoadingMore(false);
      setRefreshing(false);
      setError(
        list.length === 0 && page === 1 ? "No favorite protocols found" : null
      );
    } else if (favoriteProtocols && !favoriteProtocols.success) {
      setError("Failed to load favorite protocols");
    }
  }, [favoriteProtocols, page, refreshing]);

  const handleLoadMore = () => {
    if (hasNextPage && !isLoadingMore && !isLoading) {
      setIsLoadingMore(true);
      setPage((prev) => prev + 1);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setPage(1);
    setHasNextPage(false);
    setError(null);
  };

  useEffect(() => {
    if (isLoadingMore) {
      setIsLoadingMore(false);
    }
    if (refreshing) {
      setRefreshing(false);
    }
  }, [favoriteProtocols, refreshing, isLoadingMore]);

  const handleLikeToggle = (protocolId: number) => {
    toggleFavoriteMutation.mutate(protocolId);
  };

  const renderProtocolCard = ({ item: favoriteItem }: { item: any }) => {
    const protocol = favoriteItem.protocol;
    return (
      <ProtocolCard
        key={favoriteItem.id}
        title={protocol.name}
        description={protocol.description || ""}
        ata={
          protocol.recommended_ata
            ? `${protocol.recommended_ata} ATA Level`
            : ""
        }
        duration={protocol.recommended_duration || ""}
        repeat={
          protocol.recommended_frequency
            ? `Repeat ${protocol.recommended_frequency} Days`
            : ""
        }
        liked={true}
        onLikeToggle={() => handleLikeToggle(protocol.id)}
        raw={{
          id: protocol.id,
          recommended_ata: protocol.recommended_ata,
          recommended_duration: protocol.recommended_duration,
        }}
        onStart={() => {
          const dur = String(protocol.recommended_duration || "");
          let minutes = 0;
          let seconds = 0;
          const parts = dur.split(":");
          if (parts.length === 3) {
            const hh = parseInt(parts[0] || "0", 10) || 0;
            const mm = parseInt(parts[1] || "0", 10) || 0;
            const ss = parseInt(parts[2] || "0", 10) || 0;
            minutes = hh * 60 + mm;
            seconds = ss;
          }

          navigation.getParent()?.navigate(
            SCREEN_NAMES.SESSION_SETUP as never,
            {
              preset: {
                protocol: {
                  protocol: protocol.id,
                  name: protocol.name,
                },
                ataLevel: protocol.recommended_ata || undefined,
                duration: { minutes, seconds },
              },
            } as never
          );
        }}
      />
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
          <View className="relative flex-row items-center justify-center mb-6 w-full">
            {/* Back Button */}
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              className="absolute left-0"
            >
              <AntDesign name="left" size={24} color="white" />
            </TouchableOpacity>

            {/* Centered Title */}
            <Text
              className="text-white  text-center"
              style={{ fontFamily: "Inter", fontSize: TEXT_SIZES.lg }}
            >
              Favorite Protocols
            </Text>
          </View>

          {isLoading && page === 1 ? (
            <View className="items-center justify-center flex-1">
              <ActivityIndicator size="large" color="white" />
              <Text className="text-white mt-2">
                Loading favorite protocols...
              </Text>
            </View>
          ) : error ? (
            <View className="items-center justify-center flex-1">
              <Text className="text-white">
                {error || "Failed to load favorite protocols"}
              </Text>
              <TouchableOpacity
                className="mt-2 px-4 py-2 bg-blue-500 rounded-lg"
                onPress={handleRefresh}
              >
                <Text className="text-white">Retry</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <FlatList
              data={favoriteList}
              renderItem={renderProtocolCard}
              keyExtractor={(item) => item.id.toString()}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                paddingBottom: 20,
                flexGrow: favoriteList.length === 0 ? 1 : 0,
              }}
              ListEmptyComponent={() => (
                <RenderEmptyComponent
                  isLoading={isLoading}
                  message="No favorite protocols found"
                />
              )}
              onEndReached={handleLoadMore}
              onEndReachedThreshold={0.3}
              ListFooterComponent={() => (
                <RenderFooter
                  isLoadingMore={isLoadingMore}
                  hasNextPage={hasNextPage}
                  text="protocols"
                />
              )}
              refreshing={refreshing}
              onRefresh={handleRefresh}
            />
          )}
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

export default FavoriteProtocolsScreen;
