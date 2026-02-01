import React, { forwardRef, useImperativeHandle, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Pressable,
} from "react-native";
import {
  BottomSheetModal,
  BottomSheetScrollView,
  BottomSheetBackdrop,
} from "@gorhom/bottom-sheet";
import { Ionicons } from "@expo/vector-icons";
import Svg, { Path } from "react-native-svg";

function TicketIcon({
  size = 26,
  color = "#7F00FF",
}: {
  size?: number;
  color?: string;
}) {
  return (
    <Svg width={size} height={size} viewBox="0 0 26 26" fill="none">
      <Path
        d="M24.541 3.25879C25.3604 3.34196 25.9999 4.03365 26 4.875V7.76855L25.9912 7.93066C25.908 8.7316 25.2187 9.35814 24.4814 9.72559C23.2796 10.3245 22.4541 11.5661 22.4541 13C22.4541 14.4339 23.2797 15.6747 24.4814 16.2734C25.2678 16.6652 25.9998 17.352 26 18.2305V21.125C26 22.0225 25.2725 22.75 24.375 22.75H1.625C0.783598 22.75 0.0919639 22.1105 0.00878906 21.291L0 21.125V18.2305C0.000157543 17.4617 0.56059 16.8395 1.22754 16.4336L1.51855 16.2734C2.72033 15.6747 3.5459 14.4339 3.5459 13C3.54586 11.6557 2.8202 10.4808 1.73926 9.8457L1.51855 9.72559C0.781299 9.35814 0.0920311 8.7316 0.00878906 7.93066L0 7.76855V4.875C5.79985e-05 4.03365 0.639562 3.34196 1.45898 3.25879L1.625 3.25H24.375L24.541 3.25879ZM1.625 4.33301C1.32588 4.33301 1.08307 4.5759 1.08301 4.875V7.76855C1.08316 8.01241 1.32735 8.42062 2.00195 8.75684C3.4597 9.48354 4.49367 10.9419 4.61719 12.6543L4.62891 13C4.62891 14.8607 3.55615 16.4684 2.00098 17.2432C1.3269 17.5791 1.08322 17.9867 1.08301 18.2305V21.125C1.08301 21.4242 1.32585 21.667 1.625 21.667H5.95801V21.0576C5.95801 20.7585 6.20085 20.5156 6.5 20.5156C6.79915 20.5156 7.04199 20.7585 7.04199 21.0576V21.667H24.375C24.6742 21.667 24.917 21.4242 24.917 21.125V18.2305C24.9168 17.9867 24.6731 17.5791 23.999 17.2432C22.541 16.5168 21.5063 15.0583 21.3828 13.3457L21.3711 13C21.3711 11.1396 22.4431 9.53198 23.998 8.75684C24.6727 8.42062 24.9168 8.01241 24.917 7.76855V4.875C24.9169 4.5759 24.6741 4.33301 24.375 4.33301H7.04199V4.94336C7.04167 5.24224 6.79896 5.48438 6.5 5.48438C6.20104 5.48438 5.95833 5.24224 5.95801 4.94336V4.33301H1.625ZM6.5 15.9121C6.79905 15.9121 7.04181 16.1541 7.04199 16.4531V18.7559C7.04167 19.0547 6.79896 19.2969 6.5 19.2969C6.20104 19.2969 5.95833 19.0547 5.95801 18.7559V16.4531C5.95819 16.1541 6.20095 15.9121 6.5 15.9121ZM18.958 15.708C19.2572 15.708 19.5 15.9508 19.5 16.25C19.5 16.5492 19.2572 16.792 18.958 16.792H10.833C10.5341 16.7918 10.291 16.549 10.291 16.25C10.291 15.951 10.5341 15.7082 10.833 15.708H18.958ZM6.5 11.3076C6.79915 11.3076 7.04199 11.5505 7.04199 11.8496V14.1514C7.04185 14.4504 6.79906 14.6934 6.5 14.6934C6.20094 14.6934 5.95815 14.4504 5.95801 14.1514V11.8496C5.95801 11.5505 6.20085 11.3076 6.5 11.3076ZM17.333 12.458C17.6322 12.458 17.875 12.7008 17.875 13C17.875 13.2992 17.6322 13.542 17.333 13.542H10.833C10.5341 13.5418 10.291 13.299 10.291 13C10.291 12.701 10.5341 12.4582 10.833 12.458H17.333ZM14.083 9.20801C14.3822 9.20801 14.625 9.45085 14.625 9.75C14.625 10.0492 14.3822 10.292 14.083 10.292H10.833C10.5341 10.2918 10.291 10.049 10.291 9.75C10.291 9.45099 10.5341 9.20824 10.833 9.20801H14.083ZM6.5 6.70312C6.79915 6.70312 7.04199 6.94596 7.04199 7.24512V9.54688C7.04185 9.84591 6.79906 10.0889 6.5 10.0889C6.20094 10.0889 5.95815 9.84591 5.95801 9.54688V7.24512C5.95801 6.94596 6.20085 6.70312 6.5 6.70312ZM21.666 5.41699C22.2642 5.41699 22.7498 5.90184 22.75 6.5L22.7441 6.61133C22.6884 7.15735 22.2267 7.58398 21.666 7.58398L21.5557 7.57812C21.0096 7.52251 20.5831 7.06069 20.583 6.5C20.5832 5.9021 21.0682 5.4174 21.666 5.41699Z"
        fill={color}
      />
    </Svg>
  );
}

