import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Car,
  Calendar,
  Route,
  MapPin,
  CreditCard,
  FileText,
  LogOut,
  Menu,
  X,
  Truck,
  Users,
} from 'lucide-react';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getNavItems = () => {
    const baseItems = [
      { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    ];

    if (user?.role === 'admin') {
      return [
        ...baseItems,
        { path: '/users', icon: Users, label: 'Users' },
        { path: '/vehicles', icon: Car, label: 'Vehicles' },
        { path: '/bookings', icon: Calendar, label: 'Bookings' },
        { path: '/trips', icon: Route, label: 'Trips' },
        { path: '/tracking', icon: MapPin, label: 'Tracking' },
        { path: '/payments', icon: CreditCard, label: 'Payments' },
        { path: '/reports', icon: FileText, label: 'Reports' },
      ];
    } else if (user?.role === 'driver') {
      return [
        ...baseItems,
        { path: '/my-trips', icon: Route, label: 'My Trips' },
        { path: '/tracking', icon: MapPin, label: 'Tracking' },
      ];
    } else {
      return [
        ...baseItems,
        { path: '/bookings', icon: Calendar, label: 'My Bookings' },
        { path: '/tracking', icon: MapPin, label: 'Track Trips' },
        { path: '/payments', icon: CreditCard, label: 'Payments' },
      ];
    }
  };

  const navItems = getNavItems();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-indigo-900 text-white transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <div className="flex items-center justify-between p-6 border-b border-indigo-800">
          <div className="flex items-center gap-3">
            <Truck className="w-8 h-8" />
            <span className="font-bold text-lg">TMS</span>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 border-b border-indigo-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-700 rounded-full flex items-center justify-center">
              {user?.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="font-semibold">{user?.name}</div>
              <div className="text-xs text-indigo-300 capitalize">{user?.role}</div>
            </div>
          </div>
        </div>

        <nav className="p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-indigo-700 text-white'
                    : 'text-indigo-200 hover:bg-indigo-800 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-indigo-800">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-indigo-200 hover:bg-indigo-800 hover:text-white transition-colors w-full"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:ml-64">
        {/* Top bar */}
        <header className="bg-white shadow-sm sticky top-0 z-30">
          <div className="flex items-center justify-between px-6 py-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-600 hover:text-gray-900"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-semibold text-gray-800">
              Transport Management System
            </h1>
            <div className="text-sm text-gray-600">
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
