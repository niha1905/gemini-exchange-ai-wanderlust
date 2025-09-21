'use server';

/**
 * @fileOverview Discovers points of interest (POIs) based on a user's search query using AI.
 *
 * - discoverPois - A function that finds attractions, restaurants, and other points of interest.
 * - DiscoverPoisInput - The input type for the discoverPois function.
 * - DiscoverPoisOutput - The return type for the discoverPois function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DiscoverPoisInputSchema = z.object({
  query: z.string().describe('The user\'s search query, e.g., "cafes in Jaipur" or "historical sites near me".'),
});
export type DiscoverPoisInput = z.infer<typeof DiscoverPoisInputSchema>;

const PoiSchema = z.object({
  name: z.string().describe('The name of the point of interest.'),
  location: z.string().describe('The city and state, or general location of the POI.'),
  description: z.string().describe('A brief, engaging description of the POI.'),
  type: z.enum(['Attraction', 'Restaurant', 'Activity', 'Accommodation', 'Cafe', 'Other']).describe('The category of the POI.'),
  imageUrl: z.string().url().describe('A placeholder image URL for the POI from picsum.photos.'),
  imageHint: z.string().describe('One or two keywords for a relevant image (e.g., "Taj Mahal").'),
  review: z.string().describe('A short, realistic user review snippet (1-2 sentences).'),
});

const DiscoverPoisOutputSchema = z.object({
  pois: z.array(PoiSchema)
    .describe('A list of discovered points of interest that match the user\'s query.'),
});
export type DiscoverPoisOutput = z.infer<typeof DiscoverPoisOutputSchema>;


export async function discoverPois(
  input: DiscoverPoisInput
): Promise<DiscoverPoisOutput> {
  return discoverPoisFlow(input);
}

const prompt = ai.definePrompt({
  name: 'discoverPoisPrompt',
  input: {schema: DiscoverPoisInputSchema},
  output: {schema: DiscoverPoisOutputSchema},
  prompt: `You are an expert travel guide. A user is asking for recommendations for points of interest.
  Based on their query, find relevant attractions, restaurants, or other interesting places.

  For each point of interest, provide:
  - A descriptive name, location, and a compelling reason for the recommendation.
  - The type of POI (e.g., 'Attraction', 'Restaurant', 'Cafe').
  - A placeholder image URL from 'https://picsum.photos/seed/<seed>/600/400' where <seed> is a unique word related to the POI.
  - A one or two-word hint for a relevant image.
  - A short, insightful, and realistic-sounding user review snippet (1-2 sentences).

  User Query: {{{query}}}

  Generate a list of 6-9 diverse and interesting results. Provide the output as a structured JSON object matching the output schema.`,
});

const discoverPoisFlow = ai.defineFlow(
  {
    name: 'discoverPoisFlow',
    inputSchema: DiscoverPoisInputSchema,
    outputSchema: DiscoverPoisOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
