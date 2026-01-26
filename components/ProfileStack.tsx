import React from "react";
import { View, StyleSheet, Text } from "react-native";
import GlassProfileAvatar from "./GlassProfileAvatar";

interface ProfileStackProps {
  profiles?: Array<{ uri: string }>;
  attendees?: number;
}

export default function ProfileStack({
  profiles = [],
  attendees = 120,
}: ProfileStackProps) {
  // Default profile images if none provided
  const defaultProfiles = [
    require("../assets/homePage/afrot.png"),
    require("../assets/homePage/revival.jpg"),
    require("../assets/homePage/afrot.png"),
    require("../assets/homePage/revival.jpg"),
  ];

  const profileImages = profiles.length > 0 ? profiles : defaultProfiles;

  const avatarSize = 24;
  return (
    <View style={styles.attendeesContainer}>
      <View style={styles.profileStackContainer}>
        {profileImages.slice(0, 4).map((profile, index) => (
          <View
            key={index}
            style={[
              styles.profileCard,
              {
                zIndex: 4 - index,
                transform: [{ translateX: index * -8 }],
                width: avatarSize,
                height: avatarSize,
              },
            ]}
          >
            <GlassProfileAvatar
              source={typeof profile === "string" ? { uri: profile } : profile}
              size={avatarSize}
            />
          </View>
        ))}
      </View>
      <Text style={styles.attendeesText}>{attendees}+ Attending</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  attendeesContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  profileStackContainer: {
    width: 28,
    height: 28,
    position: "relative",
  },
  profileCard: {
    position: "absolute",
    top: 2,
    left: 2,
  },
  attendeesText: {
    color: "#932FF8",
    fontWeight: "300",
    fontSize: 10,
  },
});
