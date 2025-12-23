import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Linking,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import Company from "../assets/Company_icon.png";
import Constants from "expo-constants";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "ForgotPassword">;

export default function ForgotPasswordScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const BACKEND_URL = Constants.expoConfig?.extra?.BACKEND_URL;

  const handleForgotPassword = async () => {
    if (!email) {
      Alert.alert("Please enter your email address.");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        Alert.alert(
          "Check your email",
          "A password reset link has been sent to your email address."
        );
        navigation.goBack();
      } else {
        Alert.alert(
          "Error",
          data?.data?.message || "Could not send reset link. Please try again."
        );
      }
    } catch (err) {
      Alert.alert("Network error", "Please try again.");
    }
    setLoading(false);
  };

  // Example backend personnel contact (customize as needed)
  const backendContact = {
    email: "geo.rim.app@gmail.com",
    whatsapp: "https://wa.me/3185481042",
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#fff" }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
    >
      <View style={styles.container}>
        {/* Company Logo */}
        <View style={styles.CompanyLogo}>
          <Image
            source={Company}
            style={styles.cimage}
            resizeMode="contain"
          />
        </View>
        <View style={styles.formContainer}>
          <Text style={styles.header}>Forgot Password</Text>
          <Text style={styles.infoText}>
            Enter your email address and we'll send you a link to reset your password.
          </Text>
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
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleForgotPassword}
            disabled={loading}
          >
            <Text style={styles.submitButtonText}>
              {loading ? "Sending..." : "Send Reset Link"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ marginTop: 18, alignSelf: "center" }}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backToLogin}>
              <Icon name="arrow-back" size={16} color="#4f46e5" /> Back to Login
            </Text>
          </TouchableOpacity>
          <View style={styles.contactBox}>
            <Text style={styles.contactTitle}>Need help?</Text>
            <Text style={styles.contactText}>
              Contact our help personnel:
            </Text>
            <TouchableOpacity
              onPress={() => Linking.openURL(`mailto:${backendContact.email}`)}
            >
              <Text style={styles.contactLink}>
                <Icon name="mail" size={16} color="#4f46e5" /> {backendContact.email}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => Linking.openURL(backendContact.whatsapp)}
            >
              <Text style={styles.contactLink}>
                <Icon name="logo-whatsapp" size={16} color="#25D366" /> WhatsApp Support
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
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
    marginTop: 30,
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 12,
    textAlign: "center",
  },
  infoText: {
    color: "#555",
    fontSize: 15,
    marginBottom: 18,
    textAlign: "center",
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
    marginBottom: 18,
  },
  submitButton: {
    backgroundColor: "#4f46e5",
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
  },
  submitButtonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },
  backToLogin: {
    color: "#4f46e5",
    fontWeight: "600",
    fontSize: 15,
  },
  contactBox: {
    marginTop: 32,
    backgroundColor: "#f7f7fa",
    borderRadius: 10,
    padding: 16,
    alignItems: "center",
  },
  contactTitle: {
    fontWeight: "bold",
    color: "#333",
    fontSize: 15,
    marginBottom: 4,
  },
  contactText: {
    color: "#555",
    fontSize: 14,
    marginBottom: 8,
  },
  contactLink: {
    color: "#4f46e5",
    fontWeight: "500",
    fontSize: 15,
    marginTop: 4,
  },
});
