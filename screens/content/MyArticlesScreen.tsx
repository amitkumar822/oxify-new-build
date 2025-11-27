import React, { useState, useMemo, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  RefreshControl,
  FlatList,
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
  useUserArticles,
  useToggleFavoriteLearningContent,
  useSavedArticles,
  useDeleteArticle,
} from "@/hooks_main/useLearning";

const perPage = 10;

const MyArticlesScreen: React.FC = () => {
  const navigation: any = useNavigation();

  // pagination state
  const [page, setPage] = useState(1);
  const [articles, setArticles] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(true);

  const {
    data: userArticles,
    isLoading,
    error,
    refetch,
    isFetching,
  } = useUserArticles({ page, perPage });
  const { data: savedArticles } = useSavedArticles({ page, perPage });
  const toggleBookmarkMutation = useToggleFavoriteLearningContent();
  const deleteArticleMutation = useDeleteArticle();

  // Merge data for pagination
  useEffect(() => {
    const userArticlesData = userArticles as any;
    if (userArticlesData?.data?.data) {
      const articlesData = userArticlesData.data.data;
      if (page === 1) {
        setArticles(articlesData);
      } else {
        setArticles((prev) => [...prev, ...articlesData]);
      }
      // if API returns less than perPage, means no more data
      if (articlesData.length < perPage) {
        setHasNextPage(false);
      } else {
        setHasNextPage(true);
      }
    }
  }, [userArticles, page]);

  // Saved bookmarks
  const savedArticleIds = useMemo(() => {
    const savedData: any = savedArticles;
    if (!savedData?.data?.data) return new Set();
    const savedPayload: any = savedData.data.data;
    const savedList: any[] = Array.isArray(savedPayload)
      ? savedPayload.map((item: any) => item.content?.id).filter(Boolean)
      : [];
    return new Set(savedList);
  }, [savedArticles]);

  const isArticleBookmarked = (articleId: number) =>
    savedArticleIds.has(articleId);

  const handleBookmarkToggle = (contentId: number) => {
    toggleBookmarkMutation.mutate(contentId);
  };

  const handleDeleteArticle = (articleId: number, articleTitle: string) => {
    Alert.alert(
      "Delete Article",
      `Are you sure you want to delete "${articleTitle}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => deleteArticleMutation.mutate(articleId),
        },
      ]
    );
  };

  const onRefresh = async () => {
    setRefreshing(true);
    setPage(1);
    await refetch();
    setRefreshing(false);
  };

  const loadMore = () => {
    if (!loadingMore && hasNextPage) {
      setLoadingMore(true);
      setPage((prev) => prev + 1);
      setLoadingMore(false);
    }
  };

  const renderFooter = () => {
    if (loadingMore) {
      return (
        <View className="py-4 items-center">
          <ActivityIndicator size="small" color="#4ECCA3" />
          <Text className="text-gray-400 text-sm mt-2">Loading more...</Text>
        </View>
      );
    }
    if (!hasNextPage) {
      return (
        <View className="py-6 items-center flex-col">
          <Text className="text-gray-400 text-sm mt-2">
            🎉 You’ve reached the end!
          </Text>
        </View>
      );
    }
    return null;
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
          <View className="flex-row items-center justify-center mb-6 relative w-full">
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              className="absolute left-0"
            >
              <AntDesign name="left" size={24} color="white" />
            </TouchableOpacity>
            <Text
              className="text-white"
              style={{
                fontFamily: "Inter",
                textAlign: "center",
                fontSize: TEXT_SIZES.lg,
              }}
            >
              My Articles
            </Text>
          </View>

          {isLoading && page === 1 ? (
            <View className="items-center justify-center py-10">
              <ActivityIndicator size="large" color="white" />
              <Text className="text-white mt-2">Loading your articles...</Text>
            </View>
          ) : error ? (
            <View className="items-center justify-center py-10">
              <Text className="text-white">Failed to load your articles</Text>
              <TouchableOpacity
                className="mt-2 px-4 py-2 bg-blue-500 rounded-lg"
                onPress={() => refetch()}
              >
                <Text className="text-white">Retry</Text>
              </TouchableOpacity>
            </View>
          ) : articles.length === 0 ? (
            <View className="items-center justify-center py-10">
              <Text className="text-white">No articles posted yet</Text>
              <Text className="text-gray-400 mt-2">
                Start sharing your knowledge with the community
              </Text>
            </View>
          ) : (
            <FlatList
              data={articles}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <ArticleCard
                  contentId={item.id}
                  title={item.title}
                  author={`${item.author_first_name} ${item.author_last_name}`}
                  authorImage={item.author_image}
                  content={item.content}
                  reactions={item.status === "draft" ? null : item.reaction}
                  totalComments={
                    item.status === "draft" ? 0 : item.total_comments || 0
                  }
                  loggedUserCommented={
                    item.status === "draft" ? false : item.logged_user_comment
                  }
                  isBookmarked={isArticleBookmarked(item.id)}
                  onBookmarkToggle={() => handleBookmarkToggle(item.id)}
                  showReactionsAndComments={item.status !== "draft"}
                  showBookmark={item.status === "published"}
                  articleStatus={item.status}
                  showDeleteButton={item.status === "draft"}
                  onDelete={() => handleDeleteArticle(item.id, item.title)}
                />
              )}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
              onEndReached={loadMore}
              onEndReachedThreshold={0.3}
              ListFooterComponent={renderFooter}
              showsVerticalScrollIndicator={false}
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

export default MyArticlesScreen;

// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   ScrollView,
//   ActivityIndicator,
//   Alert,
//   RefreshControl,
// } from "react-native";
// import { LinearGradient } from "expo-linear-gradient";
// import AntDesign from "@expo/vector-icons/AntDesign";
// const { useNavigation } = require("@react-navigation/native");
// import { SafeAreaView } from "react-native-safe-area-context";
// import { AppStatusBar } from "../../helpers/AppStatusBar";
// import { TEXT_SIZES } from "@/constants/textSizes";
// import ArticleCard from "../../components/content/ArticleCard";
// import { Theme } from "@/constants";
// import {
//   useUserArticles,
//   useToggleFavoriteLearningContent,
//   useSavedArticles,
//   useDeleteArticle,
// } from "@/hooks/useLearning";
// import { useMemo } from "react";

// const perPage = 10;

// const MyArticlesScreen: React.FC = () => {
//   const navigation: any = useNavigation();

//   const { data: userArticles, isLoading, error, refetch } = useUserArticles({page: 1, perPage});
//   const { data: savedArticles } = useSavedArticles({page: 1, perPage});
//   const toggleBookmarkMutation = useToggleFavoriteLearningContent();
//   const deleteArticleMutation = useDeleteArticle();

//   const [refreshing, setRefreshing] = useState(false);

//   const userArticlesList = useMemo(() => {
//     const payload: any = userArticles?.data;
//     const articles = payload?.data; // Articles are in payload.data
//     const list: any[] = Array.isArray(articles) ? articles : [];
//     return list;
//   }, [userArticles]);

//   // Get saved articles IDs for bookmark status checking
//   const savedArticleIds = useMemo(() => {
//     const savedData: any = savedArticles;
//     if (!savedData?.data?.data) return new Set();
//     const savedPayload: any = savedData.data.data;
//     const savedList: any[] = Array.isArray(savedPayload)
//       ? savedPayload.map((item: any) => item.content?.id).filter(Boolean)
//       : [];
//     return new Set(savedList);
//   }, [savedArticles]);

//   // Check if an article is bookmarked
//   const isArticleBookmarked = (articleId: number) => {
//     return savedArticleIds.has(articleId);
//   };

//   const handleBookmarkToggle = (contentId: number) => {
//     toggleBookmarkMutation.mutate(contentId);
//   };

//   const handleDeleteArticle = (articleId: number, articleTitle: string) => {
//     Alert.alert(
//       "Delete Article",
//       `Are you sure you want to delete "${articleTitle}"? This action cannot be undone.`,
//       [
//         {
//           text: "Cancel",
//           style: "cancel",
//         },
//         {
//           text: "Delete",
//           style: "destructive",
//           onPress: () => {
//             deleteArticleMutation.mutate(articleId);
//           },
//         },
//       ]
//     );
//   };

//   const onRefresh = async () => {
//     setRefreshing(true);
//     await refetch();
//     setRefreshing(false);
//   };

//   return (
//     <LinearGradient
//       colors={[
//         Theme.backgroundGradient.start,
//         Theme.backgroundGradient.middle,
//         Theme.backgroundGradient.end,
//       ]}
//       start={{ x: 0.5, y: 1 }}
//       end={{ x: 0.5, y: 0 }}
//       className="flex-1"
//     >
//       <SafeAreaView className="flex-1">
//         <AppStatusBar barStyle="light-content" />
//         <View className="flex-1 px-4 py-4">
//           {/* Header */}
//           <View className="flex-row items-center justify-center mb-6 relative w-full">
//             {/* Back Button */}
//             <TouchableOpacity
//               onPress={() => navigation.goBack()}
//               className="absolute left-0 "
//             >
//               <AntDesign name="left" size={24} color="white" />
//             </TouchableOpacity>

//             {/* Title */}
//             <Text
//               className="text-white "
//               style={{
//                 fontFamily: "Inter",
//                 textAlign: "center",
//                 fontSize: TEXT_SIZES.lg,
//               }}
//             >
//               My Articles
//             </Text>
//           </View>

//           <ScrollView
//             showsVerticalScrollIndicator={false}
//             refreshControl={
//               <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
//             }
//           >
//             {isLoading ? (
//               <View className="items-center justify-center py-10">
//                 <ActivityIndicator size="large" color="white" />
//                 <Text className="text-white mt-2">
//                   Loading your articles...
//                 </Text>
//               </View>
//             ) : error ? (
//               <View className="items-center justify-center py-10">
//                 <Text className="text-white">Failed to load your articles</Text>
//                 <TouchableOpacity
//                   className="mt-2 px-4 py-2 bg-blue-500 rounded-lg"
//                   onPress={() => window.location.reload()}
//                 >
//                   <Text className="text-white">Retry</Text>
//                 </TouchableOpacity>
//               </View>
//             ) : userArticlesList.length === 0 ? (
//               <View className="items-center justify-center py-10">
//                 <Text className="text-white">No articles posted yet</Text>
//                 <Text className="text-gray-400 mt-2">
//                   Start sharing your knowledge with the community
//                 </Text>
//               </View>
//             ) : (
//               userArticlesList.map((article: any) => (
//                 <View key={article.id}>
//                   <ArticleCard
//                     contentId={article.id}
//                     title={article.title}
//                     author={`${article.author_first_name} ${article.author_last_name}`}
//                     authorImage={article.author_image}
//                     content={article.content}
//                     reactions={
//                       article.status === "draft" ? null : article.reaction
//                     }
//                     totalComments={
//                       article.status === "draft"
//                         ? 0
//                         : article.total_comments || 0
//                     }
//                     loggedUserCommented={
//                       article.status === "draft"
//                         ? false
//                         : article.logged_user_comment || false
//                     }
//                     isBookmarked={isArticleBookmarked(article.id)}
//                     onBookmarkToggle={() => handleBookmarkToggle(article.id)}
//                     showReactionsAndComments={article.status !== "draft"}
//                     showBookmark={article.status === "published"}
//                     articleStatus={article.status}
//                     showDeleteButton={article.status === "draft"}
//                     onDelete={() =>
//                       handleDeleteArticle(article.id, article.title)
//                     }
//                   />
//                 </View>
//               ))
//             )}
//           </ScrollView>
//         </View>
//       </SafeAreaView>
//     </LinearGradient>
//   );
// };

// export default MyArticlesScreen;
