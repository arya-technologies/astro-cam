import { Asset } from "expo-media-library";
import React from "react";
import { Button, Dialog, Portal, Text } from "react-native-paper";
import * as MediaLibrary from "expo-media-library";

type DeleteAssetDialogProps = {
  visible: boolean;
  onDismiss: () => void;
  asset: Asset;
};
export default function DeleteAssetDialog({
  visible,
  onDismiss,
  asset,
}: DeleteAssetDialogProps) {
  const handleDelete = async () => {
    await MediaLibrary.deleteAssetsAsync(asset);
  };

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onDismiss}>
        <Dialog.Icon icon="warning" />
        <Dialog.Title>Warning</Dialog.Title>
        <Dialog.Content>
          <Text>Are you sure you want to delete {asset.filename} ?</Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={onDismiss}>Cancel</Button>
          <Button onPress={handleDelete}>Confirm</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}
