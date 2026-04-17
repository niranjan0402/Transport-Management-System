import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { MapPin, Navigation, Clock, Car } from 'lucide-react';
import { format } from 'date-fns';

const Tracking: React.FC = () => {
  const { trips, vehicles, bookings } = useData();
  const { user } = useAuth();
  const [selectedTrip, setSelectedTrip] = useState<string>('');

  const activeTrips = trips.filter((t) => {
    if (t.status !== 'in-progress') return false;
    
    if (user?.role === 'driver') {
      return t.driverId === user.id;
    } else if (user?.role === 'customer') {
      const booking = bookings.find((b) => b.id === t.bookingId);
      return booking?.customerId === user.id;
    }
    return true;
  });

  const currentTrip = selectedTrip 
    ? trips.find((t) => t.id === selectedTrip)
    : activeTrips[0];

  const vehicle = currentTrip ? vehicles.find((v) => v.id === currentTrip.vehicleId) : null;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Live Tracking</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trip Selector */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h3 className="font-semibold text-gray-900 mb-4">Active Trips</h3>
            <div className="space-y-2">
              {activeTrips.map((trip) => {
                const tripVehicle = vehicles.find((v) => v.id === trip.vehicleId);
                return (
                  <button
                    key={trip.id}
                    onClick={() => setSelectedTrip(trip.id)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      selectedTrip === trip.id || (!selectedTrip && trip.id === activeTrips[0]?.id)
                        ? 'bg-indigo-50 border-2 border-indigo-600'
                        : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Car className="w-4 h-4 text-indigo-600" />
                      <span className="font-semibold text-sm">Trip #{trip.id}</span>
                    </div>
                    <p className="text-xs text-gray-600">{tripVehicle?.model}</p>
                    <p className="text-xs text-gray-500 mt-1">{trip.distance} km</p>
                  </button>
                );
              })}
            </div>
            
            {activeTrips.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-4">
                No active trips
              </p>
            )}
          </div>

          {/* Trip Details */}
          {currentTrip && (
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="font-semibold text-gray-900 mb-4">Trip Details</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-600 mb-1">Vehicle</p>
                  <p className="font-medium text-sm">{vehicle?.model}</p>
                  <p className="text-xs text-gray-500">{vehicle?.registrationNumber}</p>
                </div>
                
                <div>
                  <p className="text-xs text-gray-600 mb-1">Start Time</p>
                  <p className="text-sm font-medium">
                    {format(new Date(currentTrip.startTime), 'MMM dd, yyyy HH:mm')}
                  </p>
                </div>
                
                <div>
                  <p className="text-xs text-gray-600 mb-1">Distance</p>
                  <p className="text-sm font-medium">{currentTrip.distance} km</p>
                </div>
                
                {currentTrip.currentLocation && (
                  <div className="bg-blue-50 p-3 rounded-lg mt-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Navigation className="w-4 h-4 text-blue-600" />
                      <p className="text-sm font-medium text-blue-900">Last Update</p>
                    </div>
                    <p className="text-xs text-blue-700">
                      {format(new Date(currentTrip.currentLocation.timestamp), 'HH:mm:ss')}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Map View */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden h-[600px]">
            {currentTrip ? (
              <div className="h-full flex flex-col">
                {/* Route Info Header */}
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 text-white">
                  <div className="flex items-start gap-3 mb-4">
                    <MapPin className="w-6 h-6 text-green-300 mt-1 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm text-indigo-100 mb-1">From</p>
                      <p className="font-semibold">{currentTrip.startLocation}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <MapPin className="w-6 h-6 text-red-300 mt-1 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm text-indigo-100 mb-1">To</p>
                      <p className="font-semibold">{currentTrip.endLocation}</p>
                    </div>
                  </div>
                </div>

                {/* Map Placeholder */}
                <div className="flex-1 bg-gray-100 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="inline-flex items-center justify-center w-24 h-24 bg-white rounded-full shadow-lg mb-4">
                        <MapPin className="w-12 h-12 text-indigo-600 animate-pulse" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">Live Tracking</h3>
                      {currentTrip.currentLocation ? (
                        <div className="space-y-2">
                          <p className="text-sm text-gray-600">Current Position</p>
                          <div className="bg-white rounded-lg shadow-sm p-4 inline-block">
                            <p className="text-sm font-mono text-gray-700">
                              Lat: {currentTrip.currentLocation.lat.toFixed(6)}
                            </p>
                            <p className="text-sm font-mono text-gray-700">
                              Lng: {currentTrip.currentLocation.lng.toFixed(6)}
                            </p>
                            <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                              <Clock className="w-3 h-3" />
                              {format(new Date(currentTrip.currentLocation.timestamp), 'HH:mm:ss')}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-600">Waiting for location update...</p>
                      )}
                      
                      <div className="mt-6 text-xs text-gray-500">
                        <p>Map visualization would be displayed here</p>
                        <p className="mt-1">Integration with Google Maps or Mapbox</p>
                      </div>
                    </div>
                  </div>

                  {/* Decorative Grid */}
                  <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <div className="grid grid-cols-8 grid-rows-6 h-full">
                      {Array.from({ length: 48 }).map((_, i) => (
                        <div key={i} className="border border-gray-400" />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Status Bar */}
                <div className="bg-gray-50 border-t border-gray-200 px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm font-medium text-gray-700">Trip In Progress</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>{currentTrip.distance} km</span>
                      <span>•</span>
                      <span>ETA: ~{Math.round(currentTrip.distance / 60 * 60)} min</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center bg-gray-50">
                <div className="text-center text-gray-500">
                  <MapPin className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-medium">No Active Trip Selected</p>
                  <p className="text-sm mt-2">Select a trip from the list to track</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tracking;
