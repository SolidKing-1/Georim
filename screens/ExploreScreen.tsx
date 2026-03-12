// import React, { useState, useRef, useEffect } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   ScrollView,
//   Image,
//   Dimensions,
//   Animated,
//   FlatList,
//   TouchableOpacity,
//   Modal,
// } from "react-native";
// import { useNavigation } from "@react-navigation/native";
// import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
// import RegisterIcon from "../assets/explore_page/register.png";
// import LikeIcon from "../assets/explore_page/like.png";
// import SendIcon from "../assets/explore_page/send.png";
// import * as Sharing from "expo-sharing";
// import * as Animatable from "react-native-animatable";
// import { Video, ResizeMode } from "expo-av";
// import Icon from "react-native-vector-icons/Ionicons";

// const { width } = Dimensions.get("window");

// // Sample data for banner images
// const bannerImages = [
//   {
//     uri: "https://eliazar-applications.s3.us-east-2.amazonaws.com/georim/1748654341940-52731232-6446-4e80-bc89-270b3f97c813-banner1.png",
//   },
//   {
//     uri: "https://eliazar-applications.s3.us-east-2.amazonaws.com/georim/1748654400542-c21f053c-586a-4b56-a445-3f4918e434b2-banner2.png",
//   },
//   {
//     uri: "https://eliazar-applications.s3.us-east-2.amazonaws.com/georim/1748654422791-0aff7f94-4f9c-43b7-b718-99895a81e0ee-banner3.png",
//   },
// ];

// const eventCards = [
//   {
//     id: "1",
//     image: {
//       uri: "https://eliazar-applications.s3.us-east-2.amazonaws.com/georim/1748654473358-d256bcd2-f1ce-4238-931c-159eb2071074-event1.jpg",
//     },
//     title: "Summer Music Festival",
//     date: "Sat, May 17 - 18",
//     location: "New Orleans",
//     type: "Free",
//     attendees: [
//       {
//         uri: "https://eliazar-applications.s3.us-east-2.amazonaws.com/georim/1748654826648-fee7c89b-60a1-48ea-9e2b-e21575bcd45f-profile1.png",
//       },
//       {
//         uri: "https://eliazar-applications.s3.us-east-2.amazonaws.com/georim/1748654850394-6348ea54-01c9-4d8c-a9c9-6d92fc01a537-profile2.png",
//       },
//       {
//         uri: "https://eliazar-applications.s3.us-east-2.amazonaws.com/georim/1748654871281-e9ed77f7-9c71-4521-a7d3-c1357dafdc0e-profile3.png",
//       },
//     ],
//   },
//   {
//     id: "2",
//     image: {
//       uri: "https://eliazar-applications.s3.us-east-2.amazonaws.com/georim/1748654782845-1cf52141-9856-4ba8-8a7e-e8658211651c-event2.png",
//     },
//     title: "G-Men vs LSU Men's Football",
//     date: "Wed, May 15 - 16",
//     location: "Grambling, LA",
//     type: "$20",
//     attendees: [
//       {
//         uri: "https://eliazar-applications.s3.us-east-2.amazonaws.com/georim/1748654826648-fee7c89b-60a1-48ea-9e2b-e21575bcd45f-profile1.png",
//       },
//       {
//         uri: "https://eliazar-applications.s3.us-east-2.amazonaws.com/georim/1748654850394-6348ea54-01c9-4d8c-a9c9-6d92fc01a537-profile2.png",
//       },
//       {
//         uri: "https://eliazar-applications.s3.us-east-2.amazonaws.com/georim/1748654871281-e9ed77f7-9c71-4521-a7d3-c1357dafdc0e-profile3.png",
//       },
//     ],
//   },
//   {
//     id: "3",
//     image: {
//       uri: "https://eliazar-applications.s3.us-east-2.amazonaws.com/georim/1748654804260-e6847c74-b255-474d-bf42-df31646bb92f-event3.png",
//     },
//     title: "Black History Month Celebration",
//     date: "Sun, May 14 - 15",
//     location: "Manhattan, NY",
//     type: "Free",
//     attendees: [
//       {
//         uri: "https://eliazar-applications.s3.us-east-2.amazonaws.com/georim/1748654826648-fee7c89b-60a1-48ea-9e2b-e21575bcd45f-profile1.png",
//       },
//       {
//         uri: "https://eliazar-applications.s3.us-east-2.amazonaws.com/georim/1748654850394-6348ea54-01c9-4d8c-a9c9-6d92fc01a537-profile2.png",
//       },
//       {
//         uri: "https://eliazar-applications.s3.us-east-2.amazonaws.com/georim/1748654871281-e9ed77f7-9c71-4521-a7d3-c1357dafdc0e-profile3.png",
//       },
//     ],
//   },
//   // Add more event objects...
// ];
// type RootStackParamList = {
//   Dashboard: undefined;
//   CheckinScreen: undefined;
//   ProfileScreen: undefined;
//   ExploreScreen: undefined;
//   CreateEvent: undefined;
//   AccountScreen: undefined;
// };

// export default function ExploreScreen() {
//   const navSlideAnim = useRef(new Animated.Value(100)).current;
//   useEffect(() => {
//     Animated.timing(navSlideAnim, {
//       toValue: 0,
//       duration: 500,
//       useNativeDriver: true,
//     }).start();
//   }, []);
//   const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
//   const bannerScrollX = useRef(new Animated.Value(0)).current;
//   const navigation =
//     useNavigation<NativeStackNavigationProp<RootStackParamList>>();
//   const [activeTab, setActiveTab] = useState("Explore");
//   const [videoModalVisible, setVideoModalVisible] = useState(false);
//   const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
//   const [likedVideos, setLikedVideos] = useState<{ [key: string]: boolean }>(
//     {}
//   );
//   const [pausedVideos, setPausedVideos] = useState<{ [key: string]: boolean }>(
//     {}
//   );
//   const previewVideoRef = useRef<Video>(null);
//   const fullscreenVideoRefs = useRef<{ [key: string]: Video | null }>({});

//   type EventCard = {
//     id: string;
//     image: any;
//     title: string;
//     date: string;
//     location: string;
//     type: string;
//     attendees: any[];
//   };

