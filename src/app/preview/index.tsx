import React, { useEffect, useState } from "react";
import { View } from "react-native";
import * as MediaLibrary from "expo-media-library";
import { Text } from "react-native-paper";

export default function index() {
  const [assets, setassets] = useState<MediaLibrary.Asset[]>([]);

  useEffect(() => {
    (async function () {
      const album = await MediaLibrary.getAlbumAsync("AstroCam");
      const albumAssets = await MediaLibrary.getAssetsAsync({ album });
      if (albumAssets) {
        setassets(albumAssets.assets);
      }
    })();
  }, []);

  return (
    <View>
      {assets && assets.map((asset) => <Text>{asset.filename}</Text>)}
    </View>
  );
}
