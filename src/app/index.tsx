import CameraMainMenu from "@/components/CameraMainMenu";
import CameraSlidersMenu from "@/components/CameraSlidersMenu";
import Permissions from "@/components/Permissions";
import { useAppTheme } from "@/components/providers/Material3ThemeProvider";
import VirticalCameraMenu from "@/components/VirticalCameraMenu";
import { CameraModes } from "@/features/slices/settingsSlice";
import { RootState } from "@/features/store";
import { useAppState } from "@react-native-community/hooks";
import * as MediaLibrary from "expo-media-library";
import { useEffect, useRef, useState } from "react";
import { View } from "react-native";
import Reanimated, {
  interpolate,
  useAnimatedProps,
  useDerivedValue,
  useSharedValue,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Camera,
  CameraProps,
  useCameraPermission,
} from "react-native-vision-camera";
import { useDispatch, useSelector } from "react-redux";

const AnimatedCamera = Reanimated.createAnimatedComponent(Camera);
Reanimated.addWhitelistedNativeProps({ zoom: true, exposure: true });

export default function index() {
  const { colors } = useAppTheme();
  const { top, bottom } = useSafeAreaInsets();
  const dispatch = useDispatch();
  const { camera, video, image } = useSelector(
    (state: RootState) => state.settings,
  );
  const { hasPermission, requestPermission } = useCameraPermission();
  const [hasMediaPermission, requestMediaPermission] =
    MediaLibrary.usePermissions();

  // const isFocused = useIsFocused()
  const appState = useAppState();
  const isActive = appState === "active";

  const cameraRef = useRef<Camera>(null);
  const [mode, setmode] = useState<CameraModes>(camera.mode || "picture");
  const [fps, setfps] = useState(
    video.antiFlicker ? 50 : camera.format?.maxFps,
  );

  const [exposureSliderValue, setexposureSliderValue] = useState<number>(50);
  // const exposureSlider = useSharedValue(50);
  const exposure = useDerivedValue(() => {
    if (camera.device === null) return 0;
    return interpolate(
      exposureSliderValue,
      // exposureSlider.value,
      [0, 100],
      [camera.device.minExposure, camera.device.maxExposure],
    );
  }, [exposureSliderValue, camera.device]);

  const [zoomSliderValue, setzoomSliderValue] = useState<number>(50);
  // const zoomSlider = useSharedValue(50);
  const zoom = useDerivedValue(() => {
    if (camera.device === null) return 0;
    return interpolate(
      zoomSliderValue,
      // zoomSlider.value,
      [0, 50, 100],
      [camera.device.minZoom, camera.device.neutralZoom, camera.device.maxZoom],
    );
  }, [zoomSliderValue, camera.device]);

  const animatedProps = useAnimatedProps<CameraProps>(
    () => ({ zoom: zoom.value, exposure: exposure.value }),
    [zoom, exposure],
  );

  const [lastCapturedUri, setlastCapturedUri] = useState<string>("");
  const [isRecording, setisRecording] = useState<boolean>(false);

  useEffect(() => {
    (async function () {
      if (hasPermission && hasMediaPermission?.granted) {
        const album = await MediaLibrary.getAlbumAsync("AstroCam");
        if (album) {
          const albumAssets = await MediaLibrary.getAssetsAsync({
            album,
            first: 1,
            mediaType: ["photo", "video"],
            sortBy: "creationTime",
          });
          if (albumAssets) {
            setlastCapturedUri(albumAssets.assets[0]?.uri);
          }
        }
      }
    })();
  }, [hasPermission, hasMediaPermission]);

  if (!hasPermission || !hasMediaPermission?.granted) {
    return <Permissions />;
  }

  const toggleCameraMode = () => {
    setmode((current) => (current === "picture" ? "video" : "picture"));
  };

  const handleCapture = async () => {
    const asset = await MediaLibrary.createAssetAsync("");
    const album = await MediaLibrary.getAlbumAsync("AstroCam");
    if (!album) {
      await MediaLibrary.createAlbumAsync("AstroCam", asset, false);
    }

    if (mode === "picture") {
      const image = await cameraRef.current?.takePhoto({
        path: "/storage/emulated/0/Pictures/AstroCam/",
      });
      if (image) {
        setlastCapturedUri(`file://${image.path}`);
      }
    } else if (mode === "video") {
      if (!isRecording) {
        setisRecording(true);
        cameraRef.current?.startRecording({
          videoCodec: video.videoCodec,
          videoBitRate: video.videoBitRate,
          fileType: video.videoType,
          path: "/storage/emulated/0/Pictures/AstroCam/",
          onRecordingFinished: (video) => {
            setlastCapturedUri(`file://${video.path}`);
          },
          onRecordingError: (error) => console.log("onRecordingError", error),
        });
      } else {
        cameraRef.current?.stopRecording();
        setisRecording(false);
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
            ref={cameraRef}
            device={camera.device}
            format={camera.format}
            photo={true}
            video={true}
            audio={false}
            fps={fps}
            photoHdr={false}
            videoHdr={false}
            lowLightBoost={false}
            isMirrored={false}
            enableLocation={false}
            isTVSelectable
            enableFpsGraph
            photoQualityBalance="quality"
            videoStabilizationMode="off"
            resizeMode="cover"
            androidPreviewViewType="surface-view"
            className="w-[95vw] h-[95vw] my-[5vw]"
          />
        </View>
        <View className="flex-grow">
          <View className="flex-row flex-grow">
            <VirticalCameraMenu mode={mode} />
            <CameraSlidersMenu
              mode={mode}
              zoom={zoom}
              zoomSliderValue={zoomSliderValue}
              setzoomSliderValue={setzoomSliderValue}
              exposure={exposure}
              exposureSliderValue={exposureSliderValue}
              setexposureSliderValue={setexposureSliderValue}
            />
          </View>
          <CameraMainMenu
            mode={mode}
            onCapture={handleCapture}
            isRecording={isRecording}
            lastCapturedUri={lastCapturedUri}
            onToggleCameraMode={toggleCameraMode}
          />
        </View>
      </View>
      <></>
    </>
  );
}