//   // Add this to your videoData array for demo descriptions:
//   const videoData = [
//     {
//       id: "1",
//       source: require("../assets/videos/video.mp4"),
//       description:
//         "TechSpotlight 2026. TechSpotlight 2026 is a premier innovation showcase that brings together the brightest minds in technology, entrepreneurship, and design. This dynamic event spotlights groundbreaking solutions, emerging startups, and the latest advancements shaping the future of tech. Attendees will experience live demos, engaging panel discussions, and networking opportunities with industry leaders, investors, and next-gen innovators. Whether you're a developer, student, founder, or tech enthusiast, TechSpotlight 2026.",
//     },
//     {
//       id: "2",
//       source: require("../assets/videos/video1.mp4"),
//       description:
//         "Urban Beats Festival 2026. Dive into a world of rhythm and culture at Urban Beats Festival! Experience electrifying performances, street art showcases, and interactive workshops led by top artists. Connect with fellow music lovers, enjoy gourmet food trucks, and dance the night away. Urban Beats is where creativity and community collide for an unforgettable celebration.",
//     },
//     {
//       id: "3",
//       source: require("../assets/videos/video2.mp4"),
//       description:
//         "Startup Ignite 2026. Join the next wave of entrepreneurs at Startup Ignite! This event features pitch competitions, mentorship sessions, and networking with investors and industry experts. Discover innovative products, attend hands-on workshops, and get inspired by keynote speakers who are shaping the future of business.",
//     },
//     {
//       id: "4",
//       source: require("../assets/videos/video3.mp4"),
//       description:
//         "ArtFusion Expo 2026. Explore the intersection of art and technology at ArtFusion Expo. Enjoy immersive installations, live painting, and digital art experiences. Meet visionary artists, participate in creative labs, and take home unique pieces from the expo’s curated marketplace.",
//     },
//     {
//       id: "5",
//       source: require("../assets/videos/video4.mp4"),
//       description:
//         "Health & Wellness Summit 2026. Prioritize your well-being at the Health & Wellness Summit. Attend expert-led seminars, fitness classes, and mindfulness workshops. Connect with wellness brands, try new health products, and leave feeling rejuvenated and empowered.",
//     },
//     {
//       id: "6",
//       source: require("../assets/videos/video5.mp4"),
//       description:
//         "EcoFuture Conference 2026. Be part of the solution at EcoFuture! Learn about sustainable innovations, green startups, and environmental advocacy. Engage in panel discussions, eco-friendly product demos, and community clean-up initiatives.",
//     },
//     {
//       id: "7",
//       source: require("../assets/videos/video6.mp4"),
//       description:
//         "FilmFest 2026. Celebrate cinematic excellence at FilmFest! Watch exclusive premieres, meet filmmakers, and join Q&A sessions. Enjoy themed parties, networking mixers, and workshops for aspiring directors and actors.",
//     },
//     {
//       id: "8",
//       source: require("../assets/videos/video7.mp4"),
//       description:
//         "Culinary Carnival 2026. Savor flavors from around the world at Culinary Carnival! Enjoy live cooking demos, tasting sessions, and chef competitions. Discover new cuisines, meet food influencers, and take part in interactive culinary classes.",
//     },
//     {
//       id: "9",
//       source: require("../assets/videos/video8.mp4"),
//       description:
//         "Fashion Forward 2026. Step into the future of style at Fashion Forward. Experience runway shows, designer pop-ups, and trend talks. Network with fashion icons, shop exclusive collections, and get personalized styling tips.",
//     },
//     {
//       id: "10",
//       source: require("../assets/videos/video9.mp4"),
//       description:
//         "SportsMania 2026. Get your adrenaline pumping at SportsMania! Participate in tournaments, meet pro athletes, and enjoy live sports entertainment. Try out new gear, join fitness challenges, and celebrate the spirit of competition.",
//     },
//     {
//       id: "11",
//       source: require("../assets/videos/video10.mp4"),
//       description:
//         "BookVerse 2026. Immerse yourself in stories at BookVerse! Meet bestselling authors, attend readings, and join writing workshops. Explore book markets, literary panels, and connect with fellow book lovers.",
//     },
//     {
//       id: "12",
//       source: require("../assets/videos/video11.mp4"),
//       description:
//         "ScienceQuest 2026. Ignite your curiosity at ScienceQuest! Enjoy interactive exhibits, science shows, and hands-on experiments. Meet researchers, explore new discoveries, and inspire the next generation of innovators.",
//     },
//   ];

//   const renderEventCard = ({ item }: { item: EventCard }) => (
//     <View style={styles.eventCard}>
//       <Image source={item.image} style={styles.eventImage} />
//       <View style={styles.eventDetails}>
//         <View style={styles.eventInfo}>
//           <Text style={styles.eventTitle}>{item.title}</Text>
//           <Text style={styles.eventDate}>{item.date}</Text>
//           <View style={styles.locationTypeContainer}>
//             <Text style={styles.eventLocation}>{item.location}</Text>
//             <Text style={styles.separator}>|</Text>
//             <Text style={styles.eventType}>{item.type}</Text>
//           </View>
//         </View>
//         <View style={styles.attendeesContainer}>
//           {item.attendees.map((profile: any, index: number) => (
//             <Image
//               key={index}
//               source={profile}
//               style={[
//                 styles.attendeeProfile,
//                 { right: index * 15 }, // Stack profiles
//               ]}
//             />
//           ))}
//         </View>
//       </View>
//     </View>
//   );

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentBannerIndex((prev) => (prev + 1) % bannerImages.length);
//     }, 3000);
//     return () => clearInterval(interval);
//   }, []);

//   const toggleLike = (id: string) => {
//     setLikedVideos((prev) => ({ ...prev, [id]: !prev[id] }));
//   };

//   const togglePause = (id: string) => {
//     setPausedVideos((prev) => ({ ...prev, [id]: !prev[id] }));
//   };

//   const handleVideoPress = (index: number) => {
//     if (expandedDescIndex === index) return; // Don't toggle play/pause if description is expanded
//     setIsVideoPlaying((prev) => !prev);
//     if (fullscreenVideoRefs.current[videoData[index].id]) {
//       if (isVideoPlaying) {
//         fullscreenVideoRefs.current[videoData[index].id]?.pauseAsync();
//       } else {
//         fullscreenVideoRefs.current[videoData[index].id]?.playAsync();
//       }
//     }
//   };

//   const handleDescPress = (index: number) => {
//     if (expandedDescIndex === index) {
//       setExpandedDescIndex(null);
//     } else {
//       setExpandedDescIndex(index);
//     }
//   };

//   const handleRegister = (index: number) => {
//     setRegisterAnimIndex(index);
//     setTimeout(() => setRegisterAnimIndex(null), 500);
//     // Your register logic here
//   };

//   const handleShare = async (index: number) => {
//     try {
//       await Sharing.shareAsync(videoData[index].source);
//     } catch (e) {
//       alert("Unable to share this video.");
//     }
//   };

//   // Unload preview video when leaving screen
//   useEffect(() => {
//     return () => {
//       // Unload preview video
//       if (previewVideoRef.current) {
//         previewVideoRef.current.unloadAsync();
//       }
//       // Unload all fullscreen videos
//       Object.values(fullscreenVideoRefs.current).forEach((video) => {
//         if (video) video.unloadAsync();
//       });
//     };
//   }, []);

//   // Unload all fullscreen videos when modal closes
//   useEffect(() => {
//     if (!videoModalVisible) {
//       Object.values(fullscreenVideoRefs.current).forEach((video) => {
//         if (video) video.unloadAsync();
//       });
//     }
//   }, [videoModalVisible]);

//   const [expandedDescIndex, setExpandedDescIndex] = useState<number | null>(
//     null
//   );
//   const [registerAnimIndex, setRegisterAnimIndex] = useState<number | null>(
//     null
//   );
//   const [isVideoPlaying, setIsVideoPlaying] = useState(true);

//   const renderDescriptionWithHashtags = (desc: string = "") => {
//     const parts = desc.split(/(\#[a-zA-Z0-9_]+)/g);
//     return parts.map((part, idx) =>
//       part.startsWith("#") ? (
//         <Text
//           key={idx}
//           style={{ color: "#7F00FF", fontWeight: "bold" }}
//           onPress={() => {
//             // Handle hashtag click (e.g., search or filter)
//             alert(`Clicked hashtag: ${part}`);
//           }}
//         >
//           {part}
//         </Text>
//       ) : (
//         <Text key={idx}>{part}</Text>
//       )
//     );
//   };

//   return (
//     <View style={styles.container}>
//       {/* Banner Carousel */}
//       <View style={styles.bannerContainer}>
//         <Animated.FlatList
//           data={bannerImages}
//           horizontal
//           pagingEnabled
//           showsHorizontalScrollIndicator={false}
//           onScroll={Animated.event(
//             [{ nativeEvent: { contentOffset: { x: bannerScrollX } } }],
//             { useNativeDriver: true }
//           )}
//           renderItem={({ item, index }) => (
//             <Image
//               source={bannerImages[currentBannerIndex]}
//               style={[
//                 styles.bannerImage,
//                 currentBannerIndex === 0 && { marginRight: 20 }, // Shift banner1 to the left
//               ]}
//             />
//           )}
//           keyExtractor={(_, index) => index.toString()}
//         />
//       </View>

//       {/* Event Cards */}
//       <FlatList
//         data={eventCards}
//         horizontal
//         showsHorizontalScrollIndicator={false}
//         contentContainerStyle={styles.cardsContainer}
//         renderItem={renderEventCard}
//         keyExtractor={(item) => item.id}
//         snapToInterval={width - 60} // Snap to card width
//         decelerationRate="fast"
//       />

