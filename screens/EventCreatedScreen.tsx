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
import Constants from "expo-constants";
import { getUserData } from "../utils/user";
import { getToken } from "../utils/auth";
import * as Animatable from "react-native-animatable";

// Constsants.
const BACKEND_URL = Constants.expoConfig?.extra?.BACKEND_URL;
// USER_TOKEN will be fetched asynchronously inside useEffect

type Event = {
  id: string;
  title: string;
  description: string;
  image: any;
};

type RootStackParamList = {
  ActivitySnapshot: undefined;
  // add other routes here if needed
};

const EventCreatedPage = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>(); // Initialize navigation with type
  const [activeTab, setActiveTab] = useState<string>("Create");
  const navSlideAnim = useRef(new Animated.Value(100)).current;

  useEffect(() => {
    const fetchEvents = async () => {
      Animated.timing(navSlideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start();

      try {
        const USER_TOKEN = await getToken();
        console.log("User Token:", USER_TOKEN);

        const response = await fetch(`${BACKEND_URL}/user/created-events`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${USER_TOKEN}`,
          },
        });

        if (!response.ok) {
          console.error("Failed to fetch created events from backend");
          // Optionally set an error state here
        } else {
          const responseData = await response.json();
          const fetchedEvents: Event[] = responseData.data.map(
            (event: any) => ({
              id: event.id,
              title: event.title,
              description: event.description,
              image: { uri: event.imageUrl },
            })
          );
          setEvents(fetchedEvents);
        }
      } catch (error) {
        console.error("Error fetching user data or events:", error);
        // Optionally set an error state here
      }
    };

    fetchEvents();
  }, []); // Initialize navigation slide animation

  // Add more dummy events using only images that already exist in assets
  const [events, setEvents] = useState<Event[]>([]);
  const emojiList = ["🎉", "😅", "🤔", "🎈", "🙌", "📝", "✨"];
  const [emojiIndex, setEmojiIndex] = useState(0);

  useEffect(() => {
    if (events.length === 0) {
      const interval = setInterval(() => {
        setEmojiIndex((prev) => (prev + 1) % emojiList.length);
      }, 1200);
      return () => clearInterval(interval);
    }
  }, [events]);

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

      {/* Event List or No Events Animation */}
      {events.length === 0 ? (
        <View style={styles.noEventsContainer}>
          <Animatable.Text
            animation="bounceIn"
            iterationCount="infinite"
            direction="alternate"
            style={styles.emoji}
          >
            {emojiList[emojiIndex]}
          </Animatable.Text>
          <Animatable.Text
            animation="fadeInDown"
            iterationCount="infinite"
            direction="alternate"
            duration={1800}
            style={styles.noEventsText}
          >
            No events yet!
          </Animatable.Text>
          <Animatable.Text
            animation="pulse"
            iterationCount="infinite"
            duration={2200}
            style={styles.noEventsSubText}
          >
            Create your first event and it will show up here. 🚀{"\n"}
            Tap the "+" button below to get started!
          </Animatable.Text>
        </View>
      ) : (
        <FlatList
          data={events}
          keyExtractor={(item) => item.id}
          renderItem={renderEvent}
          contentContainerStyle={styles.eventList}
        />
      )}

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
  noEventsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 160,
  },
  emoji: {
    fontSize: 64,
    marginBottom: 10,
  },
  noEventsText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#7F00FF",
    marginBottom: 6,
  },
  noEventsSubText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    paddingHorizontal: 24,
  },
});

export default EventCreatedScreen;
