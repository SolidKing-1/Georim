/**
 * EventDetailsScreen - Displays full event details and handles registration.
 *
 * API INTEGRATION OVERVIEW:
 * - GET /events/:eventId - Fetches event details (see fetchEventDetails)
 * - POST /events/:eventId/register - Registers user for event (see handleRegister)
 * - Uses getToken() from utils/auth for Bearer token in API calls
 * - Mock mode: Pass optional `event` in route params for offline/design phase
 * - When API is ready: Pass only eventId; remove mockEventToDetails and optional event param
 */
import React, { useState, useEffect, useRef } from "react";
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
  ActivityIndicator,
  Alert,
} from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import MapView, { Marker } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";
import RegistrationSuccessModal from "../components/RegistrationSuccessModal";
import TicketSelectionModal, {
  type TicketSelectionModalRef,
  type TicketTier,
} from "../components/TicketSelectionModal";
import { getToken } from "../utils/auth";
import Constants from "expo-constants";
import type { RootStackParamList } from "../App";

const { width } = Dimensions.get("window");

// Space reserved at bottom for navbar overlay (MainLayout bottom: 16 + Navbar height ~68)
const BOTTOM_NAVBAR_OFFSET = 90;

// -----------------------------------------------------------------------------
// API INTEGRATION: BACKEND_URL is set in app.config.js via process.env.BACKEND_URL
// Ensure .env has BACKEND_URL=https://your-api.example.com
// -----------------------------------------------------------------------------
const BACKEND_URL = Constants.expoConfig?.extra?.BACKEND_URL;

// -----------------------------------------------------------------------------
// API INTEGRATION: EventDetails interface matches the backend API response shape.
// GET /events/:id returns { success: true, data: EventDetails }
// Update this interface if your API response structure differs.
// -----------------------------------------------------------------------------
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

/**
 * Transforms mock/list event shape (from EventCard) into full EventDetails shape.
 * API INTEGRATION: Remove this when all event data comes from the API.
 */
function mockEventToDetails(mock: any): EventDetails & { image?: any } {
  const id = mock._id ?? mock.id ?? "mock";
  const result: EventDetails & { image?: any } = {
    _id: id,
    title: mock.title ?? mock.name ?? "Event",
    description: mock.description ?? "",
    category: mock.category ?? "entertainment",
    visibility: "public",
    dateTime: {
      start: mock.dateTime?.start ?? mock.date ?? new Date().toISOString(),
      end: mock.dateTime?.end ?? new Date().toISOString(),
    },
    location: {
      venue: mock.location ?? mock.venue ?? "",
      address: {
        street: mock.address?.street,
        city:
          mock.address?.city ??
          (typeof mock.location === "string" ? mock.location : ""),
        state: mock.address?.state,
        zipCode: mock.address?.zipCode,
      },
      geometry: {
        type: "Point" as const,
        coordinates: mock.location?.geometry?.coordinates ?? [-93.76, 32.51],
      },
    },
    radius: mock.radius ?? 100,
    images: mock.images,
    imageUrl:
      typeof mock.image === "object" && mock.image?.uri
        ? mock.image.uri
        : undefined,
    video: mock.video,
    creator: mock.creator ?? "",
    registerations:
      mock.registerations ?? mock.attendees
        ? Array(mock.attendees).fill("")
        : [],
    checkins: mock.checkins ?? [],
    hexcode: mock.hexcode ?? "XXXX",
    price:
      typeof mock.price === "string"
        ? parseFloat(mock.price.replace(/[^0-9.]/g, "")) || undefined
        : mock.price,
    createdAt: mock.createdAt ?? new Date().toISOString(),
    updatedAt: mock.updatedAt ?? new Date().toISOString(),
    status: mock.status ?? "Available",
    attendees: mock.attendees ?? mock.registerations?.length ?? 0,
  };
  if (mock.image != null) result.image = mock.image; // Preserve require() for local images
  return result;
}

