import React, { useCallback, useEffect, useState } from "react";
import { View, Text, StyleSheet, Alert, Pressable } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useStripe } from "@stripe/stripe-react-native";
import Constants from "expo-constants";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../App";
import PrimaryButton from "../components/PrimaryButton";
import PurpleGradientSpinner from "../components/PurpleGradientSpinner";
import { getToken } from "../utils/auth";

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "PaymentScreen"
>;
type PaymentScreenRoute = RouteProp<RootStackParamList, "PaymentScreen">;

const BACKEND_URL = Constants.expoConfig?.extra?.BACKEND_URL;
const CREATE_PAYMENT_SHEET_ENDPOINT = "/checkout";

/**
 * Dummy UUIDs for testing PaymentSheet (dev only). Must match real events/ticket types in the backend.
 */
const DUMMY_EVENT_ID = "9bc99614-c742-4a12-8885-595fcc326885";
const DUMMY_TICKET_TYPE_ID = "7c2178d4-4a89-4645-9c2e-b43b8e397dcc";

const PaymentScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<PaymentScreenRoute>();
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [loading, setLoading] = useState(false);

  const {
    eventId: eventIdParam,
    event,
    ticketTierId,
    ticketTierName,
    ticketPrice,
    quantity = 1,
    subtotal,
    fees,
    total,
    promoCode = "",
  } = route.params ?? {};
  const eventId = eventIdParam ?? (event as any)?.uuid ?? (event as any)?.id;

  const fetchPaymentSheetParams = async () => {
    if (!BACKEND_URL) {
      throw new Error(
        "BACKEND_URL is not set. Add BACKEND_URL to your .env file and restart Expo.",
      );
    }

    const token = await getToken();
    if (!token) {
      throw new Error("You must be logged in to complete payment.");
    }

    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    let resolvedEventId =
      eventId && uuidRegex.test(String(eventId)) ? eventId : null;
    let resolvedTicketTypeId =
      ticketTierId && uuidRegex.test(String(ticketTierId))
        ? ticketTierId
        : null;

    if (__DEV__ && (!resolvedEventId || !resolvedTicketTypeId)) {
      resolvedEventId = resolvedEventId ?? DUMMY_EVENT_ID;
      resolvedTicketTypeId = resolvedTicketTypeId ?? DUMMY_TICKET_TYPE_ID;
    }

    if (!resolvedEventId || !uuidRegex.test(String(resolvedEventId))) {
      throw new Error(
        "Checkout requires a valid event UUID. Ensure your API returns event.uuid (or event.id as a UUID) and that you navigated from an event loaded from the API.",
      );
    }
    if (
      !resolvedTicketTypeId ||
      !uuidRegex.test(String(resolvedTicketTypeId))
    ) {
      throw new Error("A valid ticket type ID (UUID) is required to checkout.");
    }
    const items = [
      {
        ticketTypeId: resolvedTicketTypeId,
        quantity: quantity ?? 1,
      },
    ];

    const response = await fetch(
      `${BACKEND_URL}${CREATE_PAYMENT_SHEET_ENDPOINT}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          eventId: resolvedEventId,
          items,
          currency: "usd",
          ...(promoCode ? { promoCode } : {}),
        }),
      },
    );

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Stripe setup failed: ${response.status} - ${text}`);
    }

    const data = await response.json();
    return {
      paymentIntentClientSecret:
        data.clientSecret ?? data.paymentIntentClientSecret,
      ephemeralKey: data.ephemeralKey,
      customer: data.customerId ?? data.customer,
    };
  };

  const openPaymentSheet = useCallback(async () => {
    try {
      setLoading(true);

      const { paymentIntentClientSecret, ephemeralKey, customer } =
        await fetchPaymentSheetParams();

      const { error: initError } = await initPaymentSheet({
        customerId: customer,
        customerEphemeralKeySecret: ephemeralKey,
        paymentIntentClientSecret,
        merchantDisplayName: "Georim",
        allowsDelayedPaymentMethods: true,
        returnURL: "georim://stripe-redirect",
        appearance: {
          colors: {
            primary: "#932FF8",
            background: "#05031B",
            componentBackground: "#1E1E3F",
            componentBorder: "#E5E7EB",
            componentDivider: "#6B7280",
            primaryText: "#FFFFFF",
            secondaryText: "#8F8E9B",
            componentText: "#FFFFFF",
            placeholderText: "#8F8E9B",
            icon: "#FFFFFF",
            error: "#EF4444",
          },
          shapes: {
            borderRadius: 12,
            borderWidth: 1,
          },
          primaryButton: {
            colors: {
              background: "#932FF8",
              text: "#FFFFFF",
              border: "#932FF8",
            },
            shapes: {
              borderRadius: 15,
            },
          },
        },
      });

      if (initError) {
        Alert.alert("Payment error", initError.message);
        return;
      }

      const { error } = await presentPaymentSheet();

      if (error) {
        if (error.code === "Canceled") {
          navigation.navigate("RegisterEvent", {
            eventId: eventId ?? "",
            event,
            selectedTier:
              ticketTierId && ticketTierName && ticketPrice
                ? {
                    id: ticketTierId,
                    title: ticketTierName,
                    price: ticketPrice,
                  }
                : undefined,
            openOrderSummary: true,
          });
        } else {
          Alert.alert("Payment canceled", error.message);
        }
        return;
      }

      // Successful payment
      navigation.navigate("EventSuccess");
    } catch (err: any) {
      console.error("PaymentSheet error", err);
      Alert.alert("Payment error", err?.message ?? "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }, [initPaymentSheet, presentPaymentSheet, navigation]);

  useEffect(() => {
    // Automatically open the PaymentSheet when arriving on this screen
    openPaymentSheet();
  }, [openPaymentSheet]);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <Text style={styles.title}>Complete your payment</Text>
      <Text style={styles.subtitle}>
        We securely process your card with Stripe. You can save a card for
        future events.
      </Text>

      <View style={styles.content}>
        {loading ? (
          <PurpleGradientSpinner size={56} duration={2000} />
        ) : (
          <PrimaryButton title="Pay now" onPress={openPaymentSheet} />
        )}
      </View>

      <Pressable style={styles.cancel} onPress={() => navigation.goBack()}>
        <Text style={styles.cancelText}>Cancel and go back</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#05031B",
    paddingHorizontal: 20,
    paddingTop: 80,
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#A1A1B5",
    lineHeight: 20,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  cancel: {
    alignItems: "center",
    marginBottom: 40,
  },
  cancelText: {
    color: "#A1A1B5",
    fontSize: 14,
  },
});

export default PaymentScreen;
