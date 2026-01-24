import React from "react";
import { View, Image, StyleSheet, ImageSourcePropType } from "react-native";
import GlassOverlay from "./GlassEffects/profileStackGlass.png";

type Props = {
  source: ImageSourcePropType;
  size?: number;
};

export default function GlassProfileAvatar({ source, size = 28 }: Props) {
  const avatarSize = Math.max(size - 4, 1);
  const radius = size / 2;
  const avatarRadius = avatarSize / 2;

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Image source={GlassOverlay} style={[styles.overlay, { borderRadius: radius }]} />
      <Image
        source={source}
        style={[
          styles.avatar,
          {
            width: avatarSize,
            height: avatarSize,
            borderRadius: avatarRadius,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    resizeMode: "contain",
  },
  avatar: {
    zIndex: 1,
  },
});
