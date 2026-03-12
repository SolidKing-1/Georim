import React, { useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image as RNImage } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import Svg, { Path, Line } from "react-native-svg";
import { useNavigation } from "@react-navigation/native";
import EventCard from "../components/EventCard";
import DateTimeBadge from "../components/DateTimeBadge";

function MonthArrowLeftIcon({
  size = 7,
  color = "#5D5C6E",
}: {
  size?: number;
  color?: string;
}) {
  return (
    <Svg width={size} height={size * (11 / 7)} viewBox="0 0 7 11" fill="none">
      <Path
        d="M0.373127 6.3434L5.34269 10.7157C5.95773 11.2556 6.83383 10.7417 6.83383 9.84096V1.09502C6.83383 0.194322 5.95773 -0.319583 5.34405 0.22029L0.373127 4.59394C-0.124376 5.03131 -0.124376 5.90467 0.373127 6.34203"
        fill={color}
      />
    </Svg>
  );
}

function MonthArrowRightIcon({
  size = 7,
  color = "#6E23BA",
}: {
  size?: number;
  color?: string;
}) {
  return (
    <Svg width={size} height={size * (11 / 7)} viewBox="0 0 7 11" fill="none">
      <Path
        d="M6.46061 6.3434L1.49105 10.7157C0.876008 11.2556 -8.86917e-05 10.7417 -8.86917e-05 9.84096V1.09502C-8.86917e-05 0.194322 0.876008 -0.319583 1.48969 0.22029L6.46061 4.59394C6.95812 5.03131 6.95812 5.90467 6.46061 6.34203"
        fill={color}
      />
    </Svg>
  );
}

