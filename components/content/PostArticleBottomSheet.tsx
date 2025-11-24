import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Animated,
  PanResponder,
  ActivityIndicator,
} from "react-native";
import { TEXT_SIZES } from "@/constants/textSizes";
import { useLearningCategories, usePostArticle } from "@/hooks/useLearning";
import AntDesign from "@expo/vector-icons/AntDesign";
import { SafeAreaView } from "react-native-safe-area-context";

interface PostArticleBottomSheetProps {
  visible: boolean;
  onClose: () => void;
}

interface PostArticleBottomSheetProps {
  visible: boolean;
  onClose: () => void;
}

const PostArticleBottomSheet: React.FC<PostArticleBottomSheetProps> = ({
  visible,
  onClose,
}) => {
  const { data: categoriesData, isLoading: isCategoriesLoading } =
    useLearningCategories();
  const postArticleMutation = usePostArticle();

  const categories = useMemo(() => {
    // @ts-ignore
    const payload = categoriesData?.data?.data;
    return Array.isArray(payload) ? payload : [];
  }, [categoriesData]);

  const [sheetHeight, setSheetHeight] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [showDiscardModal, setShowDiscardModal] = useState(false);
  const translateY = useRef(new Animated.Value(400)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;

  const animateOpen = () => {
    Animated.parallel([
      Animated.timing(overlayOpacity, {
        toValue: 1,
        duration: 180,
        useNativeDriver: true,
      }),
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const animateClose = (onDone?: () => void) => {
    const distance = sheetHeight || 400;
    Animated.parallel([
      Animated.timing(overlayOpacity, {
        toValue: 0,
        duration: 180,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: distance,
        duration: 220,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onDone && onDone();
    });
  };

  useEffect(() => {
    if (visible) {
      // Reset position before opening
      translateY.setValue(sheetHeight || 400);
      overlayOpacity.setValue(0);
      requestAnimationFrame(animateOpen);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  // Handle system back button through Modal's onRequestClose
  const handleRequestClose = () => {
    const hasContent =
      selectedCategory !== null || title.trim() || content.trim();
    if (hasContent) {
      setShowDiscardModal(true);
    } else {
      animateClose(onClose);
    }
  };

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: (_, g) => g.dy > 4,
        onPanResponderMove: (_, g) => {
          if (g.dy > 0) {
            translateY.setValue(g.dy);
          }
        },
        onPanResponderRelease: (_, g) => {
          const threshold = (sheetHeight || 400) * 0.15;
          if (g.dy > threshold || g.vy > 0.8) {
            animateClose(onClose);
          } else {
            Animated.spring(translateY, {
              toValue: 0,
              useNativeDriver: true,
            }).start();
          }
        },
      }),
    [sheetHeight]
  );

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
          onClose();
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
      animateClose(onClose);
    }
  };

  const handleDiscard = () => {
    setShowDiscardModal(false);
    setSelectedCategory(null);
    setTitle("");
    setContent("");
    animateClose(onClose);
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={handleRequestClose}
      statusBarTranslucent
      hardwareAccelerated
      presentationStyle="overFullScreen"
      supportedOrientations={["portrait"]}
    >
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right']}>
        <View style={{ flex: 1, backgroundColor: "transparent" }}>
          {/* Backdrop */}
          <Animated.View
            pointerEvents="none"
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 0,
              bottom: 0,
              marginTop: 200,
              backgroundColor: "black",
              opacity: overlayOpacity.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 0.5],
              }),
            }}
          />

          {/* Touchable backdrop */}
          <TouchableOpacity
            activeOpacity={1}
            onPress={handleBackPress}
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 300,
              bottom: 0,
              zIndex: 1,
              paddingTop: 400,
            }}
          />

          {/* Modal Content - Fixed at bottom */}
          <Animated.View
            style={{
              position: "absolute",
              // top:400,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 1000,
              marginTop: 400,
              transform: [{ translateY }],
              backgroundColor: "#0F172A",
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              overflow: "hidden",
              elevation: 1000,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: -2 },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
            }}
            onLayout={(e) => setSheetHeight(e.nativeEvent.layout.height)}
          >
            <View className="overflow-hidden ">
              {/* Handle and header */}
              <View className="px-4 pt-2 pb-2" {...panResponder.panHandlers}>
                <View className="items-center mb-2 mt-3">
                  <View className="h-[2px] w-[49px] rounded-full bg-white/30" />
                </View>
                <View className="relative flex-row items-center justify-center mb-4 w-full py-4  shadow-blue-500 ">
                  <TouchableOpacity onPress={handleBackPress}>
                    <AntDesign
                      name="left"
                      size={20}
                      color="white"
                    />
                  </TouchableOpacity>
                  <Text
                    className="text-center flex-1 mr-6"
                    style={{ fontSize: 18, fontFamily: "InterSemiBold", color: "#DDE2E5" }}
                  >
                    Post your Article
                  </Text>
                </View>
              </View>
              {/* <View className="h-[1px] bg-white/15" /> */}

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
                    className="text-white  mb-3"
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
                            className={` ${
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
                    className="text-white text-lg "
                    style={{
                      fontSize: 16,
                      fontFamily: "InterSemiBold",
                      color: "rgba(255, 255, 255, 0.8)",
                    }}
                  />
                </View>

                {/* Content Input */}
                <View className=" min-h-[200px] max-h-[300px]">
                  <TextInput
                    placeholder="What do you want to talk about?"
                    placeholderTextColor="rgba(255, 255, 255, 0.6)"
                    value={content}
                    onChangeText={setContent}
                    multiline
                    textAlignVertical="top"
                    className="text-[#D9D9D9] text-base text-left min-h-[200px]"
                    style={{
                      fontSize: 14,
                      fontFamily: "InterRegular",
                      color: "#D9D9D9",
                    }}
                  />
                </View>
              </ScrollView>

              {/* Post Button or Discard Confirmation */}
              <View className=" px-4 py-4 ">
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
                          className=" text-[#f55546]"
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
                          className="text-white  ml-2"
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
                        className="text-white "
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
          </Animated.View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

export default PostArticleBottomSheet;
