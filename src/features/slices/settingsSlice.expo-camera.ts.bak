import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import {
  CameraMode,
  ImageType,
  VideoQuality,
  VideoStabilization,
} from "expo-camera";

export type ThemeProps = "system" | "light" | "dark" | "pureBlack";
export type PictureSizeProps = "3000x3000";
export type RatioProps = "1:1";

type AppearanceProps = {
  theme: ThemeProps;
};
type ControlsProps = {
  mode: CameraMode;
  pictureSize: PictureSizeProps;
  ratio: RatioProps;
  imageType: ImageType;
  videoQuality: VideoQuality;
  videoStabilization: VideoStabilization;
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
    pictureSize: "3000x3000",
    ratio: "1:1",
    imageType: "png",
    videoQuality: "1080p",
    videoStabilization: "off",
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
      controls.mode = payload.mode;
      controls.imageType = payload.imageType;
      controls.pictureSize = payload.pictureSize;
      controls.ratio = payload.ratio;
      controls.videoQuality = payload.videoQuality;
      controls.videoStabilization = payload.videoStabilization;
    },
  },
});

export const { setappearance, setcontrols } = settingsSlice.actions;

export default settingsSlice.reducer;
