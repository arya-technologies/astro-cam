import ScrollView from "@/components/ScrollView";
import {
  ImageTypes,
  setappearance,
  setcameraDevice,
  setimageType,
  setvideoType,
  setvideoCodec,
  setvideoBitRate,
  setvideoAntiFlicker,
  themes,
  VideoBitRates,
  VideoCodecs,
  VideoTypes,
} from "@/features/slices/settingsSlice";
import { RootState } from "@/features/store";
import React, { useState } from "react";
import { Button, Icon, List, Menu, Switch } from "react-native-paper";
import { useCameraDevices, useCameraFormat } from "react-native-vision-camera";
import { useDispatch, useSelector } from "react-redux";

export default function Appearance() {
  const dispatch = useDispatch();
  const { appearance, camera, image, video } = useSelector(
    (state: RootState) => state.settings,
  );

  const devices = useCameraDevices();
  const [isDeviceMenuVisible, setisDeviceMenuVisible] = useState(false);
  const showDeviceMenu = () => setisDeviceMenuVisible(true);
  const hideDeviceMenu = () => setisDeviceMenuVisible(false);

  const formats = useCameraFormat(camera.device, [{ photoAspectRatio: 1 / 1 }]);
  const [isFormatMenuVisible, setisFormatMenuVisible] = useState(false);
  const showFormatMenu = () => setisFormatMenuVisible(true);
  const hideFormatMenu = () => setisFormatMenuVisible(false);

  const imageTypes: ImageTypes[] = ["raw", "png", "jpg"];
  const [isImageTypesMenuVisible, setisImageTypesMenuVisible] = useState(false);
  const showImageTypesMenu = () => setisImageTypesMenuVisible(true);
  const hideImageTypesMenu = () => setisImageTypesMenuVisible(false);

  const videoTypes: VideoTypes[] = ["mov", "mp4"];
  const [isVideoTypesMenuVisible, setisVideoTypesMenuVisible] = useState(false);
  const showVideoTypesMenu = () => setisVideoTypesMenuVisible(true);
  const hideVideoTypesMenu = () => setisVideoTypesMenuVisible(false);

  const videoCodecs: VideoCodecs[] = ["h265", "h264"];
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
  const [isVideoBitRateMenuVisible, setisVideoBitRateMenuVisible] =
    useState(false);
  const showVideoBitRateMenu = () => setisVideoBitRateMenuVisible(true);
  const hideVideoaBitRateMenu = () => setisVideoBitRateMenuVisible(false);

  const toggleVideoAntiFlicker = () =>
    dispatch(setvideoAntiFlicker(!video.antiFlicker));

  const [isThemeMenuVisible, setisThemeMenuVisible] = useState(false);
  const showThemeMenu = () => setisThemeMenuVisible(true);
  const hideThemeMenu = () => setisThemeMenuVisible(false);

  return (
    <>
      <ScrollView>
        <List.Section>
          <List.Subheader>Camera Settings</List.Subheader>
          <List.Item
            left={() => <Icon source="camera" size={24} />}
            title="Device"
            right={() => (
              <Menu
                visible={isDeviceMenuVisible}
                onDismiss={hideDeviceMenu}
                anchor={
                  <Button
                    onPress={showDeviceMenu}
                    icon="chevron-expand"
                    mode="elevated"
                  >
                    {camera.device.name}
                  </Button>
                }
              >
                {devices.map((item, index) => (
                  <Menu.Item
                    key={index}
                    title={item.name}
                    onPress={() => {
                      dispatch(setcameraDevice(item));
                      hideDeviceMenu;
                    }}
                  />
                ))}
              </Menu>
            )}
          />
        </List.Section>
        <List.Section>
          <List.Subheader>Picture Settinsg</List.Subheader>
          <List.Item
            left={() => <Icon source="camera" size={24} />}
            title="Image Type"
            right={() => (
              <Menu
                visible={isImageTypesMenuVisible}
                onDismiss={hideImageTypesMenu}
                anchor={
                  <Button
                    onPress={showImageTypesMenu}
                    icon="chevron-expand"
                    mode="elevated"
                  >
                    {image.imageType}
                  </Button>
                }
              >
                {imageTypes.map((item, index) => (
                  <Menu.Item
                    key={index}
                    title={item}
                    onPress={() => {
                      dispatch(setimageType(item));
                      hideImageTypesMenu;
                    }}
                  />
                ))}
              </Menu>
            )}
          />
        </List.Section>
        <List.Section>
          <List.Subheader>Video Settings</List.Subheader>
          <List.Item
            left={() => <Icon source="camera" size={24} />}
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
                    {video.videoType}
                  </Button>
                }
              >
                {videoTypes.map((item, index) => (
                  <Menu.Item
                    key={index}
                    title={item}
                    onPress={() => {
                      dispatch(setvideoType(item));
                      hideVideoTypesMenu;
                    }}
                  />
                ))}
              </Menu>
            )}
          />
          <List.Item
            left={() => <Icon source="camera" size={24} />}
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
                    {video.videoCodec}
                  </Button>
                }
              >
                {videoCodecs.map((item, index) => (
                  <Menu.Item
                    key={index}
                    title={item}
                    onPress={() => {
                      dispatch(setvideoCodec(item));
                      hideVideoaCodecMenu;
                    }}
                  />
                ))}
              </Menu>
            )}
          />
          <List.Item
            left={() => <Icon source="camera" size={24} />}
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
                    {video.videoBitRate}
                  </Button>
                }
              >
                {videoBitRates.map((item, index) => (
                  <Menu.Item
                    key={index}
                    title={item}
                    onPress={() => {
                      dispatch(setvideoBitRate(item));
                      hideVideoaBitRateMenu;
                    }}
                  />
                ))}
              </Menu>
            )}
          />
          <List.Item
            left={() => <Icon source="camera" size={24} />}
            title="Anti Flicker"
            right={() => (
              <Switch
                value={video.antiFlicker}
                onValueChange={toggleVideoAntiFlicker}
              />
            )}
          />
        </List.Section>
        <List.Section>
          <List.Subheader>Appearance</List.Subheader>
          <List.Item
            left={() => <Icon source="color-wand" size={24} />}
            title="Theme"
            right={() => (
              <Menu
                visible={isThemeMenuVisible}
                onDismiss={hideThemeMenu}
                anchor={
                  <Button
                    onPress={showThemeMenu}
                    icon="chevron-expand"
                    mode="elevated"
                  >
                    {appearance.theme.label}
                  </Button>
                }
              >
                {themes.map((item, index) => (
                  <Menu.Item
                    key={index}
                    title={item.label}
                    onPress={() => {
                      dispatch(setappearance({ theme: item }));
                      hideThemeMenu;
                    }}
                  />
                ))}
              </Menu>
            )}
          />
        </List.Section>
      </ScrollView>
    </>
  );
}
