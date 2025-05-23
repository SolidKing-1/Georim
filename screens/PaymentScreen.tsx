import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";

const PaymentScreen = () => {
  const navigation = useNavigation();
  return (
    <>
      <StatusBar style="dark" backgroundColor="#fff" />
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        {/* Header */}
        <View style={styles.headerRow}>
          {/* Back Button */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="chevron-back" size={24} color="#000" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Ruston Fest 2025</Text>
        </View>

        {/* Available Tickets */}
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

        {/* Register for the Event */}
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
            <TouchableOpacity style={styles.registerBtn}>
              <Text style={styles.registerBtnText}>Register Now</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </>
  );
};

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
    backgroundColor: "rgba(255,255,255,0.8)",
    borderRadius: 20,
    padding: 8,
    position: "absolute",
    left: 0,
    zIndex: 1,
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
});

export default PaymentScreen;
