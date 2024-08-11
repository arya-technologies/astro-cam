import { useEffect, useRef, useState } from "react";
import { View } from "react-native";
import {
  useVideoPlayer,
  VideoPlayer,
  VideoView,
  VideoViewProps,
} from "expo-video";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { IconButton } from "react-native-paper";

type VideoPreviewProps = {
  videoUri: string;
};

export default function VideoPreview({ videoUri }: VideoPreviewProps) {
  const { bottom } = useSafeAreaInsets();

  const [isfullscreen, setisfullscreen] = useState<boolean>(false);

  const playerRef = useRef(null);
  const [isplaying, setisPlaying] = useState<boolean>(false);

  const player = useVideoPlayer(videoUri, (player) => {
    player.loop = true;
  });

  const handleFullscreen = () => {
    if (!isfullscreen) {
    } else {
    }
    setisfullscreen(!isfullscreen);
  };

  useEffect(() => {
    const subscription = player.addListener("playingChange", (isplaying) => {
      setisPlaying(isplaying);
    });

    return () => {
      subscription.remove();
    };
  }, [player]);

  const handlePlay = async () => {
    if (!isplaying) {
      player.play();
    } else {
      player.pause();
    }
  };

  return (
    <>
      <VideoView
        ref={playerRef}
        player={player}
        nativeControls={false}
        allowsFullscreen
        contentFit="contain"
        className="w-full h-full absolute -z-10 pointer-events-none"
      />
      <View className="z-0 items-center justify-center absolute top-0 left-0 w-full h-full">
        <IconButton
          icon={isplaying ? "stop" : "play"}
          onPress={handlePlay}
          size={48}
        />
      </View>
      <View
        className="absolute  w-full bottom-0 left-0"
        style={{ paddingBottom: bottom }}
      >
        <View className="h-20 bg-red-300"></View>
      </View>
    </>
  );
}
