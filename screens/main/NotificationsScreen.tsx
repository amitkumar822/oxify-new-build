import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { TEXT_SIZES } from "@/constants/textSizes";
const { useNavigation } = require("@react-navigation/native");
import { GradientLine } from "@/components/common/GradientLine";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import ShadowHeader from "@/components/common/ShadowHeader";
import { SCREEN_NAMES } from "@/constants";
import { apiCall, API_BASE_URL } from "@/api/utils";

const formatTimeAgo = (iso?: string) => {
  if (!iso) return "";
  const now = Date.now();
  const then = new Date(iso).getTime();
  const diffSec = Math.max(0, Math.floor((now - then) / 1000));
  if (diffSec < 60) return "Just now";
  const min = Math.floor(diffSec / 60);
  if (min < 60) return `${min} min${min === 1 ? "" : "s"} ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr} hour${hr === 1 ? "" : "s"} ago`;
  const day = Math.floor(hr / 24);
  if (day < 7) return `${day} day${day === 1 ? "" : "s"} ago`;
  const week = Math.floor(day / 7);
  if (week < 5) return `${week} week${week === 1 ? "" : "s"} ago`;
  const month = Math.floor(day / 30);
  if (month < 12) return `${month} month${month === 1 ? "" : "s"} ago`;
  const year = Math.floor(day / 365);
  return `${year} year${year === 1 ? "" : "s"} ago`;
};

// Future-ready row that consumes API notification shape
const NotificationRow = ({
  item,
  onViewDetails,
}: {
  item: any;
  onViewDetails?: () => void;
}) => {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 60 * 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <>
      <View className="flex-row items-start">
        {item?.image ? (
          <Image
            source={{ uri: item.image }}
            style={{ width: 30, height: 30, borderRadius: 15, marginRight: 12 }}
            contentFit="cover"
          />
        ) : (
          <View className="w-10 h-10 rounded-full bg-[#a0a3a8] mr-3" />
        )}
        <View className="flex-1">
          <Text
            className="text-white mb-3"
            style={{
              fontSize: 12,
              fontFamily: "InterRegular",
            }}
          >
            {item.description}
          </Text>
          {item.more_info?.is_redirect ||
          item.category === "streak_milestone" ? (
            <TouchableOpacity onPress={onViewDetails}>
              <Text
                className="text-[#8BAFCE]"
                style={{
                  fontSize: 10,
                  fontFamily: "InterMedium",
                }}
              >
                View Details
              </Text>
            </TouchableOpacity>
          ) : null}
        </View>
        <View className="flex-row items-center">
          <View className="w-1 h-1 rounded-full bg-[#ABB0BC] mx-1" />
          <Text
            style={{
              fontSize: 10,
              fontFamily: "InterRegular",
              color: "#ABB0BC",
            }}
          >
            {formatTimeAgo(item.notification_time)}
          </Text>
        </View>
      </View>
    </>
  );
};

const PER_PAGE = 10;

type NotificationListRow =
  | { type: "header"; title: string; key: string }
  | { type: "item"; item: any; key: string };

