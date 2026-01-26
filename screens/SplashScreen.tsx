import React, { useEffect, useRef } from "react";
import { StyleSheet, Animated, Easing } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Audio } from "expo-av";

const CHEVRON_SIZE = 34;
const STACK_GAP_Y = 7;
const STACK_GAP_X = 17;
const CHEVRON4_WIDTH = 200;
const CHEVRON4_HEIGHT = 200;
const CHEVRON3_FINAL_SCALE = 0.8;

export default function SplashScreen() {
  const navigation = useNavigation<any>();

  /** ---------------------------- Animated values ---------------------------- */
  const backgroundColor = useRef(new Animated.Value(0)).current;

  const chevron1TranslateY = useRef(new Animated.Value(20)).current;
  const chevron2TranslateY = useRef(new Animated.Value(20)).current;
  const chevron3TranslateY = useRef(new Animated.Value(20)).current;
  const chevron3TranslateX = useRef(new Animated.Value(0)).current;
  const chevron3Scale = useRef(new Animated.Value(1)).current;
  const chevron2TranslateX = useRef(new Animated.Value(0)).current;

  const chevron1Opacity = useRef(new Animated.Value(0)).current;
  const chevron2Opacity = useRef(new Animated.Value(0)).current;
  const chevron3Opacity = useRef(new Animated.Value(0)).current;

  const chevron4TranslateX = useRef(new Animated.Value(-100)).current; // offscreen left
  const chevron4Opacity = useRef(new Animated.Value(0)).current; // fade in



  /** ---------------------------- Sound reference ---------------------------- */
  const soundRef = useRef<Audio.Sound | null>(null);

  useEffect(() => {
    async function loadPing() {
      const { sound } = await Audio.Sound.createAsync(
        require("../assets/sounds/ping.mp3"),
        { volume: 0.25 },
      );
      soundRef.current = sound;
    }
    loadPing();

    return () => {
      soundRef.current?.unloadAsync();
    };
  }, []);

  /** ---------------------------- Reset animations ---------------------------- */
  const resetAnimations = () => {
    backgroundColor.setValue(0);

    chevron1TranslateY.setValue(20);
    chevron2TranslateY.setValue(20);
    chevron3TranslateY.setValue(20);
    chevron3TranslateX.setValue(0);

    chevron3Scale.setValue(1);
    chevron2TranslateX.setValue(0);

    chevron1Opacity.setValue(0);
    chevron2Opacity.setValue(0);
    chevron3Opacity.setValue(0);
    chevron4Opacity.setValue(0);

    chevron4TranslateX.setValue(-100);
  };

  /** ---------------------------- Vibration animation ---------------------------- */


  /** ---------------------------- Run animations ---------------------------- */
  useEffect(() => {
    resetAnimations();

    // Background animation
    Animated.sequence([
      Animated.timing(backgroundColor, {
        toValue: 1,
        duration: 800,
        easing: Easing.out(Easing.ease),
        useNativeDriver: false,
      }),
      Animated.delay(100),
      Animated.timing(backgroundColor, {
        toValue: 2,
        duration: 500,
        easing: Easing.in(Easing.ease),
        useNativeDriver: false,
      }),
    ]).start();

    // Chevron 1 — base
    Animated.parallel([
      Animated.spring(chevron1TranslateY, {
        toValue: 0,
        mass: 1,
        stiffness: 1536,
        damping: 24,
        useNativeDriver: true,
      }),
      Animated.timing(chevron1Opacity, {
        toValue: 1,
        duration: 200,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start(() => {
      setTimeout(() => {
        // Chevron 2 — stacked + offset
        Animated.parallel([
          Animated.spring(chevron2TranslateY, {
            toValue: -STACK_GAP_Y,
            mass: 1,
            stiffness: 1536,
            damping: 24,
            useNativeDriver: true,
          }),
          Animated.spring(chevron2TranslateX, {
            toValue: STACK_GAP_X,
            mass: 1,
            stiffness: 1536,
            damping: 24,
            useNativeDriver: true,
          }),
          Animated.timing(chevron2Opacity, {
            toValue: 1,
            duration: 200,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.spring(chevron1TranslateY, {
            toValue: STACK_GAP_Y,
            mass: 1,
            stiffness: 1536,
            damping: 24,
            useNativeDriver: true,
          }),
        ]).start(async () => {
          // Play ping sound
          await soundRef.current?.replayAsync();


          setTimeout(() => {
            // Chevron 3 — final
            Animated.parallel([
              Animated.spring(chevron3TranslateY, {
                toValue: 0,
                mass: 1,
                stiffness: 1536,
                damping: 24,
                useNativeDriver: true,
              }),
              Animated.spring(chevron3Scale, {
                toValue: 1.08,
                mass: 1,
                stiffness: 800,
                damping: 30,
                useNativeDriver: true,
              }),
              Animated.timing(chevron3Opacity, {
                toValue: 1,
                duration: 150,
                easing: Easing.out(Easing.ease),
                useNativeDriver: true,
              }),
              Animated.timing(chevron1Opacity, {
                toValue: 0,
                duration: 0,
                useNativeDriver: true,
              }),
              Animated.timing(chevron2Opacity, {
                toValue: 0,
                duration: 0,
                useNativeDriver: true,
              }),
            ]).start(() => {
              // ---------------- Chevron-4 slides in and pushes chevron-3 ----------------

              Animated.parallel([
                // Slide chevron-4 in
                Animated.timing(chevron4TranslateX, {
                  toValue: 0,
                  duration: 400,
                  easing: Easing.out(Easing.ease),
                  useNativeDriver: true,
                }),
                Animated.timing(chevron4Opacity, {
                  toValue: 1,
                  duration: 200,
                  useNativeDriver: true,
                }),
                // Move chevron-3 to the right
                Animated.timing(chevron3TranslateX, {
                  toValue: CHEVRON4_WIDTH / 2, // position to the right of chevron-4
                  duration: 400,
                  easing: Easing.out(Easing.ease),
                  useNativeDriver: true,
                }),
              ]).start(() => {
                // After chevron-4 reached the center, chevron-3 moves up and shrinks
                Animated.parallel([
                  Animated.timing(chevron3TranslateY, {
                    toValue: -15,
                    duration: 300,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                  }),
                  Animated.timing(chevron3TranslateX, {
                    toValue: 110,
                    duration: 300,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                  }),
                  Animated.timing(chevron3Scale, {
                    toValue: CHEVRON3_FINAL_SCALE,
                    duration: 400,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                  }),
                ]).start(() => {
                  // Animation finished → navigate!
                  setTimeout(() => {
                    navigation.navigate("Onboarding");
                  }, 200);
                });
              });
            });
          }, 100);
        });
      }, 100);
    });
  }, []);

  /** ---------------------------- Background interpolation ---------------------------- */
  const interpolatedBackgroundColor = backgroundColor.interpolate({
    inputRange: [0, 1, 2],
    outputRange: ["#0E0D32", "#0E0D32", "#331057"],
  });

  return (
    <Animated.View
      style={[
        styles.container,
        { backgroundColor: interpolatedBackgroundColor },
      ]}
    >
      <Animated.Image
        resizeMode="contain"
        source={require("../assets/splashscreen/chevron-1.png")}
        style={[
          styles.chevron,
          {
            opacity: chevron1Opacity,
            transform: [
              { translateY: chevron1TranslateY },
            ],
          },
        ]}
      />
      <Animated.Image
        resizeMode="contain"
        source={require("../assets/splashscreen/chevron-2.png")}
        style={[
          styles.chevron,
          {
            opacity: chevron2Opacity,
            transform: [
              { translateY: chevron2TranslateY },
              { translateX: chevron2TranslateX },
            ],
          },
        ]}
      />
      <Animated.Image
        resizeMode="contain"
        source={require("../assets/splashscreen/chevron-3.png")}
        style={[
          styles.chevron,
          {
            opacity: chevron3Opacity,
            transform: [
              { translateY: chevron3TranslateY },
              { scale: chevron3Scale },
              { translateX: chevron3TranslateX },
            ],
            width: 43,
            height: 43,
          },
        ]}
      />
      <Animated.Image
        resizeMode="contain"
        source={require("../assets/splashscreen/chevron-4.png")}
        style={[
          styles.chevron,
          {
            opacity: chevron4Opacity,
            transform: [{ translateX: chevron4TranslateX }],
            width: 200,
            height: 200,
          },
        ]}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center" },
  chevron: { position: "absolute", width: CHEVRON_SIZE, height: CHEVRON_SIZE },
});
