import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  TouchableOpacity,
  PanResponder,
} from "react-native";
import MapView, { Marker, Circle } from "react-native-maps";
import * as Location from "expo-location";
import Ionicons from "react-native-vector-icons/Ionicons";
import * as Haptics from "expo-haptics";

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
          // Calculate distance to event
          const dist = getDistance(
            loc.coords.latitude,
            loc.coords.longitude,
            eventLocation.latitude,
            eventLocation.longitude
          );
          setWithinZone(dist <= CHECK_ZONE_RADIUS);
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

  return (
    <View style={styles.container}>
      {/* Verifying Location... */}
      <View style={{ alignItems: "center", marginTop: 40, marginBottom: 16 }}>
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
          {/* Event location marker */}
          <Marker
            coordinate={eventLocation}
            title="Event Location"
            pinColor={VIOLET}
          />
          {/* User location marker with pulse */}
          {location && (
            <>
              {withinZone && (
                <Animated.View
                  style={{
                    position: "absolute",
                    left: -30,
                    top: -30,
                    width: 60,
                    height: 60,
                    borderRadius: 30,
                    borderWidth: 2,
                    borderColor: VIOLET,
                    opacity: 0.5,
                    transform: [{ scale: pulseAnim }],
                  }}
                  pointerEvents="none"
                />
              )}
              <Marker
                coordinate={{
                  latitude: location.latitude,
                  longitude: location.longitude,
                }}
                title="You"
              >
                <Ionicons name="person-circle" size={38} color={VIOLET} />
              </Marker>
            </>
          )}
          {/* Draw check zone */}
          <Circle
            center={eventLocation}
            radius={CHECK_ZONE_RADIUS}
            strokeColor={VIOLET}
            fillColor="rgba(127,0,255,0.08)"
          />
        </MapView>
      </View>

      {/* Check zone message */}
      {withinZone && (
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
      )}

      {/* Slide to Check In */}
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
});
