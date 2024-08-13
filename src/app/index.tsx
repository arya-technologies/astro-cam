import CameraSlidersMenu from "@/components/CameraSlidersMenu";
import Permissions from "@/components/Permissions";
import { useAppTheme } from "@/components/providers/Material3ThemeProvider";
import SelectDeviceDialog from "@/components/SelectDeviceDialog";
import SelectDialog from "@/components/SelectDialog";
import SelectFormatDialog from "@/components/SelectFormatDialog";
import VirticalCameraMenu from "@/components/VirticalCameraMenu";
import {
  CameraModes,
  ImageTypes,
  setcontrols,
  VideoBitRates,
  VideoCodecs,
  VideoTypes,
} from "@/features/slices/settingsSlice";
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
  CameraDevice,
  CameraProps,
  useCameraDevices,
  useCameraFormat,
  useCameraPermission,
} from "react-native-vision-camera";
import { useDispatch, useSelector } from "react-redux";
import CameraMainMenu from "@/components/CameraMainMenu";

const AnimatedCamera = Reanimated.createAnimatedComponent(Camera);
Reanimated.addWhitelistedNativeProps({ zoom: true, exposure: true });

export default function index() {
  const { colors } = useAppTheme();
  const { top, bottom } = useSafeAreaInsets();
  const dispatch = useDispatch();
  const { controls } = useSelector((state: RootState) => state.settings);
  const { hasPermission, requestPermission } = useCameraPermission();
  const [hasMediaPermission, requestMediaPermission] =
    MediaLibrary.usePermissions();

  // const isFocused = useIsFocused()
  const appState = useAppState();
  const isActive = appState === "active";

  const camera = useRef<Camera>(null);
  const devices = useCameraDevices();
  const [device, setdevice] = useState<CameraDevice>(
    controls.device || devices[0],
  );

  const [mode, setmode] = useState<CameraModes>(controls.mode || "picture");
  const [imageType, setimageType] = useState<ImageTypes>(controls.imageType);
  const [videoType, setvideoType] = useState<VideoTypes>(controls.videoType);
  const [videoCodec, setvideoCodec] = useState<VideoCodecs>(
    controls.videoCodec,
  );
  const [videoBitRate, setvideoBitRate] = useState<VideoBitRates>(
    controls.videoBitRate,
  );
  const [antiFlicker, setantiFlicker] = useState<boolean>(controls.antiFlicker);

  const [videoRes, setvideoRes] = useState<number>(
    device?.formats[0].videoHeight!,
  );
  const imageFormat = useCameraFormat(device, [{ photoAspectRatio: 1 / 1 }]);
  const videoFormat = useCameraFormat(device, [
    {
      videoAspectRatio: 9 / 16,
      videoResolution: { height: videoRes, width: (videoRes / 9) * 16 },
    },
  ]);
  const format =
    controls.format || mode === "video" ? videoFormat : imageFormat;

  const [fps, setfps] = useState(controls.antiFlicker ? 50 : format?.maxFps);
  const [focus, setfocus] = useState<boolean>(false);
  const [focusDepth, setfocusDepth] = useState(device?.minFocusDistance);

  const isoSlider = useSharedValue(0);
  const iso = useDerivedValue(() => {
    if (format === undefined) return 0;
    return interpolate(
      isoSlider.value,
      [0, 100],
      [format.minISO, format.maxISO],
    );
  }, [isoSlider, device]);

  const exposureSlider = useSharedValue(50);
  const exposure = useDerivedValue(() => {
    if (device === null) return 0;
    return interpolate(
      exposureSlider.value,
      [0, 100],
      [device.minExposure, device.maxExposure],
    );
  }, [exposureSlider, device]);

  const zoomSlider = useSharedValue(0);
  const zoom = useDerivedValue(() => {
    if (device === null) return 0;
    return interpolate(
      zoomSlider.value,
      [0, 100],
      [device.minZoom, device.maxZoom],
    );
  }, [zoomSlider, device]);

  const animatedProps = useAnimatedProps<CameraProps>(
    () => ({ zoom: zoom.value, exposure: exposure.value }),
    [zoom, exposure],
  );

  const [lastCapturedUri, setlastCapturedUri] = useState<string>("");
  const [isRecording, setisRecording] = useState<boolean>(false);

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

  useEffect(() => {
    dispatch(
      setcontrols({
        device,
        format,
        mode,
        videoType,
        imageType,
        videoCodec,
        videoBitRate,
        antiFlicker,
      }),
    );
  }, [
    device,
    format,
    mode,
    videoType,
    imageType,
    videoCodec,
    videoBitRate,
    antiFlicker,
  ]);

  if (!hasPermission || !hasMediaPermission?.granted) {
    return <Permissions />;
  }

  const toggleCameraMode = () => {
    setmode((current) => (current === "picture" ? "video" : "picture"));
  };

  const handleCapture = async () => {
    if (mode === "picture") {
      const image = await camera.current?.takePhoto({
        path: "/storage/emulated/0/Pictures/AstroCam/",
      });
      if (image) {
        setlastCapturedUri(`file://${image.path}`);
      }
    } else if (mode === "video") {
      if (!isRecording) {
        setisRecording(true);
        camera.current?.startRecording({
          videoCodec,
          videoBitRate,
          fileType: videoType,
          path: "/storage/emulated/0/Pictures/AstroCam/",
          onRecordingFinished: (video) => {
            setlastCapturedUri(`file://${video.path}`);
          },
          onRecordingError: (error) => console.log("onRecordingError", error),
        });
      } else {
        camera.current?.stopRecording();
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
            ref={camera}
            device={device!}
            format={format}
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
            <VirticalCameraMenu
              mode={mode}
              onShowDevicesDialog={showDevicesDialog}
              onShowFormatsDialog={showFormatsDialog}
              onShowPictureTypesDialog={showPictureTypesDialog}
              onShowVideoTypesDialog={showVideoTypesDialog}
            />
            <CameraSlidersMenu
              mode={mode}
              iso={iso}
              exposure={exposure}
              zoom={zoom}
              isoSlider={isoSlider}
              exposureSlider={exposureSlider}
              zoomSlider={zoomSlider}
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
      <>
        <SelectFormatDialog
          title="Format"
          videoRes={videoRes}
          minRes={device.formats.at(-1)?.videoHeight!}
          maxRes={device.formats[0].videoHeight!}
          setVideoRes={setvideoRes}
          visible={isFormatsDialogVisible}
          onDismiss={hideFormatsDialog}
        />
        <SelectDeviceDialog
          data={devices}
          title="Devices"
          value={device.id}
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

async function addAsset(uri: string) {
  const imagesDir = "AstroCam";
  const asset = await MediaLibrary.createAssetAsync(uri);
  const album = await MediaLibrary.getAlbumAsync(imagesDir);
  if (!album) {
    await MediaLibrary.createAlbumAsync(imagesDir, asset, false);
  } else {
    await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
  }
}
