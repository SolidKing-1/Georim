import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Dimensions,
  Animated,
  FlatList,
  TouchableOpacity,
  Modal,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Home from "../assets/home.png";
import Explore from "../assets/Explore.png";
import TicketIcon from "../assets/ticket.png";
import ProfileIcon from "../assets/user.png";
import { Video, ResizeMode } from "expo-av";

const { width } = Dimensions.get("window");

// Sample data for banner images
const bannerImages = [
  require("../assets/explore_page/banner1.png"),
  require("../assets/explore_page/banner2.png"),
  require("../assets/explore_page/banner3.png"),
];


const eventCards = [
  {
    id: "1",
    image: require("../assets/explore_page/event1.jpg"),
    title: "Summer Music Festival",
    date: "Sat, May 17 - 18",
    location: "New Orleans",
    type: "Free",
    attendees: [
      require("../assets/explore_page/profile1.png"),
      require("../assets/explore_page/profile2.png"),
      require("../assets/explore_page/profile3.png"),
    ],
  },
  {
    id: "2",
    image: require("../assets/explore_page/event2.png"),
    title: "G-Men vs LSU Men's Football",
    date: "Wed, May 15 - 16",
    location: "Grambling, LA",
    type: "$20",
    attendees: [
      require("../assets/explore_page/profile1.png"),
      require("../assets/explore_page/profile2.png"),
      require("../assets/explore_page/profile3.png"),
    ],
  },
  {
    id: "3",
    image: require("../assets/explore_page/event3.png"),
    title: "Black History Month Celebration",
    date: "Sun, May 14 - 15",
    location: "Manhattan, NY",
    type: "Free",
    attendees: [
      require("../assets/explore_page/profile1.png"),
      require("../assets/explore_page/profile2.png"),
      require("../assets/explore_page/profile3.png"),
    ],
  },
  // Add more event objects...
];
type RootStackParamList = {
  Dashboard: undefined;
  CheckinScreen: undefined;
  ProfileScreen: undefined;
  ExploreScreen: undefined;
  CreateEvent: undefined;
};

