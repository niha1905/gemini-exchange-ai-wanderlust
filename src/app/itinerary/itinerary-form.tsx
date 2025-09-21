
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  generatePersonalizedItinerary,
  type GeneratePersonalizedItineraryOutput,
} from '@/ai/flows/generate-personalized-itinerary';
import Image from 'next/image';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2, Sparkles, Clock, Link as LinkIcon, Calendar, Users, MapPin, Car, Bus, Train, Hotel, Utensils, Ticket } from 'lucide-react';
import Link from 'next/link';
import { useToast } from "@/hooks/use-toast";
import type { Booking } from '@/app/bookings/page';
import { RealTimeAdjustments } from '@/components/realtime-adjustments';
import { EMTBookingComponent } from '@/components/emt-booking';
import { ShareableItineraryComponent } from '@/components/shareable-itinerary';

const formSchema = z.object({
  currentLocation: z.string().min(2, { message: 'Current location is required.' }),
  destination: z.string().min(2, { message: 'Destination is required.' }),
  numberOfDays: z.coerce.number().min(1, { message: 'Must be at least 1 day.' }),
  numberOfPeople: z.coerce.number().min(1, { message: 'Must be at least 1 person.' }),
  budget: z.string().min(2, { message: 'Budget is required.' }),
  ageGroup: z.string({ required_error: 'Please select an age group.' }),
  preferences: z.string().min(10, { message: 'Please describe your preferences.' }),
  travelTheme: z.string().optional(),
  language: z.string().optional(),
  specialRequirements: z.string().optional(),
});

