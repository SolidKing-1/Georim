import React, { useMemo, useRef, useState, useEffect } from "react";
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
  Animated,
} from "react-native";
import PrimaryButton from "../components/PrimaryButton";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";
import Constants from "expo-constants";
import * as Haptics from "expo-haptics";
import { Ionicons } from "@expo/vector-icons";

type Props = NativeStackScreenProps<RootStackParamList, "VerifyPasscode">;

export default function VerifyPasscodeScreen({ route, navigation }: Props) {
  const email = route.params?.email ?? "";
  const maskedEmail = useMemo(() => maskEmail(email), [email]);

  const [digits, setDigits] = useState(["", "", "", ""]);
  const [countdown, setCountdown] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [error, setError] = useState<string>("");
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const inputs = [
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
  ];

  const BACKEND_URL = Constants.expoConfig?.extra?.BACKEND_URL;
  const code = digits.join("");

  // Countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  // Track keyboard visibility to hide footer that might overlap CTA
  useEffect(() => {
    const show = Keyboard.addListener("keyboardDidShow", () =>
      setIsKeyboardVisible(true)
    );
    const hide = Keyboard.addListener("keyboardDidHide", () =>
      setIsKeyboardVisible(false)
    );
    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  const triggerShake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, {
        toValue: 10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: -10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 0,
        duration: 50,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const onChangeDigit = (index: number, value: string) => {
    if (error) setError("");
    // Handle paste
    if (value.length > 1) {
      const pastedDigits = value.replace(/\D/g, "").slice(0, 4).split("");
      const newDigits = ["", "", "", ""];
      pastedDigits.forEach((d, i) => {
        if (i < 4) newDigits[i] = d;
      });
      setDigits(newDigits);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      const lastFilledIndex = Math.min(pastedDigits.length - 1, 3);
      inputs[lastFilledIndex].current?.focus();
      return;
    }

    const v = value.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[index] = v;
    setDigits(next);

    if (v) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      if (index < inputs.length - 1) {
        inputs[index + 1].current?.focus();
      }
    }
  };

  const onKeyPress = (index: number, e: any) => {
    if (e.nativeEvent.key === "Backspace" && !digits[index] && index > 0) {
      inputs[index - 1].current?.focus();
    }
  };

  const handleResend = async () => {
    if (!email || !canResend) return;
    try {
      await fetch(`${BACKEND_URL}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setCountdown(30);
      setCanResend(false);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (err) {
      console.warn("Resend failed", err);
    }
  };

  const handleContinue = async () => {
    if (code.length < 4) {
      setError("Please enter the 4-digit code");
      triggerShake();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    // Frontend-only validation for now
    if (code !== "0000") {
      setError("Passcode incorrect! Try again.");
      triggerShake();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    navigation.navigate("ResetPassword", { email, code });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 20 : 0}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={[
          styles.scrollContent,
          isKeyboardVisible ? { paddingBottom: 24 } : null,
        ]}
        keyboardShouldPersistTaps="handled"
        onScrollBeginDrag={() => Keyboard.dismiss()}
      >
        <View style={styles.inner}>
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
          <Text style={styles.title}>Verify your Passcode</Text>

          <Animated.View
            style={[styles.otpRow, { transform: [{ translateX: shakeAnim }] }]}
          >
            {digits.map((d, i) => (
              <View key={i} style={styles.otpGlass}>
                <View style={styles.otpBox}>
                  <TextInput
                    ref={inputs[i]}
                    style={styles.otpInput}
                    value={d}
                    onChangeText={(v) => onChangeDigit(i, v)}
                    onKeyPress={(e) => onKeyPress(i, e)}
                    keyboardType="number-pad"
                    maxLength={1}
                    autoFocus={i === 0}
                    selectTextOnFocus
                    returnKeyType="next"
                  />
                </View>
              </View>
            ))}
          </Animated.View>

          <Text style={styles.subtitle}>
            We've sent a code to {maskedEmail}.{"\n"}
            Please enter it here to verify your identity.
          </Text>

          <TouchableOpacity onPress={handleResend} disabled={!canResend}>
            <Text style={[styles.resend, !canResend && styles.resendDisabled]}>
              {canResend
                ? "Didn't receive? Re-send OTP"
                : `Resend in 0:${countdown.toString().padStart(2, "0")}`}
            </Text>
          </TouchableOpacity>

          <View style={{ height: 24 }} />

          <View style={styles.ctaWrapper}>
            <PrimaryButton title="Continue" onPress={handleContinue} />
          </View>
        </View>
      </ScrollView>

      {!isKeyboardVisible && (
        <View style={styles.footer}>
          <Text style={styles.copyright}>
            © 2026 Georim. All right reserved
          </Text>
        </View>
      )}
    </KeyboardAvoidingView>
  );
}

function maskEmail(email: string) {
  if (!email) return "your email";
  const [user, domain] = email.split("@");
  if (!user || !domain) return email;
  const visible = user.slice(-2);
  return `•••${visible}@${domain}`;
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
    flex: 1,
    width: "100%",
    maxWidth: 380,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
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
  errorText: {
    flex: 1,
    color: "#F6F8F9",
    fontSize: 14,
    fontFamily: "Hero",
  },
  title: {
    fontSize: 20,
    color: "#F6F8F9",
    fontWeight: "700",
    fontFamily: "Hero",
    textAlign: "center",
    marginBottom: 28,
  },
  otpRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignSelf: "center",
    width: "100%",
    maxWidth: 320,
    marginBottom: 24,
  },
  otpGlass: {
    width: 72,
    height: 72,
  },
  otpBox: {
    flex: 1,
    borderRadius: 14,
    backgroundColor: "#0E0D32",
    borderWidth: 1,
    borderColor: "#421570",
    justifyContent: "center",
    alignItems: "center",
  },
  otpInput: {
    width: 40,
    textAlign: "center",
    color: "#A5A4E5",
    fontSize: 24,
    fontWeight: "700",
    fontFamily: "Hero",
    paddingVertical: Platform.OS === "ios" ? 8 : 0,
  },
  subtitle: {
    marginTop: 16,
    color: "#4B5563",
    fontSize: 14,
    textAlign: "center",
    fontFamily: "Hero",
    lineHeight: 20,
  },
  resend: {
    marginTop: 14,
    color: "#6E23BA",
    fontSize: 14,
    textAlign: "center",
    fontFamily: "Hero",
    textDecorationLine: "underline",
  },
  resendDisabled: {
    color: "#6B7280",
    textDecorationLine: "none",
  },
  ctaWrapper: {
    marginTop: 16,
    width: "100%",
    alignSelf: "center",
    alignItems: "center",
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
