'use client';

import { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Ticket } from 'lucide-react';

export type Booking = {
  id: string;
  type: 'Hotel' | 'Flight' | 'Activity';
  destination: string;
  date: string;
  status: 'Confirmed' | 'Pending' | 'Cancelled';
  price: string;
};

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Client-side only: access localStorage
    const storedBookings = localStorage.getItem('userBookings');
    if (storedBookings) {
      setBookings(JSON.parse(storedBookings));
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
       <Card>
        <CardHeader>
          <CardTitle className="font-headline">Your Travel Bookings</CardTitle>
          <CardDescription>
            Loading your bookings...
          </CardDescription>
        </CardHeader>
        <CardContent>
           <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-lg">
              <p className="text-muted-foreground">Loading...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Your Travel Bookings</CardTitle>
        <CardDescription>
          This is a list of accommodations you have 'booked' from the itinerary generator.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {bookings.length > 0 ? (
          <Table>
            <TableCaption>A list of your recent bookings.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Destination/Service</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Price</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell className="font-medium">{booking.type}</TableCell>
                  <TableCell>{booking.destination}</TableCell>
                  <TableCell>{booking.date}</TableCell>
                  <TableCell>
                    <Badge
                      className={cn({
                        'bg-green-100 text-green-800': booking.status === 'Confirmed',
                        'bg-yellow-100 text-yellow-800': booking.status === 'Pending',
                        'bg-red-100 text-red-800': booking.status === 'Cancelled',
                      })}
                    >
                      {booking.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">{booking.price}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-lg">
            <Ticket className="w-16 h-16 text-muted-foreground/50 mb-4" />
            <h2 className="font-headline text-2xl font-bold mb-2">No Bookings Yet</h2>
            <p className="text-muted-foreground max-w-md text-center">
              You haven't made any bookings. Try generating an itinerary and booking an accommodation.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
