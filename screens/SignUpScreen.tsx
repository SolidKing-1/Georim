import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
} from "react-native";
import Logo from "../assets/Authentication.jpg";
import Company from "../assets/Company_icon.png";
import Icon from "react-native-vector-icons/Ionicons";
import GoogleIcon from "../assets/Google.png";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";
import { Platform, KeyboardAvoidingView } from "react-native";
import { useGoogleAuth } from "../components/useGoogleAuth";

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "SignUp">;

export default function SignUpScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [showPassword, setShowPassword] = useState(false);

  const { promptAsync, request } = useGoogleAuth((data) => {
    // Handle signup success, e.g., save token, navigate, etc.
    console.log("Google signup success:", data);
    navigation.navigate("Dashboard"); // or wherever you want
  });

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
          <Image source={Logo} style={styles.image} resizeMode="contain" />
        </View>

        {/* Form Section */}
        <View style={styles.formContainer}>
          {/* First & Last Name Row */}
          <View style={styles.nameRow}>
            <View style={{ flex: 1, marginRight: 8 }}>
              <Text style={styles.label}>First Name</Text>
              <TextInput
                placeholder="John"
                placeholderTextColor="#999"
                style={styles.input}
              />
            </View>
            <View style={{ flex: 1, marginLeft: 8 }}>
              <Text style={styles.label}>Last Name</Text>
              <TextInput
                placeholder="Doe"
                placeholderTextColor="#999"
                style={styles.input}
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
          />

          {/* Phone */}
          <Text style={[styles.label, { marginTop: 20 }]}>Phone Number</Text>
          <TextInput
            placeholder="+1 234 567 890"
            placeholderTextColor="#999"
            style={styles.input}
            keyboardType="phone-pad"
          />

          {/* Password */}
          <Text style={[styles.label, { marginTop: 20 }]}>Password</Text>
          <View style={styles.passwordWrapper}>
            <TextInput
              placeholder="..........."
              placeholderTextColor="#999"
              style={[styles.input, { flex: 1 }]}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
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
          <TouchableOpacity
            onPress={() => navigation.navigate("Login")}
            style={styles.loginButton}
          >
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
});
