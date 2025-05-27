import React, { useRef, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Animated,
  Dimensions,
} from "react-native";
import BottomNavComplete from "../components/BottomNavComplete";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");
const FavouriteScreen = ({ route }: any) => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState("Favourites");
  const navSlideAnim = useRef(new Animated.Value(100)).current;

  useEffect(() => {
    Animated.timing(navSlideAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  // Track which events are favourited
  const [favourites, setFavourites] = useState<{ [key: string]: boolean }>({
    "1": true,
    "2": true,
    "3": true,
    "4": true,
    "5": true,
    "6": true,
    "7": true,
    "8": true,
    "9": true,
  });

  const events = [
    {
      id: "1",
      title: "Karaoke - Live Singing",
      date: "Fri, June 11 - Grambling, McDinning",
      price: "$30",
      image: require("../assets/karaoke.png"),
    },
    {
      id: "2",
      title: "Grambling vs LA Tech",
      date: "Fri, June 11 - LA Sports Stadium",
      price: "Free",
      image: require("../assets/football.png"),
    },
    {
      id: "3",
      title: "Marry's Social Science Class",
      date: "Fri, June 11 - Grambling,SOC Faculty",
      price: "Free",
      image: require("../assets/ruston-fest.png"),
    },
    {
      id: "4",
      title: "Open Mic Night",
      date: "Sat, June 12 - Grambling, McDinning",
      price: "$10",
      image: require("../assets/karaoke.png"),
    },
    {
      id: "5",
      title: "Tech Soccer Finals",
      date: "Sun, June 13 - LA Sports Stadium",
      price: "Free",
      image: require("../assets/football.png"),
    },
    {
      id: "6",
      title: "Science Seminar",
      date: "Mon, June 14 - Grambling, SOC Faculty",
      price: "Free",
      image: require("../assets/ruston-fest.png"),
    },
    {
      id: "7",
      title: "Live Band Night",
      date: "Tue, June 15 - Grambling, McDinning",
      price: "$20",
      image: require("../assets/karaoke.png"),
    },
    {
      id: "8",
      title: "LA Tech vs Grambling Basketball",
      date: "Wed, June 16 - LA Sports Stadium",
      price: "Free",
      image: require("../assets/football.png"),
    },
    {
      id: "9",
      title: "Social Science Workshop",
      date: "Thu, June 17 - Grambling, SOC Faculty",
      price: "Free",
      image: require("../assets/ruston-fest.png"),
    },
  ];

  // Toggle favourite state
  const toggleFavourite = (id: string) => {
    setFavourites((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Handle event title click
  const handleEventTitlePress = (event: any) => {
    // Example: navigate to EventDetails, or show alert
    // navigation.navigate("EventDetails", { eventId: event.id });
    alert(`Clicked on "${event.title}"`);
  };

  return (
    <View style={styles.container}>
      {/* Top Illustration */}
      <Image
        source={require("../assets/top_image.jpg")}
        style={styles.topImage}
        resizeMode="contain"
      />

      {/* Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="chevron-back" size={24} color="#000" />
      </TouchableOpacity>

      {/* Card-like Section (now scrollable) */}
      <View style={styles.cardSection}>
        <Text style={styles.favouritesTitle}>Favourites</Text>
        <ScrollView
          style={styles.scrollableEvents}
          contentContainerStyle={{ paddingBottom: 16 }}
          showsVerticalScrollIndicator={false}
        >
          {events.map((event) => (
            <View key={event.id} style={styles.eventContainer}>
              <Image source={event.image} style={styles.eventImage} />
              <View style={styles.eventDetails}>
                <TouchableOpacity onPress={() => handleEventTitlePress(event)}>
                  <Text style={styles.eventTitle}>{event.title}</Text>
                </TouchableOpacity>
                <Text style={styles.eventDate}>{event.date}</Text>
                <Text style={styles.eventPrice}>{event.price}</Text>
              </View>
              <TouchableOpacity onPress={() => toggleFavourite(event.id)}>
                <Ionicons
                  name={favourites[event.id] ? "heart" : "heart-outline"}
                  size={22}
                  color="#7F00FF"
                  style={styles.heartIcon}
                />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Bottom Navbar */}
      <BottomNavComplete
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        navSlideAnim={navSlideAnim}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 16,
    zIndex: 20,
    backgroundColor: "rgba(255,255,255,0.8)",
    borderRadius: 20,
    padding: 8,
  },
  topImage: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
  },
  cardSection: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginHorizontal: 8,
    marginTop: 8,
    padding: 0,
    paddingBottom: 0,
    flex: 1,
    minHeight: 350,
    maxHeight: 500,
    overflow: "hidden",
  },
  scrollableEvents: {
    flex: 1,
    paddingTop: 0,
    paddingHorizontal: 0,
  },
  favouritesTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 10,
    marginLeft: 16,
    marginBottom: 24,
    color: "#181818",
  },
  eventContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    marginHorizontal: 12,
    marginBottom: 12,
    padding: 8,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
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
    fontSize: 15,
    fontWeight: "bold",
    color: "#181818",
    marginBottom: 2,
    textDecorationLine: "underline",
  },
  eventDate: {
    fontSize: 13,
    color: "#444",
  },
  eventPrice: {
    fontSize: 13,
    color: "#444",
  },
  heartIcon: {
    marginLeft: 8,
  },
});

export default FavouriteScreen;
