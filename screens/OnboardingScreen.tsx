import React, { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  FlatList,
  Image,
} from "react-native";
import LottieView from "lottie-react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";

const { width } = Dimensions.get("window");

const slides = [
  {
    key: "1",
    title: "Welcome to Georim!",
    description: "Discover, create, and join amazing events around you.",
    animation: require("../assets/onboarding-discover.json"),
  },
  {
    key: "2",
    title: "Easy Event Creation",
    description:
      "Host your own events with just a few taps and share them with the world.",
    animation: require("../assets/onboarding-create.json"),
  },
  {
    key: "3",
    title: "Seamless Check-In",
    description:
      "Check in to events using your phone and verify your location easily.",
    animation: require("../assets/onboarding-checkin.json"),
  },
  {
    key: "4",
    title: "Secure & Fast Login",
    description:
      "Sign in with biometrics, Google, or email for a secure experience.",
    animation: require("../assets/onboarding-login.json"),
  },
  {
    key: "5",
    title: "Explore & Connect",
    description:
      "Find trending events, connect with others, and never miss out!",
    animation: require("../assets/onboarding-explore.json"),
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

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
      setCurrentIndex(currentIndex + 1);
    } else {
      navigation.replace("Login"); // Go to Login after onboarding
    }
  };

  const renderItem = ({ item }: { item: (typeof slides)[0] }) => (
    <View style={styles.slide}>
      <LottieView source={item.animation} autoPlay loop style={styles.lottie} />
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.description}>{item.description}</Text>
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
        onMomentumScrollEnd={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.x / width);
          setCurrentIndex(index);
        }}
        style={{ flexGrow: 0 }}
      />
      <View style={styles.dotsContainer}>
        {slides.map((_, idx) => (
          <View
            key={idx}
            style={[styles.dot, currentIndex === idx && styles.activeDot]}
          />
        ))}
      </View>
      <TouchableOpacity
        style={styles.button}
        onPress={handleNext}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonText}>
          {currentIndex === slides.length - 1 ? "Get Started" : "Next"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  slide: {
    width,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
    paddingTop: 60,
  },
  lottie: {
    width: 300,
    height: 300,
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#7F00FF",
    textAlign: "center",
    marginBottom: 12,
  },
  description: {
    fontSize: 17,
    color: "#555",
    textAlign: "center",
    marginBottom: 30,
  },
  button: {
    backgroundColor: "#7F00FF",
    paddingVertical: 16,
    paddingHorizontal: 60,
    borderRadius: 12,
    marginBottom: 40,
    marginTop: 10,
    alignSelf: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 18,
    marginTop: 10,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#ccc",
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: "#7F00FF",
    width: 22,
  },
});
