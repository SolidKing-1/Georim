import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Animated,
  Easing,
  TextInput,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Pressable,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";
import LocationIcon from "react-native-vector-icons/Feather";
import DownArrow from "react-native-vector-icons/Entypo";
import Ionicons from "@expo/vector-icons/Ionicons";
import Home from "../assets/home.png";
import Explore from "../assets/Explore.png";
import TicketIcon from "../assets/ticket.png";
import ProfileIcon from "../assets/user.png";
import * as Location from "expo-location";
import Constants from "expo-constants";
import { getToken } from "../utils/auth";
import BottomNavComplete from "../components/BottomNavComplete"; // Import the reusable bottom nav component

const BACKEND_URL = Constants.expoConfig?.extra?.BACKEND_URL;

const { width } = Dimensions.get("window");
// Slideshow images
const slideshowImages = [
  {
    uri: "https://eliazar-applications.s3.us-east-2.amazonaws.com/georim/1748587724462-76b4b302-e6fe-4358-80cf-038dbea99af7-slide1.jpg",
  },
  {
    uri: "https://eliazar-applications.s3.us-east-2.amazonaws.com/georim/1748587771409-76d2a879-0ae5-4b69-a8f5-2c727483817d-slide2.jpg",
  },
  {
    uri: "https://eliazar-applications.s3.us-east-2.amazonaws.com/georim/1748588842532-41a63b0a-a69b-474e-b26c-48d538f34a9d-slide3.jpg",
  },
  {
    uri: "https://eliazar-applications.s3.us-east-2.amazonaws.com/georim/1748588074446-41748066-679a-4487-ae22-a088c5cf388e-slide4.jpg",
  },
];

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
    image: {
      uri: "https://eliazar-applications.s3.us-east-2.amazonaws.com/georim/1748584776376-117c9360-6dad-4de0-ba1a-26bf85cd3f71-ruston-fest.png",
    },
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
    image: {
      uri: "https://eliazar-applications.s3.us-east-2.amazonaws.com/georim/1748587113583-cefb5eee-97f8-48a3-b913-460ffb550e0d-calculus.png",
    },
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
    image: {
      uri: "https://eliazar-applications.s3.us-east-2.amazonaws.com/georim/1748584473395-ca9266b9-b7bb-4380-94e0-3a65d1f590c9-karaoke.png",
    },
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
    image: {
      uri: "https://eliazar-applications.s3.us-east-2.amazonaws.com/georim/1748587214000-48ea3778-476a-4e6e-ae0c-2ff7211a521f-tech_expo.png",
    },
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
    image: {
      uri: "https://eliazar-applications.s3.us-east-2.amazonaws.com/georim/1748587258505-0c0ca507-814c-41ed-b10e-044c0a1aae7d-jazz_night.png",
    },
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
    image: {
      uri: "https://eliazar-applications.s3.us-east-2.amazonaws.com/georim/1748587304323-c0743b62-0b5d-4eda-8803-a9a79c9b7a01-startup_pitch.jpg",
    },
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
    image: {
      uri: "https://eliazar-applications.s3.us-east-2.amazonaws.com/georim/1748587336349-b8411f81-a49a-4f16-8f54-530dc1322d3b-food_truck.jpg",
    },
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
    image: {
      uri: "https://eliazar-applications.s3.us-east-2.amazonaws.com/georim/1748587369591-5cded716-afac-452b-b3f7-7f2374b9d50f-coding_bootcamp.jpg",
    },
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
    image: {
      uri: "https://eliazar-applications.s3.us-east-2.amazonaws.com/georim/1748587415658-05e28872-5536-438b-9780-b6feefdc0b14-art_%26_craft.webp",
    },
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
    image: {
      uri: "https://eliazar-applications.s3.us-east-2.amazonaws.com/georim/1748587464347-0fdced07-89b4-4233-b3d0-6acd6a7f8931-movie_under_the_stars.jpg",
    },
    latitude: 32.5272,
    longitude: -92.6379,
    attendees: 167,
  },
];

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Dashboard"
>;
export default function DashboardScreen() {
  const navigation = useNavigation<NavigationProp>();
  type DashboardRouteParams = { initialTab?: string };
  const route = useRoute<{
    key: string;
    name: string;
    params?: DashboardRouteParams;
  }>();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState(1);
  const translateX = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const navSlideAnim = useRef(new Animated.Value(100)).current;
  const [activeTab, setActiveTab] = useState(
    (route.params?.initialTab as string) || "Home"
  );
  const [favs, setFavs] = useState<Record<string, boolean>>({});

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

  const renderEvent = ({ item }: { item: Event }) => {
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

  useEffect(() => {
    Animated.timing(navSlideAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      // Start fade out animation
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start(() => {
        // Update indices after fade out
        const newNextIndex = (currentIndex + 1) % slideshowImages.length;
        setCurrentIndex(nextIndex);
        setNextIndex(newNextIndex);

        // Reset position and fade in
        translateX.setValue(0);
        fadeAnim.setValue(1);
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [currentIndex, nextIndex]);

  useEffect(() => {
    (async () => {
      // Check if permission already granted
      let { status } = await Location.getForegroundPermissionsAsync();
      if (status !== "granted") {
        let { status: askStatus } =
          await Location.requestForegroundPermissionsAsync();
        if (askStatus !== "granted") {
          alert(
            "Location permission is required for this app to work properly."
          );
          return;
        }
      }
      // Get current location
      let location = await Location.getCurrentPositionAsync({});
      const token = await getToken();
      // Send to backend
      const response = await fetch(`${BACKEND_URL}/user/update-location`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        }),
      });
      console.log(token);
      const data = await response.json();
      if (!response.ok) {
        alert(data.message || "Failed to update location");
        return;
      }
    })();
  }, []);

  // Add this effect to handle tab changes
  useEffect(() => {
    if (route.params?.initialTab) {
      setActiveTab(route.params.initialTab);
    }
  }, [route.params]);

  const [showCategoriesModal, setShowCategoriesModal] = useState(false);
  const sideNavAnim = useRef(new Animated.Value(-260)).current;
  const iconRef = useRef<View>(null);
  const [iconPosition, setIconPosition] = useState({ top: 0, left: 0 });

  // Animate side nav in/out
  useEffect(() => {
    Animated.timing(sideNavAnim, {
      toValue: showCategoriesModal ? 0 : -260,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [showCategoriesModal]);

  // Find the position of the icon so the modal can be attached to it
  const handleShowCategories = () => {
    if (iconRef.current) {
      iconRef.current.measureInWindow((x, y, width, height) => {
        setIconPosition({ top: y + height, left: x });
        setShowCategoriesModal(true);
      });
    }
  };

  return (
    <View style={styles.container}>
      {/* Company Logo */}
      {/* <View style={styles.logoWrapper}>
        <Image source={Company} style={styles.logo} resizeMode="contain" />
      </View> */}

      {/* Banner Section with Rotating Image */}
      <View style={styles.banner}>
        <Animated.Image
          source={slideshowImages[currentIndex]}
          style={[
            styles.animatedImage,
            {
              opacity: fadeAnim,
            },
          ]}
          resizeMode="cover"
        />

        {/* Next image ready underneath */}
        <Image
          source={slideshowImages[nextIndex]}
          style={[styles.nextImage]}
          resizeMode="cover"
        />

        {/* Overlay Texts */}
        <View style={styles.overlayContent}>
          <Text style={styles.bannerTitle}>Don't miss out!</Text>
          <Text style={styles.bannerSubtitle}>
            Explore the <Text style={styles.highlight}>vibrant events</Text>{" "}
            happening locally and globally
          </Text>

          {/* Search Bar */}
          <View style={styles.searchBar}>
            {/* Left Search Section */}
            <View style={styles.searchLeft}>
              <TextInput
                placeholder="Search events, Categories, Locations"
                placeholderTextColor="#666"
                style={styles.searchInput}
              />
              <TouchableOpacity style={styles.clearBtn}>
                <Text style={{ color: "#fff", fontWeight: "bold" }}>x</Text>
              </TouchableOpacity>
            </View>

            {/* Vertical Divider */}
            <View style={styles.verticalDividerBetweenFields} />

            {/* Right Location Section */}
            <View style={styles.searchRight}>
              <LocationIcon name="map-pin" size={16} color="#444" />
              <Text style={styles.locationText}>Ruston LA</Text>
              <DownArrow name="chevron-down" size={16} color="#444" />
            </View>
          </View>
        </View>
      </View>

      <View style={styles.midNavbarWrapper}>
        {/* Top-Left Categories Bowl */}
        <View style={styles.categoriesBowl}>
          <Text style={styles.categoriesText}>Categories</Text>
        </View>

        {/* Icons Row */}
        <View style={styles.midNavbar}>
          {[
            {
              label: "Religious",
              icon: {
                uri: "https://res.cloudinary.com/dcw9wgjq5/image/upload/v1748463744/Worship_ji1tkp.png",
              },
            },
            {
              label: "Entertainment",
              icon: {
                uri: "https://eliazar-applications.s3.us-east-2.amazonaws.com/georim/1748588164320-72f017e5-bc92-44fa-a796-013471879c1c-Entertainment.png",
              },
            },
            {
              label: "Corporate",
              icon: {
                uri: "https://eliazar-applications.s3.us-east-2.amazonaws.com/georim/1748588962985-374a54fa-c5e5-4777-a838-581b4121764a-Corporate.png",
              },
            },
            {
              label: "Educational",
              icon: {
                uri: "https://eliazar-applications.s3.us-east-2.amazonaws.com/georim/1748589043443-c22d024f-db5d-4fbc-9384-7f6e60edf950-Education.png",
              },
            },
          ].map(({ label, icon }, index) => (
            <View key={index} style={styles.iconCircleWrapper}>
              <TouchableOpacity style={styles.iconCircle}>
                <Image source={icon} style={styles.circleIcon} />
              </TouchableOpacity>
              <Text style={styles.circleLabel}>{label}</Text>
            </View>
          ))}

          {/* Options icon moreCategories */}
          <View ref={iconRef} collapsable={false}>
            <TouchableOpacity
              onPress={handleShowCategories}
              style={styles.iconCircleWrapper}
            >
              <Image
                source={require("../assets/menu.png")}
                style={[styles.optionsIcon, { tintColor: "#7F00FF" }]}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Events Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Close To Me</Text>
        <FlatList
          data={events}
          keyExtractor={(item) => item.id}
          renderItem={renderEvent}
          contentContainerStyle={styles.eventsList}
          showsVerticalScrollIndicator={false}
          style={{ marginBottom: 425 }} // adjust maxHeight as needed
        />
      </View>

      {/* Use the reusable BottomNavBar component */}
      <BottomNavComplete
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        navSlideAnim={navSlideAnim}
      />

      {/* Side Navigation Modal (attached to icon, not full height) */}
      {showCategoriesModal && (
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={() => setShowCategoriesModal(false)}
        >
          <Animated.View
            style={[
              styles.attachedSideNav,
              {
                top: iconPosition.top + 8,
                left: iconPosition.left - 220, // adjust as needed to align right edge
                opacity: sideNavAnim.interpolate({
                  inputRange: [-260, 0],
                  outputRange: [0, 1],
                }),
                transform: [
                  {
                    translateX: sideNavAnim,
                  },
                ],
              },
            ]}
            pointerEvents="box-none"
          >
            <View style={styles.attachedSideNavContent}>
              <Text style={styles.modalTitle}>Categories</Text>
              <TouchableOpacity style={styles.sideNavItem}>
                <Text style={styles.sideNavText}>Religious</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.sideNavItem}>
                <Text style={styles.sideNavText}>Entertainment</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.sideNavItem}>
                <Text style={styles.sideNavText}>Corporate</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.sideNavItem}>
                <Text style={styles.sideNavText}>Educational</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.sideNavItem, { marginTop: 16 }]}
                onPress={() => setShowCategoriesModal(false)}
              >
                <Text style={[styles.sideNavText, { color: "#A259FF" }]}>
                  Close
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  logoWrapper: {
    alignItems: "center",
    marginTop: 60,
  },
  banner: {
    width: width,
    height: 220,
    justifyContent: "flex-end",
    overflow: "hidden",
    position: "relative",
  },
  animatedImage: {
    ...StyleSheet.absoluteFillObject,
    width: width,
    height: 220,
  },
  nextImage: {
    ...StyleSheet.absoluteFillObject,
    width: width,
    height: 220,
  },
  overlayContent: {
    flex: 1,
    justifyContent: "flex-end",
    padding: 20,
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  bannerTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
  },
  bannerSubtitle: {
    color: "#fff",
    fontSize: 16,
    marginTop: 4,
  },
  highlight: {
    color: "#FFB800",
    fontWeight: "700",
  },
  searchBar: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 10,
    overflow: "hidden",
    alignItems: "center",
    marginTop: 16,
  },
  searchLeft: {
    flex: 2,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 5,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    paddingLeft: 2,
    fontSize: 13,
  },
  clearBtn: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#444",
    alignItems: "center",
    justifyContent: "center",
  },
  verticalDividerBetweenFields: {
    width: 1,
    height: "60%",
    backgroundColor: "#ccc",
  },
  searchRight: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingHorizontal: 4,
  },
  locationText: {
    fontSize: 12,
    marginHorizontal: 4,
    color: "#444",
  },
  midNavbarWrapper: {
    marginTop: 20,
    paddingHorizontal: 20,
    position: "relative",
    backgroundColor: "#7F00FF0D",
  },

  categoriesBowl: {
    position: "absolute",
    top: -16,
    left: 0,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    zIndex: 2,
  },

  categoriesText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#FFFFF",
  },

  midNavbar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 30,
  },

  iconCircleWrapper: {
    alignItems: "center",
  },

  iconCircle: {
    width: 50,
    height: 50,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
  },

  circleIcon: {
    width: 28,
    height: 28,
    resizeMode: "contain",
  },

  circleLabel: {
    fontSize: 12,
    fontWeight: 600,
    color: "#444",
    textAlign: "center",
    marginBottom: 10,
  },
  optionsIcon: {
    width: 24,
    height: 24,
    resizeMode: "contain",
    marginBottom: 20,
  },

  // createLabel: {
  //   position: "absolute",
  //   bottom: 37,
  //   left: "47%",
  //   transform: [{ translateX: -16 }],
  //   fontSize: 14,
  //   color: "#333",
  //   fontWeight: "600",
  //   textAlign: "center",
  //   width: 50,
  // },

  section: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginHorizontal: 16,
    marginBottom: 8,
  },

  eventsList: { paddingHorizontal: 16, paddingBottom: 80 },
  eventItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  eventImage: { width: 60, height: 60, borderRadius: 8 },
  eventInfo: { flex: 1, marginLeft: 12 },
  eventTitle: { fontSize: 16, fontWeight: "500" },
  eventDate: { fontSize: 12, color: "#666", marginTop: 2 },
  eventPrice: { fontSize: 12, color: "#000", marginTop: 2 },

  // Modal styles
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  closeModal: {
    marginTop: 12,
    color: "#007BFF",
    fontWeight: "500",
  },

  // Side navigation styles
  sideNavOverlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: "100%",
    flexDirection: "row",
    zIndex: 2000,
  },
  sideNavBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  sideNavContent: {
    width: 260,
    backgroundColor: "#fff",
    paddingTop: 48,
    paddingHorizontal: 24,
    paddingBottom: 24,
    elevation: 8,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 2, height: 0 },
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  sideNavItem: {
    paddingVertical: 16,
    width: "100%",
  },
  sideNavText: {
    fontSize: 16,
    color: "#181818",
    fontWeight: "500",
  },
  attachedSideNav: {
    position: "absolute",
    width: 220,
    minHeight: 220,
    maxHeight: 320,
    backgroundColor: "transparent",
    zIndex: 3000,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 2, height: 0 },
    elevation: 10,
  },
  attachedSideNavContent: {
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingTop: 18,
    paddingBottom: 12,
    paddingHorizontal: 18,
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
});
