import {
  setvideo,
  VideoBitRates,
  VideoCodecs,
  VideoTypes,
} from "@/features/slices/settingsSlice";
import { RootState } from "@/features/store";
import React, { useEffect, useState } from "react";
import { Button, List, Menu, Switch } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";

export default function VideoSettings() {
  const dispatch = useDispatch();
  const { video } = useSelector((state: RootState) => state.settings);

  const videoTypes: VideoTypes[] = ["mov", "mp4"];
  const [videoType, setvideoType] = useState<VideoTypes>(video.videoType);
  const [isVideoTypesMenuVisible, setisVideoTypesMenuVisible] = useState(false);
  const showVideoTypesMenu = () => setisVideoTypesMenuVisible(true);
  const hideVideoTypesMenu = () => setisVideoTypesMenuVisible(false);

  const videoCodecs: VideoCodecs[] = ["h265", "h264"];
  const [videoCodec, setvideoCodec] = useState<VideoCodecs>(video.videoCodec);
  const [isVideoCodecMenuVisible, setisVideoCodecMenuVisible] = useState(false);
  const showVideoCodecMenu = () => setisVideoCodecMenuVisible(true);
  const hideVideoaCodecMenu = () => setisVideoCodecMenuVisible(false);

  const videoBitRates: VideoBitRates[] = [
    "extra-low",
    "low",
    "normal",
    "high",
    "extra-high",
  ];
  const [videoBitRate, setvideoBitRate] = useState<VideoBitRates>(
    video.videoBitRate,
  );
  const [isVideoBitRateMenuVisible, setisVideoBitRateMenuVisible] =
    useState(false);
  const showVideoBitRateMenu = () => setisVideoBitRateMenuVisible(true);
  const hideVideoaBitRateMenu = () => setisVideoBitRateMenuVisible(false);

  const [antiFlicker, setantiFlicker] = useState<boolean>(video.antiFlicker);
  useEffect(() => {
    dispatch(setvideo({ videoType, videoCodec, videoBitRate, antiFlicker }));
  }, [videoType, videoCodec, videoBitRate, antiFlicker]);
  return (
    <List.Section>
      <List.Subheader>Video Settings</List.Subheader>
      <List.Item
        title="Video Type"
        right={() => (
          <Menu
            visible={isVideoTypesMenuVisible}
            onDismiss={hideVideoTypesMenu}
            anchor={
              <Button
                onPress={showVideoTypesMenu}
                icon="chevron-expand"
                mode="elevated"
              >
                {videoType}
              </Button>
            }
          >
            {videoTypes.map((item, index) => (
              <Menu.Item
                key={index}
                title={item}
                onPress={() => {
                  setvideoType(item);
                  hideVideoTypesMenu;
                }}
              />
            ))}
          </Menu>
        )}
      />
      <List.Item
        title="Video Codec"
        right={() => (
          <Menu
            visible={isVideoCodecMenuVisible}
            onDismiss={hideVideoaCodecMenu}
            anchor={
              <Button
                onPress={showVideoCodecMenu}
                icon="chevron-expand"
                mode="elevated"
              >
                {videoCodec}
              </Button>
            }
          >
            {videoCodecs.map((item, index) => (
              <Menu.Item
                key={index}
                title={item}
                onPress={() => {
                  setvideoCodec(item);
                  hideVideoaCodecMenu;
                }}
              />
            ))}
          </Menu>
        )}
      />
      <List.Item
        title="Video BitRate"
        right={() => (
          <Menu
            visible={isVideoBitRateMenuVisible}
            onDismiss={hideVideoaBitRateMenu}
            anchor={
              <Button
                onPress={showVideoBitRateMenu}
                icon="chevron-expand"
                mode="elevated"
              >
                {videoBitRate}
              </Button>
            }
          >
            {videoBitRates.map((item, index) => (
              <Menu.Item
                key={index}
                title={item}
                onPress={() => {
                  setvideoBitRate(item);
                  hideVideoaBitRateMenu;
                }}
              />
            ))}
          </Menu>
        )}
      />
      <List.Item
        title="Anti Flicker"
        right={() => (
          <Switch value={antiFlicker} onValueChange={setantiFlicker} />
        )}
      />
    </List.Section>
  );
}
