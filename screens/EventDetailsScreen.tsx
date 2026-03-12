// import React, { useState, useCallback, useMemo, useRef } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   Image,
//   TouchableOpacity,
//   ScrollView,
//   Pressable,
//   Dimensions,
//   ImageSourcePropType,
//   FlatList,
//   ViewToken,
//   Platform,
//   Modal,
// } from "react-native";
// import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
// import { useSafeAreaInsets } from "react-native-safe-area-context";
// import { Ionicons } from "@expo/vector-icons";
// import { BlurView } from "expo-blur";
// import { Video, ResizeMode } from "expo-av";
// import { LinearGradient } from "expo-linear-gradient";
// import MapView, { Marker } from "react-native-maps";
// import type { RootStackParamList } from "../App";
// import TicketSelectionModal, {
//   type TicketSelectionModalRef,
// } from "../components/TicketSelectionModal";
// import BuzzCard from "../components/BuzzCard";

// const CircleGlassEffect = require("../components/GlassEffects/circleGlassEffect.png");

// const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
// const HERO_HEIGHT = Math.round(SCREEN_HEIGHT * 0.45);
// const HERO_CONTENT_WIDTH = SCREEN_WIDTH - 20 * 2;
// const FORM_BG = "#05031B";
// const HERO_DARK = "#1a1a2e";
// const OVERLAP = 120;
// const FORM_NEGATIVE_MARGIN = 300;

// type CarouselItem =
//   | { type: "image"; source: ImageSourcePropType | { uri: string } }
//   | { type: "video"; source: ReturnType<typeof require> };

// const DEFAULT_CAROUSEL: CarouselItem[] = [
//   { type: "image", source: require("../assets/Home/event-1.jpg") },
// ];

// type EventDetailsRoute = RouteProp<RootStackParamList, "EventDetails">;

// export default function EventDetailsScreen() {
//   const navigation = useNavigation<any>();
//   const route = useRoute<EventDetailsRoute>();
//   const insets = useSafeAreaInsets();
//   const { eventId, event } = route.params ?? {};

//   const [heroIndex, setHeroIndex] = useState(0);
//   const [showModal, setShowModal] = useState(false);
//   const [isMapFullScreen, setIsMapFullScreen] = useState(false); // State for full-screen map
//   const ticketModalRef = useRef<TicketSelectionModalRef>(null);

//   const BUTTON_ROW_HEIGHT = 60 + insets.top;
//   const CAROUSEL_HEIGHT = HERO_HEIGHT + OVERLAP - BUTTON_ROW_HEIGHT;

//   const carouselItems = useMemo((): CarouselItem[] => {
//     const fromEvent: CarouselItem[] = [];
//     if (event?.imageUrl)
//       fromEvent.push({ type: "image", source: { uri: event.imageUrl } });
//     if ((event as any)?.images?.length)
//       (event as any).images.slice(0, 3).forEach((img: string | number) => {
//         if (typeof img === "string")
//           fromEvent.push({ type: "image", source: { uri: img } });
//         else
//           fromEvent.push({ type: "image", source: img as ImageSourcePropType });
//       });
//     if (!(event as any)?.images?.length && (event as any)?.image)
//       fromEvent.push({ type: "image", source: (event as any).image });
//     if ((event as any)?.video)
//       fromEvent.push({ type: "video", source: (event as any).video });
//     if (fromEvent.length > 0) return fromEvent.slice(0, 3);
//     return DEFAULT_CAROUSEL;
//   }, [event]);

//   const eventFallbackImage = useMemo(():
//     | ImageSourcePropType
//     | { uri: string }
//     | null => {
//     if (!event) return null;
//     if ((event as any)?.image != null) return (event as any).image;
//     const imgs = (event as any)?.images;
//     if (imgs?.length && imgs[0] != null)
//       return typeof imgs[0] === "string"
//         ? { uri: imgs[0] }
//         : (imgs[0] as ImageSourcePropType);
//     if (event?.imageUrl) return { uri: event.imageUrl };
//     return null;
//   }, [event]);

//   const onViewableItemsChanged = useCallback(
//     ({ viewableItems }: { viewableItems: ViewToken[] }) => {
//       const idx = viewableItems[0]?.index;
//       if (typeof idx === "number") setHeroIndex(idx);
//     },
//     [],
//   );
//   const viewabilityConfig = useMemo(
//     () => ({ viewAreaCoveragePercentThreshold: 50 }),
//     [],
//   );

//   const currentItem = carouselItems[heroIndex] ?? carouselItems[0];

//   const renderCarouselItem = useCallback(
//     ({ item, index }: { item: CarouselItem; index: number }) => (
//       <View style={[styles.carouselPage, { height: CAROUSEL_HEIGHT }]}>
//         {item.type === "image" ? (
//           <Image
//             source={item.source}
//             style={[styles.carouselContent, { height: CAROUSEL_HEIGHT }]}
//             resizeMode="cover"
//           />
//         ) : (
//           <Video
//             source={item.source}
//             style={[styles.carouselContent, { height: CAROUSEL_HEIGHT }]}
//             resizeMode={ResizeMode.COVER}
//             isLooping
//             isMuted
//             shouldPlay={index === heroIndex}
//           />
//         )}
//       </View>
//     ),
//     [heroIndex, CAROUSEL_HEIGHT],
//   );

//   return (
//     <View style={styles.container}>
//       {/* Full-screen map */}
//       {isMapFullScreen && (
//         <View style={styles.fullScreenMap}>
//           <MapView
//             style={StyleSheet.absoluteFill}
//             initialRegion={{
//               latitude: 32.5252,
//               longitude: -92.714,
//               latitudeDelta: 0.01,
//               longitudeDelta: 0.01,
//             }}
//           >
//             <Marker coordinate={{ latitude: 32.5252, longitude: -92.714 }} />
//           </MapView>
//           <TouchableOpacity
//             style={styles.fullScreenBackButton}
//             onPress={() => setIsMapFullScreen(false)}
//           >
//             <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
//           </TouchableOpacity>
//         </View>
//       )}

