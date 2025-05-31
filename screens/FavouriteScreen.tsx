import React, { useRef, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  Animated,
  Dimensions,
} from "react-native";
import BottomNavComplete from "../components/BottomNavComplete";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import type { StackNavigationProp } from "@react-navigation/stack";

type EventType = (typeof events)[number];

type RootStackParamList = {
  EventDetails: { event: EventType };
};

const { width } = Dimensions.get("window");

// Dummy data for events
const events = [
  {
    id: "1",
    title: "Ruston Fest!!! - Revival",
    date: "Sat, May 17",
    time: "4:00 PM - 10:00 PM",
    location: "LA Tech Basketball Stadium",
    price: "Free",
    description:
      "Join us for the biggest festival in Ruston! Featuring live music, food vendors, local artisans, and family-friendly activities. A celebration of our community's culture and spirit.",
    image: require("../assets/ruston-fest.png"),
    latitude: 32.5272,
    longitude: -92.6379,
    attendees: 156,
  },
  {
    id: "2",
    title: "Dembele Calculus - Education",
    date: "May 17 - Dec 1",
    time: "2:00 PM - 4:00 PM",
    location: "Grambling, Carver Hall 234",
    price: "Free",
    description:
      "Master calculus with Professor Dembele. This comprehensive course covers differential and integral calculus, with practical applications and problem-solving sessions.",
    image: require("../assets/calculus.png"),
    latitude: 32.5251,
    longitude: -92.7146,
    attendees: 45,
  },
  {
    id: "3",
    title: "Karaoke - Live Singing",
    date: "Fri, June 11",
    time: "7:00 PM - 11:00 PM",
    location: "Grambling, McDinning",
    price: "$30",
    description:
      "Show off your vocal talents at our weekly karaoke night! Wide selection of songs, great atmosphere, and prizes for the best performers.",
    image: require("../assets/karaoke.png"),
    latitude: 32.5254,
    longitude: -92.7141,
    attendees: 89,
  },
  {
    id: "4",
    title: "Tech Expo 2025",
    date: "Mon, July 7",
    time: "9:00 AM - 5:00 PM",
    location: "Tech Park, Ruston",
    price: "$10",
    description:
      "Experience the future of technology at Tech Expo 2025. Featuring cutting-edge innovations, interactive demos, and inspiring talks from industry leaders.",
    image: require("../assets/tech_expo.png"),
    latitude: 32.5295,
    longitude: -92.6379,
    attendees: 234,
  },
  {
    id: "5",
    title: "Jazz Night",
    date: "Sat, July 12",
    time: "8:00 PM - 12:00 AM",
    location: "Downtown Ruston",
    price: "$15",
    description:
      "An evening of smooth jazz and sophisticated ambiance. Local and guest musicians perform classic jazz standards and original compositions.",
    image: require("../assets/jazz_night.png"),
    latitude: 32.5232,
    longitude: -92.6379,
    attendees: 67,
  },
  {
    id: "6",
    title: "Startup Pitch",
    date: "Wed, Aug 2",
    time: "1:00 PM - 4:00 PM",
    location: "Innovation Hub",
    price: "Free",
    description:
      "Watch promising startups pitch their ideas to investors. Network with entrepreneurs and learn about the latest innovations in technology and business.",
    image: require("../assets/startup_pitch.jpg"),
    latitude: 32.5272,
    longitude: -92.6379,
    attendees: 112,
  },
  {
    id: "7",
    title: "Food Truck Festival",
    date: "Sun, Aug 15",
    time: "11:00 AM - 8:00 PM",
    location: "Ruston Park",
    price: "$5",
    description:
      "A culinary adventure featuring the best food trucks in the region. Enjoy diverse cuisines, live music, and family entertainment.",
    image: require("../assets/food_truck.jpg"),
    latitude: 32.5272,
    longitude: -92.6379,
    attendees: 445,
  },
  {
    id: "8",
    title: "Coding Bootcamp",
    date: "Sep 1 - Sep 30",
    time: "9:00 AM - 3:00 PM",
    location: "Online",
    price: "$99",
    description:
      "Intensive coding bootcamp covering web development fundamentals. Learn HTML, CSS, JavaScript, and modern frameworks. Perfect for beginners!",
    image: require("../assets/coding_bootcamp.jpg"),
    attendees: 78,
  },
  {
    id: "9",
    title: "Art & Craft Fair",
    date: "Sat, Oct 10",
    time: "10:00 AM - 6:00 PM",
    location: "Community Center",
    price: "Free",
    description:
      "Showcase of local artisans featuring handmade crafts, artwork, jewelry, and more. Support local artists and find unique pieces for your collection.",
    image: require("../assets/art_&_craft.webp"),
    latitude: 32.5272,
    longitude: -92.6379,
    attendees: 223,
  },
  {
    id: "10",
    title: "Movie Under the Stars",
    date: "Fri, Oct 24",
    time: "7:30 PM - 10:00 PM",
    location: "Ruston Green",
    price: "$8",
    description:
      "Outdoor movie screening under the stars. Bring your blankets and enjoy classic films in a beautiful outdoor setting. Concessions available.",
    image: require("../assets/movie_under_the_stars.jpg"),
    latitude: 32.5272,
    longitude: -92.6379,
    attendees: 167,
  },
];

const FavouriteScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [activeTab, setActiveTab] = useState("Favourites");
  const navSlideAnim = useRef(new Animated.Value(100)).current;
  const [favs, setFavs] = useState<Record<string, boolean>>({
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

  useEffect(() => {
    Animated.timing(navSlideAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const toggleFav = (id: string) => {
    setFavs((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  type Event = {
    id: string;
    title: string;
    date: string;
    location: string;
    price: string;
    image: any;
  };

  const renderEvent = ({ item }: { item: (typeof events)[0] }) => {
    const isFav = favs[item.id] || false;
    return (
      <View style={styles.eventItem}>
        <Image source={item.image} style={styles.eventImage} />
        <View style={styles.eventInfo}>
          <TouchableOpacity
            onPress={() => navigation.navigate("EventDetails", { event: item })}
          >
            <Text style={styles.eventTitle}>{item.title}</Text>
          </TouchableOpacity>
          <Text style={styles.eventDate}>
            {`${item.date} - ${item.location}`}
          </Text>
          <Text style={styles.eventPrice}>{item.price}</Text>
        </View>
        <TouchableOpacity onPress={() => toggleFav(item.id)}>
          <Ionicons
            name={isFav ? "heart" : "heart-outline"}
            size={20}
            color="#A259FF"
          />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Top Illustration */}
      <Image
        source={require("../assets/top_image.jpg")}
        style={styles.topImage}
        resizeMode="cover"
      />

      {/* Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="chevron-back" size={24} color="#000" />
      </TouchableOpacity>

      {/* Favourites Title */}
      <Text style={styles.favouritesTitle}>Favourites</Text>

      {/* Events List */}
      <FlatList
        data={events.filter((e) => favs[e.id])}
        keyExtractor={(item) => item.id}
        renderItem={renderEvent}
        contentContainerStyle={styles.eventsList}
        showsVerticalScrollIndicator={false}
        style={{ flexGrow: 0 }}
      />

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
  favouritesTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 10,
    marginLeft: 16,
    marginBottom: 24,
    color: "#181818",
  },
  eventsList: {
    paddingHorizontal: 16,
    paddingBottom: 120,
  },
  eventItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    marginHorizontal: 0,
    marginBottom: 2,
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
  eventInfo: {
    flex: 1,
    justifyContent: "center",
  },
  eventTitle: { fontSize: 16, fontWeight: "500" },
  eventDate: {
    fontSize: 13,
    color: "#444",
  },
  eventPrice: {
    fontSize: 13,
    color: "#444",
  },
});

export default FavouriteScreen;