function CalendarIcon({
  size = 28,
  color = "rgba(255,255,255,0.85)",
}: {
  size?: number;
  color?: string;
}) {
  return (
    <Svg width={size} height={size * (22 / 28)} viewBox="0 0 28 22" fill="none">
      <Path
        d="M22.4412 5.62141V10.6641C22.2136 10.6309 21.9804 10.6162 21.744 10.6162C21.4985 10.6162 21.2564 10.6321 21.0204 10.6683V8.15409C21.0204 7.34222 20.5792 6.91862 19.7937 6.91862H7.4921C6.70672 6.91862 6.27431 7.34222 6.27431 8.15409V16.4758C6.27431 17.2965 6.70672 17.7112 7.4921 17.7112H16.2351C16.3574 18.2173 16.5539 18.6944 16.8116 19.132H7.6245C5.78012 19.132 4.85352 18.2231 4.85352 16.3964V5.62141C4.85352 3.79467 5.78012 2.88574 7.6245 2.88574H19.679C21.5234 2.88574 22.4412 3.80352 22.4412 5.62141Z"
        fill={color}
      />
      <Path
        d="M9.92777 14.9402V15.4609C9.92777 15.7697 9.83071 15.8668 9.51303 15.8668H9.00116C8.68348 15.8668 8.58643 15.7697 8.58643 15.4609V14.9402C8.58643 14.6313 8.68348 14.5431 9.00116 14.5431H9.51303C9.83071 14.5431 9.92777 14.6313 9.92777 14.9402ZM12.8576 14.9402V15.4609C12.8576 15.7697 12.7605 15.8668 12.4516 15.8668H11.931C11.6221 15.8668 11.5162 15.7697 11.5162 15.4609V14.9402C11.5162 14.6313 11.6221 14.5431 11.931 14.5431H12.4516C12.7605 14.5431 12.8576 14.6313 12.8576 14.9402ZM15.7962 14.9402V15.4609C15.7962 15.7697 15.6903 15.8668 15.3814 15.8668H14.8608C14.5519 15.8668 14.446 15.7697 14.446 15.4609V14.9402C14.446 14.6313 14.5519 14.5431 14.8608 14.5431H15.3814C15.6903 14.5431 15.7962 14.6313 15.7962 14.9402ZM9.92777 12.0545V12.5752C9.92777 12.8841 9.83071 12.9723 9.51303 12.9723H9.00116C8.68348 12.9723 8.58643 12.8841 8.58643 12.5752V12.0545C8.58643 11.7457 8.68348 11.6574 9.00116 11.6574H9.51303C9.83071 11.6574 9.92777 11.7457 9.92777 12.0545ZM12.8576 12.0545V12.5752C12.8576 12.8841 12.7605 12.9723 12.4516 12.9723H11.931C11.6221 12.9723 11.5162 12.8841 11.5162 12.5752V12.0545C11.5162 11.7457 11.6221 11.6574 11.931 11.6574H12.4516C12.7605 11.6574 12.8576 11.7457 12.8576 12.0545ZM15.7962 12.0545V12.5752C15.7962 12.8841 15.6903 12.9723 15.3814 12.9723H14.8608C14.5519 12.9723 14.446 12.8841 14.446 12.5752V12.0545C14.446 11.7457 14.5519 11.6574 14.8608 11.6574H15.3814C15.6903 11.6574 15.7962 11.7457 15.7962 12.0545ZM12.8576 9.16886V9.68951C12.8576 9.99837 12.7605 10.0866 12.4516 10.0866H11.931C11.6221 10.0866 11.5162 9.99837 11.5162 9.68951V9.16886C11.5162 8.85999 11.6221 8.76294 11.931 8.76294H12.4516C12.7605 8.76294 12.8576 8.85999 12.8576 9.16886ZM15.7962 9.16886V9.68951C15.7962 9.99837 15.6903 10.0866 15.3814 10.0866H14.8608C14.5519 10.0866 14.446 9.99837 14.446 9.68951V9.16886C14.446 8.85999 14.5519 8.76294 14.8608 8.76294H15.3814C15.6903 8.76294 15.7962 8.85999 15.7962 9.16886ZM18.726 9.16886V9.68951C18.726 9.99837 18.6201 10.0866 18.3112 10.0866H17.7906C17.4817 10.0866 17.3846 9.99837 17.3846 9.68951V9.16886C17.3846 8.85999 17.4817 8.76294 17.7906 8.76294H18.3112C18.6201 8.76294 18.726 8.85999 18.726 9.16886Z"
        fill={color}
      />
      <Path
        d="M26.2271 16.3082C26.2271 18.7614 24.171 20.7911 21.7442 20.7911C19.2821 20.7911 17.2612 18.7791 17.2612 16.3082C17.2612 13.8549 19.2821 11.8252 21.7442 11.8252C24.1975 11.8252 26.2271 13.8461 26.2271 16.3082ZM21.2059 14.0402V15.7698H19.4762C19.1585 15.7698 18.9379 15.9817 18.9379 16.3082C18.9379 16.6347 19.1585 16.8464 19.4762 16.8464H21.2059V18.5761C21.2059 18.9026 21.4177 19.1144 21.7442 19.1144C22.0707 19.1144 22.2825 18.9026 22.2825 18.5761V16.8464H24.0033C24.3298 16.8464 24.5504 16.6347 24.5504 16.3082C24.5504 15.9817 24.3298 15.7698 24.0033 15.7698H22.2825V14.0402C22.2825 13.7225 22.0707 13.5019 21.7442 13.5019C21.4177 13.5019 21.2059 13.7225 21.2059 14.0402Z"
        fill={color}
      />
    </Svg>
  );
}

const CircleGlassEffect = require("../components/GlassEffects/circleGlassEffect.png");

const EVENT_COVER = require("../assets/event-details/first.jpg");

type EventItem = {
  id: string;
  title: string;
  locationCity: string;
  venue: string;
  rating: number;
  attendingText: string;
  timeLabel: string;
  tag: string;
  price: string;
  category?: string;
};

