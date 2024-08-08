import * as Clipboard from "expo-clipboard";
import React from "react";
import { Platform } from "react-native";
import { IconButton } from "react-native-paper";

type CopyToClipButtonProps = {
  string?: string;
  image?: string;
  url?: string;
};

export default function CopyToClipButton({
  string,
  image,
  url,
}: CopyToClipButtonProps) {
  const handleCopy = () => {
    if (string) {
      Clipboard.setStringAsync(string);
    } else if (url) {
      if (Platform.OS === "ios") {
        Clipboard.setUrlAsync(url);
      } else {
        Clipboard.setStringAsync(url);
      }
    } else if (image) {
      Clipboard.setImageAsync(image);
    }
  };

  return <IconButton icon="copy" className="m-0" onPress={handleCopy} />;
}
