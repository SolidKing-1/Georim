import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Animated,
  FlatList,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Home from "../assets/home.png";
import Explore from "../assets/Explore.png";
import TicketIcon from "../assets/ticket.png";
import ProfileIcon from "../assets/user.png";
import BottomNavComplete from "../components/BottomNavComplete"; // Add this import at the top

// Update Event type to include status
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
  status: "Registered" | "Checked-In"; // <-- Added status
  key?: string;
};

// Dummy data for events
const events: Event[] = [
  {
    id: "1",
    title: "Ruston Fest!!! - Revival",
    date: "Sat, May 17",
    time: "4:00 PM - 10:00 PM",
    location: "LA Tech Basketball Stadium",
    price: "Free",
    description:
      "Join us for the biggest festival in Ruston! Featuring live music, food vendors, local artisans, and family-friendly activities. A celebration of our community's culture and spirit.",
    image: require("../assets/ruston-fest.png"),
    latitude: 32.5272,
    longitude: -92.6379,
    attendees: 156,
    section: "Ongoing",
    status: "Registered", // <-- Set status
  },
  {
    id: "2",
    title: "Dembele Calculus - Education",
    date: "May 17 - Dec 1",
    time: "2:00 PM - 4:00 PM",
    location: "Grambling, Carver Hall 234",
    price: "Free",
    description:
      "Master calculus with Professor Dembele. This comprehensive course covers differential and integral calculus, with practical applications and problem-solving sessions.",
    image: require("../assets/calculus.png"),
    latitude: 32.5251,
    longitude: -92.7146,
    attendees: 45,
    section: "Ongoing",
    status: "Checked-In", // <-- Set status
  },
  {
    id: "3",
    title: "Karaoke - Live Singing",
    date: "Fri, June 11",
    time: "7:00 PM - 11:00 PM",
    location: "Grambling, McDinning",
    price: "$30",
    description:
      "Show off your vocal talents at our weekly karaoke night! Wide selection of songs, great atmosphere, and prizes for the best performers.",
    image: require("../assets/karaoke.png"),
    latitude: 32.5254,
    longitude: -92.7141,
    attendees: 89,
    section: "Today",
    status: "Registered", // <-- Set status
  },
  {
    id: "4",
    title: "Tech Expo 2025",
    date: "Mon, July 7",
    time: "9:00 AM - 5:00 PM",
    location: "Tech Park, Ruston",
    price: "$10",
    description:
      "Experience the future of technology at Tech Expo 2025. Featuring cutting-edge innovations, interactive demos, and inspiring talks from industry leaders.",
    image: require("../assets/karaoke.png"),
    latitude: 32.5295,
    longitude: -92.6379,
    attendees: 234,
    section: "Upcoming",
    status: "Registered", // <-- Set status
  },
  {
    id: "5",
    title: "Jazz Night",
    date: "Sat, July 12",
    time: "8:00 PM - 12:00 AM",
    location: "Downtown Ruston",
    price: "$15",
    description:
      "An evening of smooth jazz and sophisticated ambiance. Local and guest musicians perform classic jazz standards and original compositions.",
    image: require("../assets/karaoke.png"),
    latitude: 32.5232,
    longitude: -92.6379,
    attendees: 67,
    section: "Upcoming",
    status: "Checked-In", // <-- Set status
  },
];

const sections = ["Ongoing", "Today", "Upcoming"];

import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

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

export default function CheckinScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [activeTab, setActiveTab] = useState("Check-In");
  const navSlideAnim = useRef(new Animated.Value(100)).current;

  useEffect(() => {
    Animated.timing(navSlideAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  // Flatten events for FlatList
  const flatEvents = events.map((event) => ({
    ...event,
    key: event.id,
  }));

  const renderEvent = ({ item }: { item: Event }) => (
    <View style={styles.eventItem}>
      <Image source={item.image} style={styles.eventImage} />
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

  // Section headers for FlatList
  const renderSectionHeader = (section: string) => (
    <Text style={styles.sectionTitle}>{section}</Text>
  );

  // Group events by section for rendering headers
  const groupedEvents = sections.flatMap((section) => [
    { type: "header", section, key: `header-${section}` },
    ...flatEvents.filter((e) => e.section === section),
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

      <FlatList
        data={groupedEvents}
        renderItem={({ item }) =>
          "type" in item && item.type === "header"
            ? renderSectionHeader(item.section)
            : renderEvent({ item: item as Event })
        }
        keyExtractor={(item) => item.key || item.section}
        contentContainerStyle={[styles.scrollContainer, { paddingBottom: 120 }]}
        showsVerticalScrollIndicator={false}
        style={{ marginBottom: 0 }}
      />

      {/* Use the reusable BottomNavBar component */}
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
  /*   bottomNav: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 25,
    paddingVertical: 33,
    borderTopWidth: 1,
    borderColor: "#eee",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    backgroundColor: "#7F00FF0D",
    position: "absolute",
    bottom: 0,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  navItem: {
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 10,
  },
  navText: {
    fontSize: 12,
    marginTop: 2,
    color: "#333",
  },
  navSpacer: {
    flex: 1,
  },
  bowlCutout: {
    position: "absolute",
    bottom: 90, // aligns with navbar height
    left: "50%",
    transform: [{ translateX: -45 }, { translateY: 30 }, { rotate: "180deg" }],
    width: 93,
    height: 54,
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    zIndex: 0,
  },

  floatingButton: {
    position: "absolute",
    top: 8,
    left: "38%",
    transform: [{ translateX: -25 }],
    width: 70,
    height: 40,
    backgroundColor: "#7F00FF",
    borderRadius: 23,
    justifyContent: "center",
    alignItems: "center",
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },

  plusText: {
    color: "#fff",
    fontSize: 25,
    fontWeight: "bold",
    marginTop: -2,
  }, */
});
