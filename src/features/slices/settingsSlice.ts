import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import { CameraDevice, CameraDeviceFormat } from "react-native-vision-camera";

export type ThemeProps = "system" | "light" | "dark" | "pureBlack";

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

type AppearanceProps = {
  theme: ThemeProps;
};
type CameraProps = {
  mode: CameraModes;
  device?: CameraDevice;
  format?: CameraDeviceFormat;
};
type ControlsProps = {
  autoFocus: boolean;
  imageType: ImageTypes;
  videoType: VideoTypes;
  videoCodec: VideoCodecs;
  videoBitRate: VideoBitRates;
  antiFlicker: boolean;
};

export interface SettingsProps {
  camera: CameraProps;
  appearance: AppearanceProps;
  controls: ControlsProps;
}

const initialState: SettingsProps = {
  camera: {
    mode: "picture",
  },
  appearance: {
    theme: "system",
  },
  controls: {
    autoFocus: false,
    imageType: "jpg",
    videoType: "mov",
    videoCodec: "h265",
    videoBitRate: "normal",
    antiFlicker: false,
  },
};

export const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    setcamera: ({ camera }, { payload }: PayloadAction<CameraProps>) => {
      camera.device = payload.device;
      camera.format = payload.format;
      camera.mode = payload.mode;
    },
    setappearance: (
      { appearance },
      { payload }: PayloadAction<AppearanceProps>,
    ) => {
      appearance.theme = payload.theme;
    },
    setcontrols: ({ controls }, { payload }: PayloadAction<ControlsProps>) => {
      controls.imageType = payload.imageType;
      controls.videoType = payload.videoType;
      controls.videoCodec = payload.videoCodec;
      controls.videoBitRate = payload.videoBitRate;
      controls.antiFlicker = payload.antiFlicker;
      controls.autoFocus = payload.autoFocus;
    },
  },
});

export const { setcamera, setappearance, setcontrols } = settingsSlice.actions;

export default settingsSlice.reducer;