//       {/* Main content */}
//       {!isMapFullScreen && (
//         <ScrollView
//           style={styles.scroll}
//           contentContainerStyle={styles.scrollContent}
//           showsVerticalScrollIndicator={false}
//         >
//           {/* Hero */}
//           <View
//             style={[
//               styles.heroWrap,
//               { height: HERO_HEIGHT + OVERLAP, zIndex: 2 },
//             ]}
//           >
//             <View
//               style={[
//                 StyleSheet.absoluteFill,
//                 { height: HERO_HEIGHT + OVERLAP },
//               ]}
//             >
//               {currentItem.type === "image" ? (
//                 <Image
//                   source={currentItem.source}
//                   style={[styles.heroImage, { height: HERO_HEIGHT + OVERLAP }]}
//                   resizeMode="cover"
//                 />
//               ) : (
//                 <Image
//                   source={
//                     eventFallbackImage ?? require("../assets/Home/event-1.jpg")
//                   }
//                   style={[styles.heroImage, { height: HERO_HEIGHT + OVERLAP }]}
//                   resizeMode="cover"
//                 />
//               )}
//               <BlurView
//                 intensity={Platform.OS === "ios" ? 60 : 45}
//                 tint="dark"
//                 style={StyleSheet.absoluteFill}
//               />
//               <LinearGradient
//                 colors={["transparent", FORM_BG] as const}
//                 locations={[HERO_HEIGHT / (HERO_HEIGHT + OVERLAP), 1]}
//                 style={StyleSheet.absoluteFill}
//                 pointerEvents="none"
//               />
//             </View>

//             <FlatList
//               data={carouselItems}
//               renderItem={renderCarouselItem}
//               keyExtractor={(_, i) => String(i)}
//               horizontal
//               pagingEnabled
//               showsHorizontalScrollIndicator={false}
//               onViewableItemsChanged={onViewableItemsChanged}
//               viewabilityConfig={viewabilityConfig}
//               snapToInterval={SCREEN_WIDTH}
//               snapToAlignment="center"
//               decelerationRate="fast"
//               style={[
//                 styles.carouselList,
//                 { top: BUTTON_ROW_HEIGHT, height: CAROUSEL_HEIGHT },
//               ]}
//               contentContainerStyle={styles.carouselContentContainer}
//             />

//             <View style={styles.pagination}>
//               {carouselItems.map((_, i) => (
//                 <View
//                   key={i}
//                   style={[styles.dot, i === heroIndex && styles.dotActive]}
//                 />
//               ))}
//             </View>
//           </View>

//           {/* Content section: event details */}
//           <View
//             style={[
//               styles.formSectionWrap,
//               { marginTop: -FORM_NEGATIVE_MARGIN, zIndex: 1 },
//             ]}
//           >
//             <LinearGradient
//               colors={["rgba(5, 3, 27, 0)", FORM_BG] as const}
//               locations={[0, 0.4]}
//               style={styles.formSectionGradientFull}
//             >
//               <View
//                 style={[
//                   styles.formSection,
//                   { paddingTop: FORM_NEGATIVE_MARGIN + 24 },
//                 ]}
//               >
//                 {/* Event details content */}
//                 <View style={styles.contentSection}>
//                   <View style={styles.headerRow}>
//                     <Text style={styles.contentTitle}>
//                       {(event as any)?.title ??
//                         (event as any)?.name ??
//                         "Apostolic Invitation"}
//                     </Text>
//                     <View style={styles.tag}>
//                       <Text style={styles.tagText}>Outdoor</Text>
//                     </View>
//                   </View>

//                   <View style={styles.dateRow}>
//                     <View style={styles.calendar}>
//                       <Text style={styles.month}>SEP</Text>
//                       <Text style={styles.day}>21</Text>
//                     </View>
//                     <View>
//                       <Text style={styles.fullDate}>Sunday September 2026</Text>
//                       <View style={styles.timeRow}>
//                         <Ionicons
//                           name="time-outline"
//                           size={16}
//                           color="#9CA3AF"
//                         />
//                         <Text style={styles.time}>7:30 AM – 9:00 AM</Text>
//                       </View>
//                     </View>
//                   </View>

//                   <View style={styles.attendingRow}>
//                     <Text style={styles.attending}>
//                       11k people are attending
//                     </Text>
//                     <View style={styles.avatarStack}>
//                       {[1, 2, 3, 4].map((_, i) => (
//                         <Image
//                           key={i}
//                           source={require("../assets/Home/profile.jpg")}
//                           style={[
//                             styles.avatar,
//                             { marginLeft: i === 0 ? 0 : -12 },
//                           ]}
//                         />
//                       ))}
//                     </View>
//                   </View>

//                   <Text style={styles.section}>About Event</Text>
//                   <Text style={styles.about} numberOfLines={5}>
//                     {(event as any)?.description ??
//                       "Apostolic Invitation is a powerful gathering designed to ignite faith, deepen spiritual understanding, and foster community among believers across generations."}
//                   </Text>

//                   <Pressable onPress={() => setShowModal(true)}>
//                     <Text style={styles.readMore}>Read more</Text>
//                   </Pressable>

//                   <View style={styles.metaRow}>
//                     <View style={styles.badge}>
//                       <Text style={styles.badgeText}>Recurring Event</Text>
//                     </View>
//                     <Pressable
//                       style={styles.reviewLink}
//                       onPress={() => navigation.navigate("ReviewsScreen")}
//                     >
//                       <Text style={styles.review}>Reviews</Text>
//                       <Ionicons
//                         name="chevron-forward"
//                         size={16}
//                         color="#7F00FF"
//                       />
//                     </Pressable>
//                   </View>

//                   <View style={styles.locationCard}>
//                     <Pressable onPress={() => setIsMapFullScreen(true)}>
//                       <MapView
//                         style={styles.map}
//                         initialRegion={{
//                           latitude: 32.5252,
//                           longitude: -92.714,
//                           latitudeDelta: 0.01,
//                           longitudeDelta: 0.01,
//                         }}
//                       >
//                         <Marker
//                           coordinate={{ latitude: 32.5252, longitude: -92.714 }}
//                         />
//                       </MapView>
//                     </Pressable>
//                     <View style={styles.locationInfo}>
//                       <Text style={styles.address}>
//                         123 Revival Street, Grambling, Louisiana
//                       </Text>
//                       <Pressable style={styles.directions}>
//                         <Ionicons
//                           name="arrow-up-outline"
//                           size={18}
//                           color="#FFF"
//                         />
//                         <Text style={styles.directionsText}>
//                           Get Directions
//                         </Text>
//                       </Pressable>
//                     </View>
//                   </View>

//                   <Pressable style={styles.viewMore}>
//                     <Text style={styles.viewMoreText}>
//                       View more event details
//                     </Text>
//                     <Ionicons name="chevron-forward" size={16} color="#FFF" />
//                   </Pressable>
//                 </View>

//                 <BuzzCard />

