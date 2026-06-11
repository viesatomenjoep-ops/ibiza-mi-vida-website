export interface ClubDate {
  id: number;
  name: string;
  date: string;
  lineUp?: string;
  prices: string;
  affLink: string;
}

export interface ClubEvent {
  id: number;
  name: string;
  slug: string;
  description?: string;
  requirements?: string;
  startAt?: string;
  startAtNextDay?: boolean;
  endIsDefined?: boolean;
  endAt?: string;
  endAtNextDay?: boolean;
  logo?: string;
  cover?: string;
  whitelogo?: string;
  affLink: string;
  apiEndpoint?: string;
  dates?: ClubDate[];
}

export interface VenueType {
  id: number;
  slug: string;
  name: string;
}

export interface Venue {
  id: number;
  name: string;
  slug: string;
  description: string;
  picture: string;
  cover: string;
  whitelogo: string;
  isDayClub: boolean;
  type: VenueType;
  activeEvents: number;
  affLink: string;
  apiEndpoint: string;
  events: ClubEvent[];
}

export interface BoatCharter {
  id: string;
  name: string;
  type: 'yacht' | 'catamaran' | 'speedboat';
  capacity: number;
  length: string;
  pricePerDay: string;
  image: string;
  features: string[];
  description: string;
}

export interface BoatParty {
  id: string;
  name: string;
  host: string;
  datePattern: string;
  duration: string;
  price: string;
  image: string;
  whatsIncluded: string[];
  description: string;
}

export interface FormenteraTrip {
  id: string;
  name: string;
  duration: string;
  frequency: string;
  price: string;
  image: string;
  highlights: string[];
  description: string;
}

export interface DrinkPackage {
  id: string;
  name: string;
  venueName: string;
  price: string;
  whatsIncluded: string[];
  isVip: boolean;
}

export interface CarRental {
  id: string;
  name: string;
  type: 'car' | 'scooter';
  pricePerDay: string;
  transmission: string;
  fuelType: string;
  image: string;
  features: string[];
}

export interface Review {
  id: string;
  author: string;
  country: string;
  rating: number;
  date: string;
  text: string;
  category: string;
}
