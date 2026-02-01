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
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import * as Animatable from "react-native-animatable";

// Dummy event data for testing
const dummyEvent = {
  id: "1",
  title: "Test Event",
  date: "2025-06-10",
  time: "10:00 AM",
  location: "Test Venue, Test City",
  price: "Free",
  description: "This is a dummy event for testing check-in.",
  image: require("../assets/checkin-illustration.jpg"),
  status: "Registered",
  key: "1",
  section: "Ongoing", // Add this line
};

const sections = ["Ongoing", "Today", "Upcoming"];

export default function CheckinScreen() {
  const navigation = useNavigation<CheckinScreenNavigationProp>();
  const [activeTab, setActiveTab] = useState("Check-In");
  const navSlideAnim = useRef(new Animated.Value(100)).current;

  // Only use dummy event for now
  const [events, setEvents] = useState([dummyEvent]);
  const [loading, setLoading] = useState(false);

  // Emoji animation for empty state (not used here, but kept for structure)
  const emojiList = ["🕵️‍♂️", "🔍", "😔", "📭", "🗒️", "🕳️", "🕰️"];
  const [emojiIndex] = useState(0);

  useEffect(() => {
    Animated.timing(navSlideAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const renderEvent = ({ item }: { item: typeof dummyEvent }) => (
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
            onPress={() =>
              navigation.navigate("EventDetails", {
                eventId: item._id ?? item.id ?? "unknown",
                event: item,
              })
            }
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

  // Group dummy event under "Ongoing" section
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

      <FlatList
        data={groupedEvents}
        renderItem={({ item }) =>
          "type" in item && item.type === "header"
            ? renderSectionHeader(item.section)
            : renderEvent({ item: item as typeof dummyEvent })
        }
        keyExtractor={(item) => item.key || item.section}
        contentContainerStyle={[
          styles.scrollContainer,
          { paddingBottom: 120 },
        ]}
        showsVerticalScrollIndicator={false}
        style={{ marginBottom: 0 }}
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
