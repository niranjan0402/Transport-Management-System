// User Types
export type UserRole = 'admin' | 'driver' | 'customer';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  password: string;
  status: 'active' | 'inactive';
  createdAt: Date;
}

// Vehicle Types
export interface Vehicle {
  id: string;
  registrationNumber: string;
  model: string;
  type: 'sedan' | 'suv' | 'van' | 'truck' | 'bus';
  capacity: number;
  status: 'available' | 'in-use' | 'maintenance';
  driverId?: string;
  fuelType: 'petrol' | 'diesel' | 'electric' | 'hybrid';
  yearOfManufacture: number;
  lastServiceDate: Date;
  mileage: number;
}

// Booking Types
export interface Booking {
  id: string;
  customerId: string;
  vehicleId: string;
  pickupLocation: string;
  dropoffLocation: string;
  pickupDate: Date;
  dropoffDate: Date;
  status: 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';
  totalAmount: number;
  createdAt: Date;
}

// Trip Types
export interface Trip {
  id: string;
  bookingId: string;
  driverId: string;
  vehicleId: string;
  startLocation: string;
  endLocation: string;
  startTime: Date;
  endTime?: Date;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  distance: number;
  currentLocation?: {
    lat: number;
    lng: number;
    timestamp: Date;
  };
  route?: Array<{ lat: number; lng: number }>;
}

// Payment Types
export interface Payment {
  id: string;
  bookingId: string;
  customerId: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentMethod: 'razorpay' | 'cash' | 'card';
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  transactionDate: Date;
}

// Report Types
export interface TripReport {
  totalTrips: number;
  completedTrips: number;
  inProgressTrips: number;
  cancelledTrips: number;
  totalDistance: number;
  averageDistance: number;
}

export interface RevenueReport {
  totalRevenue: number;
  pendingPayments: number;
  completedPayments: number;
  refundedAmount: number;
  monthlyRevenue: Array<{ month: string; revenue: number }>;
}

export interface VehicleUsageReport {
  vehicleId: string;
  vehicleName: string;
  totalTrips: number;
  totalDistance: number;
  utilizationRate: number;
  maintenanceCost: number;
}
