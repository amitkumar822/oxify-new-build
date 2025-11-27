import * as ImageManipulator from "expo-image-manipulator";
import * as FileSystem from "expo-file-system/legacy"; // ✔ FIXES WARNING

export const ImageCompress = async (
  uri: string,
  targetSizeKB: number = 100
) => {
  let compressedUri = uri;
  let quality = 0.7;
  let width = 1200;

  while (true) {
    const result = await ImageManipulator.manipulateAsync(
      compressedUri,
      [{ resize: { width } }],
      { compress: quality, format: ImageManipulator.SaveFormat.JPEG }
    );

    const info = await FileSystem.getInfoAsync(result.uri); // ✔ no warnings

    if (info.exists && info.size && info.size <= targetSizeKB * 1024) {
      return result;
    }

    if (quality > 0.2) {
      quality -= 0.1;
    } else if (width > 400) {
      width -= 200;
    } else {
      return result;
    }

    compressedUri = result.uri;
  }
};

