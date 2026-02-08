export type RootStackParamList = {
  Login: undefined;
  SignUp: undefined;
  Dashboard: undefined;
  CreateEvent: undefined;
  EventSuccess: undefined;
  EventDetails: { eventId: string; event?: any };
  RegisterEvent: {
    eventId: string;
    event?: any;
    selectedTier?: { id: string; title: string; price: string };
  };
  VerifyLocation: undefined;
  CheckinScreen: undefined;
  Cancelpage: undefined;
  ExploreScreen: undefined;
  Search: { openSearchModalToken?: number } | undefined;
  CategoryList: { category: string };
  AllEvents: undefined;
  BrowseAll: undefined;
  PaymentScreen: undefined;
  EventCreatedPage: undefined;
  AccountScreen: undefined;
  ActivitySnapshot: undefined;
  HelpAndSupportScreen: undefined;
  Profile: undefined;
  ForgotPassword: undefined;
  VerifyPasscode: { email: string } | undefined;
  ResetPassword: { email: string; code: string };
  Onboarding: undefined;
  WelcomeNew: undefined;
  WelcomeExisting: undefined;
  Splash: undefined;
  ReviewsScreen: undefined;
};

import React, { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import MainLayout from "./layouts/MainLayout";

export default function App() {
  const [initialRoute, setInitialRoute] = useState<
    keyof RootStackParamList | null
  >(null);

  useEffect(() => {
    (async () => {
      // Start with the splash screen, it will navigate onward when done
      setInitialRoute("Splash");
      // --- original logic below ---
      // const token = await getToken();
      // if (token) {
      //   const biometric = await isBiometricEnabled();
      //   if (biometric) {
      //     const success = await promptBiometric();
      //     setInitialRoute(success ? "Dashboard" : "Login");
      //   } else {
      //     setInitialRoute("Dashboard");
      //   }
      // } else {
      //   setInitialRoute("Login");
      // }
    })();
  }, []);

  if (!initialRoute) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <MainLayout initialRoute={initialRoute} />
    </GestureHandlerRootView>
  );
}
