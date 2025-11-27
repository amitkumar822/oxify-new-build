import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  Animated,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import AntDesign from "@expo/vector-icons/AntDesign";
import { TEXT_SIZES } from "@/constants/textSizes";
import CommentsBottomSheet from "./CommentsBottomSheet";
// import {useState} from "react";

interface ArticleCardProps {
  title?: string;
  author?: string;
  authorImage?: string;
  content?: string;
  contentId?: number;
  reactions?: {
    heart: number;
    acknowledgement: number;
    fire: number;
    wow: number;
  } | null;
  totalComments?: number;
  loggedUserCommented?: boolean;
  isBookmarked?: boolean;
  onBookmarkToggle?: () => void;
  showReactionsAndComments?: boolean;
  showBookmark?: boolean;
  articleStatus?: string;
  showDeleteButton?: boolean;
  onDelete?: () => void;
  onOpenDetails?: () => void;
  commenterImages?: string[];
}

const ArticleCard: React.FC<ArticleCardProps> = ({
  title = "10 Surprising benefits of Hyperbaric Oxygen Chamber",
  author = "Oxify",
  authorImage,
  content = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce pulvinar diam vel metus dapibus egestas. Phasellus finibus ante eu aliquam lacinia",
  contentId,
  reactions = { heart: 35, acknowledgement: 25, fire: 20, wow: 12 },
  totalComments = 0,
  loggedUserCommented = false,
  isBookmarked = false,
  onBookmarkToggle,
  showReactionsAndComments = true,
  showBookmark = true,
  articleStatus,
  showDeleteButton = false,
  onDelete,
  onOpenDetails,
  commenterImages = [],
}) => {
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const bookmarkScale = React.useRef(new Animated.Value(1)).current;
  const { useAddReaction } = require("@/hooks/useLearning");
  const addReactionMutation = useAddReaction();

  const handleBookmarkPress = () => {
    // Bouncing animation
    Animated.sequence([
      Animated.timing(bookmarkScale, {
        toValue: 1.3,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(bookmarkScale, {
        toValue: 0.8,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(bookmarkScale, {
        toValue: 1.1,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(bookmarkScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    // Call the original onBookmarkToggle function
    onBookmarkToggle?.();
  };

  const [reactionSize, setReactionSize] = useState({
    emojiName: "null",
    size: 16,
    reactionEmoji: "",
    reactionCount: 0,
  });

  const handleReact = (
    reactionType: "heart" | "fire" | "wow" | "acknowledgement"
  ) => {
    if (!contentId) return;

    addReactionMutation.mutate({ contentId, reactionType });
  };

  return (
    <>
      <View className="bg-[#3A4049] rounded-2xl py-4 mb-5">
        <View className="flex-row justify-between items-start mb-[10px] px-4">
          <View className="flex-row items-center">
            <Image
              className="rounded-full"
              source={
                authorImage
                  ? { uri: authorImage }
                  : require("../../assets/icons/oxify_logo.png")
              }
              style={{
                width: 36,
                height: 36,
                borderRadius: 50,
                resizeMode: "contain",
                marginRight: 8,
              }}
            />
            <Text
              className="text-white"
              style={{
                fontFamily: "InterSemiBold",
                fontSize: 14,
              }}
            >
              {author}
            </Text>
          </View>
          <View className="flex-row items-center gap-2">
            {/* Status Pill */}
            {articleStatus && (
              <View
                className={`px-2 py-1 ${
                  articleStatus === "draft"
                    ? "border border-[#60A5FA] bg-transparent rounded-full"
                    : "bg-[#60A5FA] rounded-lg"
                }`}
              >
                <Text
                  className={` font-semibold ${
                    articleStatus === "draft" ? "text-[#60A5FA]" : "text-white"
                  }`}
                  style={{ fontSize: TEXT_SIZES.xs }}
                >
                  {articleStatus === "draft" ? "Draft" : "Published"}
                </Text>
              </View>
            )}
            {showBookmark && (
              <TouchableOpacity onPress={handleBookmarkPress}>
                <Animated.View
                  style={{
                    transform: [{ scale: bookmarkScale }],
                  }}
                >
                  <MaterialIcons
                    name={isBookmarked ? "bookmark" : "bookmark-outline"}
                    size={20}
                    // color={isBookmarked ? "#60A5FA" : "#60A5FA"}
                    color="#FFFFFF"
                  />
                </Animated.View>
              </TouchableOpacity>
            )}
            {showDeleteButton && (
              <TouchableOpacity
                className="bg-red-500 rounded-full p-2"
                onPress={onDelete}
              >
                <AntDesign name="delete" size={16} color="white" />
              </TouchableOpacity>
            )}
          </View>
        </View>
        <View className="px-4">
          <Text
            onPress={onOpenDetails}
            style={{
              color: "white",
              fontFamily: "InterSemiBold",
              fontSize: 14,
              marginBottom: 4,
            }}
          >
            {title}
          </Text>

          <Text
            onPress={onOpenDetails}
            style={{
              color: "#D9D9D9",
              fontSize: 11,
              fontFamily: "InterRegular",
              lineHeight: 14,
            }}
            className="text-gray-400  mb-[10px]"
          >
            {content}
          </Text>
        </View>

        {showReactionsAndComments && reactions && (
          <View className="flex-row mb-3 gap-2 px-4">
            <Text
              className="text-[#8BAFCE]"
              style={{ fontSize: 9, fontFamily: "InterMedium" }}
            >
              {" "}
              ❤️ {reactions.heart}{" "}
            </Text>
            <Text
              className="text-[#8BAFCE]"
              style={{ fontSize: 9, fontFamily: "InterMedium" }}
            >
              🔥 {reactions.fire}
            </Text>
            <Text
              className="text-[#8BAFCE]"
              style={{ fontSize: 9, fontFamily: "InterMedium" }}
            >
              😮{reactions.wow}
            </Text>
            <Text
              className="text-[#8BAFCE]"
              style={{ fontSize: 9, fontFamily: "InterMedium" }}
            >
              💡 {reactions.acknowledgement}
            </Text>
          </View>
        )}

        {showReactionsAndComments && (
          <>
            <View className="border-y mb-4 border-white/10 py-3 sm:py-4 flex-row items-center justify-between px-4">
              <Text
                style={{
                  fontSize: 9,
                  fontFamily: "InterSemiBold",
                  lineHeight: 14,
                  color: "rgba(217, 217, 217, 0.5)",
                }}
              >
                Tap to react
              </Text>
              <View className="flex-row gap-8 mr-8 sm:mr-16 sm:gap-32">
                <TouchableOpacity
                  onPress={() => {
                    handleReact("heart");
                  }}
                >
                  <Text className="text-base">❤️</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    handleReact("fire");
                  }}
                >
                  <Text className="text-base">🔥</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    handleReact("wow");
                  }}
                >
                  <Text>😮</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    handleReact("acknowledgement");
                  }}
                >
                  <Text className="text-base">💡</Text>
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setIsCommentsOpen(true)}
              className="px-4"
            >
              <View className="bg-[#515A66] rounded-[8px] px-3 flex-row items-center">
                <TextInput
                  editable={false}
                  pointerEvents="none"
                  placeholder="Add a comment"
                  placeholderTextColor="rgba(217, 217, 217, 0.5)"
                  className="flex-1 text-white py-3"
                  style={{ fontSize: 10, fontFamily: "InterMedium" }}
                />
                <MaterialIcons name="send" size={20} color="#4C8BF5" />
              </View>
            </TouchableOpacity>
            <View className="flex-row items-center justify-between px-2 mt-3 mx-4">
              <View className="flex-row items-center">
                {(commenterImages.length > 0
                  ? commenterImages.slice(0, 3)
                  : [null, null, null]
                ).map((img, idx) => (
                  <View
                    key={idx}
                    className="-ml-2 h-6 w-6 rounded-full border border-[#1E293B] overflow-hidden items-center justify-center bg-[#334155]"
                  >
                    {img ? (
                      <Image
                        source={{ uri: img }}
                        style={{
                          width: "100%",
                          height: "100%",
                        }}
                      />
                    ) : null}
                  </View>
                ))}
                <Text
                  className="text-white ml-2"
                  style={{ fontSize: 9, fontFamily: "InterMedium" }}
                >
                  {Number(totalComments) > 0
                    ? Boolean(loggedUserCommented)
                      ? Number(totalComments) === 1
                        ? "You commented"
                        : `You and ${Number(totalComments) - 1} others commented`
                      : `${totalComments} commented`
                    : Boolean(loggedUserCommented)
                      ? "You commented"
                      : "No comments yet"}
                </Text>
              </View>
              <TouchableOpacity onPress={() => setIsCommentsOpen(true)}>
                <Text
                  style={{
                    fontSize: 9,
                    fontFamily: "InterMedium",
                    color: "#8BAFCE",
                  }}
                >
                  view comments
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
      <CommentsBottomSheet
        visible={isCommentsOpen}
        onClose={() => setIsCommentsOpen(false)}
        contentId={contentId as number}
        focusOnOpen
      />
    </>
  );
};

export default ArticleCard;
