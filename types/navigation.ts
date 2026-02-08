// types/navigation.ts

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
