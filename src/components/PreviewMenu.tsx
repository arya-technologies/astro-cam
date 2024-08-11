import * as MediaLibrary from "expo-media-library";
import * as Sharing from "expo-sharing";
import { useState } from "react";
import { View } from "react-native";
import { IconButton } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AssetInfo from "./AssetInfo";

type PreviewMenuProps = {
  asset: MediaLibrary.Asset;
  visible: boolean;
};

export default function PreviewMenu({ asset, visible }: PreviewMenuProps) {
  const { top, bottom } = useSafeAreaInsets();
  const [isInfoVisible, setisInfoVisible] = useState<boolean>(false);

  const showInfo = () => setisInfoVisible(true);
  const hideInfo = () => setisInfoVisible(false);

  return (
    <>
      <View
        className="absolute bottom-0 left-0 w-full"
        style={{ paddingBottom: bottom, opacity: visible ? 0 : 1 }}
      >
        <View className="flex-row items-center justify-evenly py-4">
          <IconButton
            icon="share"
            onPress={() => Sharing.shareAsync(asset.uri)}
          />
          <IconButton icon="information" onPress={showInfo} />
        </View>
      </View>
      <AssetInfo
        assetId={asset.id}
        visible={isInfoVisible}
        onDismiss={hideInfo}
      />
    </>
  );
}
