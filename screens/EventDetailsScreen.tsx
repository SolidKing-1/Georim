import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import MapView, { Marker } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

// Add TypeScript interface for the event props
interface EventDetails {
  id: string;
  title: string;
  date: string;
  time?: string;
  location: string;
  price: string;
  description: string;
  image: any;
  latitude?: number;
  longitude?: number;
  attendees?: number;
}

// Define the navigation param list
type RootStackParamList = {
  EventDetailsScreen: { event: EventDetails };
};

export default function EventDetailsScreen() {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<RootStackParamList, "EventDetailsScreen">>();
  const event = route.params?.event;

  // Default coordinates if not provided
  const coordinates = {
    latitude: event.latitude || 29.4436,
    longitude: event.longitude || -96.9436,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  return (
    <ScrollView style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="chevron-back" size={24} color="#000" />
      </TouchableOpacity>

      {/* Event Image */}
      <Image source={event.image} style={styles.eventImage} />

      {/* Event Title Section */}
      <View style={styles.titleSection}>
        <Text style={styles.title}>{event.title}</Text>
        <View style={styles.tagContainer}>
          <Text style={styles.tag}>{event.price}</Text>
        </View>
      </View>

      {/* Description */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.description}>{event.description}</Text>
      </View>

      {/* Date & Time */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Date & Time</Text>
        <Text style={styles.dateTime}>{event.date}</Text>
        {event.time && <Text style={styles.dateTime}>{event.time}</Text>}
      </View>

      {/* Map */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Map</Text>
        <Text style={styles.location}>{event.location}</Text>
        <MapView style={styles.map} initialRegion={coordinates}>
          <Marker coordinate={coordinates} />
        </MapView>
      </View>

      {/* Further Details */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Further Details</Text>
        <Text style={styles.description}>{event.description}</Text>
      </View>

      {/* Attendees */}
      <View style={styles.section}>
        <View style={styles.attendeesContainer}>
          <View style={styles.avatarStack}>
            {/* Add 3-4 overlapping circular avatars here */}
          </View>
          <Text style={styles.attendeesText}>
            +{event.attendees || 0} people have joined
          </Text>
        </View>
      </View>

      {/* Register Button */}
      <TouchableOpacity style={styles.registerButton}>
        <Text style={styles.registerText}>Register</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
    zIndex: 1,
    backgroundColor: "rgba(255,255,255,0.8)",
    borderRadius: 20,
    padding: 8,
  },
  eventImage: {
    width: width,
    height: 200,
    resizeMode: "cover",
  },
  titleSection: {
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    flex: 1,
  },
  tagContainer: {
    backgroundColor: "#7F00FF",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  tag: {
    color: "#fff",
    fontWeight: "600",
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: "#666",
    lineHeight: 24,
  },
  dateTime: {
    fontSize: 16,
    color: "#333",
    marginBottom: 4,
  },
  location: {
    fontSize: 16,
    color: "#333",
    marginBottom: 8,
  },
  map: {
    height: 200,
    borderRadius: 12,
    marginTop: 8,
  },
  attendeesContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarStack: {
    flexDirection: "row",
    marginRight: 8,
  },
  attendeesText: {
    fontSize: 16,
    color: "#666",
  },
  registerButton: {
    backgroundColor: "#7F00FF",
    margin: 16,
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  registerText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});