const NotificationsScreen: React.FC = () => {
  const navigation: any = useNavigation();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getBucketTitle = (isoDate?: string) => {
    if (!isoDate) return "Earlier";
    const now = new Date();
    const date = new Date(isoDate);
    if (isNaN(date.getTime())) return "Earlier";

    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    // if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return "Last 7 Days";
    if (diffDays < 30) return "Last 30 Days";
    return date.toLocaleString("default", { month: "long", year: "numeric" });
  };

  const loadNotifications = useCallback(
    async (pageToFetch: number, mode: "replace" | "append" = "replace") => {
      const url = `${API_BASE_URL}/notification_api/?per_page=${PER_PAGE}&page=${pageToFetch}`;
      const response = await apiCall(url, { method: "GET" });

      if (response.success) {
        const payload: any = response.data;
        const list = Array.isArray(payload?.data) ? payload.data : [];
        setNotifications((prev) =>
          mode === "replace" ? list : [...prev, ...list]
        );
        setHasNextPage(Boolean(payload?.hasNextPage));
        setPage(pageToFetch);
        setError(null);
      } else {
        setError(response.error || "Failed to load notifications");
      }
    },
    []
  );

  useEffect(() => {
    const initLoad = async () => {
      setInitialLoading(true);
      await loadNotifications(1, "replace");
      setInitialLoading(false);
    };
    initLoad();
  }, [loadNotifications]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadNotifications(1, "replace");
    setIsRefreshing(false);
  };

  const handleLoadMore = async () => {
    if (isLoadingMore || !hasNextPage || initialLoading) return;
    setIsLoadingMore(true);
    await loadNotifications(page + 1, "append");
    setIsLoadingMore(false);
  };

  const listData: NotificationListRow[] = useMemo(() => {
    const rows: NotificationListRow[] = [];
    const bucketCounts: Record<string, number> = {};

    notifications.forEach((item) => {
      const bucket = getBucketTitle(item?.notification_time);
      if (!bucketCounts[bucket]) {
        bucketCounts[bucket] = 0;
        rows.push({ type: "header", title: bucket, key: `header-${bucket}` });
      }

      rows.push({ type: "item", item, key: `notification-${item.id}` });
      bucketCounts[bucket] += 1;
    });

    return rows;
  }, [notifications]);

  const handleViewDetails = useCallback(
    (item: any) => {
      // Handle streak_milestone notifications
      if (item.category === "streak_milestone") {
        navigation.navigate(SCREEN_NAMES.STREAK);
        return;
      }

      // Handle article/content notifications
      let moreInfoParsed: any = null;
      try {
        // more_info can be a string (JSON) or an object
        if (typeof item.more_info === "string") {
          moreInfoParsed = JSON.parse(item.more_info);
        } else {
          moreInfoParsed = item.more_info;
        }
      } catch (e) {
        // If parsing fails, use more_info as is
        moreInfoParsed = item.more_info;
      }

      const contentId =
        moreInfoParsed?.content_id ||
        moreInfoParsed?.contentId ||
        item?.more_info?.content_id ||
        item?.more_info?.contentId ||
        item?.more_info?.data?.content_id;

      if (!contentId) {
        Alert.alert(
          "Unavailable",
          "Details are not available for this item yet."
        );
        return;
      }

      // Navigate to ArticleDetailsScreen with just contentId
      // The screen will fetch the full article data using the API
      navigation.navigate("ContentStack", {
        screen: SCREEN_NAMES.ARTICLE_DETAILS,
        params: { contentId: contentId },
      });
    },
    [navigation]
  );

  return (
    <LinearGradient
      colors={["#243551", "#242D3C", "#14181B"]}
      style={styles.gradient}
    >
      <SafeAreaView className="flex-1">
        <StatusBar barStyle="light-content" />
        {/* Header */}
        <ShadowHeader
          onPress={() => navigation.goBack()}
          title="Notifications"
        />

        <FlatList
          data={listData}
          keyExtractor={(row) => row.key}
          renderItem={({ item, index }) => {
            if (item.type === "header") {
              return (
                <View className="px-5 pt-5">
                  <Text
                    className="text-white font-semibold mb-2"
                    style={{
                      fontSize: 16,
                      fontFamily: "InterSemiBold",
                    }}
                  >
                    {item.title}
                  </Text>
                </View>
              );
            }

            const nextRow = listData[index + 1];
            const showDivider = nextRow?.type === "item";

            return (
              <View className="px-5 pt-3">
                <NotificationRow
                  item={item.item}
                  onViewDetails={() => handleViewDetails(item.item)}
                />
                {showDivider && (
                  <View
                    style={{ marginVertical: 8, backgroundColor: "#181F2A" }}
                  >
                    <GradientLine />
                  </View>
                )}
              </View>
            );
          }}
          ListEmptyComponent={() => (
            <View className="items-center justify-center py-10">
              {initialLoading ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : error ? (
                <Text className="text-white">{error}</Text>
              ) : (
                <Text className="text-white">No notifications</Text>
              )}
            </View>
          )}
          ListFooterComponent={() =>
            notifications.length > 0 ? (
              <View className="py-6 items-center justify-center">
                {isLoadingMore ? (
                  <ActivityIndicator size="small" color="#ffffff" />
                ) : hasNextPage ? null : (
                  <Text className="text-[#ABB0BC]" style={{ fontSize: 12 }}>
                    You're all caught up
                  </Text>
                )}
              </View>
            ) : null
          }
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.3}
          refreshing={isRefreshing}
          onRefresh={handleRefresh}
          contentContainerStyle={{ paddingBottom: 24 }}
          showsVerticalScrollIndicator={false}
        />
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

export default NotificationsScreen;





// import React, { useEffect, useState, useCallback, useMemo } from "react";
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StatusBar,
//   StyleSheet,
//   FlatList,
//   ActivityIndicator,
//   Alert,
// } from "react-native";
// import { LinearGradient } from "expo-linear-gradient";
// import { TEXT_SIZES } from "@/constants/textSizes";
// const { useNavigation } = require("@react-navigation/native");
// import { GradientLine } from "@/components/common/GradientLine";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { Image } from "expo-image";
// import ShadowHeader from "@/components/common/ShadowHeader";
// import { SCREEN_NAMES } from "@/constants";
// import { apiCall, API_BASE_URL } from "@/api/utils";

// const formatTimeAgo = (iso?: string) => {
//   if (!iso) return "";
//   const now = Date.now();
//   const then = new Date(iso).getTime();
//   const diffSec = Math.max(0, Math.floor((now - then) / 1000));
//   if (diffSec < 60) return "Just now";
//   const min = Math.floor(diffSec / 60);
//   if (min < 60) return `${min} min${min === 1 ? "" : "s"} ago`;
//   const hr = Math.floor(min / 60);
//   if (hr < 24) return `${hr} hour${hr === 1 ? "" : "s"} ago`;
//   const day = Math.floor(hr / 24);
//   if (day < 7) return `${day} day${day === 1 ? "" : "s"} ago`;
//   const week = Math.floor(day / 7);
//   if (week < 5) return `${week} week${week === 1 ? "" : "s"} ago`;
//   const month = Math.floor(day / 30);
//   if (month < 12) return `${month} month${month === 1 ? "" : "s"} ago`;
//   const year = Math.floor(day / 365);
//   return `${year} year${year === 1 ? "" : "s"} ago`;
// };

// // Future-ready row that consumes API notification shape
// const NotificationRow = ({
//   item,
//   onViewDetails,
// }: {
//   item: any;
//   onViewDetails?: () => void;
// }) => {
//   const [tick, setTick] = useState(0);
//   useEffect(() => {
//     const id = setInterval(() => setTick((t) => t + 1), 60 * 1000);
//     return () => clearInterval(id);
//   }, []);
//   return (
//     <>
//       <View className="flex-row items-start">
//         {item?.image ? (
//           <Image
//             source={{ uri: item.image }}
//             style={{ width: 30, height: 30, borderRadius: 15, marginRight: 12 }}
//             contentFit="cover"
//           />
//         ) : (
//           <View className="w-10 h-10 rounded-full bg-[#a0a3a8] mr-3" />
//         )}
//         <View className="flex-1">
//           <Text
//             className="text-white mb-3"
//             style={{
//               fontSize: 12,
//               fontFamily: "InterRegular",
//             }}
//           >
//             {item.description}
//           </Text>
//           {item.more_info?.is_redirect ? (
//             <TouchableOpacity onPress={onViewDetails}>
//               <Text
//                 className="text-[#8BAFCE]"
//                 style={{
//                   fontSize: 10,
//                   fontFamily: "InterMedium",
//                 }}
//               >
//                 View Details
//               </Text>
//             </TouchableOpacity>
//           ) : null}
//         </View>
//         <View className="flex-row items-center">
//           <View className="w-1 h-1 rounded-full bg-[#ABB0BC] mx-1" />
//           <Text style={{ fontSize: 10, fontFamily: "InterRegular", color: "#ABB0BC" }}>
//             {formatTimeAgo(item.notification_time)}
//           </Text>
//         </View>
//       </View>
//     </>
//   );
// };

// const PER_PAGE = 10;

// type NotificationListRow =
//   | { type: "header"; title: string; key: string }
//   | { type: "item"; item: any; key: string };

// const NotificationsScreen: React.FC = () => {
//   const navigation: any = useNavigation();
//   const [notifications, setNotifications] = useState<any[]>([]);
//   const [page, setPage] = useState(1);
//   const [hasNextPage, setHasNextPage] = useState(true);
//   const [isRefreshing, setIsRefreshing] = useState(false);
//   const [isLoadingMore, setIsLoadingMore] = useState(false);
//   const [initialLoading, setInitialLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   const getBucketTitle = (isoDate?: string) => {
//     if (!isoDate) return "Earlier";
//     const now = new Date();
//     const date = new Date(isoDate);
//     if (isNaN(date.getTime())) return "Earlier";

//     const diffMs = now.getTime() - date.getTime();
//     const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

//     if (diffDays === 0) return "Today";
//     if (diffDays === 1) return "Yesterday";
//     if (diffDays < 7) return "Last 7 Days";
//     if (diffDays < 30) return "Last 30 Days";
//     return date.toLocaleString("default", { month: "long", year: "numeric" });
//   };

//   const loadNotifications = useCallback(
//     async (pageToFetch: number, mode: "replace" | "append" = "replace") => {
//       const url = `${API_BASE_URL}/notification_api/?per_page=${PER_PAGE}&page=${pageToFetch}`;
//       const response = await apiCall(url, { method: "GET" });

//       if (response.success) {
//         const payload: any = response.data;
//         const list = Array.isArray(payload?.data) ? payload.data : [];
//         setNotifications((prev) =>
//           mode === "replace" ? list : [...prev, ...list]
//         );
//         setHasNextPage(Boolean(payload?.hasNextPage));
//         setPage(pageToFetch);
//         setError(null);
//       } else {
//         setError(response.error || "Failed to load notifications");
//       }
//     },
//     []
//   );

//   useEffect(() => {
//     const initLoad = async () => {
//       setInitialLoading(true);
//       await loadNotifications(1, "replace");
//       setInitialLoading(false);
//     };
//     initLoad();
//   }, [loadNotifications]);

//   const handleRefresh = async () => {
//     setIsRefreshing(true);
//     await loadNotifications(1, "replace");
//     setIsRefreshing(false);
//   };

//   const handleLoadMore = async () => {
//     if (isLoadingMore || !hasNextPage || initialLoading) return;
//     setIsLoadingMore(true);
//     await loadNotifications(page + 1, "append");
//     setIsLoadingMore(false);
//   };

//   const listData: NotificationListRow[] = useMemo(() => {
//     const rows: NotificationListRow[] = [];
//     const bucketCounts: Record<string, number> = {};

//     notifications.forEach((item) => {
//       const bucket = getBucketTitle(item?.notification_time);
//       if (!bucketCounts[bucket]) {
//         bucketCounts[bucket] = 0;
//         rows.push({ type: "header", title: bucket, key: `header-${bucket}` });
//       }

//       rows.push({ type: "item", item, key: `notification-${item.id}` });
//       bucketCounts[bucket] += 1;
//     });

//     return rows;
//   }, [notifications]);

//   const handleViewDetails = useCallback(
//     (item: any) => {
//       const contentId =
//         item?.more_info?.content_id ||
//         item?.more_info?.contentId ||
//         item?.more_info?.data?.content_id;

//       if (!contentId) {
//         Alert.alert("Unavailable", "Details are not available for this item yet.");
//         return;
//       }

//       const stubArticle = {
//         id: contentId,
//         title: item?.description || "Article",
//         author_first_name: "",
//         author_last_name: "",
//         author_image: item?.image,
//         content: item?.description || "",
//         reaction: null,
//         total_comments: 0,
//         logged_user_comment: false,
//         is_favourite_learning_hub: false,
//       };

//       navigation.navigate("ContentStack", {
//         screen: SCREEN_NAMES.ARTICLE_DETAILS,
//         params: { article: stubArticle },
//       });
//     },
//     [navigation]
//   );

//   return (
//     <LinearGradient
//       colors={[
//         "#243551",
//         "#242D3C",
//         "#14181B",
//       ]}
//       style={styles.gradient}
//     >
//       <SafeAreaView className="flex-1">
//         <StatusBar barStyle="light-content" />
//         {/* Header */}
//         <ShadowHeader onPress={() => navigation.goBack()} title="Notifications" />

//         <FlatList
//           data={listData}
//           keyExtractor={(row) => row.key}
//           renderItem={({ item, index }) => {
//             if (item.type === "header") {
//               return (
//                 <View className="px-5 pt-5">
//                   <Text
//                     className="text-white font-semibold mb-2"
//                     style={{
//                       fontSize: 16,
//                       fontFamily: "InterSemiBold",
//                     }}
//                   >
//                     {item.title}
//                   </Text>
//                 </View>
//               );
//             }

//             const nextRow = listData[index + 1];
//             const showDivider = nextRow?.type === "item";

//             return (
//               <View className="px-5 pt-3">
//                 <NotificationRow
//                   item={item.item}
//                   onViewDetails={() => handleViewDetails(item.item)}
//                 />
//                 {showDivider && (
//                   <View style={{ marginVertical: 8, backgroundColor: "#181F2A" }}>
//                     <GradientLine />
//                   </View>
//                 )}
//               </View>
//             );
//           }}
//           ListEmptyComponent={() => (
//             <View className="items-center justify-center py-10">
//               {initialLoading ? (
//                 <ActivityIndicator size="small" color="#ffffff" />
//               ) : error ? (
//                 <Text className="text-white">{error}</Text>
//               ) : (
//                 <Text className="text-white">No notifications</Text>
//               )}
//             </View>
//           )}
//           ListFooterComponent={() =>
//             notifications.length > 0 ? (
//               <View className="py-6 items-center justify-center">
//                 {isLoadingMore ? (
//                   <ActivityIndicator size="small" color="#ffffff" />
//                 ) : hasNextPage ? null : (
//                   <Text className="text-[#ABB0BC]" style={{ fontSize: 12 }}>
//                     You're all caught up
//                   </Text>
//                 )}
//               </View>
//             ) : null
//           }
//           onEndReached={handleLoadMore}
//           onEndReachedThreshold={0.3}
//           refreshing={isRefreshing}
//           onRefresh={handleRefresh}
//           contentContainerStyle={{ paddingBottom: 24 }}
//           showsVerticalScrollIndicator={false}
//         />
//       </SafeAreaView>
//     </LinearGradient>
//   );
// };

// const styles = StyleSheet.create({
//   gradient: {
//     flex: 1,
//     width: "100%",
//     height: "100%",
//   },
// });

// export default NotificationsScreen;
