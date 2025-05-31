import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Animated,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import BottomNavComplete from "../components/BottomNavComplete";
import Constants from "expo-constants";
import { getToken } from "../utils/auth";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import * as Animatable from "react-native-animatable";

// Constsants.
const BACKEND_URL = Constants.expoConfig?.extra?.BACKEND_URL;

type Event = {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  price: string;
  description: string;
  image: any;
  latitude: number;
  longitude: number;
  attendees: number;
  section: string;
  status: "Registered" | "Checked-In";
  key?: string;
};

type RootStackParamList = {
  Dashboard: undefined;
  CheckinScreen: undefined;
  Account: undefined;
  EventDetails: { event: Event };
  VerifyLocation: undefined;
  CreateEvent: undefined;
  Cancelpage: { event: Event };
  ExploreScreen: undefined;
};

const sections = ["Ongoing", "Today", "Upcoming"];

export default function CheckinScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [activeTab, setActiveTab] = useState("Check-In");
  const navSlideAnim = useRef(new Animated.Value(100)).current;

  // State for events and loading
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  // Replace your emoji list with these:
  const emojiList = ["🕵️‍♂️", "🔍", "😔", "📭", "🗒️", "🕳️", "🕰️"];

  // Add this near the top of your component
  const [emojiIndex, setEmojiIndex] = useState(0);

  useEffect(() => {
    Animated.timing(navSlideAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start();

    const fetchEvents = async () => {
      setLoading(true);
      try {
        const token = await getToken();
        const response = await fetch(`${BACKEND_URL}/user/registered-events`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          const errorData = await response.json();
          console.log(errorData.message);
          throw new Error("Failed to fetch events");
        } else {
          const eventData = await response.json();
          // eventData.data is the array of events
          setEvents(
            (eventData.data || []).map((event: any) => ({
              ...event,
              key: event.id,
            }))
          );
        }
      } catch (error) {
        console.error("Error fetching events:", error);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    if (!loading && events.length === 0) {
      const interval = setInterval(() => {
        setEmojiIndex((prev) => (prev + 1) % emojiList.length);
      }, 1200);
      return () => clearInterval(interval);
    }
  }, [loading, events.length]);

  const renderEvent = ({ item }: { item: Event }) => (
    <View style={styles.eventItem}>
      <Image
        source={
          typeof item.image === "string" ? { uri: item.image } : item.image
        }
        style={styles.eventImage}
      />
      <View style={styles.eventInfo}>
        <View style={styles.eventMainInfo}>
          <TouchableOpacity
            onPress={() => navigation.navigate("EventDetails", { event: item })}
          >
            <Text style={styles.eventTitle}>{item.title}</Text>
          </TouchableOpacity>
          <Text style={styles.eventDate}>
            {item.date} - {item.location}
          </Text>
        </View>
        <View style={styles.eventBottom}>
          <Text style={styles.eventPrice}>{item.price}</Text>
          <View style={styles.buttonGroup}>
            <TouchableOpacity
              style={styles.checkinBtn}
              onPress={() => {
                setActiveTab("Check-In");
                navigation.navigate("VerifyLocation");
              }}
            >
              <Text style={styles.checkinText}>Check In</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={() => {
                navigation.navigate("Cancelpage", {
                  event: item,
                });
              }}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );

  const renderSectionHeader = (section: string) => (
    <Text style={styles.sectionTitle}>{section}</Text>
  );

  // Group events by section for rendering headers
  const groupedEvents = sections.flatMap((section) => [
    { type: "header", section, key: `header-${section}` },
    ...events.filter((e) => e.section === section),
  ]);

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <Text style={styles.header}>Check In</Text>
        <Image
          source={require("../assets/checkin-illustration.jpg")}
          style={styles.illustration}
          resizeMode="contain"
        />
      </View>

      <View style={styles.registeredBar}>
        <Text style={styles.registeredText}>Registered Events</Text>
      </View>

      {loading ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color="#7F00FF" />
        </View>
      ) : events.length === 0 ? (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            marginTop: 40,
          }}
        >
          <Animatable.Text
            animation="bounceIn"
            iterationCount="infinite"
            direction="alternate"
            style={{ fontSize: 40, marginBottom: 10 }}
          >
            {emojiList[emojiIndex]}
          </Animatable.Text>
          <Animatable.Text
            animation="fadeInDown"
            iterationCount="infinite"
            direction="alternate"
            duration={1800}
            style={{
              fontSize: 20,
              fontWeight: "bold",
              color: "#7F00FF",
              marginBottom: 6,
            }}
          >
            No events found!
          </Animatable.Text>
          <Animatable.Text
            animation="pulse"
            iterationCount="infinite"
            duration={2200}
            style={{
              fontSize: 16,
              color: "#666",
              textAlign: "center",
              paddingHorizontal: 24,
              marginBottom: 156,
            }}
          >
            You have not registered for any events yet.{"\n"}
            Go explore and register for an event!
          </Animatable.Text>
        </View>
      ) : (
        <FlatList
          data={groupedEvents}
          renderItem={({ item }) =>
            "type" in item && item.type === "header"
              ? renderSectionHeader(item.section)
              : renderEvent({ item: item as Event })
          }
          keyExtractor={(item) => item.key || item.section}
          contentContainerStyle={[
            styles.scrollContainer,
            { paddingBottom: 120 },
          ]}
          showsVerticalScrollIndicator={false}
          style={{ marginBottom: 0 }}
        />
      )}

      <BottomNavComplete
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        navSlideAnim={navSlideAnim}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
    marginLeft: 18,
    paddingTop: 20,
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 20, // room for nav bar
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    marginBottom: -10,
    paddingLeft: 12,
  },
  illustration: {
    width: 220,
    height: 180,
  },
  registeredBar: {
    backgroundColor: "#7F00FF",
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginTop: 0,
  },
  registeredText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 20,
  },
  sectionTitle: {
    fontWeight: "600",
    fontSize: 18,
    marginTop: 6,
    marginBottom: 6,
    marginLeft: 12,
  },
  eventItem: {
    flexDirection: "row",
    alignItems: "flex-start", // changed from center
    backgroundColor: "#fff",
    marginHorizontal: 0,
    marginBottom: 8,
    borderRadius: 8,
    padding: 6,
    elevation: 1,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
  },
  eventImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 10,
  },
  eventInfo: {
    flex: 1,
    marginLeft: 10,
  },
  eventMainInfo: {
    marginBottom: 4,
  },
  eventTitle: {
    fontWeight: "500",
    fontSize: 16,
    marginBottom: 2,
  },
  eventDate: {
    fontSize: 12,
    color: "#444",
  },
  eventBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  eventPrice: {
    fontSize: 12,
    color: "#000",
  },
  buttonGroup: {
    flexDirection: "row",
    gap: 8,
  },
  checkinBtn: {
    backgroundColor: "#18C964",
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    minWidth: 65,
    alignItems: "center",
  },
  cancelBtn: {
    backgroundColor: "#FF0000",
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    minWidth: 65,
    alignItems: "center",
  },
  checkinText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12,
  },
  cancelText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12,
  },
});
