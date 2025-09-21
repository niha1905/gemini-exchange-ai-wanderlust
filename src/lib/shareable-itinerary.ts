'use server';

import { z } from 'zod';
import { generatePersonalizedItineraryOutput } from '@/ai/flows/generate-personalized-itinerary';

const ShareableItinerarySchema = z.object({
  id: z.string(),
  title: z.string(),
  destination: z.string(),
  duration: z.number(),
  createdAt: z.string(),
  expiresAt: z.string(),
  isPublic: z.boolean(),
  shareToken: z.string(),
  itineraryData: z.any(), // The full itinerary data
  viewCount: z.number().default(0),
  lastViewed: z.string().optional(),
});

const ShareSettingsSchema = z.object({
  isPublic: z.boolean(),
  allowComments: z.boolean(),
  allowDownloads: z.boolean(),
  expiresInDays: z.number().min(1).max(365),
  password: z.string().optional(),
});

export type ShareableItinerary = z.infer<typeof ShareableItinerarySchema>;
export type ShareSettings = z.infer<typeof ShareSettingsSchema>;

// Mock database - In production, use actual database
const shareableItineraries: Map<string, ShareableItinerary> = new Map();

// Generate shareable itinerary
export async function createShareableItinerary(
  itineraryData: any,
  title: string,
  destination: string,
  duration: number,
  settings: ShareSettings
): Promise<{ success: boolean; shareUrl?: string; error?: string }> {
  try {
    const shareToken = generateShareToken();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + settings.expiresInDays);
    
    const shareableItinerary: ShareableItinerary = {
      id: `itin-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title,
      destination,
      duration,
      createdAt: new Date().toISOString(),
      expiresAt: expiresAt.toISOString(),
      isPublic: settings.isPublic,
      shareToken,
      itineraryData,
      viewCount: 0,
    };
    
    shareableItineraries.set(shareToken, shareableItinerary);
    
    const shareUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/share/${shareToken}`;
    
    return {
      success: true,
      shareUrl,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create shareable itinerary',
    };
  }
}

// Get shared itinerary
export async function getSharedItinerary(shareToken: string): Promise<{
  success: boolean;
  itinerary?: ShareableItinerary;
  error?: string;
}> {
  try {
    const itinerary = shareableItineraries.get(shareToken);
    
    if (!itinerary) {
      return {
        success: false,
        error: 'Itinerary not found or link has expired',
      };
    }
    
    // Check if expired
    if (new Date() > new Date(itinerary.expiresAt)) {
      shareableItineraries.delete(shareToken);
      return {
        success: false,
        error: 'This shared itinerary has expired',
      };
    }
    
    // Update view count
    itinerary.viewCount += 1;
    itinerary.lastViewed = new Date().toISOString();
    
    return {
      success: true,
      itinerary,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to retrieve shared itinerary',
    };
  }
}

// Generate share token
function generateShareToken(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 32; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Export itinerary as PDF (mock implementation)
export async function exportItineraryAsPDF(
  itineraryData: any,
  format: 'pdf' | 'json' | 'csv' = 'pdf'
): Promise<{ success: boolean; downloadUrl?: string; error?: string }> {
  try {
    // Simulate PDF generation delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // In production, use actual PDF generation library like Puppeteer or jsPDF
    const mockDownloadUrl = `/api/download/itinerary-${Date.now()}.${format}`;
    
    return {
      success: true,
      downloadUrl: mockDownloadUrl,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to export itinerary',
    };
  }
}

// Generate itinerary summary for sharing
export async function generateItinerarySummary(itineraryData: any): Promise<string> {
  const { itinerary, totalCostBreakdown, recommendations } = itineraryData;
  
  const summary = `
🗓️ ${itinerary.length}-Day Trip to ${itinerary[0]?.title || 'Destination'}

💰 Total Cost: ₹${totalCostBreakdown.totalForGroup.toLocaleString()}
👥 Per Person: ₹${totalCostBreakdown.totalPerPerson.toLocaleString()}

📋 Daily Highlights:
${itinerary.map((day: any, index: number) => 
  `Day ${day.day}: ${day.title}
  • ${day.activities.length} activities planned
  • ${day.accommodation ? `Stay: ${day.accommodation.name}` : 'Accommodation included'}
  • ${day.food ? `Food: ${day.food.recommendation}` : 'Meals included'}`
).join('\n\n')}

💡 Best Time to Visit: ${recommendations.bestTimeToVisit}

Generated by AI Travel Planner
  `.trim();
  
  return summary;
}

// Get sharing analytics
export async function getSharingAnalytics(shareToken: string): Promise<{
  success: boolean;
  analytics?: {
    viewCount: number;
    lastViewed: string;
    createdAt: string;
    expiresAt: string;
  };
  error?: string;
}> {
  try {
    const itinerary = shareableItineraries.get(shareToken);
    
    if (!itinerary) {
      return {
        success: false,
        error: 'Itinerary not found',
      };
    }
    
    return {
      success: true,
      analytics: {
        viewCount: itinerary.viewCount,
        lastViewed: itinerary.lastViewed || 'Never',
        createdAt: itinerary.createdAt,
        expiresAt: itinerary.expiresAt,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get analytics',
    };
  }
}
