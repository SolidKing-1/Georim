import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Animated, Easing } from "react-native";

const PURPLE_GRADIENT = [
  "#421570",
  "#F4EAFE",
  "#EFE0FE",
  "#DEBFFD",
  "#B574EC",
  "#903BE7",
  "#7626C6",
  "#6E23BA",
  "#6E23BA",
];

type Props = {
  size?: number;
  barWidth?: number;
  barHeight?: number;
  /** Spin duration in ms. Higher = slower. Default 1000. */
  duration?: number;
};

export default function PurpleGradientSpinner({
  size = 48,
  barWidth,
  barHeight,
  duration = 1000,
}: Props) {
  const spinValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );
    animation.start();
    return () => animation.stop();
  }, [spinValue, duration]);

  const rotate = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const barCount = 9;
  const angleStep = 360 / barCount;
  const resolvedBarWidth = barWidth ?? Math.max(2, size / 8);
  const innerRadius = size * 0.2;
  const outerRadius = size / 2 - 2;
  const resolvedBarHeight = barHeight ?? Math.max(4, outerRadius - innerRadius);
  const midRadius = innerRadius + resolvedBarHeight / 2;
  const cx = size / 2;
  const cy = size / 2;

  return (
    <Animated.View
      style={[
        styles.container,
        { width: size, height: size, transform: [{ rotate }] },
      ]}
    >
      {PURPLE_GRADIENT.map((color, i) => {
        const theta = (i * angleStep * Math.PI) / 180;
        const x = cx + midRadius * Math.sin(theta) - resolvedBarWidth / 2;
        const y = cy - midRadius * Math.cos(theta) - resolvedBarHeight / 2;
        return (
          <View
            key={i}
            style={[
              styles.bar,
              {
                width: resolvedBarWidth,
                height: resolvedBarHeight,
                backgroundColor: color,
                left: x,
                top: y,
                transform: [{ rotate: `${i * angleStep}deg` }],
              },
            ]}
          />
        );
      })}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  bar: {
    position: "absolute",
    borderRadius: 3,
  },
});
