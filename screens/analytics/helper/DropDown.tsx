import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import { TEXT_SIZES } from "@/constants/textSizes";
import { capitalizeFirst } from "@/utils/capitalizeFirst";

interface DropdownProps {
  visible: boolean;
  onClose: () => void;
  options: Array<{ id: number | string; name: string }>;
  onSelect: (option: { id: number | string; name: string }) => void;
  selectedValue: string;
  title: string;
  topOffset?: number; // pixel offset from anchor top
  width?: number; // match anchor width
  headerText?: string; // optional header like the field itself
}

const Dropdown: React.FC<DropdownProps> = ({
  visible,
  onClose,
  options,
  onSelect,
  selectedValue,
  title,
  topOffset = 0,
  width,
  headerText,
}) => {
  if (!visible) return null;

  return (
    <View
      style={{
        position: "absolute",
        left: 0,
        top: 34,
        width: width || undefined,
        zIndex: 1000,
      }}
    >
      <View
        className="bg-[#374862] overflow-hidden shadow-lg"
        style={{
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
          borderBottomLeftRadius: 16,
          borderBottomRightRadius: 16,
        }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{ maxHeight: 200 }}
        >
          {options.map((option) => (
            <TouchableOpacity
              onPress={() => {
                onSelect(option);
                onClose();
              }}
              key={option.id}
            >
              <View className="flex-row items-center justify-between px-3 py-2 border-b border-white/10 last:border-b-0">
                <Text
                  className={`text-white ${title === "Protocols" ? "text-left" : "text-center"}`}
                  style={{ fontSize: 14, fontFamily: "InterRegular" }}
                >
                  {capitalizeFirst(option.name as string)}
                </Text>
                {option.name === selectedValue && (
                  <AntDesign name="check" size={12} color="white" />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

export default Dropdown;
