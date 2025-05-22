import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Animated,
  FlatList,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Home from "../assets/home.png";
import Explore from "../assets/Explore.png";
import TicketIcon from "../assets/ticket.png";
import ProfileIcon from "../assets/user.png";

const events = [
  {
    id: "1",
    title: "Ruston Fest!!! - Revival",
    date: "Sat, May 17",
    location: "LA Tech Basketball Stadium",
    price: "Free",
    image: require("../assets/ruston-fest.png"),
    section: "Ongoing",
  },
  {
    id: "2",
    title: "Dembele Calculus - Education",
    date: "May 17- Dec 1",
    location: "Grambling, Carver Hall 234",
    price: "Free",
    image: require("../assets/calculus.png"),
    section: "Today",
  },
  {
    id: "3",
    title: "Karaoke - Live Singing",
    date: "Fri, June 11",
    location: "Grambling, McDinning",
    price: "$30",
    image: require("../assets/karaoke.png"),
    section: "Today",
  },
  {
    id: "4",
    title: "Dembele Calculus - Education",
    date: "May 17- Dec 1",
    location: "Grambling, Carver Hall 234",
    price: "Free",
    image: require("../assets/calculus.png"),
    section: "Upcoming",
  },
  {
    id: "5",
    title: "Karaoke - Live Singing",
    date: "Fri, June 11",
    location: "Grambling, McDinning",
    price: "$30",
    image: require("../assets/karaoke.png"),
    section: "Upcoming",
  },
];

const sections = ["Ongoing", "Today", "Upcoming"];

export default function CheckinScreen() {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState("Check-In");
  const navSlideAnim = useRef(new Animated.Value(100)).current;

  useEffect(() => {
    Animated.timing(navSlideAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  // Flatten events for FlatList
  const flatEvents = events.map((event) => ({
    ...event,
    key: event.id,
    section: event.section,
  }));

  const renderEvent = ({ item }) => (
    <View style={styles.eventItem}>
      <Image source={item.image} style={styles.eventImage} />
      <View style={styles.eventInfo}>
        <View style={styles.eventMainInfo}>
          <TouchableOpacity onPress={() => navigation.navigate("EventDetails")}>
            <Text style={styles.eventTitle}>{item.title}</Text>
          </TouchableOpacity>
          <Text style={styles.eventDate}>
            {item.date} - {item.location}
          </Text>
        </View>
        <View style={styles.eventBottom}>
          <Text style={styles.eventPrice}>{item.price}</Text>
          <View style={styles.buttonGroup}>
            <TouchableOpacity
              style={styles.checkinBtn}
              onPress={() => {
                setActiveTab("Check-In");
                navigation.navigate("VerifyLocation");
              }}
            >
              <Text style={styles.checkinText}>Check In</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelBtn}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );

  // Section headers for FlatList
  const renderSectionHeader = (section) => (
    <Text style={styles.sectionTitle}>{section}</Text>
  );

  // Group events by section for rendering headers
  const groupedEvents = sections.flatMap((section) => [
    { type: "header", section, key: `header-${section}` },
    ...flatEvents.filter((e) => e.section === section),
  ]);

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <Text style={styles.header}>Check In</Text>
        <Image
          source={require("../assets/checkin-illustration.jpg")}
          style={styles.illustration}
          resizeMode="contain"
        />
      </View>

      <View style={styles.registeredBar}>
        <Text style={styles.registeredText}>Registered Events</Text>
      </View>

      <FlatList
        data={groupedEvents}
        renderItem={({ item }) =>
          item.type === "header"
            ? renderSectionHeader(item.section)
            : renderEvent({ item })
        }
        keyExtractor={(item) => item.key || item.section}
        contentContainerStyle={[styles.scrollContainer, { paddingBottom: 120 }]}
        showsVerticalScrollIndicator={false}
        style={{ maxHeight: 500, marginBottom: 0 }}
      />

      {/* Bottom Navigation Bar */}
      <Animated.View
        style={[
          styles.bottomNav,
          { transform: [{ translateY: navSlideAnim }] },
        ]}
      >
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

        {/* Account Tab */}
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setActiveTab("Account")}
        >
          <Image
            source={ProfileIcon}
            style={{
              width: 24,
              height: 24,
              tintColor: activeTab === "Account" ? "#7F00FF" : "#333",
            }}
          />
          <Text
            style={[
              styles.navText,
              activeTab === "Account" && {
                color: "#7F00FF",
                fontWeight: "600",
              },
            ]}
          >
            Account
          </Text>
        </TouchableOpacity>
      </Animated.View>
      {/* Bowl Cutout */}
      <View style={styles.bowlCutout}>
        <TouchableOpacity
          style={styles.floatingButton}
          onPress={() => navigation.navigate("CreateEvent")}
        >
          <Text style={styles.plusText}>+</Text>
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
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 20, // room for nav bar
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    marginBottom: -10,
    paddingLeft: 12,
  },
  illustration: {
    width: 220,
    height: 180,
  },
  registeredBar: {
    backgroundColor: "#7F00FF",
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginTop: 0,
  },
  registeredText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 20,
  },
  sectionTitle: {
    fontWeight: "600",
    fontSize: 18,
    marginTop: 6,
    marginBottom: 6,
    marginLeft: 12,
  },
  eventItem: {
    flexDirection: "row",
    alignItems: "flex-start", // changed from center
    backgroundColor: "#fff",
    marginHorizontal: 0,
    marginBottom: 8,
    borderRadius: 8,
    padding: 6,
    elevation: 1,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
  },
  eventImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 10,
  },
  eventInfo: {
    flex: 1,
    marginLeft: 10,
  },
  eventMainInfo: {
    marginBottom: 4,
  },
  eventTitle: {
    fontWeight: "500",
    fontSize: 16,
    marginBottom: 2,
  },
  eventDate: {
    fontSize: 12,
    color: "#444",
  },
  eventBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  eventPrice: {
    fontSize: 12,
    color: "#000",
  },
  buttonGroup: {
    flexDirection: "row",
    gap: 8,
  },
  checkinBtn: {
    backgroundColor: "#18C964",
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    minWidth: 65,
    alignItems: "center",
  },
  cancelBtn: {
    backgroundColor: "#FF0000",
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    minWidth: 65,
    alignItems: "center",
  },
  checkinText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12,
  },
  cancelText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12,
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
    backgroundColor: "#7F00FF0D",
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
    bottom: 90, // aligns with navbar height
    left: "50%",
    transform: [{ translateX: -45 }, { translateY: 30 }, { rotate: "180deg" }],
    width: 93,
    height: 54,
    backgroundColor: "#fff",
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
});
