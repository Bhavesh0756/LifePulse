import React from 'react';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Container from '../../components/Container';
import Card from '../../components/Card';
import { Button } from '../../components/Button';
import { Badge } from '../../components/Badge';
import { User, Hospital, ShieldCheck, LogOut, CheckCircle2, AlertCircle } from 'lucide-react';

function BasePortalPlaceholder({ title, roleLabel, badgeVariant, icon: Icon, nextStageNote }) {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-brand-bg text-brand-navy flex flex-col justify-between">
      <Navbar />

      <main className="flex-grow py-16 flex items-center">
        <Container size="md">
          <Card variant="elevated" className="p-8 md:p-12 text-center max-w-2xl mx-auto border border-slate-200">
            <div className="w-16 h-16 rounded-2xl bg-brand-red/10 text-brand-red flex items-center justify-center mx-auto mb-6 shadow-sm">
              <Icon className="w-8 h-8" />
            </div>

            <Badge variant={badgeVariant} className="mb-4">
              {roleLabel} Authenticated
            </Badge>

            <h1 className="text-3xl font-extrabold text-brand-navy mb-2">
              Welcome, {user?.name || 'User'}!
            </h1>
            <p className="text-sm font-semibold text-brand-slate mb-6">
              Account Email: <span className="text-brand-navy font-mono">{user?.email}</span>
            </p>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-left mb-8 space-y-2">
              <div className="flex justify-between">
                <span className="font-bold text-slate-500">Role:</span>
                <span className="font-mono font-bold text-brand-navy">{user?.role}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-bold text-slate-500">Phone:</span>
                <span className="font-mono text-brand-navy">{user?.phone || 'N/A'}</span>
              </div>
              {user?.bloodGroup && (
                <div className="flex justify-between">
                  <span className="font-bold text-slate-500">Blood Group:</span>
                  <span className="font-mono font-bold text-brand-red">{user?.bloodGroup}</span>
                </div>
              )}
              {user?.hospitalName && (
                <div className="flex justify-between">
                  <span className="font-bold text-slate-500">Hospital Institution:</span>
                  <span className="font-mono text-brand-navy">{user?.hospitalName}</span>
                </div>
              )}
            </div>

            <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-800 text-left mb-8 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold block text-blue-950 mb-0.5">{title} Active</strong>
                <span>{nextStageNote}</span>
              </div>
            </div>

            <Button variant="outline" size="md" onClick={logout} icon={LogOut}>
              Sign Out
            </Button>
          </Card>
        </Container>
      </main>

      <Footer />
    </div>
  );
}

export function DonorPortalPlaceholder() {
  return (
    <BasePortalPlaceholder
      title="Donor Portal"
      roleLabel="DONOR PORTAL"
      badgeVariant="brand"
      icon={User}
      nextStageNote="Your donor account is verified. Complete donor matching, incoming blood requests, and consent-based contact sharing are active."
    />
  );
}

export function HospitalPortalPlaceholder() {
  return (
    <BasePortalPlaceholder
      title="Hospital Portal"
      roleLabel="HOSPITAL INSTITUTION"
      badgeVariant="info"
      icon={Hospital}
      nextStageNote="Your hospital institution profile is active. Blood request creation, unit management, and donor response tracking are active."
    />
  );
}

export function AdminPortalPlaceholder() {
  return (
    <BasePortalPlaceholder
      title="Admin Control Center"
      roleLabel="SYSTEM ADMIN"
      badgeVariant="warning"
      icon={ShieldCheck}
      nextStageNote="System administrator privileges verified. Platform analytics, hospital verification queues, and audit logs are active."
    />
  );
}
