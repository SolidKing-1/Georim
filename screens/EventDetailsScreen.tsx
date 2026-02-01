import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
  FlatList,
  Animated,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { Video, ResizeMode } from "expo-av";
import RegistrationSuccessModal from "../components/RegistrationSuccessModal";
import MapView, { Marker } from "react-native-maps";
import { getToken } from "../utils/auth";
import Constants from "expo-constants";
const { width, height } = Dimensions.get("window");

const BACKEND_URL = Constants.expoConfig?.extra?.BACKEND_URL;

// Updated interface to match API response from getone handler
interface EventDetails {
  _id: string;
  title: string;
  description: string;
  category: "religious" | "corporate" | "entertainment" | "educational";
  visibility: "public" | "private" | "unlisted";
  dateTime: {
    start: string;
    end: string;
  };
  location: {
    venue: string;
    address: {
      street?: string;
      city?: string;
      state?: string;
      zipCode?: string;
    };
    geometry: {
      type: "Point";
      coordinates: [number, number]; // [longitude, latitude]
    };
    accuracy?: number;
  };
  radius: number;
  images?: string[];
  imageUrl?: string;
  recurring?: {
    isRecurring: boolean;
    pattern?: string;
    until?: string;
  };
  creator: string;
  registerations: string[];
  checkins: string[];
  hexcode: string;
  price?: number;
  createdAt: string;
  updatedAt: string;
  // Additional computed fields
  status?: "Registered" | "Checked-In" | "Available";
  attendees?: number;
}

type RootStackParamList = {
  EventDetailsScreen: { eventId: string }; // Changed to pass eventId instead of full event
  PaymentScreen: { event: EventDetails };
};

