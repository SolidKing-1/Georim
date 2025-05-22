export interface Event {
  id: string;
  title: string;
  date: string;
  time?: string;
  location: string;
  price: string;
  description?: string;
  image: any;
  section: string;
  latitude?: number;
  longitude?: number;
  attendees?: number;
}
