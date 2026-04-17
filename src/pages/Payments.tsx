import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { Payment } from '../types';
import { CreditCard, DollarSign, CheckCircle, XCircle, Clock } from 'lucide-react';
import { format } from 'date-fns';

// Razorpay type declaration
declare global {
  interface Window {
    Razorpay: any;
  }
}

const Payments: React.FC = () => {
  const { payments, bookings, addPayment, updatePayment } = useData();
  const { user } = useAuth();
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedBooking, setSelectedBooking] = useState<string>('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const displayPayments = user?.role === 'admin'
    ? payments
    : payments.filter((p) => p.customerId === user?.id);

  const filteredPayments = filterStatus === 'all'
    ? displayPayments
    : displayPayments.filter((p) => p.status === filterStatus);

  const pendingBookings = bookings.filter((b) => {
    if (user?.role === 'customer' && b.customerId !== user.id) return false;
    const hasPayment = payments.some((p) => p.bookingId === b.id && p.status !== 'failed');
    return !hasPayment && (b.status === 'confirmed' || b.status === 'in-progress');
  });

  const handleRazorpayPayment = (bookingId: string, amount: number) => {
    // In a real implementation, you would:
    // 1. Create order on your backend
    // 2. Get order ID from Razorpay
    // 3. Open Razorpay checkout
    
    // For demo purposes, we'll simulate the payment
    const orderId = `order_${Date.now()}`;
    
    // Simulate Razorpay payment (in real app, use actual Razorpay SDK)
    const simulatePayment = () => {
      const paymentId = `pay_${Date.now()}`;
      
      addPayment({
        bookingId,
        customerId: user?.id || '3',
        amount,
        status: 'completed',
        paymentMethod: 'razorpay',
        razorpayOrderId: orderId,
        razorpayPaymentId: paymentId,
        transactionDate: new Date(),
      });
      
      setShowPaymentModal(false);
      setSelectedBooking('');
      alert('Payment successful!');
    };

    // Show confirmation
    if (confirm(`Process payment of $${amount} via Razorpay?`)) {
      simulatePayment();
    }
  };

  const handleCashPayment = (bookingId: string, amount: number) => {
    addPayment({
      bookingId,
      customerId: user?.id || '3',
      amount,
      status: 'pending',
      paymentMethod: 'cash',
      transactionDate: new Date(),
    });
    
    setShowPaymentModal(false);
    setSelectedBooking('');
    alert('Cash payment recorded. Please pay the driver.');
  };

  const getStatusColor = (status: Payment['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'refunded':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: Payment['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <DollarSign className="w-5 h-5 text-gray-600" />;
    }
  };

  const totalRevenue = displayPayments
    .filter((p) => p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0);

  const pendingAmount = displayPayments
    .filter((p) => p.status === 'pending')
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Payments & Billing</h2>
        {user?.role === 'customer' && pendingBookings.length > 0 && (
          <button
            onClick={() => setShowPaymentModal(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
          >
            <CreditCard className="w-5 h-5" />
            Make Payment
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">${totalRevenue.toFixed(2)}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Pending Payments</p>
              <p className="text-2xl font-bold text-gray-900">${pendingAmount.toFixed(2)}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Transactions</p>
              <p className="text-2xl font-bold text-gray-900">{displayPayments.length}</p>
            </div>
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-indigo-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex gap-2 flex-wrap">
          {['all', 'completed', 'pending', 'failed', 'refunded'].map((status) => (
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

      {/* Payments List */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Transaction ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Booking ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Method
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
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
              {filteredPayments.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(payment.status)}
                      <span className="text-sm font-medium text-gray-900">#{payment.id}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    #{payment.bookingId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                    ${payment.amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="capitalize text-sm text-gray-600">{payment.paymentMethod}</span>
                    {payment.razorpayPaymentId && (
                      <div className="text-xs text-gray-500 mt-1">
                        {payment.razorpayPaymentId}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {format(new Date(payment.transactionDate), 'MMM dd, yyyy HH:mm')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(payment.status)}`}
                    >
                      {payment.status}
                    </span>
                  </td>
                  {user?.role === 'admin' && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {payment.status === 'pending' && (
                        <button
                          onClick={() => updatePayment(payment.id, { status: 'completed' })}
                          className="text-green-600 hover:text-green-700 font-medium"
                        >
                          Confirm
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredPayments.length === 0 && (
          <div className="p-12 text-center text-gray-500">No payments found</div>
        )}
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">Make Payment</h3>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Booking
                </label>
                <select
                  value={selectedBooking}
                  onChange={(e) => setSelectedBooking(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="">Choose a booking</option>
                  {pendingBookings.map((booking) => (
                    <option key={booking.id} value={booking.id}>
                      Booking #{booking.id} - ${booking.totalAmount}
                    </option>
                  ))}
                </select>
              </div>

              {selectedBooking && (
                <div className="space-y-3">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Amount to Pay</p>
                    <p className="text-2xl font-bold text-gray-900">
                      ${pendingBookings.find((b) => b.id === selectedBooking)?.totalAmount}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <button
                      onClick={() =>
                        handleRazorpayPayment(
                          selectedBooking,
                          pendingBookings.find((b) => b.id === selectedBooking)?.totalAmount || 0
                        )
                      }
                      className="w-full bg-indigo-600 text-white px-4 py-3 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <CreditCard className="w-5 h-5" />
                      Pay with Razorpay
                    </button>

                    <button
                      onClick={() =>
                        handleCashPayment(
                          selectedBooking,
                          pendingBookings.find((b) => b.id === selectedBooking)?.totalAmount || 0
                        )
                      }
                      className="w-full bg-gray-600 text-white px-4 py-3 rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <DollarSign className="w-5 h-5" />
                      Pay with Cash
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-200">
              <button
                onClick={() => {
                  setShowPaymentModal(false);
                  setSelectedBooking('');
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payments;
