import React, { useCallback, useMemo, useRef, useState } from "react";
import { View, StyleSheet } from "react-native";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { StripeProvider } from "@stripe/stripe-react-native";
import Constants from "expo-constants";
import {
  NavigationContainer,
  NavigationContainerRef,
  NavigationState,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as Linking from "expo-linking";

import type { RootStackParamList } from "../App";

// Screens
import LoginScreen from "../screens/LoginScreen";
import SignUpScreen from "../screens/SignUpScreen";
import DashboardScreen from "../screens/DashboardScreen";
import CreateEventScreen from "../screens/CreateEvent";
import EventSuccessScreen from "../screens/EventSuccessScreen";
import VerifyLocation from "../screens/VerifyLocation";
import CheckinScreen from "../screens/CheckinScreen";
import CancelScreen from "../screens/CancelScreen";
import EventDetailsScreen from "../screens/EventDetailsScreen";
import RegisterEventScreen from "../screens/RegisterEventScreen";
import PaymentScreen from "../screens/PaymentScreen";
import ExploreScreen from "../screens/ExploreScreen";
import SearchScreen from "../screens/SearchScreen";
import CategoryListScreen from "../screens/CategoryListScreen";
import AllEventsScreen from "../screens/AllEventsScreen";
import BrowseAllScreen from "../screens/BrowseAllScreen";
import AccountScreen from "../screens/AccountScreen";
import ActivitySnapshot from "../screens/ActivitySnapshot";
import EventCreatedPage from "../screens/EventCreatedScreen";
import HelpAndSupportScreen from "../screens/Help_Support";
import Profile from "../screens/ProfileScreen";
import ForgotPasswordScreen from "../screens/ForgotPasswordScreen";
import VerifyPasscodeScreen from "../screens/VerifyPasscodeScreen";
import ResetPasswordScreen from "../screens/ResetPasswordScreen";
import OnboardingScreen from "../screens/OnboardingScreen";
import SplashScreen from "../screens/SplashScreen";
import Welcome from "../screens/Welcome";

import Navbar from "../components/Navbar";

type Props = {
  initialRoute: keyof RootStackParamList;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const prefix = Linking.createURL("/");
const STRIPE_PUBLISHABLE_KEY =
  Constants.expoConfig?.extra?.STRIPE_PUBLISHABLE_KEY ?? "";

function getActiveRouteName(state: NavigationState | undefined): string | undefined {
  if (!state) return undefined;
  const route = state.routes[state.index] as any;
  if (route?.state) return getActiveRouteName(route.state as any);
  return route?.name as string | undefined;
}

type NavbarVariant = "dashboard" | "search";
type NavbarTab = "Home" | "Explore" | "Community" | "Profile";

function routeToNavbarMeta(routeName: string | undefined): {
  visible: boolean;
  variant: NavbarVariant;
  activeTab: NavbarTab;
} {
  const hiddenRoutes = new Set<string>([
    "Login",
    "SignUp",
    "ForgotPassword",
    "VerifyPasscode",
    "ResetPassword",
    "Splash",
    "WelcomeNew",
    "WelcomeExisting",
    "Onboarding",
    "RegisterEvent",
  ]);

  const searchVariantRoutes = new Set<string>([
    "Search",
    "AllEvents",
    "CategoryList",
    "BrowseAll",
  ]);

  const visible = routeName ? !hiddenRoutes.has(routeName) : false;
  const variant: NavbarVariant = routeName && searchVariantRoutes.has(routeName) ? "search" : "dashboard";

  let activeTab: NavbarTab = "Home";
  switch (routeName) {
    case "Dashboard":
      activeTab = "Home";
      break;
    case "ExploreScreen":
      activeTab = "Explore";
      break;
    case "CheckinScreen":
      activeTab = "Community";
      break;
    case "Profile":
    case "AccountScreen":
      activeTab = "Profile";
      break;
    default:
      activeTab = "Home";
  }

  return { visible, variant, activeTab };
}

export default function MainLayout({ initialRoute }: Props) {
  const navRef = useRef<NavigationContainerRef<RootStackParamList> | null>(null);
  const [routeName, setRouteName] = useState<string | undefined>(undefined);

  const meta = useMemo(() => routeToNavbarMeta(routeName), [routeName]);

  const handleReady = useCallback(() => {
    const current = navRef.current?.getCurrentRoute()?.name;
    setRouteName(current);
  }, []);

  const handleStateChange = useCallback((state?: NavigationState) => {
    setRouteName(getActiveRouteName(state));
  }, []);

  const handleHomePress = useCallback(() => {
    navRef.current?.navigate("Dashboard");
  }, []);

  const handleSearchPress = useCallback(() => {
    // Dashboard search button should take user to Search screen (search variant),
    // not auto-open the full-screen modal.
    navRef.current?.navigate("Search");
  }, []);

  return (
    <StripeProvider
      publishableKey={STRIPE_PUBLISHABLE_KEY}
      urlScheme="georim"
      merchantIdentifier="merchant.com.georim"
    >
      <BottomSheetModalProvider>
    <NavigationContainer
      ref={(r) => {
        navRef.current = r as unknown as NavigationContainerRef<RootStackParamList>;
      }}
      onReady={handleReady}
      onStateChange={handleStateChange}
      linking={{
        prefixes: [prefix, "georim://"],
        config: {
          screens: {
            Login: "login",
            // ...other screens
          },
        },
      }}
    >
      <View style={styles.root}>
        <Stack.Navigator initialRouteName={initialRoute} screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="SignUp" component={SignUpScreen} />
          <Stack.Screen name="Dashboard" component={DashboardScreen} />
          <Stack.Screen name="CreateEvent" component={CreateEventScreen} />
          <Stack.Screen name="EventSuccess" component={EventSuccessScreen} options={{ headerShown: false }} />
          <Stack.Screen name="VerifyLocation" component={VerifyLocation} />
          <Stack.Screen name="CheckinScreen" component={CheckinScreen} />
          <Stack.Screen name="Cancelpage" component={CancelScreen} options={{ headerShown: false }} />
          <Stack.Screen name="EventDetails" component={EventDetailsScreen} />
          <Stack.Screen name="RegisterEvent" component={RegisterEventScreen} />
          <Stack.Screen name="PaymentScreen" component={PaymentScreen} />
          <Stack.Screen name="ExploreScreen" component={ExploreScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Search" component={SearchScreen} />
          <Stack.Screen name="CategoryList" component={CategoryListScreen} />
          <Stack.Screen name="AllEvents" component={AllEventsScreen} />
          <Stack.Screen name="BrowseAll" component={BrowseAllScreen} />
          <Stack.Screen name="AccountScreen" component={AccountScreen} />
          <Stack.Screen name="EventCreatedPage" component={EventCreatedPage} options={{ headerShown: false }} />
          <Stack.Screen name="ActivitySnapshot" component={ActivitySnapshot} options={{ headerShown: false }} />
          <Stack.Screen name="HelpAndSupportScreen" component={HelpAndSupportScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Profile" component={Profile} />
          <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
          <Stack.Screen name="VerifyPasscode" component={VerifyPasscodeScreen} />
          <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
          <Stack.Screen name="Splash" component={SplashScreen} />

          <Stack.Screen name="WelcomeNew" options={{ headerShown: false }}>
            {() => <Welcome title={["Find Your", "First Event"]} nextRoute="Dashboard" />}
          </Stack.Screen>

          <Stack.Screen name="WelcomeExisting" options={{ headerShown: false }}>
            {() => <Welcome title={["Hey", "Ready for Tonight?"]} nextRoute="Dashboard" />}
          </Stack.Screen>

          <Stack.Screen name="Onboarding" component={OnboardingScreen} options={{ headerShown: false }} />
        </Stack.Navigator>

        <View pointerEvents="box-none" style={styles.navbarOverlay}>
          <Navbar
            variant={meta.variant}
            activeTab={meta.activeTab}
            onHomePress={handleHomePress}
            onSearchPress={handleSearchPress}
            visible={meta.visible}
          />
        </View>
      </View>
    </NavigationContainer>
      </BottomSheetModalProvider>
    </StripeProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  navbarOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 16, // match current Dashboard positioning
  },
});

