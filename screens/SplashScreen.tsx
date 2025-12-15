import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const { width, height } = Dimensions.get("window");

export default function SplashScreen() {
  const navigation = useNavigation<any>();

  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.85)).current;
  const translateY = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    // Sequence adapted from the user's timing list.
    // We'll run several chained animations mixing timings and springs,
    // then navigate to Onboarding.

    const seq = Animated.sequence([
      Animated.delay(100),
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 800,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1.06,
          duration: 800,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 800,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
      ]),

      Animated.delay(100),

      Animated.parallel([
        Animated.timing(scale, {
          toValue: 0.92,
          duration: 500,
          easing: Easing.in(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.95,
          duration: 500,
          easing: Easing.in(Easing.ease),
          useNativeDriver: true,
        }),
      ]),

      Animated.delay(100),

      // spring-like pop
      Animated.spring(scale, {
        toValue: 1,
        mass: 1,
        stiffness: 1536,
        damping: 24,
        useNativeDriver: true,
      }),

      Animated.delay(100),

      // small bounce
      Animated.spring(scale, {
        toValue: 0.98,
        mass: 1,
        stiffness: 1536,
        damping: 24,
        useNativeDriver: true,
      }),

      Animated.delay(100),

      Animated.parallel([
        Animated.timing(scale, {
          toValue: 1.12,
          duration: 500,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 500,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
      ]),

      Animated.delay(100),

      // instant state change (0ms)
      Animated.timing(opacity, {
        toValue: 1,
        duration: 0,
        useNativeDriver: true,
      }),

      Animated.delay(100),

      Animated.timing(scale, {
        toValue: 1.02,
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),

      Animated.delay(100),

      Animated.timing(translateY, {
        toValue: -6,
        duration: 500,
        easing: Easing.linear,
        useNativeDriver: true,
      }),

      Animated.delay(800),

      Animated.timing(opacity, {
        toValue: 0,
        duration: 639,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }),

      Animated.delay(100),

      // soft spring entrance/exit
      Animated.spring(scale, {
        toValue: 1.0,
        stiffness: 100,
        damping: 15,
        mass: 1,
        useNativeDriver: true,
      }),

      Animated.delay(100),

      Animated.spring(scale, {
        toValue: 1.0,
        stiffness: 600,
        damping: 15,
        mass: 1,
        useNativeDriver: true,
      }),
    ]);

    seq.start(() => {
      // navigate to onboarding once sequence finishes
      navigation.reset?.({
        index: 0,
        routes: [{ name: "Onboarding" }],
      });
    });

    // safety fallback
    const fallback = setTimeout(() => {
      navigation.reset?.({ index: 0, routes: [{ name: "Onboarding" }] });
    }, 6000);

    return () => clearTimeout(fallback);
  }, [navigation, opacity, scale, translateY]);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: opacity,
            transform: [{ scale: scale }, { translateY: translateY }],
          },
        ]}
      >
        <Text style={styles.logoText}>Georim</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A0A0B",
    alignItems: "center",
    justifyContent: "center",
  },
  logoContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  logoText: {
    color: "#FFF",
    fontSize: 42,
    fontWeight: "800",
    letterSpacing: 1,
  },
});
