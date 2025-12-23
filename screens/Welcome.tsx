import React, { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  PanResponder,
  Image,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Svg, {
  Circle,
  Text as SvgText,
  TextPath,
  Defs,
  Path,
} from "react-native-svg";
import { LinearGradient } from "expo-linear-gradient";

const { width, height } = Dimensions.get("window");

const HEADINGS: string[][] = [
  ["Hey", "Ready for Tonight?"],
  ["Find Your", "First Event"],
  ["No Plans Yet?", "Georim", "Got You"],
];

const CARD_RADIUS = 140;

export default function Welcome() {
  const navigation = useNavigation<any>();
  const [active, setActive] = useState(0);

  const knobX = useRef(new Animated.Value(0)).current;
  const trackWidth = Math.min(width - 48, 360);
  const knobSize = 56;
  const maxTranslate = trackWidth - knobSize - 8;

  const pan = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        knobX.setOffset((knobX as any)._value);
        knobX.setValue(0);
      },
      onPanResponderMove: (e, gesture) => {
        const dx = Math.max(0, Math.min(maxTranslate, gesture.dx));
        knobX.setValue(dx);
      },
      onPanResponderRelease: (e, gesture) => {
        knobX.flattenOffset();
        const finalX = (knobX as any)._value;
        if (finalX > maxTranslate * 0.66) {
          // success
          Animated.timing(knobX, {
            toValue: maxTranslate,
            duration: 120,
            useNativeDriver: false,
          }).start(() => {
            navigation.replace?.("Login");
          });
        } else {
          Animated.spring(knobX, {
            toValue: 0,
            useNativeDriver: false,
          }).start();
        }
      },
    })
  ).current;

  const handleCirclePress = (index: number) => {
    setActive(index);
  };

  // Interpolate opacity for the slider hint text
  const sliderHintOpacity = knobX.interpolate({
    inputRange: [0, maxTranslate],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  return (
    <View style={styles.container}>
      <View>
        {HEADINGS[active].map((line, i) => (
          <Text
            key={i}
            style={i === 0 ? styles.headerPrimary : styles.headerSecondary}
          >
            {line}
          </Text>
        ))}
      </View>

      <View style={styles.centerWrapper}>
        <View style={styles.leftProgress}>
          <View style={styles.progressLine} />
          {[0, 1, 2].map((i) => {
            const isActive = i <= active;
            return (
              <TouchableOpacity
                key={i}
                onPress={() => handleCirclePress(i)}
                style={styles.progressItem}
                activeOpacity={0.8}
              >
                <View
                  style={[
                    styles.circle,
                    isActive ? styles.circleActive : styles.circleInactive,
                  ]}
                >
                  <Text
                    style={
                      isActive
                        ? styles.circleTextActive
                        : styles.circleTextInactive
                    }
                  >
                    {i + 1}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.card}>
          <Image
            source={require("../assets/onboarding/happy-image.jpg")}
            style={[styles.cardImage, { borderRadius: CARD_RADIUS }]} // ensure image is rounded
            resizeMode="cover"
          />

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

              {/* Circle badge */}
              <Circle cx={60} cy={60} r={28} fill="rgba(255,255,255,0.12)" />

              {/* Center icon */}
              <Image
                source={require("../assets/explore_page/send.png")}
                style={{
                  position: "absolute",
                  width: 20,
                  height: 20,
                  left: 50,
                  top: 50,
                  tintColor: "white",
                }}
              />

              {/* Circular text */}
              <SvgText
                fill="#fff"
                fontSize={10}
                letterSpacing={1}
                textAnchor="middle"
              >
                <TextPath href="#badgePath" startOffset="50%">
                  JOIN THE BUZZ•LIVE THE MOMENT
                </TextPath>
              </SvgText>
            </Svg>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <LinearGradient
          colors={["#6E23BA", "#282691"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.sliderTrack, { width: trackWidth }]}
        >
          {/* Bind opacity to the slider hint */}
          <Animated.Text
            style={[
              styles.sliderHint,
              { opacity: sliderHintOpacity }, // Interpolated opacity
            ]}
          >
            Swipe to get started
          </Animated.Text>

          <Animated.View
            {...pan.panHandlers}
            style={[
              styles.knob,
              {
                transform: [{ translateX: knobX }],
              },
            ]}
          >
            <Text style={styles.knobArrow}>→</Text>
          </Animated.View>
        </LinearGradient>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#331057",
    paddingTop: 43,
    paddingHorizontal: 24,
  },
  headerPrimary: {
    color: "#ffffff",
    fontSize: 46,
    fontWeight: "900",
    lineHeight: 48,
    letterSpacing: -0.5,
    paddingTop: 20,
  },

  headerSecondary: {
    color: "#ffffff",
    fontSize: 48,
    fontWeight: "700",
    lineHeight: 46,
    opacity: 0.9,
  },

  centerWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 10,
  },
  leftProgress: {
    width: 48,
    alignItems: "center",
    marginRight: 6,
  },
  progressLine: {
    position: "absolute",
    left: 24,
    top: 86,
    width: 2,
    height: 175,
    backgroundColor: "rgba(255,255,255,0.12)",
    borderRadius: 2,
  },
  progressItem: {
    marginVertical: 28,
  },
  circle: {
    width: 60,
    height: 60,
    borderRadius: 58,
    alignItems: "center",
    justifyContent: "center",
  },
  circleActive: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: "#fff",
  },
  circleInactive: {
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },
  circleTextActive: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 36,
  },
  circleTextInactive: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 26,
  },
  card: {
    width: Math.min(width - 120, 320),
    height: Math.min(height * 0.57, 640),
    borderRadius: CARD_RADIUS,
    overflow: "visible",
    backgroundColor: "#111",
    alignItems: "center",
    justifyContent: "center",
  },
  cardImage: {
    ...StyleSheet.absoluteFillObject,
    width: undefined,
    height: undefined,
  },
  badgeWrap: {
    position: "absolute",
    zIndex: 99,
    left: -20,
    top: -12,
    backgroundColor: " #362B83",
  },
  circleBadge: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: " #362B83",
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
    maxWidth: 150,
    textAlign: "left",
    opacity: 0.95,
    transform: [],
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
    marginLeft: 10,
  },
  sliderHint: {
    position: "absolute",
    left: 104,
    color: "rgba(255,255,255,0.85)",
    fontWeight: "600",
    fontSize: 17,
  },
  knob: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#DEBFFD",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    left: 8,
    elevation: 6,
  },
  knobArrow: {
    color: "#932FF8",
    fontSize: 24,
    fontWeight: "800",
  },
});
