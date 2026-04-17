import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Vehicle } from '../types';
import { Plus, Edit2, Trash2, Search, X } from 'lucide-react';

const Vehicles: React.FC = () => {
  const { vehicles, addVehicle, updateVehicle, deleteVehicle } = useData();
  const [showModal, setShowModal] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    registrationNumber: '',
    model: '',
    type: 'sedan' as Vehicle['type'],
    capacity: 4,
    status: 'available' as Vehicle['status'],
    fuelType: 'petrol' as Vehicle['fuelType'],
    yearOfManufacture: new Date().getFullYear(),
    lastServiceDate: new Date().toISOString().split('T')[0],
    mileage: 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingVehicle) {
      updateVehicle(editingVehicle.id, {
        ...formData,
        lastServiceDate: new Date(formData.lastServiceDate),
      });
    } else {
      addVehicle({
        ...formData,
        lastServiceDate: new Date(formData.lastServiceDate),
      });
    }
    
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      registrationNumber: '',
      model: '',
      type: 'sedan',
      capacity: 4,
      status: 'available',
      fuelType: 'petrol',
      yearOfManufacture: new Date().getFullYear(),
      lastServiceDate: new Date().toISOString().split('T')[0],
      mileage: 0,
    });
    setEditingVehicle(null);
    setShowModal(false);
  };

  const handleEdit = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setFormData({
      registrationNumber: vehicle.registrationNumber,
      model: vehicle.model,
      type: vehicle.type,
      capacity: vehicle.capacity,
      status: vehicle.status,
      fuelType: vehicle.fuelType,
      yearOfManufacture: vehicle.yearOfManufacture,
      lastServiceDate: new Date(vehicle.lastServiceDate).toISOString().split('T')[0],
      mileage: vehicle.mileage,
    });
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this vehicle?')) {
      deleteVehicle(id);
    }
  };

  const filteredVehicles = vehicles.filter(
    (vehicle) =>
      vehicle.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.model.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: Vehicle['status']) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'in-use':
        return 'bg-blue-100 text-blue-800';
      case 'maintenance':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Vehicle Management</h2>
        <button
          onClick={() => setShowModal(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Vehicle
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by registration number or model..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Vehicles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVehicles.map((vehicle) => (
          <div key={vehicle.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{vehicle.model}</h3>
                  <p className="text-sm text-gray-600">{vehicle.registrationNumber}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(vehicle.status)}`}>
                  {vehicle.status}
                </span>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Type:</span>
                  <span className="font-medium capitalize">{vehicle.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Capacity:</span>
                  <span className="font-medium">{vehicle.capacity} passengers</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Fuel Type:</span>
                  <span className="font-medium capitalize">{vehicle.fuelType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Mileage:</span>
                  <span className="font-medium">{vehicle.mileage.toLocaleString()} km</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Year:</span>
                  <span className="font-medium">{vehicle.yearOfManufacture}</span>
                </div>
              </div>

              <div className="flex gap-2 mt-4 pt-4 border-t border-gray-200">
                <button
                  onClick={() => handleEdit(vehicle)}
                  className="flex-1 bg-indigo-50 text-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-100 transition-colors flex items-center justify-center gap-2"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(vehicle.id)}
                  className="flex-1 bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredVehicles.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <p className="text-gray-500">No vehicles found</p>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">
                {editingVehicle ? 'Edit Vehicle' : 'Add New Vehicle'}
              </h3>
              <button onClick={resetForm} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Registration Number *
                  </label>
                  <input
                    type="text"
                    value={formData.registrationNumber}
                    onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Model *</label>
                  <input
                    type="text"
                    value={formData.model}
                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type *</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as Vehicle['type'] })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="sedan">Sedan</option>
                    <option value="suv">SUV</option>
                    <option value="van">Van</option>
                    <option value="truck">Truck</option>
                    <option value="bus">Bus</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status *</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as Vehicle['status'] })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="available">Available</option>
                    <option value="in-use">In Use</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Capacity *</label>
                  <input
                    type="number"
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    min="1"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Fuel Type *</label>
                  <select
                    value={formData.fuelType}
                    onChange={(e) => setFormData({ ...formData, fuelType: e.target.value as Vehicle['fuelType'] })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="petrol">Petrol</option>
                    <option value="diesel">Diesel</option>
                    <option value="electric">Electric</option>
                    <option value="hybrid">Hybrid</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Year of Manufacture *</label>
                  <input
                    type="number"
                    value={formData.yearOfManufacture}
                    onChange={(e) => setFormData({ ...formData, yearOfManufacture: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    min="1900"
                    max={new Date().getFullYear()}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mileage (km) *</label>
                  <input
                    type="number"
                    value={formData.mileage}
                    onChange={(e) => setFormData({ ...formData, mileage: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    min="0"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Last Service Date *</label>
                  <input
                    type="date"
                    value={formData.lastServiceDate}
                    onChange={(e) => setFormData({ ...formData, lastServiceDate: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    required
                  />
                </div>
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
                  {editingVehicle ? 'Update Vehicle' : 'Add Vehicle'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Vehicles;
