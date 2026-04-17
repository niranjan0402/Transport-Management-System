import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { Car, Calendar, Route, DollarSign, TrendingUp } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { vehicles, bookings, trips, payments } = useData();

  const getStats = () => {
    if (user?.role === 'admin') {
      return [
        {
          label: 'Total Vehicles',
          value: vehicles.length,
          icon: Car,
          color: 'bg-blue-500',
          change: '+2 this month',
        },
        {
          label: 'Active Bookings',
          value: bookings.filter((b) => b.status === 'confirmed' || b.status === 'in-progress').length,
          icon: Calendar,
          color: 'bg-green-500',
          change: '+5 today',
        },
        {
          label: 'Total Trips',
          value: trips.length,
          icon: Route,
          color: 'bg-purple-500',
          change: '+12 this week',
        },
        {
          label: 'Revenue',
          value: `$${payments.filter((p) => p.status === 'completed').reduce((sum, p) => sum + p.amount, 0)}`,
          icon: DollarSign,
          color: 'bg-yellow-500',
          change: '+15% from last month',
        },
      ];
    } else if (user?.role === 'driver') {
      const myTrips = trips.filter((t) => t.driverId === user.id);
      return [
        {
          label: 'My Trips',
          value: myTrips.length,
          icon: Route,
          color: 'bg-blue-500',
          change: '3 in progress',
        },
        {
          label: 'Completed Today',
          value: myTrips.filter((t) => t.status === 'completed').length,
          icon: TrendingUp,
          color: 'bg-green-500',
          change: 'Great job!',
        },
        {
          label: 'Distance Covered',
          value: `${myTrips.reduce((sum, t) => sum + t.distance, 0).toFixed(1)} km`,
          icon: Car,
          color: 'bg-purple-500',
          change: 'This week',
        },
      ];
    } else {
      const myBookings = bookings.filter((b) => b.customerId === user?.id);
      return [
        {
          label: 'My Bookings',
          value: myBookings.length,
          icon: Calendar,
          color: 'bg-blue-500',
          change: '2 upcoming',
        },
        {
          label: 'Active Trips',
          value: myBookings.filter((b) => b.status === 'in-progress').length,
          icon: Route,
          color: 'bg-green-500',
          change: 'Track now',
        },
        {
          label: 'Total Spent',
          value: `$${myBookings.reduce((sum, b) => sum + b.totalAmount, 0)}`,
          icon: DollarSign,
          color: 'bg-purple-500',
          change: 'All time',
        },
      ];
    }
  };

  const stats = getStats();

  const recentActivity = () => {
    if (user?.role === 'admin') {
      return bookings.slice(0, 5).map((booking) => ({
        id: booking.id,
        title: `Booking #${booking.id}`,
        description: `${booking.pickupLocation} → ${booking.dropoffLocation}`,
        status: booking.status,
        time: new Date(booking.createdAt).toLocaleString(),
      }));
    } else if (user?.role === 'driver') {
      return trips
        .filter((t) => t.driverId === user.id)
        .slice(0, 5)
        .map((trip) => ({
          id: trip.id,
          title: `Trip #${trip.id}`,
          description: `${trip.startLocation} → ${trip.endLocation}`,
          status: trip.status,
          time: new Date(trip.startTime).toLocaleString(),
        }));
    } else {
      return bookings
        .filter((b) => b.customerId === user?.id)
        .slice(0, 5)
        .map((booking) => ({
          id: booking.id,
          title: `Booking #${booking.id}`,
          description: `${booking.pickupLocation} → ${booking.dropoffLocation}`,
          status: booking.status,
          time: new Date(booking.createdAt).toLocaleString(),
        }));
    }
  };

  const activities = recentActivity();

  const getStatusColor = (status: string) => {
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

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">
          Welcome back, {user?.name}!
        </h2>
        <p className="text-gray-600">Here's what's happening with your transport system today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-sm text-gray-600 mb-2">{stat.label}</div>
              <div className="text-xs text-green-600">{stat.change}</div>
            </div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {activities.length > 0 ? (
            activities.map((activity) => (
              <div key={activity.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{activity.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                      activity.status
                    )}`}
                  >
                    {activity.status}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="p-6 text-center text-gray-500">No recent activity</div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      {user?.role === 'customer' && (
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
          <h3 className="text-xl font-semibold mb-2">Ready for your next trip?</h3>
          <p className="text-indigo-100 mb-4">Book a vehicle now and enjoy a comfortable ride.</p>
          <button className="bg-white text-indigo-600 px-6 py-2 rounded-lg font-semibold hover:bg-indigo-50 transition-colors">
            Book Now
          </button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
