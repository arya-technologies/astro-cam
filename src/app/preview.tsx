import ImagePreview from "@/components/ImagePreview";
import PreviewMenu from "@/components/PreviewMenu";
import { useAppTheme } from "@/components/providers/Material3ThemeProvider";
import VideoPreview from "@/components/VideoPreview";
import * as MediaLibrary from "expo-media-library";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { FlatList, Pressable, View } from "react-native";
import { Appbar } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, { useSharedValue, withSpring } from "react-native-reanimated";

export default function preview() {
  const { colors } = useAppTheme();
  const { top, bottom } = useSafeAreaInsets();
  const flatlist = useRef(null);

  const [assets, setassets] = useState<MediaLibrary.Asset[]>([]);
  const [asset, setasset] = useState<MediaLibrary.Asset>();
  const [isFullScreen, setisFullScreen] = useState<boolean>(false);
  const toggleFullScreen = () => setisFullScreen(!isFullScreen);

  const appBarTop = useSharedValue(0);
  const menuBottom = useSharedValue(0);

  const handleFullScreen = () => {
    if (!isFullScreen) {
      appBarTop.value = withSpring(-(64 + top));
      menuBottom.value = withSpring(-(64 + bottom));
    } else {
      appBarTop.value = withSpring(0);
      menuBottom.value = withSpring(0);
    }
    toggleFullScreen();
  };

  useEffect(() => {
    (async function () {
      const album = await MediaLibrary.getAlbumAsync("AstroCam");
      if (album) {
        const albumAssets = await MediaLibrary.getAssetsAsync({
          album,
          mediaType: ["photo", "video"],
          sortBy: "creationTime",
        });
        if (albumAssets) {
          setassets(albumAssets.assets);
        }
      }
    })();
  }, []);

  const renderItem = (item: MediaLibrary.Asset) => {
    return (
      <>
        <Pressable onPress={handleFullScreen}>
          {item.mediaType === "video" ? (
            <VideoPreview key={item.id} videoUri={item.uri} />
          ) : (
            <ImagePreview key={item.id} imageUri={item.uri} />
          )}
        </Pressable>
      </>
    );
  };

  return (
    <View
      className="h-full flex-1"
      style={{
        backgroundColor: colors.surface,
      }}
    >
      <Animated.View style={{ top: appBarTop }} className="absolute w-full">
        <Appbar.Header mode="small" style={{ opacity: isFullScreen ? 0 : 1 }}>
          <Appbar.BackAction
            onPress={() => {
              router.back();
            }}
          />
          <Appbar.Content title="Preview" />
          <Appbar.Action icon="ellipsis-vertical" />
        </Appbar.Header>
      </Animated.View>
      <FlatList
        ref={flatlist}
        horizontal
        snapToAlignment="center"
        pagingEnabled
        viewabilityConfig={{ itemVisiblePercentThreshold: 90 }}
        data={assets}
        initialNumToRender={1}
        renderItem={({ item }) => renderItem(item)}
        className="w-full h-full absolute -z-10"
        onViewableItemsChanged={({ changed }) => setasset(changed[0].item)}
      />
      {asset && (
        <Animated.View
          style={{
            bottom: menuBottom,
          }}
          className="absolute w-full"
        >
          <PreviewMenu asset={asset} />
        </Animated.View>
      )}
    </View>
  );
}
