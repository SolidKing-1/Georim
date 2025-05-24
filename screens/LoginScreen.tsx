import React, { useState } from "react";
import {
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import Logo from "../assets/Authentication.jpg";
import Company from "../assets/Company_icon.png";
import Icon from "react-native-vector-icons/Ionicons";
import GoogleIcon from "../assets/Google.png";
import { useGoogleAuth } from "../components/useGoogleAuth";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";
import { Platform, KeyboardAvoidingView } from "react-native";

import Constants from "expo-constants";

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "Login">;

export default function LoginScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const BACKEND_URL = Constants.expoConfig?.extra?.BACKEND_URL;

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

      // Save JWT token from nested data object
      if (data.data && data.data.token) {
        await AsyncStorage.setItem("jwt", data.data.token);
      }

      alert("Login successful!");
      navigation.navigate("Dashboard");
    } catch (err) {
      alert("Network error. Please try again.");
      console.error("Network error:", err);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0} // tweak if header overlaps
    >
      <ScrollView style={styles.container}>
        <View style={styles.container}>
          {/* Company Logo */}
          <View style={styles.CompanyLogo}>
            <Image
              source={Company}
              style={styles.cimage}
              resizeMode="contain"
            />
          </View>
          {/* Top Image Box */}
          <View style={styles.imageContainer}>
            <Text style={styles.header}>Login</Text>
            <Image source={Logo} style={styles.image} resizeMode="contain" />
          </View>

          {/* Input Section */}
          <View style={styles.formContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              placeholder="username@gmail.com"
              placeholderTextColor="#999"
              style={styles.input}
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />

            <Text style={[styles.label, { marginTop: 20 }]}>Password</Text>
            <View style={styles.passwordWrapper}>
              <TextInput
                placeholder=".........."
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

            <TouchableOpacity style={styles.forgotPassword}>
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>

            {/* Login Button */}
            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
              <Text style={styles.loginButtonText}>Login</Text>
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

            {/* Sign Up Link */}
            <TouchableOpacity
              onPress={() => navigation.navigate("SignUp")}
              style={{ marginTop: 20 }}
            >
              <Text style={styles.signupText}>
                Don't have an account?{" "}
                <Text style={styles.link}>Register for free</Text>
              </Text>
            </TouchableOpacity>
          </View>
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

  imageContainer: {
    paddingTop: 50,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  header: {
    position: "absolute",
    top: 25,
    left: 26,
    fontSize: 36,
    fontWeight: "bold",
    color: "#000",
    zIndex: 1,
  },
  image: {
    height: 220,
    width: "100%",
  },
  CompanyLogo: {
    alignItems: "center",
    justifyContent: "flex-start",
    marginTop: 65,
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
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
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
    marginTop: 20,
  },
  loginButtonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },
  orText: {
    textAlign: "center",
    marginVertical: 10,
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
});
