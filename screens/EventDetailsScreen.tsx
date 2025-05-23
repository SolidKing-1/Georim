import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Modal,
  Pressable,
} from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import MapView, { Marker } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

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
  status?: "Registered" | "Checked-In";
}

type RootStackParamList = {
  EventDetailsScreen: { event: EventDetails };
  PaymentScreen: { event: EventDetails };
};

export default function EventDetailsScreen() {
  const navigation =
    useNavigation<
      import("@react-navigation/native").NavigationProp<RootStackParamList>
    >();
  const route = useRoute<RouteProp<RootStackParamList, "EventDetailsScreen">>();
  const event = route.params?.event as EventDetails;

  const [showModal, setShowModal] = useState(false);

  const coordinates = {
    latitude: event.latitude || 29.4436,
    longitude: event.longitude || -96.9436,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  const handleRegister = () => {
    if (event.price.toLowerCase() === "free") {
      setShowModal(true);
      event.status = "Registered";
      // Here you could also update event.status if you want
    } else {
      // Handle paid event registration logic
      navigation.navigate("PaymentScreen", { event });
    }
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
            {/* Overlapping circular avatars */}
            <Image
              source={require("../assets/avatar1.png")}
              style={[styles.avatar, { zIndex: 0, left: 0 }]}
            />
            <Image
              source={require("../assets/avatar2.png")}
              style={[styles.avatar, { zIndex: 1, left: 18 }]}
            />
            <Image
              source={require("../assets/avatar3.png")}
              style={[styles.avatar, { zIndex: 2, left: 36 }]}
            />
            <View
              style={[
                styles.avatar,
                styles.attendeesCountAvatar,
                { left: 54, zIndex: 3 },
              ]}
            >
              <Text style={styles.attendeesCountText}>
                {event.attendees
                  ? event.attendees > 999
                    ? "1k+"
                    : event.attendees
                  : "0"}
              </Text>
            </View>
          </View>
          <Text style={styles.attendeesText}>people have joined</Text>
        </View>
      </View>
      {/* Check-In/Checked-In/Register Button */}
      {event.status === "Registered" ? (
        <View style={[styles.registerButton, { backgroundColor: "#7F00FF" }]}>
          <Text style={styles.registerText}>Registered</Text>
        </View>
      ) : event.status === "Checked-In" ? (
        <View style={[styles.registerButton, { backgroundColor: "#18C964" }]}>
          <Text style={styles.registerText}>Checked-In</Text>
        </View>
      ) : (
        <TouchableOpacity
          style={styles.registerButton}
          onPress={handleRegister}
        >
          <Text style={styles.registerText}>Register</Text>
        </TouchableOpacity>
      )}
      <Modal
        visible={showModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Ionicons
              name="checkmark-circle"
              size={48}
              color="#7F00FF"
              style={{ marginBottom: 12 }}
            />
            <Text style={styles.modalTitle}>Event Registration Successful</Text>
            <Image
              source={require("../assets/registration-success.png")}
              style={styles.modalImage}
              resizeMode="contain"
            />
            <Pressable
              style={styles.modalButton}
              onPress={() => setShowModal(false)}
            >
              <Text style={styles.modalButtonText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
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
    top: 60,
    left: 15,
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
    // Ensure horizontal alignment
  },
  avatarStack: {
    flexDirection: "row",
    marginRight: 12, // More space between avatars and text
    position: "relative",
    height: 36,
    width: 90, // Enough width for all avatars
    alignItems: "center",
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: "#fff",
    position: "absolute",
    backgroundColor: "#eee",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  attendeesCountAvatar: {
    backgroundColor: "#7F00FF",
  },
  attendeesCountText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  attendeesText: {
    fontSize: 16,
    color: "#666",
    // No marginTop, keep vertically centered
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 28,
    alignItems: "center",
    width: "80%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#7F00FF",
    marginBottom: 18,
    textAlign: "center",
  },
  modalImage: {
    width: 180,
    height: 180,
    marginBottom: 18,
  },
  modalButton: {
    backgroundColor: "#7F00FF",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 32,
    marginTop: 8,
  },
  modalButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
