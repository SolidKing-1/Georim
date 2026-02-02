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
import { Video, ResizeMode } from "expo-av";
import { LinearGradient } from "expo-linear-gradient";
import MapView, { Marker } from "react-native-maps";
import type { RootStackParamList } from "../App";
import TicketSelectionModal, {
  type TicketSelectionModalRef,
} from "../components/TicketSelectionModal";

const CircleGlassEffect = require("../components/GlassEffects/circleGlassEffect.png");

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const HERO_HEIGHT = Math.round(SCREEN_HEIGHT * 0.45);
const HERO_CONTENT_WIDTH = SCREEN_WIDTH - 20 * 2;
const FORM_BG = "#05031B";
const HERO_DARK = "#1a1a2e";
const OVERLAP = 120;
const FORM_NEGATIVE_MARGIN = 300;

type CarouselItem =
  | { type: "image"; source: ImageSourcePropType | { uri: string } }
  | { type: "video"; source: ReturnType<typeof require> };

const DEFAULT_CAROUSEL: CarouselItem[] = [
  { type: "image", source: require("../assets/Home/event-1.jpg") },
];

type EventDetailsRoute = RouteProp<RootStackParamList, "EventDetails">;

export default function EventDetailsScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<EventDetailsRoute>();
  const insets = useSafeAreaInsets();
  const { eventId, event } = route.params ?? {};

  const [heroIndex, setHeroIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const ticketModalRef = useRef<TicketSelectionModalRef>(null);

  const BUTTON_ROW_HEIGHT = 60 + insets.top;
  const CAROUSEL_HEIGHT = HERO_HEIGHT + OVERLAP - BUTTON_ROW_HEIGHT;

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

  const currentItem = carouselItems[heroIndex] ?? carouselItems[0];

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
          <Video
            source={item.source}
            style={[styles.carouselContent, { height: CAROUSEL_HEIGHT }]}
            resizeMode={ResizeMode.COVER}
            isLooping
            isMuted
            shouldPlay={index === heroIndex}
          />
        )}
      </View>
    ),
    [heroIndex, CAROUSEL_HEIGHT]
  );

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero */}
        <View
          style={[
            styles.heroWrap,
            { height: HERO_HEIGHT + OVERLAP, zIndex: 2 },
          ]}
        >
          <View
            style={[StyleSheet.absoluteFill, { height: HERO_HEIGHT + OVERLAP }]}
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
          />

          <View style={styles.pagination}>
            {carouselItems.map((_, i) => (
              <View
                key={i}
                style={[styles.dot, i === heroIndex && styles.dotActive]}
              />
            ))}
          </View>
        </View>

        {/* Content section: event details */}
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
              {/* Event details content */}
              <View style={styles.contentSection}>
                <View style={styles.headerRow}>
                  <Text style={styles.contentTitle}>
                    {(event as any)?.title ??
                      (event as any)?.name ??
                      "Apostolic Invitation"}
                  </Text>
                  <View style={styles.tag}>
                    <Text style={styles.tagText}>Outdoor</Text>
                  </View>
                </View>

                <View style={styles.dateRow}>
                  <View style={styles.calendar}>
                    <Text style={styles.month}>SEP</Text>
                    <Text style={styles.day}>21</Text>
                  </View>
                  <View>
                    <Text style={styles.fullDate}>Sunday September 2026</Text>
                    <View style={styles.timeRow}>
                      <Ionicons name="time-outline" size={16} color="#9CA3AF" />
                      <Text style={styles.time}>7:30 AM – 9:00 AM</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.attendingRow}>
                  <Text style={styles.attending}>11k people are attending</Text>
                  <View style={styles.avatarStack}>
                    {[1, 2, 3, 4].map((_, i) => (
                      <Image
                        key={i}
                        source={require("../assets/Home/profile.jpg")}
                        style={[
                          styles.avatar,
                          { marginLeft: i === 0 ? 0 : -12 },
                        ]}
                      />
                    ))}
                  </View>
                </View>

                <Text style={styles.section}>About Event</Text>
                <Text style={styles.about} numberOfLines={5}>
                  {(event as any)?.description ??
                    "Apostolic Invitation is a powerful gathering designed to ignite faith, deepen spiritual understanding, and foster community among believers across generations."}
                </Text>

                <Pressable onPress={() => setShowModal(true)}>
                  <Text style={styles.readMore}>Read more</Text>
                </Pressable>

                <View style={styles.metaRow}>
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>Recurring Event</Text>
                  </View>
                  <Pressable style={styles.reviewLink}>
                    <Text style={styles.review}>Reviews</Text>
                    <Ionicons
                      name="chevron-forward"
                      size={16}
                      color="#7F00FF"
                    />
                  </Pressable>
                </View>

                <View style={styles.locationCard}>
                  <MapView
                    style={styles.map}
                    initialRegion={{
                      latitude: 32.5252,
                      longitude: -92.714,
                      latitudeDelta: 0.01,
                      longitudeDelta: 0.01,
                    }}
                  >
                    <Marker
                      coordinate={{ latitude: 32.5252, longitude: -92.714 }}
                    />
                  </MapView>
                  <View style={styles.locationInfo}>
                    <Text style={styles.address}>
                      123 Revival Street, Grambling, Louisiana
                    </Text>
                    <Pressable style={styles.directions}>
                      <Ionicons
                        name="arrow-up-outline"
                        size={18}
                        color="#FFF"
                      />
                      <Text style={styles.directionsText}>Get Directions</Text>
                    </Pressable>
                  </View>
                </View>

                <Pressable style={styles.viewMore}>
                  <Text style={styles.viewMoreText}>
                    View more event details
                  </Text>
                  <Ionicons name="chevron-forward" size={16} color="#FFF" />
                </Pressable>
              </View>

              {/* Register button */}
              <Pressable
                style={({ pressed }) => [
                  styles.registerButton,
                  pressed && styles.registerButtonPressed,
                ]}
                onPress={() => ticketModalRef.current?.present()}
              >
                <LinearGradient
                  colors={["rgba(110, 35, 186, 1)", "rgba(40, 38, 145, 1)"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={StyleSheet.absoluteFill}
                />
                <Text style={styles.registerButtonText}>Register</Text>
              </Pressable>

              <View style={{ height: 40 }} />
            </View>
          </LinearGradient>
        </View>
      </ScrollView>

      {/* Fixed hero buttons */}
      <View
        style={[
          styles.heroButtons,
          styles.heroButtonsFixed,
          { paddingTop: 8 + insets.top },
        ]}
        pointerEvents="box-none"
      >
        <View style={styles.heroButtonGlass}>
          <BlurView
            intensity={24}
            tint="dark"
            style={StyleSheet.absoluteFill}
          />
          <Image source={CircleGlassEffect} style={styles.heroButtonShine} />
          <TouchableOpacity
            style={styles.heroButtonInner}
            onPress={() => navigation.goBack()}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
        <View style={styles.heroButtonsRight}>
          <View style={styles.heroButtonGlass}>
            <BlurView
              intensity={24}
              tint="dark"
              style={StyleSheet.absoluteFill}
            />
            <Image source={CircleGlassEffect} style={styles.heroButtonShine} />
            <TouchableOpacity style={styles.heroButtonInner}>
              <Ionicons name="bookmark-outline" size={22} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          <View style={styles.heroButtonGlass}>
            <BlurView
              intensity={24}
              tint="dark"
              style={StyleSheet.absoluteFill}
            />
            <Image source={CircleGlassEffect} style={styles.heroButtonShine} />
            <TouchableOpacity style={styles.heroButtonInner}>
              <Ionicons name="share-outline" size={22} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Read more modal */}
      <Modal visible={showModal} animationType="fade" transparent>
        <BlurView intensity={80} tint="dark" style={styles.modalBg}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>About Event</Text>
            <ScrollView>
              <Text style={styles.modalText}>
                Apostolic Invitation is a transformational gathering designed to
                unify believers, empower faith, and cultivate spiritual growth
                through worship, teaching, and fellowship...
              </Text>
            </ScrollView>
            <Pressable onPress={() => setShowModal(false)}>
              <Text style={styles.close}>Close</Text>
            </Pressable>
          </View>
        </BlurView>
      </Modal>

      <TicketSelectionModal
        ref={ticketModalRef}
        eventTitle={(event as any)?.title ?? (event as any)?.name ?? "Event"}
        eventDescription={(event as any)?.description}
        onSelectTicket={(tier) => {
          ticketModalRef.current?.dismiss();
          navigation.navigate("RegisterEvent", {
            eventId: eventId ?? "",
            event,
            selectedTier: tier,
          });
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: FORM_BG,
  },
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
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: "hidden",
    position: "relative",
  },
  heroButtonShine: {
    ...StyleSheet.absoluteFillObject,
    width: undefined,
    height: undefined,
    resizeMode: "stretch",
  },
  heroButtonInner: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.001)",
  },
  heroButtonsRight: {
    flexDirection: "row",
    gap: 12,
  },
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
    borderRadius: 10,
    overflow: "hidden",
  },
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
  pagination: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#F6F8F9",
    opacity: 0.3,
  },
  dotActive: {
    backgroundColor: "#7F00FF",
    width: 60,
    borderRadius: 4,
    opacity: 0.3,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  // Event details content
  contentSection: {},
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  contentTitle: {
    fontSize: 26,
    fontWeight: "700",
    color: "#FFF",
  },
  tag: {
    backgroundColor: "#1E1E3F",
    padding: 8,
    borderRadius: 20,
  },
  tagText: {
    color: "#FFF",
    fontSize: 12,
  },
  dateRow: {
    flexDirection: "row",
    marginVertical: 20,
  },
  calendar: {
    width: 72,
    height: 72,
    backgroundColor: "#1E1E3F",
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  month: {
    color: "#9CA3AF",
  },
  day: {
    color: "#FFF",
    fontSize: 32,
    fontWeight: "800",
  },
  fullDate: {
    color: "#FFF",
    fontWeight: "600",
  },
  timeRow: {
    flexDirection: "row",
    gap: 6,
    marginTop: 4,
  },
  time: {
    color: "#9CA3AF",
  },
  attendingRow: {
    flexDirection: "row",
    marginBottom: 20,
  },
  attending: {
    color: "#7F00FF",
    fontWeight: "600",
    marginRight: 4,
  },
  avatarStack: {
    flexDirection: "row",
    marginBottom: 3,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: FORM_BG,
  },
  section: {
    fontSize: 20,
    color: "#FFF",
    fontWeight: "700",
  },
  about: {
    color: "#D1D5DB",
    marginTop: 6,
  },
  readMore: {
    color: "#7F00FF",
    marginTop: 6,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 20,
  },
  badge: {
    backgroundColor: "#1E1E3F",
    padding: 8,
    borderRadius: 20,
  },
  badgeText: {
    color: "#FFF",
  },
  reviewLink: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  review: {
    color: "#7F00FF",
    textDecorationLine: "underline",
  },
  locationCard: {
    flexDirection: "row",
    backgroundColor: "#1E1E3F",
    borderRadius: 16,
    padding: 12,
    marginBottom: 20,
  },
  map: {
    width: 90,
    height: 90,
    borderRadius: 12,
  },
  locationInfo: {
    flex: 1,
    marginLeft: 12,
  },
  address: {
    color: "#FFF",
  },
  directions: {
    flexDirection: "row",
    backgroundColor: "#7F00FF",
    padding: 8,
    borderRadius: 20,
    marginTop: 8,
    gap: 6,
    alignSelf: "flex-start",
  },
  directionsText: {
    color: "#FFF",
    fontWeight: "600",
  },
  viewMore: {
    flexDirection: "row",
    gap: 6,
    marginBottom: 24,
  },
  viewMoreText: {
    color: "#FFF",
    textDecorationLine: "underline",
  },
  registerButton: {
    borderRadius: 26,
    paddingVertical: 16,
    overflow: "hidden",
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  registerButtonPressed: {
    opacity: 0.9,
  },
  registerButtonText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
    zIndex: 1,
  },
  modalBg: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  modalCard: {
    backgroundColor: "#1E1E3F",
    borderRadius: 20,
    padding: 20,
    maxHeight: "80%",
  },
  modalTitle: {
    color: "#FFF",
    fontSize: 22,
    fontWeight: "700",
  },
  modalText: {
    color: "#D1D5DB",
    marginTop: 12,
  },
  close: {
    color: "#7F00FF",
    marginTop: 20,
    textAlign: "center",
  },
});
