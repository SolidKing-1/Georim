import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  TextInput,
  FlatList,
  Animated,
  Dimensions,
  Share,
  Alert,
} from "react-native";
import GaugeChart from "../components/GaugeChart";
import Icon from "react-native-vector-icons/Ionicons";
import QRCode from "react-native-qrcode-svg";
import * as Clipboard from "expo-clipboard";

import Icon1 from "../assets/activity-snapshot/attendees.png";
import Icon2 from "../assets/activity-snapshot/download.png";
import Icon3 from "../assets/activity-snapshot/qr-code.png";

const DUMMY_ATTENDEES = [
  {
    name: "John Smith",
    email: "john.smith@email.com",
    time: "09:15 AM",
    checkedIn: true,
  },
  {
    name: "John Smith",
    email: "john.smith@email.com",
    time: "09:15 AM",
    checkedIn: true,
  },
  {
    name: "John Smith",
    email: "john.smith@email.com",
    time: "09:15 AM",
    checkedIn: false,
  },
  {
    name: "John Smith",
    email: "john.smith@email.com",
    time: "09:15 AM",
    checkedIn: true,
  },
  {
    name: "John Smith",
    email: "john.smith@email.com",
    time: "09:15 AM",
    checkedIn: false,
  },
  {
    name: "John Smith",
    email: "john.smith@email.com",
    time: "09:15 AM",
    checkedIn: true,
  },
];

const { width, height } = Dimensions.get("window");

const EVENT_ACCESS_CODE = "AB12CD34"; // You can generate this dynamically

