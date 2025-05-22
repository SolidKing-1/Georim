import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../App"; // Adjust the path to where RootStackParamList is defined

export default function Cancelpage() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  return (
    <View style={styles.container}>
      {/* Success Message */}
      <Text style={styles.title}>Event Canceled</Text>
      <Text style={styles.description}>
        You have successfully canceled your registered event.
      </Text>

      {/* Graphic/Image */}
      <Image
        source={require("../assets/CancelPage.jpg")} // Ensure this path is correct
        style={styles.image}
        resizeMode="contain"
      />

      {/* Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.buttonText}>Go Back</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#7F00FF",
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    color: "#666",
    marginBottom: 30,
  },
  image: {
    width: 500,
    height: 350,
    marginBottom: 30,
  },
  backButton: {
    backgroundColor: "#7F00FF",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
