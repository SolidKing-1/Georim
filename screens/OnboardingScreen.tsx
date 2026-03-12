// import React, { useRef, useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   Dimensions,
//   TouchableOpacity,
//   FlatList,
//   Image,
//   Animated,
// } from "react-native";
// import { useNavigation } from "@react-navigation/native";
// import { NativeStackNavigationProp } from "@react-navigation/native-stack";
// import { RootStackParamList } from "../App";
// import { Video, ResizeMode } from "expo-av";

// const { width, height } = Dimensions.get("window");

// const slides = [
//   {
//     key: "1",
//     header: "Events That\nMove With You",
//     description:
//       "Discover, create, and join unforgettable events happening around you—anytime, anywhere. Be part of a community, grow your network, or have fun with friends.",
//     video: require("../assets/onboarding/on-1.mp4"),
//   },
//   {
//     key: "2",
//     header: "You Show Up.\nWe Check-In",
//     description:
//       "No lines. No QR codes. As soon as you arrive, Georim’s live location feature checks you in automatically. Just pull up, and you’re counted",
//     video: require("../assets/onboarding/on-2.mp4"),
//   },
//   {
//     key: "3",
//     header: "Organize smarter\nReach more people",
//     description:
//       "We handle the logistics—you handle the fun. Georim takes care of the backend so you can be fully present at the front of the party.",
//     video: require("../assets/onboarding/on-3.mp4"),
//   },
//   {
//     key: "4",
//     header: "All Eyes On\nYour Event",
//     description:
//       "Make your next event the one everyone talks about. With Georim, you get the visibility and support to shine on your terms.",
//     video: require("../assets/onboarding/on-4.mp4"),
//   },
//   {
//     key: "5",
//     header: "When Moments\nCome To Life",
//     description:
//       "Whether you're planning a campus mixer, open mic night, or club launch, Georim helps you bring people together—seamlessly. No stress.Just vibes.",
//     video: require("../assets/onboarding/on-5.mp4"),
//   },
// ];

// type NavigationProp = NativeStackNavigationProp<
//   RootStackParamList,
//   "Onboarding"
// >;

// export default function OnboardingScreen() {
//   const navigation = useNavigation<NavigationProp>();
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const flatListRef = useRef<FlatList>(null);

//   // Button bounce animation
//   const buttonScale = useRef(new Animated.Value(1)).current;

//   // Dots animation
//   const dotWidths = useRef(
//     slides.map((_, i) => new Animated.Value(i === 0 ? 36 : 12))
//   ).current;

//   // Text entrance animation
//   const headerAnim = useRef(new Animated.Value(0)).current;
//   const descAnim = useRef(new Animated.Value(0)).current;
//   const imageOpacity = useRef(new Animated.Value(1)).current;

//   // Animate text entrance
//   const animateText = () => {
//     headerAnim.setValue(0);
//     descAnim.setValue(0);
//     Animated.stagger(120, [
//       Animated.spring(headerAnim, {
//         toValue: 1,
//         useNativeDriver: true,
//         friction: 7,
//       }),
//       Animated.spring(descAnim, {
//         toValue: 1,
//         useNativeDriver: true,
//         friction: 7,
//       }),
//     ]).start();
//   };

//   const imageScale = useRef(new Animated.Value(1)).current;

//   const animateImage = () => {
//     imageScale.setValue(0.92); // Start slightly smaller
//     Animated.spring(imageScale, {
//       toValue: 1,
//       useNativeDriver: true,
//       friction: 7,
//       tension: 80,
//     }).start();
//   };

//   useEffect(() => {
//     animateText();
//     animateImage();
//     // Animate dots
//     dotWidths.forEach((dot, i) => {
//       Animated.spring(dot, {
//         toValue: i === currentIndex ? 36 : 12,
//         useNativeDriver: false,
//         friction: 6,
//         tension: 120,
//       }).start();
//     });
//   }, [currentIndex]);

//   const handleNext = () => {
//     // Faster button pop animation
//     Animated.sequence([
//       Animated.spring(buttonScale, {
//         toValue: 0.98,
//         useNativeDriver: true,
//         friction: 2,
//         tension: 180,
//       }),
//       Animated.spring(buttonScale, {
//         toValue: 1,
//         useNativeDriver: true,
//         friction: 2,
//         tension: 180,
//       }),
//     ]).start();

//     if (currentIndex < slides.length - 1) {
//       flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
//       setCurrentIndex(currentIndex + 1);
//     } else {
//       navigation.replace("Login");
//     }
//   };

