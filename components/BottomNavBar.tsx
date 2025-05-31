import React from "react";
import {
  View,
  TouchableOpacity,
  Text,
  Image,
  StyleSheet,
  Animated,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

// Import your icons here
import Home from "../assets/home.png";
import Explore from "../assets/Explore.png";
import TicketIcon from "../assets/ticket.png";
import ProfileIcon from "../assets/user.png";

interface BottomNavBarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  navSlideAnim?: Animated.Value;
}

const BottomNavBar: React.FC<BottomNavBarProps> = ({
  activeTab,
  setActiveTab,
  navSlideAnim,
}) => {
  const navigation = useNavigation<any>();

  const NavWrapper = navSlideAnim ? Animated.View : View;

  return (
    <>
      {/* Bottom Navigation Bar with Animation */}
      <Animated.View
        style={[
          styles.bottomNav,
          navSlideAnim ? { transform: [{ translateY: navSlideAnim }] } : {},
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
          onPressIn={() => {
            setActiveTab("Explore");
            navigation.navigate("ExploreScreen");
          }}
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
            source={{
              uri: "https://res.cloudinary.com/dcw9wgjq5/image/upload/v1748463730/ticket_jvd9gk.png",
            }}
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
          onPress={() => {
            setActiveTab("Account");
            navigation.navigate("AccountScreen");
          }}
        >
          <Image
            source={{
              uri: "https://res.cloudinary.com/dcw9wgjq5/image/upload/user_tvz4cy.png",
            }}
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
      {/* Bowl Cutout and Floating Button */}
      <View style={styles.bowlCutout}>
        <TouchableOpacity
          style={styles.floatingButton}
          onPress={() => navigation.navigate("CreateEvent")}
        >
          <Text style={styles.plusText}>+</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
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
    shadowColor: "#000",
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
    bottom: 90,
    left: "50%",
    transform: [{ translateX: -45 }, { translateY: 30 }, { rotate: "180deg" }],
    width: 93,
    height: 54,
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    zIndex: 1,
  },
  /*   bowlCutout: {
    position: "absolute",
    bottom: 90,
    left: "50%",
    transform: [{ translateX: -45 }, { translateY: 30 }, { rotate: "180deg" }],
    width: 93,
    height: 54,
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    zIndex: 1,
  }, */
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

export default BottomNavBar;
