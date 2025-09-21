'use server';

import { z } from 'zod';

// EMT Inventory Booking Schema
const EMTBookingSchema = z.object({
  id: z.string(),
  type: z.enum(['hotel', 'flight', 'train', 'bus', 'activity', 'restaurant']),
  name: z.string(),
  location: z.string(),
  date: z.string(),
  time: z.string().optional(),
  price: z.number(),
  currency: z.string().default('INR'),
  status: z.enum(['available', 'booked', 'confirmed', 'cancelled']),
  bookingReference: z.string().optional(),
  confirmationNumber: z.string().optional(),
  cancellationPolicy: z.string().optional(),
  amenities: z.array(z.string()).optional(),
  contactInfo: z.object({
    phone: z.string(),
    email: z.string(),
    address: z.string(),
  }).optional(),
});

const PaymentSchema = z.object({
  amount: z.number(),
  currency: z.string().default('INR'),
  method: z.enum(['card', 'upi', 'netbanking', 'wallet']),
  status: z.enum(['pending', 'completed', 'failed', 'refunded']),
  transactionId: z.string(),
  paymentGateway: z.string(),
});

const BookingRequestSchema = z.object({
  items: z.array(z.object({
    type: z.enum(['hotel', 'flight', 'train', 'bus', 'activity', 'restaurant']),
    name: z.string(),
    date: z.string(),
    time: z.string().optional(),
    quantity: z.number().default(1),
    specialRequests: z.string().optional(),
  })),
  customerInfo: z.object({
    name: z.string(),
    email: z.string(),
    phone: z.string(),
    address: z.string(),
  }),
  paymentInfo: z.object({
    method: z.enum(['card', 'upi', 'netbanking', 'wallet']),
    cardDetails: z.object({
      number: z.string(),
      expiry: z.string(),
      cvv: z.string(),
      name: z.string(),
    }).optional(),
    upiId: z.string().optional(),
  }),
});

export type EMTBooking = z.infer<typeof EMTBookingSchema>;
export type Payment = z.infer<typeof PaymentSchema>;
export type BookingRequest = z.infer<typeof BookingRequestSchema>;

// Mock EMT Inventory - In production, integrate with actual EMT system
const mockEMTInventory: EMTBooking[] = [
  {
    id: 'hotel-001',
    type: 'hotel',
    name: 'Taj Palace Hotel',
    location: 'Mumbai',
    date: '2024-01-15',
    price: 15000,
    status: 'available',
    amenities: ['WiFi', 'Pool', 'Spa', 'Restaurant'],
    contactInfo: {
      phone: '+91-22-6665-3366',
      email: 'reservations@tajhotels.com',
      address: 'Cuffe Parade, Mumbai',
    },
  },
  {
    id: 'flight-001',
    type: 'flight',
    name: 'Air India Express',
    location: 'Mumbai to Delhi',
    date: '2024-01-15',
    time: '10:30',
    price: 8500,
    status: 'available',
    bookingReference: 'AI-1234',
  },
  {
    id: 'train-001',
    type: 'train',
    name: 'Rajdhani Express',
    location: 'Mumbai to Delhi',
    date: '2024-01-15',
    time: '16:35',
    price: 2500,
    status: 'available',
    bookingReference: 'RD-5678',
  },
  {
    id: 'activity-001',
    type: 'activity',
    name: 'Gateway of India Tour',
    location: 'Mumbai',
    date: '2024-01-16',
    time: '09:00',
    price: 1200,
    status: 'available',
    amenities: ['Guide', 'Transport', 'Entry Tickets'],
  },
];

// Search EMT inventory
export async function searchEMTInventory(
  type: string,
  location: string,
  date: string
): Promise<EMTBooking[]> {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return mockEMTInventory.filter(item => 
    item.type === type &&
    item.location.toLowerCase().includes(location.toLowerCase()) &&
    item.date === date &&
    item.status === 'available'
  );
}

// Process booking request
export async function processBookingRequest(
  request: BookingRequest
): Promise<{ success: boolean; bookings: EMTBooking[]; payment: Payment; error?: string }> {
  try {
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const bookings: EMTBooking[] = [];
    let totalAmount = 0;
    
    // Process each booking item
    for (const item of request.items) {
      const inventoryItem = mockEMTInventory.find(inv => 
        inv.type === item.type &&
        inv.name.toLowerCase().includes(item.name.toLowerCase()) &&
        inv.date === item.date
      );
      
      if (!inventoryItem) {
        throw new Error(`Item not available: ${item.name}`);
      }
      
      const booking: EMTBooking = {
        ...inventoryItem,
        id: `${inventoryItem.type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        status: 'confirmed',
        confirmationNumber: `CONF-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
        price: inventoryItem.price * item.quantity,
      };
      
      bookings.push(booking);
      totalAmount += booking.price;
    }
    
    // Process payment
    const payment: Payment = {
      amount: totalAmount,
      currency: 'INR',
      method: request.paymentInfo.method,
      status: 'completed',
      transactionId: `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
      paymentGateway: 'Razorpay',
    };
    
    return {
      success: true,
      bookings,
      payment,
    };
  } catch (error) {
    return {
      success: false,
      bookings: [],
      payment: {
        amount: 0,
        currency: 'INR',
        method: request.paymentInfo.method,
        status: 'failed',
        transactionId: '',
        paymentGateway: 'Razorpay',
      },
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

// Get booking status
export async function getBookingStatus(bookingId: string): Promise<EMTBooking | null> {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // In production, this would query the actual EMT system
  return mockEMTInventory.find(booking => booking.id === bookingId) || null;
}

// Cancel booking
export async function cancelBooking(
  bookingId: string,
  reason: string
): Promise<{ success: boolean; refundAmount?: number; error?: string }> {
  try {
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const booking = mockEMTInventory.find(b => b.id === bookingId);
    if (!booking) {
      throw new Error('Booking not found');
    }
    
    // Calculate refund based on cancellation policy
    const refundAmount = booking.price * 0.8; // 80% refund
    
    return {
      success: true,
      refundAmount,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

// Generate booking confirmation
export async function generateBookingConfirmation(bookings: EMTBooking[]): Promise<string> {
  const confirmationDetails = bookings.map(booking => `
    ${booking.type.toUpperCase()}: ${booking.name}
    Location: ${booking.location}
    Date: ${booking.date}
    ${booking.time ? `Time: ${booking.time}` : ''}
    Price: ₹${booking.price}
    Confirmation: ${booking.confirmationNumber}
    Status: ${booking.status}
  `).join('\n');
  
  return `
BOOKING CONFIRMATION
===================
${confirmationDetails}

Total Amount: ₹${bookings.reduce((sum, booking) => sum + booking.price, 0)}

Thank you for choosing our travel services!
  `.trim();
}
