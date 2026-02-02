import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  FlatList,
  Image,
  Animated,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";
import { Video, ResizeMode } from "expo-av";

const { width, height } = Dimensions.get("window");

const slides = [
  {
    key: "1",
    header: "Events That\nMove With You",
    description:
      "Discover, create, and join unforgettable events happening around you—anytime, anywhere. Be part of a community, grow your network, or have fun with friends.",
    video: require("../assets/onboarding/on-1.mp4"),
  },
  {
    key: "2",
    header: "You Show Up.\nWe Check-In",
    description:
      "No lines. No QR codes. As soon as you arrive, Georim’s live location feature checks you in automatically. Just pull up, and you’re counted",
    video: require("../assets/onboarding/on-2.mp4"),
  },
  {
    key: "3",
    header: "Organize smarter\nReach more people",
    description:
      "We handle the logistics—you handle the fun. Georim takes care of the backend so you can be fully present at the front of the party.",
    video: require("../assets/onboarding/on-3.mp4"),
  },
  {
    key: "4",
    header: "All Eyes On\nYour Event",
    description:
      "Make your next event the one everyone talks about. With Georim, you get the visibility and support to shine on your terms.",
    video: require("../assets/onboarding/on-4.mp4"),
  },
  {
    key: "5",
    header: "When Moments\nCome To Life",
    description:
      "Whether you're planning a campus mixer, open mic night, or club launch, Georim helps you bring people together—seamlessly. No stress.Just vibes.",
    video: require("../assets/onboarding/on-5.mp4"),
  },
];

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Onboarding"
>;

export default function OnboardingScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  // Button bounce animation
  const buttonScale = useRef(new Animated.Value(1)).current;

  // Dots animation
  const dotWidths = useRef(
    slides.map((_, i) => new Animated.Value(i === 0 ? 36 : 12))
  ).current;

  // Text entrance animation
  const headerAnim = useRef(new Animated.Value(0)).current;
  const descAnim = useRef(new Animated.Value(0)).current;
  const imageOpacity = useRef(new Animated.Value(1)).current;

  // Animate text entrance
  const animateText = () => {
    headerAnim.setValue(0);
    descAnim.setValue(0);
    Animated.stagger(120, [
      Animated.spring(headerAnim, {
        toValue: 1,
        useNativeDriver: true,
        friction: 7,
      }),
      Animated.spring(descAnim, {
        toValue: 1,
        useNativeDriver: true,
        friction: 7,
      }),
    ]).start();
  };

  const imageScale = useRef(new Animated.Value(1)).current;

  const animateImage = () => {
    imageScale.setValue(0.92); // Start slightly smaller
    Animated.spring(imageScale, {
      toValue: 1,
      useNativeDriver: true,
      friction: 7,
      tension: 80,
    }).start();
  };

  useEffect(() => {
    animateText();
    animateImage();
    // Animate dots
    dotWidths.forEach((dot, i) => {
      Animated.spring(dot, {
        toValue: i === currentIndex ? 36 : 12,
        useNativeDriver: false,
        friction: 6,
        tension: 120,
      }).start();
    });
  }, [currentIndex]);

  const handleNext = () => {
    // Faster button pop animation
    Animated.sequence([
      Animated.spring(buttonScale, {
        toValue: 0.98,
        useNativeDriver: true,
        friction: 2,
        tension: 180,
      }),
      Animated.spring(buttonScale, {
        toValue: 1,
        useNativeDriver: true,
        friction: 2,
        tension: 180,
      }),
    ]).start();

    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
      setCurrentIndex(currentIndex + 1);
    } else {
      navigation.replace("Login");
    }
  };

  const handleSkip = () => {
    flatListRef.current?.scrollToIndex({ index: slides.length - 1 });
    setCurrentIndex(slides.length - 1);
  };

  const onMomentumScrollEnd = (e: any) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / width);
    setCurrentIndex(index);
  };

  const renderItem = ({
    item,
    index,
  }: {
    item: (typeof slides)[0];
    index: number;
  }) => (
    <View style={styles.slide}>
      <Video
        source={item.video}
        style={styles.fullImage}
        resizeMode={ResizeMode.COVER}
        shouldPlay
        isLooping
        isMuted
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.key}
        onMomentumScrollEnd={onMomentumScrollEnd}
        style={{ flexGrow: 0 }}
      />
      {/* Overlay content */}
      <View style={styles.overlay}>
        <View style={styles.dotsContainer}>
          {slides.map((_, idx) => (
            <Animated.View
              key={idx}
              style={[
                styles.dot,
                {
                  width: dotWidths[idx],
                  backgroundColor: idx === currentIndex ? "#7F00FF" : "#FFFFFF",
                  borderRadius: 6,
                  marginHorizontal: 4,
                },
              ]}
            />
          ))}
        </View>
        <View style={styles.bottomContainer}>
          <View style={styles.textContainer}>
            <Animated.Text
              style={[
                styles.header,
                {
                  opacity: headerAnim,
                  transform: [
                    {
                      translateY: headerAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [30, 0],
                      }),
                    },
                  ],
                },
              ]}
            >
              {slides[currentIndex].header}
            </Animated.Text>
            <Animated.Text
              style={[
                styles.description,
                {
                  opacity: descAnim,
                  transform: [
                    {
                      translateY: descAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [30, 0],
                      }),
                    },
                  ],
                },
              ]}
            >
              {slides[currentIndex].description}
            </Animated.Text>
          </View>
          <View style={styles.buttonRow}>
            <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
              <TouchableOpacity
                style={styles.button}
                onPress={handleNext}
                activeOpacity={0.8}
              >
                <Text style={styles.buttonText}>
                  {currentIndex === slides.length - 1 ? "Get Started" : "Next"}
                </Text>
                <View style={styles.arrowCircle}>
                  <Text style={styles.arrow}>&rarr;</Text>
                </View>
              </TouchableOpacity>
            </Animated.View>
            {currentIndex !== slides.length - 1 && (
              <TouchableOpacity
                onPress={handleSkip}
                style={styles.skipContainer}
              >
                <Text style={styles.skipText}>Skip</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  slide: {
    width,
    height,
  },
  fullImage: {
    width: width,
    height: height,
    position: "absolute",
    top: 0,
    left: 0,
  },
  overlay: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: "flex-end",
    paddingLeft: 32,
    paddingRight: 32,
    paddingBottom: 55,
  },
  dotsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
    marginLeft: 0,
    height: 24,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#FFFFFF",
    marginHorizontal: 4,
  },
  activeDot: {
    height: 12,
    borderRadius: 6,
    marginHorizontal: 6,
  },
  bottomContainer: {
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "flex-end",
  },
  textContainer: {
    alignItems: "flex-start",
    marginBottom: 17,
  },
  header: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 6,
    textAlign: "left",
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },
  description: {
    fontSize: 16,
    color: "#ffffff",
    textAlign: "left",
    maxWidth: width * 0.8,
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },
  buttonRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginBottom: 0,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#7F00FF",
    paddingVertical: 10,
    paddingHorizontal: 36,
    borderRadius: 27,
    marginRight: 16,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
    marginRight: 12,
  },
  arrowCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  arrow: {
    color: "#7F00FF",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 1,
  },
  skipContainer: {
    flex: 1,
    alignItems: "flex-end",
  },
  skipText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "500",
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },
  gradient: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: height * 0.22, // Adjust for how much shade you want
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
});
