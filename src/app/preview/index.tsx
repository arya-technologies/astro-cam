import ImagePreview from "@/components/ImagePreview";
import { useAppTheme } from "@/components/providers/Material3ThemeProvider";
import VideoPreview from "@/components/VideoPreview";
import * as MediaLibrary from "expo-media-library";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { Text } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function index() {
  const { colors } = useAppTheme();
  const { top, bottom } = useSafeAreaInsets();

  const [assets, setassets] = useState<MediaLibrary.Asset[]>([]);

  useEffect(() => {
    (async function () {
      const album = await MediaLibrary.getAlbumAsync("AstroCam");
      const albumAssets = await MediaLibrary.getAssetsAsync({
        album,
        mediaType: ["photo", "video"],
      });
      if (albumAssets) {
        setassets(albumAssets.assets);
      }
    })();
  }, []);

  return (
    <View
      className="h-full flex-1 items-center justify-center"
      style={{
        backgroundColor: colors.surface,
        paddingTop: top,
        paddingBottom: bottom,
      }}
    >
      {assets &&
        assets.map((asset) =>
          asset.mediaType === "video" ? (
            <VideoPreview videoUri={asset.uri} />
          ) : (
            <ImagePreview imageUri={asset.uri} />
          ),
        )}
    </View>
  );
}