//                 {/* Register button */}
//                 <Pressable
//                   style={({ pressed }) => [
//                     styles.registerButton,
//                     pressed && styles.registerButtonPressed,
//                   ]}
//                   onPress={() => ticketModalRef.current?.present()}
//                 >
//                   <LinearGradient
//                     colors={["rgba(110, 35, 186, 1)", "rgba(40, 38, 145, 1)"]}
//                     start={{ x: 0, y: 0 }}
//                     end={{ x: 1, y: 0 }}
//                     style={StyleSheet.absoluteFill}
//                   />
//                   <Text style={styles.registerButtonText}>Register</Text>
//                 </Pressable>

//                 <View style={{ height: 40 }} />
//               </View>
//             </LinearGradient>
//           </View>
//         </ScrollView>
//       )}

//       {/* Fixed hero buttons */}
//       <View
//         style={[
//           styles.heroButtons,
//           styles.heroButtonsFixed,
//           { paddingTop: 8 + insets.top },
//         ]}
//         pointerEvents="box-none"
//       >
//         <View style={styles.heroButtonGlass}>
//           <BlurView
//             intensity={24}
//             tint="dark"
//             style={StyleSheet.absoluteFill}
//           />
//           <Image source={CircleGlassEffect} style={styles.heroButtonShine} />
//           <TouchableOpacity
//             style={styles.heroButtonInner}
//             onPress={() => navigation.goBack()}
//             hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
//           >
//             <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
//           </TouchableOpacity>
//         </View>
//         <View style={styles.heroButtonsRight}>
//           <View style={styles.heroButtonGlass}>
//             <BlurView
//               intensity={24}
//               tint="dark"
//               style={StyleSheet.absoluteFill}
//             />
//             <Image source={CircleGlassEffect} style={styles.heroButtonShine} />
//             <TouchableOpacity style={styles.heroButtonInner}>
//               <Ionicons name="bookmark-outline" size={22} color="#FFFFFF" />
//             </TouchableOpacity>
//           </View>
//           <View style={styles.heroButtonGlass}>
//             <BlurView
//               intensity={24}
//               tint="dark"
//               style={StyleSheet.absoluteFill}
//             />
//             <Image source={CircleGlassEffect} style={styles.heroButtonShine} />
//             <TouchableOpacity style={styles.heroButtonInner}>
//               <Ionicons name="share-outline" size={22} color="#FFFFFF" />
//             </TouchableOpacity>
//           </View>
//         </View>
//       </View>

//       {/* Read more modal */}
//       <Modal visible={showModal} animationType="fade" transparent>
//         <BlurView intensity={80} tint="dark" style={styles.modalBg}>
//           <View style={styles.modalCard}>
//             <Text style={styles.modalTitle}>About Event</Text>
//             <ScrollView>
//               <Text style={styles.modalText}>
//                 Apostolic Invitation is a transformational gathering designed to
//                 unify believers, empower faith, and cultivate spiritual growth
//                 through worship, teaching, and fellowship...
//               </Text>
//             </ScrollView>
//             <Pressable onPress={() => setShowModal(false)}>
//               <Text style={styles.close}>Close</Text>
//             </Pressable>
//           </View>
//         </BlurView>
//       </Modal>

