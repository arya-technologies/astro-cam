import RenderPreviewItem from "@/components/RenderPreviewItem";
import { Asset } from "expo-media-library";
import React from "react";
import { Dimensions, Pressable } from "react-native";
import Animated, { LinearTransition } from "react-native-reanimated";

interface PreviewListProps {
  data: Asset[];
  setasset: (asset: Asset) => void;
  isFullScreen: boolean;
  toggleFullScreen: () => void;
}

export default function PreviewList({
  data,
  setasset,
  isFullScreen,
  toggleFullScreen,
}: PreviewListProps) {
  const { width, height } = Dimensions.get("screen");

  return (
    <Animated.FlatList
      bounces={false}
      decelerationRate={0}
      renderToHardwareTextureAndroid
      maxToRenderPerBatch={3}
      windowSize={3}
      showsHorizontalScrollIndicator={false}
      snapToInterval={width}
      scrollEventThrottle={16}
      viewabilityConfig={{
        itemVisiblePercentThreshold: 100,
      }}
      snapToAlignment="center"
      initialNumToRender={2}
      horizontal
      data={data}
      renderItem={({ item, index }) => (
        <RenderPreviewItem
          asset={item}
          index={index}
          isFullScreen={isFullScreen}
          toggleFullScreen={toggleFullScreen}
        />
      )}
      onViewableItemsChanged={({ changed }) => setasset(changed[0].item)}
      itemLayoutAnimation={LinearTransition}
      keyExtractor={(item) => item.id}
      className="w-full h-full -z-10"
    />
  );
}
