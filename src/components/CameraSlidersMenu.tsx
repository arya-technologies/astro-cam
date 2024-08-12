import React from "react";
import { View, Text } from "react-native";
import { CameraModeTypes } from "@/features/slices/settingsSlice";

type CameraSlidersMenuProps = {
  mode: CameraModeTypes;
  onShowPictureTypesDialog: () => void;
  onShowVideoTypesDialog: () => void;
  onShowDevicesDialog: () => void;
  onShowFormatsDialog: () => void;
};

export default function CameraSlidersMenu({ mode }: CameraSlidersMenuProps) {
  return (
    <View>
      <Text>CameraSlidersMenu({mode}: CameraSlidersMenuProps)</Text>
    </View>
  );
}
