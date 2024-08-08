import { View, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as MediaLibrary from "expo-media-library";
import * as Sharing from "expo-sharing";
import {
  Button,
  Dialog,
  Icon,
  IconButton,
  List,
  Portal,
  Text,
} from "react-native-paper";
import CopyToClipButton from "./CopyToClipButton";

type PreviewMenuProps = {
  asset: MediaLibrary.Asset;
};

export default function PreviewMenu({ asset }: PreviewMenuProps) {
  const { top, bottom } = useSafeAreaInsets();
  const [assetInfo, setassetInfo] = useState<MediaLibrary.AssetInfo>();
  const [isInfoVisible, setisInfoVisible] = useState<boolean>(false);

  const showInfo = () => setisInfoVisible(true);
  const hideInfo = () => setisInfoVisible(false);

  useEffect(() => {
    (async function () {
      const result = await MediaLibrary.getAssetInfoAsync(asset);
      setassetInfo(result);
    })();
  }, [asset]);

  return (
    <>
      <View
        className="absolute bottom-0 left-0 w-full"
        style={{ paddingBottom: bottom }}
      >
        <View className="flex-row items-center justify-evenly py-4">
          <IconButton
            icon="share"
            onPress={() => Sharing.shareAsync(asset.uri)}
          />
          <IconButton icon="information" onPress={showInfo} />
        </View>
      </View>
      <Portal>
        <Dialog visible={isInfoVisible} onDismiss={hideInfo}>
          <Dialog.Title>Info</Dialog.Title>
          <Dialog.Content>
            <List.Item
              title="Name"
              description={assetInfo?.filename}
              right={() => <CopyToClipButton url={assetInfo?.filename} />}
            />
            <List.Item
              title="Time"
              right={() => <Text>{assetInfo?.creationTime}</Text>}
            />
            <List.Item
              title="Width"
              right={() => <Text>{assetInfo?.width}</Text>}
            />
            <List.Item
              title="Height"
              right={() => <Text>{assetInfo?.height}</Text>}
            />
            {assetInfo?.mediaType === "video" ? (
              <>
                <List.Item
                  title="Duration"
                  right={() => <Text>{assetInfo?.duration}s</Text>}
                />
              </>
            ) : (
              <></>
            )}
            <List.Item
              title="Path"
              description={assetInfo?.localUri}
              right={() => <CopyToClipButton url={assetInfo?.localUri} />}
            />
            {assetInfo?.location && (
              <List.Section>
                <List.Subheader>Location</List.Subheader>
                <List.Item
                  title="Latitude"
                  description={assetInfo?.location?.latitude}
                  right={() => (
                    <CopyToClipButton
                      string={assetInfo?.location?.latitude.toString()}
                    />
                  )}
                />
                <List.Item
                  title="Longitude"
                  description={assetInfo?.location?.longitude}
                  right={() => (
                    <CopyToClipButton
                      string={assetInfo?.location?.longitude.toString()}
                    />
                  )}
                />
              </List.Section>
            )}
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideInfo}>Cancel</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  );
}