export default function ExploreScreen() {
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const bannerScrollX = useRef(new Animated.Value(0)).current;
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [activeTab, setActiveTab] = useState("Explore");
  const [videoModalVisible, setVideoModalVisible] = useState(false);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [likedVideos, setLikedVideos] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [pausedVideos, setPausedVideos] = useState<{ [key: string]: boolean }>(
    {}
  );

  type EventCard = {
    id: string;
    image: any;
    title: string;
    date: string;
    location: string;
    type: string;
    attendees: any[];
  };

  const videoData = [
    { id: "1", source: require("../assets/videos/video1.mp4") },
    { id: "2", source: require("../assets/videos/video2.mp4") },
    { id: "3", source: require("../assets/videos/video3.mp4") },
    { id: "4", source: require("../assets/videos/video4.mp4") },
    { id: "5", source: require("../assets/videos/video5.mp4") },
    { id: "6", source: require("../assets/videos/video6.mp4") },
    { id: "7", source: require("../assets/videos/video7.mp4") },
    // Add more videos...
  ];

  const renderEventCard = ({ item }: { item: EventCard }) => (
    <View style={styles.eventCard}>
      <Image source={item.image} style={styles.eventImage} />
      <View style={styles.eventDetails}>
        <View style={styles.eventInfo}>
          <Text style={styles.eventTitle}>{item.title}</Text>
          <Text style={styles.eventDate}>{item.date}</Text>
          <View style={styles.locationTypeContainer}>
            <Text style={styles.eventLocation}>{item.location}</Text>
            <Text style={styles.separator}>|</Text>
            <Text style={styles.eventType}>{item.type}</Text>
          </View>
        </View>
        <View style={styles.attendeesContainer}>
          {item.attendees.map((profile: any, index: number) => (
            <Image
              key={index}
              source={profile}
              style={[
                styles.attendeeProfile,
                { right: index * 15 }, // Stack profiles
              ]}
            />
          ))}
        </View>
      </View>
    </View>
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBannerIndex((prev) => (prev + 1) % bannerImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const toggleLike = (id: string) => {
    setLikedVideos((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const togglePause = (id: string) => {
    setPausedVideos((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleShare = (id: string) => {
    // Implement your share logic here (e.g. Share API)
    alert("Share video " + id);
  };

  const handleRegister = (id: string) => {
    // Implement your register logic here
    alert("Registered for event/video " + id);
  };

  return (
    <View style={styles.container}>
      {/* Banner Carousel */}
      <View style={styles.bannerContainer}>
        <Animated.FlatList
          data={bannerImages}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: bannerScrollX } } }],
            { useNativeDriver: true }
          )}
          renderItem={({ item }) => (
            <Image
              source={bannerImages[currentBannerIndex]}
              style={styles.bannerImage}
            />
          )}
          keyExtractor={(_, index) => index.toString()}
        />
      </View>

      {/* Event Cards */}
      <FlatList
        data={eventCards}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.cardsContainer}
        renderItem={renderEventCard}
        keyExtractor={(item) => item.id}
        snapToInterval={width - 60} // Snap to card width
        decelerationRate="fast"
      />

      {/* Video preview box */}
      <View style={{ marginTop: 5, marginLeft: 20 }}>
        <Text style={{ color: "#7F00FF", fontWeight: "bold", fontSize: 18 }}>
          Explore Other Events
        </Text>
      </View>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => setVideoModalVisible(true)}
        style={styles.videoPreviewBox}
      >
        <Video
          source={videoData[0].source}
          style={styles.videoPreview}
          resizeMode={ResizeMode.COVER}
          shouldPlay={true}
          isLooping
        />
      </TouchableOpacity>

      {/* Fullscreen video modal (like Reels/Shorts) */}
      <Modal visible={videoModalVisible} animationType="slide">
        <FlatList
          data={videoData}
          pagingEnabled
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <View style={styles.fullscreenVideoBox}>
              <Video
                source={item.source}
                style={styles.fullscreenVideo}
                resizeMode={ResizeMode.COVER}
                shouldPlay={
                  currentVideoIndex === index && !pausedVideos[item.id]
                }
                isLooping
                isMuted={true}
              />
              {/* Overlay controls */}
              <View style={styles.videoControls}>
                {/* Like Button */}
                <TouchableOpacity
                  style={styles.controlButton}
                  onPress={() => toggleLike(item.id)}
                >
                  <Text
                    style={{
                      color: likedVideos[item.id] ? "#7F00FF" : "#fff",
                      fontSize: 26,
                    }}
                  >
                    ♥
                  </Text>
                </TouchableOpacity>
                {/* Register Button */}
                <TouchableOpacity
                  style={styles.controlButton}
                  onPress={() => handleRegister(item.id)}
                >
                  <Text
                    style={{
                      color: "#fff",
                      fontSize: 18,
                      fontWeight: "bold",
                    }}
                  >
                    Register
                  </Text>
                </TouchableOpacity>
                {/* Share Button */}
                <TouchableOpacity
                  style={styles.controlButton}
                  onPress={() => handleShare(item.id)}
                >
                  <Text style={{ color: "#fff", fontSize: 22 }}>⤴</Text>
                </TouchableOpacity>
                {/* Play/Pause Button */}
                <TouchableOpacity
                  style={styles.controlButton}
                  onPress={() => togglePause(item.id)}
                >
                  <Text style={{ color: "#fff", fontSize: 22 }}>
                    {pausedVideos[item.id] ? "▶" : "⏸"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          onMomentumScrollEnd={(e) => {
            const index = Math.round(
              e.nativeEvent.contentOffset.y / Dimensions.get("window").height
            );
            setCurrentVideoIndex(index);
          }}
        />
        {/* Close button */}
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => setVideoModalVisible(false)}
        >
          <Text style={{ color: "#fff", fontSize: 18 }}>Close</Text>
        </TouchableOpacity>
      </Modal>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        {/* Home Tab */}
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => {
            setActiveTab("Home");
            navigation.navigate("Dashboard");
          }}
        >
          <Image
            source={Home}
            style={{
              width: 24,
              height: 24,
              tintColor: activeTab === "Home" ? "#7F00FF" : "#333",
            }}
          />
          <Text
            style={[
              styles.navText,
              activeTab === "Home" && {
                color: "#7F00FF",
                fontWeight: "600",
              },
            ]}
          >
            Home
          </Text>
        </TouchableOpacity>

        {/* Explore Tab */}
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setActiveTab("Explore")}
        >
          <Image
            source={Explore}
            style={{
              width: 24,
              height: 24,
              tintColor: activeTab === "Explore" ? "#7F00FF" : "#333",
            }}
          />
          <Text
            style={[
              styles.navText,
              activeTab === "Explore" && {
                color: "#7F00FF",
                fontWeight: "600",
              },
            ]}
          >
            Explore
          </Text>
        </TouchableOpacity>

        {/* Spacer */}
        <View style={styles.navSpacer} />

        {/* Check-In Tab */}
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => {
            setActiveTab("Check-In");
            navigation.navigate("CheckinScreen");
          }}
        >
          <Image
            source={TicketIcon}
            style={{
              width: 24,
              height: 24,
              tintColor: activeTab === "Check-In" ? "#7F00FF" : "#333",
            }}
          />
          <Text
            style={[
              styles.navText,
              activeTab === "Check-In" && {
                color: "#7F00FF",
                fontWeight: "600",
              },
            ]}
          >
            Check-In
          </Text>
        </TouchableOpacity>

        {/* Profile Tab */}
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => {
            setActiveTab("Profile");
            navigation.navigate("ProfileScreen");
          }}
        >
          <Image
            source={ProfileIcon}
            style={{
              width: 24,
              height: 24,
              tintColor: activeTab === "Profile" ? "#7F00FF" : "#333",
            }}
          />
          <Text
            style={[
              styles.navText,
              activeTab === "Profile" && {
                color: "#7F00FF",
                fontWeight: "600",
              },
            ]}
          >
            Profile
          </Text>
        </TouchableOpacity>
      </View>
      {/* Bowl Cutout */}
      <View style={styles.bowlCutout}>
        <TouchableOpacity
          style={styles.floatingButton}
          onPress={() => navigation.navigate("CreateEvent")}
        >
          <Text style={styles.plusText}>+</Text>
          {/* Create label */}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  bannerContainer: {
    height: 200,
    width: width,
    paddingTop: 5,
    backgroundColor: "#fff",
    zIndex: 1,
    position: "relative",
  },
  bannerImage: {
    width: width,
    height: 200,
    resizeMode: "cover",
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  cardsContainer: {
    paddingHorizontal: 15,
    marginTop: 20, // Overlap the banner
    zIndex: 3,
    position: "relative",
  },
  eventCard: {
    width: width - 220,
    height: 154,
    marginRight: 15,
    borderRadius: 15,
    backgroundColor: "#fff",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  eventImage: {
    width: "100%",
    height: 70,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
  eventDetails: {
    padding: 11,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  eventInfo: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 10,
    fontWeight: "bold",
    marginBottom: 5,
  },
  eventDate: {
    fontSize: 10,
    color: "#666",
    marginBottom: 5,
  },
  locationTypeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  eventLocation: {
    fontSize: 10,
    color: "#666",
  },
  separator: {
    marginHorizontal: 5,
    color: "#666",
  },
  eventType: {
    fontSize: 10,
    color: "#666",
  },
  attendeesContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: 20,
  },
  attendeeProfile: {
    width: 23,
    height: 23,
    borderRadius: 15,
    position: "absolute",
    borderWidth: 2,
    borderColor: "#fff",
  },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 25,
    paddingVertical: 33,
    borderTopWidth: 1,
    borderColor: "#eee",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    backgroundColor: "rgba(255, 255, 255, 0.95)", // <-- changed from "#7F00FF0D"
    position: "absolute",
    bottom: 0,
    width: "100%",
    shadowColor: "#000", // iOS shadow
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  navItem: {
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 10,
  },
  navText: {
    fontSize: 12,
    marginTop: 2,
    color: "#333",
  },
  navSpacer: {
    flex: 1,
  },
  bowlCutout: {
    position: "absolute",
    bottom: 80,
    left: "50%",
    transform: [{ translateX: -45 }, { translateY: 30 }, { rotate: "180deg" }],
    width: 93,
    height: 54,
    backgroundColor: "rgba(255,255,255,0.95)",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    zIndex: 1,
  },

  floatingButton: {
    position: "absolute",
    top: 8,
    left: "38%",
    transform: [{ translateX: -25 }],
    width: 70,
    height: 40,
    backgroundColor: "#7F00FF",
    borderRadius: 23,
    justifyContent: "center",
    alignItems: "center",
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },

  plusText: {
    color: "#fff",
    fontSize: 25,
    fontWeight: "bold",
    marginTop: -2,
  },
  videoPreviewBox: {
    marginTop: 5,
    marginHorizontal: 20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: "hidden",
    height: 430,
    backgroundColor: "#000",
  },
  videoPreview: {
    width: "100%",
    height: "100%",
  },
  fullscreenVideoBox: {
    width: "100%",
    height: Dimensions.get("window").height,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  fullscreenVideo: {
    width: "100%",
    height: "100%",
  },
  videoControls: {
    position: "absolute",
    right: 20,
    bottom: 100,
    alignItems: "center",
  },
  controlButton: {
    marginVertical: 10,
    backgroundColor: "rgba(127,0,255,0.7)",
    padding: 12,
    borderRadius: 24,
    alignItems: "center",
    minWidth: 48,
  },
  closeButton: {
    position: "absolute",
    top: 40,
    right: 20,
    backgroundColor: "#7F00FF",
    padding: 10,
    borderRadius: 20,
    zIndex: 10,
  },
});
