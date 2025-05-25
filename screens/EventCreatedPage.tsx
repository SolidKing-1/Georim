import React, { useState } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useNavigation } from "@react-navigation/native"; // Import navigation hook

type Event = {
  id: string;
  title: string;
  description: string;
  image: any;
};

const EventCreatedPage = () => {
  const navigation = useNavigation(); // Initialize navigation

  const [events, setEvents] = useState<Event[]>([
    {
      id: "1",
      title: "Ruston Fest!!! - Revival",
      description: "Sat, May 17 - LA Tech Basketball Stadium Free",
      image: require("../assets/ruston-fest.png"),
    },
    {
      id: "2",
      title: "Dembele Calculus - Education",
      description: "May 17 - Dec - Grambing, Carver Hall 234 Free",
      image: require("../assets/calculus.png"),
    },
  ]);

  const renderEvent = ({ item }: { item: Event }) => (
    <TouchableOpacity style={styles.eventCard}>
      <Image source={item.image} style={styles.eventImage} resizeMode="cover" />
      <View style={styles.eventDetails}>
        <Text style={styles.eventTitle}>{item.title}</Text>
        <Text style={styles.eventDescription}>{item.description}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>{"‹"}</Text>
      </TouchableOpacity>

      {/* Add the image at the top */}
      <Image
        source={require("../assets/CreatedEvent.jpg")}
        style={styles.image}
        resizeMode="contain"
      />

      {/* Horizontal bar with "Events Created" */}
      <View style={styles.headerBar}>
        <Text style={styles.headerText}>Events Created</Text>
      </View>

      <FlatList
        data={events}
        keyExtractor={(item) => item.id}
        renderItem={renderEvent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  backButton: {
    position: "absolute",
    top: 40, // Adjust based on your design
    left: 20,
    zIndex: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 20,
    padding: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  backButtonText: {
    fontSize: 28, // Increased font size for a larger symbol
    fontWeight: "bold",
    color: "#000", // Changed color to black
  },
  image: {
    width: "100%",
    height: 200,
    marginBottom: 20,
  },
  headerBar: {
    backgroundColor: "#7F00FF", // Violet background
    paddingVertical: 10,
    alignItems: "center",
    marginBottom: 20,
    marginHorizontal: -20, // Override the container's horizontal padding
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff", // White text
  },
  eventCard: {
    flexDirection: "row", // Align image and text side by side
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
    width: 60, // Smaller image width
    height: 60, // Smaller image height
    borderRadius: 8,
    marginRight: 10, // Space between image and text
  },
  eventDetails: {
    flex: 1, // Take up the remaining space
    justifyContent: "center", // Center text vertically
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  eventDescription: {
    fontSize: 14,
    color: "#666",
  },
});

export default EventCreatedPage;