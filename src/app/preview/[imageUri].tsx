import { View, Text, Image } from "react-native";
import { useLocalSearchParams } from "expo-router";
import React from "react";

export default function previewImage() {
  const { imageUri } = useLocalSearchParams();

  if (!imageUri) {
    <View>
      <Text>Inage not found</Text>
    </View>;
  }

  return (
    <View>
      <Image source={{ uri: imageUri }} className="w-full h-full" />
    </View>
  );
}
