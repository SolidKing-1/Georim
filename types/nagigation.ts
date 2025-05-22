import type { Event } from "./event";

export type RootStackParamList = {
  Dashboard: undefined;
  CheckinScreen: undefined;
  EventDetails: {
    event: Event;
  };
  CreateEvent: undefined;
  VerifyLocation: undefined;
};
