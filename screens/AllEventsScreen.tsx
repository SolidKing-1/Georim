import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Image } from "expo-image";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import CircleGlassEffect from "../components/GlassEffects/circleGlassEffect.png";
import { RootStackParamList } from "../App";
import EventCard from "../components/EventCard";

type Nav = NativeStackNavigationProp<RootStackParamList, "AllEvents">;

// Demo event data
const demoEvents = [
  {
    id: "e1",
    title: "Ultra Music Festival, 2025",
    date: "Sep 15",
    location: "Grambling, LA • Digital Library",
    time: "7:00 PM",
    price: "Free",
    rating: "4.5",
    attendees: 120,
    image: require("../assets/homePage/baloon.png"),
    state: "new",
  },
  {
    id: "e2",
    title: "Tech Conference 2025",
    date: "Oct 20",
    location: "San Francisco, CA",
    time: "6:00 PM",
    price: "$50",
    rating: "4.8",
    attendees: 250,
    image: require("../assets/homePage/baloon.png"),
  },
  {
    id: "e3",
    title: "Art Exhibition",
    date: "Nov 5",
    location: "New York, NY",
    time: "5:00 PM",
    price: "Free",
    rating: "4.2",
    attendees: 80,
    image: require("../assets/homePage/baloon.png"),
  },
];

export default function AllEventsScreen() {
  const navigation = useNavigation<Nav>();
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  
  const openEvent = (event: any) => {
    // API INTEGRATION: When using real API, pass only eventId from your list response
    navigation.navigate("EventDetails", {
      eventId: event._id ?? event.id ?? "unknown",
      event,
    });
  };

  const openCategory = (category: string) => {
    navigation.navigate("CategoryList", { category });
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
        contentFit="cover"
      />

      {/* Fixed Back Button */}
      <View style={styles.backBtnFixed}>
        <View style={styles.homeBtnBlur}>
          <BlurView intensity={24} tint="dark" style={StyleSheet.absoluteFill} />
          <Image
            source={CircleGlassEffect}
            style={styles.homeShine}
            contentFit="fill"
          />
          <TouchableOpacity
            style={styles.homeBtn}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="chevron-back" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Scrolling Header with Title and Profile */}
        <View style={styles.scrollHeader}>
          <View style={styles.leftSpacer} />
          <Text style={styles.header}>All Events</Text>
          <View style={styles.profileWrap}>
            <Image
              source={require("../components/GlassEffects/profile-liquid-glass.png")}
              style={styles.circleOverlay}
              contentFit="contain"
            />
            <Image
              source={{
                uri: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&h=100&fit=crop",
              }}
              style={styles.avatarOnCircle}
              contentFit="cover"
              transition={200}
            />
          </View>
        </View>
        {/* Happening Now Section */}
        <TouchableOpacity
          style={styles.sectionHeader}
          onPress={() => openCategory("Happening Now")}
        >
          <Text style={styles.sectionTitle}>Happening Now</Text>
          <Ionicons
            name="chevron-forward"
            size={22}
            color="#F6F8F9"
            style={{ marginLeft: 6 }}
          />
        </TouchableOpacity>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 12 }}
        >
          {[demoEvents[0], demoEvents[1], demoEvents[2]].map((event, i) => (
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

        {/* Music & Concerts Section */}
        <TouchableOpacity
          style={styles.sectionHeader}
          onPress={() => openCategory("Music & Concerts")}
        >
          <Text style={styles.sectionTitle}>Music & Concerts</Text>
          <Ionicons
            name="chevron-forward"
            size={22}
            color="#F6F8F9"
            style={{ marginLeft: 6 }}
          />
        </TouchableOpacity>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 12 }}
        >
          {[demoEvents[1], demoEvents[0], demoEvents[2]].map((event, i) => (
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

        {/* Business Workshops Section */}
        <TouchableOpacity
          style={styles.sectionHeader}
          onPress={() => openCategory("Business Workshops")}
        >
          <Text style={styles.sectionTitle}>Business Workshops</Text>
          <Ionicons
            name="chevron-forward"
            size={22}
            color="#F6F8F9"
            style={{ marginLeft: 6 }}
          />
        </TouchableOpacity>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 12 }}
        >
          {[demoEvents[2], demoEvents[1], demoEvents[0]].map((event, i) => (
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

        {/* Sports & Fitness Section */}
        <TouchableOpacity
          style={styles.sectionHeader}
          onPress={() => openCategory("Sports & Fitness")}
        >
          <Text style={styles.sectionTitle}>Sports & Fitness</Text>
          <Ionicons
            name="chevron-forward"
            size={22}
            color="#F6F8F9"
            style={{ marginLeft: 6 }}
          />
        </TouchableOpacity>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 12 }}
        >
          {[demoEvents[0], demoEvents[2], demoEvents[1]].map((event, i) => (
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

        {/* Arts & Culture Section */}
        <TouchableOpacity
          style={styles.sectionHeader}
          onPress={() => openCategory("Arts & Culture")}
        >
          <Text style={styles.sectionTitle}>Arts & Culture</Text>
          <Ionicons
            name="chevron-forward"
            size={22}
            color="#F6F8F9"
            style={{ marginLeft: 6 }}
          />
        </TouchableOpacity>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 12 }}
        >
          {[demoEvents[1], demoEvents[2], demoEvents[0]].map((event, i) => (
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
      </ScrollView>

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
            contentFit="cover"
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
                  contentFit="contain"
                />
                <Image
                  source={{
                    uri: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&h=100&fit=crop",
                  }}
                  style={styles.modalAvatarOnCircle}
                  contentFit="cover"
                  transition={200}
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
                contentFit="fill"
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
                contentFit="fill"
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
  container: { flex: 1 },
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
  backBtnFixed: {
    position: "absolute",
    top: 60,
    left: 18,
    zIndex: 3,
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
  scrollHeader: {
    height: 64,
    position: "relative",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    marginTop: 60,
    paddingLeft: 0,
    paddingRight: 20,
    marginBottom: 0,
  },
  leftSpacer: {
    width: 50,
  },
  header: {
    flex: 1,
    color: "#F6F8F9",
    fontSize: 30,
    fontWeight: "600",
    textAlign: "center",
    marginTop: -10,
  },
  profileWrap: {
    width: 54,
    height: 54,
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 0,
    marginTop: -14,
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
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    paddingHorizontal: 20,
    marginBottom: 18,
  },
  sectionTitle: {
    color: "#F6F8F9",
    fontSize: 18,
    fontWeight: "700",
  },
  bottomBarContainer: {
    position: "absolute",
    bottom: 18,
    left: 20,
    right: 20,
    flexDirection: "row",
    alignItems: "center",
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
