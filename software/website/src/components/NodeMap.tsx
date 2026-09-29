import React from 'react';
import { VillageNode, RiskLevel } from '../types';
import { Radio } from 'lucide-react';

interface NodeMapProps {
  nodes: VillageNode[];
  selectedNodeId: string;
  onSelectNode: (nodeId: string) => void;
}

export const NodeMap: React.FC<NodeMapProps> = ({ nodes, selectedNodeId, onSelectNode }) => {
  const getStatusColor = (status: RiskLevel) => {
    switch (status) {
      case 'RISK':
        return {
          fill: '#dc2626', // red-600
          stroke: '#991b1b', // red-800
          badgeBg: 'bg-red-600 text-white',
          pulse: 'bg-red-500',
          border: 'border-red-600',
        };
      case 'WATCH':
        return {
          fill: '#eab308', // yellow-500
          stroke: '#854d0e', // yellow-800
          badgeBg: 'bg-amber-500 text-slate-900',
          pulse: 'bg-yellow-400',
          border: 'border-amber-500',
        };
      case 'SAFE':
      default:
        return {
          fill: '#16a34a', // green-600
          stroke: '#166534', // green-800
          badgeBg: 'bg-emerald-600 text-white',
          pulse: 'bg-emerald-400',
          border: 'border-emerald-600',
        };
    }
  };

  const selectedNode = nodes.find((n) => n.id === selectedNodeId) || nodes[0];

  return (
    <div className="bg-white rounded-lg border border-slate-300 shadow-sm overflow-hidden">
      {/* Card Header (Official Gov Style) */}
      <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 bg-blue-900 rounded-sm"></div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
            1. Node Map — Village Geospatial Grid
          </h2>
          <span className="text-xs text-slate-500 font-normal">
            (Gram Panchayat Shivapur Cadastral Layout • 3 Stages: Safe, Watch, Risk)
          </span>
        </div>

        {/* Legend: 3 Stages Only */}
        <div className="flex items-center flex-wrap gap-2.5 text-[11px] font-medium text-slate-700">
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block"></span>
            <span>Safe</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span>
            <span>Watch</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 inline-block"></span>
            <span>Risk</span>
          </div>
          <div className="flex items-center gap-1 pl-2 border-l border-slate-300">
            <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-400 text-[10px] font-bold">
              ● PHYSICAL
            </span>
            <span className="text-slate-600">Hardware Node</span>
          </div>
        </div>
      </div>

      {/* Schematic Map Container */}
      <div className="relative w-full h-[380px] bg-[#f2f5f8] border-b border-slate-200 select-none overflow-hidden">
        {/* Background Grid Pattern */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
          <defs>
            <pattern id="grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#cbd5e1" strokeWidth="0.75" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid-pattern)" />
        </svg>

        {/* Village Natural & Cadastral Features (Schematic Vector) */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 1000 600" preserveAspectRatio="none">
          {/* North Direction Indicator */}
          <g transform="translate(940, 45)">
            <circle cx="0" cy="0" r="18" fill="#ffffff" stroke="#94a3b8" strokeWidth="1.5" />
            <polygon points="0,-13 4,4 0,1 -4,4" fill="#0f284e" />
            <polygon points="0,13 4,-4 0,-1 -4,-4" fill="#cbd5e1" />
            <text x="0" y="-16" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#0f284e">N</text>
          </g>

          {/* Shivganga River / Nallah Inundation Channel */}
          <path
            d="M 50,0 Q 180,180 250,230 T 480,310 T 700,480 T 950,560"
            fill="none"
            stroke="#93c5fd"
            strokeWidth="32"
            strokeLinecap="round"
            opacity="0.65"
          />
          <path
            d="M 50,0 Q 180,180 250,230 T 480,310 T 700,480 T 950,560"
            fill="none"
            stroke="#3b82f6"
            strokeWidth="3"
            strokeDasharray="6 4"
            opacity="0.8"
          />
          <text x="210" y="195" fill="#1e40af" fontSize="11" fontWeight="600" fontStyle="italic" transform="rotate(32, 210, 195)">
            Shivganga Riverbed & Drainage Nallah
          </text>

          {/* Canal Sluice Feeder */}
          <path
            d="M 250,230 Q 160,340 180,520"
            fill="none"
            stroke="#60a5fa"
            strokeWidth="12"
            opacity="0.5"
          />

          {/* Village Gauthan Residential Zone Boundary */}
          <rect x="420" y="240" width="220" height="150" rx="14" fill="#fef3c7" fillOpacity="0.4" stroke="#d97706" strokeWidth="1.5" strokeDasharray="5 3" />
          <text x="530" y="260" textAnchor="middle" fill="#92400e" fontSize="11" fontWeight="700">
            गावठाण वस्ती (Gauthan Habitation Core)
          </text>

          {/* Agricultural Field Sectors */}
          <rect x="80" y="380" width="240" height="160" rx="6" fill="#ecfdf5" fillOpacity="0.6" stroke="#059669" strokeWidth="1" strokeDasharray="4 2" />
          <text x="200" y="470" textAnchor="middle" fill="#047857" fontSize="10" fontWeight="600">
            Agri Sector West (Paddy & Sugarcane)
          </text>

          {/* Forest & Hill Range Contour */}
          <path
            d="M 720,100 Q 860,180 920,380 L 1000,380 L 1000,50 L 720,50 Z"
            fill="#dcfce7"
            fillOpacity="0.5"
            stroke="#15803d"
            strokeWidth="1"
          />
          <text x="850" y="160" fill="#166534" fontSize="10" fontWeight="600">
            Hill Ridge / Forest Fringe Zone
          </text>

          {/* Road Infrastructure Lines */}
          <path d="M 0,270 L 460,290 L 750,280 L 1000,290" fill="none" stroke="#e2e8f0" strokeWidth="10" strokeLinecap="round" />
          <path d="M 0,270 L 460,290 L 750,280 L 1000,290" fill="none" stroke="#64748b" strokeWidth="1.5" strokeDasharray="5 5" />
          <text x="70" y="260" fill="#475569" fontSize="9" fontWeight="600">Shivapur-Saswad MDR Road</text>
        </svg>

        {/* Node Markers on Schematic Map */}
        {nodes.map((node) => {
          const colors = getStatusColor(node.status);
          const isSelected = node.id === selectedNodeId;
          const isRisk = node.status === 'RISK';

          return (
            <div
              key={node.id}
              onClick={() => onSelectNode(node.id)}
              style={{
                left: `${node.mapCoords.x}%`,
                top: `${node.mapCoords.y}%`,
                transform: 'translate(-50%, -50%)',
              }}
              className="absolute z-10 cursor-pointer group"
            >
              {/* Risk Pulse Glow */}
              {isRisk && (
                <div
                  className={`absolute -inset-3.5 rounded-full ${colors.pulse} opacity-40 animate-ping`}
                ></div>
              )}

              {/* Physical Node Live Ring Glow */}
              {node.isPrototype && (
                <div className="absolute -inset-3 rounded-full border-2 border-amber-400 opacity-80 animate-pulse"></div>
              )}

              {/* Selected Node Ring Halo */}
              {isSelected && (
                <div className="absolute -inset-2.5 rounded-full border-2 border-blue-900 bg-blue-900/10"></div>
              )}

              {/* Primary Node Pin Button */}
              <div
                className={`relative flex items-center justify-center w-8 h-8 rounded-full shadow-md transition-transform duration-150 group-hover:scale-110 ${
                  isSelected ? 'ring-2 ring-blue-900 ring-offset-2' : ''
                }`}
                style={{ backgroundColor: colors.fill }}
              >
                {node.isPrototype ? (
                  <Radio className="w-4 h-4 text-white animate-pulse" />
                ) : (
                  <span className="text-[11px] font-bold text-white font-mono">
                    {node.id.replace('NODE-0', '')}
                  </span>
                )}
              </div>

              {/* Node Label Card Floating on Map */}
              <div
                className={`absolute left-1/2 -translate-x-1/2 top-9 whitespace-nowrap px-2 py-1 rounded shadow-md border text-center transition-all ${
                  isSelected
                    ? 'bg-[#0f284e] text-white border-slate-900 z-30 scale-105'
                    : 'bg-white text-slate-800 border-slate-300 z-20 group-hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-center gap-1.5">
                  <span className="font-mono font-bold text-[11px]">{node.id}</span>
                  
                  {/* Physical Node Badge */}
                  {node.isPrototype && (
                    <span className="px-1 py-0.2 bg-amber-500 text-slate-950 font-extrabold text-[9px] rounded uppercase tracking-tight animate-pulse">
                      ● PHYSICAL
                    </span>
                  )}

                  {/* 3-Stage Indicator */}
                  <span
                    className={`text-[9px] px-1 py-0.2 rounded font-bold uppercase ${
                      node.status === 'SAFE'
                        ? 'bg-emerald-100 text-emerald-800'
                        : node.status === 'WATCH'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {node.status}
                  </span>
                </div>

                <div className={`text-[10px] font-medium truncate max-w-[130px] ${isSelected ? 'text-slate-200' : 'text-slate-600'}`}>
                  {node.name.split('/')[0]}
                </div>
              </div>
            </div>
          );
        })}

        {/* Selected Node Mini Snapshot Overlay in Bottom Left (ONLY 5 PARAMETERS) */}
        <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-xs border border-slate-300 rounded shadow-md p-2.5 max-w-xs z-20">
          <div className="flex items-center justify-between gap-2 border-b border-slate-200 pb-1.5 mb-1.5">
            <div className="flex items-center gap-1.5">
              <span className="font-mono font-bold text-xs text-blue-950">{selectedNode.id}</span>
              {selectedNode.isPrototype && (
                <span className="px-1.5 py-0.2 bg-amber-500 text-slate-950 font-bold text-[9px] rounded animate-pulse">
                  PHYSICAL NODE
                </span>
              )}
            </div>
            <span
              className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                selectedNode.status === 'SAFE'
                  ? 'bg-emerald-100 text-emerald-800'
                  : selectedNode.status === 'WATCH'
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {selectedNode.status}
            </span>
          </div>

          <div className="text-xs font-semibold text-slate-900">{selectedNode.name}</div>
          <div className="text-[11px] text-slate-500 mb-2">{selectedNode.zone}</div>

          <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[11px] font-mono">
            <div className="flex justify-between">
              <span className="text-slate-500 font-sans">Temp:</span>
              <span className="font-bold text-slate-800">{selectedNode.telemetry.temperature.toFixed(1)}°C</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 font-sans">Pressure:</span>
              <span className="font-bold text-slate-800">{selectedNode.telemetry.pressure.toFixed(1)} hPa</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 font-sans">Water:</span>
              <span className="font-bold text-slate-800">{selectedNode.telemetry.waterLevel.toFixed(1)} cm</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 font-sans">Moisture:</span>
              <span className="font-bold text-slate-800">{selectedNode.telemetry.soilMoisture.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between col-span-2">
              <span className="text-slate-500 font-sans">Vibration:</span>
              <span className="font-bold text-slate-800">{selectedNode.telemetry.vibration.toFixed(2)} mm/s</span>
            </div>
          </div>
        </div>
      </div>

      {/* Node Quick Switcher Ribbon (3 Stages) */}
      <div className="bg-slate-100 px-4 py-2 flex items-center justify-between overflow-x-auto gap-2 text-xs">
        <span className="font-semibold text-slate-600 text-[11px] uppercase tracking-wider flex-shrink-0">
          Node Selector:
        </span>
        <div className="flex items-center gap-1.5 flex-wrap">
          {nodes.map((node) => {
            const isSelected = node.id === selectedNodeId;
            return (
              <button
                key={node.id}
                type="button"
                onClick={() => onSelectNode(node.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs transition-all ${
                  isSelected
                    ? 'bg-blue-900 text-white font-bold shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-300 font-medium'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    node.status === 'SAFE'
                      ? 'bg-emerald-500'
                      : node.status === 'WATCH'
                      ? 'bg-amber-500'
                      : 'bg-red-500'
                  }`}
                ></span>
                <span className="font-mono">{node.id}</span>
                {node.isPrototype && (
                  <span className="text-[9px] bg-amber-400 text-slate-900 font-extrabold px-1 rounded">
                    PHYSICAL
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
