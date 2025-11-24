// constants/textSizes.ts
import { RFValue } from "react-native-responsive-fontsize";

export const TEXT_SIZES = {
  xxs: RFValue(9), // Extra Small
  xs: RFValue(10), // Extra Small
  sm: RFValue(12), // Small
  md: RFValue(14), // Medium
  lg: RFValue(16), // Large
  xl: RFValue(18), // Extra Large
  xxl: RFValue(20), // Double Extra Large
  xxxl: RFValue(24), // Triple Extra Large
  huge: RFValue(28), // Very Big Text
} as const;

export type TextSizeKey = keyof typeof TEXT_SIZES;
