import { CameraModes } from "@/features/slices/settingsSlice";
import { router } from "expo-router";
import React from "react";
import { View } from "react-native";
import { IconButton } from "react-native-paper";
import { useAppTheme } from "./providers/Material3ThemeProvider";

type VirticalCameraMenuProps = {
  mode: CameraModes;
};

export default function VirticalCameraMenu({ mode }: VirticalCameraMenuProps) {
  const { colors } = useAppTheme();
  return (
    <View className="items-center justify-end flex-grow p-2 space-y-2">
      <View
        className="rounded-full"
        style={{ backgroundColor: colors.elevation.level3 }}
      >
        {mode === "video" ? (
          <>
            <IconButton icon="image" mode="contained" />
            <IconButton icon="resize" mode="contained" />
          </>
        ) : (
          <>
            <IconButton icon="cog" mode="contained" />
          </>
        )}
        <IconButton icon="home" mode="contained" />
        <IconButton
          icon="settings"
          mode="contained"
          onPress={() => router.navigate("settings")}
        />
      </View>
    </View>
  );
}
