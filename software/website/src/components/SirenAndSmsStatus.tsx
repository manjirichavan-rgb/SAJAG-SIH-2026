import React from 'react';
import { SirenState, SmsDispatchState } from '../types';
import { Bell, BellOff, Volume2, VolumeX, Send, PhoneCall, CheckCircle2, Clock, AlertTriangle, Radio } from 'lucide-react';

interface SirenAndSmsStatusProps {
  sirenState: SirenState;
  smsState: SmsDispatchState;
  onTestSiren: () => void;
  onSilenceSiren: () => void;
  onToggleAudio: () => void;
  onTestSms: () => void;
}

export const SirenAndSmsStatus: React.FC<SirenAndSmsStatusProps> = ({
  sirenState,
  smsState,
  onTestSiren,
  onSilenceSiren,
  onToggleAudio,
  onTestSms,
}) => {
  const isSirenActive = sirenState.status === 'ACTIVE';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
      
      {/* 8. SIREN STATUS SECTION (Takes 6 cols) */}
      <div className="lg:col-span-6 bg-white rounded-lg border border-slate-300 shadow-sm overflow-hidden flex flex-col justify-between">
        <div>
          {/* Card Header */}
          <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 bg-blue-900 rounded-sm"></div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                8. Siren Status — Village Public Warning Relay
              </h2>
            </div>
            <span className="text-[11px] font-mono text-slate-500">
              Hardware Relay Actuation
            </span>
          </div>

          <div className="p-4">
            {/* Massive Siren State Card */}
            <div
              className={`p-4 rounded-md border flex items-center justify-between transition-all duration-300 ${
                isSirenActive
                  ? 'bg-red-950 border-red-600 text-white shadow-md animate-pulse'
                  : 'bg-slate-50 border-slate-200 text-slate-800'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div
                  className={`p-3 rounded-full ${
                    isSirenActive ? 'bg-red-600 text-white' : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  <Bell className="w-6 h-6" />
                </div>

                <div>
                  <div className="text-[11px] uppercase tracking-wider font-mono font-bold text-slate-400">
                    Warning Relay State
                  </div>
                  <div className="text-2xl font-black tracking-tight font-sans flex items-center gap-2">
                    <span className={isSirenActive ? 'text-red-400' : 'text-slate-800'}>
                      {sirenState.status}
                    </span>
                    {isSirenActive && (
                      <span className="text-xs px-2 py-0.5 rounded bg-red-600 text-white font-mono uppercase font-bold animate-bounce">
                        SOUNDING
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="text-right font-mono text-xs">
                <div className="text-[11px] text-slate-500 font-sans">Trigger Mode:</div>
                <div className={`font-bold ${isSirenActive ? 'text-amber-400' : 'text-slate-700'}`}>
                  {sirenState.triggerMode}
                </div>
              </div>
            </div>

            {/* Event-triggered description line */}
            <div className="mt-3 p-2.5 rounded bg-slate-50 border border-slate-200 text-xs">
              <div className="font-semibold text-slate-600 text-[11px] uppercase tracking-wide">
                Event-Triggered Diagnostic Cause:
              </div>
              <div className="font-mono text-slate-800 mt-0.5 font-medium">
                {sirenState.lastEventTrigger || 'Standby Mode: Continuous edge monitor active. No critical evacuation threshold tripped.'}
              </div>
              {sirenState.activatedAt && (
                <div className="text-[11px] text-slate-500 mt-1">
                  Activated at: <span className="font-mono font-bold text-slate-700">{sirenState.activatedAt}</span>
                </div>
              )}
            </div>

            {/* Relay Status Indicators */}
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="p-2 rounded bg-slate-50 border border-slate-200 flex items-center justify-between">
                <span className="text-slate-600 font-sans">Panchayat Horn Relay:</span>
                <span className={`font-bold ${isSirenActive ? 'text-red-600' : 'text-emerald-700'}`}>
                  {sirenState.relayStatus}
                </span>
              </div>
              <div className="p-2 rounded bg-slate-50 border border-slate-200 flex items-center justify-between">
                <span className="text-slate-600 font-sans">Visual Strobe Beacon:</span>
                <span className={`font-bold ${isSirenActive ? 'text-red-600' : 'text-slate-500'}`}>
                  {isSirenActive ? 'STROBING' : 'OFFLINE'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Siren Operator Controls Bar */}
        <div className="bg-slate-100 px-4 py-2.5 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            {!isSirenActive ? (
              <button
                type="button"
                onClick={onTestSiren}
                className="bg-amber-600 hover:bg-amber-700 text-white font-semibold px-3 py-1.5 rounded text-xs transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <Bell className="w-3.5 h-3.5" />
                <span>Test Siren (Manual Drill)</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onSilenceSiren}
                className="bg-red-700 hover:bg-red-800 text-white font-bold px-3 py-1.5 rounded text-xs transition-colors flex items-center gap-1.5 shadow-xs animate-pulse"
              >
                <BellOff className="w-3.5 h-3.5" />
                <span>Silence / Disarm Siren</span>
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={onToggleAudio}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs font-medium border transition-colors ${
              sirenState.audioMuted
                ? 'bg-white border-slate-300 text-slate-600'
                : 'bg-blue-50 border-blue-300 text-blue-800'
            }`}
          >
            {sirenState.audioMuted ? (
              <>
                <VolumeX className="w-3.5 h-3.5 text-slate-500" />
                <span>Siren Audio: Muted</span>
              </>
            ) : (
              <>
                <Volume2 className="w-3.5 h-3.5 text-blue-700" />
                <span>Siren Audio: Synthesizer Active</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 9. SMS STATUS SECTION (Takes 6 cols) */}
      <div className="lg:col-span-6 bg-white rounded-lg border border-slate-300 shadow-sm overflow-hidden flex flex-col justify-between">
        <div>
          {/* Card Header */}
          <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 bg-blue-900 rounded-sm"></div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                9. SMS Status — Authority Alert Dispatch
              </h2>
            </div>
            <span className="text-[11px] font-mono text-slate-500">
              Govt SMS Gateway (CDAC/BSNL)
            </span>
          </div>

          <div className="p-4">
            {/* Status Pill Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-600">SMS Gateway Status:</span>
                <span
                  className={`px-2.5 py-0.5 rounded font-bold font-mono text-xs uppercase ${
                    smsState.status === 'SENT'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : smsState.status === 'PENDING'
                      ? 'bg-amber-100 text-amber-800 border border-amber-300'
                      : smsState.status === 'FAILED'
                      ? 'bg-red-100 text-red-800 border border-red-300'
                      : 'bg-slate-100 text-slate-700 border border-slate-200'
                  }`}
                >
                  {smsState.status}
                </span>
              </div>

              {smsState.lastDispatchedAt && (
                <div className="text-[11px] text-slate-500 font-mono">
                  Dispatched: <span className="font-bold text-slate-700">{smsState.lastDispatchedAt}</span>
                </div>
              )}
            </div>

            {/* Emergency Recipient Directory */}
            <div className="mt-3">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1.5 flex items-center justify-between">
                <span>Panchayat Emergency Response Contacts:</span>
                <span className="text-[10px] text-slate-500 font-normal">5 Registered Nodes</span>
              </div>

              <div className="space-y-1.5 max-h-[160px] overflow-y-auto pr-1">
                {smsState.recipients.map((rec, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 rounded bg-slate-50 border border-slate-200 text-xs"
                  >
                    <div>
                      <div className="font-semibold text-slate-900">{rec.name}</div>
                      <div className="text-[10px] text-slate-500">
                        {rec.role} • <span className="font-mono text-slate-700">{rec.mobile}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span
                        className={`inline-block px-1.5 py-0.2 rounded font-mono font-bold text-[10px] uppercase ${
                          rec.status === 'SENT'
                            ? 'bg-emerald-100 text-emerald-800'
                            : rec.status === 'PENDING'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {rec.status}
                      </span>
                      <div className="text-[9px] text-slate-400 font-mono mt-0.5">
                        {rec.deliveryTime || 'Standby'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Dispatched SMS Message Preview */}
            {smsState.messageText && (
              <div className="mt-3 p-2.5 rounded bg-blue-50/70 border border-blue-200 text-xs text-blue-950 font-mono">
                <span className="font-bold text-[11px] uppercase tracking-wider text-blue-800 block mb-0.5 font-sans">
                  Last Dispatched Message Text:
                </span>
                "{smsState.messageText}"
              </div>
            )}
          </div>
        </div>

        {/* SMS Action Footer */}
        <div className="bg-slate-100 px-4 py-2.5 border-t border-slate-200 flex items-center justify-between text-xs">
          <span className="text-slate-600 font-mono text-[11px]">
            {smsState.gatewayResponse || 'Govt SMS Push Service Standby'}
          </span>

          <button
            type="button"
            onClick={onTestSms}
            className="bg-[#0f284e] hover:bg-blue-900 text-white font-semibold px-3 py-1.5 rounded text-xs transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Send className="w-3.5 h-3.5 text-amber-400" />
            <span>Test SMS Broadcast</span>
          </button>
        </div>
      </div>

    </div>
  );
};
