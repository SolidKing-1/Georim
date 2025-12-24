import React, { useEffect, useState } from "react";
import {
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  Platform,
  Keyboard,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import BannerImage from "../assets/authScreens/party-image.jpg";
import Icon from "react-native-vector-icons/Ionicons";
import GoogleIcon from "../assets/Google.png";
import GlassButton from "../components/GlassButton";
import { useGoogleAuth } from "../components/useGoogleAuth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as LocalAuthentication from "expo-local-authentication";
import { getToken, setBiometricEnabled } from "../utils/auth";
import { isBiometricEnabled } from "../utils/auth";
import { promptBiometric } from "../utils/biometric";

import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";

import Constants from "expo-constants";
import { setToken, removeToken } from "../utils/auth"; // Use your helper
import { setUserData } from "../utils/user";

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "Login">;

export default function LoginScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [biometricAvailable, setBiometricAvailable] = useState(false);

  const BACKEND_URL = Constants.expoConfig?.extra?.BACKEND_URL;
  const USER_KEY = "user_data";

  useEffect(() => {
    (async () => {
      const enabled = await isBiometricEnabled();
      setBiometricAvailable(enabled);
    })();
  }, []);

  // Handle Google OAuth
  const { promptAsync, request } = useGoogleAuth((data) => {
    // Handle login success, e.g., save token, navigate, etc.
    console.log("Google login success:", data);
    navigation.navigate("Dashboard"); // or wherever you want
  });

  const handleLogin = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/auth/sign-in`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        alert(data?.data?.message || "Login failed");
        return;
      }

      // Save JWT token and user Data
      if (data.data && data.data.token) {
        await setToken(data.data.token);

        // Prepare user data for AsyncStorage;
        let userData = {
          email: data.data.email,
          name: data.data.name,
          isGoogleUser: data.data.isGoogleUser || false,
          picture: { uri: data.data.picture || null },
        };
        // Save user data to AsyncStorage
        await setUserData(userData);

        // Prompt for biometrics/Face ID
        const hasHardware = await LocalAuthentication.hasHardwareAsync();
        const isEnrolled = await LocalAuthentication.isEnrolledAsync();
        if (hasHardware && isEnrolled) {
          Alert.alert(
            "Enable Face ID or Biometrics?",
            "Would you like to use Face ID or biometrics for future logins?",
            [
              {
                text: "No",
                style: "cancel",
                onPress: async () => {
                  await setBiometricEnabled(false);
                  navigation.navigate("Dashboard");
                },
              },
              {
                text: "Yes",
                onPress: async () => {
                  await setBiometricEnabled(true);
                  navigation.navigate("Dashboard");
                },
              },
            ]
          );
          return;
        }
      }

      alert("Login successful!");
      navigation.navigate("Dashboard");
    } catch (err) {
      alert("Network error. Please try again.");
      console.error("Network error:", err);
    }
  };

  const handleBiometricLogin = async () => {
    // Get User Data from AsyncStorage;
    let userData = await AsyncStorage.getItem(USER_KEY);

    // If the user lacks the userData we should alert them
    if (!userData) {
      Alert.alert("You are not logged in. \n Please log in first.");
      return;
    }

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: "Authenticate to continue",
      fallbackLabel: "Use Passcode",
      disableDeviceFallback: false,
    });
    if (result.success) {
      let response = await fetch(`${BACKEND_URL}/auth/biometric-auth`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: JSON.parse(userData).email,
        }),
      });

      if (!response.ok) {
        // Show backend error message if available
        let errorData;
        try {
          errorData = await response.json();
        } catch {
          errorData = {};
        }
        Alert.alert(
          errorData?.data?.message || "We Had Issues Logging You In."
        );
        return;
      }
      const data = await response.json();
      await setToken(data.data.token);
      let userDataObj = {
        email: data.data.email,
        name: data.data.name,
        isGoogleUser: data.data.isGoogleUser || false,
        picture: { uri: data.data.picture || null },
      };
      await setUserData(userDataObj);
      navigation.navigate("Dashboard");
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      keyboardShouldPersistTaps="handled"
      onScrollBeginDrag={() => Keyboard.dismiss()}
    >
      <View style={styles.innerContainer}>
        {/* Header */}
        <Text style={styles.header}>Login</Text>

        {/* Banner Image */}
        <View style={styles.bannerContainer}>
          <Image
            source={BannerImage}
            style={styles.bannerImage}
            resizeMode="cover"
          />
        </View>

        {/* Input Section */}
        <View style={styles.formContainer}>
          <Text style={styles.label}>Email</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              placeholder="username@gmail.com"
              placeholderTextColor="#6B7280"
              style={[
                styles.input,
                { paddingRight: biometricAvailable ? 40 : 12 },
              ]}
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
<<<<<<< HEAD
            {biometricAvailable && (
              <TouchableOpacity
                onPress={handleBiometricLogin}
                style={styles.biometricIcon}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Icon name="finger-print" size={22} color="#932FF8" />
              </TouchableOpacity>
            )}
=======
          </View>
          {/* Top Image Box */}
          <View style={styles.imageContainer}>
            <Text style={styles.header}>Login</Text>
            <Image
              source={{
                uri: "https://res.cloudinary.com/dcw9wgjq5/image/upload/Authentication_ympwp3.jpg",
              }}
              style={styles.image}
              resizeMode="contain"
            />
>>>>>>> c23fa7f3812817b3c53aa48aa9c7010980302b0d
          </View>

          <Text style={[styles.label, { marginTop: 20 }]}>Password</Text>
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

<<<<<<< HEAD
          {/* Forgot Password */}
          <TouchableOpacity
            style={styles.forgotPassword}
            onPress={() => navigation.navigate("ForgotPassword")}
          >
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>
=======
            {/* Remember Me and Forgot Password Section */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginTop: 10,
                marginBottom: 10,
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={{ color: "#333", fontSize: 15, marginRight: 6 }}>
                  Remember me?
                </Text>
                <Switch
                  value={rememberMe}
                  onValueChange={setRememberMe}
                  trackColor={{ false: "#ccc", true: "#4f46e5" }}
                  thumbColor={rememberMe ? "#fff" : "#fff"}
                />
              </View>
              <TouchableOpacity
                style={styles.forgotPassword}
                onPress={() => navigation.navigate("ForgotPassword")}
              >
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </TouchableOpacity>
            </View>
>>>>>>> c23fa7f3812817b3c53aa48aa9c7010980302b0d

          {/* Sign In Button */}
          <GlassButton style={styles.glassButtonWrapper} borderRadius={25}>
            <TouchableOpacity onPress={handleLogin}>
              <LinearGradient
                colors={["#6E23BA", "#282691"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.signInButton}
              >
                <Text style={styles.signInButtonText}>Sign In</Text>
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

          {/* Sign Up Link */}
          <TouchableOpacity
            onPress={() => navigation.navigate("SignUp")}
            style={styles.signupContainer}
          >
            <Text style={styles.signupText}>
              Don't have an account yet?{" "}
              <Text style={styles.link}>Register for free</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
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
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  header: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FFFFFF",
    fontFamily: "Hero",
    marginBottom: 24,
  },
  bannerContainer: {
    width: "100%",
    height: 180,
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 32,
  },
  bannerImage: {
    width: "100%",
    height: "100%",
  },
  formContainer: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#FFFFFF",
    marginBottom: 8,
    fontFamily: "Hero",
  },
  inputWrapper: {
    position: "relative",
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#374151",
    padding: 14,
    borderRadius: 8,
    backgroundColor: "#1F2937",
    color: "#FFFFFF",
    fontSize: 15,
    fontFamily: "Hero",
  },
  biometricIcon: {
    position: "absolute",
    right: 12,
    top: 0,
    bottom: 0,
    justifyContent: "center",
    height: "100%",
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
    marginTop: 8,
    marginBottom: 24,
  },
  forgotPasswordText: {
    fontSize: 13,
    color: "#932FF8",
    fontWeight: "500",
    fontFamily: "Hero",
  },
  glassButtonWrapper: {
    marginBottom: 20,
  },
  signInButton: {
    padding: 16,
    borderRadius: 25,
  },
  signInButtonText: {
    color: "#FFFFFF",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
    fontFamily: "Hero",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  orText: {
    textAlign: "center",
    marginVertical: 16,
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
  signupContainer: {
    marginTop: 24,
    marginBottom: 40,
  },
  signupText: {
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
