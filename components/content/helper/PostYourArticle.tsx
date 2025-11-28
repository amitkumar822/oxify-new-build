import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Platform,
  KeyboardAvoidingView,
  Keyboard,
} from "react-native";
import { TEXT_SIZES } from "@/constants/textSizes";
import {
  useLearningCategories,
  usePostArticle,
} from "@/hooks_main/useLearning";
import AntDesign from "@expo/vector-icons/AntDesign";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppStatusBar } from "@/helpers/AppStatusBar";
const { useNavigation } = require("@react-navigation/native");

interface PostYourArticleProps {
  onSuccess?: () => void;
  onBack?: () => void;
}

const PostYourArticle: React.FC<PostYourArticleProps> = ({
  onSuccess,
  onBack,
}) => {
  const navigation: any = useNavigation();
  const { data: categoriesData, isLoading: isCategoriesLoading } =
    useLearningCategories();
  const postArticleMutation = usePostArticle();

  const categories = useMemo(() => {
    // @ts-ignore
    const payload = categoriesData?.data?.data;
    return Array.isArray(payload) ? payload : [];
  }, [categoriesData]);

  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [showDiscardModal, setShowDiscardModal] = useState(false);

  const handlePost = () => {
    if (!selectedCategory || !title.trim() || !content.trim()) {
      return;
    }

    postArticleMutation.mutate(
      {
        title: title.trim(),
        categories: [selectedCategory], // Send as array with one key
        content: content.trim(),
      },
      {
        onSuccess: () => {
          // Reset form
          setSelectedCategory(null);
          setTitle("");
          setContent("");
          onSuccess && onSuccess();
        },
      }
    );
  };

  const handleBackPress = () => {
    const hasContent =
      selectedCategory !== null || title.trim() || content.trim();
    if (hasContent) {
      setShowDiscardModal(true);
    } else {
      if (onBack) {
        onBack();
      } else {
        navigation.goBack();
      }
    }
  };

  const handleDiscard = () => {
    setShowDiscardModal(false);
    setSelectedCategory(null);
    setTitle("");
    setContent("");
    if (onBack) {
      onBack();
    } else {
      navigation.goBack();
    }
  };

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
        setShowDiscardModal(false);
      }}
    >
      <SafeAreaView style={{ flex: 1, backgroundColor: "#0F172A" }}>
        <View style={{ flex: 1 }}>
          <AppStatusBar backgroundColor="#0F172A" barStyle="light-content" />

          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
          >
            <View className="overflow-hidden flex-1">
              {/* Handle and header */}
              <View className="px-4 pb-2">
                {Platform.OS === "ios" && (
                  <View className="items-center mb-2 mt-5">
                    <View className="h-[2px] w-[49px] rounded-full bg-white/30" />
                  </View>
                )}
                <View className="relative flex-row items-center justify-center mb-2 w-full py-4 shadow-blue-500">
                  <TouchableOpacity onPress={handleBackPress}>
                    <AntDesign name="left" size={20} color="white" />
                  </TouchableOpacity>
                  <Text
                    className="text-center flex-1 mr-6"
                    style={{
                      fontSize: 18,
                      fontFamily: "InterSemiBold",
                      color: "#DDE2E5",
                    }}
                  >
                    Post your Article
                  </Text>
                </View>
              </View>

              {/* Content */}
              <ScrollView
                className="flex-1 px-4 pt-4"
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="always"
                keyboardDismissMode="interactive"
                nestedScrollEnabled={true}
                contentContainerStyle={{ flexGrow: 1 }}
                bounces={false}
                scrollEventThrottle={16}
              >
                {/* Category Selection */}
                <View className="mb-6">
                  <Text
                    className="text-white mb-3"
                    style={{
                      fontSize: 14,
                      fontFamily: "InterSemiBold",
                      color: "rgba(255, 255, 255, 0.8)",
                    }}
                  >
                    Select your post's Category
                  </Text>
                  {isCategoriesLoading ? (
                    <View className="items-center justify-center py-4">
                      <ActivityIndicator size="small" color="white" />
                      <Text className="text-white text-sm mt-2">
                        Loading categories...
                      </Text>
                    </View>
                  ) : (
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      contentContainerStyle={{ alignItems: "center" }}
                      nestedScrollEnabled={true}
                    >
                      {categories.map((category: any) => (
                        <TouchableOpacity
                          key={category.id}
                          onPress={() => setSelectedCategory(category.id)}
                          className={`px-3 py-1 mr-3 rounded-lg border ${
                            selectedCategory === category.id
                              ? "bg-[#3A4049] border-[#616B79]"
                              : "border-gray-500"
                          }`}
                        >
                          <Text
                            className={`${
                              selectedCategory === category.id
                                ? "text-white"
                                : "text-gray-500"
                            } capitalize`}
                            style={{
                              fontFamily: "InterRegular",
                              fontSize: 11,
                            }}
                          >
                            {category.name}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  )}
                </View>

                {/* Title Input */}
                <View className="border-y border-white/40 py-3 flex justify-center">
                  <TextInput
                    placeholder="Title/ Subject"
                    placeholderTextColor="rgba(255, 255, 255, 0.7)"
                    value={title}
                    onChangeText={setTitle}
                    className="text-white text-lg"
                    style={{
                      fontSize: 16,
                      fontFamily: "InterSemiBold",
                      color: "rgba(255, 255, 255, 0.8)",
                    }}
                  />
                </View>

                {/* Content Input */}
                <>
                  <TextInput
                    placeholder="What do you want to talk about?"
                    placeholderTextColor="rgba(255, 255, 255, 0.6)"
                    value={content}
                    onChangeText={setContent}
                    multiline
                    textAlignVertical="top"
                    className="text-[#D9D9D9] text-base text-left min-h-[80px] max-h-[150px]"
                    style={{
                      fontSize: 14,
                      fontFamily: "InterRegular",
                      color: "#D9D9D9",
                    }}
                  />
                </>
              </ScrollView>

              {/* Post Button or Discard Confirmation */}
              <View className="px-4 py-4">
                {showDiscardModal ? (
                  <View>
                    <View className="bg-gray-600 py-3 mb-3 sm:py-5 rounded-2xl items-center flex-row justify-center">
                      <Text
                        className="text-white text-center w-[80%]"
                        style={{
                          fontFamily: "InterSemiBold",
                          color: "rgba(255, 255, 255, 0.8)",
                          fontSize: 14,
                        }}
                      >
                        Are you sure you want to discard your post?
                      </Text>
                    </View>

                    <View className="space-y-3">
                      <TouchableOpacity
                        onPress={() => setShowDiscardModal(false)}
                        className="bg-gray-600 py-3 sm:py-5 mb-3 rounded-2xl items-center"
                      >
                        <Text
                          className="text-white"
                          style={{
                            fontFamily: "InterSemiBold",
                            color: "rgba(255, 255, 255, 0.8)",
                            fontSize: 14,
                          }}
                        >
                          Cancel
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={handleDiscard}
                        className="py-3 sm:py-5 rounded-2xl items-center"
                        style={{ backgroundColor: "#F5493B4D" }}
                      >
                        <Text
                          className="text-[#f55546]"
                          style={{
                            fontFamily: "InterSemiBold",
                            fontSize: 14,
                          }}
                        >
                          Discard
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ) : (
                  <TouchableOpacity
                    onPress={handlePost}
                    style={{ backgroundColor: "#4C8BF566", opacity: 40 }}
                    className="py-4 rounded-[36px] items-center"
                    disabled={
                      !selectedCategory ||
                      !title.trim() ||
                      !content.trim() ||
                      postArticleMutation.isPending
                    }
                  >
                    {postArticleMutation.isPending ? (
                      <View className="flex-row items-center">
                        <ActivityIndicator size="small" color="white" />
                        <Text
                          className="text-white ml-2"
                          style={{
                            fontSize: TEXT_SIZES.md,
                            fontWeight: "600",
                            fontFamily: "Inter",
                          }}
                        >
                          Posting...
                        </Text>
                      </View>
                    ) : (
                      <Text
                        className="text-white"
                        style={{
                          fontSize: 16,
                          fontFamily: "InterSemiBold",
                          color: "#FFFFFF",
                        }}
                      >
                        Post
                      </Text>
                    )}
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </KeyboardAvoidingView>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default PostYourArticle;
