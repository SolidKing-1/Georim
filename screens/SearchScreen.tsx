import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  Keyboard,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import Svg, { G, Path, Defs, ClipPath, Rect } from "react-native-svg";
import AllEventsPill from "../components/GlassEffects/allEventsPill.png";
import MusicPill from "../components/GlassEffects/musicPill.png";
import CooporatePill from "../components/GlassEffects/cooporatePill.png";
import ReligiousPill from "../components/GlassEffects/religiousPill.png";
import ArtsPill from "../components/GlassEffects/artsPill.png";
import PartiesPill from "../components/GlassEffects/partypill.png";
import SportsPill from "../components/GlassEffects/sportsPill.png";
import MoviesPill from "../components/GlassEffects/moviesPill.png";
import FashionPill from "../components/GlassEffects/fashionPill.png";
import HealthPill from "../components/GlassEffects/healthPill.png";
import CircleGlassEffect from "../components/GlassEffects/circleGlassEffect.png";
import DocIcon from "../components/DocIcon";
import AdBadge from "../components/AdBadge";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { RootStackParamList } from "../App";
import ProfileStack from "../components/ProfileStack";
import EventCard from "../components/EventCard";
import SearchNavBar from "../components/SearchNavBar";
import GlassSearchBar from "../components/GlassSearchBar";

// Using SVG Ad badge component
// (replaces the old AdTag)

// Placeholder event data
const demoEvents = [
  {
    id: "e1",
    title: "Ultra Music Festival, 2025",
    date: "Sep 15",
    location: "Grambling, LA • Digital Library",
    time: "7:00 PM",
    state: "new",
    price: "Free",
    rating: "4.5",
    attendees: 120,
    image: require("../assets/homePage/baloon.png"),
    description:
      "A vibrant celebration of music and culture with live performers and immersive visuals.",
  },
];

type Nav = NativeStackNavigationProp<RootStackParamList, "Search">;

