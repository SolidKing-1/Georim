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
  Platform,
<<<<<<< HEAD
  Keyboard,
=======
  KeyboardAvoidingView,
>>>>>>> c23fa7f3812817b3c53aa48aa9c7010980302b0d
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import CountryFlag from "react-native-country-flag";
import { COUNTRY_LIST } from "../utils/countryList";
<<<<<<< HEAD
import BannerImage from "../assets/authScreens/signUp.jpg";
=======
import Logo from "../assets/Authentication.jpg";
import Company from "../assets/Company_icon.png";
>>>>>>> c23fa7f3812817b3c53aa48aa9c7010980302b0d
import Icon from "react-native-vector-icons/Ionicons";
import GoogleIcon from "../assets/Google.png";
import GlassButton from "../components/GlassButton";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";
import { useGoogleAuth } from "../components/useGoogleAuth";
import Constants from "expo-constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CodeVerificationModal from "../components/CodeVerificationModal"; // <-- Import your modal

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
  const [showCodeModal, setShowCodeModal] = useState(false); // <-- Add this state
  const BACKEND_URL = Constants.expoConfig?.extra?.BACKEND_URL;

  const { promptAsync, request } = useGoogleAuth((data) => {
    // Handle signup success, e.g., save token, navigate, etc.
    console.log("Google signup success:", data);
    navigation.navigate("Dashboard"); // or wherever you want
  });

  const handleSignUp = async () => {
    try {
      const fullPhone = selectedCountry.code + phone.replace(/^0+/, "");
      console.log("HERE");
      // 1. Request code only, do not create user yet
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
      setShowCodeModal(true);
    } catch (err) {
      alert("Network error. Please try again.");
    }
  };

  const filteredCountries = COUNTRY_LIST.filter((item) =>
    item.name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      keyboardShouldPersistTaps="handled"
      onScrollBeginDrag={() => Keyboard.dismiss()}
    >
      <View style={styles.innerContainer}>
        {/* Header */}
        <Text style={styles.header}>Sign Up</Text>

<<<<<<< HEAD
        {/* Banner Image */}
        <View style={styles.bannerContainer}>
          <Image
            source={BannerImage}
            style={styles.bannerImage}
            resizeMode="cover"
=======
        {/* Top Image Box */}
        <View style={styles.imageContainer}>
          <Text style={styles.header}>Sign Up</Text>
          <Image
            source={{
              uri: "https://res.cloudinary.com/dcw9wgjq5/image/upload/Authentication_ympwp3.jpg",
            }}
            style={styles.image}
            resizeMode="contain"
>>>>>>> c23fa7f3812817b3c53aa48aa9c7010980302b0d
          />
        </View>

        {/* Form Section */}
        <View style={styles.formContainer}>
          {/* First & Last Name Row */}
          <View style={styles.nameRow}>
            <View style={{ flex: 1, marginRight: 8 }}>
              <Text style={styles.label}>First Name</Text>
              <TextInput
                placeholder="John"
                placeholderTextColor="#6B7280"
                style={styles.input}
                value={first}
                onChangeText={setFirst}
              />
            </View>
            <View style={{ flex: 1, marginLeft: 8 }}>
              <Text style={styles.label}>Last Name</Text>
              <TextInput
                placeholder="Kwame"
                placeholderTextColor="#6B7280"
                style={styles.input}
                value={last}
                onChangeText={setLast}
              />
            </View>
          </View>

          {/* Email */}
          <Text style={[styles.label, { marginTop: 10 }]}>Email</Text>
          <TextInput
            placeholder="username@gmail.com"
            placeholderTextColor="#6B7280"
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          {/* Phone */}
          <Text style={[styles.label, { marginTop: 10 }]}>Phone Number</Text>
          <View style={styles.phoneRow}>
            <TouchableOpacity
              style={styles.flagPicker}
              onPress={() => setShowCountryModal(true)}
            >
              <CountryFlag isoCode={selectedCountry.iso} size={22} />
              <Text
                style={{
                  marginLeft: 6,
                  fontWeight: "600",
                  color: "#FFFFFF",
                  fontFamily: "Hero",
                }}
              >
                {selectedCountry.code}
              </Text>
              <Icon
                name="chevron-down"
                size={16}
                color="#9CA3AF"
                style={{ marginLeft: 2 }}
              />
            </TouchableOpacity>
            <TextInput
              placeholder="+1 912-345-3322"
              placeholderTextColor="#6B7280"
              style={[styles.input, { flex: 1, marginLeft: 8 }]}
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
            />
          </View>

          {/* Country Picker Modal */}
          <Modal visible={showCountryModal} animationType="slide">
            <View style={{ flex: 1, backgroundColor: "#05031B" }}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  padding: 16,
                  paddingTop: 62,
                }}
              >
                <Text
                  style={{
                    fontWeight: "bold",
                    fontSize: 18,
                    flex: 1,
                    color: "#FFFFFF",
                    fontFamily: "Hero",
                  }}
                >
                  Select Country
                </Text>
                <TouchableOpacity onPress={() => setShowCountryModal(false)}>
                  <Icon name="close" size={24} color="#932FF8" />
                </TouchableOpacity>
              </View>
              <View style={{ paddingHorizontal: 16, marginBottom: 10 }}>
                <TextInput
                  placeholder="Search country..."
                  placeholderTextColor="#6B7280"
                  style={{
                    borderWidth: 1,
                    borderColor: "#374151",
                    borderRadius: 10,
                    paddingVertical: 10,
                    paddingHorizontal: 14,
                    backgroundColor: "#1F2937",
                    color: "#FFFFFF",
                    marginBottom: 10,
                    fontFamily: "Hero",
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
                      borderBottomColor: "#374151",
                    }}
                    onPress={() => {
                      setSelectedCountry(item);
                      setShowCountryModal(false);
                      setSearchText("");
                    }}
                  >
                    <CountryFlag isoCode={item.iso} size={22} />
                    <Text
                      style={{
                        marginLeft: 12,
                        fontSize: 16,
                        flex: 1,
                        color: "#FFFFFF",
                        fontFamily: "Hero",
                      }}
                    >
                      {item.name}
                    </Text>
                    <Text
                      style={{
                        fontWeight: "600",
                        fontSize: 16,
                        color: "#9CA3AF",
                        fontFamily: "Hero",
                      }}
                    >
                      {item.code}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          </Modal>

          {/* Password */}
          <Text style={[styles.label, { marginTop: 10 }]}>Password</Text>
          <View style={styles.passwordWrapper}>
            <TextInput
              placeholder="Password"
              placeholderTextColor="#6B7280"
              style={[styles.input, { flex: 1, borderWidth: 0 }]}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Icon
                name={showPassword ? "eye-off-outline" : "eye-outline"}
                size={20}
                color="#9CA3AF"
                style={{ paddingHorizontal: 12 }}
              />
            </TouchableOpacity>
          </View>

          {/* Forgot Password */}
          <TouchableOpacity
            style={styles.forgotPassword}
            onPress={() => navigation.navigate("ForgotPassword")}
          >
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>

          {/* Sign Up Button */}
          <GlassButton style={styles.glassButtonWrapper} borderRadius={25}>
            <TouchableOpacity onPress={handleSignUp}>
              <LinearGradient
                colors={["#6E23BA", "#282691"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.signUpButton}
              >
                <Text style={styles.signUpButtonText}>Sign Up</Text>
              </LinearGradient>
            </TouchableOpacity>
          </GlassButton>

          {/* Divider */}
          <Text style={styles.orText}>Or Continue With</Text>

          {/* Google Button */}
          <GlassButton
            style={styles.googleGlassWrapper}
            borderRadius={50}
            isCircular={true}
          >
            <TouchableOpacity
              style={styles.googleButton}
              disabled={!request}
              onPress={() => promptAsync()}
            >
              <Image source={GoogleIcon} style={styles.googleLogo} />
            </TouchableOpacity>
          </GlassButton>

          {/* Login Redirect */}
          <TouchableOpacity
            onPress={() => navigation.navigate("Login")}
            style={styles.loginContainer}
          >
            <Text style={styles.loginText}>
              Already have an account?{" "}
              <Text style={styles.link}>Login here</Text>
            </Text>
          </TouchableOpacity>
        </View>
<<<<<<< HEAD
      </View>
    </ScrollView>
=======
      </ScrollView>
      {/* Code Verification Modal */}
      <CodeVerificationModal
        visible={showCodeModal}
        email={email}
        onClose={() => setShowCodeModal(false)}
        onSuccess={() => {
          setShowCodeModal(false);
          navigation.replace("Login");
        }}
      />
    </KeyboardAvoidingView>
>>>>>>> c23fa7f3812817b3c53aa48aa9c7010980302b0d
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#05031B",
  },
  scrollContent: {
    flexGrow: 1,
  },
  innerContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 45,
  },
  header: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FFFFFF",
    fontFamily: "Hero",
    marginBottom: 16,
  },
  bannerContainer: {
    width: "100%",
    height: 160,
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 20,
  },
  bannerImage: {
    width: "100%",
    height: "100%",
  },
  formContainer: {
    flex: 1,
  },
  nameRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#FFFFFF",
    marginBottom: 6,
    fontFamily: "Hero",
  },
  input: {
    borderWidth: 1,
    borderColor: "#374151",
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#1F2937",
    color: "#FFFFFF",
    fontSize: 14,
    fontFamily: "Hero",
  },
  phoneRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  flagPicker: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#374151",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 12,
    backgroundColor: "#1F2937",
  },
  passwordWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#374151",
    borderRadius: 8,
    backgroundColor: "#1F2937",
  },
  forgotPassword: {
    alignItems: "flex-end",
    marginTop: 4,
    marginBottom: 12,
  },
  forgotPasswordText: {
    fontSize: 13,
    color: "#932FF8",
    fontWeight: "500",
    fontFamily: "Hero",
  },
  glassButtonWrapper: {
    marginBottom: 12,
  },
  signUpButton: {
    padding: 14,
    borderRadius: 25,
  },
  signUpButtonText: {
    color: "#FFFFFF",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
    fontFamily: "Hero",
  },
  orText: {
    textAlign: "center",
    marginVertical: 10,
    color: "#9CA3AF",
    fontSize: 14,
    fontFamily: "Hero",
  },
  googleGlassWrapper: {
    alignSelf: "center",
  },
  googleButton: {
    justifyContent: "center",
    alignItems: "center",
    padding: 12,
    borderRadius: 50,
    backgroundColor: "#8F8E9B",
    width: 56,
    height: 56,
  },
  googleLogo: {
    width: 28,
    height: 28,
    resizeMode: "contain",
  },
  loginContainer: {
    marginTop: 12,
    marginBottom: 24,
  },
  loginText: {
    textAlign: "center",
    color: "#9CA3AF",
    fontSize: 14,
    fontFamily: "Hero",
  },
  link: {
    color: "#932FF8",
    fontWeight: "600",
    fontFamily: "Hero",
  },
});
