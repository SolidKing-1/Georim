// This is the main entry point of the app. It sets up the navigation container and stack navigator.
export type RootStackParamList = {
  Login: undefined;
  SignUp: undefined;
  Dashboard: undefined;
  CreateEvent: undefined;
  EventSuccess: undefined;
  EventDetails: { event: any };
  VerifyLocation: undefined;
};

import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./screens/LoginScreen";
import SignUpScreen from "./screens/SignUpScreen";
import DashboardScreen from "./screens/DashboardScreen";
import CreateEventScreen from "./screens/CreateEvent";
<<<<<<< HEAD
import EventSuccessScreen from "./screens/EventSuccessScreen";
import VerifyLocation from "./screens/VerifyLocation";
=======
import CheckinScreen from "./screens/CheckinScreen";
>>>>>>> dd6fc4c (Complete Check-In Screen)

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
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
<<<<<<< HEAD
        <Stack.Screen
          name="EventSuccess"
          component={EventSuccessScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="VerifyLocation" component={VerifyLocation} />
=======
        <Stack.Screen name="CheckinScreen" component={CheckinScreen} />
>>>>>>> dd6fc4c (Complete Check-In Screen)
      </Stack.Navigator>
    </NavigationContainer>
  );
}
