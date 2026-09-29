import React, { useState, useEffect } from 'react';
import { Radio, Wifi, WifiOff, Cpu, Bell, Sliders, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { SystemStatus, SirenState } from '../types';

interface HeaderProps {
  systemStatus: SystemStatus;
  sirenState: SirenState;
  onToggleInternet: () => void;
  onOpenHardwareModal: () => void;
  onOpenSirenModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  systemStatus,
  sirenState,
  onToggleInternet,
  onOpenHardwareModal,
}) => {
  const [timeStr, setTimeStr] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        weekday: 'short',
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
        timeZone: 'Asia/Kolkata',
      };
      setTimeStr(new Intl.DateTimeFormat('en-IN', options).format(now) + ' IST');
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="w-full shadow-md">
      {/* Indian National Tricolor Stripe */}
      <div className="h-1.5 w-full flex">
        <div className="w-1/3 bg-amber-500"></div>
        <div className="w-1/3 bg-white"></div>
        <div className="w-1/3 bg-emerald-600"></div>
      </div>

      {/* Main Government Portal Header */}
      <div className="bg-[#0f284e] text-white px-4 lg:px-8 py-3 border-b border-slate-700">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          
          {/* Brand & Emblem */}
          <div className="flex items-center gap-3.5">
            {/* Government Emblem Symbol / Crest */}
            <div className="flex-shrink-0 w-11 h-11 rounded-sm bg-white/10 border border-white/20 flex flex-col items-center justify-center p-1">
              <span className="text-[9px] font-bold text-amber-400 tracking-wider">सत्यमेव</span>
              <span className="text-[9px] font-bold text-white tracking-wider">जयते</span>
              <div className="w-6 h-[1.5px] bg-amber-400 my-0.5"></div>
              <span className="text-[7px] text-emerald-400 font-semibold uppercase tracking-tight">Panchayat</span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-extrabold tracking-tight text-white font-sans">
                  SAJAG <span className="text-xs font-normal text-amber-300 font-mono tracking-normal bg-amber-950/60 px-1.5 py-0.5 rounded border border-amber-500/40">सजग</span>
                </span>
                <span className="hidden sm:inline-block text-[11px] uppercase tracking-wider font-semibold text-slate-300 border-l border-slate-600 pl-2">
                  Gram Panchayat Shivapur • Taluka Haveli
                </span>
              </div>
              <h1 className="text-sm font-semibold text-slate-200 tracking-wide">
                Village Environmental Intelligence Dashboard
              </h1>
              <p className="text-[11px] text-slate-400">
                Edge-AI Early Warning System • Central Disaster Mitigation Cell
              </p>
            </div>
          </div>

          {/* System Telemetry Badges & Control Toggles */}
          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-start md:justify-end">
            
            {/* 10. LOCAL / OFFLINE STATUS SECTION COMPONENT */}
            <div className="flex items-center bg-slate-900/80 rounded-md border border-slate-700 p-1 text-xs">
              {/* Edge AI Active status badge */}
              <div 
                className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 rounded font-medium"
                title="Edge AI is running local TinyML quantized inference directly on the Panchayat hardware gateway."
              >
                <Cpu className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                <span className="font-mono text-[11px]">EDGE AI ACTIVE</span>
              </div>

              {/* Internet Online/Offline Toggle */}
              <button
                type="button"
                onClick={onToggleInternet}
                className={`ml-1 flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-medium transition-all ${
                  systemStatus.internetOnline
                    ? 'bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-600'
                    : 'bg-amber-950/80 text-amber-300 hover:bg-amber-900/80 border border-amber-500/50'
                }`}
                title="Click to simulate Internet connectivity loss. Local Edge AI and Siren remain 100% operational offline!"
              >
                {systemStatus.internetOnline ? (
                  <>
                    <Wifi className="w-3.5 h-3.5 text-blue-400" />
                    <span>INTERNET: ONLINE</span>
                  </>
                ) : (
                  <>
                    <WifiOff className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                    <span className="font-semibold">OFFLINE (LOCAL EDGE ONLY)</span>
                  </>
                )}
              </button>
            </div>

            {/* Physical Node Status Indicator */}
            <div className="flex items-center gap-1.5 bg-amber-500/15 border border-amber-400/40 text-amber-200 px-2.5 py-1.5 rounded-md text-xs font-medium">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
              </span>
              <span className="font-bold tracking-tight text-white">PHYSICAL NODE:</span>
              <span className="font-mono text-[11px] text-amber-300 font-semibold">NODE-01</span>
            </div>

            {/* Siren Quick Indicator */}
            <div 
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-semibold border ${
                sirenState.status === 'ACTIVE'
                  ? 'bg-red-950 border-red-500 text-red-200 animate-pulse'
                  : 'bg-slate-800/80 border-slate-700 text-slate-300'
              }`}
            >
              <Bell className={`w-3.5 h-3.5 ${sirenState.status === 'ACTIVE' ? 'text-red-400' : 'text-slate-400'}`} />
              <span>SIREN: {sirenState.status}</span>
            </div>

            {/* Physical Trigger Calibrator Button */}
            <button
              type="button"
              onClick={onOpenHardwareModal}
              className="flex items-center gap-1.5 bg-blue-700 hover:bg-blue-600 text-white px-3 py-1.5 rounded-md text-xs font-medium transition-colors border border-blue-500 shadow-sm"
              title="Open Physical Trigger Calibrator (temp, pressure, water level, soil moisture, vibration)"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Physical Trigger Calibrator</span>
            </button>
          </div>

        </div>
      </div>

      {/* Sub-header meta bar (Date / Jurisdiction / System Architecture) */}
      <div className="bg-slate-200 border-b border-slate-300 px-4 lg:px-8 py-1.5 text-xs text-slate-700 font-sans">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-slate-800">
              Gram Panchayat Jurisdiction: <span className="font-normal text-slate-700">Shivapur Block A-F (Area: 14.8 sq. km)</span>
            </span>
            <span className="hidden sm:inline text-slate-400">|</span>
            <span className="hidden sm:inline text-slate-600">
              Local Edge Gateway: <code className="text-slate-800 bg-white px-1 py-0.5 rounded border border-slate-300 text-[11px]">192.168.1.10</code>
            </span>
          </div>

          <div className="flex items-center gap-3 font-mono text-[11px] text-slate-600">
            <span className="flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-600"></span>
              Govt Grid v2.4
            </span>
            <span>{timeStr || 'Loading clock...'}</span>
          </div>
        </div>
      </div>
    </header>
  );
};
