import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Image,
  TouchableOpacity,
  Dimensions,
  Platform,
} from "react-native";
import DownArrow from "react-native-vector-icons/Entypo";
import New_Event from "../assets/New_Event.jpg";
import Slider from "@react-native-community/slider";


const { width } = Dimensions.get("window");

export default function CreateEventScreen() {
  const [category, setCategory] = useState("");
    const [visibility, setVisibility] = useState("");
    const [isRecurring, setIsRecurring] = useState(false);
    const [recurrence, setRecurrence] = useState("Daily");
    const [geofence, setGeofence] = useState(50);


  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Top Header */}
        <View style={styles.topRow}>
          <Text style={styles.createTitle}>Create A New Event</Text>
          <Image
            source={New_Event}
            style={styles.headerImage}
            resizeMode="contain"
          />
        </View>

        {/* Card 1: Basic Information */}
        <View style={styles.card}>
          <Text style={styles.cardHeader}>Basic Information</Text>

          {/* Title */}
          <Text style={styles.inputLabel}>Title</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter event title"
            placeholderTextColor="#999"
          />

          {/* Description */}
          <Text style={styles.inputLabel}>Description</Text>
          <TextInput
            style={[styles.input, styles.largeInput]}
            placeholder="Enter event description"
            placeholderTextColor="#999"
            multiline
          />

          {/* Category */}
          <Text style={styles.inputLabel}>Category</Text>
          <View style={styles.dropdown}>
            <Text style={styles.dropdownText}>
              {category || "Select a category"}
            </Text>
            <DownArrow name="chevron-down" size={16} color="#999" />
          </View>

          {/* Visibility */}
          <Text style={styles.inputLabel}>Visibility</Text>
          <View style={styles.dropdown}>
            <Text style={styles.dropdownText}>
              {visibility || "Choose visibility"}
            </Text>
            <DownArrow name="chevron-down" size={16} color="#999" />
          </View>
        </View>

        {/* Card 2: Date & Time */}
        <View style={styles.card}>
          <Text style={styles.cardHeader}>Date & Time</Text>

          {/* Start/End Date */}
          <View style={styles.row}>
            <View style={[styles.inputGroup, { marginRight: 8 }]}>
              <Text style={styles.inputLabel}>Start Date</Text>
              <TextInput
                placeholder="MM/DD/YYYY"
                style={styles.input}
                placeholderTextColor="#999"
              />
            </View>
            <View style={[styles.inputGroup, { marginLeft: 8 }]}>
              <Text style={styles.inputLabel}>End Date</Text>
              <TextInput
                placeholder="MM/DD/YYYY"
                style={styles.input}
                placeholderTextColor="#999"
              />
            </View>
          </View>

          {/* Start/End Time */}
          <View style={styles.row}>
            <View style={[styles.inputGroup, { marginRight: 8 }]}>
              <Text style={styles.inputLabel}>Start Time</Text>
              <TextInput
                placeholder="HH:MM AM/PM"
                style={styles.input}
                placeholderTextColor="#999"
              />
            </View>
            <View style={[styles.inputGroup, { marginLeft: 8 }]}>
              <Text style={styles.inputLabel}>End Time</Text>
              <TextInput
                placeholder="HH:MM AM/PM"
                style={styles.input}
                placeholderTextColor="#999"
              />
            </View>
          </View>

          {/* Recurring Toggle */}
          <View
            style={[
              styles.row,
              { justifyContent: "space-between", marginTop: 10 },
            ]}
          >
            <Text style={styles.inputLabel}>Recurring Event?</Text>
            <TouchableOpacity
              style={[
                styles.toggleSwitch,
                { backgroundColor: isRecurring ? "#7F00FF" : "#ccc" },
              ]}
              onPress={() => setIsRecurring(!isRecurring)}
            >
              <View
                style={[styles.toggleKnob, isRecurring && { marginLeft: 22 }]}
              />
            </TouchableOpacity>
          </View>

          {/* Recurrence Fields */}
          {isRecurring && (
            <>
              <Text style={styles.inputLabel}>Recurrence Pattern</Text>
              <View style={styles.dropdown}>
                <Text style={styles.dropdownText}>{recurrence || "Daily"}</Text>
                <DownArrow name="chevron-down" size={16} color="#999" />
              </View>

              <Text style={styles.inputLabel}>Until</Text>
              <TextInput
                placeholder="MM/DD/YYYY"
                style={styles.input}
                placeholderTextColor="#999"
              />
            </>
          )}
        </View>

        {/* Card 3: Location */}
        <View style={styles.card}>
          <Text style={styles.cardHeader}>Location</Text>

          <Text style={styles.inputLabel}>Location Type</Text>
          <View style={[styles.input, { justifyContent: "center" }]}>
            <Text style={{ fontSize: 14, color: "#333" }}>Physical</Text>
          </View>

          <Text style={styles.inputLabel}>Venue Name</Text>
          <TextInput style={styles.input} />

          <Text style={styles.inputLabel}>Street Address</Text>
          <TextInput style={styles.input} />

          <View style={styles.row}>
            <View style={[styles.inputGroup, { marginRight: 8 }]}>
              <Text style={styles.inputLabel}>City</Text>
              <TextInput style={styles.input} />
            </View>
            <View style={[styles.inputGroup, { marginHorizontal: 4 }]}>
              <Text style={styles.inputLabel}>State</Text>
              <TextInput style={styles.input} />
            </View>
            <View style={[styles.inputGroup, { marginLeft: 8 }]}>
              <Text style={styles.inputLabel}>Zip</Text>
              <TextInput style={styles.input} />
            </View>
          </View>

          <Text style={styles.inputLabel}>Geofence Radius (meters)</Text>
          <View style={styles.sliderWrapper}>
            <Text style={{ color: "#333", fontWeight: "500" }}>
              {geofence} m
            </Text>
            <Slider
              style={{ flex: 1, marginLeft: 10 }}
              minimumValue={1}
              maximumValue={500}
              step={1}
              value={geofence}
              minimumTrackTintColor="#7F00FF"
              onValueChange={(value) => setGeofence(value)}
            />
          </View>
          {geofence < 50 && (
            <Text style={{ fontSize: 12, color: "red", marginTop: 4 }}>
              Minimum radius should be at least 100m
            </Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },

  scrollContainer: {
    padding: 20,
    paddingBottom: 100, // room for nav bar
  },

  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    marginBottom: 24,
    paddingLeft: 12,
  },

  createTitle: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
  },

  headerImage: {
    width: 170,
    height: 140,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  cardHeader: {
    fontSize: 16,
    fontWeight: "600",
    color: "#7F00FF",
    borderBottomWidth: 1,
    borderBottomColor: "#7F00FF",
    paddingBottom: 6,
    marginBottom: 14,
  },

  inputLabel: {
    color: "#555",
    marginBottom: 6,
    fontSize: 14,
    fontWeight: "500",
  },

  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    fontSize: 14,
    color: "#333",
    backgroundColor: "#fff",
  },

  largeInput: {
    height: 100,
    textAlignVertical: "top",
  },

  dropdown: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  dropdownText: {
    fontSize: 14,
    color: "#333",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  inputGroup: {
    flex: 1,
  },

  toggleSwitch: {
    width: 50,
    height: 26,
    borderRadius: 13,
    backgroundColor: "#ccc",
    padding: 2,
    justifyContent: "center",
  },

  toggleKnob: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#fff",
    marginLeft: 2,
  },

  sliderWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
});