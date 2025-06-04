import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Animated,
  Dimensions,
  Easing,
} from "react-native";
import { useNavigation, NavigationProp } from "@react-navigation/native";

const { width } = Dimensions.get("window");

type RootStackParamList = {
  Dashboard: undefined;
  // add other routes here if needed
};

export default function EventSuccessScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  // Animations
  const thankYouAnim = useRef(new Animated.Value(-100)).current;
  const successAnim = useRef(new Animated.Value(width)).current;
  const imageScale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animate texts and image
    Animated.sequence([
      Animated.timing(thankYouAnim, {
        toValue: 0,
        duration: 700,
        easing: Easing.bounce,
        useNativeDriver: true,
      }),
      Animated.timing(successAnim, {
        toValue: 0,
        duration: 700,
        useNativeDriver: true,
      }),
      Animated.spring(imageScale, {
        toValue: 1,
        friction: 4,
        tension: 80,
        useNativeDriver: true,
      }),
    ]).start();

    // Auto-navigate after 3 seconds
    const timeout = setTimeout(() => {
      navigation.navigate("Dashboard");
    }, 3000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <View style={styles.container}>
      <Animated.Text
        style={[styles.thankYou, { transform: [{ translateY: thankYouAnim }] }]}
      >
        Thank You
      </Animated.Text>
      <Animated.Text
        style={[
          styles.successText,
          { transform: [{ translateX: successAnim }] },
        ]}
      >
        Event created successfully
      </Animated.Text>
      <Animated.View
        style={{
          marginTop: 32,
          alignItems: "center",
          transform: [{ scale: imageScale }],
        }}
      >
        <Image
          source={{
            uri: "https://eliazar-applications.s3.us-east-2.amazonaws.com/georim/1748655981045-02ee2e92-3356-49ff-ae78-fd7d1ba23beb-Completed_event.jpg",
          }}
          style={styles.image}
          resizeMode="contain"
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  thankYou: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#7F00FF",
    textAlign: "center",
    marginBottom: 8,
  },
  successText: {
    fontSize: 20,
    color: "#333",
    textAlign: "center",
    marginBottom: 8,
    fontWeight: "500",
  },
  image: {
    width: 260,
    height: 260,
    borderRadius: 20,
    marginTop: 10,
    shadowColor: "#7F00FF",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
  },
});