const ActivitySnapshot: React.FC = () => {
  const [activeTab, setActiveTab] = useState("Home");
  const navSlideAnim = useRef(new Animated.Value(100)).current;

  useEffect(() => {
    Animated.timing(navSlideAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);
  const [showAttendeeModal, setShowAttendeeModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [search, setSearch] = useState("");
  const [exportFormat, setExportFormat] = useState<"csv" | "pdf">("csv");
  const [showQRModal, setShowQRModal] = useState(false);

  const filteredAttendees = DUMMY_ATTENDEES.filter(
    (a) =>
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleCopyCode = () => {
    Clipboard.setStringAsync(EVENT_ACCESS_CODE);
    Alert.alert("Copied!", "Access code copied to clipboard.");
  };

  const handleShareCode = async () => {
    try {
      await Share.share({
        message: `Event Access Code: ${EVENT_ACCESS_CODE}`,
      });
    } catch (error) {
      Alert.alert("Error", "Could not share the code.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <GaugeChart />

      <View style={styles.cardsContainer}>
        {/* Card 1 */}
        <TouchableOpacity
          style={styles.card}
          onPress={() => setShowAttendeeModal(true)}
        >
          <Image
            source={{
              uri: "https://eliazar-applications.s3.us-east-2.amazonaws.com/georim/1748582868638-890874d6-ef76-4f22-8611-013b0ff55f0c-attendees.png",
            }}
            style={styles.cardIcon}
          />
          <View style={styles.cardTextContainer}>
            <Text style={styles.cardTitle}>View & Edit Attendees</Text>
            <Text style={styles.cardSubtitle}>
              Check-in status and attendee detail.
            </Text>
          </View>
        </TouchableOpacity>

        {/* Card 2 */}
        <TouchableOpacity
          style={styles.card}
          onPress={() => setShowExportModal(true)}
        >
          <Image
            source={{
              uri: "https://eliazar-applications.s3.us-east-2.amazonaws.com/georim/1748583835407-7a3b6d6f-a6d9-4ad1-a3dd-449f60a24cc7-download.png",
            }}
            style={styles.cardIcon}
          />
          <View style={styles.cardTextContainer}>
            <Text style={styles.cardTitle}>Export Attendance Sheet</Text>
            <Text style={styles.cardSubtitle}>Download as CSV or PDF.</Text>
          </View>
        </TouchableOpacity>

        {/* Card 3 */}
        <TouchableOpacity
          style={styles.card}
          onPress={() => setShowQRModal(true)}
        >
          <Image
            source={{
              uri: "https://eliazar-applications.s3.us-east-2.amazonaws.com/georim/1748583958025-6080ef35-0329-4b7d-bafb-33081b777864-qr-code.png",
            }}
            style={styles.cardIcon}
          />
          <View style={styles.cardTextContainer}>
            <Text style={styles.cardTitle}>Event QR Code</Text>
            <Text style={styles.cardSubtitle}>
              Display, copy or share access code.
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Attendee List Modal */}
      <Modal
        visible={showAttendeeModal}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setShowAttendeeModal(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowAttendeeModal(false)}>
              <Icon name="arrow-back" size={28} color="#4f46e5" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Attendee List</Text>
          </View>
          {/* Search Bar */}
          <View style={styles.searchBar}>
            <Icon
              name="search"
              size={20}
              color="#888"
              style={{ marginLeft: 10 }}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Search attendees"
              placeholderTextColor="#aaa"
              value={search}
              onChangeText={setSearch}
            />
          </View>
          {/* List Header */}
          <View style={styles.listHeader}>
            <Text style={styles.listHeaderLabel}>ATTENDEES</Text>
            <Text style={styles.listHeaderStatus}>STATUS</Text>
          </View>
          {/* Attendee List */}
          <FlatList
            data={filteredAttendees}
            keyExtractor={(_, idx) => idx.toString()}
            renderItem={({ item }) => (
              <View style={styles.attendeeRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.attendeeName}>{item.name}</Text>
                  <Text style={styles.attendeeEmail}>{item.email}</Text>
                  <Text style={styles.attendeeTime}>{item.time}</Text>
                </View>
                <View style={styles.statusIconWrapper}>
                  {item.checkedIn ? (
                    <View style={styles.checkedInIcon}>
                      <Icon name="checkmark" size={18} color="#fff" />
                    </View>
                  ) : (
                    <View style={styles.notCheckedInIcon}>
                      <Icon name="close" size={18} color="#fff" />
                    </View>
                  )}
                </View>
              </View>
            )}
            ItemSeparatorComponent={() => (
              <View style={styles.attendeeSeparator} />
            )}
            contentContainerStyle={{ paddingBottom: 30 }}
          />
        </SafeAreaView>
      </Modal>

      {/* Export Modal */}
      <Modal
        visible={showExportModal}
        animationType="fade"
        transparent
        onRequestClose={() => setShowExportModal(false)}
      >
        <View style={styles.exportModalOverlay}>
          <View style={styles.exportModalCard}>
            {/* Header */}
            <View style={styles.exportModalHeader}>
              <Text style={styles.exportModalTitle}>
                Export Attendance Sheet
              </Text>
              <TouchableOpacity onPress={() => setShowExportModal(false)}>
                <Icon name="close" size={24} color="#4f46e5" />
              </TouchableOpacity>
            </View>
            <View style={styles.exportModalDivider} />

            {/* Body */}
            <Text style={styles.exportModalPrompt}>
              Select the format for your attendance sheet export:
            </Text>

            {/* CSV Option */}
            <TouchableOpacity
              style={[
                styles.exportOptionCard,
                exportFormat === "csv" && styles.exportOptionCardSelected,
              ]}
              onPress={() => setExportFormat("csv")}
              activeOpacity={0.8}
            >
              <View style={styles.radioOuter}>
                {exportFormat === "csv" && <View style={styles.radioInner} />}
              </View>
              <View style={{ marginLeft: 14 }}>
                <Text style={styles.exportOptionTitle}>CSV Format</Text>
                <Text style={styles.exportOptionDesc}>
                  Compatible with Excel, Google Sheets, etc.
                </Text>
              </View>
            </TouchableOpacity>

            {/* PDF Option */}
            <TouchableOpacity
              style={[
                styles.exportOptionCard,
                exportFormat === "pdf" && styles.exportOptionCardSelected,
              ]}
              onPress={() => setExportFormat("pdf")}
              activeOpacity={0.8}
            >
              <View style={styles.radioOuter}>
                {exportFormat === "pdf" && <View style={styles.radioInner} />}
              </View>
              <View style={{ marginLeft: 14 }}>
                <Text style={styles.exportOptionTitle}>PDF Format</Text>
                <Text style={styles.exportOptionDesc}>
                  Professional document format
                </Text>
              </View>
            </TouchableOpacity>

            {/* Buttons */}
            <View style={styles.exportModalButtons}>
              <TouchableOpacity
                style={styles.exportCancelBtn}
                onPress={() => setShowExportModal(false)}
              >
                <Text style={styles.exportCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.exportBtn}
                onPress={() => {
                  // TODO: Implement export logic
                  setShowExportModal(false);
                }}
              >
                <Text style={styles.exportBtnText}>Export</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* QR Code Modal */}
      <Modal
        visible={showQRModal}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setShowQRModal(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowQRModal(false)}>
              <Icon name="arrow-back" size={28} color="#4f46e5" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Event QR Code</Text>
          </View>

          {/* Main QR Card */}
          <View style={styles.qrMainCard}>
            <Text style={styles.qrPrompt}>
              Scan this QR Code to check in to the event:
            </Text>
            <View style={styles.qrBox}>
              <QRCode value={EVENT_ACCESS_CODE} size={140} />
            </View>
            <View style={styles.accessCodeBox}>
              <Text style={styles.accessCodeLabel}>Access Code</Text>
              <Text style={styles.accessCodeValue}>{EVENT_ACCESS_CODE}</Text>
            </View>
            <View style={styles.qrButtonRow}>
              <TouchableOpacity
                style={styles.qrCopyBtn}
                onPress={handleCopyCode}
              >
                <Icon
                  name="copy-outline"
                  size={18}
                  color="#4f46e5"
                  style={{ marginRight: 6 }}
                />
                <Text style={styles.qrCopyBtnText}>Copy Code</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.qrShareBtn}
                onPress={handleShareCode}
              >
                <Icon
                  name="share-social-outline"
                  size={18}
                  color="#fff"
                  style={{ marginRight: 6 }}
                />
                <Text style={styles.qrShareBtnText}>Share</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* How Check-in Works Box */}
          <View style={styles.howItWorksBox}>
            <Text style={styles.howItWorksTitle}>How Check-in Works</Text>
            <Text style={styles.howItWorksDesc}>
              Show this QR code or share your access code with event staff at
              the entrance. They will scan the code or enter the access code to
              confirm your attendance and check you in quickly and securely.
            </Text>
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8FF",
    justifyContent: "flex-start",
  },
  cardsContainer: {
    flex: 1,
    justifyContent: "space-evenly",
    marginTop: 20,
    marginBottom: 110, // leave space for navbar
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 18,
    marginHorizontal: 20,
    marginVertical: 4,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  cardIcon: {
    width: 44,
    height: 44,
    marginRight: 18,
    resizeMode: "contain",
  },
  cardTextContainer: {
    flex: 1,
    justifyContent: "center",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#222",
  },
  cardSubtitle: {
    fontSize: 13,
    color: "#666",
    marginTop: 3,
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 0,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#222",
    marginLeft: 16,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F3F7",
    borderRadius: 10,
    marginHorizontal: 18,
    marginTop: 18,
    marginBottom: 10,
    height: 44,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    marginLeft: 10,
    color: "#222",
  },
  listHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 18,
    marginTop: 10,
    marginBottom: 4,
  },
  listHeaderLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: "#4f46e5",
  },
  listHeaderStatus: {
    fontSize: 15,
    fontWeight: "600",
    color: "#4f46e5",
  },
  attendeeRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#4f46e5",
    borderRadius: 10,
    marginHorizontal: 18,
    padding: 12,
    marginBottom: 0,
  },
  attendeeName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#222",
  },
  attendeeEmail: {
    fontSize: 13,
    color: "#666",
    marginTop: 2,
  },
  attendeeTime: {
    fontSize: 12,
    color: "#888",
    marginTop: 2,
  },
  statusIconWrapper: {
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
  },
  checkedInIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#22c55e",
    alignItems: "center",
    justifyContent: "center",
  },
  notCheckedInIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#aaa",
    alignItems: "center",
    justifyContent: "center",
  },
  attendeeSeparator: {
    height: 1,
    backgroundColor: "#4f46e5",
    marginVertical: 8,
    marginHorizontal: 18,
    borderRadius: 1,
  },
  exportModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.18)",
    justifyContent: "center",
    alignItems: "center",
  },
  exportModalCard: {
    width: width * 0.88,
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 22,
    shadowColor: "#000",
    shadowOpacity: 0.13,
    shadowRadius: 16,
    elevation: 8,
  },
  exportModalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  exportModalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#222",
  },
  exportModalDivider: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 8,
    borderRadius: 1,
  },
  exportModalPrompt: {
    fontSize: 15,
    color: "#444",
    marginBottom: 18,
    marginTop: 2,
  },
  exportOptionCard: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
    backgroundColor: "#fafbff",
  },
  exportOptionCardSelected: {
    borderColor: "#4f46e5",
    backgroundColor: "#f3f0ff",
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: "#4f46e5",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#4f46e5",
  },
  exportOptionTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#222",
  },
  exportOptionDesc: {
    fontSize: 12,
    color: "#888",
    marginTop: 2,
  },
  exportModalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 18,
  },
  exportCancelBtn: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
    backgroundColor: "#f3f3f7",
  },
  exportCancelText: {
    color: "#4f46e5",
    fontWeight: "600",
    fontSize: 15,
  },
  exportBtn: {
    paddingVertical: 10,
    paddingHorizontal: 28,
    borderRadius: 8,
    backgroundColor: "#4f46e5",
  },
  exportBtnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },
  qrMainCard: {
    backgroundColor: "#fff",
    borderRadius: 18,
    marginHorizontal: 18,
    marginTop: 30,
    padding: 22,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  qrPrompt: {
    fontSize: 15,
    color: "#444",
    textAlign: "center",
    marginBottom: 16,
    fontWeight: "500",
  },
  qrBox: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 18,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#eee",
    marginBottom: 18,
    alignSelf: "center",
  },
  accessCodeBox: {
    backgroundColor: "#F3F3F7",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 18,
    alignItems: "center",
    marginBottom: 16,
    width: "100%",
  },
  accessCodeLabel: {
    color: "#888",
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 2,
  },
  accessCodeValue: {
    fontSize: 22,
    fontWeight: "700",
    color: "#4f46e5",
    letterSpacing: 2,
  },
  qrButtonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 6,
  },
  qrCopyBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f3f3f7",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 18,
    marginRight: 8,
    flex: 1,
    justifyContent: "center",
  },
  qrCopyBtnText: {
    color: "#4f46e5",
    fontWeight: "600",
    fontSize: 15,
  },
  qrShareBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4f46e5",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 18,
    flex: 1,
    justifyContent: "center",
    marginLeft: 8,
  },
  qrShareBtnText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 15,
  },
  howItWorksBox: {
    backgroundColor: "#fff",
    borderRadius: 14,
    marginHorizontal: 18,
    marginTop: 28,
    padding: 18,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  howItWorksTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#4f46e5",
    marginBottom: 6,
  },
  howItWorksDesc: {
    fontSize: 14,
    color: "#444",
    lineHeight: 20,
  },
  // ...rest of your styles...
});

export default ActivitySnapshot;
