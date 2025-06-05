import React, { useEffect } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import {
  useNavigation,
  useRoute,
  NavigationProp,
  RouteProp,
} from "@react-navigation/native";

type Event = {
  title: string;

  // add other event properties if needed
};

type RootStackParamList = {
  CheckinScreen: undefined;
  Cancelpage: { event?: Event };
  // add other screens here if needed
};

export default function Cancelpage() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, "Cancelpage">>();
  const event = route.params?.event;

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.navigate("CheckinScreen");
    }, 3000);
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      {/* Success Message */}
      <Text style={styles.title}>Event Canceled</Text>
      <Text style={styles.description}>
        {event
          ? `You have successfully canceled your registration for ${event.title}.`
          : "You have successfully canceled your registered event."}
      </Text>

      {/* Graphic/Image */}
      <Image
        source={{ uri: "https://eliazar-applications.s3.us-east-2.amazonaws.com/georim/1748656070966-61f7c2a7-100f-48cf-812d-eb452efe602d-CancelPage.jpg" }}
        style={styles.image}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#7F00FF",
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    color: "#666",
    marginBottom: 30,
  },
  image: {
    width: 500,
    height: 350,
    marginBottom: 30,
  },
});