function VerifiedIcon({
  size = 13,
  color = "#842ADF",
}: {
  size?: number;
  color?: string;
}) {
  return (
    <Svg width={size} height={size} viewBox="0 0 13 13" fill="none">
      <Path
        d="M6.98336 0.501978L7.79817 1.31149C7.88282 1.39086 7.95689 1.41731 8.068 1.41731H9.21084C10.1632 1.41731 10.5971 1.86175 10.5971 2.80353V3.95167C10.5971 4.05747 10.6288 4.13686 10.7082 4.21622L11.5177 5.03101C12.1843 5.69767 12.1896 6.3167 11.5177 6.98336L10.7082 7.79817C10.6288 7.88282 10.5971 7.95689 10.5971 8.068V9.21084C10.5971 10.1632 10.1579 10.5971 9.21084 10.5971H8.068C7.95689 10.5971 7.88282 10.6288 7.79817 10.7082L6.98336 11.5177C6.3167 12.1843 5.69767 12.1896 5.03101 11.5177L4.21622 10.7082C4.13686 10.6288 4.05747 10.5971 3.95167 10.5971H2.80353C1.85646 10.5971 1.41731 10.1579 1.41731 9.21084V8.068C1.41731 7.95689 1.39086 7.88282 1.31149 7.79817L0.501978 6.98336C-0.164678 6.3167 -0.169969 5.69767 0.501978 5.03101L1.31149 4.21622C1.39086 4.13686 1.41731 4.05747 1.41731 3.95167V2.80353C1.41731 1.85117 1.85646 1.41731 2.80353 1.41731H3.95167C4.05747 1.41731 4.13686 1.39086 4.21622 1.31149L5.03101 0.501978C5.69767 -0.164678 6.3167 -0.169969 6.98336 0.501978ZM7.65531 3.90933L5.39609 7.53891L4.32202 6.15269C4.18976 5.97808 4.07336 5.92518 3.92521 5.92518C3.68182 5.92518 3.49665 6.12094 3.49665 6.36433C3.49665 6.48073 3.54427 6.60242 3.62363 6.70824L4.95164 8.33784C5.08922 8.52302 5.23736 8.59181 5.41726 8.59181C5.59713 8.59181 5.75057 8.50716 5.86168 8.33784L8.34841 4.41727C8.41191 4.31144 8.4807 4.18976 8.4807 4.06807C8.4807 3.82468 8.26377 3.66595 8.03626 3.66595C7.8934 3.66595 7.75585 3.74531 7.65531 3.90933Z"
        fill={color}
      />
    </Svg>
  );
}

