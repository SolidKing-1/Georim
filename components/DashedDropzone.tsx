import React from "react";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface DashedDropzoneProps {
  onPress: () => void;
  label?: string;
  iconSize?: number;
  iconColor?: string;
  style?: object;
}

const DashedDropzone: React.FC<DashedDropzoneProps> = ({
  onPress,
  label = "Browse Files to Upload",
  iconSize = 38,
  iconColor = "#7F00FF",
  style = {},
}) => (
  <TouchableOpacity
    style={[styles.dashedDropzone, style]}
    onPress={onPress}
    activeOpacity={0.7}
  >
    <Ionicons
      name="cloud-upload-outline"
      size={iconSize}
      color={iconColor}
      style={{ marginBottom: 6 }}
    />
    <Text style={{ color: "#888", fontSize: 14 }}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
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
});

export default DashedDropzone;