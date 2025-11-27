import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Animated,
  Easing,
  ImageBackground,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { Theme, SCREEN_NAMES } from "../../constants";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
const { useNavigation, useRoute } = require("@react-navigation/native");
import { useHealthGoalTags } from "../../hooks/useHealthGoal";
import { showToast } from "../../config/toast";
import { BackHeader } from "@/helpers/BackHeader";
import { RFValue } from "react-native-responsive-fontsize";
import { TEXT_SIZES } from "@/constants/textSizes";
import { hp } from "@/constants/screenWH";
import Buttons from "@/components/common/Buttons";
import { animatedDuration, screenHeight } from "@/constants/comman";
import { Image } from "react-native";

interface RouteParams {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
}

const SignupHealthGoalsScreen: React.FC = () => {
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [selectedGoals, setSelectedGoals] = useState<number[]>([]);
  const [search, setSearch] = useState("");
  const navigation: any = useNavigation();
  const route = useRoute();
  const { firstName, lastName, email, username } = route.params as RouteParams;
  const { data, isLoading, error } = useHealthGoalTags();

  const tags: Array<{ id: number; name: string }> = useMemo(() => {
    try {
      if (
        data?.success &&
        data.data &&
        Array.isArray((data as any).data.data)
      ) {
        return ((data as any).data.data as any[]).map((t) => ({
          id: t.id,
          name: t.name,
        }));
      }
      return [];
    } catch (e) {
      console.warn("Error parsing health goal tags:", e);
      return [];
    }
  }, [data]);

  const filteredTags = search
    ? tags.filter((tag) =>
        tag.name && search
          ? String(tag.name)
              .toLowerCase()
              .includes(String(search).toLowerCase())
          : true
      )
    : tags;

  const handleContinue = () => {
    if (selectedGoals.length === 0) {
      showToast.error("Please select at least one health goal");
      return;
    }

    setSubmitting(true);
    try {
      setTimeout(() => {
        setSubmitting(false);
        navigation.navigate(SCREEN_NAMES.SIGNUP_PASSWORD, {
          firstName,
          lastName,
          email,
          username,
          healthGoals: selectedGoals,
        });
      }, 1000);
    } catch (e) {
      setSubmitting(false);
      console.warn("Navigation error:", e);
      showToast.error("Failed to proceed to next step");
    }
  };

  const handleBack = () => {
    try {
      navigation.goBack();
    } catch (e) {
      console.warn("Navigation back error:", e);
      showToast.error("Failed to go back");
    }
  };

  const toggleGoal = (id: number) => {
    if (selectedGoals.includes(id)) {
      setSelectedGoals(selectedGoals.filter((g) => g !== id));
    } else {
      setSelectedGoals([...selectedGoals, id]);
    }
  };

  const renderTags = (tags: Array<{ id: number; name: string }>) => (
    <View style={styles.tagsContainer}>
      {tags.map((tag) => (
        <TouchableOpacity
          key={tag.id}
          onPress={() => toggleGoal(tag.id)}
          activeOpacity={0.8}
          style={[
            styles.goalChip,
            selectedGoals.includes(tag.id) && styles.goalChipSelected,
          ]}
        >
          <Text
            style={[
              styles.goalChipText,
              selectedGoals.includes(tag.id) && styles.goalChipTextSelected,
            ]}
          >
            {tag.name}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  // --- Animation setup ---
  const slideAnim = useRef(new Animated.Value(screenHeight)).current;
  const flipAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: animatedDuration,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();

    Animated.timing(flipAnim, {
      toValue: 1,
      duration: animatedDuration,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, []);

  // Map 0 → 0deg, 1 → 180deg
  const rotateX = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"], // flip along X axis
  });

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
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <SafeAreaView style={{ flex: 1 }}>
          <Animated.View
            style={[
              styles.background,
              {
                transform: [{ rotateX }],
              },
            ]}
          >
            <ImageBackground
              source={require("../../assets/images/background2.png")}
              style={styles.backgroundImage}
              resizeMode="contain"
            />
          </Animated.View>

          <Animated.View
            style={{
              flex: 1,
              transform: [{ translateY: slideAnim }],
            }}
          >
            <BackHeader handleBack={handleBack} />

            <KeyboardAvoidingView
              style={{ flex: 1 }}
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              keyboardVerticalOffset={Platform.OS === "ios" ? 10 : 0}
              enabled={true}
            >
              <View style={styles.contentContainer}>
                {/* <AntDesign
                name="heart"
                size={TEXT_SIZES.xxl}
                color="white"
                style={styles.heartIcon}
              /> */}
                <Image
                  source={require("../../assets/icons/heart.png")}
                  style={styles.heartIcon}
                  width={28}
                  height={25}
                />
                <Text style={styles.title}>Choose your health goal tags</Text>

                <View style={styles.inputWrap}>
                  <TextInput
                    style={styles.inputBox}
                    value={search}
                    onChangeText={setSearch}
                    placeholder="Health goals"
                    placeholderTextColor="#797979"
                  />
                </View>

                {isLoading ? (
                  <View style={styles.loader}>
                    <ActivityIndicator
                      color={Theme.action.primary}
                      size="large"
                    />
                  </View>
                ) : error ? (
                  <Text style={styles.errorText}>
                    Failed to load health goals .
                  </Text>
                ) : (
                  <View style={styles.goalsSectionWrap}>
                    <ScrollView
                      style={styles.tagsScrollView}
                      showsVerticalScrollIndicator={false}
                      nestedScrollEnabled={true}
                    >
                      <View style={styles.tagsContainer}>
                        {renderTags(filteredTags)}
                      </View>
                    </ScrollView>
                  </View>
                )}
              </View>

              {/* Continue button */}
              <View style={styles.buttonContainer}>
                <Buttons
                  onPress={handleContinue}
                  title="Continue"
                  isLoading={submitting}
                  style={{
                    backgroundColor:
                      selectedGoals.length === 0 || isLoading
                        ? "#b9b1b1"
                        : "#F3F3F3",
                    borderRadius: 14,
                  }}
                />
              </View>
            </KeyboardAvoidingView>
          </Animated.View>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  background: {
    flex: 1,
    width: "150%",
    height: "150%",
    position: "absolute",
    left: RFValue(-190),
    top: RFValue(-230),
    opacity: 0.5,
  },
  backgroundImage: {
    flex: 1,
    width: "125%",
    height: "140%",
  },
  contentContainer: {
    flex: 1,
    paddingTop: 10,
    paddingBottom: 20,
  },
  buttonContainer: {
    marginTop: "auto",
    marginBottom: 56,
    borderRadius: 14,
  },
  title: {
    fontSize: TEXT_SIZES.lg,
    color: Theme.text.neutral,
    fontFamily: "Inter-medium",
    fontWeight: "500",
    marginVertical: 8,
  },
  heartIcon: {
    color: "#fff",
    fontWeight: "300",
    marginTop: 10,
  },
  inputWrap: {
    marginBottom: 15,
  },
  inputBox: {
    backgroundColor: "#fff",
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 2,
    borderColor: "#8BAFCE",
  },
  goalsSectionWrap: {
    height: hp(40),
    // marginBottom: 20,
  },
  tagsScrollView: {
    flex: 1,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    // backgroundColor: "#3A4",
    // borderRadius: 8,
  },
  tagColumn: {
    flex: 1,
    marginHorizontal: RFValue(10),
  },
  goalChip: {
    backgroundColor: "rgba(58, 64, 73, 1)",
    borderColor: "rgba(97, 107, 121, 1)",
    borderWidth: 1,
    opacity: 0.5,
    borderRadius: 8,
    paddingHorizontal: RFValue(14),
    paddingVertical: RFValue(4),
    marginBottom: RFValue(9),
    marginRight: RFValue(10),
    justifyContent: "center",
    alignItems: "center",
  },
  goalChipSelected: {
    backgroundColor: "#3A4049",
  },
  goalChipText: {
    fontSize: TEXT_SIZES.sm,
    color: "#FFFFFF",
    textAlign: "center",
    textTransform: "capitalize",
    fontWeight: "400",
  },
  goalChipTextSelected: {
    color: "#5694CD",
    fontWeight: "500",
  },
  loader: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  errorText: {
    color: "#ff4d4f",
    textAlign: "center",
    fontSize: 16,
  },
});

export default SignupHealthGoalsScreen;
