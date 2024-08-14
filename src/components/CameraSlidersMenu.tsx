import { CameraModeTypes } from "@/features/slices/settingsSlice";
import React from "react";
import { Text, View } from "react-native";
import { List } from "react-native-paper";
import Slider from "./Slider";
// import { SharedValue } from "react-native-reanimated";

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
  mode: CameraModeTypes;
  iso: SharedValue;
  exposure: SharedValue;
  zoom: SharedValue;
  isoSlider: SharedValue;
  exposureSlider: SharedValue;
  zoomSlider: SharedValue;
};

export default function CameraSlidersMenu({
  mode,
  iso,
  exposure,
  zoom,
  isoSlider,
  exposureSlider,
  zoomSlider,
}: CameraSlidersMenuProps) {
  return (
    <View className="flex-grow justify-end">
      {mode === "video" ? <></> : <></>}
      <List.Section>
        <List.Item title="Iso" right={() => <Text>{iso.value}</Text>} />
        <Slider
          value={iso.value}
          onValueChange={(value) => (isoSlider.value = value)}
        />
      </List.Section>
      <List.Section>
        <List.Item
          title="Exposure"
          right={() => <Text>{exposure.value}</Text>}
        />
        <Slider
          value={exposure.value}
          onValueChange={(value) => (exposureSlider.value = value)}
        />
      </List.Section>
      <List.Section>
        <List.Item title="Zoom" right={() => <Text>{zoom.value}x</Text>} />
        <Slider
          value={zoom.value}
          onValueChange={(value) => (zoomSlider.value = value)}
        />
      </List.Section>
    </View>
  );
}