export type TicketTier = {
  id: string;
  title: string;
  benefits: string;
  price: string;
};

export type CreatorProfile = {
  username: string;
  avatarUrl?: string;
  bio: string;
  verified?: boolean;
};

export type TicketSelectionModalRef = {
  present: () => void;
  dismiss: () => void;
};

type TicketSelectionModalProps = {
  eventTitle: string;
  eventDescription?: string;
  tickets?: TicketTier[];
  creator?: CreatorProfile;
  onClose?: () => void;
  onSelectTicket?: (tier: TicketTier) => void;
  onBeMyBuzz?: () => void;
  onContact?: () => void;
  onInstagramPress?: () => void;
};

const defaultTickets: TicketTier[] = [
  {
    id: "ga",
    title: "General Admission",
    benefits: "Free drinks, Food trucks, and merchandise stands",
    price: "$100",
  },
  {
    id: "vip",
    title: "VIP",
    benefits: "Backstage access, Meet & greet, Premium seating",
    price: "$250",
  },
  {
    id: "premium",
    title: "Premium Guests",
    benefits: "Exclusive lounge, Private tables, VIP concierge",
    price: "$450",
  },
];

const defaultCreator: CreatorProfile = {
  username: "its_doggo",
  avatarUrl:
    "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=100&h=100&fit=crop",
  bio: "I create an experience where music is remixed, flipped, and reconstructed. #Curated by @unruely_+ @thecanterburyt",
  verified: true,
};

const TicketSelectionModal = forwardRef<
  TicketSelectionModalRef,
  TicketSelectionModalProps
>(function TicketSelectionModal(
  {
    eventTitle,
    eventDescription = "Join us for an unforgettable experience! Please select a ticket to secure your spot",
    tickets = defaultTickets,
    creator = defaultCreator,
    onClose,
    onSelectTicket,
    onBeMyBuzz,
    onContact,
    onInstagramPress,
  },
  ref
) {
  const bottomSheetRef = useRef<BottomSheetModal>(null);

  useImperativeHandle(ref, () => ({
    present: () => bottomSheetRef.current?.present(),
    dismiss: () => bottomSheetRef.current?.dismiss(),
  }));

  // ~92% of screen so a strip is visible at top for pull-down affordance
  const snapPoints = React.useMemo(() => ["92%"], []);

  const renderBackdrop = React.useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
      />
    ),
    []
  );

  return (
    <BottomSheetModal
      ref={bottomSheetRef}
      index={0}
      snapPoints={snapPoints}
      enablePanDownToClose
      onDismiss={onClose}
      backdropComponent={renderBackdrop}
      backgroundStyle={styles.sheetBackground}
      handleIndicatorStyle={styles.handleIndicator}
      handleStyle={styles.handleContainer}
    >
      <BottomSheetScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Event Title - centered; close by pulling down */}
        <Text style={styles.eventTitle}>{eventTitle}</Text>
        <Text style={styles.eventDescription}>{eventDescription}</Text>

        {/* Available Tickets Section */}
        <Text style={styles.sectionTitle}>Available Tickets</Text>
        {tickets.map((tier) => (
          <Pressable
            key={tier.id}
            style={({ pressed }) => [
              styles.ticketCard,
              pressed && styles.ticketCardPressed,
            ]}
            onPress={() => onSelectTicket?.(tier)}
          >
            <View style={styles.ticketIconCircle}>
              <TicketIcon />
            </View>
            <View style={styles.ticketInfo}>
              <Text style={styles.ticketTitle}>{tier.title}</Text>
              <Text style={styles.ticketBenefits}>{tier.benefits}</Text>
            </View>
            <Text style={styles.ticketPrice}>{tier.price}</Text>
          </Pressable>
        ))}

        {/* Creator Profile */}
        <View style={styles.creatorSection}>
          <View style={styles.creatorTop}>
            <View style={styles.avatarRing}>
              <Image
                source={
                  creator.avatarUrl
                    ? { uri: creator.avatarUrl }
                    : require("../assets/avatar1.png")
                }
                style={styles.creatorAvatar}
              />
            </View>
            <View style={styles.creatorNameRow}>
              <Text style={styles.creatorUsername}>{creator.username}</Text>
              {creator.verified && (
                <View style={styles.verifiedIcon}>
                  <VerifiedIcon size={13} color="#842ADF" />
                </View>
              )}
            </View>
          </View>
          <Text style={styles.creatorBio}>{creator.bio}</Text>
        </View>

        {/* CTA Buttons */}
        <View style={styles.ctaSection}>
          <Pressable
            style={({ pressed }) => [
              styles.ctaButton,
              pressed && styles.ctaButtonPressed,
            ]}
            onPress={onBeMyBuzz}
          >
            <Text style={styles.ctaButtonText}>Be My Buzz</Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [
              styles.ctaButton,
              pressed && styles.ctaButtonPressed,
            ]}
            onPress={onContact}
          >
            <Text style={styles.ctaButtonText}>Contact</Text>
          </Pressable>
        </View>

        {/* Instagram Icon */}
        <TouchableOpacity
          style={styles.instagramButton}
          onPress={onInstagramPress}
        >
          <Ionicons
            name="logo-instagram"
            size={30}
            color="#8F8E9B"
            style={styles.instagramIcon}
          />
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
});

