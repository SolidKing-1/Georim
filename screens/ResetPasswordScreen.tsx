import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Keyboard,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import GlassButton from "../components/GlassButton";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";
import Constants from "expo-constants";
import { Ionicons } from "@expo/vector-icons";
import KeyIcon from "../assets/authScreens/key-01.png";

type Props = NativeStackScreenProps<RootStackParamList, "ResetPassword">;

export default function ResetPasswordScreen({ route, navigation }: Props) {
  const { email, code } = route.params;
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const BACKEND_URL = Constants.expoConfig?.extra?.BACKEND_URL;

  const handleDone = async () => {
    setError("");

    // Temporarily skip validations while backend is unavailable
    navigation.navigate("Login");

    /*
    // Validation (restore when backend is ready)
    if (!newPassword.trim() || !confirmPassword.trim()) {
      setError("Please fill in all fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords don't match. Try again");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    // Backend call (restore when backend is ready)
    if (!BACKEND_URL) {
      console.warn("BACKEND_URL missing");
      return;
    }

    setIsSubmitting(true);
    try {
      const resp = await fetch(`${BACKEND_URL}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code, newPassword }),
      });

      const data = await resp.json().catch(() => ({}));
      if (!resp.ok) {
        setError(data?.message || "Failed to reset password");
        return;
      }

      alert("Password reset successful! Please log in.");
      navigation.navigate("Login");
    } catch (err) {
      setError("Network error. Please try again.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
    */
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        onScrollBeginDrag={() => Keyboard.dismiss()}
      >
        <View style={styles.inner}>
          {/* Error Banner */}
          {error ? (
            <View style={styles.errorBanner}>
              <View style={styles.errorIconCircle}>
                <Ionicons name="information" size={16} color="#B00020" />
              </View>
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity onPress={() => setError("")}>
                <Ionicons name="close" size={20} color="#B00020" />
              </TouchableOpacity>
            </View>
          ) : null}

          {/* Icon */}
          <View style={styles.iconContainer}>
            <GlassButton
              style={styles.iconGlassWrapper}
              borderRadius={60}
              isCircular={true}
            >
              <View style={styles.iconCircle}>
                <Image source={KeyIcon} style={styles.keyImage} />
              </View>
            </GlassButton>
          </View>

          {/* Title */}
          <Text style={styles.title}>Re-Authentication</Text>

          {/* Form */}
          <View style={styles.formContainer}>
            <Text style={styles.label}>Enter New Password</Text>
            <View style={styles.passwordWrapper}>
              <TextInput
                placeholder="Password"
                placeholderTextColor="#BFBFBF"
                style={styles.input}
                secureTextEntry={!showNewPassword}
                autoCapitalize="none"
                value={newPassword}
                onChangeText={setNewPassword}
              />
              <TouchableOpacity
                onPress={() => setShowNewPassword(!showNewPassword)}
                style={styles.eyeIcon}
              >
                <Ionicons
                  name={showNewPassword ? "eye-off" : "eye"}
                  size={20}
                  color="#BFBFBF"
                />
              </TouchableOpacity>
            </View>

            <Text style={styles.label}>Confirm New Password</Text>
            <View style={styles.passwordWrapper}>
              <TextInput
                placeholder="Password"
                placeholderTextColor="#BFBFBF"
                style={styles.input}
                secureTextEntry={!showConfirmPassword}
                autoCapitalize="none"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
              <TouchableOpacity
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                style={styles.eyeIcon}
              >
                <Ionicons
                  name={showConfirmPassword ? "eye-off" : "eye"}
                  size={20}
                  color="#BFBFBF"
                />
              </TouchableOpacity>
            </View>

            {/* Done Button */}
            <GlassButton style={styles.ctaWrapper} borderRadius={25}>
              <TouchableOpacity onPress={handleDone} disabled={isSubmitting}>
                <LinearGradient
                  colors={["#6E23BA", "#282691"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.cta}
                >
                  <Text style={styles.ctaText}>
                    {isSubmitting ? "Resetting..." : "Done"}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </GlassButton>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Text style={styles.copyright}>© 2026 Georim. All right reserved</Text>
      </View>
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
    justifyContent: "center",
    paddingVertical: 40,
  },
  inner: {
    width: "100%",
    maxWidth: 380,
    alignSelf: "center",
    paddingHorizontal: 28,
    paddingBottom: 80,
  },
  errorBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0E0D32",
    borderWidth: 1,
    borderColor: "#B00020",
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 20,
    gap: 10,
    alignSelf: "stretch",
  },
  errorText: {
    flex: 1,
    color: "#F6F8F9",
    fontSize: 14,
    fontFamily: "Hero",
  },
  errorIconCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#B00020",
    backgroundColor: "#0E0D32",
    alignItems: "center",
    justifyContent: "center",
  },
  iconContainer: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 30,
  },
  iconGlassWrapper: {
    width: 100,
    height: 100,
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#331057",
    justifyContent: "center",
    alignItems: "center",
  },
  keyImage: {
    width: 60,
    height: 60,
    resizeMode: "contain",
  },
  title: {
    fontSize: 20,
    color: "#F6F8F9",
    fontWeight: "700",
    fontFamily: "Hero",
    textAlign: "center",
    marginBottom: 28,
  },
  formContainer: {
    width: "100%",
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#F6F8F9",
    marginBottom: 8,
    fontFamily: "Hero",
  },
  passwordWrapper: {
    position: "relative",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#0E0D32",
    padding: 14,
    borderRadius: 8,
    backgroundColor: "#0E0D32",
    color: "#F6F8F9",
    fontSize: 15,
    fontFamily: "Hero",
    paddingRight: 50,
  },
  eyeIcon: {
    position: "absolute",
    right: 14,
    top: 14,
  },
  ctaWrapper: {
    marginTop: 28,
    width: "90%",
    alignSelf: "center",
  },
  cta: {
    paddingVertical: 14,
    borderRadius: 25,
  },
  ctaText: {
    color: "#F6F8F9",
    textAlign: "center",
    fontWeight: "700",
    fontSize: 16,
    fontFamily: "Hero",
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
