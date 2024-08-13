import React from "react";
import { Button, Dialog, Portal, Text } from "react-native-paper";

type DeleteAssetDialogProps = {
  visible: boolean;
  onDismiss: () => void;
  onDelete: () => void;
  assetId: string;
  assetName: string;
};
export default function DeleteAssetDialog({
  visible,
  onDismiss,
  onDelete,
  assetId,
  assetName,
}: DeleteAssetDialogProps) {
  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onDismiss}>
        <Dialog.Icon icon="warning" />
        <Dialog.Title>Warning</Dialog.Title>
        <Dialog.Content>
          <Text>Are you sure you want to delete {assetName} ?</Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={onDismiss}>Cancel</Button>
          <Button onPress={onDelete}>Confirm</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}
