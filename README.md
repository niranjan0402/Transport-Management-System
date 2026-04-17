# Transport Management System

A comprehensive web-based Transport Management System built with React, TypeScript, and Tailwind CSS.

## Features

### 1. User Management System
- **Three User Roles**: Admin, Driver, and Customer
- **Role-based Access Control**: Different dashboards and features for each role
- **Secure Login**: Authentication system with demo credentials

### 2. Vehicle Management (Admin)
- Add, update, and delete vehicles
- Track vehicle status (Available, In-use, Maintenance)
- Manage vehicle details: registration number, model, type, capacity, fuel type, mileage
- Search and filter vehicles
- Service date tracking

### 3. Booking System
- **Customers**: Create new bookings, view booking history
- **Admin**: Manage all bookings, update booking status
- Real-time booking status updates (Pending, Confirmed, In-Progress, Completed, Cancelled)
- Vehicle selection based on availability
- Pickup and dropoff location management
- Date and time scheduling

### 4. Trip Management
- **Drivers**: View assigned trips, start/stop trips, update trip status
- **Admin**: Monitor all trips and their progress
- Real-time trip status updates
- Distance tracking
- Location updates during trips
- Trip completion tracking

### 5. Live Tracking System
- Real-time vehicle location tracking
- Interactive trip selection
- Current location coordinates display
- Route visualization (placeholder for map integration)
- ETA calculations
- Live status updates

### 6. Billing & Payments
- **Razorpay Integration**: Simulated payment gateway integration
- Multiple payment methods: Razorpay, Cash
- Payment status tracking (Pending, Completed, Failed, Refunded)
- Transaction history
- Revenue tracking
- Payment confirmation for admin

### 7. Reports & Analytics
- **Trip Reports**: 
  - Total trips, completed, in-progress, cancelled
  - Distance statistics
  - Success rate analysis
  
- **Revenue Reports**:
  - Total revenue tracking
  - Monthly revenue breakdown
  - Pending and completed payments
  - Refund tracking
  
- **Vehicle Usage Reports**:
  - Trip count per vehicle
  - Distance covered by each vehicle
  - Utilization rate
  - Maintenance costs
  
- Export reports as text files

## Demo Credentials

### Admin
- Email: `admin@tms.com`
- Password: `admin123`

### Driver
- Email: `driver@tms.com`
- Password: `driver123`

### Customer
- Email: `customer@tms.com`
- Password: `customer123`

## Technologies Used

- **React 19**: UI framework
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **React Router**: Navigation and routing
- **Lucide React**: Icons
- **date-fns**: Date formatting
- **Vite**: Build tool and development server

## Features by Role

### Admin Dashboard
- Complete system overview
- User management
- Vehicle fleet management
- All bookings and trips
- Live tracking for all vehicles
- Payment management
- Comprehensive reports and analytics

### Driver Dashboard
- Assigned trips
- Trip status updates
- Location tracking updates
- Trip completion
- Simple analytics

### Customer Dashboard
- Create new bookings
- View booking history
- Track active trips
- Make payments
- View payment history

## Data Persistence

All data is stored in browser's localStorage, allowing the application to maintain state across sessions.

## Getting Started

1. Open the application in your browser
2. Select a user role (Admin, Driver, or Customer)
3. Click on the corresponding demo credential button to auto-fill
4. Click "Sign In" to access the dashboard

## Key Highlights

- ✅ Fully responsive design
- ✅ Role-based access control
- ✅ Real-time updates
- ✅ Comprehensive CRUD operations
- ✅ Interactive UI with smooth transitions
- ✅ Data persistence with localStorage
- ✅ Payment gateway integration (simulated)
- ✅ Advanced reporting and analytics
- ✅ Live tracking system
- ✅ Professional dashboard layouts

## Future Enhancements

- Real Razorpay API integration
- Google Maps / Mapbox integration for live tracking
- SMS/Email notifications
- Advanced analytics with charts
- Driver performance metrics
- Customer ratings and reviews
- Multi-language support
- Dark mode
- Mobile app version
