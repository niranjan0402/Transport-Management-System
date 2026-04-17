import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { LogIn, Truck, User, Shield } from 'lucide-react';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('customer');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const success = login(email, password, role);
    if (success) {
      navigate('/dashboard');
    } else {
      setError('Invalid credentials. Please try again.');
    }
  };

  const demoCredentials = [
    { role: 'admin', email: 'admin@tms.com', password: 'admin123' },
    { role: 'driver', email: 'driver@tms.com', password: 'driver123' },
    { role: 'customer', email: 'customer@tms.com', password: 'customer123' },
  ];

  const fillDemo = (demoRole: UserRole) => {
    const demo = demoCredentials.find((d) => d.role === demoRole);
    if (demo) {
      setEmail(demo.email);
      setPassword(demo.password);
      setRole(demoRole);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-full mb-4">
            <Truck className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Transport Management System</h1>
          <p className="text-gray-600 mt-2">Sign in to your account</p>
        </div>

        <div className="bg-white rounded-lg shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Role
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setRole('admin')}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    role === 'admin'
                      ? 'border-indigo-600 bg-indigo-50'
                      : 'border-gray-200 hover:border-indigo-300'
                  }`}
                >
                  <Shield className={`w-6 h-6 mx-auto ${role === 'admin' ? 'text-indigo-600' : 'text-gray-400'}`} />
                  <span className={`text-xs mt-1 block ${role === 'admin' ? 'text-indigo-600 font-semibold' : 'text-gray-600'}`}>
                    Admin
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole('driver')}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    role === 'driver'
                      ? 'border-indigo-600 bg-indigo-50'
                      : 'border-gray-200 hover:border-indigo-300'
                  }`}
                >
                  <Truck className={`w-6 h-6 mx-auto ${role === 'driver' ? 'text-indigo-600' : 'text-gray-400'}`} />
                  <span className={`text-xs mt-1 block ${role === 'driver' ? 'text-indigo-600 font-semibold' : 'text-gray-600'}`}>
                    Driver
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole('customer')}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    role === 'customer'
                      ? 'border-indigo-600 bg-indigo-50'
                      : 'border-gray-200 hover:border-indigo-300'
                  }`}
                >
                  <User className={`w-6 h-6 mx-auto ${role === 'customer' ? 'text-indigo-600' : 'text-gray-400'}`} />
                  <span className={`text-xs mt-1 block ${role === 'customer' ? 'text-indigo-600 font-semibold' : 'text-gray-600'}`}>
                    Customer
                  </span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Enter your password"
                required
              />
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
            >
              <LogIn className="w-5 h-5" />
              Sign In
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-600 mb-3 text-center">Demo Credentials:</p>
            <div className="grid grid-cols-3 gap-2">
              {demoCredentials.map((demo) => (
                <button
                  key={demo.role}
                  onClick={() => fillDemo(demo.role as UserRole)}
                  className="text-xs px-2 py-2 bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                >
                  {demo.role.charAt(0).toUpperCase() + demo.role.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
