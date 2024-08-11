import React from "react";
import { ScrollView } from "react-native";
import { Button, Dialog, List, Portal, Text } from "react-native-paper";
import Slider from "./Slider";

type DialogProps = {
  title: string;
  visible: boolean;
  onDismiss: () => void;
  videoRes: number;
  setVideoRes: (value: number) => void;
  minRes: number;
  maxRes: number;
  fps: number;
  minFps: number;
  maxFps: number;
  setFps: (value: number) => void;
};

export default function SelectFormatDialog({
  title,
  videoRes,
  visible,
  onDismiss,
  setVideoRes,
  minRes,
  maxRes,
  fps,
  minFps,
  maxFps,
  setFps,
}: DialogProps) {
  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onDismiss}>
        <Dialog.Title>{title}</Dialog.Title>
        <Dialog.Content>
          <List.Section>
            <List.Item
              title="Resolution"
              right={() => <Text>{videoRes}</Text>}
            />
            <Slider
              minValue={minRes}
              maxValue={maxRes}
              step={360}
              value={videoRes}
              onValueChange={setVideoRes}
            />
          </List.Section>
          <List.Section>
            <List.Item title="FPS" right={() => <Text>{fps}</Text>} />
            <Slider
              minValue={minFps}
              maxValue={maxFps}
              step={1}
              value={fps}
              onValueChange={setFps}
            />
          </List.Section>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={onDismiss}>Cancel</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}
