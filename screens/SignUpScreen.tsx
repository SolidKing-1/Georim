import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Modal,
  FlatList,
} from "react-native";
import CountryFlag from "react-native-country-flag";
import { COUNTRY_LIST } from "../utils/countryList"; // <-- Only this import needed
import Logo from "../assets/Authentication.jpg";
import Company from "../assets/Company_icon.png";
import Icon from "react-native-vector-icons/Ionicons";
import GoogleIcon from "../assets/Google.png";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";
import { Platform, KeyboardAvoidingView } from "react-native";
import { useGoogleAuth } from "../components/useGoogleAuth";
import Constants from "expo-constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
// Build a country list for the picker

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "SignUp">;

export default function SignUpScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [showPassword, setShowPassword] = useState(false);
  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [selectedCountry, setSelectedCountry] = useState({
    code: "+1",
    iso: "us",
  });
  const [showCountryModal, setShowCountryModal] = useState(false);
  const [searchText, setSearchText] = useState("");
  const BACKEND_URL = Constants.expoConfig?.extra?.BACKEND_URL;

  const { promptAsync, request } = useGoogleAuth((data) => {
    // Handle signup success, e.g., save token, navigate, etc.
    console.log("Google signup success:", data);
    navigation.navigate("Dashboard"); // or wherever you want
  });

  const handleSignUp = async () => {
    try {
      const fullPhone = selectedCountry.code + phone.replace(/^0+/, "");

      const response = await fetch(`${BACKEND_URL}/auth/sign-up`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first,
          last,
          email,
          phone: fullPhone,
          password,
        }),
      });

      const data = await response.json();
      

      if (!response.ok) {
        alert(data.message || "Sign up failed");
        return;
      }

      // Save JWT token
      if (data.token) {
        await AsyncStorage.setItem("jwt", data.token);
      }

      alert("Sign up successful!");
      navigation.navigate("Login");
    } catch (err) {
      alert("Network error. Please try again.");
      console.error("Network error:", err);
    }
  };

  const filteredCountries = COUNTRY_LIST.filter((item) =>
    item.name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0} // tweak if header overlaps
    >
      <ScrollView style={styles.container}>
        <View style={styles.CompanyLogo}>
          <Image source={Company} style={styles.cimage} resizeMode="contain" />
        </View>

        {/* Top Image Box */}
        <View style={styles.imageContainer}>
          <Text style={styles.header}>Sign Up</Text>
          <Image
            source={{
              uri: "https://res.cloudinary.com/dcw9wgjq5/image/upload/Authentication_ympwp3.jpg",
            }}
            style={styles.image}
            resizeMode="contain"
          />
        </View>

        {/* Form Section */}
        <View style={styles.formContainer}>
          {/* First & Last Name Row */}
          <View style={styles.nameRow}>
            <View style={{ flex: 1, marginRight: 8 }}>
              <Text style={styles.label}>First Name</Text>
              <TextInput
                placeholder="First Name"
                placeholderTextColor="#999"
                style={styles.input}
                value={first}
                onChangeText={setFirst}
              />
            </View>
            <View style={{ flex: 1, marginLeft: 8 }}>
              <Text style={styles.label}>Last Name</Text>
              <TextInput
                placeholder="Surname"
                placeholderTextColor="#999"
                style={styles.input}
                value={last}
                onChangeText={setLast}
              />
            </View>
          </View>

          {/* Email */}
          <Text style={[styles.label, { marginTop: 20 }]}>Email</Text>
          <TextInput
            placeholder="username@gmail.com"
            placeholderTextColor="#999"
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          {/* Phone */}
          <Text style={[styles.label, { marginTop: 20 }]}>Phone Number</Text>
          <View style={styles.phoneRow}>
            <TouchableOpacity
              style={styles.flagPicker}
              onPress={() => setShowCountryModal(true)}
            >
              <CountryFlag isoCode={selectedCountry.iso} size={22} />
              <Text style={{ marginLeft: 6, fontWeight: "600" }}>
                {selectedCountry.code}
              </Text>
              <Icon
                name="chevron-down"
                size={16}
                color="#555"
                style={{ marginLeft: 2 }}
              />
            </TouchableOpacity>
            <TextInput
              placeholder="(---) --- ---"
              placeholderTextColor="#999"
              style={[styles.input, { flex: 1, marginLeft: 8 }]}
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
            />
          </View>

          {/* Country Picker Modal */}
          <Modal visible={showCountryModal} animationType="slide">
            <View style={{ flex: 1, backgroundColor: "#fff" }}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  padding: 16,
                  paddingTop: 62,
                }}
              >
                <Text style={{ fontWeight: "bold", fontSize: 18, flex: 1 }}>
                  Select Country
                </Text>
                <TouchableOpacity onPress={() => setShowCountryModal(false)}>
                  <Icon name="close" size={24} color="#4f46e5" />
                </TouchableOpacity>
              </View>
              <View style={{ paddingHorizontal: 16, marginBottom: 10 }}>
                <TextInput
                  placeholder="Search country..."
                  placeholderTextColor="#999"
                  style={{
                    borderWidth: 1,
                    borderColor: "#ccc",
                    borderRadius: 10,
                    paddingVertical: 10,
                    paddingHorizontal: 14,
                    backgroundColor: "#f9f9f9",
                    marginBottom: 10,
                  }}
                  value={searchText}
                  onChangeText={setSearchText}
                />
              </View>
              <FlatList
                data={filteredCountries}
                keyExtractor={(item) => item.code}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      padding: 14,
                      borderBottomWidth: 1,
                      borderBottomColor: "#eee",
                    }}
                    onPress={() => {
                      setSelectedCountry(item);
                      setShowCountryModal(false);
                      setSearchText("");
                    }}
                  >
                    <CountryFlag isoCode={item.iso} size={22} />
                    <Text style={{ marginLeft: 12, fontSize: 16, flex: 1 }}>
                      {item.name}
                    </Text>
                    <Text style={{ fontWeight: "600", fontSize: 16 }}>
                      {item.code}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          </Modal>

          {/* Password */}
          <Text style={[styles.label, { marginTop: 20 }]}>Password</Text>
          <View style={styles.passwordWrapper}>
            <TextInput
              placeholder="************"
              placeholderTextColor="#999"
              style={[styles.input, { flex: 1 }]}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Icon
                name={showPassword ? "eye-off" : "eye"}
                size={20}
                color="#555"
                style={{ paddingHorizontal: 10 }}
              />
            </TouchableOpacity>
          </View>

          {/* Sign Up Button */}
          <TouchableOpacity onPress={handleSignUp} style={styles.loginButton}>
            <Text style={styles.loginButtonText}>Sign Up</Text>
          </TouchableOpacity>

          {/* Divider */}
          <Text style={styles.orText}>OR</Text>

          {/* Google Button */}
          <TouchableOpacity
            style={styles.googleButton}
            disabled={!request}
            onPress={() => promptAsync()}
          >
            <Image source={GoogleIcon} style={styles.googleLogo} />
            <Text style={styles.googleButtonText}>Continue with Google</Text>
          </TouchableOpacity>

          {/* Login Redirect */}
          <TouchableOpacity
            onPress={() => navigation.navigate("Login")}
            style={{ marginTop: 20 }}
          >
            <Text style={styles.signupText}>
              Already have an account? <Text style={styles.link}>Login</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  nameRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  imageContainer: {
    paddingTop: 5,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  header: {
    position: "absolute",
    top: 0,
    left: 26,
    fontSize: 25,
    fontWeight: "bold",
    color: "#000",
    zIndex: 1,
  },
  image: {
    height: 195,
    width: "100%",
  },
  CompanyLogo: {
    alignItems: "center", // Center horizontally if needed
    justifyContent: "flex-start",
    marginTop: 45, // Adjust this value to move the logo down
  },
  cimage: {
    height: 40,
    width: "100%",
  },
  formContainer: {
    paddingHorizontal: 20,
    flex: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 11,
    borderRadius: 10,
    backgroundColor: "#7F00FF0D",
  },
  passwordWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    backgroundColor: "#f9f9f9",
  },
  forgotPassword: {
    alignItems: "flex-end",
    marginTop: 8,
  },
  forgotPasswordText: {
    fontSize: 12,
    color: "#4f46e5",
    fontWeight: "500",
  },
  loginButton: {
    backgroundColor: "#4f46e5",
    padding: 15,
    borderRadius: 10,
    marginTop: 22,
  },
  loginButtonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },
  orText: {
    textAlign: "center",
    marginVertical: 8,
    color: "#888",
  },
  googleButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    padding: 12,
    borderRadius: 10,
    borderColor: "#ccc",
    backgroundColor: "#fff",
  },
  googleLogo: {
    width: 20,
    height: 20,
    resizeMode: "contain",
  },

  googleButtonText: {
    marginLeft: 10,
    color: "#000",
    fontWeight: "500",
  },
  signupText: {
    textAlign: "center",
    color: "#555",
  },
  link: {
    color: "#4f46e5",
    fontWeight: "600",
  },
  phoneRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  flagPicker: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: "#f9f9f9",
  },
});
