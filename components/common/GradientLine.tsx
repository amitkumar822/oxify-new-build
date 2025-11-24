import { StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { RFValue } from "react-native-responsive-fontsize";

export const GradientLine = ({
  color1 = "#181F2A",
  color2 = "#3E5670",
  color3 = "#181F2A",
}: {
  color1?: string;
  color2?: string;
  color3?: string;
}) => {
  return (
    <View
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "row",
        paddingHorizontal: 20,
      }}
    >
      <LinearGradient
        colors={[color1, color2, color3]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.bottomgradient}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  bottomgradient: {
    width: "100%",
    height: 1,
    alignItems: "center",
    borderRadius: RFValue(100),
  },
});
