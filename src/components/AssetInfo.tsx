import React from "react";
import { useEffect, useState } from "react";
import { Button, Dialog, List, Portal, Text } from "react-native-paper";
import CopyToClipButton from "./CopyToClipButton";
import * as MediaLibrary from "expo-media-library";

type AssetInfoProps = {
  assetId: string;
  visible: boolean;
  onDismiss: () => void;
};

export default function AssetInfo({
  assetId,
  visible,
  onDismiss,
}: AssetInfoProps) {
  const [assetInfo, setassetInfo] = useState<MediaLibrary.AssetInfo>();

  useEffect(() => {
    (async function () {
      const result = await MediaLibrary.getAssetInfoAsync(assetId);
      setassetInfo(result);
    })();
  }, [assetId]);

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onDismiss}>
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
          <Button onPress={onDismiss}>Cancel</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}
