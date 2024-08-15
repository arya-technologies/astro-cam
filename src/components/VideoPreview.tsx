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
  // const [isfullscreen, setisfullscreen] = useState<boolean>(false);

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
      className="w-full h-full absolute -z-10 pointer-events-none"
    >
      <IconButton icon={isplaying ? "stop" : "play"} />
    </Video>
  );
}
