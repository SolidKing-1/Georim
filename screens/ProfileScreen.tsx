import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";

export default function ProfileScreen() {
  const [fullName, setFullName] = useState("James koght");
  const [displayName, setDisplayName] = useState("James");
  const [email, setEmail] = useState("jkoght2@gmail.com");
  const [phone, setPhone] = useState("+1 (318) 345 9987");
  const [location, setLocation] = useState("403 Main Street, LA");
  const [password, setPassword] = useState("************");

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Profile</Text>
        <View style={styles.avatarContainer}>
          <Image
            source={{ uri: "https://randomuser.me/api/portraits/men/1.jpg" }}
            style={styles.avatar}
          />
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={styles.input}
            value={fullName}
            onChangeText={setFullName}
            editable={false}
          />
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Display Name</Text>
          <TextInput
            style={styles.input}
            value={displayName}
            onChangeText={setDisplayName}
            editable={false}
          />
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Email Address</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            editable={false}
            keyboardType="email-address"
          />
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Phone Number</Text>
          <View style={styles.phoneRow}>
            <Image
              source={{ uri: "https://flagcdn.com/us.png" }}
              style={styles.flag}
            />
            <TextInput
              style={styles.phoneInput}
              value={phone}
              onChangeText={setPhone}
              editable={false}
              keyboardType="phone-pad"
            />
          </View>
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Location</Text>
          <TextInput
            style={styles.input}
            value={location}
            onChangeText={setLocation}
            editable={false}
          />
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            editable={false}
          />
        </View>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Update Profile</Text>
        </TouchableOpacity>
      </ScrollView>
      <View style={styles.tabBar}>
        <TouchableOpacity style={styles.tabItem}>
          <Ionicons name="home" size={24} color="#A259FF" />
          <Text style={styles.tabLabelActive}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem}>
          <Feather name="search" size={24} color="#92929D" />
          <Text style={styles.tabLabel}>Explore</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem}>
          <Ionicons name="add-circle-outline" size={24} color="#92929D" />
          <Text style={styles.tabLabel}>Create</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem}>
          <Feather name="check-square" size={24} color="#92929D" />
          <Text style={styles.tabLabel}>Check-In</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem}>
          <Feather name="user" size={24} color="#92929D" />
          <Text style={styles.tabLabel}>Account</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F9F9",
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 120,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 16,
    color: "#000",
  },
  avatarContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 4,
    borderColor: "#A259FF",
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: "#6B6B6B",
    marginBottom: 4,
  },
  input: {
    backgroundColor: "#EFEFEF",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    color: "#222",
  },
  phoneRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EFEFEF",
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  flag: {
    width: 28,
    height: 20,
    borderRadius: 4,
    marginRight: 8,
  },
  phoneInput: {
    flex: 1,
    fontSize: 16,
    color: "#222",
    paddingVertical: 10,
  },
  button: {
    backgroundColor: "#A259FF",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 16,
  },
  buttonText: {
    color: "#FFF",
    fontWeight: "600",
    fontSize: 16,
  },
  tabBar: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: 70,
    alignItems: "center",
    justifyContent: "space-around",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: -2 },
    shadowRadius: 8,
    elevation: 10,
  },
  tabItem: {
    alignItems: "center",
    justifyContent: "center",
  },
  tabLabel: {
    fontSize: 12,
    color: "#92929D",
    marginTop: 2,
  },
  tabLabelActive: {
    fontSize: 12,
    color: "#A259FF",
    marginTop: 2,
    fontWeight: "600",
  },
});
