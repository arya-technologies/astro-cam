import ScrollView from "@/components/ScrollView";
import { setsettings, ThemeProps } from "@/features/slices/settingsSlice";
import { RootState } from "@/features/store";
import React, { useEffect, useState } from "react";
import { Button, Dialog, List, Portal, RadioButton } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";

export default function Appearance() {
  const dispatch = useDispatch();
  const { appearance } = useSelector((state: RootState) => state.settings);

  const [theme, settheme] = useState<ThemeProps>(appearance.theme);
  const [themes, setthemes] = useState<ThemeProps[]>([
    "dark",
    "light",
    "system",
    "pureBlack",
  ]);
  const [isThemeDialogVisible, setisThemeDialogVisible] = useState(false);
  const showThemeDialog = () => setisThemeDialogVisible(true);
  const hideThemeDialog = () => setisThemeDialogVisible(false);

  useEffect(() => {
    dispatch(
      setsettings({
        appearance: {
          theme,
        },
      }),
    );
  }, [theme]);

  return (
    <>
      <ScrollView>
        <List.Section>
          <List.Subheader>Appearance</List.Subheader>
          <List.Item
            title="Theme"
            description={theme.slice(0, 1).toUpperCase() + theme.slice(1)}
            onPress={showThemeDialog}
          />
        </List.Section>
      </ScrollView>
      <Portal>
        <Dialog visible={isThemeDialogVisible} onDismiss={hideThemeDialog}>
          <Dialog.Title>Theme</Dialog.Title>
          <Dialog.Content>
            <RadioButton.Group
              value={theme}
              onValueChange={(value) => settheme(value)}
            >
              {themes.map((item) => (
                <RadioButton.Item
                  key={item}
                  label={item.slice(0, 1).toUpperCase() + item.slice(1)}
                  value={item}
                />
              ))}
            </RadioButton.Group>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideThemeDialog}>Cancel</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  );
}
