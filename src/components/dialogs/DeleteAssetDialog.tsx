import React from "react";
import { Button, Dialog, Portal, Text } from "react-native-paper";
import * as MediaLibrary from "expo-media-library";

type DeleteAssetDialogProps = {
  visible: boolean;
  onDismiss: () => void;
  assetId: string;
  assetName: string;
};
export default function DeleteAssetDialog({
  visible,
  onDismiss,
  assetId,
  assetName,
}: DeleteAssetDialogProps) {
  const handleDelete = async () => {
    await MediaLibrary.deleteAssetsAsync([assetId]);
  };

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
          <Button onPress={handleDelete}>Confirm</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}
