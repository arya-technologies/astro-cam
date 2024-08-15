import { CameraModes } from "@/features/slices/settingsSlice";
import React from "react";
import { View } from "react-native";
import { List, Text } from "react-native-paper";
import Slider from "./Slider";

interface SharedValue<Value = number> {
  value: Value;
  addListener: (listenerID: number, listener: (value: Value) => void) => void;
  removeListener: (listenerID: number) => void;
  modify: (
    modifier?: <T extends Value>(value: T) => T,
    forceUpdate?: boolean,
  ) => void;
}

type CameraSlidersMenuProps = {
  mode: CameraModes;
  zoom: SharedValue;
  exposure: SharedValue;
  exposureSliderValue: number;
  zoomSliderValue: number;
  setzoomSliderValue: (value: number) => void;
  setexposureSliderValue: (value: number) => void;
};

export default function CameraSlidersMenu({
  mode,
  zoom,
  exposure,
  exposureSliderValue,
  setexposureSliderValue,
  zoomSliderValue,
  setzoomSliderValue,
}: CameraSlidersMenuProps) {
  return (
    <View className="flex-grow justify-end">
      {mode === "video" ? <></> : <></>}
      <List.Section>
        <List.Item
          title="Exposure"
          right={() => <Text>{exposure.value}</Text>}
        />
        <Slider
          value={exposureSliderValue}
          onValueChange={(value) => setexposureSliderValue(value)}
        />
      </List.Section>
      <List.Section>
        <List.Item title="Zoom" right={() => <Text>{zoom.value}x</Text>} />
        <Slider
          value={zoomSliderValue}
          onValueChange={(value) => setzoomSliderValue(value)}
        />
      </List.Section>
    </View>
  );
}
