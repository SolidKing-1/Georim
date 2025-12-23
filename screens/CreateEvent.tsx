import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  ScrollView,
  TextInput,
  Image,
  TouchableOpacity,
  Dimensions,
  Platform,
  KeyboardAvoidingView,
  Modal,
  ActivityIndicator,
  FlatList,
  Switch,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import DownArrow from "react-native-vector-icons/Entypo";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import Slider from "@react-native-community/slider";
import * as ImagePicker from "expo-image-picker";
import DashedDropzone from "../components/DashedDropzone";
import Constants from "expo-constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";
import axios from "axios";

const BACKEND_URL = Constants.expoConfig?.extra?.BACKEND_URL;

const { width } = Dimensions.get("window");

// Constants
const categoryOptions = [
  "Religious",
  "Entertainment",
  "Educational",
  "Corporate",
];
const visibilityOptions = [
  "Public - Anyone can view and register",
  "Private - Only invited guests can view and register",
];
const recurrenceOptions = ["Daily", "Weekly", "Monthly", "Yearly"];
const steps = ["basic", "datetime", "location", "image", "additional"];

type RootStackParamList = {
  EventSuccess: undefined;
  PaymentScreen: { eventTitle: string; eventId?: string }; // add this line
  // add other routes if needed
};

export default function CreateEventScreen() {
  const navigation =
    useNavigation<
      import("@react-navigation/native").NavigationProp<RootStackParamList>
    >();

  // State Management
  const [step, setStep] = useState(0);
  const [category, setCategory] = useState("");
  const [visibility, setVisibility] = useState("");
  const [showCategoryOptions, setShowCategoryOptions] = useState(false);
  const [showVisibilityOptions, setShowVisibilityOptions] = useState(false);
  const [showRecurrenceOptions, setShowRecurrenceOptions] = useState(false);

  // Date & Time States
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);

  // Recurring Event States
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurrence, setRecurrence] = useState("Daily");
  const [untilDate, setUntilDate] = useState(new Date());
  const [showUntilDatePicker, setShowUntilDatePicker] = useState(false);

  // Location State
  const [geofence, setGeofence] = useState(50);
  const [mapModalVisible, setMapModalVisible] = useState(false);
  const [mapRegion, setMapRegion] = useState<{
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  } | null>(null);
  const [markerCoords, setMarkerCoords] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<string>("");
  const [checkInLocation, setCheckInLocation] = useState<string>("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");

  // For dropdown suggestions
  const [citySuggestions, setCitySuggestions] = useState<string[]>([]);
  const [stateSuggestions, setStateSuggestions] = useState<string[]>([]);
  const [zipSuggestions, setZipSuggestions] = useState<string[]>([]);
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [showStateDropdown, setShowStateDropdown] = useState(false);
  const [showZipDropdown, setShowZipDropdown] = useState(false);

  // Image State
  const [eventImage, setEventImage] =
    useState<ImagePicker.ImagePickerAsset | null>(null);

  // Additional Info State
  const [additionalDescription, setAdditionalDescription] = useState("");

  // Animation
  const cardAnim = useRef(new Animated.Value(0)).current;

  interface AnimateCardDirection {
    (direction: number): void;
  }

  const animateCard: AnimateCardDirection = (direction) => {
    Animated.sequence([
      Animated.timing(cardAnim, {
        toValue: direction * width,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(cardAnim, {
        toValue: 0,
        duration: 0,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // Image Picker
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 1,
    });

    if (!result.canceled) {
      setEventImage(result.assets[0]);
    }
  };

  // More State.
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [venueName, setVenueName] = useState("");
  const [isPaidEvent, setIsPaidEvent] = useState(false);
  const [price, setPrice] = useState("");
  const [currency, setCurrency] = useState("USD"); // or "NGN"
  const [showAdvertisePrompt, setShowAdvertisePrompt] = useState(false);

  const handleFinish = async () => {
    try {
      const token = await AsyncStorage.getItem("jwt");

      if (!token) {
        alert("Authentication required. Please log in again.");
        return;
      }

      // Validate Input
      if (!title?.trim()) {
        alert("Please enter an event title");
        return;
      }
      if (!description?.trim()) {
        alert("Please enter an event description");
        return;
      }
      if (!category) {
        alert("Please select a category");
        return;
      }
      if (!visibility) {
        alert("Please select visibility");
        return;
      }
      if (!venueName?.trim()) {
        alert("Please enter a venue name");
        return;
      }
      if (!markerCoords) {
        alert("Please select a location on the map");
        return;
      }

      let imageUrl = null;

      // Step 1: Upload image first if exists
      if (eventImage) {
        try {
          const imageFormData = new FormData();
          imageFormData.append("image", {
            uri: eventImage.uri,
            type: eventImage.type || "image/jpeg",
            name: eventImage.fileName || "event-image.jpg",
          } as any);

          console.log(`${BACKEND_URL}/file/upload/image`);
          const imageResponse = await axios.post(
            `${BACKEND_URL}/file/upload/image`,
            imageFormData,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
              },
              timeout: 20000,
            }
          );

          if (imageResponse.status === 200 && imageResponse.data?.data?.imageUrl) {
            imageUrl = imageResponse.data.data.imageUrl;
            console.log("Image uploaded successfully:", imageUrl);
          } else {
            console.error("Image upload failed:", imageResponse.data);
            alert("Image upload failed. Proceeding without image.");
          }
        } catch (imageError) {
          console.error("Image upload error:", imageError);
          alert("Image upload failed. Proceeding without image.");
        }
      }

      // Step 2: Create event with JSON data
      const eventData = {
        title: title.trim(),
        description: description.trim(),
        category: category.toLowerCase(),
        visibility: visibility.split(' ')[0].toLowerCase(),
        
        dateTime: {
          start: new Date(
            startDate.getFullYear(),
            startDate.getMonth(),
            startDate.getDate(),
            startTime.getHours(),
            startTime.getMinutes()
          ).toISOString(),
          end: new Date(
            endDate.getFullYear(),
            endDate.getMonth(),
            endDate.getDate(),
            endTime.getHours(),
            endTime.getMinutes()
          ).toISOString(),
        },

        recurring: {
          isRecurring: isRecurring,
          ...(isRecurring && {
            pattern: recurrence.toLowerCase(),
            until: untilDate.toISOString(),
          }),
        },

        location: {
          venue: venueName.trim(),
          address: {
            street: street.trim() || "",
            city: city.trim() || "",
            state: state.trim() || "",
            zipCode: zip.trim() || "",
          },
          longitude: markerCoords.longitude,
          latitude: markerCoords.latitude,
          accuracy: 10,
        },

        radius: Math.max(geofence, 25),

        // Include imageUrl if upload was successful
        ...(imageUrl && { imageUrl }),

        isPaidEvent,
        ...(isPaidEvent && {
          price: parseFloat(price),
          currency,
        }),

        // TODO: UNCOMMENT THIS!
        // ...(additionalDescription?.trim() && {
        //   additionalInfo: additionalDescription.trim(),
        // }),
      };

      console.log("Creating event with data:", eventData);

      const response = await fetch(`${BACKEND_URL}/events/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(eventData),
      });

      const data = await response.json();
      console.log("Event creation response:", data);

      if (!response.ok) {
        console.error("Event creation failed:", data);
        alert(data.message || `Event creation failed: ${response.status}`);
        return;
      }

      // Show advertise prompt after successful event creation
      setShowAdvertisePrompt(true);

    } catch (err) {
      console.error("Network error:", err);
      alert("Network error. Please check your connection and try again.");
    }
  };

  // Open modal and center on user location
  const openMapModal = async () => {
    setMapModalVisible(true);
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        alert(
          "Location permission is required to select your current location."
        );
        return;
      }
      let loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest,
      });
      setMapRegion({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
      setMarkerCoords({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });
      reverseGeocode(loc.coords.latitude, loc.coords.longitude);
    } catch (e) {
      alert("Could not fetch your current location. Please try again.");
    }
  };

  // Live search for address
  const searchAddress = async (query: string) => {
    setSearchQuery(query);
    if (!query) {
      setSearchResults([]);
      return;
    }
    setSearchLoading(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query
        )}`
      );
      const data = await res.json();
      setSearchResults(data);
    } catch (e) {
      setSearchResults([]);
    }
    setSearchLoading(false);
  };

  const US_STATES = [
    "AL",
    "AK",
    "AZ",
    "AR",
    "CA",
    "CO",
    "CT",
    "DE",
    "FL",
    "GA",
    "HI",
    "ID",
    "IL",
    "IN",
    "IA",
    "KS",
    "KY",
    "LA",
    "ME",
    "MD",
    "MA",
    "MI",
    "MN",
    "MS",
    "MO",
    "MT",
    "NE",
    "NV",
    "NH",
    "NJ",
    "NM",
    "NY",
    "NC",
    "ND",
    "OH",
    "OK",
    "OR",
    "PA",
    "RI",
    "SC",
    "SD",
    "TN",
    "TX",
    "UT",
    "VT",
    "VA",
    "WA",
    "WV",
    "WI",
    "WY",
  ];

  // Helper: Reverse geocode coordinates to address
  const reverseGeocode = async (lat: number, lon: number) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
      );
      const data = await res.json();
      setSelectedAddress(data.display_name || "");
      setSearchQuery(data.display_name || "");

      // Parse address fields
      const addr = data.address || {};
      setStreet(addr.road || addr.pedestrian || addr.footway || "");
      setCity(addr.city || addr.town || addr.village || "");
      setState(addr.state || "");
      setZip(addr.postcode || "");
    } catch (e) {
      setSelectedAddress("");
      setSearchQuery("");
      setStreet("");
      setCity("");
      setState("");
      setZip("");
    }
  };

  const onCityChange = (text: string) => {
    setCity(text);
    if (text.length > 1) {
      // Optionally, fetch city suggestions from OpenStreetMap
      fetch(
        `https://nominatim.openstreetmap.org/search?city=${encodeURIComponent(
          text
        )}&country=USA&format=json`
      )
        .then((res) => res.json())
        .then((data) => {
          setCitySuggestions([
            ...new Set(
              data
                .map(
                  (item: any) =>
                    item.address.city ||
                    item.address.town ||
                    item.address.village
                )
                .filter(Boolean)
            ),
          ] as string[]);
          setShowCityDropdown(true);
        });
    } else {
      setShowCityDropdown(false);
    }
  };

  const onStateChange = (text: string) => {
    setState(text);
    if (text.length > 0) {
      setStateSuggestions(
        US_STATES.filter((s) => s.startsWith(text.toUpperCase()))
      );
      setShowStateDropdown(true);
    } else {
      setShowStateDropdown(false);
    }
  };

  const onZipChange = (text: string) => {
    setZip(text);
    if (text.length > 2) {
      // Optionally, fetch zip suggestions from OpenStreetMap
      fetch(
        `https://nominatim.openstreetmap.org/search?postalcode=${encodeURIComponent(
          text
        )}&country=USA&format=json`
      )
        .then((res) => res.json())
        .then((data) => {
          setZipSuggestions([
            ...new Set(
              data.map((item: any) => item.address.postcode).filter(Boolean)
            ),
          ] as string[]);
          setShowZipDropdown(true);
        });
    } else {
      setShowZipDropdown(false);
    }
  };

  // When user selects a search result
  const onSelectSearchResult = (item: any) => {
    const latitude = parseFloat(item.lat);
    const longitude = parseFloat(item.lon);
    setMarkerCoords({ latitude, longitude });
    setMapRegion({
      latitude,
      longitude,
      latitudeDelta: mapRegion ? mapRegion.latitudeDelta : 0.01,
      longitudeDelta: mapRegion ? mapRegion.longitudeDelta : 0.01,
    });
    setSelectedAddress(item.display_name);
    setSearchQuery(item.display_name);
    setSearchResults([]);
  };

  // When user taps on map
  const onMapPress = async (e: any) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setMarkerCoords({ latitude, longitude });
    setMapRegion({
      latitude,
      longitude,
      latitudeDelta: mapRegion ? mapRegion.latitudeDelta : 0.01,
      longitudeDelta: mapRegion ? mapRegion.longitudeDelta : 0.01,
    });
    await reverseGeocode(latitude, longitude);
  };

  // Confirm location
  const confirmLocation = () => {
    setCheckInLocation(selectedAddress || searchQuery);
    setMapModalVisible(false);
  };

  // Card Renderer
  const renderCard = () => {
    switch (steps[step]) {
      case "basic":
        return (
          <View style={styles.card}>
            <Text style={styles.cardHeader}>Basic Information</Text>

            {/* Title */}
            <TextInput
              style={styles.input}
              placeholder="Enter event title"
              placeholderTextColor="#999"
              value={title}
              onChangeText={setTitle}
            />

            {/* Description */}
            <TextInput
              style={[styles.input, styles.largeInput]}
              placeholder="Enter event description"
              placeholderTextColor="#999"
              multiline
              value={description}
              onChangeText={setDescription}
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

            {/* Paid Event Toggle */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 16,
              }}
            >
              <Text style={styles.inputLabel}>Is this a paid event?</Text>
              <Switch
                value={isPaidEvent}
                onValueChange={setIsPaidEvent}
                thumbColor={isPaidEvent ? "#7F00FF" : "#ccc"}
                trackColor={{ false: "#ccc", true: "#EFEAFE" }}
                style={{ marginLeft: 12 }}
              />
            </View>

            {/* Price and Currency */}
            {isPaidEvent && (
              <>
                <Text style={styles.inputLabel}>Price</Text>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 16,
                  }}
                >
                  <TextInput
                    style={[styles.input, { flex: 1, marginLeft: 3 }]}
                    placeholder="Enter price"
                    placeholderTextColor="#999"
                    keyboardType="numeric"
                    value={price}
                    onChangeText={setPrice}
                  />
                  <TouchableOpacity
                    style={[
                      styles.dropdown,
                      { width: 80, marginLeft: 8, marginBottom: 15 },
                    ]}
                    onPress={() =>
                      setCurrency(currency === "USD" ? "NGN" : "USD")
                    }
                  >
                    <Text style={styles.dropdownText}>{currency}</Text>
                    <DownArrow name="chevron-down" size={16} color="#999" />
                  </TouchableOpacity>
                </View>
              </>
            )}

            {/* Remove the duplicate Next/Finish button here! */}
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

            <Text style={styles.inputLabel}>Check-In-Location</Text>
            <TouchableOpacity
              style={[styles.input, { justifyContent: "center" }]}
              onPress={openMapModal}
            >
              <Text
                style={{
                  fontSize: 14,
                  color: checkInLocation ? "#333" : "#999",
                }}
              >
                {checkInLocation || "Choose coordinates from map"}
              </Text>
            </TouchableOpacity>

            <Text style={styles.inputLabel}>Venue Name</Text>
                      <TextInput 
            style={styles.input} 
            placeholder="Enter venue name"
            value={venueName}
            onChangeText={setVenueName}
          />

            <Text style={styles.inputLabel}>Street Address</Text>
            <TextInput
              style={styles.input}
              value={street}
              onChangeText={setStreet}
            />

            <View style={styles.row}>
              {/* City */}
              <View style={[styles.inputGroup, { marginRight: 6 }]}>
                <Text style={styles.inputLabel}>City</Text>
                <TextInput
                  style={styles.input}
                  value={city}
                  placeholder="City"
                  onChangeText={onCityChange}
                  onFocus={() => city && setShowCityDropdown(true)}
                  onBlur={() =>
                    setTimeout(() => setShowCityDropdown(false), 200)
                  }
                />
                {showCityDropdown && citySuggestions.length > 0 && (
                  <View style={styles.dropdownList}>
                    {citySuggestions.map((suggestion, idx) => (
                      <TouchableOpacity
                        key={idx}
                        onPress={() => {
                          setCity(suggestion);
                          setShowCityDropdown(false);
                        }}
                      >
                        <Text style={styles.dropdownItem}>{suggestion}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
              {/* State */}
              <View style={[styles.inputGroup, { marginHorizontal: 6 }]}>
                <Text style={styles.inputLabel}>State</Text>
                <TextInput
                  style={styles.input}
                  value={state}
                  placeholder="State"
                  onChangeText={onStateChange}
                  onFocus={() => state && setShowStateDropdown(true)}
                  onBlur={() =>
                    setTimeout(() => setShowStateDropdown(false), 200)
                  }
                  maxLength={2}
                  autoCapitalize="characters"
                />
                {showStateDropdown && stateSuggestions.length > 0 && (
                  <View style={styles.dropdownList}>
                    {stateSuggestions.map((suggestion, idx) => (
                      <TouchableOpacity
                        key={idx}
                        onPress={() => {
                          setState(suggestion);
                          setShowStateDropdown(false);
                        }}
                      >
                        <Text style={styles.dropdownItem}>{suggestion}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
              {/* Zip */}
              <View style={[styles.inputGroup, { marginLeft: 6 }]}>
                <Text style={styles.inputLabel}>Zip</Text>
                <TextInput
                  style={styles.input}
                  value={zip}
                  placeholder="Zip"
                  onChangeText={onZipChange}
                  onFocus={() => zip && setShowZipDropdown(true)}
                  onBlur={() =>
                    setTimeout(() => setShowZipDropdown(false), 200)
                  }
                  keyboardType="numeric"
                  maxLength={10}
                />
                {showZipDropdown && zipSuggestions.length > 0 && (
                  <View style={styles.dropdownList}>
                    {zipSuggestions.map((suggestion, idx) => (
                      <TouchableOpacity
                        key={idx}
                        onPress={() => {
                          setZip(suggestion);
                          setShowZipDropdown(false);
                        }}
                      >
                        <Text style={styles.dropdownItem}>{suggestion}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
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
                Minimum radius should be at least 50m
              </Text>
            )}

            {/* Map Modal Trigger */}
            <TouchableOpacity
              style={styles.mapButton}
              onPress={() => setMapModalVisible(true)}
            >
              <Ionicons name="map-outline" size={16} color="#fff" />
              <Text style={styles.mapButtonText}>Select on Map</Text>
            </TouchableOpacity>

            {/* Map Modal */}
            <Modal
              visible={mapModalVisible}
              animationType="slide"
              transparent={true}
            >
              <KeyboardAvoidingView
                style={styles.modalContainer}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
              >
                <View style={styles.modalContentExpanded}>
                  <Text style={styles.modalTitle}>Select Location on Map</Text>
                  <MapView
                    provider={PROVIDER_GOOGLE}
                    style={styles.mapExpanded}
                    region={
                      mapRegion || {
                        latitude: 37.0902, // fallback: center of USA
                        longitude: -95.7129,
                        latitudeDelta: 0.5,
                        longitudeDelta: 0.5,
                      }
                    }
                    onRegionChangeComplete={setMapRegion}
                    onPress={onMapPress}
                  >
                    {markerCoords && <Marker coordinate={markerCoords} />}
                  </MapView>
                  <View style={styles.searchContainer}>
                    <TextInput
                      style={styles.searchInput}
                      placeholder="Search address..."
                      placeholderTextColor="#999"
                      value={searchQuery}
                      onChangeText={searchAddress}
                    />
                    {searchLoading && (
                      <ActivityIndicator
                        size="small"
                        color="#7F00FF"
                        style={{ marginLeft: 8 }}
                      />
                    )}
                  </View>
                  {searchResults.length > 0 && (
                    <FlatList
                      data={searchResults}
                      keyExtractor={(item) => item.place_id.toString()}
                      renderItem={({ item }) => (
                        <TouchableOpacity
                          style={styles.searchResultItem}
                          onPress={() => onSelectSearchResult(item)}
                        >
                          <Text style={styles.searchResultText}>
                            {item.display_name}
                          </Text>
                        </TouchableOpacity>
                      )}
                      style={styles.searchResultsList}
                      keyboardShouldPersistTaps="handled"
                    />
                  )}
                  <TouchableOpacity
                    style={styles.confirmLocationButton}
                    onPress={confirmLocation}
                  >
                    <Text style={styles.confirmLocationText}>
                      Confirm Location
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.closeModalButton}
                    onPress={() => setMapModalVisible(false)}
                  >
                    <Ionicons name="close" size={24} color="#fff" />
                  </TouchableOpacity>
                </View>
              </KeyboardAvoidingView>
            </Modal>
          </View>
        );
      case "image":
        return (
          <View style={styles.card}>
            {/* Upload Event Image */}
            <Text style={styles.cardHeader}>Upload Event Image</Text>

            <DashedDropzone onPress={pickImage} />

            {/* File Info Row */}
            <View style={styles.fileInfoRow}>
              <Text style={{ color: "#555", flex: 1 }}>
                {eventImage
                  ? eventImage.fileName || eventImage.uri
                  : "No selected File"}
              </Text>
              {eventImage && (
                <TouchableOpacity onPress={() => setEventImage(null)}>
                  <Ionicons name="trash-outline" size={20} color="#d11a2a" />
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

            {/* Advertise Event Option */}
            <View style={{ flexDirection: "row", alignItems: "center", marginTop: 20 }}>
              <Text style={styles.inputLabel}>Advertise this event on Explore?</Text>
              <Switch
                value={showAdvertisePrompt}
                onValueChange={setShowAdvertisePrompt}
                thumbColor={showAdvertisePrompt ? "#7F00FF" : "#ccc"}
                trackColor={{ false: "#ccc", true: "#EFEAFE" }}
                style={{ marginLeft: 12 }}
              />
            </View>
          </View>
        );
      default:
        return null;
    }
  };

  // Add this function to handle navigation to payment page
  const handleAdvertise = () => {
    setShowAdvertisePrompt(false);
    navigation.navigate("PaymentScreen", {
      eventTitle: title,
      eventId: "1234",/* pass the created event's ID here if available */
    });
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
    >
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {/* Top Header */}
          <View style={styles.topRow}>
            <Text style={styles.createTitle}>Create A New Event</Text>
            <Image
              source={{
                uri: "https://eliazar-applications.s3.us-east-2.amazonaws.com/georim/1748655652532-4860d545-2e1c-4eaf-a156-a189ae3dc8c9-New_Event.jpg",
              }}
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
                    onPress={handleFinish}
                  >
                    <Text style={styles.nextButtonText}>Finish</Text>
                  </TouchableOpacity>
                )}
              </View>
            </Animated.View>
          </View>
        </ScrollView>

        {/* Advertise Prompt Modal */}
        {showAdvertisePrompt && (
          <Modal
            visible={showAdvertisePrompt}
            transparent
            animationType="fade"
            onRequestClose={() => setShowAdvertisePrompt(false)}
          >
            <View style={{
              flex: 1,
              backgroundColor: "rgba(0,0,0,0.5)",
              justifyContent: "center",
              alignItems: "center"
            }}>
              <View style={{
                backgroundColor: "#fff",
                borderRadius: 16,
                padding: 24,
                alignItems: "center",
                width: "80%"
              }}>
                <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 12 }}>
                  Advertise Event?
                </Text>
                <Text style={{ fontSize: 15, color: "#555", marginBottom: 24, textAlign: "center" }}>
                  Do you want to advertise this event on the Explore page? This will require a payment.
                </Text>
                <View style={{ flexDirection: "row", gap: 14 }}>
                  <TouchableOpacity
                    style={[styles.nextButton, { backgroundColor: "#7F00FF" }]}
                    onPress={handleAdvertise}
                  >
                    <Text style={styles.nextButtonText}>Yes, Advertise</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.nextButton, { backgroundColor: "#ccc" }]}
                    onPress={() => {
                      setShowAdvertisePrompt(false);
                      navigation.navigate("EventSuccess");
                    }}
                  >
                    <Text style={styles.nextButtonText}>No, Thanks</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        )}
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
    paddingTop: 0,
    paddingBottom: 100, // room for nav bar
  },

  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    marginBottom: 24,
    paddingLeft: 12,
    paddingTop: 10,
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
    paddingHorizontal: 18,
    borderRadius: 24,
    marginTop: 8,
    alignSelf: "flex-end",
    elevation: 2,
  },

  nextButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    marginRight: 8,
  },

  // New styles for map modal
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },

  modalContent: {
    width: "90%",
    maxWidth: 400,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    elevation: 4,
  },

  modalContentExpanded: {
    width: "96%",
    maxWidth: 500,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    elevation: 4,
    maxHeight: "90%",
    alignSelf: "center",
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },

  map: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 12,
  },

  mapExpanded: {
    width: "100%",
    height: 340,
    borderRadius: 10,
    marginBottom: 12,
  },

  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
  },

  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#333",
    padding: 8,
    borderRadius: 10,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
  },

  searchResultsList: {
    maxHeight: 150,
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 2,
  },

  searchResultItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },

  searchResultText: {
    fontSize: 14,
    color: "#333",
  },

  dropdownList: {
    position: "absolute",
    top: 48,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    zIndex: 10,
    maxHeight: 120,
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    fontSize: 14,
    color: "#333",
  },

  confirmLocationButton: {
    backgroundColor: "#7F00FF",
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    elevation: 2,
  },

  confirmLocationText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },

  closeModalButton: {
    position: "absolute",
    top: 16,
    right: 16,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 50,
    padding: 8,
    elevation: 2,
  },

  mapButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#7F00FF",
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 20,
    marginTop: 16,
    alignSelf: "flex-start",
    elevation: 2,
  },
  mapButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: 8
  }
});
