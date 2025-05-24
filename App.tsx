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
};

import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./screens/LoginScreen";
import SignUpScreen from "./screens/SignUpScreen";
import DashboardScreen from "./screens/DashboardScreen";
import CreateEventScreen from "./screens/CreateEvent";
import EventSuccessScreen from "./screens/EventSuccessScreen";
import VerifyLocation from "./screens/VerifyLocation";
import CheckinScreen from "./screens/CheckinScreen";
import Cancelpage from "./screens/Cancelpage"; // Import the Cancelpage screen
import EventDetailsScreen from "./screens/EventDetailsScreen";
import PaymentScreen from "./screens/PaymentScreen"; // Import the PaymentScreen if needed
import ExploreScreen from "./screens/ExploreScreen";
import { useGoogleAuth } from "./components/useGoogleAuth";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  useGoogleAuth(() => {});

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
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
          component={Cancelpage}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="EventDetails" component={EventDetailsScreen} />
        <Stack.Screen name="PaymentScreen" component={PaymentScreen} />
        <Stack.Screen
          name="ExploreScreen"
          component={ExploreScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
