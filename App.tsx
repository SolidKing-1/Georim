// This is the main entry point of the app. It sets up the navigation container and stack navigator.
export type RootStackParamList = {
  Login: undefined;
  SignUp: undefined;
  Dashboard: undefined;
  CreateEvent: undefined;
  EventSuccess: undefined;
  EventDetails: { event: any };
  VerifyLocation: undefined;
  CheckinScreen: undefined;
  Cancelpage: undefined;
  ExploreScreen: undefined;
  PaymentScreen: undefined;
  EventCreatedPage: undefined;
  // Add this line to define the EventCreatedPage screen

  AccountScreen: undefined;
  ActivitySnapshot: undefined;
  HelpAndSupportScreen: undefined;
  Profile: undefined;
  ForgotPassword: undefined;
};

import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { ActivityIndicator, View } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./screens/LoginScreen";
import SignUpScreen from "./screens/SignUpScreen";
import DashboardScreen from "./screens/DashboardScreen";
import CreateEventScreen from "./screens/CreateEvent";
import EventSuccessScreen from "./screens/EventSuccessScreen";
import VerifyLocation from "./screens/VerifyLocation";
import CheckinScreen from "./screens/CheckinScreen";
import CancelScreen from "./screens/CancelScreen";
import EventDetailsScreen from "./screens/EventDetailsScreen";
import PaymentScreen from "./screens/PaymentScreen";
import ExploreScreen from "./screens/ExploreScreen";
import AccountScreen from "./screens/AccountScreen";
import ActivitySnapshot from "./screens/ActivitySnapshot";
import EventCreatedPage from "./screens/EventCreatedScreen";
import HelpAndSupportScreen from "./screens/Help_Support"; // Import your Help&Support screen component
import { getToken, isBiometricEnabled } from "./utils/auth";
import { promptBiometric } from "./utils/biometric";
import Profile from "./screens/ProfileScreen";
import ForgotPasswordScreen from "./screens/ForgotPasswordScreen";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const [initialRoute, setInitialRoute] = useState<
    keyof RootStackParamList | null
  >(null);

  useEffect(() => {
    (async () => {
      const token = await getToken();
      if (token) {
        const biometric = await isBiometricEnabled();
        if (biometric) {
          const success = await promptBiometric();
          setInitialRoute(success ? "Dashboard" : "Login");
        } else {
          setInitialRoute("Dashboard");
        }
      } else {
        setInitialRoute("Login");
      }
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
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={initialRoute}
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
        <Stack.Screen name="CreateEvent" component={CreateEventScreen} />
        <Stack.Screen
          name="EventSuccess"
          component={EventSuccessScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="VerifyLocation" component={VerifyLocation} />
        <Stack.Screen name="CheckinScreen" component={CheckinScreen} />
        <Stack.Screen
          name="Cancelpage"
          component={CancelScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="EventDetails" component={EventDetailsScreen} />
        <Stack.Screen name="PaymentScreen" component={PaymentScreen} />
        <Stack.Screen
          name="ExploreScreen"
          component={ExploreScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="AccountScreen" component={AccountScreen} />
        <Stack.Screen
          name="EventCreatedPage"
          component={EventCreatedPage}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ActivitySnapshot"
          component={ActivitySnapshot}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="HelpAndSupportScreen"
          component={HelpAndSupportScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        {/* Add more screens as needed */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
