import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Animated,
  Easing,
  TextInput,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";
import LocationIcon from "react-native-vector-icons/Feather";
import DownArrow from "react-native-vector-icons/Entypo";
import Home from "../assets/home.png";
import Explore from "../assets/Explore.png";
import TicketIcon from "../assets/ticket.png";
import ProfileIcon from "../assets/user.png";


const { width } = Dimensions.get("window");
// Slideshow images
const slideshowImages = [
  require("../assets/slide1.jpg"),
  require("../assets/slide2.jpg"),
  require("../assets/slide3.jpg"),
  require("../assets/slide4.jpg"),
];

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "Dashboard">;
export default function DashboardScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState(1);
  const translateX = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const navSlideAnim = useRef(new Animated.Value(100)).current;
  const [activeTab, setActiveTab] = useState("Explore");


  useEffect(() => {
    Animated.timing(navSlideAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start();
    
  }, []);


  useEffect(() => {
    const interval = setInterval(() => {
      // Start fade out animation
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start(() => {
        // Update indices after fade out
        const newNextIndex = (currentIndex + 1) % slideshowImages.length;
        setCurrentIndex(nextIndex);
        setNextIndex(newNextIndex);

        // Reset position and fade in
        translateX.setValue(0);
        fadeAnim.setValue(1);
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [currentIndex, nextIndex]);

  return (
    <View style={styles.container}>
      {/* Company Logo */}
      {/* <View style={styles.logoWrapper}>
        <Image source={Company} style={styles.logo} resizeMode="contain" />
      </View> */}

      {/* Banner Section with Rotating Image */}
      <View style={styles.banner}>
        <Animated.Image
          source={slideshowImages[currentIndex]}
          style={[
            styles.animatedImage,
            {
              opacity: fadeAnim,
            },
          ]}
          resizeMode="cover"
        />

        {/* Next image ready underneath */}
        <Image
          source={slideshowImages[nextIndex]}
          style={[styles.nextImage]}
          resizeMode="cover"
        />

        {/* Overlay Texts */}
        <View style={styles.overlayContent}>
          <Text style={styles.bannerTitle}>Don't miss out!</Text>
          <Text style={styles.bannerSubtitle}>
            Explore the <Text style={styles.highlight}>vibrant events</Text>{" "}
            happening locally and globally
          </Text>

          {/* Search Bar */}
          <View style={styles.searchBar}>
            {/* Left Search Section */}
            <View style={styles.searchLeft}>
              <TextInput
                placeholder="Search events, Categories, Locations"
                placeholderTextColor="#666"
                style={styles.searchInput}
              />
              <TouchableOpacity style={styles.clearBtn}>
                <Text style={{ color: "#fff", fontWeight: "bold" }}>x</Text>
              </TouchableOpacity>
            </View>

            {/* Vertical Divider */}
            <View style={styles.verticalDividerBetweenFields} />

            {/* Right Location Section */}
            <View style={styles.searchRight}>
              <LocationIcon name="map-pin" size={16} color="#444" />
              <Text style={styles.locationText}>Ruston LA</Text>
              <DownArrow name="chevron-down" size={16} color="#444" />
            </View>
          </View>
        </View>
      </View>

      <View style={styles.midNavbarWrapper}>
        {/* Top-Left Categories Bowl */}
        <View style={styles.categoriesBowl}>
          <Text style={styles.categoriesText}>Categories</Text>
        </View>

        {/* Icons Row */}
        <View style={styles.midNavbar}>
          {[
            { label: "Religious", icon: require("../assets/Worship.png") },
            {
              label: "Entertainment",
              icon: require("../assets/Entertainment.png"),
            },
            { label: "Corporate", icon: require("../assets/Corporate.png") },
            { label: "Educational", icon: require("../assets/Education.png") },
          ].map(({ label, icon }, index) => (
            <View key={index} style={styles.iconCircleWrapper}>
              <TouchableOpacity style={styles.iconCircle}>
                <Image source={icon} style={styles.circleIcon} />
              </TouchableOpacity>
              <Text style={styles.circleLabel}>{label}</Text>
            </View>
          ))}

          {/* Options icon (no label) */}
          <View style={styles.iconCircleWrapper}>
            <Image
              source={require("../assets/menu.png")}
              style={[styles.optionsIcon, { tintColor: "#7F00FF" }]}
            />
          </View>
        </View>
      </View>

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
          onPress={() => setActiveTab("Home")}
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
          onPress={() => setActiveTab("Check-In")}
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
  logoWrapper: {
    alignItems: "center",
    marginTop: 60,
  },
  banner: {
    width: width,
    height: 220,
    justifyContent: "flex-end",
    overflow: "hidden",
    position: "relative",
  },
  animatedImage: {
    ...StyleSheet.absoluteFillObject,
    width: width,
    height: 220,
  },
  nextImage: {
    ...StyleSheet.absoluteFillObject,
    width: width,
    height: 220,
  },
  overlayContent: {
    flex: 1,
    justifyContent: "flex-end",
    padding: 20,
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  bannerTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
  },
  bannerSubtitle: {
    color: "#fff",
    fontSize: 16,
    marginTop: 4,
  },
  highlight: {
    color: "#FFB800",
    fontWeight: "700",
  },
  searchBar: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 10,
    overflow: "hidden",
    alignItems: "center",
    marginTop: 16,
  },
  searchLeft: {
    flex: 2,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 5,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    paddingLeft: 2,
    fontSize: 13,
  },
  clearBtn: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#444",
    alignItems: "center",
    justifyContent: "center",
  },
  verticalDividerBetweenFields: {
    width: 1,
    height: "60%",
    backgroundColor: "#ccc",
  },
  searchRight: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingHorizontal: 4,
  },
  locationText: {
    fontSize: 12,
    marginHorizontal: 4,
    color: "#444",
  },
  midNavbarWrapper: {
    marginTop: 20,
    paddingHorizontal: 20,
    position: "relative",
    backgroundColor: "#7F00FF0D",
  },

  categoriesBowl: {
    position: "absolute",
    top: -16,
    left: 0,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    zIndex: 2,
  },

  categoriesText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#FFFFF",
  },

  midNavbar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 30,
  },

  iconCircleWrapper: {
    alignItems: "center",
  },

  iconCircle: {
    width: 50,
    height: 50,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
  },

  circleIcon: {
    width: 28,
    height: 28,
    resizeMode: "contain",
  },

  circleLabel: {
    fontSize: 12,
    fontWeight: 600,
    color: "#444",
    textAlign: "center",
    marginBottom: 10,
  },
  optionsIcon: {
    width: 24,
    height: 24,
    resizeMode: "contain",
    marginBottom: 20,
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