//       {/* Video preview box */}
//       <View style={{ marginTop: 5, marginLeft: 20 }}>
//         <Text style={{ color: "#7F00FF", fontWeight: "bold", fontSize: 18 }}>
//           Explore Other Events
//         </Text>
//       </View>
//       <TouchableOpacity
//         activeOpacity={0.9}
//         onPress={() => setVideoModalVisible(true)}
//         style={styles.videoPreviewBox}
//       >
//         <Video
//           ref={previewVideoRef}
//           source={videoData[0].source}
//           style={styles.videoPreview}
//           resizeMode={ResizeMode.COVER}
//           shouldPlay={true}
//           isLooping
//           isMuted={true} // <-- Mute the preview video!
//         />
//       </TouchableOpacity>

//       {/* Fullscreen video modal (like Reels/Shorts) */}
//       <Modal visible={videoModalVisible} animationType="slide">
//         <FlatList
//           data={videoData}
//           pagingEnabled
//           showsVerticalScrollIndicator={false}
//           keyExtractor={(item) => item.id}
//           renderItem={({ item, index }) => (
//             <View style={styles.fullscreenVideoBox}>
//               <TouchableOpacity
//                 activeOpacity={1}
//                 style={{ flex: 1, width: "100%", height: "100%" }}
//                 onPress={() => handleVideoPress(index)}
//               >
//                 <Video
//                   ref={(ref) => {
//                     fullscreenVideoRefs.current[item.id] = ref;
//                   }}
//                   source={item.source}
//                   style={styles.fullscreenVideo}
//                   resizeMode={ResizeMode.COVER}
//                   shouldPlay={
//                     isVideoPlaying &&
//                     expandedDescIndex !== index &&
//                     currentVideoIndex === index &&
//                     !pausedVideos[item.id]
//                   }
//                   isLooping
//                   isMuted={false}
//                 />
//                 {/* Description Preview/Expanded */}
//                 {expandedDescIndex === index ? (
//                   <TouchableOpacity
//                     activeOpacity={0.8}
//                     style={[
//                       styles.descContainer,
//                       {
//                         ...styles.descContainerExpanded,
//                         maxHeight: undefined, // Remove maxHeight
//                         minHeight: undefined, // Remove minHeight
//                         height: undefined, // Let it grow with content
//                       },
//                     ]}
//                     onPress={() => handleDescPress(index)}
//                   >
//                     <Text style={[styles.descText, styles.descTextExpanded]}>
//                       {renderDescriptionWithHashtags(item.description)}
//                     </Text>
//                     <Text style={styles.descCollapseHint}>Tap to collapse</Text>
//                   </TouchableOpacity>
//                 ) : (
//                   <TouchableOpacity
//                     activeOpacity={0.8}
//                     style={styles.descContainer}
//                     onPress={() => handleDescPress(index)}
//                   >
//                     <Text style={styles.descText} numberOfLines={2}>
//                       {renderDescriptionWithHashtags(item.description)}
//                     </Text>
//                   </TouchableOpacity>
//                 )}
//                 {/* Icons */}
//                 <View style={styles.videoControlsRow}>
//                   <Animatable.View
//                     animation={
//                       registerAnimIndex === index ? "bounceIn" : undefined
//                     }
//                     duration={500}
//                     style={{ alignItems: "center" }}
//                   >
//                     <TouchableOpacity onPress={() => handleRegister(index)}>
//                       <Image
//                         source={{
//                           uri: "https://eliazar-applications.s3.us-east-2.amazonaws.com/georim/1748655210270-e781ce15-9e4d-4e94-9e26-520cd02a937f-register.png",
//                         }}
//                         style={styles.icon}
//                       />
//                     </TouchableOpacity>
//                     <Text style={styles.iconLabel}>Register</Text>
//                   </Animatable.View>
//                   {/* Like button with white outline and purple fill when liked */}
//                   <View style={{ alignItems: "center" }}>
//                     <TouchableOpacity onPress={() => toggleLike(item.id)}>
//                       <Icon
//                         name={likedVideos[item.id] ? "heart" : "heart-outline"}
//                         size={34}
//                         color={likedVideos[item.id] ? "#7F00FF" : "#fff"}
//                       />
//                     </TouchableOpacity>
//                     <Text style={styles.iconLabel}>Like</Text>
//                   </View>
//                   <View style={{ alignItems: "center" }}>
//                     <TouchableOpacity onPress={() => handleShare(index)}>
//                       <Image
//                         source={{
//                           uri: "https://eliazar-applications.s3.us-east-2.amazonaws.com/georim/1748655276169-168fc654-0016-4bc2-a532-0b1a5cd17da0-send.png",
//                         }}
//                         style={styles.icon}
//                       />
//                     </TouchableOpacity>
//                     <Text style={styles.iconLabel}>Share</Text>
//                   </View>
//                 </View>
//               </TouchableOpacity>
//             </View>
//           )}
//           onMomentumScrollEnd={(e) => {
//             const idx = Math.round(
//               e.nativeEvent.contentOffset.y / Dimensions.get("window").height
//             );
//             setCurrentVideoIndex(idx);
//             setExpandedDescIndex(null);
//             setIsVideoPlaying(true);
//           }}
//         />
//         {/* Close button */}
//         <TouchableOpacity
//           style={{
//             position: "absolute",
//             top: 50,
//             left: 20,
//             zIndex: 10,
//             padding: 4, // just a little touch area
//           }}
//           onPress={() => setVideoModalVisible(false)}
//         >
//           <Icon name="arrow-back" size={32} color="#7F00FF" />
//         </TouchableOpacity>
//       </Modal>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//   },
//   bannerContainer: {
//     height: 200,
//     width: width,
//     paddingTop: 5,
//     backgroundColor: "#fff",
//     zIndex: 1,
//     position: "relative",
//   },
//   bannerImage: {
//     width: width,
//     height: 200,
//     resizeMode: "cover",
//     borderBottomLeftRadius: 24,
//     borderBottomRightRadius: 24,
//   },
//   cardsContainer: {
//     paddingHorizontal: 15,
//     marginTop: 20, // Overlap the banner
//     zIndex: 3,
//     position: "relative",
//   },
//   eventCard: {
//     width: width - 220,
//     height: 154,
//     marginRight: 15,
//     borderRadius: 15,
//     backgroundColor: "#fff",
//     elevation: 5,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.25,
//     shadowRadius: 3.84,
//   },
//   eventImage: {
//     width: "100%",
//     height: 70,
//     borderTopLeftRadius: 15,
//     borderTopRightRadius: 15,
//     borderBottomLeftRadius: 15,
//     borderBottomRightRadius: 15,
//   },
//   eventDetails: {
//     padding: 11,
//     flexDirection: "row",
//     justifyContent: "space-between",
//   },
//   eventInfo: {
//     flex: 1,
//   },
//   eventTitle: {
//     fontSize: 10,
//     fontWeight: "bold",
//     marginBottom: 5,
//   },
//   eventDate: {
//     fontSize: 10,
//     color: "#666",
//     marginBottom: 5,
//   },
//   locationTypeContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   eventLocation: {
//     fontSize: 10,
//     color: "#666",
//   },
//   separator: {
//     marginHorizontal: 5,
//     color: "#666",
//   },
//   eventType: {
//     fontSize: 10,
//     color: "#666",
//   },
//   attendeesContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     width: 20,
//   },
//   attendeeProfile: {
//     width: 23,
//     height: 23,
//     borderRadius: 15,
//     position: "absolute",
//     borderWidth: 2,
//     borderColor: "#fff",
//   },
//   bottomNav: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     paddingHorizontal: 25,
//     paddingVertical: 33,
//     borderTopWidth: 1,
//     borderColor: "#eee",
//     borderTopLeftRadius: 32,
//     borderTopRightRadius: 32,
//     backgroundColor: "rgba(255, 255, 255, 0.95)", // <-- changed from "#7F00FF0D"
//     position: "absolute",
//     bottom: 0,
//     width: "100%",
//     shadowColor: "#000", // iOS shadow
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.1,
//     shadowRadius: 8,
//   },
//   navItem: {
//     alignItems: "center",
//     justifyContent: "center",
//     marginHorizontal: 10,
//   },
//   navText: {
//     fontSize: 12,
//     marginTop: 2,
//     color: "#333",
//   },
//   navSpacer: {
//     flex: 1,
//   },
//   bowlCutout: {
//     position: "absolute",
//     bottom: 80,
//     left: "50%",
//     transform: [{ translateX: -45 }, { translateY: 30 }, { rotate: "180deg" }],
//     width: 93,
//     height: 54,
//     backgroundColor: "rgba(255,255,255,0.95)",
//     borderTopLeftRadius: 30,
//     borderTopRightRadius: 30,
//     zIndex: 1,
//   },

