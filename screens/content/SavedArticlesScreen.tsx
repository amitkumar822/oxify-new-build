import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import AntDesign from "@expo/vector-icons/AntDesign";
const { useNavigation } = require("@react-navigation/native");
import { SafeAreaView } from "react-native-safe-area-context";
import { AppStatusBar } from "../../helpers/AppStatusBar";
import { TEXT_SIZES } from "@/constants/textSizes";
import ArticleCard from "../../components/content/ArticleCard";
import { Theme } from "@/constants";
import {
  useSavedArticles,
  useToggleFavoriteLearningContent,
} from "@/hooks/useLearning";
import RenderFooter from "@/components/common/RenderFooter";

const perPage = 10;

const SavedArticlesScreen: React.FC = () => {
  const navigation: any = useNavigation();

  // Pagination state
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [savedArticlesList, setSavedArticlesList] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const { data: savedArticles, isLoading } = useSavedArticles({
    page,
    perPage,
  });

  const toggleBookmarkMutation = useToggleFavoriteLearningContent();

  useEffect(() => {
    if (savedArticles?.success && savedArticles.data) {
      const payload: any = savedArticles.data;
      const list: any[] = Array.isArray(payload?.data)
        ? payload.data.map((item: any) => item.content)
        : [];

      if (page === 1) {
        setSavedArticlesList(list);
      } else {
        setSavedArticlesList((prev) => [...prev, ...list]);
      }

      setHasNextPage(payload?.hasNextPage ?? false);
      setIsLoadingMore(false);
      setRefreshing(false);
      setError(
        list.length === 0 && page === 1 ? "No saved articles found" : null
      );
    } else if (savedArticles && !savedArticles.success) {
      setError("Failed to load saved articles");
    }
  }, [savedArticles, page, refreshing]);

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
  }, [savedArticles, refreshing, isLoadingMore]);

  const handleBookmarkToggle = (contentId: number) => {
    toggleBookmarkMutation.mutate(contentId);
  };

  const renderArticleCard = ({ item: article }: { item: any }) => (
    <ArticleCard
      key={article.id}
      contentId={article.id}
      title={article.title}
      author={`${article.author_first_name} ${article.author_last_name}`}
      authorImage={article.author_image}
      content={article.content}
      reactions={article.reaction}
      totalComments={article.total_comments || 0}
      loggedUserCommented={article.logged_user_comment || false}
      isBookmarked={true}
      onBookmarkToggle={() => handleBookmarkToggle(article.id)}
    />
  );

  const renderEmptyComponent = () => {
    if (isLoading) return null;

    return (
      <View className="items-center justify-center py-10">
        <Text className="text-white">No saved articles yet</Text>
        <Text className="text-gray-400 mt-2">
          Bookmark articles to see them here
        </Text>
      </View>
    );
  };

  const renderErrorComponent = () => (
    <View className="items-center justify-center py-10">
      <Text className="text-white">
        {error || "Failed to load saved articles"}
      </Text>
      <TouchableOpacity
        className="mt-2 px-4 py-2 bg-blue-500 rounded-lg"
        onPress={handleRefresh}
      >
        <Text className="text-white">Retry</Text>
      </TouchableOpacity>
    </View>
  );

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
          <View className="flex-row items-center justify-center mb-6 relative w-full">
            {/* Back Button */}
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              className="absolute left-0 "
            >
              <AntDesign name="left" size={24} color="white" />
            </TouchableOpacity>

            {/* Title */}
            <Text
              className="text-white "
              style={{
                fontFamily: "Inter",
                textAlign: "center",
                fontSize: TEXT_SIZES.lg,
              }}
            >
              Saved Articles
            </Text>
          </View>

          {isLoading && page === 1 ? (
            <View className="items-center justify-center flex-1">
              <ActivityIndicator size="large" color="white" />
              <Text className="text-white mt-2">Loading saved articles...</Text>
            </View>
          ) : error ? (
            renderErrorComponent()
          ) : (
            <FlatList
              data={savedArticlesList}
              renderItem={renderArticleCard}
              keyExtractor={(item) => item.id.toString()}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                paddingBottom: 20,
                flexGrow: savedArticlesList.length === 0 ? 1 : 0,
              }}
              ListEmptyComponent={renderEmptyComponent}
              onEndReached={handleLoadMore}
              onEndReachedThreshold={0.3}
              ListFooterComponent={() => (
                <RenderFooter
                  isLoadingMore={isLoadingMore}
                  hasNextPage={hasNextPage}
                  text="articles"
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

export default SavedArticlesScreen;
