import { useAppTheme } from "@/components/providers/Material3ThemeProvider";
import { CameraModes } from "@/features/slices/settingsSlice";
import { router } from "expo-router";
import React from "react";
import { Image, Pressable, TouchableOpacity, View } from "react-native";
import { IconButton } from "react-native-paper";

type CameraMainMenuProps = {
  lastCapturedUri: string;
  onCapture: () => void;
  isRecording: boolean;
  mode: CameraModes;
  onToggleCameraMode: () => void;
};

export default function CameraMainMenu({
  lastCapturedUri,
  onCapture,
  mode,
  isRecording,
  onToggleCameraMode,
}: CameraMainMenuProps) {
  const { colors } = useAppTheme();
  return (
    <View className="flex-row items-center justify-evenly py-4">
      <Pressable onPress={() => router.navigate("preview")}>
        <Image
          source={
            lastCapturedUri
              ? {
                  uri: lastCapturedUri,
                }
              : require("../../assets/icon.png")
          }
          className="w-16 h-16 rounded-full"
        />
      </Pressable>
      <TouchableOpacity
        onPress={onCapture}
        className="w-20 h-20 rounded-full"
        style={{
          backgroundColor: isRecording ? colors.scrim : colors.onSurfaceVariant,
          borderWidth: 4,
          borderColor: colors.outline,
        }}
      />
      <IconButton
        size={40}
        icon={mode === "video" ? "camera" : "videocam"}
        onPress={onToggleCameraMode}
      />
    </View>
  );
}