//   floatingButton: {
//     position: "absolute",
//     top: 8,
//     left: "38%",
//     transform: [{ translateX: -25 }],
//     width: 70,
//     height: 40,
//     backgroundColor: "#7F00FF",
//     borderRadius: 23,
//     justifyContent: "center",
//     alignItems: "center",
//     elevation: 6,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 6,
//   },

//   plusText: {
//     color: "#fff",
//     fontSize: 25,
//     fontWeight: "bold",
//     marginTop: -2,
//   },
//   videoPreviewBox: {
//     marginTop: 5,
//     marginHorizontal: 20,
//     borderTopLeftRadius: 24,
//     borderTopRightRadius: 24,
//     overflow: "hidden",
//     height: 430,
//     backgroundColor: "#000",
//   },
//   videoPreview: {
//     width: "100%",
//     height: "100%",
//   },
//   fullscreenVideoBox: {
//     width: "100%",
//     height: Dimensions.get("window").height,
//     backgroundColor: "#000",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   fullscreenVideo: {
//     width: "100%",
//     height: "100%",
//   },
//   videoControls: {
//     position: "absolute",
//     right: 20,
//     bottom: 100,
//     alignItems: "center",
//   },
//   controlButton: {
//     marginVertical: 10,
//     backgroundColor: "rgba(127,0,255,0.7)",
//     padding: 12,
//     borderRadius: 24,
//     alignItems: "center",
//     minWidth: 48,
//   },
//   closeButton: {
//     position: "absolute",
//     top: 40,
//     right: 20,
//     backgroundColor: "#7F00FF",
//     padding: 10,
//     borderRadius: 20,
//     zIndex: 10,
//   },
//   descContainer: {
//     position: "absolute",
//     left: 7,
//     bottom: 55,
//     borderRadius: 12,
//     paddingHorizontal: 12,
//     paddingVertical: 8,
//     maxWidth: "80%",
//   },
//   descContainerExpanded: {
//     width: "100%",
//     left: "3%",
//     bottom: "5%",
//     zIndex: 10,
//     backgroundColor: "rgba(0,0,0,0.35)",
//     borderRadius: 12,
//     paddingHorizontal: 12,
//     paddingVertical: 8,
//   },
//   descText: {
//     color: "#fff",
//     fontSize: 15,
//     fontWeight: "400",
//   },
//   descTextExpanded: {
//     fontSize: 16,
//     fontWeight: "500",
//   },
//   descCollapseHint: {
//     color: "#bbb",
//     fontSize: 12,
//     marginTop: 7,
//     textAlign: "center",
//   },
//   videoControlsRow: {
//     position: "absolute",
//     right: 20,
//     bottom: 210,
//     flexDirection: "column",
//     alignItems: "center",
//     zIndex: 20,
//   },
//   icon: {
//     width: 32,
//     height: 32,
//     marginVertical: 10,
//     tintColor: "#fff",
//   },
//   iconLabel: {
//     color: "#fff",
//     fontSize: 12,
//     textAlign: "center",
//   },
// });

import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  Animated,
  FlatList,
  TouchableOpacity,
  Modal,
  Platform,
  StatusBar,
  Easing,
  TextInput,
  KeyboardAvoidingView,
  Keyboard,
  Share,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import * as Animatable from "react-native-animatable";
import { Video, ResizeMode } from "expo-av";
import Icon from "react-native-vector-icons/Ionicons";

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get("window");
const CARD_WIDTH = SCREEN_W - 220;
const CARD_GAP = 12;
const SNAP_INTERVAL = CARD_WIDTH + CARD_GAP;
const SAFE_TOP = Platform.OS === "ios" ? 54 : 38;
const SAFE_BOTTOM = Platform.OS === "ios" ? 34 : 20;

const bannerImages = [
  { uri: "https://eliazar-applications.s3.us-east-2.amazonaws.com/georim/1748654341940-52731232-6446-4e80-bc89-270b3f97c813-banner1.png" },
  { uri: "https://eliazar-applications.s3.us-east-2.amazonaws.com/georim/1748654400542-c21f053c-586a-4b56-a445-3f4918e434b2-banner2.png" },
  { uri: "https://eliazar-applications.s3.us-east-2.amazonaws.com/georim/1748654422791-0aff7f94-4f9c-43b7-b718-99895a81e0ee-banner3.png" },
];

const eventCards = [
  {
    id: "1",
    image: { uri: "https://eliazar-applications.s3.us-east-2.amazonaws.com/georim/1748654473358-d256bcd2-f1ce-4238-931c-159eb2071074-event1.jpg" },
    title: "Summer Music Festival",
    date: "Sat, May 17 - 18",
    location: "New Orleans",
    type: "Free",
    attendees: [
      { uri: "https://eliazar-applications.s3.us-east-2.amazonaws.com/georim/1748654826648-fee7c89b-60a1-48ea-9e2b-e21575bcd45f-profile1.png" },
      { uri: "https://eliazar-applications.s3.us-east-2.amazonaws.com/georim/1748654850394-6348ea54-01c9-4d8c-a9c9-6d92fc01a537-profile2.png" },
      { uri: "https://eliazar-applications.s3.us-east-2.amazonaws.com/georim/1748654871281-e9ed77f7-9c71-4521-a7d3-c1357dafdc0e-profile3.png" },
    ],
  },
  {
    id: "2",
    image: { uri: "https://eliazar-applications.s3.us-east-2.amazonaws.com/georim/1748654782845-1cf52141-9856-4ba8-8a7e-e8658211651c-event2.png" },
    title: "G-Men vs LSU Men's Football",
    date: "Wed, May 15 - 16",
    location: "Grambling, LA",
    type: "$20",
    attendees: [
      { uri: "https://eliazar-applications.s3.us-east-2.amazonaws.com/georim/1748654826648-fee7c89b-60a1-48ea-9e2b-e21575bcd45f-profile1.png" },
      { uri: "https://eliazar-applications.s3.us-east-2.amazonaws.com/georim/1748654850394-6348ea54-01c9-4d8c-a9c9-6d92fc01a537-profile2.png" },
      { uri: "https://eliazar-applications.s3.us-east-2.amazonaws.com/georim/1748654871281-e9ed77f7-9c71-4521-a7d3-c1357dafdc0e-profile3.png" },
    ],
  },
  {
    id: "3",
    image: { uri: "https://eliazar-applications.s3.us-east-2.amazonaws.com/georim/1748654804260-e6847c74-b255-474d-bf42-df31646bb92f-event3.png" },
    title: "Black History Month Celebration",
    date: "Sun, May 14 - 15",
    location: "Manhattan, NY",
    type: "Free",
    attendees: [
      { uri: "https://eliazar-applications.s3.us-east-2.amazonaws.com/georim/1748654826648-fee7c89b-60a1-48ea-9e2b-e21575bcd45f-profile1.png" },
      { uri: "https://eliazar-applications.s3.us-east-2.amazonaws.com/georim/1748654850394-6348ea54-01c9-4d8c-a9c9-6d92fc01a537-profile2.png" },
      { uri: "https://eliazar-applications.s3.us-east-2.amazonaws.com/georim/1748654871281-e9ed77f7-9c71-4521-a7d3-c1357dafdc0e-profile3.png" },
    ],
  },
];

type RootStackParamList = {
  Dashboard: undefined;
  CheckinScreen: undefined;
  ProfileScreen: undefined;
  ExploreScreen: undefined;
  CreateEvent: undefined;
  AccountScreen: undefined;
};

type EventCardType = (typeof eventCards)[0];

