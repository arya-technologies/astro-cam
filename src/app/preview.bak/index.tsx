import ImagePreview from "@/components/ImagePreview";
import { useAppTheme } from "@/components/providers/Material3ThemeProvider";
import VideoPreview from "@/components/VideoPreview";
import * as MediaLibrary from "expo-media-library";
import { useEffect, useState } from "react";
import { FlatList, View } from "react-native";
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
        sortBy: "creationTime",
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
      <FlatList
        horizontal
        snapToAlignment="center"
        pagingEnabled
        viewabilityConfig={{ itemVisiblePercentThreshold: 90 }}
        data={assets}
        renderItem={({ item }) =>
          item.mediaType === "video" ? (
            <VideoPreview key={item.id} videoUri={item.uri} />
          ) : (
            <ImagePreview key={item.id} imageUri={item.uri} />
          )
        }
      />
    </View>
  );
}
// {assets &&
//   assets.map((asset) =>
//     asset.mediaType === "video" ? (
//       <VideoPreview key={asset.id} videoUri={asset.uri} />
//     ) : (
//       <ImagePreview key={asset.id} imageUri={asset.uri} />
//     ),
//   )}
