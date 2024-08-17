import ScrollView from "@/components/ScrollView";
import AppearanceSettings from "@/components/settings/AppearanceSettings";
import CameraSettings from "@/components/settings/CameraSettings";
import ImageSettings from "@/components/settings/ImageSettings";
import VideoSettings from "@/components/settings/VideoSettings";
import React from "react";

export default function Appearance() {
  return (
    <ScrollView>
      <CameraSettings />
      <ImageSettings />
      <VideoSettings />
      <AppearanceSettings />
    </ScrollView>
  );
}
