import React from 'react';
import { Users as UsersIcon, Shield, Truck, User } from 'lucide-react';

const Users: React.FC = () => {
  const demoUsers = [
    {
      id: '1',
      name: 'Admin User',
      email: 'admin@tms.com',
      phone: '+1234567890',
      role: 'admin',
      status: 'active',
    },
    {
      id: '2',
      name: 'John Driver',
      email: 'driver@tms.com',
      phone: '+1234567891',
      role: 'driver',
      status: 'active',
    },
    {
      id: '3',
      name: 'Jane Customer',
      email: 'customer@tms.com',
      phone: '+1234567892',
      role: 'customer',
      status: 'active',
    },
  ];

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Shield className="w-5 h-5 text-purple-600" />;
      case 'driver':
        return <Truck className="w-5 h-5 text-blue-600" />;
      case 'customer':
        return <User className="w-5 h-5 text-green-600" />;
      default:
        return <User className="w-5 h-5 text-gray-600" />;
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-800';
      case 'driver':
        return 'bg-blue-100 text-blue-800';
      case 'customer':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2">
          <UsersIcon className="w-5 h-5" />
          Add User
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{demoUsers.length}</p>
            </div>
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
              <UsersIcon className="w-6 h-6 text-indigo-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Drivers</p>
              <p className="text-2xl font-bold text-gray-900">
                {demoUsers.filter((u) => u.role === 'driver').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Truck className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Customers</p>
              <p className="text-2xl font-bold text-gray-900">
                {demoUsers.filter((u) => u.role === 'customer').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <User className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {demoUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                        {getRoleIcon(user.role)}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{user.name}</div>
                        <div className="text-xs text-gray-500">ID: {user.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.phone}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getRoleBadgeColor(
                        user.role
                      )}`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800 capitalize">
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button className="text-indigo-600 hover:text-indigo-700 font-medium mr-3">Edit</button>
                    <button className="text-red-600 hover:text-red-700 font-medium">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Users;
