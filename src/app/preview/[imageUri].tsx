import { View, Text, Image } from "react-native";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { useAppTheme } from "@/components/providers/Material3ThemeProvider";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function previewImage() {
  const { colors } = useAppTheme();
  const { top, bottom } = useSafeAreaInsets();
  const { imageUri } = useLocalSearchParams();

  if (!imageUri) {
    <View>
      <Text>Inage not found</Text>
    </View>;
  }

  return (
    <View
      className="h-full flex-1 items-center justify-center"
      style={{
        backgroundColor: colors.surface,
        paddingTop: top,
        paddingBottom: bottom,
      }}
    >
      <Image source={{ uri: imageUri }} className="w-[95vw] h-[95vw]" />
    </View>
  );
}
