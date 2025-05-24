import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  TextInput,
  Pressable,
  Animated,
  Easing,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";

const PaymentScreen = () => {
  // Navigation hook for going back
  const navigation = useNavigation();

  // State for showing the modal
  const [showModal, setShowModal] = useState(false);

  // Animated value for sliding up the modal
  const [slideAnim] = useState(new Animated.Value(600)); // Modal starts off-screen

  // Handler for opening the modal with animation
  const handleRegisterNow = () => {
    setShowModal(true);
    Animated.timing(slideAnim, {
      toValue: 0, // Slide to visible
      duration: 400,
      easing: Easing.out(Easing.exp),
      useNativeDriver: true,
    }).start();
  };

  // Handler for closing the modal with animation
  const handleCloseModal = () => {
    Animated.timing(slideAnim, {
      toValue: 600, // Slide back off-screen
      duration: 300,
      useNativeDriver: true,
    }).start(() => setShowModal(false));
  };

  return (
    <>
      {/* Status bar for top of the screen */}
      <StatusBar style="dark" backgroundColor="#fff" />

      {/* Fixed Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="chevron-back" size={24} color="#000" />
      </TouchableOpacity>

      {/* Main scrollable content */}
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        {/* Header with event title */}
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>Ruston Fest 2025</Text>
        </View>

        {/* Ticket information card */}
        <Text style={styles.sectionTitle}>Available Tickets</Text>
        <View style={styles.ticketCard}>
          <View style={styles.ticketIconContainer}>
            <Ionicons name="ticket-outline" size={28} color="#a259ff" />
          </View>
          <View style={styles.ticketInfo}>
            <Text style={styles.ticketTitle}>General Admission</Text>
            <Text style={styles.ticketDesc}>
              Free drinks, Food trucks, and{"\n"}merchandise stands
            </Text>
          </View>
          <Text style={styles.ticketPrice}>$30</Text>
        </View>

        {/* Registration section */}
        <Text style={styles.sectionTitle}>Register for the Event</Text>
        <View style={styles.registerCard}>
          <Text style={styles.registerDesc}>
            Join us for an unforgettable experience! Please register{"\n"}now to
            secure your spot
          </Text>
          <View style={styles.registerRow}>
            <View>
              <Text style={styles.registerLabel}>Resister date</Text>
              <Text style={styles.registerDate}>June 20, 2025</Text>
            </View>
            {/* Register Now button triggers modal */}
            <TouchableOpacity
              style={styles.registerBtn}
              onPress={handleRegisterNow}
            >
              <Text style={styles.registerBtnText}>Register Now</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Stylish Animated Modal for order summary */}
      <Modal
        visible={showModal}
        transparent
        animationType="none"
        onRequestClose={handleCloseModal}
      >
        {/* Modal overlay for background dimming */}
        <Pressable style={styles.modalOverlay} onPress={handleCloseModal}>
          {/* Prevent closing when pressing inside the modal sheet */}
          <Animated.View
            style={[
              styles.modalSheet,
              { transform: [{ translateY: slideAnim }] },
            ]}
            onStartShouldSetResponder={() => true}
            onTouchEnd={(e) => e.stopPropagation()}
          >
            {/* Modal handle for visual cue */}
            <View style={styles.modalHandle} />

            {/* Order summary title */}
            <Text style={styles.modalOrderTitle}>Order Summary</Text>

            {/* Promotional code input */}
            <View style={styles.promoInputWrap}>
              <TextInput
                style={styles.promoInput}
                placeholder="Promotional Code"
                placeholderTextColor="#a59cff"
              />
              <View style={styles.promoMinus}>
                <Text style={{ color: "#a59cff", fontWeight: "bold" }}>-</Text>
              </View>
            </View>

            {/* Summary of costs */}
            <View style={styles.summaryBox}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Subtotal</Text>
                <Text style={styles.summaryValue}>$30</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Fees & Taxes</Text>
                <Text style={styles.summaryValue}>$2.37</Text>
              </View>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryRow}>
                <Text style={styles.summaryTotalLabel}>Total</Text>
                <Text style={styles.summaryTotalValue}>$32.37</Text>
              </View>
            </View>

            {/* Continue button to close modal */}
            <Pressable style={styles.continueBtn} onPress={handleCloseModal}>
              <Text style={styles.continueBtnText}>Continue</Text>
            </Pressable>
          </Animated.View>
        </Pressable>
      </Modal>
    </>
  );
};

// Styles for all components and modal
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 40,
    marginBottom: 24,
    justifyContent: "center",
    position: "relative",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111",
    textAlign: "center",
    flex: 1,
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 16,
    zIndex: 10,
    backgroundColor: "rgba(255,255,255,0.8)",
    borderRadius: 20,
    padding: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
    color: "#111",
  },
  ticketCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f6f0ff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 28,
  },
  ticketIconContainer: {
    backgroundColor: "#fff",
    borderRadius: 30,
    padding: 10,
    marginRight: 12,
  },
  ticketInfo: {
    flex: 1,
  },
  ticketTitle: {
    fontWeight: "700",
    fontSize: 15,
    color: "#222",
  },
  ticketDesc: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  ticketPrice: {
    fontWeight: "700",
    fontSize: 20,
    color: "#7F00FF",
    marginLeft: 10,
  },
  registerCard: {
    backgroundColor: "#f6f0ff",
    borderRadius: 16,
    padding: 14,
    marginTop: 8,
  },
  registerDesc: {
    fontSize: 12,
    color: "#444",
    marginBottom: 12,
  },
  registerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  registerLabel: {
    fontSize: 10,
    color: "#888",
  },
  registerDate: {
    fontWeight: "700",
    fontSize: 13,
    color: "#222",
    marginTop: 2,
  },
  registerBtn: {
    backgroundColor: "#7F00FF",
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 18,
  },
  registerBtnText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 13,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.25)",
    justifyContent: "flex-end",
  },
  modalSheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    paddingBottom: 36,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 12,
  },
  modalHandle: {
    width: 48,
    height: 5,
    borderRadius: 3,
    backgroundColor: "#e0e0e0",
    marginBottom: 18,
  },
  modalOrderTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#222",
    marginBottom: 18,
    alignSelf: "flex-start",
  },
  promoInputWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f6f0ff",
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 18,
    width: "100%",
    height: 44,
  },
  promoInput: {
    flex: 1,
    fontSize: 15,
    color: "#7F00FF",
    backgroundColor: "transparent",
  },
  promoMinus: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#ede7fa",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },
  summaryBox: {
    width: "100%",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#e5d8fa",
    padding: 16,
    marginBottom: 22,
    backgroundColor: "#fff",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  summaryLabel: {
    color: "#888",
    fontSize: 15,
  },
  summaryValue: {
    color: "#222",
    fontSize: 15,
    fontWeight: "500",
  },
  summaryDivider: {
    height: 1,
    backgroundColor: "#e5d8fa",
    marginVertical: 8,
  },
  summaryTotalLabel: {
    color: "#222",
    fontSize: 16,
    fontWeight: "700",
  },
  summaryTotalValue: {
    color: "#7F00FF",
    fontSize: 18,
    fontWeight: "bold",
  },
  continueBtn: {
    backgroundColor: "#7F00FF",
    borderRadius: 24,
    paddingVertical: 14,
    paddingHorizontal: 60,
    marginTop: 8,
    width: "100%",
    alignItems: "center",
  },
  continueBtnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
});

export default PaymentScreen;
