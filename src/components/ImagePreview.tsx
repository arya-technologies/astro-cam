import React from "react";
import { Image } from "react-native";

type ImagePreviewProps = {
  imageUri: string;
};

export default function ImagePreview({ imageUri }: ImagePreviewProps) {
  return (
    <Image
      source={{ uri: imageUri }}
      className="w-full h-full"
      resizeMode="contain"
    />
  );
}
