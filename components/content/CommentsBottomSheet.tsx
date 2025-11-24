import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
  Animated,
  PanResponder,
  ActivityIndicator,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Theme } from "@/constants";
import { TEXT_SIZES } from "@/constants/textSizes";
import CommentItem from "./CommentItem";
import { useComments } from "@/hooks/useLearning";
import { useAddComment } from "@/hooks/useLearning";
import { useLikeComment } from "@/hooks/useLearning";
import { useDeleteComment } from "@/hooks/useLearning";
import { useProfile } from "@/hooks/useProfile";

interface CommentsBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  contentId: number;
  focusOnOpen?: boolean;
}

const CommentsBottomSheet: React.FC<CommentsBottomSheetProps> = ({
  visible,
  onClose,
  contentId,
  focusOnOpen = false,
}) => {
  // API integration (fetch only when visible)
  const {
    data: commentsResponse,
    isLoading,
    error,
  } = useComments(contentId, visible);

  // Process comments data
  const comments = useMemo(() => {
    // @ts-ignore
    if (!commentsResponse?.data?.data?.comments) return [];
    // @ts-ignore
    return commentsResponse.data.data.comments;
  }, [commentsResponse]);

  // State for reply functionality
  const [replyingTo, setReplyingTo] = useState<{
    commentId: number;
    parentId: number | null;
    tagId: number | null;
    username: string;
  } | null>(null);
  const [replyText, setReplyText] = useState("");
  const inputRef = useRef<TextInput>(null);
  const addCommentMutation = useAddComment();
  const deleteCommentMutation = useDeleteComment();
  const likeCommentMutation = useLikeComment();
  const { data: profileResponse } = useProfile();
  const profileImage: string | null =
    (profileResponse as any)?.data?.data?.image || null;

  // Handlers
  const handleReply = (
    commentId: number,
    parentId: number | null,
    tagId: number | null
  ) => {
    // Find the comment to get username
    const findComment = (comments: any[], id: number): any => {
      for (const comment of comments) {
        if (comment.id === id) return comment;
        if (comment.replies) {
          const found = findComment(comment.replies, id);
          if (found) return found;
        }
      }
      return null;
    };

    const comment = findComment(comments, commentId);
    if (comment) {
      setReplyingTo({
        commentId,
        parentId: parentId || commentId,
        tagId,
        username: comment.user_name || "User",
      });
    }
  };

  const handleLike = (commentId: number, onError?: () => void) => {
    likeCommentMutation.mutate(commentId, {
      onError: () => {
        onError?.();
      },
    });
  };

  const handleSendReply = () => {
    if (replyText.trim() && replyingTo) {
      addCommentMutation.mutate({
        contentId,
        comment: replyText.trim(),
        parent: replyingTo.parentId,
        tag: replyingTo.tagId ?? undefined,
      });
      setReplyText("");
      setReplyingTo(null);
    } else if (replyText.trim()) {
      addCommentMutation.mutate({
        contentId,
        comment: replyText.trim(),
      });
      setReplyText("");
    }
  };

  const insets = useSafeAreaInsets();

  const [sheetHeight, setSheetHeight] = useState(0);
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
      if (focusOnOpen) {
        setTimeout(() => inputRef.current?.focus(), 250);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

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

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <Animated.View
        pointerEvents="none"
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
          backgroundColor: "black",
          opacity: overlayOpacity.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 0.5],
          }),
        }}
      />
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => animateClose(onClose)}
        style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0 }}
      />
      <Animated.View
        className="absolute bg-[#0F172A] rounded-t-3xl overflow-hidden"
        style={{
          left: 0,
          right: 0,
          bottom: 0,
          maxHeight: "80%",
          transform: [{ translateY }],
        }}
        onLayout={(e) => setSheetHeight(e.nativeEvent.layout.height)}
      >
        {/* Handle and title */}
        <View className="px-6 pt-4 pb-3" {...panResponder.panHandlers}>
          <View className="items-center mb-4">
            <View className="h-1 w-[48px] rounded-full bg-white/30" />
          </View>
          <Text className="text-white text-center" style={{ fontSize: 18, fontFamily: "InterSemiBold" }}>
            Comments
          </Text>
        </View>
        <View className="h-[1px] bg-white/15" />

        {/* Comments list */}
        <View className="flex-1">
          {isLoading ? (
            <View className="flex-1 justify-center items-center">
              <ActivityIndicator size="large" color="#60A5FA" />
              <Text className="text-gray-400 mt-4">Loading comments...</Text>
            </View>
          ) : error ? (
            <View className="flex-1 justify-center items-center px-4">
              <MaterialIcons name="error-outline" size={48} color="#ef4444" />
              <Text className="text-gray-400 mt-4 text-center">
                Failed to load comments. Please try again.
              </Text>
            </View>
          ) : comments.length === 0 ? (
            <View className="flex-1 justify-center items-center px-4">
              <MaterialIcons
                name="chat-bubble-outline"
                size={48}
                color="#6b7280"
              />
              <Text className="text-gray-400 mt-4 text-center">
                No comments yet. Be the first to comment!
              </Text>
            </View>
          ) : (
            <ScrollView
              className="px-4 py-4"
              showsVerticalScrollIndicator={false}
              scrollEventThrottle={0}
              bounces={false}
              decelerationRate="fast"
            >
              {comments.map((comment: any) => (
                <CommentItem
                  key={comment.id}
                  {...comment}
                  onReply={handleReply}
                  onLike={handleLike}
                  onLongPressDelete={(id: number) =>
                    deleteCommentMutation.mutate(id)
                  }
                />
              ))}
            </ScrollView>
          )}
        </View>

        {/* Input */}
        <View className="h-[0.6px] bg-[#515A66]" />
        <View className="px-4 py-3">
          {/* Reply indicator */}
          {replyingTo && (
            <View className="mb-3 p-3 bg-[#1e293b] rounded-lg">
              <View className="flex-row items-center justify-between">
                <Text style={{ fontSize: 11, fontFamily: "InterRegular", lineHeight: 15, color: "#ABB0BC" }}>
                  Replying to{" "}
                  <Text style={{ fontSize: 11, fontFamily: "InterSemiBold", lineHeight: 15, color: "#4C8BF5" }}>
                    {replyingTo.username}
                  </Text>
                </Text>
                <TouchableOpacity onPress={() => setReplyingTo(null)}>
                  <MaterialIcons name="close" size={20} color="#D9D9D9" />
                </TouchableOpacity>
              </View>
            </View>
          )}

          <View className="flex-row items-center px-4">
            <Image
              source={
                profileImage
                  ? { uri: profileImage }
                  : require("../../assets/icons/oxify_logo.png")
              }
              className="h-[31px] w-[31px] rounded-full mr-3"
            />
            <View className="flex-1 flex-row items-center bg-[#515A66] rounded-[12px] px-4">
              <TextInput
                ref={inputRef}
                placeholder={
                  replyingTo
                    ? `Reply to ${replyingTo.username}...`
                    : "Add a comment"
                }
                placeholderTextColor="rgba(217, 217, 217, 0.5)"
                className="flex-1 text-white py-3"
                style={{ fontSize: 9, fontFamily: "InterRegular", lineHeight: 14, color: "#E6E6E6" }}
                value={replyText}
                onChangeText={setReplyText}
                multiline
                maxLength={500}
              />
              <TouchableOpacity
                onPress={handleSendReply}
                disabled={!replyText.trim()}
              >
                <MaterialIcons
                  name="send"
                  size={22}
                  color={replyText.trim() ? "#4C8BF5" : "#6b7280"}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Animated.View>
    </Modal>
  );
};

export default CommentsBottomSheet;
