import * as MediaLibrary from "expo-media-library";
import * as Sharing from "expo-sharing";
import { useState } from "react";
import { View } from "react-native";
import { IconButton } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AssetInfo from "./AssetInfo";
import DeleteAssetDialog from "./DeleteAssetDialog";

type PreviewMenuProps = {
  asset: MediaLibrary.Asset;
  handleDelete: () => void;
};

export default function PreviewMenu({ asset, handleDelete }: PreviewMenuProps) {
  const { bottom } = useSafeAreaInsets();

  const [isInfoVisible, setisInfoVisible] = useState<boolean>(false);
  const showInfo = () => setisInfoVisible(true);
  const hideInfo = () => setisInfoVisible(false);

  const [isDeleteDialogVisible, setisDeleteDialogVisible] =
    useState<boolean>(false);
  const showDeleteDialog = () => setisDeleteDialogVisible(true);
  const hideDeleteDialog = () => setisDeleteDialogVisible(false);

  return (
    <>
      <View style={{ paddingBottom: bottom }}>
        <View className="flex-row items-center justify-evenly h-[64]">
          <IconButton
            icon="share"
            onPress={() => Sharing.shareAsync(asset.uri)}
          />
          <IconButton icon="trash-bin" onPress={showDeleteDialog} />
          <IconButton icon="information" onPress={showInfo} />
        </View>
      </View>
      <AssetInfo
        assetId={asset.id}
        visible={isInfoVisible}
        onDismiss={hideInfo}
      />
      <DeleteAssetDialog
        asset={asset}
        visible={isDeleteDialogVisible}
        onDismiss={hideDeleteDialog}
        onDelete={handleDelete}
      />
    </>
  );
}
