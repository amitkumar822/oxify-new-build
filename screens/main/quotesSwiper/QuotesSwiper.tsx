import { Theme } from "@/constants";
import React, { useMemo, useRef, useState } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import Swiper from "react-native-deck-swiper";
import { useQuote } from "@/hooks_main/useSession";


export default function QuotesSwiper() {
  const swiperRef = useRef<any>(null);
  const [swiperKey, setSwiperKey] = useState<number>(0);
  const [currentDate, setCurrentDate] = useState<string>(() => {
    // Start with today's date
    const today = new Date();
    return today.toISOString().split("T")[0]; // Format: YYYY-MM-DD
  });

  const { data: quoteResponse, isLoading, error } = useQuote(currentDate);

  // Calculate the earliest allowed date (7 days ago)
  const getEarliestAllowedDate = () => {
    const today = new Date();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 7);
    return sevenDaysAgo.toISOString().split("T")[0];
  };

  const earliestAllowedDate = getEarliestAllowedDate();

  // Check if we can go to previous date
  const canGoToPrevious = () => {
    const currentDateObj = new Date(currentDate);
    const earliestDateObj = new Date(earliestAllowedDate);
    return currentDateObj > earliestDateObj;
  };

  // Check if we can go to next date (future) but NOT beyond today
  const canGoToNext = () => {
    const currentDateObj = new Date(currentDate);
    const todayObj = new Date();
    const todayStr = todayObj.toISOString().split("T")[0];
    const todayOnly = new Date(todayStr); // zero-out time for consistent compare
    return currentDateObj < todayOnly;
  };

  // Dynamically control swipe availability (OPPOSITE of current):
  // Left => next (towards today); Right => past
  const disableLeftSwipe = useMemo(() => !canGoToNext(), [currentDate]);
  const disableRightSwipe = useMemo(
    () => !canGoToPrevious(),
    [currentDate, earliestAllowedDate]
  );

  const handleSwipedRight = () => {
    // Right swipe => go to previous (past)
    if (canGoToPrevious()) {
      const prevDate = new Date(currentDate);
      prevDate.setDate(prevDate.getDate() - 1);
      const newDate = prevDate.toISOString().split("T")[0];
      setCurrentDate(newDate);
      setSwiperKey((k) => k + 1);
      requestAnimationFrame(() => {
        try {
          swiperRef.current?.jumpToCardIndex?.(0);
        } catch { }
      });
    } else {
      console.log("🚫 Cannot go to previous date - 7 day limit reached");
    }
  };

  const handleSwipedLeft = () => {
    // Left swipe => go to next (towards today), but not beyond today
    console.log(
      "⬅️ Left swipe - attempting to go to next date (towards today)"
    );
    if (canGoToNext()) {
      const nextDate = new Date(currentDate);
      nextDate.setDate(nextDate.getDate() + 1);
      const newDate = nextDate.toISOString().split("T")[0];
      console.log("✅ Going to next date:", newDate);
      setCurrentDate(newDate);
      setSwiperKey((k) => k + 1);
      requestAnimationFrame(() => {
        try {
          swiperRef.current?.jumpToCardIndex?.(0);
        } catch { }
      });
    } else {
      console.log("🚫 Cannot go to next date - already at today");
    }
  };

  // Get quote data for current date
  const currentQuoteData = useMemo(() => {
    const data = (quoteResponse as any)?.data?.data;
    const quote =
      typeof data?.quote === "string" && data.quote.length > 0
        ? data.quote.charAt(0).toUpperCase() + data.quote.slice(1)
        : null;
    return {
      image:
        typeof data?.image === "string" && data.image.length > 0
          ? data.image
          : null,
      quote,
    };
  }, [quoteResponse]);

  // Create cards array with current quote data from API only
  const cards = useMemo(() => {
    // Show loading state
    if (isLoading) {
      return [
        {
          id: 1,
          text: "Loading today's quote...",
          author: "Daily Quote",
          image:
            "https://image.cnbcfm.com/api/v1/image/107293744-1693398435735-elon.jpg?v=1738327797&w=800&h=600&ffmt=webp",
        },
      ];
    }

    // Show error state
    if (error) {
      return [
        {
          id: 1,
          text: "Unable to load quote. Please try again later.",
          author: "Daily Quote",
          image:
            "https://image.cnbcfm.com/api/v1/image/107293744-1693398435735-elon.jpg?v=1738327797&w=800&h=600&ffmt=webp",
        },
      ];
    }

    // Show API data if available
    if (currentQuoteData.image || currentQuoteData.quote) {
      return [
        {
          id: 1,
          text: currentQuoteData.quote || "No quote available for this date.",
          author: "Daily Quote",
          image:
            currentQuoteData.image ||
            "https://image.cnbcfm.com/api/v1/image/107293744-1693398435735-elon.jpg?v=1738327797&w=800&h=600&ffmt=webp",
        },
      ];
    }

    // Fallback when no data
    return [
      {
        id: 1,
        text: "local Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam nibh leo, mattis eget facilisis vitae, sodales eu massa.",
        author: "Daily Quote",
        image:
          "https://image.cnbcfm.com/api/v1/image/107293744-1693398435735-elon.jpg?v=1738327797&w=800&h=600&ffmt=webp",
      },
    ];
  }, [currentQuoteData, isLoading, error]);

  // Format date for display
  const formatDateForDisplay = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    if (dateString === today.toISOString().split("T")[0]) {
      return "Today's Quotes";
    } else if (dateString === yesterday.toISOString().split("T")[0]) {
      return "Yesterday's Quotes";
    } else {
      return (
        date.toLocaleDateString("en-US", {
          weekday: "long",
          month: "short",
          day: "numeric",
        }) + "'s Quotes"
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{formatDateForDisplay(currentDate)}</Text>
      <View style={styles.cardStack}>
        <View style={styles.backgroundCard3} />
        <View style={styles.backgroundCard2} />
        <View style={styles.swiperContainer}>
          <Swiper
            key={swiperKey}
            ref={swiperRef}
            cards={cards}
            cardIndex={0}
            renderCard={(card) =>
              card ? (
                <View style={styles.card}>
                  <View style={styles.leftBackground} />
                  <View style={styles.quoteContent}>
                    <Image
                      source={require("@/assets/images/quote-icon.png")}
                      style={styles.quoteIcon}
                    />
                    <Text
                      style={styles.quoteText}
                      numberOfLines={5}
                      ellipsizeMode="tail"
                    >
                      {card.text}
                    </Text>
                  </View>
                  <View style={styles.imageContainer}>
                    <Image
                      source={{ uri: card.image }}
                      style={styles.cardImage}
                    />
                    <View style={styles.imageOverlay} />
                  </View>
                </View>
              ) : (
                <View style={styles.card} />
              )
            }
            stackSize={1}
            backgroundColor="transparent"
            infinite={false}
            verticalSwipe={false}
            disableLeftSwipe={disableLeftSwipe}
            disableRightSwipe={disableRightSwipe}
            onSwipedRight={handleSwipedRight}
            onSwipedLeft={handleSwipedLeft}
            disableTopSwipe
            disableBottomSwipe
            animateCardOpacity={false}
            swipeAnimationDuration={180}
            cardHorizontalMargin={0}
            cardVerticalMargin={0}
            useViewOverflow={false}
            onSwipedAll={() => {
              // When all cards are swiped, reset to show current date's quote
              console.log("🔄 All cards swiped - staying on current date");
            }}
          />
        </View>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: "transparent",
  },
  title: {
    fontSize: 14,
    fontFamily: "InterSemiBold",
    color: Theme.text.white,
    marginBottom: 10,
    alignSelf: "flex-start",
  },
  cardStack: {
    alignItems: "center",
    position: "relative",
    width: "100%",
  },
  backgroundCard2: {
    width: "90%",
    height: 146, //rf140
    backgroundColor: "#374C62",
    borderRadius: 16,
    position: "absolute",
    bottom: -16,
  },
  backgroundCard3: {
    width: "80%",
    height: 136, //rf130
    backgroundColor: "#304256", //#304256
    borderRadius: 16,
    position: "absolute",
    bottom: -30,
    // opacity: 0.4,
  },
  swiperContainer: {
    width: "100%",
    height: 146, //rf150
    borderRadius: 16,
    overflow: "hidden",
  },
  card: {
    width: "100%",
    height: 166, //rf150
    borderRadius: 16,
    backgroundColor: "#3E5670",
    flexDirection: "row",
    overflow: "hidden",
    position: "relative",
  },
  leftBackground: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: "40%",
    backgroundColor: "#3E5670",
    zIndex: 1,
  },
  quoteContent: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    padding: 18,
    paddingLeft: 27,
    justifyContent: "center",
    zIndex: 2,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  quoteIcon: {
    width: 38.81,
    height: 32.67,
  },
  quoteText: {
    color: "#EEEEEE",
    fontSize: 16,
    lineHeight: 20,
    flex: 1,
    zIndex: 3,
    paddingRight: "19%",
    fontFamily: "Ramabhadra",
  },
  imageContainer: {
    position: "absolute",
    top: 0,
    right: 0,
    width: "60%",
    height: "100%",
    overflow: "hidden",
    zIndex: 1,
  },
  cardImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  imageOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(62, 86, 112, 0.5)",
    // borderRadius: 16,
  },
});
