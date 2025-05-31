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
import RegisterIcon from "../assets/explore_page/register.png";
import LikeIcon from "../assets/explore_page/like.png";
import SendIcon from "../assets/explore_page/send.png";
import * as Sharing from "expo-sharing";
import * as Animatable from "react-native-animatable";
import Home from "../assets/home.png";
import Explore from "../assets/Explore.png";
import TicketIcon from "../assets/ticket.png";
import ProfileIcon from "../assets/user.png";
import { Video, ResizeMode } from "expo-av";
import BottomNavComplete from "../components/BottomNavComplete";
import Icon from "react-native-vector-icons/Ionicons";

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
  AccountScreen: undefined;
};

export default function ExploreScreen() {
  const navSlideAnim = useRef(new Animated.Value(100)).current;
  useEffect(() => {
    Animated.timing(navSlideAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);
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
  const previewVideoRef = useRef<Video>(null);
  const fullscreenVideoRefs = useRef<{ [key: string]: Video | null }>({});

  type EventCard = {
    id: string;
    image: any;
    title: string;
    date: string;
    location: string;
    type: string;
    attendees: any[];
  };

  // Add this to your videoData array for demo descriptions:
  const videoData = [
    {
      id: "1",
      source: require("../assets/videos/video.mp4"),
      description:
        "TechSpotlight 2026. TechSpotlight 2026 is a premier innovation showcase that brings together the brightest minds in technology, entrepreneurship, and design. This dynamic event spotlights groundbreaking solutions, emerging startups, and the latest advancements shaping the future of tech. Attendees will experience live demos, engaging panel discussions, and networking opportunities with industry leaders, investors, and next-gen innovators. Whether you're a developer, student, founder, or tech enthusiast, TechSpotlight 2026.",
    },
    {
      id: "2",
      source: require("../assets/videos/video1.mp4"),
      description:
        "Urban Beats Festival 2026. Dive into a world of rhythm and culture at Urban Beats Festival! Experience electrifying performances, street art showcases, and interactive workshops led by top artists. Connect with fellow music lovers, enjoy gourmet food trucks, and dance the night away. Urban Beats is where creativity and community collide for an unforgettable celebration.",
    },
    {
      id: "3",
      source: require("../assets/videos/video2.mp4"),
      description:
        "Startup Ignite 2026. Join the next wave of entrepreneurs at Startup Ignite! This event features pitch competitions, mentorship sessions, and networking with investors and industry experts. Discover innovative products, attend hands-on workshops, and get inspired by keynote speakers who are shaping the future of business.",
    },
    {
      id: "4",
      source: require("../assets/videos/video3.mp4"),
      description:
        "ArtFusion Expo 2026. Explore the intersection of art and technology at ArtFusion Expo. Enjoy immersive installations, live painting, and digital art experiences. Meet visionary artists, participate in creative labs, and take home unique pieces from the expo’s curated marketplace.",
    },
    {
      id: "5",
      source: require("../assets/videos/video4.mp4"),
      description:
        "Health & Wellness Summit 2026. Prioritize your well-being at the Health & Wellness Summit. Attend expert-led seminars, fitness classes, and mindfulness workshops. Connect with wellness brands, try new health products, and leave feeling rejuvenated and empowered.",
    },
    {
      id: "6",
      source: require("../assets/videos/video5.mp4"),
      description:
        "EcoFuture Conference 2026. Be part of the solution at EcoFuture! Learn about sustainable innovations, green startups, and environmental advocacy. Engage in panel discussions, eco-friendly product demos, and community clean-up initiatives.",
    },
    {
      id: "7",
      source: require("../assets/videos/video6.mp4"),
      description:
        "FilmFest 2026. Celebrate cinematic excellence at FilmFest! Watch exclusive premieres, meet filmmakers, and join Q&A sessions. Enjoy themed parties, networking mixers, and workshops for aspiring directors and actors.",
    },
    {
      id: "8",
      source: require("../assets/videos/video7.mp4"),
      description:
        "Culinary Carnival 2026. Savor flavors from around the world at Culinary Carnival! Enjoy live cooking demos, tasting sessions, and chef competitions. Discover new cuisines, meet food influencers, and take part in interactive culinary classes.",
    },
    {
      id: "9",
      source: require("../assets/videos/video8.mp4"),
      description:
        "Fashion Forward 2026. Step into the future of style at Fashion Forward. Experience runway shows, designer pop-ups, and trend talks. Network with fashion icons, shop exclusive collections, and get personalized styling tips.",
    },
    {
      id: "10",
      source: require("../assets/videos/video9.mp4"),
      description:
        "SportsMania 2026. Get your adrenaline pumping at SportsMania! Participate in tournaments, meet pro athletes, and enjoy live sports entertainment. Try out new gear, join fitness challenges, and celebrate the spirit of competition.",
    },
    {
      id: "11",
      source: require("../assets/videos/video10.mp4"),
      description:
        "BookVerse 2026. Immerse yourself in stories at BookVerse! Meet bestselling authors, attend readings, and join writing workshops. Explore book markets, literary panels, and connect with fellow book lovers.",
    },
    {
      id: "12",
      source: require("../assets/videos/video11.mp4"),
      description:
        "ScienceQuest 2026. Ignite your curiosity at ScienceQuest! Enjoy interactive exhibits, science shows, and hands-on experiments. Meet researchers, explore new discoveries, and inspire the next generation of innovators.",
    },
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

  const handleVideoPress = (index: number) => {
    if (expandedDescIndex === index) return; // Don't toggle play/pause if description is expanded
    setIsVideoPlaying((prev) => !prev);
    if (fullscreenVideoRefs.current[videoData[index].id]) {
      if (isVideoPlaying) {
        fullscreenVideoRefs.current[videoData[index].id]?.pauseAsync();
      } else {
        fullscreenVideoRefs.current[videoData[index].id]?.playAsync();
      }
    }
  };

  const handleDescPress = (index: number) => {
    if (expandedDescIndex === index) {
      setExpandedDescIndex(null);
    } else {
      setExpandedDescIndex(index);
    }
  };

  const handleRegister = (index: number) => {
    setRegisterAnimIndex(index);
    setTimeout(() => setRegisterAnimIndex(null), 500);
    // Your register logic here
  };

  const handleShare = async (index: number) => {
    try {
      await Sharing.shareAsync(videoData[index].source);
    } catch (e) {
      alert("Unable to share this video.");
    }
  };

  // Unload preview video when leaving screen
  useEffect(() => {
    return () => {
      // Unload preview video
      if (previewVideoRef.current) {
        previewVideoRef.current.unloadAsync();
      }
      // Unload all fullscreen videos
      Object.values(fullscreenVideoRefs.current).forEach((video) => {
        if (video) video.unloadAsync();
      });
    };
  }, []);

  // Unload all fullscreen videos when modal closes
  useEffect(() => {
    if (!videoModalVisible) {
      Object.values(fullscreenVideoRefs.current).forEach((video) => {
        if (video) video.unloadAsync();
      });
    }
  }, [videoModalVisible]);

  const [expandedDescIndex, setExpandedDescIndex] = useState<number | null>(null);
  const [registerAnimIndex, setRegisterAnimIndex] = useState<number | null>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);

  const renderDescriptionWithHashtags = (desc: string = "") => {
    const parts = desc.split(/(\#[a-zA-Z0-9_]+)/g);
    return parts.map((part, idx) =>
      part.startsWith("#") ? (
        <Text
          key={idx}
          style={{ color: "#7F00FF", fontWeight: "bold" }}
          onPress={() => {
            // Handle hashtag click (e.g., search or filter)
            alert(`Clicked hashtag: ${part}`);
          }}
        >
          {part}
        </Text>
      ) : (
        <Text key={idx}>{part}</Text>
      )
    );
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
          ref={previewVideoRef}
          source={videoData[0].source}
          style={styles.videoPreview}
          resizeMode={ResizeMode.COVER}
          shouldPlay={true}
          isLooping
          isMuted={true} // <-- Mute the preview video!
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
              <TouchableOpacity
                activeOpacity={1}
                style={{ flex: 1, width: "100%", height: "100%" }}
                onPress={() => handleVideoPress(index)}
              >
                <Video
                  ref={(ref) => {
                    fullscreenVideoRefs.current[item.id] = ref;
                  }}
                  source={item.source}
                  style={styles.fullscreenVideo}
                  resizeMode={ResizeMode.COVER}
                  shouldPlay={
                    isVideoPlaying &&
                    expandedDescIndex !== index &&
                    currentVideoIndex === index &&
                    !pausedVideos[item.id]
                  }
                  isLooping
                  isMuted={false}
                />
                {/* Description Preview/Expanded */}
                {expandedDescIndex === index ? (
                  <TouchableOpacity
                    activeOpacity={0.8}
                    style={[
                      styles.descContainer,
                      {
                        ...styles.descContainerExpanded,
                        maxHeight: undefined, // Remove maxHeight
                        minHeight: undefined, // Remove minHeight
                        height: undefined, // Let it grow with content
                      },
                    ]}
                    onPress={() => handleDescPress(index)}
                  >
                    <Text style={[styles.descText, styles.descTextExpanded]}>
                      {renderDescriptionWithHashtags(item.description)}
                    </Text>
                    <Text style={styles.descCollapseHint}>Tap to collapse</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    activeOpacity={0.8}
                    style={styles.descContainer}
                    onPress={() => handleDescPress(index)}
                  >
                    <Text style={styles.descText} numberOfLines={2}>
                      {renderDescriptionWithHashtags(item.description)}
                    </Text>
                  </TouchableOpacity>
                )}
                {/* Icons */}
                <View style={styles.videoControlsRow}>
                  <Animatable.View
                    animation={
                      registerAnimIndex === index ? "bounceIn" : undefined
                    }
                    duration={500}
                    style={{ alignItems: "center" }}
                  >
                    <TouchableOpacity onPress={() => handleRegister(index)}>
                      <Image source={RegisterIcon} style={styles.icon} />
                    </TouchableOpacity>
                    <Text style={styles.iconLabel}>Register</Text>
                  </Animatable.View>
                  <View style={{ alignItems: "center" }}>
                    <TouchableOpacity onPress={() => toggleLike(item.id)}>
                      <Image
                        source={LikeIcon}
                        style={[
                          styles.icon,
                          likedVideos[item.id] && { tintColor: "#7F00FF" },
                        ]}
                      />
                    </TouchableOpacity>
                    <Text style={styles.iconLabel}>Like</Text>
                  </View>
                  <View style={{ alignItems: "center" }}>
                    <TouchableOpacity onPress={() => handleShare(index)}>
                      <Image source={SendIcon} style={styles.icon} />
                    </TouchableOpacity>
                    <Text style={styles.iconLabel}>Share</Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          )}
          onMomentumScrollEnd={(e) => {
            const idx = Math.round(
              e.nativeEvent.contentOffset.y / Dimensions.get("window").height
            );
            setCurrentVideoIndex(idx);
            setExpandedDescIndex(null);
            setIsVideoPlaying(true);
          }}
        />
        {/* Close button */}
        <TouchableOpacity
          style={{
            position: "absolute",
            top: 50,
            left: 20,
            zIndex: 10,
            padding: 4, // just a little touch area
          }}
          onPress={() => setVideoModalVisible(false)}
        >
          <Icon name="arrow-back" size={32} color="#7F00FF" />
        </TouchableOpacity>
      </Modal>
      <BottomNavComplete
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        navSlideAnim={navSlideAnim}
      />
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
  descContainer: {
    position: "absolute",
    left: 7,
    bottom: 55,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    maxWidth: "80%",
  },
  descContainerExpanded: {
    width: "100%",
    left: "3%",
    bottom: "5%",
    zIndex: 10,
    backgroundColor: "rgba(0,0,0,0.35)",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  descText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "400",
  },
  descTextExpanded: {
    fontSize: 16,
    fontWeight: "500",
  },
  descCollapseHint: {
    color: "#bbb",
    fontSize: 12,
    marginTop: 7,
    textAlign: "center",
  },
  videoControlsRow: {
    position: "absolute",
    right: 20,
    bottom: 210,
    flexDirection: "column",
    alignItems: "center",
    zIndex: 20,
  },
  icon: {
    width: 32,
    height: 32,
    marginVertical: 10,
    tintColor: "#fff",
  },
  iconLabel: {
    color: "#fff",
    fontSize: 12,
    textAlign: "center",
  },
});
