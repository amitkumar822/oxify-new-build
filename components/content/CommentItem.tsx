import React, { useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  Animated,
  Easing,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Theme } from "@/constants";
import { TEXT_SIZES } from "@/constants/textSizes";
import { capitalizeFirst } from "@/utils/capitalizeFirst";

interface CommentItemProps {
  id: number;
  user: number;
  user_name: string | null;
  user_image: string | null;
  comment: string;
  parent: number | null;
  tag: number | null;
  tag_username?: string | null;
  created_at: string;
  is_liked: boolean;
  like_counts: number;
  is_edited: boolean;
  edited_at: string | null;
  replies?: CommentItemProps[];
  total_replies: number;
  onReply?: (
    commentId: number,
    parentId: number | null,
    tagId: number | null
  ) => void;
  onLike?: (commentId: number, onError?: () => void) => void;
  depth?: number;
  onLongPressDelete?: (commentId: number) => void;
}

const CommentItem: React.FC<CommentItemProps> = ({
  id,
  user_name,
  user_image,
  comment,
  parent,
  tag_username,
  created_at,
  is_liked,
  like_counts,
  is_edited,
  replies = [],
  onReply,
  onLike,
  depth = 0,
  onLongPressDelete,
}) => {
  // Format timestamp
  const formatTimestamp = (timestamp: string) => {
    const now = new Date();
    const commentDate = new Date(timestamp);
    const diffInMinutes = Math.floor(
      (now.getTime() - commentDate.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 1) return "just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return diffInHours === 1 ? "1 hour ago" : `${diffInHours} hours ago`;
    }

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return "1 day";
    if (diffInDays < 30) return `${diffInDays} days ago`;

    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) {
      return diffInMonths === 1 ? "1 month ago" : `${diffInMonths} months ago`;
    }

    const diffInYears = Math.floor(diffInMonths / 12);
    return diffInYears === 1 ? "1 year ago" : `${diffInYears} years ago`;
  };

  // Get user initials
  const getInitials = (name: string | null) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const marginLeft = (depth || 0) * 16;
  const formattedTag = tag_username
    ? `@${tag_username.replace(/^@/, "").toLowerCase()}`
    : null;

  // Optimistic like state
  const [optimisticLiked, setOptimisticLiked] = useState<boolean>(!!is_liked);
  const [optimisticCount, setOptimisticCount] = useState<number>(
    like_counts || 0
  );

  // Bubble like animation
  const likeScale = useRef(new Animated.Value(1)).current;
  const runLikeAnimation = () => {
    Animated.sequence([
      Animated.timing(likeScale, {
        toValue: 1.4,
        duration: 120,
        useNativeDriver: true,
        easing: Easing.out(Easing.quad),
      }),
      Animated.timing(likeScale, {
        toValue: 0.9,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.spring(likeScale, { toValue: 1, useNativeDriver: true }),
    ]).start();
  };

  const onPressLike = () => {
    // Optimistic update first
    runLikeAnimation();
    const prevLiked = optimisticLiked;
    const prevCount = optimisticCount;

    const nextLiked = !prevLiked;
    const nextCount = prevCount + (nextLiked ? 1 : -1);

    setOptimisticLiked(nextLiked);
    setOptimisticCount(Math.max(0, nextCount));

    // Trigger API - revert if fails
    onLike?.(id, () => {
      setOptimisticLiked(prevLiked);
      setOptimisticCount(prevCount);
    });
  };

  return (
    <View className="mb-4" style={{ marginLeft }}>
      <View className="flex-row justify-between items-start">
        <TouchableOpacity
          activeOpacity={1}
          className="flex-1 flex-row pr-3 mr-6"
          delayLongPress={350}
          onLongPress={() =>
            Alert.alert(
              "Delete comment",
              "Are you sure you want to delete this comment?",
              [
                { text: "Cancel", style: "cancel" },
                {
                  text: "Delete",
                  style: "destructive",
                  onPress: () => onLongPressDelete?.(id),
                },
              ]
            )
          }
        >
          {/* User Avatar */}
          <View className="h-8 w-8 rounded-full mr-3 bg-orange-500 items-center justify-center">
            {user_image ? (
              <Image
                source={{ uri: user_image }}
                className="h-8 w-8 rounded-full"
                resizeMode="cover"
              />
            ) : (
              <Text className="text-white text-xs font-semibold">
                {getInitials(user_name)}
              </Text>
            )}
          </View>

          <View className="flex-1">
            {/* Username and timestamp */}
            <View className="flex-row items-center mb-1">
              <Text
                className="text-white mr-2"
                style={{
                  color: Theme.text.lightBlue,
                  fontSize: 15,
                  fontFamily: "InterSemiBold",
                }}
              >
                {capitalizeFirst(user_name ?? "User")}
              </Text>
              <Text
                style={{
                  fontSize: 11,
                  fontFamily: "InterRegular",
                  lineHeight: 15,
                  color: "#ABB0BC",
                }}
              >
                {formatTimestamp(created_at)}
                {is_edited && " (edited)"}
              </Text>
            </View>

            {/* Comment text */}
            <Text
              className="text-gray-200 mb-2"
              style={{
                fontSize: 13,
                fontFamily: "InterRegular",
                color: "#E6E6E6",
                lineHeight: 15,
              }}
            >
              {formattedTag ? (
                <Text style={{ color: Theme.text.lightBlue }}>
                  {formattedTag}{" "}
                </Text>
              ) : null}
              {comment}
            </Text>

            {/* Reply button */}
            <TouchableOpacity
              className="mb-2"
              onPress={() => onReply?.(id, parent, parent !== null ? id : null)}
            >
              <Text
                style={{
                  fontSize: 11,
                  fontFamily: "InterRegular",
                  lineHeight: 15,
                  color: "#ABB0BC",
                }}
              >
                Reply
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>

        {/* Like button with bubble effect */}
        <TouchableOpacity className="items-center" onPress={onPressLike}>
          <Animated.View style={{ transform: [{ scale: likeScale }] }}>
            <MaterialIcons
              name={optimisticLiked ? "favorite" : "favorite-border"}
              size={18}
              color={optimisticLiked ? "#ef4444" : "#D9D9D9"}
            />
          </Animated.View>
          {optimisticCount > 0 && (
            <Text
              style={{
                fontSize: 11,
                fontFamily: "InterRegular",
                lineHeight: 12,
                color: "#ABB0BC",
                marginTop: 2,
              }}
            >
              {optimisticCount}
            </Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Render replies */}
      {replies && replies.length > 0 && (
        <View className="mt-2">
          {replies.map((reply) => (
            <CommentItem
              key={reply.id}
              {...reply}
              onReply={onReply}
              onLike={onLike}
              depth={depth + 1}
              onLongPressDelete={onLongPressDelete}
            />
          ))}
        </View>
      )}
    </View>
  );
};

export default CommentItem;
