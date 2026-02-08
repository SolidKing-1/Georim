import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Pressable,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useStripe } from "@stripe/stripe-react-native";
import Constants from "expo-constants";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../App";
import PrimaryButton from "../components/PrimaryButton";
import { getToken } from "../utils/auth";

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "PaymentScreen"
>;
type PaymentScreenRoute = RouteProp<RootStackParamList, "PaymentScreen">;

const BACKEND_URL = Constants.expoConfig?.extra?.BACKEND_URL;
const CREATE_PAYMENT_SHEET_ENDPOINT = "/checkout";

const PaymentScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<PaymentScreenRoute>();
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [loading, setLoading] = useState(false);

  const {
    eventId,
    ticketTierId,
    ticketTierName,
    ticketPrice,
    quantity = 1,
    subtotal,
    fees,
    total,
    promoCode = "",
  } = route.params ?? {};

  const fetchPaymentSheetParams = async () => {
    if (!BACKEND_URL) {
      throw new Error(
        "BACKEND_URL is not set. Add BACKEND_URL to your .env file and restart Expo."
      );
    }

    const token = await getToken();
    if (!token) {
      throw new Error("You must be logged in to complete payment.");
    }

    // Calculate amount in cents (Stripe requires integer cents)
    const amountInCents = total
      ? Math.round(parseFloat(total) * 100)
      : ticketPrice
        ? Math.round(parseFloat(ticketPrice.replace(/[^0-9.]/g, "")) * quantity * 100)
        : 0;

    const response = await fetch(
      `${BACKEND_URL}${CREATE_PAYMENT_SHEET_ENDPOINT}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          eventId,
          ticketTierId,
          ticketTierName,
          quantity,
          amount: amountInCents,
          currency: "usd",
          subtotal: subtotal ? parseFloat(subtotal) : undefined,
          fees: fees ? parseFloat(fees) : undefined,
          total: total ? parseFloat(total) : undefined,
          promoCode: promoCode || undefined,
        }),
      }
    );

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Stripe setup failed: ${response.status} - ${text}`);
    }

    const { paymentIntentClientSecret, ephemeralKey, customer } =
      await response.json();

    return {
      paymentIntentClientSecret,
      ephemeralKey,
      customer,
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
      });

      if (initError) {
        Alert.alert("Payment error", initError.message);
        return;
      }

      const { error } = await presentPaymentSheet();

      if (error) {
        if (error.code !== "Canceled") {
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
          <ActivityIndicator size="large" color="#FFFFFF" />
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
