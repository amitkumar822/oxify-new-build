import React, { useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
} from "react-native";
// @ts-ignore
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Theme, SCREEN_NAMES } from "../../constants";
import { RFValue } from "react-native-responsive-fontsize";
import { useAuth } from "../../contexts/AuthContext";

const ICON_SIZE = RFValue(20);
const CENTER_BUTTON_SIZE = RFValue(80);

const CustomTabBar: React.FC<BottomTabBarProps> = ({ state, navigation }) => {
    const insets = useSafeAreaInsets();
    const { tabBackgroundColor } = useAuth();

  const handlePress = (routeName: string, index: number) => {
    if (routeName === "StartSessionTab") {
      navigation.navigate("StartSessionTab", {
        screen: SCREEN_NAMES.SESSION_DETAILS,
      });
      return;
    }
    navigation.navigate(routeName as never);
  };

  return (
    <View
      style={{
        backgroundColor: tabBackgroundColor || "#243551", // Fallback to default color
      }}
    >
      <View>
        <View style={[styles.wrapper]}>
          {/* Bottom Navigation Bar with 5 tabs */}
          <ImageBackground
            source={require("@/assets/tabs/TabBackground.png")}
            style={styles.container}
            resizeMode="stretch"
          >
            {/* Home Tab */}
            <TouchableOpacity
              style={styles.tabButton}
              onPress={() => handlePress("DashboardTab", 0)}
              activeOpacity={0.8}
            >
              <Ionicons
                name={state.index === 0 ? "home" : "home-outline"}
                size={ICON_SIZE}
                color={Theme.text.lightBlue}
              />
              <Text style={styles.label}>Home</Text>
            </TouchableOpacity>

            {/* Statistics Tab */}
            <TouchableOpacity
              style={styles.tabButton}
              onPress={() => handlePress("StatisticsTab", 1)}
              activeOpacity={0.8}
            >
              <Ionicons
                name={state.index === 1 ? "stats-chart" : "stats-chart-outline"}
                size={ICON_SIZE}
                color={Theme.text.lightBlue}
              />
              <Text style={styles.label}>Statistics</Text>
            </TouchableOpacity>

            {/* Start Session Tab */}
            <TouchableOpacity
              style={[styles.tabButton, {position: "relative"}]}
              onPress={() =>
                navigation.getParent()?.navigate(SCREEN_NAMES.SESSION_SETUP)
              }
              activeOpacity={0.8}
            >
              <ImageBackground
                source={require("@/assets/tabs/start_session2.png")}
                style={{
                  width: RFValue(55),
                  height: RFValue(55),
                  position: "absolute",
                  top: RFValue(-53),
                  zIndex: 100,
                }}
                resizeMode="contain"
              />
              <Text
                style={[
                  styles.label,
                  {
                    marginBottom: RFValue(-20),
                    position: "absolute"

                  },
                ]}
              >
                Start Session
              </Text>
            </TouchableOpacity>

            {/* HBOT Hub Tab */}
            <TouchableOpacity
              style={styles.tabButton}
              onPress={() => handlePress("ProtocolsTab", 2)}
              activeOpacity={0.8}
            >
              <Ionicons
                name={
                  state.index === 2 ? "hardware-chip" : "hardware-chip-outline"
                }
                size={ICON_SIZE}
                color={Theme.text.lightBlue}
              />
              <Text style={styles.label}>HBOT Hub</Text>
            </TouchableOpacity>

            {/* Profile Tab */}
            <TouchableOpacity
              style={styles.tabButton}
              onPress={() => handlePress("ProfileTab", 2)}
              activeOpacity={0.8}
            >
              <Ionicons
                name={state.index === 3 ? "person" : "person-outline"}
                size={ICON_SIZE}
                color={Theme.text.lightBlue}
              />
              <Text style={styles.label}>Profile</Text>
            </TouchableOpacity>
          </ImageBackground>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: "transparent",
  },
  container: {
    paddingHorizontal: 20,
    paddingVertical: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    zIndex: 0,
    paddingBottom: 27
  },
  tabButton: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 4,
    flex: 1,
  },
  centerSpace: {
    width: CENTER_BUTTON_SIZE,
  },
  label: {
    marginTop: 6,
    fontSize: 10,
    color: Theme.text.lightBlue,
    textAlign: "center",
    fontWeight: "600",
  },
  centerFabWrapper: {
    position: "absolute",
    alignSelf: "center",
    bottom: 18.2,
    zIndex: 5,
    alignItems: "center",
  },
  centerFabButton: {
    width: CENTER_BUTTON_SIZE,
    height: CENTER_BUTTON_SIZE,
    borderRadius: CENTER_BUTTON_SIZE / 2,
    justifyContent: "center",
    alignItems: "center",
  },
  startSessionIcon: {
    width: 55,
    height: 55,
    marginBottom: 3.5,
  },
  startSessionLabel: {
    fontSize: 10,
    paddingVertical: 3.7,
    color: Theme.text.lightBlue,
    textAlign: "center",
    fontWeight: "600",
  },
});

export default CustomTabBar;

// import React, { useRef } from "react";
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   ImageBackground,
//   Dimensions,
//   Animated,
//   Easing,
// } from "react-native";
// // @ts-ignore
// import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
// import { useSafeAreaInsets } from "react-native-safe-area-context";
// import { Ionicons } from "@expo/vector-icons";
// import { Theme, SCREEN_NAMES } from "../../constants";
// import { RFValue } from "react-native-responsive-fontsize";

// const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

