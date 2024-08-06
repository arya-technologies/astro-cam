import * as FileSystem from "expo-file-system";
import { useAppTheme } from "@/components/providers/Material3ThemeProvider";
import Slider from "@react-native-community/slider";
import {
  CameraMode,
  CameraType,
  CameraView,
  ImageType,
  useCameraPermissions,
} from "expo-camera";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  Pressable,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import {
  Button,
  Dialog,
  IconButton,
  List,
  Portal,
  RadioButton,
  Text,
} from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function index() {
  const { colors } = useAppTheme();
  const { top, bottom } = useSafeAreaInsets();
  const [permission, requestPermission] = useCameraPermissions();

  const [isResDialogVisible, setisResDialogVisible] = useState<boolean>(false);
  const showResDialog = () => setisResDialogVisible(true);
  const hideResDialog = () => setisResDialogVisible(false);

  const [facing, setfacing] = useState<CameraType>("back");
  const [mode, setmode] = useState<CameraMode>("picture");
  // const [videoQuality, setvideoQuality] = useState<VideoQuality>("4:3");
  const [camera, setcamera] = useState<CameraView | null>();
  const [pictureSize, setpictureSize] = useState<string>("3000x3000");
  const [pictureSizes, setpictureSizes] = useState<string[]>([]);
  const [maxDuration, setmaxDuration] = useState<number>(10);
  const [imageType, setimageType] = useState<ImageType>("png");
  const [isrecording, setisrecording] = useState<boolean>(false);
  const [iso, setiso] = useState<number>(0);
  const [exposure, setexposure] = useState<number>(0);

  const [imageUri, setimageUri] = useState<string | undefined>();

  useEffect(() => {
    camera?.getAvailablePictureSizesAsync().then((res) => setpictureSizes(res));
  }, [camera]);

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
    setmode((current) => (current === "picture" ? "video" : "picture"));
  }
  async function handleCapture() {
    if (mode === "picture") {
      const data = await camera?.takePictureAsync({
        imageType,
        quality: 1,
        skipProcessing: true,
      });
      setimageUri(data?.uri);
    } else if (mode === "video") {
      if (!isrecording) {
        setisrecording(true);
        await camera?.recordAsync({ maxDuration });
      } else {
        setisrecording(false);
        camera?.stopRecording();
      }
    }
  }

  return (
    <>
      <View
        className="h-full flex-1"
        style={{
          backgroundColor: colors.surface,
          paddingTop: top,
          paddingBottom: bottom,
        }}
      >
        <View style={{}} className="items-center">
          <CameraView
            ref={(ref) => setcamera(ref)}
            videoStabilizationMode="off"
            facing={facing}
            pictureSize={pictureSize}
            mode={mode}
            mute
            className="w-[95vw] h-[95vw] my-[5vw]"
          />
        </View>
        <View className="flex-grow">
          <View className="flex-1 flex-grow justify-center items-end">
            <List.Section>
              <List.Item title="Iso" right={() => <Text>{iso}</Text>} />
              <Slider
                minimumValue={1}
                maximumValue={10}
                minimumTrackTintColor={colors.outline}
                maximumTrackTintColor={colors.onSurfaceVariant}
                step={1}
                value={iso}
                onValueChange={setiso}
              />
            </List.Section>
            <List.Section>
              <List.Item
                title="Exposure"
                right={() => <Text>{exposure}</Text>}
              />
              <Slider
                minimumValue={1}
                maximumValue={10}
                minimumTrackTintColor={colors.outline}
                maximumTrackTintColor={colors.onSurfaceVariant}
                step={1}
                value={exposure}
                onValueChange={setexposure}
              />
            </List.Section>
          </View>
          <View className="flex-row flex-grow items-center justify-evenly">
            <Pressable
              onPress={() =>
                imageUri &&
                router.navigate({
                  pathname: `preview/[imageUri]`,
                  params: { imageUri },
                })
              }
            >
              <Image
                source={{ uri: imageUri }}
                className="w-20 h-20 rounded-full"
              />
            </Pressable>
            <TouchableOpacity
              onPress={handleCapture}
              className="w-20 h-20 rounded-full"
              style={{
                backgroundColor: isrecording
                  ? colors.scrim
                  : colors.onSurfaceVariant,
                borderWidth: 4,
                borderColor: colors.outline,
              }}
            />
            <IconButton
              icon={mode === "video" ? "camera" : "videocam"}
              onPress={toggleCameraMode}
            />
          </View>
        </View>
      </View>
      <Portal>
        <Dialog
          visible={isResDialogVisible}
          onDismiss={hideResDialog}
          style={{ maxHeight: "75%" }}
        >
          <Dialog.Title>Resolution</Dialog.Title>
          <Dialog.ScrollArea>
            <ScrollView>
              <RadioButton.Group
                value={pictureSize}
                onValueChange={(value) => setpictureSize(value)}
              >
                {pictureSizes.map((item) => (
                  <RadioButton.Item
                    key={item.toString()}
                    label={item}
                    value={item}
                  />
                ))}
              </RadioButton.Group>
            </ScrollView>
          </Dialog.ScrollArea>
          <Dialog.Actions>
            <Button onPress={hideResDialog}>Cancel</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  );
}
