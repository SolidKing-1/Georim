import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  Pressable,
  Dimensions,
  Platform,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import BuzzCard from "../components/BuzzCard";

const { height } = Dimensions.get("window");
const HERO_HEIGHT = height * 0.45;
const FORM_BG = "#05031B";
const REPLY_BG = "#0E0D32";

/* ---------------- MOCK DATA ---------------- */

const baseReviews = [
  {
    id: "1",
    name: "John Doe",
    profilePic: require("../assets/Home/profile.jpg"),
    rating: 4,
    date: "Sep 15, 2023",
    message:
      "This event was amazing! I had a great time connecting with others.",
    responses: [
      {
        id: "r1",
        name: "Event Organizer",
        profilePic: require("../assets/Home/profile.jpg"),
        date: "Sep 16, 2023",
        message: "Thank you so much for attending!",
      },
    ],
  },
];

const reviews = Array.from({ length: 6 }).map((_, i) => ({
  ...baseReviews[0],
  id: `${i + 1}`,
}));

/* ---------------- SCREEN ---------------- */

export default function ReviewsScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { event } = route.params ?? {};

  const heroImage = useMemo(() => {
    if (event?.imageUrl) return { uri: event.imageUrl };
    if (event?.image) return event.image;
    return require("../assets/Home/event-1.jpg");
  }, [event]);

  return (
    <View style={styles.container}>
      {/* HERO */}
      <View style={styles.hero}>
        <Image source={heroImage} style={styles.heroImage} />

        <BlurView
          intensity={Platform.OS === "ios" ? 60 : 45}
          tint="dark"
          style={StyleSheet.absoluteFill}
        />

        <LinearGradient
          colors={["transparent", FORM_BG]}
          style={StyleSheet.absoluteFill}
        />

        <Pressable style={styles.back} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="#FFF" />
        </Pressable>
      </View>

      {/* CONTENT */}
      <FlatList
        data={reviews}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.content}
        renderItem={({ item }) => <ReviewItem item={item} />}
        ListHeaderComponent={<ReviewsHeader />}
        ListFooterComponent={<BuzzCard />} // <-- BuzzCard at the bottom
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

/* ---------------- HEADER ---------------- */

function ReviewsHeader() {
  return (
    <View style={styles.header}>
      <View style={styles.headerTop}>
        <Text style={styles.title}>Reviews</Text>

        <View style={styles.ratingRight}>
          <View style={styles.ratingBox}>
            <Text style={styles.ratingBig}>4.6</Text>
            <Text style={styles.ratingSmall}>/5</Text>
          </View>

          <Text style={styles.basedOn}>Based on 120 reviews</Text>

          <View style={styles.starsRow}>
            {[...Array(5)].map((_, i) => (
              <Ionicons
                key={i}
                name={i < 4 ? "star" : "star-outline"}
                size={16}
                color={i < 4 ? "#FFD700" : "#9CA3AF"}
              />
            ))}
          </View>
        </View>
      </View>

      <Text style={styles.description}>
        Real stories from people around the world{"\n"}
        using our platform to build, grow, and connect.
      </Text>

      <View style={styles.actions}>
        <Text style={styles.leaveReview}>Leave a Review</Text>

        <View style={styles.sort}>
          <Text style={styles.sortText}>Sort by: Suggested</Text>
          <Ionicons name="chevron-down" size={14} color="#FFF" />
        </View>
      </View>
    </View>
  );
}

/* ---------------- REVIEW ITEM ---------------- */

function ReviewItem({ item }: any) {
  const [open, setOpen] = useState(false);

  return (
    <View style={styles.review}>
      <View style={styles.reviewHeader}>
        <Image source={item.profilePic} style={styles.avatar} />

        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{item.name}</Text>
          <View style={styles.starsRow}>
            {[...Array(5)].map((_, i) => (
              <Ionicons
                key={i}
                name={i < item.rating ? "star" : "star-outline"}
                size={14}
                color={i < item.rating ? "#FFD700" : "#9CA3AF"}
              />
            ))}
          </View>
        </View>

        <Text style={styles.date}>{item.date}</Text>
      </View>

      <Text style={styles.message}>{item.message}</Text>

      <Pressable style={styles.responseBtn} onPress={() => setOpen(!open)}>
        <Text style={styles.responseText}>
          {open ? "Hide responses" : "View responses"}
        </Text>
        <Ionicons
          name={open ? "chevron-up" : "chevron-down"}
          size={14}
          color="#7F00FF"
        />
      </Pressable>

      {open &&
        item.responses.map((r: any) => (
          <View key={r.id} style={styles.response}>
            <View style={styles.responseHeader}>
              <Text style={styles.name}>{r.name}</Text>
              <Text style={styles.date}>{r.date}</Text>
            </View>
            <Text style={styles.message}>{r.message}</Text>
          </View>
        ))}
    </View>
  );
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: FORM_BG,
  },
  hero: {
    height: HERO_HEIGHT,
  },
  heroImage: {
    width: "100%",
    height: "100%",
  },
  back: {
    position: "absolute",
    top: 50,
    left: 20,
  },
  content: {
    padding: 20,
    paddingTop: 0,
  },

  /* HEADER */
  header: {
    marginBottom: 20,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#FFF",
  },
  ratingRight: {
    alignItems: "flex-end",
  },
  ratingBox: {
    flexDirection: "row",
    alignItems: "flex-end",
  },
  ratingBig: {
    fontSize: 28,
    fontWeight: "700",
    color: "#FFD700",
  },
  ratingSmall: {
    fontSize: 16,
    color: "#9CA3AF",
    marginBottom: 2,
  },
  basedOn: {
    color: "#9CA3AF",
    fontSize: 12,
    marginTop: 2,
  },
  starsRow: {
    flexDirection: "row",
    marginTop: 4,
  },
  description: {
    color: "#D1D5DB",
    marginTop: 12,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
    alignItems: "center",
  },
  leaveReview: {
    color: "#7F00FF",
    textDecorationLine: "underline",
  },
  sort: {
    flexDirection: "row",
    backgroundColor: "#1E1E3F",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignItems: "center",
    gap: 4,
  },
  sortText: {
    color: "#FFF",
    fontSize: 12,
  },

  /* REVIEW */
  review: {
    marginBottom: 24,
  },
  reviewHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  name: {
    color: "#FFF",
    fontWeight: "600",
  },
  date: {
    color: "#9CA3AF",
    fontSize: 12,
  },
  message: {
    color: "#D1D5DB",
    marginTop: 8,
  },
  responseBtn: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
    gap: 4,
  },
  responseText: {
    color: "#7F00FF",
  },

  /* RESPONSE */
  response: {
    marginTop: 10,
    marginLeft: 52,
    backgroundColor: REPLY_BG,
    borderRadius: 12,
    padding: 12,
  },
  responseHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
