import { useAppTheme } from "@/components/providers/Material3ThemeProvider";
import {
  CameraView,
  CameraType,
  useCameraPermissions,
  CameraMode,
} from "expo-camera";
import { router } from "expo-router";
import { useState } from "react";
import { Dimensions, Pressable, TouchableOpacity, View } from "react-native";
import { Button, IconButton, Surface, Text } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function index() {
  const { colors } = useAppTheme();
  const { top, bottom } = useSafeAreaInsets();
  const { width, height } = Dimensions.get("window");

  const pictureSizes = CameraView;

  const [facing, setfacing] = useState<CameraType>("back");
  const [mode, setmode] = useState<CameraMode>("picture");
  const [permission, requestPermission] = useCameraPermissions();

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View
        className="h-full flex-1 items-center justify-center space-y-4"
        style={{ backgroundColor: colors.surface }}
      >
        <Text>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} mode="elevated">
          Grant Permission
        </Button>
      </View>
    );
  }

  function toggleCameraFacing() {
    setfacing((current) => (current === "back" ? "front" : "back"));
  }
  function toggleCameraMode() {
    setmode((current) => (current === "video" ? "video" : "picture"));
  }
  function handleCapture() {
    if (mode === "picture") {
    }
  }

  return (
    <View
      className="h-full flex-1 px-4"
      style={{
        backgroundColor: colors.surface,
        paddingTop: top,
        paddingBottom: bottom,
      }}
    >
      <View style={{ height: height / 1.25 }}>
        <Surface elevation={4} className="rounded-lg overflow-hidden h-full">
          <CameraView
            facing={facing}
            mode={mode}
            mute
            className="w-full h-full"
          />
        </Surface>
      </View>
      <View className="flex-row justify-center">
        <IconButton icon="arrow-up" />
      </View>
      <View className="flex-row flex-grow items-center justify-evenly">
        <IconButton
          icon={mode === "video" ? "camera" : "videocam"}
          onPress={toggleCameraMode}
        />
        <TouchableOpacity
          onPress={handleCapture}
          className="w-20 h-20 rounded-full"
          style={{
            backgroundColor: colors.onSurfaceVariant,
            borderWidth: 4,
            borderColor: colors.outline,
          }}
        />
        <IconButton icon="camera-reverse" onPress={toggleCameraFacing} />
      </View>
    </View>
  );
}
