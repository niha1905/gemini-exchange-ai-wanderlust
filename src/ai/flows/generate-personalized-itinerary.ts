// src/ai/flows/generate-personalized-itinerary.ts
'use server';

/**
 * @fileOverview Generates a personalized travel itinerary based on user preferences, budget, and travel dates.
 *
 * - generatePersonalizedItinerary - A function that generates a personalized travel itinerary.
 * - GeneratePersonalizedItineraryInput - The input type for the generatePersonalizedItinerary function.
 * - GeneratePersonalizedItineraryOutput - The return type for the generatePersonalizedItinerary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePersonalizedItineraryInputSchema = z.object({
  currentLocation: z.string().describe('The starting location of the trip.'),
  destination: z.string().describe('The destination for the trip.'),
  numberOfDays: z.number().describe('The total number of days for the trip.'),
  numberOfPeople: z.number().describe('The number of people traveling.'),
  budget: z.string().describe('The budget for the trip (Budget-friendly, Mid-range, Luxury).'),
  ageGroup: z
    .string()
    .describe(
      'The age group of the travelers (e.g., family with kids, young adults, seniors).'
    ),
  preferences: z
    .string()
    .describe('Travel preferences, including interests and activities.'),
  travelTheme: z
    .string()
    .optional()
    .describe('Travel theme: heritage, nightlife, adventure, relaxation, food, culture, nature, spiritual.'),
  language: z
    .string()
    .optional()
    .describe('Preferred language for recommendations (English, Hindi, Tamil, Bengali, etc.).'),
  specialRequirements: z
    .string()
    .optional()
    .describe('Special requirements like accessibility, dietary restrictions, etc.'),
});
export type GeneratePersonalizedItineraryInput = z.infer<
  typeof GeneratePersonalizedItineraryInputSchema
>;

const ItineraryItemSchema = z.object({
  day: z.number().describe('The day number in the itinerary (e.g., 1, 2, 3).'),
  title: z.string().describe("The title for the day's plan."),
  activities: z
    .array(
      z.object({
        time: z
          .string()
          .describe('The time of the activity (e.g., "Morning", "9:00 AM").'),
        description: z.string().describe('A description of the activity.'),
        emoji: z.string().describe('A relevant emoji for the activity.'),
        travelSuggestion: z.string().describe('Suggested mode of travel to the next activity (e.g., "by Car/Taxi", "by Bus", "by Train", "Walking").'),
        source: z
          .string()
          .optional()
          .describe('A source or link for more information about the activity.'),
        estimatedCost: z
          .number()
          .optional()
          .describe('Estimated cost in INR for this activity.'),
        bookingRequired: z
          .boolean()
          .optional()
          .describe('Whether advance booking is required for this activity.'),
        duration: z
          .string()
          .optional()
          .describe('Estimated duration of the activity (e.g., "2 hours", "Half day").'),
      })
    )
    .describe('A list of activities for the day.'),
  accommodation: z.object({
    name: z.string().describe('Name of the accommodation.'),
    type: z.string().describe('Type of accommodation (hotel, guesthouse, homestay, etc.).'),
    estimatedCost: z.number().describe('Estimated cost per night in INR.'),
    bookingRequired: z.boolean().describe('Whether advance booking is required.'),
    amenities: z.array(z.string()).optional().describe('List of amenities available.'),
  }).optional().describe("Accommodation details for the day."),
  food: z.object({
    recommendation: z.string().describe('Food recommendation for the day.'),
    estimatedCost: z.number().describe('Estimated cost per person in INR.'),
    cuisine: z.string().optional().describe('Type of cuisine.'),
    specialNotes: z.string().optional().describe('Special dietary notes or recommendations.'),
  }).optional().describe("Food recommendations for the day."),
  transportation: z.object({
    mode: z.string().describe('Primary mode of transportation for the day.'),
    estimatedCost: z.number().describe('Estimated transportation cost in INR.'),
    duration: z.string().optional().describe('Estimated travel time.'),
    bookingRequired: z.boolean().describe('Whether advance booking is required.'),
  }).optional().describe("Transportation details for the day."),
  mapImageUrl: z.string().url().describe('A placeholder static map image URL for the day from picsum.photos.'),
  mapImageHint: z.string().describe('One or two keywords for a relevant map image (e.g., "Jaipur map").'),
});

const GeneratePersonalizedItineraryOutputSchema = z.object({
  itinerary: z.array(ItineraryItemSchema).describe('The generated travel itinerary, with a plan for each day.'),
  totalCostBreakdown: z.object({
    accommodation: z.number().describe('Total accommodation cost in INR.'),
    transportation: z.number().describe('Total transportation cost in INR.'),
    activities: z.number().describe('Total activities cost in INR.'),
    food: z.number().describe('Total food cost in INR.'),
    miscellaneous: z.number().describe('Miscellaneous costs in INR.'),
    totalPerPerson: z.number().describe('Total cost per person in INR.'),
    totalForGroup: z.number().describe('Total cost for entire group in INR.'),
  }).describe('Complete cost breakdown for the trip.'),
  bookingSummary: z.object({
    advanceBookingRequired: z.array(z.string()).describe('List of items requiring advance booking.'),
    instantBookingAvailable: z.array(z.string()).describe('List of items available for instant booking.'),
    estimatedSavings: z.number().optional().describe('Estimated savings with advance booking in INR.'),
  }).describe('Booking requirements and availability summary.'),
  recommendations: z.object({
    bestTimeToVisit: z.string().describe('Best time to visit the destination.'),
    weatherConsiderations: z.string().optional().describe('Weather-related recommendations.'),
    culturalNotes: z.string().optional().describe('Important cultural considerations.'),
    safetyTips: z.string().optional().describe('Safety recommendations for the destination.'),
  }).describe('Additional recommendations for the trip.'),
});
export type GeneratePersonalizedItineraryOutput = z.infer<
  typeof GeneratePersonalizedItineraryOutputSchema
>;

export async function generatePersonalizedItinerary(
  input: GeneratePersonalizedItineraryInput
): Promise<GeneratePersonalizedItineraryOutput> {
  return generatePersonalizedItineraryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generatePersonalizedItineraryPrompt',
  input: {schema: GeneratePersonalizedItineraryInputSchema},
  output: {schema: GeneratePersonalizedItineraryOutputSchema},
  prompt: `You are an expert AI travel planner specializing in creating comprehensive, personalized travel itineraries for India. You have deep knowledge of Indian destinations, local culture, hidden gems, and regional preferences.

  Create a detailed, end-to-end itinerary that adapts to the user's specific requirements and provides complete cost breakdowns with booking capabilities.

  TRAVEL THEME FOCUS:
  - Heritage: Focus on historical sites, monuments, cultural experiences, museums, traditional arts
  - Nightlife: Emphasize evening entertainment, bars, clubs, cultural shows, night markets
  - Adventure: Include trekking, water sports, adventure activities, outdoor experiences
  - Relaxation: Prioritize spas, beaches, peaceful locations, wellness activities
  - Food: Highlight local cuisine, food tours, cooking classes, street food, restaurants
  - Culture: Focus on festivals, local traditions, art galleries, cultural performances
  - Nature: Emphasize national parks, wildlife, scenic spots, eco-tourism
  - Spiritual: Include temples, meditation centers, spiritual experiences, pilgrimage sites

  MULTILINGUAL CONSIDERATIONS:
  - Provide recommendations in the preferred language when specified
  - Consider regional language preferences for different Indian states
  - Include local language phrases for important interactions

  DETAILED REQUIREMENTS FOR EACH ACTIVITY:
  - Time, description, and relevant emoji
  - Estimated cost in INR (be realistic and budget-appropriate)
  - Duration of activity
  - Whether advance booking is required
  - Travel suggestions between activities
  - Source links for more information

  ACCOMMODATION DETAILS:
  - Specific hotel/accommodation name and type
  - Estimated cost per night in INR
  - Booking requirements
  - Available amenities
  - Location advantages

  FOOD RECOMMENDATIONS:
  - Specific restaurant or food recommendation
  - Estimated cost per person in INR
  - Cuisine type
  - Special dietary considerations

  TRANSPORTATION:
  - Primary mode of transportation for each day
  - Estimated costs in INR
  - Travel duration
  - Booking requirements

  COST BREAKDOWN:
  - Provide accurate cost estimates for all categories
  - Calculate total per person and for the entire group
  - Include miscellaneous costs (tips, souvenirs, etc.)
  - Suggest potential savings with advance booking

  BOOKING SUMMARY:
  - List items requiring advance booking
  - List items available for instant booking
  - Estimate potential savings

  ADDITIONAL RECOMMENDATIONS:
  - Best time to visit considering weather and events
  - Weather considerations and seasonal advice
  - Cultural notes and etiquette
  - Safety tips specific to the destination

  INPUT PARAMETERS:
  Current Location: {{{currentLocation}}}
  Destination: {{{destination}}}
  Number of Days: {{{numberOfDays}}}
  Number of People: {{{numberOfPeople}}}
  Budget: {{{budget}}}
  Age Group: {{{ageGroup}}}
  Preferences: {{{preferences}}}
  Travel Theme: {{{travelTheme}}}
  Language: {{{language}}}
  Special Requirements: {{{specialRequirements}}}

  Generate a comprehensive itinerary that balances budget, interests, and time constraints while providing actionable booking information and cost transparency.
  `,
});

const generatePersonalizedItineraryFlow = ai.defineFlow(
  {
    name: 'generatePersonalizedItineraryFlow',
    inputSchema: GeneratePersonalizedItineraryInputSchema,
    outputSchema: GeneratePersonalizedItineraryOutputSchema,
  },
  async input => {
    try {
      const {output} = await prompt(input);
      return output!;
    } catch (error) {
      console.error('Error generating itinerary:', error);
      throw new Error('Failed to generate itinerary. Please check your API key and try again.');
    }
  }
);
