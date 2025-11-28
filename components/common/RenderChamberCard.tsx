import React from 'react';
import { Text, View, TouchableOpacity, Image, Platform } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { ChamberModel } from '@/screens/main/ChamberSelectionScreen';
import { capitalizeFirst } from '@/utils/capitalizeFirst';

interface RenderChamberCardProps {
  model: ChamberModel;
  isSelected: boolean;
  onPress: (model: ChamberModel) => void;
}

const RenderChamberCard: React.FC<RenderChamberCardProps> = ({
  model,
  isSelected,
  onPress,
}) => {
  return (
    <View style={{ width: "49%", marginBottom: 5 }}>
      <TouchableOpacity
        onPress={() => onPress(model)}
        style={{ width: "100%" }}
        activeOpacity={0.9}
      >
        <View className="relative px-1"
          style={{
            // iOS shadow properties
            ...(Platform.OS === 'ios' && {
              shadowColor: isSelected ? "yellow" : "transparent",
              shadowOffset: { width: 1, height: 2 },
              shadowOpacity: 0.8,
              shadowRadius: 4,
            }),
            // Android shadow and border
            ...(Platform.OS === 'android' && {
              borderRadius: 20,
              shadowColor: isSelected ? "yellow" : "transparent",
              elevation: 2,
            }),
          }}
        >
          <Image
            source={require("@/assets/images/chamber_model.png")}
            style={{
              width: "100%",
              height: RFValue(85),
              resizeMode: "contain",
            }}
          />
          <Text className="text-white text-center absolute top-4 left-0 right-0"
            style={{
              fontFamily: "RobotoRegular",
              fontSize: RFValue(8.5),
            }}
          >{capitalizeFirst(model.name)}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default RenderChamberCard;