//   const handleSkip = () => {
//     flatListRef.current?.scrollToIndex({ index: slides.length - 1 });
//     setCurrentIndex(slides.length - 1);
//   };

//   const onMomentumScrollEnd = (e: any) => {
//     const index = Math.round(e.nativeEvent.contentOffset.x / width);
//     setCurrentIndex(index);
//   };

//   const renderItem = ({
//     item,
//     index,
//   }: {
//     item: (typeof slides)[0];
//     index: number;
//   }) => (
//     <View style={styles.slide}>
//       <Video
//         source={item.video}
//         style={styles.fullImage}
//         resizeMode={ResizeMode.COVER}
//         shouldPlay
//         isLooping
//         isMuted
//       />
//     </View>
//   );

//   return (
//     <View style={styles.container}>
//       <FlatList
//         ref={flatListRef}
//         data={slides}
//         renderItem={renderItem}
//         horizontal
//         pagingEnabled
//         showsHorizontalScrollIndicator={false}
//         keyExtractor={(item) => item.key}
//         onMomentumScrollEnd={onMomentumScrollEnd}
//         style={{ flexGrow: 0 }}
//       />
//       {/* Overlay content */}
//       <View style={styles.overlay}>
//         <View style={styles.dotsContainer}>
//           {slides.map((_, idx) => (
//             <Animated.View
//               key={idx}
//               style={[
//                 styles.dot,
//                 {
//                   width: dotWidths[idx],
//                   backgroundColor: idx === currentIndex ? "#7F00FF" : "#FFFFFF",
//                   borderRadius: 6,
//                   marginHorizontal: 4,
//                 },
//               ]}
//             />
//           ))}
//         </View>
//         <View style={styles.bottomContainer}>
//           <View style={styles.textContainer}>
//             <Animated.Text
//               style={[
//                 styles.header,
//                 {
//                   opacity: headerAnim,
//                   transform: [
//                     {
//                       translateY: headerAnim.interpolate({
//                         inputRange: [0, 1],
//                         outputRange: [30, 0],
//                       }),
//                     },
//                   ],
//                 },
//               ]}
//             >
//               {slides[currentIndex].header}
//             </Animated.Text>
//             <Animated.Text
//               style={[
//                 styles.description,
//                 {
//                   opacity: descAnim,
//                   transform: [
//                     {
//                       translateY: descAnim.interpolate({
//                         inputRange: [0, 1],
//                         outputRange: [30, 0],
//                       }),
//                     },
//                   ],
//                 },
//               ]}
//             >
//               {slides[currentIndex].description}
//             </Animated.Text>
//           </View>
//           <View style={styles.buttonRow}>
//             <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
//               <TouchableOpacity
//                 style={styles.button}
//                 onPress={handleNext}
//                 activeOpacity={0.8}
//               >
//                 <Text style={styles.buttonText}>
//                   {currentIndex === slides.length - 1 ? "Get Started" : "Next"}
//                 </Text>
//                 <View style={styles.arrowCircle}>
//                   <Text style={styles.arrow}>&rarr;</Text>
//                 </View>
//               </TouchableOpacity>
//             </Animated.View>
//             {currentIndex !== slides.length - 1 && (
//               <TouchableOpacity
//                 onPress={handleSkip}
//                 style={styles.skipContainer}
//               >
//                 <Text style={styles.skipText}>Skip</Text>
//               </TouchableOpacity>
//             )}
//           </View>
//         </View>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//   },
//   slide: {
//     width,
//     height,
//   },
//   fullImage: {
//     width: width,
//     height: height,
//     position: "absolute",
//     top: 0,
//     left: 0,
//   },
//   overlay: {
//     position: "absolute",
//     left: 0,
//     right: 0,
//     top: 0,
//     bottom: 0,
//     justifyContent: "flex-end",
//     paddingLeft: 32,
//     paddingRight: 32,
//     paddingBottom: 55,
//   },
//   dotsContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 6,
//     marginLeft: 0,
//     height: 24,
//   },
//   dot: {
//     width: 12,
//     height: 12,
//     borderRadius: 6,
//     backgroundColor: "#FFFFFF",
//     marginHorizontal: 4,
//   },
//   activeDot: {
//     height: 12,
//     borderRadius: 6,
//     marginHorizontal: 6,
//   },
//   bottomContainer: {
//     flexDirection: "column",
//     alignItems: "flex-start",
//     justifyContent: "flex-end",
//   },
//   textContainer: {
//     alignItems: "flex-start",
//     marginBottom: 17,
//   },
//   header: {
//     fontSize: 26,
//     fontWeight: "bold",
//     color: "#fff",
//     marginBottom: 6,
//     textAlign: "left",
//     textShadowColor: "rgba(0,0,0,0.5)",
//     textShadowOffset: { width: 1, height: 1 },
//     textShadowRadius: 4,
//   },
//   description: {
//     fontSize: 16,
//     color: "#ffffff",
//     textAlign: "left",
//     maxWidth: width * 0.8,
//     textShadowColor: "rgba(0,0,0,0.5)",
//     textShadowOffset: { width: 1, height: 1 },
//     textShadowRadius: 4,
//   },
//   buttonRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     width: "100%",
//     marginBottom: 0,
//   },
//   button: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#7F00FF",
//     paddingVertical: 10,
//     paddingHorizontal: 36,
//     borderRadius: 27,
//     marginRight: 16,
//   },
//   buttonText: {
//     color: "#fff",
//     fontWeight: "bold",
//     fontSize: 18,
//     marginRight: 12,
//   },
//   arrowCircle: {
//     width: 28,
//     height: 28,
//     borderRadius: 14,
//     backgroundColor: "#fff",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   arrow: {
//     color: "#7F00FF",
//     fontSize: 18,
//     fontWeight: "bold",
//     marginLeft: 1,
//   },
//   skipContainer: {
//     flex: 1,
//     alignItems: "flex-end",
//   },
//   skipText: {
//     color: "#fff",
//     fontSize: 18,
//     fontWeight: "500",
//     textShadowColor: "rgba(0,0,0,0.5)",
//     textShadowOffset: { width: 1, height: 1 },
//     textShadowRadius: 4,
//   },
//   gradient: {
//     position: "absolute",
//     left: 0,
//     right: 0,
//     bottom: 0,
//     height: height * 0.22, // Adjust for how much shade you want
//     borderBottomLeftRadius: 0,
//     borderBottomRightRadius: 0,
//   },
// });

