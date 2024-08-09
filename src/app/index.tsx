import { useAppTheme } from "@/components/providers/Material3ThemeProvider";
import Slider from "@/components/Slider";
import {
  PictureSizeProps,
  RatioProps,
  setcontrols,
} from "@/features/slices/settingsSlice";
import { RootState } from "@/features/store";
import {
  CameraMode,
  CameraView,
  ImageType,
  VideoQuality,
  VideoStabilization,
  useCameraPermissions,
} from "expo-camera";
import * as MediaLibrary from "expo-media-library";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Image, Pressable, TouchableOpacity, View } from "react-native";
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
import { useDispatch, useSelector } from "react-redux";

export default function index() {
  const { colors } = useAppTheme();
  const { top, bottom } = useSafeAreaInsets();
  const dispatch = useDispatch();
  const { controls } = useSelector((state: RootState) => state.settings);
  const [permission, requestPermission] = useCameraPermissions();
  const [mediaPermission, requestMediaPermission] =
    MediaLibrary.usePermissions();

  const [isResDialogVisible, setisResDialogVisible] = useState<boolean>(false);
  const showResDialog = () => setisResDialogVisible(true);
  const hideResDialog = () => setisResDialogVisible(false);
  const [isPictureTypesDialogVisible, setisPictureTypesDialogVisible] =
    useState<boolean>(false);
  const showPictureTypesDialog = () => setisPictureTypesDialogVisible(true);
  const hidePictureTypesDialog = () => setisPictureTypesDialogVisible(false);

  const [mode, setmode] = useState<CameraMode>(controls?.mode);
  const [camera, setcamera] = useState<CameraView | null>();
  const [pictureSize, setpictureSize] = useState<PictureSizeProps>(
    controls?.pictureSize,
  );
  const [pictureSizes, setpictureSizes] = useState<string[]>([]);
  const [imageType, setimageType] = useState<ImageType>(controls?.imageType);
  const [imageTypes, setimageTypes] = useState<ImageType[]>(["png", "jpg"]);
  const [iso, setiso] = useState<number>(0);
  const [exposure, setexposure] = useState<number>(0);
  const [zoom, setzoom] = useState<number>(0);
  const [ratio, setratio] = useState<RatioProps>(controls?.ratio);
  const [videoQuality, setvideoQuality] = useState<VideoQuality>(
    controls?.videoQuality,
  );
  const videoQualities: VideoQuality[] = ["480p", "720p", "1080p", "2160p"];
  const [videoStabilization, setvideoStabilization] =
    useState<VideoStabilization>(controls?.videoStabilization);

  const [lastCapturedUri, setlastCapturedUri] = useState<string>();
  const [isrecording, setisrecording] = useState<boolean>(false);

  useEffect(() => {
    (async function () {
      const album = await MediaLibrary.getAlbumAsync("AstroCam");
      const albumAssets = await MediaLibrary.getAssetsAsync({
        album,
        mediaType: ["photo", "video"],
        sortBy: "creationTime",
      });
      if (albumAssets) {
        setlastCapturedUri(albumAssets.assets[0]?.uri);
      }

      const pictureSizesRes = await camera?.getAvailablePictureSizesAsync();
      if (pictureSizesRes) {
        setpictureSizes(pictureSizesRes);
      }
    })();
  }, [camera]);

  useEffect(() => {
    dispatch(
      setcontrols({
        mode,
        imageType,
        pictureSize,
        ratio,
        videoQuality,
        videoStabilization,
      }),
    );
  }, [mode, imageType, pictureSize, ratio, videoQuality, videoStabilization]);

  const requestPermissions = () => {
    if (!permission?.granted) {
      requestPermission();
    }
    if (!mediaPermission?.granted) {
      requestMediaPermission();
    }
  };

  function toggleCameraMode() {
    setmode((current) => (current === "picture" ? "video" : "picture"));
    setzoom(0);
  }

  async function handleCapture() {
    if (mode === "picture") {
      const data = await camera?.takePictureAsync({
        imageType,
        quality: 1,
        skipProcessing: true,
      });
      setlastCapturedUri(data?.uri);
      if (data) {
        addImage(data.uri);
      }
    } else if (mode === "video") {
      if (!isrecording) {
        setisrecording(true);
        const data = await camera?.recordAsync({});
        setlastCapturedUri(data?.uri);
        if (data) {
          addVideo(data.uri);
        }
      } else {
        camera?.stopRecording();
        setisrecording(false);
      }
    }
  }

  //NOTE: not getting album when separaed inages and videos
  async function addImage(imageUri: string) {
    const imagesDir = "AstroCam";
    const asset = await MediaLibrary.createAssetAsync(imageUri);
    const album = await MediaLibrary.getAlbumAsync(imagesDir);
    if (!album) {
      console.log("images directories does not exists, creating...");
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
      console.log("images directories does not exists, creating...");
      await MediaLibrary.createAlbumAsync(videosDir, asset, false);
    } else {
      await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
    }
  }

  if (!permission) {
    return <View />;
  }

  if (!permission.granted || !mediaPermission?.granted) {
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
            mute
            mode={mode}
            zoom={zoom}
            facing="back"
            autofocus="on"
            pictureSize={pictureSize}
            videoQuality={videoQuality}
            videoStabilizationMode={videoStabilization}
            ref={(ref) => setcamera(ref)}
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
              <List.Section>
                <List.Item
                  title="Zoom"
                  right={() => <Text>{(zoom * 10).toPrecision(2)}x</Text>}
                />
                <Slider
                  minValue={0}
                  maxValue={1}
                  step={0.1}
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
      <Portal>
        <Dialog visible={isResDialogVisible} onDismiss={hideResDialog}>
          <Dialog.Title>Resolution</Dialog.Title>
          <Dialog.Content>
            <RadioButton.Group
              value={videoQuality}
              onValueChange={(value: VideoQuality) => setvideoQuality(value)}
            >
              {videoQualities.map((item) => (
                <RadioButton.Item
                  key={item.toString()}
                  label={item}
                  value={item}
                />
              ))}
            </RadioButton.Group>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideResDialog}>Cancel</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      <Portal>
        <Dialog
          visible={isPictureTypesDialogVisible}
          onDismiss={hidePictureTypesDialog}
        >
          <Dialog.Title>Image Types</Dialog.Title>
          <Dialog.Content>
            <RadioButton.Group
              value={imageType}
              onValueChange={(value: ImageType) => setimageType(value)}
            >
              {imageTypes.map((item) => (
                <RadioButton.Item
                  key={item.toString()}
                  label={item}
                  value={item}
                />
              ))}
            </RadioButton.Group>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hidePictureTypesDialog}>Cancel</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  );
}
