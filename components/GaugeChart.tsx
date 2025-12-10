// This code defines a GaugeChart component that displays a circular progress gauge
// with a linear gradient overlay, showing the percentage of checked-in attendees
// at an event compared to the total registered attendees. It also includes a legend
// indicating the counts of registered and checked-in attendees.
import React from "react";
import { View, Text, StyleSheet, Dimensions, Platform } from "react-native";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import Svg, { Defs, LinearGradient, Stop } from "react-native-svg";

const { width } = Dimensions.get("window");

const registered = `1,378`;
const checkedIn = 928;
const fill = (checkedIn / parseInt(registered)) * 100;

const GaugeChart: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Event Activity Snapshot</Text>

      {/* Gauge with linear gradient overlay */}
      <View style={styles.gaugeWrapper}>
        <Svg height="0" width="0">
          <Defs>
            <LinearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <Stop offset="0%" stopColor="#AD00FF" stopOpacity="1" />
              <Stop offset="100%" stopColor="#00CFFF" stopOpacity="1" />
            </LinearGradient>
          </Defs>
        </Svg>

        <AnimatedCircularProgress
          size={220}
          width={25}
          fill={fill}
          tintColor="url(#grad)"
          backgroundColor="#E6E6E6"
          arcSweepAngle={180}
          rotation={270}
          lineCap="round"
        >
          {() => (
            <View style={styles.innerLabel}>
              <Text style={styles.centerIcon}>📍</Text>
              <Text style={styles.centerValue}>-400</Text>
            </View>
          )}
        </AnimatedCircularProgress>
      </View>

      {/* Legend and Counts */}
      <View style={styles.legendWrapper}>
        <View style={styles.legend}>
          <View style={[styles.dot, { backgroundColor: "#E6E6E6" }]} />
          <Text style={styles.label}>Registered</Text>
          <Text style={styles.value}>{registered}</Text>
        </View>

        <View style={styles.legend}>
          <View style={[styles.dot, { backgroundColor: "#8A00FF" }]} />
          <Text style={styles.label}>Checked In</Text>
          <Text style={styles.value}>{checkedIn}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 5,
    borderRadius: 16,
    width: width * 0.9,
    alignSelf: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 20,
  },
  gaugeWrapper: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 0,
  },
  innerLabel: {
    alignItems: "center",
    marginTop: Platform.OS === "ios" ? 8 : 5, // slightly reduced
  },
  centerIcon: {
    fontSize: 18,
    marginBottom: 4,
  },
  centerValue: {
    fontSize: 20,
    fontWeight: "700",
  },
  legendWrapper: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "80%",
  },
  legend: {
    alignItems: "center",
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginBottom: 4,
  },
  label: {
    fontSize: 14,
    color: "#333",
  },
  value: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000",
  },
});

export default GaugeChart;
