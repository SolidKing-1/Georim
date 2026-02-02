import React, { useState, useCallback, useMemo, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Pressable,
  Dimensions,
  ImageSourcePropType,
  FlatList,
  ViewToken,
  Platform,
} from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { Video, ResizeMode } from "expo-av";
import { LinearGradient } from "expo-linear-gradient";
import type { RootStackParamList } from "../App";
import TicketSelectionModal, {
  type TicketSelectionModalRef,
} from "../components/TicketSelectionModal";

const CircleGlassEffect = require("../components/GlassEffects/circleGlassEffect.png");

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
// Hero: a little bit more than half the screen height
const HERO_HEIGHT = Math.round(SCREEN_HEIGHT * 0.45);
const HERO_MARGIN = 20;
const HERO_CONTENT_WIDTH = SCREEN_WIDTH - HERO_MARGIN * 2;
const FORM_BG = "#05031B";
const HERO_DARK = "#1a1a2e";
// Blurred hero overlaps form by this much; gradient fade height (no visible line)
const OVERLAP = 120;
const FORM_NEGATIVE_MARGIN = 300;

type CarouselItem =
  | { type: "image"; source: ImageSourcePropType | { uri: string } }
  | { type: "video"; source: ReturnType<typeof require> };

const COHORT_OPTIONS = [
  { id: "cohort2", label: "Cohort 2 (Senior)" },
  { id: "cohort3", label: "Cohort 3 (Junior)" },
  { id: "cohort4", label: "Cohort 4 (Sophomore)" },
  { id: "cohort5", label: "Cohort 5 (HBCC Scholars)" },
  { id: "alumni", label: "Strada Scholar Alumni" },
] as const;

const DIETARY_OPTIONS = [
  { id: "vegetarian", label: "Vegetarian" },
  { id: "vegan", label: "Vegan" },
  { id: "glutenFree", label: "Gluten Free" },
  { id: "dairyFree", label: "Dairy Free" },
  { id: "shellfish", label: "Shellfish Allergy" },
  { id: "nut", label: "Nut Allergy" },
  { id: "other", label: "Other" },
] as const;

const SHIRT_SIZE_OPTIONS = [
  { id: "mens_s", label: "Men's - Small" },
  { id: "mens_m", label: "Men's - Medium" },
  { id: "mens_l", label: "Men's - Large" },
  { id: "mens_xl", label: "Men's - X-Large" },
  { id: "womens_s", label: "Women's - Small" },
  { id: "womens_m", label: "Women's - Medium" },
  { id: "womens_l", label: "Women's - Large" },
  { id: "womens_xl", label: "Women's - X-Large" },
] as const;

/** Default placeholder carousel (up to 3): images + video from assets */
const DEFAULT_CAROUSEL: CarouselItem[] = [
  { type: "image", source: require("../assets/ruston-fest.png") },
  { type: "image", source: require("../assets/Home/event-1.jpg") },
  { type: "video", source: require("../assets/Home/play.mp4") },
];

type RegisterEventRoute = RouteProp<RootStackParamList, "RegisterEvent">;

function RegisterEventScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<RegisterEventRoute>();
  const insets = useSafeAreaInsets();
  const { eventId, event, selectedTier } = route.params ?? {};

  const [registrationType, setRegistrationType] = useState("Strada Scholar");
  const [selectedCohort, setSelectedCohort] = useState<string | null>(
    "cohort5"
  );
  const [heroIndex, setHeroIndex] = useState(0);
  const [areaOfStudy, setAreaOfStudy] = useState("Computer Science");
  const [institution, setInstitution] = useState("Grambling State Univ...");
  const [dietary, setDietary] = useState<Set<string>>(
    () => new Set(DIETARY_OPTIONS.map((o) => o.id))
  );
  const [dietaryOther, setDietaryOther] = useState("");
  const [accessibility, setAccessibility] = useState("");
  const [shirtSize, setShirtSize] = useState<string | null>("mens_s");
  const ticketModalRef = useRef<TicketSelectionModalRef>(null);

  const toggleDietary = (id: string) => {
    setDietary((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Carousel sits below nav buttons; extends to where blur ends (bottom of hero); dots overlay carousel
  const BUTTON_ROW_HEIGHT = 60 + insets.top;
  const CAROUSEL_HEIGHT = HERO_HEIGHT + OVERLAP - BUTTON_ROW_HEIGHT;

  const carouselItems = useMemo((): CarouselItem[] => {
    const fromEvent: CarouselItem[] = [];
    if (event?.imageUrl)
      fromEvent.push({ type: "image", source: { uri: event.imageUrl } });
    if ((event as any)?.images?.length)
      (event as any).images.slice(0, 3).forEach((img: string | number) => {
        if (typeof img === "string")
          fromEvent.push({ type: "image", source: { uri: img } });
        else
          fromEvent.push({ type: "image", source: img as ImageSourcePropType });
      });
    // Only add single image when event has no images array (e.g. events 3 & 4)
    if (!(event as any)?.images?.length && (event as any)?.image)
      fromEvent.push({ type: "image", source: (event as any).image });
    if ((event as any)?.video)
      fromEvent.push({ type: "video", source: (event as any).video });
    if (fromEvent.length > 0) return fromEvent.slice(0, 3);
    return DEFAULT_CAROUSEL;
  }, [event]);

  /** For video carousel items: use one of the event's images for blurred background */
  const eventFallbackImage = useMemo(():
    | ImageSourcePropType
    | { uri: string }
    | null => {
    if (!event) return null;
    if ((event as any)?.image != null) return (event as any).image;
    const imgs = (event as any)?.images;
    if (imgs?.length && imgs[0] != null)
      return typeof imgs[0] === "string"
        ? { uri: imgs[0] }
        : (imgs[0] as ImageSourcePropType);
    if (event?.imageUrl) return { uri: event.imageUrl };
    return null;
  }, [event]);

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      const idx = viewableItems[0]?.index;
      if (typeof idx === "number") setHeroIndex(idx);
    },
    []
  );
  const viewabilityConfig = useMemo(
    () => ({ viewAreaCoveragePercentThreshold: 50 }),
    []
  );

  const handleNext = () => {
    ticketModalRef.current?.present();
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  const currentItem = carouselItems[heroIndex] ?? carouselItems[0];

  const renderCarouselItem = useCallback(
    ({ item, index }: { item: CarouselItem; index: number }) => (
      <View style={[styles.carouselPage, { height: CAROUSEL_HEIGHT }]}>
        {item.type === "image" ? (
          <Image
            source={item.source}
            style={[styles.carouselContent, { height: CAROUSEL_HEIGHT }]}
            resizeMode="cover"
          />
        ) : (
          <Video
            source={item.source}
            style={[styles.carouselContent, { height: CAROUSEL_HEIGHT }]}
            resizeMode={ResizeMode.COVER}
            isLooping
            isMuted
            shouldPlay={index === heroIndex}
          />
        )}
      </View>
    ),
    [heroIndex, CAROUSEL_HEIGHT]
  );

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero: blurred full-bleed sits on top of form in overlap zone */}
        <View
          style={[
            styles.heroWrap,
            { height: HERO_HEIGHT + OVERLAP, zIndex: 2 },
          ]}
        >
          <View
            style={[StyleSheet.absoluteFill, { height: HERO_HEIGHT + OVERLAP }]}
          >
            {currentItem.type === "image" ? (
              <Image
                source={currentItem.source}
                style={[styles.heroImage, { height: HERO_HEIGHT + OVERLAP }]}
                resizeMode="cover"
              />
            ) : (
              <Image
                source={
                  eventFallbackImage ?? require("../assets/Home/event-1.jpg")
                }
                style={[styles.heroImage, { height: HERO_HEIGHT + OVERLAP }]}
                resizeMode="cover"
              />
            )}
            <BlurView
              intensity={Platform.OS === "ios" ? 60 : 45}
              tint="dark"
              style={StyleSheet.absoluteFill}
            />
            {/* Translucent gradient overlay: blur fades in overlap zone so form gradient merges */}
            <LinearGradient
              colors={["transparent", FORM_BG] as const}
              locations={[HERO_HEIGHT / (HERO_HEIGHT + OVERLAP), 1]}
              style={StyleSheet.absoluteFill}
              pointerEvents="none"
            />
          </View>

          {/* Carousel: sharp image/video below buttons, reduced height */}
          <FlatList
            data={carouselItems}
            renderItem={renderCarouselItem}
            keyExtractor={(_, i) => String(i)}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onViewableItemsChanged={onViewableItemsChanged}
            viewabilityConfig={viewabilityConfig}
            snapToInterval={SCREEN_WIDTH}
            snapToAlignment="center"
            decelerationRate="fast"
            style={[
              styles.carouselList,
              { top: BUTTON_ROW_HEIGHT, height: CAROUSEL_HEIGHT },
            ]}
            contentContainerStyle={styles.carouselContentContainer}
          />

          {/* Pagination dots at bottom of carousel (bottom of hero/blur) */}
          <View style={styles.pagination}>
            {carouselItems.map((_, i) => (
              <View
                key={i}
                style={[styles.dot, i === heroIndex && styles.dotActive]}
              />
            ))}
          </View>
        </View>

        {/* Form section: sits under hero; hero blur overlaps on top */}
        <View
          style={[
            styles.formSectionWrap,
            { marginTop: -FORM_NEGATIVE_MARGIN, zIndex: 1 },
          ]}
        >
          <LinearGradient
            colors={["rgba(5, 3, 27, 0)", FORM_BG] as const}
            locations={[0, 0.4]}
            style={styles.formSectionGradientFull}
          >
            <View
              style={[
                styles.formSection,
                { paddingTop: FORM_NEGATIVE_MARGIN + 24 },
              ]}
            >
              <Text style={styles.title}>More Information</Text>
              <Text style={styles.instructions}>
                Fill out the information below, then click Next to continue.
              </Text>

              {/* Registration Type */}
              <Text style={styles.label}>
                <Text style={styles.asterisk}>* </Text>
                Registration Type
              </Text>
              <TextInput
                style={styles.input}
                value={registrationType}
                onChangeText={setRegistrationType}
                placeholder="Strada Scholar"
                placeholderTextColor="#9CA3AF"
                editable
              />

              {/* Cohort */}
              <Text style={styles.label}>
                <Text style={styles.asterisk}>* </Text>
                Which Cohort are you a part of?
              </Text>
              <View style={styles.radioGroup}>
                {COHORT_OPTIONS.map((opt) => (
                  <Pressable
                    key={opt.id}
                    style={styles.radioRow}
                    onPress={() => setSelectedCohort(opt.id)}
                  >
                    <View
                      style={[
                        styles.radioCircle,
                        selectedCohort === opt.id && styles.radioCircleActive,
                      ]}
                    >
                      {selectedCohort === opt.id && (
                        <View style={styles.radioInner} />
                      )}
                    </View>
                    <Text style={styles.radioLabel}>{opt.label}</Text>
                  </Pressable>
                ))}
              </View>

              {/* Area of study */}
              <Text style={styles.label}>
                <Text style={styles.asterisk}>* </Text>
                What is your area of study?
              </Text>
              <TextInput
                style={styles.input}
                value={areaOfStudy}
                onChangeText={setAreaOfStudy}
                placeholder="e.g. Computer Science"
                placeholderTextColor="#9CA3AF"
                editable
              />

              {/* Institution */}
              <Text style={styles.label}>
                <Text style={styles.asterisk}>* </Text>
                Institution
              </Text>
              <TextInput
                style={styles.input}
                value={institution}
                onChangeText={setInstitution}
                placeholder="e.g. Grambling State University"
                placeholderTextColor="#9CA3AF"
                editable
              />

              {/* Dietary restrictions */}
              <Text style={styles.label}>
                Please select what dietary restrictions that apply, if any.
              </Text>
              <View style={styles.checkboxGroup}>
                {DIETARY_OPTIONS.map((opt) => (
                  <Pressable
                    key={opt.id}
                    style={styles.checkboxRow}
                    onPress={() => toggleDietary(opt.id)}
                  >
                    <View
                      style={[
                        styles.checkbox,
                        dietary.has(opt.id) && styles.checkboxActive,
                      ]}
                    >
                      {dietary.has(opt.id) && (
                        <View style={styles.checkboxInner} />
                      )}
                    </View>
                    <Text style={styles.radioLabel}>{opt.label}</Text>
                  </Pressable>
                ))}
              </View>
              {dietary.has("other") && (
                <TextInput
                  style={[styles.input, { marginTop: 0 }]}
                  value={dietaryOther}
                  onChangeText={setDietaryOther}
                  placeholder="Specify other"
                  placeholderTextColor="#9CA3AF"
                  editable
                />
              )}

              {/* Accessibility */}
              <Text style={styles.label}>
                Do you have any accessibility requirements ?
              </Text>
              <TextInput
                style={[styles.input, styles.inputMultiline]}
                value={accessibility}
                onChangeText={setAccessibility}
                placeholder="Optional"
                placeholderTextColor="#9CA3AF"
                multiline
                numberOfLines={3}
                textAlignVertical="top"
                editable
              />

              {/* Shirt size */}
              <Text style={styles.label}>
                <Text style={styles.asterisk}>* </Text>
                Please select your shirt size.
              </Text>
              <View style={styles.checkboxGroup}>
                {SHIRT_SIZE_OPTIONS.map((opt) => (
                  <Pressable
                    key={opt.id}
                    style={styles.checkboxRow}
                    onPress={() => setShirtSize(opt.id)}
                  >
                    <View
                      style={[
                        styles.checkbox,
                        shirtSize === opt.id && styles.checkboxActive,
                      ]}
                    >
                      {shirtSize === opt.id && (
                        <View style={styles.checkboxInner} />
                      )}
                    </View>
                    <Text style={styles.radioLabel}>{opt.label}</Text>
                  </Pressable>
                ))}
              </View>

              {/* Cancel and Next buttons */}
              <View style={styles.buttonRow}>
                <Pressable
                  style={({ pressed }) => [
                    styles.cancelButton,
                    pressed && styles.cancelButtonPressed,
                  ]}
                  onPress={handleCancel}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </Pressable>
                <Pressable
                  style={({ pressed }) => [
                    styles.nextButton,
                    pressed && styles.nextButtonPressed,
                  ]}
                  onPress={handleNext}
                >
                  <Text style={styles.nextButtonText}>Next</Text>
                </Pressable>
              </View>

              <View style={{ height: 40 }} />
            </View>
          </LinearGradient>
        </View>
      </ScrollView>

      {/* Fixed hero buttons: stay on screen when scrolling */}
      <View
        style={[
          styles.heroButtons,
          styles.heroButtonsFixed,
          { paddingTop: 8 + insets.top },
        ]}
        pointerEvents="box-none"
      >
        <View style={styles.heroButtonGlass}>
          <BlurView
            intensity={24}
            tint="dark"
            style={StyleSheet.absoluteFill}
          />
          <Image source={CircleGlassEffect} style={styles.heroButtonShine} />
          <TouchableOpacity
            style={styles.heroButtonInner}
            onPress={() => navigation.goBack()}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
        <View style={styles.heroButtonsRight}>
          <View style={styles.heroButtonGlass}>
            <BlurView
              intensity={24}
              tint="dark"
              style={StyleSheet.absoluteFill}
            />
            <Image source={CircleGlassEffect} style={styles.heroButtonShine} />
            <TouchableOpacity style={styles.heroButtonInner}>
              <Ionicons name="bookmark-outline" size={22} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          <View style={styles.heroButtonGlass}>
            <BlurView
              intensity={24}
              tint="dark"
              style={StyleSheet.absoluteFill}
            />
            <Image source={CircleGlassEffect} style={styles.heroButtonShine} />
            <TouchableOpacity style={styles.heroButtonInner}>
              <Ionicons name="share-outline" size={22} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <TicketSelectionModal
        ref={ticketModalRef}
        eventTitle={(event as any)?.title ?? (event as any)?.name ?? "Event"}
        eventDescription={(event as any)?.description}
        onSelectTicket={(tier) => {
          ticketModalRef.current?.dismiss();
          navigation.navigate("RegisterEvent", {
            eventId: eventId ?? "",
            event,
            selectedTier: tier,
          });
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: FORM_BG,
  },
  heroButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  heroButtonsFixed: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  heroButtonGlass: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: "hidden",
    position: "relative",
  },
  heroButtonShine: {
    ...StyleSheet.absoluteFillObject,
    width: undefined,
    height: undefined,
    resizeMode: "stretch",
  },
  heroButtonInner: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.001)",
  },
  heroButtonsRight: {
    flexDirection: "row",
    gap: 12,
  },
  heroWrap: {
    width: SCREEN_WIDTH,
    backgroundColor: HERO_DARK,
    overflow: "hidden",
    position: "relative",
  },
  heroImage: {
    width: SCREEN_WIDTH,
  },
  carouselList: {
    position: "absolute",
    left: 0,
    right: 0,
  },
  carouselContentContainer: {},
  carouselPage: {
    width: SCREEN_WIDTH,
    justifyContent: "center",
    alignItems: "center",
  },
  carouselContent: {
    width: HERO_CONTENT_WIDTH,
    borderRadius: 10,
    overflow: "hidden",
  },
  formSectionWrap: {
    width: SCREEN_WIDTH,
  },
  formSectionGradientFull: {
    width: SCREEN_WIDTH,
  },
  formSection: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 24,
  },
  pagination: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#F6F8F9",
    opacity: 0.3,
  },
  dotActive: {
    backgroundColor: "#7F00FF",
    width: 60,
    borderRadius: 4,
    opacity: 0.3,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: "#F6F8F9",
    marginBottom: 8,
  },
  instructions: {
    fontSize: 14,
    color: "#FFFFFF",
    marginBottom: 24,
    lineHeight: 20,
    fontWeight: "400",
  },
  label: {
    fontSize: 16,
    fontWeight: "400",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  asterisk: {
    color: "#EF4444",
  },
  input: {
    backgroundColor: "#1E1E3F",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#6B7280",
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: "#FFFFFF",
    marginBottom: 20,
  },
  radioGroup: {
    marginBottom: 28,
  },
  radioRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  radioCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  radioCircleActive: {
    borderColor: "#7F00FF",
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#7F00FF",
  },
  radioLabel: {
    fontSize: 16,
    color: "#FFFFFF",
  },
  checkboxGroup: {
    marginBottom: 20,
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  checkboxActive: {
    borderColor: "#7F00FF",
  },
  checkboxInner: {
    width: 14,
    height: 14,
    borderRadius: 2,
    backgroundColor: "#7F00FF",
  },
  inputMultiline: {
    minHeight: 88,
    paddingTop: 14,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "rgba(30, 30, 63, 0.85)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#9CA3AF",
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButtonPressed: {
    opacity: 0.9,
  },
  cancelButtonText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  nextButton: {
    flex: 1,
    backgroundColor: "#7F00FF",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  nextButtonPressed: {
    opacity: 0.9,
  },
  nextButtonText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});

export default RegisterEventScreen;
