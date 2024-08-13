import React from "react";
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
};

export default function SelectFormatDialog({
  title,
  videoRes,
  visible,
  onDismiss,
  setVideoRes,
  minRes,
  maxRes,
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
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={onDismiss}>Cancel</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}
