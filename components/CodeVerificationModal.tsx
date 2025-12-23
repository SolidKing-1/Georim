// CodeVerificationModal.tsx
import React, { useRef, useState } from "react";
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Keyboard,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import LottieView from "lottie-react-native"; // npm install lottie-react-native
import Constants from "expo-constants";

const BACKEND_URL = Constants.expoConfig?.extra?.BACKEND_URL;

type CodeVerificationModalProps = {
  visible: boolean;
  email: string;
  onClose: () => void;
  onSuccess?: () => void;
};

export default function CodeVerificationModal({
  visible,
  email,
  onClose,
  onSuccess,
}: CodeVerificationModalProps) {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const inputs = useRef<Array<TextInput | null>>([]);

  // Handle input change
  interface HandleChangeEvent {
    nativeEvent?: {
      text?: string;
    };
  }

  const handleChange = (text: string, idx: number): void => {
    if (!/^[0-9]*$/.test(text)) return; // Only numbers
    let newCode = [...code];
    if (text.length > 1) {
      // Handle paste
      text = text.replace(/\D/g, "").slice(0, 6);
      newCode = text.split("").concat(Array(6).fill("")).slice(0, 6);
      setCode(newCode);
      const nextEmpty = newCode.findIndex((c) => !c);
      if (nextEmpty === -1) Keyboard.dismiss();
      else (inputs.current[nextEmpty] as TextInput | undefined)?.focus();
      return;
    }
    newCode[idx] = text;
    setCode(newCode);
    if (text && idx < 5)
      (inputs.current[idx + 1] as TextInput | undefined)?.focus();
  };

  const handleKeyPress = (e: any, idx: number) => {
    if (e.nativeEvent.key === "Backspace") {
      if (code[idx] === "") {
        if (idx > 0) {
          (inputs.current[idx - 1] as TextInput | undefined)?.focus();
          let newCode = [...code];
          newCode[idx - 1] = "";
          setCode(newCode);
        }
      } else {
        let newCode = [...code];
        newCode[idx] = "";
        setCode(newCode);
      }
    }
  };

  // Handle submit
  const handleVerify = async () => {
    setLoading(true);
    setError("");
    try {
      // 2. Complete signup with code and user data
      const response = await fetch(`${BACKEND_URL}/auth/verifycode`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          code: code.join(""),
          // Optionally include other user data if backend requires
          // first, last, phone, password
        }),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          setCode(["", "", "", "", "", ""]);
          onSuccess && onSuccess();
        }, 2000);
      } else {
        setError(data.message || "Invalid code. Please try again.");
      }
    } catch (e) {
      setError("Network error. Please try again.");
    }
    setLoading(false);
  };

  // Reset modal state when closed
  React.useEffect(() => {
    if (!visible) {
      setCode(["", "", "", "", "", ""]);
      setError("");
      setSuccess(false);
      setLoading(false);
    }
  }, [visible]);

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          {success ? (
            <View style={styles.successContainer}>
              <LottieView
                source={require("../assets/success-check.json")}
                autoPlay
                loop={false}
                style={{ width: 120, height: 120 }}
              />
              <Text style={styles.successText}>Code Verified!</Text>
            </View>
          ) : (
            <>
              <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
                <Ionicons name="close" size={28} color="#333" />
              </TouchableOpacity>
              <Text style={styles.title}>Verify Your Email</Text>
              <Text style={styles.subtitle}>
                Enter the 6-character code sent to{"\n"}
                <Text style={styles.email}>{email}</Text>
              </Text>
              <View style={styles.codeRow}>
                {code.map((c, idx) => (
                  <TextInput
                    key={idx}
                    ref={(ref) => {
                      inputs.current[idx] = ref;
                    }}
                    style={[
                      styles.codeInput,
                      error ? { borderColor: "#FF3B30" } : {},
                    ]}
                    value={c}
                    onChangeText={(text) => handleChange(text, idx)}
                    onKeyPress={(e) => handleKeyPress(e, idx)}
                    maxLength={1}
                    autoFocus={idx === 0}
                    keyboardType="number-pad"
                    returnKeyType="done"
                    textAlign="center"
                  />
                ))}
              </View>
              {error ? <Text style={styles.error}>{error}</Text> : null}
              <TouchableOpacity
                style={styles.verifyBtn}
                onPress={handleVerify}
                disabled={loading || code.some((c) => !c)}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.verifyBtnText}>Verify</Text>
                )}
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(30,0,60,0.18)",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 28,
    alignItems: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
  },
  closeBtn: {
    position: "absolute",
    right: 12,
    top: 12,
    zIndex: 10,
    padding: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#7F00FF",
    marginTop: 8,
    marginBottom: 6,
    textAlign: "center",
  },
  subtitle: {
    color: "#555",
    fontSize: 15,
    marginBottom: 18,
    textAlign: "center",
  },
  email: {
    color: "#7F00FF",
    fontWeight: "bold",
  },
  codeRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 18,
    marginTop: 8,
    gap: 4,
    paddingLeft: 30,
  },
  codeInput: {
    width: 44,
    height: 54,
    borderWidth: 2,
    borderColor: "#7F00FF",
    borderRadius: 10,
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    backgroundColor: "#F7F7FA",
    marginHorizontal: 3,
    textAlign: "center",
  },
  verifyBtn: {
    backgroundColor: "#7F00FF",
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 40,
    marginTop: 10,
    width: "100%",
    alignItems: "center",
  },
  verifyBtnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 17,
  },
  error: {
    color: "#FF3B30",
    marginBottom: 8,
    marginTop: -8,
    fontSize: 14,
    textAlign: "center",
  },
  successContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 30,
  },
  successText: {
    color: "#18C964",
    fontWeight: "bold",
    fontSize: 22,
    marginTop: 18,
    textAlign: "center",
  },
});
