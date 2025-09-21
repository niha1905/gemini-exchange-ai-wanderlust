import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, CloudSun, Map, Plane, Search, Sparkles } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { placeholderImages } from '@/lib/data';
import type { ImagePlaceholder } from '@/lib/placeholder-images';

const quickLinks = [
  { href: '/discover', title: 'Discover POIs', description: 'Find attractions and restaurants.', icon: Search },
  { href: '/itinerary', title: 'Itinerary Generator', description: 'Create your perfect trip plan.', icon: Map },
];

const getImage = (id: string): ImagePlaceholder | undefined => {
  return placeholderImages.find(img => img.id === id);
}

export default function DashboardPage() {
  const heroImage = getImage('img-hero');

  return (
    <div className="flex flex-col gap-8">
      <div className="relative h-64 md:h-80 w-full overflow-hidden rounded-lg">
        {heroImage && (
          <Image
            src={heroImage.imageUrl}
            alt={heroImage.description}
            fill
            className="object-cover"
            data-ai-hint={heroImage.imageHint}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 p-6 md:p-8">
          <h1 className="font-headline text-3xl md:text-5xl font-bold text-white">Welcome to Wanderlust India</h1>
          <p className="text-lg md:text-xl text-white/90 mt-2">Your personal guide to exploring the wonders of India.</p>
        </div>
      </div>
      
      <section>
        <h2 className="font-headline text-2xl font-bold mb-4">Get Started</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {quickLinks.map((link) => (
            <Card key={link.href} className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-xl font-headline">{link.title}</CardTitle>
                <div className="p-2 bg-primary/10 rounded-md">
                   <link.icon className="w-6 h-6 text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{link.description}</p>
                <Button asChild variant="link" className="px-0 mt-4 text-primary">
                  <Link href={link.href}>
                    Go to {link.title} <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-headline text-2xl font-bold mb-4">Real-time Updates</h2>
        <Card>
          <CardHeader>
            <CardTitle>Nearby Events</CardTitle>
            <CardDescription>Live events happening around you.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center h-48 border-2 border-dashed rounded-lg">
              <p className="text-muted-foreground">Nearby events feature coming soon!</p>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
