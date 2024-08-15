import { useRef, useState } from "react";
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
  const [isplaying, setisPlaying] = useState<boolean>(true);

  return (
    <Video
      ref={videoRef}
      muted
      paused
      source={{ uri: videoUri }}
      renderLoader={<ActivityIndicator />}
      useSecureView
      className="w-full h-full bg-red-300"
    >
      <IconButton icon={isplaying ? "stop" : "play"} />
    </Video>
  );
}
