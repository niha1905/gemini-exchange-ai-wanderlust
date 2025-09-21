'use client';

import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { discoverPois, type DiscoverPoisOutput } from '@/ai/flows/discover-pois';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Loader2, Search, Sparkles, Star, Bed, Utensils, Landmark, Activity, Coffee } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';

const formSchema = z.object({
  query: z.string().min(3, { message: 'Please enter at least 3 characters.' }),
});

const typeIcons: { [key: string]: React.ReactNode } = {
  Accommodation: <Bed className="w-4 h-4" />,
  Restaurant: <Utensils className="w-4 h-4" />,
  Attraction: <Landmark className="w-4 h-4" />,
  Activity: <Activity className="w-4 h-4" />,
  Cafe: <Coffee className="w-4 h-4" />,
  Other: <Sparkles className="w-4 h-4" />,
};

export default function DiscoverPage() {
  const [loading, setLoading] = useState(false);
  const [pois, setPois] = useState<DiscoverPoisOutput['pois'] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      query: '',
    },
  });

  const searchTriggered = useRef(false);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setPois(null);
    setError(null);
    try {
      const result = await discoverPois(values);
      setPois(result.pois);
    } catch (error) {
      console.error('Failed to discover POIs:', error);
      setError('Sorry, we encountered an error while searching. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    async function getCityAndSearch(latitude: number, longitude: number) {
      try {
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
        const data = await response.json();
        const city = data.address.city || data.address.town || data.address.village || 'your current location';
        const initialQuery = `popular attractions in ${city}`;
        form.setValue('query', initialQuery);
        if (!searchTriggered.current) {
          onSubmit({ query: initialQuery });
          searchTriggered.current = true;
        }
      } catch (error) {
        console.error("Error fetching city:", error);
        if (!form.getValues('query')) {
            form.setValue('query', 'popular attractions in India');
        }
      }
    }

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          if (!searchTriggered.current) {
            getCityAndSearch(position.coords.latitude, position.coords.longitude);
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
          if (!form.getValues('query') && !searchTriggered.current) {
            form.setValue('query', 'popular attractions in India');
            onSubmit({query: 'popular attractions in India'});
            searchTriggered.current = true;
          }
        }
      );
    } else {
        if (!form.getValues('query') && !searchTriggered.current) {
            form.setValue('query', 'popular attractions in India');
            onSubmit({query: 'popular attractions in India'});
            searchTriggered.current = true;
        }
    }
  }, [form]);

  return (
    <div className="flex flex-col gap-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Discover Points of Interest</CardTitle>
          <CardDescription>Use the search below to find attractions, restaurants, and hidden gems.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-start gap-4">
              <FormField
                control={form.control}
                name="query"
                render={({ field }) => (
                  <FormItem className="flex-grow">
                    <FormControl>
                      <div className="relative">
                         <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input placeholder="e.g., temples in South India" className="pl-10" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={loading || !form.getValues('query')}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Searching...
                  </>
                ) : "Search" }
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

      {loading && (
         <div className="flex flex-col items-center justify-center text-center h-96 border-2 border-dashed rounded-lg p-8">
            <Loader2 className="w-16 h-16 text-primary animate-spin mb-4" />
            <h2 className="font-headline text-2xl font-bold mb-2">Searching for amazing places...</h2>
            <p className="text-muted-foreground max-w-md">
              Our AI is exploring recommendations based on your request. This might take a moment.
            </p>
          </div>
      )}

      {!loading && !pois && (
         <div className="flex flex-col items-center justify-center text-center h-96 border-2 border-dashed rounded-lg p-8">
            <Sparkles className="w-16 h-16 text-muted-foreground/50 mb-4" />
            <h2 className="font-headline text-2xl font-bold mb-2">Find Your Next Destination</h2>
            <p className="text-muted-foreground max-w-md">
              Your location will be used to suggest a search. You can also enter a custom query like "beaches in Goa" or "best street food in Delhi" to discover amazing places with the help of AI.
            </p>
          </div>
      )}

      {pois && pois.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pois.map((poi, index) => (
            <Card key={index} className="flex flex-col overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="relative h-48 w-full">
                <Image
                  src={poi.imageUrl}
                  alt={poi.name}
                  fill
                  className="object-cover"
                  data-ai-hint={poi.imageHint}
                />
              </div>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="font-headline text-lg mb-1">{poi.name}</CardTitle>
                  <Badge variant="secondary" className="flex items-center gap-2 whitespace-nowrap">
                      {typeIcons[poi.type] || <Sparkles className="w-4 h-4" />}
                      {poi.type}
                  </Badge>
                </div>
                <CardDescription>{poi.location}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                 <p className="text-sm text-muted-foreground italic border-l-2 pl-3 mb-4">
                    &quot;{poi.review}&quot;
                  </p>
                <p className="text-sm">{poi.description}</p>
              </CardContent>
              <CardFooter>
                  <div className="flex items-center text-yellow-500">
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                  </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

       {pois && pois.length === 0 && !loading && (
          <div className="flex flex-col items-center justify-center text-center h-64 border-2 border-dashed rounded-lg">
            <p className="text-muted-foreground">No results found. Try a different search.</p>
          </div>
        )}
    </div>
  );
}
