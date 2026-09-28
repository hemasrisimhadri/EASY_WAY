import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LoadingScreen from './components/LoadingScreen';
import ProtectedRoute from './components/ProtectedRoute';

// Public Pages
import HomePage from './pages/HomePage';
import DepartmentsPage from './pages/DepartmentsPage';
import DepartmentDetailPage from './pages/DepartmentDetailPage';
import HospitalsPage from './pages/HospitalsPage';
import HospitalDetailPage from './pages/HospitalDetailPage';
import DoctorsPage from './pages/DoctorsPage';
import DoctorDetailPage from './pages/DoctorDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import EmergencyPage from './pages/EmergencyPage';
import BookAppointmentPage from './pages/BookAppointmentPage';

// Patient Pages
import PatientDashboardPage from './pages/PatientDashboardPage';
import PatientProfilePage from './pages/PatientProfilePage';
import MyAppointmentsPage from './pages/MyAppointmentsPage';
import AppointmentDetailPage from './pages/AppointmentDetailPage';

// Admin Pages
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminHospitalsPage from './pages/AdminHospitalsPage';
import AdminDepartmentsPage from './pages/AdminDepartmentsPage';
import AdminDoctorsPage from './pages/AdminDoctorsPage';
import AdminAppointmentsPage from './pages/AdminAppointmentsPage';
import AdminPatientsPage from './pages/AdminPatientsPage';

const App = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin') && location.pathname !== '/admin/login';

  // Check if opening animation has played in this session
  const [showOpeningAnimation, setShowOpeningAnimation] = useState(() => {
    return !sessionStorage.getItem('easyway_animated_seen');
  });

  const handleAnimationComplete = () => {
    sessionStorage.setItem('easyway_animated_seen', 'true');
    setShowOpeningAnimation(false);
  };

  // Scroll to top on route navigation
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <>
      {showOpeningAnimation && (
        <LoadingScreen onComplete={handleAnimationComplete} />
      )}

      {/* Public and Patient pages show the main Navbar */}
      {!isAdminRoute && <Navbar />}

      <div style={{ flex: 1 }}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/departments" element={<DepartmentsPage />} />
          <Route path="/departments/:id" element={<DepartmentDetailPage />} />
          <Route path="/hospitals" element={<HospitalsPage />} />
          <Route path="/hospitals/:id" element={<HospitalDetailPage />} />
          <Route path="/doctors" element={<DoctorsPage />} />
          <Route path="/doctors/:id" element={<DoctorDetailPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/emergency" element={<EmergencyPage />} />
          <Route path="/book" element={<BookAppointmentPage />} />

          {/* Patient Protected Routes */}
          <Route
            path="/patient/dashboard"
            element={
              <ProtectedRoute>
                <PatientDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/patient/profile"
            element={
              <ProtectedRoute>
                <PatientProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/patient/appointments"
            element={
              <ProtectedRoute>
                <MyAppointmentsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/patient/appointments/:id"
            element={
              <ProtectedRoute>
                <AppointmentDetailPage />
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute roleRequired="admin">
                <AdminDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/hospitals"
            element={
              <ProtectedRoute roleRequired="admin">
                <AdminHospitalsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/departments"
            element={
              <ProtectedRoute roleRequired="admin">
                <AdminDepartmentsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/doctors"
            element={
              <ProtectedRoute roleRequired="admin">
                <AdminDoctorsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/appointments"
            element={
              <ProtectedRoute roleRequired="admin">
                <AdminAppointmentsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/patients"
            element={
              <ProtectedRoute roleRequired="admin">
                <AdminPatientsPage />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>

      {/* Public and Patient pages show the main Footer */}
      {!isAdminRoute && <Footer />}
    </>
  );
};

export default App;
