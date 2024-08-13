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
type ControlsProps = {
  mode: CameraModes;
  device?: CameraDevice;
  format?: CameraDeviceFormat;
  imageType: ImageTypes;
  videoType: VideoTypes;
  videoCodec: VideoCodecs;
  videoBitRate: VideoBitRates;
  antiFlicker: boolean;
};

export interface SettingsProps {
  appearance: AppearanceProps;
  controls: ControlsProps;
}

const initialState: SettingsProps = {
  appearance: {
    theme: "system",
  },
  controls: {
    mode: "picture",
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
    setappearance: (
      { appearance },
      { payload }: PayloadAction<AppearanceProps>,
    ) => {
      appearance.theme = payload.theme;
    },
    setcontrols: ({ controls }, { payload }: PayloadAction<ControlsProps>) => {
      controls.device = payload.device;
      controls.format = payload.format;
      controls.mode = payload.mode;
      controls.imageType = payload.imageType;
      controls.videoType = payload.videoType;
      controls.videoCodec = payload.videoCodec;
      controls.videoBitRate = payload.videoBitRate;
      controls.antiFlicker = payload.antiFlicker;
    },
  },
});

export const { setappearance, setcontrols } = settingsSlice.actions;

export default settingsSlice.reducer;
