import { useAppTheme } from "@/components/providers/Material3ThemeProvider";
import NativeSlider from "@react-native-community/slider";
import React from "react";

type SliderProps = {
  minValue: number;
  maxValue: number;
  step: number;
  value: number;
  onValueChange: (value: number) => void;
};

export default function Slider({
  minValue,
  maxValue,
  step,
  value,
  onValueChange,
}: SliderProps) {
  const { colors } = useAppTheme();
  return (
    <NativeSlider
      minimumValue={minValue}
      maximumValue={maxValue}
      minimumTrackTintColor={colors.outline}
      maximumTrackTintColor={colors.onSurfaceVariant}
      thumbTintColor={colors.primary}
      step={step}
      value={value}
      onValueChange={onValueChange}
    />
  );
}
