'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Cloud, 
  CloudRain, 
  Sun, 
  Thermometer, 
  AlertTriangle, 
  RefreshCw,
  CheckCircle,
  Clock,
  DollarSign
} from 'lucide-react';
import { generateRealTimeAdjustments, updateItineraryWithAdjustments } from '@/lib/realtime-adjustments';

interface Adjustment {
  type: 'weather' | 'delay' | 'closure' | 'last_minute';
  severity: 'low' | 'medium' | 'high' | 'critical';
  affectedActivities: string[];
  alternativeSuggestions: Array<{
    activity: string;
    reason: string;
    estimatedCost?: number;
    bookingRequired?: boolean;
  }>;
  impactOnCost?: number;
  impactOnSchedule?: string;
}

interface RealTimeAdjustmentsProps {
  itinerary: any[];
  destination: string;
  onAdjustmentsUpdate: (updatedItinerary: any[]) => void;
}

export function RealTimeAdjustments({ 
  itinerary, 
  destination, 
  onAdjustmentsUpdate 
}: RealTimeAdjustmentsProps) {
  const [adjustments, setAdjustments] = useState<Adjustment[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchAdjustments = async () => {
    setLoading(true);
    try {
      const newAdjustments = await generateRealTimeAdjustments(itinerary, destination);
      setAdjustments(newAdjustments);
      
      if (newAdjustments.length > 0) {
        const updatedItinerary = await updateItineraryWithAdjustments(itinerary, newAdjustments);
        onAdjustmentsUpdate(updatedItinerary);
      }
      
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to fetch adjustments:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdjustments();
    
    // Set up periodic updates every 5 minutes
    const interval = setInterval(fetchAdjustments, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [destination]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'low': return <CheckCircle className="w-4 h-4" />;
      case 'medium': return <Clock className="w-4 h-4" />;
      case 'high': return <AlertTriangle className="w-4 h-4" />;
      case 'critical': return <AlertTriangle className="w-4 h-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'weather': return <CloudRain className="w-4 h-4" />;
      case 'delay': return <Clock className="w-4 h-4" />;
      case 'closure': return <AlertTriangle className="w-4 h-4" />;
      case 'last_minute': return <RefreshCw className="w-4 h-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  if (adjustments.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2">
            <Sun className="w-5 h-5 text-green-600" />
            Real-Time Status
          </CardTitle>
          <CardDescription>Monitoring your trip for any adjustments needed</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <p className="text-lg font-semibold text-green-600">All Clear!</p>
              <p className="text-sm text-muted-foreground">
                No adjustments needed at this time
              </p>
              {lastUpdated && (
                <p className="text-xs text-muted-foreground mt-2">
                  Last updated: {lastUpdated.toLocaleTimeString()}
                </p>
              )}
            </div>
          </div>
          <Button 
            onClick={fetchAdjustments} 
            disabled={loading}
            variant="outline" 
            className="w-full"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Check for Updates
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-orange-600" />
          Real-Time Adjustments
        </CardTitle>
        <CardDescription>
          Important updates that may affect your itinerary
          {lastUpdated && (
            <span className="block text-xs text-muted-foreground mt-1">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {adjustments.map((adjustment, index) => (
          <Alert key={index} className="border-l-4 border-l-orange-500">
            <div className="flex items-start gap-3">
              {getTypeIcon(adjustment.type)}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-semibold capitalize">
                    {adjustment.type.replace('_', ' ')} Alert
                  </h4>
                  <Badge className={getSeverityColor(adjustment.severity)}>
                    {getSeverityIcon(adjustment.severity)}
                    <span className="ml-1 capitalize">{adjustment.severity}</span>
                  </Badge>
                </div>
                
                <AlertDescription className="space-y-3">
                  <div>
                    <p className="font-medium text-sm mb-1">Affected Activities:</p>
                    <ul className="text-sm text-muted-foreground list-disc list-inside">
                      {adjustment.affectedActivities.map((activity, idx) => (
                        <li key={idx}>{activity}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <p className="font-medium text-sm mb-1">Alternative Suggestions:</p>
                    <div className="space-y-2">
                      {adjustment.alternativeSuggestions.map((suggestion, idx) => (
                        <div key={idx} className="bg-muted p-3 rounded-lg">
                          <p className="font-medium text-sm">{suggestion.activity}</p>
                          <p className="text-xs text-muted-foreground mb-1">{suggestion.reason}</p>
                          <div className="flex items-center gap-2 text-xs">
                            {suggestion.estimatedCost && (
                              <span className="flex items-center gap-1 text-green-600">
                                <DollarSign className="w-3 h-3" />
                                ₹{suggestion.estimatedCost}
                              </span>
                            )}
                            {suggestion.bookingRequired && (
                              <Badge variant="outline" className="text-xs">
                                Booking Required
                              </Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {(adjustment.impactOnCost || adjustment.impactOnSchedule) && (
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="font-medium text-sm mb-1">Impact Summary:</p>
                      {adjustment.impactOnCost && (
                        <p className="text-sm text-muted-foreground">
                          Cost Impact: ₹{adjustment.impactOnCost}
                        </p>
                      )}
                      {adjustment.impactOnSchedule && (
                        <p className="text-sm text-muted-foreground">
                          Schedule Impact: {adjustment.impactOnSchedule}
                        </p>
                      )}
                    </div>
                  )}
                </AlertDescription>
              </div>
            </div>
          </Alert>
        ))}
        
        <Button 
          onClick={fetchAdjustments} 
          disabled={loading}
          variant="outline" 
          className="w-full"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh Adjustments
        </Button>
      </CardContent>
    </Card>
  );
}
