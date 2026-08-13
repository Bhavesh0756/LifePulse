import React from 'react';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, RefreshCw } from 'lucide-react';
import Card from '../components/Card';
import Container from '../components/Container';
import { Button } from '../components/Button';

export function ProtectedRoute({ children, allowedRoles = [] }) {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center p-6">
        <div className="flex flex-col items-center gap-3 text-brand-navy">
          <RefreshCw className="w-8 h-8 text-brand-red animate-spin" />
          <span className="text-sm font-semibold">Verifying LifePulse Authentication...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Unauthenticated -> Redirect to login
    window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`;
    return null;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    // Authenticated but wrong role -> Show Unauthorized Guard Card
    const targetPortal =
      user?.role === 'DONOR'
        ? '/donor/dashboard'
        : user?.role === 'HOSPITAL'
        ? '/hospital/dashboard'
        : '/admin/dashboard';

    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center p-6">
        <Container size="sm">
          <Card variant="elevated" className="p-8 text-center border border-rose-200">
            <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-4">
              <ShieldAlert className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-bold text-brand-navy mb-2">Access Denied</h2>
            <p className="text-xs text-brand-slate mb-6">
              Your account role (<strong className="text-brand-navy">{user?.role}</strong>) does not have permission to access this portal path.
            </p>
            <Button
              variant="primary"
              onClick={() => {
                window.location.href = targetPortal;
              }}
            >
              Go to Your Authorized Portal
            </Button>
          </Card>
        </Container>
      </div>
    );
  }

  return children;
}
