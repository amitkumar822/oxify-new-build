import * as ImageManipulator from "expo-image-manipulator";
import * as FileSystem from "expo-file-system";

// 🔹 Utility: Compress image to target size (KB)
export const ImageCompress = async (
  uri: string,
  targetSizeKB: number = 100
) => {
  let compressedUri = uri;
  let quality = 0.7; // start quality
  let width = 1200; // start resize width

  while (true) {
    const result = await ImageManipulator.manipulateAsync(
      compressedUri,
      [{ resize: { width } }],
      { compress: quality, format: ImageManipulator.SaveFormat.JPEG }
    );

    const info = await FileSystem.getInfoAsync(result.uri);

    if (info.exists && info.size && info.size <= targetSizeKB * 1024) {
      return result;
    }

    // reduce further if still too large
    if (quality > 0.2) {
      quality -= 0.1;
    } else if (width > 400) {
      width -= 200;
    } else {
      // Can't shrink anymore, return current
      return result;
    }

    compressedUri = result.uri;
  }
};
