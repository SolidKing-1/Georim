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
import Svg, { Path } from "react-native-svg";
import ProfileStack from "./ProfileStack";
import PriceTagBadge from "./PriceTagBadge";
import DateTimeBadge from "./DateTimeBadge";

const STATUS_BADGE_COLORS = {
  past: "#9CA3AF",
  soon: "#FF2D55",
  ongoing: "#FF9F43",
  default: "#007800B2",
} as const;

function QrCodeIcon({
  size = 21,
  color = "#F6F8F9",
}: {
  size?: number;
  color?: string;
}) {
  return (
    <Svg width={size} height={size} viewBox="0 0 21 21" fill="none">
      <Path
        d="M3 6H6V3H3V6ZM0 2.25C0 1.00781 1.00781 0 2.25 0H6.75C7.99219 0 9 1.00781 9 2.25V6.75C9 7.99219 7.99219 9 6.75 9H2.25C1.00781 9 0 7.99219 0 6.75V2.25ZM3 18H6V15H3V18ZM0 14.25C0 13.0078 1.00781 12 2.25 12H6.75C7.99219 12 9 13.0078 9 14.25V18.75C9 19.9922 7.99219 21 6.75 21H2.25C1.00781 21 0 19.9922 0 18.75V14.25ZM15 3V6H18V3H15ZM14.25 0H18.75C19.9922 0 21 1.00781 21 2.25V6.75C21 7.99219 19.9922 9 18.75 9H14.25C13.0078 9 12 7.99219 12 6.75V2.25C12 1.00781 13.0078 0 14.25 0ZM13.5 15C12.6703 15 12 14.3297 12 13.5C12 12.6703 12.6703 12 13.5 12C14.3297 12 15 12.6703 15 13.5C15 14.3297 14.3297 15 13.5 15ZM13.5 18C14.3297 18 15 18.6703 15 19.5C15 20.3297 14.3297 21 13.5 21C12.6703 21 12 20.3297 12 19.5C12 18.6703 12.6703 18 13.5 18ZM18 19.5C18 18.6703 18.6703 18 19.5 18C20.3297 18 21 18.6703 21 19.5C21 20.3297 20.3297 21 19.5 21C18.6703 21 18 20.3297 18 19.5ZM19.5 15C18.6703 15 18 14.3297 18 13.5C18 12.6703 18.6703 12 19.5 12C20.3297 12 21 12.6703 21 13.5C21 14.3297 20.3297 15 19.5 15ZM18 16.5C18 17.3297 17.3297 18 16.5 18C15.6703 18 15 17.3297 15 16.5C15 15.6703 15.6703 15 16.5 15C17.3297 15 18 15.6703 18 16.5Z"
        fill={color}
      />
    </Svg>
  );
}

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
  showQRCode?: boolean;
  showDateBadge?: boolean;
  eventStatus?: "past" | "soon" | "ongoing" | "default";
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
  showQRCode = false,
  showDateBadge = true,
  eventStatus = "default",
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
        <Image
          source={image}
          style={styles.cardImage}
          contentFit="cover"
          transition={200}
        />

        {/* Date badge - top left */}
        {showDateBadge && (
          <View style={styles.dateBadge}>
            <DateTimeBadge topLabel={month} bottomValue={day} size="small" />
          </View>
        )}

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
        <View
          style={[
            styles.badgeGlass,
            styles.badgeState,
            { backgroundColor: STATUS_BADGE_COLORS[eventStatus] },
          ]}
        >
          <Text style={styles.badgeText}>{state}</Text>
        </View>
        <PriceTagBadge price={price} />
      </View>

      {showQRCode && (
        <TouchableOpacity
          style={styles.qrBtn}
          onPress={() => {}}
          activeOpacity={0.7}
        >
          <QrCodeIcon size={18} color="#F6F8F9" />
        </TouchableOpacity>
      )}

      <View style={[styles.cardBody, showQRCode && styles.cardBodyWithQR]}>
        <View style={{ flex: 1 }}>
          <Text style={styles.cardTitle}>{title}</Text>
          <View style={styles.cardMetaRow}>
            <View style={styles.cardMetaItem}>
              <Ionicons
                name="location-outline"
                size={14}
                color="#F6F8F9"
                weight="bold"
              />
              <Text style={styles.cardMeta}>{location}</Text>
            </View>
            <Text style={styles.cardMeta}> </Text>
            <View style={styles.cardMetaItem}>
              <Ionicons
                name="time-outline"
                size={12}
                color="#F6F8F9"
                weight="bold"
              />
              <Text style={styles.cardMeta}>{time}</Text>
            </View>
          </View>
          <View
            style={[
              styles.cardFooterRow,
              showQRCode && styles.cardFooterRowWithQR,
            ]}
          >
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
  },
  bookmarkButton: {
    position: "absolute",
    top: 8,
    right: 8,
  },
  qrBtn: {
    position: "absolute",
    right: 16,
    top: 168,
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  cardImage: {
    width: "100%",
    height: 140,
  },
  cardBody: {
    padding: 12,
    paddingTop: 20,
  },
  cardBodyWithQR: {
    paddingRight: 52,
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
    gap: 0,
    marginTop: 4,
    marginLeft: -4,
  },
  cardMetaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 0,
  },
  cardMeta: { color: "#F6F8F9", fontSize: 10, fontWeight: "300" },
  cardFooterRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
    marginLeft: 32,
  },

  cardFooterRowWithQR: {
    marginRight: -40,
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
