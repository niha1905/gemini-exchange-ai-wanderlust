'use server';

import { z } from 'zod';

// Weather API integration schema
const WeatherDataSchema = z.object({
  location: z.string(),
  temperature: z.number(),
  condition: z.string(),
  humidity: z.number(),
  windSpeed: z.number(),
  forecast: z.array(z.object({
    date: z.string(),
    temperature: z.number(),
    condition: z.string(),
    precipitation: z.number(),
  })),
});

// Real-time adjustment schema
const AdjustmentSchema = z.object({
  type: z.enum(['weather', 'delay', 'closure', 'last_minute']),
  severity: z.enum(['low', 'medium', 'high', 'critical']),
  affectedActivities: z.array(z.string()),
  alternativeSuggestions: z.array(z.object({
    activity: z.string(),
    reason: z.string(),
    estimatedCost: z.number().optional(),
    bookingRequired: z.boolean().optional(),
  })),
  impactOnCost: z.number().optional(),
  impactOnSchedule: z.string().optional(),
});

export type WeatherData = z.infer<typeof WeatherDataSchema>;
export type Adjustment = z.infer<typeof AdjustmentSchema>;

// Mock weather API - In production, integrate with actual weather service
export async function getWeatherData(location: string): Promise<WeatherData> {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Mock weather data - replace with actual weather API
  return {
    location,
    temperature: Math.floor(Math.random() * 15) + 20, // 20-35°C
    condition: ['Sunny', 'Partly Cloudy', 'Cloudy', 'Rainy'][Math.floor(Math.random() * 4)],
    humidity: Math.floor(Math.random() * 40) + 40, // 40-80%
    windSpeed: Math.floor(Math.random() * 20) + 5, // 5-25 km/h
    forecast: Array.from({ length: 5 }, (_, i) => ({
      date: new Date(Date.now() + i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      temperature: Math.floor(Math.random() * 15) + 20,
      condition: ['Sunny', 'Partly Cloudy', 'Cloudy', 'Rainy'][Math.floor(Math.random() * 4)],
      precipitation: Math.floor(Math.random() * 20),
    })),
  };
}

// Generate real-time adjustments based on weather and other factors
export async function generateRealTimeAdjustments(
  itinerary: any[],
  destination: string
): Promise<Adjustment[]> {
  const weather = await getWeatherData(destination);
  const adjustments: Adjustment[] = [];

  // Weather-based adjustments
  if (weather.condition === 'Rainy' || weather.precipitation > 10) {
    adjustments.push({
      type: 'weather',
      severity: 'medium',
      affectedActivities: ['Outdoor activities', 'Beach visits', 'Trekking'],
      alternativeSuggestions: [
        {
          activity: 'Visit indoor museums and galleries',
          reason: 'Weather protection',
          estimatedCost: 500,
          bookingRequired: false,
        },
        {
          activity: 'Shopping at covered markets',
          reason: 'Stay dry while exploring',
          estimatedCost: 1000,
          bookingRequired: false,
        },
        {
          activity: 'Spa and wellness center',
          reason: 'Relaxing indoor activity',
          estimatedCost: 2000,
          bookingRequired: true,
        },
      ],
      impactOnCost: 500,
      impactOnSchedule: 'Some outdoor activities may need to be rescheduled',
    });
  }

  // High temperature adjustments
  if (weather.temperature > 35) {
    adjustments.push({
      type: 'weather',
      severity: 'high',
      affectedActivities: ['Midday outdoor activities', 'Long walks'],
      alternativeSuggestions: [
        {
          activity: 'Early morning or evening activities',
          reason: 'Avoid peak heat hours',
          estimatedCost: 0,
          bookingRequired: false,
        },
        {
          activity: 'Air-conditioned venues',
          reason: 'Stay cool and comfortable',
          estimatedCost: 300,
          bookingRequired: false,
        },
      ],
      impactOnCost: 300,
      impactOnSchedule: 'Activities shifted to cooler hours',
    });
  }

  // Simulate random delays/closures
  if (Math.random() > 0.7) {
    adjustments.push({
      type: 'closure',
      severity: 'medium',
      affectedActivities: ['Popular tourist attractions'],
      alternativeSuggestions: [
        {
          activity: 'Alternative cultural sites',
          reason: 'Original venue temporarily closed',
          estimatedCost: 400,
          bookingRequired: false,
        },
        {
          activity: 'Local market exploration',
          reason: 'Flexible alternative activity',
          estimatedCost: 200,
          bookingRequired: false,
        },
      ],
      impactOnCost: 200,
      impactOnSchedule: 'Minor schedule adjustments needed',
    });
  }

  return adjustments;
}

// Update itinerary with real-time adjustments
export async function updateItineraryWithAdjustments(
  originalItinerary: any[],
  adjustments: Adjustment[]
): Promise<any[]> {
  let updatedItinerary = [...originalItinerary];

  adjustments.forEach(adjustment => {
    updatedItinerary = updatedItinerary.map(day => {
      const updatedDay = { ...day };
      
      // Add adjustment notifications to affected days
      if (adjustment.affectedActivities.some(activity => 
        day.activities.some((act: any) => 
          act.description.toLowerCase().includes(activity.toLowerCase())
        )
      )) {
        updatedDay.adjustments = updatedDay.adjustments || [];
        updatedDay.adjustments.push({
          type: adjustment.type,
          severity: adjustment.severity,
          message: `⚠️ ${adjustment.type.charAt(0).toUpperCase() + adjustment.type.slice(1)} Alert`,
          alternatives: adjustment.alternativeSuggestions,
          impactOnCost: adjustment.impactOnCost,
          impactOnSchedule: adjustment.impactOnSchedule,
        });
      }
      
      return updatedDay;
    });
  });

  return updatedItinerary;
}
