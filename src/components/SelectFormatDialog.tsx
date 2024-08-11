import React from "react";
import { Portal, Dialog, RadioButton, Button } from "react-native-paper";
import { CameraDeviceFormat } from "react-native-vision-camera";

type DialogProps = {
  title: string;
  visible: boolean;
  onDismiss: () => void;
  value: string;
  setValue: (value: CameraDeviceFormat) => void;
  data: CameraDeviceFormat[];
};

export default function SelectFormatDialog({
  data,
  title,
  value,
  visible,
  onDismiss,
  setValue,
}: DialogProps) {
  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onDismiss}>
        <Dialog.Title>{title}</Dialog.Title>
        <Dialog.Content>
          <RadioButton.Group
            value={value}
            onValueChange={(val) => setValue(JSON.parse(val))}
          >
            {data.map((item) => (
              <RadioButton.Item
                key={JSON.stringify(item)}
                label={JSON.stringify(item)}
                value={JSON.stringify(item)}
              />
            ))}
          </RadioButton.Group>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={onDismiss}>Cancel</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}
