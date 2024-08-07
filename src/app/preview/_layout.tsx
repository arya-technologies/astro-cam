import { router, Slot } from "expo-router";
import React from "react";
import { Appbar } from "react-native-paper";

export default function SettingsLayout() {
  return (
    <>
      <Appbar.Header mode="small">
        <Appbar.BackAction
          onPress={() => {
            router.back();
          }}
        />
        <Appbar.Content title="Preview" />
        <Appbar.Action icon="ellipsis-vertical" />
      </Appbar.Header>
      <Slot />
    </>
  );
}
