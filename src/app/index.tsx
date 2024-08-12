import { useAppTheme } from "@/components/providers/Material3ThemeProvider";
import SelectDeviceDialog from "@/components/SelectDeviceDialog";
import SelectDialog from "@/components/SelectDialog";
import SelectFormatDialog from "@/components/SelectFormatDialog";
import Slider from "@/components/Slider";
import { RootState } from "@/features/store";
import { useAppState } from "@react-native-community/hooks";
import * as FileSystem from "expo-file-system";
import * as Linking from "expo-linking";
import * as MediaLibrary from "expo-media-library";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Image, Pressable, TouchableOpacity, View } from "react-native";
import { Button, IconButton, List, Text, withTheme } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Camera,
  CameraDevice,
  CameraProps,
  useCameraDevice,
  useCameraDevices,
  useCameraFormat,
  useCameraPermission,
} from "react-native-vision-camera";
import { useDispatch, useSelector } from "react-redux";
import Reanimated, {
  interpolate,
  useAnimatedProps,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import Permissions from "@/components/Permissions";
import {
  CameraModeTypes,
  ImageTypes,
  setcontrols,
  VideoTypes,
} from "@/features/slices/settingsSlice";

const AnimatedCamera = Reanimated.createAnimatedComponent(Camera);
Reanimated.addWhitelistedNativeProps({ zoom: true, exposure: true });

export default function index() {
  const { colors } = useAppTheme();
  const { top, bottom } = useSafeAreaInsets();
  const dispatch = useDispatch();
  const { controls } = useSelector((state: RootState) => state.settings);
  const { hasPermission, requestPermission } = useCameraPermission();
  const [mediaPermission, requestMediaPermission] =
    MediaLibrary.usePermissions();

  // const isFocused = useIsFocused()
  const appState = useAppState();
  const isActive = appState === "active";

  const camera = useRef<Camera>(null);
  const devices = useCameraDevices();
  const [device, setdevice] = useState<CameraDevice>(
    controls.device || devices[0],
  );

  const [mode, setmode] = useState<CameraModeTypes>(controls.mode || "picture");
  // const [zoom, setzoom] = useState<number>(device?.neutralZoom!);
  const [imageType, setimageType] = useState<ImageTypes>(
    controls.imageTyp || "raw",
  );
  const [videoType, setvideoType] = useState<VideoTypes>(
    controls.videoType || "mov",
  );

  const [videoRes, setvideoRes] = useState<number>(
    device?.formats[0].videoHeight!,
  );
  // const [format, setformat] = useState<CameraDeviceFormat | undefined>(
  //   device?.formats[0],
  // );
  const imageFormat = useCameraFormat(device, [{ photoAspectRatio: 1 / 1 }]);
  const videoFormat = useCameraFormat(device, [
    {
      videoAspectRatio: 9 / 16,
      videoResolution: { height: videoRes, width: (videoRes / 9) * 16 },
    },
  ]);
  const format =
    controls.format || mode === "video" ? videoFormat : imageFormat;

  const [iso, setiso] = useState(format?.minISO);
  const [fps, setfps] = useState(format?.maxFps);
  const [focus, setfocus] = useState<boolean>(false);
  const [focusDepth, setfocusDepth] = useState(device?.minFocusDistance);

  const exposureSlider = useSharedValue(0);
  const exposure = useDerivedValue(() => {
    if (device === null) return 0;
    return interpolate(
      exposureSlider.value,
      [-1, 0, 1],
      [device.minExposure, 0, device.maxExposure],
    );
  }, [exposureSlider, device]);

  const zoomSlider = useSharedValue(0);
  const zoom = useDerivedValue(() => {
    if (device === null) return 0;
    return interpolate(
      zoomSlider.value,
      [-1, 0, 1],
      [device.minZoom, 0, device.maxZoom],
    );
  }, [zoomSlider, device]);
  // const zoom = useSharedValue(device?.neutralZoom);

  const animatedProps = useAnimatedProps<CameraProps>(
    () => ({ zoom: zoom.value, exposure: exposure.value }),
    [zoom, exposure],
  );

  const [lastCapturedUri, setlastCapturedUri] = useState<string>();
  const [isrecording, setisrecording] = useState<boolean>(false);

  const [isDevicesDialogVisible, setisDevicesDialogVisible] =
    useState<boolean>(false);
  const showDevicesDialog = () => setisDevicesDialogVisible(true);
  const hideDevicesDialog = () => setisDevicesDialogVisible(false);

  const [isFormatsDialogVisible, setisFormatsDialogVisible] =
    useState<boolean>(false);
  const showFormatsDialog = () => setisFormatsDialogVisible(true);
  const hideFormatsDialog = () => setisFormatsDialogVisible(false);

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
  }, [mediaPermission]);

  useEffect(() => {
    dispatch(setcontrols({ device, format, mode, videoType }));
  }, [device, format, mode, imageType, videoType]);

  if (!hasPermission || !mediaPermission?.granted) {
    <Permissions />;
  }

  const toggleCameraMode = () => {
    setmode((current) => (current === "picture" ? "video" : "picture"));
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
          <AnimatedCamera
            animatedProps={animatedProps}
            isActive={isActive}
            ref={camera}
            device={device!}
            format={format}
            photo={true}
            video={true}
            audio={false}
            photoHdr={false}
            videoHdr={false}
            lowLightBoost={false}
            isMirrored={false}
            enableLocation={false}
            isTVSelectable
            enableFpsGraph
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
                    onPress={showVideoTypesDialog}
                  />
                  <IconButton
                    icon="resize"
                    mode="contained"
                    onPress={showFormatsDialog}
                  />
                </>
              ) : (
                <>
                  <IconButton
                    icon="cog"
                    mode="contained"
                    onPress={showPictureTypesDialog}
                  />
                </>
              )}
              <IconButton
                icon="home"
                mode="contained"
                onPress={showDevicesDialog}
              />
              <IconButton
                icon="settings"
                mode="contained"
                onPress={() => router.navigate("settings")}
              />
            </View>
            <View className="flex-grow justify-end">
              {mode === "video" ? <></> : <></>}
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
                  right={() => <Text>{exposure.value}</Text>}
                />
                <Slider
                  minValue={device.minExposure}
                  maxValue={device.maxExposure}
                  step={1}
                  value={exposure.value}
                  onValueChange={(value) => (exposureSlider.value = value)}
                />
              </List.Section>
              <List.Section>
                <List.Item
                  title="Zoom"
                  right={() => <Text>{zoom.value}</Text>}
                />
                <Slider
                  minValue={device.minZoom}
                  maxValue={device.maxZoom}
                  step={1}
                  value={zoom.value}
                  onValueChange={(value) => (zoomSlider.value = value)}
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
        <SelectFormatDialog
          title="Format"
          videoRes={videoRes}
          minRes={device?.formats.pop()?.videoHeight!}
          maxRes={device?.formats[0].videoHeight!}
          setVideoRes={setvideoRes}
          fps={fps!}
          minFps={format?.minFps!}
          maxFps={format?.maxFps!}
          setFps={setfps}
          visible={isFormatsDialogVisible}
          onDismiss={hideFormatsDialog}
        />
        <SelectDeviceDialog
          data={devices}
          title="Devices"
          value={device?.id!}
          setValue={setdevice}
          visible={isDevicesDialogVisible}
          onDismiss={hideDevicesDialog}
        />
        <SelectDialog
          data={["mov", "mp4"]}
          title="Video Type"
          value={videoType}
          setValue={setvideoType}
          visible={isVideoTypesDialogVisible}
          onDismiss={hideVideoTypesDialog}
        />
        <SelectDialog
          data={["raw", "png", "jpg"]}
          title="Image Type"
          value={imageType}
          setValue={setimageType}
          visible={isPictureTypesDialogVisible}
          onDismiss={hidePictureTypesDialog}
        />
      </>
    </>
  );
}

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
