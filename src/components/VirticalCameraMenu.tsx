import { CameraModeTypes } from "@/features/slices/settingsSlice";
import { router } from "expo-router";
import React from "react";
import { View } from "react-native";
import { IconButton } from "react-native-paper";
import { useAppTheme } from "./providers/Material3ThemeProvider";

type VirticalCameraMenuProps = {
  mode: CameraModeTypes;
  onShowPictureTypesDialog: () => void;
  onShowVideoTypesDialog: () => void;
  onShowDevicesDialog: () => void;
  onShowFormatsDialog: () => void;
};

export default function VirticalCameraMenu({
  mode,
  onShowDevicesDialog,
  onShowFormatsDialog,
  onShowPictureTypesDialog,
  onShowVideoTypesDialog,
}: VirticalCameraMenuProps) {
  const { colors } = useAppTheme();
  return (
    <View className="items-center justify-end flex-grow p-2 space-y-2">
      <View
        className="rounded-full"
        style={{ backgroundColor: colors.elevation.level3 }}
      >
        {mode === "video" ? (
          <>
            <IconButton
              icon="image"
              mode="contained"
              onPress={onShowVideoTypesDialog}
            />
            <IconButton
              icon="resize"
              mode="contained"
              onPress={onShowFormatsDialog}
            />
          </>
        ) : (
          <>
            <IconButton
              icon="cog"
              mode="contained"
              onPress={onShowPictureTypesDialog}
            />
          </>
        )}
        <IconButton
          icon="home"
          mode="contained"
          onPress={onShowDevicesDialog}
        />
        <IconButton
          icon="settings"
          mode="contained"
          onPress={() => router.navigate("settings")}
        />
      </View>
    </View>
  );
}