export default function EventDetailsScreen() {
  const navigation =
    useNavigation<
      import("@react-navigation/native").NavigationProp<RootStackParamList>
    >();
  const route = useRoute<RouteProp<RootStackParamList, "EventDetails">>();
  const { eventId, event: passedEvent } = route.params;

  const [event, setEvent] = useState<EventDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const ticketModalRef = useRef<TicketSelectionModalRef>(null);

  // API INTEGRATION: When optional `event` is passed (e.g. from mock data), use it directly.
  // When connected to API, screens should pass only eventId and this block can be removed.
  useEffect(() => {
    if (passedEvent) {
      setEvent(mockEventToDetails(passedEvent));
      setLoading(false);
      setError(null);
      return;
    }
    fetchEventDetails();
  }, [eventId, passedEvent]);

  // -----------------------------------------------------------------------------
  // API INTEGRATION: GET /events/:eventId
  // Fetches full event details. Response: { success: boolean, data?: EventDetails, message?: string }
  // Add query params if needed (e.g. ?include=attendees). Handle 401/403 for auth.
  // -----------------------------------------------------------------------------
  const fetchEventDetails = async () => {
    if (!BACKEND_URL) {
      setError("Backend URL not configured. Set BACKEND_URL in .env");
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError(null);

      const token = await getToken();

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
        setError(data.message ?? "Failed to fetch event details");
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
    return `${start.toLocaleTimeString(
      "en-US",
      timeOptions
    )} - ${end.toLocaleTimeString("en-US", timeOptions)}`;
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

  // -----------------------------------------------------------------------------
  // API INTEGRATION: POST /events/:eventId/register
  // Registers the current user for the event. Response: { success, data?, message? }
  // Handle paid events (redirect to PaymentScreen if payment required).
  // -----------------------------------------------------------------------------
  const handleRegister = async () => {
    if (!event) return;

    try {
      const token = await getToken();

      if (!token) {
        Alert.alert(
          "Authentication Required",
          "Please sign in to register for events"
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
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        setShowModal(true);
        // Update event status locally
        setEvent((prev) => (prev ? { ...prev, status: "Registered" } : prev));
      } else {
        Alert.alert(
          "Registration Failed",
          data.message || "Unable to register for event"
        );
      }
    } catch (err) {
      Alert.alert("Error", "Network error. Please try again.");
      console.error("Registration error:", err);
    }
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
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* Fixed Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="chevron-back" size={24} color="#000" />
      </TouchableOpacity>

      <ScrollView
        style={styles.container}
        contentContainerStyle={{
          paddingBottom: 140 + BOTTOM_NAVBAR_OFFSET, // Button area + navbar clearance
        }}
      >
        {/* Event Image - API returns imageUrl or images[0]; mock may pass image as require() */}
        <Image
          source={
            event.imageUrl
              ? { uri: event.imageUrl }
              : event.images?.[0]
              ? { uri: event.images[0] }
              : typeof (event as any).image === "number"
              ? (event as any).image
              : require("../assets/coding_bootcamp.jpg")
          }
          style={styles.eventImage}
        />

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
      </ScrollView>

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
            onPress={() => ticketModalRef.current?.present()}
          >
            <Text style={styles.registerText}>Register</Text>
          </TouchableOpacity>
        )}
      </View>

      <TicketSelectionModal
        ref={ticketModalRef}
        eventTitle={event.title}
        eventDescription={event.description}
        onClose={() => {}}
        onSelectTicket={(tier: TicketTier) => {
          ticketModalRef.current?.dismiss();
          navigation.navigate("RegisterEvent", {
            eventId: event._id,
            event: event as any,
            selectedTier: { id: tier.id, title: tier.title, price: tier.price },
          });
        }}
      />

      <RegistrationSuccessModal
        visible={showModal}
        onClose={() => setShowModal(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
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
  container: {
    flex: 1,
    backgroundColor: "#fff",
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
    bottom: BOTTOM_NAVBAR_OFFSET,
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
