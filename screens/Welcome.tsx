import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  PanResponder,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import Svg, {
  Circle,
  Text as SvgText,
  TextPath,
  Defs,
  Path,
} from "react-native-svg";

const { width, height } = Dimensions.get("window");

const IMAGES = [
  require("../assets/welcome/welcome-1.jpg"),
  require("../assets/welcome/welcome-2.jpg"),
  require("../assets/welcome/welcome.jpg"),
];

const CARD_RADIUS = 140;
const MAX_INDEX = IMAGES.length - 1;

type Props = {
  title: string[];
  nextRoute: string;
};

export default function Welcome({ title, nextRoute }: Props) {
  const navigation = useNavigation<any>();
  const [index, setIndex] = useState(0);

  /** ---------------- Image Stack Animation ---------------- */
  const translateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(translateY, {
      toValue: -index * (height * 0.5),
      useNativeDriver: true,
      friction: 8,
    }).start();
  }, [index]);

  /** ---------------- Vertical Swipe Logic ---------------- */
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dy) > 10,
      onPanResponderRelease: (_, g) => {
        if (g.dy < -50 && index < MAX_INDEX) setIndex((p) => p + 1);
        if (g.dy > 50 && index > 0) setIndex((p) => p - 1);
      },
    }),
  ).current;

  /** ---------------- Slider Button ---------------- */
  const knobX = useRef(new Animated.Value(0)).current;
  const trackWidth = Math.min(width - 48, 360);
  const knobSize = 56;
  const maxTranslate = trackWidth - knobSize - 8;

  const sliderPan = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, g) => {
        const dx = Math.max(0, Math.min(maxTranslate, g.dx));
        knobX.setValue(dx);
      },
      onPanResponderRelease: () => {
        const finalX = (knobX as any)._value;

        if (finalX > maxTranslate * 0.66) {
          Animated.timing(knobX, {
            toValue: maxTranslate,
            duration: 120,
            useNativeDriver: false,
          }).start(() => navigation.replace(nextRoute));
        } else {
          Animated.spring(knobX, {
            toValue: 0,
            useNativeDriver: false,
          }).start();
        }
      },
    }),
  ).current;

  const sliderHintOpacity = knobX.interpolate({
    inputRange: [0, maxTranslate],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  return (
    <View style={styles.container}>
      {/* ---------- Header ---------- */}
      <View>
        {title.map((line, i) => (
          <Text
            key={i}
            style={i === 0 ? styles.headerPrimary : styles.headerSecondary}
          >
            {line}
          </Text>
        ))}
      </View>

      {/* ---------- Center ---------- */}
      <View style={styles.centerWrapper}>
        {/* Progress */}
        <View style={styles.leftProgress}>
          <View style={styles.progressLine} />
          {[0, 1, 2].map((i) => {
            const active = i <= index;
            return (
              <View
                key={i}
                style={[
                  styles.circle,
                  active ? styles.circleActive : styles.circleInactive,
                ]}
              >
                <Text
                  style={
                    active ? styles.circleTextActive : styles.circleTextInactive
                  }
                >
                  {i + 1}
                </Text>
              </View>
            );
          })}
        </View>

        {/* Circular Badge */}
        <View style={styles.badgeWrap} pointerEvents="none">
          <Svg width={120} height={120}>
            <Defs>
              <Path
                id="badgePath"
                d="
                    M60,60
                    m-28,0
                    a28,28 0 1,1 56,0
                    a28,28 0 1,1 -56,0
                  "
              />
            </Defs>

            <Circle cx={60} cy={60} r={28} fill="rgba(255,255,255,0.15)" />

            <SvgText
              fill="#fff"
              fontSize={10}
              letterSpacing={1}
              textAnchor="middle"
            >
              <TextPath href="#badgePath" startOffset="50%">
                JOIN THE BUZZ • LIVE THE MOMENT
              </TextPath>
            </SvgText>
          </Svg>

          <Image
            source={require("../assets/explore_page/send.png")}
            style={styles.badgeIcon}
          />
        </View>

        {/* Image Card */}
        <View style={styles.card} {...panResponder.panHandlers}>
          <Animated.View style={{ transform: [{ translateY }] }}>
            {IMAGES.map((img, i) => (
              <Image
                key={i}
                source={img}
                style={[styles.cardImage, { borderRadius: CARD_RADIUS }]}
              />
            ))}
          </Animated.View>
        </View>
      </View>

      {/* ---------- Slider ---------- */}
      {index === MAX_INDEX && (
        <View style={styles.footer}>
          <LinearGradient
            colors={["#6E23BA", "#282691"]}
            style={[styles.sliderTrack, { width: trackWidth }]}
          >
            <Animated.Text
              style={[styles.sliderHint, { opacity: sliderHintOpacity }]}
            >
              Swipe to continue
            </Animated.Text>

            <Animated.View
              {...sliderPan.panHandlers}
              style={[styles.knob, { transform: [{ translateX: knobX }] }]}
            >
              <Text style={styles.knobArrow}>→</Text>
            </Animated.View>
          </LinearGradient>
        </View>
      )}
    </View>
  );
}

/** ================= Styles ================= */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#331057",
    paddingTop: 68,
    paddingHorizontal: 24,
  },

  headerPrimary: {
    color: "#fff",
    fontSize: 60,
    fontWeight: "800",
    paddingTop: 10,
  },

  headerSecondary: {
    color: "#fff",
    fontSize: 55,
    fontWeight: "700",
    opacity: 0.9,
  },

  centerWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },

  leftProgress: {
    width: 52,
    alignItems: "center",
  },

  progressLine: {
    position: "absolute",
    width: 2,
    height: 163,
    backgroundColor: "rgba(255,255,255,0.12)",
    top: 82,
  },

  circle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 26,
  },

  circleActive: {
    borderWidth: 2,
    borderColor: "#fff",
  },

  circleInactive: {
    backgroundColor: "rgba(255,255,255,0.08)",
  },

  circleTextActive: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "600",
  },

  circleTextInactive: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 22,
  },

  card: {
    width: Math.min(width - 120, 320),
    height: height * 0.5,
    borderRadius: CARD_RADIUS,
    overflow: "hidden",
    marginLeft: 12,
  },

  cardImage: {
    width: "100%",
    height: height * 0.5,
  },

  /* Badge styles */
  badgeWrap: {
    position: "absolute",
    left: 40,
    top: 40,
    zIndex: 70,
  },

  badgeIcon: {
    position: "absolute",
    width: 20,
    height: 20,
    left: 50,
    top: 50,
    tintColor: "#fff",
  },

  footer: {
    paddingBottom: 45,
    alignItems: "center",
  },

  sliderTrack: {
    height: 72,
    borderRadius: 38,
    justifyContent: "center",
    paddingHorizontal: 12,
  },

  sliderHint: {
    position: "absolute",
    alignSelf: "center",
    color: "rgba(255,255,255,0.85)",
    fontSize: 17,
    fontWeight: "600",
  },

  knob: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#DEBFFD",
    alignItems: "center",
    justifyContent: "center",
    elevation: 6,
  },

  knobArrow: {
    color: "#932FF8",
    fontSize: 24,
    fontWeight: "800",
  },
});
