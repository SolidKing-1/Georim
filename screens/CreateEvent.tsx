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
  KeyboardAvoidingView,
  Animated,
} from "react-native";
import DownArrow from "react-native-vector-icons/Entypo";
import New_Event from "../assets/New_Event.jpg";
import Slider from "@react-native-community/slider";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import Icon from "react-native-vector-icons/Ionicons"; // For bin icon
import Ionicons from "react-native-vector-icons/Ionicons"; // Add this import
import { useNavigation, NavigationProp } from "@react-navigation/native";
type RootStackParamList = {
  EventSuccess: undefined;
};

const { width } = Dimensions.get("window");

export default function CreateEventScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [category, setCategory] = useState("");
  const [visibility, setVisibility] = useState("");
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurrence, setRecurrence] = useState("Daily");
  const [geofence, setGeofence] = useState(50);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [untilDate, setUntilDate] = useState(new Date());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [showUntilDatePicker, setShowUntilDatePicker] = useState(false);
  const [eventImage, setEventImage] = useState<{
    uri: string;
    name: string;
  } | null>(null);
  const [additionalDescription, setAdditionalDescription] = useState("");

  const [step, setStep] = useState(0);
  const steps = ["basic", "datetime", "location", "image", "additional"];

  const categoryOptions = [
    "Religious",
    "Entertainment",
    "Corporate",
    "Educational",
  ];
  const visibilityOptions = [
    "Public - Anyone can find and register",
    "Private - Invitees only",
  ];

  const [showCategoryOptions, setShowCategoryOptions] = useState(false);
  const [showVisibilityOptions, setShowVisibilityOptions] = useState(false);
  const recurrenceOptions = [
    "Daily",
    "Weekly",
    "Monthly",
    "Weekdays Only",
    "Weekends Only",
  ];
  const [showRecurrenceOptions, setShowRecurrenceOptions] = useState(false);

  // Image picker handler
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const asset = result.assets[0];
      setEventImage({
        uri: asset.uri,
        name: asset.fileName || asset.uri.split("/").pop() || "Selected Image",
      });
    }
  };

  const [cardAnim] = useState(new Animated.Value(0));

  const animateCard = (direction = 1) => {
    Animated.sequence([
      Animated.timing(cardAnim, {
        toValue: direction * -50,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(cardAnim, {
        toValue: direction * 50,
        duration: 0,
        useNativeDriver: true,
      }),
      Animated.timing(cardAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const renderCard = () => {
    switch (steps[step]) {
      case "basic":
        return (
          <View style={styles.card}>
            {/* Basic Information */}
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
            <TouchableOpacity
              style={styles.dropdown}
              onPress={() => setShowCategoryOptions(!showCategoryOptions)}
            >
              <Text style={styles.dropdownText}>
                {category || "Select a category"}
              </Text>
              <DownArrow name="chevron-down" size={16} color="#999" />
            </TouchableOpacity>

            {showCategoryOptions &&
              categoryOptions.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.dropdownOption}
                  onPress={() => {
                    setCategory(option);
                    setShowCategoryOptions(false);
                  }}
                >
                  <Text style={styles.dropdownText}>{option}</Text>
                </TouchableOpacity>
              ))}

            {/* Visibility */}
            <Text style={styles.inputLabel}>Visibility</Text>
            <TouchableOpacity
              style={styles.dropdown}
              onPress={() => setShowVisibilityOptions(!showVisibilityOptions)}
            >
              <Text style={styles.dropdownText}>
                {visibility || "Choose visibility"}
              </Text>
              <DownArrow name="chevron-down" size={16} color="#999" />
            </TouchableOpacity>

            {showVisibilityOptions &&
              visibilityOptions.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.dropdownOption}
                  onPress={() => {
                    setVisibility(option);
                    setShowVisibilityOptions(false);
                  }}
                >
                  <Text style={styles.dropdownText}>{option}</Text>
                </TouchableOpacity>
              ))}
          </View>
        );
      case "datetime":
        return (
          <View style={styles.card}>
            {/* Date & Time */}
            <Text style={styles.cardHeader}>Date & Time</Text>

            {/* Start/End Date */}
            <View style={styles.row}>
              <View style={[styles.inputGroup, { marginRight: 8 }]}>
                <Text style={styles.inputLabel}>Start Date</Text>
                <TouchableOpacity
                  style={styles.input}
                  onPress={() => setShowStartDatePicker(true)}
                >
                  <Text style={{ color: startDate ? "#333" : "#999" }}>
                    {startDate.toLocaleDateString() || "MM/DD/YYYY"}
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={[styles.inputGroup, { marginLeft: 8 }]}>
                <Text style={styles.inputLabel}>End Date</Text>
                <TouchableOpacity
                  style={styles.input}
                  onPress={() => setShowEndDatePicker(true)}
                >
                  <Text style={{ color: endDate ? "#333" : "#999" }}>
                    {endDate.toLocaleDateString() || "MM/DD/YYYY"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Start/End Time */}
            <View style={styles.row}>
              <View style={[styles.inputGroup, { marginRight: 8 }]}>
                <Text style={styles.inputLabel}>Start Time</Text>
                <TouchableOpacity
                  style={styles.input}
                  onPress={() => setShowStartTimePicker(true)}
                >
                  <Text style={{ color: startTime ? "#333" : "#999" }}>
                    {startTime.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    }) || "HH:MM AM/PM"}
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={[styles.inputGroup, { marginLeft: 8 }]}>
                <Text style={styles.inputLabel}>End Time</Text>
                <TouchableOpacity
                  style={styles.input}
                  onPress={() => setShowEndTimePicker(true)}
                >
                  <Text style={{ color: endTime ? "#333" : "#999" }}>
                    {endTime.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    }) || "HH:MM AM/PM"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Date & Time Pickers */}
            {showStartDatePicker && (
              <DateTimePicker
                value={startDate}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  setShowStartDatePicker(false);
                  if (selectedDate) setStartDate(selectedDate);
                }}
              />
            )}
            {showEndDatePicker && (
              <DateTimePicker
                value={endDate}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  setShowEndDatePicker(false);
                  if (selectedDate) setEndDate(selectedDate);
                }}
              />
            )}
            {showStartTimePicker && (
              <DateTimePicker
                value={startTime}
                mode="time"
                display="default"
                onChange={(event, selectedTime) => {
                  setShowStartTimePicker(false);
                  if (selectedTime) setStartTime(selectedTime);
                }}
              />
            )}
            {showEndTimePicker && (
              <DateTimePicker
                value={endTime}
                mode="time"
                display="default"
                onChange={(event, selectedTime) => {
                  setShowEndTimePicker(false);
                  if (selectedTime) setEndTime(selectedTime);
                }}
              />
            )}

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
                <TouchableOpacity
                  style={styles.dropdown}
                  onPress={() =>
                    setShowRecurrenceOptions(!showRecurrenceOptions)
                  }
                >
                  <Text style={styles.dropdownText}>
                    {recurrence || "Select a pattern"}
                  </Text>
                  <DownArrow name="chevron-down" size={16} color="#999" />
                </TouchableOpacity>

                {showRecurrenceOptions &&
                  recurrenceOptions.map((option, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.dropdownOption}
                      onPress={() => {
                        setRecurrence(option);
                        setShowRecurrenceOptions(false);
                      }}
                    >
                      <Text style={styles.dropdownText}>{option}</Text>
                    </TouchableOpacity>
                  ))}

                {/* Until Date with Icon Button */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Until</Text>
                  <TouchableOpacity
                    style={styles.dateInput}
                    onPress={() => setShowUntilDatePicker(true)}
                  >
                    <Text style={{ color: untilDate ? "#333" : "#999" }}>
                      {untilDate.toLocaleDateString() || "MM/DD/YYYY"}
                    </Text>
                    <Image
                      source={require("../assets/calendar.png")} // 👈 Reuse same calendar icon
                      style={styles.iconCalendar}
                    />
                  </TouchableOpacity>
                </View>

                {/* Calendar Picker for "Until" */}
                {showUntilDatePicker && (
                  <DateTimePicker
                    value={untilDate}
                    mode="date"
                    display="default"
                    onChange={(event, selectedDate) => {
                      setShowUntilDatePicker(false);
                      if (selectedDate) setUntilDate(selectedDate);
                    }}
                  />
                )}
              </>
            )}
          </View>
        );
      case "location":
        return (
          <View style={styles.card}>
            {/* Location */}
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
        );
      case "image":
        return (
          <View style={styles.card}>
            {/* Upload Event Image */}
            <Text style={styles.cardHeader}>Upload Event Image</Text>

            {/* Dashed Dropzone */}
            <TouchableOpacity
              style={styles.dashedDropzone}
              onPress={pickImage}
              activeOpacity={0.7}
            >
              <Ionicons
                name="cloud-upload-outline"
                size={38}
                color="#7F00FF"
                style={{ marginBottom: 6 }}
              />
              <Text style={{ color: "#888", fontSize: 14 }}>
                Browse Files to Upload
              </Text>
            </TouchableOpacity>

            {/* File Info Row */}
            <View style={styles.fileInfoRow}>
              <Text style={{ color: "#555", flex: 1 }}>
                {eventImage ? eventImage.name : "No selected File"}
              </Text>
              {eventImage && (
                <TouchableOpacity onPress={() => setEventImage(null)}>
                  <Icon name="trash-outline" size={20} color="#d11a2a" />
                </TouchableOpacity>
              )}
            </View>
          </View>
        );
      case "additional":
        return (
          <View style={styles.card}>
            {/* Additional Fields */}
            <View style={styles.cardHeaderRowLine}>
              <Text style={styles.cardHeaderLabel}>Add Additional Fields</Text>
              <TouchableOpacity style={styles.addButton}>
                <Ionicons name="add" size={24} color="#7F00FF" />
              </TouchableOpacity>
            </View>

            <Text style={styles.inputLabel}>Further descriptions</Text>
            <TextInput
              style={[styles.input, styles.largeInput]}
              placeholder="Add any additional information here"
              placeholderTextColor="#999"
              multiline
              value={additionalDescription}
              onChangeText={setAdditionalDescription}
            />
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0} // tweak if header overlaps
    >
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

          {/* Render the current step's card */}
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Animated.View
              style={{
                width: "100%",
                maxWidth: 400,
                transform: [{ translateX: cardAnim }],
              }}
            >
              {renderCard()}
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginTop: 24,
                }}
              >
                {step > 0 ? (
                  <TouchableOpacity
                    style={[
                      styles.nextButton,
                      { backgroundColor: "#ccc", alignSelf: "flex-start" },
                    ]}
                    onPress={() => {
                      animateCard(-1);
                      setTimeout(() => setStep(step - 1), 200);
                    }}
                  >
                    <Ionicons name="arrow-back" size={20} color="#fff" />
                    <Text style={styles.nextButtonText}>Back</Text>
                  </TouchableOpacity>
                ) : (
                  <View />
                )}

                {step < steps.length - 1 ? (
                  <TouchableOpacity
                    style={styles.nextButton}
                    onPress={() => {
                      animateCard(1);
                      setTimeout(() => setStep(step + 1), 200);
                    }}
                  >
                    <Text style={styles.nextButtonText}>Next</Text>
                    <Ionicons name="arrow-forward" size={20} color="#fff" />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={styles.nextButton}
                    onPress={() => {
                      // Submit logic here if needed
                      navigation.navigate("EventSuccess");
                    }}
                  >
                    <Text style={styles.nextButtonText}>Finish</Text>
                  </TouchableOpacity>
                )}
              </View>
            </Animated.View>
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
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
  dropdownOption: {
    backgroundColor: "#fff",
    padding: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    marginBottom: 8,
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

  dateInput: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 12,
    backgroundColor: "#fff",
  },

  iconCalendar: {
    width: 20,
    height: 20,
    resizeMode: "contain",
  },

  sliderWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },

  dashedDropzone: {
    borderWidth: 2,
    borderColor: "#7F00FF",
    borderStyle: "dashed",
    borderRadius: 10,
    height: 90,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 18,
    marginTop: 8,
    backgroundColor: "#fafafa",
  },
  fileInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    backgroundColor: "#fff",
    minHeight: 44,
  },

  cardHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    zIndex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 4,
  },

  addButton: {
    backgroundColor: "#EFEAFE",
    borderRadius: 20,
    padding: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  cardHeaderLine: {
    borderBottomWidth: 1,
    borderBottomColor: "#7F00FF",
    marginBottom: 14,
    marginTop: 3,
  },

  cardHeaderLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#7F00FF",
    backgroundColor: "#fff",
    paddingRight: 8,
  },

  cardHeaderRowLine: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#7F00FF",
    paddingBottom: 6,
    marginBottom: 14,
    backgroundColor: "#fff",
  },

  nextButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#7F00FF",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
    marginTop: 16,
    alignSelf: "flex-end",
    elevation: 2,
  },

  nextButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    marginRight: 8,
  },
});
