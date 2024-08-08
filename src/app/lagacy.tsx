import { useAppTheme } from "@/components/providers/Material3ThemeProvider";
import Slider from "@react-native-community/slider";
import {
  Camera,
  CameraType,
  ImageType,
  VideoQuality,
} from "expo-camera/legacy";
import * as MediaLibrary from "expo-media-library";
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
  const { width, height } = Dimensions.get("window");
  const [camera, setcamera] = useState<Camera | null>();
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [mediaPermission, requestMediaPermission] =
    MediaLibrary.usePermissions();

  const [isResDialogVisible, setisResDialogVisible] = useState<boolean>(false);
  const showResDialog = () => setisResDialogVisible(true);
  const hideResDialog = () => setisResDialogVisible(false);

  const [mode, setmode] = useState<string>("picture");
  const [focusDepth, setfocusDepth] = useState<number>(0);
  const [pictureSize, setpictureSize] = useState<string>("3000x3000");
  const [pictureSizes, setpictureSizes] = useState<string[]>([]);
  const [zoom, setzoom] = useState<number>(0);
  const [whiteBalance, setwhiteBalance] = useState<number>(0);
  const [ratio, setratio] = useState<string>("1:1");
  const [imageType, setimageType] = useState<ImageType>(ImageType.png);
  const [videoQuality, setvideoQuality] = useState<VideoQuality>(
    VideoQuality["480p"],
  );
  const [videoQualities, setvideoQualities] = useState<VideoQuality>();

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

      const pictureSizesRes =
        await camera?.getAvailablePictureSizesAsync(ratio);
      if (pictureSizesRes) {
        setpictureSizes(pictureSizesRes);
      }

      // const videoQualitiesRes =
      //   await camera?.get(ratio);
      // if (videoQualitiesRes) {
      //   setvideoQualities(videoQualitiesRes);
      // }
    })();
  }, [camera]);

  const requestPermissions = () => {
    if (!permission?.granted) {
      requestPermission();
    }
    if (!mediaPermission?.granted) {
      requestMediaPermission();
    }
  };

  function toggleCameraMode() {
    // setmode((current) => (current === "picture" ? "video" : "picture"));
    // setiso(0);
    // setexposure(0);
    // setzoom(0);
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
        setisrecording(false);
        camera?.stopRecording();
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
          <Camera
            focusDepth={focusDepth}
            pictureSize={pictureSize}
            ratio={ratio}
            useCamera2Api
            zoom={zoom}
            whiteBalance={whiteBalance}
            type={CameraType.back}
            focusable
            ref={(ref) => setcamera(ref)}
            className="w-[95vw] h-[95vw] my-[5vw]"
          />
        </View>
        <View className="flex-grow">
          <View className="flex-1 flex-grow justify-end">
            {mode === "video" ? (
              <>
                <List.Section>
                  <List.Item
                    title="Quality"
                    right={() => <Text>{videoQuality}</Text>}
                    onPress={showResDialog}
                  />
                </List.Section>
                <List.Section>
                  <List.Item title="Iso" right={() => <Text>{iso}</Text>} />
                  <Slider
                    minimumValue={0}
                    maximumValue={10}
                    minimumTrackTintColor={colors.outline}
                    maximumTrackTintColor={colors.onSurfaceVariant}
                    thumbTintColor={colors.primary}
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
                    minimumValue={0}
                    maximumValue={10}
                    minimumTrackTintColor={colors.outline}
                    maximumTrackTintColor={colors.onSurfaceVariant}
                    thumbTintColor={colors.primary}
                    step={1}
                    value={exposure}
                    onValueChange={setexposure}
                  />
                </List.Section>
              </>
            ) : (
              <IconButton
                size={40}
                icon="home"
                onPress={() => router.navigate("preview")}
              />
            )}
            <List.Section>
              <List.Item title="Zoom" right={() => <Text>{zoom}</Text>} />
              <Slider
                minimumValue={0}
                maximumValue={1}
                minimumTrackTintColor={colors.outline}
                maximumTrackTintColor={colors.onSurfaceVariant}
                thumbTintColor={colors.primary}
                step={0.1}
                value={zoom}
                onValueChange={setzoom}
              />
            </List.Section>
          </View>
          <View className="flex-row items-center justify-evenly py-4">
            <Pressable onPress={() => router.navigate("preview")}>
              <Image
                source={{
                  uri: lastCapturedUri,
                }}
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
        <Dialog
          visible={isResDialogVisible}
          onDismiss={hideResDialog}
          style={{ maxHeight: "75%" }}
        >
          <Dialog.Title>Resolution</Dialog.Title>
          <Dialog.ScrollArea>
            <ScrollView>
              <RadioButton.Group
                value={videoQuality}
                onValueChange={(value) => setvideoQuality(value)}
              >
                {videoQualities.map((item) => (
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