export default function SearchScreen() {
  const navigation = useNavigation<Nav>();
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  const openAllEvents = () => {
    navigation.navigate("AllEvents");
  };

  const openCategory = (category: string) => {
    navigation.navigate("CategoryList", { category });
  };

  const openEvent = (event: any) => {
    navigation.navigate("EventDetails", { event });
  };

  const handleSuggestionPress = (searchTerm: string) => {
    setQuery(searchTerm);
    Keyboard.dismiss();
    setIsFocused(false);
  };

  useEffect(() => {
    const showEvent =
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent =
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    const onShow = (e: any) => {
      setKeyboardHeight(e.endCoordinates?.height || 0);
    };
    const onHide = () => setKeyboardHeight(0);

    const showSub = Keyboard.addListener(showEvent, onShow);
    const hideSub = Keyboard.addListener(hideEvent, onHide);

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  return (
    <LinearGradient
        colors={["#0E0D32", "#060616", "#060616"]}
        locations={[0, 0.35, 1]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={styles.container}
    >
      <Image
        source={require("../assets/homePage/birthday-decoration.png")}
        style={styles.topDecoration}
      />
      <ScrollView contentContainerStyle={{ paddingBottom: 70 }}>
        {/* Header */}
        <View style={styles.headerRow}>
          <Text style={styles.header}>Search</Text>
          <View style={styles.profileWrap}>
              <Image
                source={require("../components/GlassEffects/profile-liquid-glass.png")}
                style={styles.circleOverlay}
              />
              <Image
                source={{
                  uri: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&h=100&fit=crop",
                }}
                style={styles.avatarOnCircle}
              />
          </View>
        </View>

        {/* Suggested Channels - Horizontal Scrollable 2-Column Layout */}
        <Text style={styles.sectionTitle}>Suggested Channels</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20 }}
        >
          {/* Column 1 */}
          <View style={styles.channelColumn}>
            {[
              {
                name: "Afrotech '25",
                subtitle: "Sabrina Carpenter",
                logo: require("../assets/homePage/afrot.png"),
                isAd: true,
              },
              {
                name: "Revival Channel",
                subtitle: "Sabrina Carpenter",
                logo: require("../assets/homePage/revival.jpg"),
                isAd: false,
              },
            ].map((c, i) => (
              <View key={i}>
                <View style={styles.channelListItem}>
                  <Image source={c.logo} style={styles.channelLogo} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.channelName}>{c.name}</Text>
                    <Text style={styles.channelSub}>{c.subtitle}</Text>
                    {c.isAd && <AdBadge />}
                  </View>
                  <TouchableOpacity style={styles.channelAction}>
                    <DocIcon size={24} />
                  </TouchableOpacity>
                </View>
                <View style={styles.channelDividerLine} />
              </View>
            ))}
          </View>

          {/* Column 2 - Hidden partially to show scroll indicator */}
          <View style={styles.channelColumn}>
            {[
              {
                name: "Event Channel",
                subtitle: "Organizers",
                logo: require("../assets/homePage/afrot.png"),
                isAd: false,
              },
              {
                name: "Concert Series",
                subtitle: "Music Events",
                logo: require("../assets/homePage/revival.jpg"),
                isAd: false,
              },
            ].map((c, i) => (
              <View key={i}>
                <View style={styles.channelListItem}>
                  <Image source={c.logo} style={styles.channelLogo} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.channelName}>{c.name}</Text>
                    <Text style={styles.channelSub}>{c.subtitle}</Text>
                    {c.isAd && <AdBadge />}
                  </View>
                  <TouchableOpacity style={styles.channelAction}>
                    <DocIcon size={24} />
                  </TouchableOpacity>
                </View>
                <View style={styles.channelDividerLine} />
              </View>
            ))}
          </View>
        </ScrollView>

        {/* Happening Now - Horizontal Scrollable */}
        <TouchableOpacity
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginTop: 40, // Increased space from previous section
            paddingHorizontal: 20,
            marginBottom: 18, // Increased space below heading
          }}
          onPress={() => openCategory("Happening Now")}
        >
          <Text
            style={[
              styles.sectionTitle,
              { marginBottom: 0, marginTop: 0, paddingHorizontal: 0 },
            ]}
          >
            Happening Now
          </Text>
          <Ionicons
            name="chevron-forward"
            size={22}
            color="#F6F8F9"
            style={{ marginLeft: 6 }}
          />
        </TouchableOpacity>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 12 }}
        >
          {[demoEvents[0], demoEvents[0], demoEvents[0]].map((event, i) => (
            <EventCard
              key={i}
              image={event.image}
              title={event.title}
              location={event.location}
              time={event.time}
              state={event.state}
              price={event.price}
              attendees={event.attendees}
              rating={event.rating}
              onPress={() => openEvent(event)}
            />
          ))}
        </ScrollView>

        {/* Browse - Only show when not searching */}
        {!isFocused && (
          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: 36, // Increased space from previous section
              paddingHorizontal: 20,
              marginBottom: 16, // Increased space below heading
            }}
            onPress={() => navigation.navigate("BrowseAll")}
          >
            <Text
              style={[
                styles.sectionTitle,
                { marginBottom: 0, marginTop: 0, paddingHorizontal: 0 },
              ]}
            >
              Browse
            </Text>
            <Ionicons
              name="chevron-forward"
              size={22}
              color="#fff"
              style={{ marginLeft: 6 }}
            />
          </TouchableOpacity>
        )}
        {/* Browse Grid - Only show when not searching */}
        {!isFocused && (
          <View style={styles.browseGrid}>
            <TouchableOpacity
              style={[styles.browsePill, styles.allEventsPill]}
              onPress={openAllEvents}
            >
              <View style={styles.pillContent}>
                <Image source={AllEventsPill} style={styles.pillOverlay} />
                <Svg
                  width={35}
                  height={32}
                  viewBox="0 0 35 32"
                  fill="none"
                  style={styles.pillIcon}
                >
                  <G clipPath="url(#clip0_649_5969)">
                    <Path
                      d="M5.45199 32H29.1698C32.7987 32 34.6044 30.1943 34.6044 26.6175V5.41726C34.6044 1.84048 32.7987 0.034729 29.1698 0.034729H5.45199C1.82312 0.034729 0 1.82312 0 5.41726V26.6175C0 30.2117 1.82312 32 5.45199 32ZM5.19153 29.2046C3.64623 29.2046 2.79544 28.3885 2.79544 26.7738V10.4004C2.79544 8.80302 3.64623 7.96965 5.19153 7.96965H29.3956C30.9409 7.96965 31.809 8.80302 31.809 10.4004V26.7738C31.809 28.3885 30.9409 29.2046 29.3956 29.2046H5.19153ZM13.9251 14.2029H14.9495C15.5573 14.2029 15.7483 14.0293 15.7483 13.4216V12.3972C15.7483 11.7894 15.5573 11.5985 14.9495 11.5985H13.9251C13.3174 11.5985 13.1091 11.7894 13.1091 12.3972V13.4216C13.1091 14.0293 13.3174 14.2029 13.9251 14.2029ZM19.6896 14.2029H20.7141C21.3218 14.2029 21.5301 14.0293 21.5301 13.4216V12.3972C21.5301 11.7894 21.3218 11.5985 20.7141 11.5985H19.6896C19.082 11.5985 18.8736 11.7894 18.8736 12.3972V13.4216C18.8736 14.0293 19.082 14.2029 19.6896 14.2029ZM25.4542 14.2029H26.4785C27.0863 14.2029 27.2946 14.0293 27.2946 13.4216V12.3972C27.2946 11.7894 27.0863 11.5985 26.4785 11.5985H25.4542C24.8464 11.5985 24.6555 11.7894 24.6555 12.3972V13.4216C24.6555 14.0293 24.8464 14.2029 25.4542 14.2029ZM8.1606 19.8806H9.16765C9.79271 19.8806 9.98374 19.707 9.98374 19.0993V18.0749C9.98374 17.4672 9.79271 17.2936 9.16765 17.2936H8.1606C7.53554 17.2936 7.34452 17.4672 7.34452 18.0749V19.0993C7.34452 19.707 7.53554 19.8806 8.1606 19.8806ZM13.9251 19.8806H14.9495C15.5573 19.8806 15.7483 19.707 15.7483 19.0993V18.0749C15.7483 17.4672 15.5573 17.2936 14.9495 17.2936H13.9251C13.3174 17.2936 13.1091 17.4672 13.1091 18.0749V19.0993C13.1091 19.707 13.3174 19.8806 13.9251 19.8806ZM19.6896 19.8806H20.7141C21.3218 19.8806 21.5301 19.707 21.5301 19.0993V18.0749C21.5301 17.4672 21.3218 17.2936 20.7141 17.2936H19.6896C19.082 17.2936 18.8736 17.4672 18.8736 18.0749V19.0993C18.8736 19.707 19.082 19.8806 19.6896 19.8806ZM25.4542 19.8806H26.4785C27.0863 19.8806 27.2946 19.707 27.2946 19.0993V18.0749C27.2946 17.4672 27.0863 17.2936 26.4785 17.2936H25.4542C24.8464 17.2936 24.6555 17.4672 24.6555 18.0749V19.0993C24.6555 19.707 24.8464 19.8806 25.4542 19.8806ZM8.1606 25.5757H9.16765C9.79271 25.5757 9.98374 25.3847 9.98374 24.777V23.7526C9.98374 23.1449 9.79271 22.9713 9.16765 22.9713H8.1606C7.53554 22.9713 7.34452 23.1449 7.34452 23.7526V24.777C7.34452 25.3847 7.53554 25.5757 8.1606 25.5757ZM13.9251 25.5757H14.9495C15.5573 25.5757 15.7483 25.3847 15.7483 24.777V23.7526C15.7483 23.1449 15.5573 22.9713 14.9495 22.9713H13.9251C13.3174 22.9713 13.1091 23.1449 13.1091 23.7526V24.777C13.1091 25.3847 13.3174 25.5757 13.9251 25.5757ZM19.6896 25.5757H20.7141C21.3218 25.5757 21.5301 25.3847 21.5301 24.777V23.7526C21.5301 23.1449 21.3218 22.9713 20.7141 22.9713H19.6896C19.082 22.9713 18.8736 23.1449 18.8736 23.7526V24.777C18.8736 25.3847 19.082 25.5757 19.6896 25.5757Z"
                      fill="white"
                      fillOpacity={0.6}
                    />
                  </G>
                  <Defs>
                    <ClipPath id="clip0_649_5969">
                      <Rect width="34.8475" height="32" fill="white" />
                    </ClipPath>
                  </Defs>
                </Svg>
                <Text style={styles.pillText}>All Events</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.browsePill, styles.musicPill]}
              onPress={() => openCategory("Music")}
            >
              <View style={styles.pillContent}>
                <Image source={MusicPill} style={styles.pillOverlay} />
                <Svg
                  width={40}
                  height={34}
                  viewBox="0 0 40 34"
                  fill="none"
                  style={styles.pillIcon}
                >
                  <Path
                    d="M28.0751 29.5223C28.0751 32.1443 30.0841 33.966 32.9274 33.966C35.4302 33.966 39.1928 32.1102 39.1928 27.1387V9.84075C39.1928 9.22784 38.665 8.70007 38.0521 8.70007C37.4221 8.70007 36.8944 9.22784 36.8944 9.84075V22.3716C36.8944 23.2229 36.5538 23.7676 35.8217 23.9038L33.0976 24.4827C29.6755 25.1978 28.0751 26.9344 28.0751 29.5223Z"
                    fill="white"
                    fillOpacity={0.6}
                  />
                  <Path
                    d="M15.4592 20.8392C15.4592 23.4442 17.4852 25.2829 20.3115 25.2829C22.8313 25.2829 26.5769 23.4272 26.5769 18.4386V1.14071C26.5769 0.527792 26.0661 0 25.4362 0C24.8062 0 24.2785 0.527792 24.2785 1.14071V13.6885C24.2785 14.5228 23.955 15.0676 23.2058 15.2208L20.4987 15.7826C17.0596 16.4977 15.4592 18.2344 15.4592 20.8392Z"
                    fill="white"
                    fillOpacity={0.6}
                  />
                  <Path
                    d="M1.52588e-05 29.5223C1.52588e-05 32.1443 2.02605 33.966 4.85229 33.966C7.37208 33.966 11.1177 32.1102 11.1177 27.1387V9.84075C11.1177 9.21082 10.6069 8.70007 9.97695 8.70007C9.34702 8.70007 8.81925 9.21082 8.81925 9.84075V22.3716C8.81925 23.2058 8.49574 23.7676 7.74663 23.9038L5.03957 24.4657C1.60041 25.1978 1.52588e-05 26.9174 1.52588e-05 29.5223Z"
                    fill="white"
                    fillOpacity={0.6}
                  />
                </Svg>
                <Text style={styles.pillText}>Music</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.browsePill, styles.cooporatePill]}
              onPress={() => openCategory("Corporate")}
            >
              <View style={styles.pillContent}>
                <Image source={CooporatePill} style={styles.pillOverlay} />
                <Svg
                  width={34}
                  height={34}
                  viewBox="0 0 34 34"
                  fill="none"
                  style={styles.pillIcon}
                >
                  <G clipPath="url(#clip0_649_7413)">
                    <Path
                      d="M6.53618 11.9088H9.10978V9.62297C9.10978 5.62671 12.3227 2.57358 16.5108 2.57358C20.6989 2.57358 23.9118 5.62671 23.9118 9.62297V11.9088H26.4854V9.62297C26.4854 4.17207 22.1695 0 16.5108 0C10.8681 0 6.53618 4.17207 6.53618 9.62297V11.9088ZM16.5108 19.5336C21.8498 19.5336 26.5813 17.4236 29.2987 11.9248C28.5954 11.5092 27.7322 11.3174 26.7252 11.3174H6.2964C5.28935 11.3174 4.42616 11.5092 3.72283 11.9248C6.45625 17.4236 11.1718 19.5336 16.5108 19.5336ZM32.9433 27.558L31.5686 15.7292C31.4727 14.9459 31.2809 14.3225 30.9612 13.779C28.2757 18.6385 24.1516 21.0841 19.7078 21.8514V22.9864C19.7078 24.0734 19.0684 24.6808 17.9814 24.6808H15.0402C13.9532 24.6808 13.3138 24.0734 13.3138 22.9864V21.8514C8.87001 21.0841 4.74587 18.6544 2.06039 13.795C1.75668 14.3225 1.56486 14.9459 1.46894 15.7292L0.0782544 27.558C-0.417279 31.7142 1.45296 33.984 5.33731 33.984H27.6843C31.5846 33.984 33.4389 31.7142 32.9433 27.558Z"
                      fill="white"
                      fillOpacity={0.6}
                    />
                  </G>
                  <Defs>
                    <ClipPath id="clip0_649_7413">
                      <Rect width="33.2453" height="34" fill="white" />
                    </ClipPath>
                  </Defs>
                </Svg>
                <Text style={styles.pillText}>Corporate</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.browsePill, styles.religiousPill]}
              onPress={() => openCategory("Religious")}
            >
              <View style={styles.pillContent}>
                <Image source={ReligiousPill} style={styles.pillOverlay} />
                <Svg
                  width={25}
                  height={34}
                  viewBox="0 0 25 34"
                  fill="none"
                  style={styles.pillIcon}
                >
                  <G clipPath="url(#clip0_649_7431)">
                    <Path
                      d="M11.3962 31.3612C19.0516 31.3612 24.1552 26.1851 24.1552 18.3846C24.1552 5.4081 13.107 0 5.4371 0C4.0742 0 3.20426 0.478465 3.20426 1.40639C3.20426 1.76887 3.36375 2.14584 3.66823 2.49382C5.3936 4.55267 7.11897 7.00299 7.14795 9.85929C7.14795 10.5117 7.0755 11.0917 6.6115 11.9036L7.33645 11.7586C6.68402 9.62727 4.92964 8.11941 3.39275 8.11941C2.79829 8.11941 2.39232 8.55437 2.39232 9.2068C2.39232 9.58379 2.49382 10.4683 2.49382 11.1062C2.49382 14.3539 0 16.2533 0 21.4874C0 27.4175 4.53816 31.3612 11.3962 31.3612ZM11.7296 27.287C9.01831 27.287 7.22046 25.6486 7.22046 23.2128C7.22046 20.6609 9.03286 19.7476 9.26482 18.1092C9.29381 17.9786 9.38081 17.9352 9.4823 18.0222C10.1492 18.6166 10.5842 19.3416 10.9467 20.1825C11.7152 19.1386 12.0776 16.9347 11.8311 14.5569C11.8167 14.4264 11.9036 14.3539 12.0341 14.3975C15.2094 15.8908 16.8623 19.0516 16.8623 21.8789C16.8623 24.7497 15.1804 27.287 11.7296 27.287Z"
                      fill="white"
                      fillOpacity={0.6}
                    />
                  </G>
                  <Defs>
                    <ClipPath id="clip0_649_7431">
                      <Rect width="24.3582" height="34" fill="white" />
                    </ClipPath>
                  </Defs>
                </Svg>
                <Text style={styles.pillText}>Religious</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.browsePill, styles.artsPill]}
              onPress={() => openCategory("Arts & Culture")}
            >
              <View style={styles.pillContent}>
                <Image source={ArtsPill} style={styles.pillOverlay} />
                <Svg
                  width={47}
                  height={34}
                  viewBox="0 0 47 34"
                  fill="none"
                  style={styles.pillIcon}
                >
                  <G clipPath="url(#clip0_649_7403)">
                    <Path
                      d="M0.35117 29.7507C1.82206 34.5765 9.12694 35.3532 16.8946 31.7669C18.316 31.1223 17.3408 29.3044 16.0022 29.9489C9.52363 33.0229 3.30949 32.5933 2.28482 29.1722C-0.326434 20.6278 18.0515 19.6692 15.936 12.48C14.8783 8.94326 6.71403 9.52164 0.880031 13.4551C-0.29338 14.2153 0.830452 15.9011 1.98733 15.1078C6.21823 12.2982 13.4405 11.1909 14.0024 13.0419C14.4156 14.4302 13.2587 15.4548 8.69729 18C4.25152 20.4625 -1.48332 23.7183 0.35117 29.7507Z"
                      fill="white"
                      fillOpacity={0.6}
                    />
                    <Path
                      d="M23.7863 28.6598L41.371 11.0917L38.4788 8.18296L20.8942 25.7511L19.3241 29.4201C19.1588 29.8167 19.572 30.2795 19.9852 30.1142L23.7863 28.6598ZM42.8254 9.6704L44.4946 8.03423C45.3374 7.19137 45.3871 6.28236 44.6268 5.52212L44.0649 4.96021C43.3046 4.2165 42.3956 4.28261 41.5693 5.10895L39.8836 6.76165L42.8254 9.6704Z"
                      fill="white"
                      fillOpacity={0.6}
                    />
                  </G>
                  <Defs>
                    <ClipPath id="clip0_649_7403">
                      <Rect width="46.2341" height="34" fill="white" />
                    </ClipPath>
                  </Defs>
                </Svg>
                <Text style={styles.pillText}>Arts & Culture</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.browsePill, styles.partiesPill]}
              onPress={() => openCategory("Parties")}
            >
              <View style={styles.pillContent}>
                <Image source={PartiesPill} style={styles.pillOverlay} />
                <Svg
                  width={38}
                  height={34}
                  viewBox="0 0 38 34"
                  fill="none"
                  style={styles.pillIcon}
                >
                  <G clipPath="url(#clip0_649_7422)">
                    <Path
                      d="M10.2351 6.94312C11.9708 6.94312 13.3869 5.52709 13.3869 3.79131C13.3869 2.05553 11.9708 0.654722 10.2351 0.654722C8.49928 0.654722 7.09847 2.05553 7.09847 3.79131C7.09847 5.52709 8.49928 6.94312 10.2351 6.94312ZM28.613 6.2884C30.3488 6.2884 31.7649 4.87237 31.7649 3.13659C31.7649 1.41603 30.3488 0 28.613 0C26.8773 0 25.4765 1.41603 25.4765 3.13659C25.4765 4.87237 26.8773 6.2884 28.613 6.2884ZM1.46482 10.8106L4.67754 11.0694C4.89071 11.0846 5.04297 11.2369 5.04297 11.4805V17.3121C5.04297 18.4846 5.42362 19.6265 6.13925 20.5249L9.90009 25.3668L7.98164 31.7465C7.72276 32.584 8.21003 33.4823 9.01699 33.7107C9.82401 33.9391 10.7071 33.5584 10.9812 32.6449L13.128 25.4733C13.1738 25.3363 13.189 25.2297 13.189 25.0927L19.0053 32.447C19.5382 33.1169 20.5432 33.2539 21.1827 32.721C21.8679 32.1424 21.9897 31.1984 21.4568 30.5132L11.0725 17.373L11.5445 12.7138C11.5902 12.3788 11.8948 12.2114 12.184 12.3484L15.7926 14.1603C16.0363 14.2974 16.4778 14.3887 16.828 14.3887H22.3856C22.751 14.3887 23.1316 14.2517 23.3905 14.0233L26.0246 11.7698C26.2835 11.5415 26.6032 11.648 26.725 11.9525L28.2019 16.0636L21.9745 17.7689C21.3502 17.9364 20.863 18.4846 20.802 19.1393L20.1017 26.3108C20.0103 27.3309 20.9086 28.0161 21.6699 28.0161C22.4617 28.0161 23.1469 27.4375 23.223 26.6153L23.8168 20.6467L28.1867 19.9767L26.1007 24.1791C25.8724 24.6359 25.7506 25.1384 25.9332 25.6104L28.811 32.7819C29.1612 33.6498 30.1052 33.9543 30.8513 33.6498C31.6431 33.3301 32.039 32.4165 31.7192 31.6095L29.1612 25.2297L32.6937 20.2051C33.592 18.9566 33.9118 17.3426 33.6377 15.8352L33.0895 12.8204C33.0134 12.4093 33.3332 12.1505 33.7138 12.2723L35.5257 12.8813C36.759 13.3077 37.6878 12.5464 37.5813 11.313L36.8504 4.06538C36.7742 3.16704 35.9673 2.55799 35.145 2.64935C34.3077 2.74071 33.6529 3.50201 33.729 4.38513L34.2163 9.16617L29.8921 7.71964C28.1258 7.12585 26.253 7.4456 24.7913 8.70933L21.8222 11.2674H17.0107L12.3667 8.953C11.6664 8.58753 10.9812 8.40486 10.2046 8.34393L3.70307 7.85672L5.21046 3.30407C5.49976 2.46664 5.04297 1.58352 4.23598 1.30945C3.41377 1.03538 2.51543 1.47693 2.25658 2.29915L0.079242 8.73983C-0.240507 9.7143 0.444669 10.7344 1.46482 10.8106Z"
                      fill="white"
                      fillOpacity={0.6}
                    />
                  </G>
                  <Defs>
                    <ClipPath id="clip0_649_7422">
                      <Rect width="37.7975" height="34" fill="white" />
                    </ClipPath>
                  </Defs>
                </Svg>
                <Text style={styles.pillText}>Parties</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.browsePill, styles.sportsPill]}
              onPress={() => openCategory("Sports")}
            >
              <View style={styles.pillContent}>
                <Image source={SportsPill} style={styles.pillOverlay} />
                <Svg
                  width={35}
                  height={34}
                  viewBox="0 0 35 34"
                  fill="none"
                  style={styles.pillIcon}
                >
                  <G clipPath="url(#clip0_649_6785)">
                    <Path
                      d="M0.0166749 16.7916C1.48406 14.7739 3.33496 12.9063 5.35262 11.3722C5.33595 11.3055 5.33595 11.2222 5.31927 11.1388C5.25257 9.92155 4.46886 7.55372 3.05149 7.3536C1.23394 9.95488 0.116724 13.0731 0 16.4247C0 16.5581 0 16.6749 0.0166749 16.7916ZM7.10348 10.1383C7.63704 9.78816 8.18734 9.45465 8.73763 9.15447C8.38746 6.13634 8.52085 3.68514 9.03774 2.00098C7.18688 3.00147 5.55272 4.31878 4.16871 5.88621C5.83619 6.33643 6.76998 8.47078 7.10348 10.1383ZM10.5052 8.27073C11.3222 7.88723 12.1726 7.55372 13.0397 7.27021C13.0064 6.92003 12.973 6.58656 12.973 6.23639C12.973 3.56841 14.4071 1.35066 16.6415 0C16.5247 0 16.4414 0 16.3247 0C14.4571 0.0666993 12.6395 0.450221 10.9721 1.10054C10.5218 2.5846 10.1883 4.95243 10.5052 8.27073ZM14.924 6.70328C17.0083 6.16969 19.1927 5.88621 21.4605 5.88621C24.8455 5.88621 28.2138 6.55321 31.2319 7.78717C28.8141 4.06866 24.9956 1.33398 20.5434 0.366846C17.025 1.38401 14.8073 3.26827 14.8907 6.23639C14.8907 6.38646 14.9073 6.55321 14.924 6.70328ZM5.31927 13.8568C3.40167 15.5576 1.61746 17.5919 0.233448 19.8097C0.883769 23.6116 2.85139 27.0299 5.63609 29.5645C3.61844 24.8288 5.06915 18.926 5.31927 13.8568ZM7.28687 12.306C7.33693 19.9264 3.90191 28.6641 11.2722 32.8994C13.0397 33.5998 14.9906 34 17.0083 34C17.9421 34 18.8592 33.9333 19.743 33.7832C13.3732 26.0127 10.1717 17.642 9.03774 11.1721C8.43745 11.5223 7.85383 11.8891 7.28687 12.306ZM13.5566 9.08781C12.6062 9.42125 11.6557 9.80482 10.7553 10.255C11.7724 16.5415 14.974 25.229 21.8273 33.283C25.4625 32.1991 28.614 29.898 30.7984 26.8465C30.5483 18.6424 16.5915 16.1913 13.5566 9.08781ZM32.2991 24.3619C33.3997 22.1108 34.0167 19.6263 34.0167 16.9916C34.0167 14.7239 33.5664 12.5395 32.716 10.5718C29.1643 8.72097 25.4958 7.80383 21.4605 7.80383C19.3761 7.80383 17.3585 8.05395 15.4409 8.53751C18.0922 14.0235 29.8313 16.4914 32.2991 24.3619Z"
                      fill="white"
                      fillOpacity={0.6}
                    />
                  </G>
                  <Defs>
                    <ClipPath id="clip0_649_6785">
                      <Rect width="34.2501" height="34" fill="white" />
                    </ClipPath>
                  </Defs>
                </Svg>
                <Text style={styles.pillText}>Sports</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.browsePill, styles.moviesPill]}
              onPress={() => openCategory("Movies")}
            >
              <View style={styles.pillContent}>
                <Image source={MoviesPill} style={styles.pillOverlay} />
                <Svg
                  width={32}
                  height={34}
                  viewBox="0 0 32 34"
                  fill="none"
                  style={styles.pillIcon}
                >
                  <G clipPath="url(#clip0_649_7393)">
                    <Path
                      d="M29.2119 3.01087L29.5595 4.32089C29.9204 5.72448 29.2521 6.94094 27.7816 7.32859L13.104 11.2586H28.744C30.2546 11.2586 31.217 12.2211 31.217 13.7049V26.1768C31.217 28.7969 29.8937 30.1336 27.2068 30.1336H5.23054C2.55703 30.1336 1.2069 28.8102 1.2069 26.1768V14.4669L0.204338 10.7908C-0.464039 8.26433 0.511792 6.62008 3.065 5.92498L24.2926 0.21705C26.8592 -0.464695 28.5569 0.457666 29.2119 3.01087ZM9.84232 13.344L6.35343 13.5044L4.44185 17.0601H8.83979L10.8449 13.344H9.84232ZM14.922 13.344L12.9303 17.0601H17.649L19.6541 13.344H14.922ZM23.7312 13.344L21.7395 17.0601H26.124L28.1292 13.344H23.7312ZM4.80277 7.62267L3.80021 11.7265L8.06448 10.5769L9.02693 6.47307L4.80277 7.62267ZM12.9837 5.41703L12.0212 9.52086L16.5796 8.31777L17.542 4.20058L12.9837 5.41703ZM24.7071 2.26229L21.4855 3.14454L20.5097 7.24838L24.7605 6.11213L25.7096 2.03504C25.3888 2.10188 25.0546 2.16871 24.7071 2.26229Z"
                      fill="white"
                      fillOpacity={0.6}
                    />
                  </G>
                  <Defs>
                    <ClipPath id="clip0_649_7393">
                      <Rect width="31.408" height="34" fill="white" />
                    </ClipPath>
                  </Defs>
                </Svg>
                <Text style={styles.pillText}>Movies</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.browsePill, styles.fashionPill]}
              onPress={() => openCategory("Fashion")}
            >
              <View style={styles.pillContent}>
                <Image source={FashionPill} style={styles.pillOverlay} />
                <Svg
                  width={40}
                  height={34}
                  viewBox="0 0 40 34"
                  fill="none"
                  style={styles.pillIcon}
                >
                  <Path
                    d="M0 28.0465C0 29.721 1.14729 31.2403 3.22481 31.2403H35.69C37.7675 31.2403 38.8993 29.721 38.8993 28.0465C38.8993 26.8062 38.2481 25.4884 36.9148 24.7442L19.4573 14.9458L1.9845 24.7442C0.651163 25.4884 0 26.8062 0 28.0465ZM2.51163 27.907C2.51163 27.5039 2.71318 27.1473 3.24031 26.8528L19.4573 17.7829L35.6745 26.8528C36.2016 27.1473 36.4031 27.5039 36.4031 27.907C36.4031 28.3876 36.093 28.7752 35.4264 28.7752H3.47287C2.82171 28.7752 2.51163 28.3876 2.51163 27.907ZM18.2481 16.1085H20.6512V14.4651C20.6512 13.0698 21.3334 12.5272 22.5426 11.5504C23.7985 10.5271 25.7985 9.10081 25.7985 5.96899C25.7985 2.3876 23.2868 0 19.5349 0C15.8139 0 13.3333 2.62016 13.3333 6.54262C13.3333 7.28682 13.845 7.79847 14.5117 7.79847C15.1628 7.79847 15.6744 7.28682 15.6744 6.69769C15.6744 4.09302 17.2248 2.35659 19.5349 2.35659C21.8915 2.35659 23.4729 3.79846 23.4729 5.96899C23.4729 7.907 22.4341 8.77523 21.3799 9.62789C20 10.7442 18.2481 11.7209 18.2481 14.4651V16.1085Z"
                    fill="white"
                    fillOpacity={0.6}
                  />
                </Svg>
                <Text style={styles.pillText}>Fashion</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.browsePill, styles.healthPill]}
              onPress={() => openCategory("Health & Wellness")}
            >
              <View style={styles.pillContent}>
                <Image source={HealthPill} style={styles.pillOverlay} />
                <Svg
                  width={39}
                  height={39}
                  viewBox="0 0 39 39"
                  fill="none"
                  style={styles.pillIcon}
                >
                  <Path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M14.5632 30.0123C9.78087 26.3479 3.25 20.2948 3.25 14.5715C3.25 5.01003 12.1875 1.43991 19.5 8.82391C26.8125 1.43991 35.75 5.01003 35.75 14.5715C35.75 20.2948 29.2175 26.3479 24.4368 30.0123C22.2722 31.6698 21.19 32.5002 19.5 32.5002C17.81 32.5002 16.7277 31.6714 14.5632 30.0123ZM26.8125 10.1564C27.1357 10.1564 27.4457 10.2848 27.6743 10.5134C27.9028 10.7419 28.0312 11.0519 28.0312 11.3752V13.4064H30.0625C30.3857 13.4064 30.6957 13.5348 30.9243 13.7634C31.1528 13.9919 31.2812 14.3019 31.2812 14.6252C31.2812 14.9484 31.1528 15.2584 30.9243 15.4869C30.6957 15.7155 30.3857 15.8439 30.0625 15.8439H28.0312V17.8752C28.0312 18.1984 27.9028 18.5084 27.6743 18.7369C27.4457 18.9655 27.1357 19.0939 26.8125 19.0939C26.4893 19.0939 26.1793 18.9655 25.9507 18.7369C25.7222 18.5084 25.5938 18.1984 25.5938 17.8752V15.8439H23.5625C23.2393 15.8439 22.9293 15.7155 22.7007 15.4869C22.4722 15.2584 22.3438 14.9484 22.3438 14.6252C22.3438 14.3019 22.4722 13.9919 22.7007 13.7634C22.9293 13.5348 23.2393 13.4064 23.5625 13.4064H25.5938V11.3752C25.5938 11.0519 25.7222 10.7419 25.9507 10.5134C26.1793 10.2848 26.4893 10.1564 26.8125 10.1564Z"
                    fill="white"
                    fillOpacity={0.6}
                  />
                </Svg>
                <Text style={styles.pillText}>Health & Wellness</Text>
              </View>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Bottom Search Bar - visible when not searching */}
      {!isFocused && (
        <View style={styles.bottomBarContainer}>
          <SearchNavBar
            onHomePress={() => navigation.navigate("Dashboard")}
            onSearchPress={() => {
              setIsFocused(true);
              inputRef.current?.focus();
            }}
          />
        </View>
      )}

      {/* Full Screen Search Modal */}
      <Modal
        visible={isFocused}
        transparent={false}
        animationType="fade"
        onRequestClose={() => {
          setIsFocused(false);
          Keyboard.dismiss();
        }}
      >
        <LinearGradient
          colors={["#0E0D32", "#060616", "#060616"]}
          locations={[0, 0.35, 1]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={{ flex: 1 }}
        >
          <Image
            source={require("../assets/homePage/birthday-decoration.png")}
            style={styles.topDecoration}
          />
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
            keyboardVerticalOffset={0}
          >
            {/* Modal Header - Same as SearchScreen */}
            <View style={styles.headerRow}>
              <Text style={styles.header}>Search</Text>
              <View style={styles.profileWrap}>
                <Image
                  source={require("../components/GlassEffects/profile-liquid-glass.png")}
                  style={styles.circleOverlay}
                />
                <Image
                  source={{
                    uri: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&h=100&fit=crop",
                  }}
                  style={styles.avatarOnCircle}
                />
              </View>
            </View>

            {/* Suggestions - scrollable area */}
            <ScrollView
              style={styles.suggestionsContainer}
              contentContainerStyle={{ paddingBottom: 100 }}
            >
              <TouchableOpacity
                style={styles.suggestionRow}
                onPress={() => handleSuggestionPress(query || "Search")}
              >
                <Ionicons name="search" size={20} color="#F6F8F9" />
                <Text style={styles.suggestionText}>
                  {" "}
                  <Text style={{ color: "#9CA3AF" }}>{query || "Search"}</Text>
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.suggestionRow}
                onPress={() => handleSuggestionPress("Music Events")}
              >
                <Ionicons name="search" size={20} color="#F6F8F9" />
                <Text style={styles.suggestionText}>
                  <Text style={{ color: "#9CA3AF" }}>Music Events</Text>
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.suggestionRow}
                onPress={() => handleSuggestionPress("Upcoming Events")}
              >
                <Ionicons name="search" size={20} color="#F6F8F9" />
                <Text style={styles.suggestionText}>
                  {" "}
                  <Text style={{ color: "#9CA3AF" }}>Upcoming Events</Text>
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </KeyboardAvoidingView>

          {/* Search Bar with Close button - styled like SearchNavBar */}
          <View
            style={[
              styles.modalSearchBarAbsolute,
              { bottom: keyboardHeight + 18 },
            ]}
          >
            <View style={styles.modalSearchBarBlur}>
              <BlurView intensity={24} tint="dark" style={StyleSheet.absoluteFill} />
              <Image
                source={require("../components/GlassEffects/Glass Effect.png")}
                style={styles.modalShineOverlay}
              />
              <View style={styles.modalSearchBarInput}>
                <Ionicons
                  name="search"
                  size={18}
                  color="#8F8E9B"
                  style={{ marginRight: 8 }}
                />
                <TextInput
                  ref={inputRef}
                  value={query}
                  onChangeText={setQuery}
                  placeholder="Categories, Groups and More"
                  placeholderTextColor="#8F8E9B"
                  style={styles.modalInputText}
                  autoFocus
                />
              </View>
            </View>
            <View style={styles.modalCloseBtnBlur}>
              <BlurView intensity={24} tint="dark" style={StyleSheet.absoluteFill} />
              <Image
                source={require("../components/GlassEffects/circleGlassEffect.png")}
                style={styles.modalCloseShine}
              />
              <TouchableOpacity
                style={styles.modalSearchBarCloseBtn}
                onPress={() => {
                  setQuery("");
                  setIsFocused(false);
                  Keyboard.dismiss();
                }}
              >
                <Ionicons name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#05031B" },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 12,
    zIndex: 2,
  },
  header: { color: "#F6F8F9", fontSize: 30, fontWeight: "700" },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  glassCard: {
    borderRadius: 22,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    backgroundColor: "rgba(255, 255, 255, 0.08)",
  },
  profileWrap: {
    width: 54,
    height: 54,
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  circleOverlay: {
    position: "absolute",
    width: 54,
    height: 54,
    resizeMode: "contain",
    top: 0,
    left: 0,
  },
  avatarOnCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    zIndex: 2,
  },
  suggestionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: "#8F8E9B",
  },
  suggestionText: { color: "#ffffff", fontSize: 15 },
  divider: { height: 12 },

  sectionTitle: {
    color: "#F6F8F9",
    fontSize: 18,
    fontWeight: "700",
    paddingHorizontal: 20,
    marginBottom: 10,
    marginTop: 20,
  },
  channelRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 2,
  },
  channelDivider: {
    height: 1,
    backgroundColor: "#8F8E9B",
    marginLeft: 88,
    marginRight: 20,
  },
  channelLogo: { width: 56, height: 56, borderRadius: 22, marginRight: 12 },
  channelName: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  channelSub: { color: "#9CA3AF", fontSize: 12 },
  channelAction: {
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  // Horizontal Scroll Column Styles
  channelColumn: {
    width: 340,
    marginRight: 20,
  },
  channelListItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  channelDividerLine: {
    height: 1,
    backgroundColor: "#8F8E9B",
    marginLeft: 68,
    marginRight: 4,
    marginTop: -4,
  },
  // Old card styles (keeping for backwards compatibility)
  channelCard: {
    width: 140,
    marginRight: 16,
    paddingBottom: 12,
    borderRadius: 24,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    padding: 12,
    alignItems: "flex-start",
  },
  channelCardLogo: {
    width: 48,
    height: 48,
    borderRadius: 8,
    marginBottom: 8,
  },
  channelCardName: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "400",
    marginBottom: 2,
  },
  channelCardSub: {
    color: "#9CA3AF",
    fontSize: 11,
    marginBottom: 8,
  },
  channelCardAction: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  adTag: {
    backgroundColor: "#3734C6",
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    alignSelf: "flex-start",
  },
  adTagText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "700",
  },
  card: {
    marginHorizontal: 20,
    backgroundColor: "#15113A",
    borderRadius: 16,
    overflow: "hidden",
  },
  happeningNowCard: {
    width: 280,
    marginRight: 20,
    backgroundColor: "#0E0D32",
    borderRadius: 16,
    overflow: "hidden",
  },
  cardImage: { width: "100%", height: 160 },
  imageContainer: {
    margin: 8,
    marginBottom: 0,
    borderRadius: 18,
    overflow: "hidden",
    position: "relative",
  },
  happeningNowCardImage: {
    width: "100%",
    height: 140,
  },
  cardBody: { padding: 12 },
  cardBodyWithProfile: {
    padding: 12,
    paddingTop: 20,
  },
  cardBadgeRow: { flexDirection: "row", gap: 8, marginBottom: 6 },
  badgeOnImageRow: {
    position: "absolute",
    top: 138,
    left: 16,
    right: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 12,
  },
  badgeGlass: {
    backgroundColor: "rgba(0, 120, 0, 0.7)",
    borderRadius: 16,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  badgePrice: {
    backgroundColor: "rgba(127, 0, 255, 0.7)",
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  badgePriceText: { color: "#fff", fontWeight: "700", fontSize: 13 },
  badge: {
    backgroundColor: "#18C964",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  badgeText: { color: "#fff", fontWeight: "700", fontSize: 12 },
  cardTitle: { color: "#fff", fontWeight: "700", fontSize: 16, marginTop: 2 },
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
  cardMeta: { color: "#9CA3AF", fontSize: 12 },
  cardFooterRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
    marginLeft: 32,
  },
  attendees: { color: "#7F93FF", fontWeight: "600" },
  rating: {
    backgroundColor: "#2A2455",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  ratingText: { color: "#FFC107", fontWeight: "700" },
  browseGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    paddingHorizontal: 6,
    rowGap: 6,
    columnGap: 6,
    marginBottom: 4,
  },
  browsePill: {
    width: "43%",
    aspectRatio: 1.9,
    borderRadius: 36,
    marginBottom: 2,
    overflow: "hidden",
    backgroundColor: "rgba(255,255,255,0.13)",
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.22)",
    position: "relative",
    padding: 0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 4,
  },
  allEventsPill: {
    aspectRatio: 160 / 86,
    borderRadius: 30,
    backgroundColor: "transparent",
    borderWidth: 0,
  },
  musicPill: {
    aspectRatio: 160 / 86,
    borderRadius: 30,
    backgroundColor: "transparent",
    borderWidth: 0,
  },
  cooporatePill: {
    aspectRatio: 160 / 86,
    borderRadius: 30,
    backgroundColor: "transparent",
    borderWidth: 0,
  },
  religiousPill: {
    aspectRatio: 160 / 86,
    borderRadius: 30,
    backgroundColor: "transparent",
    borderWidth: 0,
  },
  artsPill: {
    aspectRatio: 100 / 56,
    borderRadius: 28,
    backgroundColor: "transparent",
    borderWidth: 0,
  },
  partiesPill: {
    aspectRatio: 100 / 56,
    borderRadius: 28,
    backgroundColor: "transparent",
    borderWidth: 0,
  },
  sportsPill: {
    aspectRatio: 100 / 56,
    borderRadius: 28,
    backgroundColor: "transparent",
    borderWidth: 0,
  },
  moviesPill: {
    aspectRatio: 100 / 56,
    borderRadius: 28,
    backgroundColor: "transparent",
    borderWidth: 0,
  },
  fashionPill: {
    aspectRatio: 100 / 56,
    borderRadius: 28,
    backgroundColor: "transparent",
    borderWidth: 0,
  },
  healthPill: {
    aspectRatio: 100 / 56,
    borderRadius: 28,
    backgroundColor: "transparent",
    borderWidth: 0,
  },
  pillContent: {
    flex: 1,
    width: "100%",
    height: "100%",
    position: "relative",
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  pillOverlay: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: "stretch",
    zIndex: 0,
  },
  pillIcon: {
    position: "absolute",
    top: 16,
    left: 18,
    zIndex: 1,
    fontSize: 36,
  },
  pillText: {
    position: "absolute",
    bottom: 16,
    right: 18,
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
    zIndex: 1,
    opacity: 0.95,
  },
  bottomBarContainer: {
    position: "absolute",
    bottom: 18,
    left: 20,
    right: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  bottomSearchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1C1840",
    borderRadius: 28,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  bottomInput: { flex: 1, color: "#fff", fontSize: 15 },
  bottomCircleBtn: {
    marginLeft: 10,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#2A2455",
    alignItems: "center",
    justifyContent: "center",
  },
  // Modal-specific styles
  modalContainer: {
    flex: 1,
    backgroundColor: "#0A0630",
  },
  suggestionsContainer: {
    flex: 1,
  },
  modalSearchBarWrapper: {
    backgroundColor: "transparent",
  },
  modalSearchBarAbsolute: {
    position: "absolute",
    left: 20,
    right: 20,
    bottom: 0,
    paddingBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "transparent",
    zIndex: 20,
  },
  modalSearchBarBlur: {
    flex: 1,
    height: 52,
    borderRadius: 296,
    overflow: "hidden",
    position: "relative",
    marginRight: 12,
  },
  modalShineOverlay: {
    ...StyleSheet.absoluteFillObject,
    width: undefined,
    height: undefined,
    resizeMode: "stretch",
    opacity: 1,
  },
  modalSearchBarInput: {
    flex: 1,
    height: 52,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.001)",
    borderRadius: 296,
    paddingHorizontal: 18,
  },
  modalInputText: {
    flex: 1,
    color: "#fff",
    fontSize: 15,
    fontWeight: "500",
  },
  modalCloseBtnBlur: {
    width: 52,
    height: 52,
    borderRadius: 26,
    overflow: "hidden",
    position: "relative",
  },
  modalCloseShine: {
    ...StyleSheet.absoluteFillObject,
    width: undefined,
    height: undefined,
    resizeMode: "stretch",
    opacity: 1,
  },
  modalSearchBarCloseBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.001)",
  },
  suggestionsOverlay: {
    position: "absolute",
    bottom: 80,
    left: 0,
    right: 0,
    backgroundColor: "#0A0630",
    zIndex: 999,
    borderTopWidth: 1,
    borderTopColor: "#8F8E9B",
  },
  topDecoration: {
    position: "absolute",
    top: 60,
    alignSelf: "center",
    width: "80%",
    height: "80%",
    resizeMode: "cover",
    opacity: 0.1,
    zIndex: 0,
  },
});
