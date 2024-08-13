import { useAppTheme } from "@/components/providers/Material3ThemeProvider";
import * as Linking from "expo-linking";
import * as MediaLibrary from "expo-media-library";
import React from "react";
import { View } from "react-native";
import { Button, Text } from "react-native-paper";
import { useCameraPermission } from "react-native-vision-camera";

type PermissionsProps = {};

export default function Permissions({}: PermissionsProps) {
  const { colors } = useAppTheme();

  const { hasPermission, requestPermission } = useCameraPermission();
  const [mediaPermission, requestMediaPermission] =
    MediaLibrary.usePermissions();

  const handleRequestPermissions = () => {
    if (mediaPermission?.canAskAgain) {
      requestPermissions();
    } else {
      Linking.openSettings();
    }
    Linking.sendIntent("android.settings.REQUEST_MANAGE_MEDIA");
  };

  const requestPermissions = () => {
    if (!hasPermission) {
      requestPermission();
    }
    if (!mediaPermission?.granted) {
      requestMediaPermission();
    }
  };

  return (
    <View
      className="h-full flex-1 items-center justify-center space-y-4"
      style={{ backgroundColor: colors.surface }}
    >
      <Text>We need your permission to show the camera</Text>
      <Button onPress={handleRequestPermissions} mode="elevated">
        Grant Permission
      </Button>
    </View>
  );
}