const videoData = [
  { id: "1", source: require("../assets/videos/video.mp4"), description: "TechSpotlight 2026. TechSpotlight 2026 is a premier innovation showcase that brings together the brightest minds in technology, entrepreneurship, and design. This dynamic event spotlights groundbreaking solutions, emerging startups, and the latest advancements shaping the future of tech." },
  { id: "2", source: require("../assets/videos/video1.mp4"), description: "Urban Beats Festival 2026. Dive into a world of rhythm and culture at Urban Beats Festival! Experience electrifying performances, street art showcases, and interactive workshops led by top artists." },
  { id: "3", source: require("../assets/videos/video2.mp4"), description: "Startup Ignite 2026. Join the next wave of entrepreneurs at Startup Ignite! This event features pitch competitions, mentorship sessions, and networking with investors and industry experts." },
  { id: "4", source: require("../assets/videos/video3.mp4"), description: "ArtFusion Expo 2026. Explore the intersection of art and technology at ArtFusion Expo. Enjoy immersive installations, live painting, and digital art experiences." },
  { id: "5", source: require("../assets/videos/video4.mp4"), description: "Health & Wellness Summit 2026. Prioritize your well-being at the Health & Wellness Summit. Attend expert-led seminars, fitness classes, and mindfulness workshops." },
  { id: "6", source: require("../assets/videos/video5.mp4"), description: "EcoFuture Conference 2026. Be part of the solution at EcoFuture! Learn about sustainable innovations, green startups, and environmental advocacy." },
  { id: "7", source: require("../assets/videos/video6.mp4"), description: "FilmFest 2026. Celebrate cinematic excellence at FilmFest! Watch exclusive premieres, meet filmmakers, and join Q&A sessions." },
  { id: "8", source: require("../assets/videos/video7.mp4"), description: "Culinary Carnival 2026. Savor flavors from around the world at Culinary Carnival! Enjoy live cooking demos, tasting sessions, and chef competitions." },
  { id: "9", source: require("../assets/videos/video8.mp4"), description: "Fashion Forward 2026. Step into the future of style at Fashion Forward. Experience runway shows, designer pop-ups, and trend talks." },
  { id: "10", source: require("../assets/videos/video9.mp4"), description: "SportsMania 2026. Get your adrenaline pumping at SportsMania! Participate in tournaments, meet pro athletes, and enjoy live sports entertainment." },
  { id: "11", source: require("../assets/videos/video10.mp4"), description: "BookVerse 2026. Immerse yourself in stories at BookVerse! Meet bestselling authors, attend readings, and join writing workshops." },
  { id: "12", source: require("../assets/videos/video11.mp4"), description: "ScienceQuest 2026. Ignite your curiosity at ScienceQuest! Enjoy interactive exhibits, science shows, and hands-on experiments." },
];

// ---------- Animated Like Button ----------
function AnimatedLikeButton({ liked, onPress }: { liked: boolean; onPress: () => void }) {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePress = useCallback(() => {
    Animated.sequence([
      Animated.timing(scale, { toValue: 1.4, duration: 110, easing: Easing.out(Easing.quad), useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1, friction: 4, tension: 140, useNativeDriver: true }),
    ]).start();
    onPress();
  }, [onPress, scale]);

  return (
    <View style={styles.controlItem}>
      <TouchableOpacity onPress={handlePress} activeOpacity={0.8} hitSlop={8}>
        <Animated.View style={{ transform: [{ scale }] }}>
          <Icon name={liked ? "heart" : "heart-outline"} size={30} color={liked ? "#7F00FF" : "#fff"} />
        </Animated.View>
      </TouchableOpacity>
      <Text style={styles.iconLabel}>Like</Text>
    </View>
  );
}

// ---------- Animated Play/Pause Indicator ----------
function PlayPauseIndicator({ visible }: { visible: boolean }) {
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    if (visible) {
      opacity.setValue(1);
      scale.setValue(0.5);
      Animated.parallel([
        Animated.timing(scale, { toValue: 1, duration: 200, easing: Easing.out(Easing.back(1.5)), useNativeDriver: true }),
        Animated.sequence([
          Animated.delay(600),
          Animated.timing(opacity, { toValue: 0, duration: 300, useNativeDriver: true }),
        ]),
      ]).start();
    }
  }, [visible, opacity, scale]);

  if (!visible) return null;

  return (
    <Animated.View style={[styles.playPauseIndicator, { opacity, transform: [{ scale }] }]} pointerEvents="none">
      <View style={styles.playPauseCircle}>
        <Icon name="pause" size={32} color="#fff" />
      </View>
    </Animated.View>
  );
}

function PlayIndicator({ visible }: { visible: boolean }) {
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    if (visible) {
      opacity.setValue(1);
      scale.setValue(0.5);
      Animated.parallel([
        Animated.timing(scale, { toValue: 1, duration: 200, easing: Easing.out(Easing.back(1.5)), useNativeDriver: true }),
        Animated.sequence([
          Animated.delay(600),
          Animated.timing(opacity, { toValue: 0, duration: 300, useNativeDriver: true }),
        ]),
      ]).start();
    }
  }, [visible, opacity, scale]);

  if (!visible) return null;

  return (
    <Animated.View style={[styles.playPauseIndicator, { opacity, transform: [{ scale }] }]} pointerEvents="none">
      <View style={styles.playPauseCircle}>
        <Icon name="play" size={32} color="#fff" style={{ marginLeft: 3 }} />
      </View>
    </Animated.View>
  );
}

// ---------- Comment Bottom Sheet ----------
function CommentSheet({
  visible,
  onClose,
  videoId,
}: {
  visible: boolean;
  onClose: () => void;
  videoId: string;
}) {
  const slideAnim = useRef(new Animated.Value(SCREEN_H)).current;
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<{ id: string; user: string; text: string; time: string }[]>([
    { id: "c1", user: "Alex Johnson", text: "This event looks amazing! 🔥", time: "2m ago" },
    { id: "c2", user: "Maria Garcia", text: "Can't wait to attend!", time: "5m ago" },
    { id: "c3", user: "James Lee", text: "Who else is going? Let's link up", time: "12m ago" },
  ]);

  useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, { toValue: 0, friction: 9, tension: 65, useNativeDriver: true }).start();
    } else {
      Animated.timing(slideAnim, { toValue: SCREEN_H, duration: 250, useNativeDriver: true }).start();
    }
  }, [visible, slideAnim]);

  const handleSend = useCallback(() => {
    if (!comment.trim()) return;
    setComments((prev) => [
      { id: Date.now().toString(), user: "You", text: comment.trim(), time: "Just now" },
      ...prev,
    ]);
    setComment("");
    Keyboard.dismiss();
  }, [comment]);

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <TouchableOpacity style={styles.commentOverlay} activeOpacity={1} onPress={onClose}>
        <View />
      </TouchableOpacity>

      <Animated.View style={[styles.commentSheet, { transform: [{ translateY: slideAnim }] }]}>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
          {/* Handle */}
          <View style={styles.commentHandleRow}>
            <View style={styles.commentHandle} />
          </View>

          <Text style={styles.commentTitle}>Comments</Text>

          <ScrollView style={styles.commentList} showsVerticalScrollIndicator={false}>
            {comments.map((c) => (
              <View key={c.id} style={styles.commentItem}>
                <View style={styles.commentAvatar}>
                  <Text style={styles.commentAvatarText}>{c.user[0]}</Text>
                </View>
                <View style={styles.commentContent}>
                  <View style={styles.commentHeader}>
                    <Text style={styles.commentUser}>{c.user}</Text>
                    <Text style={styles.commentTime}>{c.time}</Text>
                  </View>
                  <Text style={styles.commentText}>{c.text}</Text>
                </View>
              </View>
            ))}
          </ScrollView>

          {/* Input */}
          <View style={styles.commentInputRow}>
            <TextInput
              style={styles.commentInput}
              placeholder="Add a comment..."
              placeholderTextColor="#666"
              value={comment}
              onChangeText={setComment}
              multiline
              maxLength={500}
            />
            <TouchableOpacity
              onPress={handleSend}
              activeOpacity={0.7}
              style={[styles.commentSendBtn, !comment.trim() && { opacity: 0.4 }]}
              disabled={!comment.trim()}
            >
              <Icon name="send" size={20} color="#7F00FF" />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Animated.View>
    </Modal>
  );
}

