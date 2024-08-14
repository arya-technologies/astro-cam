import * as MediaLibrary from "expo-media-library";
import * as Sharing from "expo-sharing";
import { useState } from "react";
import { View } from "react-native";
import { IconButton, Text } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import DeleteAssetDialog from "./DeleteAssetDialog";

type PreviewMenuProps = {
  asset: MediaLibrary.Asset;
  handleDelete: () => void;
};

export default function PreviewMenu({ asset, handleDelete }: PreviewMenuProps) {
  const { bottom } = useSafeAreaInsets();

  const [isDeleteDialogVisible, setisDeleteDialogVisible] =
    useState<boolean>(false);
  const showDeleteDialog = () => setisDeleteDialogVisible(true);
  const hideDeleteDialog = () => setisDeleteDialogVisible(false);

  return (
    <>
      <View style={{ paddingBottom: bottom }}>
        <View className="flex-row items-center justify-between h-[64] px-4">
          <IconButton
            icon="share"
            onPress={() => Sharing.shareAsync(asset.uri)}
          />
          <Text>{asset.filename}</Text>
          <IconButton icon="trash-bin" onPress={showDeleteDialog} />
        </View>
      </View>
      <>
        <DeleteAssetDialog
          assetId={asset.id}
          assetName={asset.filename}
          visible={isDeleteDialogVisible}
          onDismiss={hideDeleteDialog}
          onDelete={handleDelete}
        />
      </>
    </>
  );
}
