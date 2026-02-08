import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const FORM_BG = "#05031B";
const VIOLET = "#7F00FF";

export default function BuzzCard() {
  return (
    <View style={styles.container}>
      {/* Top row – centered group */}
      <View style={styles.topRow}>
        <View style={styles.profileWrap}>
          <Image
            source={require("../assets/Home/profile.jpg")}
            style={styles.profile}
          />
        </View>

        <Text style={styles.username}>its_doggo</Text>

        <Ionicons name="ellipsis-horizontal" size={20} color="#FFF" />
      </View>

      {/* Text content */}
      <View style={styles.textBlock}>
        <Text style={styles.textLine}>
          I create an experience where music is remixed,
        </Text>
        <Text style={styles.textLine}>flipped and reconstructed</Text>
        <Text style={styles.textLine}>#Curated by @unruely_+@thecanterburyt</Text>
      </View>

      {/* Buttons */}
      <View style={styles.buttonWrap}>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Be My Buzz</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Contact</Text>
        </TouchableOpacity>
      </View>

      {/* Instagram */}
      <Ionicons
        name="logo-instagram"
        size={26}
        color="#FFF"
        style={styles.instagram}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: FORM_BG,
    paddingVertical: 24,
    paddingHorizontal: 16,
    alignItems: "center",
  },

  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginBottom: 18,
  },

  profileWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: VIOLET,
    justifyContent: "center",
    alignItems: "center",
  },

  profile: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },

  username: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },

  textBlock: {
    alignItems: "center",
    gap: 6,
    marginBottom: 20,
  },

  textLine: {
    color: "#D1D5DB",
    fontSize: 14,
    fontWeight: "400",
    textAlign: "center",
  },

  textLineSmall: {
    color: "#9CA3AF",
    fontSize: 13,
    fontWeight: "300",
    textAlign: "center",
  },

  buttonWrap: {
    width: "60%",
    gap: 10,
    marginBottom: 18,
  },

  button: {
    backgroundColor: "#FFF",
    borderRadius: 13,
    paddingVertical: 14,
    alignItems: "center",
  },

  buttonText: {
    color: FORM_BG,
    fontSize: 15,
    fontWeight: "700",
  },

  instagram: {
    opacity: 0.9,
  },
});
