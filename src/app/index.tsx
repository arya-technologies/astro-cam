import {
  Camera,
  CameraDevice,
  useCameraDevice,
  useCameraDevices,
  useCameraFormat,
  useCameraPermission,
} from "react-native-vision-camera";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import * as MediaLibrary from "expo-media-library";
import * as FileSystem from "expo-file-system";
import {
  Image,
  Linking,
  Pressable,
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
import { useAppTheme } from "@/components/providers/Material3ThemeProvider";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/features/store";
import Slider from "@/components/Slider";

export default function index() {
  const { colors } = useAppTheme();
  const { top, bottom } = useSafeAreaInsets();
  const dispatch = useDispatch();
  const { controls } = useSelector((state: RootState) => state.settings);
  const { hasPermission, requestPermission } = useCameraPermission();
  const [mediaPermission, requestMediaPermission] =
    MediaLibrary.usePermissions();

  const camera = useRef<Camera>(null);
  const device: CameraDevice | undefined = useCameraDevice("back", {
    physicalDevices: [
      "ultra-wide-angle-camera",
      "wide-angle-camera",
      "telephoto-camera",
    ],
  });
  const devices = useCameraDevices();
  const usbCamera = useCameraDevice("external");
  const format = useCameraFormat(device, [
    { photoAspectRatio: 1 / 1, videoResolution: { width: 3000, height: 3000 } },
  ]);
  const [fps, setfps] = useState(format?.maxFps);
  const [iso, setiso] = useState(format?.minISO);
  const [focusDepth, setfocusDepth] = useState(device?.minFocusDistance);
  const [exposure, setexposure] = useState(device?.minExposure);
  console.log(format);

  // const isFocused = useIsFocused()
  //   const appState = useAppState()
  //   const isActive = isFocused && appState === "active"

  const [mode, setmode] = useState<"picture" | "video">("picture");
  const [zoom, setzoom] = useState<number>(device?.neutralZoom!);
  const [videoType, setvideoType] = useState<"mov" | "mp4">("mov");

  const [lastCapturedUri, setlastCapturedUri] = useState<string>();
  const [isrecording, setisrecording] = useState<boolean>(false);

  const [isResDialogVisible, setisResDialogVisible] = useState<boolean>(false);
  const showResDialog = () => setisResDialogVisible(true);
  const hideResDialog = () => setisResDialogVisible(false);

  const [isPictureTypesDialogVisible, setisPictureTypesDialogVisible] =
    useState<boolean>(false);
  const showPictureTypesDialog = () => setisPictureTypesDialogVisible(true);
  const hidePictureTypesDialog = () => setisPictureTypesDialogVisible(false);

  const [isVideoTypesDialogVisible, setisVideoTypesDialogVisible] =
    useState<boolean>(false);
  const showVideoTypesDialog = () => setisVideoTypesDialogVisible(true);
  const hideVideoTypesDialog = () => setisVideoTypesDialogVisible(false);

  useEffect(() => {
    (async function () {
      if (hasPermission && mediaPermission?.granted) {
        const album = await MediaLibrary.getAlbumAsync("AstroCam");
        if (album) {
          const albumAssets = await MediaLibrary.getAssetsAsync({
            album,
            mediaType: ["photo", "video"],
            sortBy: "creationTime",
          });
          if (albumAssets) {
            setlastCapturedUri(albumAssets.assets[0]?.uri);
          }
        }
      }
    })();
  }, [camera]);

  // useEffect(() => {
  //   dispatch(
  //     setcontrols({
  //       mode,
  //       imageType,
  //       pictureSize,
  //       ratio,
  //       videoQuality,
  //       videoStabilization,
  //     }),
  //   );
  // }, [mode, imageType, pictureSize, ratio, videoQuality, videoStabilization]);
  //

  const requestPermissions = () => {
    if (!hasPermission) {
      requestPermission();
    }
    if (!mediaPermission?.granted) {
      requestMediaPermission();
    }
  };

  if (!hasPermission) {
    const handleRequestPermissions = () => {
      if (!hasPermission && mediaPermission?.canAskAgain) {
        requestPermissions();
      } else {
        Linking.openSettings();
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

  const toggleCameraMode = () => {
    setmode((current) => (current === "picture" ? "video" : "picture"));
    // setzoom(device?.neutralZoom);
  };

  const handleCapture = async () => {
    if (mode === "picture") {
      const image = await camera.current?.takePhoto({});
      if (image) {
        const imageUri = `${FileSystem.cacheDirectory}${image.path.split("/").pop()}`;
        setlastCapturedUri(imageUri);
        addImage(imageUri);
      }
    } else if (mode === "video") {
      if (!isrecording) {
        setisrecording(true);
        camera.current?.startRecording({
          videoCodec: "h265",
          onRecordingFinished: (video) => {
            const videoUri = `${FileSystem.cacheDirectory}${video.path.split("/").pop()}`;
            setlastCapturedUri(videoUri);
            addVideo(videoUri);
          },
          onRecordingError: (error) => console.log("onRecordingError", error),
        });
      } else {
        camera.current?.stopRecording();
        setisrecording(false);
      }
    }
  };
  async function addImage(imageUri: string) {
    const imagesDir = "AstroCam";
    const asset = await MediaLibrary.createAssetAsync(imageUri);
    const album = await MediaLibrary.getAlbumAsync(imagesDir);
    if (!album) {
      await MediaLibrary.createAlbumAsync(imagesDir, asset, false);
    } else {
      await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
    }
  }
  async function addVideo(videoUri: string) {
    const videosDir = "AstroCam";
    const asset = await MediaLibrary.createAssetAsync(videoUri);
    const album = await MediaLibrary.getAlbumAsync(videosDir);
    if (!album) {
      await MediaLibrary.createAlbumAsync(videosDir, asset, false);
    } else {
      await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
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
          <Camera
            isActive={true}
            ref={camera}
            device={device!}
            format={format}
            fps={fps}
            photo={true}
            video={true}
            audio={false}
            photoHdr={false}
            videoHdr={false}
            zoom={zoom}
            photoQualityBalance="quality"
            videoStabilizationMode="off"
            resizeMode="contain"
            androidPreviewViewType="surface-view"
            className="w-[95vw] h-[95vw] my-[5vw]"
          />
        </View>
        <View className="flex-grow">
          <View className="flex-row flex-grow">
            <View className="items-center justify-end flex-grow p-2 space-y-2">
              {mode === "video" ? (
                <>
                  <IconButton
                    icon="image"
                    mode="contained"
                    onPress={showResDialog}
                  />
                  <IconButton
                    icon="image"
                    mode="contained"
                    onPress={showVideoTypesDialog}
                  />
                </>
              ) : (
                <>
                  <IconButton
                    icon="image"
                    mode="contained"
                    onPress={showPictureTypesDialog}
                  />
                </>
              )}
              <IconButton
                icon="settings"
                mode="contained"
                onPress={() => router.navigate("settings")}
              />
            </View>
            <View className="flex-grow justify-end">
              {mode === "video" ? (
                <>
                  <List.Section>
                    <List.Item title="Fps" right={() => <Text>{fps}</Text>} />
                    <Slider
                      minValue={format?.minFps!}
                      maxValue={format?.maxFps!}
                      step={1}
                      value={fps!}
                      onValueChange={setfps}
                    />
                  </List.Section>
                </>
              ) : (
                <></>
              )}
              <List.Section>
                <List.Item title="Iso" right={() => <Text>{iso}</Text>} />
                <Slider
                  minValue={format?.minISO!}
                  maxValue={format?.maxISO!}
                  step={1}
                  value={iso!}
                  onValueChange={setiso}
                />
              </List.Section>
              <List.Section>
                <List.Item
                  title="Exposure"
                  right={() => <Text>{exposure}</Text>}
                />
                <Slider
                  minValue={device?.minExposure!}
                  maxValue={device?.maxExposure!}
                  step={1}
                  value={exposure!}
                  onValueChange={setexposure}
                />
              </List.Section>
              <List.Section>
                <List.Item
                  title="Focus"
                  right={() => <Text>{focusDepth}</Text>}
                />
                <Slider
                  minValue={device?.minFocusDistance!}
                  maxValue={100}
                  step={1}
                  value={focusDepth!}
                  onValueChange={setfocusDepth}
                />
              </List.Section>
              <List.Section>
                <List.Item title="Zoom" right={() => <Text>{zoom}</Text>} />
                <Slider
                  minValue={device?.minZoom!}
                  maxValue={device?.maxZoom!}
                  step={1}
                  value={zoom}
                  onValueChange={setzoom}
                />
              </List.Section>
            </View>
          </View>
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
              size={40}
              icon={mode === "video" ? "camera" : "videocam"}
              onPress={toggleCameraMode}
            />
          </View>
        </View>
      </View>
      <>
        <Portal>
          <Dialog
            visible={isVideoTypesDialogVisible}
            onDismiss={hideVideoTypesDialog}
          >
            <Dialog.Title>Image Types</Dialog.Title>
            <Dialog.Content>
              <RadioButton.Group
                value={videoType}
                onValueChange={(type: any) => setvideoType(type)}
              >
                <RadioButton.Item label="mov" value="mov" />
                <RadioButton.Item label="mp4" value="mp4" />
              </RadioButton.Group>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={hideVideoTypesDialog}>Cancel</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </>
    </>
  );
}
