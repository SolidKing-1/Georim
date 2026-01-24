import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageSourcePropType,
} from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import ProfileStack from "./ProfileStack";
import CircleGlassEffect from "./GlassEffects/circleGlassEffect.png";
import PriceTagBadge from "./PriceTagBadge";

interface EventCardProps {
  image: ImageSourcePropType;
  title: string;
  location?: string;
  time?: string;
  state?: string;
  price?: string;
  attendees?: number;
  rating?: string;
  month?: string;
  day?: string;
  onPress?: () => void;
  onSave?: () => void;
  isSaved?: boolean;
  width?: number;
  marginRight?: number;
}

export default function EventCard({
  image,
  title,
  location = "Lagos, Nigeria",
  time = "7:00 PM",
  state = "New",
  price = "Free",
  attendees = 120,
  rating = "4.5",
  month = "Sep",
  day = "15",
  onPress,
  onSave,
  isSaved = false,
  width = 280,
  marginRight = 20,
}: EventCardProps) {
  const [saved, setSaved] = useState(isSaved);

  const handleSave = () => {
    setSaved(!saved);
    if (onSave) onSave();
  };
  return (
    <TouchableOpacity
      style={[styles.card, { width, marginRight }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.imageContainer}>
        <Image source={image} style={styles.cardImage} contentFit="cover" transition={200} />

        {/* Date badge - top left */}
        <View style={styles.dateBadge}>
          <Image source={CircleGlassEffect} style={styles.dateBadgeOverlay} contentFit="fill" />
          <View style={styles.dateMonthStrip}>
            <Text style={styles.dateMonth}>{month}</Text>
          </View>
          <Text style={styles.dateDay}>{day}</Text>
        </View>

        {/* Bookmark icon - top right */}
        <TouchableOpacity
          style={styles.bookmarkButton}
          onPress={handleSave}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons
            name={saved ? "bookmark" : "bookmark-outline"}
            size={28}
            color={saved ? "#7F00FF" : "#ffffff"}
          />
        </TouchableOpacity>
      </View>
      {/* Badges sitting on image border */}
      <View style={styles.badgeOnImageRow}>
        <View style={[styles.badgeGlass, styles.badgeState]}>
          <Text style={styles.badgeText}>{state}</Text>
        </View>
        <PriceTagBadge price={price} />
      </View>
      <View style={styles.cardBody}>
        <View style={{ flex: 1 }}>
          <Text style={styles.cardTitle}>{title}</Text>
          <View style={styles.cardMetaRow}>
            <View style={styles.cardMetaItem}>
              <Ionicons name="location-outline" size={14} color="#F6F8F9" weight="bold" />
              <Text style={styles.cardMeta}>{location}</Text>
            </View>
            <View style={styles.cardMetaItem}>
              <Ionicons name="time-outline" size={12} color="#F6F8F9" weight="bold" />
              <Text style={styles.cardMeta}>{time}</Text>
            </View>
          </View>
          <View style={styles.cardFooterRow}>
            <ProfileStack attendees={attendees} />
            <View style={styles.rating}>
              <Text>
                <Text style={styles.ratingNumber}>{rating} </Text>
                <Text style={styles.ratingStar}>★</Text>
              </Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#0E0D32",
    borderRadius: 20,
    overflow: "hidden",
  },
  imageContainer: {
    marginTop: 3,
    marginRight: 3,
    marginBottom: 0,
    marginLeft: 3,
    borderRadius: 18,
    overflow: "hidden",
    position: "relative",
  },
  dateBadge: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: "rgba(10, 6, 48, 0.4)",
    borderRadius: 16,
    paddingHorizontal: 8,
    paddingTop: 18,
    paddingBottom: 3,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 40,
    overflow: "hidden",
  },
  dateMonthStrip: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 16,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    backgroundColor: "#FFFFFF33",
  },
  dateBadgeOverlay: {
    position: "absolute",
    top: -2,
    left: -6,
    right: -6,
    bottom: -2,
    width: undefined,
    height: undefined,
    opacity: 0.7,
    zIndex: 0,
  },
  dateMonth: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "400",
    textTransform: "capitalize",
    zIndex: 1,
  },
  dateDay: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "400",
    marginTop: -3,
    marginBottom: -1,
    zIndex: 1,
  },
  bookmarkButton: {
    position: "absolute",
    top: 8,
    right: 8,
  },
  cardImage: {
    width: "100%",
    height: 140,
  },
  cardBody: {
    padding: 12,
    paddingTop: 20,
  },
  badgeOnImageRow: {
    position: "absolute",
    top: 132,
    left: 16,
    right: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 12,
  },
  badgeGlass: {
    backgroundColor: "#007800B2",
    borderRadius: 16,
    paddingHorizontal: 8,
    paddingVertical: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeState: {
    paddingHorizontal: 16,
    paddingVertical: 0,
    height: 20,
    marginTop: 2,
  },
  badgeText: { color: "#fff", fontWeight: "400", fontSize: 9, lineHeight: 12 },
  cardTitle: {
    color: "#F6F8F9",
    fontWeight: "600",
    fontSize: 16,
    marginTop: 2,
  },
  cardMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 4,
  },
  cardMetaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  cardMeta: { color: "#F6F8F9", fontSize: 10, fontWeight: "300" },
  cardFooterRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
    marginLeft: 32,
  },
  rating: {
    backgroundColor: "#060616",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  ratingNumber: { color: "#F6F8F9", fontWeight: "700" },
  ratingStar: { color: "#F6C749", fontWeight: "700" },
});