//       <TicketSelectionModal
//         ref={ticketModalRef}
//         eventTitle={(event as any)?.title ?? (event as any)?.name ?? "Event"}
//         eventDescription={(event as any)?.description}
//         onSelectTicket={(tier) => {
//           ticketModalRef.current?.dismiss();
//           navigation.navigate("RegisterEvent", {
//             eventId: eventId ?? "",
//             event,
//             selectedTier: tier,
//           });
//         }}
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: FORM_BG,
//   },
//   heroButtons: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     paddingHorizontal: 16,
//     paddingBottom: 12,
//   },
//   heroButtonsFixed: {
//     position: "absolute",
//     top: 0,
//     left: 0,
//     right: 0,
//     zIndex: 10,
//   },
//   heroButtonGlass: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     overflow: "hidden",
//     position: "relative",
//   },
//   heroButtonShine: {
//     ...StyleSheet.absoluteFillObject,
//     width: undefined,
//     height: undefined,
//     resizeMode: "stretch",
//   },
//   heroButtonInner: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "rgba(0,0,0,0.001)",
//   },
//   heroButtonsRight: {
//     flexDirection: "row",
//     gap: 12,
//   },
//   heroWrap: {
//     width: SCREEN_WIDTH,
//     backgroundColor: HERO_DARK,
//     overflow: "hidden",
//     position: "relative",
//   },
//   heroImage: {
//     width: SCREEN_WIDTH,
//   },
//   carouselList: {
//     position: "absolute",
//     left: 0,
//     right: 0,
//   },
//   carouselContentContainer: {},
//   carouselPage: {
//     width: SCREEN_WIDTH,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   carouselContent: {
//     width: HERO_CONTENT_WIDTH,
//     borderRadius: 10,
//     overflow: "hidden",
//   },
//   formSectionWrap: {
//     width: SCREEN_WIDTH,
//   },
//   formSectionGradientFull: {
//     width: SCREEN_WIDTH,
//   },
//   formSection: {
//     paddingHorizontal: 20,
//     paddingTop: 24,
//     paddingBottom: 24,
//   },
//   pagination: {
//     position: "absolute",
//     bottom: 0,
//     left: 0,
//     right: 0,
//     paddingBottom: 16,
//     flexDirection: "row",
//     justifyContent: "center",
//     alignItems: "center",
//     gap: 8,
//   },
//   dot: {
//     width: 8,
//     height: 8,
//     borderRadius: 4,
//     backgroundColor: "#F6F8F9",
//     opacity: 0.3,
//   },
//   dotActive: {
//     backgroundColor: "#7F00FF",
//     width: 60,
//     borderRadius: 4,
//     opacity: 0.3,
//   },
//   scroll: {
//     flex: 1,
//   },
//   scrollContent: {
//     paddingBottom: 24,
//   },
//   // Event details content
//   contentSection: {},
//   headerRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 3,
//   },
//   contentTitle: {
//     fontSize: 22,
//     fontWeight: "700",
//     color: "#FFF",
//   },
//   tag: {
//     backgroundColor: "#1E1E3F",
//     padding: 8,
//     borderRadius: 20,
//   },
//   tagText: {
//     color: "#FFF",
//     fontSize: 12,
//   },
//   dateRow: {
//     flexDirection: "row",
//     marginVertical: 14,
//   },
//   calendar: {
//     width: 50,
//     height: 50,
//     backgroundColor: "#1E1E3F",
//     borderRadius: 14,
//     alignItems: "center",
//     justifyContent: "center",
//     marginRight: 12,
//   },
//   month: {
//     color: "#9CA3AF",
//   },
//   day: {
//     color: "#FFF",
//     fontSize: 22,
//     fontWeight: "800",
//   },
//   fullDate: {
//     color: "#FFF",
//     fontWeight: "600",
//   },
//   timeRow: {
//     flexDirection: "row",
//     gap: 6,
//     marginTop: 4,
//   },
//   time: {
//     color: "#9CA3AF",
//   },
//   attendingRow: {
//     flexDirection: "row",
//     marginBottom: 10,
//   },
//   attending: {
//     color: "#7F00FF",
//     fontWeight: "600",
//     marginRight: 4,
//   },
//   avatarStack: {
//     flexDirection: "row",
//     marginBottom: 3,
//   },
//   avatar: {
//     width: 32,
//     height: 32,
//     borderRadius: 16,
//     borderWidth: 2,
//     borderColor: FORM_BG,
//   },
//   section: {
//     fontSize: 20,
//     color: "#FFF",
//     fontWeight: "700",
//   },
//   about: {
//     color: "#D1D5DB",
//     marginTop: 6,
//   },
//   readMore: {
//     color: "#7F00FF",
//     marginTop: 6,
//   },
//   metaRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginVertical: 20,
//   },
//   badge: {
//     backgroundColor: "#1E1E3F",
//     padding: 8,
//     borderRadius: 20,
//   },
//   badgeText: {
//     color: "#FFF",
//   },
//   reviewLink: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 4,
//   },
//   review: {
//     color: "#7F00FF",
//     textDecorationLine: "underline",
//   },
//   locationCard: {
//     flexDirection: "row",
//     backgroundColor: "#1E1E3F",
//     borderRadius: 16,
//     padding: 12,
//     marginBottom: 20,
//   },
//   map: {
//     width: 90,
//     height: 90,
//     borderRadius: 12,
//   },
//   locationInfo: {
//     flex: 1,
//     marginLeft: 12,
//   },
//   address: {
//     color: "#FFF",
//   },
//   directions: {
//     flexDirection: "row",
//     backgroundColor: "#7F00FF",
//     padding: 8,
//     borderRadius: 20,
//     marginTop: 8,
//     gap: 6,
//     alignSelf: "flex-start",
//   },
//   directionsText: {
//     color: "#FFF",
//     fontWeight: "600",
//   },
//   viewMore: {
//     flexDirection: "row",
//     gap: 6,
//     marginBottom: 24,
//   },
//   viewMoreText: {
//     color: "#FFF",
//     textDecorationLine: "underline",
//   },
//   registerButton: {
//     borderRadius: 26,
//     paddingVertical: 16,
//     overflow: "hidden",
//     position: "relative",
//     alignItems: "center",
//     justifyContent: "center",
//     borderWidth: 1,
//     borderColor: "rgba(255, 255, 255, 0.2)",
//   },
//   registerButtonPressed: {
//     opacity: 0.9,
//   },
//   registerButtonText: {
//     fontSize: 18,
//     fontWeight: "700",
//     color: "#FFFFFF",
//     zIndex: 1,
//   },
//   modalBg: {
//     flex: 1,
//     justifyContent: "center",
//     padding: 20,
//   },
//   modalCard: {
//     backgroundColor: "#1E1E3F",
//     borderRadius: 20,
//     padding: 20,
//     maxHeight: "80%",
//   },
//   modalTitle: {
//     color: "#FFF",
//     fontSize: 22,
//     fontWeight: "700",
//   },
//   modalText: {
//     color: "#D1D5DB",
//     marginTop: 12,
//   },
//   close: {
//     color: "#7F00FF",
//     marginTop: 20,
//     textAlign: "center",
//   },
//   fullScreenMap: {
//     ...StyleSheet.absoluteFillObject,
//     backgroundColor: "#000",
//     zIndex: 100,
//   },
//   fullScreenBackButton: {
//     position: "absolute",
//     top: 40,
//     left: 20,
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: "rgba(0, 0, 0, 0.6)",
//     justifyContent: "center",
//     alignItems: "center",
//     zIndex: 101,
//   },
// });

import React, { useState, useCallback, useMemo, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Pressable,
  Dimensions,
  ImageSourcePropType,
  FlatList,
  ViewToken,
  Platform,
  Modal,
} from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { useVideoPlayer, VideoView } from "expo-video";
import { LinearGradient } from "expo-linear-gradient";
import MapView, { Marker } from "react-native-maps";
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInLeft,
  FadeInRight,
  FadeInUp,
  FadeOut,
  SlideInDown,
  SlideInUp,
  ZoomIn,
  Layout,
  useSharedValue,
  useAnimatedStyle,
  useAnimatedScrollHandler,
  withTiming,
  withSpring,
  withDelay,
  interpolate,
  Extrapolation,
  Easing,
} from "react-native-reanimated";
import type { RootStackParamList } from "../App";
import TicketSelectionModal, {
  type TicketSelectionModalRef,
} from "../components/TicketSelectionModal";
import BuzzCard from "../components/BuzzCard";

const CircleGlassEffect = require("../components/GlassEffects/circleGlassEffect.png");

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const HERO_HEIGHT = Math.round(SCREEN_HEIGHT * 0.45);
const HERO_CONTENT_WIDTH = SCREEN_WIDTH - 20 * 2;
const FORM_BG = "#05031B";
const HERO_DARK = "#1a1a2e";
const OVERLAP = 120;
const FORM_NEGATIVE_MARGIN = 300;
const BUTTON_SIZE = 42;
const BUTTON_RADIUS = BUTTON_SIZE / 2;

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);

type CarouselItem =
  | { type: "image"; source: ImageSourcePropType | { uri: string } }
  | { type: "video"; source: ReturnType<typeof require> };

function CarouselVideoItem({
  source,
  shouldPlay,
  style,
}: {
  source: any;
  shouldPlay: boolean;
  style: any;
}) {
  const player = useVideoPlayer(source, (p) => {
    p.loop = true;
    p.muted = true;
  });

  React.useEffect(() => {
    if (shouldPlay) player.play();
    else player.pause();
  }, [shouldPlay, player]);

  return (
    <VideoView
      player={player}
      style={style}
      contentFit="cover"
      nativeControls={false}
    />
  );
}

const DEFAULT_CAROUSEL: CarouselItem[] = [
  { type: "image", source: require("../assets/Home/event-1.jpg") },
];

type EventDetailsRoute = RouteProp<RootStackParamList, "EventDetails">;

