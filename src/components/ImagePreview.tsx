import { View, Text, Image } from "react-native";
import React from "react";

export default function ImagePreview({ imageUri }) {
  return <Image source={{ uri: imageUri }} className="w-full h-full" />;
}
