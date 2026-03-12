import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Image } from "expo-image";
import { FontAwesome } from "@expo/vector-icons";
import { useVideoPlayer, VideoView } from "expo-video";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import EventCard from "../components/EventCard";
import type { RootStackParamList } from "../App";

type Nav = NativeStackNavigationProp<RootStackParamList, "Dashboard">;

const DashboardScreen = () => {
  const navigation = useNavigation<Nav>();
  const featuredPlayer = useVideoPlayer(
    require("../assets/Home/play.mp4"),
    (player) => {
      player.loop = true;
      player.play();
    }
  );

  const userName = "John Doe"; // Replace with dynamic user data
  const firstName = userName.split(" ")[0];
  const ticketCount = 2;

  const events = [
    {
      id: 1,
      name: "Ultra Music Festival, 2025",
      location: "Grambling, LA · Digital Library",
      attendees: 120,
      rating: 4.8,
      images: [
        require("../assets/Home/event-1.jpg"),
        require("../assets/ruston-fest.png"),
      ],
      video: require("../assets/Home/play.mp4"),
    },
    {
      id: 2,
      name: "Jazz Fest 2025",
      location: "New Orleans, LA · Music Hall",
      attendees: 95,
      rating: 4.6,
      images: [
        require("../assets/Home/event-2.png"),
        require("../assets/Home/event-3.jpg"),
      ],
      video: require("../assets/Home/play.mp4"),
    },
    {
      id: 3,
      name: "Rock the Night, 2025",
      location: "Austin, TX · Open Arena",
      attendees: 150,
      rating: 4.9,
      image: require("../assets/Home/event-3.jpg"), // Updated image for id: 3
    },
    {
      id: 4,
      name: "Classical Evenings, 2025",
      location: "San Francisco, CA · Symphony Hall",
      attendees: 80,
      rating: 4.7,
      image: require("../assets/Home/event-3.jpg"),
    },
  ];

  const getCurrentDate = () => {
    const date = new Date();
    const month = date.toLocaleString("default", { month: "short" }); // Get month in shorthand
    const day = date.getDate();
    return { month, day };
  };

  const { month, day } = getCurrentDate();

  return (
    <LinearGradient
      colors={["#0E0D32", "#060616", "#060616"]}
      locations={[0, 0.35, 1]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={styles.container}
    >
      <Image
        source={require("../assets/homePage/birthday-decoration.png")}
        style={styles.topDecoration}
        contentFit="cover"
      />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Section */}
        <View style={styles.topSection}>
          {/* Profile */}
          <View style={styles.profileContainer}>
            <View style={styles.profileCircle}>
              <Image
                source={require("../assets/Home/profile.jpg")}
                style={styles.profileImage}
              />
            </View>
            <Text style={styles.profileName}>{userName}</Text>
          </View>

          {/* Greeting */}
          <View style={styles.greetingContainer}>
            <Text style={styles.greetingText}>
              Hello, <Text>{firstName}</Text>
            </Text>
            <Image
              source={require("../assets/Home/arrow.jpg")}
              style={styles.arrowImage}
              contentFit="contain"
            />
          </View>

          {/* Ticket Icon */}
          <View style={styles.ticketContainer}>
            <FontAwesome name="ticket" size={32} color="black" />
            {ticketCount > 0 && (
              <View style={styles.ticketBadge}>
                <Text style={styles.ticketBadgeText}>{ticketCount}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Featured Header Row */}
        <View style={styles.featuredRow}>
          <Text style={styles.featuredText}>Featured</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllLink}>See all</Text>
          </TouchableOpacity>
        </View>

        {/* Video Section */}
        <View style={styles.videoSection}>
          <VideoView
            player={featuredPlayer}
            style={styles.video}
            contentFit="cover"
            nativeControls={false}
          />

          <TouchableOpacity style={styles.bookNowButton}>
            <Text style={styles.bookNowText}>Book Now</Text>
          </TouchableOpacity>

          <View style={styles.ratingContainer}>
            <Text style={styles.ratingTextVideo}>4.5</Text>
            <FontAwesome name="star" size={16} color="gold" />
          </View>
        </View>

        {/* Trending Events Section */}
        <View style={styles.trendingHeader}>
          <Text style={styles.trendingText}>Trending Events</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllLink}>See all</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingLeft: 20, paddingRight: 0 }}
          style={{ marginRight: -16 }}
        >
          {events.map((event) => (
            <EventCard
              key={event.id}
              image={(event as any).images?.[0] ?? event.image}
              title={event.name}
              location={event.location}
              attendees={event.attendees}
              rating={event.rating.toFixed(1)}
              month={month}
              day={String(day)}
              onPress={() =>
                navigation.navigate("EventDetails", {
                  eventId: String(event.id),
                  event: {
                    ...event,
                    id: event.id,
                    title: event.name,
                    location: event.location,
                    attendees: event.attendees,
                    image: (event as any).images?.[0] ?? event.image,
                    images: (event as any).images,
                    video: (event as any).video,
                  },
                })
              }
            />
          ))}
        </ScrollView>

        {/* Events Near Me Section */}
        <View style={styles.trendingHeader}>
          <Text style={styles.trendingText}>Events Near Me</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllLink}>See all</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingLeft: 20, paddingRight: 0 }}
          style={{ marginRight: -16 }}
        >
          {events.map((event) => (
            <EventCard
              key={event.id}
              image={(event as any).images?.[0] ?? event.image}
              title={event.name}
              location={event.location}
              attendees={event.attendees}
              rating={event.rating.toFixed(1)}
              month={month}
              day={String(day)}
              onPress={() =>
                navigation.navigate("EventDetails", {
                  eventId: String(event.id),
                  event: {
                    ...event,
                    id: event.id,
                    title: event.name,
                    location: event.location,
                    attendees: event.attendees,
                    image: (event as any).images?.[0] ?? event.image,
                    images: (event as any).images,
                    video: (event as any).video,
                  },
                })
              }
            />
          ))}
        </ScrollView>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topDecoration: {
    position: "absolute",
    top: 60,
    alignSelf: "center",
    width: "80%",
    height: "80%",
    resizeMode: "cover",
    opacity: 0.1,
    zIndex: 0,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingTop: 48,
    paddingBottom: 100, // Space for bottom navbar
  },
  bottomNavContainer: {
    position: "absolute",
    bottom: 16,
    left: 0,
    right: 0,
    backgroundColor: "transparent",
  },

  topSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },

  profileContainer: {
    alignItems: "center",
  },

  profileCircle: {
    width: 40,
    height: 40,
    borderRadius: 30,
    overflow: "hidden",
    backgroundColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
  },

  profileImage: {
    width: "100%",
    height: "100%",
  },

  profileName: {
    marginTop: 1,
    fontSize: 12,
    fontWeight: "bold",
  },

  greetingContainer: {
    alignItems: "center",
  },

  greetingText: {
    fontSize: 16,
    fontWeight: "bold",
  },

  arrowImage: {
    width: 150,
    height: 20,
  },

  ticketContainer: {
    position: "relative",
  },

  ticketBadge: {
    position: "absolute",
    bottom: -4,
    right: -4,
    borderRadius: 8,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },

  ticketBadgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },

  /* NEW: Featured + See all row */
  featuredRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },

  featuredText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },

  seeAllLink: {
    fontSize: 14,
    fontWeight: "semibold",
    color: "#fff",
    textDecorationLine: "underline",
  },

  videoSection: {
    position: "relative",
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#000",
    height: 170,
    width: 330,
    marginBottom: 16,
    alignSelf: "center",
  },

  video: {
    width: "100%",
    height: "100%",
  },

  bookNowButton: {
    position: "absolute",
    bottom: 23,
    left: 18,
    backgroundColor: "#ff5722",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },

  bookNowText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },

  ratingContainer: {
    position: "absolute",
    top: 8,
    right: 8,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },

  ratingTextVideo: {
    marginRight: 4,
    fontSize: 14,
    fontWeight: "bold",
  },

  /* Trending Events Header */
  trendingHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  trendingText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },

  /* Horizontal Scroll Container */
  horizontalScrollContainer: {
    flexDirection: "row",
  },
  cardsContainer: {
    flexDirection: "row", // Horizontal layout for cards
  },
  card: {
    width: 250,
    height: 210, // Fixed width for horizontal cards
    backgroundColor: "#fff",
    borderRadius: 16,
    overflow: "hidden",
    marginRight: 16, // Spacing between cards
    elevation: 2, // For shadow on Android
    shadowColor: "#000", // For shadow on iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardImageContainer: {
    position: "relative",
  },
  cardImage: {
    width: "100%",
    height: 120,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },

  /* Date at Top Left */
  dateContainer: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Blurry square
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  dateMonth: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#fff",
    textTransform: "uppercase",
  },
  dateDay: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },

  /* Save Icon at Top Right */
  saveIconContainer: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 16,
    padding: 8,
  },

  /* Rounded Containers at Bottom Edge */
  bottomLabels: {
    position: "absolute",
    bottom: 8,
    left: 8,
    right: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  labelLeft: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ff5722",
    borderRadius: 16,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  labelRight: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4caf50",
    borderRadius: 16,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  labelText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#fff",
    marginLeft: 4,
  },

  /* Attendee Images */
  attendeeImage: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#fff",
  },

  attendeeImages: {
    flexDirection: "row",
    alignItems: "center",
  },

  attendeesContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  attendeesText: {
    marginLeft: 8, // Add spacing between the images and the text
    fontSize: 12,
    color: "#888",
  },
  cardDetails: {
    padding: 12,
  },
  eventName: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  eventLocation: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  locationText: {
    marginLeft: 4,
    fontSize: 12,
    color: "#888",
  },
  cardRating: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    top: -26,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 4,
    color: "#333",
  },
});

export default DashboardScreen;
