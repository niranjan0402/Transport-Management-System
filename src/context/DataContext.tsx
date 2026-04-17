import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Vehicle, Booking, Trip, Payment } from '../types';

interface DataContextType {
  vehicles: Vehicle[];
  bookings: Booking[];
  trips: Trip[];
  payments: Payment[];
  addVehicle: (vehicle: Omit<Vehicle, 'id'>) => void;
  updateVehicle: (id: string, vehicle: Partial<Vehicle>) => void;
  deleteVehicle: (id: string) => void;
  addBooking: (booking: Omit<Booking, 'id' | 'createdAt'>) => string;
  updateBooking: (id: string, booking: Partial<Booking>) => void;
  addTrip: (trip: Omit<Trip, 'id'>) => void;
  updateTrip: (id: string, trip: Partial<Trip>) => void;
  addPayment: (payment: Omit<Payment, 'id'>) => void;
  updatePayment: (id: string, payment: Partial<Payment>) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Initial demo data
const initialVehicles: Vehicle[] = [
  {
    id: '1',
    registrationNumber: 'ABC-1234',
    model: 'Toyota Camry',
    type: 'sedan',
    capacity: 4,
    status: 'available',
    fuelType: 'petrol',
    yearOfManufacture: 2022,
    lastServiceDate: new Date('2024-01-15'),
    mileage: 15000,
  },
  {
    id: '2',
    registrationNumber: 'XYZ-5678',
    model: 'Ford Transit',
    type: 'van',
    capacity: 12,
    status: 'available',
    fuelType: 'diesel',
    yearOfManufacture: 2021,
    lastServiceDate: new Date('2024-02-20'),
    mileage: 25000,
  },
  {
    id: '3',
    registrationNumber: 'DEF-9012',
    model: 'Tesla Model X',
    type: 'suv',
    capacity: 6,
    status: 'in-use',
    driverId: '2',
    fuelType: 'electric',
    yearOfManufacture: 2023,
    lastServiceDate: new Date('2024-03-10'),
    mileage: 8000,
  },
];

const initialBookings: Booking[] = [
  {
    id: '1',
    customerId: '3',
    vehicleId: '3',
    pickupLocation: '123 Main St, New York',
    dropoffLocation: '456 Park Ave, New York',
    pickupDate: new Date('2024-03-15T10:00:00'),
    dropoffDate: new Date('2024-03-15T14:00:00'),
    status: 'in-progress',
    totalAmount: 150,
    createdAt: new Date('2024-03-14'),
  },
  {
    id: '2',
    customerId: '3',
    vehicleId: '1',
    pickupLocation: '789 Broadway, New York',
    dropoffLocation: '321 Fifth Ave, New York',
    pickupDate: new Date('2024-03-20T09:00:00'),
    dropoffDate: new Date('2024-03-20T12:00:00'),
    status: 'confirmed',
    totalAmount: 100,
    createdAt: new Date('2024-03-14'),
  },
];

const initialTrips: Trip[] = [
  {
    id: '1',
    bookingId: '1',
    driverId: '2',
    vehicleId: '3',
    startLocation: '123 Main St, New York',
    endLocation: '456 Park Ave, New York',
    startTime: new Date('2024-03-15T10:00:00'),
    status: 'in-progress',
    distance: 15.5,
    currentLocation: {
      lat: 40.7589,
      lng: -73.9851,
      timestamp: new Date(),
    },
  },
];

const initialPayments: Payment[] = [
  {
    id: '1',
    bookingId: '1',
    customerId: '3',
    amount: 150,
    status: 'pending',
    paymentMethod: 'razorpay',
    transactionDate: new Date('2024-03-15'),
  },
];

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [vehicles, setVehicles] = useState<Vehicle[]>(() => {
    const stored = localStorage.getItem('tms_vehicles');
    return stored ? JSON.parse(stored) : initialVehicles;
  });

  const [bookings, setBookings] = useState<Booking[]>(() => {
    const stored = localStorage.getItem('tms_bookings');
    return stored ? JSON.parse(stored) : initialBookings;
  });

  const [trips, setTrips] = useState<Trip[]>(() => {
    const stored = localStorage.getItem('tms_trips');
    return stored ? JSON.parse(stored) : initialTrips;
  });

  const [payments, setPayments] = useState<Payment[]>(() => {
    const stored = localStorage.getItem('tms_payments');
    return stored ? JSON.parse(stored) : initialPayments;
  });

  useEffect(() => {
    localStorage.setItem('tms_vehicles', JSON.stringify(vehicles));
  }, [vehicles]);

  useEffect(() => {
    localStorage.setItem('tms_bookings', JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem('tms_trips', JSON.stringify(trips));
  }, [trips]);

  useEffect(() => {
    localStorage.setItem('tms_payments', JSON.stringify(payments));
  }, [payments]);

  const addVehicle = (vehicle: Omit<Vehicle, 'id'>) => {
    const newVehicle = { ...vehicle, id: Date.now().toString() };
    setVehicles([...vehicles, newVehicle]);
  };

  const updateVehicle = (id: string, vehicle: Partial<Vehicle>) => {
    setVehicles(vehicles.map((v) => (v.id === id ? { ...v, ...vehicle } : v)));
  };

  const deleteVehicle = (id: string) => {
    setVehicles(vehicles.filter((v) => v.id !== id));
  };

  const addBooking = (booking: Omit<Booking, 'id' | 'createdAt'>): string => {
    const newBooking = {
      ...booking,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    setBookings([...bookings, newBooking]);
    return newBooking.id;
  };

  const updateBooking = (id: string, booking: Partial<Booking>) => {
    setBookings(bookings.map((b) => (b.id === id ? { ...b, ...booking } : b)));
  };

  const addTrip = (trip: Omit<Trip, 'id'>) => {
    const newTrip = { ...trip, id: Date.now().toString() };
    setTrips([...trips, newTrip]);
  };

  const updateTrip = (id: string, trip: Partial<Trip>) => {
    setTrips(trips.map((t) => (t.id === id ? { ...t, ...trip } : t)));
  };

  const addPayment = (payment: Omit<Payment, 'id'>) => {
    const newPayment = { ...payment, id: Date.now().toString() };
    setPayments([...payments, newPayment]);
  };

  const updatePayment = (id: string, payment: Partial<Payment>) => {
    setPayments(payments.map((p) => (p.id === id ? { ...p, ...payment } : p)));
  };

  return (
    <DataContext.Provider
      value={{
        vehicles,
        bookings,
        trips,
        payments,
        addVehicle,
        updateVehicle,
        deleteVehicle,
        addBooking,
        updateBooking,
        addTrip,
        updateTrip,
        addPayment,
        updatePayment,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
