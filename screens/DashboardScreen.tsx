import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { Video, ResizeMode } from "expo-av";

const DashboardScreen = () => {
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
      image: require("../assets/Home/event-1.jpg"),
    },
    {
      id: 2,
      name: "Jazz Fest 2025",
      location: "New Orleans, LA · Music Hall",
      attendees: 95,
      rating: 4.6,
      image: require("../assets/Home/event-2.png"),
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
    <View style={styles.container}>
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
            resizeMode="contain"
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
        <Video
          source={require("../assets/Home/play.mp4")} // Updated to use play.mp4 from assets/Home
          style={styles.video}
          isLooping
          shouldPlay
          resizeMode={ResizeMode.COVER}
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

      <View style={styles.horizontalScrollContainer}>
        <View style={styles.cardsContainer}>
          {events.map((event) => (
            <View key={event.id} style={styles.card}>
              {/* Top Section: Event Image */}
              <View style={styles.cardImageContainer}>
                <Image source={event.image} style={styles.cardImage} />

                {/* Date at Top Left */}
                <View style={styles.dateContainer}>
                  <Text style={styles.dateMonth}>{month}</Text>
                  <Text style={styles.dateDay}>{day}</Text>
                </View>

                {/* Save Icon at Top Right */}
                <TouchableOpacity style={styles.saveIconContainer}>
                  <FontAwesome name="bookmark" size={20} color="#fff" />
                </TouchableOpacity>

                {/* Rounded Containers at Bottom Edge */}
                <View style={styles.bottomLabels}>
                  <View style={styles.labelLeft}>
                    <FontAwesome name="star" size={12} color="#fff" />
                    <Text style={styles.labelText}>New</Text>
                  </View>
                  <View style={styles.labelRight}>
                    <FontAwesome name="gift" size={12} color="#fff" />
                    <Text style={styles.labelText}>Free</Text>
                  </View>
                </View>
              </View>

              {/* Bottom Section: Event Details */}
              <View style={styles.cardDetails}>
                <Text style={styles.eventName}>{event.name}</Text>
                <View style={styles.eventLocation}>
                  <FontAwesome name="map-marker" size={14} color="#888" />
                  <Text style={styles.locationText}>{event.location}</Text>
                </View>
                <View style={styles.attendeesContainer}>
                  <View style={styles.attendeeImages}>
                    {[...Array(4)].map((_, index) => (
                      <Image
                        key={index}
                        source={require("../assets/Home/headshot.png")}
                        style={[
                          styles.attendeeImage,
                          index !== 0 && { marginLeft: -10 },
                        ]}
                      />
                    ))}
                  </View>
                  <Text style={styles.attendeesText}>
                    {event.attendees} + Attending
                  </Text>
                </View>
                <View style={styles.cardRating}>
                  <Text style={styles.ratingText}>{event.rating}</Text>
                  <FontAwesome name="star" size={14} color="gold" />
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Events Near Me Section */}
      <View style={styles.trendingHeader}>
        <Text style={styles.trendingText}>Events Near Me</Text>
        <TouchableOpacity>
          <Text style={styles.seeAllLink}>See all</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.horizontalScrollContainer}>
        <View style={styles.cardsContainer}>
          {events.map((event) => (
            <View key={event.id} style={styles.card}>
              {/* Top Section: Event Image */}
              <View style={styles.cardImageContainer}>
                <Image source={event.image} style={styles.cardImage} />

                {/* Date at Top Left */}
                <View style={styles.dateContainer}>
                  <Text style={styles.dateMonth}>{month}</Text>
                  <Text style={styles.dateDay}>{day}</Text>
                </View>

                {/* Save Icon at Top Right */}
                <TouchableOpacity style={styles.saveIconContainer}>
                  <FontAwesome name="bookmark" size={20} color="#fff" />
                </TouchableOpacity>

                {/* Rounded Containers at Bottom Edge */}
                <View style={styles.bottomLabels}>
                  <View style={styles.labelLeft}>
                    <FontAwesome name="star" size={12} color="#fff" />
                    <Text style={styles.labelText}>New</Text>
                  </View>
                  <View style={styles.labelRight}>
                    <FontAwesome name="gift" size={12} color="#fff" />
                    <Text style={styles.labelText}>Free</Text>
                  </View>
                </View>
              </View>

              {/* Bottom Section: Event Details */}
              <View style={styles.cardDetails}>
                <Text style={styles.eventName}>{event.name}</Text>
                <View style={styles.eventLocation}>
                  <FontAwesome name="map-marker" size={14} color="#888" />
                  <Text style={styles.locationText}>{event.location}</Text>
                </View>
                <View style={styles.attendeesContainer}>
                  <View style={styles.attendeeImages}>
                    {[...Array(4)].map((_, index) => (
                      <Image
                        key={index}
                        source={require("../assets/Home/headshot.png")}
                        style={[
                          styles.attendeeImage,
                          index !== 0 && { marginLeft: -10 },
                        ]}
                      />
                    ))}
                  </View>
                  <Text style={styles.attendeesText}>
                    {event.attendees} + Attending
                  </Text>
                </View>
                <View style={styles.cardRating}>
                  <Text style={styles.ratingText}>{event.rating}</Text>
                  <FontAwesome name="star" size={14} color="gold" />
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#421570",
    padding: 16,
    paddingTop: 48,
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
