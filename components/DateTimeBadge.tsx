import React from "react";
import { View, Text, StyleSheet, TextStyle, StyleProp } from "react-native";
import { Image } from "expo-image";
import CircleGlassEffect from "./GlassEffects/circleGlassEffect.png";

interface DateTimeBadgeProps {
  topLabel: string;
  bottomValue: string;
  size?: "small" | "large";
  topLabelStyle?: StyleProp<TextStyle>;
  bottomValueStyle?: StyleProp<TextStyle>;
}

export default function DateTimeBadge({
  topLabel,
  bottomValue,
  size = "small",
  topLabelStyle: topLabelStyleOverride,
  bottomValueStyle: bottomValueStyleOverride,
}: DateTimeBadgeProps) {
  const isLarge = size === "large";
  const containerStyle = isLarge ? styles.containerLarge : styles.container;
  const topStripStyle = isLarge ? styles.topStripLarge : styles.topStrip;
  const topLabelStyle = isLarge ? styles.topLabelLarge : styles.topLabel;
  const bottomValueStyle = isLarge ? styles.bottomValueLarge : styles.bottomValue;

  return (
    <View style={containerStyle}>
      <Image
        source={CircleGlassEffect}
        style={styles.overlay}
        contentFit="fill"
      />
      <View style={topStripStyle}>
        <Text style={[topLabelStyle, topLabelStyleOverride]}>{topLabel}</Text>
      </View>
      <Text style={[bottomValueStyle, bottomValueStyleOverride]}>
        {bottomValue}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(10, 6, 48, 0.4)",
    borderRadius: 16,
    paddingHorizontal: 8,
    paddingTop: 18,
    paddingBottom: 3,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 40,
    overflow: "hidden",
  },
  containerLarge: {
    width: 52,
    height: 52,
    backgroundColor: "rgba(10, 6, 48, 0.4)",
    borderRadius: 18,
    paddingHorizontal: 8,
    paddingTop: 20,
    paddingBottom: 4,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  overlay: {
    position: "absolute",
    top: -2,
    left: -6,
    right: -6,
    bottom: -2,
    width: undefined,
    height: undefined,
    opacity: 0.7,
    zIndex: 0,
  },
  topStrip: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 16,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    backgroundColor: "#FFFFFF33",
    zIndex: 1,
  },
  topStripLarge: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    backgroundColor: "#FFFFFF33",
    zIndex: 1,
  },
  topLabel: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "400",
    textTransform: "capitalize",
  },
  topLabelLarge: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "800",
  },
  bottomValue: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "400",
    marginTop: -3,
    marginBottom: -1,
    zIndex: 1,
  },
  bottomValueLarge: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "900",
    marginTop: -2,
    marginBottom: -1,
    zIndex: 1,
  },
});