export function ItineraryForm() {
  const [loading, setLoading] = useState(false);
  const [itineraryData, setItineraryData] = useState<GeneratePersonalizedItineraryOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [updatedItinerary, setUpdatedItinerary] = useState<any[] | null>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      currentLocation: '',
      destination: '',
      numberOfDays: 3,
      numberOfPeople: 2,
      budget: '',
      preferences: '',
      travelTheme: '',
      language: '',
      specialRequirements: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setItineraryData(null);
    setError(null);
    try {
      const result = await generatePersonalizedItinerary(values);
      setItineraryData(result);
    } catch (error) {
      console.error('Failed to generate itinerary:', error);
      setError('Sorry, we encountered an error while generating your itinerary. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const handleBookAccommodation = (accommodation: string, day: number) => {
    const newBooking: Booking = {
      id: crypto.randomUUID(),
      type: 'Hotel',
      destination: accommodation,
      date: `Day ${day} of your trip`,
      status: 'Confirmed',
      price: `₹${(Math.random() * 20000 + 5000).toFixed(0)}`, // Simulate price
    };
    
    const existingBookings: Booking[] = JSON.parse(localStorage.getItem('userBookings') || '[]');
    const updatedBookings = [...existingBookings, newBooking];
    localStorage.setItem('userBookings', JSON.stringify(updatedBookings));

    toast({
      title: "Booking Confirmed!",
      description: `${accommodation} has been added to your bookings.`,
    });
  };

  const getTravelIcon = (suggestion: string) => {
    if (suggestion.toLowerCase().includes('car')) return <Car className="w-3 h-3" />;
    if (suggestion.toLowerCase().includes('bus')) return <Bus className="w-3 h-3" />;
    if (suggestion.toLowerCase().includes('train')) return <Train className="w-3 h-3" />;
    return null;
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Plan Your Perfect Trip</CardTitle>
          <CardDescription>Tell us about your ideal trip and we'll craft a personalized itinerary for you.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <FormField
                  control={form.control}
                  name="currentLocation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Location</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Mumbai" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="destination"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Destination</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Jaipur" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <FormField
                  control={form.control}
                  name="numberOfDays"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Number of Days</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g., 3" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="numberOfPeople"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Number of People</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g., 2" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="budget"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Budget</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Budget-friendly, Mid-range, Luxury" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="ageGroup"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Age Group</FormLabel>
                       <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select an age group" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="young-adults">Young Adults (18-30)</SelectItem>
                          <SelectItem value="adults">Adults (31-50)</SelectItem>
                          <SelectItem value="family">Family with Kids</SelectItem>
                          <SelectItem value="seniors">Seniors (50+)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="preferences"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preferences & Interests</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tell us what you love to do. e.g., historical sites, hiking, spicy food, local markets..."
                        rows={4}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="travelTheme"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Travel Theme</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a theme" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="heritage">🏛️ Heritage & History</SelectItem>
                          <SelectItem value="nightlife">🌃 Nightlife & Entertainment</SelectItem>
                          <SelectItem value="adventure">🏔️ Adventure & Outdoor</SelectItem>
                          <SelectItem value="relaxation">🧘 Relaxation & Wellness</SelectItem>
                          <SelectItem value="food">🍽️ Food & Culinary</SelectItem>
                          <SelectItem value="culture">🎭 Culture & Arts</SelectItem>
                          <SelectItem value="nature">🌿 Nature & Wildlife</SelectItem>
                          <SelectItem value="spiritual">🕉️ Spiritual & Religious</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="language"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preferred Language</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select language" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="english">English</SelectItem>
                          <SelectItem value="hindi">हिंदी (Hindi)</SelectItem>
                          <SelectItem value="tamil">தமிழ் (Tamil)</SelectItem>
                          <SelectItem value="bengali">বাংলা (Bengali)</SelectItem>
                          <SelectItem value="telugu">తెలుగు (Telugu)</SelectItem>
                          <SelectItem value="marathi">मराठी (Marathi)</SelectItem>
                          <SelectItem value="gujarati">ગુજરાતી (Gujarati)</SelectItem>
                          <SelectItem value="kannada">ಕನ್ನಡ (Kannada)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="specialRequirements"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Special Requirements</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., wheelchair accessible, vegetarian, pet-friendly..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button type="submit" disabled={loading} className="bg-accent hover:bg-accent/90 text-accent-foreground">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate Itinerary
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      {error && (
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-destructive">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error}</p>
          </CardContent>
        </Card>
      )}

      {itineraryData && itineraryData.itinerary && itineraryData.itinerary.length > 0 && (
        <div className="space-y-8">
          {/* Cost Breakdown Card */}
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">💰 Trip Cost Breakdown</CardTitle>
              <CardDescription>Complete cost analysis for your personalized trip</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Accommodation</p>
                  <p className="text-lg font-semibold">₹{itineraryData.totalCostBreakdown.accommodation.toLocaleString()}</p>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Transportation</p>
                  <p className="text-lg font-semibold">₹{itineraryData.totalCostBreakdown.transportation.toLocaleString()}</p>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Activities</p>
                  <p className="text-lg font-semibold">₹{itineraryData.totalCostBreakdown.activities.toLocaleString()}</p>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Food</p>
                  <p className="text-lg font-semibold">₹{itineraryData.totalCostBreakdown.food.toLocaleString()}</p>
                </div>
              </div>
              <div className="flex justify-between items-center p-4 bg-primary/10 rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground">Total per person</p>
                  <p className="text-2xl font-bold">₹{itineraryData.totalCostBreakdown.totalPerPerson.toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Total for group</p>
                  <p className="text-2xl font-bold">₹{itineraryData.totalCostBreakdown.totalForGroup.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Booking Summary Card */}
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">📋 Booking Summary</CardTitle>
              <CardDescription>Items requiring advance booking and instant booking options</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3 text-orange-600">⚠️ Advance Booking Required</h4>
                  <ul className="space-y-2">
                    {itineraryData.bookingSummary.advanceBookingRequired.map((item, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm">
                        <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3 text-green-600">✅ Instant Booking Available</h4>
                  <ul className="space-y-2">
                    {itineraryData.bookingSummary.instantBookingAvailable.map((item, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              {itineraryData.bookingSummary.estimatedSavings && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-700">
                    💡 Estimated savings with advance booking: ₹{itineraryData.bookingSummary.estimatedSavings.toLocaleString()}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recommendations Card */}
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">💡 Travel Recommendations</CardTitle>
              <CardDescription>Important tips and considerations for your trip</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">⏰ Best Time to Visit</h4>
                <p className="text-sm text-muted-foreground">{itineraryData.recommendations.bestTimeToVisit}</p>
              </div>
              {itineraryData.recommendations.weatherConsiderations && (
                <div>
                  <h4 className="font-semibold mb-2">🌤️ Weather Considerations</h4>
                  <p className="text-sm text-muted-foreground">{itineraryData.recommendations.weatherConsiderations}</p>
                </div>
              )}
              {itineraryData.recommendations.culturalNotes && (
                <div>
                  <h4 className="font-semibold mb-2">🏛️ Cultural Notes</h4>
                  <p className="text-sm text-muted-foreground">{itineraryData.recommendations.culturalNotes}</p>
                </div>
              )}
              {itineraryData.recommendations.safetyTips && (
                <div>
                  <h4 className="font-semibold mb-2">🛡️ Safety Tips</h4>
                  <p className="text-sm text-muted-foreground">{itineraryData.recommendations.safetyTips}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Itinerary Details */}
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">🗓️ Your Personalized Itinerary</CardTitle>
              <CardDescription>A custom-made plan for your trip.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              {itineraryData.itinerary.map((dayPlan, index) => (
              <div key={index} className="space-y-6 border-t pt-6">
                <h3 className="font-headline text-2xl font-bold">Day {dayPlan.day}: {dayPlan.title}</h3>
                <div className="grid md:grid-cols-3 gap-8 items-start">
                  <div className="md:col-span-2">
                    <h4 className="font-headline text-lg font-semibold mb-4">Daily Plan</h4>
                    <div className="relative mt-4">
                      <div className="absolute left-3.5 top-0 h-full w-px bg-border" />
                      <ul className="space-y-6">
                        {dayPlan.activities.map((activity, activityIndex) => (
                          <li key={activityIndex} className="relative flex items-start gap-4">
                            <div className="absolute left-0 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-accent-foreground">
                              <span className="text-sm">{activity.emoji}</span>
                            </div>
                            <div className="pl-10">
                              <p className="font-semibold text-sm">{activity.time}</p>
                              <p className="text-sm text-muted-foreground">{activity.description}</p>
                              <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                                {activity.duration && (
                                  <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">⏱️ {activity.duration}</span>
                                )}
                                {activity.estimatedCost && (
                                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded">💰 ₹{activity.estimatedCost}</span>
                                )}
                                {activity.bookingRequired && (
                                  <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded">📋 Booking Required</span>
                                )}
                              </div>
                              <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                                {activity.travelSuggestion && (
                                    <div className="flex items-center gap-1">
                                      {getTravelIcon(activity.travelSuggestion)}
                                      <span>{activity.travelSuggestion}</span>
                                    </div>
                                )}
                                {activity.source && (
                                  <Link href={activity.source} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline flex items-center gap-1">
                                    <LinkIcon className="w-3 h-3" />
                                    More Info
                                  </Link>
                                )}
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="md:col-span-1 space-y-6">
                     <h4 className="font-headline text-lg font-semibold">Daily Snapshot</h4>
                     <div className="relative aspect-video rounded-lg overflow-hidden border">
                      <Image
                        src={dayPlan.mapImageUrl}
                        alt={dayPlan.title}
                        fill
                        className="object-cover"
                        data-ai-hint={dayPlan.mapImageHint}
                      />
                    </div>
                    {dayPlan.accommodation && (
                      <Card>
                        <CardHeader className="flex flex-row items-center gap-3 p-4">
                          <Hotel className="w-5 h-5 text-primary" />
                          <h5 className="font-semibold">Accommodation</h5>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                          <div className="space-y-2 mb-4">
                            <p className="font-semibold text-sm">{dayPlan.accommodation.name}</p>
                            <p className="text-xs text-muted-foreground">{dayPlan.accommodation.type}</p>
                            <p className="text-sm font-semibold text-green-600">₹{dayPlan.accommodation.estimatedCost}/night</p>
                            {dayPlan.accommodation.amenities && (
                              <div className="flex flex-wrap gap-1">
                                {dayPlan.accommodation.amenities.map((amenity, idx) => (
                                  <span key={idx} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                                    {amenity}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                          <Button 
                            onClick={() => handleBookAccommodation(dayPlan.accommodation!.name, dayPlan.day)} 
                            size="sm" 
                            className="w-full"
                            variant={dayPlan.accommodation.bookingRequired ? "default" : "outline"}
                          >
                            <Ticket className="mr-2 h-4 w-4" />
                            {dayPlan.accommodation.bookingRequired ? "Book Now" : "Check Availability"}
                          </Button>
                        </CardContent>
                      </Card>
                    )}
                    {dayPlan.food && (
                      <Card>
                        <CardHeader className="flex flex-row items-center gap-3 p-4">
                          <Utensils className="w-5 h-5 text-primary" />
                          <h5 className="font-semibold">Food Suggestion</h5>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                          <div className="space-y-2">
                            <p className="font-semibold text-sm">{dayPlan.food.recommendation}</p>
                            {dayPlan.food.cuisine && (
                              <p className="text-xs text-muted-foreground">{dayPlan.food.cuisine} cuisine</p>
                            )}
                            <p className="text-sm font-semibold text-green-600">₹{dayPlan.food.estimatedCost}/person</p>
                            {dayPlan.food.specialNotes && (
                              <p className="text-xs text-blue-600">{dayPlan.food.specialNotes}</p>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    )}
                    
                    {dayPlan.transportation && (
                      <Card>
                        <CardHeader className="flex flex-row items-center gap-3 p-4">
                          <Car className="w-5 h-5 text-primary" />
                          <h5 className="font-semibold">Transportation</h5>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                          <div className="space-y-2">
                            <p className="font-semibold text-sm">{dayPlan.transportation.mode}</p>
                            {dayPlan.transportation.duration && (
                              <p className="text-xs text-muted-foreground">Duration: {dayPlan.transportation.duration}</p>
                            )}
                            <p className="text-sm font-semibold text-green-600">₹{dayPlan.transportation.estimatedCost}</p>
                            {dayPlan.transportation.bookingRequired && (
                              <p className="text-xs text-orange-600">📋 Advance booking recommended</p>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
        </div>
      )}

      {/* Real-Time Adjustments */}
      {itineraryData && itineraryData.itinerary && (
        <RealTimeAdjustments
          itinerary={updatedItinerary || itineraryData.itinerary}
          destination={form.getValues('destination')}
          onAdjustmentsUpdate={setUpdatedItinerary}
        />
      )}

      {/* EMT Booking System */}
      {itineraryData && (
        <EMTBookingComponent
          itineraryData={itineraryData}
          onBookingComplete={setBookings}
        />
      )}

      {/* Shareable Itinerary */}
      {itineraryData && (
        <ShareableItineraryComponent
          itineraryData={itineraryData}
        />
      )}
    </div>
  );
}
