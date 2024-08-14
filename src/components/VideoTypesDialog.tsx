import React from "react";
import { Portal, Dialog, RadioButton, Button } from "react-native-paper";

type DialogProps = {
  title: string;
  visible: boolean;
  onDismiss: () => void;
  value: string;
  setValue: (value: string) => void;
  data: [];
};

export default function SelectDialog({
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
            onValueChange={(val) => setValue(val)}
          >
            {data.map((item) => (
              <RadioButton.Item label={item} value={item} />
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
