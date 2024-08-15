import { useAppTheme } from "@/components/providers/Material3ThemeProvider";
import * as Linking from "expo-linking";
import * as MediaLibrary from "expo-media-library";
import React, { useEffect } from "react";
import { View } from "react-native";
import { Button, Text } from "react-native-paper";

type PermissionsProps = {
  hasCameraPermission: boolean;
  hasMediaPermission: boolean;
  requestCameraPermisiion: () => void;
  requestMediaPermisiion: () => void;
  canAskAgain: boolean;
};

export default function Permissions({
  hasCameraPermission,
  hasMediaPermission,
  requestCameraPermisiion,
  requestMediaPermisiion,
  canAskAgain,
}: PermissionsProps) {
  const { colors } = useAppTheme();
  console.log(hasCameraPermission, hasMediaPermission);

  const requestPermissions = () => {
    requestCameraPermisiion();
    requestMediaPermisiion();
    // if (!hasCameraPermission) {
    // }
    // if (!hasMediaPermission) {
    // }
    // if (!hasCameraPermission && !hasMediaPermission) {
    //   Linking.openSettings();
    // }
    // Linking.sendIntent("android.settings.REQUEST_MANAGE_MEDIA");
  };

  return (
    <View
      className="h-full flex-1 items-center justify-center space-y-4"
      style={{ backgroundColor: colors.surface }}
    >
      <Text>We need your permission to show the camera</Text>
      <Button onPress={requestPermissions} mode="elevated">
        Grant Permission
      </Button>
    </View>
  );
}
