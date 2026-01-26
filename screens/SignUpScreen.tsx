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
  Keyboard,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import CountryFlag from "react-native-country-flag";
import { COUNTRY_LIST } from "../utils/countryList";
import BannerImage from "../assets/authScreens/signUp.jpg";
import Icon from "react-native-vector-icons/Ionicons";
import Svg, { Path } from "react-native-svg";
import GlassButton from "../components/GlassButton";
import CircleEffect from "../components/GlassEffects/circleGlassEffect.png";
import PrimaryButton from "../components/PrimaryButton";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";
import { useGoogleAuth } from "../components/useGoogleAuth";
import Constants from "expo-constants";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import CodeVerificationModal from "../components/CodeVerificationModal";
import { setToken } from "../utils/auth";
import { setUserData } from "../utils/user";
import { KeyboardAvoidingView } from "react-native";


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
  // This is the endpoint fot the BACKEND URL. 
  const BACKEND_URL = Constants.expoConfig?.extra?.BACKEND_URL;
  // This is the endpoint for user registeration. 
  const ENDPOINT = "/api/v1/auth/register";
  fetch(`${BACKEND_URL}${ENDPOINT}`);


  const { promptAsync, request } = useGoogleAuth((data) => {
    // Handle signup success, e.g., save token, navigate, etc.
    console.log("Google signup success:", data);
    navigation.navigate("WelcomeNew"); 
  });

  const handleSignUp = async () => {
    try {
      const fullPhone = selectedCountry.code + phone.replace(/^0+/, "");
      const response = await fetch(`${BACKEND_URL}${ENDPOINT}`, {
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

      // Backend returns { user, token } - save both after registration
      if (data.user && data.token) {
        await setToken(data.token);

        const userData = {
          id: data.user.id,
          email: data.user.email,
          first: data.user.first,
          last: data.user.last,
          phone: data.user.phone,
          avatarUrl: data.user.avatarUrl,
        };
        await setUserData(userData);

        // Navigate to Dashboard after successful registration
        navigation.navigate("WelcomeNew");
        return;
      }

      // Fallback if response structure is unexpected
      alert("Registration successful! Please log in.");
      navigation.navigate("Login");
    } catch (err) {
      alert("Network error. Please try again.");
      console.error("Network error:", err);
    }
  };

  const filteredCountries = COUNTRY_LIST.filter((item) =>
    item.name.toLowerCase().includes(searchText.toLowerCase()),
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#05031B" }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.innerContainer}>
          {/* Header */}
          <Text style={styles.header}>Sign Up</Text>

          {/* Banner Image */}
          <View style={styles.bannerContainer}>
            <Image
              source={BannerImage}
              style={styles.bannerImage}
              resizeMode="cover"
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

          {/* Sign Up Button */}
          <PrimaryButton title="Sign Up" onPress={handleSignUp} />

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

          {/* Google Button */}
          <View style={styles.googleWrapper}>
            <View style={styles.circleBg} pointerEvents="none" />
            <Image
              source={CircleEffect}
              style={styles.circleEffect}
            />
            <TouchableOpacity
              onPress={() => navigation.navigate("Login")}
              style={styles.loginContainer}
            >
              <Svg width={28} height={28} viewBox="0 0 22 22" fill="none">
                <Path
                  d="M21.6338 8.78383H20.7539V8.7385H10.9231V13.1077H17.0963C16.1957 15.6512 13.7757 17.477 10.9231 17.477C7.30374 17.477 4.36925 14.5425 4.36925 10.9231C4.36925 7.30374 7.30374 4.36925 10.9231 4.36925C12.5938 4.36925 14.1138 4.99951 15.2711 6.02902L18.3607 2.93941C16.4098 1.12126 13.8003 0 10.9231 0C4.89083 0 0 4.89083 0 10.9231C0 16.9554 4.89083 21.8462 10.9231 21.8462C16.9554 21.8462 21.8462 16.9554 21.8462 10.9231C21.8462 10.1907 21.7709 9.47581 21.6338 8.78383Z"
                  fill="#7F00FF"
                />
                <Path
                  d="M1.25916 5.83895L4.84795 8.47088C5.81901 6.0667 8.17076 4.36925 10.9228 4.36925C12.5935 4.36925 14.1135 4.99951 15.2708 6.02902L18.3604 2.93941C16.4095 1.12126 13.8 0 10.9228 0C6.72727 0 3.08878 2.36868 1.25916 5.83895Z"
                  fill="#FF3D00"
                />
                <Path
                  d="M10.9233 21.8466C13.7447 21.8466 16.3084 20.7669 18.2467 19.011L14.866 16.1502C13.7325 17.0123 12.3474 17.4785 10.9233 17.4774C8.08218 17.4774 5.66981 15.6658 4.761 13.1376L1.19897 15.8821C3.00675 19.4195 6.67801 21.8466 10.9233 21.8466Z"
                  fill="#4CAF50"
                />
                <Path
                  d="M21.6343 8.78373H20.7544V8.7384H10.9236V13.1077H17.0968C16.666 14.3182 15.89 15.3759 14.8646 16.1503L14.8663 16.1492L18.247 19.01C18.0078 19.2273 21.8467 16.3846 21.8467 10.923C21.8467 10.1906 21.7713 9.47571 21.6343 8.78373Z"
                  fill="#1976D2"
                />
              </Svg>
            </TouchableOpacity>
          </View>

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
      </ScrollView>
    </KeyboardAvoidingView>
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
    fontWeight: "300",
    color: "#F6F8F9",
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
    borderWidth: 0,
    borderColor: "transparent",
  },
  signUpButton: {
    padding: 16,
    borderRadius: 25,
    position: "relative",
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  signUpButtonText: {
    color: "#FFFFFF",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
    fontFamily: "Hero",
    zIndex: 3,
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
  googleWrapper: {
    alignSelf: "center",
    backgroundColor: "transparent",
    borderWidth: 0,
    borderColor: "transparent",
    position: "relative",
    width: 60,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
  },
  googleButton: {
    justifyContent: "center",
    alignItems: "center",
    padding: 12,
    borderRadius: 50,
    backgroundColor: "transparent",
    width: 56,
    height: 56,
    zIndex: 3,
  },
  circleEffect: {
    position: "absolute",
    width: 60,
    height: 60,
    resizeMode: "contain",
    top: 0,
    left: 0,
    zIndex: 2,
  },
  circleBg: {
    position: "absolute",
    width: 60,
    height: 60,
    borderRadius: 30,
    top: 0,
    left: 0,
    overflow: "hidden",
    zIndex: 0,
    backgroundColor: "#797787",
  },
  gradientOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: undefined,
    height: undefined,
    alignSelf: "stretch",
    resizeMode: "cover",
    zIndex: 1,
    opacity: 1,
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
