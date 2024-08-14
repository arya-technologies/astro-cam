// import { VideoPlayer, VideoView } from "expo-video";
import { useRef } from "react";
import { View } from "react-native";

type VideoPreviewProps = {
  // player: VideoPlayer;
};

export default function VideoPreview({}: VideoPreviewProps) {
  const playerRef = useRef(null);

  // const handlePlay = async () => {
  //   if (!isplaying) {
  //     player.replay();
  //   } else {
  //     player.pause();
  //   }
  // };

  return <View></View>;
}
// return (
//   <VideoView
//     ref={playerRef}
//     player={player}
//     nativeControls={false}
//     allowsFullscreen
//     contentFit="contain"
//     className="w-full h-full absolute -z-10 pointer-events-none"
//   />
// );