import React, { useRef, useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  FlatList,
  Platform,
  StatusBar,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";
import { Video, ResizeMode } from "expo-av";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withDelay,
  withSequence,
  interpolate,
  Extrapolation,
  Easing,
  FadeIn,
  FadeOut,
  FadeInDown,
  FadeInUp,
  Layout,
  runOnJS,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

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
      "No lines. No QR codes. As soon as you arrive, Georim's live location feature checks you in automatically. Just pull up, and you're counted.",
    video: require("../assets/onboarding/on-2.mp4"),
  },
  {
    key: "3",
    header: "Organize Smarter\nReach More People",
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
      "Whether you're planning a campus mixer, open mic night, or club launch, Georim helps you bring people together—seamlessly. No stress. Just vibes.",
    video: require("../assets/onboarding/on-5.mp4"),
  },
];

const SPRING_CONFIG = {
  damping: 16,
  stiffness: 140,
  mass: 0.8,
};

const SPRING_SNAPPY = {
  damping: 12,
  stiffness: 200,
  mass: 0.6,
};

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Onboarding"
>;

// ─── Animated Dot Component ──────────────────────────────────────────

const PaginationDot = ({
  active,
}: {
  active: boolean;
}) => {
  const dotWidth = useSharedValue(active ? 36 : 10);
  const dotOpacity = useSharedValue(active ? 1 : 0.5);

  useEffect(() => {
    dotWidth.value = withSpring(active ? 36 : 10, SPRING_CONFIG);
    dotOpacity.value = withTiming(active ? 1 : 0.5, { duration: 300 });
  }, [active]);

  const animatedStyle = useAnimatedStyle(() => ({
    width: dotWidth.value,
    opacity: dotOpacity.value,
    backgroundColor: active ? "#7F00FF" : "#FFFFFF",
  }));

  return <Animated.View style={[styles.dot, animatedStyle]} />;
};

// ─── Slide Content Overlay ───────────────────────────────────────────

