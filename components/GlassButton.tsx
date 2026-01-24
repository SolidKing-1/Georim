import React from "react";
import { View, StyleSheet, Platform, ViewStyle } from "react-native";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";

interface GlassButtonProps {
  children: React.ReactNode;
  style?: ViewStyle;
  borderRadius?: number;
  isCircular?: boolean;
  useGradient?: boolean;
}

export default function GlassButton({
  children,
  style,
  borderRadius = 25,
  isCircular = false,
  useGradient = false,
}: GlassButtonProps) {
  // If gradient is requested, use LinearGradient
  if (useGradient) {
    return (
      <LinearGradient
        colors={["rgba(110, 35, 186, 1)", "rgba(40, 38, 145, 1)"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[
          styles.gradientContainer,
          {
            borderRadius: borderRadius,
          },
          style,
        ]}
      >
        <View style={styles.content}>{children}</View>
      </LinearGradient>
    );
  }

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
  gradientContainer: {
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    overflow: "hidden",
  },
  content: {
    position: "relative",
    zIndex: 1,
  },
});
