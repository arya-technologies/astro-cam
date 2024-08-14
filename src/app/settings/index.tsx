import ScrollView from "@/components/ScrollView";
import {
  themes,
  setappearance,
  ThemeProps,
  ImageTypes,
  VideoTypes,
  VideoCodecs,
  CameraModes,
  VideoBitRates,
  setcamera,
  setcameraDevice,
} from "@/features/slices/settingsSlice";
import { RootState } from "@/features/store";
import React, { useEffect, useState } from "react";
import { Button, Icon, List, Menu } from "react-native-paper";
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
  const formats = useCameraFormat(camera.device, [{ photoAspectRatio: 1 / 1 }]);

  const [device, setdevice] = useState<CameraDevice>(camera.device);
  const [isDeviceMenuVisible, setisDeviceMenuVisible] = useState(false);
  const showDeviceMenu = () => setisDeviceMenuVisible(true);
  const hideDeviceMenu = () => setisDeviceMenuVisible(false);

  const [format, setformat] = useState<CameraDeviceFormat>(camera.format);
  const [isFormatMenuVisible, setisFormatMenuVisible] = useState(false);
  const showFormatMenu = () => setisFormatMenuVisible(true);
  const hideFormatMenu = () => setisFormatMenuVisible(false);

  const [imageType, setimageType] = useState<ImageTypes>(image.imageType);
  const [isImageTypesMenuVisible, setisImageTypesMenuVisible] = useState(false);
  const showImageTypesMenu = () => setisImageTypesMenuVisible(true);
  const hideImageTypesMenu = () => setisImageTypesMenuVisible(false);

  const [antiFlicker, setantiFlicker] = useState<boolean>(video.antiFlicker);

  const [videoType, setvideoType] = useState<VideoTypes>(video.videoType);
  const [isVideoTypesMenuVisible, setisVideoTypesMenuVisible] = useState(false);
  const showVideoTypesMenu = () => setisVideoTypesMenuVisible(true);
  const hideVideoTypesMenu = () => setisVideoTypesMenuVisible(false);

  const [videoCodec, setvideoCodec] = useState<VideoCodecs>(video.videoCodec);
  const [isVideoCodecMenuVisible, setisVideoCodecMenuVisible] = useState(false);
  const showVideoCodecMenu = () => setisVideoCodecMenuVisible(true);
  const hideVideoaCodecMenu = () => setisVideoCodecMenuVisible(false);

  const [videoBitRate, setvideoBitRate] = useState<VideoBitRates>(
    video.videoBitRate,
  );
  const [isVideoBitRateMenuVisible, setisVideoBitRateMenuVisible] =
    useState(false);
  const showVideoBitRateMenu = () => setisVideoBitRateMenuVisible(true);
  const hideVideoaBitRateMenu = () => setisVideoBitRateMenuVisible(false);

  const [theme, settheme] = useState<ThemeProps>(appearance?.theme);
  const [isThemeMenuVisible, setisThemeMenuVisible] = useState(false);
  const showThemeMenu = () => setisThemeMenuVisible(true);
  const hideThemeMenu = () => setisThemeMenuVisible(false);

  useEffect(() => {
    dispatch(
      setappearance({
        theme,
      }),
    );
  }, [theme]);

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
          <List.Item title="Theme" />
        </List.Section>
        <List.Section>
          <List.Subheader>Video Settings</List.Subheader>
          <List.Item title="Theme" />
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