// ---------- Three-Dot Menu ----------
function ThreeDotMenu({ onClose, visible }: { visible: boolean; onClose: () => void }) {
  const slideAnim = useRef(new Animated.Value(SCREEN_H)).current;

  useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, { toValue: 0, friction: 9, tension: 65, useNativeDriver: true }).start();
    } else {
      Animated.timing(slideAnim, { toValue: SCREEN_H, duration: 250, useNativeDriver: true }).start();
    }
  }, [visible, slideAnim]);

  const menuItems = [
    { icon: "flag-outline", label: "Report", color: "#ff4444" },
    { icon: "bookmark-outline", label: "Save Video", color: "#fff" },
    { icon: "eye-off-outline", label: "Not Interested", color: "#fff" },
    { icon: "link-outline", label: "Copy Link", color: "#fff" },
  ];

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <TouchableOpacity style={styles.commentOverlay} activeOpacity={1} onPress={onClose}>
        <View />
      </TouchableOpacity>

      <Animated.View style={[styles.menuSheet, { transform: [{ translateY: slideAnim }] }]}>
        <View style={styles.commentHandleRow}>
          <View style={styles.commentHandle} />
        </View>

        {menuItems.map((item, i) => (
          <TouchableOpacity
            key={i}
            style={styles.menuItem}
            activeOpacity={0.7}
            onPress={() => {
              onClose();
            }}
          >
            <Icon name={item.icon as any} size={22} color={item.color} />
            <Text style={[styles.menuItemText, item.color === "#ff4444" && { color: "#ff4444" }]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}

        <TouchableOpacity style={styles.menuCancelBtn} activeOpacity={0.7} onPress={onClose}>
          <Text style={styles.menuCancelText}>Cancel</Text>
        </TouchableOpacity>
      </Animated.View>
    </Modal>
  );
}

// ---------- Main Component ----------
export default function ExploreScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const bannerRef = useRef<FlatList>(null);
  const bannerScrollX = useRef(new Animated.Value(0)).current;

  const [videoModalVisible, setVideoModalVisible] = useState(false);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [likedVideos, setLikedVideos] = useState<{ [key: string]: boolean }>({});
  const [pausedVideos, setPausedVideos] = useState<{ [key: string]: boolean }>({});
  const [expandedDescIndex, setExpandedDescIndex] = useState<number | null>(null);
  const [registerAnimIndex, setRegisterAnimIndex] = useState<number | null>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);

  // Play/Pause indicator triggers
  const [showPauseIndicator, setShowPauseIndicator] = useState(false);
  const [showPlayIndicator, setShowPlayIndicator] = useState(false);

  // Comment & Menu
  const [commentVisible, setCommentVisible] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);

  const previewVideoRef = useRef<Video>(null);
  const fullscreenVideoRefs = useRef<{ [key: string]: Video | null }>({});

  // --- Screen entrance ---
  const bannerFade = useRef(new Animated.Value(0)).current;
  const cardsFade = useRef(new Animated.Value(0)).current;
  const videoFade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.stagger(100, [
      Animated.timing(bannerFade, { toValue: 1, duration: 440, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      Animated.timing(cardsFade, { toValue: 1, duration: 440, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      Animated.timing(videoFade, { toValue: 1, duration: 440, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
    ]).start();
  }, [bannerFade, cardsFade, videoFade]);

  const bannerAnimStyle = useMemo(() => ({
    opacity: bannerFade,
    transform: [{ translateY: bannerFade.interpolate({ inputRange: [0, 1], outputRange: [12, 0] }) }],
  }), [bannerFade]);

  const cardsAnimStyle = useMemo(() => ({
    opacity: cardsFade,
    transform: [{ translateY: cardsFade.interpolate({ inputRange: [0, 1], outputRange: [14, 0] }) }],
  }), [cardsFade]);

  const videoAnimStyle = useMemo(() => ({
    opacity: videoFade,
    transform: [{ translateY: videoFade.interpolate({ inputRange: [0, 1], outputRange: [16, 0] }) }],
  }), [videoFade]);

  // --- Banner autoplay ---
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBannerIndex((prev) => {
        const next = (prev + 1) % bannerImages.length;
        bannerRef.current?.scrollToOffset({ offset: next * SCREEN_W, animated: true });
        return next;
      });
    }, 3200);
    return () => clearInterval(interval);
  }, []);

  const onBannerScroll = useMemo(
    () => Animated.event([{ nativeEvent: { contentOffset: { x: bannerScrollX } } }], { useNativeDriver: true }),
    [bannerScrollX]
  );

  const onBannerMomentumEnd = useCallback((e: any) => {
    const idx = Math.round(e.nativeEvent.contentOffset.x / SCREEN_W);
    setCurrentBannerIndex(idx);
  }, []);

  // --- Video cleanup ---
  useEffect(() => {
    return () => {
      previewVideoRef.current?.unloadAsync();
      Object.values(fullscreenVideoRefs.current).forEach((v) => v?.unloadAsync());
    };
  }, []);

  useEffect(() => {
    if (!videoModalVisible) {
      Object.values(fullscreenVideoRefs.current).forEach((v) => v?.unloadAsync());
    }
  }, [videoModalVisible]);

  // --- Handlers ---
  const toggleLike = useCallback((id: string) => {
    setLikedVideos((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const handleVideoPress = useCallback((index: number) => {
    if (expandedDescIndex === index) return;
    const v = fullscreenVideoRefs.current[videoData[index].id];
    setIsVideoPlaying((prev) => {
      if (prev) {
        v?.pauseAsync();
        setShowPauseIndicator(true);
        setShowPlayIndicator(false);
        setTimeout(() => setShowPauseIndicator(false), 1000);
      } else {
        v?.playAsync();
        setShowPlayIndicator(true);
        setShowPauseIndicator(false);
        setTimeout(() => setShowPlayIndicator(false), 1000);
      }
      return !prev;
    });
  }, [expandedDescIndex]);

  const handleDescPress = useCallback((index: number) => {
    setExpandedDescIndex((prev) => (prev === index ? null : index));
  }, []);

  const handleRegister = useCallback((index: number) => {
    setRegisterAnimIndex(index);
    setTimeout(() => setRegisterAnimIndex(null), 500);
  }, []);

  const handleShare = useCallback(async (index: number) => {
    try {
      await Share.share({
        message: `Check out this event: ${videoData[index].description.split(".")[0]}`,
        title: videoData[index].description.split(".")[0],
      });
    } catch {
      // user cancelled
    }
  }, []);

  const onVideoListMomentumEnd = useCallback((e: any) => {
    const idx = Math.round(e.nativeEvent.contentOffset.y / SCREEN_H);
    setCurrentVideoIndex(idx);
    setExpandedDescIndex(null);
    setIsVideoPlaying(true);
    setShowPauseIndicator(false);
    setShowPlayIndicator(false);
  }, []);

  // --- Render helpers ---
  const renderDescriptionWithHashtags = useCallback((desc: string = "") => {
    const parts = desc.split(/(#[a-zA-Z0-9_]+)/g);
    return parts.map((part, idx) =>
      part.startsWith("#") ? (
        <Text key={idx} style={styles.hashtag} onPress={() => alert(`Clicked hashtag: ${part}`)}>
          {part}
        </Text>
      ) : (
        <Text key={idx}>{part}</Text>
      )
    );
  }, []);

  const renderEventCard = useCallback(({ item }: { item: EventCardType }) => (
    <TouchableOpacity activeOpacity={0.9} style={styles.eventCard}>
      <Image source={item.image} style={styles.eventImage} />
      <View style={styles.eventDetails}>
        <View style={styles.eventInfo}>
          <Text style={styles.eventTitle} numberOfLines={1}>{item.title}</Text>
          <Text style={styles.eventDate} numberOfLines={1}>{item.date}</Text>
          <View style={styles.locationTypeContainer}>
            <Text style={styles.eventLocation} numberOfLines={1}>{item.location}</Text>
            <Text style={styles.separator}>|</Text>
            <Text style={styles.eventType}>{item.type}</Text>
          </View>
        </View>
        <View style={styles.attendeesContainer}>
          {item.attendees.map((profile, index) => (
            <Image key={index} source={profile} style={[styles.attendeeProfile, { right: index * 14 }]} />
          ))}
        </View>
      </View>
    </TouchableOpacity>
  ), []);

  const renderBannerItem = useCallback(({ item }: { item: (typeof bannerImages)[0] }) => (
    <Image source={item} style={styles.bannerImage} />
  ), []);

  const renderVideoItem = useCallback(({ item, index }: { item: (typeof videoData)[0]; index: number }) => {
    const isExpanded = expandedDescIndex === index;
    const isCurrent = currentVideoIndex === index;
    const shouldPlay = isVideoPlaying && !isExpanded && isCurrent && !pausedVideos[item.id];

    return (
      <View style={styles.fullscreenVideoBox}>
        <TouchableOpacity
          activeOpacity={1}
          style={styles.fullscreenPressArea}
          onPress={() => handleVideoPress(index)}
        >
          <Video
            ref={(ref) => { fullscreenVideoRefs.current[item.id] = ref; }}
            source={item.source}
            style={styles.fullscreenVideo}
            resizeMode={ResizeMode.COVER}
            shouldPlay={shouldPlay}
            isLooping
            isMuted={false}
          />

          {/* Play/Pause animated indicators */}
          {isCurrent && <PlayPauseIndicator visible={showPauseIndicator} />}
          {isCurrent && <PlayIndicator visible={showPlayIndicator} />}

          {/* Bottom content: description (left) + controls (right) */}
          <View style={styles.bottomContentArea} pointerEvents="box-none">
            {/* Description */}
            <View style={styles.descriptionSide} pointerEvents="box-none">
              {isExpanded ? (
                <TouchableOpacity
                  activeOpacity={0.85}
                  style={styles.descContainerExpanded}
                  onPress={() => handleDescPress(index)}
                >
                  <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: SCREEN_H * 0.45 }}>
                    <Text style={[styles.descText, styles.descTextExpanded]}>
                      {renderDescriptionWithHashtags(item.description)}
                    </Text>
                  </ScrollView>
                  <Text style={styles.descCollapseHint}>Tap to collapse</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  activeOpacity={0.85}
                  style={styles.descContainer}
                  onPress={() => handleDescPress(index)}
                >
                  <Text style={styles.descText} numberOfLines={2}>
                    {renderDescriptionWithHashtags(item.description)}
                  </Text>
                  <Text style={styles.descMoreHint}>more</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Controls */}
            <View style={styles.controlsColumn}>
              {/* Register */}
              <Animatable.View
                animation={registerAnimIndex === index ? "bounceIn" : undefined}
                duration={500}
                style={styles.controlItem}
              >
                <TouchableOpacity onPress={() => handleRegister(index)} activeOpacity={0.8} hitSlop={8}>
                  <Image
                    source={{ uri: "https://eliazar-applications.s3.us-east-2.amazonaws.com/georim/1748655210270-e781ce15-9e4d-4e94-9e26-520cd02a937f-register.png" }}
                    style={styles.icon}
                  />
                </TouchableOpacity>
                <Text style={styles.iconLabel}>Register</Text>
              </Animatable.View>

              {/* Like */}
              <AnimatedLikeButton liked={!!likedVideos[item.id]} onPress={() => toggleLike(item.id)} />

              {/* Comment */}
              <View style={styles.controlItem}>
                <TouchableOpacity onPress={() => setCommentVisible(true)} activeOpacity={0.8} hitSlop={8}>
                  <Icon name="chatbubble-ellipses-outline" size={28} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.iconLabel}>Comment</Text>
              </View>

              {/* Share */}
              <View style={styles.controlItem}>
                <TouchableOpacity onPress={() => handleShare(index)} activeOpacity={0.8} hitSlop={8}>
                  <Image
                    source={{ uri: "https://eliazar-applications.s3.us-east-2.amazonaws.com/georim/1748655276169-168fc654-0016-4bc2-a532-0b1a5cd17da0-send.png" }}
                    style={styles.icon}
                  />
                </TouchableOpacity>
                <Text style={styles.iconLabel}>Share</Text>
              </View>

              {/* Three dots */}
              <View style={styles.controlItem}>
                <TouchableOpacity onPress={() => setMenuVisible(true)} activeOpacity={0.8} hitSlop={8}>
                  <Icon name="ellipsis-vertical" size={24} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  }, [
    currentVideoIndex, expandedDescIndex, handleDescPress, handleRegister,
    handleShare, handleVideoPress, isVideoPlaying, likedVideos, pausedVideos,
    registerAnimIndex, renderDescriptionWithHashtags, toggleLike,
    showPauseIndicator, showPlayIndicator,
  ]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Banner */}
      <Animated.View style={bannerAnimStyle}>
        <View style={styles.bannerContainer}>
          <Animated.FlatList
            ref={bannerRef}
            data={bannerImages}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={onBannerScroll}
            onMomentumScrollEnd={onBannerMomentumEnd}
            renderItem={renderBannerItem}
            keyExtractor={(_, i) => i.toString()}
          />
          <View style={styles.dotsRow} pointerEvents="none">
            {bannerImages.map((_, i) => (
              <View key={i} style={[styles.dot, i === currentBannerIndex && styles.dotActive]} />
            ))}
          </View>
        </View>
      </Animated.View>

      {/* Event Cards */}
      <Animated.View style={cardsAnimStyle}>
        <FlatList
          data={eventCards}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.cardsContainer}
          renderItem={renderEventCard}
          keyExtractor={(item) => item.id}
          snapToInterval={SNAP_INTERVAL}
          decelerationRate="fast"
        />
      </Animated.View>

      {/* Video section */}
      <Animated.View style={[styles.videoSection, videoAnimStyle]}>
        <Text style={styles.sectionTitle}>Explore Other Events</Text>

        <TouchableOpacity
          activeOpacity={0.92}
          onPress={() => setVideoModalVisible(true)}
          style={styles.videoPreviewBox}
        >
          <Video
            ref={previewVideoRef}
            source={videoData[0].source}
            style={styles.videoPreview}
            resizeMode={ResizeMode.COVER}
            shouldPlay
            isLooping
            isMuted
          />
          <View style={styles.previewPlayHint} pointerEvents="none">
            <Icon name="play-circle-outline" size={48} color="rgba(255,255,255,0.7)" />
          </View>
        </TouchableOpacity>
      </Animated.View>

      {/* Fullscreen Modal */}
      <Modal
        visible={videoModalVisible}
        animationType="slide"
        statusBarTranslucent
        onRequestClose={() => setVideoModalVisible(false)}
      >
        <View style={styles.modalRoot}>
          <FlatList
            data={videoData}
            pagingEnabled
            showsVerticalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            renderItem={renderVideoItem}
            onMomentumScrollEnd={onVideoListMomentumEnd}
            getItemLayout={(_, index) => ({ length: SCREEN_H, offset: SCREEN_H * index, index })}
            removeClippedSubviews={Platform.OS === "android"}
            maxToRenderPerBatch={3}
            windowSize={3}
          />

          {/* Top bar */}
          <View style={styles.modalTopBar} pointerEvents="box-none">
            <TouchableOpacity
              style={styles.modalBackButton}
              onPress={() => setVideoModalVisible(false)}
              hitSlop={{ top: 14, bottom: 14, left: 14, right: 14 }}
              activeOpacity={0.75}
            >
              <Icon name="arrow-back" size={28} color="#7F00FF" />
            </TouchableOpacity>

            <View style={styles.videoCounter}>
              <Text style={styles.videoCounterText}>
                {currentVideoIndex + 1} / {videoData.length}
              </Text>
            </View>
          </View>
        </View>

        {/* Comment Sheet */}
        <CommentSheet
          visible={commentVisible}
          onClose={() => setCommentVisible(false)}
          videoId={videoData[currentVideoIndex]?.id ?? ""}
        />

        {/* Three-Dot Menu */}
        <ThreeDotMenu visible={menuVisible} onClose={() => setMenuVisible(false)} />
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  // --- Banner ---
  bannerContainer: { height: 200, width: SCREEN_W, paddingTop: 5, backgroundColor: "#fff", position: "relative" },
  bannerImage: { width: SCREEN_W, height: 200, resizeMode: "cover", borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
  dotsRow: { position: "absolute", bottom: 10, left: 0, right: 0, flexDirection: "row", justifyContent: "center", gap: 6 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: "rgba(255,255,255,0.5)" },
  dotActive: { backgroundColor: "rgba(127,0,255,0.95)", width: 18, borderRadius: 3 },

  // --- Event Cards ---
  cardsContainer: { paddingHorizontal: 15, paddingVertical: 16 },
  eventCard: {
    width: CARD_WIDTH, height: 154, marginRight: CARD_GAP, borderRadius: 15,
    backgroundColor: "#fff", elevation: 5, shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84,
    overflow: Platform.OS === "android" ? "hidden" : "visible",
  },
  eventImage: { width: "100%", height: 72, borderTopLeftRadius: 15, borderTopRightRadius: 15, borderBottomLeftRadius: 15, borderBottomRightRadius: 15 },
  eventDetails: { paddingHorizontal: 11, paddingTop: 10, paddingBottom: 10, flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  eventInfo: { flex: 1, paddingRight: 10 },
  eventTitle: { fontSize: 10, fontWeight: "bold", marginBottom: 4, color: "#000" },
  eventDate: { fontSize: 10, color: "#666", marginBottom: 4 },
  locationTypeContainer: { flexDirection: "row", alignItems: "center" },
  eventLocation: { fontSize: 10, color: "#666", maxWidth: 80 },
  separator: { marginHorizontal: 5, color: "#666" },
  eventType: { fontSize: 10, color: "#666" },
  attendeesContainer: { flexDirection: "row", alignItems: "center", width: 42, height: 24, justifyContent: "center" },
  attendeeProfile: { width: 22, height: 22, borderRadius: 11, position: "absolute", borderWidth: 2, borderColor: "#fff" },

  // --- Video preview ---
  videoSection: { flex: 1 },
  sectionTitle: { color: "#7F00FF", fontWeight: "bold", fontSize: 18, marginLeft: 20, marginBottom: 6, marginTop: 2 },
  videoPreviewBox: { flex: 1, marginHorizontal: 20, borderTopLeftRadius: 24, borderTopRightRadius: 24, overflow: "hidden", backgroundColor: "#000", position: "relative" },
  videoPreview: { width: "100%", height: "100%" },
  previewPlayHint: { ...StyleSheet.absoluteFillObject, justifyContent: "center", alignItems: "center" },

  // --- Fullscreen modal ---
  modalRoot: { flex: 1, backgroundColor: "#000" },
  modalTopBar: {
    position: "absolute", top: 0, left: 0, right: 0,
    paddingTop: SAFE_TOP, paddingHorizontal: 16, paddingBottom: 12,
    flexDirection: "row", alignItems: "center", justifyContent: "space-between", zIndex: 20,
  },
  modalBackButton: { width: 44, height: 44, alignItems: "center", justifyContent: "center" },
  videoCounter: { backgroundColor: "rgba(0,0,0,0.4)", borderRadius: 12, paddingHorizontal: 10, paddingVertical: 4 },
  videoCounterText: { color: "rgba(255,255,255,0.8)", fontSize: 13, fontWeight: "600" },

  fullscreenVideoBox: { width: "100%", height: SCREEN_H, backgroundColor: "#000" },
  fullscreenPressArea: { flex: 1, width: "100%", height: "100%" },
  fullscreenVideo: { width: "100%", height: "100%" },

  // --- Play/Pause indicator ---
  playPauseIndicator: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 30,
  },
  playPauseCircle: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center", alignItems: "center",
  },

  // --- Bottom content area ---
  bottomContentArea: {
    position: "absolute", left: 0, right: 0, bottom: SAFE_BOTTOM,
    flexDirection: "row", alignItems: "flex-end", paddingHorizontal: 14, zIndex: 20,
  },
  descriptionSide: { flex: 1, marginRight: 12, justifyContent: "flex-end" },

  descContainer: { borderRadius: 12, paddingHorizontal: 12, paddingVertical: 8 },
  descContainerExpanded: { backgroundColor: "rgba(0,0,0,0.45)", borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10 },
  descText: { color: "#fff", fontSize: 14, fontWeight: "400", lineHeight: 20 },
  descTextExpanded: { fontSize: 15, fontWeight: "500", lineHeight: 22 },
  descCollapseHint: { color: "#bbb", fontSize: 12, marginTop: 7, textAlign: "center" },
  descMoreHint: { color: "rgba(255,255,255,0.6)", fontSize: 13, fontWeight: "600", marginTop: 2 },
  hashtag: { color: "#7F00FF", fontWeight: "bold" },

  // --- Controls column ---
  controlsColumn: { alignItems: "center", justifyContent: "flex-end", gap: 2, paddingBottom: 4 },
  controlItem: { alignItems: "center", marginVertical: 4 },
  icon: { width: 28, height: 28, marginBottom: 2, tintColor: "#fff" },
  iconLabel: { color: "#fff", fontSize: 11, textAlign: "center", marginTop: 2 },

  // --- Comment Sheet ---
  commentOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)" },
  commentSheet: {
    position: "absolute", bottom: 0, left: 0, right: 0,
    height: SCREEN_H * 0.55,
    backgroundColor: "#1a1a2e", borderTopLeftRadius: 20, borderTopRightRadius: 20,
  },
  commentHandleRow: { alignItems: "center", paddingTop: 10, paddingBottom: 6 },
  commentHandle: { width: 40, height: 4, borderRadius: 2, backgroundColor: "rgba(255,255,255,0.3)" },
  commentTitle: { color: "#fff", fontSize: 16, fontWeight: "700", paddingHorizontal: 16, marginBottom: 12 },
  commentList: { flex: 1, paddingHorizontal: 16 },
  commentItem: { flexDirection: "row", marginBottom: 16, alignItems: "flex-start" },
  commentAvatar: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: "#7F00FF", justifyContent: "center", alignItems: "center", marginRight: 10,
  },
  commentAvatarText: { color: "#fff", fontWeight: "700", fontSize: 14 },
  commentContent: { flex: 1 },
  commentHeader: { flexDirection: "row", alignItems: "center", marginBottom: 3 },
  commentUser: { color: "#fff", fontWeight: "600", fontSize: 13, marginRight: 8 },
  commentTime: { color: "rgba(255,255,255,0.4)", fontSize: 11 },
  commentText: { color: "rgba(255,255,255,0.85)", fontSize: 14, lineHeight: 19 },
  commentInputRow: {
    flexDirection: "row", alignItems: "center",
    paddingHorizontal: 16, paddingVertical: 10,
    borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: "rgba(255,255,255,0.1)",
    paddingBottom: SAFE_BOTTOM + 6,
  },
  commentInput: {
    flex: 1, backgroundColor: "rgba(255,255,255,0.08)", borderRadius: 20,
    paddingHorizontal: 16, paddingVertical: 10,
    color: "#fff", fontSize: 14, maxHeight: 80,
  },
  commentSendBtn: { marginLeft: 10, padding: 8 },

  // --- Three-Dot Menu ---
  menuSheet: {
    position: "absolute", bottom: 0, left: 0, right: 0,
    backgroundColor: "#1a1a2e", borderTopLeftRadius: 20, borderTopRightRadius: 20,
    paddingBottom: SAFE_BOTTOM + 10,
  },
  menuItem: {
    flexDirection: "row", alignItems: "center", paddingVertical: 14, paddingHorizontal: 20,
  },
  menuItemText: { color: "#fff", fontSize: 16, marginLeft: 14, fontWeight: "500" },
  menuCancelBtn: {
    marginTop: 6, marginHorizontal: 20, paddingVertical: 14,
    alignItems: "center", borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "rgba(255,255,255,0.1)",
  },
  menuCancelText: { color: "rgba(255,255,255,0.6)", fontSize: 16, fontWeight: "600" },
});