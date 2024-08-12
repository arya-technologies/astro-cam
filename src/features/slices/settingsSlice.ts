import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import { CameraDevice, CameraDeviceFormat } from "react-native-vision-camera";

export type ThemeProps = "system" | "light" | "dark" | "pureBlack";

export type CameraModeTypes = "picture" | "video";
export type ImageTypes = "raw" | "png" | "jpg";
export type VideoTypes = "mov" | "mp4";

type AppearanceProps = {
  theme: ThemeProps;
};
type ControlsProps = {
  mode: CameraModeTypes;
  device?: CameraDevice;
  format?: CameraDeviceFormat;
  imageTyp?: ImageTypes;
  videoType?: VideoTypes;
  videoCodec?: "h264" | "h265";
  videoBitRate?: number | "low" | "high";
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
      controls.imageTyp = payload.imageTyp;
      controls.videoType = payload.videoType;
      controls.videoCodec = payload.videoCodec;
      controls.videoBitRate = payload.videoBitRate;
    },
  },
});

export const { setappearance, setcontrols } = settingsSlice.actions;

export default settingsSlice.reducer;
