import { View, Text, Image } from "react-native";
import React from "react";

type ImagePreviewProps = {
  imageUri: string;
};

export default function ImagePreview({ imageUri }: ImagePreviewProps) {
  return (
    <View className="w-screen h-screen items-center justify-center">
      <Image
        source={{ uri: imageUri }}
        className="w-full h-full"
        resizeMode="contain"
      />
    </View>
  );
}
