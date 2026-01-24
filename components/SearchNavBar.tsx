import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";

export default function SearchNavBar({ onHomePress, onSearchPress }) {
  return (
    <View style={styles.container}>
      <View style={styles.homeBtnBlur}>
        <BlurView intensity={24} tint="dark" style={StyleSheet.absoluteFill} />
        <Image
          source={require("./GlassEffects/circleGlassEffect.png")}
          style={styles.homeShine}
        />
        <TouchableOpacity style={styles.homeBtn} onPress={onHomePress}>
          <Ionicons name="home" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
      <View style={styles.searchBarBlur}>
        <BlurView intensity={24} tint="dark" style={StyleSheet.absoluteFill} />
        <Image
          source={require("./GlassEffects/Glass Effect.png")}
          style={styles.shineOverlay}
        />
        <TouchableOpacity
          style={styles.searchBar}
          onPress={onSearchPress}
          activeOpacity={1}
        >
          <Ionicons
            name="search"
            size={18}
            color="#8F8E9B"
            style={{ marginRight: 8 }}
          />
          <Text style={styles.placeholder}>Categories, Groups and More</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    justifyContent: "center",
  },
  homeBtnBlur: {
    width: 52,
    height: 52,
    borderRadius: 26,
    marginRight: 12,
    overflow: "hidden",
    position: "relative",
  },
  homeBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.001)",
  },
  homeShine: {
    ...StyleSheet.absoluteFillObject,
    width: undefined,
    height: undefined,
    resizeMode: "stretch",
    opacity: 1,
  },
  searchBarBlur: {
    flex: 1,
    height: 52,
    borderRadius: 296,
    overflow: "hidden",
    position: "relative",
  },
  shineOverlay: {
    ...StyleSheet.absoluteFillObject,
    width: undefined,
    height: undefined,
    resizeMode: "stretch",
    opacity: 1,
  },
  searchBar: {
    flex: 1,
    height: 52,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.001)",
    borderRadius: 296,
    paddingHorizontal: 18,
    paddingVertical: 0,
  },
  placeholder: {
    color: "#8F8E9B",
    fontSize: 15,
    fontWeight: "500",
  },
});