const SlideContent = ({
  slide,
  isActive,
  isLast,
  onNext,
  onSkip,
}: {
  slide: (typeof slides)[0];
  isActive: boolean;
  isLast: boolean;
  onNext: () => void;
  onSkip: () => void;
}) => {
  const headerTranslateY = useSharedValue(40);
  const headerOpacity = useSharedValue(0);
  const descTranslateY = useSharedValue(40);
  const descOpacity = useSharedValue(0);
  const buttonScale = useSharedValue(1);
  const buttonTranslateY = useSharedValue(30);
  const buttonOpacity = useSharedValue(0);

  useEffect(() => {
    if (isActive) {
      // Reset
      headerTranslateY.value = 40;
      headerOpacity.value = 0;
      descTranslateY.value = 40;
      descOpacity.value = 0;
      buttonTranslateY.value = 30;
      buttonOpacity.value = 0;

      // Stagger entrance
      headerTranslateY.value = withDelay(
        100,
        withSpring(0, SPRING_CONFIG)
      );
      headerOpacity.value = withDelay(
        100,
        withTiming(1, { duration: 400 })
      );

      descTranslateY.value = withDelay(
        250,
        withSpring(0, SPRING_CONFIG)
      );
      descOpacity.value = withDelay(
        250,
        withTiming(1, { duration: 400 })
      );

      buttonTranslateY.value = withDelay(
        400,
        withSpring(0, SPRING_SNAPPY)
      );
      buttonOpacity.value = withDelay(
        400,
        withTiming(1, { duration: 350 })
      );
    } else {
      // Fade out quickly
      headerOpacity.value = withTiming(0, { duration: 200 });
      descOpacity.value = withTiming(0, { duration: 200 });
      buttonOpacity.value = withTiming(0, { duration: 200 });
    }
  }, [isActive]);

  const headerStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
    transform: [{ translateY: headerTranslateY.value }],
  }));

  const descStyle = useAnimatedStyle(() => ({
    opacity: descOpacity.value,
    transform: [{ translateY: descTranslateY.value }],
  }));

  const buttonContainerStyle = useAnimatedStyle(() => ({
    opacity: buttonOpacity.value,
    transform: [{ translateY: buttonTranslateY.value }],
  }));

  const handlePress = useCallback(() => {
    buttonScale.value = withSequence(
      withSpring(0.94, { damping: 8, stiffness: 300 }),
      withSpring(1, { damping: 10, stiffness: 200 })
    );
    // Small delay so the user sees the press animation
    setTimeout(onNext, 120);
  }, [onNext]);

  const buttonAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  if (!isActive) return null;

  return (
    <View style={styles.slideContentWrap}>
      <View style={styles.textContainer}>
        <Animated.Text style={[styles.header, headerStyle]}>
          {slide.header}
        </Animated.Text>
        <Animated.Text style={[styles.description, descStyle]}>
          {slide.description}
        </Animated.Text>
      </View>

      <Animated.View style={[styles.buttonRow, buttonContainerStyle]}>
        <Animated.View style={buttonAnimStyle}>
          <TouchableOpacity
            style={styles.button}
            onPress={handlePress}
            activeOpacity={0.85}
          >
            <Text style={styles.buttonText}>
              {isLast ? "Get Started" : "Next"}
            </Text>
            <View style={styles.arrowCircle}>
              <Ionicons
                name={isLast ? "checkmark" : "arrow-forward"}
                size={18}
                color="#7F00FF"
              />
            </View>
          </TouchableOpacity>
        </Animated.View>

        {!isLast && (
          <TouchableOpacity
            onPress={onSkip}
            style={styles.skipContainer}
            activeOpacity={0.7}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        )}
      </Animated.View>
    </View>
  );
};

// ─── Main Component ──────────────────────────────────────────────────

