import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DashedDropzone from "../components/DashedDropzone";
import * as ImagePicker from "expo-image-picker";
import { getCountryCode } from "../utils/countryCodes";
import CountryFlag from "react-native-country-flag";

export default function ProfileScreen() {
  const [fullName, setFullName] = useState("James koght");
  const [displayName, setDisplayName] = useState("James");
  const [email, setEmail] = useState("jkoght2@gmail.com");
  const [phone, setPhone] = useState("+233 (318) 345 9987");
  const [location, setLocation] = useState("403 Main Street, LA");
  const [activeTab, setActiveTab] = useState("Account");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalTranslateY] = useState(new Animated.Value(300));
  const [navbarTranslateY] = useState(new Animated.Value(0));
  const [overlayOpacity] = useState(new Animated.Value(0));
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState(
    "https://randomuser.me/api/portraits/men/1.jpg"
  );

  const navSlideAnim = useRef(new Animated.Value(100)).current;

  useEffect(() => {
    Animated.timing(navSlideAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);
  const openModal = () => {
    setIsModalVisible(true);
    Animated.parallel([
      Animated.timing(modalTranslateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(navbarTranslateY, {
        toValue: 100,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(overlayOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const closeModal = () => {
    Animated.parallel([
      Animated.timing(modalTranslateY, {
        toValue: 300,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(navbarTranslateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(overlayOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => setIsModalVisible(false));
  };

  const [eventImage, setEventImage] =
    useState<ImagePicker.ImagePickerAsset | null>(null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 1,
    });

    if (!result.canceled) {
      setEventImage(result.assets[0]);
    }
  };

  // Get country code for flag
  const countryCode = getCountryCode(phone);

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        style={styles.scrollView}
      >
        <Text style={styles.title}>Profile</Text>
        <View style={styles.avatarContainer}>
          <Image source={{ uri: profileImage }} style={styles.avatar} />
          <TouchableOpacity style={styles.editIcon} onPress={openModal}>
            <Ionicons name="pencil" size={16} color="#7F00FF" />
          </TouchableOpacity>
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={styles.input}
            value={fullName}
            onChangeText={setFullName}
            editable={isEditing}
          />
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Display Name</Text>
          <TextInput
            style={styles.input}
            value={displayName}
            onChangeText={setDisplayName}
            editable={isEditing}
          />
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Email Address</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            editable={isEditing}
            keyboardType="email-address"
          />
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Phone Number</Text>
          <View style={styles.phoneRow}>
            <CountryFlag isoCode={countryCode} size={24} />
            <TextInput
              style={styles.phoneInput}
              value={phone}
              onChangeText={setPhone}
              editable={isEditing}
              keyboardType="phone-pad"
            />
          </View>
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Location</Text>
          <TextInput
            style={styles.input}
            value={location}
            onChangeText={setLocation}
            editable={isEditing}
          />
        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={() => setIsEditing((prev) => !prev)}
        >
          <Text style={styles.buttonText}>
            {isEditing ? "Save Profile" : "Update Profile"}
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Dim Overlay when modal is visible */}
      {isModalVisible && (
        <Animated.View
          style={[
            {
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0,0,0,0.5)",
              zIndex: 1,
              opacity: overlayOpacity,
            },
          ]}
        >
          {/* Touchable area to close modal when tapping outside */}
          <TouchableOpacity
            style={{ flex: 1 }}
            activeOpacity={1}
            onPress={closeModal}
          />
        </Animated.View>
      )}

      {/* Animated Modal for Editing Profile Picture */}
      {isModalVisible && (
        <Animated.View
          style={[
            styles.modalContainer,
            { transform: [{ translateY: modalTranslateY }], zIndex: 2 },
          ]}
        >
          <View style={styles.modalContent}>
            <View style={styles.card}>
              <Text style={styles.cardHeader}>Upload Profile Image</Text>
              <DashedDropzone onPress={pickImage} />
              <View style={styles.fileInfoRow}>
                <Text style={{ color: "#555", flex: 1 }}>
                  {eventImage
                    ? eventImage.fileName || eventImage.uri
                    : "No selected File"}
                </Text>
                {eventImage && (
                  <TouchableOpacity onPress={() => setEventImage(null)}>
                    <Ionicons name="trash-outline" size={20} color="#d11a2a" />
                  </TouchableOpacity>
                )}
              </View>
            </View>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                if (eventImage && eventImage.uri) {
                  setProfileImage(eventImage.uri);
                }
                closeModal();
              }}
            >
              <Text style={styles.modalButtonText}>Done {">>"}</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}

      {/* Animated BottomNavBar (handled by global Navbar now) */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollView: {
    flex: 1,
    marginBottom: 80,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 120,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 16,
    marginTop: 24,
    color: "#000",
  },
  avatarContainer: {
    alignItems: "center",
    marginBottom: 24,
    position: "relative",
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 4,
    borderColor: "#7F00FF",
  },
  editIcon: {
    position: "absolute",
    bottom: 0,
    right: 120,
    backgroundColor: "#fff",
    width: 30,
    height: 26,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#7F00FF",
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: "#6B6B6B",
    marginBottom: 4,
  },
  input: {
    backgroundColor: "#EFEFEF",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    color: "#222",
  },
  phoneRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EFEFEF",
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  flag: {
    width: 19,
    height: 20,
    borderRadius: 4,
    marginRight: 10,
  },
  phoneInput: {
    flex: 1,
    fontSize: 16,
    color: "#222",
    paddingVertical: 10,
  },
  button: {
    backgroundColor: "#7F00FF",
    borderRadius: 30,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 16,
    alignSelf: "center",
    width: "60%",
  },
  buttonText: {
    color: "#FFF",
    fontWeight: "600",
    fontSize: 16,
  },
  modalContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "55%", // Covers half the screen
    backgroundColor: "#fff",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  modalContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 0,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#7F00FF",
    marginBottom: 16,
  },
  modalButton: {
    backgroundColor: "#7F00FF",
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 32,
    marginTop: 0,
  },
  modalButtonText: {
    color: "#FFF",
    fontWeight: "600",
    fontSize: 16,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    width: "90%",
    alignSelf: "center",
  },
  cardHeader: {
    fontSize: 16,
    fontWeight: "600",
    color: "#7F00FF",
    borderBottomWidth: 1,
    borderBottomColor: "#7F00FF",
    paddingBottom: 6,
    marginBottom: 14,
  },
  fileInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    backgroundColor: "#fff",
    minHeight: 44,
  },
});
