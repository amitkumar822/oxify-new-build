import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
const { useNavigation } = require("@react-navigation/native");
import { storeChamberId, getChamberId } from "../../utils/tokenManager";
import { useAuth } from "../../contexts/AuthContext";
import { showToast } from "../../config/toast";
import { chamberApi } from "../../api/chamber";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppStatusBar } from "../../helpers/AppStatusBar";
import { TEXT_SIZES } from "@/constants/textSizes";
import RenderChamberCard from "@/components/common/RenderChamberCard";
import { ChamberModel as ChamberModelType } from "@/screens/main/ChamberSelectionScreen";

// Chamber model interface based on API response
interface ChamberModel {
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

const SettingsChamberModelScreen: React.FC = () => {
  const navigation: any = useNavigation();
  const { updateChamberSelection } = useAuth();
  // const [chamberModels, setChamberModels] = useState<ChamberModel[]>([]);
  const [filteredModels, setFilteredModels] = useState<ChamberModel[]>([]);
  const [selectedModel, setSelectedModel] = useState<ChamberModel | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // ------------- Pagination ------------------
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [chamberModels, setChamberModels] = useState<ChamberModel[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  // ------------- Pagination End ------------------
  useEffect(() => {
    fetchChamberModels();
  }, []);
  useEffect(() => {
    if (chamberModels.length > 0) {
      loadCurrentChamberSelection();
    }
  }, [chamberModels]);
  const loadCurrentChamberSelection = async () => {
    try {
      const currentChamberId = await getChamberId();
      if (currentChamberId) {
        // Find the model with this ID and set it as selected
        const currentModel = chamberModels.find(
          (model) => model.id === currentChamberId
        );
        if (currentModel) {
          setSelectedModel(currentModel);
        }
      }
    } catch (error) {
      console.error("Error loading current chamber selection:", error);
    }
  };
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
  const fetchChamberModels = async (isRefresh = false, isLoadMore = false) => {
    try {
      if (isRefresh) {
        setIsRefreshing(true);
        setPage(1);
      } else if (isLoadMore) {
        setIsLoadingMore(true);
      } else {
        setIsLoading(true);
      }
      const currentPage = isRefresh ? 1 : page;
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
        // Update pagination state
        setHasNextPage(payload.hasNextPage || false);
        setTotalCount(payload.count || 0);
        if (isRefresh || currentPage === 1) {
          // Replace data for refresh or first load
          setChamberModels(list);
          setFilteredModels(list);
        } else if (isLoadMore) {
          // Append data for load more
          setChamberModels((prev) => [...prev, ...list]);
          setFilteredModels((prev) => [...prev, ...list]);
        }
        setError(
          list.length === 0 && currentPage === 1
            ? "No chamber models found"
            : null
        );
      } else {
        if (currentPage === 1) {
          setChamberModels([]);
          setFilteredModels([]);
          setError("Failed to load chamber models");
        }
      }
    } catch (error) {
      console.error("Error fetching chamber models:", error);
      if (page === 1) {
        setChamberModels([]);
        setFilteredModels([]);
        setError("Failed to load chamber models");
      }
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
      setIsLoadingMore(false);
    }
  };
  // Removed static sample list; rely solely on API
  const handleModelSelect = (model: ChamberModel) => {
    setSelectedModel(model);
  };
  const handleLoadMore = () => {
    if (hasNextPage && !isLoadingMore && !isLoading) {
      setPage((prev) => prev + 1);
      fetchChamberModels(false, true);
    }
  };
  const handleRefresh = () => {
    fetchChamberModels(true, false);
  };
  const handleUpdate = async () => {
    if (selectedModel) {
      try {
        // Save chamber ID to local storage
        await storeChamberId(selectedModel.id);
        // Update auth context
        updateChamberSelection(true);
        showToast.success(`Chamber model updated to ${selectedModel.name}`);
        navigation.goBack();
      } catch (error) {
        console.error("Error updating chamber model:", error);
        showToast.error("Failed to update chamber model");
      }
    } else {
      showToast.error("Please select a chamber model first");
    }
  };

  const renderChamberCard = ({ item: model }: { item: ChamberModel }) => {
    const isSelected = selectedModel?.id === model.id;
    return (
      <RenderChamberCard
        model={model as ChamberModelType}
        isSelected={isSelected}
        onPress={handleModelSelect}
      />
    );
  };

  const renderFooter = () => {
    if (!isLoadingMore) return null;

    return (
      <View className="py-4 items-center">
        <ActivityIndicator size="small" color="#4ECCA3" />
        <Text className="text-gray-300 mt-2">Loading more...</Text>
      </View>
    );
  };
  const renderEmptyComponent = () => {
    if (isLoading) return null;

    return (
      <View className="items-center justify-center py-10">
        <Text className="text-gray-300">
          {error || "No chamber models found"}
        </Text>
      </View>
    );
  };
  return (
    <LinearGradient
      colors={["#243551", "#171D27", "#14181B"]}
      style={styles.gradient}
    >
      <SafeAreaView className="flex-1">
        <AppStatusBar barStyle="light-content" />
        <View className="flex-1">
          {/* Header */}
          <View className="flex-row items-center justify-center mb-7 pt-4 relative w-full">
            {/* Back Button */}
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              className="absolute left-0 "
            >
              <AntDesign name="left" size={23} color="white" />
            </TouchableOpacity>
            {/* Title */}
            <Text
              className="text-white "
              style={{
                fontFamily: "InterSemiBold",
                textAlign: "center",
                fontSize: TEXT_SIZES.lg,
              }}
            >
              Chamber Model
            </Text>
          </View>
          {/* Instructions */}
          <Text
            className="text-white mb-2"
            style={{ fontFamily: "InterMedium", fontSize: 16 }}
          >
            Select your Chamber Model
          </Text>
          {/* Search Bar */}
          <View
            className="bg-white rounded-[12px] px-4 mb-4 flex-row items-center"
            style={{ borderWidth: 1, borderColor: "#8BAFCE" }}
          >
            <TextInput
              className="flex-1 text-black "
              placeholder="Search chamber model"
              placeholderTextColor="#797979"
              value={searchQuery}
              onChangeText={setSearchQuery}
              style={{
                paddingVertical: 12,
                fontFamily: "InterRegular",
                fontSize: 12,
                textAlign: "left",
              }}
            />
            <Feather name="search" size={18} color="#8BAFCE" />
          </View>
          {/* Chamber Models Grid */}
          <View className="flex-1 mb-6">
            {isLoading ? (
              <View className="items-center justify-center py-10">
                <ActivityIndicator size="large" color="#4ECCA3" />
                <Text className="text-gray-300 mt-2">Loading chambers...</Text>
              </View>
            ) : (
              <FlatList
                data={filteredModels}
                renderItem={renderChamberCard}
                keyExtractor={(item) => item.id.toString()}
                numColumns={2}
                columnWrapperStyle={{ justifyContent: "space-between" }}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                  paddingBottom: 20,
                  flexGrow: filteredModels.length === 0 ? 1 : 0,
                }}
                ListEmptyComponent={renderEmptyComponent}
                ListFooterComponent={renderFooter}
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.5}
                refreshControl={
                  <RefreshControl
                    refreshing={isRefreshing}
                    onRefresh={handleRefresh}
                    colors={["#4ECCA3"]}
                    tintColor="#4ECCA3"
                    title="Pull to refresh"
                    titleColor="#9CA3AF"
                  />
                }
              />
            )}
          </View>
          {/* Update Button */}
          <TouchableOpacity
            className="bg-[#6189AD] rounded-full py-3 items-center"
            onPress={handleUpdate}
          >
            {/* #6189AD */}
            <Text
              className="text-white font-semibold"
              style={{ fontSize: 16, fontFamily: "InterSemiBold" }}
            >
              Update
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
    paddingHorizontal: 16,
  },
});

export default SettingsChamberModelScreen;
