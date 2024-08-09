import React, { useRef } from "react";
import { router } from "expo-router";
import { Appbar, IconButton } from "react-native-paper";
import ImagePreview from "@/components/ImagePreview";
import { useAppTheme } from "@/components/providers/Material3ThemeProvider";
import VideoPreview from "@/components/VideoPreview";
import * as MediaLibrary from "expo-media-library";
import { useEffect, useState } from "react";
import { FlatList, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import PreviewMenu from "@/components/PreviewMenu";

export default function preview() {
  const { colors } = useAppTheme();
  const { top, bottom } = useSafeAreaInsets();
  const flatlist = useRef(null);

  const [assets, setassets] = useState<MediaLibrary.Asset[]>([]);
  const [asset, setasset] = useState<MediaLibrary.Asset>();

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
      className="h-full flex-1"
      style={{
        backgroundColor: colors.surface,
      }}
    >
      <Appbar.Header mode="small">
        <Appbar.BackAction
          onPress={() => {
            router.back();
          }}
        />
        <Appbar.Content title="Preview" />
        <Appbar.Action icon="ellipsis-vertical" />
      </Appbar.Header>
      <FlatList
        ref={flatlist}
        horizontal
        snapToAlignment="center"
        pagingEnabled
        viewabilityConfig={{ itemVisiblePercentThreshold: 90 }}
        data={assets}
        initialNumToRender={1}
        renderItem={({ item }) => renderItem(item)}
        className="absolute h-full -z-10"
        onViewableItemsChanged={({ changed }) => setasset(changed[0].item)}
      />
      {asset && <PreviewMenu asset={asset} />}
    </View>
  );
}

const renderItem = (item: MediaLibrary.Asset) => {
  return item.mediaType === "video" ? (
    <VideoPreview key={item.id} videoUri={item.uri} />
  ) : (
    <ImagePreview key={item.id} imageUri={item.uri} />
  );
};
