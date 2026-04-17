import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Vehicles from './pages/Vehicles';
import Bookings from './pages/Bookings';
import Trips from './pages/Trips';
import Tracking from './pages/Tracking';
import Payments from './pages/Payments';
import Reports from './pages/Reports';

const AppRoutes: React.FC = () => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  }

  return (
    <Layout>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        
        {/* Admin routes */}
        {user?.role === 'admin' && (
          <>
            <Route path="/users" element={<Users />} />
            <Route path="/vehicles" element={<Vehicles />} />
            <Route path="/bookings" element={<Bookings />} />
            <Route path="/trips" element={<Trips />} />
            <Route path="/tracking" element={<Tracking />} />
            <Route path="/payments" element={<Payments />} />
            <Route path="/reports" element={<Reports />} />
          </>
        )}
        
        {/* Driver routes */}
        {user?.role === 'driver' && (
          <>
            <Route path="/my-trips" element={<Trips />} />
            <Route path="/tracking" element={<Tracking />} />
          </>
        )}
        
        {/* Customer routes */}
        {user?.role === 'customer' && (
          <>
            <Route path="/bookings" element={<Bookings />} />
            <Route path="/tracking" element={<Tracking />} />
            <Route path="/payments" element={<Payments />} />
          </>
        )}
        
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Layout>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <DataProvider>
          <AppRoutes />
        </DataProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
