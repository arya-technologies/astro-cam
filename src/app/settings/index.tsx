import ScrollView from "@/components/ScrollView";
import {
  ImageTypes,
  setappearance,
  setcameraDevice,
  setcameraFormat,
  setimage,
  setvideo,
  ThemeProps,
  themes,
  VideoBitRates,
  VideoCodecs,
  VideoTypes,
} from "@/features/slices/settingsSlice";
import { RootState } from "@/features/store";
import React, { useEffect, useState } from "react";
import { Button, Icon, List, Menu, Switch } from "react-native-paper";
import {
  CameraDevice,
  CameraDeviceFormat,
  useCameraDevices,
  useCameraFormat,
} from "react-native-vision-camera";
import { useDispatch, useSelector } from "react-redux";

export default function Appearance() {
  const dispatch = useDispatch();
  const { appearance, camera, image, video } = useSelector(
    (state: RootState) => state.settings,
  );

  const devices = useCameraDevices();
  const [device, setdevice] = useState<CameraDevice>(camera.device);
  const [isDeviceMenuVisible, setisDeviceMenuVisible] = useState(false);
  const showDeviceMenu = () => setisDeviceMenuVisible(true);
  const hideDeviceMenu = () => setisDeviceMenuVisible(false);

  const formats = useCameraFormat(camera.device, [{ photoAspectRatio: 1 / 1 }]);
  const [format, setformat] = useState<CameraDeviceFormat>(camera.format);
  const [isFormatMenuVisible, setisFormatMenuVisible] = useState(false);
  const showFormatMenu = () => setisFormatMenuVisible(true);
  const hideFormatMenu = () => setisFormatMenuVisible(false);

  const imageTypes: ImageTypes[] = ["raw", "png", "jpg"];
  const [imageType, setimageType] = useState<ImageTypes>(image.imageType);
  const [isImageTypesMenuVisible, setisImageTypesMenuVisible] = useState(false);
  const showImageTypesMenu = () => setisImageTypesMenuVisible(true);
  const hideImageTypesMenu = () => setisImageTypesMenuVisible(false);

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

  const [theme, settheme] = useState<ThemeProps>(appearance.theme);
  const [isThemeMenuVisible, setisThemeMenuVisible] = useState(false);
  const showThemeMenu = () => setisThemeMenuVisible(true);
  const hideThemeMenu = () => setisThemeMenuVisible(false);

  useEffect(() => {
    dispatch(setappearance({ theme }));
  }, [theme]);
  useEffect(() => {
    dispatch(setcameraDevice(device));
  }, [device]);
  useEffect(() => {
    dispatch(setcameraFormat(format));
  }, [format]);
  useEffect(() => {
    dispatch(setimage({ imageType }));
  }, [imageType]);
  useEffect(() => {
    dispatch(setvideo({ videoType, videoCodec, videoBitRate, antiFlicker }));
  }, [videoType, videoCodec, videoBitRate, antiFlicker]);

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
                    {device.name}
                  </Button>
                }
              >
                {devices.map((item, index) => (
                  <Menu.Item
                    key={index}
                    title={item.name}
                    onPress={() => {
                      setcameraDevice(item);
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
                    {imageType}
                  </Button>
                }
              >
                {imageTypes.map((item, index) => (
                  <Menu.Item
                    key={index}
                    title={item}
                    onPress={() => {
                      setimageType(item);
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
            left={() => <Icon source="camera" size={24} />}
            title="Anti Flicker"
            right={() => (
              <Switch value={antiFlicker} onValueChange={setantiFlicker} />
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
                    {theme.label}
                  </Button>
                }
              >
                {themes.map((item, index) => (
                  <Menu.Item
                    key={index}
                    title={item.label}
                    onPress={() => {
                      settheme(item);
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
