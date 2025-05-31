import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  Animated,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import BottomNavComplete from "../components/BottomNavComplete";

type Event = {
  id: string;
  title: string;
  description: string;
  image: any;
};

const events: Event[] = [
  {
    id: "1",
    title: "Ruston Fest!!! - Revival",
    description: "Sat, May 17 - LA Tech Basketball Stadium Free",
    image: require("../assets/ruston-fest.png"),
  },
  {
    id: "2",
    title: "Dembele Calculus - Education",
    description: "May 17 - Dec 1 - Grambing, Carver Hall 234 Free",
    image: require("../assets/calculus.png"),
  },
  {
    id: "3",
    title: "Open Mic Night",
    description: "Sat, May 24 - Grambling, McDinning $10",
    image: require("../assets/ruston-fest.png"),
  },
  {
    id: "4",
    title: "Tech Soccer Finals",
    description: "Sun, May 25 - LA Sports Stadium Free",
    image: require("../assets/calculus.png"),
  },
  {
    id: "5",
    title: "Science Seminar",
    description: "Mon, May 26 - Grambling, SOC Faculty Free",
    image: require("../assets/ruston-fest.png"),
  },
  {
    id: "6",
    title: "Live Band Night",
    description: "Tue, May 27 - Grambling, McDinning $20",
    image: require("../assets/calculus.png"),
  },
  {
    id: "7",
    title: "Basketball Showdown",
    description: "Wed, May 28 - LA Tech Basketball Stadium Free",
    image: require("../assets/ruston-fest.png"),
  },
  {
    id: "8",
    title: "Social Science Workshop",
    description: "Thu, May 29 - Grambling, SOC Faculty Free",
    image: require("../assets/calculus.png"),
  },
];

import type { StackNavigationProp } from "@react-navigation/stack";

type RootStackParamList = {
  EventDetails: { eventId: string };
  ActivitySnapshot: undefined;
  // add other routes if needed
};

const EventCreatedScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [activeTab, setActiveTab] = useState("Create");
  const navSlideAnim = useRef(new Animated.Value(100)).current;

  useEffect(() => {
    Animated.timing(navSlideAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleEventTitlePress = (event: Event) => {
    navigation.navigate("EventDetails", { eventId: event.id });
  };

  const renderEvent = ({ item }: { item: Event }) => (
    <TouchableOpacity
      style={styles.eventCard}
      onPress={() => navigation.navigate("ActivitySnapshot")}
    >
      <Image source={item.image} style={styles.eventImage} resizeMode="cover" />
      <View style={styles.eventDetails}>
        <TouchableOpacity onPress={() => handleEventTitlePress(item)}>
          <Text style={styles.eventTitle}>{item.title}</Text>
        </TouchableOpacity>
        <Text style={styles.eventDescription}>{item.description}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="chevron-back" size={24} color="#000" />
      </TouchableOpacity>

      <Image
        source={require("../assets/CreatedEvent.jpg")}
        style={styles.bannerImage}
        resizeMode="contain"
      />

      <View style={styles.headerBar}>
        <Text style={styles.headerText}>Events Created</Text>
      </View>

      <FlatList
        data={events}
        keyExtractor={(item) => item.id}
        renderItem={renderEvent}
        contentContainerStyle={styles.eventList}
      />

      <BottomNavComplete
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        navSlideAnim={navSlideAnim}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 16,
    zIndex: 20,
    backgroundColor: "rgba(255,255,255,0.8)",
    borderRadius: 20,
    padding: 8,
  },
  bannerImage: {
    width: "100%",
    height: 200,
    marginBottom: 10,
  },
  headerBar: {
    backgroundColor: "#7F00FF",
    paddingVertical: 10,
    alignItems: "center",
    marginBottom: 10,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  eventList: {
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  eventCard: {
    flexDirection: "row",
    padding: 15,
    marginBottom: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  eventImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 10,
  },
  eventDetails: {
    flex: 1,
    justifyContent: "center",
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#181818",
    textDecorationLine: "underline",
  },
  eventDescription: {
    fontSize: 14,
    color: "#666",
  },
});

export default EventCreatedScreen;