// ─── Dot Indicator ────────────────────────────────────────────────────

const CarouselDot = ({
  active,
  index,
}: {
  active: boolean;
  index: number;
}) => (
  <Animated.View
    layout={Layout.springify().damping(16).stiffness(140)}
    style={[
      styles.dot,
      active && styles.dotActive,
    ]}
  />
);

// ─── Glass Button Component ──────────────────────────────────────────

const GlassButton = ({
  onPress,
  icon,
  size = 22,
  delay = 0,
}: {
  onPress?: () => void;
  icon: string;
  size?: number;
  delay?: number;
}) => (
  <Animated.View
    entering={FadeInDown.delay(delay).duration(500).springify().damping(14)}
    style={styles.heroButtonGlass}
  >
    <BlurView
      intensity={Platform.OS === "ios" ? 28 : 0}
      tint="dark"
      style={StyleSheet.absoluteFill}
    />
    {Platform.OS === "android" && (
      <View style={[StyleSheet.absoluteFill, styles.androidButtonFallback]} />
    )}
    <Image source={CircleGlassEffect} style={styles.heroButtonShine} />
    <TouchableOpacity
      style={styles.heroButtonInner}
      onPress={onPress}
      activeOpacity={0.7}
      hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
    >
      <Ionicons name={icon as any} size={size} color="#FFFFFF" />
    </TouchableOpacity>
  </Animated.View>
);

// ─── Main Component ──────────────────────────────────────────────────

