import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  Keyboard,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import DocIcon from "../components/DocIcon";
import AdBadge from "../components/AdBadge";
import { LinearGradient } from "expo-linear-gradient";
import { RootStackParamList } from "../App";
import ProfileStack from "../components/ProfileStack";
import EventCard from "../components/EventCard";
import SearchNavBar from "../components/SearchNavBar";
import GlassSearchBar from "../components/GlassSearchBar";

// Using SVG Ad badge component
// (replaces the old AdTag)

// Placeholder event data
const demoEvents = [
  {
    id: "e1",
    title: "Ultra Music Festival, 2025",
    date: "Sep 15",
    location: "Grambling, LA • Digital Library",
    price: "Free",
    rating: 4.5,
    attendees: 120,
    image: require("../assets/homePage/baloon.png"),
    description:
      "A vibrant celebration of music and culture with live performers and immersive visuals.",
  },
];

type Nav = NativeStackNavigationProp<RootStackParamList, "Search">;

export default function SearchScreen() {
  const navigation = useNavigation<Nav>();
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  const openAllEvents = () => {
    navigation.navigate("AllEvents");
  };

  const openCategory = (category: string) => {
    navigation.navigate("CategoryList", { category });
  };

  const openEvent = (event: any) => {
    navigation.navigate("EventDetails", { event });
  };

  const handleSuggestionPress = (searchTerm: string) => {
    setQuery(searchTerm);
    Keyboard.dismiss();
    setIsFocused(false);
  };

  useEffect(() => {
    const showEvent =
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent =
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    const onShow = (e: any) => {
      setKeyboardHeight(e.endCoordinates?.height || 0);
    };
    const onHide = () => setKeyboardHeight(0);

    const showSub = Keyboard.addListener(showEvent, onShow);
    const hideSub = Keyboard.addListener(hideEvent, onHide);

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/homePage/birthday-decoration.png")}
        style={styles.topDecoration}
        pointerEvents="none"
      />
      <ScrollView contentContainerStyle={{ paddingBottom: 140 }}>
        {/* Header */}
        <View style={styles.headerRow}>
          <Text style={styles.header}>Search</Text>
          <View style={styles.profileWrap}>
            <Image
              source={require("../components/GlassEffects/circleGlassEffect.png")}
              style={styles.circleOverlay}
              pointerEvents="none"
            />
            <Image
              source={{
                uri: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&h=100&fit=crop",
              }}
              style={styles.avatarOnCircle}
            />
          </View>
        </View>

        {/* Suggested Channels - Horizontal Scrollable 2-Column Layout */}
        <Text style={styles.sectionTitle}>Suggested Channels</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20 }}
        >
          {/* Column 1 */}
          <View style={styles.channelColumn}>
            {[
              {
                name: "Afrotech '25",
                subtitle: "Sabrina Carpenter",
                logo: require("../assets/homePage/afrot.png"),
                isAd: true,
              },
              {
                name: "Revival Channel",
                subtitle: "Sabrina Carpenter",
                logo: require("../assets/homePage/revival.jpg"),
                isAd: false,
              },
            ].map((c, i) => (
              <View key={i}>
                <View style={styles.channelListItem}>
                  <Image source={c.logo} style={styles.channelLogo} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.channelName}>{c.name}</Text>
                    <Text style={styles.channelSub}>{c.subtitle}</Text>
                    {c.isAd && <AdBadge />}
                  </View>
                  <TouchableOpacity style={styles.channelAction}>
                    <DocIcon size={24} />
                  </TouchableOpacity>
                </View>
                <View style={styles.channelDividerLine} />
              </View>
            ))}
          </View>

          {/* Column 2 - Hidden partially to show scroll indicator */}
          <View style={styles.channelColumn}>
            {[
              {
                name: "Event Channel",
                subtitle: "Organizers",
                logo: require("../assets/homePage/afrot.png"),
                isAd: false,
              },
              {
                name: "Concert Series",
                subtitle: "Music Events",
                logo: require("../assets/homePage/revival.jpg"),
                isAd: false,
              },
            ].map((c, i) => (
              <View key={i}>
                <View style={styles.channelListItem}>
                  <Image source={c.logo} style={styles.channelLogo} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.channelName}>{c.name}</Text>
                    <Text style={styles.channelSub}>{c.subtitle}</Text>
                    {c.isAd && <AdBadge />}
                  </View>
                  <TouchableOpacity style={styles.channelAction}>
                    <DocIcon size={24} />
                  </TouchableOpacity>
                </View>
                <View style={styles.channelDividerLine} />
              </View>
            ))}
          </View>
        </ScrollView>

        {/* Happening Now - Horizontal Scrollable */}
        <TouchableOpacity
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginTop: 40, // Increased space from previous section
            paddingHorizontal: 20,
            marginBottom: 18, // Increased space below heading
          }}
          onPress={() => openCategory("Happening Now")}
        >
          <Text
            style={[
              styles.sectionTitle,
              { marginBottom: 0, marginTop: 0, paddingHorizontal: 0 },
            ]}
          >
            Happening Now
          </Text>
          <Ionicons
            name="chevron-forward"
            size={22}
            color="#fff"
            style={{ marginLeft: 6 }}
          />
        </TouchableOpacity>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 12 }}
        >
          {[demoEvents[0], demoEvents[0], demoEvents[0]].map((event, i) => (
            <EventCard
              key={i}
              image={event.image}
              title={event.title}
              location={event.location}
              time={event.time}
              state={event.state}
              price={event.price}
              attendees={event.attendees}
              rating={event.rating}
              onPress={() => openEvent(event)}
            />
          ))}
        </ScrollView>

        {/* Browse - Only show when not searching */}
        {!isFocused && (
          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: 36, // Increased space from previous section
              paddingHorizontal: 20,
              marginBottom: 16, // Increased space below heading
            }}
            onPress={() => navigation.navigate("BrowseAll")}
          >
            <Text
              style={[
                styles.sectionTitle,
                { marginBottom: 0, marginTop: 0, paddingHorizontal: 0 },
              ]}
            >
              Browse
            </Text>
            <Ionicons
              name="chevron-forward"
              size={22}
              color="#fff"
              style={{ marginLeft: 6 }}
            />
          </TouchableOpacity>
        )}
        {/* Browse Grid - Only show when not searching */}
        {!isFocused && (
          <View style={styles.browseGrid}>
            <TouchableOpacity
              style={[styles.browsePill, { backgroundColor: "#6EA8D9" }]}
              onPress={openAllEvents}
            >
              <View style={styles.pillContent}>
                <Ionicons
                  name="grid-outline"
                  color="#E5E7EB"
                  size={28}
                  style={styles.pillIcon}
                />
                <Text style={styles.pillText}>All Events</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.browsePill, { backgroundColor: "#B89378" }]}
              onPress={() => openCategory("Music")}
            >
              <View style={styles.pillContent}>
                <Ionicons
                  name="musical-notes-outline"
                  color="#E5E7EB"
                  size={28}
                  style={styles.pillIcon}
                />
                <Text style={styles.pillText}>Music</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.browsePill, { backgroundColor: "#1165CC" }]}
              onPress={() => openCategory("Corporate")}
            >
              <View style={styles.pillContent}>
                <Ionicons
                  name="briefcase-outline"
                  color="#E5E7EB"
                  size={28}
                  style={styles.pillIcon}
                />
                <Text style={styles.pillText}>Corporate</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.browsePill, { backgroundColor: "#C0611A" }]}
              onPress={() => openCategory("Religious")}
            >
              <View style={styles.pillContent}>
                <Ionicons
                  name="flame-outline"
                  color="#E5E7EB"
                  size={28}
                  style={styles.pillIcon}
                />
                <Text style={styles.pillText}>Religious</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.browsePill, { backgroundColor: "#6322D9" }]}
              onPress={() => openCategory("Arts & Culture")}
            >
              <View style={styles.pillContent}>
                <Ionicons
                  name="color-palette-outline"
                  color="#E5E7EB"
                  size={28}
                  style={styles.pillIcon}
                />
                <Text style={styles.pillText}>Arts & Culture</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.browsePill, { backgroundColor: "#2C2A50" }]}
              onPress={() => openCategory("Parties")}
            >
              <View style={styles.pillContent}>
                <Ionicons
                  name="people-outline"
                  color="#E5E7EB"
                  size={28}
                  style={styles.pillIcon}
                />
                <Text style={styles.pillText}>Parties</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.browsePill, { backgroundColor: "#A98B2A" }]}
              onPress={() => openCategory("Sports")}
            >
              <View style={styles.pillContent}>
                <Ionicons
                  name="basketball-outline"
                  color="#E5E7EB"
                  size={28}
                  style={styles.pillIcon}
                />
                <Text style={styles.pillText}>Sports</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.browsePill, { backgroundColor: "#C22C2C" }]}
              onPress={() => openCategory("Movies")}
            >
              <View style={styles.pillContent}>
                <Ionicons
                  name="film-outline"
                  color="#E5E7EB"
                  size={28}
                  style={styles.pillIcon}
                />
                <Text style={styles.pillText}>Movies</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.browsePill, { backgroundColor: "#C16477" }]}
              onPress={() => openCategory("Fashion")}
            >
              <View style={styles.pillContent}>
                <Ionicons
                  name="shirt-outline"
                  color="#E5E7EB"
                  size={28}
                  style={styles.pillIcon}
                />
                <Text style={styles.pillText}>Fashion</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.browsePill, { backgroundColor: "#25C226" }]}
              onPress={() => openCategory("Health & Wellness")}
            >
              <View style={styles.pillContent}>
                <Ionicons
                  name="heart-circle-outline"
                  color="#E5E7EB"
                  size={28}
                  style={styles.pillIcon}
                />
                <Text style={styles.pillText}>Health & Wellness</Text>
              </View>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Bottom Search Bar - visible when not searching */}
      {!isFocused && (
        <View style={styles.bottomBarContainer}>
          <SearchNavBar
            onHomePress={() => navigation.navigate("Dashboard")}
            onSearchPress={() => {
              setIsFocused(true);
              inputRef.current?.focus();
            }}
          />
        </View>
      )}

      {/* Full Screen Search Modal */}
      <Modal
        visible={isFocused}
        transparent={false}
        animationType="fade"
        onRequestClose={() => {
          setIsFocused(false);
          Keyboard.dismiss();
        }}
      >
        <View style={{ flex: 1, backgroundColor: "#05031B" }}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
            keyboardVerticalOffset={0}
          >
            {/* Modal Header */}
            <View style={styles.modalHeaderRow}>
              <Text style={styles.modalHeader}>Search</Text>
              <Image
                source={{
                  uri: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&h=100&fit=crop",
                }}
                style={styles.avatar}
              />
            </View>

            {/* Suggestions - scrollable area */}
            <ScrollView
              style={styles.suggestionsContainer}
              contentContainerStyle={{ paddingBottom: 100 }}
            >
              <TouchableOpacity
                style={styles.suggestionRow}
                onPress={() => handleSuggestionPress(query || "Search")}
              >
                <Ionicons name="search" size={20} color="#F6F8F9" />
                <Text style={styles.suggestionText}>
                  {" "}
                  <Text style={{ color: "#9CA3AF" }}>{query || "Search"}</Text>
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.suggestionRow}
                onPress={() => handleSuggestionPress("Music Events")}
              >
                <Ionicons name="search" size={20} color="#F6F8F9" />
                <Text style={styles.suggestionText}>
                  <Text style={{ color: "#9CA3AF" }}>Music Events</Text>
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.suggestionRow}
                onPress={() => handleSuggestionPress("Upcoming Events")}
              >
                <Ionicons name="search" size={20} color="#F6F8F9" />
                <Text style={styles.suggestionText}>
                  {" "}
                  <Text style={{ color: "#9CA3AF" }}>Upcoming Events</Text>
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </KeyboardAvoidingView>

          {/* Glassy Search Bar with X button, floating above the keyboard */}
          <View
            style={[
              styles.modalSearchBarAbsolute,
              { bottom: keyboardHeight + 6 },
            ]}
          >
            <View style={{ flex: 1 }}>
              <GlassSearchBar
                value={query}
                onChangeText={setQuery}
                inputRef={inputRef}
                onClose={() => {
                  setQuery("");
                  inputRef.current?.focus();
                }}
                fullWidth
              />
            </View>
            <TouchableOpacity
              style={styles.modalSearchBarCloseBtn}
              onPress={() => {
                setQuery("");
                setIsFocused(false);
                Keyboard.dismiss();
              }}
            >
              <Ionicons name="close" size={36} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#05031B" },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 12,
    zIndex: 2,
  },
  header: { color: "#F6F8F9", fontSize: 30, fontWeight: "700" },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  glassCard: {
    borderRadius: 22,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    backgroundColor: "rgba(255, 255, 255, 0.08)",
  },
  profileWrap: {
    width: 60,
    height: 60,
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  circleOverlay: {
    position: "absolute",
    width: 60,
    height: 60,
    resizeMode: "contain",
    top: 0,
    left: 0,
  },
  avatarOnCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    zIndex: 2,
  },
  suggestionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: "#8F8E9B",
  },
  suggestionText: { color: "#ffffff", fontSize: 15 },
  divider: { height: 12 },

  sectionTitle: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "700",
    paddingHorizontal: 20,
    marginBottom: 10,
    marginTop: 20,
  },
  channelRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 2,
  },
  channelDivider: {
    height: 1,
    backgroundColor: "#8F8E9B",
    marginLeft: 88,
    marginRight: 20,
  },
  channelLogo: { width: 56, height: 56, borderRadius: 16, marginRight: 12 },
  channelName: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "400",
    marginBottom: 4,
  },
  channelSub: { color: "#9CA3AF", fontSize: 12 },
  channelAction: {
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  // Horizontal Scroll Column Styles
  channelColumn: {
    width: 340,
    marginRight: 20,
  },
  channelListItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  channelDividerLine: {
    height: 1,
    backgroundColor: "#8F8E9B",
    marginLeft: 68,
    marginRight: 4,
    marginTop: -4,
  },
  // Old card styles (keeping for backwards compatibility)
  channelCard: {
    width: 140,
    marginRight: 16,
    paddingBottom: 12,
    borderRadius: 24,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    padding: 12,
    alignItems: "flex-start",
  },
  channelCardLogo: {
    width: 48,
    height: 48,
    borderRadius: 8,
    marginBottom: 8,
  },
  channelCardName: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "400",
    marginBottom: 2,
  },
  channelCardSub: {
    color: "#9CA3AF",
    fontSize: 11,
    marginBottom: 8,
  },
  channelCardAction: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  adTag: {
    backgroundColor: "#3734C6",
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    alignSelf: "flex-start",
  },
  adTagText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "700",
  },
  card: {
    marginHorizontal: 20,
    backgroundColor: "#15113A",
    borderRadius: 16,
    overflow: "hidden",
  },
  happeningNowCard: {
    width: 280,
    marginRight: 20,
    backgroundColor: "#0E0D32",
    borderRadius: 16,
    overflow: "hidden",
  },
  cardImage: { width: "100%", height: 160 },
  imageContainer: {
    margin: 8,
    marginBottom: 0,
    borderRadius: 18,
    overflow: "hidden",
    position: "relative",
  },
  happeningNowCardImage: {
    width: "100%",
    height: 140,
  },
  cardBody: { padding: 12 },
  cardBodyWithProfile: {
    padding: 12,
    paddingTop: 20,
  },
  cardBadgeRow: { flexDirection: "row", gap: 8, marginBottom: 6 },
  badgeOnImageRow: {
    position: "absolute",
    top: 138,
    left: 16,
    right: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 12,
  },
  badgeGlass: {
    backgroundColor: "rgba(0, 120, 0, 0.7)",
    backdropFilter: "blur(10px)",
    borderRadius: 16,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  badgePrice: {
    backgroundColor: "rgba(127, 0, 255, 0.7)",
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  badgePriceText: { color: "#fff", fontWeight: "700", fontSize: 13 },
  badge: {
    backgroundColor: "#18C964",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  badgeText: { color: "#fff", fontWeight: "700", fontSize: 12 },
  cardTitle: { color: "#fff", fontWeight: "700", fontSize: 16, marginTop: 2 },
  cardMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 4,
  },
  cardMetaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  cardMeta: { color: "#9CA3AF", fontSize: 12 },
  cardFooterRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
    marginLeft: 32,
  },
  attendees: { color: "#7F93FF", fontWeight: "600" },
  rating: {
    backgroundColor: "#2A2455",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  ratingText: { color: "#FFC107", fontWeight: "700" },
  browseGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    paddingHorizontal: 6,
    rowGap: 6,
    columnGap: 6,
    marginBottom: 4,
  },
  browsePill: {
    width: "43%",
    aspectRatio: 1.9,
    borderRadius: 36,
    marginBottom: 2,
    overflow: "hidden",
    backgroundColor: "rgba(255,255,255,0.13)",
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.22)",
    position: "relative",
    padding: 0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 4,
  },
  pillContent: {
    flex: 1,
    width: "100%",
    height: "100%",
    position: "relative",
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  pillIcon: {
    position: "absolute",
    top: 16,
    left: 18,
    zIndex: 1,
    fontSize: 36,
  },
  pillText: {
    position: "absolute",
    bottom: 16,
    right: 18,
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
    zIndex: 1,
    opacity: 0.95,
  },
  bottomBarContainer: {
    position: "absolute",
    bottom: 18,
    left: 20,
    right: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  bottomSearchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1C1840",
    borderRadius: 28,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  bottomInput: { flex: 1, color: "#fff", fontSize: 15 },
  bottomCircleBtn: {
    marginLeft: 10,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#2A2455",
    alignItems: "center",
    justifyContent: "center",
  },
  // Modal-specific styles
  modalContainer: {
    flex: 1,
    backgroundColor: "#0A0630",
  },
  suggestionsContainer: {
    flex: 1,
  },
  modalSearchBarWrapper: {
    backgroundColor: "transparent",
  },
  modalSearchBarAbsolute: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingBottom: 12,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "transparent",
    gap: 8,
    zIndex: 20,
  },
  modalSearchBarCloseBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.08)",
    overflow: "hidden",
    marginLeft: 8,
  },
  modalHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 48,
    paddingBottom: 20,
  },
  modalHeader: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "700",
  },
  suggestionsOverlay: {
    position: "absolute",
    bottom: 80,
    left: 0,
    right: 0,
    backgroundColor: "#0A0630",
    zIndex: 999,
    borderTopWidth: 1,
    borderTopColor: "#8F8E9B",
  },
  topDecoration: {
    position: "absolute",
    top: 60,
    alignSelf: "center",
    width: "80%",
    height: "80%",
    resizeMode: "cover",
    opacity: 0.1,
    zIndex: 0,
  },
});
