import React from "react";
import { Modal, View, Text, StyleSheet, Image, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface RegistrationSuccessModalProps {
  visible: boolean;
  onClose: () => void;
}

const RegistrationSuccessModal: React.FC<RegistrationSuccessModalProps> = ({
  visible,
  onClose,
}) => (
  <Modal
    visible={visible}
    transparent
    animationType="fade"
    onRequestClose={onClose}
  >
    <View style={styles.modalOverlay}>
      <View style={styles.modalContent}>
        <Ionicons
          name="checkmark-circle"
          size={48}
          color="#7F00FF"
          style={{ marginBottom: 12 }}
        />
        <Text style={styles.modalTitle}>Event Registration Successful</Text>
        <Image
          source={{
            uri: "https://eliazar-applications.s3.us-east-2.amazonaws.com/georim/1748657608573-303045f4-c258-49ee-8d14-540e5ea844d5-registration-success.png",
          }}
          style={styles.modalImage}
          resizeMode="contain"
        />
        <Pressable style={styles.modalButton} onPress={onClose}>
          <Text style={styles.modalButtonText}>Close</Text>
        </Pressable>
      </View>
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 28,
    alignItems: "center",
    width: "80%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#7F00FF",
    marginBottom: 18,
    textAlign: "center",
  },
  modalImage: {
    width: 180,
    height: 180,
    marginBottom: 18,
  },
  modalButton: {
    backgroundColor: "#7F00FF",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 32,
    marginTop: 8,
  },
  modalButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default RegistrationSuccessModal;