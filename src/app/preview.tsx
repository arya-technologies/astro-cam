import AssetInfo from "@/components/AssetInfo";
import ImagePreview from "@/components/ImagePreview";
import PreviewList from "@/components/PreviewList";
import PreviewMenu from "@/components/PreviewMenu";
import VideoPreview from "@/components/VideoPreview";
import { useAppTheme } from "@/components/providers/Material3ThemeProvider";
import { isFulfilled } from "@reduxjs/toolkit";
import * as MediaLibrary from "expo-media-library";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Dimensions, Pressable, View } from "react-native";
import { Appbar, IconButton } from "react-native-paper";
import Animated, {
  LinearTransition,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function preview() {
  const { colors } = useAppTheme();
  const { top, bottom } = useSafeAreaInsets();

  const [assets, setassets] = useState<MediaLibrary.Asset[]>([]);
  const [asset, setasset] = useState<MediaLibrary.Asset>();
  const [isFullScreen, setisFullScreen] = useState<boolean>(false);
  const toggleFullScreen = () => setisFullScreen(!isFullScreen);

  const [isInfoVisible, setisInfoVisible] = useState<boolean>(false);
  const showInfo = () => setisInfoVisible(true);
  const hideInfo = () => setisInfoVisible(false);

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

  const handleDelete = async () => {
    if (asset) {
      await MediaLibrary.deleteAssetsAsync([asset.id]);
      const updatedAssets = assets.filter((item) => item.id !== asset.id);
      setassets(updatedAssets);
    }
  };

  const slideY = useSharedValue(0);
  const topSlideAnimation = useAnimatedStyle(
    () => ({
      top: interpolate(slideY.value, [0, 100], [0, -64]),
      opacity: interpolate(slideY.value, [0, 100], [1, 0]),
    }),
    [slideY],
  );
  const bottomSlideAnimation = useAnimatedStyle(
    () => ({
      bottom: interpolate(slideY.value, [0, 100], [0, -64]),
      opacity: interpolate(slideY.value, [0, 100], [1, 0]),
    }),
    [slideY],
  );
  const handleFullScreen = () => {
    if (!isFullScreen) {
      slideY.value = withSpring(100, { overshootClamping: true });
    } else {
      slideY.value = withSpring(0, { overshootClamping: true });
    }
    toggleFullScreen();
  };

  const [isplaying, setisPlaying] = useState<boolean>(false);

  return (
    <>
      <View
        className="h-full flex-1"
        style={{
          backgroundColor: colors.surface,
        }}
      >
        <Animated.View style={topSlideAnimation} className="absolute w-full">
          <Appbar.Header mode="small">
            <Appbar.BackAction
              onPress={() => {
                router.back();
              }}
            />
            <Appbar.Content title="Preview" />
            <Appbar.Action icon="information" onPress={showInfo} />
          </Appbar.Header>
        </Animated.View>
        <PreviewList
          data={assets}
          setasset={setasset}
          isFullScreen={isFullScreen}
          toggleFullScreen={toggleFullScreen}
          handleFullScreen={handleFullScreen}
        />
        {asset && (
          <Animated.View
            style={bottomSlideAnimation}
            className="absolute w-full"
          >
            {asset.mediaType === "video" && (
              <View className="h-[64]">
                <IconButton
                  icon={isplaying ? "stop" : "play"}
                  onPress={() => {
                    if (!isplaying) {
                    } else {
                    }
                    setisPlaying(!isplaying);
                  }}
                />
              </View>
            )}
            <PreviewMenu asset={asset} handleDelete={handleDelete} />
          </Animated.View>
        )}
      </View>
      <>
        {asset && (
          <AssetInfo
            assetId={asset.id}
            visible={isInfoVisible}
            onDismiss={hideInfo}
          />
        )}
      </>
    </>
  );
}
