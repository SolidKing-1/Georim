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
import Svg, { Path } from "react-native-svg";
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
            />
            <View style={styles.iconInner}>
              <Svg width={60} height={60} viewBox="0 0 42 42" fill="none">
                <Path
                  d="M30.9527 14.2856C30.9526 13.2193 30.5458 12.153 29.7323 11.3395C28.9187 10.5259 27.8523 10.1191 26.786 10.1191M26.786 26.7858C33.6896 26.7858 39.286 21.1893 39.286 14.2858C39.286 7.38221 33.6896 1.78577 26.786 1.78577C19.8824 1.78577 14.286 7.38221 14.286 14.2858C14.286 14.8559 14.3242 15.4172 14.3981 15.9671C14.5197 16.8716 14.5805 17.3238 14.5396 17.6099C14.497 17.908 14.4427 18.0686 14.2958 18.3314C14.1548 18.5837 13.9062 18.8322 13.4092 19.3292L2.76232 29.9761C2.40201 30.3364 2.22185 30.5166 2.09301 30.7268C1.97878 30.9132 1.89461 31.1165 1.84357 31.329C1.78601 31.5688 1.78601 31.8236 1.78601 32.3331V35.9524C1.78601 37.1192 1.78601 37.7026 2.01308 38.1482C2.21282 38.5402 2.53153 38.859 2.92353 39.0587C3.36918 39.2858 3.95257 39.2858 5.11934 39.2858H10.1193V35.1191H14.286V30.9524H18.4527L21.7425 27.6626C22.2396 27.1655 22.4881 26.917 22.7404 26.776C23.0032 26.6291 23.1638 26.5748 23.4619 26.5322C23.748 26.4913 24.2002 26.5521 25.1047 26.6737C25.6546 26.7476 26.2158 26.7858 26.786 26.7858Z"
                  stroke="#F6F8F9"
                  strokeWidth="3.57143"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
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
    zIndex: 3,
    backgroundColor: "transparent",
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
