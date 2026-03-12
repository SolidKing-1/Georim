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
  style?: any;
};

export default function PrimaryButton({
  title,
  onPress,
  borderRadius = 25,
  disabled = false,
  style,
}: Props) {
  return (
    <GlassButton
      style={[styles.wrapper, style]}
      borderRadius={borderRadius}
      useGradient={true}
    >
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled}
        activeOpacity={0.8}
      >
        <View style={[styles.button, { borderRadius }]}>
          <Image
            source={GradientEffect}
            style={styles.gradientOverlay}
            pointerEvents="none"
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
  },
  button: {
    padding: 16,
    borderRadius: 25,
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
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: undefined,
    height: undefined,
    alignSelf: "stretch",
    resizeMode: "cover",
    zIndex: 1,
    opacity: 1,
    borderRadius: 25,
  },
});
