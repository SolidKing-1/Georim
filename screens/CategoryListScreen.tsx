import React, { useState, useRef, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, FlatList, Dimensions, Modal, TextInput, ScrollView, Keyboard, KeyboardAvoidingView, Platform } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import CircleGlassEffect from "../components/GlassEffects/circleGlassEffect.png";
import { RootStackParamList } from "../App";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import EventCard from "../components/EventCard";
import { LinearGradient } from "expo-linear-gradient";

type Nav = NativeStackNavigationProp<RootStackParamList, "CategoryList">;

type Event = {
  id: string;
  title: string;
  location: string;
  price: string;
  image: any;
  description: string;
};

const events: Event[] = Array.from({ length: 6 }).map((_, i) => ({
  id: `${i + 1}`,
  title: "Ultra Music Festival, 2025",
  location: "Grambling, LA • Digital Library",
  price: "Free",
  description:
    "A vibrant celebration of music and culture with live performers and immersive visuals.",
  image: require("../assets/homePage/baloon.png"),
}));

export default function CategoryListScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<any>();
  const { category } = route.params as { category: string };
  const cardWidth = Dimensions.get("window").width - 32;
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  const openEvent = (event: any) =>
    navigation.navigate("EventDetails", {
      eventId: event._id ?? event.id ?? "unknown",
      event,
    });

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

  const renderItem = ({ item }: { item: Event }) => (
    <EventCard
      image={item.image}
      title={item.title}
      location={item.location}
      price={item.price}
      onPress={() => openEvent(item)}
      width={cardWidth}
      marginRight={0}
    />
  );

  return (
    <LinearGradient
      colors={["#0E0D32", "#060616", "#060616"]}
      locations={[0, 0.35, 1]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={styles.container}
    >
      <Image
        source={require("../assets/homePage/birthday-decoration.png")}
        style={styles.topDecoration}
      />
      <View style={styles.backBtnFixed}>
        <View style={styles.homeBtnBlur}>
          <BlurView intensity={24} tint="dark" style={StyleSheet.absoluteFill} />
          <Image
            source={CircleGlassEffect}
            style={styles.homeShine}
          />
          <TouchableOpacity
            style={styles.homeBtn}
            onPress={() => navigation.navigate("Search")}
          >
            <Ionicons name="chevron-back" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
      <FlatList
        data={events}
        keyExtractor={(i) => i.id}
        renderItem={renderItem}
        ListHeaderComponent={
          <View style={styles.scrollHeader}>
            <View style={styles.leftSpacer} />
            <Text style={styles.header}>{category}</Text>
            <View style={styles.profileWrap}>
              <Image
                source={require("../components/GlassEffects/profile-liquid-glass.png")}
                style={styles.circleOverlay}
              />
              <Image
                source={{
                  uri: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&h=100&fit=crop",
                }}
                style={styles.avatarOnCircle}
              />
            </View>
          </View>
        }
        contentContainerStyle={styles.listContent}
      />

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
        <LinearGradient
          colors={["#0E0D32", "#060616", "#060616"]}
          locations={[0, 0.35, 1]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={{ flex: 1 }}
        >
          <Image
            source={require("../assets/homePage/birthday-decoration.png")}
            style={styles.topDecoration}
          />
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
            keyboardVerticalOffset={0}
          >
            {/* Modal Header */}
            <View style={styles.modalHeaderRow}>
              <Text style={styles.modalHeader}>Search</Text>
              <View style={styles.modalProfileWrap}>
                <Image
                  source={require("../components/GlassEffects/profile-liquid-glass.png")}
                  style={styles.modalCircleOverlay}
                />
                <Image
                  source={{
                    uri: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&h=100&fit=crop",
                  }}
                  style={styles.modalAvatarOnCircle}
                />
              </View>
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

          {/* Search Bar with Close button */}
          <View
            style={[
              styles.modalSearchBarAbsolute,
              { bottom: keyboardHeight + 18 },
            ]}
          >
            <View style={styles.modalSearchBarBlur}>
              <BlurView intensity={24} tint="dark" style={StyleSheet.absoluteFill} />
              <Image
                source={require("../components/GlassEffects/Glass Effect.png")}
                style={styles.modalShineOverlay}
              />
              <View style={styles.modalSearchBarInput}>
                <Ionicons
                  name="search"
                  size={18}
                  color="#8F8E9B"
                  style={{ marginRight: 8 }}
                />
                <TextInput
                  ref={inputRef}
                  value={query}
                  onChangeText={setQuery}
                  placeholder="Categories, Groups and More"
                  placeholderTextColor="#8F8E9B"
                  style={styles.modalInputText}
                  autoFocus
                />
              </View>
            </View>
            <View style={styles.modalCloseBtnBlur}>
              <BlurView intensity={24} tint="dark" style={StyleSheet.absoluteFill} />
              <Image
                source={require("../components/GlassEffects/circleGlassEffect.png")}
                style={styles.modalCloseShine}
              />
              <TouchableOpacity
                style={styles.modalSearchBarCloseBtn}
                onPress={() => {
                  setQuery("");
                  setIsFocused(false);
                  Keyboard.dismiss();
                }}
              >
                <Ionicons name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#05031B" },
  backBtnFixed: {
    position: "absolute",
    top: 60,
    left: 18,
    zIndex: 3,
  },
  scrollHeader: {
    height: 64,
    position: "relative",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    marginTop: 60,
    paddingLeft: 0,
    paddingRight: 20,
    marginBottom: -24,
  },
  leftSpacer: {
    width: 50,
  },
  homeBtnBlur: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 8,
    overflow: "hidden",
    position: "relative",
  },
  homeBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.001)",
  },
  homeShine: {
    ...StyleSheet.absoluteFillObject,
    width: undefined,
    height: undefined,
    resizeMode: "stretch",
    opacity: 1,
  },
  header: {
    flex: 1,
    color: "#F6F8F9",
    fontSize: 30,
    fontWeight: "600",
    textAlign: "center",
    marginTop: -30,
  },
  profileWrap: {
    width: 54,
    height: 54,
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    marginRight: -24,
    marginTop: -38,
  },
  circleOverlay: {
    position: "absolute",
    width: 54,
    height: 54,
    resizeMode: "contain",
    top: 0,
    left: 0,
  },
  avatarOnCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    zIndex: 2,
  },
  listContent: {
    paddingBottom: 100,
    paddingTop: 10,
    paddingHorizontal: 16,
    rowGap: 16,
  },
  card: {
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: "#15113A",
    borderRadius: 16,
    overflow: "hidden",
  },
  cardImage: { width: "100%", height: 160 },
  cardBody: { padding: 12 },
  badgeRow: { flexDirection: "row", gap: 8, marginBottom: 6 },
  badge: {
    backgroundColor: "#18C964",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  badgeText: { color: "#fff", fontWeight: "700", fontSize: 12 },
  cardTitle: { color: "#fff", fontWeight: "700", fontSize: 16, marginTop: 2 },
  cardMeta: { color: "#9CA3AF", fontSize: 12, marginTop: 2 },
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  attendees: { color: "#7F93FF", fontWeight: "600" },
  rating: {
    backgroundColor: "#2A2455",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  ratingText: { color: "#FFC107", fontWeight: "700" },
  bottomBar: { position: "absolute", left: 16, right: 16, bottom: 20 },
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
  // Modal styles
  modalHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 12,
    zIndex: 2,
  },
  modalHeader: {
    color: "#F6F8F9",
    fontSize: 30,
    fontWeight: "700",
  },
  modalProfileWrap: {
    width: 54,
    height: 54,
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  modalCircleOverlay: {
    position: "absolute",
    width: 54,
    height: 54,
    resizeMode: "contain",
    top: 0,
    left: 0,
  },
  modalAvatarOnCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    zIndex: 2,
  },
  suggestionsContainer: {
    flex: 1,
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
  suggestionText: {
    color: "#ffffff",
    fontSize: 15,
  },
  modalSearchBarAbsolute: {
    position: "absolute",
    left: 20,
    right: 20,
    bottom: 0,
    paddingBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "transparent",
    zIndex: 20,
  },
  modalSearchBarBlur: {
    flex: 1,
    height: 52,
    borderRadius: 296,
    overflow: "hidden",
    position: "relative",
    marginRight: 12,
  },
  modalShineOverlay: {
    ...StyleSheet.absoluteFillObject,
    width: undefined,
    height: undefined,
    resizeMode: "stretch",
    opacity: 1,
  },
  modalSearchBarInput: {
    flex: 1,
    height: 52,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.001)",
    borderRadius: 296,
    paddingHorizontal: 18,
  },
  modalInputText: {
    flex: 1,
    color: "#fff",
    fontSize: 15,
    fontWeight: "500",
  },
  modalCloseBtnBlur: {
    width: 52,
    height: 52,
    borderRadius: 26,
    overflow: "hidden",
    position: "relative",
  },
  modalCloseShine: {
    ...StyleSheet.absoluteFillObject,
    width: undefined,
    height: undefined,
    resizeMode: "stretch",
    opacity: 1,
  },
  modalSearchBarCloseBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.001)",
  },
});