export default TicketSelectionModal;

const styles = StyleSheet.create({
  sheetBackground: {
    backgroundColor: "#05031B",
  },
  handleContainer: {
    paddingTop: 12,
  },
  handleIndicator: {
    backgroundColor: "rgba(255,255,255,0.4)",
    width: 40,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  eventTitle: {
    fontSize: 20,
    fontWeight: "500",
    color: "#FFFFFF",
    textAlign: "center",
    marginTop: 8,
    marginBottom: 8,
  },
  eventDescription: {
    fontSize: 12,
    fontWeight: "500",
    color: "#8F8E9B",
    textAlign: "center",
    lineHeight: 14,
    marginBottom: 28,
    paddingHorizontal: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "500",
    color: "#FFFFFF",
    marginBottom: 16,
  },
  ticketCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0E0D32",
    borderRadius: 20,
    height: 82,
    padding: 16,
    marginBottom: 12,
  },
  ticketCardPressed: {
    opacity: 0.9,
  },
  ticketIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#131245",

    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  ticketInfo: {
    flex: 1,
  },
  ticketTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  ticketBenefits: {
    fontSize: 13,
    color: "#9CA3AF",
    lineHeight: 18,
  },
  ticketPrice: {
    fontSize: 23,
    fontWeight: "600",
    color: "#7F00FF",
  },
  creatorSection: {
    marginTop: 80,
    marginBottom: 24,
    alignItems: "center",
  },
  creatorTop: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  avatarRing: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: "#932FF8",
    padding: 2,
    marginRight: 12,
  },
  creatorAvatar: {
    width: "100%",
    height: "100%",
    borderRadius: 22,
  },
  creatorNameRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  creatorUsername: {
    fontSize: 18,
    fontWeight: "600",
    color: "#E9E9EA",
  },
  verifiedIcon: {
    marginLeft: 6,
  },
  creatorBio: {
    fontSize: 12,
    color: "#6A7282",
    lineHeight: 12,
    textAlign: "center",
    fontWeight: "400",
    maxWidth: 330,
  },
  ctaSection: {
    gap: 12,
    alignItems: "center",
  },
  ctaButton: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 50,
    alignItems: "center",
    alignSelf: "center",
    width: 200,
  },
  ctaButtonPressed: {
    opacity: 0.9,
  },
  ctaButtonText: {
    fontSize: 14,
    fontWeight: "400",
    color: "#0A0618",
  },
  instagramButton: {
    alignItems: "center",
    marginTop: 0,
    padding: 8,
  },
  instagramIcon: {
    opacity: 0.9,
  },
});
