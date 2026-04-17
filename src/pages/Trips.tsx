import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { Trip } from '../types';
import { MapPin, Clock, Navigation, CheckCircle, XCircle } from 'lucide-react';
import { format } from 'date-fns';

const Trips: React.FC = () => {
  const { trips, vehicles, updateTrip } = useData();
  const { user } = useAuth();
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const displayTrips = user?.role === 'driver'
    ? trips.filter((t) => t.driverId === user.id)
    : trips;

  const filteredTrips = filterStatus === 'all'
    ? displayTrips
    : displayTrips.filter((t) => t.status === filterStatus);

  const updateTripStatus = (tripId: string, status: Trip['status']) => {
    const updates: Partial<Trip> = { status };
    
    if (status === 'in-progress' && !trips.find(t => t.id === tripId)?.startTime) {
      updates.startTime = new Date();
    }
    
    if (status === 'completed') {
      updates.endTime = new Date();
    }
    
    updateTrip(tripId, updates);
  };

  const updateLocation = (tripId: string) => {
    // Simulate location update
    const randomLat = 40.7128 + (Math.random() - 0.5) * 0.1;
    const randomLng = -74.0060 + (Math.random() - 0.5) * 0.1;
    
    updateTrip(tripId, {
      currentLocation: {
        lat: randomLat,
        lng: randomLng,
        timestamp: new Date(),
      },
    });
  };

  const getStatusColor = (status: Trip['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'scheduled':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">
          {user?.role === 'driver' ? 'My Trips' : 'All Trips'}
        </h2>
      </div>

      {/* Filter */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex gap-2 flex-wrap">
          {['all', 'scheduled', 'in-progress', 'completed', 'cancelled'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-lg transition-colors capitalize ${
                filterStatus === status
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Trips Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredTrips.map((trip) => {
          const vehicle = vehicles.find((v) => v.id === trip.vehicleId);
          
          return (
            <div key={trip.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-4 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">Trip #{trip.id}</h3>
                    <p className="text-sm text-indigo-100">Booking #{trip.bookingId}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(trip.status)}`}>
                    {trip.status}
                  </span>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-600">Start Location</p>
                    <p className="font-medium text-gray-900">{trip.startLocation}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-600">End Location</p>
                    <p className="font-medium text-gray-900">{trip.endLocation}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-600">Start Time</p>
                      <p className="text-sm font-medium">
                        {format(new Date(trip.startTime), 'MMM dd, HH:mm')}
                      </p>
                    </div>
                  </div>
                  {trip.endTime && (
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-600">End Time</p>
                        <p className="text-sm font-medium">
                          {format(new Date(trip.endTime), 'MMM dd, HH:mm')}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div>
                    <p className="text-sm text-gray-600">Vehicle</p>
                    <p className="font-medium">{vehicle?.model || 'N/A'}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Distance</p>
                    <p className="font-medium">{trip.distance} km</p>
                  </div>
                </div>

                {trip.currentLocation && (
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Navigation className="w-4 h-4 text-blue-600" />
                      <p className="text-sm font-medium text-blue-900">Current Location</p>
                    </div>
                    <p className="text-xs text-blue-700">
                      Lat: {trip.currentLocation.lat.toFixed(4)}, Lng: {trip.currentLocation.lng.toFixed(4)}
                    </p>
                    <p className="text-xs text-blue-600 mt-1">
                      Updated: {format(new Date(trip.currentLocation.timestamp), 'HH:mm:ss')}
                    </p>
                  </div>
                )}

                {user?.role === 'driver' && (
                  <div className="flex gap-2 pt-2">
                    {trip.status === 'scheduled' && (
                      <button
                        onClick={() => updateTripStatus(trip.id, 'in-progress')}
                        className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                      >
                        <Navigation className="w-4 h-4" />
                        Start Trip
                      </button>
                    )}
                    
                    {trip.status === 'in-progress' && (
                      <>
                        <button
                          onClick={() => updateLocation(trip.id)}
                          className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
                        >
                          <MapPin className="w-4 h-4" />
                          Update Location
                        </button>
                        <button
                          onClick={() => updateTripStatus(trip.id, 'completed')}
                          className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Complete
                        </button>
                      </>
                    )}
                    
                    {(trip.status === 'scheduled' || trip.status === 'in-progress') && (
                      <button
                        onClick={() => updateTripStatus(trip.id, 'cancelled')}
                        className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
                      >
                        <XCircle className="w-4 h-4" />
                        Cancel
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredTrips.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <p className="text-gray-500">No trips found</p>
        </div>
      )}
    </div>
  );
};

export default Trips;
