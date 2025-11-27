import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  Image,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
const { useNavigation } = require("@react-navigation/native");
import { chamberApi } from "../../api/chamber";
import { showToast } from "../../config/toast";
import { storeChamberId } from "../../utils/tokenManager";
import { useAuth } from "../../contexts/AuthContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { Theme } from "../../constants";
import Feather from "@expo/vector-icons/Feather";
import { BackHeader } from "@/helpers/BackHeader";
import RenderChamberCard from "@/components/common/RenderChamberCard";

export interface ChamberModel {
  id: number;
  sku: string;
  name: string;
  chamber_type: string;
  category: string;
  max_ata_level: Array<{
    id: number;
    level: string;
    created_at: string;
    updated_at: string;
  }>;
  description: string;
  is_active: boolean;
  image: string;
  protocol: any[];
}

const perPage = 10;

const ChamberSelectionScreen: React.FC = () => {
  const navigation: any = useNavigation();
  const { hasChamberSelected, updateChamberSelection } = useAuth();
  const [chamberModels, setChamberModels] = useState<ChamberModel[]>([]);
  const [filteredModels, setFilteredModels] = useState<ChamberModel[]>([]);
  const [selectedModel, setSelectedModel] = useState<ChamberModel | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Pagination state
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchChamberModels = async (
    currentPage: number,
    isFirstLoad = false,
    isRefresh = false
  ) => {
    try {
      if (isFirstLoad) {
        setIsLoading(true);
      } else if (isRefresh) {
        setRefreshing(true);
      } else {
        setIsLoadingMore(true);
      }

      const response = await chamberApi.getChambersList({
        page: currentPage,
        perPage,
      });

      if (response?.success && response.data) {
        const payload: any = response.data;
        const list: ChamberModel[] = Array.isArray(payload?.data)
          ? payload.data.map((item: any) => ({
              id: item.id,
              sku: item.sku,
              name: item.name,
              chamber_type: item.chamber_type,
              category: item.category,
              max_ata_level: item.max_ata_level || [],
              description: item.description,
              is_active: item.is_active,
              image: item.image,
              protocol: item.protocol || [],
            }))
          : [];

        if (isFirstLoad || isRefresh) {
          setChamberModels(list);
        } else {
          setChamberModels((prev) => [...prev, ...list]);
        }

        setFilteredModels((prev) =>
          isFirstLoad || isRefresh ? list : [...prev, ...list]
        );

        setHasNextPage(payload?.hasNextPage ?? false);
        setPage(currentPage);
        setError(list.length === 0 ? "No chamber models found" : null);
      } else {
        setError("Failed to load chamber models");
      }
    } catch (error) {
      console.error("Error fetching chamber models:", error);
      setError("Failed to load chamber models");
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    // Check if user already has a chamber selected
    if (hasChamberSelected) {
      navigation.replace("TabNavigator");
      return;
    }

    fetchChamberModels(1, true);
  }, [hasChamberSelected, navigation]);

  useEffect(() => {
    // Filter models based on search query
    if (searchQuery.trim() === "") {
      setFilteredModels(chamberModels);
    } else {
      const filtered = chamberModels.filter(
        (model) =>
          model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          model.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          model.chamber_type.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredModels(filtered);
    }
  }, [searchQuery, chamberModels]);

  const handleLoadMore = () => {
    if (hasNextPage && !isLoadingMore) {
      fetchChamberModels(page + 1);
    }
  };

  const handleRefresh = () => {
    fetchChamberModels(1, false, true); // reset to page 1
  };

  const handleModelSelect = (model: ChamberModel) => {
    setSelectedModel(model);
  };

  const handleContinue = async () => {
    if (selectedModel) {
      try {
        // Save chamber ID to local storage
        await storeChamberId(selectedModel.id);

        // Update auth context to reflect chamber selection
        updateChamberSelection(true);

        // Navigate to dashboard with selected chamber
        navigation.replace("TabNavigator");
        showToast.success(`Selected ${selectedModel.name}`);
      } catch (error) {
        console.error("Error saving chamber ID:", error);
        showToast.error("Failed to save chamber selection");
      }
    } else {
      showToast.error("Please select a chamber model first");
    }
  };

  const renderChamberCard = ({ item: model }: { item: ChamberModel }) => {
    const isSelected = selectedModel?.id === model.id;

    return (
      <RenderChamberCard
        model={model}
        isSelected={isSelected}
        onPress={handleModelSelect}
      />
    );
  };

  return (
    <LinearGradient
      colors={[
        Theme.dashboardGradient.start,
        Theme.dashboardGradient.middle,
        Theme.dashboardGradient.end,
      ]}
      style={styles.gradient}
    >
      <SafeAreaView className="flex-1">
        {/* Back Header */}
        <BackHeader />

        <View className="flex-1 pt-6">
          <View className="items-center">
            <View className="flex-row items-center mb-[35.5px]">
              <Image
                source={require("../../assets/images/oxify_logo_with_name.png")}
                style={{
                  width: 128,
                  height: 45,
                  resizeMode: "contain",
                  marginRight: 6,
                }}
              />
            </View>
          </View>

          {/* Title */}
          <Text
            className="text-white text-left  mb-[10px]"
            style={styles.title}
          >
            Select your Chamber Model
          </Text>

          {/* Search Bar */}
          <View
            className="bg-white rounded-xl px-4 mb-4 flex-row items-center justify-between"
            style={{ borderWidth: 1, borderColor: "#8BAFCE" }}
          >
            <TextInput
              className="flex-1 text-gray-900 "
              placeholder="Search chamber model"
              placeholderTextColor="#9CA3AF"
              value={searchQuery}
              onChangeText={setSearchQuery}
              style={styles.searchInput}
            />
            <Feather name="search" size={17} color="#8BAFCE" />
          </View>

          {/* Chamber Models Grid */}
          {isLoading ? (
            <View className="items-center justify-center flex-1">
              <ActivityIndicator size="large" color="#4ECCA3" />
              <Text className="text-gray-300 mt-2">Loading chambers...</Text>
            </View>
          ) : error ? (
            <View className="items-center justify-center flex-1">
              <Text className="text-gray-300">{error}</Text>
            </View>
          ) : (
            <FlatList
              data={filteredModels}
              renderItem={renderChamberCard}
              keyExtractor={(item) => item.id.toString()}
              numColumns={2}
              columnWrapperStyle={{ justifyContent: "space-between" }}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 20 }}
              onEndReached={handleLoadMore}
              onEndReachedThreshold={0.3}
              refreshing={refreshing}
              onRefresh={handleRefresh}
              ListEmptyComponent={() => (
                <View className="items-center justify-center py-10">
                  <Text className="text-gray-300">No chamber models found</Text>
                </View>
              )}
            />
          )}

          {/* Continue Button */}
          <>
            <TouchableOpacity
              className={`w-full py-[18px] px-6 items-center justify-center`}
              style={{
                backgroundColor: selectedModel ? "#F3F3F3" : "#b9b1b1",
                // marginBottom: 20,
                borderRadius: 14,
              }}
              onPress={handleContinue}
              disabled={!selectedModel}
            >
              <Text
                style={{
                  color: selectedModel ? "#090B0D" : "#9CA3AF",
                  fontFamily: "InterSemiBold",
                  fontSize: 16,
                }}
              >
                Continue
              </Text>
            </TouchableOpacity>
          </>
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
    paddingHorizontal: 16,
  },
  title: {
    fontFamily: "InterRegular",
    fontSize: 16,
    color: "#FFFFFF",
  },
  searchInput: {
    paddingVertical: 12,
    fontFamily: "InterRegular",
    fontSize: 12,
  },
});

export default ChamberSelectionScreen;
