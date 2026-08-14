import React from 'react';
import Card from '../Card';
import { Badge } from '../Badge';
import { Hospital, Calendar, MapPin, Award, CheckCircle2 } from 'lucide-react';

export default function DonationHistoryList({ history = [] }) {
  if (history.length === 0) {
    return (
      <Card variant="default" className="p-8 text-center border border-slate-200">
        <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
          <Award className="w-6 h-6" />
        </div>
        <h4 className="text-base font-bold text-brand-navy mb-1">No Donation History Yet</h4>
        <p className="text-xs text-brand-slate max-w-sm mx-auto">
          Your completed blood donations and verified digital certificates will be logged here.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {history.map((record) => (
        <Card key={record._id || record.certificateId} variant="elevated" className="p-5 border border-slate-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-brand-red/10 text-brand-red flex items-center justify-center shrink-0 mt-0.5">
                <Hospital className="w-5 h-5" />
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="text-base font-bold text-brand-navy">{record.hospitalName}</h4>
                  <Badge variant="success" className="text-[10px]">
                    <CheckCircle2 className="w-3 h-3 inline mr-1" />
                    {record.status}
                  </Badge>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    {new Date(record.donationDate).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {record.location}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center sm:flex-col sm:items-end justify-between gap-2 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
              <div className="text-right">
                <span className="block text-[10px] uppercase font-bold text-slate-400">Donated</span>
                <span className="text-sm font-black text-brand-navy">{record.unitsDonated} Unit ({record.bloodGroup})</span>
              </div>
              <div className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                <Award className="w-3 h-3 text-emerald-600" />
                <span>{record.certificateId}</span>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