type CalendarDay = {
  key: string;
  dow: string;
  day: string;
  isSelected?: boolean;
  isPast?: boolean;
  isFutureOrToday?: boolean;
  date: Date;
};

const CATEGORY_OPTIONS = [
  "All Events",
  "Music",
  "Corporate",
  "Religious",
  "Arts & Culture",
  "Parties",
  "Sports",
  "Movies",
  "Fashion",
  "Health & Wellness",
];

function getMonday(d: Date): Date {
  const copy = new Date(d);
  const day = copy.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  copy.setDate(copy.getDate() + diff);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

function addDays(d: Date, n: number): Date {
  const copy = new Date(d);
  copy.setDate(copy.getDate() + n);
  return copy;
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function isBefore(a: Date, b: Date): boolean {
  const aDate = new Date(a.getFullYear(), a.getMonth(), a.getDate());
  const bDate = new Date(b.getFullYear(), b.getMonth(), b.getDate());
  return aDate.getTime() < bDate.getTime();
}

const { width: SCREEN_W } = Dimensions.get("window");

export default function EventsScheduleScreen() {
  const navigation = useNavigation<any>();
  const [hasNewNotifications] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState("All Events");
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [viewMonth, setViewMonth] = useState(() => new Date());
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [chipLayout, setChipLayout] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);
  const chipRef = useRef<View>(null);

  const handleFilterChipPress = () => {
    if (showCategoryDropdown) {
      setShowCategoryDropdown(false);
    } else if (chipRef.current) {
      chipRef.current.measureInWindow((x, y, width, height) => {
        setChipLayout({ x, y, width, height });
        setShowCategoryDropdown(true);
      });
    }
  };

  const currentEvents: EventItem[] = useMemo(
    () => [
      {
        id: "c1",
        title: "Ultra Music Festival, 2025",
        locationCity: "Grambling, LA",
        venue: "Digital Library",
        rating: 4.5,
        attendingText: "120+ Attending",
        timeLabel: "3:00pm",
        tag: "Going On",
        price: "Paid",
        category: "Music",
      },
      {
        id: "c2",
        title: "Ultra Music Festival, 2025",
        locationCity: "Grambling, LA",
        venue: "Digital Library",
        rating: 4.5,
        attendingText: "120+ Attending",
        timeLabel: "3:00pm",
        tag: "Going On",
        price: "Paid",
        category: "Corporate",
      },
      {
        id: "c3",
        title: "Ultra Music Festival, 2025",
        locationCity: "Grambling, LA",
        venue: "Digital Library",
        rating: 4.5,
        attendingText: "120+ Attending",
        timeLabel: "3:00pm",
        tag: "Going On",
        price: "Paid",
        category: "Music",
      },
    ],
    [],
  );

  const pastEvents: EventItem[] = useMemo(
    () => [
      {
        id: "p1",
        title: "Ultra Music Festival, 2025",
        locationCity: "Grambling, LA",
        venue: "Digital Library",
        rating: 4.5,
        attendingText: "120+ Attending",
        timeLabel: "3:00pm",
        tag: "Going On",
        price: "Paid",
        category: "Religious",
      },
      {
        id: "p2",
        title: "Ultra Music Festival, 2025",
        locationCity: "Grambling, LA",
        venue: "Digital Library",
        rating: 4.5,
        attendingText: "120+ Attending",
        timeLabel: "3:00pm",
        tag: "Going On",
        price: "Paid",
        category: "Arts & Culture",
      },
      {
        id: "p3",
        title: "Ultra Music Festival, 2025",
        locationCity: "Grambling, LA",
        venue: "Digital Library",
        rating: 5.0,
        attendingText: "120+ Attending",
        timeLabel: "3:00pm",
        tag: "Going On",
        price: "Paid",
        category: "Sports",
      },
    ],
    [],
  );

  const upcomingTimelineRaw: {
    id: string;
    badge: { top: string; value: string };
    event: EventItem;
  }[] = useMemo(
    () => [
      {
        id: "u1",
        badge: { top: "MIN", value: "15" },
        event: {
          id: "u1e",
          title: "Ultra Music Festival, 2025",
          locationCity: "Grambling, LA",
          venue: "Digital Library",
          rating: 4.5,
          attendingText: "120+ Attending",
          timeLabel: "3:00pm",
          tag: "In 15 Min",
          price: "Paid",
          category: "Music",
        },
      },
      {
        id: "u2",
        badge: { top: "MIN", value: "40" },
        event: {
          id: "u2e",
          title: "Ultra Music Festival, 2025",
          locationCity: "Grambling, LA",
          venue: "Digital Library",
          rating: 4.5,
          attendingText: "120+ Attending",
          timeLabel: "3:00pm",
          tag: "In 40 Min",
          price: "Paid",
          category: "Corporate",
        },
      },
      {
        id: "u3",
        badge: { top: "HR", value: "1" },
        event: {
          id: "u3e",
          title: "Ultra Music Festival, 2025",
          locationCity: "Grambling, LA",
          venue: "Digital Library",
          rating: 4.5,
          attendingText: "120+ Attending",
          timeLabel: "3:00pm",
          tag: "In 1 Hr",
          price: "Paid",
          category: "Parties",
        },
      },
      {
        id: "u4",
        badge: { top: "HR", value: "1:02" },
        event: {
          id: "u4e",
          title: "Ultra Music Festival, 2025",
          locationCity: "Grambling, LA",
          venue: "Digital Library",
          rating: 4.5,
          attendingText: "120+ Attending",
          timeLabel: "3:00pm",
          tag: "In 1:02 Hr",
          price: "Paid",
          category: "Music",
        },
      },
    ],
    [],
  );

  const upcomingTimeline = useMemo(() => {
    if (categoryFilter === "All Events") return upcomingTimelineRaw;
    return upcomingTimelineRaw.filter(
      (row) => row.event.category === categoryFilter,
    );
  }, [upcomingTimelineRaw, categoryFilter]);

  const weekStrip: CalendarDay[] = useMemo(() => {
    const today = new Date();
    const year = viewMonth.getFullYear();
    const month = viewMonth.getMonth();
    const lastDay = new Date(year, month + 1, 0).getDate();
    const days: CalendarDay[] = [];
    for (let day = 1; day <= lastDay; day++) {
      const d = new Date(year, month, day);
      const isPast = isBefore(d, today);
      const isFutureOrToday = !isPast;
      days.push({
        key: `d${day}`,
        dow: d
          .toLocaleString("default", { weekday: "short" })
          .toUpperCase()
          .slice(0, 3),
        day: String(day),
        date: d,
        isSelected: isSameDay(d, selectedDate),
        isPast,
        isFutureOrToday,
      });
    }
    return days;
  }, [viewMonth, selectedDate]);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <View style={styles.glassCircle}>
          <BlurView
            intensity={24}
            tint="dark"
            style={StyleSheet.absoluteFill}
          />
          <RNImage source={CircleGlassEffect} style={styles.glassShine} />
          <TouchableOpacity
            style={styles.glassInner}
            onPress={() => navigation.goBack()}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <View style={{ flex: 1 }} />

        <View style={styles.headerIconsRight}>
          <View style={styles.glassCircle}>
            <BlurView
              intensity={24}
              tint="dark"
              style={StyleSheet.absoluteFill}
            />
            <RNImage source={CircleGlassEffect} style={styles.glassShine} />
            <TouchableOpacity style={styles.glassInner} onPress={() => {}}>
              <CalendarIcon size={28} />
            </TouchableOpacity>
          </View>

          <View style={styles.glassCircle}>
            <BlurView
              intensity={24}
              tint="dark"
              style={StyleSheet.absoluteFill}
            />
            <RNImage source={CircleGlassEffect} style={styles.glassShine} />
            <TouchableOpacity style={styles.glassInner} onPress={() => {}}>
              <Ionicons
                name="notifications-outline"
                size={24}
                color="rgba(255,255,255,0.85)"
              />
            </TouchableOpacity>
            {hasNewNotifications && <View style={styles.badgeDot} />}
          </View>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>Current Events</Text>
        <FlatList
          data={currentEvents}
          keyExtractor={(i) => i.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 10 }}
          renderItem={({ item }) => (
            <EventCard
              image={EVENT_COVER}
              title={item.title}
              location={`${item.locationCity} • ${item.venue}`}
              time={item.timeLabel}
              state={item.tag}
              price={item.price}
              attendees={120}
              rating={item.rating.toFixed(1)}
              month="Nov"
              day="27"
              onPress={() =>
                navigation.navigate("EventDetails", {
                  eventId: item.id,
                  event: { ...item, image: EVENT_COVER },
                })
              }
              showQRCode
              eventStatus={getEventStatus(item.tag)}
              width={Math.min(268, SCREEN_W * 0.72)}
              marginRight={14}
            />
          )}
        />

        <Text style={[styles.sectionTitle, { marginTop: 24 }]}>
          Upcoming Events
        </Text>

        <View style={styles.calendarWrap}>
          <View style={styles.calendarHeaderRow}>
            <Pressable
              ref={chipRef}
              style={styles.allEventsChip}
              onPress={handleFilterChipPress}
            >
              <Text style={styles.allEventsChipText} numberOfLines={1}>
                {categoryFilter}
              </Text>
              <Ionicons
                name={showCategoryDropdown ? "chevron-up" : "chevron-down"}
                size={12}
                color="#FFFFFF"
                style={{ marginLeft: 4 }}
              />
            </Pressable>
            <View style={styles.monthRow}>
              <Pressable
                style={styles.monthArrow}
                onPress={() => {
                  const next = new Date(
                    viewMonth.getFullYear(),
                    viewMonth.getMonth() - 1,
                  );
                  setViewMonth(next);
                  setSelectedDate(
                    new Date(next.getFullYear(), next.getMonth(), 1),
                  );
                }}
              >
                <MonthArrowLeftIcon size={12} />
              </Pressable>
              <Text style={styles.monthText}>
                {viewMonth
                  .toLocaleString("default", { month: "long" })
                  .toUpperCase()}
              </Text>
              <Pressable
                style={styles.monthArrow}
                onPress={() => {
                  const next = new Date(
                    viewMonth.getFullYear(),
                    viewMonth.getMonth() + 1,
                  );
                  setViewMonth(next);
                  setSelectedDate(
                    new Date(next.getFullYear(), next.getMonth(), 1),
                  );
                }}
              >
                <MonthArrowRightIcon size={12} />
              </Pressable>
            </View>
          </View>

          <Modal
            visible={showCategoryDropdown}
            transparent
            animationType="fade"
            onRequestClose={() => setShowCategoryDropdown(false)}
          >
            <Pressable
              style={styles.dropdownOverlay}
              onPress={() => setShowCategoryDropdown(false)}
            >
              {chipLayout && (
                <Pressable
                  style={[
                    styles.dropdownContainer,
                    {
                      position: "absolute",
                      top: chipLayout.y + chipLayout.height + 4,
                      left: chipLayout.x,
                    },
                  ]}
                  onPress={() => {}}
                >
                  <ScrollView
                    style={{ maxHeight: 280 }}
                    showsVerticalScrollIndicator={false}
                    nestedScrollEnabled
                  >
                    {CATEGORY_OPTIONS.map((option) => (
                      <Pressable
                        key={option}
                        style={styles.dropdownOption}
                        onPress={() => {
                          setCategoryFilter(option);
                          setShowCategoryDropdown(false);
                        }}
                      >
                        <Text style={styles.dropdownOptionText}>{option}</Text>
                      </Pressable>
                    ))}
                  </ScrollView>
                </Pressable>
              )}
            </Pressable>
          </Modal>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.weekRow}
          >
            {weekStrip.map((d) => (
              <Pressable
                key={d.key}
                style={[styles.dayCell, d.isSelected && styles.dayCellSelected]}
                onPress={() => {
                  setSelectedDate(d.date);
                  setViewMonth(
                    new Date(d.date.getFullYear(), d.date.getMonth()),
                  );
                }}
              >
                <Text
                  style={
                    d.isSelected
                      ? styles.dowTextSelected
                      : d.isPast
                        ? styles.dowText
                        : styles.dowTextFuture
                  }
                >
                  {d.dow}
                </Text>
                <Text
                  style={
                    d.isSelected
                      ? styles.dayTextSelected
                      : d.isPast
                        ? styles.dayText
                        : styles.dayTextFuture
                  }
                >
                  {d.day}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        <View style={{ marginTop: 20, paddingHorizontal: 20 }}>
          {upcomingTimeline.map((row, idx) => (
            <TimelineRow
              key={row.id}
              badgeTop={row.badge.top}
              badgeValue={row.badge.value}
              showLine
              isLastRow={idx === upcomingTimeline.length - 1}
              event={row.event}
              onPress={() => {}}
            />
          ))}
        </View>

        <Text style={[styles.sectionTitle, { marginTop: 30 }]}>
          Past Events
        </Text>
        <FlatList
          data={pastEvents}
          keyExtractor={(i) => i.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingVertical: 10,
            paddingBottom: 100,
          }}
          renderItem={({ item }) => (
            <EventCard
              image={EVENT_COVER}
              title={item.title}
              location={`${item.locationCity} • ${item.venue}`}
              time={item.timeLabel}
              state={item.tag}
              price={item.price}
              attendees={120}
              rating={item.rating.toFixed(1)}
              month="Nov"
              day="27"
              onPress={() =>
                navigation.navigate("EventDetails", {
                  eventId: item.id,
                  event: { ...item, image: EVENT_COVER },
                })
              }
              showQRCode
              eventStatus="past"
              width={Math.min(268, SCREEN_W * 0.72)}
              marginRight={14}
            />
          )}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

function getEventStatus(tag: string): "past" | "soon" | "ongoing" | "default" {
  const t = tag.toLowerCase();
  if (t.includes("going on") || t === "ongoing") return "ongoing";
  if (
    t.includes("in 15 min") ||
    t.includes("in 40 min") ||
    t.includes("in 1 hr") ||
    t.includes("in 1:02")
  )
    return "soon";
  if (t.includes("past") || t === "past") return "past";
  return "default";
}

function TimelineRow({
  badgeTop,
  badgeValue,
  showLine,
  isLastRow,
  event,
  onPress,
}: {
  badgeTop: string;
  badgeValue: string;
  showLine: boolean;
  isLastRow: boolean;
  event: EventItem;
  onPress: () => void;
}) {
  return (
    <View style={styles.timelineRow}>
      <View style={styles.timelineLeft}>
        <DateTimeBadge
          topLabel={badgeTop}
          bottomValue={badgeValue}
          size="large"
          topLabelStyle={styles.timelineBadgeTopLabel}
          bottomValueStyle={styles.timelineBadgeBottomValue}
        />

        <View style={styles.timelineLineWrap}>
          {showLine && (
            <>
              <View style={styles.timelineLineSvgWrap}>
                <Svg
                  width="100%"
                  height="100%"
                  viewBox="0 0 1 189"
                  preserveAspectRatio="none"
                >
                  <Line
                    x1={0.44}
                    y1={0}
                    x2={0.44}
                    y2={189}
                    stroke="#F4EAFE"
                    strokeWidth={0.88}
                    strokeDasharray="2.65 2.65"
                  />
                </Svg>
              </View>
              {isLastRow && <View style={styles.timelineEndCircle} />}
            </>
          )}
        </View>
      </View>

      <View style={styles.timelineRight}>
        <EventCard
          image={EVENT_COVER}
          title={event.title}
          location={`${event.locationCity} • ${event.venue}`}
          time={event.timeLabel}
          state={event.tag}
          price={event.price}
          attendees={120}
          rating={event.rating.toFixed(1)}
          month="Nov"
          day="27"
          onPress={onPress}
          showQRCode
          showDateBadge={false}
          eventStatus={getEventStatus(event.tag)}
          width={SCREEN_W - 118}
          marginRight={0}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#05031B" },

  header: {
    height: 58,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  glassCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: "hidden",
    position: "relative",
  },
  glassShine: {
    ...StyleSheet.absoluteFillObject,
    width: undefined,
    height: undefined,
    resizeMode: "stretch",
  },
  glassInner: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.001)",
  },
  headerIconsRight: {
    flexDirection: "row",
    gap: 12,
  },
  badgeDot: {
    position: "absolute",
    right: 7,
    top: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FF3B30",
    zIndex: 2,
  },

  content: { paddingBottom: 24 },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    paddingHorizontal: 20,
    marginTop: 10,
    color: "#FFFFFF",
  },

  // Calendar
  calendarWrap: {
    marginTop: 10,
    paddingHorizontal: 20,
  },
  calendarHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
    position: "relative",
  },
  allEventsChip: {
    flexDirection: "row",
    alignItems: "center",
    flexShrink: 0,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: "#DEBFFD",
  },
  allEventsChipText: { fontSize: 10, fontWeight: "600", color: "#FFFFFF" },
  dropdownOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  dropdownContainer: {
    alignSelf: "flex-start",
    backgroundColor: "#05031B",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#DEBFFD",
    paddingVertical: 4,
    paddingHorizontal: 4,
  },
  dropdownOption: {
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  dropdownOptionText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#FFFFFF",
  },

  monthRow: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    minWidth: 0,
  },
  monthArrow: {
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  monthText: {
    marginHorizontal: 8,
    fontSize: 13,
    fontWeight: "600",
    letterSpacing: 1,
    color: "#FFFFFF",
  },

  weekRow: {
    flexDirection: "row",
    paddingRight: 20,
  },
  dayCell: {
    width: 40,
    marginHorizontal: 4,
    height: 70,
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
  },
  dayCellSelected: { backgroundColor: "#6E23BA", borderRadius: 8 },
  dowText: { fontSize: 12, fontWeight: "600", color: "#5D5C6E" },
  dowTextSelected: { color: "#FFFFFF" },
  dowTextFuture: { fontSize: 12, fontWeight: "600", color: "#FFFFFF" },
  dayText: { fontSize: 18, fontWeight: "700", color: "#5D5C6E" },
  dayTextSelected: { color: "#FFFFFF" },
  dayTextFuture: { fontSize: 18, fontWeight: "700", color: "#FFFFFF" },

  // Timeline
  timelineRow: { flexDirection: "row", marginBottom: 18, gap: 2 },
  timelineLeft: { width: 62, alignItems: "center", paddingTop: 12 },
  timelineBadgeTopLabel: {
    fontSize: 10,
    fontWeight: "400",
    textTransform: "uppercase",
  },
  timelineBadgeBottomValue: {
    fontSize: 18,
    fontWeight: "400",
  },
  timelineLineWrap: { flex: 1, alignItems: "center" },
  timelineLineSvgWrap: {
    flex: 1,
    width: 2,
    marginTop: 6,
    marginBottom: -26,
    minHeight: 20,
  },
  timelineEndCircle: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: "#DEBFFD",
    backgroundColor: "transparent",
    marginTop: 24,
    marginBottom: -2,
  },

  timelineRight: { flex: 1 },
});
