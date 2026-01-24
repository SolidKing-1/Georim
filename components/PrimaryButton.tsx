import React from "react";
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  Image,
  GestureResponderEvent,
} from "react-native";
import GlassButton from "./GlassButton";
import GradientEffect from "./GlassEffects/gradientGlassEffect.png";

type Props = {
  title: string;
  onPress?: (e: GestureResponderEvent) => void;
  borderRadius?: number;
  disabled?: boolean;
};

const gradientSize = Image.resolveAssetSource(GradientEffect);

export default function PrimaryButton({
  title,
  onPress,
  borderRadius,
  disabled = false,
}: Props) {
  const resolvedBorderRadius =
    borderRadius ?? Math.round(gradientSize.height / 2);
  return (
    <GlassButton
      style={{
        ...styles.wrapper,
        width: gradientSize.width,
        height: gradientSize.height,
      }}
      borderRadius={resolvedBorderRadius}
      useGradient={true}
    >
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled}
        activeOpacity={0.8}
      >
        <View
          style={[
            styles.button,
            {
              borderRadius: resolvedBorderRadius,
              width: gradientSize.width,
              height: gradientSize.height,
            },
          ]}
        >
          <Image
            source={GradientEffect}
            style={[styles.gradientOverlay, { borderRadius: resolvedBorderRadius }]}
          />
          <Text style={styles.text}>{title}</Text>
        </View>
      </TouchableOpacity>
    </GlassButton>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderWidth: 0,
    borderColor: "transparent",
    alignSelf: "center",
  },
  button: {
    position: "relative",
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: "#FFFFFF",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
    fontFamily: "Hero",
    zIndex: 3,
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: "stretch",
    zIndex: 1,
    opacity: 1,
  },
});
