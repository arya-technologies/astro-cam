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
import { Linking, View } from "react-native";
import { Button, Text } from "react-native-paper";
import { useAppTheme } from "@/components/providers/Material3ThemeProvider";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/features/store";

export default function index() {
  const { colors } = useAppTheme();
  const { top, bottom } = useSafeAreaInsets();
  const dispatch = useDispatch();
  const { controls } = useSelector((state: RootState) => state.settings);
  const { hasPermission, requestPermission } = useCameraPermission();
  const [mediaPermission, requestMediaPermission] =
    MediaLibrary.usePermissions();

  const camera = useRef<Camera>(null);
  const devices = useCameraDevices();
  const device: CameraDevice = useCameraDevice("back", {
    physicalDevices: [
      "ultra-wide-angle-camera",
      "wide-angle-camera",
      "telephoto-camera",
    ],
  });
  const usbCamera = useCameraDevice("external");
  const format = useCameraFormat(device, []);
  const [fps, setfps] = useState(format?.maxFps);

  // const isFocused = useIsFocused()
  //   const appState = useAppState()
  //   const isActive = isFocused && appState === "active"

  const [mode, setmode] = useState<"picture" | "video">();

  const [lastCapturedUri, setlastCapturedUri] = useState<string>();
  const [isrecording, setisrecording] = useState<boolean>(false);

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

  const ensureDirExist = async () => {
    const album = await MediaLibrary.getAlbumAsync("AstroCam");
    if (!album) {
      const res = await MediaLibrary.createAlbumAsync("AstroCam");
      if (res) {
        return true;
      }
    }
    return false;
  };
  const handleCapture = async () => {
    const album = await MediaLibrary.getAlbumAsync("AstroCam");
    if (mode === "picture") {
      const data = await camera.current?.takePhoto({ path: "AstroCam" });
      if (data) {
        setlastCapturedUri(data?.path);
      }
    } else if (mode === "video") {
      if (!isrecording) {
        setisrecording(true);
        const data = await camera.current?.startRecording({
          path: "AstroCam",
          onRecordingFinished(video) {
            setlastCapturedUri(video.path);
          },
        });
        // setlastCapturedUri(data);
        if (data) {
        }
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
            isActive
            ref={camera}
            device={device}
            format={format}
            fps={fps}
            photo={true}
            video={true}
            photoHdr={false}
            videoHdr={false}
            videoStabilizationMode="off"
            resizeMode="contain"
            androidPreviewViewType="surface-view"
            className="w-[95vw] h-[95vw] my-[5vw]"
          />
        </View>
      </View>
    </>
  );
}
