import React, { useState } from "react";
import {
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Keyboard,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import KeyIcon from "../assets/authScreens/key-01.png";
import GlassButton from "../components/GlassButton";
import PrimaryButton from "../components/PrimaryButton";
import CircleEffect from "../components/GlassEffects/circleGlassEffect.png";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";
import Constants from "expo-constants";

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "ForgotPassword"
>;

export default function ForgotPasswordScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const BACKEND_URL = Constants.expoConfig?.extra?.BACKEND_URL;

  const handleEmailVerification = async () => {
    if (!email.trim()) {
      alert("Please enter your email address");
      return;
    }

    // Navigate immediately so the user sees the OTP screen
    navigation.navigate("VerifyPasscode", { email });

    // Fire-and-forget the email request; warn if misconfigured
    if (!BACKEND_URL) {
      console.warn("BACKEND_URL missing; cannot request OTP");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`${BACKEND_URL}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data?.message || "Failed to send reset instructions");
      }
    } catch (err) {
      console.error("Network error:", err);
    } finally {
      setIsSubmitting(false);
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
        {/* Icon with Glass Effect */}
        <View style={styles.iconContainer}>
          <GlassButton
            style={styles.iconGlassWrapper}
            borderRadius={60}
            isCircular={true}
          >
            <View style={styles.circleBg} pointerEvents="none" />
            <Image
              source={CircleEffect}
              style={styles.circleEffect}
              pointerEvents="none"
            />
            <View style={styles.iconInner}>
              <Image source={KeyIcon} style={styles.keyImage} />
            </View>
          </GlassButton>
        </View>

        {/* Heading */}
        <Text style={styles.heading}>Forgot password?</Text>

        {/* Subtitle */}
        <Text style={styles.subtitle}>
          No worries, we'll send you reset{"\n"}instructions.
        </Text>

        {/* Form */}
        <View style={styles.formContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            placeholder="username@gmail.com"
            placeholderTextColor="#6B7280"
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          {/* Email Verification Button */}
          <PrimaryButton
            title={isSubmitting ? "Sending..." : "Email Verification Code"}
            onPress={handleEmailVerification}
            disabled={isSubmitting}
            style={styles.glassButtonWrapper}
          />
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.copyright}>
            © 2026 Georim. All right reserved
          </Text>
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
    paddingHorizontal: 28,
    paddingTop: 80,
    paddingBottom: 40,
  },
  iconContainer: {
    alignItems: "center",
    marginTop: 60,
    marginBottom: 40,
  },
  iconGlassWrapper: {
    width: 100,
    height: 100,
    borderWidth: 0,
    borderColor: "transparent",
    backgroundColor: "transparent",
  },
  circleBg: {
    position: "absolute",
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#331057",
    top: 0,
    left: 0,
    zIndex: 0,
  },
  circleEffect: {
    position: "absolute",
    width: 100,
    height: 100,
    resizeMode: "contain",
    top: 0,
    left: 0,
    zIndex: 1,
  },
  iconInner: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2,
    backgroundColor: "transparent",
  },
  keyImage: {
    width: 60,
    height: 60,
    resizeMode: "contain",
    zIndex: 3,
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
    borderRadius: 25,
  },
  heading: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#F6F8F9",
    fontFamily: "Hero",
    textAlign: "center",
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 20,
    color: "#9CA3AF",
    fontFamily: "Hero",
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 24,
  },
  formContainer: {
    marginBottom: 60,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#FFFFFF",
    marginBottom: 8,
    fontFamily: "Hero",
  },
  input: {
    borderWidth: 1,
    borderColor: "#0E0D32",
    padding: 14,
    borderRadius: 8,
    backgroundColor: "#0E0D32",
    color: "#FFFFFF",
    fontSize: 15,
    fontFamily: "Hero",
    marginBottom: 48,
  },
  glassButtonWrapper: {
    marginBottom: 0,
    borderWidth: 0,
    borderColor: "transparent",
    backgroundColor: "transparent",
  },
  verificationButton: {
    padding: 16,
    borderRadius: 25,
    position: "relative",
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  verificationButtonText: {
    color: "#FFFFFF",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
    fontFamily: "Hero",
    zIndex: 3,
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  copyright: {
    fontSize: 12,
    color: "#6B7280",
    fontFamily: "Hero",
  },
});
