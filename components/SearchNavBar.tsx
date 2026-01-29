import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { useNavigation } from "@react-navigation/native";
import Svg, { Path, Rect } from "react-native-svg";

type SearchNavBarProps = {
  onHomePress?: () => void;
  onSearchPress?: () => void;
  variant?: "default" | "dashboard";
  activeTab?: string;
};

export default function SearchNavBar({ 
  onHomePress, 
  onSearchPress,
  variant = "default",
  activeTab = "Home"
}: SearchNavBarProps) {
  const navigation = useNavigation<any>();

  // Dashboard variant: pill-shaped nav + circular search button
  if (variant === "dashboard") {
    return (
      <View style={styles.dashboardContainer}>
        {/* Pill-shaped navigation container */}
        <View style={styles.navPillContainer}>
          <BlurView 
            intensity={Platform.OS === "ios" ? 24 : 0} 
            tint="dark" 
            style={StyleSheet.absoluteFill} 
          />
          {Platform.OS === "android" && (
            <View style={[StyleSheet.absoluteFill, styles.androidGlass]} />
          )}
          <Image
            source={require("./GlassEffects/Glass Effect.png")}
            style={styles.navPillShineOverlay}
          />
          
          {/* Home (Active) */}
          <TouchableOpacity
            style={[
              styles.navItem,
              activeTab === "Home" && styles.navItemActive
            ]}
            onPress={() => {
              navigation.navigate("Dashboard");
            }}
          >
            <Svg width={22} height={19} viewBox="0 0 22 19" fill="none">
              <Path
                d="M8.27976 18.0522H13.592V12.2214C13.592 11.8062 13.3172 11.5354 12.8959 11.5354H8.98501C8.56368 11.5354 8.27976 11.8062 8.27976 12.2214V18.0522ZM0.787677 9.6399C1.04413 9.6399 1.25479 9.50451 1.44713 9.35108L10.6153 1.76009C10.7161 1.67886 10.8351 1.63373 10.9359 1.63373C11.0458 1.63373 11.1557 1.67886 11.2565 1.76009L20.4338 9.35108C20.617 9.50451 20.8276 9.6399 21.0841 9.6399C21.5787 9.6399 21.8718 9.2879 21.8718 8.91782C21.8718 8.71023 21.7894 8.49358 21.5787 8.33112L12.035 0.433256C11.6869 0.144418 11.3114 0 10.9359 0C10.5604 0 10.1848 0.144418 9.8368 0.433256L0.293089 8.33112C0.0915904 8.49358 0 8.71023 0 8.91782C0 9.2879 0.293089 9.6399 0.787677 9.6399ZM16.8984 4.84705L19.1973 6.76056V2.68979C19.1973 2.29264 18.9409 2.03991 18.5379 2.03991H17.5579C17.164 2.03991 16.8984 2.29264 16.8984 2.68979V4.84705ZM4.74438 18.982H17.1365C18.4371 18.982 19.1973 18.2508 19.1973 16.9872V6.98623L17.7227 6.00239V16.6261C17.7227 17.2128 17.4022 17.5287 16.8251 17.5287H5.0558C4.46962 17.5287 4.14905 17.2128 4.14905 16.6261V6.01141L2.67444 6.98623V16.9872C2.67444 18.2598 3.43464 18.982 4.74438 18.982Z"
                fill={activeTab === "Home" ? "#932FF8" : "#FFFFFF"}
              />
            </Svg>
            <Text
              style={[
                styles.navItemText,
                activeTab === "Home" && styles.navItemTextActive
              ]}
            >
              Home
            </Text>
          </TouchableOpacity>

          {/* Explore */}
          <TouchableOpacity
            style={styles.navItem}
            onPress={() => {
              navigation.navigate("ExploreScreen");
            }}
          >
            <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
              <Rect
                x="4"
                y="3"
                width="16"
                height="18"
                rx="2"
                stroke={activeTab === "Explore" ? "#932FF8" : "#FFFFFF"}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <Path
                d="M11 8H8"
                stroke={activeTab === "Explore" ? "#932FF8" : "#FFFFFF"}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <Path
                d="M8 12H16"
                stroke={activeTab === "Explore" ? "#932FF8" : "#FFFFFF"}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <Path
                d="M16 16H8"
                stroke={activeTab === "Explore" ? "#932FF8" : "#FFFFFF"}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
            <Text
              style={[
                styles.navItemText,
                activeTab === "Explore" && styles.navItemTextActive
              ]}
            >
              Explore
            </Text>
          </TouchableOpacity>

          {/* Community */}
          <TouchableOpacity
            style={styles.navItem}
            onPress={() => {
              // Navigate to community/check-in or appropriate screen
              navigation.navigate("CheckinScreen");
            }}
          >
            <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
              <Rect
                x="3"
                y="3.00001"
                width="18"
                height="18"
                rx="5"
                stroke={activeTab === "Community" ? "#932FF8" : "#F3F3F3"}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <Path
                d="M16 10.5L13.002 13.5L10 11.5L8 13.5"
                stroke={activeTab === "Community" ? "#932FF8" : "#FFFFFF"}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
            <Text
              style={[
                styles.navItemText,
                activeTab === "Community" && styles.navItemTextActive
              ]}
            >
              Community
            </Text>
          </TouchableOpacity>

          {/* Profile */}
          <TouchableOpacity
            style={styles.navItem}
            onPress={() => {
              navigation.navigate("Profile");
            }}
          >
            <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
              <Path
                d="M15.75 6C15.75 8.07107 14.0711 9.75 12 9.75C9.92893 9.75 8.24999 8.07107 8.24999 6C8.24999 3.92893 9.92893 2.25 12 2.25C14.0711 2.25 15.75 3.92893 15.75 6Z"
                stroke={activeTab === "Profile" ? "#932FF8" : "#FFFFFF"}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <Path
                d="M4.50113 20.1182C4.57143 16.0369 7.90187 12.75 12 12.75C16.0982 12.75 19.4287 16.0371 19.4989 20.1185C17.2161 21.166 14.6764 21.75 12.0003 21.75C9.32399 21.75 6.78409 21.1659 4.50113 20.1182Z"
                stroke={activeTab === "Profile" ? "#932FF8" : "#FFFFFF"}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
            <Text
              style={[
                styles.navItemText,
                activeTab === "Profile" && styles.navItemTextActive
              ]}
            >
              Profile
            </Text>
          </TouchableOpacity>
        </View>

        {/* Circular search button */}
        <View style={styles.searchCircleContainer}>
          <BlurView 
            intensity={Platform.OS === "ios" ? 24 : 0} 
            tint="dark" 
            style={StyleSheet.absoluteFill} 
          />
          {Platform.OS === "android" && (
            <View style={[StyleSheet.absoluteFill, styles.searchCircleAndroidGlass]} />
          )}
          <Image
            source={require("./GlassEffects/circleGlassEffect.png")}
            style={styles.searchCircleShine}
          />
          <TouchableOpacity
            style={styles.searchCircleTouchable}
            onPress={() => {
              if (onSearchPress) {
                onSearchPress();
              } else {
                navigation.navigate("Search");
              }
            }}
          >
            <Svg width={21} height={21} viewBox="0 0 21 21" fill="none">
              <Path
                d="M0 8.40039C0 7.23828 0.21582 6.15088 0.647461 5.13818C1.08464 4.12549 1.68783 3.23454 2.45703 2.46533C3.23177 1.69059 4.12549 1.0874 5.13818 0.655762C6.15641 0.218587 7.24382 0 8.40039 0C9.55697 0 10.6416 0.218587 11.6543 0.655762C12.6725 1.0874 13.5662 1.69059 14.3354 2.46533C15.1047 3.23454 15.7078 4.12549 16.145 5.13818C16.5822 6.15088 16.8008 7.23828 16.8008 8.40039C16.8008 9.37435 16.6403 10.304 16.3193 11.1895C15.9984 12.0693 15.5557 12.8634 14.9912 13.5718L20.4365 19.042C20.5361 19.1471 20.6108 19.2661 20.6606 19.3989C20.716 19.5317 20.7437 19.6729 20.7437 19.8223C20.7437 20.027 20.6966 20.2152 20.6025 20.3867C20.514 20.5583 20.3867 20.6938 20.2207 20.7935C20.0547 20.8931 19.8638 20.9429 19.6479 20.9429C19.4985 20.9429 19.3547 20.9152 19.2163 20.8599C19.078 20.8045 18.9562 20.7243 18.8511 20.6191L13.3809 15.1406C12.6836 15.6608 11.9116 16.0675 11.0649 16.3608C10.2238 16.6486 9.33561 16.7925 8.40039 16.7925C7.24382 16.7925 6.15641 16.5767 5.13818 16.145C4.12549 15.7078 3.23177 15.1047 2.45703 14.3354C1.68783 13.5607 1.08464 12.667 0.647461 11.6543C0.21582 10.6416 0 9.55697 0 8.40039ZM1.55225 8.40039C1.55225 9.34115 1.72933 10.2266 2.0835 11.0566C2.4432 11.8812 2.93571 12.6089 3.56104 13.2397C4.18636 13.8651 4.9113 14.3548 5.73584 14.709C6.56592 15.0632 7.4541 15.2402 8.40039 15.2402C9.34115 15.2402 10.2238 15.0632 11.0483 14.709C11.8784 14.3548 12.6061 13.8651 13.2314 13.2397C13.8623 12.6089 14.3548 11.8812 14.709 11.0566C15.0632 10.2266 15.2402 9.34115 15.2402 8.40039C15.2402 7.4541 15.0632 6.56868 14.709 5.74414C14.3548 4.91406 13.8623 4.18636 13.2314 3.56104C12.6061 2.93018 11.8784 2.43766 11.0483 2.0835C10.2238 1.72933 9.34115 1.55225 8.40039 1.55225C7.4541 1.55225 6.56592 1.72933 5.73584 2.0835C4.9113 2.43766 4.18636 2.93018 3.56104 3.56104C2.93571 4.18636 2.4432 4.91406 2.0835 5.74414C1.72933 6.56868 1.55225 7.4541 1.55225 8.40039Z"
                fill="#FFFFFF"
              />
            </Svg>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Default variant: home button + search bar
  return (
    <View style={styles.container}>
      <View style={styles.homeBtnBlur}>
        <BlurView intensity={24} tint="dark" style={StyleSheet.absoluteFill} />
        <Image
          source={require("./GlassEffects/circleGlassEffect.png")}
          style={styles.homeShine}
        />
        <TouchableOpacity style={styles.homeBtn} onPress={onHomePress}>
          <Svg width={22} height={19} viewBox="0 0 22 19" fill="none">
            <Path
              d="M8.27976 18.0522H13.592V12.2214C13.592 11.8062 13.3172 11.5354 12.8959 11.5354H8.98501C8.56368 11.5354 8.27976 11.8062 8.27976 12.2214V18.0522ZM0.787677 9.6399C1.04413 9.6399 1.25479 9.50451 1.44713 9.35108L10.6153 1.76009C10.7161 1.67886 10.8351 1.63373 10.9359 1.63373C11.0458 1.63373 11.1557 1.67886 11.2565 1.76009L20.4338 9.35108C20.617 9.50451 20.8276 9.6399 21.0841 9.6399C21.5787 9.6399 21.8718 9.2879 21.8718 8.91782C21.8718 8.71023 21.7894 8.49358 21.5787 8.33112L12.035 0.433256C11.6869 0.144418 11.3114 0 10.9359 0C10.5604 0 10.1848 0.144418 9.8368 0.433256L0.293089 8.33112C0.0915904 8.49358 0 8.71023 0 8.91782C0 9.2879 0.293089 9.6399 0.787677 9.6399ZM16.8984 4.84705L19.1973 6.76056V2.68979C19.1973 2.29264 18.9409 2.03991 18.5379 2.03991H17.5579C17.164 2.03991 16.8984 2.29264 16.8984 2.68979V4.84705ZM4.74438 18.982H17.1365C18.4371 18.982 19.1973 18.2508 19.1973 16.9872V6.98623L17.7227 6.00239V16.6261C17.7227 17.2128 17.4022 17.5287 16.8251 17.5287H5.0558C4.46962 17.5287 4.14905 17.2128 4.14905 16.6261V6.01141L2.67444 6.98623V16.9872C2.67444 18.2598 3.43464 18.982 4.74438 18.982Z"
              fill="#FFFFFF"
            />
          </Svg>
        </TouchableOpacity>
      </View>
      <View style={styles.searchBarBlur}>
        <BlurView intensity={24} tint="dark" style={StyleSheet.absoluteFill} />
        <Image
          source={require("./GlassEffects/Glass Effect.png")}
          style={styles.shineOverlay}
        />
        <TouchableOpacity
          style={styles.searchBar}
          onPress={onSearchPress}
          activeOpacity={1}
        >
          <Ionicons
            name="search"
            size={18}
            color="#8F8E9B"
            style={{ marginRight: 8 }}
          />
          <Text style={styles.placeholder}>Categories, Groups and More</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    justifyContent: "center",
  },
  homeBtnBlur: {
    width: 52,
    height: 52,
    borderRadius: 26,
    marginRight: 12,
    overflow: "hidden",
    position: "relative",
  },
  homeBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.001)",
  },
  homeShine: {
    ...StyleSheet.absoluteFillObject,
    width: undefined,
    height: undefined,
    resizeMode: "stretch",
    opacity: 1,
  },
  searchBarBlur: {
    flex: 1,
    height: 52,
    borderRadius: 296,
    overflow: "hidden",
    position: "relative",
  },
  shineOverlay: {
    ...StyleSheet.absoluteFillObject,
    width: undefined,
    height: undefined,
    resizeMode: "stretch",
    opacity: 1,
  },
  searchBar: {
    flex: 1,
    height: 52,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.001)",
    borderRadius: 296,
    paddingHorizontal: 18,
    paddingVertical: 0,
  },
  placeholder: {
    color: "#8F8E9B",
    fontSize: 15,
    fontWeight: "500",
  },
  // Dashboard variant styles
  dashboardContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  navPillContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    height: 60,
    borderRadius: 30,
    overflow: "hidden",
    position: "relative",
    backgroundColor: Platform.OS === "android" ? "rgba(79, 119, 135, 0.4)" : "transparent",
    paddingHorizontal: 8,
  },
  androidGlass: {
    backgroundColor: "rgba(79, 119, 135, 0.4)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
  },
  navPillShineOverlay: {
    ...StyleSheet.absoluteFillObject,
    width: undefined,
    height: undefined,
    resizeMode: "stretch",
    opacity: 1,
  },
  navItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 20,
    minHeight: 44,
  },
  navItemActive: {
    backgroundColor: "#0E0D32",
    paddingVertical: 6,
    paddingHorizontal: 0,
    borderRadius: 26, // More pill-shaped for rectangular appearance
  },
  navItemText: {
    fontSize: 10,
    fontWeight: "400",
    color: "#FFFFFF",
    marginTop: 4,
    fontFamily: "Hero",
  },
  navItemTextActive: {
    color: "#932FF8",
    fontWeight: "600",
  },
  searchCircleContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    overflow: "hidden",
    position: "relative",
    backgroundColor: Platform.OS === "android" ? "rgba(79, 119, 135, 0.4)" : "transparent",
  },
  searchCircleAndroidGlass: {
    backgroundColor: "rgba(79, 119, 135, 0.4)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 30,
  },
  searchCircleShine: {
    ...StyleSheet.absoluteFillObject,
    width: undefined,
    height: undefined,
    resizeMode: "stretch",
    opacity: 1,
  },
  searchCircleTouchable: {
    justifyContent: "center",
    alignItems: "center",
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "transparent",
    zIndex: 3,
  },
});
