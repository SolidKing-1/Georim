import React, { useRef, useEffect, useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Profile from "./ProfileScreen";
import Settings from "./SettingsScreen";
import EventCreatedPage from "./EventCreatedScreen";
import FavouriteScreen from "./FavouriteScreen";
import AttendanceHistory from "./AttendanceHistory";
import HelpAndSupportScreen from "./Help_Support";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Animated,
  ScrollView,
  TouchableOpacity,
  ScrollView as RNScrollView,
  Alert,
} from "react-native";
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { removeToken } from "../utils/auth";
import { getUserData } from "../utils/user";
import * as ImagePicker from "expo-image-picker";

// Dummy profile image
const profileImage = { uri: "https://randomuser.me/api/portraits/men/32.jpg" };
type AccountStackParamList = {
  AccountHome: undefined;
  Profile: undefined;
  Settings: undefined;
  EventCreatedPage: undefined;
  Login: undefined;
  HelpAndSupportScreen: undefined;
  AttendanceHistory: undefined;
  FavouriteScreen: undefined;
  // Add more screens as needed
};

// Home screen content for the Account stack
const AccountHome = () => {
  // State for active tab (for BottomNavBar)
  const [activeTab, setActiveTab] = React.useState("Account");
  const navSlideAnim = useRef(new Animated.Value(100)).current;

  useEffect(() => {
    Animated.timing(navSlideAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);
  const navigation = useNavigation<NavigationProp<AccountStackParamList>>();

  // State for user data
  const [userData, setUserData] = React.useState<{
    name?: string;
    email?: string;
    picture?: { uri: string };
  }>({});

  // Fetch user data on mount
  React.useEffect(() => {
    (async () => {
      const data = await getUserData();
      setUserData(data || {});
    })();
  }, []);

  // State and setter for showing the profile image modal
  const [imageModalVisible, setImageModalVisible] = useState<boolean>(false);

  // Function to handle profile image editing
  const handleProfileImageEdit = async () => {
    // Ask for permission
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission required",
        "Please grant media access to update your profile image."
      );
      return;
    }
    // Launch image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      const newImage = { uri: result.assets[0].uri };
      setUserData((prev) => ({ ...prev, picture: newImage }));
      setImageModalVisible(false);
      // Optionally, upload the new image to your backend here
    }
  };

  return (
    <View style={styles.container}>
      {/* Status bar for top of the screen */}
      <StatusBar style="dark" backgroundColor="#fff" />
      {/* Scrollable account content */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        // Add extra padding to bottom so content is not hidden under navbar
        contentInset={{ bottom: 120 }}
        contentOffset={{ y: 0, x: 0 }}
      >
        <View style={styles.card}>
          {/* Account title and greeting */}
          <Text style={styles.accountTitle}>Account</Text>
          <Text style={styles.greeting}>
            Hi {userData.name ? userData.name : "User"},
          </Text>
          {/* Profile section */}
          <View style={styles.profileSection}>
            <TouchableOpacity
              onPress={() => setImageModalVisible(true)}
              activeOpacity={0.8}
              accessibilityLabel="View profile image full screen"
              accessibilityHint="Tap to view your profile image in full screen"
            >
              <Image
                source={userData.picture?.uri ? userData.picture : profileImage}
                style={styles.profileImage}
              />
            </TouchableOpacity>
            <Text style={styles.email}>
              {userData.email ? userData.email : "user@email.com"}
            </Text>
          </View>
          {/* Menu items grouped and styled as in the screenshot */}
          <View style={styles.menuGroup}>
            <MenuItem
              icon={
                <Ionicons name="person-outline" size={24} color="#8B8B8B" />
              }
              label="Profile Details"
              showDivider
              onPress={() => navigation.navigate("Profile")}
            />
            <MenuItem
              icon={<Ionicons name="heart-outline" size={24} color="#C8A2FA" />}
              label="Favourites"
              showDivider
              onPress={() => navigation.navigate("FavouriteScreen")}
            />
            <MenuItem
              icon={<MaterialIcons name="history" size={24} color="#C8A2FA" />}
              label="Attendance History"
              onPress={() => navigation.navigate("AttendanceHistory")}
            />
          </View>
          <View style={styles.menuGroup}>
            <MenuItem
              icon={
                <Ionicons name="calendar-outline" size={24} color="#C8A2FA" />
              }
              label="Events Created"
              onPress={() => navigation.navigate("EventCreatedPage")}
            />
          </View>
          <View style={styles.menuGroup}>
            <MenuItem
              icon={
                <FontAwesome5 name="credit-card" size={20} color="#8B8B8B" />
              }
              label="Payment Methods"
              showDivider
              onPress={() => navigation.navigate("Settings")}
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
              showDivider
              onPress={() => navigation.navigate("HelpAndSupportScreen")}
            />
            <MenuItem
              icon={<MaterialIcons name="logout" size={24} color="#8B8B8B" />}
              label="Log out"
              onPress={async () => {
                await removeToken();
                navigation.reset({
                  index: 0,
                  routes: [{ name: "Login" }],
                });
              }}
            />
          </View>
        </View>
      </ScrollView>

      {/* Profile Image Modal */}
      {imageModalVisible && (
        <View style={styles.profileModalOverlay}>
          <TouchableOpacity
            style={styles.profileModalTouchable}
            activeOpacity={1}
            onPress={() => setImageModalVisible(false)}
          />
          <View style={styles.profileModalImageContainer}>
            <Image
              source={userData.picture?.uri ? userData.picture : profileImage}
              style={styles.profileModalImage}
              resizeMode="cover"
            />
            <View style={styles.profileEditIconWrapper}>
              <TouchableOpacity
                onPress={handleProfileImageEdit}
                activeOpacity={0.7}
              >
                <View style={styles.profileEditIconCircle}>
                  <Ionicons name="pencil-outline" size={22} color="#181818" />
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

    </View>
  );
};

// Menu item component for account options
const MenuItem = ({
  icon,
  label,
  iconBg = "#F5F5F5",
  badge,
  showDivider,
  onPress,
}: any) => (
  <View>
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
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
        color="#000"
        style={{ marginLeft: "auto" }}
      />
    </TouchableOpacity>
    {showDivider && <View style={styles.menuDivider} />}
  </View>
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
      <Stack.Screen name="EventCreatedPage" component={EventCreatedPage} />
      <Stack.Screen name="FavouriteScreen" component={FavouriteScreen} />
      <Stack.Screen name="Help&Support" component={HelpAndSupportScreen} />
      <Stack.Screen name="AttendanceHistory" component={AttendanceHistory} />
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
    // This ensures the scroll view goes under the content above the navbar// Adjust this value to be a little more than the navbar height
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
    marginTop: 24,
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
  menuGroup: {
    width: "92%",
    backgroundColor: "#fff",
    borderRadius: 16,
    marginTop: 16,
    marginBottom: 0,
    alignSelf: "center",
    paddingVertical: 2,
    // shadow for iOS/Android
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: "transparent",
    borderRadius: 0,
  },
  menuDivider: {
    height: 1,
    backgroundColor: "#F5E9FF",
    marginLeft: 60,
    marginRight: 0,
  },
  menuIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
    backgroundColor: "#F5F5F5",
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
  profileModalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#f5f5f5ee",
    zIndex: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  profileModalTouchable: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: "100%",
    height: "100%",
  },
  profileModalImageContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  profileModalImage: {
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: "#eee",
  },
  profileEditIconWrapper: {
    position: "absolute",
    bottom: 24,
    right: 24,
  },
  profileEditIconCircle: {
    backgroundColor: "#fff",
    borderRadius: 24,
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
});
