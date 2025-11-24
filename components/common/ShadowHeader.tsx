import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { Shadow } from "react-native-shadow-2";
import { AntDesign } from '@expo/vector-icons';
import { Theme } from '@/constants/Colors';
const { useNavigation } = require("@react-navigation/native");

const ShadowHeader = ({ onPress, title }: { onPress?: () => void, title?: string }) => {
    const navigation = useNavigation();
    if (!onPress) {
        onPress = () => {
            if (navigation.canGoBack()) {
                navigation.goBack();
            }
        }
    }
    return (
        <View>

            <Shadow
                distance={12}
                // startColor="rgba(255, 255, 0, 0.5)"
                // endColor="rgba(255, 255, 0, 0)"
                offset={[0, 8]}
                paintInside={false}
                sides={{ top: false, bottom: true, start: false, end: false }}
                style={{ width: "100%", marginBottom: 24 }}
            >
                <View className="relative flex-row items-center justify-center mb-3 w-full">
                    <TouchableOpacity
                        onPress={onPress}
                        className="absolute left-0 p-4"
                    >
                        <AntDesign name="left" size={22} color={Theme.text.white} />
                    </TouchableOpacity>
                    {title && <Text
                        style={{
                            fontSize: 18,
                            fontFamily: "InterSemiBold",
                            color: Theme.text.white,
                        }}
                    >
                        {title}
                    </Text>}
                </View>
            </Shadow>
        </View>
    )
}

export default ShadowHeader

const styles = StyleSheet.create({})