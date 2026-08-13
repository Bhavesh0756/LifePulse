import React, { useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import LandingPage from './pages/landing/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

// Donor Portal Pages
import DonorDashboardPage from './pages/donor/DonorDashboardPage';

// Hospital Portal Pages
import HospitalDashboardPage from './pages/hospital/HospitalDashboardPage';
import CreateBloodRequestPage from './pages/hospital/CreateBloodRequestPage';
import RequestDetailPage from './pages/hospital/RequestDetailPage';
import BloodRequestsListPage from './pages/hospital/BloodRequestsListPage';
import HospitalProfilePage from './pages/hospital/HospitalProfilePage';

// Admin Portal Page
import AdminDashboardPage from './pages/admin/AdminDashboardPage';

// Protected Route Guard
import { ProtectedRoute } from './routes/ProtectedRoute';

import Lenis from 'lenis';

export default function App() {
  const path = window.location.pathname;

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!prefersReducedMotion && path === '/') {
      const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 2,
      });

      function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }

      requestAnimationFrame(raf);

      return () => {
        lenis.destroy();
      };
    }
  }, [path]);

  // Route Dispatcher
  const renderRoute = () => {
    // Auth Routes
    if (path === '/login') return <LoginPage />;
    if (path === '/register') return <RegisterPage />;

    // Donor Routes
    if (path.startsWith('/donor')) {
      return (
        <ProtectedRoute allowedRoles={['DONOR']}>
          <DonorDashboardPage />
        </ProtectedRoute>
      );
    }

    // Hospital Routes
    if (path === '/hospital/requests/new') {
      return (
        <ProtectedRoute allowedRoles={['HOSPITAL']}>
          <CreateBloodRequestPage />
        </ProtectedRoute>
      );
    }
    if (path.startsWith('/hospital/requests/')) {
      return (
        <ProtectedRoute allowedRoles={['HOSPITAL']}>
          <RequestDetailPage />
        </ProtectedRoute>
      );
    }
    if (path === '/hospital/requests') {
      return (
        <ProtectedRoute allowedRoles={['HOSPITAL']}>
          <BloodRequestsListPage />
        </ProtectedRoute>
      );
    }
    if (path === '/hospital/profile') {
      return (
        <ProtectedRoute allowedRoles={['HOSPITAL']}>
          <HospitalProfilePage />
        </ProtectedRoute>
      );
    }
    if (path.startsWith('/hospital')) {
      return (
        <ProtectedRoute allowedRoles={['HOSPITAL']}>
          <HospitalDashboardPage />
        </ProtectedRoute>
      );
    }

    // Admin Routes
    if (path.startsWith('/admin')) {
      return (
        <ProtectedRoute allowedRoles={['ADMIN']}>
          <AdminDashboardPage />
        </ProtectedRoute>
      );
    }

    // Default fallback -> Public Landing Page
    return <LandingPage />;
  };

  return (
    <AuthProvider>
      <NotificationProvider>{renderRoute()}</NotificationProvider>
    </AuthProvider>
  );
}
