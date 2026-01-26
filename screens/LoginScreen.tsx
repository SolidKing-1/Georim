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
import Svg, { Path } from "react-native-svg";
import CircleEffect from "../components/GlassEffects/circleGlassEffect.png";
import PrimaryButton from "../components/PrimaryButton";
import { useGoogleAuth } from "../components/useGoogleAuth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as LocalAuthentication from "expo-local-authentication";
import {
  getToken,
  setToken,
  removeToken,
  setBiometricEnabled,
  isBiometricEnabled,
} from "../utils/auth";
import { KeyboardAvoidingView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";
import Constants from "expo-constants"; 
import { setUserData } from "../utils/user";

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "Login">;

export default function LoginScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [biometricAvailable, setBiometricAvailable] = useState(false);

  const BACKEND_URL = Constants.expoConfig?.extra?.BACKEND_URL;
  // This is the backend enpoint for this request. 
  const ENDPOINT = "/api/v1/auth/login";
  const USER_KEY = "user_data";

  // TODO: Remove the Biometrics. 
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
    navigation.navigate("WelcomeExisting"); 
  });

  const handleLogin = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}${ENDPOINT}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data?.message || "Login failed");
        return;
      }

      // Save JWT token and user Data - backend returns { user, token } directly
      if (data.user && data.token) {
        await setToken(data.token);

        // Prepare user data for AsyncStorage matching backend response
        let userData = {
          id: data.user.id,
          email: data.user.email,
          first: data.user.first,
          last: data.user.last,
          phone: data.user.phone,
          avatarUrl: data.user.avatarUrl,
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
                  navigation.navigate("WelcomeExisting");
                },
              },
              {
                text: "Yes",
                onPress: async () => {
                  await setBiometricEnabled(true);
                  navigation.navigate("WelcomeExisting");
                },
              },
            ],
          );
          return;
        }
        
        navigation.navigate("WelcomeExisting");
        return;
      }

      alert("Login successful!");
      navigation.navigate("WelcomeExisting");
    } catch (err) {
      alert("Network error. Please try again.");
      console.error("Network error:", err);
    }
  };

  const handleBiometricLogin = async () => {
    const token = await getToken();
    if (!token) {
      Alert.alert("Please log in with email and password first.");
      return;
    }

    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();

    if (!hasHardware || !isEnrolled) {
      Alert.alert("Biometrics not available on this device.");
      return;
    }

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: "Authenticate to continue",
      fallbackLabel: "Use Passcode",
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
          errorData?.data?.message || "We Had Issues Logging You In.",
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
              {biometricAvailable && (
                <TouchableOpacity
                  onPress={handleBiometricLogin}
                  style={styles.biometricIcon}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Icon name="finger-print" size={22} color="#932FF8" />
                </TouchableOpacity>
              )}
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

          {/* Sign In Button */}
          <PrimaryButton title="Sign In" onPress={handleLogin} />

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

          {/* Google Button */}
          <View style={styles.googleWrapper}>
            <View style={styles.circleBg} pointerEvents="none" />
            <Image
              source={CircleEffect}
              style={styles.circleEffect}
            />
            <TouchableOpacity
              onPress={() => navigation.navigate("SignUp")}
              style={styles.signupContainer}
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
    fontWeight: "300",
    color: "#F6F8F9",
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
    borderWidth: 0,
    borderColor: "transparent",
  },
  signInButton: {
    padding: 16,
    borderRadius: 25,
    position: "relative",
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
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
    zIndex: 3,
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
    backgroundColor: "transparent",
    borderWidth: 0,
    borderColor: "transparent",
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
