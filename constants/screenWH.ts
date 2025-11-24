// constants/layout.ts
import { Dimensions } from "react-native";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

/**
 * Get width as percentage of screen width
 * @example wp(50) => 50% of screen width
 */
export const wp = (percent: number) => (SCREEN_WIDTH * percent) / 100;

/**
 * Get height as percentage of screen height
 * @example hp(30) => 30% of screen height
 */
export const hp = (percent: number) => (SCREEN_HEIGHT * percent) / 100;

export const SCREEN = {
  WIDTH: SCREEN_WIDTH,
  HEIGHT: SCREEN_HEIGHT,
};
