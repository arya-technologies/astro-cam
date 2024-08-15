import { useRef, useState } from "react";
import { View } from "react-native";
import { ActivityIndicator, IconButton } from "react-native-paper";
import Video, { VideoRef } from "react-native-video";

type VideoPreviewProps = {
  videoUri: string;
  isfullscreen: boolean;
  toggleFullscreen: () => void;
};

export default function VideoPreview({
  videoUri,
  isfullscreen,
  toggleFullscreen,
}: VideoPreviewProps) {
  const videoRef = useRef<VideoRef>(null);
  const [isplaying, setisPlaying] = useState<boolean>(false);
  const toggleIsPlaying = () => setisPlaying(!isplaying);

  const handlePlay = () => {
    if (!isplaying) {
      videoRef.current?.resume;
    } else {
      videoRef.current?.pause;
    }
    toggleIsPlaying();
  };

  return (
    <>
      <Video
        ref={videoRef}
        muted
        paused
        source={{ uri: videoUri }}
        renderLoader={<ActivityIndicator />}
        className="w-full h-full"
      />
      <View className="absolute w-full h-full items-center justify-center">
        <IconButton
          icon={isplaying ? "stop" : "play"}
          onPress={handlePlay}
          size={40}
        />
      </View>
    </>
  );
}
