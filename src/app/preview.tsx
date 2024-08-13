import ImagePreview from "@/components/ImagePreview";
import PreviewMenu from "@/components/PreviewMenu";
import { useAppTheme } from "@/components/providers/Material3ThemeProvider";
import VideoPreview from "@/components/VideoPreview";
import * as MediaLibrary from "expo-media-library";
import { router } from "expo-router";
import * as StatusBar from "expo-status-bar";
import * as NavigationBar from "expo-navigation-bar";
import React, { useEffect, useRef, useState } from "react";
import { Dimensions, Pressable, View } from "react-native";
import { Appbar } from "react-native-paper";
import Animated, {
  interpolate,
  LinearTransition,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AssetInfo from "@/components/AssetInfo";

export default function preview() {
  const { colors } = useAppTheme();
  const { top, bottom } = useSafeAreaInsets();
  const { width, height } = Dimensions.get("screen");
  const flatlist = useRef(null);

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

  const renderItem = (item: MediaLibrary.Asset) => {
    return (
      <>
        <Pressable onPress={handleFullScreen} style={{ width, height }}>
          {item.mediaType === "video" ? (
            <VideoPreview key={item.id} videoUri={item.uri} />
          ) : (
            <ImagePreview key={item.id} imageUri={item.uri} />
          )}
        </Pressable>
      </>
    );
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
        <Animated.FlatList
          ref={flatlist}
          horizontal
          snapToAlignment="center"
          pagingEnabled
          data={assets}
          initialNumToRender={1}
          renderItem={({ item }) => renderItem(item)}
          className="w-full h-full absolute -z-10"
          onViewableItemsChanged={({ changed }) => setasset(changed[0].item)}
          itemLayoutAnimation={LinearTransition}
          keyExtractor={(item) => item.id}
        />
        {asset && (
          <Animated.View
            style={bottomSlideAnimation}
            className="absolute w-full"
          >
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
