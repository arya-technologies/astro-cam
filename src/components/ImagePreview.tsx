import { View, Text, Image } from "react-native";
import React from "react";

export default function ImagePreview({ imageUri }) {
  return (
    <View className="w-screen h-screen items-center justify-center">
      <Image source={{ uri: imageUri }} className="w-[95vw] h-[95vw]" />
    </View>
  );
}
