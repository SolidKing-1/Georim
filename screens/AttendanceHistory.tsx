import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Animated,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";
import BottomNavComplete from "../components/BottomNavComplete";

const events = [
  {
    id: "1",
    title: "Ruston Fest!!! - Revival",
    description: "Sat, May 17 - LA Tech Basketball Stadium\nFree",
    image: require("../assets/ruston-fest.png"),
  },
  {
    id: "2",
    title: "Dembele Calculus - Education",
    description: "May 17- Dec 1 - Grambling, Carver Hall 234\nFree",
    image: require("../assets/calculus.png"),
  },
  {
    id: "3",
    title: "Karaoke - Live Singing",
    description: "Fri, June 11 - Grambling, McDinning\n$30",
    image: require("../assets/karaoke.png"),
  },
  {
    id: "4",
    title: "Ruston Fest Afterparty",
    description: "Sat, May 17 - Ruston Downtown\n$10",
    image: require("../assets/ruston-fest.png"),
  },
  {
    id: "5",
    title: "Advanced Calculus Workshop",
    description: "Mon, June 21 - Grambling, Carver Hall 101\nFree",
    image: require("../assets/calculus.png"),
  },
  {
    id: "6",
    title: "Karaoke Night Finals",
    description: "Sat, July 3 - Grambling, McDinning\n$25",
    image: require("../assets/karaoke.png"),
  },
  {
    id: "7",
    title: "Ruston Fest Pre-Party",
    description: "Fri, May 16 - LA Tech Quad\nFree",
    image: require("../assets/ruston-fest.png"),
  },
  {
    id: "8",
    title: "Calculus for Beginners",
    description: "Wed, June 9 - Grambling, Carver Hall 234\nFree",
    image: require("../assets/calculus.png"),
  },
  {
    id: "9",
    title: "Open Mic Karaoke",
    description: "Thu, July 8 - Grambling, McDinning\n$15",
    image: require("../assets/karaoke.png"),
  },
];

const AttendanceHistory = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState("Home");
  const navSlideAnim = useRef(new Animated.Value(100)).current;

  useEffect(() => {
    Animated.timing(navSlideAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const renderEvent = ({ item }: any) => (
    <View style={styles.eventCard}>
      <Image source={item.image} style={styles.eventImage} />
      <View style={styles.eventDetails}>
        <Text style={styles.eventTitle}>{item.title}</Text>
        <Text style={styles.eventDescription}>{item.description}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* White space section for back button */}
      <View style={styles.topSpacer}>
        {/* <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={26} color="#181818" />
        </TouchableOpacity> */}
      </View>

      {/* Header */}
      <View style={styles.headerBar}>
        <Text style={styles.headerText}>Attendance History</Text>
      </View>

      {/* Event List */}
      <FlatList
        data={events}
        keyExtractor={(item) => item.id}
        renderItem={renderEvent}
        contentContainerStyle={styles.eventList}
        showsVerticalScrollIndicator={false}
      />

      {/* Bottom Navigation */}
      <BottomNavComplete
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        navSlideAnim={navSlideAnim}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  topSpacer: {
    height: 48,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  backButton: {
    position: "absolute",
    left: 16,
    zIndex: 10,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 4,
    elevation: 2,
  },
  headerBar: {
    marginTop: 0,
    backgroundColor: "#9400FF",
    paddingVertical: 16,
    paddingHorizontal: 0,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  headerText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    marginLeft: 16,
  },
  eventList: {
    paddingTop: 16,
    paddingHorizontal: 0,
    paddingBottom: 120,
  },
  eventCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    marginHorizontal: 0,
    marginBottom: 18,
    paddingVertical: 0,
    paddingHorizontal: 16,
  },
  eventImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  eventDetails: {
    flex: 1,
    justifyContent: "center",
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#181818",
    marginBottom: 2,
  },
  eventDescription: {
    fontSize: 14,
    color: "#444",
    lineHeight: 18,
  },
});

export default AttendanceHistory;
