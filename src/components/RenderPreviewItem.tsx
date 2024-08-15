import { View, Text, Dimensions, Pressable } from "react-native";
import React from "react";
import { Asset } from "expo-media-library";
import VideoPreview from "./VideoPreview";
import ImagePreview from "./ImagePreview";

interface RenderPreviewItemProps {
  asset: Asset;
  index: number;
  isFullScreen: boolean;
  toggleFullScreen: () => void;
}

export default function RenderPreviewItem({
  asset,
  index,
  isFullScreen,
  toggleFullScreen,
}: RenderPreviewItemProps) {
  return (
    <>
      {asset.mediaType === "video" ? (
        <VideoPreview
          key={asset.id}
          videoUri={asset.uri}
          isfullscreen={isFullScreen}
          toggleFullscreen={toggleFullScreen}
        />
      ) : (
        <ImagePreview key={asset.id} imageUri={asset.uri} />
      )}
    </>
  );
}
