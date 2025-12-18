import React from "react";
import { View, StyleSheet, Platform, ViewStyle } from "react-native";
import { BlurView } from "expo-blur";

interface GlassButtonProps {
  children: React.ReactNode;
  style?: ViewStyle;
  borderRadius?: number;
  isCircular?: boolean;
}

export default function GlassButton({
  children,
  style,
  borderRadius = 25,
  isCircular = false,
}: GlassButtonProps) {
  if (Platform.OS === "ios") {
    // iOS: Use native blur effect
    return (
      <BlurView
        intensity={110}
        tint="light"
        style={[
          styles.iosBlurContainer,
          {
            borderRadius: borderRadius,
            overflow: "hidden",
          },
          style,
        ]}
      >
        {children}
      </BlurView>
    );
  }

  // Android: Custom glass effect without extra glints
  return (
    <View
      style={[
        styles.androidGlassContainer,
        {
          borderRadius: borderRadius,
        },
        style,
      ]}
    >
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  iosBlurContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
    shadowColor: "#6E23BA",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
  },
  androidGlassContainer: {
    position: "relative",
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.12)",
    overflow: "hidden",
  },
  content: {
    position: "relative",
    zIndex: 1,
  },
});
