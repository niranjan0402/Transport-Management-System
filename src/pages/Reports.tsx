import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { TripReport, RevenueReport, VehicleUsageReport } from '../types';
import { FileText, TrendingUp, Car, Download } from 'lucide-react';

const Reports: React.FC = () => {
  const { trips, payments, vehicles } = useData();
  const [activeTab, setActiveTab] = useState<'trips' | 'revenue' | 'vehicles'>('trips');

  // Trip Report Data
  const tripReport: TripReport = {
    totalTrips: trips.length,
    completedTrips: trips.filter((t) => t.status === 'completed').length,
    inProgressTrips: trips.filter((t) => t.status === 'in-progress').length,
    cancelledTrips: trips.filter((t) => t.status === 'cancelled').length,
    totalDistance: trips.reduce((sum, t) => sum + t.distance, 0),
    averageDistance: trips.length > 0 ? trips.reduce((sum, t) => sum + t.distance, 0) / trips.length : 0,
  };

  // Revenue Report Data
  const getMonthlyRevenue = () => {
    const monthlyData: { [key: string]: number } = {};
    payments
      .filter((p) => p.status === 'completed')
      .forEach((payment) => {
        const month = new Date(payment.transactionDate).toLocaleDateString('en-US', {
          month: 'short',
          year: 'numeric',
        });
        monthlyData[month] = (monthlyData[month] || 0) + payment.amount;
      });
    
    return Object.entries(monthlyData).map(([month, revenue]) => ({ month, revenue }));
  };

  const revenueReport: RevenueReport = {
    totalRevenue: payments.filter((p) => p.status === 'completed').reduce((sum, p) => sum + p.amount, 0),
    pendingPayments: payments.filter((p) => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0),
    completedPayments: payments.filter((p) => p.status === 'completed').reduce((sum, p) => sum + p.amount, 0),
    refundedAmount: payments.filter((p) => p.status === 'refunded').reduce((sum, p) => sum + p.amount, 0),
    monthlyRevenue: getMonthlyRevenue(),
  };

  // Vehicle Usage Report Data
  const vehicleUsageReports: VehicleUsageReport[] = vehicles.map((vehicle) => {
    const vehicleTrips = trips.filter((t) => t.vehicleId === vehicle.id);
    
    return {
      vehicleId: vehicle.id,
      vehicleName: `${vehicle.model} (${vehicle.registrationNumber})`,
      totalTrips: vehicleTrips.length,
      totalDistance: vehicleTrips.reduce((sum, t) => sum + t.distance, 0),
      utilizationRate: vehicleTrips.length > 0 ? (vehicleTrips.length / trips.length) * 100 : 0,
      maintenanceCost: Math.random() * 1000 + 500, // Simulated data
    };
  });

  const downloadReport = () => {
    let reportData = '';
    
    if (activeTab === 'trips') {
      reportData = `Trip Report
Total Trips: ${tripReport.totalTrips}
Completed: ${tripReport.completedTrips}
In Progress: ${tripReport.inProgressTrips}
Cancelled: ${tripReport.cancelledTrips}
Total Distance: ${tripReport.totalDistance.toFixed(2)} km
Average Distance: ${tripReport.averageDistance.toFixed(2)} km`;
    } else if (activeTab === 'revenue') {
      reportData = `Revenue Report
Total Revenue: $${revenueReport.totalRevenue.toFixed(2)}
Completed Payments: $${revenueReport.completedPayments.toFixed(2)}
Pending Payments: $${revenueReport.pendingPayments.toFixed(2)}
Refunded Amount: $${revenueReport.refundedAmount.toFixed(2)}`;
    } else {
      reportData = `Vehicle Usage Report
${vehicleUsageReports.map((v) => `
${v.vehicleName}
- Total Trips: ${v.totalTrips}
- Distance: ${v.totalDistance.toFixed(2)} km
- Utilization: ${v.utilizationRate.toFixed(2)}%
- Maintenance Cost: $${v.maintenanceCost.toFixed(2)}`).join('\n')}`;
    }

    const blob = new Blob([reportData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeTab}-report-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Reports & Analytics</h2>
        <button
          onClick={downloadReport}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
        >
          <Download className="w-5 h-5" />
          Download Report
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="border-b border-gray-200">
          <div className="flex">
            <button
              onClick={() => setActiveTab('trips')}
              className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                activeTab === 'trips'
                  ? 'border-b-2 border-indigo-600 text-indigo-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <FileText className="w-5 h-5" />
                Trip Reports
              </div>
            </button>
            <button
              onClick={() => setActiveTab('revenue')}
              className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                activeTab === 'revenue'
                  ? 'border-b-2 border-indigo-600 text-indigo-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Revenue Reports
              </div>
            </button>
            <button
              onClick={() => setActiveTab('vehicles')}
              className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                activeTab === 'vehicles'
                  ? 'border-b-2 border-indigo-600 text-indigo-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Car className="w-5 h-5" />
                Vehicle Usage
              </div>
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Trip Reports */}
          {activeTab === 'trips' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6">
                  <h3 className="text-sm font-medium text-blue-900 mb-2">Total Trips</h3>
                  <p className="text-3xl font-bold text-blue-900">{tripReport.totalTrips}</p>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6">
                  <h3 className="text-sm font-medium text-green-900 mb-2">Completed</h3>
                  <p className="text-3xl font-bold text-green-900">{tripReport.completedTrips}</p>
                  <p className="text-sm text-green-700 mt-1">
                    {tripReport.totalTrips > 0
                      ? ((tripReport.completedTrips / tripReport.totalTrips) * 100).toFixed(1)
                      : 0}
                    % success rate
                  </p>
                </div>
                <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-6">
                  <h3 className="text-sm font-medium text-yellow-900 mb-2">In Progress</h3>
                  <p className="text-3xl font-bold text-yellow-900">{tripReport.inProgressTrips}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Distance Statistics</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Total Distance</span>
                      <span className="font-semibold text-gray-900">
                        {tripReport.totalDistance.toFixed(2)} km
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Average per Trip</span>
                      <span className="font-semibold text-gray-900">
                        {tripReport.averageDistance.toFixed(2)} km
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Trip Status Breakdown</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Completed</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-500 h-2 rounded-full"
                            style={{
                              width: `${
                                tripReport.totalTrips > 0
                                  ? (tripReport.completedTrips / tripReport.totalTrips) * 100
                                  : 0
                              }%`,
                            }}
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-900 w-12">
                          {tripReport.completedTrips}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">In Progress</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full"
                            style={{
                              width: `${
                                tripReport.totalTrips > 0
                                  ? (tripReport.inProgressTrips / tripReport.totalTrips) * 100
                                  : 0
                              }%`,
                            }}
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-900 w-12">
                          {tripReport.inProgressTrips}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Cancelled</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-red-500 h-2 rounded-full"
                            style={{
                              width: `${
                                tripReport.totalTrips > 0
                                  ? (tripReport.cancelledTrips / tripReport.totalTrips) * 100
                                  : 0
                              }%`,
                            }}
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-900 w-12">
                          {tripReport.cancelledTrips}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Revenue Reports */}
          {activeTab === 'revenue' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6">
                  <h3 className="text-sm font-medium text-green-900 mb-2">Total Revenue</h3>
                  <p className="text-3xl font-bold text-green-900">
                    ${revenueReport.totalRevenue.toFixed(2)}
                  </p>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6">
                  <h3 className="text-sm font-medium text-blue-900 mb-2">Completed</h3>
                  <p className="text-3xl font-bold text-blue-900">
                    ${revenueReport.completedPayments.toFixed(2)}
                  </p>
                </div>
                <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-6">
                  <h3 className="text-sm font-medium text-yellow-900 mb-2">Pending</h3>
                  <p className="text-3xl font-bold text-yellow-900">
                    ${revenueReport.pendingPayments.toFixed(2)}
                  </p>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6">
                  <h3 className="text-sm font-medium text-purple-900 mb-2">Refunded</h3>
                  <p className="text-3xl font-bold text-purple-900">
                    ${revenueReport.refundedAmount.toFixed(2)}
                  </p>
                </div>
              </div>

              {revenueReport.monthlyRevenue.length > 0 && (
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Revenue</h3>
                  <div className="space-y-3">
                    {revenueReport.monthlyRevenue.map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 w-24">{item.month}</span>
                        <div className="flex items-center gap-2 flex-1">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-indigo-500 h-2 rounded-full"
                              style={{
                                width: `${
                                  (item.revenue / Math.max(...revenueReport.monthlyRevenue.map((m) => m.revenue))) *
                                  100
                                }%`,
                              }}
                            />
                          </div>
                          <span className="text-sm font-medium text-gray-900 w-24 text-right">
                            ${item.revenue.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Vehicle Usage Reports */}
          {activeTab === 'vehicles' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {vehicleUsageReports.map((report) => (
                  <div key={report.vehicleId} className="bg-white border border-gray-200 rounded-lg p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">{report.vehicleName}</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Total Trips</span>
                        <span className="font-semibold text-gray-900">{report.totalTrips}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Distance</span>
                        <span className="font-semibold text-gray-900">
                          {report.totalDistance.toFixed(2)} km
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Utilization</span>
                        <span className="font-semibold text-indigo-600">
                          {report.utilizationRate.toFixed(1)}%
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Maintenance</span>
                        <span className="font-semibold text-gray-900">
                          ${report.maintenanceCost.toFixed(2)}
                        </span>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-indigo-500 h-2 rounded-full"
                          style={{ width: `${Math.min(report.utilizationRate, 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reports;
