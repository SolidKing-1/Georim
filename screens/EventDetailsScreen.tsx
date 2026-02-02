import React, { useState, useCallback, useMemo } from "react";
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

const CircleGlassEffect = require("../components/GlassEffects/circleGlassEffect.png");

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const HERO_HEIGHT = Math.round(SCREEN_HEIGHT * 0.45);
const OVERLAP = 120;
const FORM_BG = "#05031B";
const HERO_DARK = "#1a1a2e";

type CarouselItem =
  | { type: "image"; source: ImageSourcePropType | { uri: string } }
  | { type: "video"; source: ReturnType<typeof require> };

const DEFAULT_CAROUSEL: CarouselItem[] = [
  { type: "image", source: require("../assets/Home/event-1.jpg") },
];

type Route = RouteProp<RootStackParamList, "EventDetails">;

export default function EventDetailsScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<Route>();
  const insets = useSafeAreaInsets();

  const [heroIndex, setHeroIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);

  const carouselItems = DEFAULT_CAROUSEL;

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems[0]?.index != null) {
        setHeroIndex(viewableItems[0].index);
      }
    },
    [],
  );

  const renderCarouselItem = ({ item }: { item: CarouselItem }) => (
    <View style={styles.carouselPage}>
      <Image source={item.source} style={styles.carouselImage} />
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* HERO */}
        <View style={styles.heroWrap}>
          <Image
            source={carouselItems[heroIndex].source}
            style={styles.heroImage}
          />
          <BlurView
            intensity={Platform.OS === "ios" ? 60 : 45}
            tint="dark"
            style={StyleSheet.absoluteFill}
          />

          <FlatList
            data={carouselItems}
            renderItem={renderCarouselItem}
            keyExtractor={(_, i) => String(i)}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onViewableItemsChanged={onViewableItemsChanged}
          />

          <LinearGradient
            colors={["transparent", FORM_BG]}
            style={styles.heroFade}
          />
        </View>

        {/* CONTENT */}
        <View style={styles.content}>
          {/* HEADER */}
          <View style={styles.headerRow}>
            <Text style={styles.title}>Apostolic Invitation</Text>
            <View style={styles.tag}>
              <Text style={styles.tagText}>Outdoor</Text>
            </View>
          </View>

          {/* DATE */}
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

          {/* ATTENDING */}
          <View style={styles.attendingRow}>
            <Text style={styles.attending}>11k people are attending</Text>

            <View style={styles.avatarStack}>
              {[1, 2, 3, 4].map((_, i) => (
                <Image
                  key={i}
                  source={require("../assets/Home/profile.jpg")}
                  style={[styles.avatar, { marginLeft: i === 0 ? 0 : -12 }]}
                />
              ))}
            </View>
          </View>

          {/* ABOUT */}
          <Text style={styles.section}>About Event</Text>
          <Text style={styles.about} numberOfLines={5}>
            Apostolic Invitation is a powerful gathering designed to ignite
            faith, deepen spiritual understanding, and foster community among
            believers across generations.
          </Text>

          <Pressable onPress={() => setShowModal(true)}>
            <Text style={styles.readMore}>Read more</Text>
          </Pressable>

          {/* META */}
          <View style={styles.metaRow}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Recurring Event</Text>
            </View>

            <Pressable style={styles.reviewLink}>
              <Text style={styles.review}>Reviews</Text>
              <Ionicons name="chevron-forward" size={16} color="#7F00FF" />
            </Pressable>
          </View>

          {/* LOCATION */}
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
              <Marker coordinate={{ latitude: 32.5252, longitude: -92.714 }} />
            </MapView>

            <View style={styles.locationInfo}>
              <Text style={styles.address}>
                123 Revival Street, Grambling, Louisiana
              </Text>

              <Pressable style={styles.directions}>
                <Ionicons name="arrow-up-outline" size={18} color="#FFF" />
                <Text style={styles.directionsText}>Get Directions</Text>
              </Pressable>
            </View>
          </View>

          {/* VIEW MORE */}
          <Pressable style={styles.viewMore}>
            <Text style={styles.viewMoreText}>View more event details</Text>
            <Ionicons name="chevron-forward" size={16} color="#FFF" />
          </Pressable>
        </View>
      </ScrollView>

      {/* READ MORE MODAL */}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: FORM_BG },

  heroWrap: { height: HERO_HEIGHT },
  heroImage: { ...StyleSheet.absoluteFillObject },
  heroFade: { ...StyleSheet.absoluteFillObject },

  carouselPage: { width: SCREEN_WIDTH, height: HERO_HEIGHT },
  carouselImage: { width: SCREEN_WIDTH, height: HERO_HEIGHT },

  content: { padding: 20, marginTop: -80 },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  title: { fontSize: 26, fontWeight: "700", color: "#FFF" },
  tag: { backgroundColor: "#1E1E3F", padding: 8, borderRadius: 20 },
  tagText: { color: "#FFF", fontSize: 12 },

  dateRow: { flexDirection: "row", marginVertical: 20 },
  calendar: {
    width: 72,
    height: 72,
    backgroundColor: "#1E1E3F",
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },

  month: { color: "#9CA3AF" },
  day: { color: "#FFF", fontSize: 32, fontWeight: "800" },

  fullDate: { color: "#FFF", fontWeight: "600" },
  timeRow: { flexDirection: "row", gap: 6, marginTop: 4 },
  time: { color: "#9CA3AF" },

  attendingRow: {
    flexDirection: "row",
    marginBottom: 20,
  },

  attending: { color: "#7F00FF", fontWeight: "600", marginRight: 4 },
  avatarStack: { flexDirection: "row", marginBottom: 3 },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: FORM_BG,
  },

  section: { fontSize: 20, color: "#FFF", fontWeight: "700" },
  about: { color: "#D1D5DB", marginTop: 6 },
  readMore: { color: "#7F00FF", marginTop: 6 },

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

  badgeText: { color: "#FFF" },
  reviewLink: { flexDirection: "row", alignItems: "center", gap: 4 },
  review: { color: "#7F00FF", textDecorationLine: "underline" },

  locationCard: {
    flexDirection: "row",
    backgroundColor: "#1E1E3F",
    borderRadius: 16,
    padding: 12,
    marginBottom: 20,
  },

  map: { width: 90, height: 90, borderRadius: 12 },
  locationInfo: { flex: 1, marginLeft: 12 },
  address: { color: "#FFF" },

  directions: {
    flexDirection: "row",
    backgroundColor: "#7F00FF",
    padding: 8,
    borderRadius: 20,
    marginTop: 8,
    gap: 6,
    alignSelf: "flex-start",
  },

  directionsText: { color: "#FFF", fontWeight: "600" },

  viewMore: { flexDirection: "row", gap: 6, marginBottom: 130 },
  viewMoreText: { color: "#FFF", textDecorationLine: "underline" },

  modalBg: { flex: 1, justifyContent: "center", padding: 20 },
  modalCard: {
    backgroundColor: "#1E1E3F",
    borderRadius: 20,
    padding: 20,
    maxHeight: "80%",
  },

  modalTitle: { color: "#FFF", fontSize: 22, fontWeight: "700" },
  modalText: { color: "#D1D5DB", marginTop: 12 },
  close: { color: "#7F00FF", marginTop: 20, textAlign: "center" },
});
