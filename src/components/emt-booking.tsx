'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  CreditCard, 
  Smartphone, 
  Building2, 
  Wallet,
  CheckCircle,
  Clock,
  AlertCircle,
  Ticket,
  Hotel,
  Plane,
  Train,
  Bus,
  Utensils,
  MapPin
} from 'lucide-react';
import { searchEMTInventory, processBookingRequest, type EMTBooking, type BookingRequest } from '@/lib/emt-booking';
import { useToast } from '@/hooks/use-toast';

interface EMTBookingProps {
  itineraryData: any;
  onBookingComplete: (bookings: EMTBooking[]) => void;
}

export function EMTBookingComponent({ itineraryData, onBookingComplete }: EMTBookingProps) {
  const [selectedItems, setSelectedItems] = useState<EMTBooking[]>([]);
  const [loading, setLoading] = useState(false);
  const [bookingStep, setBookingStep] = useState<'search' | 'payment' | 'confirmation'>('search');
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });
  const [paymentInfo, setPaymentInfo] = useState({
    method: 'card' as 'card' | 'upi' | 'netbanking' | 'wallet',
    cardDetails: {
      number: '',
      expiry: '',
      cvv: '',
      name: '',
    },
    upiId: '',
  });
  const [bookingResult, setBookingResult] = useState<any>(null);
  const { toast } = useToast();

  const getItemIcon = (type: string) => {
    switch (type) {
      case 'hotel': return <Hotel className="w-4 h-4" />;
      case 'flight': return <Plane className="w-4 h-4" />;
      case 'train': return <Train className="w-4 h-4" />;
      case 'bus': return <Bus className="w-4 h-4" />;
      case 'activity': return <Ticket className="w-4 h-4" />;
      case 'restaurant': return <Utensils className="w-4 h-4" />;
      default: return <MapPin className="w-4 h-4" />;
    }
  };

  const handleAddToBooking = async (item: EMTBooking) => {
    setSelectedItems(prev => [...prev, item]);
    toast({
      title: "Added to Booking",
      description: `${item.name} has been added to your booking cart.`,
    });
  };

  const handleRemoveFromBooking = (itemId: string) => {
    setSelectedItems(prev => prev.filter(item => item.id !== itemId));
  };

  const handleProceedToPayment = () => {
    if (selectedItems.length === 0) {
      toast({
        title: "No Items Selected",
        description: "Please select at least one item to book.",
        variant: "destructive",
      });
      return;
    }
    setBookingStep('payment');
  };

  const handleProcessBooking = async () => {
    if (!customerInfo.name || !customerInfo.email || !customerInfo.phone) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required customer information.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const bookingRequest: BookingRequest = {
        items: selectedItems.map(item => ({
          type: item.type,
          name: item.name,
          date: item.date,
          time: item.time,
          quantity: 1,
        })),
        customerInfo,
        paymentInfo,
      };

      const result = await processBookingRequest(bookingRequest);
      
      if (result.success) {
        setBookingResult(result);
        setBookingStep('confirmation');
        onBookingComplete(result.bookings);
        toast({
          title: "Booking Successful!",
          description: "Your bookings have been confirmed.",
        });
      } else {
        toast({
          title: "Booking Failed",
          description: result.error || "An error occurred during booking.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Booking Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const totalAmount = selectedItems.reduce((sum, item) => sum + item.price, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
          <Ticket className="w-5 h-5 text-primary" />
          EMT Booking System
        </CardTitle>
        <CardDescription>
          Book your itinerary items with our integrated booking system
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {bookingStep === 'search' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="booking-type">Booking Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hotel">Hotel</SelectItem>
                    <SelectItem value="flight">Flight</SelectItem>
                    <SelectItem value="train">Train</SelectItem>
                    <SelectItem value="bus">Bus</SelectItem>
                    <SelectItem value="activity">Activity</SelectItem>
                    <SelectItem value="restaurant">Restaurant</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input placeholder="Enter location" />
              </div>
              <div>
                <Label htmlFor="date">Date</Label>
                <Input type="date" />
              </div>
            </div>
            
            <Button className="w-full">
              Search Available Bookings
            </Button>

            {/* Mock search results */}
            <div className="space-y-3">
              <h4 className="font-semibold">Available Bookings</h4>
              {[
                { type: 'hotel', name: 'Taj Palace Hotel', location: 'Mumbai', date: '2024-01-15', price: 15000 },
                { type: 'flight', name: 'Air India Express', location: 'Mumbai to Delhi', date: '2024-01-15', price: 8500 },
                { type: 'activity', name: 'Gateway of India Tour', location: 'Mumbai', date: '2024-01-16', price: 1200 },
              ].map((item, index) => (
                <Card key={index} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getItemIcon(item.type)}
                      <div>
                        <p className="font-semibold">{item.name}</p>
                        <p className="text-sm text-muted-foreground">{item.location}</p>
                        <p className="text-sm text-muted-foreground">{item.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <p className="font-semibold text-green-600">₹{item.price.toLocaleString()}</p>
                      <Button 
                        size="sm" 
                        onClick={() => handleAddToBooking(item as EMTBooking)}
                      >
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {bookingStep === 'payment' && (
          <div className="space-y-6">
            {/* Selected Items */}
            <div>
              <h4 className="font-semibold mb-3">Selected Items</h4>
              <div className="space-y-2">
                {selectedItems.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-2">
                      {getItemIcon(item.type)}
                      <span className="font-medium">{item.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">₹{item.price.toLocaleString()}</span>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleRemoveFromBooking(item.id)}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-4 bg-primary/10 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">Total Amount:</span>
                  <span className="text-2xl font-bold text-primary">₹{totalAmount.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Customer Information */}
            <div className="space-y-4">
              <h4 className="font-semibold">Customer Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input 
                    id="name"
                    value={customerInfo.name}
                    onChange={(e) => setCustomerInfo(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input 
                    id="email"
                    type="email"
                    value={customerInfo.email}
                    onChange={(e) => setCustomerInfo(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="Enter your email"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone *</Label>
                  <Input 
                    id="phone"
                    value={customerInfo.phone}
                    onChange={(e) => setCustomerInfo(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="Enter your phone number"
                  />
                </div>
                <div>
                  <Label htmlFor="address">Address</Label>
                  <Input 
                    id="address"
                    value={customerInfo.address}
                    onChange={(e) => setCustomerInfo(prev => ({ ...prev, address: e.target.value }))}
                    placeholder="Enter your address"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="space-y-4">
              <h4 className="font-semibold">Payment Method</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button
                  variant={paymentInfo.method === 'card' ? 'default' : 'outline'}
                  onClick={() => setPaymentInfo(prev => ({ ...prev, method: 'card' }))}
                  className="flex flex-col items-center gap-2 h-20"
                >
                  <CreditCard className="w-6 h-6" />
                  <span className="text-xs">Card</span>
                </Button>
                <Button
                  variant={paymentInfo.method === 'upi' ? 'default' : 'outline'}
                  onClick={() => setPaymentInfo(prev => ({ ...prev, method: 'upi' }))}
                  className="flex flex-col items-center gap-2 h-20"
                >
                  <Smartphone className="w-6 h-6" />
                  <span className="text-xs">UPI</span>
                </Button>
                <Button
                  variant={paymentInfo.method === 'netbanking' ? 'default' : 'outline'}
                  onClick={() => setPaymentInfo(prev => ({ ...prev, method: 'netbanking' }))}
                  className="flex flex-col items-center gap-2 h-20"
                >
                  <Building2 className="w-6 h-6" />
                  <span className="text-xs">Net Banking</span>
                </Button>
                <Button
                  variant={paymentInfo.method === 'wallet' ? 'default' : 'outline'}
                  onClick={() => setPaymentInfo(prev => ({ ...prev, method: 'wallet' }))}
                  className="flex flex-col items-center gap-2 h-20"
                >
                  <Wallet className="w-6 h-6" />
                  <span className="text-xs">Wallet</span>
                </Button>
              </div>

              {paymentInfo.method === 'card' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="card-number">Card Number</Label>
                    <Input placeholder="1234 5678 9012 3456" />
                  </div>
                  <div>
                    <Label htmlFor="card-name">Cardholder Name</Label>
                    <Input placeholder="John Doe" />
                  </div>
                  <div>
                    <Label htmlFor="expiry">Expiry Date</Label>
                    <Input placeholder="MM/YY" />
                  </div>
                  <div>
                    <Label htmlFor="cvv">CVV</Label>
                    <Input placeholder="123" />
                  </div>
                </div>
              )}

              {paymentInfo.method === 'upi' && (
                <div>
                  <Label htmlFor="upi-id">UPI ID</Label>
                  <Input placeholder="yourname@upi" />
                </div>
              )}
            </div>

            <div className="flex gap-4">
              <Button variant="outline" onClick={() => setBookingStep('search')}>
                Back to Search
              </Button>
              <Button onClick={handleProcessBooking} disabled={loading} className="flex-1">
                {loading ? (
                  <>
                    <Clock className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Complete Booking
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        {bookingStep === 'confirmation' && bookingResult && (
          <div className="space-y-4">
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Your booking has been successfully processed!
              </AlertDescription>
            </Alert>

            <div className="space-y-3">
              <h4 className="font-semibold">Booking Confirmation</h4>
              {bookingResult.bookings.map((booking: EMTBooking, index: number) => (
                <Card key={index} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getItemIcon(booking.type)}
                      <div>
                        <p className="font-semibold">{booking.name}</p>
                        <p className="text-sm text-muted-foreground">{booking.location}</p>
                        <p className="text-sm text-muted-foreground">
                          Confirmation: {booking.confirmationNumber}
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-green-600">
                      {booking.status}
                    </Badge>
                  </div>
                </Card>
              ))}
            </div>

            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="font-semibold text-green-800">Payment Details</p>
              <p className="text-sm text-green-700">
                Amount: ₹{bookingResult.payment.amount.toLocaleString()}
              </p>
              <p className="text-sm text-green-700">
                Transaction ID: {bookingResult.payment.transactionId}
              </p>
              <p className="text-sm text-green-700">
                Status: {bookingResult.payment.status}
              </p>
            </div>

            <Button 
              onClick={() => {
                setBookingStep('search');
                setSelectedItems([]);
                setBookingResult(null);
              }}
              className="w-full"
            >
              Book More Items
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
