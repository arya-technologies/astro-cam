import RenderPreviewItem from "@/components/RenderPreviewItem";
import { Asset } from "expo-media-library";
import React from "react";
import { Dimensions, Pressable } from "react-native";
import Animated, {
  LinearTransition,
  useAnimatedScrollHandler,
} from "react-native-reanimated";

interface PreviewListProps {
  data: Asset[];
  setasset: (asset: Asset) => void;
  isFullScreen: boolean;
  toggleFullScreen: () => void;
  handleFullScreen: () => void;
}

export default function PreviewList({
  data,
  setasset,
  isFullScreen,
  toggleFullScreen,
  handleFullScreen,
}: PreviewListProps) {
  const { width, height } = Dimensions.get("screen");

  const handleHorizontalScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      console.log(event.contentOffset.y);
    },
  });

  return (
    <Pressable
      onPress={handleFullScreen}
      style={{ width, height }}
      className="absolute -z-10"
    >
      <Animated.FlatList
        bounces={false}
        decelerationRate={0}
        renderToHardwareTextureAndroid
        maxToRenderPerBatch={3}
        windowSize={3}
        showsHorizontalScrollIndicator={false}
        onScroll={handleHorizontalScroll}
        snapToInterval={width * 0.8}
        viewabilityConfig={{
          itemVisiblePercentThreshold: 100,
        }}
        horizontal
        snapToAlignment="start"
        pagingEnabled
        data={data}
        initialNumToRender={2}
        renderItem={({ item, index }) => (
          <RenderPreviewItem
            asset={item}
            index={index}
            isFullScreen={isFullScreen}
            toggleFullScreen={toggleFullScreen}
          />
        )}
        className="w-full h-full "
        onViewableItemsChanged={({ changed }) => setasset(changed[0].item)}
        itemLayoutAnimation={LinearTransition}
        keyExtractor={(item) => item.id}
      />
    </Pressable>
  );
}
