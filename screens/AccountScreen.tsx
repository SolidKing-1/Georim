import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Profile from "./ProfileScreen";
import Settings from "./SettingsScreen";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import BottomNavBar from "../components/BottomNavBar"; // Import the reusable BottomNavBar

// Dummy profile image
const profileImage = { uri: "https://randomuser.me/api/portraits/men/32.jpg" };

// Home screen content for the Account stack
const AccountHome = () => {
  // State for active tab (for BottomNavBar)
  const [activeTab, setActiveTab] = React.useState("Account");

  return (
    <View style={styles.container}>
      {/* Status bar for top of the screen */}
      <StatusBar style="dark" backgroundColor="#fff" />
      {/* Scrollable account content */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        style={styles.scrollView}
      >
        <View style={styles.card}>
          {/* Account title and greeting */}
          <Text style={styles.accountTitle}>Account</Text>
          <Text style={styles.greeting}>Hi James,</Text>
          {/* Profile section */}
          <View style={styles.profileSection}>
            <Image source={profileImage} style={styles.profileImage} />
            <Text style={styles.email}>jkoght2@gmail.com</Text>
          </View>
          {/* Menu items */}
          <View style={styles.menu}>
            <MenuItem
              icon={
                <Ionicons name="person-outline" size={24} color="#8B8B8B" />
              }
              label="Profile Details"
            />
            <MenuItem
              icon={<Ionicons name="heart-outline" size={24} color="#C8A2FA" />}
              label="Favourites"
            />
            <MenuItem
              icon={<MaterialIcons name="history" size={24} color="#C8A2FA" />}
              label="Attendance History"
              iconBg="#F5E9FF"
            />
            <MenuItem
              icon={
                <Ionicons name="calendar-outline" size={24} color="#C8A2FA" />
              }
              label="Events Created"
              iconBg="#F5E9FF"
            />
            <MenuItem
              icon={
                <FontAwesome5 name="credit-card" size={20} color="#8B8B8B" />
              }
              label="Payment Methods"
              iconBg="#F5E9FF"
            />
            <MenuItem
              icon={
                <Ionicons
                  name="help-circle-outline"
                  size={24}
                  color="#8B8B8B"
                />
              }
              label="Help and Support"
              iconBg="#F5E9FF"
            />
            <MenuItem
              icon={<MaterialIcons name="logout" size={24} color="#8B8B8B" />}
              label="Log out"
              iconBg="#F5E9FF"
            />
          </View>
        </View>
      </ScrollView>

      {/* Reusable BottomNavBar component */}
      <BottomNavBar activeTab={activeTab} setActiveTab={setActiveTab} />
    </View>
  );
};

// Menu item component for account options
const MenuItem = ({ icon, label, iconBg = "#F5F5F5", badge }: any) => (
  <TouchableOpacity style={styles.menuItem}>
    <View style={[styles.menuIcon, { backgroundColor: iconBg }]}>{icon}</View>
    <Text style={styles.menuLabel}>{label}</Text>
    {badge && (
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{badge}</Text>
      </View>
    )}
    <Ionicons
      name="chevron-forward"
      size={20}
      color="#BDBDBD"
      style={{ marginLeft: "auto" }}
    />
  </TouchableOpacity>
);

// Stack navigator for Account section
const Stack = createNativeStackNavigator();

export default function AccountScreen() {
  // The stack navigator wraps AccountHome and other account-related screens
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AccountHome" component={AccountHome} />
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="Settings" component={Settings} />
      {/* Add more screens as needed */}
    </Stack.Navigator>
  );
}

// Styles for the Account screen and its components
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollView: {
    flex: 1,
    // This ensures the scroll view goes under the content above the navbar
    marginBottom: 130, // Adjust this value to be a little more than the navbar height
  },
  scrollContent: {
    paddingTop: 0,
    paddingHorizontal: 0,
  },
  card: {
    backgroundColor: "#F5F2F8",
    borderRadius: 12,
    marginHorizontal: 0,
    paddingVertical: 16,
    paddingHorizontal: 0,
    alignItems: "center",
  },
  accountTitle: {
    fontSize: 28,
    fontWeight: "700",
    alignSelf: "flex-start",
    marginLeft: 24,
    marginBottom: 4,
    marginTop: 16,
    color: "#181818",
  },
  greeting: {
    fontSize: 18,
    color: "#8B8B8B",
    alignSelf: "flex-start",
    marginLeft: 24,
    marginBottom: 12,
  },
  profileSection: {
    alignItems: "center",
    marginBottom: 12,
  },
  profileImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 4,
    borderColor: "#fff",
    marginBottom: 8,
  },
  email: {
    fontSize: 14,
    color: "#8B8B8B",
    textAlign: "center",
    marginBottom: 8,
  },
  menu: {
    width: "100%",
    marginTop: 8,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginVertical: 6,
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 16,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  menuIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  menuLabel: {
    fontSize: 16,
    color: "#181818",
    fontWeight: "500",
  },
  badge: {
    backgroundColor: "#FF2DF7",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 10,
  },
  badgeText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
  },
});
