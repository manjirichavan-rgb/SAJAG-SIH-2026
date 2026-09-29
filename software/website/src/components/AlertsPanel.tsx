import React, { useState } from 'react';
import { AlertRecord, AlertSeverity } from '../types';
import { AlertTriangle, AlertOctagon, CheckCircle2, ShieldAlert, Check, History } from 'lucide-react';

interface AlertsPanelProps {
  alerts: AlertRecord[];
  onAcknowledgeAlert: (alertId: string) => void;
}

export const AlertsPanel: React.FC<AlertsPanelProps> = ({ alerts, onAcknowledgeAlert }) => {
  const [activeTab, setActiveTab] = useState<'active' | 'historical'>('active');
  const [filterSeverity, setFilterSeverity] = useState<string>('ALL');

  const activeAlerts = alerts.filter((a) => !a.acknowledged);
  // Do not show a very long list for historical hazards: limit to latest 3 records
  const historicalAlerts = alerts.filter((a) => a.acknowledged).slice(0, 3);

  const baseList = activeTab === 'active' ? activeAlerts : historicalAlerts;
  const displayedAlerts = baseList.filter((alert) => {
    if (filterSeverity === 'ALL') return true;
    return alert.severity === filterSeverity;
  });

  const getSeverityBadge = (sev: AlertSeverity) => {
    switch (sev) {
      case 'RISK':
        return {
          bg: 'bg-red-100 text-red-900 border-red-300 font-bold',
          icon: AlertOctagon,
          iconColor: 'text-red-700',
        };
      case 'WATCH':
        return {
          bg: 'bg-amber-100 text-amber-900 border-amber-300 font-bold',
          icon: AlertTriangle,
          iconColor: 'text-amber-700',
        };
      case 'SAFE':
      default:
        return {
          bg: 'bg-emerald-100 text-emerald-900 border-emerald-300 font-medium',
          icon: CheckCircle2,
          iconColor: 'text-emerald-700',
        };
    }
  };

  return (
    <div className="bg-white rounded-lg border border-slate-300 shadow-sm overflow-hidden">
      {/* Section Header */}
      <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 bg-blue-900 rounded-sm"></div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
            7. Alerts — 3-Stage Hazard Incidents &amp; Recent Log
          </h2>
        </div>

        {/* Tab & Filter switchers */}
        <div className="flex items-center gap-2">
          <div className="flex bg-slate-200 p-0.5 rounded text-xs font-semibold">
            <button
              type="button"
              onClick={() => setActiveTab('active')}
              className={`px-2.5 py-1 rounded transition-colors flex items-center gap-1.5 ${
                activeTab === 'active'
                  ? 'bg-white text-blue-950 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>Active Incidents</span>
              {activeAlerts.length > 0 && (
                <span className="px-1.5 py-0.2 bg-red-600 text-white rounded-full text-[10px] font-bold font-mono">
                  {activeAlerts.length}
                </span>
              )}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('historical')}
              className={`px-2.5 py-1 rounded transition-colors flex items-center gap-1 ${
                activeTab === 'historical'
                  ? 'bg-white text-blue-950 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Compact historical log (3 most recent records)"
            >
              <History className="w-3 h-3" />
              <span>Historical Hazard Log (Recent 3)</span>
            </button>
          </div>

          {/* 3-Stage Severity Filter */}
          <select
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value)}
            className="text-xs bg-white border border-slate-300 rounded px-2 py-1 text-slate-700 font-medium"
          >
            <option value="ALL">All Stages</option>
            <option value="RISK">Stage: RISK</option>
            <option value="WATCH">Stage: WATCH</option>
            <option value="SAFE">Stage: SAFE</option>
          </select>
        </div>
      </div>

      {/* Alerts Content */}
      <div className="p-4">
        {activeTab === 'historical' && (
          <div className="mb-2 text-[11px] text-slate-500 font-mono flex items-center justify-between">
            <span>Compact Audit View • Showing 3 most recent historical events</span>
            <span className="text-slate-400">Total historical records capped</span>
          </div>
        )}

        {displayedAlerts.length === 0 ? (
          <div className="text-center py-6 bg-slate-50 rounded border border-dashed border-slate-200">
            <ShieldAlert className="w-8 h-8 text-emerald-600 mx-auto mb-2 opacity-80" />
            <div className="text-sm font-semibold text-slate-800">
              No Active Hazards Currently Flagged
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              All 6 village nodes operating in SAFE stage tolerances across temp, pressure, water level, soil moisture, and vibration.
            </p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {displayedAlerts.map((alert) => {
              const badge = getSeverityBadge(alert.severity);
              const Icon = badge.icon;

              return (
                <div
                  key={alert.id}
                  className={`p-3 rounded-lg border transition-all ${
                    alert.acknowledged
                      ? 'bg-slate-50/70 border-slate-200 text-slate-700'
                      : alert.severity === 'RISK'
                      ? 'bg-red-50/80 border-red-300 ring-1 ring-red-400'
                      : alert.severity === 'WATCH'
                      ? 'bg-amber-50/80 border-amber-300'
                      : 'bg-emerald-50/80 border-emerald-200'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      {/* Severity Pill (3 Stages Only) */}
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] border ${badge.bg}`}>
                        <Icon className={`w-3.5 h-3.5 ${badge.iconColor}`} />
                        <span>STAGE: {alert.severity}</span>
                      </span>

                      {/* Incident ID */}
                      <span className="font-mono text-xs font-bold text-slate-900">
                        {alert.id}
                      </span>

                      {/* Node Identifier */}
                      <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-200/80 text-slate-800 font-mono">
                        {alert.nodeId}
                      </span>

                      {/* Hazard Type Badge */}
                      <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-slate-800 text-slate-100 font-mono">
                        {alert.hazardType}
                      </span>
                    </div>

                    {/* Timestamp & Ack status */}
                    <div className="flex items-center gap-2 text-xs font-mono text-slate-600">
                      <span>{alert.timestamp}</span>
                      {!alert.acknowledged ? (
                        <button
                          type="button"
                          onClick={() => onAcknowledgeAlert(alert.id)}
                          className="flex items-center gap-1 bg-slate-900 hover:bg-slate-800 text-white px-2.5 py-1 rounded text-[11px] font-sans font-medium transition-colors"
                        >
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span>Acknowledge</span>
                        </button>
                      ) : (
                        <span className="text-[11px] text-emerald-700 font-sans font-medium bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          ✓ Acknowledged by Panchayat
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Title & Description */}
                  <div className="mt-2 text-xs">
                    <div className="font-bold text-slate-900 text-sm">{alert.title}</div>
                    <div className="text-slate-700 mt-0.5 leading-relaxed">{alert.description}</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
