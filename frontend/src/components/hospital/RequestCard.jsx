import React from 'react';
import Card from '../Card';
import { Badge } from '../Badge';
import { Button } from '../Button';
import { Calendar, MapPin, FileText, ArrowRight, Clock, AlertTriangle } from 'lucide-react';

export default function RequestCard({ request }) {
  const isCritical = request.urgency === 'CRITICAL';
  const fulfilledPercent = Math.min(Math.round((request.unitsFulfilled / request.unitsRequired) * 100), 100);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'FULFILLED':
        return <Badge variant="success">FULFILLED</Badge>;
      case 'PARTIALLY_FULFILLED':
        return <Badge variant="warning">PARTIALLY FULFILLED</Badge>;
      case 'CANCELLED':
        return <Badge variant="neutral">CANCELLED</Badge>;
      default:
        return <Badge variant="info">OPEN</Badge>;
    }
  };

  return (
    <Card variant="elevated" className="p-6 border border-slate-200 relative overflow-hidden">
      {isCritical && request.status === 'OPEN' && (
        <div className="absolute top-0 right-0 left-0 h-1 bg-brand-red animate-pulse" />
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            {getStatusBadge(request.status)}
            <Badge variant={isCritical ? 'danger' : 'warning'}>
              {request.urgency} URGENCY
            </Badge>
            <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
              Ref: {request.patientReference}
            </span>
          </div>

          <h3 className="text-xl font-black text-brand-navy flex items-center gap-2">
            <span>{request.bloodGroup} Blood Request</span>
            <span className="text-sm font-bold text-brand-red">({request.unitsRequired} Units)</span>
          </h3>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => { window.location.href = `/hospital/requests/${request._id}`; }}
            icon={ArrowRight}
            iconPosition="right"
          >
            Manage Request
          </Button>
        </div>
      </div>

      {/* Progress Bar for Fulfillment */}
      <div className="mb-4 bg-slate-50 p-3 rounded-xl border border-slate-100">
        <div className="flex items-center justify-between text-xs font-bold mb-1">
          <span className="text-slate-600">Fulfillment Progress</span>
          <span className="text-brand-navy font-mono">
            {request.unitsFulfilled} / {request.unitsRequired} Units ({fulfilledPercent}%)
          </span>
        </div>
        <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-500 ${
              fulfilledPercent === 100 ? 'bg-emerald-500' : fulfilledPercent > 0 ? 'bg-amber-500' : 'bg-brand-red'
            }`}
            style={{ width: `${fulfilledPercent}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-600">
        <div className="flex items-center gap-1.5">
          <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
          <span>Required by: <strong className="text-brand-navy">{new Date(request.requiredDate).toLocaleDateString()}</strong></span>
        </div>

        <div className="flex items-center gap-1.5">
          <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
          <span>{request.location?.city}, {request.location?.state}</span>
        </div>

        <div className="flex items-center gap-1.5">
          <Clock className="w-4 h-4 text-slate-400 shrink-0" />
          <span>Posted {new Date(request.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
    </Card>
  );
}
