import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { Booking } from '../types';
import { Plus, Calendar, MapPin, X } from 'lucide-react';
import { format } from 'date-fns';

const Bookings: React.FC = () => {
  const { bookings, vehicles, addBooking, updateBooking } = useData();
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [formData, setFormData] = useState({
    vehicleId: '',
    pickupLocation: '',
    dropoffLocation: '',
    pickupDate: '',
    dropoffDate: '',
    totalAmount: 100,
  });

  const displayBookings = user?.role === 'admin'
    ? bookings
    : bookings.filter((b) => b.customerId === user?.id);

  const filteredBookings = filterStatus === 'all'
    ? displayBookings
    : displayBookings.filter((b) => b.status === filterStatus);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    addBooking({
      customerId: user?.id || '3',
      vehicleId: formData.vehicleId,
      pickupLocation: formData.pickupLocation,
      dropoffLocation: formData.dropoffLocation,
      pickupDate: new Date(formData.pickupDate),
      dropoffDate: new Date(formData.dropoffDate),
      status: 'pending',
      totalAmount: formData.totalAmount,
    });
    
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      vehicleId: '',
      pickupLocation: '',
      dropoffLocation: '',
      pickupDate: '',
      dropoffDate: '',
      totalAmount: 100,
    });
    setShowModal(false);
  };

  const updateStatus = (id: string, status: Booking['status']) => {
    updateBooking(id, { status });
  };

  const getStatusColor = (status: Booking['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'confirmed':
        return 'bg-purple-100 text-purple-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const availableVehicles = vehicles.filter((v) => v.status === 'available');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">
          {user?.role === 'admin' ? 'All Bookings' : 'My Bookings'}
        </h2>
        <button
          onClick={() => setShowModal(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          New Booking
        </button>
      </div>

      {/* Filter */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex gap-2 flex-wrap">
          {['all', 'pending', 'confirmed', 'in-progress', 'completed', 'cancelled'].map((status) => (
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

      {/* Bookings List */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Booking ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vehicle
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Route
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pickup Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                {user?.role === 'admin' && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredBookings.map((booking) => {
                const vehicle = vehicles.find((v) => v.id === booking.vehicleId);
                return (
                  <tr key={booking.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{booking.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {vehicle?.model || 'N/A'}
                      <div className="text-xs text-gray-500">{vehicle?.registrationNumber}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <div className="font-medium">{booking.pickupLocation}</div>
                          <div className="text-gray-500">to {booking.dropoffLocation}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        {format(new Date(booking.pickupDate), 'MMM dd, yyyy HH:mm')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                      ${booking.totalAmount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                    </td>
                    {user?.role === 'admin' && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <select
                          value={booking.status}
                          onChange={(e) => updateStatus(booking.id, e.target.value as Booking['status'])}
                          className="px-2 py-1 border border-gray-300 rounded text-xs focus:ring-2 focus:ring-indigo-500"
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="in-progress">In Progress</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredBookings.length === 0 && (
          <div className="p-12 text-center text-gray-500">
            No bookings found
          </div>
        )}
      </div>

      {/* Add Booking Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">New Booking</h3>
              <button onClick={resetForm} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Vehicle *
                </label>
                <select
                  value={formData.vehicleId}
                  onChange={(e) => setFormData({ ...formData, vehicleId: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                >
                  <option value="">Choose a vehicle</option>
                  {availableVehicles.map((vehicle) => (
                    <option key={vehicle.id} value={vehicle.id}>
                      {vehicle.model} - {vehicle.registrationNumber} ({vehicle.type})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pickup Location *
                </label>
                <input
                  type="text"
                  value={formData.pickupLocation}
                  onChange={(e) => setFormData({ ...formData, pickupLocation: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Enter pickup address"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dropoff Location *
                </label>
                <input
                  type="text"
                  value={formData.dropoffLocation}
                  onChange={(e) => setFormData({ ...formData, dropoffLocation: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Enter dropoff address"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pickup Date & Time *
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.pickupDate}
                    onChange={(e) => setFormData({ ...formData, pickupDate: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dropoff Date & Time *
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.dropoffDate}
                    onChange={(e) => setFormData({ ...formData, dropoffDate: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Total Amount ($) *
                </label>
                <input
                  type="number"
                  value={formData.totalAmount}
                  onChange={(e) => setFormData({ ...formData, totalAmount: parseFloat(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Create Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Bookings;
