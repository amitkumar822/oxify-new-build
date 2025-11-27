import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  ActivityIndicator,
  Animated,
  FlatList,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
const { useNavigation, useRoute } = require("@react-navigation/native");
import { Theme, SCREEN_NAMES } from "@/constants";
import { Image } from "react-native";
import ArticleCard from "../../components/content/ArticleCard";
import ProtocolCard from "../../components/content/ProtocolCard";
import PostArticleBottomSheet from "../../components/content/PostArticleBottomSheet";
import {
  useProtocolCategoryList,
  useSuggestedProtocolsFiltered,
  useToggleFavoriteProtocol,
} from "@/hooks/useProtocol";
import {
  useLearningContent,
  useLearningCategories,
  useToggleFavoriteLearningContent,
} from "@/hooks/useLearning";
import { SafeAreaView } from "react-native-safe-area-context";
import RenderFooter from "@/components/common/RenderFooter";
import { RenderEmptyComponent } from "@/components/common/renderEmptyComponent";
import TabSwitcher from "./TabSwitcher";
import { Shadow } from "react-native-shadow-2";
import { capitalizeFirst } from "@/utils/capitalizeFirst";

// ArticleCard will be imported from SavedArticlesScreen
const perPage = 20;

const ProtocolsHubScreen: React.FC = () => {
  const route = useRoute();
  const routeParams = route.params as
    | { activeTab?: "protocols" | "articles" }
    | undefined;

  const [activeTab, setActiveTab] = useState<"protocols" | "articles">(
    routeParams?.activeTab || "protocols"
  );
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [articleSearchInput, setArticleSearchInput] = useState("");
  const [articleSearch, setArticleSearch] = useState("");
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const articleDebounceRef = useRef<NodeJS.Timeout | null>(null);
  const [activeCategoryId, setActiveCategoryId] = useState<number | undefined>(
    undefined
  );
  const [activeLearningCategoryId, setActiveLearningCategoryId] = useState<
    number | undefined
  >(undefined);
  const [isPostArticleOpen, setIsPostArticleOpen] = useState(false);
  const refreshAnimation = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation();

  const { data: categories, isLoading: isCategoriesLoading } =
    useProtocolCategoryList();

  //================== Start Protocols Pagination ==================
  const [protocolsPage, setProtocolsPage] = useState(1);
  const [protocolsHasNextPage, setProtocolsHasNextPage] = useState(true);
  const [protocolsRefreshing, setProtocolsRefreshing] = useState(false);
  const [isProtocolsLoadingMore, setIsProtocolsLoadingMore] = useState(false);
  const [protocols, setProtocols] = useState<any[]>([]);

  const {
    data: suggested,
    isLoading: isProtocolsLoading,
    refetch: refetchProtocols,
  } = useSuggestedProtocolsFiltered({
    protocolCategoryId: activeCategoryId,
    search,
    page: protocolsPage,
    perPage,
  });

  useEffect(() => {
    if (suggested?.success && suggested?.data) {
      const payload: any = suggested?.data;
      if (protocolsPage === 1) {
        setProtocols(payload?.data);
      } else {
        setProtocols((prev) => [...prev, ...payload?.data]);
      }
      setProtocolsHasNextPage(payload?.hasNextPage ?? false);
      setIsProtocolsLoadingMore(false);
    }
  }, [suggested?.data, protocolsPage]);

  const handleLoadMoreProtocols = () => {
    if (
      protocolsHasNextPage &&
      !isProtocolsLoadingMore &&
      !isProtocolsLoading
    ) {
      setProtocolsPage((prev) => prev + 1);
      setIsProtocolsLoadingMore(true);
    }
  };

  const handleRefreshProtocols = () => {
    setProtocolsPage(1);
    setIsProtocolsLoadingMore(false);
    setProtocolsRefreshing(true);
    refetchProtocols().finally(() => {
      setProtocolsRefreshing(false);
    });
  };

  const handleLikeToggle = async (protocolId: number) => {
    const previous = protocols;
    setProtocols((prev) =>
      prev.map((p) =>
        p.id === protocolId
          ? { ...p, is_favourite_protocol: !p.is_favourite_protocol }
          : p
      )
    );
    try {
      await toggleFavoriteMutation.mutateAsync(protocolId);
    } catch (e) {
      setProtocols(previous);
    }
  };

  const renderProtocolCard = ({ item: p }: { item: any }) => {
    return (
      <ProtocolCard
        key={p.id}
        title={p.name}
        description={p.description || ""}
        ata={p.recommended_ata ? `${p.recommended_ata} ATA Level` : ""}
        duration={p.recommended_duration || ""}
        repeat={
          p.recommended_frequency
            ? `Repeat ${p.recommended_frequency} Days`
            : ""
        }
        liked={p.is_favourite_protocol}
        onLikeToggle={() => handleLikeToggle(p.id)}
        raw={{
          id: p.id,
          recommended_ata: p.recommended_ata,
          recommended_duration: p.recommended_duration,
        }}
        onStart={() => {
          const dur = String(p.recommended_duration || "");
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
                protocol: { protocol: p.id, name: p.name },
                ataLevel: p.recommended_ata || undefined,
                duration: { minutes, seconds },
              },
            } as never
          );
        }}
      />
    );
  };

  //================== End Protocols Pagination State ==================

  //================== Start Learning Articles Pagination ==================
  const [articlesPage, setArticlesPage] = useState(1);
  const [articlesHasNextPage, setArticlesHasNextPage] = useState(true);
  const [articlesRefreshing, setArticlesRefreshing] = useState(false);
  const [isArticlesLoadingMore, setIsArticlesLoadingMore] = useState(false);
  const [articlesData, setArticlesData] = useState<any[]>([]);

  const {
    data: articles,
    isLoading: isArticlesLoading,
    refetch: refetchArticles,
  } = useLearningContent(
    articleSearch,
    activeLearningCategoryId,
    articlesPage,
    perPage
  );

  useEffect(() => {
    if (articles?.success && articles?.data) {
      const payload: any = articles?.data;
      if (articlesPage === 1) {
        setArticlesData(payload?.data);
      } else {
        setArticlesData((prev) => [...prev, ...payload?.data]);
      }
      setArticlesHasNextPage(payload?.hasNextPage ?? false);
      setIsArticlesLoadingMore(false);
    }
  }, [articles?.data, articlesPage]);

  const handleLoadMoreArticles = () => {
    if (articlesHasNextPage && !isArticlesLoadingMore && !isArticlesLoading) {
      setArticlesPage((prev) => prev + 1);
      setIsArticlesLoadingMore(true);
    }
  };

  const handleRefreshArticles = () => {
    setArticlesPage(1);
    setIsArticlesLoadingMore(false);
    setArticlesRefreshing(true);
    refetchArticles().finally(() => {
      setArticlesRefreshing(false);
    });
  };

  const handleBookmarkToggle = async (contentId: number) => {
    const previous = articlesData;
    setArticlesData((prev) =>
      prev.map((a) =>
        a.id === contentId
          ? { ...a, is_favourite_learning_hub: !a.is_favourite_learning_hub }
          : a
      )
    );
    try {
      await toggleBookmarkMutation.mutateAsync(contentId);
    } catch (e) {
      setArticlesData(previous);
    }
  };

  const renderArticleCard = ({ item: article }: { item: any }) => {
    return (
      <ArticleCard
        contentId={article.id}
        title={article.title}
        author={`${article.author_first_name} ${article.author_last_name}`}
        authorImage={article.author_image}
        content={article.content}
        reactions={article.reaction}
        totalComments={article.total_comments}
        loggedUserCommented={article.logged_user_comment}
        isBookmarked={article.is_favourite_learning_hub || false}
        commenterImages={article.last_three_commenters_images || []}
        onBookmarkToggle={() => handleBookmarkToggle(article.id)}
        onOpenDetails={() =>
          navigation.navigate("ContentStack", {
            screen: SCREEN_NAMES.ARTICLE_DETAILS,
            params: { article },
          })
        }
      />
    );
  };

  //================== End Learning Articles Pagination ==================

  const { data: learningCategories, isLoading: isLearningCategoriesLoading } =
    useLearningCategories();

  const toggleFavoriteMutation = useToggleFavoriteProtocol();
  const toggleBookmarkMutation = useToggleFavoriteLearningContent();

  // Debounce search input -> query param
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setSearch(searchInput.trim());
    }, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [searchInput]);

  // Debounce article search input -> query param
  useEffect(() => {
    if (articleDebounceRef.current) clearTimeout(articleDebounceRef.current);
    articleDebounceRef.current = setTimeout(() => {
      setArticleSearch(articleSearchInput.trim());
    }, 300);
    return () => {
      if (articleDebounceRef.current) clearTimeout(articleDebounceRef.current);
    };
  }, [articleSearchInput]);

  return (
    <LinearGradient
      colors={[
        Theme.backgroundGradient.start,
        Theme.backgroundGradient.middle,
        Theme.backgroundGradient.end,
      ]}
      style={styles.gradient}
    >
      <SafeAreaView className="flex-1">
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={0}
        >
          <>
            <Shadow
              distance={5}
              startColor="rgba(61, 106, 182, 0.2)"
              offset={[0, 1]}
              paintInside={false}
              sides={{ top: false, bottom: true, start: false, end: false }}
              style={{ width: "100%", marginBottom: 16 }}
            >
              {/* Header */}
              <View className=" px-4 bg-[#151A1E] pb-[2px] pt-4">
                <View className="flex-row items-center mb-6">
                  <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons
                      name="chevron-back-outline"
                      size={22}
                      color={Theme.text.neutral}
                    />
                  </TouchableOpacity>
                  <Text
                    className=" flex-1 text-center mr-6"
                    style={{
                      fontSize: 18,
                      fontFamily: "InterSemiBold",
                      color: Theme.text.neutral,
                    }}
                  >
                    HBOT Hub
                  </Text>
                </View>
                {/* Segmented Control */}
                <TabSwitcher
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                />
              </View>
            </Shadow>

            <View className="h-full px-4">
              {/* Scrollable body (search + chips + content) */}
              <>
                {/* Search Bar */}
                {activeTab === "protocols" ? (
                  <View
                    className="flex-row items-center bg-white px-4 justify-between"
                    style={{
                      borderWidth: 1,
                      borderColor: "#8BAFCE",
                      borderRadius: 12,
                    }}
                  >
                    <TextInput
                      placeholder="Search Protocols"
                      placeholderTextColor="#797979"
                      className="flex-1 text-gray-800 "
                      style={{
                        fontFamily: "InterRegular",
                        paddingVertical: 10,
                        fontSize: 12,
                      }}
                      value={searchInput}
                      onChangeText={setSearchInput}
                      returnKeyType="search"
                      onSubmitEditing={() => setSearch(searchInput.trim())}
                    />
                    <Ionicons name="search" size={18} color="#8BAFCE" />
                  </View>
                ) : (
                  <View className="flex-row items-center">
                    <View
                      className="flex-row items-center bg-white px-4 justify-between flex-1"
                      style={{
                        borderWidth: 1,
                        borderColor: "#8BAFCE",
                        borderRadius: 12,
                      }}
                    >
                      <TextInput
                        placeholder="Search learning articles"
                        placeholderTextColor="#797979"
                        className="flex-1 text-gray-800"
                        style={{
                          fontFamily: "InterRegular",
                          fontSize: 12,
                          paddingVertical: 10,
                        }}
                        value={articleSearchInput}
                        onChangeText={setArticleSearchInput}
                        returnKeyType="search"
                        onSubmitEditing={() =>
                          setArticleSearch(articleSearchInput.trim())
                        }
                      />
                      <Ionicons name="search" size={18} color="#8BAFCE" />
                    </View>
                    <TouchableOpacity
                      className="ml-3  h-12 w-12 items-center justify-center"
                      onPress={() => setIsPostArticleOpen(true)}
                    >
                      {/* Use svg for add icon, '/assets/svg/plus.svg' */}
                      <Image
                        source={require("../../assets/icons/plus.png")}
                        className="w-10 h-10"
                      />
                    </TouchableOpacity>
                  </View>
                )}

                {/* Filter Tabs */}
                <View className="pb-3 z-10 mt-2">
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ alignItems: "center" }}
                  >
                    {(activeTab === "protocols"
                      ? [
                          { id: undefined, name: "All" },
                          ...(((categories as any)?.data?.data as any[]) || []),
                        ]
                      : [
                          { id: undefined, name: "All" },
                          ...(((learningCategories as any)?.data
                            ?.data as any[]) || []),
                        ]
                    ).map((c: any) => {
                      const isProtocols = activeTab === "protocols";
                      const key = isProtocols
                        ? (c.id ?? "all")
                        : (c.id ?? "all");
                      const label = isProtocols ? c.name : c.name;
                      const isActive = isProtocols
                        ? (activeCategoryId === undefined &&
                            c.id === undefined) ||
                          activeCategoryId === c.id
                        : (activeLearningCategoryId === undefined &&
                            c.id === undefined) ||
                          activeLearningCategoryId === c.id;
                      return (
                        <TouchableOpacity
                          key={key}
                          onPress={() => {
                            if (isProtocols) {
                              setActiveCategoryId(c.id);
                            } else {
                              setActiveLearningCategoryId(c.id);
                            }
                          }}
                          className={`px-3 py-1 mr-3 rounded-lg border border-[#616B79] ${
                            isActive ? "bg-[#3A4049]" : ""
                          }`}
                        >
                          <Text
                            style={{ fontSize: 12, fontFamily: "InterMedium" }}
                            className={` ${
                              isActive ? "text-white" : "text-gray-500"
                            }`}
                          >
                            {capitalizeFirst(label)}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </ScrollView>
                </View>

                {/* Refresh Loading Indicator */}
                <Animated.View
                  style={{
                    opacity: refreshAnimation,
                    transform: [
                      {
                        translateY: refreshAnimation.interpolate({
                          inputRange: [0, 1],
                          outputRange: [-20, 0],
                        }),
                      },
                    ],
                    height: refreshAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, 60],
                    }),
                    overflow: "hidden",
                  }}
                >
                  <View className="items-center justify-center py-4">
                    <ActivityIndicator size="small" color="white" />
                    <Text className="text-white text-sm mt-2">
                      Refreshing...
                    </Text>
                  </View>
                </Animated.View>

                {/* Content */}
                {activeTab === "protocols" ? (
                  <>
                    <FlatList
                      data={protocols}
                      renderItem={renderProtocolCard}
                      onEndReached={handleLoadMoreProtocols}
                      onEndReachedThreshold={0.5}
                      refreshing={protocolsRefreshing}
                      onRefresh={handleRefreshProtocols}
                      keyExtractor={(item) => item.id.toString()}
                      ListFooterComponent={() => (
                        <RenderFooter
                          isLoadingMore={isProtocolsLoadingMore}
                          hasNextPage={protocolsHasNextPage}
                          text="protocols"
                        />
                      )}
                      ListEmptyComponent={() => (
                        <RenderEmptyComponent
                          isLoading={isProtocolsLoading}
                          message="No protocols found"
                        />
                      )}
                      contentContainerStyle={{
                        paddingBottom: 200,
                      }}
                      showsVerticalScrollIndicator={false}
                    />
                  </>
                ) : (
                  <>
                    <FlatList
                      data={articlesData}
                      renderItem={renderArticleCard}
                      onEndReached={handleLoadMoreArticles}
                      onEndReachedThreshold={0.5}
                      refreshing={articlesRefreshing}
                      onRefresh={handleRefreshArticles}
                      keyExtractor={(item) => item.id.toString()}
                      ListFooterComponent={() => (
                        <RenderFooter
                          isLoadingMore={isArticlesLoadingMore}
                          hasNextPage={articlesHasNextPage}
                          text="articles"
                        />
                      )}
                      ListEmptyComponent={() => (
                        <RenderEmptyComponent
                          isLoading={isArticlesLoading}
                          message="No articles found"
                        />
                      )}
                      contentContainerStyle={{
                        paddingBottom: 200,
                      }}
                      showsVerticalScrollIndicator={false}
                    />
                  </>
                )}
              </>
            </View>
          </>

          {/* PostArticleBottomSheet rendered at root level */}
          <PostArticleBottomSheet
            visible={isPostArticleOpen}
            onClose={() => setIsPostArticleOpen(false)}
          />
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    // paddingHorizontal: 16,
  },
});

export default ProtocolsHubScreen;
