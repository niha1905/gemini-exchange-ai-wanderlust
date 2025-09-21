import data from './placeholder-images.json';
import type { ImagePlaceholder } from './placeholder-images';

export const placeholderImages: ImagePlaceholder[] = data.placeholderImages;

export type POI = {
  id: string;
  name: string;
  location: string;
  type: 'Attraction' | 'Restaurant' | 'Accommodation';
  description: string;
  imageId: string;
};

export const pois: POI[] = [];

export type Booking = {
  id: string;
  poiId: string;
  type: 'Flight' | 'Hotel' | 'Activity';
  date: string;
  status: 'Confirmed' | 'Pending' | 'Cancelled';
};

export const bookings: Booking[] = [];

export type UserProfile = {
  name: string;
  email: string;
  travelHistory: string;
  preferences: string;
};

export const userProfile: UserProfile = {
  name: 'Alex Doe',
  email: 'alex.doe@example.com',
  travelHistory: 'Visited Goa for beaches, Rajasthan for forts. Enjoys historical sites and street food.',
  preferences: 'Interested in cultural experiences, budget-friendly travel, and authentic local food. Looking for a 1-week trip in South India.',
};
