import React, { useState } from "react";
import { Button, Dialog, Portal, Text, TextInput } from "react-native-paper";
import * as MediaLibrary from "expo-media-library";

type DeleteAssetDialogProps = {
  visible: boolean;
  onDismiss: () => void;
  assetId: string;
  assetName: string;
};
export default function RenameAssetDialog({
  visible,
  onDismiss,
  assetId,
  assetName,
}: DeleteAssetDialogProps) {
  const [filename, setfilename] = useState<string>(assetName);

  const handleRename = async () => {
    if (assetId) {
      await MediaLibrary.deleteAssetsAsync([assetId]);
    }
  };

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onDismiss}>
        <Dialog.Icon icon="warning" />
        <Dialog.Title>Rename {assetName}</Dialog.Title>
        <Dialog.Content>
          <TextInput value={filename} onChangeText={setfilename} />
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={onDismiss}>Cancel</Button>
          <Button onPress={handleRename}>Confirm</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}
