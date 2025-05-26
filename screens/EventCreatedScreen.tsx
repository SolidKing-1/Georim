import React, { useState } from "react";
import BottomNavBar from "../components/BottomNavBar";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

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
      description: "May 17 - Dec 1 - Grambing, Carver Hall 234 Free",
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
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>{"‹"}</Text>
      </TouchableOpacity>

      {/* Top Banner Image */}
      <Image
        source={require("../assets/CreatedEvent.jpg")}
        style={styles.bannerImage}
        resizeMode="contain"
      />

      {/* Header Bar */}
      <View style={styles.headerBar}>
        <Text style={styles.headerText}>Events Created</Text>
      </View>

      {/* Event List */}
      <FlatList
        data={events}
        keyExtractor={(item) => item.id}
        renderItem={renderEvent}
        contentContainerStyle={styles.eventList}
      />

      {/* Bottom Navbar */}
      <BottomNavBar
        activeTab="Create"
        setActiveTab={() => {}}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
    zIndex: 10,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  backButtonText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#000",
  },
  bannerImage: {
    width: "100%",
    height: 200,
    marginBottom: 10,
  },
  headerBar: {
    backgroundColor: "#7F00FF",
    paddingVertical: 10,
    alignItems: "center",
    marginBottom: 10,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  eventList: {
    paddingHorizontal: 20,
  },
  eventCard: {
    flexDirection: "row",
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
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 10,
  },
  eventDetails: {
    flex: 1,
    justifyContent: "center",
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
