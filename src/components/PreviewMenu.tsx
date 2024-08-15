import * as MediaLibrary from "expo-media-library";
import * as Sharing from "expo-sharing";
import { useState } from "react";
import { View } from "react-native";
import { IconButton, Surface, Text } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import DeleteAssetDialog from "./dialogs/DeleteAssetDialog";
import RenameAssetDialog from "./dialogs/RenameAssetDialog";
import { useAppTheme } from "./providers/Material3ThemeProvider";

type PreviewMenuProps = {
  asset: MediaLibrary.Asset;
};

export default function PreviewMenu({ asset }: PreviewMenuProps) {
  const { colors } = useAppTheme();
  const { bottom } = useSafeAreaInsets();

  const [isDeleteDialogVisible, setisDeleteDialogVisible] =
    useState<boolean>(false);
  const showDeleteDialog = () => setisDeleteDialogVisible(true);
  const hideDeleteDialog = () => setisDeleteDialogVisible(false);

  const [isRenameDialogVisible, setisRenameDialogVisible] =
    useState<boolean>(false);
  const showRenameDialog = () => setisRenameDialogVisible(true);
  const hideRenameDialog = () => setisRenameDialogVisible(false);

  return (
    <>
      <Surface style={{ paddingBottom: bottom }} elevation={2}>
        <View className="flex-row items-center justify-between h-[64] px-4">
          <IconButton
            icon="share"
            onPress={() => Sharing.shareAsync(asset.uri)}
          />
          <Text variant="titleMedium" onPress={showRenameDialog}>
            {asset.filename}
          </Text>
          <IconButton
            iconColor={colors.error}
            icon="trash-bin"
            onPress={showDeleteDialog}
          />
        </View>
      </Surface>
      <>
        <RenameAssetDialog
          assetId={asset.id}
          assetName={asset.filename}
          visible={isRenameDialogVisible}
          onDismiss={hideRenameDialog}
        />
        <DeleteAssetDialog
          assetId={asset.id}
          assetName={asset.filename}
          visible={isDeleteDialogVisible}
          onDismiss={hideDeleteDialog}
        />
      </>
    </>
  );
}
