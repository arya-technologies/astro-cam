import React from "react";
import { View, Text } from "react-native";
import { CameraModeTypes } from "@/features/slices/settingsSlice";
import { List } from "react-native-paper";
import Slider from "./Slider";
import { CameraDevice, CameraDeviceFormat } from "react-native-vision-camera";
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
  device: CameraDevice;
  format: CameraDeviceFormat;
  isoSlider: SharedValue;
  exposureSlider: SharedValue;
  zoomSlider: SharedValue;
};

export default function CameraSlidersMenu({
  mode,
  iso,
  exposure,
  zoom,
  device,
  format,
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
          minValue={format.minISO}
          maxValue={format.maxISO}
          step={1}
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
          minValue={device.minExposure}
          maxValue={device.maxExposure}
          step={1}
          value={exposure.value}
          onValueChange={(value) => (exposureSlider.value = value)}
        />
      </List.Section>
      <List.Section>
        <List.Item title="Zoom" right={() => <Text>{zoom.value}</Text>} />
        <Slider
          minValue={device.minZoom}
          maxValue={device.maxZoom}
          step={1}
          value={zoom.value}
          onValueChange={(value) => (zoomSlider.value = value)}
        />
      </List.Section>
    </View>
  );
}
