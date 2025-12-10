import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  Image,
  ActivityIndicator,
  PanResponder,
} from "react-native";
import * as Animatable from "react-native-animatable";
import MapView, { Marker, Circle } from "react-native-maps";
import * as Location from "expo-location";
import Ionicons from "react-native-vector-icons/Ionicons";
import * as Haptics from "expo-haptics";
import { useNavigation } from "@react-navigation/native";

const { width, height } = Dimensions.get("window");
const CHECK_ZONE_RADIUS = 10; // meters
const VIOLET = "#7F00FF";

export default function VerifyLocation() {
  // Animated dots for "Verifying Location..."
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  // Pulsating animation for check zone
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Location state
  const [location, setLocation] =
    useState<Location.LocationObjectCoords | null>(null);
  const [withinZone, setWithinZone] = useState(false);

  // Example event location (replace with real event location)
  const eventLocation = {
    latitude: 32.553296,
    longitude: -92.633112,
  };

  // Slide to check-in state
  const [slideX, setSlideX] = useState(new Animated.Value(0));
  const [checkedIn, setCheckedIn] = useState(false);
  const [checkingIn, setCheckingIn] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [logTime, setLogTime] = useState<string | null>(null);

  const navigation = useNavigation();

  // Animate dots
  useEffect(() => {
    const animateDots = () => {
      Animated.sequence([
        Animated.timing(dot1, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(dot2, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(dot3, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(dot1, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
        Animated.timing(dot2, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
        Animated.timing(dot3, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ]).start(() => animateDots());
    };
    animateDots();
  }, []);

  // Animate pulse
  useEffect(() => {
    if (withinZone) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 2,
            duration: 900,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 900,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [withinZone]);

  // Get user location
  useEffect(() => {
    let watcher: Location.LocationSubscription | undefined;
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;
      watcher = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.High, distanceInterval: 1 },
        (loc) => {
          setLocation(loc.coords);
          // Calculate distance and check zone using accuracy
          const userCoords = [loc.coords.latitude, loc.coords.longitude];
          const eventCoords = [eventLocation.latitude, eventLocation.longitude];
          const userAccuracy = loc.coords.accuracy ?? 0; // meters
          const eventAccuracy = 0; // If you have event accuracy, set it here

          // Use the backend logic for range check
          const distance = getDistance(
            userCoords[0],
            userCoords[1],
            eventCoords[0],
            eventCoords[1]
          );
          const combinedAccuracy = userAccuracy + eventAccuracy;
          const inRange = distance <= CHECK_ZONE_RADIUS + combinedAccuracy;
          setWithinZone(inRange);
        }
      );
    })();
    return () => watcher && watcher.remove();
  }, []);

  // Haversine formula for distance in meters
  interface LatLng {
    latitude: number;
    longitude: number;
  }

  function toRad(x: number): number {
    return (x * Math.PI) / 180;
  }

  function getDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6378137;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  // PanResponder for slider
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gesture) =>
        !checkedIn && Math.abs(gesture.dx) > 5,
      onPanResponderMove: (_, gesture) => {
        if (!checkedIn) {
          let newX = Math.max(0, Math.min(gesture.dx, width * 0.7 - 50));
          slideX.setValue(newX);

          // Vibrate every 20px moved
          if (Math.abs(newX - lastVibrateX.current) > 20) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            lastVibrateX.current = newX;
          }
        }
      },
      onPanResponderRelease: (_, gesture) => {
        if (checkedIn) return; // Prevent any action if already checked in

        if (gesture.dx > width * 0.7 - 80) {
          setCheckedIn(true);
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
          Animated.timing(slideX, {
            toValue: width * 0.7 - 50,
            duration: 200,
            useNativeDriver: false,
          }).start();
        } else {
          Animated.spring(slideX, {
            toValue: 0,
            useNativeDriver: false,
          }).start();
        }
      },
    })
  ).current;

  const lastVibrateX = useRef(0);

  // Handle check-in animation and fake backend delay
  useEffect(() => {
    if (checkedIn) {
      setCheckingIn(true);
      const timer = setTimeout(() => {
        setCheckingIn(false);
        setShowSuccess(true);
        setLogTime(
          new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })
        );
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [checkedIn]);

  // Automatically go back after success screen shows for 4 seconds
  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => {
        navigation.goBack(); // or navigation.navigate("CheckInScreen")
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess]);

  // Dummy event name for now
  const eventName = "Sample Event";

  // Success Screen
  if (showSuccess) {
    return (
      <View style={styles.successContainer}>
        <Animatable.View
          animation="bounceIn"
          duration={900}
          style={styles.successIconWrap}
        >
          <Ionicons
            name="checkmark-circle"
            size={50}
            color="#2ecc40"
            style={styles.successIcon}
          />
        </Animatable.View>
        <Animatable.Text
          animation="fadeInDown"
          delay={300}
          style={styles.successTitle}
        >
          Checked In!
        </Animatable.Text>
        <Animatable.Text
          animation="fadeIn"
          delay={600}
          style={styles.successTime}
        >
          Time Logged {logTime}
        </Animatable.Text>
        <Animatable.Image
          animation="zoomIn"
          delay={900}
          source={require("../assets/Checked_In.jpg")}
          style={styles.successImage}
          resizeMode="contain"
        />
        <Animatable.Text
          animation="fadeInUp"
          delay={1200}
          style={styles.successWelcome}
        >
          Welcome to Ruston Fest!
        </Animatable.Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Overlay for check-in progress */}
      {checkingIn && (
        <View style={styles.overlay}>
          <Text style={styles.progressText}>
            Check in to "Sample Event"{"\n"}
            <Text style={styles.inProgress}>In progress</Text>
          </Text>
          <ActivityIndicator
            size="large"
            color={VIOLET}
            style={{ marginTop: 24 }}
          />
        </View>
      )}

      {/* Hide main content when checking in */}
      {!checkingIn && (
        <>
          {/* Verifying Location... */}
          <View
            style={{ alignItems: "center", marginTop: 40, marginBottom: 16 }}
          >
            <Text style={styles.verifyingText}>
              Verifying Location
              <Animated.Text style={{ opacity: dot1 }}>.</Animated.Text>
              <Animated.Text style={{ opacity: dot2 }}>.</Animated.Text>
              <Animated.Text style={{ opacity: dot3 }}>.</Animated.Text>
            </Text>
          </View>

          {/* Map Box */}
          <View style={styles.mapBox}>
            <MapView
              style={styles.map}
              region={
                location
                  ? {
                      latitude: location.latitude,
                      longitude: location.longitude,
                      latitudeDelta: 0.0015,
                      longitudeDelta: 0.0015,
                    }
                  : {
                      latitude: eventLocation.latitude,
                      longitude: eventLocation.longitude,
                      latitudeDelta: 0.01,
                      longitudeDelta: 0.01,
                    }
              }
              showsUserLocation={false}
              showsMyLocationButton={false}
              pointerEvents="none"
            >
              {/* Event Location Marker with Pulsing Ring */}
              <Marker coordinate={eventLocation}>
                {/* Pulsing Rings */}
                {withinZone && (
                  <>
                    <Animated.View
                      style={{
                        position: "absolute",
                        width: 60,
                        height: 60,
                        borderRadius: 30,
                        borderWidth: 2,
                        borderColor: VIOLET,
                        opacity: 0.5,
                        transform: [{ scale: pulseAnim }],
                      }}
                    />
                    <Animated.View
                      style={{
                        position: "absolute",
                        width: 80,
                        height: 80,
                        borderRadius: 40,
                        borderWidth: 2,
                        borderColor: VIOLET,
                        opacity: 0.3,
                        transform: [
                          { scale: Animated.multiply(pulseAnim, 1.5) },
                        ],
                      }}
                    />
                    <Animated.View
                      style={{
                        position: "absolute",
                        width: 100,
                        height: 100,
                        borderRadius: 50,
                        borderWidth: 2,
                        borderColor: VIOLET,
                        opacity: 0.15,
                        transform: [{ scale: Animated.multiply(pulseAnim, 2) }],
                      }}
                    />
                  </>
                )}

                {/* Event Icon */}
                <Ionicons name="location" size={38} color={VIOLET} />
              </Marker>

              {/* User Marker */}
              {location && (
                <Marker
                  coordinate={{
                    latitude: location.latitude,
                    longitude: location.longitude,
                  }}
                  title="You"
                >
                  <Ionicons name="person-circle" size={38} color={VIOLET} />
                </Marker>
              )}

              {/* Check Zone Circle */}
              <Circle
                center={eventLocation}
                radius={CHECK_ZONE_RADIUS}
                strokeColor={VIOLET}
                fillColor="rgba(127,0,255,0.08)"
              />
            </MapView>
          </View>

          {/* Check zone message and Slide to Check In */}
          {withinZone && (
            <>
              <View style={styles.checkZoneMsg}>
                <Ionicons
                  name="checkmark-circle"
                  size={22}
                  color="green"
                  style={{ marginRight: 6 }}
                />
                <Text style={styles.checkZoneText}>
                  You are within the check zone
                </Text>
              </View>

              <View style={styles.sliderContainer}>
                <View style={styles.sliderTrack}>
                  <Animated.View
                    {...panResponder.panHandlers}
                    style={[
                      styles.sliderThumb,
                      { transform: [{ translateX: slideX }] },
                      checkedIn && { backgroundColor: "green" },
                    ]}
                  >
                    <Ionicons name="arrow-forward" size={24} color="#fff" />
                  </Animated.View>
                  <Text style={styles.sliderText}>
                    {checkedIn ? "Checked In!" : "Slide to Check In"}
                  </Text>
                </View>
              </View>
            </>
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  verifyingText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FFFFF",
    letterSpacing: 1,
    paddingTop: 40,
  },
  mapBox: {
    height: height * 0.5,
    marginHorizontal: 18,
    borderRadius: 18,
    overflow: "hidden",
    marginBottom: 18,
    marginTop: 20,
    backgroundColor: "#eee",
    elevation: 3,
  },
  map: {
    flex: 1,
  },
  checkZoneMsg: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 18,
  },
  checkZoneText: {
    color: "green",
    fontWeight: "600",
    fontSize: 16,
  },
  sliderContainer: {
    alignItems: "center",
    marginTop: 10,
    marginBottom: 30,
  },
  sliderTrack: {
    width: width * 0.7,
    height: 48,
    backgroundColor: "#7F00FF",
    borderRadius: 24,
    justifyContent: "center",
    overflow: "hidden",
  },
  sliderThumb: {
    position: "absolute",
    left: 0,
    top: 0,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#A259FF",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2,
    elevation: 2,
  },
  sliderText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    alignSelf: "center",
    zIndex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255,255,255,0.95)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  progressText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#222",
    textAlign: "center",
    marginBottom: 12,
  },
  inProgress: {
    fontSize: 18,
    fontWeight: "normal",
    color: "#7F00FF",
  },
  successContainer: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 23,
  },
  successIconWrap: {
    marginBottom: 18,
    backgroundColor: "#fff",
    borderRadius: 50,
    padding: 8,
    elevation: 0,
  },
  successIcon: {
    backgroundColor: "#2ecc40",
    borderRadius: 40,
    padding: 8,
    color: "#fff",
  },
  successTitle: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#2ecc40",
    marginBottom: 8,
    textAlign: "center",
  },
  successTime: {
    fontSize: 18,
    color: "#222",
    marginBottom: 14,
    textAlign: "center",
  },
  successImage: {
    width: 370,
    height: 350,
    marginBottom: 18,
    borderRadius: 16,
  },
  successWelcome: {
    fontSize: 22,
    color: "#000000",
    fontWeight: "600",
    textAlign: "center",
    marginTop: 8,
  },
});