export default function OnboardingScreen() {
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const videoRefs = useRef<{ [key: string]: Video | null }>({});

  const handleNext = useCallback(() => {
    if (currentIndex < slides.length - 1) {
      const nextIndex = currentIndex + 1;
      flatListRef.current?.scrollToIndex({
        index: nextIndex,
        animated: true,
      });
      setCurrentIndex(nextIndex);
    } else {
      navigation.replace("Login");
    }
  }, [currentIndex, navigation]);

  const handleSkip = useCallback(() => {
    const lastIndex = slides.length - 1;
    flatListRef.current?.scrollToIndex({
      index: lastIndex,
      animated: true,
    });
    setCurrentIndex(lastIndex);
  }, []);

  const onMomentumScrollEnd = useCallback((e: any) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
    setCurrentIndex(index);
  }, []);

  // Cleanup videos on unmount
  useEffect(() => {
    return () => {
      Object.values(videoRefs.current).forEach((v) => v?.unloadAsync());
    };
  }, []);

  const renderItem = useCallback(
    ({ item, index }: { item: (typeof slides)[0]; index: number }) => (
      <View style={styles.slide}>
        <Video
          ref={(ref) => {
            videoRefs.current[item.key] = ref;
          }}
          source={item.video}
          style={styles.fullVideo}
          resizeMode={ResizeMode.COVER}
          shouldPlay={index === currentIndex}
          isLooping
          isMuted
        />
      </View>
    ),
    [currentIndex]
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* ─── Video Carousel ─── */}
      <FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.key}
        onMomentumScrollEnd={onMomentumScrollEnd}
        style={styles.carousel}
        getItemLayout={(_, index) => ({
          length: SCREEN_WIDTH,
          offset: SCREEN_WIDTH * index,
          index,
        })}
        initialNumToRender={1}
        maxToRenderPerBatch={2}
        windowSize={3}
      />

      {/* ─── Gradient Overlay ─── */}
      <LinearGradient
        colors={[
          "rgba(0,0,0,0)",
          "rgba(0,0,0,0.02)",
          "rgba(0,0,0,0.2)",
          "rgba(0,0,0,0.6)",
          "rgba(0,0,0,0.85)",
        ]}
        locations={[0, 0.3, 0.5, 0.7, 1]}
        style={styles.gradientOverlay}
        pointerEvents="none"
      />

      {/* ─── Top subtle gradient ─── */}
      <LinearGradient
        colors={[
          "rgba(0,0,0,0.4)",
          "rgba(0,0,0,0)",
        ]}
        style={styles.topGradient}
        pointerEvents="none"
      />

      {/* ─── Content Overlay ─── */}
      <View
        style={[
          styles.overlay,
          {
            paddingBottom: Math.max(insets.bottom, 20) + 28,
            paddingTop: insets.top + 12,
          },
        ]}
      >
        {/* ─── Pagination Dots ─── */}
        <View style={styles.dotsContainer}>
          {slides.map((_, idx) => (
            <PaginationDot key={idx} active={idx === currentIndex} />
          ))}
        </View>

        {/* ─── Slide Content ─── */}
        {slides.map((slide, idx) => (
          <SlideContent
            key={slide.key}
            slide={slide}
            isActive={idx === currentIndex}
            isLast={idx === slides.length - 1}
            onNext={handleNext}
            onSkip={handleSkip}
          />
        ))}
      </View>

      {/* ─── Progress Bar ─── */}
      <View
        style={[
          styles.progressBarContainer,
          { bottom: Math.max(insets.bottom, 20) + 8 },
        ]}
      >
        <View style={styles.progressBarBg}>
          <Animated.View
            style={[
              styles.progressBarFill,
              {
                width: `${((currentIndex + 1) / slides.length) * 100}%`,
              },
            ]}
          />
        </View>
      </View>
    </View>
  );
}

// ─── Styles ─────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },

  /* ─── Carousel ─── */
  carousel: {
    flexGrow: 0,
    height: SCREEN_HEIGHT,
  },
  slide: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  fullVideo: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    position: "absolute",
    top: 0,
    left: 0,
  },

  /* ─── Gradients ─── */
  gradientOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: SCREEN_HEIGHT * 0.55,
  },
  topGradient: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: SCREEN_HEIGHT * 0.15,
  },

  /* ─── Overlay ─── */
  overlay: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "flex-end",
    paddingHorizontal: 28,
  },

  /* ─── Dots ─── */
  dotsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 6,
  },
  dot: {
    height: 10,
    borderRadius: 5,
  },

  /* ─── Content ─── */
  slideContentWrap: {
    marginBottom: 8,
  },
  textContainer: {
    marginBottom: 24,
  },
  header: {
    fontSize: 30,
    fontWeight: "800",
    color: "#fff",
    marginBottom: 12,
    textAlign: "left",
    lineHeight: 38,
    letterSpacing: -0.5,
    textShadowColor: "rgba(0,0,0,0.6)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  description: {
    fontSize: 15,
    color: "rgba(255, 255, 255, 0.82)",
    textAlign: "left",
    maxWidth: SCREEN_WIDTH * 0.82,
    lineHeight: 23,
    letterSpacing: 0.1,
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 6,
  },

  /* ─── Buttons ─── */
  buttonRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#7F00FF",
    paddingVertical: 14,
    paddingLeft: 28,
    paddingRight: 8,
    borderRadius: 30,
    marginRight: 16,
    gap: 14,
    ...Platform.select({
      ios: {
        shadowColor: "#7F00FF",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.4,
        shadowRadius: 14,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 17,
    letterSpacing: 0.3,
  },
  arrowCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  skipContainer: {
    flex: 1,
    alignItems: "flex-end",
    justifyContent: "center",
    paddingVertical: 8,
  },
  skipText: {
    color: "rgba(255, 255, 255, 0.75)",
    fontSize: 16,
    fontWeight: "500",
    letterSpacing: 0.3,
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },

  /* ─── Progress Bar ─── */
  progressBarContainer: {
    position: "absolute",
    left: 28,
    right: 28,
  },
  progressBarBg: {
    height: 3,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 2,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#7F00FF",
    borderRadius: 2,
  },
});