// // Responsive sizing based on screen dimensions
// const getResponsiveSize = (size: number) => {
//   const baseWidth = 375; // Base width for iPhone X/11/12/13/14
//   const scale = screenWidth / baseWidth;
//   return Math.round(size * scale);
// };

// const ICON_SIZE = RFValue(20);
// const CENTER_BUTTON_SIZE = RFValue(80);
// const CENTER_ICON_SIZE = RFValue(65);

// const CustomTabBar: React.FC<BottomTabBarProps> = ({ state, navigation }) => {
//   const insets = useSafeAreaInsets();

//   const handlePress = (routeName: string, index: number) => {
//     if (routeName === "StartSessionTab") {
//       navigation.navigate("StartSessionTab", {
//         screen: SCREEN_NAMES.SESSION_DETAILS,
//       });
//       return;
//     }
//     navigation.navigate(routeName as never);
//   };

//   return (
//     <View className="bg-gray-950">
//       <View style={[styles.wrapper, { paddingBottom: insets.bottom }]}>
//         {/* Bottom Navigation Bar with 5 tabs */}
//         <ImageBackground
//           source={require("@/assets/tabs/TabBackground.png")}
//           style={styles.container}
//           resizeMode="stretch"
//         >
//           {/* Home Tab */}
//           <TouchableOpacity
//             style={styles.tabButton}
//             onPress={() => handlePress("DashboardTab", 0)}
//             activeOpacity={0.8}
//           >
//             <Ionicons
//               name={state.index === 0 ? "home" : "home-outline"}
//               size={ICON_SIZE}
//               color={Theme.text.lightBlue}
//             />
//             <Text style={styles.label}>Home</Text>
//           </TouchableOpacity>

//           {/* Statistics Tab */}
//           <TouchableOpacity
//             style={styles.tabButton}
//             onPress={() => handlePress("StatisticsTab", 1)}
//             activeOpacity={0.8}
//           >
//             <Ionicons
//               name={state.index === 1 ? "stats-chart" : "stats-chart-outline"}
//               size={ICON_SIZE}
//               color={Theme.text.lightBlue}
//             />
//             <Text style={styles.label}>Statistics</Text>
//           </TouchableOpacity>

//           {/* Start Session Tab */}
//           <TouchableOpacity
//             style={styles.tabButton}
//             onPress={() =>
//               navigation.getParent()?.navigate(SCREEN_NAMES.SESSION_SETUP)
//             }
//             activeOpacity={0.8}
//           >
//             <ImageBackground
//               source={require("@/assets/tabs/start_session2.png")}
//               style={{
//                 width: RFValue(65),
//                 height: RFValue(65),
//                 position: "absolute",
//                 top: RFValue(-56),
//               }}
//               resizeMode="contain"
//             />
//             <Text
//               style={[
//                 styles.label,
//                 {
//                   marginBottom: RFValue(-12),
//                 },
//               ]}
//             >
//               Start Session
//             </Text>
//           </TouchableOpacity>

//           {/* Center Space for FAB - placeholder */}
//           {/* <View style={styles.centerSpace} /> */}

//           {/* HBOT Hub Tab */}
//           <TouchableOpacity
//             style={styles.tabButton}
//             onPress={() => handlePress("ProtocolsTab", 2)}
//             activeOpacity={0.8}
//           >
//             <Ionicons
//               name={
//                 state.index === 2 ? "hardware-chip" : "hardware-chip-outline"
//               }
//               size={ICON_SIZE}
//               color={Theme.text.lightBlue}
//             />
//             <Text style={styles.label}>HBOT Hub</Text>
//           </TouchableOpacity>

//           {/* Profile Tab */}
//           <TouchableOpacity
//             style={styles.tabButton}
//             onPress={() => handlePress("ProfileTab", 2)}
//             activeOpacity={0.8}
//           >
//             <Ionicons
//               name={state.index === 3 ? "person" : "person-outline"}
//               size={ICON_SIZE}
//               color={Theme.text.lightBlue}
//             />
//             <Text style={styles.label}>Profile</Text>
//           </TouchableOpacity>
//         </ImageBackground>
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   wrapper: {
//     backgroundColor: "transparent",
//   },
//   container: {
//     paddingHorizontal: RFValue(20),
//     paddingVertical: RFValue(18),
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     zIndex: 0,
//   },
//   tabButton: {
//     justifyContent: "center",
//     alignItems: "center",
//     paddingVertical: RFValue(4),
//     flex: 1,
//   },
//   centerSpace: {
//     width: CENTER_BUTTON_SIZE,
//   },
//   label: {
//     marginTop: RFValue(6),
//     fontSize: RFValue(10),
//     color: Theme.text.lightBlue,
//     textAlign: "center",
//     fontWeight: "600",
//   },
//   centerFabWrapper: {
//     position: "absolute",
//     alignSelf: "center",
//     bottom: RFValue(18.2),
//     zIndex: 5,
//     alignItems: "center",
//   },
//   centerFabButton: {
//     width: CENTER_BUTTON_SIZE,
//     height: CENTER_BUTTON_SIZE,
//     borderRadius: CENTER_BUTTON_SIZE / 2,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   startSessionIcon: {
//     width: RFValue(55),
//     height: RFValue(55),
//     marginBottom: RFValue(3.5),
//   },
//   startSessionLabel: {
//     fontSize: RFValue(10),
//     paddingVertical: RFValue(3.7),
//     color: Theme.text.lightBlue,
//     textAlign: "center",
//     fontWeight: "600",
//   },
// });

// export default CustomTabBar;