export default function EventDetailsScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<EventDetailsRoute>();
  const insets = useSafeAreaInsets();
  const { eventId, event } = route.params ?? {};

  const [heroIndex, setHeroIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [isMapFullScreen, setIsMapFullScreen] = useState(false);
  const ticketModalRef = useRef<TicketSelectionModalRef>(null);

  const scrollY = useSharedValue(0);
  const BUTTON_ROW_HEIGHT = 60 + insets.top;
  const CAROUSEL_HEIGHT = HERO_HEIGHT + OVERLAP - BUTTON_ROW_HEIGHT;

  // ─── Carousel Data ─────────────────────────────────────────────────

  const carouselItems = useMemo((): CarouselItem[] => {
    const fromEvent: CarouselItem[] = [];
    if (event?.imageUrl)
      fromEvent.push({ type: "image", source: { uri: event.imageUrl } });
    if ((event as any)?.images?.length)
      (event as any).images.slice(0, 3).forEach((img: string | number) => {
        if (typeof img === "string")
          fromEvent.push({ type: "image", source: { uri: img } });
        else
          fromEvent.push({ type: "image", source: img as ImageSourcePropType });
      });
    if (!(event as any)?.images?.length && (event as any)?.image)
      fromEvent.push({ type: "image", source: (event as any).image });
    if ((event as any)?.video)
      fromEvent.push({ type: "video", source: (event as any).video });
    if (fromEvent.length > 0) return fromEvent.slice(0, 3);
    return DEFAULT_CAROUSEL;
  }, [event]);

  const eventFallbackImage = useMemo(():
    | ImageSourcePropType
    | { uri: string }
    | null => {
    if (!event) return null;
    if ((event as any)?.image != null) return (event as any).image;
    const imgs = (event as any)?.images;
    if (imgs?.length && imgs[0] != null)
      return typeof imgs[0] === "string"
        ? { uri: imgs[0] }
        : (imgs[0] as ImageSourcePropType);
    if (event?.imageUrl) return { uri: event.imageUrl };
    return null;
  }, [event]);

  // ─── Callbacks ─────────────────────────────────────────────────────

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      const idx = viewableItems[0]?.index;
      if (typeof idx === "number") setHeroIndex(idx);
    },
    []
  );

  const viewabilityConfig = useMemo(
    () => ({ viewAreaCoveragePercentThreshold: 50 }),
    []
  );

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (e) => {
      scrollY.value = e.contentOffset.y;
    },
  });

  const currentItem = carouselItems[heroIndex] ?? carouselItems[0];

  // ─── Animated Styles ───────────────────────────────────────────────

  const headerBarStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [0, HERO_HEIGHT * 0.5, HERO_HEIGHT * 0.7],
      [0, 0, 1],
      Extrapolation.CLAMP
    );
    return {
      backgroundColor: `rgba(5, 3, 27, ${opacity * 0.95})`,
    };
  });

  const heroParallaxStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: interpolate(
          scrollY.value,
          [-100, 0, HERO_HEIGHT],
          [-30, 0, HERO_HEIGHT * 0.3],
          Extrapolation.CLAMP
        ),
      },
      {
        scale: interpolate(
          scrollY.value,
          [-200, 0],
          [1.15, 1],
          Extrapolation.CLAMP
        ),
      },
    ],
  }));

  // ─── Render Carousel Item ──────────────────────────────────────────

  const renderCarouselItem = useCallback(
    ({ item, index }: { item: CarouselItem; index: number }) => (
      <View style={[styles.carouselPage, { height: CAROUSEL_HEIGHT }]}>
        {item.type === "image" ? (
          <Image
            source={item.source}
            style={[styles.carouselContent, { height: CAROUSEL_HEIGHT }]}
            resizeMode="cover"
          />
        ) : (
          <CarouselVideoItem
            source={item.source}
            style={[styles.carouselContent, { height: CAROUSEL_HEIGHT }]}
            shouldPlay={index === heroIndex}
          />
        )}
      </View>
    ),
    [heroIndex, CAROUSEL_HEIGHT]
  );

  // ─── Render ────────────────────────────────────────────────────────

  return (
    <View style={styles.container}>
      {/* ─── Full-screen map ─── */}
      {isMapFullScreen && (
        <Animated.View
          entering={FadeIn.duration(300)}
          exiting={FadeOut.duration(250)}
          style={styles.fullScreenMap}
        >
          <MapView
            style={StyleSheet.absoluteFill}
            initialRegion={{
              latitude: 32.5252,
              longitude: -92.714,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
          >
            <Marker coordinate={{ latitude: 32.5252, longitude: -92.714 }} />
          </MapView>
          <TouchableOpacity
            style={[styles.fullScreenBackButton, { top: 12 + insets.top }]}
            onPress={() => setIsMapFullScreen(false)}
            activeOpacity={0.7}
          >
            <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </Animated.View>
      )}

      {/* ─── Main content ─── */}
      {!isMapFullScreen && (
        <AnimatedScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          onScroll={scrollHandler}
          scrollEventThrottle={16}
        >
          {/* ─── Hero ─── */}
          <Animated.View
            style={[
              styles.heroWrap,
              { height: HERO_HEIGHT + OVERLAP, zIndex: 2 },
              heroParallaxStyle,
            ]}
          >
            <View
              style={[
                StyleSheet.absoluteFill,
                { height: HERO_HEIGHT + OVERLAP },
              ]}
            >
              {currentItem.type === "image" ? (
                <Image
                  source={currentItem.source}
                  style={[styles.heroImage, { height: HERO_HEIGHT + OVERLAP }]}
                  resizeMode="cover"
                />
              ) : (
                <Image
                  source={
                    eventFallbackImage ?? require("../assets/Home/event-1.jpg")
                  }
                  style={[styles.heroImage, { height: HERO_HEIGHT + OVERLAP }]}
                  resizeMode="cover"
                />
              )}
              <BlurView
                intensity={Platform.OS === "ios" ? 60 : 45}
                tint="dark"
                style={StyleSheet.absoluteFill}
              />
              <LinearGradient
                colors={["transparent", FORM_BG] as const}
                locations={[HERO_HEIGHT / (HERO_HEIGHT + OVERLAP), 1]}
                style={StyleSheet.absoluteFill}
                pointerEvents="none"
              />
            </View>

            <FlatList
              data={carouselItems}
              renderItem={renderCarouselItem}
              keyExtractor={(_, i) => String(i)}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onViewableItemsChanged={onViewableItemsChanged}
              viewabilityConfig={viewabilityConfig}
              snapToInterval={SCREEN_WIDTH}
              snapToAlignment="center"
              decelerationRate="fast"
              style={[
                styles.carouselList,
                { top: BUTTON_ROW_HEIGHT, height: CAROUSEL_HEIGHT },
              ]}
              contentContainerStyle={styles.carouselContentContainer}
              getItemLayout={(_, index) => ({
                length: SCREEN_WIDTH,
                offset: SCREEN_WIDTH * index,
                index,
              })}
            />

            {/* Pagination */}
            <Animated.View
              entering={FadeInUp.delay(600).duration(400)}
              style={styles.pagination}
            >
              {carouselItems.map((_, i) => (
                <CarouselDot key={i} active={i === heroIndex} index={i} />
              ))}
            </Animated.View>
          </Animated.View>

          {/* ─── Content Section ─── */}
          <View
            style={[
              styles.formSectionWrap,
              { marginTop: -FORM_NEGATIVE_MARGIN, zIndex: 1 },
            ]}
          >
            <LinearGradient
              colors={["rgba(5, 3, 27, 0)", FORM_BG] as const}
              locations={[0, 0.4]}
              style={styles.formSectionGradientFull}
            >
              <View
                style={[
                  styles.formSection,
                  { paddingTop: FORM_NEGATIVE_MARGIN + 24 },
                ]}
              >
                <View style={styles.contentSection}>
                  {/* ─── Title + Tag ─── */}
                  <Animated.View
                    entering={FadeInDown.delay(200).duration(500).springify().damping(16)}
                    style={styles.headerRow}
                  >
                    <Text style={styles.contentTitle} numberOfLines={2}>
                      {(event as any)?.title ??
                        (event as any)?.name ??
                        "Apostolic Invitation"}
                    </Text>
                    <View style={styles.tag}>
                      <Text style={styles.tagText}>Outdoor</Text>
                    </View>
                  </Animated.View>

                  {/* ─── Date Row ─── */}
                  <Animated.View
                    entering={FadeInDown.delay(300).duration(500).springify().damping(16)}
                    style={styles.dateRow}
                  >
                    <View style={styles.calendar}>
                      <Text style={styles.month}>SEP</Text>
                      <Text style={styles.day}>21</Text>
                    </View>
                    <View style={styles.dateInfo}>
                      <Text style={styles.fullDate}>
                        Sunday September 2026
                      </Text>
                      <View style={styles.timeRow}>
                        <Ionicons
                          name="time-outline"
                          size={16}
                          color="#9CA3AF"
                        />
                        <Text style={styles.time}>7:30 AM – 9:00 AM</Text>
                      </View>
                    </View>
                  </Animated.View>

                  {/* ─── Attending Row ─── */}
                  <Animated.View
                    entering={FadeInDown.delay(400).duration(500).springify().damping(16)}
                    style={styles.attendingRow}
                  >
                    <Text style={styles.attending}>
                      11k people are attending
                    </Text>
                    <View style={styles.avatarStack}>
                      {[1, 2, 3, 4].map((_, i) => (
                        <Animated.Image
                          key={i}
                          entering={FadeInRight.delay(500 + i * 80)
                            .duration(400)
                            .springify()
                            .damping(14)}
                          source={require("../assets/Home/profile.jpg")}
                          style={[
                            styles.avatar,
                            { marginLeft: i === 0 ? 0 : -12 },
                          ]}
                        />
                      ))}
                    </View>
                  </Animated.View>

                  {/* ─── About Event ─── */}
                  <Animated.View
                    entering={FadeInDown.delay(500).duration(500)}
                  >
                    <Text style={styles.sectionTitle}>About Event</Text>
                    <Text style={styles.about} numberOfLines={5}>
                      {(event as any)?.description ??
                        "Apostolic Invitation is a powerful gathering designed to ignite faith, deepen spiritual understanding, and foster community among believers across generations."}
                    </Text>
                    <Pressable
                      onPress={() => setShowModal(true)}
                      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    >
                      <Text style={styles.readMore}>Read more</Text>
                    </Pressable>
                  </Animated.View>

                  {/* ─── Meta Row ─── */}
                  <Animated.View
                    entering={FadeInDown.delay(600).duration(500)}
                    style={styles.metaRow}
                  >
                    <View style={styles.badge}>
                      <Ionicons
                        name="repeat-outline"
                        size={14}
                        color="#9CA3AF"
                        style={{ marginRight: 6 }}
                      />
                      <Text style={styles.badgeText}>Recurring Event</Text>
                    </View>
                    <Pressable
                      style={styles.reviewLink}
                      onPress={() => navigation.navigate("ReviewsScreen")}
                      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    >
                      <Text style={styles.review}>Reviews</Text>
                      <Ionicons
                        name="chevron-forward"
                        size={16}
                        color="#7F00FF"
                      />
                    </Pressable>
                  </Animated.View>

                  {/* ─── Location Card ─── */}
                  <Animated.View
                    entering={FadeInDown.delay(700).duration(600).springify().damping(16)}
                    style={styles.locationCard}
                  >
                    <Pressable
                      onPress={() => setIsMapFullScreen(true)}
                      style={styles.mapContainer}
                    >
                      <MapView
                        style={styles.map}
                        initialRegion={{
                          latitude: 32.5252,
                          longitude: -92.714,
                          latitudeDelta: 0.01,
                          longitudeDelta: 0.01,
                        }}
                        scrollEnabled={false}
                        zoomEnabled={false}
                        rotateEnabled={false}
                        pitchEnabled={false}
                      >
                        <Marker
                          coordinate={{
                            latitude: 32.5252,
                            longitude: -92.714,
                          }}
                        />
                      </MapView>
                      {/* Expand hint overlay */}
                      <View style={styles.mapExpandHint}>
                        <Ionicons
                          name="expand-outline"
                          size={16}
                          color="rgba(255,255,255,0.8)"
                        />
                      </View>
                    </Pressable>
                    <View style={styles.locationInfo}>
                      <View style={styles.locationIconRow}>
                        <Ionicons
                          name="location-outline"
                          size={16}
                          color="#9CA3AF"
                          style={{ marginRight: 6, marginTop: 2 }}
                        />
                        <Text style={styles.address}>
                          123 Revival Street, Grambling, Louisiana
                        </Text>
                      </View>
                      <Pressable
                        style={({ pressed }) => [
                          styles.directions,
                          pressed && { opacity: 0.8 },
                        ]}
                      >
                        <Ionicons
                          name="navigate-outline"
                          size={16}
                          color="#FFF"
                        />
                        <Text style={styles.directionsText}>
                          Get Directions
                        </Text>
                      </Pressable>
                    </View>
                  </Animated.View>

                  {/* ─── View More ─── */}
                  <Animated.View
                    entering={FadeInDown.delay(800).duration(400)}
                  >
                    <Pressable
                      style={({ pressed }) => [
                        styles.viewMore,
                        pressed && { opacity: 0.7 },
                      ]}
                    >
                      <Text style={styles.viewMoreText}>
                        View more event details
                      </Text>
                      <Ionicons
                        name="chevron-forward"
                        size={16}
                        color="#FFF"
                      />
                    </Pressable>
                  </Animated.View>
                </View>

                {/* ─── Buzz Card ─── */}
                <Animated.View
                  entering={FadeInDown.delay(900).duration(500).springify().damping(14)}
                >
                  <BuzzCard />
                </Animated.View>

                {/* ─── Register Button ─── */}
                <Animated.View
                  entering={SlideInDown.delay(1000)
                    .duration(600)
                    .springify()
                    .damping(14)}
                >
                  <Pressable
                    style={({ pressed }) => [
                      styles.registerButton,
                      pressed && styles.registerButtonPressed,
                    ]}
                    onPress={() => ticketModalRef.current?.present()}
                  >
                    <LinearGradient
                      colors={[
                        "rgba(110, 35, 186, 1)",
                        "rgba(40, 38, 145, 1)",
                      ]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={[StyleSheet.absoluteFill, { borderRadius: 26 }]}
                    />
                    <Text style={styles.registerButtonText}>Register</Text>
                  </Pressable>
                </Animated.View>

                <View style={{ height: 50 }} />
              </View>
            </LinearGradient>
          </View>
        </AnimatedScrollView>
      )}

      {/* ─── Fixed Hero Buttons ─── */}
      <Animated.View
        style={[
          styles.heroButtons,
          styles.heroButtonsFixed,
          { paddingTop: 8 + insets.top },
          headerBarStyle,
        ]}
        pointerEvents="box-none"
      >
        <GlassButton
          icon="chevron-back"
          size={24}
          onPress={() => navigation.goBack()}
          delay={100}
        />
        <View style={styles.heroButtonsRight}>
          <GlassButton icon="bookmark-outline" size={22} delay={200} />
          <GlassButton icon="share-outline" size={22} delay={300} />
        </View>
      </Animated.View>

      {/* ─── Read More Modal ─── */}
      <Modal visible={showModal} animationType="fade" transparent>
        <BlurView intensity={80} tint="dark" style={styles.modalBg}>
          <Animated.View
            entering={ZoomIn.duration(300).springify().damping(14)}
            style={styles.modalCard}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>About Event</Text>
              <TouchableOpacity
                onPress={() => setShowModal(false)}
                style={styles.modalCloseBtn}
                activeOpacity={0.7}
              >
                <Ionicons name="close" size={22} color="#9CA3AF" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalDivider} />

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.modalScrollContent}
            >
              <Text style={styles.modalText}>
                Apostolic Invitation is a transformational gathering designed to
                unify believers, empower faith, and cultivate spiritual growth
                through worship, teaching, and fellowship. This event brings
                together leaders, pastors, and community members from across the
                region for an unforgettable experience of renewal and connection.
                {"\n\n"}
                Join us for powerful worship sessions, keynote speakers, and
                breakout workshops designed to equip you for the journey ahead.
                Whether you're a seasoned believer or exploring faith for the
                first time, there's a place for you here.
              </Text>
            </ScrollView>

            <Pressable
              style={({ pressed }) => [
                styles.modalCloseButton,
                pressed && { opacity: 0.8 },
              ]}
              onPress={() => setShowModal(false)}
            >
              <Text style={styles.modalCloseButtonText}>Close</Text>
            </Pressable>
          </Animated.View>
        </BlurView>
      </Modal>

      {/* ─── Ticket Selection Modal ─── */}
      <TicketSelectionModal
        ref={ticketModalRef}
        eventTitle={(event as any)?.title ?? (event as any)?.name ?? "Event"}
        eventDescription={(event as any)?.description}
        onSelectTicket={(tier) => {
          ticketModalRef.current?.dismiss();
          // Prefer backend UUID so checkout API accepts it
          const id = (event as any)?.uuid ?? eventId ?? (event as any)?.id ?? "";
          navigation.navigate("RegisterEvent", {
            eventId: String(id),
            event,
            selectedTier: tier,
          });
        }}
      />
    </View>
  );
}

