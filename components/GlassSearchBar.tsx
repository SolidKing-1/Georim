import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";

export default function GlassSearchBar({
  value,
  onChangeText,
  onClose,
  inputRef,
  placeholder = "Categories, Groups and More",
  fullWidth = false,
}) {
  return (
    <BlurView
      intensity={40}
      tint="dark"
      style={
        fullWidth
          ? [styles.searchBarBlur, styles.searchBarBlurFull]
          : styles.searchBarBlur
      }
    >
      <View style={styles.searchBarRow}>
        <Ionicons
          name="search"
          size={22}
          color="#8F8E9B"
          style={{ marginRight: 12 }}
        />
        <TextInput
          ref={inputRef}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#8F8E9B"
          style={styles.input}
          returnKeyType="search"
          autoFocus
        />
        <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
          <Ionicons name="close" size={14} color="#000" />
        </TouchableOpacity>
      </View>
    </BlurView>
  );
}

const styles = StyleSheet.create({
  searchBarBlur: {
    borderRadius: 30,
    overflow: "hidden",
    marginHorizontal: 24,
    marginVertical: 0,
    alignSelf: "center",
    width: "92%",
    maxWidth: 480,
  },
  searchBarBlurFull: {
    marginHorizontal: 8,
    alignSelf: "stretch",
    width: "100%",
    maxWidth: 480,
  },
  searchBarRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.001)",
    borderRadius: 296,
    paddingHorizontal: 12,
    paddingVertical: 0,
    flex: 1,
    height: 52,
  },
  input: {
    flex: 1,
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
    paddingVertical: 0,
    backgroundColor: "transparent",
  },
  closeBtn: {
    marginLeft: 6,
    width: 16,
    height: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
});
