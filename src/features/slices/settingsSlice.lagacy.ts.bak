import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import { ImageType, VideoQuality } from "expo-camera/legacy";

export type ThemeProps = "system" | "light" | "dark" | "pureBlack";
export type CameraModeProps = "picture" | "video";
export type PictureSizeProps = "3000x3000";
export type RatioProps = "1:1";

export interface SettingsProps {
  appearance?: {
    theme: ThemeProps;
  };
  controls?: {
    mode: CameraModeProps;
    autoFocus: boolean;
    pictureSize: PictureSizeProps;
    whiteBalance: number;
    ratio: RatioProps;
    imageType: ImageType;
    videoQuality: VideoQuality;
  };
}

const initialState: SettingsProps = {
  appearance: {
    theme: "system",
  },
  controls: {
    mode: "picture",
    autoFocus: false,
    pictureSize: "3000x3000",
    whiteBalance: 0,
    ratio: "1:1",
    imageType: ImageType.png,
    videoQuality: VideoQuality["1080p"],
  },
};

export const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    setsettings: (
      { appearance },
      { payload }: PayloadAction<SettingsProps>,
    ) => {
      if (payload.appearance) {
        appearance = {
          theme: payload.appearance.theme,
        };
      }
    },
    setcontrols: ({ controls }, { payload }: PayloadAction<SettingsProps>) => {
      if (payload.controls) {
        controls = {
          mode: payload.controls.mode,
          autoFocus: payload.controls.autoFocus,
          imageType: payload.controls.imageType,
          pictureSize: payload.controls.pictureSize,
          ratio: payload.controls.ratio,
          videoQuality: payload.controls.videoQuality,
          whiteBalance: payload.controls.whiteBalance,
        };
      }
    },
  },
});

export const { setsettings, setcontrols } = settingsSlice.actions;

export default settingsSlice.reducer;
