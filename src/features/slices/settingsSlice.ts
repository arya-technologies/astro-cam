import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import {
  Camera,
  CameraDevice,
  CameraDeviceFormat,
} from "react-native-vision-camera";

export type ThemesProps = "system" | "light" | "dark" | "pureBlack";
export type ThemeProps = {
  label: string;
  value: string;
  icon: string;
};

export const themes: ThemeProps[] = [
  {
    label: "System",
    value: "system",
    icon: "color-wand",
  },
  {
    label: "Light",
    value: "light",
    icon: "sunny",
  },
  {
    label: "Dark",
    value: "dark",
    icon: "cloudy-night",
  },
  {
    label: "Pure Black",
    value: "pure-black",
    icon: "moon",
  },
];

export type CameraModes = "picture" | "video";
export type ImageTypes = "raw" | "png" | "jpg";
export type VideoTypes = "mov" | "mp4";
export type VideoCodecs = "h264" | "h265";
export type VideoBitRates =
  | number
  | "extra-low"
  | "low"
  | "normal"
  | "high"
  | "extra-high";

interface CameraProps {
  device: CameraDevice;
  format: CameraDeviceFormat;
  mode: CameraModes;
  autoFocus: boolean;
}
interface ImageProps {
  imageType: ImageTypes;
}
interface VideoProps {
  videoType: VideoTypes;
  videoCodec: VideoCodecs;
  videoBitRate: VideoBitRates;
  antiFlicker: boolean;
}
interface AppearanceProps {
  theme: ThemeProps;
}

interface SettingsProps {
  camera: CameraProps;
  image: ImageProps;
  video: VideoProps;
  appearance: AppearanceProps;
}

const device = Camera.getAvailableCameraDevices()[0];
const format = device.formats[0];

const initialState: SettingsProps = {
  camera: {
    device,
    format,
    mode: "picture",
    autoFocus: false,
  },
  image: {
    imageType: "jpg",
  },
  video: {
    videoType: "mov",
    videoCodec: "h265",
    videoBitRate: "normal",
    antiFlicker: false,
  },
  appearance: {
    theme: themes[0],
  },
};

export const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    setcamera: ({ camera }, { payload }: PayloadAction<CameraProps>) => {
      camera.mode = payload.mode;
      camera.autoFocus = payload.autoFocus;
    },
    setcameraDevice: ({ camera }, { payload }) => {
      camera.device = payload;
    },
    setcameraFormat: ({ camera }, { payload }) => {
      camera.format = payload;
    },
    setimage: ({ image }, { payload }: PayloadAction<ImageProps>) => {
      image.imageType = payload.imageType;
    },
    setvideo: ({ video }, { payload }: PayloadAction<VideoProps>) => {
      video.videoType = payload.videoType;
      video.videoCodec = payload.videoCodec;
      video.videoBitRate = payload.videoBitRate;
      video.antiFlicker = payload.antiFlicker;
    },
    setappearance: (
      { appearance },
      { payload }: PayloadAction<AppearanceProps>,
    ) => {
      appearance.theme = payload.theme;
    },
  },
});

export const {
  setcamera,
  setappearance,
  setimage,
  setvideo,
  setcameraDevice,
  setcameraFormat,
} = settingsSlice.actions;

export default settingsSlice.reducer;
