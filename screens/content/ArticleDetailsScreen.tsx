import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { Theme } from "@/constants";
import { TEXT_SIZES } from "@/constants/textSizes";
import AntDesign from "@expo/vector-icons/AntDesign";
import ArticleCard from "../../components/content/ArticleCard";
import { learningApi } from "@/api/learning";
const { useNavigation, useRoute } = require("@react-navigation/native");

const ArticleDetailsScreen: React.FC = () => {
  const navigation: any = useNavigation();
  const route: any = useRoute();
  const { article, contentId: paramContentId } = route.params || {};
  const contentId = article?.id ?? paramContentId;

  const [articleData, setArticleData] = useState<any | null>(article || null);
  const [comments, setComments] = useState<any[]>([]);
  const [isArticleLoading, setIsArticleLoading] = useState(!article);
  const [isCommentsLoading, setIsCommentsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    if (!contentId) {
      setIsArticleLoading(false);
      setIsCommentsLoading(false);
      return;
    }

    const fetchArticle = async () => {
      try {
        if (!article) {
          setIsArticleLoading(true);
        }
        const [articleResp, commentsResp] = await Promise.all([
          article ? Promise.resolve({ success: true, data: article }) : learningApi.getLearningContentById(contentId),
          learningApi.getComments(contentId),
        ]);

        if (isMounted) {
          if (!article && articleResp.success) {
            const fetchedArticle: any = (articleResp.data as any)?.data || articleResp.data;
            setArticleData(fetchedArticle);
          }

          if (commentsResp.success) {
            const rawComments = (commentsResp.data as any)?.data ?? commentsResp.data;
            const fetchedComments: any[] = Array.isArray(rawComments) ? rawComments : [];
            setComments(fetchedComments);
          } else {
            setComments([]);
          }
        }
      } catch (error) {
        // TODO: handle error state (could add toast or alert)
      } finally {
        if (isMounted) {
          setIsArticleLoading(false);
          setIsCommentsLoading(false);
        }
      }
    };

    fetchArticle();

    return () => {
      isMounted = false;
    };
  }, [contentId, article]);

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
        <View className="px-4 py-4 flex-1">
          <View className="flex-row items-center justify-center mb-6 relative w-full">
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              className="absolute left-0 "
            >
              <AntDesign name="left" size={24} color="white" />
            </TouchableOpacity>
            <Text className="text-white" style={{ fontSize: TEXT_SIZES.lg }}>
              Article
            </Text>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {isArticleLoading ? (
              <View className="py-10 items-center justify-center">
                <ActivityIndicator size="small" color="#ffffff" />
                <Text className="text-white mt-3">Loading article...</Text>
              </View>
            ) : articleData ? (
              <>
                <ArticleCard
                  contentId={articleData.id}
                  title={articleData.title}
                  author={`${articleData.author_first_name || ""} ${articleData.author_last_name || ""}`.trim()}
                  authorImage={articleData.author_image}
                  content={articleData.content}
                  reactions={articleData.reaction}
                  totalComments={articleData.total_comments || 0}
                  loggedUserCommented={articleData.logged_user_comment || false}
                  isBookmarked={articleData.is_favourite_learning_hub || false}
                  showReactionsAndComments={true}
                  showBookmark={true}
                />

                <View className="mt-6">
                  <Text
                    className="text-white mb-3"
                    style={{
                      fontSize: TEXT_SIZES.md,
                      fontFamily: "InterSemiBold",
                    }}
                  >
                    Comments
                  </Text>

                  {isCommentsLoading ? (
                    <View className="py-4 items-center justify-center">
                      <ActivityIndicator size="small" color="#ffffff" />
                    </View>
                  ) : comments.length === 0 ? (
                    <Text className="text-[#ABB0BC]">No comments yet.</Text>
                  ) : (
                    comments.map((comment) => (
                      <View
                        key={comment.id}
                        className="bg-[#3A4049] rounded-xl p-3 mb-3"
                      >
                        <Text className="text-white font-semibold mb-1">
                          {comment.user_name || "User"}
                        </Text>
                        <Text className="text-[#DDE2E5]">{comment.comment}</Text>
                      </View>
                    ))
                  )}
                </View>
              </>
            ) : (
              <Text className="text-white">Unable to load article.</Text>
            )}
          </ScrollView>
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

export default ArticleDetailsScreen;
