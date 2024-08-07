import { useEffect, useRef, useState } from "react";
import { View } from "react-native";
import { useVideoPlayer, VideoView } from "expo-video";

export default function VideoPreview({ videoUri }) {
  const [isfullscreen, setisfullscreen] = useState<boolean>(false);

  const ref = useRef(null);
  const [isplaying, setisPlaying] = useState<boolean>(true);

  const player = useVideoPlayer(videoUri, (player) => {
    player.loop = true;
    player.play();
  });

  const handleFullscreen = () => {
    if (!isfullscreen) {
      setisfullscreen(true);
    } else {
      setisfullscreen(false);
    }
  };

  useEffect(() => {
    const subscription = player.addListener("playingChange", (isplaying) => {
      setisPlaying(isplaying);
    });

    return () => {
      subscription.remove();
    };
  }, [player]);

  return (
    <VideoView
      ref={ref}
      player={player}
      allowsFullscreen
      contentFit="contain"
      className="w-full h-full"
    />
  );
}
