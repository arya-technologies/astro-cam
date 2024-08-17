import { ImageTypes, setimage } from "@/features/slices/settingsSlice";
import { RootState } from "@/features/store";
import React, { useEffect, useState } from "react";
import { Button, List, Menu } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";

export default function ImageSettings() {
  const dispatch = useDispatch();
  const { image } = useSelector((state: RootState) => state.settings);

  const imageTypes: ImageTypes[] = ["raw", "png", "jpg"];
  const [imageType, setimageType] = useState<ImageTypes>(image.imageType);
  const [isImageTypesMenuVisible, setisImageTypesMenuVisible] = useState(false);
  const showImageTypesMenu = () => setisImageTypesMenuVisible(true);
  const hideImageTypesMenu = () => setisImageTypesMenuVisible(false);

  useEffect(() => {
    dispatch(setimage({ imageType }));
  }, [imageType]);
  return (
    <List.Section>
      <List.Subheader>Image Settings</List.Subheader>
      <List.Item
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
  );
}