// ─── Styles ─────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: FORM_BG,
  },

  /* ─── Hero Buttons ─── */
  heroButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  heroButtonsFixed: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  heroButtonGlass: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_RADIUS,
    overflow: "hidden",
    position: "relative",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  androidButtonFallback: {
    backgroundColor: "rgba(30, 30, 60, 0.7)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: BUTTON_RADIUS,
  },
  heroButtonShine: {
    ...StyleSheet.absoluteFillObject,
    width: undefined,
    height: undefined,
    resizeMode: "stretch",
  },
  heroButtonInner: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_RADIUS,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.001)",
  },
  heroButtonsRight: {
    flexDirection: "row",
    gap: 12,
  },

  /* ─── Hero ─── */
  heroWrap: {
    width: SCREEN_WIDTH,
    backgroundColor: HERO_DARK,
    overflow: "hidden",
    position: "relative",
  },
  heroImage: {
    width: SCREEN_WIDTH,
  },
  carouselList: {
    position: "absolute",
    left: 0,
    right: 0,
  },
  carouselContentContainer: {},
  carouselPage: {
    width: SCREEN_WIDTH,
    justifyContent: "center",
    alignItems: "center",
  },
  carouselContent: {
    width: HERO_CONTENT_WIDTH,
    borderRadius: 14,
    overflow: "hidden",
  },

  /* ─── Pagination ─── */
  pagination: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 18,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(246, 248, 249, 0.3)",
  },
  dotActive: {
    backgroundColor: "rgba(127, 0, 255, 0.5)",
    width: 56,
    borderRadius: 4,
  },

  /* ─── Scroll ─── */
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },

  /* ─── Form Section ─── */
  formSectionWrap: {
    width: SCREEN_WIDTH,
  },
  formSectionGradientFull: {
    width: SCREEN_WIDTH,
  },
  formSection: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 24,
  },

  /* ─── Content Section ─── */
  contentSection: {},
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 4,
    gap: 12,
  },
  contentTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#FFF",
    flex: 1,
    letterSpacing: -0.3,
    lineHeight: 30,
  },
  tag: {
    backgroundColor: "rgba(30, 30, 63, 0.8)",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.06)",
  },
  tagText: {
    color: "#D1D5DB",
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 0.3,
  },

  /* ─── Date Row ─── */
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 16,
  },
  calendar: {
    width: 54,
    height: 54,
    backgroundColor: "rgba(30, 30, 63, 0.8)",
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.06)",
  },
  month: {
    color: "#9CA3AF",
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 0.8,
  },
  day: {
    color: "#FFF",
    fontSize: 22,
    fontWeight: "800",
    marginTop: -2,
  },
  dateInfo: {
    flex: 1,
    justifyContent: "center",
  },
  fullDate: {
    color: "#FFF",
    fontWeight: "600",
    fontSize: 15,
  },
  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 5,
  },
  time: {
    color: "#9CA3AF",
    fontSize: 14,
  },

  /* ─── Attending Row ─── */
  attendingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
    gap: 8,
  },
  attending: {
    color: "#7F00FF",
    fontWeight: "600",
    fontSize: 14,
  },
  avatarStack: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2.5,
    borderColor: FORM_BG,
  },

  /* ─── About ─── */
  sectionTitle: {
    fontSize: 20,
    color: "#FFF",
    fontWeight: "700",
    letterSpacing: -0.2,
  },
  about: {
    color: "#D1D5DB",
    marginTop: 8,
    fontSize: 14.5,
    lineHeight: 22,
  },
  readMore: {
    color: "#7F00FF",
    marginTop: 8,
    fontWeight: "600",
    fontSize: 14,
  },

  /* ─── Meta Row ─── */
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 22,
  },
  badge: {
    backgroundColor: "rgba(30, 30, 63, 0.8)",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 22,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.06)",
  },
  badgeText: {
    color: "#D1D5DB",
    fontSize: 13,
    fontWeight: "500",
  },
  reviewLink: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  review: {
    color: "#7F00FF",
    textDecorationLine: "underline",
    fontWeight: "600",
    fontSize: 14,
  },

  /* ─── Location Card ─── */
  locationCard: {
    flexDirection: "row",
    backgroundColor: "rgba(30, 30, 63, 0.8)",
    borderRadius: 18,
    padding: 14,
    marginBottom: 22,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.06)",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 10,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  mapContainer: {
    position: "relative",
    borderRadius: 14,
    overflow: "hidden",
  },
  map: {
    width: 95,
    height: 95,
    borderRadius: 14,
  },
  mapExpandHint: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
  },
  locationInfo: {
    flex: 1,
    marginLeft: 14,
    justifyContent: "space-between",
  },
  locationIconRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    flex: 1,
  },
  address: {
    color: "#E5E7EB",
    fontSize: 14,
    lineHeight: 20,
    flex: 1,
  },
  directions: {
    flexDirection: "row",
    backgroundColor: "#7F00FF",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 22,
    gap: 6,
    alignSelf: "flex-start",
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#7F00FF",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  directionsText: {
    color: "#FFF",
    fontWeight: "600",
    fontSize: 13,
  },

  /* ─── View More ─── */
  viewMore: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 28,
    paddingVertical: 4,
  },
  viewMoreText: {
    color: "#FFF",
    textDecorationLine: "underline",
    fontSize: 14,
    fontWeight: "500",
  },

  /* ─── Register Button ─── */
  registerButton: {
    borderRadius: 26,
    paddingVertical: 18,
    overflow: "hidden",
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
    ...Platform.select({
      ios: {
        shadowColor: "#6E23BA",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4,
        shadowRadius: 16,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  registerButtonPressed: {
    transform: [{ scale: 0.97 }],
    opacity: 0.92,
  },
  registerButtonText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
    zIndex: 1,
    letterSpacing: 0.5,
  },

  /* ─── Modal ─── */
  modalBg: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  modalCard: {
    backgroundColor: "#1E1E3F",
    borderRadius: 24,
    padding: 24,
    maxHeight: "80%",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.4,
        shadowRadius: 24,
      },
      android: {
        elevation: 12,
      },
    }),
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  modalTitle: {
    color: "#FFF",
    fontSize: 22,
    fontWeight: "800",
    letterSpacing: -0.3,
  },
  modalCloseBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.08)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalDivider: {
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    marginVertical: 16,
  },
  modalScrollContent: {
    paddingBottom: 8,
  },
  modalText: {
    color: "#D1D5DB",
    fontSize: 15,
    lineHeight: 24,
  },
  modalCloseButton: {
    backgroundColor: "rgba(127, 0, 255, 0.15)",
    paddingVertical: 14,
    borderRadius: 20,
    alignItems: "center",
    marginTop: 16,
    borderWidth: 1,
    borderColor: "rgba(127, 0, 255, 0.2)",
  },
  modalCloseButtonText: {
    color: "#7F00FF",
    fontWeight: "700",
    fontSize: 15,
  },

  /* ─── Full Screen Map ─── */
  fullScreenMap: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#000",
    zIndex: 100,
  },
  fullScreenBackButton: {
    position: "absolute",
    left: 16,
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_RADIUS,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 101,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
});