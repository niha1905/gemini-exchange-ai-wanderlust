import { notFound } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Users, MapPin, DollarSign, Eye } from 'lucide-react';
import { getSharedItinerary } from '@/lib/shareable-itinerary';

interface SharedItineraryPageProps {
  params: {
    token: string;
  };
}

export default async function SharedItineraryPage({ params }: SharedItineraryPageProps) {
  const { token } = params;
  
  const result = await getSharedItinerary(token);
  
  if (!result.success || !result.itinerary) {
    notFound();
  }
  
  const { itinerary } = result;
  const itineraryData = itinerary.itineraryData;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">{itinerary.title}</h1>
          <p className="text-xl text-muted-foreground mb-4">{itinerary.destination}</p>
          <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {itinerary.duration} days
            </div>
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              {itinerary.viewCount} views
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              Created {new Date(itinerary.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>

        {/* Cost Breakdown */}
        {itineraryData.totalCostBreakdown && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="font-headline">💰 Trip Cost Breakdown</CardTitle>
              <CardDescription>Complete cost analysis for this personalized trip</CardDescription>
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
        )}

        {/* Recommendations */}
        {itineraryData.recommendations && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="font-headline">💡 Travel Recommendations</CardTitle>
              <CardDescription>Important tips and considerations for this trip</CardDescription>
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
        )}

        {/* Daily Itinerary */}
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">🗓️ Daily Itinerary</CardTitle>
            <CardDescription>Detailed day-by-day plan for your trip</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            {itineraryData.itinerary.map((dayPlan: any, index: number) => (
              <div key={index} className="space-y-6 border-t pt-6">
                <h3 className="font-headline text-2xl font-bold">Day {dayPlan.day}: {dayPlan.title}</h3>
                
                {/* Activities */}
                <div className="space-y-4">
                  <h4 className="font-headline text-lg font-semibold">Daily Activities</h4>
                  <div className="space-y-3">
                    {dayPlan.activities.map((activity: any, activityIndex: number) => (
                      <div key={activityIndex} className="flex items-start gap-4 p-4 bg-muted rounded-lg">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-accent-foreground">
                          <span className="text-sm">{activity.emoji}</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-semibold text-sm">{activity.time}</p>
                            {activity.duration && (
                              <Badge variant="outline" className="text-xs">
                                ⏱️ {activity.duration}
                              </Badge>
                            )}
                            {activity.estimatedCost && (
                              <Badge variant="outline" className="text-xs">
                                💰 ₹{activity.estimatedCost}
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{activity.description}</p>
                          {activity.travelSuggestion && (
                            <p className="text-xs text-blue-600">🚗 {activity.travelSuggestion}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Accommodation */}
                {dayPlan.accommodation && (
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      🏨 Accommodation
                    </h4>
                    <p className="font-medium">{dayPlan.accommodation.name}</p>
                    <p className="text-sm text-muted-foreground">{dayPlan.accommodation.type}</p>
                    <p className="text-sm font-semibold text-green-600">₹{dayPlan.accommodation.estimatedCost}/night</p>
                    {dayPlan.accommodation.amenities && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {dayPlan.accommodation.amenities.map((amenity: string, idx: number) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {amenity}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Food */}
                {dayPlan.food && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      🍽️ Food Recommendation
                    </h4>
                    <p className="font-medium">{dayPlan.food.recommendation}</p>
                    {dayPlan.food.cuisine && (
                      <p className="text-sm text-muted-foreground">{dayPlan.food.cuisine} cuisine</p>
                    )}
                    <p className="text-sm font-semibold text-green-600">₹{dayPlan.food.estimatedCost}/person</p>
                    {dayPlan.food.specialNotes && (
                      <p className="text-xs text-blue-600 mt-1">{dayPlan.food.specialNotes}</p>
                    )}
                  </div>
                )}

                {/* Transportation */}
                {dayPlan.transportation && (
                  <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      🚗 Transportation
                    </h4>
                    <p className="font-medium">{dayPlan.transportation.mode}</p>
                    {dayPlan.transportation.duration && (
                      <p className="text-sm text-muted-foreground">Duration: {dayPlan.transportation.duration}</p>
                    )}
                    <p className="text-sm font-semibold text-green-600">₹{dayPlan.transportation.estimatedCost}</p>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 p-6 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground mb-2">
            This itinerary was generated by AI Travel Planner
          </p>
          <Button variant="outline" size="sm">
            Create Your Own Itinerary
          </Button>
        </div>
      </div>
    </div>
  );
}
