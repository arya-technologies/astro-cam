import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

export type ThemeProps = "system" | "light" | "dark" | "pureBlack";

export interface SettingsProps {
  appearance: {
    theme: ThemeProps;
  };
}

const initialState: SettingsProps = {
  appearance: {
    theme: "system",
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
      appearance.theme = payload.appearance.theme;
    },
  },
});

export const { setsettings } = settingsSlice.actions;

export default settingsSlice.reducer;