export default function EventDetailsScreen() {
  const navigation =
    useNavigation<
      import("@react-navigation/native").NavigationProp<RootStackParamList>
    >();
  const route = useRoute<RouteProp<RootStackParamList, "EventDetailsScreen">>();
  const { eventId } = route.params;

  const [event, setEvent] = useState<EventDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollX = new Animated.Value(0);

  const mediaItems = [
    { type: "image", source: require("../assets/event-details/first.jpg") },
    { type: "video", source: require("../assets/event-details/eve-video.mp4") },
    { type: "image", source: require("../assets/event-details/second.jpg") },
  ];

  // Fetch event details from API
  useEffect(() => {
    fetchEventDetails();
  }, [eventId]);

  const fetchEventDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get token from your auth storage (AsyncStorage, SecureStore, etc.)
      const token = await getToken(); // Implement this based on your auth system

      const response = await fetch(`${BACKEND_URL}/events/${eventId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setEvent(data.data);
      } else {
        setError(data.message || "Failed to fetch event details");
      }
    } catch (err) {
      setError("Network error. Please check your connection.");
      console.error("Fetch event error:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const timeOptions: Intl.DateTimeFormatOptions = {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    };
    return `${start.toLocaleTimeString("en-US", timeOptions)} - ${end.toLocaleTimeString("en-US", timeOptions)}`;
  };

  const formatAddress = (address: EventDetails["location"]["address"]) => {
    const parts = [
      address.street,
      address.city,
      address.state,
      address.zipCode,
    ].filter(Boolean);
    return parts.join(", ");
  };

  const BACKEND_URL = Constants.expoConfig?.extra?.BACKEND_URL;

  const handleRegister = async () => {
    if (!event) return;

    try {
      const token = await getToken();

      if (!token) {
        Alert.alert(
          "Authentication Required",
          "Please sign in to register for events",
        );
        return;
      }

      const response = await fetch(
        `${BACKEND_URL}/events/${event._id}/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (response.ok && data.success) {
        setShowModal(true);
        // Update event status locally
        setEvent((prev) => (prev ? { ...prev, status: "Registered" } : prev));
      } else {
        Alert.alert(
          "Registration Failed",
          data.message || "Unable to register for event",
        );
      }
    } catch (err) {
      Alert.alert("Error", "Network error. Please try again.");
      console.error("Registration error:", err);
    }
  };

  const renderMediaItem = ({
    item,
  }: {
    item: { type: string; source: any };
  }) => {
    if (item.type === "image") {
      return <ImageBackground source={item.source} style={styles.mediaItem} />;
    } else if (item.type === "video") {
      return (
        <Video
          source={item.source}
          style={styles.mediaItem}
          useNativeControls
          resizeMode={ResizeMode.COVER}
        />
      );
    }
    return null;
  };

  interface ScrollEvent {
    nativeEvent: {
      contentOffset: {
        x: number;
      };
    };
  }

  const handleScroll = (event: ScrollEvent) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    setActiveIndex(index);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#7F00FF" />
        <Text style={styles.loadingText}>Loading event details...</Text>
      </View>
    );
  }

  if (error || !event) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={48} color="#FF3B30" />
        <Text style={styles.errorText}>{error || "Event not found"}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={fetchEventDetails}
        >
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Extract coordinates (remember API returns [longitude, latitude])
  const [longitude, latitude] = event.location.geometry.coordinates;
  const coordinates = {
    latitude,
    longitude,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  return (
    <View style={styles.container}>
      {/* Background */}
      <ImageBackground
        source={require("../assets/event-details/first.jpg")}
        style={styles.backgroundImage}
        blurRadius={10}
      >
        <View style={styles.colorOverlay} />

        {/* Top Navigation Buttons */}
        <View style={styles.topButtons}>
          <TouchableOpacity
            style={styles.navButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <View style={styles.rightButtons}>
            <TouchableOpacity style={styles.navButton}>
              <Ionicons name="heart-outline" size={24} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.navButton}>
              <Ionicons name="share-outline" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Swipable Media Container */}
        <View style={styles.mediaContainer}>
          <FlatList
            data={mediaItems}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(_, index) => index.toString()}
            renderItem={renderMediaItem}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { x: scrollX } } }],
              { useNativeDriver: false, listener: handleScroll },
            )}
          />
          {/* Dots Indicator */}
          <View style={styles.dotsContainer}>
            {mediaItems.map((_, index) => {
              const isActive = index === activeIndex;
              return (
                <Animated.View
                  key={index}
                  style={[styles.dot, isActive && styles.activeDot]}
                />
              );
            })}
          </View>
        </View>
      </ImageBackground>

      {/* Event Details Overlay */}
      <View style={styles.detailsContainer}>
        {/* Event Title Section */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>{event.title}</Text>
          <View style={styles.tagContainer}>
            <Text style={styles.tag}>
              {event.price ? `$${event.price}` : "Free"}
            </Text>
            <Text style={styles.categoryTag}>{event.category}</Text>
          </View>
        </View>

        {/* Event Code */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Event Code</Text>
          <Text style={styles.hexcode}>{event.hexcode}</Text>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{event.description}</Text>
        </View>

        {/* Date & Time */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Date & Time</Text>
          <Text style={styles.dateTime}>
            {formatDate(event.dateTime.start)}
          </Text>
          <Text style={styles.dateTime}>
            {formatTime(event.dateTime.start, event.dateTime.end)}
          </Text>

          {event.recurring?.isRecurring && (
            <Text style={styles.recurringText}>
              Recurring: {event.recurring.pattern}
            </Text>
          )}
        </View>

        {/* Location & Map */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Location</Text>
          <Text style={styles.venue}>{event.location.venue}</Text>
          {event.location.address && (
            <Text style={styles.address}>
              {formatAddress(event.location.address)}
            </Text>
          )}

          <MapView style={styles.map} initialRegion={coordinates}>
            <Marker
              coordinate={coordinates}
              title={event.location.venue}
              description={formatAddress(event.location.address)}
            />
          </MapView>
        </View>

        {/* Check-in Radius */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Check-in Details</Text>
          <Text style={styles.radiusText}>
            Check-in radius: {event.radius} meters
          </Text>
          {event.location.accuracy && (
            <Text style={styles.accuracyText}>
              Location accuracy: ±{event.location.accuracy}m
            </Text>
          )}
        </View>

        {/* Attendees */}
        <View style={styles.section}>
          <View style={styles.attendeesContainer}>
            <View style={styles.avatarStack}>
              {/* You can implement avatar fetching based on registerations */}
              <View style={[styles.avatar, styles.attendeesCountAvatar]}>
                <Text style={styles.attendeesCountText}>
                  {event.registerations.length > 999
                    ? "1k+"
                    : event.registerations.length}
                </Text>
              </View>
            </View>
            <Text style={styles.attendeesText}>
              {event.registerations.length} people registered
            </Text>
          </View>
        </View>
      </View>

      {/* Fixed Register/Status Button */}
      <View style={styles.fixedButtonContainer}>
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
      </View>

      <RegistrationSuccessModal
        visible={showModal}
        onClose={() => setShowModal(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    width: "100%",
    height: "50%",
  },
  colorOverlay: {
    position: "absolute",
    bottom: 0,
    height: "50%",
    width: "100%",
    backgroundColor: "#331057",
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
  },
  topButtons: {
    position: "absolute",
    top: 50,
    left: 16,
    right: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  navButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  rightButtons: {
    flexDirection: "row",
    gap: 16,
  },
  mediaContainer: {
    position: "absolute",
    top: "25%",
    left: 16,
    right: 16,
    height: height * 0.3,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#fff",
    elevation: 5,
  },
  mediaItem: {
    width: width - 32,
    height: "100%",
    borderRadius: 20,
  },
  dotsContainer: {
    position: "absolute",
    bottom: 16,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#ccc",
  },
  activeDot: {
    width: 24,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#7F00FF",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: "#FF3B30",
    textAlign: "center",
    marginVertical: 16,
  },
  retryButton: {
    backgroundColor: "#7F00FF",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  categoryTag: {
    backgroundColor: "#E3F2FD",
    color: "#1976D2",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 12,
    marginLeft: 8,
  },
  hexcode: {
    fontSize: 18,
    fontWeight: "700",
    color: "#7F00FF",
    letterSpacing: 2,
  },
  venue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  address: {
    fontSize: 14,
    color: "#666",
    marginBottom: 12,
  },
  recurringText: {
    fontSize: 14,
    color: "#7F00FF",
    fontStyle: "italic",
    marginTop: 4,
  },
  radiusText: {
    fontSize: 14,
    color: "#333",
    marginBottom: 4,
  },
  accuracyText: {
    fontSize: 12,
    color: "#666",
  },
  detailsContainer: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    paddingTop: 16,
    paddingBottom: 32,
    paddingHorizontal: 16,
    marginTop: -50,
    elevation: 5,
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 16,
    zIndex: 20, // increased to ensure it's above ScrollView content
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
    marginRight: 12,
    position: "relative",
    height: 36,
    width: 90,
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
  },
  registerButton: {
    backgroundColor: "#7F00FF",
    margin: 16,
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    minWidth: 180,
  },
  registerText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  fixedButtonContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#fff",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    alignItems: "center",
    zIndex: 10,
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
